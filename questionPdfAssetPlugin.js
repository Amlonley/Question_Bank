(function initQuestionPdfAssetPlugin(global) {
  "use strict";

  const PDFJS_LIB_URL = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js";
  const PDFJS_WORKER_URL = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
  const DEFAULT_CROP_MAX_EDGE = 1600;

  const state = {
    sourceFile: null,
    sourceKind: "",
    sourceBytes: null,
    sourceImageElement: null,
    sourceImageBitmap: null,
    sourceImageObjectUrl: "",
    sourceImageMeta: null,
    sourceFingerprint: "",
    sourceMeta: null,
    sourceRevision: 0,
    attachRequestId: 0,
    pdfDocumentPromise: null,
    pdfJsPromise: null,
    renderCache: new Map(),
    objectUrls: new Set(),
    activeRenderTasks: new Set(),
    viewer: null,
    viewerCloseTimerId: 0
  };

  const hydrationTasks = new WeakMap();
  const hydrationPromises = new WeakMap();
  let hydrationObserver = null;

  function asText(value, fallback = "") {
    if (value === null || value === undefined) {
      return fallback;
    }
    return String(value);
  }

  function createPluginError(message, code = "") {
    const error = new Error(asText(message, "خطای ناشناخته"));
    if (code) {
      error.code = code;
    }
    return error;
  }

  function clampNumber(value, min, max, fallback) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return fallback;
    }
    return Math.min(max, Math.max(min, numeric));
  }

  function toFiniteNumber(value) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : NaN;
  }

  function parsePositiveInt(value) {
    const parsed = Number.parseInt(asText(value, "").trim(), 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return null;
    }
    return parsed;
  }

  function isMobileLikeViewport() {
    if (global.matchMedia && typeof global.matchMedia === "function") {
      try {
        if (global.matchMedia("(max-width: 1023px)").matches) {
          return true;
        }
      } catch {
        // Ignore matchMedia failures.
      }
    }
    const width = Number(global.innerWidth) || 0;
    return width > 0 && width <= 1023;
  }

  function getCaptionTextFromFigure(figure) {
    if (!(figure instanceof HTMLElement)) {
      return "";
    }
    const caption = figure.querySelector(".question-asset-caption");
    if (!(caption instanceof HTMLElement)) {
      return "";
    }
    return asText(caption.textContent, "").trim();
  }

  function classifyImageRatio(image) {
    if (!(image instanceof HTMLImageElement)) {
      return "";
    }
    const width = Number(image.naturalWidth) || Number(image.width) || 0;
    const height = Number(image.naturalHeight) || Number(image.height) || 0;
    if (width <= 0 || height <= 0) {
      return "";
    }
    const ratio = width / height;
    if (ratio >= 1.42) {
      return "wide";
    }
    if (ratio <= 0.78) {
      return "tall";
    }
    return "balanced";
  }

  function normalizeUnit(value) {
    const key = asText(value, "").trim().toLowerCase();
    if (!key) {
      return "";
    }
    if (["ratio", "normalized", "normal", "norm", "relative"].includes(key)) {
      return "ratio";
    }
    if (["percent", "percentage", "%"].includes(key)) {
      return "percent";
    }
    if (["px", "pixel", "pixels", "absolute"].includes(key)) {
      return "px";
    }
    return "";
  }

  function inferUnitFromBbox(bbox) {
    const safe = Array.isArray(bbox) ? bbox.map((item) => Number(item)) : [];
    if (safe.length < 4 || safe.some((item) => !Number.isFinite(item))) {
      return "px";
    }
    const maxAbs = Math.max(...safe.map((item) => Math.abs(item)));
    if (maxAbs <= 1.00001) {
      return "ratio";
    }
    if (maxAbs <= 100.00001) {
      return "percent";
    }
    return "px";
  }

  function parseBboxArrayLike(value) {
    if (Array.isArray(value)) {
      if (value.length < 4) {
        return null;
      }
      const coords = value.slice(0, 4).map((item) => toFiniteNumber(item));
      if (coords.some((item) => !Number.isFinite(item))) {
        return null;
      }
      return coords;
    }

    if (value && typeof value === "object") {
      const x1 =
        toFiniteNumber(value.x1 ?? value.left ?? value.x ?? value.minX ?? value.x_min ?? value.l ?? value.startX);
      const y1 =
        toFiniteNumber(value.y1 ?? value.top ?? value.y ?? value.minY ?? value.y_min ?? value.t ?? value.startY);
      const x2 =
        toFiniteNumber(value.x2 ?? value.right ?? value.maxX ?? value.x_max ?? value.r ?? value.endX);
      const y2 =
        toFiniteNumber(value.y2 ?? value.bottom ?? value.maxY ?? value.y_max ?? value.b ?? value.endY);
      const width = toFiniteNumber(value.w ?? value.width);
      const height = toFiniteNumber(value.h ?? value.height);

      if (Number.isFinite(x1) && Number.isFinite(y1) && Number.isFinite(x2) && Number.isFinite(y2)) {
        return [x1, y1, x2, y2];
      }
      if (Number.isFinite(x1) && Number.isFinite(y1) && Number.isFinite(width) && Number.isFinite(height)) {
        return [x1, y1, x1 + width, y1 + height];
      }
    }

    return null;
  }

  function normalizeBBox(value, unitHint = "") {
    const parsed = parseBboxArrayLike(value);
    if (!parsed) {
      return null;
    }
    const sorted = [
      Math.min(parsed[0], parsed[2]),
      Math.min(parsed[1], parsed[3]),
      Math.max(parsed[0], parsed[2]),
      Math.max(parsed[1], parsed[3])
    ];
    if (sorted[2] - sorted[0] <= 0 || sorted[3] - sorted[1] <= 0) {
      return null;
    }
    const unit = normalizeUnit(unitHint) || inferUnitFromBbox(sorted);
    return { bbox: sorted, unit };
  }

  function normalizeAssetMode(value) {
    const key = asText(value, "").trim().toLowerCase();
    if (!key) {
      return "";
    }
    if (["pdf-crop", "pdf_crop", "crop", "pdf"].includes(key)) {
      return "pdf-crop";
    }
    if (["url", "image-url", "image_url", "image"].includes(key)) {
      return "url";
    }
    return "";
  }

  function normalizeSingleAsset(entry, index) {
    if (!entry) {
      return null;
    }

    if (typeof entry === "string") {
      const src = entry.trim();
      if (!src) {
        return null;
      }
      return {
        id: `asset-${index + 1}`,
        type: "image",
        mode: "url",
        src,
        page: null,
        bbox: null,
        bboxUnit: "",
        marker: null,
        caption: "",
        alt: ""
      };
    }

    if (typeof entry !== "object" || Array.isArray(entry)) {
      return null;
    }

    const type = asText(entry.type ?? entry.kind ?? "image", "image").trim().toLowerCase();
    if (type && type !== "image") {
      return null;
    }

    const explicitMode = normalizeAssetMode(entry.mode ?? entry.sourceMode ?? entry.assetMode ?? entry.kind);
    const page = parsePositiveInt(entry.page ?? entry.pageNumber ?? entry.page_number ?? entry.pdf_page);
    const bboxCandidate = entry.bbox ?? entry.box ?? entry.rect ?? entry.crop ?? entry.region;
    const fallbackBboxCandidate =
      bboxCandidate ||
      ((entry.x !== undefined || entry.left !== undefined || entry.x1 !== undefined) &&
      (entry.y !== undefined || entry.top !== undefined || entry.y1 !== undefined)
        ? entry
        : null);

    const bboxInfo = normalizeBBox(fallbackBboxCandidate, entry.bboxUnit ?? entry.bbox_unit ?? entry.unit);
    const src = asText(entry.src ?? entry.url ?? entry.image ?? entry.imageUrl ?? entry.image_url, "").trim();
    const inferredMode = page && bboxInfo ? "pdf-crop" : src ? "url" : "";
    const mode = explicitMode || inferredMode;
    if (!mode) {
      return null;
    }

    const marker = parsePositiveInt(entry.marker ?? entry.slot ?? entry.index);
    const caption = asText(entry.caption ?? entry.title ?? entry.label, "").trim();
    const alt = asText(entry.alt ?? entry.description, "").trim();

    if (mode === "pdf-crop") {
      if (!page || !bboxInfo) {
        return null;
      }
      return {
        id: asText(entry.id, `asset-${index + 1}`) || `asset-${index + 1}`,
        type: "image",
        mode: "pdf-crop",
        src: "",
        page,
        bbox: bboxInfo.bbox,
        bboxUnit: bboxInfo.unit,
        marker: marker ? marker - 1 : null,
        caption,
        alt
      };
    }

    if (!src) {
      return null;
    }
    return {
      id: asText(entry.id, `asset-${index + 1}`) || `asset-${index + 1}`,
      type: "image",
      mode: "url",
      src,
      page: null,
      bbox: null,
      bboxUnit: "",
      marker: marker ? marker - 1 : null,
      caption,
      alt
    };
  }

  function normalizeAssetsFromQuestion(questionLike) {
    if (!questionLike || typeof questionLike !== "object") {
      return [];
    }

    const candidates = [];
    const arraySources = [
      questionLike.assets,
      questionLike.images,
      questionLike.figures,
      questionLike.media,
      questionLike.attachments,
      questionLike.question_assets,
      questionLike.questionAssets
    ];
    arraySources.forEach((source) => {
      if (Array.isArray(source)) {
        candidates.push(...source);
      }
    });

    const objectSources = [
      questionLike.asset,
      questionLike.imageAsset,
      questionLike.image_asset
    ];
    objectSources.forEach((source) => {
      if (source && typeof source === "object" && !Array.isArray(source)) {
        candidates.push(source);
      }
    });

    if (!candidates.length) {
      return [];
    }

    const normalized = [];
    candidates.forEach((entry, index) => {
      const next = normalizeSingleAsset(entry, index);
      if (next) {
        normalized.push(next);
      }
    });
    return normalized;
  }

  function splitQuestionTextByAssetMarker(sourceText) {
    const text = asText(sourceText, "");
    const markerPattern = /\[\[(?:img|image|fig|figure)\s*:\s*(\d+)\s*\]\]/gi;
    const tokens = [];
    let lastIndex = 0;
    let match = null;
    while ((match = markerPattern.exec(text))) {
      if (match.index > lastIndex) {
        tokens.push({ type: "text", value: text.slice(lastIndex, match.index) });
      }
      const markerIndex = parsePositiveInt(match[1]);
      tokens.push({
        type: "asset",
        index: markerIndex ? markerIndex - 1 : -1
      });
      lastIndex = markerPattern.lastIndex;
    }
    if (lastIndex < text.length) {
      tokens.push({ type: "text", value: text.slice(lastIndex) });
    }
    return tokens;
  }

  function getHydrationObserver() {
    if (!("IntersectionObserver" in global)) {
      return null;
    }
    if (hydrationObserver) {
      return hydrationObserver;
    }
    const rootMargin = isMobileLikeViewport() ? "340px 0px 340px 0px" : "240px 0px 240px 0px";
    hydrationObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          observer.unobserve(entry.target);
          void hydrateQueuedNode(entry.target);
        });
      },
      {
        root: null,
        rootMargin,
        threshold: 0.01
      }
    );
    return hydrationObserver;
  }

  function queueNodeHydration(node, task) {
    if (!(node instanceof HTMLElement) || typeof task !== "function") {
      return;
    }
    hydrationTasks.set(node, task);
    const observer = getHydrationObserver();
    if (observer) {
      observer.observe(node);
      return;
    }
    void hydrateQueuedNode(node);
  }

  async function hydrateQueuedNode(node) {
    if (!(node instanceof HTMLElement)) {
      return false;
    }
    const pendingPromise = hydrationPromises.get(node);
    if (pendingPromise && typeof pendingPromise.then === "function") {
      return pendingPromise;
    }

    const observer = hydrationObserver;
    if (observer) {
      observer.unobserve(node);
    }

    const task = hydrationTasks.get(node);
    if (typeof task !== "function") {
      return false;
    }
    hydrationTasks.delete(node);
    const promise = Promise.resolve()
      .then(() => task())
      .then(() => true)
      .catch(() => {
        // Keep the placeholder on failure.
        return false;
      })
      .finally(() => {
        hydrationPromises.delete(node);
      });
    hydrationPromises.set(node, promise);
    return promise;
  }

  function resolveHydrationRoot(root) {
    if (root instanceof Document) {
      return root;
    }
    if (root instanceof HTMLElement) {
      return root;
    }
    return null;
  }

  async function hydrateAssetsInRoot(root, options = {}) {
    const scope = resolveHydrationRoot(root) || document;
    const figures = Array.from(scope.querySelectorAll(".question-asset-figure")).filter(
      (node) => node instanceof HTMLElement
    );
    if (!figures.length) {
      return { total: 0, hydrated: 0, pending: 0 };
    }

    const targets = figures.filter(
      (figure) =>
        figure.classList.contains("is-loading") || hydrationTasks.has(figure) || hydrationPromises.has(figure)
    );
    if (!targets.length) {
      return { total: figures.length, hydrated: 0, pending: 0 };
    }

    const defaultConcurrency = isMobileLikeViewport() ? 2 : 3;
    const concurrency = clampNumber(options.concurrency, 1, 8, defaultConcurrency);
    let cursor = 0;
    let hydratedCount = 0;
    const workers = new Array(Math.min(concurrency, targets.length)).fill(null).map(async () => {
      while (true) {
        const nextIndex = cursor;
        cursor += 1;
        if (nextIndex >= targets.length) {
          return;
        }
        const node = targets[nextIndex];
        const hydrated = await hydrateQueuedNode(node);
        if (hydrated) {
          hydratedCount += 1;
        }
      }
    });

    await Promise.all(workers);
    const pending = targets.reduce(
      (count, node) => count + (hydrationTasks.has(node) || hydrationPromises.has(node) ? 1 : 0),
      0
    );
    return { total: figures.length, hydrated: hydratedCount, pending };
  }

  function getViewerState() {
    if (state.viewer && state.viewer.root instanceof HTMLElement && document.body?.contains(state.viewer.root)) {
      return state.viewer;
    }
    return null;
  }

  function closeAssetViewer() {
    const viewer = getViewerState();
    if (!viewer) {
      return;
    }

    if (state.viewerCloseTimerId) {
      global.clearTimeout(state.viewerCloseTimerId);
      state.viewerCloseTimerId = 0;
    }

    viewer.root.classList.remove("is-open");
    viewer.root.setAttribute("aria-hidden", "true");
    document.body?.classList.remove("question-asset-viewer-open");
    state.viewerCloseTimerId = global.setTimeout(() => {
      viewer.root.hidden = true;
      viewer.image.removeAttribute("src");
      viewer.image.alt = "";
      viewer.caption.textContent = "";
      viewer.caption.hidden = true;
      state.viewerCloseTimerId = 0;
    }, 190);
  }

  function onAssetViewerKeydown(event) {
    if (!event || event.key !== "Escape") {
      return;
    }
    closeAssetViewer();
  }

  function ensureAssetViewer() {
    const existing = getViewerState();
    if (existing) {
      return existing;
    }
    if (!(document.body instanceof HTMLElement)) {
      return null;
    }

    const root = document.createElement("section");
    root.className = "question-asset-viewer";
    root.hidden = true;
    root.setAttribute("aria-hidden", "true");

    const backdrop = document.createElement("button");
    backdrop.type = "button";
    backdrop.className = "question-asset-viewer-backdrop";
    backdrop.setAttribute("aria-label", "بستن نمایش تصویر");

    const card = document.createElement("figure");
    card.className = "question-asset-viewer-card";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-modal", "true");
    card.setAttribute("aria-label", "نمایش تصویر سوال");

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "question-asset-viewer-close";
    closeButton.setAttribute("aria-label", "بستن");
    closeButton.textContent = "×";

    const image = document.createElement("img");
    image.className = "question-asset-viewer-image";
    image.decoding = "async";
    image.loading = "eager";
    image.draggable = false;

    const caption = document.createElement("figcaption");
    caption.className = "question-asset-viewer-caption";
    caption.hidden = true;

    card.append(closeButton, image, caption);
    root.append(backdrop, card);
    document.body.append(root);

    backdrop.addEventListener("click", closeAssetViewer);
    closeButton.addEventListener("click", closeAssetViewer);

    const viewer = {
      root,
      image,
      caption,
      closeButton
    };
    state.viewer = viewer;

    if (typeof global.addEventListener === "function") {
      global.addEventListener("keydown", onAssetViewerKeydown);
    }

    return viewer;
  }

  function openAssetViewer(payload = {}) {
    const viewer = ensureAssetViewer();
    if (!viewer) {
      return;
    }
    const src = asText(payload.src, "").trim();
    if (!src) {
      return;
    }

    if (state.viewerCloseTimerId) {
      global.clearTimeout(state.viewerCloseTimerId);
      state.viewerCloseTimerId = 0;
    }

    viewer.image.src = src;
    viewer.image.alt = asText(payload.alt, "").trim() || "نمایش بزرگ تصویر سوال";
    const captionText = asText(payload.caption, "").trim();
    viewer.caption.textContent = captionText;
    viewer.caption.hidden = !captionText;

    viewer.root.hidden = false;
    viewer.root.setAttribute("aria-hidden", "false");
    document.body?.classList.add("question-asset-viewer-open");

    if (typeof global.requestAnimationFrame === "function") {
      global.requestAnimationFrame(() => {
        viewer.root.classList.add("is-open");
      });
    } else {
      viewer.root.classList.add("is-open");
    }

    try {
      viewer.closeButton.focus({ preventScroll: true });
    } catch {
      viewer.closeButton.focus();
    }
  }

  function enhanceImageInteractivity(figure, image) {
    if (!(figure instanceof HTMLElement) || !(image instanceof HTMLImageElement)) {
      return;
    }
    const captionText = getCaptionTextFromFigure(figure);
    const openViewer = () => {
      openAssetViewer({
        src: asText(image.currentSrc || image.src, "").trim(),
        alt: image.alt,
        caption: captionText
      });
    };

    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", "نمایش بزرگ تصویر سوال");
    image.addEventListener("click", openViewer);
    image.addEventListener("keydown", (event) => {
      if (!event) {
        return;
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openViewer();
      }
    });

    const hint = document.createElement("span");
    hint.className = "question-asset-zoom-hint";
    hint.textContent = "بزرگ‌نمایی";
    const media = figure.querySelector(".question-asset-media");
    if (media instanceof HTMLElement) {
      media.append(hint);
    }
  }

  function setFigureError(figure, message, withSelectButton = false) {
    if (!(figure instanceof HTMLElement)) {
      return;
    }
    figure.classList.remove("is-loading", "is-ready");
    figure.classList.add("is-error");
    delete figure.dataset.assetRatio;
    const media = figure.querySelector(".question-asset-media");
    if (!(media instanceof HTMLElement)) {
      return;
    }
    media.innerHTML = "";

    const fallback = document.createElement("div");
    fallback.className = "question-asset-fallback";
    fallback.textContent = asText(message, "نمایش تصویر ممکن نیست.");
    media.append(fallback);

    if (withSelectButton) {
      const action = document.createElement("button");
      action.type = "button";
      action.className = "question-asset-source-btn";
      action.dataset.action = "open-question-pdf-source";
      action.textContent = "انتخاب فایل مرجع";
      media.append(action);
    }
  }

  function attachImageToFigure(figure, src, alt = "") {
    if (!(figure instanceof HTMLElement)) {
      return;
    }
    const media = figure.querySelector(".question-asset-media");
    if (!(media instanceof HTMLElement)) {
      return;
    }
    figure.classList.remove("is-error", "is-ready");
    figure.classList.add("is-loading");
    media.innerHTML = "";

    const image = document.createElement("img");
    image.className = "question-asset-image";
    image.loading = "lazy";
    image.decoding = "async";
    image.draggable = false;
    image.alt = alt || "تصویر مرتبط با سوال";

    const handleLoaded = () => {
      figure.classList.remove("is-loading");
      figure.classList.add("is-ready");
      const ratioLabel = classifyImageRatio(image);
      if (ratioLabel) {
        figure.dataset.assetRatio = ratioLabel;
      } else {
        delete figure.dataset.assetRatio;
      }
    };
    image.addEventListener("load", handleLoaded, { once: true });

    image.addEventListener("error", () => {
      setFigureError(figure, "بارگذاری تصویر ناموفق بود.");
    });

    image.src = src;
    media.append(image);
    enhanceImageInteractivity(figure, image);

    if (image.complete && image.naturalWidth > 0) {
      handleLoaded();
    }
  }

  function toPxRectFromAsset(asset, pageWidth, pageHeight) {
    if (!asset || !Array.isArray(asset.bbox) || asset.bbox.length < 4) {
      return null;
    }
    const [x1, y1, x2, y2] = asset.bbox.map((item) => Number(item));
    if ([x1, y1, x2, y2].some((item) => !Number.isFinite(item))) {
      return null;
    }

    let left = x1;
    let top = y1;
    let right = x2;
    let bottom = y2;

    if (asset.bboxUnit === "ratio") {
      left *= pageWidth;
      top *= pageHeight;
      right *= pageWidth;
      bottom *= pageHeight;
    } else if (asset.bboxUnit === "percent") {
      left = (left / 100) * pageWidth;
      top = (top / 100) * pageHeight;
      right = (right / 100) * pageWidth;
      bottom = (bottom / 100) * pageHeight;
    }

    left = clampNumber(left, 0, pageWidth, 0);
    top = clampNumber(top, 0, pageHeight, 0);
    right = clampNumber(right, 0, pageWidth, pageWidth);
    bottom = clampNumber(bottom, 0, pageHeight, pageHeight);

    const width = Math.max(1, right - left);
    const height = Math.max(1, bottom - top);
    if (width < 2 || height < 2) {
      return null;
    }
    return { left, top, width, height };
  }

  function loadScriptOnce(id, src) {
    const existing = document.getElementById(id);
    if (existing instanceof HTMLScriptElement) {
      if (existing.dataset.loaded === "1") {
        return Promise.resolve();
      }
      if (existing.dataset.loading === "1") {
        return new Promise((resolve, reject) => {
          existing.addEventListener("load", () => resolve(), { once: true });
          existing.addEventListener("error", () => reject(new Error(`Script load failed: ${src}`)), { once: true });
        });
      }
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.id = id;
      script.src = src;
      script.async = true;
      script.defer = true;
      script.dataset.loading = "1";
      script.addEventListener(
        "load",
        () => {
          script.dataset.loading = "0";
          script.dataset.loaded = "1";
          resolve();
        },
        { once: true }
      );
      script.addEventListener(
        "error",
        () => {
          script.dataset.loading = "0";
          reject(new Error(`Script load failed: ${src}`));
        },
        { once: true }
      );
      document.head.append(script);
    });
  }

  async function ensurePdfJs() {
    if (global.pdfjsLib && typeof global.pdfjsLib.getDocument === "function") {
      global.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
      return global.pdfjsLib;
    }
    if (state.pdfJsPromise) {
      return state.pdfJsPromise;
    }
    state.pdfJsPromise = loadScriptOnce("question-pdfjs-script", PDFJS_LIB_URL)
      .then(() => {
        if (!(global.pdfjsLib && typeof global.pdfjsLib.getDocument === "function")) {
          throw new Error("PDF.js آماده نیست.");
        }
        global.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
        return global.pdfjsLib;
      })
      .catch((error) => {
        state.pdfJsPromise = null;
        throw error;
      });
    return state.pdfJsPromise;
  }

  function buildSourceFingerprint(file) {
    return [asText(file?.name, "").trim(), String(file?.size || 0), String(file?.lastModified || 0)].join("|");
  }

  function detectSourceKind(file) {
    const fileName = asText(file?.name, "").trim().toLowerCase();
    const fileType = asText(file?.type, "").trim().toLowerCase();
    if (fileType.includes("pdf") || fileName.endsWith(".pdf")) {
      return "pdf";
    }
    if (
      fileType.startsWith("image/") ||
      fileName.endsWith(".png") ||
      fileName.endsWith(".jpg") ||
      fileName.endsWith(".jpeg")
    ) {
      return "image";
    }
    return "";
  }

  function loadImageElementFromObjectUrl(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.decoding = "async";
      image.loading = "eager";
      image.referrerPolicy = "no-referrer";
      image.addEventListener(
        "load",
        () => {
          const width = Number(image.naturalWidth) || 0;
          const height = Number(image.naturalHeight) || 0;
          if (width <= 0 || height <= 0) {
            reject(new Error("ابعاد تصویر مرجع نامعتبر است."));
            return;
          }
          resolve(image);
        },
        { once: true }
      );
      image.addEventListener("error", () => reject(new Error("بارگذاری تصویر مرجع ناموفق بود.")), { once: true });
      image.src = url;
    });
  }

  async function createImageBitmapFromFile(file) {
    if (!(file instanceof Blob) || typeof global.createImageBitmap !== "function") {
      return null;
    }
    try {
      return await global.createImageBitmap(file, {
        imageOrientation: "from-image"
      });
    } catch {
      try {
        return await global.createImageBitmap(file);
      } catch {
        return null;
      }
    }
  }

  function clearSourceImageState() {
    if (state.sourceImageElement instanceof HTMLImageElement) {
      state.sourceImageElement.removeAttribute("src");
    }
    state.sourceImageElement = null;
    if (state.sourceImageBitmap && typeof state.sourceImageBitmap.close === "function") {
      try {
        state.sourceImageBitmap.close();
      } catch {
        // Ignore bitmap cleanup errors.
      }
    }
    state.sourceImageBitmap = null;
    state.sourceImageMeta = null;
    if (state.sourceImageObjectUrl) {
      try {
        URL.revokeObjectURL(state.sourceImageObjectUrl);
      } catch {
        // Ignore object URL cleanup errors.
      }
    }
    state.sourceImageObjectUrl = "";
  }

  async function ensurePdfDocument() {
    if (state.sourceKind && state.sourceKind !== "pdf") {
      throw new Error("منبع مرجع از نوع PDF نیست.");
    }
    if (!state.sourceBytes || !state.sourceBytes.length) {
      throw new Error("فایل مرجع انتخاب نشده است.");
    }
    if (state.pdfDocumentPromise) {
      return state.pdfDocumentPromise;
    }
    state.pdfDocumentPromise = (async () => {
      const pdfjsLib = await ensurePdfJs();
      const loadingTask = pdfjsLib.getDocument({
        data: state.sourceBytes,
        useWorkerFetch: true,
        isEvalSupported: false
      });
      return loadingTask.promise;
    })();
    return state.pdfDocumentPromise;
  }

  function ensureImageSource() {
    if (state.sourceKind && state.sourceKind !== "image") {
      throw new Error("منبع مرجع از نوع تصویر نیست.");
    }
    const image = state.sourceImageElement;
    if (!(image instanceof HTMLImageElement)) {
      throw new Error("تصویر مرجع انتخاب نشده است.");
    }
    const bitmap = state.sourceImageBitmap && typeof state.sourceImageBitmap === "object" ? state.sourceImageBitmap : null;
    const width =
      Number(state.sourceImageMeta?.width) ||
      Number(bitmap?.width) ||
      Number(image.naturalWidth) ||
      Number(image.width) ||
      0;
    const height =
      Number(state.sourceImageMeta?.height) ||
      Number(bitmap?.height) ||
      Number(image.naturalHeight) ||
      Number(image.height) ||
      0;
    if (width <= 0 || height <= 0) {
      throw new Error("ابعاد تصویر مرجع نامعتبر است.");
    }
    return { image, bitmap, width, height };
  }

  function cancelActiveRenderTasks() {
    state.activeRenderTasks.forEach((entry) => {
      if (!entry || typeof entry.cancel !== "function") {
        return;
      }
      try {
        entry.cancel();
      } catch {
        // Ignore cancellation failures.
      }
    });
    state.activeRenderTasks.clear();
  }

  function clearCachedRenders() {
    const urls = Array.from(state.objectUrls);
    state.renderCache.clear();
    urls.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch {
        // Ignore URL cleanup errors.
      }
    });
    state.objectUrls.clear();
    return urls.length;
  }

  function resetRenderedPdfCropFigures(root = document) {
    const scope = root instanceof Document || root instanceof HTMLElement ? root : document;
    const figures = Array.from(scope.querySelectorAll('.question-asset-figure[data-asset-mode="pdf-crop"]')).filter(
      (node) => node instanceof HTMLElement
    );
    figures.forEach((figure) => {
      setFigureError(figure, "برای این سوال فایل مرجع انتخاب نشده است.", true);
    });
    return figures.length;
  }

  async function attachSourcePdfFile(file) {
    if (!(file instanceof File)) {
      throw new Error("فایل مرجع معتبر نیست.");
    }
    const requestId = state.attachRequestId + 1;
    state.attachRequestId = requestId;
    const fileName = asText(file.name, "").trim();
    const sourceKind = detectSourceKind(file);
    if (!sourceKind) {
      throw new Error("فرمت فایل مرجع باید PDF یا PNG/JPEG باشد.");
    }

    if (sourceKind === "image") {
      const previousPromise = state.pdfDocumentPromise;
      const objectUrl = URL.createObjectURL(file);
      let image = null;
      let bitmap = null;
      try {
        image = await loadImageElementFromObjectUrl(objectUrl);
        bitmap = await createImageBitmapFromFile(file);
        if (requestId !== state.attachRequestId) {
          image.removeAttribute("src");
          if (bitmap && typeof bitmap.close === "function") {
            try {
              bitmap.close();
            } catch {
              // Ignore bitmap cleanup errors.
            }
          }
          URL.revokeObjectURL(objectUrl);
          throw createPluginError("بارگذاری فایل مرجع منسوخ شد.", "PDF_ATTACH_STALE");
        }

        const imageWidth = Number(image.naturalWidth) || 0;
        const imageHeight = Number(image.naturalHeight) || 0;
        const cropWidth = Number(bitmap?.width) || imageWidth;
        const cropHeight = Number(bitmap?.height) || imageHeight;
        const sourceMeta = {
          name: fileName || "source-image",
          size: Number(file.size) || 0,
          pages: 1,
          kind: "image",
          width: cropWidth,
          height: cropHeight
        };

        state.sourceRevision += 1;
        closeAssetViewer();
        cancelActiveRenderTasks();
        clearCachedRenders();
        clearSourceImageState();

        state.sourceFile = file;
        state.sourceKind = "image";
        state.sourceBytes = null;
        state.sourceImageElement = image;
        state.sourceImageBitmap = bitmap;
        state.sourceImageObjectUrl = objectUrl;
        state.sourceImageMeta = {
          width: cropWidth,
          height: cropHeight
        };
        state.sourceFingerprint = buildSourceFingerprint(file);
        state.sourceMeta = sourceMeta;
        state.pdfDocumentPromise = null;

        if (previousPromise && typeof previousPromise.then === "function") {
          previousPromise
            .then((doc) => {
              if (doc && typeof doc.destroy === "function") {
                return doc.destroy();
              }
              return null;
            })
            .catch(() => {});
        }

        return {
          attached: true,
          ...sourceMeta
        };
      } catch (error) {
        if (bitmap && typeof bitmap.close === "function" && state.sourceImageBitmap !== bitmap) {
          try {
            bitmap.close();
          } catch {
            // Ignore bitmap cleanup errors.
          }
        }
        if (state.sourceImageObjectUrl !== objectUrl) {
          try {
            URL.revokeObjectURL(objectUrl);
          } catch {
            // Ignore object URL cleanup errors.
          }
        }
        throw error;
      }
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const pdfjsLib = await ensurePdfJs();
    const loadingTask = pdfjsLib.getDocument({
      data: bytes,
      useWorkerFetch: true,
      isEvalSupported: false
    });
    let documentProxy = null;
    try {
      documentProxy = await loadingTask.promise;
    } catch (error) {
      try {
        await loadingTask.destroy();
      } catch {
        // ignore loader cleanup errors
      }
      throw error;
    }

    if (requestId !== state.attachRequestId) {
      try {
        if (documentProxy && typeof documentProxy.destroy === "function") {
          await documentProxy.destroy();
        } else {
          await loadingTask.destroy();
        }
      } catch {
        // ignore cleanup failures for stale attachment
      }
      throw createPluginError("بارگذاری فایل مرجع منسوخ شد.", "PDF_ATTACH_STALE");
    }

    const previousPromise = state.pdfDocumentPromise;
    const sourceMeta = {
      name: fileName || "source.pdf",
      size: Number(file.size) || bytes.byteLength,
      pages: Number(documentProxy?.numPages) || 0,
      kind: "pdf"
    };
    state.sourceRevision += 1;
    closeAssetViewer();
    cancelActiveRenderTasks();
    clearCachedRenders();
    clearSourceImageState();

    state.sourceFile = file;
    state.sourceKind = "pdf";
    state.sourceBytes = bytes;
    state.sourceFingerprint = buildSourceFingerprint(file);
    state.sourceMeta = sourceMeta;
    state.pdfDocumentPromise = Promise.resolve(documentProxy);

    if (previousPromise && previousPromise !== state.pdfDocumentPromise && typeof previousPromise.then === "function") {
      previousPromise
        .then((doc) => {
          if (doc && doc !== documentProxy && typeof doc.destroy === "function") {
            return doc.destroy();
          }
          return null;
        })
        .catch(() => {});
    }

    return {
      attached: true,
      ...sourceMeta
    };
  }

  function clearSourcePdfFile() {
    const currentPromise = state.pdfDocumentPromise;
    const releasedSourceBytes = Number(state.sourceMeta?.size) || Number(state.sourceBytes?.length) || 0;
    state.attachRequestId += 1;
    state.sourceRevision += 1;
    closeAssetViewer();
    cancelActiveRenderTasks();
    clearSourceImageState();
    state.sourceFile = null;
    state.sourceKind = "";
    state.sourceBytes = null;
    state.sourceFingerprint = "";
    state.sourceMeta = null;
    state.pdfDocumentPromise = null;
    const revokedObjectUrls = clearCachedRenders();
    const resetFigureCount = resetRenderedPdfCropFigures(document);

    if (currentPromise && typeof currentPromise.then === "function") {
      currentPromise
        .then((doc) => {
          if (doc && typeof doc.destroy === "function") {
            return doc.destroy();
          }
          return null;
        })
        .catch(() => {});
    }

    return {
      releasedSourceBytes,
      revokedObjectUrls,
      resetFigureCount
    };
  }

  function getSourceSummary() {
    if (!state.sourceMeta) {
      return {
        attached: false,
        name: "",
        kind: "",
        pages: 0,
        size: 0,
        width: 0,
        height: 0
      };
    }
    return {
      attached: true,
      ...state.sourceMeta
    };
  }

  async function renderCropToObjectUrl(asset, sourceRevision = state.sourceRevision) {
    const key = [
      String(sourceRevision),
      state.sourceFingerprint,
      asText(asset.page, ""),
      asText(asset.bboxUnit, ""),
      (asset.bbox || []).join(",")
    ].join("|");
    const cached = state.renderCache.get(key);
    if (cached && typeof cached.then === "function") {
      return cached;
    }

    const renderPromise = (async () => {
      if (sourceRevision !== state.sourceRevision || !state.sourceMeta) {
        throw createPluginError("منبع فایل مرجع تغییر کرده است.", "PDF_SOURCE_STALE");
      }
      const sourceKind = asText(state.sourceMeta?.kind, state.sourceKind || "pdf").trim().toLowerCase() || "pdf";

      const dpr = clampNumber(global.devicePixelRatio || 1, 1, 2, 1);
      let canvas = null;
      if (sourceKind === "image") {
        const imageSource = ensureImageSource();
        const rect = toPxRectFromAsset(asset, imageSource.width, imageSource.height);
        if (!rect) {
          throw new Error("مختصات bbox نامعتبر است.");
        }

        const baseScale = Math.max(1, Math.min(3, DEFAULT_CROP_MAX_EDGE / Math.max(rect.width, rect.height)));
        const scale = baseScale * dpr;
        canvas = document.createElement("canvas");
        canvas.width = Math.max(2, Math.round(rect.width * scale));
        canvas.height = Math.max(2, Math.round(rect.height * scale));
        const context = canvas.getContext("2d", { alpha: false });
        if (!context) {
          throw new Error("Canvas context در دسترس نیست.");
        }
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
        const drawable = imageSource.bitmap || imageSource.image;
        context.drawImage(
          drawable,
          rect.left,
          rect.top,
          rect.width,
          rect.height,
          0,
          0,
          canvas.width,
          canvas.height
        );
      } else {
        if (!state.sourceBytes?.length) {
          throw createPluginError("فایل مرجع انتخاب نشده است.", "PDF_SOURCE_STALE");
        }
        const doc = await ensurePdfDocument();
        if (sourceRevision !== state.sourceRevision || !state.sourceMeta) {
          throw createPluginError("منبع فایل مرجع تغییر کرده است.", "PDF_SOURCE_STALE");
        }
        const pageNumber = clampNumber(asset.page, 1, Math.max(1, Number(doc.numPages) || 1), 1);
        const page = await doc.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1 });
        const rect = toPxRectFromAsset(asset, viewport.width, viewport.height);
        if (!rect) {
          throw new Error("مختصات bbox نامعتبر است.");
        }

        const baseScale = Math.max(1, Math.min(3, DEFAULT_CROP_MAX_EDGE / Math.max(rect.width, rect.height)));
        const scale = baseScale * dpr;
        canvas = document.createElement("canvas");
        canvas.width = Math.max(2, Math.round(rect.width * scale));
        canvas.height = Math.max(2, Math.round(rect.height * scale));
        const context = canvas.getContext("2d", { alpha: false });
        if (!context) {
          throw new Error("Canvas context در دسترس نیست.");
        }
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";

        const scaledViewport = page.getViewport({ scale });
        const renderTask = page.render({
          canvasContext: context,
          viewport: scaledViewport,
          transform: [1, 0, 0, 1, -rect.left * scale, -rect.top * scale]
        });
        const activeTask = {
          cancel: () => {
            try {
              renderTask.cancel();
            } catch {
              // Ignore PDF render cancellation errors.
            }
          }
        };
        state.activeRenderTasks.add(activeTask);
        try {
          await renderTask.promise;
        } catch (error) {
          if (asText(error?.name, "") === "RenderingCancelledException") {
            throw createPluginError("رندر تصویر لغو شد.", "PDF_RENDER_CANCELLED");
          }
          throw error;
        } finally {
          state.activeRenderTasks.delete(activeTask);
        }
      }

      if (!(canvas instanceof HTMLCanvasElement)) {
        throw new Error("ساخت خروجی تصویر ناموفق بود.");
      }

      if (sourceRevision !== state.sourceRevision || !state.sourceMeta) {
        throw createPluginError("منبع فایل مرجع تغییر کرده است.", "PDF_SOURCE_STALE");
      }

      try {
        const blob = await new Promise((resolve) => {
          canvas.toBlob((value) => resolve(value), "image/webp", 0.92);
        });
        const safeBlob =
          blob ||
          (await new Promise((resolve) => {
            canvas.toBlob((value) => resolve(value), "image/png");
          }));
        if (!(safeBlob instanceof Blob)) {
          throw new Error("خروجی تصویر قابل ایجاد نیست.");
        }

        const url = URL.createObjectURL(safeBlob);
        if (sourceRevision !== state.sourceRevision || !state.sourceMeta) {
          URL.revokeObjectURL(url);
          throw createPluginError("منبع فایل مرجع تغییر کرده است.", "PDF_SOURCE_STALE");
        }
        state.objectUrls.add(url);
        return url;
      } finally {
        canvas.width = 1;
        canvas.height = 1;
      }
    })()
      .catch((error) => {
        state.renderCache.delete(key);
        throw error;
      });

    state.renderCache.set(key, renderPromise);
    return renderPromise;
  }

  function createAssetFigure(asset, index) {
    const figure = document.createElement("figure");
    figure.className = "question-asset-figure is-loading";
    figure.dataset.assetMode = asset.mode;
    figure.dataset.assetIndex = String(index + 1);

    const media = document.createElement("div");
    media.className = "question-asset-media";
    const shimmer = document.createElement("div");
    shimmer.className = "question-asset-shimmer";
    media.append(shimmer);

    figure.append(media);

    if (asset.caption) {
      const caption = document.createElement("figcaption");
      caption.className = "question-asset-caption";
      caption.textContent = asset.caption;
      figure.append(caption);
    }

    queueNodeHydration(figure, async () => {
      if (asset.mode === "url") {
        attachImageToFigure(figure, asset.src, asset.alt);
        return;
      }
      if (!getSourceSummary().attached) {
        setFigureError(figure, "برای این سوال فایل مرجع انتخاب نشده است.", true);
        return;
      }
      const expectedRevision = state.sourceRevision;
      try {
        const objectUrl = await renderCropToObjectUrl(asset, expectedRevision);
        if (!getSourceSummary().attached || expectedRevision !== state.sourceRevision) {
          setFigureError(figure, "برای این سوال فایل مرجع انتخاب نشده است.", true);
          return;
        }
        attachImageToFigure(figure, objectUrl, asset.alt);
      } catch (error) {
        const errorCode = asText(error?.code, "");
        if (errorCode === "PDF_SOURCE_STALE" || errorCode === "PDF_RENDER_CANCELLED") {
          if (!getSourceSummary().attached) {
            setFigureError(figure, "برای این سوال فایل مرجع انتخاب نشده است.", true);
          }
          return;
        }
        setFigureError(figure, asText(error?.message, "برش تصویر از فایل مرجع ناموفق بود."));
      }
    });

    return figure;
  }

  function appendTextFragment(bodyElement, text, buildRichTextFragment) {
    const safeText = asText(text, "");
    if (!safeText && safeText !== "") {
      return;
    }
    if (typeof buildRichTextFragment !== "function") {
      const line = document.createElement("p");
      line.className = "text-line";
      line.textContent = safeText;
      bodyElement.append(line);
      return;
    }
    bodyElement.append(buildRichTextFragment(safeText));
  }

  function renderQuestionBodyWithAssets(options = {}) {
    const bodyElement = options.bodyElement;
    if (!(bodyElement instanceof HTMLElement)) {
      return { renderedAssets: 0 };
    }

    const question = options.question && typeof options.question === "object" ? options.question : {};
    const buildRichTextFragment = options.buildRichTextFragment;
    const questionText = asText(question.question, asText(question.question_text, ""));
    const assets = normalizeAssetsFromQuestion(question);

    if (!assets.length) {
      appendTextFragment(bodyElement, questionText, buildRichTextFragment);
      return { renderedAssets: 0 };
    }

    const tokens = splitQuestionTextByAssetMarker(questionText);
    const hasMarkerTokens = tokens.some((token) => token.type === "asset");
    const consumed = new Set();

    if (hasMarkerTokens) {
      tokens.forEach((token) => {
        if (token.type === "text") {
          if (token.value) {
            appendTextFragment(bodyElement, token.value, buildRichTextFragment);
          }
          return;
        }

        const markerIndex = Number.isFinite(token.index) ? token.index : -1;
        const targetAsset = assets[markerIndex];
        if (!targetAsset) {
          return;
        }
        consumed.add(markerIndex);
        bodyElement.append(createAssetFigure(targetAsset, markerIndex));
      });

      const remainingAssets = assets.filter((_, index) => !consumed.has(index));
      if (remainingAssets.length) {
        const stack = document.createElement("div");
        stack.className = "question-asset-stack";
        remainingAssets.forEach((asset) => {
          const originalIndex = assets.indexOf(asset);
          stack.append(createAssetFigure(asset, originalIndex >= 0 ? originalIndex : 0));
        });
        bodyElement.append(stack);
      }
      return { renderedAssets: assets.length };
    }

    const stack = document.createElement("div");
    stack.className = "question-asset-stack";
    assets.forEach((asset, index) => {
      stack.append(createAssetFigure(asset, index));
    });
    bodyElement.append(stack);
    appendTextFragment(bodyElement, questionText, buildRichTextFragment);
    return { renderedAssets: assets.length };
  }

  global.QuestionPdfAssetPlugin = {
    version: "1.5.1",
    attachSourcePdfFile,
    clearSourcePdfFile,
    getSourceSummary,
    normalizeAssetsFromQuestion,
    renderQuestionBodyWithAssets,
    hydrateAssetsInRoot
  };
})(window);
