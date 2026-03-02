(() => {
  "use strict";

  const treeResizeBindings = new WeakMap();

  function fallbackAsText(value, fallback = "") {
    if (typeof value === "string") {
      return value;
    }
    if (value === null || value === undefined) {
      return fallback;
    }
    return String(value);
  }

  function fallbackClamp(value, min, max, fallback = min) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return fallback;
    }
    return Math.min(max, Math.max(min, numeric));
  }

  function resolveTreeChildren(chapter) {
    if (Array.isArray(chapter?.tree)) {
      return chapter.tree;
    }
    if (Array.isArray(chapter?.children)) {
      return chapter.children;
    }
    if (Array.isArray(chapter?.nodes)) {
      return chapter.nodes;
    }
    if (Array.isArray(chapter?.items)) {
      return chapter.items;
    }
    if (Array.isArray(chapter?.branches)) {
      return chapter.branches;
    }
    if (Array.isArray(chapter?.chapters)) {
      return chapter.chapters;
    }
    return [];
  }

  function resolveNumericMetaValue(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return NaN;
    }
    return Math.max(0, Math.round(numeric));
  }

  function disconnectTreeResizeObserver(canvas) {
    const binding = treeResizeBindings.get(canvas);
    if (!binding) {
      return;
    }
    try {
      binding.observer.disconnect();
    } catch {
      // no-op
    }
    if (typeof binding.cancel === "function") {
      binding.cancel();
    }
    treeResizeBindings.delete(canvas);
  }

  function connectTreeResizeObserver(canvas, onResize) {
    disconnectTreeResizeObserver(canvas);
    if (!(canvas instanceof HTMLElement) || typeof onResize !== "function" || typeof ResizeObserver !== "function") {
      return;
    }

    let rafId = 0;
    let lastWidth = Math.round(canvas.clientWidth || 0);
    let lastHeight = Math.round(canvas.clientHeight || 0);

    const schedule = () => {
      if (rafId) {
        return;
      }
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        if (!canvas.isConnected) {
          return;
        }
        const nextWidth = Math.round(canvas.clientWidth || 0);
        const nextHeight = Math.round(canvas.clientHeight || 0);
        const widthChanged = Math.abs(nextWidth - lastWidth) >= 3;
        const heightThreshold = nextWidth === lastWidth ? 110 : 24;
        const heightChanged = Math.abs(nextHeight - lastHeight) >= heightThreshold;
        if (!widthChanged && !heightChanged) {
          return;
        }
        lastWidth = nextWidth;
        lastHeight = nextHeight;
        try {
          onResize();
        } catch (error) {
          console.error("Chapter tree resize render failed:", error);
          disconnectTreeResizeObserver(canvas);
        }
      });
    };

    const observer = new ResizeObserver(() => {
      schedule();
    });

    observer.observe(canvas);
    if (canvas.parentElement instanceof HTMLElement) {
      observer.observe(canvas.parentElement);
    }

    treeResizeBindings.set(canvas, {
      observer,
      cancel: () => {
        if (rafId) {
          window.cancelAnimationFrame(rafId);
          rafId = 0;
        }
      }
    });
  }

  function render(payload = {}) {
    const {
      canvas,
      d3,
      subject,
      chapters,
      activeChapterId = "",
      legendItems = [],
      mobileViewport = false,
      createId = () => `tree-${Date.now()}`,
      asText = fallbackAsText,
      splitLabelForMap = fallbackAsText,
      normalizeLookupKey = (value) => fallbackAsText(value, "").toLowerCase().trim(),
      getChapterNeedsReviewCount = () => 0,
      clampNumber = fallbackClamp,
      treeOnlyMode = false,
      lowPowerMode = false,
      fxEnabled = true,
      collapseState = new Set(),
      onCollapseStateChanged = () => {},
      onNavigate = () => {},
      onRerender = () => {}
    } = payload;

    if (!(canvas instanceof HTMLElement) || !d3 || typeof d3.hierarchy !== "function") {
      return null;
    }

    disconnectTreeResizeObserver(canvas);

    const chapterList = Array.isArray(chapters) ? chapters : [];
    const lowPower = !!lowPowerMode;
    const heavyTree = chapterList.length >= 24;
    const shouldAnimate = !mobileViewport && !lowPower && !heavyTree;
    const shouldRenderMinimap = false;
    const effectiveFx = fxEnabled !== false && !lowPower && !heavyTree;
    const premiumFxEnabled = effectiveFx && !heavyTree;
    const chapterLookup = new Map();
    chapterList.forEach((chapter) => {
      const id = asText(chapter?.id, "").trim();
      if (id) {
        chapterLookup.set(id, chapter);
      }
    });

    const buildHierarchyNode = (chapter, index, parentToken = "", depth = 1, ownerChapterId = "") => {
      const nodeId = asText(chapter?.id, "").trim() || `${parentToken || "ch"}-${index + 1}`;
      const resolvedOwnerChapterId = asText(ownerChapterId, "").trim() || (depth === 1 ? nodeId : "");
      const title = asText(chapter?.name, `فصل ${index + 1}`);
      const rawChildren = treeOnlyMode && depth === 1
        ? (Array.isArray(chapter?.tree) ? chapter.tree : [])
        : resolveTreeChildren(chapter);
      const childNodes = rawChildren
        .filter((item) => item && typeof item === "object")
        .map((child, childIndex) =>
          buildHierarchyNode(child, childIndex, `${nodeId}-`, depth + 1, resolvedOwnerChapterId || nodeId)
        );

      const explicitQuestionCount = resolveNumericMetaValue(
        chapter?.meta?.questionCount ?? chapter?.questionCount ?? chapter?.totalQuestions ?? chapter?.count
      );
      const explicitReviewCount = resolveNumericMetaValue(
        chapter?.meta?.reviewCount ?? chapter?.reviewCount ?? chapter?.needsReview ?? chapter?.review
      );
      const nestedQuestions = childNodes.reduce((sum, node) => sum + (Number(node?.meta?.questionCount) || 0), 0);
      const nestedReview = childNodes.reduce((sum, node) => sum + (Number(node?.meta?.reviewCount) || 0), 0);
      const derivedNodeCount = childNodes.length + nestedQuestions;
      const directBranchCount = childNodes.reduce((sum, node) => {
        const hasChildren = Array.isArray(node?.children) && node.children.length > 0;
        return sum + (hasChildren ? 1 : 0);
      }, 0);
      const derivedBranchCount = directBranchCount + nestedReview;
      const questionCount = Number.isFinite(explicitQuestionCount)
        ? explicitQuestionCount
        : derivedNodeCount;
      const reviewCount = Number.isFinite(explicitReviewCount)
        ? explicitReviewCount
        : derivedBranchCount;

      return {
        name: title,
        id: nodeId,
        type: "chapter",
        chapterId: resolvedOwnerChapterId || nodeId,
        searchKey: normalizeLookupKey(title),
        meta: {
          questionCount,
          reviewCount
        },
        children: childNodes
      };
    };

    const chapterHierarchyChildren = chapterList.map((chapter, index) => buildHierarchyNode(chapter, index));
    const totalQuestions = chapterHierarchyChildren.reduce((sum, node) => {
      return sum + (Number(node?.meta?.questionCount) || 0);
    }, 0);
    const totalReviews = chapterHierarchyChildren.reduce((sum, node) => {
      return sum + (Number(node?.meta?.reviewCount) || 0);
    }, 0);

    const hierarchyData = {
      name: asText(subject?.name, "درس"),
      id: asText(subject?.id, "subject"),
      type: "course",
      chapterId: "",
      searchKey: normalizeLookupKey(asText(subject?.name, "")),
      meta: {
        questionCount: totalQuestions,
        reviewCount: totalReviews
      },
      children: chapterHierarchyChildren
    };

    const root = d3.hierarchy(hierarchyData);
    const collapseInitFlag = "__mqb_tree_default_collapsed_initialized";

    if (collapseState instanceof Set && !collapseState[collapseInitFlag]) {
      let initializedNodes = 0;
      root.each((node) => {
        if (node.depth <= 0) {
          return;
        }
        if (Array.isArray(node.children) && node.children.length) {
          const nodeId = asText(node?.data?.id, "");
          if (nodeId) {
            collapseState.add(nodeId);
            initializedNodes += 1;
          }
        }
      });
      collapseState[collapseInitFlag] = true;
      if (initializedNodes > 0) {
        onCollapseStateChanged({ type: "init", count: initializedNodes });
      }
    }

    root.each((node) => {
      if (node.depth <= 0 || !Array.isArray(node.children) || !node.children.length) {
        return;
      }
      if (collapseState.has(asText(node?.data?.id, ""))) {
        node._children = node.children;
        node.children = null;
      }
    });

    const minWidth = mobileViewport ? 336 : 560;
    const containerWidth = Math.max(minWidth, Math.round(canvas.clientWidth || minWidth));

    const marginTop = mobileViewport ? 44 : 48;
    const marginRight = mobileViewport ? 48 : 62;
    const marginBottom = mobileViewport ? 46 : 48;
    const marginLeft = mobileViewport ? 30 : 42;

    const nodeCount = root.descendants().length;
    const denseMobileTree = mobileViewport && nodeCount >= 18;
    const compactMobileTree = mobileViewport && nodeCount >= 32;
    const nestedTree = root.height >= 2;

    const rootWidth = mobileViewport ? (compactMobileTree ? 214 : 226) : 280;
    const rootHeight = mobileViewport ? (compactMobileTree ? 82 : 88) : 100;
    const chapterWidth = mobileViewport ? (compactMobileTree ? 162 : denseMobileTree ? 170 : 176) : 212;
    const chapterHeight = mobileViewport ? (compactMobileTree ? 62 : denseMobileTree ? 66 : 68) : 74;

    const dxBase = mobileViewport
      ? (compactMobileTree ? 112 : denseMobileTree ? 124 : 136)
      : nodeCount > 44
        ? 66
        : nodeCount > 24
          ? 74
          : 82;
    const dxDensityBoost = mobileViewport
      ? (nodeCount > 34 ? 1.06 : 1.03)
      : nodeCount > 38
        ? 1.02
        : 1;
    const dx = Math.round(dxBase * dxDensityBoost * (mobileViewport && nestedTree ? 1.14 : 1));

    const desiredSiblingGap = chapterHeight + (mobileViewport ? (compactMobileTree ? 18 : 20) : 16);
    const desiredBranchGap = desiredSiblingGap + (mobileViewport ? 14 : 12);
    const minSiblingSeparation = desiredSiblingGap / Math.max(1, dx);
    const minBranchSeparation = desiredBranchGap / Math.max(1, dx);

    const separation = (a, b) => {
      const sameParent = a?.parent === b?.parent;
      if (mobileViewport) {
        const parentFactor = sameParent ? (compactMobileTree ? 1.36 : 1.44) : (compactMobileTree ? 1.72 : 1.88);
        const depthFactor = (a?.depth > 1 || b?.depth > 1) ? 1.12 : 1;
        const densityFactor = nodeCount > 26 ? 1.08 : 1.04;
        const base = parentFactor * depthFactor * densityFactor;
        return Math.max(base, sameParent ? minSiblingSeparation : minBranchSeparation);
      }
      const base = (sameParent ? 1.14 : 1.38) * ((a?.depth > 1 || b?.depth > 1) ? 1.05 : 1);
      return Math.max(base, sameParent ? minSiblingSeparation : minBranchSeparation);
    };

    const layout = d3.tree().nodeSize([dx, 1]).separation(separation);
    layout(root);

    const dy = Math.max(
      mobileViewport ? (nestedTree ? 182 : 170) : 188,
      Math.round((containerWidth - marginLeft - marginRight) / Math.max(1, 1 + root.height))
    );

    const nodes = root.descendants();

    const xExtent = d3.extent(nodes, (node) => node.x);
    const rawHeight = Math.max(1, (xExtent[1] || 0) - (xExtent[0] || 0));
    const height = Math.max(mobileViewport ? 432 : 454, Math.round(rawHeight + marginTop + marginBottom + (mobileViewport ? 108 : 94)));
    const yShift = marginTop + ((height - marginTop - marginBottom) - rawHeight) / 2 - (xExtent[0] || 0);

    const contentWidth = (root.height + 1) * dy;
    const width = Math.max(containerWidth, Math.round(contentWidth + marginLeft + marginRight + chapterWidth));

    nodes.forEach((node) => {
      const logicalX = marginLeft + node.y * dy;
      node.screenX = width - marginRight - logicalX;
      node.screenY = node.x + yShift;
    });

    const links = root.links();

    const chartId = createId("chapter-tree");
    const svg = d3
      .create("svg")
      .attr("class", "chapter-map-svg chapter-tree-svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("role", "tree")
      .attr("aria-label", `نمودار درختی فصل های درس ${asText(subject?.name, "")}`);
    svg.classed("is-low-power", lowPower).classed("is-heavy-tree", heavyTree).classed("is-fx-off", !effectiveFx);

    canvas.dataset.renderWidth = String(containerWidth);

    const defs = svg.append("defs");
    const linkGradientId = `${chartId}-link-gradient`;
    const linkGradientActiveId = `${chartId}-link-active-gradient`;
    const linkTrailGradientId = `${chartId}-link-trail-gradient`;
    const trunkGradientId = `${chartId}-trunk-gradient`;
    const chapterCardGradientId = `${chartId}-chapter-card-gradient`;
    const rootCardGradientId = `${chartId}-root-card-gradient`;
    const ringGradientId = `${chartId}-ring-gradient`;

    defs
      .append("linearGradient")
      .attr("id", linkGradientId)
      .attr("x1", "100%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "0%")
      .call((gradient) => {
        gradient
          .append("stop")
          .attr("offset", "0%")
          .attr("stop-color", "color-mix(in srgb, var(--accent2, var(--accent)) 84%, #e9fbff 16%)")
          .attr("stop-opacity", 0.94);
        gradient
          .append("stop")
          .attr("offset", "34%")
          .attr("stop-color", "color-mix(in srgb, var(--accent) 78%, #8fdcff 22%)")
          .attr("stop-opacity", 0.8);
        gradient.append("stop").attr("offset", "72%").attr("stop-color", "var(--accent)").attr("stop-opacity", 0.44);
        gradient.append("stop").attr("offset", "100%").attr("stop-color", "var(--text-muted)").attr("stop-opacity", 0.16);
      });

    defs
      .append("linearGradient")
      .attr("id", linkGradientActiveId)
      .attr("x1", "100%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "0%")
      .call((gradient) => {
        gradient
          .append("stop")
          .attr("offset", "0%")
          .attr("stop-color", "color-mix(in srgb, var(--accent2, var(--accent)) 88%, #ffffff 12%)")
          .attr("stop-opacity", 1);
        gradient
          .append("stop")
          .attr("offset", "55%")
          .attr("stop-color", "color-mix(in srgb, var(--accent2, var(--accent)) 76%, var(--accent) 24%)")
          .attr("stop-opacity", 0.9);
        gradient
          .append("stop")
          .attr("offset", "100%")
          .attr("stop-color", "color-mix(in srgb, var(--accent) 84%, #9be4ff 16%)")
          .attr("stop-opacity", 0.72);
      });

    defs
      .append("linearGradient")
      .attr("id", linkTrailGradientId)
      .attr("x1", "100%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "0%")
      .call((gradient) => {
        gradient
          .append("stop")
          .attr("offset", "0%")
          .attr("stop-color", "color-mix(in srgb, var(--accent2, var(--accent)) 82%, #e7f9ff 18%)")
          .attr("stop-opacity", 0.66);
        gradient
          .append("stop")
          .attr("offset", "52%")
          .attr("stop-color", "color-mix(in srgb, var(--accent) 60%, transparent)")
          .attr("stop-opacity", 0.34);
        gradient
          .append("stop")
          .attr("offset", "100%")
          .attr("stop-color", "color-mix(in srgb, var(--accent) 12%, transparent)")
          .attr("stop-opacity", 0);
      });

    defs
      .append("linearGradient")
      .attr("id", trunkGradientId)
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%")
      .call((gradient) => {
        gradient
          .append("stop")
          .attr("offset", "0%")
          .attr("stop-color", "color-mix(in srgb, var(--accent2, var(--accent)) 42%, transparent)")
          .attr("stop-opacity", 0.54);
        gradient
          .append("stop")
          .attr("offset", "50%")
          .attr("stop-color", "color-mix(in srgb, var(--accent2, var(--accent)) 74%, #dff7ff 26%)")
          .attr("stop-opacity", 0.84);
        gradient
          .append("stop")
          .attr("offset", "100%")
          .attr("stop-color", "color-mix(in srgb, var(--accent) 40%, transparent)")
          .attr("stop-opacity", 0.52);
      });

    defs
      .append("linearGradient")
      .attr("id", chapterCardGradientId)
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%")
      .call((gradient) => {
        gradient.append("stop").attr("offset", "0%").attr("stop-color", "var(--surface1, rgba(20, 34, 50, 0.96))");
        gradient.append("stop").attr("offset", "52%").attr("stop-color", "var(--surface2, rgba(14, 27, 41, 0.93))");
        gradient.append("stop").attr("offset", "100%").attr("stop-color", "var(--surface3, rgba(10, 20, 32, 0.92))");
      });

    defs
      .append("linearGradient")
      .attr("id", rootCardGradientId)
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%")
      .call((gradient) => {
        gradient
          .append("stop")
          .attr("offset", "0%")
          .attr("stop-color", "color-mix(in srgb, var(--accent) 16%, var(--surface1, rgba(20, 34, 50, 0.96)))");
        gradient
          .append("stop")
          .attr("offset", "58%")
          .attr("stop-color", "color-mix(in srgb, var(--accent2, var(--accent)) 12%, var(--surface2, rgba(14, 27, 41, 0.93)))");
        gradient
          .append("stop")
          .attr("offset", "100%")
          .attr("stop-color", "color-mix(in srgb, var(--accent) 10%, var(--surface3, rgba(10, 20, 32, 0.92)))");
      });

    defs
      .append("linearGradient")
      .attr("id", ringGradientId)
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%")
      .call((gradient) => {
        gradient.append("stop").attr("offset", "0%").attr("stop-color", "color-mix(in srgb, var(--accent) 62%, transparent)");
        gradient
          .append("stop")
          .attr("offset", "50%")
          .attr("stop-color", "color-mix(in srgb, var(--accent2, var(--accent)) 86%, transparent)");
        gradient.append("stop").attr("offset", "100%").attr("stop-color", "color-mix(in srgb, var(--accent) 52%, transparent)");
      });

    const zoomLayer = svg.append("g").attr("class", "chapter-map-viewport chapter-tree-zoom-layer");
    const linkLayer = zoomLayer.append("g").attr("class", "links chapter-tree-links");
    const nodeLayer = zoomLayer.append("g").attr("class", "nodes chapter-tree-nodes");

    const linkPathGenerator = d3
      .linkHorizontal()
      .x((point) => point.x)
      .y((point) => point.y);

    const linkPathFor = (linkDatum) => {
      const sourceHalfWidth = linkDatum.source.depth === 0 ? rootWidth / 2 : chapterWidth / 2;
      const targetHalfWidth = linkDatum.target.depth === 0 ? rootWidth / 2 : chapterWidth / 2;
      return linkPathGenerator({
        source: {
          x: linkDatum.source.screenX - sourceHalfWidth + 2,
          y: linkDatum.source.screenY
        },
        target: {
          x: linkDatum.target.screenX + targetHalfWidth - 2,
          y: linkDatum.target.screenY
        }
      });
    };

    const depthOneNodes = nodes.filter((node) => node.depth === 1);
    const rootNode = nodes[0] || null;

    if (premiumFxEnabled && rootNode) {
      const aura = linkLayer
        .append("g")
        .attr("class", "chapter-tree-root-aura")
        .attr("transform", `translate(${rootNode.screenX}, ${rootNode.screenY})`);

      aura
        .append("circle")
        .attr("class", "chapter-tree-root-aura-ring ring-a")
        .attr("r", Math.max(58, Math.round(rootWidth * 0.42)));
      aura
        .append("circle")
        .attr("class", "chapter-tree-root-aura-ring ring-b")
        .attr("r", Math.max(76, Math.round(rootWidth * 0.56)));
      aura
        .append("circle")
        .attr("class", "chapter-tree-root-aura-core")
        .attr("r", Math.max(22, Math.round(rootWidth * 0.12)));
    }

    if (depthOneNodes.length) {
      const top = d3.min(depthOneNodes, (node) => node.screenY - chapterHeight / 2 + 6) || height / 2;
      const bottom = d3.max(depthOneNodes, (node) => node.screenY + chapterHeight / 2 - 6) || height / 2;
      const rootLeft = (nodes[0]?.screenX || width / 2) - rootWidth / 2;
      linkLayer
        .append("path")
        .attr("class", "chapter-tree-trunk")
        .attr("d", `M ${rootLeft + 2} ${top} L ${rootLeft + 2} ${bottom}`)
        .attr("stroke", `url(#${trunkGradientId})`);
    }

    if (premiumFxEnabled) {
      linkLayer
        .selectAll("path.chapter-tree-link-trail")
        .data(links)
        .join("path")
        .attr("class", "chapter-tree-link-trail")
        .attr("data-node-id", (linkDatum) => asText(linkDatum?.target?.data?.id, ""))
        .attr("data-depth", (linkDatum) => String(Math.max(1, Number(linkDatum?.target?.depth) || 1)))
        .attr("d", linkPathFor)
        .attr("stroke", `url(#${linkTrailGradientId})`);
    }

    const linkSelection = linkLayer
      .selectAll("path.chapter-map-link")
      .data(links)
      .join("path")
      .attr("class", "chapter-map-link chapter-tree-link")
      .attr("data-node-id", (linkDatum) => asText(linkDatum?.target?.data?.id, ""))
      .attr("data-depth", (linkDatum) => String(Math.max(1, Number(linkDatum?.target?.depth) || 1)))
      .attr("d", linkPathFor)
      .attr("stroke", `url(#${linkGradientId})`);

    const nodeSelection = nodeLayer
      .selectAll("g.chapter-map-node")
      .data(nodes)
      .join("g")
      .attr("class", (node) => `chapter-map-node chapter-tree-node${node.depth === 0 ? " is-root" : ""}`)
      .attr("data-depth", (node) => String(Math.max(0, Number(node?.depth) || 0)))
      .attr("transform", (node) => `translate(${node.screenX}, ${node.screenY})`)
      .attr("tabindex", 0)
      .attr("role", "treeitem")
      .attr("aria-level", (node) => String(node.depth + 1))
      .attr("aria-label", (node) => {
        if (node.depth === 0) {
          return `درس ${asText(node?.data?.name, "")}`;
        }
        const nodeId = asText(node?.data?.id, "");
        const chapterId = asText(node?.data?.chapterId, "");
        if (chapterLookup.has(chapterId) && nodeId === chapterId) {
          return `فصل ${asText(node?.data?.name, "")} — رفتن به بانک سوالات این فصل`;
        }
        return `شاخه ${asText(node?.data?.name, "")} — باز یا بسته کردن زیرشاخه‌ها`;
      });

    nodeSelection.each(function drawNode(node) {
      const group = d3.select(this);
      const isRoot = node.depth === 0;
      const cardWidth = isRoot ? rootWidth : chapterWidth;
      const cardHeight = isRoot ? rootHeight : chapterHeight;
      const totalValue = Number(node?.data?.meta?.questionCount) || 0;
      const reviewValue = Number(node?.data?.meta?.reviewCount) || 0;
      const hasChildren = (Array.isArray(node.children) && node.children.length) || (Array.isArray(node._children) && node._children.length);

      group.append("title").text(`${asText(node?.data?.name, "") || "-"} | ${totalValue} گره | شاخه ${reviewValue}`);

      if (effectiveFx) {
        group
          .append("rect")
          .attr("class", "chapter-tree-node-glow")
          .attr("x", -cardWidth * 0.54)
          .attr("y", -cardHeight * 0.62)
          .attr("width", cardWidth * 1.08)
          .attr("height", cardHeight * 1.24)
          .attr("rx", isRoot ? 30 : 24);
      }

      group
        .append("rect")
        .attr("class", "chapter-map-node-ring chapter-tree-node-ring")
        .attr("x", -cardWidth / 2)
        .attr("y", -cardHeight / 2)
        .attr("width", cardWidth)
        .attr("height", cardHeight)
        .attr("rx", isRoot ? 23 : 18)
        .attr("fill", `url(#${ringGradientId})`);

      group
        .append("rect")
        .attr("class", "chapter-map-node-card chapter-tree-node-card")
        .attr("x", -(cardWidth - 8) / 2)
        .attr("y", -(cardHeight - 8) / 2)
        .attr("width", cardWidth - 8)
        .attr("height", cardHeight - 8)
        .attr("rx", isRoot ? 21 : 16)
        .attr("fill", isRoot ? `url(#${rootCardGradientId})` : `url(#${chapterCardGradientId})`);

      group
        .append("rect")
        .attr("class", "chapter-tree-node-accent")
        .attr("x", -(cardWidth - 16) / 2)
        .attr("y", -(cardHeight - 8) / 2)
        .attr("width", cardWidth - 16)
        .attr("height", isRoot ? 7 : 5)
        .attr("rx", 999);

      if (premiumFxEnabled && !isRoot) {
        group
          .append("circle")
          .attr("class", "chapter-tree-node-dot")
          .attr("cx", cardWidth / 2 - 18)
          .attr("cy", -cardHeight / 2 + 15)
          .attr("r", 2.3);
      }

      if (premiumFxEnabled && isRoot) {
        group
          .append("circle")
          .attr("class", "chapter-tree-root-pulse")
          .attr("cx", cardWidth / 2 - 22)
          .attr("cy", -cardHeight / 2 + 18)
          .attr("r", 4);
      }

      group
        .append("text")
        .attr("class", `chapter-map-node-title chapter-tree-node-title${isRoot ? " is-root-title" : ""}`)
        .attr("text-anchor", "middle")
        .attr("y", isRoot ? -13 : -11)
        .text(
          splitLabelForMap(
            asText(node?.data?.name, "-"),
            isRoot
              ? (mobileViewport ? (compactMobileTree ? 20 : 22) : 30)
              : mobileViewport
                ? (compactMobileTree ? 14 : denseMobileTree ? 16 : 18)
                : 24
          )
        );

      const badges = group
        .append("g")
        .attr("class", "chapter-tree-badges")
        .attr("transform", `translate(0, ${isRoot ? 18 : 16})`);

      const badgeWidth = isRoot
        ? (mobileViewport ? (compactMobileTree ? 64 : 70) : 86)
        : mobileViewport
          ? (compactMobileTree ? 54 : denseMobileTree ? 58 : 62)
          : 76;
      const badgeHeight = mobileViewport ? 18 : 20;
      const badgeRadius = mobileViewport ? 9 : 10;
      const badgeTop = -badgeHeight / 2;
      const badgeTextY = mobileViewport ? 3.1 : 3.5;
      const badgeGap = mobileViewport ? 3 : 4;

      const appendBadge = (x, text, kind) => {
        const badge = badges.append("g").attr("class", `chapter-tree-badge chapter-tree-badge-${kind}`);
        badge
          .append("rect")
          .attr("x", x)
          .attr("y", badgeTop)
          .attr("width", badgeWidth)
          .attr("height", badgeHeight)
          .attr("rx", badgeRadius);
        badge
          .append("text")
          .attr("x", x + badgeWidth / 2)
          .attr("y", badgeTextY)
          .attr("text-anchor", "middle")
          .text(text);
      };

      appendBadge(-(badgeWidth + badgeGap), `${totalValue} گره`, "total");
      appendBadge(badgeGap, `شاخه ${reviewValue}`, reviewValue > 0 ? "review" : "muted");

      if (!isRoot && hasChildren) {
        const collapsed = Array.isArray(node._children) && node._children.length;
        const toggle = group.append("g").attr("class", "chapter-tree-collapse-toggle");
        toggle.append("circle").attr("cx", -cardWidth / 2 + 16).attr("cy", 0).attr("r", 8.5);
        toggle.append("text").attr("x", -cardWidth / 2 + 16).attr("y", 3.7).attr("text-anchor", "middle").text(collapsed ? "+" : "−");
      }
    });

    const linkByTargetId = new Map();
    linkSelection.each(function cacheLink(linkDatum) {
      linkByTargetId.set(asText(linkDatum?.target?.data?.id, ""), this);
    });
    const linkTrailByTargetId = new Map();
    linkLayer.selectAll("path.chapter-tree-link-trail").each(function cacheTrail(linkDatum) {
      linkTrailByTargetId.set(asText(linkDatum?.target?.data?.id, ""), this);
    });

    const mappedNodes = [];
    nodeSelection.each(function mapNode(node) {
      if (node.depth <= 0) {
        return;
      }
      const nodeId = asText(node?.data?.id, "");
      const chapterId = asText(node?.data?.chapterId, "");
      const chapter = chapterLookup.get(chapterId) || null;
      const legend = chapter
        ? legendItems.find((item) => asText(item?.dataset?.chapterId, "") === chapterId) || null
        : null;
      const pathLinks = [];
      let cursor = node;
      while (cursor && cursor.parent) {
        const cursorId = asText(cursor?.data?.id, "");
        const segment = linkByTargetId.get(cursorId);
        if (segment) {
          pathLinks.push(segment);
        }
        const trailSegment = linkTrailByTargetId.get(cursorId);
        if (trailSegment) {
          pathLinks.push(trailSegment);
        }
        cursor = cursor.parent;
      }
      mappedNodes.push({
        nodeId,
        nodeName: asText(node?.data?.name, ""),
        chapter,
        chapterId,
        searchKey: asText(node?.data?.searchKey, ""),
        x: node.screenX,
        y: node.screenY,
        depth: Number(node?.depth) || 0,
        element: this,
        link: linkByTargetId.get(nodeId) || null,
        legend,
        pathLinks,
        isChapterRoot: !!chapterId && nodeId === chapterId,
        hasChildren:
          (Array.isArray(node.children) && node.children.length > 0) ||
          (Array.isArray(node._children) && node._children.length > 0)
      });
    });

    const nodeById = new Map();
    const chapterRootByChapterId = new Map();
    mappedNodes.forEach((entry) => {
      const nodeId = asText(entry?.nodeId, "");
      if (nodeId) {
        nodeById.set(nodeId, entry);
      }
      const chapterId = asText(entry?.chapterId, "");
      if (entry?.isChapterRoot && chapterId) {
        chapterRootByChapterId.set(chapterId, entry);
      }
    });

    const allLinkSegments = Array.from(
      new Set(
        [...linkByTargetId.values(), ...linkTrailByTargetId.values()].filter((segment) => segment instanceof SVGElement)
      )
    );
    const legendItemList = legendItems.filter((item) => item instanceof HTMLElement);

    const resolveNodeId = (nodeIdOrChapterId) => {
      const safeId = asText(nodeIdOrChapterId, "").trim();
      if (!safeId) {
        return "";
      }
      if (nodeById.has(safeId)) {
        return safeId;
      }
      const chapterRoot = chapterRootByChapterId.get(safeId);
      if (chapterRoot?.nodeId) {
        return chapterRoot.nodeId;
      }
      return "";
    };

    const rootElement = nodeSelection.filter((node) => node.depth === 0).node();
    const applyIdleStrokeForSegment = (segment) => {
      const idleGradient = segment.classList.contains("chapter-tree-link-trail") ? linkTrailGradientId : linkGradientId;
      segment.setAttribute("stroke", `url(#${idleGradient})`);
    };

    const setFocused = (nodeIdOrChapterId) => {
      const focusedNodeId = resolveNodeId(nodeIdOrChapterId);
      const focusedEntry = focusedNodeId ? nodeById.get(focusedNodeId) || null : null;
      const focusedChapterId = asText(focusedEntry?.chapterId, "");

      mappedNodes.forEach((entry) => {
        const focused = asText(entry?.nodeId, "") === focusedNodeId;
        entry.element?.classList.toggle("is-focused", focused);
        entry.link?.classList.toggle("is-focused", focused);
      });

      allLinkSegments.forEach((segment) => {
        segment.classList.remove("is-focused");
        segment.classList.remove("is-active-path");
        applyIdleStrokeForSegment(segment);
      });

      if (focusedEntry) {
        (focusedEntry.pathLinks || []).forEach((segment) => {
          if (!(segment instanceof SVGElement)) {
            return;
          }
          segment.classList.add("is-focused");
          segment.classList.add("is-active-path");
          segment.setAttribute("stroke", `url(#${linkGradientActiveId})`);
        });
      }

      legendItemList.forEach((item) => {
        const isFocusedChapter = !!focusedChapterId && asText(item.dataset.chapterId, "") === focusedChapterId;
        item.classList.toggle("is-focused", isFocusedChapter);
      });
      rootElement?.classList.toggle("is-active-path", !!focusedEntry);
      return focusedEntry;
    };

    let selectedNodeId = resolveNodeId(activeChapterId);
    const setSelected = (nodeIdOrChapterId) => {
      const nextSelectedNodeId = resolveNodeId(nodeIdOrChapterId);
      selectedNodeId = nextSelectedNodeId;
      const selectedEntry = nextSelectedNodeId ? nodeById.get(nextSelectedNodeId) || null : null;
      const selectedChapterId = asText(selectedEntry?.chapterId, "");

      mappedNodes.forEach((entry) => {
        const selected = asText(entry?.nodeId, "") === nextSelectedNodeId;
        entry.element?.classList.toggle("is-selected", selected);
      });

      legendItemList.forEach((item) => {
        const isSelectedChapter = !!selectedChapterId && asText(item.dataset.chapterId, "") === selectedChapterId;
        item.classList.toggle("is-selected", isSelectedChapter);
      });
      return selectedEntry;
    };

    const zoomRange = lowPower
      ? (mobileViewport ? [0.62, 1.75] : [0.56, 2.25])
      : mobileViewport
        ? [0.55, 2.2]
        : [0.5, 2.9];
    let activeTransform = d3.zoomIdentity;

    const pointTransform = (x, y, scale) => {
      const safeScale = clampNumber(scale, zoomRange[0], zoomRange[1], 1);
      return d3.zoomIdentity.translate(width / 2 - x * safeScale, height / 2 - y * safeScale).scale(safeScale);
    };

    const bounds = nodes.reduce(
      (acc, node) => {
        const hw = node.depth === 0 ? rootWidth / 2 : chapterWidth / 2;
        const hh = node.depth === 0 ? rootHeight / 2 : chapterHeight / 2;
        acc.minX = Math.min(acc.minX, node.screenX - hw);
        acc.maxX = Math.max(acc.maxX, node.screenX + hw);
        acc.minY = Math.min(acc.minY, node.screenY - hh);
        acc.maxY = Math.max(acc.maxY, node.screenY + hh);
        return acc;
      },
      { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
    );

    const fitScale = clampNumber(
      Math.min(
        (width - (mobileViewport ? 54 : 66)) / Math.max(1, bounds.maxX - bounds.minX),
        (height - (mobileViewport ? 54 : 66)) / Math.max(1, bounds.maxY - bounds.minY)
      ),
      zoomRange[0],
      mobileViewport ? (lowPower ? 1.06 : 1.14) : 1.32,
      1
    );

    const fitTransform = d3.zoomIdentity
      .translate((width - fitScale * (bounds.minX + bounds.maxX)) / 2, (height - fitScale * (bounds.minY + bounds.maxY)) / 2)
      .scale(fitScale);

    const activeNode = nodeById.get(resolveNodeId(activeChapterId)) || null;
    const identity = activeNode
      ? pointTransform(activeNode.x, activeNode.y, Math.max(fitTransform.k, mobileViewport ? 0.9 : 1.04))
      : fitTransform;
    let minimapNode = null;
    let updateMinimapViewport = () => {};
    if (shouldRenderMinimap) {
      const minimap = d3
        .create("svg")
        .attr("class", "chapter-tree-minimap")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("aria-hidden", "true");

      minimap
        .append("rect")
        .attr("class", "chapter-tree-minimap-bg")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height)
        .attr("rx", 16);

      minimap
        .append("g")
        .attr("class", "chapter-tree-minimap-links")
        .selectAll("path")
        .data(links)
        .join("path")
        .attr("d", linkPathFor);

      minimap
        .append("g")
        .attr("class", "chapter-tree-minimap-nodes")
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("cx", (node) => node.screenX)
        .attr("cy", (node) => node.screenY)
        .attr("r", (node) => (node.depth === 0 ? 7 : 4.4));

      const minimapViewport = minimap
        .append("rect")
        .attr("class", "chapter-tree-minimap-viewport")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height);

      updateMinimapViewport = (transform) => {
        const k = Math.max(transform?.k || 1, 0.0001);
        const viewWidth = width / k;
        const viewHeight = height / k;
        minimapViewport
          .attr("x", clampNumber(-transform.x / k, 0, Math.max(0, width - viewWidth), 0))
          .attr("y", clampNumber(-transform.y / k, 0, Math.max(0, height - viewHeight), 0))
          .attr("width", viewWidth)
          .attr("height", viewHeight);
      };

      minimapNode = minimap.node();
      if (minimapNode instanceof SVGElement) {
        minimapNode.addEventListener("pointerdown", (event) => {
          const [x, y] = d3.pointer(event, minimapNode);
          const scale = Math.max(activeTransform.k || identity.k, zoomRange[0]);
          svg.call(zoom.transform, pointTransform(x, y, scale));
          event.preventDefault();
        });
      }
    }

    const zoom = d3.zoom().scaleExtent(zoomRange).on("zoom", (event) => {
      activeTransform = event.transform;
      zoomLayer.attr("transform", activeTransform);
      updateMinimapViewport(activeTransform);
    });

    svg.call(zoom).call(zoom.transform, identity);
    svg.on("dblclick.zoom", null);
    updateMinimapViewport(identity);

    const canToggleNode = (node) => {
      return (Array.isArray(node.children) && node.children.length) || (Array.isArray(node._children) && node._children.length);
    };

    const toggleCollapse = (node) => {
      if (!canToggleNode(node)) {
        return false;
      }
      const nodeId = asText(node?.data?.id, "");
      const willCollapse = Array.isArray(node.children) && node.children.length;
      if (willCollapse) {
        collapseState.add(nodeId);
      } else {
        collapseState.delete(nodeId);
      }
      onCollapseStateChanged({ type: "toggle", nodeId, collapsed: willCollapse });
      onRerender(asText(node?.data?.chapterId, "") || activeChapterId);
      return true;
    };

    const longPressTimers = new WeakMap();
    const longPressHandled = new WeakSet();
    const LONG_PRESS_MS = 520;

    const clearLongPress = (element) => {
      const timerId = longPressTimers.get(element);
      if (typeof timerId === "number") {
        window.clearTimeout(timerId);
      }
      longPressTimers.delete(element);
    };

    nodeSelection
      .on("mouseenter", (_, node) => {
        if (node.depth > 0) {
          setFocused(node?.data?.id);
        }
      })
      .on("mouseleave", () => setFocused(selectedNodeId || activeChapterId))
      .on("focus", (_, node) => {
        if (node.depth > 0) {
          setFocused(node?.data?.id);
        }
      })
      .on("blur", () => setFocused(selectedNodeId || activeChapterId))
      .on("pointerdown", function onPointerDown(event, node) {
        if (!canToggleNode(node)) {
          return;
        }
        clearLongPress(this);
        const timerId = window.setTimeout(() => {
          longPressHandled.add(this);
          toggleCollapse(node);
        }, LONG_PRESS_MS);
        longPressTimers.set(this, timerId);
      })
      .on("pointerup", function onPointerUp() {
        clearLongPress(this);
      })
      .on("pointerleave", function onPointerLeave() {
        clearLongPress(this);
      })
      .on("pointercancel", function onPointerCancel() {
        clearLongPress(this);
      })
      .on("dblclick", function onDoubleClick(event, node) {
        if (!canToggleNode(node)) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        toggleCollapse(node);
      })
      .on("click", function onClick(event, node) {
        if (longPressHandled.has(this)) {
          longPressHandled.delete(this);
          return;
        }
        const currentNodeId = asText(node?.data?.id, "");
        setSelected(currentNodeId);
        if (canToggleNode(node)) {
          event.preventDefault();
          event.stopPropagation();
          toggleCollapse(node);
          return;
        }
        if (node.depth <= 0) {
          return;
        }
        const chapterId = asText(node?.data?.chapterId, "");
        if (!chapterLookup.has(chapterId)) {
          return;
        }
        onNavigate(chapterId);
      })
      .on("keydown", (event, node) => {
        const key = asText(event?.key, "").trim().toLowerCase();
        if (key === "enter") {
          setSelected(asText(node?.data?.id, ""));
          if (canToggleNode(node)) {
            event.preventDefault();
            toggleCollapse(node);
            return;
          }
          const chapterId = asText(node?.data?.chapterId, "");
          if (node.depth > 0 && chapterLookup.has(chapterId)) {
            event.preventDefault();
            onNavigate(chapterId);
          }
          return;
        }
        if ((key === " " || key === "spacebar") && canToggleNode(node)) {
          event.preventDefault();
          toggleCollapse(node);
        }
      });

    legendItemList.forEach((item) => {
      item.addEventListener("mouseenter", () => setFocused(item.dataset.chapterId));
      item.addEventListener("mouseleave", () => setFocused(selectedNodeId || activeChapterId));
      item.addEventListener("click", () => {
        setSelected(item.dataset.chapterId);
        setFocused(item.dataset.chapterId);
      });
    });

    const shell = document.createElement("div");
    shell.className = "chapter-tree-shell";
    shell.style.setProperty("--chapter-tree-minimap-size", `${mobileViewport ? 122 : 150}px`);
    if (denseMobileTree) {
      shell.classList.add("is-mobile-dense");
    }
    if (compactMobileTree) {
      shell.classList.add("is-mobile-compact");
    }
    if (!effectiveFx) {
      shell.classList.add("is-fx-off");
    }
    if (lowPower) {
      shell.classList.add("is-low-power");
    }
    if (heavyTree) {
      shell.classList.add("is-heavy-tree");
    }

    if (premiumFxEnabled) {
      const atmosphere = document.createElement("div");
      atmosphere.className = "chapter-tree-atmosphere";
      atmosphere.innerHTML =
        '<span class="chapter-tree-atmosphere-glow glow-a"></span>' +
        '<span class="chapter-tree-atmosphere-glow glow-b"></span>' +
        '<span class="chapter-tree-atmosphere-grid"></span>';
      shell.append(atmosphere);
    }

    const svgNode = svg.node();
    if (svgNode instanceof SVGElement) {
      shell.append(svgNode);
    }
    if (minimapNode instanceof SVGElement) {
      shell.append(minimapNode);
    }
    canvas.replaceChildren(shell);

    setSelected(selectedNodeId || activeChapterId);
    setFocused(selectedNodeId || activeChapterId);

    const stableActiveChapterId = asText(activeChapterId, "");
    connectTreeResizeObserver(canvas, () => {
      if (!canvas.isConnected) {
        return;
      }
      onRerender(stableActiveChapterId);
    });

    const centerOnMappedNode = (target, options = {}) => {
      if (!target || !options.center) {
        return;
      }
      const scale = clampNumber(
        Number(options.scale),
        zoomRange[0],
        zoomRange[1],
        mobileViewport ? Math.max(1, identity.k) : Math.max(1.08, identity.k)
      );
      const transform = pointTransform(target.x, target.y, scale);
      if (options.animated && shouldAnimate) {
        svg.transition().duration(300).call(zoom.transform, transform);
      } else {
        svg.call(zoom.transform, transform);
      }
    };

    const focusTreeNodeInternal = (nodeIdOrChapterId, options = {}) => {
      const target = setFocused(nodeIdOrChapterId);
      if (!target) {
        return null;
      }
      if (options.select === true) {
        setSelected(target.nodeId);
      }
      centerOnMappedNode(target, options);
      return target;
    };

    const selectTreeNodeInternal = (nodeIdOrChapterId, options = {}) => {
      const target = setSelected(nodeIdOrChapterId);
      if (!target) {
        return null;
      }
      setFocused(target.nodeId);
      centerOnMappedNode(target, options);
      return target;
    };

    return {
      mode: "tree",
      subjectId: asText(subject?.id, ""),
      rootCanvas: canvas,
      d3,
      svg,
      zoom,
      viewport: zoomLayer,
      width,
      height,
      nodes: mappedNodes,
      identity,
      fitTransform,
      focusNode(chapterId, options = {}) {
        return focusTreeNodeInternal(chapterId, options);
      },
      focusTreeNode(nodeId, options = {}) {
        return focusTreeNodeInternal(nodeId, options);
      },
      selectTreeNode(nodeId, options = {}) {
        return selectTreeNodeInternal(nodeId, options);
      },
      getSelectedNode() {
        if (!selectedNodeId) {
          return null;
        }
        return nodeById.get(selectedNodeId) || null;
      }
    };
  }

  window.chapterTreeRenderer = { render };
})();
