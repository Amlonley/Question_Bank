(() => {
  "use strict";

  const TAB_ORDER = ["bank", "practice", "exam", "chapter-map"];
  const SCROLL_MEMORY_KEY = "mqb_view_scroll_memory_v1";
  const MAX_SCROLL_MEMORY_ENTRIES = 48;
  const SWIPE_MIN_DISTANCE_PX = 72;
  const SWIPE_MAX_DURATION_MS = 760;
  const SWIPE_LOCK_MS = 260;
  const HAPTIC_MIN_GAP_MS = 80;
  const LOADING_REVEAL_DELAY_MS = 70;
  const LOADING_GUARD_MAX_MS = 1500;
  const DEEP_LINK_MAX_RETRIES = 22;
  const DEEP_LINK_RETRY_DELAY_MS = 220;
  const PREFETCH_THROTTLE_MS = 380;
  const UI_MINIMAL_MODE_KEY = "mqb_ui_minimal_mode_v1";
  const DATA_STUDIO_MODE_KEY = "mqb_data_studio_mode_v1";
  const SETTINGS_COMPACT_KEY = "mqb_settings_compact_v1";
  const QUESTION_FOCUS_MODE_KEY = "mqb_question_focus_mode_v1";
  const SETTINGS_SEARCH_DEBOUNCE_MS = 130;
  const QUESTION_DEFER_START_INDEX = 4;
  const QUESTION_DEFER_MAX_COUNT = 36;
  const QUESTION_DEFER_ROOT_MARGIN = "260px 0px";
  const QUESTION_DEFER_MIN_HEIGHT = 220;
  const QUESTION_FOCUS_ELIGIBLE_TABS = new Set(["bank", "practice"]);
  const QUESTION_FOCUS_LOCKED_TAB = "bank";
  const QUESTION_FOCUS_BLOCKED_ACTIONS = new Set([
    "open-subject",
    "open-chapter",
    "goto-subjects",
    "goto-chapters",
    "switch-tab",
    "header-back"
  ]);
  const NAVIGATION_ACTIONS = new Set([
    "open-subject",
    "open-chapter",
    "goto-subjects",
    "goto-chapters",
    "switch-tab",
    "header-back",
    "bank-prev",
    "bank-next",
    "practice-prev",
    "practice-next",
    "practice-random",
    "exam-prev",
    "exam-next"
  ]);
  const STRONG_HAPTIC_ACTIONS = new Set([
    "open-subject",
    "open-chapter",
    "switch-tab",
    "header-back",
    "install-app",
    "print-exam",
    "print-exam-with-answers"
  ]);

  let scrollMemory = loadScrollMemory();
  let scrollPersistTimerId = 0;
  let scrollReadTimerId = 0;
  let scrollRestoreRafId = 0;
  let pendingNavigationRestore = false;
  let lastViewKey = "";
  let splashHintTimerId = 0;
  let deepLinkRetryTimerId = 0;
  let deepLinkRetryCount = 0;
  let deepLinkApplied = false;
  let hapticLastAt = 0;
  let loadingRevealTimerId = 0;
  let loadingGuardTimerId = 0;
  let prefetchTimerId = 0;
  let postRenderSyncRafId = 0;
  let dataStudioMode = loadStoredMode(DATA_STUDIO_MODE_KEY, "simple", new Set(["simple", "pro"]));
  let compactSettingsMode = loadStoredBoolean(SETTINGS_COMPACT_KEY, true);
  let minimalUiMode = loadStoredBoolean(UI_MINIMAL_MODE_KEY, true);
  let questionFocusMode = loadStoredBoolean(QUESTION_FOCUS_MODE_KEY, false);
  let settingsSearchTimerId = 0;
  let questionDeferObserver = null;
  let swipeLockUntil = 0;
  let questionFocusGestureLockActive = false;
  let swipeTrack = {
    active: false,
    startX: 0,
    startY: 0,
    startedAt: 0,
    pointerId: -1
  };

  const refs = {
    splash: null,
    splashSubtitle: null,
    levelContainer: null,
    breadcrumbs: null,
    headerPageTitle: null,
    headerQuickMode: null,
    headerQuickContext: null,
    networkPill: null,
    dataStudioCard: null,
    settingsPanel: null,
    questionFocusFab: null
  };

  const getNowMs = () => (typeof performance !== "undefined" && performance.now ? performance.now() : Date.now());

  function loadStoredMode(storageKey, fallback, allowedModes) {
    try {
      const stored = String(localStorage.getItem(storageKey) || "").trim().toLowerCase();
      if (allowedModes instanceof Set && allowedModes.has(stored)) {
        return stored;
      }
    } catch {
      // ignore storage access errors
    }
    return fallback;
  }

  function persistStoredMode(storageKey, value) {
    try {
      localStorage.setItem(storageKey, String(value || ""));
    } catch {
      // ignore storage access errors
    }
  }

  function loadStoredBoolean(storageKey, fallbackValue) {
    try {
      const stored = String(localStorage.getItem(storageKey) || "").trim().toLowerCase();
      if (["1", "true", "yes", "on"].includes(stored)) {
        return true;
      }
      if (["0", "false", "no", "off"].includes(stored)) {
        return false;
      }
    } catch {
      // ignore storage access errors
    }
    return !!fallbackValue;
  }

  function persistStoredBoolean(storageKey, value) {
    try {
      localStorage.setItem(storageKey, value ? "1" : "0");
    } catch {
      // ignore storage access errors
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  function init() {
    refs.splash = document.getElementById("appBootSplash");
    refs.splashSubtitle = refs.splash instanceof HTMLElement ? refs.splash.querySelector(".app-boot-subtitle") : null;
    refs.levelContainer = document.getElementById("levelContainer");
    refs.breadcrumbs = document.getElementById("breadcrumbs");
    refs.headerPageTitle = document.getElementById("headerPageTitle");
    refs.headerQuickMode = document.getElementById("headerQuickMode");
    refs.headerQuickContext = document.getElementById("headerQuickContext");
    refs.dataStudioCard = document.querySelector(".profile-card-data.profile-data-lab");
    refs.settingsPanel = document.getElementById("settingsPanel");

    enhanceBootSplash();
    setupMinimalUiExperience();
    setupQuestionFocusMode();
    setupNetworkPill();
    bindGlobalTouchHaptic();
    bindNavigationLoadingFeedback();
    bindSwipeTabNavigation();
    setupScrollMemorySync();
    setupDataStudioModeControls();
    setupCompactSettingsExperience();
    applyDeepLinkFromSearch();
    applyQuestionBankDeferredMount();
    scheduleImagePrefetch();
    schedulePostRenderSync();
  }

  function isLikelyMobileLikeMode() {
    const body = document.body;
    if (!(body instanceof HTMLElement)) {
      return false;
    }
    if (
      body.classList.contains("force-mobile") ||
      body.classList.contains("auto-mobile") ||
      body.classList.contains("standalone-native-app") ||
      body.dataset.viewportResolved === "mobile"
    ) {
      return true;
    }
    return typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches;
  }

  function isStandaloneMode() {
    const byMedia = typeof window.matchMedia === "function" && window.matchMedia("(display-mode: standalone)").matches;
    const legacy = window.navigator && window.navigator.standalone === true;
    return !!(byMedia || legacy);
  }

  function setupMinimalUiExperience() {
    applyMinimalUiMode(minimalUiMode, { persist: false });

    document.body.addEventListener(
      "click",
      (event) => {
        if (!(event.target instanceof Element)) {
          return;
        }

        const toggle = event.target.closest("[data-action='toggle-ui-minimal-mode']");
        if (toggle instanceof HTMLElement) {
          const nextValue = !minimalUiMode;
          applyMinimalUiMode(nextValue, { persist: true });
          return;
        }
      },
      true
    );

    window.addEventListener("resize", () => {
      schedulePostRenderSync();
    });
  }

  function applyMinimalUiMode(enabled, options = {}) {
    minimalUiMode = !!enabled;
    const body = document.body;
    if (body instanceof HTMLElement) {
      body.classList.toggle("app-minimal-ui", minimalUiMode);
    }
    if (options.persist !== false) {
      persistStoredBoolean(UI_MINIMAL_MODE_KEY, minimalUiMode);
    }
    syncMinimalUiState();
  }

  function syncMinimalUiState() {
    const body = document.body;
    if (!(body instanceof HTMLElement)) {
      return;
    }

    const mobileLike = isLikelyMobileLikeMode() || isStandaloneMode();
    body.classList.toggle("app-minimal-mobile", minimalUiMode && mobileLike);

    const dock = document.getElementById("pwaMobileDock");
    const dockVisible =
      dock instanceof HTMLElement && !dock.hidden && String(dock.getAttribute("aria-hidden") || "false") !== "true";

    const overflowMenu = document.getElementById("headerOverflowMenu");
    if (!(overflowMenu instanceof HTMLElement)) {
      return;
    }

    const duplicateSelector =
      "[data-action='goto-subjects'], [data-action='goto-chapters'], [data-action='switch-tab'][data-tab='bank'], [data-action='switch-tab'][data-tab='practice'], [data-action='switch-tab'][data-tab='exam'], [data-action='switch-tab'][data-tab='chapter-map']";
    overflowMenu.querySelectorAll(duplicateSelector).forEach((node) => {
      if (!(node instanceof HTMLElement)) {
        return;
      }
      const shouldHide = minimalUiMode && mobileLike && dockVisible;
      node.hidden = shouldHide;
      node.setAttribute("aria-hidden", shouldHide ? "true" : "false");
    });
  }

  function setupQuestionFocusMode() {
    ensureQuestionFocusToggleEntry();
    ensureQuestionFocusFab();
    applyQuestionFocusMode(questionFocusMode, { persist: false });

    document.body.addEventListener(
      "click",
      (event) => {
        if (!(event.target instanceof Element)) {
          return;
        }
        const actionNode = event.target.closest("[data-action]");
        if (actionNode instanceof HTMLElement) {
          const action = String(actionNode.dataset.action || "").trim();
          if (shouldBlockActionDuringQuestionFocus(action, actionNode)) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            return;
          }
        }
        const toggle = event.target.closest("[data-action='toggle-question-focus-mode']");
        if (!(toggle instanceof HTMLElement)) {
          return;
        }
        const nextState = !questionFocusMode;
        applyQuestionFocusMode(nextState, { persist: true });
      },
      true
    );
  }

  function ensureQuestionFocusToggleEntry() {
    const menu = document.getElementById("headerOverflowMenu");
    if (menu instanceof HTMLElement && !menu.querySelector("[data-action='toggle-question-focus-mode']")) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "appbar-overflow-item";
      button.dataset.action = "toggle-question-focus-mode";
      button.setAttribute("role", "menuitem");
      button.setAttribute("aria-pressed", "false");
      button.textContent = "تمرکز سوال: خاموش";
      menu.append(button);
    }

    const sections = document.querySelector(".appbar-sections-list");
    if (sections instanceof HTMLElement && !sections.querySelector("[data-action='toggle-question-focus-mode']")) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "appbar-sections-item";
      button.dataset.action = "toggle-question-focus-mode";
      button.setAttribute("aria-pressed", "false");
      button.textContent = "تمرکز سوال: خاموش";
      sections.append(button);
    }
  }

  function ensureQuestionFocusFab() {
    if (refs.questionFocusFab instanceof HTMLButtonElement && refs.questionFocusFab.isConnected) {
      return;
    }
    let fab = document.getElementById("questionFocusModeFab");
    if (!(fab instanceof HTMLButtonElement)) {
      fab = document.createElement("button");
      fab.id = "questionFocusModeFab";
      fab.type = "button";
      fab.className = "question-focus-fab";
      fab.dataset.action = "toggle-question-focus-mode";
      fab.setAttribute("aria-label", "تغییر حالت تمرکز سوال");
      fab.hidden = true;
      document.body.append(fab);
    }
    refs.questionFocusFab = fab;
  }

  function applyQuestionFocusMode(enabled, options = {}) {
    questionFocusMode = !!enabled;
    if (options.persist !== false) {
      persistStoredBoolean(QUESTION_FOCUS_MODE_KEY, questionFocusMode);
    }
    syncQuestionFocusUi();
  }

  function isQuestionFocusEligible() {
    const activeTab = getActiveTabKey();
    if (!QUESTION_FOCUS_ELIGIBLE_TABS.has(activeTab)) {
      return false;
    }
    const hasCards = !!document.querySelector(
      ":is(.question-bank-panel, .practice-mode-panel) .question-card, .practice-question-card"
    );
    return hasCards;
  }

  function isQuestionFocusBankLockActive() {
    if (!questionFocusMode) {
      return false;
    }
    if (!isQuestionFocusEligible()) {
      return false;
    }
    return getActiveTabKey() === QUESTION_FOCUS_LOCKED_TAB;
  }

  function shouldBlockActionDuringQuestionFocus(action, actionNode) {
    if (!isQuestionFocusBankLockActive()) {
      return false;
    }
    if (!QUESTION_FOCUS_BLOCKED_ACTIONS.has(action)) {
      return false;
    }
    if (action === "switch-tab") {
      const targetTab = String(actionNode?.dataset?.tab || "").trim();
      return targetTab !== QUESTION_FOCUS_LOCKED_TAB;
    }
    return true;
  }

  function syncQuestionFocusUi() {
    const eligible = isQuestionFocusEligible();
    const active = eligible && questionFocusMode;
    const bankLocked = active && isQuestionFocusBankLockActive();
    document.body.classList.toggle("question-focus-mode", active);
    document.body.classList.toggle("question-focus-bank-locked", bankLocked);
    document.body.dataset.questionFocusLock = bankLocked ? "1" : "0";
    if (document.documentElement instanceof HTMLElement) {
      document.documentElement.classList.toggle("question-focus-locked-page", bankLocked);
      document.documentElement.dataset.questionFocusLock = bankLocked ? "1" : "0";
    }

    setQuestionFocusGestureLock(bankLocked);

    const toggleButtons = document.querySelectorAll("[data-action='toggle-question-focus-mode']");
    toggleButtons.forEach((node) => {
      if (!(node instanceof HTMLButtonElement)) {
        return;
      }
      node.disabled = !eligible;
      node.setAttribute("aria-disabled", eligible ? "false" : "true");
      node.setAttribute("aria-pressed", active ? "true" : "false");
      node.textContent = active ? "تمرکز سوال: روشن" : "تمرکز سوال: خاموش";
      node.hidden = !eligible;
      node.setAttribute("aria-hidden", eligible ? "false" : "true");
    });

    if (refs.questionFocusFab instanceof HTMLButtonElement) {
      refs.questionFocusFab.hidden = !eligible;
      refs.questionFocusFab.setAttribute("aria-hidden", eligible ? "false" : "true");
      refs.questionFocusFab.classList.toggle("is-active", active);
      refs.questionFocusFab.textContent = active ? "خروج از تمرکز" : "تمرکز سوال";
    }
  }

  function getQuestionFocusLockScope() {
    if (!isQuestionFocusBankLockActive()) {
      return null;
    }
    const scope =
      document.querySelector(".question-bank-panel") ||
      document.querySelector("#levelContainer .question-bank-panel");
    return scope instanceof HTMLElement ? scope : null;
  }

  function setQuestionFocusGestureLock(active) {
    const shouldEnable = !!active;
    if (shouldEnable === questionFocusGestureLockActive) {
      return;
    }

    const options = { capture: true, passive: false };
    if (shouldEnable) {
      document.addEventListener("wheel", handleQuestionFocusGestureGuard, options);
      document.addEventListener("touchmove", handleQuestionFocusGestureGuard, options);
      document.addEventListener("touchstart", handleQuestionFocusPointerGuard, options);
    } else {
      document.removeEventListener("wheel", handleQuestionFocusGestureGuard, options);
      document.removeEventListener("touchmove", handleQuestionFocusGestureGuard, options);
      document.removeEventListener("touchstart", handleQuestionFocusPointerGuard, options);
    }

    questionFocusGestureLockActive = shouldEnable;
  }

  function handleQuestionFocusPointerGuard(event) {
    const scope = getQuestionFocusLockScope();
    if (!scope) {
      return;
    }

    const target = event.target;
    if (target instanceof Element) {
      const isFocusToggle = !!target.closest("[data-action='toggle-question-focus-mode']");
      if (isFocusToggle) {
        return;
      }
    }
    if (target instanceof HTMLElement && scope.contains(target)) {
      return;
    }
    if (event.cancelable) {
      event.preventDefault();
    }
    event.stopPropagation();
  }

  function handleQuestionFocusGestureGuard(event) {
    const scope = getQuestionFocusLockScope();
    if (!scope) {
      return;
    }

    const target = event.target;
    if (target instanceof Element) {
      const isFocusToggle = !!target.closest("[data-action='toggle-question-focus-mode']");
      if (isFocusToggle) {
        return;
      }
    }
    if (target instanceof HTMLElement && scope.contains(target)) {
      return;
    }
    if (event.cancelable) {
      event.preventDefault();
    }
    event.stopPropagation();
  }

  function schedulePostRenderSync() {
    if (postRenderSyncRafId) {
      return;
    }
    postRenderSyncRafId = window.requestAnimationFrame(() => {
      postRenderSyncRafId = 0;
      syncMinimalUiState();
      syncDataStudioModeUi();
      syncCompactSettingsState();
      syncQuestionFocusUi();
      applyQuestionBankDeferredMount();
    });
  }

  function enhanceBootSplash() {
    if (!(refs.splash instanceof HTMLElement) || !(refs.splashSubtitle instanceof HTMLElement)) {
      return;
    }

    setBootSplashMessage("بارگذاری هسته برنامه...");
    splashHintTimerId = window.setTimeout(() => {
      if (isSplashVisible()) {
        setBootSplashMessage("همگام‌سازی داده‌ها...");
      }
    }, 560);

    if (navigator.serviceWorker && navigator.serviceWorker.ready) {
      navigator.serviceWorker.ready
        .then(() => {
          if (isSplashVisible()) {
            setBootSplashMessage("فعال‌سازی حالت آفلاین...");
          }
        })
        .catch(() => {});
    }

    window.setTimeout(() => {
      if (isSplashVisible()) {
        setBootSplashMessage("در حال نهایی‌سازی محیط...");
      }
    }, 9000);

    if (refs.levelContainer instanceof HTMLElement) {
      const observer = new MutationObserver(() => {
        if (!isSplashVisible()) {
          observer.disconnect();
          return;
        }
        if (refs.levelContainer && refs.levelContainer.childElementCount > 0) {
          setBootSplashMessage("تقریبا آماده است...");
        }
      });
      observer.observe(refs.levelContainer, { childList: true });
    }
  }

  function isSplashVisible() {
    const splash = refs.splash;
    if (!(splash instanceof HTMLElement)) {
      return false;
    }
    return !splash.hidden && splash.getAttribute("aria-hidden") !== "true";
  }

  function setBootSplashMessage(text) {
    if (!(refs.splashSubtitle instanceof HTMLElement)) {
      return;
    }
    const nextText = String(text || "").trim();
    if (!nextText || refs.splashSubtitle.textContent === nextText) {
      return;
    }
    refs.splashSubtitle.textContent = nextText;
  }

  function setupDataStudioModeControls() {
    const card = refs.dataStudioCard;
    if (!(card instanceof HTMLElement)) {
      return;
    }

    ensureDataStudioModeSwitch(card);
    setDataStudioMode(dataStudioMode, { persist: false });

    if (card.dataset.modeBound === "1") {
      return;
    }
    card.dataset.modeBound = "1";

    card.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) {
        return;
      }
      const modeBtn = event.target.closest("[data-action='set-data-studio-mode']");
      if (!(modeBtn instanceof HTMLElement)) {
        return;
      }
      const mode = String(modeBtn.dataset.mode || "").trim().toLowerCase();
      if (!mode) {
        return;
      }
      setDataStudioMode(mode, { persist: true });
    });
  }

  function ensureDataStudioModeSwitch(card) {
    if (!(card instanceof HTMLElement)) {
      return;
    }
    let switcher = card.querySelector(".data-studio-mode-switch");
    if (switcher instanceof HTMLElement) {
      return;
    }

    const header = card.querySelector(".profile-card-data-headline");
    if (!(header instanceof HTMLElement)) {
      return;
    }

    switcher = document.createElement("div");
    switcher.className = "data-studio-mode-switch";
    switcher.setAttribute("role", "group");
    switcher.setAttribute("aria-label", "حالت نمایش دیتا استودیو");
    switcher.innerHTML =
      '<button type="button" class="data-studio-mode-btn" data-action="set-data-studio-mode" data-mode="simple" aria-pressed="true">ساده</button>' +
      '<button type="button" class="data-studio-mode-btn" data-action="set-data-studio-mode" data-mode="pro" aria-pressed="false">پیشرفته</button>';
    header.append(switcher);
  }

  function setDataStudioMode(mode, options = {}) {
    const normalized = mode === "pro" ? "pro" : "simple";
    dataStudioMode = normalized;
    if (options.persist !== false) {
      persistStoredMode(DATA_STUDIO_MODE_KEY, normalized);
    }
    syncDataStudioModeUi();
  }

  function syncDataStudioModeUi() {
    const card = refs.dataStudioCard;
    if (!(card instanceof HTMLElement)) {
      return;
    }

    card.dataset.studioMode = dataStudioMode;
    card.classList.toggle("is-simple-mode", dataStudioMode === "simple");
    card.classList.toggle("is-pro-mode", dataStudioMode === "pro");

    const hintNode = card.querySelector(".profile-data-editor-hint");
    if (hintNode instanceof HTMLElement) {
      hintNode.textContent =
        dataStudioMode === "simple"
          ? "حالت ساده فعال است: فقط JSON متنی و افزودن سریع."
          : "حالت پیشرفته فعال است: همه ابزارهای JSON + فایل مرجع در دسترس است.";
    }

    card.querySelectorAll(".data-studio-mode-btn[data-mode]").forEach((button) => {
      if (!(button instanceof HTMLButtonElement)) {
        return;
      }
      const mode = String(button.dataset.mode || "");
      const active = mode === dataStudioMode;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function setupCompactSettingsExperience() {
    const panel = refs.settingsPanel;
    if (!(panel instanceof HTMLElement)) {
      return;
    }

    ensureSettingsCompactControls(panel);
    applyCompactSettingsMode(compactSettingsMode, { persist: false });
    applySettingsSearchFilter(readSettingsSearchQuery(panel));

    if (panel.dataset.compactBound === "1") {
      return;
    }
    panel.dataset.compactBound = "1";

    panel.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      const compactToggle = event.target.closest("[data-action='toggle-compact-settings']");
      if (compactToggle instanceof HTMLElement) {
        applyCompactSettingsMode(!compactSettingsMode, { persist: true });
        return;
      }

      const tabSwitch = event.target.closest("[data-action='switch-settings-tab']");
      if (tabSwitch instanceof HTMLElement) {
        window.setTimeout(() => {
          applySettingsSearchFilter(readSettingsSearchQuery(panel));
        }, 40);
      }
    });

    panel.addEventListener("input", (event) => {
      if (!(event.target instanceof HTMLInputElement)) {
        return;
      }
      if (event.target.id !== "settingsQuickSearchInput") {
        return;
      }
      window.clearTimeout(settingsSearchTimerId);
      settingsSearchTimerId = window.setTimeout(() => {
        applySettingsSearchFilter(event.target.value);
      }, SETTINGS_SEARCH_DEBOUNCE_MS);
    });
  }

  function ensureSettingsCompactControls(panel) {
    if (!(panel instanceof HTMLElement)) {
      return;
    }

    const header = panel.querySelector(".settings-panel-head");
    if (!(header instanceof HTMLElement)) {
      return;
    }

    if (!(header.querySelector(".settings-compact-tools") instanceof HTMLElement)) {
      const tools = document.createElement("div");
      tools.className = "settings-compact-tools";
      tools.innerHTML =
        '<button type="button" class="settings-compact-btn" data-action="toggle-compact-settings" aria-pressed="false">نمای فشرده</button>' +
        '<label class="settings-quick-search-wrap" for="settingsQuickSearchInput">' +
        '<span class="settings-quick-search-label">جستجو</span>' +
        '<input id="settingsQuickSearchInput" class="settings-quick-search-input" type="search" autocomplete="off" placeholder="جستجو در تنظیمات...">' +
        "</label>" +
        '<small class="settings-search-empty" hidden>موردی با این عبارت در تب فعال پیدا نشد.</small>';
      header.append(tools);
    }
  }

  function applyCompactSettingsMode(enabled, options = {}) {
    compactSettingsMode = !!enabled;
    if (options.persist !== false) {
      persistStoredBoolean(SETTINGS_COMPACT_KEY, compactSettingsMode);
    }
    syncCompactSettingsState();
  }

  function syncCompactSettingsState() {
    const panel = refs.settingsPanel;
    if (!(panel instanceof HTMLElement)) {
      return;
    }

    panel.classList.toggle("is-compact-mode", compactSettingsMode);
    document.body.classList.toggle("settings-compact-mode", compactSettingsMode);

    const button = panel.querySelector(".settings-compact-btn");
    if (button instanceof HTMLButtonElement) {
      button.classList.toggle("is-active", compactSettingsMode);
      button.setAttribute("aria-pressed", compactSettingsMode ? "true" : "false");
      button.textContent = compactSettingsMode ? "نمای استاندارد" : "نمای فشرده";
    }
  }

  function readSettingsSearchQuery(panel) {
    if (!(panel instanceof HTMLElement)) {
      return "";
    }
    const input = panel.querySelector("#settingsQuickSearchInput");
    if (!(input instanceof HTMLInputElement)) {
      return "";
    }
    return String(input.value || "").trim().toLowerCase();
  }

  function applySettingsSearchFilter(rawQuery) {
    const panel = refs.settingsPanel;
    if (!(panel instanceof HTMLElement)) {
      return;
    }

    const query = String(rawQuery || "").trim().toLowerCase();
    const activePanel = panel.querySelector(".settings-tab-panel.is-active");
    if (!(activePanel instanceof HTMLElement)) {
      return;
    }

    const blocks = activePanel.querySelectorAll(
      ".settings-mode-card, .control-field, .drive-field-group, .settings-utility-card, .drive-diag-item, .drive-sync-diagnostics-log, .settings-inline-actions"
    );

    let matchedCount = 0;
    blocks.forEach((block) => {
      if (!(block instanceof HTMLElement)) {
        return;
      }
      if (!query) {
        block.classList.remove("settings-search-hidden");
        block.removeAttribute("data-search-match");
        matchedCount += 1;
        return;
      }

      const haystack = String(block.textContent || "").replace(/\s+/g, " ").toLowerCase();
      const matched = haystack.includes(query);
      block.classList.toggle("settings-search-hidden", !matched);
      block.dataset.searchMatch = matched ? "1" : "0";
      if (matched) {
        matchedCount += 1;
      }
    });

    const empty = panel.querySelector(".settings-search-empty");
    if (empty instanceof HTMLElement) {
      empty.hidden = !(query && matchedCount === 0);
    }
  }

  function setupNetworkPill() {
    const pill = document.createElement("div");
    pill.id = "appNetworkPill";
    pill.className = "app-network-pill";
    pill.hidden = true;
    pill.setAttribute("aria-live", "polite");
    pill.setAttribute("aria-atomic", "true");
    document.body.appendChild(pill);
    refs.networkPill = pill;

    const sync = () => {
      const online = navigator.onLine !== false;
      renderNetworkPill(online);
    };

    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
  }

  function renderNetworkPill(online) {
    const pill = refs.networkPill;
    if (!(pill instanceof HTMLElement)) {
      return;
    }

    if (online) {
      document.body.classList.remove("is-offline");
      syncOfflineActionGuards(true);
      pill.dataset.state = "online";
      pill.textContent = "آنلاین";
      pill.hidden = false;
      window.clearTimeout(scrollReadTimerId);
      scrollReadTimerId = window.setTimeout(() => {
        if (navigator.onLine !== false) {
          pill.hidden = true;
        }
      }, 1700);
      return;
    }

    document.body.classList.add("is-offline");
    syncOfflineActionGuards(false);
    pill.dataset.state = "offline";
    pill.textContent = "آفلاین";
    pill.hidden = false;
  }

  function syncOfflineActionGuards(isOnline) {
    const syncSelectors = [
      "[data-action='sync-google-drive']",
      "[data-action='sync-upload']",
      "[data-action='sync-download']",
      "[data-action='save-drive-credentials']"
    ];

    document.querySelectorAll(syncSelectors.join(", ")).forEach((node) => {
      if (!(node instanceof HTMLButtonElement)) {
        return;
      }
      if (isOnline) {
        if (node.dataset.offlineGuardDisabled === "1") {
          node.disabled = false;
          node.setAttribute("aria-disabled", "false");
          node.dataset.offlineGuardDisabled = "0";
          if (node.dataset.offlineGuardTitle) {
            node.title = node.dataset.offlineGuardTitle;
          } else {
            node.removeAttribute("title");
          }
        }
        return;
      }

      if (node.disabled) {
        return;
      }
      node.dataset.offlineGuardDisabled = "1";
      node.dataset.offlineGuardTitle = node.getAttribute("title") || "";
      node.disabled = true;
      node.setAttribute("aria-disabled", "true");
      node.title = "این عملیات نیاز به اینترنت دارد.";
    });
  }

  function bindGlobalTouchHaptic() {
    if (typeof navigator.vibrate !== "function") {
      return;
    }

    document.body.addEventListener(
      "click",
      (event) => {
        if (!shouldUseHaptic()) {
          return;
        }
        if (!(event.target instanceof Element)) {
          return;
        }
        const pressable = event.target.closest("[data-action], button, .glass-btn, .tab-btn, .pwa-mobile-dock-btn");
        if (!(pressable instanceof HTMLElement)) {
          return;
        }
        if (pressable.hasAttribute("disabled") || pressable.getAttribute("aria-disabled") === "true") {
          return;
        }

        const now = getNowMs();
        if (now - hapticLastAt < HAPTIC_MIN_GAP_MS) {
          return;
        }

        const action = String(pressable.dataset.action || "").trim();
        const isStrong = STRONG_HAPTIC_ACTIONS.has(action);
        navigator.vibrate(isStrong ? 12 : 8);
        hapticLastAt = now;
      },
      true
    );
  }

  function shouldUseHaptic() {
    return isLikelyMobileLikeMode() || isStandaloneMode();
  }

  function bindNavigationLoadingFeedback() {
    const container = refs.levelContainer;
    if (!(container instanceof HTMLElement)) {
      return;
    }

    document.body.addEventListener(
      "click",
      (event) => {
        if (!(event.target instanceof Element)) {
          return;
        }
        const actionNode = event.target.closest("[data-action]");
        if (!(actionNode instanceof HTMLElement)) {
          return;
        }
        const action = String(actionNode.dataset.action || "").trim();
        if (!NAVIGATION_ACTIONS.has(action)) {
          return;
        }
        rememberCurrentScroll();
        // Click-based navigation should keep current viewport and never force jump-to-top.
        pendingNavigationRestore = false;
        showViewLoadingState();
      },
      true
    );

    const observer = new MutationObserver(() => {
      hideViewLoadingState();
      scheduleScrollRestoreIfNeeded();
      scheduleImagePrefetch();
      schedulePostRenderSync();
      if (isSplashVisible() && container.childElementCount > 0) {
        setBootSplashMessage("تقریبا آماده است...");
      }
    });
    observer.observe(container, { childList: true });
  }

  function showViewLoadingState() {
    const container = refs.levelContainer;
    if (!(container instanceof HTMLElement)) {
      return;
    }
    window.clearTimeout(loadingRevealTimerId);
    window.clearTimeout(loadingGuardTimerId);

    loadingRevealTimerId = window.setTimeout(() => {
      container.classList.add("is-view-loading");
    }, LOADING_REVEAL_DELAY_MS);
    loadingGuardTimerId = window.setTimeout(() => {
      container.classList.remove("is-view-loading");
    }, LOADING_GUARD_MAX_MS);
  }

  function hideViewLoadingState() {
    const container = refs.levelContainer;
    if (!(container instanceof HTMLElement)) {
      return;
    }
    window.clearTimeout(loadingRevealTimerId);
    window.clearTimeout(loadingGuardTimerId);
    container.classList.remove("is-view-loading");
  }

  function bindSwipeTabNavigation() {
    const container = refs.levelContainer;
    if (!(container instanceof HTMLElement)) {
      return;
    }

    container.addEventListener("pointerdown", handleSwipePointerDown, { passive: true });
    container.addEventListener("pointerup", handleSwipePointerUp, { passive: true });
    container.addEventListener("pointercancel", resetSwipeTrack, { passive: true });
  }

  function handleSwipePointerDown(event) {
    if (!isLikelyMobileLikeMode()) {
      return;
    }
    if (!(event.target instanceof Element)) {
      return;
    }
    if (event.pointerType === "mouse") {
      return;
    }
    if (isSwipeIgnoredTarget(event.target)) {
      return;
    }
    if (!canSwipeBetweenTabs()) {
      return;
    }

    swipeTrack.active = true;
    swipeTrack.startX = Number(event.clientX) || 0;
    swipeTrack.startY = Number(event.clientY) || 0;
    swipeTrack.startedAt = getNowMs();
    swipeTrack.pointerId = Number(event.pointerId) || -1;
  }

  function handleSwipePointerUp(event) {
    if (!swipeTrack.active) {
      return;
    }

    const samePointer = swipeTrack.pointerId === (Number(event.pointerId) || -1);
    if (!samePointer) {
      resetSwipeTrack();
      return;
    }

    const now = getNowMs();
    if (now < swipeLockUntil) {
      resetSwipeTrack();
      return;
    }

    const dx = (Number(event.clientX) || 0) - swipeTrack.startX;
    const dy = (Number(event.clientY) || 0) - swipeTrack.startY;
    const elapsed = now - swipeTrack.startedAt;
    resetSwipeTrack();

    if (elapsed > SWIPE_MAX_DURATION_MS) {
      return;
    }
    if (Math.abs(dx) < SWIPE_MIN_DISTANCE_PX) {
      return;
    }
    if (Math.abs(dx) < Math.abs(dy) * 1.25) {
      return;
    }

    const direction = dx < 0 ? 1 : -1;
    const switched = switchTabByDirection(direction);
    if (switched) {
      swipeLockUntil = now + SWIPE_LOCK_MS;
      if (shouldUseHaptic() && typeof navigator.vibrate === "function") {
        navigator.vibrate(10);
      }
    }
  }

  function resetSwipeTrack() {
    swipeTrack.active = false;
    swipeTrack.startX = 0;
    swipeTrack.startY = 0;
    swipeTrack.startedAt = 0;
    swipeTrack.pointerId = -1;
  }

  function canSwipeBetweenTabs() {
    if (isQuestionFocusBankLockActive()) {
      return false;
    }
    const bankBtn = document.getElementById("headerQuickTabBank");
    return bankBtn instanceof HTMLButtonElement && !bankBtn.disabled;
  }

  function isSwipeIgnoredTarget(target) {
    if (!(target instanceof Element)) {
      return true;
    }
    return !!target.closest(
      "input, textarea, select, button, a, [contenteditable='true'], .question-asset-viewer, .question-asset-viewer-stage, .schema-modal-card, .settings-panel, .profile-hub"
    );
  }

  function switchTabByDirection(direction) {
    if (isQuestionFocusBankLockActive()) {
      return false;
    }
    const activeTab = getActiveTabKey();
    if (!activeTab) {
      return false;
    }
    const currentIndex = TAB_ORDER.indexOf(activeTab);
    if (currentIndex < 0) {
      return false;
    }

    const nextIndex = currentIndex + direction;
    if (nextIndex < 0 || nextIndex >= TAB_ORDER.length) {
      return false;
    }

    const nextTab = TAB_ORDER[nextIndex];
    const nextBtn = resolveTabButton(nextTab);
    if (!(nextBtn instanceof HTMLButtonElement) || nextBtn.disabled) {
      return false;
    }
    rememberCurrentScroll();
    pendingNavigationRestore = true;
    nextBtn.click();
    return true;
  }

  function getActiveTabKey() {
    const activeHeaderTab = document.querySelector(".appbar-segment-btn[data-action='switch-tab'].is-active[data-tab]");
    if (activeHeaderTab instanceof HTMLElement) {
      const tab = String(activeHeaderTab.dataset.tab || "").trim();
      if (TAB_ORDER.includes(tab)) {
        return tab;
      }
    }

    const activeDockTab = document.querySelector(".pwa-mobile-dock-btn[data-action='switch-tab'].is-active[data-tab]");
    if (activeDockTab instanceof HTMLElement) {
      const tab = String(activeDockTab.dataset.tab || "").trim();
      if (TAB_ORDER.includes(tab)) {
        return tab;
      }
    }

    return "";
  }

  function resolveTabButton(tab) {
    return (
      document.querySelector(`.appbar-segment-btn[data-action='switch-tab'][data-tab='${tab}']`) ||
      document.querySelector(`.appbar-overflow-item[data-action='switch-tab'][data-tab='${tab}']`) ||
      document.querySelector(`.appbar-sections-item[data-action='switch-tab'][data-tab='${tab}']`) ||
      document.querySelector(`.pwa-mobile-dock-btn[data-action='switch-tab'][data-tab='${tab}']`)
    );
  }

  function setupScrollMemorySync() {
    const onScroll = () => {
      window.clearTimeout(scrollPersistTimerId);
      scrollPersistTimerId = window.setTimeout(() => {
        rememberCurrentScroll();
      }, 140);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("beforeunload", rememberCurrentScroll);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        rememberCurrentScroll();
      }
    });

    window.setTimeout(() => {
      scheduleScrollRestoreIfNeeded({ force: true });
    }, 420);
  }

  function rememberCurrentScroll() {
    const key = buildViewKey();
    if (!key) {
      return;
    }
    const y = Math.max(0, Math.round(window.scrollY || window.pageYOffset || 0));
    if (!Number.isFinite(y)) {
      return;
    }
    setScrollMemoryEntry(key, y);
  }

  function scheduleScrollRestoreIfNeeded(options = {}) {
    const forceRestore = options.force === true;
    const allowRestore = forceRestore || pendingNavigationRestore;
    if (!allowRestore) {
      const currentKey = buildViewKey();
      if (currentKey) {
        lastViewKey = currentKey;
      }
      return;
    }

    if (scrollRestoreRafId) {
      window.cancelAnimationFrame(scrollRestoreRafId);
      scrollRestoreRafId = 0;
    }

    scrollRestoreRafId = window.requestAnimationFrame(() => {
      scrollRestoreRafId = 0;
      const key = buildViewKey();
      if (!key) {
        pendingNavigationRestore = false;
        return;
      }
      const storedY = Number(scrollMemory.values[key]);
      if (!Number.isFinite(storedY)) {
        // Keep current viewport when this view key has no stored scroll yet.
        // This prevents accidental jump-to-top during local UI updates/rerenders.
        lastViewKey = key;
        pendingNavigationRestore = false;
        return;
      }
      const nextY = Math.max(0, storedY);
      const currentY = Math.max(0, Math.round(window.scrollY || window.pageYOffset || 0));
      if (nextY <= 2 && currentY > 24) {
        // Never yank user to top when a zero-position snapshot exists for target view.
        lastViewKey = key;
        pendingNavigationRestore = false;
        return;
      }
      if (Math.abs(currentY - nextY) > 2) {
        window.scrollTo(0, nextY);
      }
      lastViewKey = key;
      pendingNavigationRestore = false;
    });
  }

  function buildViewKey() {
    const parts = [];
    const title = readText(refs.headerPageTitle);
    const mode = readText(refs.headerQuickMode);
    const context = readText(refs.headerQuickContext);
    const breadcrumb = readText(refs.breadcrumbs);

    if (title) {
      parts.push(title);
    }
    if (mode) {
      parts.push(mode);
    }
    if (context) {
      parts.push(context);
    }
    if (breadcrumb) {
      parts.push(breadcrumb);
    }

    return parts.join(" | ").trim();
  }

  function readText(node) {
    if (!(node instanceof HTMLElement)) {
      return "";
    }
    return String(node.textContent || "").replace(/\s+/g, " ").trim();
  }

  function loadScrollMemory() {
    try {
      const raw = sessionStorage.getItem(SCROLL_MEMORY_KEY);
      if (!raw) {
        return { order: [], values: {} };
      }
      const parsed = JSON.parse(raw);
      const order = Array.isArray(parsed?.order) ? parsed.order.filter((key) => typeof key === "string") : [];
      const valuesSource = parsed?.values && typeof parsed.values === "object" ? parsed.values : {};
      const values = {};
      order.forEach((key) => {
        const y = Number(valuesSource[key]);
        if (Number.isFinite(y) && y >= 0) {
          values[key] = y;
        }
      });
      return { order, values };
    } catch {
      return { order: [], values: {} };
    }
  }

  function setScrollMemoryEntry(key, y) {
    if (!key) {
      return;
    }

    const nextOrder = scrollMemory.order.filter((item) => item !== key);
    nextOrder.push(key);

    while (nextOrder.length > MAX_SCROLL_MEMORY_ENTRIES) {
      const stale = nextOrder.shift();
      if (stale) {
        delete scrollMemory.values[stale];
      }
    }

    scrollMemory.order = nextOrder;
    scrollMemory.values[key] = y;
    persistScrollMemoryDebounced();
  }

  function persistScrollMemoryDebounced() {
    window.clearTimeout(scrollPersistTimerId);
    scrollPersistTimerId = window.setTimeout(() => {
      try {
        sessionStorage.setItem(SCROLL_MEMORY_KEY, JSON.stringify(scrollMemory));
      } catch {
        // ignore storage quota errors
      }
    }, 160);
  }

  function applyDeepLinkFromSearch() {
    const instruction = resolveDeepLinkInstruction();
    if (!instruction) {
      return;
    }
    const tryApply = () => {
      if (deepLinkApplied) {
        return true;
      }
      const target = resolveDeepLinkTarget(instruction);
      if (!(target instanceof HTMLButtonElement) || target.disabled) {
        return false;
      }
      rememberCurrentScroll();
      pendingNavigationRestore = true;
      target.click();
      deepLinkApplied = true;
      cleanupDeepLinkSearchParams();
      return true;
    };

    if (tryApply()) {
      return;
    }

    deepLinkRetryTimerId = window.setInterval(() => {
      deepLinkRetryCount += 1;
      if (tryApply() || deepLinkRetryCount >= DEEP_LINK_MAX_RETRIES) {
        window.clearInterval(deepLinkRetryTimerId);
        deepLinkRetryTimerId = 0;
      }
    }, DEEP_LINK_RETRY_DELAY_MS);
  }

  function resolveDeepLinkInstruction() {
    const params = new URLSearchParams(window.location.search || "");
    const raw = String(params.get("mode") || params.get("tab") || "").trim().toLowerCase();
    if (!raw) {
      return null;
    }

    if (["subjects", "home"].includes(raw)) {
      return { type: "goto", action: "goto-subjects" };
    }
    if (["chapters", "chapter"].includes(raw)) {
      return { type: "goto", action: "goto-chapters" };
    }
    if (["bank", "practice", "exam", "chapter-map", "map", "tree", "mindmap"].includes(raw)) {
      const tab = raw === "map" || raw === "tree" || raw === "mindmap" ? "chapter-map" : raw;
      return { type: "tab", tab };
    }
    return null;
  }

  function resolveDeepLinkTarget(instruction) {
    if (!instruction) {
      return null;
    }

    if (instruction.type === "goto") {
      const selector = `.appbar-segment-btn[data-action='${instruction.action}'], .appbar-overflow-item[data-action='${instruction.action}'], .appbar-sections-item[data-action='${instruction.action}'], .pwa-mobile-dock-btn[data-action='${instruction.action}']`;
      return document.querySelector(selector);
    }

    if (instruction.type === "tab") {
      return resolveTabButton(instruction.tab);
    }

    return null;
  }

  function cleanupDeepLinkSearchParams() {
    const url = new URL(window.location.href);
    if (!url.searchParams.has("mode") && !url.searchParams.has("tab")) {
      return;
    }
    url.searchParams.delete("mode");
    url.searchParams.delete("tab");
    const nextSearch = url.searchParams.toString();
    const nextUrl = `${url.pathname}${nextSearch ? `?${nextSearch}` : ""}${url.hash}`;
    window.history.replaceState(window.history.state, "", nextUrl);
  }

  function getQuestionDeferObserver() {
    if (questionDeferObserver) {
      return questionDeferObserver;
    }
    if (!("IntersectionObserver" in window)) {
      return null;
    }

    questionDeferObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          const slot = entry.target;
          if (!(slot instanceof HTMLElement)) {
            return;
          }
          questionDeferObserver?.unobserve(slot);
          mountQuestionDeferredSlot(slot);
        });
      },
      {
        root: null,
        rootMargin: QUESTION_DEFER_ROOT_MARGIN,
        threshold: 0.02
      }
    );

    return questionDeferObserver;
  }

  function applyQuestionBankDeferredMount() {
    const list = document.querySelector(
      ".question-bank-panel:not(.practice-mode-panel):not(.exam-mode-panel):not(.chapter-map-panel) .question-list"
    );
    if (!(list instanceof HTMLElement)) {
      return;
    }

    if (list.dataset.deferEnhanced === "1") {
      return;
    }

    const cards = Array.from(list.children).filter(
      (node) => node instanceof HTMLElement && node.classList.contains("question-card")
    );
    if (cards.length <= QUESTION_DEFER_START_INDEX + 1) {
      list.dataset.deferEnhanced = "1";
      return;
    }

    const observer = getQuestionDeferObserver();
    if (!observer) {
      list.dataset.deferEnhanced = "1";
      return;
    }

    cards
      .slice(QUESTION_DEFER_START_INDEX, QUESTION_DEFER_START_INDEX + QUESTION_DEFER_MAX_COUNT)
      .forEach((card, index) => {
        const slot = document.createElement("div");
        slot.className = "question-virtual-slot";
        slot.dataset.slotIndex = String(index + QUESTION_DEFER_START_INDEX);
        slot.style.minHeight = `${estimateQuestionCardHeight(card)}px`;
        slot.append(createQuestionVirtualSkeleton());
        slot._deferredCard = card;
        card.replaceWith(slot);
        observer.observe(slot);
      });

    list.dataset.deferEnhanced = "1";
  }

  function mountQuestionDeferredSlot(slot) {
    if (!(slot instanceof HTMLElement)) {
      return;
    }

    const card = slot._deferredCard;
    if (!(card instanceof HTMLElement)) {
      return;
    }
    const parent = slot.parentElement;
    if (!(parent instanceof HTMLElement)) {
      return;
    }

    parent.replaceChild(card, slot);

    const plugin = window.QuestionPdfAssetPlugin;
    if (plugin && typeof plugin.hydrateAssetsInRoot === "function") {
      Promise.resolve(plugin.hydrateAssetsInRoot(card)).catch(() => {});
    }
  }

  function estimateQuestionCardHeight(card) {
    if (!(card instanceof HTMLElement)) {
      return QUESTION_DEFER_MIN_HEIGHT;
    }
    const rect = card.getBoundingClientRect();
    const rectHeight = Math.round(rect.height);
    if (Number.isFinite(rectHeight) && rectHeight >= QUESTION_DEFER_MIN_HEIGHT) {
      return rectHeight;
    }
    const offset = Math.round(card.offsetHeight || 0);
    if (Number.isFinite(offset) && offset >= QUESTION_DEFER_MIN_HEIGHT) {
      return offset;
    }
    return QUESTION_DEFER_MIN_HEIGHT;
  }

  function createQuestionVirtualSkeleton() {
    const shell = document.createElement("div");
    shell.className = "question-virtual-skeleton";
    shell.innerHTML =
      '<i class="question-virtual-line question-virtual-line-lg"></i>' +
      '<i class="question-virtual-line question-virtual-line-md"></i>' +
      '<i class="question-virtual-line question-virtual-line-sm"></i>';
    return shell;
  }

  function scheduleImagePrefetch() {
    window.clearTimeout(prefetchTimerId);
    prefetchTimerId = window.setTimeout(() => {
      const run = () => prefetchVisibleQuestionImages();
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(run, { timeout: 900 });
      } else {
        run();
      }
    }, PREFETCH_THROTTLE_MS);
  }

  function prefetchVisibleQuestionImages() {
    const candidates = Array.from(
      document.querySelectorAll(".question-asset-image, .question-card img, .practice-question-card img, .exam-paper img")
    )
      .filter((node) => node instanceof HTMLImageElement)
      .filter((img) => !img.complete && !img.dataset.prefetchBoosted)
      .slice(0, 4);

    candidates.forEach((img, index) => {
      img.dataset.prefetchBoosted = "1";
      img.decoding = "async";
      if (img.loading !== "eager") {
        img.loading = index === 0 ? "eager" : "lazy";
      }
      try {
        if ("fetchPriority" in img && index === 0) {
          img.fetchPriority = "high";
        }
      } catch {
        // ignore unsupported property writes
      }
      if (typeof img.decode === "function") {
        img.decode().catch(() => {});
      }
    });
  }
})();
