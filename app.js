(() => {
  "use strict";

  const PAGE_SIZE = 10;
  const LOCAL_JSON_PATH = "./data/subjects.json";
  const DRIVE_SYNC_FILENAME = "uqb_state.json";
  const DRIVE_OAUTH_SCOPE =
    "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata";
  const DRIVE_FILE_SEARCH_SPACES = ["appDataFolder", "drive", ""];
  const DELETE_ANIMATION_MS = 220;
  const SEARCH_DEBOUNCE_MS = 300;
  const MAP_SEARCH_DEBOUNCE_MS = 260;
  const TREE_COLLAPSE_INIT_FLAG = "__mqb_tree_default_collapsed_initialized";
  const AUTO_VIEWPORT_BREAKPOINT = 920;
  const AUTO_VIEWPORT_HYSTERESIS_PX = 72;
  const AUTO_VIEWPORT_TOUCH_DESKTOP_GUARD_PX = 1120;
  const AUTO_VIEWPORT_WIDTH_SPREAD_TOLERANCE_PX = 84;
  const AUTO_VIEWPORT_SWITCH_MIN_INTERVAL_MS = 460;
  const LIVE_TIMER_TICK_MS = 1000;
  const EXAM_LAYOUT_SYNC_THROTTLE_MS = 1400;
  const EXAM_LAYOUT_SYNC_THROTTLE_MOBILE_MS = 4200;
  const EXAM_WARNING_THRESHOLD_MS = 5 * 60 * 1000;
  const EXAM_DURATION_MIN = 1;
  const EXAM_DURATION_MAX = 300;
  const EXAM_DURATION_DEFAULT = 90;
  const EXAM_RUNTIME_AUTOSAVE_INTERVAL_MS = 15000;
  const EXAM_LIBRARY_MAX_ITEMS = 80;
  const PROFILE_DATETIME_TICK_MS = 60 * 1000;
  const RUNTIME_ERROR_STATUS_COOLDOWN_MS = 4000;
  const MOBILE_SOFT_RECOVERY_COOLDOWN_MS = 2600;
  const D3_CDN_URL = "https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js";
  const PROFILE_STORAGE_KEY = "mqb_profile_v1";
  const REVIEW_NOTE_DEBOUNCE_MS = 400;
  const REVIEW_NOTE_MAX_LENGTH = 200;
  const LAST_SESSION_PERSIST_DEBOUNCE_MS = 260;
  const DELETE_UNDO_TOAST_TIMEOUT_MS = 6800;
  const SETTINGS_EXPORT_VERSION = 1;
  const PWA_SERVICE_WORKER_PATH = "./sw.js";
  const DRIVE_TOKEN_EXPIRY_SKEW_MS = 15000;
  const DRIVE_TOKEN_REFRESH_AHEAD_MS = 2 * 60 * 1000;
  const DRIVE_TOKEN_REFRESH_RETRY_MS = 60 * 1000;
  const DRIVE_AUTO_SYNC_DEBOUNCE_MS = 12000;
  const DRIVE_AUTO_PUSH_MIN_INTERVAL_MS = 90000;
  const DRIVE_AUTO_PULL_INTERVAL_MS = 120000;
  const DRIVE_AUTO_PULL_INTERVAL_MOBILE_MS = 180000;
  const DRIVE_AUTO_PULL_MIN_INTERVAL_MS = 90000;
  const DRIVE_AUTO_PULL_MIN_INTERVAL_MOBILE_MS = 140000;
  const DRIVE_AUTO_PULL_PRIME_DELAY_MS = 7000;
  const DRIVE_AUTO_PULL_PRIME_DELAY_MOBILE_MS = 10000;
  const DRIVE_AUTO_PULL_PRIME_MIN_GAP_MS = 60000;
  const DRIVE_SYNC_PROFILE_DEFAULT = "low-power";
  const DRIVE_SYNC_PROFILES = Object.freeze({
    "low-power": {
      label: "کم‌مصرف",
      autoPushDebounceMs: DRIVE_AUTO_SYNC_DEBOUNCE_MS,
      autoPushMinIntervalMs: DRIVE_AUTO_PUSH_MIN_INTERVAL_MS,
      autoPullIntervalDesktopMs: DRIVE_AUTO_PULL_INTERVAL_MS,
      autoPullIntervalMobileMs: DRIVE_AUTO_PULL_INTERVAL_MOBILE_MS,
      autoPullMinDesktopMs: DRIVE_AUTO_PULL_MIN_INTERVAL_MS,
      autoPullMinMobileMs: DRIVE_AUTO_PULL_MIN_INTERVAL_MOBILE_MS,
      autoPullPrimeDelayDesktopMs: DRIVE_AUTO_PULL_PRIME_DELAY_MS,
      autoPullPrimeDelayMobileMs: DRIVE_AUTO_PULL_PRIME_DELAY_MOBILE_MS,
      autoPullPrimeMinGapMs: DRIVE_AUTO_PULL_PRIME_MIN_GAP_MS
    },
    balanced: {
      label: "متعادل",
      autoPushDebounceMs: 7000,
      autoPushMinIntervalMs: 50000,
      autoPullIntervalDesktopMs: 70000,
      autoPullIntervalMobileMs: 95000,
      autoPullMinDesktopMs: 45000,
      autoPullMinMobileMs: 70000,
      autoPullPrimeDelayDesktopMs: 3600,
      autoPullPrimeDelayMobileMs: 5200,
      autoPullPrimeMinGapMs: 35000
    },
    fast: {
      label: "سریع",
      autoPushDebounceMs: 3000,
      autoPushMinIntervalMs: 22000,
      autoPullIntervalDesktopMs: 32000,
      autoPullIntervalMobileMs: 48000,
      autoPullMinDesktopMs: 18000,
      autoPullMinMobileMs: 28000,
      autoPullPrimeDelayDesktopMs: 1800,
      autoPullPrimeDelayMobileMs: 2800,
      autoPullPrimeMinGapMs: 18000
    }
  });
  const DRIVE_FETCH_RETRY_ATTEMPTS = 3;
  const DRIVE_FETCH_RETRY_BASE_DELAY_MS = 420;
  const DRIVE_FETCH_RETRY_MAX_DELAY_MS = 2400;
  const DRIVE_RETRYABLE_STATUS_CODES = new Set([408, 425, 429, 500, 502, 503, 504]);
  const DRIVE_DEBUG_LOG_LIMIT = 120;
  const DRIVE_SYNC_META_PERSIST_DEBOUNCE_MS = 260;
  const DRIVE_DIAG_RENDER_THROTTLE_MS = 320;
  const DRIVE_SCROLL_IDLE_GRACE_MS = 640;
  const DRIVE_SCROLL_DEFER_MAX_MS = 2400;
  const AUTO_MAINTENANCE_START_DELAY_MS = 45000;
  const AUTO_MAINTENANCE_INTERVAL_DESKTOP_MS = 7 * 60 * 1000;
  const AUTO_MAINTENANCE_INTERVAL_MOBILE_MS = 5 * 60 * 1000;
  const AUTO_MAINTENANCE_INTERVAL_HIDDEN_MS = 11 * 60 * 1000;
  const AUTO_MAINTENANCE_MIN_INTERVAL_MS = 90 * 1000;
  const DESKTOP_PERF_LITE_TOTAL_QUESTIONS = 360;
  const DESKTOP_PERF_LITE_CHAPTER_QUESTIONS = 140;
  const DESKTOP_PERF_LITE_TREE_CHAPTERS = 18;
  const DESKTOP_PERF_LITE_SUBJECTS = 14;
  const DESKTOP_PERF_LITE_TOTAL_CHAPTERS = 84;
  const DESKTOP_PERF_LITE_BANK_CHAPTER_QUESTIONS = 90;
  const DESKTOP_PERF_LITE_PRACTICE_EXAM_QUESTIONS = 60;
  const CACHE_KEY_PREFIX = "mqb-";
  const SYNC_SCHEMA_VERSION = 2;
  const THEME_META_COLORS = {
    "dark-graphite": "#13345f",
    "dark-ocean": "#0d4770",
    "dark-forest": "#17533d",
    "dark-ember": "#6a3427",
    "dark-midnight-amethyst": "#2a1f3d",
    "dark-warm-espresso": "#2b2019",
    "dark-deep-teal": "#163b42",
    "dark-crimson-night": "#3a1f2e",
    "dark-lunar-slate": "#2a3443",
    "dark-cosmic-void": "#0e1626",
    "light-paper": "#2b6fb1",
    "light-ice": "#0c86a9"
  };

  const STORAGE_KEYS = {
    data: "mqb_data_v1",
    prefs: "mqb_prefs_v1",
    drive: "mqb_drive_v1",
    review: "mqb_review_meta_v1",
    examLibrary: "mqb_exam_library_v1",
    driveAuth: "mqb_drive_auth_v1",
    driveAuto: "mqb_drive_auto_v1",
    driveSyncProfile: "mqb_drive_sync_profile_v1",
    driveSyncMeta: "mqb_drive_sync_meta_v1",
    driveSyncDebug: "mqb_drive_sync_debug_v1"
  };
  const DRIVE_AUTH_REDIRECT_SESSION_KEY = "mqb_drive_oauth_redirect_v1";

  const VIEWPORT_MODES = ["auto", "mobile", "desktop"];
  const VIEWPORT_LABELS = { auto: "خودکار", mobile: "موبایل", desktop: "دسکتاپ" };
  const APP_VIEW_TRANSITION_MS = 300;
  const APP_PRESSABLE_SELECTOR =
    "button, [role='button'], .tab-btn, .card-btn, .subject-open-btn, .lesson-chapter-open, .tool-btn, .glass-btn, .appbar-segment-btn, .appbar-overflow-item, .appbar-sections-item, .pwa-mobile-dock-btn";

  const THEMES = [
    "dark-graphite",
    "dark-ocean",
    "dark-forest",
    "dark-ember",
    "dark-midnight-amethyst",
    "dark-warm-espresso",
    "dark-deep-teal",
    "dark-crimson-night",
    "dark-lunar-slate",
    "dark-cosmic-void",
    "light-paper",
    "light-ice"
  ];
  const THEME_OPTION_LABELS = {
    "dark-graphite": "تیره گرافیتی",
    "dark-ocean": "تیره اقیانوسی",
    "dark-forest": "تیره جنگلی",
    "dark-ember": "تیره کهربایی",
    "dark-midnight-amethyst": "تیره آمتیست نیمه شب",
    "dark-warm-espresso": "تیره اسپرسو گرم",
    "dark-deep-teal": "تیره سبز آبی عمیق",
    "dark-crimson-night": "تیره شب زرشکی",
    "dark-lunar-slate": "تیره سنگی مهتابی",
    "dark-cosmic-void": "تیره خلأ کیهانی",
    "light-paper": "روشن کاغذی",
    "light-ice": "روشن یخی"
  };
  const THEME_QUICK_DOT_CLASS = {
    "dark-graphite": "profile-theme-dot-graphite",
    "dark-ocean": "profile-theme-dot-ocean",
    "dark-forest": "profile-theme-dot-forest",
    "dark-ember": "profile-theme-dot-ember",
    "dark-midnight-amethyst": "profile-theme-dot-amethyst",
    "dark-warm-espresso": "profile-theme-dot-espresso",
    "dark-deep-teal": "profile-theme-dot-teal",
    "dark-crimson-night": "profile-theme-dot-crimson",
    "dark-lunar-slate": "profile-theme-dot-lunar",
    "dark-cosmic-void": "profile-theme-dot-void",
    "light-paper": "profile-theme-dot-light",
    "light-ice": "profile-theme-dot-ice"
  };

  const DIFFICULTY_PROFILES = {
    medium: { min: 2, max: 4 },
    hard: { min: 4, max: 5 }
  };

  const DEFAULT_DRIVE_CONFIG = { clientId: "", fileId: "" };
  const LEGACY_DEFAULT_SUBJECT_IDS = new Set(["algebra", "calculus"]);
  const LEGACY_DEFAULT_SUBJECT_NAME_KEYS = new Set(["جبر", "حسابان", "algebra", "calculus"]);

  const state = {
    subjects: [],
    terms: {},
    view: { level: 1, subjectId: null, chapterId: null, tab: "bank" },
    pagination: { page: 1, pageSize: PAGE_SIZE },
    theme: "dark-graphite",
    viewportMode: "auto",
    viewportAutoResolved: "desktop",
    allowScheduleLandscape: false,
    katex: { ready: false, loadingPromise: null },
    gapi: {
      ready: false,
      loadingPromise: null,
      tokenClient: null,
      configKey: "",
      accessToken: "",
      accessTokenExpiresAt: 0,
      syncInFlight: false,
      autoSyncEnabled: false
    },
    sync: {
      profile: DRIVE_SYNC_PROFILE_DEFAULT,
      debugEnabled: false,
      lockOwner: "",
      handshakeInProgress: false,
      pullInProgress: false,
      pushInProgress: false,
      suppressLocalEditTracking: false,
      localHash: "",
      lastPushAt: "",
      lastPullAt: "",
      lastSyncedAt: "",
      lastLocalEditAt: "",
      lastMergeResult: {
        subjects: 0,
        chapters: 0,
        questions: 0,
        localAdded: 0,
        remoteAdded: 0,
        termsTouched: 0,
        mode: "none"
      },
      remote: {
        fileId: "",
        modifiedTime: "",
        md5Checksum: ""
      },
      lastError: "",
      lastErrorStack: "",
      debugEvents: []
    },
    d3: { ready: false, loadingPromise: null },
    examLibrary: []
  };

  const chapterRuntime = new Map();
  const chapterUiState = new Map();
  const chapterMapUiState = new Map();
  const chapterTreeCollapseState = new Map();
  const visibleQuestionLookup = new Map();
  const questionSearchTextCache = new WeakMap();
  const questionTopicMetaCache = new WeakMap();
  const questionNormalizedLengthCache = new WeakMap();
  const questionExportCache = new WeakMap();
  const subjectQuestionCountCache = new WeakMap();
  const chapterAverageDifficultyCache = new WeakMap();
  const subjectSummaryCache = new WeakMap();
  const subjectQuestionIndexCache = new WeakMap();
  const chapterTopicOptionsCache = new Map();
  const chapterReviewSnapshotCache = new Map();
  const bankFilterResultCache = new Map();
  const pressFeedbackTimers = new WeakMap();
  const debouncedBankSearchUpdate = debounce(applyBankSearchFilter, SEARCH_DEBOUNCE_MS);
  const debouncedChapterMapSearchUpdate = debounce(applyChapterMapSearch, MAP_SEARCH_DEBOUNCE_MS);
  const debouncedAutoViewportRefresh = debounce(refreshAutoViewportModeIfNeeded, 120);
  const debouncedChapterMapViewportRefresh = debounce(refreshChapterMapLayoutIfNeeded, 180);
  const debouncedPersistLastSession = debounce(persistLastSessionPreferences, LAST_SESSION_PERSIST_DEBOUNCE_MS);
  const reviewNoteDebounceMap = new Map();
  const reviewNoteSavedIndicatorTimers = new Map();
  const settingsStatsCache = {
    revision: -1,
    stats: { subjects: 0, chapters: 0, questions: 0 }
  };

  let mathObserver = null;
  let statusTimer = null;
  let activeChapterMapView = null;
  let liveTimerIntervalId = null;
  let questionFloatTimerWidget = null;
  let lastExamLayoutSyncAtMs = 0;
  let lastExamLayoutHeaderBottom = -1;
  let lastExamLayoutPanelHeight = -1;
  let mobilePerformanceLite = false;
  let desktopPerformanceLite = false;
  let standaloneAppUltraPerformance = false;
  let driveAutoSyncTimerId = null;
  let driveAutoPullTimerId = null;
  let driveAutoPullPrimeTimerId = null;
  let driveAutoPullDeferredTimerId = null;
  let driveAuthRequestPromise = null;
  let driveAuthRefreshTimerId = null;
  let driveSyncLockQueue = Promise.resolve();
  let driveSyncMetaPersistTimerId = null;
  let driveDiagRenderTimerId = null;
  let driveDiagLastRenderAtMs = 0;
  let driveScrollActiveUntilMs = 0;
  let driveLastAutoPushAtMs = 0;
  let driveLastAutoPullAtMs = 0;
  let driveAutoAuthGuardNotifiedAtMs = 0;
  let driveDeferredRenderTimerId = null;
  let deferredInstallPromptEvent = null;
  let profileDateTimeIntervalId = null;
  let profileDateTimePrimeTimeoutId = null;
  let subjectsRevision = 0;
  let renderRafId = 0;
  let renderQueued = false;
  let examFocusLockHintAtMs = 0;
  let examFocusLockStateActive = false;
  let examFocusTrapGestureListenersActive = false;
  let lastRuntimeErrorStatusAtMs = 0;
  let mobileSoftRecoveryLockedUntilMs = 0;
  let viewportResizeRafId = 0;
  let headerLiftRafId = 0;
  let lastViewportResizeWidth = 0;
  let lastViewportResizeHeight = 0;
  let autoViewportLastResolvedAtMs = 0;
  let autoViewportLastSwitchWidth = 0;
  let autoMaintenanceTimerId = null;
  let autoMaintenanceInFlight = false;
  let autoMaintenanceLastRunAtMs = 0;
  let reviewMetadataRevision = 0;
  let examAnswerHydrationToken = 0;
  let examEvalRefreshTimerId = 0;
  let bootSplashDismissed = false;
  let renderTransitionCleanupTimerId = 0;
  let lastRenderContextKey = "";
  let standaloneScrollSyncRafId = 0;
  let lastStandaloneScrollTopEnabled = null;
  let lastStandaloneScrollTopVisible = null;
  let mathRenderFlushRafId = 0;
  let mathRenderFlushPending = false;
  let mathWarmupPromise = null;
  let pendingSessionRestoreSnapshot = null;
  let lastPersistedPreferencesSignature = "";
  let lastRequestedOrientationPolicyMode = "";
  let lastExamRuntimeAutosaveAtMs = 0;
  let pendingDeleteUndoToken = "";
  let queuedMathNodes = new WeakSet();
  let pendingMathRenderQueue = [];
  let assetHydrationRafId = 0;
  let pendingAssetHydrationRoots = new Set();
  let questionPdfPreviewObjectUrl = "";
  let hasRunningQuestionTimersCache = false;
  let hasRunningQuestionTimersCacheValid = false;
  let uiHealthCheckRafId = 0;
  let uiHealthLastIssueContext = "";
  let lastUiEventRecoveryAtMs = 0;

  const refs = {
    levelContainer: document.getElementById("levelContainer"),
    appBootSplash: document.getElementById("appBootSplash"),
    breadcrumbs: document.getElementById("breadcrumbs"),
    themeSelect: document.getElementById("themeSelect"),
    viewportModeBar: document.getElementById("viewportModeBar"),
    scheduleLandscapeToggleBtn: document.getElementById("scheduleLandscapeToggleBtn"),
    scheduleLandscapeToggleState: document.getElementById("scheduleLandscapeToggleState"),
    settingsPanel: document.getElementById("settingsPanel"),
    settingsPanelToggle: document.getElementById("settingsPanelToggle"),
    headerRoot: document.querySelector(".topbar.premium-topbar.app-header-v3"),
    headerBackBtn: document.getElementById("headerBackBtn"),
    headerPageTitle: document.getElementById("headerPageTitle"),
    headerQuickContext: document.getElementById("headerQuickContext"),
    headerQuickMode: document.getElementById("headerQuickMode"),
    headerSyncPill: document.getElementById("headerSyncPill"),
    headerSearchBtn: document.getElementById("headerSearchBtn"),
    headerOverflowToggle: document.getElementById("headerOverflowToggle"),
    headerOverflowMenu: document.getElementById("headerOverflowMenu"),
    headerSectionsToggle: document.getElementById("headerSectionsToggle"),
    headerSectionsSheet: document.getElementById("headerSectionsSheet"),
    headerQuickGotoSubjects: document.getElementById("headerQuickGotoSubjects"),
    headerQuickGotoChapters: document.getElementById("headerQuickGotoChapters"),
    headerQuickTabBank: document.getElementById("headerQuickTabBank"),
    headerQuickTabPractice: document.getElementById("headerQuickTabPractice"),
    headerQuickTabExam: document.getElementById("headerQuickTabExam"),
    headerQuickTabMap: document.getElementById("headerQuickTabMap"),
    pwaMobileDock: document.getElementById("pwaMobileDock"),
    pwaScrollTopBtn: document.getElementById("pwaScrollTopBtn"),
    statusBar: document.getElementById("statusBar"),
    jsonImportDiagnostics: document.getElementById("jsonImportDiagnostics"),
    driveClientId: document.getElementById("driveClientId"),
    driveFileId: document.getElementById("driveFileId"),
    driveSyncProfileSelect: document.getElementById("driveSyncProfileSelect"),
    driveSyncProfileHint: document.getElementById("driveSyncProfileHint"),
    driveSyncDebugToggle: document.getElementById("driveSyncDebugToggle"),
    toastStack: document.getElementById("toastStack")
  };
  const questionPdfAssetPlugin =
    window.QuestionPdfAssetPlugin && typeof window.QuestionPdfAssetPlugin === "object"
      ? window.QuestionPdfAssetPlugin
      : null;

  init();

  function init() {
    bindGlobalEvents();
    forceReleaseExamFocusLock("init");
    syncThemeSwitcherThemes();
    restorePreferences();
    restoreDriveConfig();
    const driveAuthRedirectResult = consumeDriveOAuthRedirectResult();
    if (driveAuthRedirectResult?.handled) {
      if (driveAuthRedirectResult.ok) {
        const successMessage = "ورود گوگل با موفقیت انجام شد. همگام سازی آماده است.";
        showToast(successMessage, "success", 3200);
        setStatus(successMessage, "ok");
      } else {
        const failureMessage = resolveDriveSyncFailureMessage(
          driveAuthRedirectResult.error,
          "ورود گوگل ناموفق بود."
        );
        showToast(failureMessage, "error", 4200);
        setStatus(failureMessage, "error");
      }
    }
    restoreDriveAutoSyncPreference();
    restoreDriveSyncProfilePreference();
    restoreSyncDebugPreference();
    restoreDriveSyncMeta();
    restoreReviewMetadata();
    restoreExamLibrary();
    ensureQuestionFloatTimerWidget();
    syncPwaDisplayModeClasses();
    syncPwaInstallActionState();
    registerPwaServiceWorker();
    setupAutomaticMaintenanceLoop();

    bootstrapData()
      .catch((error) => {
        console.error(error);
        state.subjects = createFallbackData();
        setStatus("خطا در آماده سازی داده ها. داده نمونه بارگذاری شد.", "error");
      })
      .finally(() => {
        applyPendingSessionRestoreSnapshot();
        pruneExamLibraryAgainstSubjects({ persist: true });
        sanitizeView();
        render();
        dismissAppBootSplash();
      });

    window.uploadToJson = uploadToJson;
    window.downloadFromJson = downloadFromJson;
  }

  function syncThemeSwitcherThemes() {
    if (refs.themeSelect instanceof HTMLSelectElement) {
      const existingOptionMap = new Map(
        Array.from(refs.themeSelect.options).map((option) => [asText(option.value, ""), option])
      );

      THEMES.forEach((theme) => {
        if (existingOptionMap.has(theme)) {
          const option = existingOptionMap.get(theme);
          if (option instanceof HTMLOptionElement) {
            option.textContent = THEME_OPTION_LABELS[theme] || option.textContent || theme;
          }
          return;
        }

        const option = document.createElement("option");
        option.value = theme;
        option.textContent = THEME_OPTION_LABELS[theme] || theme;
        refs.themeSelect.appendChild(option);
      });
    }

    const quickRail = document.querySelector(".profile-quick-theme-rail");
    if (!(quickRail instanceof HTMLElement)) {
      return;
    }

    const existingButtons = new Set(
      Array.from(quickRail.querySelectorAll("[data-action='profile-set-theme']")).map((button) =>
        asText(button.dataset.theme, "")
      )
    );

    THEMES.forEach((theme) => {
      if (existingButtons.has(theme)) {
        return;
      }

      const label = THEME_OPTION_LABELS[theme] || theme;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "profile-quick-theme-btn";
      button.dataset.action = "profile-set-theme";
      button.dataset.theme = theme;
      button.setAttribute("aria-pressed", "false");
      button.title = label;
      button.setAttribute("aria-label", `تم ${label}`);

      const dot = document.createElement("span");
      dot.className = `profile-quick-theme-dot ${THEME_QUICK_DOT_CLASS[theme] || "profile-theme-dot-graphite"}`;
      dot.setAttribute("aria-hidden", "true");
      button.appendChild(dot);
      quickRail.appendChild(button);
    });
  }

  function bindGlobalEvents() {
    if (!(document.body instanceof HTMLElement)) {
      document.addEventListener(
        "DOMContentLoaded",
        () => {
          bindGlobalEvents();
        },
        { once: true }
      );
      return;
    }

    document.body.addEventListener("click", createGuardedEventHandler("click", handleClick));
    document.body.addEventListener("submit", createGuardedEventHandler("submit", handleSubmit));
    document.body.addEventListener("change", createGuardedEventHandler("change", handleChange));
    document.body.addEventListener("input", createGuardedEventHandler("input", handleInput));
    document.body.addEventListener("keydown", createGuardedEventHandler("keydown", handleKeydown));
    document.body.addEventListener("pointerdown", createGuardedEventHandler("pointerdown", handlePressFeedbackPointerDown), true);
    document.body.addEventListener("pointerup", createGuardedEventHandler("pointerup", handlePressFeedbackPointerRelease), true);
    document.body.addEventListener(
      "pointercancel",
      createGuardedEventHandler("pointercancel", handlePressFeedbackPointerRelease),
      true
    );
    document.body.addEventListener(
      "pointerleave",
      createGuardedEventHandler("pointerleave", handlePressFeedbackPointerRelease),
      true
    );
    document.addEventListener("focusin", handleExamFocusTrapFocusIn, true);
    document.addEventListener("mousedown", handleExamFocusTrapPointerDown, true);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopProfileDateTimeTicker();
        if (liveTimerIntervalId !== null) {
          window.clearInterval(liveTimerIntervalId);
          liveTimerIntervalId = null;
        }
        scheduleAutomaticMaintenance("hidden", { forceReschedule: true });
        return;
      }

      syncLiveTimerLifecycle();
      syncExamCountdownLayoutVars();
      syncHybridOrientationPolicy("visibility-visible");
      renderProfileDateTimeLabel(getProfileRefs());
      startProfileDateTimeTicker();
      if (state.gapi.autoSyncEnabled) {
        window.setTimeout(() => {
          void runDriveAutoPullTick();
        }, 420);
      }
      scheduleAutomaticMaintenance("visible", { forceReschedule: true });
      void requestAutomaticMaintenance("visible", { minIntervalMs: AUTO_MAINTENANCE_MIN_INTERVAL_MS });
    });

    window.addEventListener("online", () => {
      if (!state.gapi.autoSyncEnabled || shouldSkipSyncBecauseBusy()) {
        return;
      }
      window.setTimeout(() => {
        void runDriveAutoPullTick();
      }, 320);
    });

    if (refs.themeSelect instanceof HTMLSelectElement) {
      refs.themeSelect.addEventListener(
        "change",
        createGuardedEventHandler("theme-change", (event) => {
          const target = event.target;
          if (!(target instanceof HTMLSelectElement)) {
            return;
          }
          applyTheme(target.value);
          persistPreferences();
        })
      );
    }

    const handleViewportResize = (source = "window") => {
      if (viewportResizeRafId) {
        return;
      }
      viewportResizeRafId = window.requestAnimationFrame(() => {
        viewportResizeRafId = 0;
        try {
          const vv = window.visualViewport;
          const currentWidth = Math.round(
            Number(vv?.width) ||
            Number(window.innerWidth) ||
            Number(document.documentElement?.clientWidth) ||
            0
          );
          const currentHeight = Math.round(
            Number(vv?.height) ||
            Number(window.innerHeight) ||
            Number(document.documentElement?.clientHeight) ||
            0
          );
          const widthDelta = Math.abs(currentWidth - lastViewportResizeWidth);
          const heightDelta = Math.abs(currentHeight - lastViewportResizeHeight);
          lastViewportResizeWidth = currentWidth;
          lastViewportResizeHeight = currentHeight;

          const skipMinorVisualViewportResize =
            source === "visual" &&
            isMobileViewportActive() &&
            widthDelta <= 2 &&
            heightDelta <= (isStandaloneAppUltraPerformanceActive() ? 132 : 96);
          if (skipMinorVisualViewportResize) {
            healMobileScrollLock("viewport-visual-jitter");
            return;
          }

          debouncedAutoViewportRefresh();
          debouncedChapterMapViewportRefresh();
          syncPwaDisplayModeClasses();
          syncMobilePerformanceMode();
          syncDesktopPerformanceMode();
          syncExamCountdownLayoutVars();
          healMobileScrollLock("viewport-resize");
          syncHybridOrientationPolicy("viewport-resize");
        } catch (error) {
          reportRuntimeError(error, "viewport-resize");
          attemptMobileSoftRecovery("viewport-resize");
        }
      });
    };

    window.addEventListener("resize", () => handleViewportResize("window"));
    window.addEventListener("orientationchange", () => handleViewportResize("orientation"));
    if (window.screen?.orientation && typeof window.screen.orientation.addEventListener === "function") {
      window.screen.orientation.addEventListener("change", () => handleViewportResize("screen-orientation"));
    }
    const markScroll = () => {
      markDriveScrollActivity();
      if (standaloneScrollSyncRafId) {
        return;
      }
      standaloneScrollSyncRafId = window.requestAnimationFrame(() => {
        standaloneScrollSyncRafId = 0;
        syncStandaloneScrollTopVisibility();
      });
    };
    window.addEventListener("scroll", markScroll, { passive: true });
    document.addEventListener("touchstart", markScroll, { passive: true, capture: true });
    document.addEventListener("touchmove", markScroll, { passive: true, capture: true });
    document.addEventListener("wheel", markScroll, { passive: true, capture: true });
    window.addEventListener("error", (event) => {
      const reason = event?.error || event?.message || "window-error";
      reportRuntimeError(reason, "window-error");
      attemptMobileSoftRecovery("window-error");
    });
    window.addEventListener("unhandledrejection", (event) => {
      const reason = event?.reason || "unhandledrejection";
      reportRuntimeError(reason, "promise");
      attemptMobileSoftRecovery("promise");
    });
    window.addEventListener("beforeunload", () => {
      flushPendingDriveSyncMetaPersist();
      stopAutomaticMaintenanceLoop();
    });

    if (window.visualViewport && typeof window.visualViewport.addEventListener === "function") {
      window.visualViewport.addEventListener("resize", () => handleViewportResize("visual"));
    }

    if (typeof window.matchMedia === "function") {
      const displayModeQuery = window.matchMedia("(display-mode: standalone)");
      const handleDisplayModeChange = () => {
        syncPwaDisplayModeClasses();
        syncPwaInstallActionState();
      };
      if (typeof displayModeQuery.addEventListener === "function") {
        displayModeQuery.addEventListener("change", handleDisplayModeChange);
      } else if (typeof displayModeQuery.addListener === "function") {
        displayModeQuery.addListener(handleDisplayModeChange);
      }
    }

    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      deferredInstallPromptEvent = event;
      syncPwaInstallActionState();
      syncDebugLog("pwa:install-ready", "beforeinstallprompt captured");
    });

    window.addEventListener("appinstalled", () => {
      deferredInstallPromptEvent = null;
      syncPwaDisplayModeClasses();
      syncPwaInstallActionState();
      showToast("نصب اپ تکمیل شد. از این پس برنامه مستقل اجرا می‌شود.", "success", 3600);
      setStatus("نسخه مستقل برنامه نصب شد.", "ok");
      syncDebugLog("pwa:installed", "appinstalled event received");
    });
  }

  function createGuardedEventHandler(contextLabel, handler) {
    return (event) => {
      try {
        handler(event);
      } catch (error) {
        reportRuntimeError(error, `event:${contextLabel}`);
        if (event && typeof event.preventDefault === "function" && !!event.cancelable) {
          event.preventDefault();
        }
        requestUiEventRecovery(contextLabel);
      }
    };
  }

  function requestUiEventRecovery(contextLabel = "") {
    const now = Date.now();
    if (now - lastUiEventRecoveryAtMs < 800) {
      return;
    }
    lastUiEventRecoveryAtMs = now;
    attemptMobileSoftRecovery(`event:${contextLabel}`);
    queueRender();
  }

  function registerPwaServiceWorker() {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    const hostname = asText(window.location.hostname, "").trim().toLowerCase();
    const isLoopback = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1" || hostname === "[::1]";
    const isSecureContextAvailable = window.isSecureContext === true || window.location.protocol === "https:" || isLoopback;

    if (!isSecureContextAvailable) {
      return;
    }

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register(PWA_SERVICE_WORKER_PATH, { scope: "./" });

        if (registration.waiting) {
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
        }

        registration.addEventListener("updatefound", () => {
          const installing = registration.installing;
          if (!installing) {
            return;
          }

          installing.addEventListener("statechange", () => {
            if (installing.state === "installed" && navigator.serviceWorker.controller) {
              setStatus("نسخه جدید برنامه آماده شد. برای دریافت آخرین تغییرات صفحه را نوسازی کن.", "info");
            }
          });
        });
      } catch (error) {
        console.warn("Service worker registration failed:", error);
      }
    };

    if (document.readyState !== "loading") {
      void register();
      return;
    }

    document.addEventListener("DOMContentLoaded", () => {
      void register();
    }, { once: true });
  }

  function isStandaloneDisplayMode() {
    const matchesStandalone =
      typeof window.matchMedia === "function" && window.matchMedia("(display-mode: standalone)").matches;
    const legacyStandalone = window.navigator && window.navigator.standalone === true;
    return !!(matchesStandalone || legacyStandalone);
  }

  function syncPwaDisplayModeClasses() {
    if (!(document.body instanceof HTMLElement)) {
      return;
    }

    const isStandalone = isStandaloneDisplayMode();
    const resolvedMode = state.viewportAutoResolved === "mobile" ? "mobile" : "desktop";
    const nativeMobileAppMode = isStandalone && resolvedMode === "mobile";

    document.body.classList.toggle("is-standalone", isStandalone);
    document.body.classList.toggle("is-browser-mode", !isStandalone);
    document.body.classList.toggle("standalone-mobile", isStandalone && resolvedMode === "mobile");
    document.body.classList.toggle("standalone-desktop", isStandalone && resolvedMode === "desktop");
    document.body.classList.toggle("standalone-native-app", nativeMobileAppMode);
    syncStandaloneAppUltraPerformanceMode(nativeMobileAppMode);
    document.body.dataset.appDisplayMode = isStandalone ? "standalone" : "browser";
    document.body.dataset.nativeMobileApp = nativeMobileAppMode ? "1" : "0";
    syncPwaInstallActionState();
    syncStandaloneMobileDock();
    syncStandaloneScrollTopVisibility();
  }

  function isStandaloneMobileModeActive() {
    return isStandaloneDisplayMode() && (state.viewportAutoResolved === "mobile" || state.viewportMode === "mobile");
  }

  function syncStandaloneAppUltraPerformanceMode(forceActive = null) {
    if (!(document.body instanceof HTMLElement)) {
      standaloneAppUltraPerformance = false;
      return false;
    }

    const computedActive =
      typeof forceActive === "boolean"
        ? forceActive
        : document.body.classList.contains("standalone-native-app") && isStandaloneMobileModeActive();
    standaloneAppUltraPerformance = !!computedActive;
    document.body.classList.toggle("app-ultra-perf", standaloneAppUltraPerformance);
    document.body.dataset.appPerf = standaloneAppUltraPerformance ? "ultra" : "normal";
    return standaloneAppUltraPerformance;
  }

  function isStandaloneAppUltraPerformanceActive() {
    return standaloneAppUltraPerformance === true;
  }

  function syncStandaloneMobileDock(subject = getActiveSubject(), chapter = getActiveChapter()) {
    const dock = refs.pwaMobileDock;
    if (!(dock instanceof HTMLElement)) {
      return;
    }

    const enabled = isStandaloneMobileModeActive();
    dock.hidden = !enabled;
    dock.setAttribute("aria-hidden", enabled ? "false" : "true");
    if (!enabled) {
      return;
    }

    const buttons = dock.querySelectorAll(".pwa-mobile-dock-btn");
    const canOpenChapters = !!subject && state.view.level > 1;
    const canSwitchTabs = state.view.level === 3 && !!subject && !!chapter;

    buttons.forEach((button) => {
      if (!(button instanceof HTMLButtonElement)) {
        return;
      }

      const target = asText(button.dataset.dock, "").trim();
      let isActive = false;
      let isDisabled = false;

      if (target === "home") {
        isActive = state.view.level === 1;
      } else if (target === "chapters") {
        isActive = state.view.level === 2;
        isDisabled = !canOpenChapters;
      } else if (target === "bank") {
        isActive = canSwitchTabs && state.view.tab === "bank";
        isDisabled = !canSwitchTabs;
      } else if (target === "practice") {
        isActive = canSwitchTabs && state.view.tab === "practice";
        isDisabled = !canSwitchTabs;
      } else if (target === "exam") {
        isActive = canSwitchTabs && state.view.tab === "exam";
        isDisabled = !canSwitchTabs;
      }

      button.classList.toggle("is-active", isActive);
      button.disabled = isDisabled;
      button.setAttribute("aria-disabled", isDisabled ? "true" : "false");
      button.setAttribute("aria-current", isActive ? "page" : "false");
    });
  }

  function syncStandaloneScrollTopVisibility() {
    const button = refs.pwaScrollTopBtn;
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }

    const enabled = isStandaloneMobileModeActive();
    const shouldShow = enabled && !isSettingsPanelOpen() && window.scrollY > 260;
    if (lastStandaloneScrollTopEnabled === enabled && lastStandaloneScrollTopVisible === shouldShow) {
      return;
    }
    lastStandaloneScrollTopEnabled = enabled;
    lastStandaloneScrollTopVisible = shouldShow;
    button.hidden = !enabled;
    button.classList.toggle("is-visible", shouldShow);
    button.setAttribute("aria-hidden", enabled ? "false" : "true");
    button.disabled = !enabled;
  }

  function isIosLikeDevice() {
    const userAgent = asText(window.navigator?.userAgent, "");
    const platform = asText(window.navigator?.platform, "");
    const maxTouchPoints = Number(window.navigator?.maxTouchPoints) || 0;
    return /iphone|ipad|ipod/i.test(userAgent) || (platform === "MacIntel" && maxTouchPoints > 1);
  }

  function resolvePwaInstallFallbackMessage() {
    if (isIosLikeDevice()) {
      return "برای نصب نسخه مستقل: Share را بزنید و گزینه Add to Home Screen را انتخاب کنید.";
    }
    return "برای نصب نسخه مستقل: از منوی مرورگر گزینه Install app یا Add to Home screen را بزنید.";
  }

  function syncPwaInstallActionState() {
    const installActions = document.querySelectorAll("[data-action='install-app']");
    if (!installActions.length) {
      return;
    }

    const installed = isStandaloneDisplayMode();
    const canPrompt = !!(deferredInstallPromptEvent && typeof deferredInstallPromptEvent.prompt === "function");
    const defaultLabel = canPrompt ? "نصب اپ" : "راهنمای نصب اپ";

    installActions.forEach((actionNode) => {
      if (!(actionNode instanceof HTMLElement)) {
        return;
      }

      actionNode.hidden = installed;
      actionNode.dataset.installState = installed ? "installed" : canPrompt ? "ready" : "manual";
      actionNode.setAttribute("aria-hidden", installed ? "true" : "false");
      const labelNode = actionNode.querySelector("[data-install-label]");
      if (labelNode instanceof HTMLElement) {
        labelNode.textContent = defaultLabel;
      } else if (actionNode instanceof HTMLButtonElement) {
        actionNode.textContent = defaultLabel;
      }

      if (actionNode instanceof HTMLButtonElement) {
        actionNode.disabled = false;
        actionNode.title = canPrompt
          ? "نصب نسخه مستقل برنامه"
          : "نمایش راهنمای نصب نسخه مستقل";
      }
    });
  }

  async function handleInstallAppRequest() {
    closeHeaderTransientUi();

    if (isStandaloneDisplayMode()) {
      showToast("اپ همین حالا به صورت مستقل نصب شده است.", "info", 2600);
      setStatus("نسخه مستقل برنامه فعال است.", "ok");
      return;
    }

    const installEvent = deferredInstallPromptEvent;
    if (installEvent && typeof installEvent.prompt === "function") {
      deferredInstallPromptEvent = null;
      syncPwaInstallActionState();
      try {
        await installEvent.prompt();
        const choice = await installEvent.userChoice;
        const outcome = asText(choice?.outcome, "").toLowerCase();
        syncDebugLog("pwa:install-choice", outcome || "unknown");
        if (outcome === "accepted") {
          const successMessage = "در حال نصب نسخه مستقل برنامه...";
          showToast(successMessage, "success", 2800);
          setStatus(successMessage, "ok");
        } else {
          const cancelMessage = "نصب اپ لغو شد.";
          showToast(cancelMessage, "info", 2400);
          setStatus(cancelMessage, "info");
        }
        return;
      } catch (error) {
        syncDebugLog("pwa:install-failed", asText(error?.message, "prompt failed"), { level: "warn" });
      }
    }

    const fallbackMessage = resolvePwaInstallFallbackMessage();
    showToast(fallbackMessage, "info", 6200);
    setStatus(fallbackMessage, "info");
  }

  function resolveThemeMetaColor(theme) {
    const safeTheme = THEMES.includes(theme) ? theme : "dark-graphite";
    return THEME_META_COLORS[safeTheme] || THEME_META_COLORS["dark-graphite"];
  }

  function syncThemeColorMeta(theme) {
    const meta = document.getElementById("themeColorMeta");
    if (!(meta instanceof HTMLMetaElement)) {
      return;
    }
    meta.setAttribute("content", resolveThemeMetaColor(theme));
  }

  async function bootstrapData() {
    const storedSubjects = stripLegacyDefaultSubjects(loadStoredSubjects());
    if (storedSubjects.length) {
      state.subjects = storedSubjects;
      reconcileReviewMetadataAfterDataChange({ migrateLegacy: true });
      persistSubjects({ trackEdit: false, queueAuto: false });
      return;
    }

    const fetchedSubjects = stripLegacyDefaultSubjects(await fetchLocalSubjects());
    if (fetchedSubjects.length) {
      state.subjects = fetchedSubjects;
      reconcileReviewMetadataAfterDataChange({ migrateLegacy: true });
      persistSubjects({ trackEdit: false, queueAuto: false });
      return;
    }

    state.subjects = stripLegacyDefaultSubjects(createFallbackData());
    reconcileReviewMetadataAfterDataChange({ migrateLegacy: true });
    persistSubjects({ trackEdit: false, queueAuto: false });
  }

  async function fetchLocalSubjects() {
    const payload = await fetchJsonWithOfflineCache(LOCAL_JSON_PATH);
    if (!payload) {
      return [];
    }
    return normalizeSubjects(payload);
  }

  async function fetchJsonWithOfflineCache(filePath) {
    const safePath = asText(filePath, "").trim();
    if (!safePath) {
      return null;
    }

    try {
      const response = await fetch(safePath, { cache: "no-store" });
      if (response && response.ok) {
        return await response.json();
      }
    } catch {
      // Fall back to Cache Storage.
    }

    return await readJsonFromBrowserCache(safePath);
  }

  async function readJsonFromBrowserCache(filePath) {
    if (!("caches" in window)) {
      return null;
    }

    const candidates = [];
    const addCandidate = (value) => {
      const key = asText(value, "").trim();
      if (!key || candidates.includes(key)) {
        return;
      }
      candidates.push(key);
    };

    addCandidate(filePath);

    try {
      const absoluteUrl = new URL(filePath, window.location.href);
      addCandidate(absoluteUrl.href);
      addCandidate(`${absoluteUrl.origin}${absoluteUrl.pathname}`);
      if (absoluteUrl.pathname.startsWith("/")) {
        addCandidate(`.${absoluteUrl.pathname}`);
      }
    } catch {
      // ignore URL parse issues and continue with raw candidate
    }

    for (const candidate of candidates) {
      try {
        const cachedResponse =
          (await caches.match(candidate, { ignoreSearch: false })) ||
          (await caches.match(candidate, { ignoreSearch: true }));
        if (!cachedResponse) {
          continue;
        }
        return await cachedResponse.clone().json();
      } catch {
        // Continue searching other cache keys.
      }
    }

    return null;
  }

  function normalizeSubjects(payload) {
    const source = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.subjects)
        ? payload.subjects
        : [];

    return source.map((subject, subjectIndex) => {
      const subjectName = asText(subject?.name, `درس ${subjectIndex + 1}`);
      const rawChapters = Array.isArray(subject?.chapters) ? subject.chapters : [];
      const sortedChapters = rawChapters
        .map((chapter, index) => ({
          chapter,
          index,
          order:
            Number.isFinite(Number(chapter?.order)) && Number(chapter?.order) > 0
              ? Number(chapter.order)
              : index + 1
        }))
        .sort((a, b) => {
          if (a.order === b.order) {
            return a.index - b.index;
          }
          return a.order - b.order;
        });

      const chapters = sortedChapters.map(({ chapter }, chapterIndex) => {
        const chapterName = asText(chapter?.name, `فصل ${chapterIndex + 1}`);
        const chapterId = asText(chapter?.id, createId("ch"));
        const inlineQuestions = Array.isArray(chapter?.questions)
          ? normalizeQuestions(chapter.questions, chapterName, chapterId)
          : [];
        const tree = normalizeChapterTreePayload(
          chapter?.tree ?? chapter?.children ?? chapter?.mindmap ?? chapter?.mindMap ?? chapter?.map ?? chapter?.nodes
        );

        return {
          id: chapterId,
          order: chapterIndex + 1,
          name: chapterName,
          questionsFile: typeof chapter?.questionsFile === "string" ? chapter.questionsFile : null,
          questions: inlineQuestions,
          questionsLoaded: inlineQuestions.length > 0 || !chapter?.questionsFile,
          tree
        };
      });

      return {
        id: asText(subject?.id, createId("sub")),
        name: subjectName,
        chapters
      };
    });
  }

  function normalizeQuestions(payload, chapterName, chapterId = "") {
    if (!Array.isArray(payload)) {
      return [];
    }

    const usedIds = new Set();
    const chapterToken = toQuestionIdToken(chapterId || chapterName);

    return payload.map((question, index) => {
      const preferredId = asText(question?.id, "").trim();
      const baseGeneratedId = `q-${chapterToken}-${index + 1}`;
      let id = preferredId || baseGeneratedId;
      if (!id || usedIds.has(id)) {
        id = baseGeneratedId;
      }
      while (usedIds.has(id)) {
        id = `${baseGeneratedId}-${Math.floor(Math.random() * 1000)}`;
      }
      usedIds.add(id);

      const topic = resolveQuestionTopicLabel(question);
      const method = resolveQuestionMethodLabel(question, "");
      const questionText = cleanQuestionContentText(
        asText(question?.question_text, asText(question?.question, "متن سوال ثبت نشده است."))
      );
      const hintText = cleanQuestionContentText(asText(question?.hint, ""));
      const solutionText = cleanQuestionContentText(
        asText(question?.step_by_step_solution, asText(question?.solution, ""))
      );
      const assets = normalizeQuestionAssetPayload(question);

      return {
        id,
        chapter: asText(question?.chapter, chapterName),
        topic,
        method,
        difficulty: clampNumber(question?.difficulty, 1, 5, 3),
        question: questionText,
        question_text: questionText,
        hint: hintText,
        solution: solutionText,
        step_by_step_solution: solutionText,
        assets,
        legacyReviewStatus: resolveLegacyReviewStatusForQuestion(question),
        needsReview: resolveNeedsReviewFlag(question),
        solved: resolveQuestionSolvedFlag(question)
      };
    });
  }

  function normalizeChapterTreePayload(source, options = {}) {
    const maxDepth = clampNumber(options.maxDepth, 1, 12, 7);
    const maxNodes = clampNumber(options.maxNodes, 1, 1600, 420);
    const sourceNodes = Array.isArray(source)
      ? source
      : source && typeof source === "object"
        ? [source]
        : [];
    if (!sourceNodes.length) {
      return [];
    }

    const context = {
      count: 0,
      maxDepth,
      maxNodes
    };
    const normalized = sourceNodes
      .map((entry, index) => normalizeChapterTreeNode(entry, 1, context, index + 1))
      .filter(Boolean);
    return normalized;
  }

  function normalizeChapterTreeNode(entry, depth, context, fallbackIndex = 1) {
    if (!context || context.count >= context.maxNodes || depth > context.maxDepth) {
      return null;
    }
    if (entry === null || entry === undefined) {
      return null;
    }

    let rawName = "";
    let rawId = "";
    let rawChildren = [];
    let rawMetaQuestionCount = NaN;
    let rawMetaReviewCount = NaN;

    if (typeof entry === "string" || typeof entry === "number") {
      rawName = asText(entry, "").trim();
    } else if (entry && typeof entry === "object" && !Array.isArray(entry)) {
      rawName = resolveChapterTreeNodeLabel(entry, fallbackIndex);
      rawId = asText(entry.id, "").trim();
      rawChildren = resolveChapterTreeNodeChildren(entry);
      rawMetaQuestionCount = parseChapterTreeNumericMeta(
        entry.questionCount ?? entry.questionsCount ?? entry.totalQuestions ?? entry.total ?? entry.count
      );
      rawMetaReviewCount = parseChapterTreeNumericMeta(
        entry.reviewCount ?? entry.needsReview ?? entry.review ?? entry.pendingReview ?? entry.pending
      );
    } else if (Array.isArray(entry)) {
      rawName = `گره ${fallbackIndex}`;
      rawChildren = entry;
    } else {
      return null;
    }

    const safeName = rawName || `گره ${fallbackIndex}`;
    context.count += 1;
    const children = (Array.isArray(rawChildren) ? rawChildren : [])
      .map((child, childIndex) => normalizeChapterTreeNode(child, depth + 1, context, childIndex + 1))
      .filter(Boolean);

    const node = {
      id: rawId || createId("tn"),
      name: safeName,
      children
    };

    if (Number.isFinite(rawMetaQuestionCount) || Number.isFinite(rawMetaReviewCount)) {
      node.meta = {
        questionCount: Number.isFinite(rawMetaQuestionCount) ? rawMetaQuestionCount : 0,
        reviewCount: Number.isFinite(rawMetaReviewCount) ? rawMetaReviewCount : 0
      };
    }

    return node;
  }

  function resolveChapterTreeNodeLabel(entry, fallbackIndex = 1) {
    if (!entry || typeof entry !== "object") {
      return `گره ${fallbackIndex}`;
    }
    const labelCandidates = [
      entry.name,
      entry.title,
      entry.label,
      entry.text,
      entry.topic,
      entry.chapter,
      entry.id
    ];
    for (const candidate of labelCandidates) {
      const safe = asText(candidate, "").trim();
      if (safe) {
        return safe;
      }
    }
    return `گره ${fallbackIndex}`;
  }

  function resolveChapterTreeNodeChildren(entry) {
    if (!entry || typeof entry !== "object") {
      return [];
    }
    const childCandidates = [
      entry.children,
      entry.tree,
      entry.nodes,
      entry.items,
      entry.branches,
      entry.map,
      entry.mindmap,
      entry.mindMap
    ];
    for (const candidate of childCandidates) {
      if (Array.isArray(candidate)) {
        return candidate;
      }
      if (candidate && typeof candidate === "object") {
        return [candidate];
      }
    }
    return [];
  }

  function parseChapterTreeNumericMeta(value) {
    if (value === null || value === undefined || value === "") {
      return NaN;
    }
    const normalized = normalizePossibleNumberText(asText(value, ""))
      .replace(/[^0-9.\-+]/g, "")
      .trim();
    const numeric = Number(normalized);
    if (!Number.isFinite(numeric)) {
      return NaN;
    }
    return Math.max(0, Math.round(numeric));
  }

  function resolveNeedsReviewFlag(question) {
    if (!question || typeof question !== "object") {
      return false;
    }

    if (question.needsReview === true || question?.progress?.needsReview === true) {
      return true;
    }

    const directFlag = asText(question.needsReview, "").toLowerCase();
    if (directFlag === "true" || directFlag === "1" || directFlag === "yes") {
      return true;
    }

    const reviewState = asText(question?.reviewState, "").toLowerCase();
    if (reviewState === "needs-review" || reviewState === "review" || reviewState === "flagged") {
      return true;
    }

    const lastResult = asText(question?.lastResult, "").toLowerCase();
    return lastResult === "wrong" || lastResult === "incorrect";
  }

  function applyIncomingQuestionReviewDefaults(question) {
    if (!question || typeof question !== "object") {
      return question;
    }

    // All incoming questions start in "needs review" unless user changes status later.
    question.legacyReviewStatus = "review";
    question.needsReview = true;

    if (question.progress && typeof question.progress === "object" && !Array.isArray(question.progress)) {
      question.progress.needsReview = true;
    }

    return question;
  }

  function resolveQuestionSolvedFlag(question) {
    if (!question || typeof question !== "object") {
      return false;
    }

    const directSolved = parseQuestionSolvedFlagValue(question.solved);
    if (directSolved !== null) {
      return directSolved;
    }

    const directIsSolved = parseQuestionSolvedFlagValue(question.isSolved);
    if (directIsSolved !== null) {
      return directIsSolved;
    }

    const progressSolved = parseQuestionSolvedFlagValue(question?.progress?.solved);
    if (progressSolved !== null) {
      return progressSolved;
    }

    const progressIsSolved = parseQuestionSolvedFlagValue(question?.progress?.isSolved);
    if (progressIsSolved !== null) {
      return progressIsSolved;
    }

    return false;
  }

  function parseQuestionSolvedFlagValue(value) {
    if (typeof value === "boolean") {
      return value;
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      if (value === 1) {
        return true;
      }
      if (value === 0) {
        return false;
      }
      return null;
    }

    const text = asText(value, "").trim().toLowerCase();
    if (!text) {
      return null;
    }

    if (["true", "1", "yes", "solved", "done", "completed"].includes(text)) {
      return true;
    }

    if (["false", "0", "no", "unsolved", "pending", "not-solved", "not_solved", "todo"].includes(text)) {
      return false;
    }

    return null;
  }

  function createFallbackData() {
    return normalizeSubjects({
      subjects: []
    });
  }
  function handleClick(event) {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const actionTarget = target.closest("[data-action]");
    if (!actionTarget) {
      return;
    }

    if (actionTarget instanceof HTMLAnchorElement) {
      event.preventDefault();
    }

    const activeExamScope = getActiveExamFocusScope();
    if (activeExamScope && !activeExamScope.contains(actionTarget)) {
      event.preventDefault();
      event.stopPropagation();
      notifyExamFocusLockBlocked();
      focusExamPrimaryElement(activeExamScope);
      return;
    }

    const action = actionTarget.dataset.action;

    switch (action) {
      case "open-subject":
        openSubject(actionTarget.dataset.subjectId);
        break;
      case "open-chapter":
        openChapter(actionTarget.dataset.chapterId);
        break;
      case "goto-subjects":
        state.view.level = 1;
        state.view.subjectId = null;
        state.view.chapterId = null;
        state.view.tab = "bank";
        state.pagination.page = 1;
        closeHeaderTransientUi();
        render();
        break;
      case "goto-chapters":
        state.view.level = 2;
        state.view.chapterId = null;
        state.view.tab = "bank";
        state.pagination.page = 1;
        closeHeaderTransientUi();
        render();
        break;
      case "switch-tab":
        if (actionTarget.dataset.tab && actionTarget.dataset.tab !== state.view.tab) {
          state.view.tab = actionTarget.dataset.tab;
          state.pagination.page = 1;
          closeHeaderTransientUi();
          render();
        }
        closeHeaderTransientUi();
        break;
      case "header-back":
        handleHeaderBackNavigation();
        break;
      case "focus-primary-search":
        focusPrimarySearchField();
        break;
      case "toggle-header-overflow":
        toggleHeaderOverflowMenu();
        break;
      case "toggle-sections-sheet":
        toggleHeaderSectionsSheet();
        break;
      case "close-sections-sheet":
        setHeaderSectionsSheetOpen(false);
        break;
      case "scroll-top":
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
        break;
      case "bank-prev":
        state.pagination.page = Math.max(1, state.pagination.page - 1);
        render();
        break;
      case "bank-next": {
        const subject = getActiveSubject();
        const chapter = getActiveChapter();
        const filtered = getFilteredBankQuestions(subject, chapter);
        const totalPages = Math.max(1, Math.ceil(filtered.length / state.pagination.pageSize));
        state.pagination.page = Math.min(totalPages, state.pagination.page + 1);
        render();
        break;
      }
      case "exam-prev": {
        const runtime = getActiveRuntime();
        if (runtime?.exam) {
          runtime.exam.page = Math.max(1, runtime.exam.page - 1);
          render();
        }
        break;
      }
      case "exam-next": {
        const runtime = getActiveRuntime();
        if (runtime?.exam) {
          const totalPages = Math.max(1, Math.ceil(runtime.exam.ids.length / state.pagination.pageSize));
          runtime.exam.page = Math.min(totalPages, runtime.exam.page + 1);
          render();
        }
        break;
      }
      case "exam-evaluate-score":
        handleExamEvaluateScore(actionTarget);
        break;
      case "exam-mark-answer":
        handleExamQuestionMark(actionTarget);
        break;
      case "practice-next":
        stepPracticeQuestion(1);
        break;
      case "practice-prev":
        stepPracticeQuestion(-1);
        break;
      case "practice-random":
        randomizePracticeQuestion();
        break;
      case "practice-copy-question":
        void handlePracticeCopyQuestion(actionTarget);
        break;
      case "practice-toggle-review":
        handlePracticeToggleReview(actionTarget);
        break;
      case "question-timer-start":
        handleQuestionTimerStart(actionTarget);
        break;
      case "question-timer-pause":
        handleQuestionTimerPause(actionTarget);
        break;
      case "question-timer-reset":
        handleQuestionTimerReset(actionTarget);
        break;
      case "practice-reveal-hint":
        togglePracticeReveal("hint");
        break;
      case "practice-reveal-solution":
        togglePracticeReveal("solution");
        break;
      case "practice-set-profile":
        setPracticeProfile(actionTarget);
        break;
      case "practice-toggle-filters-panel":
        handlePracticeFiltersPanelToggle();
        break;
      case "print-exam":
        void handlePrintExam(actionTarget);
        break;
      case "print-exam-with-answers":
        void handlePrintExam(actionTarget, { includeAnswers: true });
        break;
      case "exam-finish":
        handleExamFinish(actionTarget);
        break;
      case "exam-reset":
        handleExamReset(actionTarget);
        break;
      case "exam-save-session":
        handleExamSaveSession(actionTarget);
        break;
      case "exam-run-saved":
        void handleExamRunSaved(actionTarget);
        break;
      case "exam-edit-saved":
        handleExamEditSaved(actionTarget);
        break;
      case "exam-delete-saved":
        handleExamDeleteSaved(actionTarget);
        break;
      case "exam-jump-prev":
        handleExamQuestionJump(actionTarget, -1);
        break;
      case "exam-jump-next":
        handleExamQuestionJump(actionTarget, 1);
        break;
      case "exam-copy-code":
        void handleExamCopyCode(actionTarget);
        break;
      case "toggle-hint":
        toggleDisclosure(actionTarget, "hint");
        break;
      case "toggle-solution":
        toggleDisclosure(actionTarget, "solution");
        break;
      case "toggle-difficulty-pill":
        handleDifficultyPillToggle(actionTarget);
        break;
      case "bank-topic-quick":
        handleBankTopicQuick(actionTarget);
        break;
      case "bank-sort-mode":
        handleBankSortModeClick(actionTarget);
        break;
      case "bank-solved-filter":
        handleBankSolvedFilterClick(actionTarget);
        break;
      case "bank-review-filter":
        handleBankReviewFilterClick(actionTarget);
        break;
      case "bank-toggle-active-filters":
        handleBankActiveFiltersToggle(actionTarget);
        break;
      case "bank-toggle-filters-panel":
        handleBankFiltersPanelToggle(actionTarget);
        break;
      case "bank-remove-filter-chip":
        handleBankRemoveFilterChip(actionTarget);
        break;
      case "bank-clear-filters":
        handleBankClearFilters(actionTarget);
        break;
      case "toggle-question-solved":
        handleQuestionSolvedToggle(actionTarget);
        break;
      case "question-review-status":
        handleQuestionReviewStatusClick(actionTarget);
        break;
      case "toggle-question-review-note":
        handleQuestionReviewNoteToggle(actionTarget);
        break;
      case "exam-select-all-chapters":
        setExamChapterSelection(true);
        break;
      case "exam-clear-chapters":
        setExamChapterSelection(false);
        break;
      case "exam-balance-counts":
        handleExamBalanceCounts(actionTarget);
        break;
      case "open-schema-modal":
        openSchemaModal();
        break;
      case "close-schema-modal":
        closeSchemaModal();
        break;
      case "copy-ai-json-prompt":
        void handleCopySchemaAiPrompt(actionTarget);
        break;
      case "import-json-text":
        void handleJsonTextImport();
        break;
      case "clear-json-text":
        clearJsonTextImportInput();
        break;
      case "open-question-pdf-source":
        openQuestionPdfSourcePicker();
        break;
      case "clear-question-pdf-source":
        clearQuestionPdfSource();
        break;
      case "toggle-settings-panel":
        closeHeaderTransientUi();
        toggleSettingsPanel();
        break;
      case "install-app":
        void handleInstallAppRequest(actionTarget);
        break;
      case "switch-settings-tab":
        switchSettingsTab(actionTarget.dataset.tab);
        break;
      case "save-drive-credentials":
        saveDriveCredentials();
        break;
      case "sync-google-drive":
        void handleGoogleDriveSync();
        break;
      case "set-viewport-mode":
        setViewportMode(actionTarget.dataset.mode);
        break;
      case "toggle-schedule-landscape":
        toggleScheduleLandscapePreference();
        break;
      case "profile-set-theme":
        handleProfileQuickTheme(actionTarget);
        break;
      case "cycle-viewport":
        cycleViewportMode();
        break;
      case "reset-appearance-settings":
        resetAppearanceSettings();
        break;
      case "sync-download":
        void handleDriveDownload();
        break;
      case "sync-upload":
        void handleDriveUpload();
        break;
      case "copy-sync-error":
        void handleCopySyncError();
        break;
      case "copy-sync-log":
        void handleCopySyncLog();
        break;
      case "clear-drive-file-id":
        clearStoredDriveFileId();
        break;
      case "export-settings-json":
        exportSettingsToLocalJson();
        break;
      case "open-settings-import":
        triggerSettingsImportPicker();
        break;
      case "reset-settings-all":
        resetAllSettings();
        break;
      case "profile-start-new-semester":
        handleProfileStartNewSemester();
        break;
      case "profile-save-info":
        handleProfileSaveInfo();
        break;
      case "request-delete-subject":
        void handleSubjectDelete(actionTarget);
        break;
      case "request-delete-chapter":
        void handleChapterDelete(actionTarget);
        break;
      case "request-delete-question":
        void handleSingleQuestionDelete(actionTarget);
        break;
      case "toggle-question-edit":
        handleQuestionEditToggle(actionTarget);
        break;
      case "cancel-question-edit":
        handleQuestionEditCancel(actionTarget);
        break;
      case "delete-selected-questions":
        void handleBulkQuestionDelete(actionTarget);
        break;
      case "delete-all-questions":
        void handleAllQuestionsDelete(actionTarget);
        break;
      case "move-chapter-up":
        handleChapterMove(actionTarget, -1);
        break;
      case "move-chapter-down":
        handleChapterMove(actionTarget, 1);
        break;
      case "map-open-chapter":
        openChapterFromMap(actionTarget);
        break;
      case "chapter-map-reset-view":
        resetChapterMapView();
        break;
      case "chapter-map-fit-view":
        fitChapterMapView();
        break;
      case "chapter-map-toggle-fx":
        toggleChapterMapFx(actionTarget);
        break;
      case "chapter-map-toggle-simple":
        toggleChapterMapSimple(actionTarget);
        break;
      case "chapter-map-export-png":
        void exportChapterMapToPng(actionTarget);
        break;
      case "chapter-map-add-node":
        handleChapterMapAddNode();
        break;
      case "chapter-map-rename-node":
        handleChapterMapRenameNode();
        break;
      case "chapter-map-delete-node":
        handleChapterMapDeleteNode();
        break;
      default:
        break;
    }
  }

  function handleSubmit(event) {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    const activeExamScope = getActiveExamFocusScope();
    if (activeExamScope && !activeExamScope.contains(form)) {
      event.preventDefault();
      notifyExamFocusLockBlocked();
      focusExamPrimaryElement(activeExamScope);
      return;
    }

    const action = form.dataset.action;
    if (!action) {
      return;
    }

    event.preventDefault();

    switch (action) {
      case "add-subject":
        addSubjectFromForm(form);
        break;
      case "add-chapter":
        addChapterFromForm(form);
        break;
      case "generate-exam":
        generateExamFromForm(form);
        break;
      case "save-question-edit":
        saveQuestionEditFromForm(form);
        break;
      default:
        break;
    }
  }

  function handleChange(event) {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const activeExamScope = getActiveExamFocusScope();
    if (activeExamScope && !activeExamScope.contains(target)) {
      event.preventDefault();
      event.stopPropagation();
      notifyExamFocusLockBlocked();
      focusExamPrimaryElement(activeExamScope);
      return;
    }

    const actionTarget = target.closest("[data-action]");
    if (!actionTarget) {
      return;
    }

    const action = actionTarget.dataset.action;

    switch (action) {
      case "toggle-question-select":
        handleQuestionSelectionChange(actionTarget);
        break;
      case "bank-topic-filter":
        handleBankTopicFilterChange(actionTarget);
        break;
      case "profile-input":
        syncProfileFromInputs();
        break;
      case "practice-include-solved":
        handlePracticeIncludeSolvedChange(actionTarget);
        break;
      case "exam-toggle-chapter":
        handleExamBuilderSelectionChange(actionTarget);
        break;
      case "exam-target-count":
        handleExamTargetCountChange(actionTarget);
        break;
      case "import-settings-json":
        void handleSettingsJsonImportChange(actionTarget);
        break;
      case "toggle-sync-debug":
        handleSyncDebugToggle(actionTarget);
        break;
      case "drive-sync-profile":
        handleDriveSyncProfileChange(actionTarget);
        break;
      default:
        break;
    }
  }

  function handleInput(event) {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const activeExamScope = getActiveExamFocusScope();
    if (activeExamScope && !activeExamScope.contains(target)) {
      event.preventDefault();
      event.stopPropagation();
      notifyExamFocusLockBlocked();
      focusExamPrimaryElement(activeExamScope);
      return;
    }

    const actionTarget = target.closest("[data-action]");
    if (!actionTarget) {
      return;
    }

    const action = actionTarget.dataset.action;

    switch (action) {
      case "bank-search":
        handleBankSearchInput(actionTarget);
        break;
      case "profile-input":
        if (actionTarget instanceof HTMLInputElement && actionTarget.id === "profileName") {
          actionTarget.dataset.touched = "true";
        }
        syncProfileFromInputs();
        break;
      case "drive-config-input":
        handleDriveConfigInput(actionTarget);
        break;
      case "chapter-map-search":
        handleChapterMapSearchInput(actionTarget);
        break;
      case "question-review-note-input":
        handleQuestionReviewNoteInput(actionTarget);
        break;
      case "exam-target-count":
        handleExamTargetCountChange(actionTarget);
        break;
      default:
        break;
    }
  }

  function handleKeydown(event) {
    if (!(event.target instanceof HTMLElement)) {
      return;
    }

    if (handleExamFocusTrapKeydown(event)) {
      return;
    }

    const activeExamScope = getActiveExamFocusScope();
    if (activeExamScope && !activeExamScope.contains(event.target)) {
      event.preventDefault();
      event.stopPropagation();
      notifyExamFocusLockBlocked();
      focusExamPrimaryElement(activeExamScope);
      return;
    }

    if (asText(event.key, "").trim() === "Escape") {
      closeHeaderTransientUi();
      return;
    }

    const target = event.target;
    const isEditableTarget =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement ||
      target.isContentEditable;
    if (isEditableTarget) {
      return;
    }

    const key = asText(event.key, "").trim().toLowerCase();
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }
    const keyToStatus = {
      r: "review",
      k: "key",
      m: "mastered"
    };
    const status = keyToStatus[key];
    if (!status) {
      return;
    }

    const focusedCard =
      target.closest(".question-card") ||
      (document.activeElement instanceof HTMLElement ? document.activeElement.closest(".question-card") : null);
    if (!(focusedCard instanceof HTMLElement)) {
      return;
    }

    const subjectId = asText(focusedCard.dataset.subjectId, "");
    const chapterId = asText(focusedCard.dataset.chapterId, "");
    const questionId = asText(focusedCard.dataset.questionId, "");
    if (!subjectId || !chapterId || !questionId) {
      return;
    }

    event.preventDefault();
    applyQuestionReviewStatusChange(subjectId, chapterId, questionId, status, { fromKeyboard: true });
  }

  function getActiveExamFocusScope() {
    if (state.view.level !== 3 || state.view.tab !== "exam") {
      return null;
    }

    const runtime = getActiveRuntime();
    if (!runtime?.exam) {
      return null;
    }

    ensureExamCompletionState(runtime.exam);
    if (runtime.exam.completed) {
      return null;
    }

    const scope = refs.levelContainer.querySelector('[data-exam-focus-lock="active"]');
    return scope instanceof HTMLElement ? scope : null;
  }

  function notifyExamFocusLockBlocked() {
    const nowMs = Date.now();
    if (nowMs - examFocusLockHintAtMs < 1200) {
      return;
    }
    examFocusLockHintAtMs = nowMs;
    setStatus("قفل آزمون فعال است. ابتدا «اتمام آزمون» یا «لغو آزمون» را بزنید.", "error");
  }

  function getFocusableElementsWithin(root) {
    if (!(root instanceof HTMLElement)) {
      return [];
    }

    const selectors = [
      "button:not([disabled])",
      "[href]",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      '[tabindex]:not([tabindex="-1"])'
    ];

    return Array.from(root.querySelectorAll(selectors.join(","))).filter((node) => {
      if (!(node instanceof HTMLElement)) {
        return false;
      }
      if (node.hidden) {
        return false;
      }
      const style = window.getComputedStyle(node);
      if (style.display === "none" || style.visibility === "hidden") {
        return false;
      }
      return node.getClientRects().length > 0;
    });
  }

  function focusExamPrimaryElement(scope) {
    if (!(scope instanceof HTMLElement)) {
      return;
    }

    const preferred = scope.querySelector(".exam-paper-item .question-card");
    if (preferred instanceof HTMLElement) {
      preferred.focus({ preventScroll: false });
      return;
    }

    const focusables = getFocusableElementsWithin(scope);
    if (focusables.length) {
      focusables[0].focus({ preventScroll: false });
      return;
    }

    scope.focus({ preventScroll: false });
  }

  function handleExamFocusTrapFocusIn(event) {
    const scope = getActiveExamFocusScope();
    if (!scope) {
      return;
    }

    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (scope.contains(target)) {
      return;
    }

    window.requestAnimationFrame(() => {
      const freshScope = getActiveExamFocusScope();
      if (freshScope) {
        focusExamPrimaryElement(freshScope);
      }
    });
  }

  function handleExamFocusTrapPointerDown(event) {
    const scope = getActiveExamFocusScope();
    if (!scope) {
      return;
    }

    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (scope.contains(target)) {
      return;
    }

    if (event.cancelable) {
      event.preventDefault();
    }
    event.stopPropagation();
    notifyExamFocusLockBlocked();
    window.requestAnimationFrame(() => {
      const freshScope = getActiveExamFocusScope();
      if (freshScope) {
        focusExamPrimaryElement(freshScope);
      }
    });
  }

  function handleExamFocusTrapWheel(event) {
    const scope = getActiveExamFocusScope();
    if (!scope) {
      return;
    }

    const target = event.target;
    if (target instanceof HTMLElement && scope.contains(target)) {
      return;
    }

    if (event.cancelable) {
      event.preventDefault();
    }
    notifyExamFocusLockBlocked();
    focusExamPrimaryElement(scope);
  }

  function handleExamFocusTrapTouchMove(event) {
    const scope = getActiveExamFocusScope();
    if (!scope) {
      return;
    }

    const target = event.target;
    if (target instanceof HTMLElement && scope.contains(target)) {
      return;
    }

    if (event.cancelable) {
      event.preventDefault();
    }
    notifyExamFocusLockBlocked();
    focusExamPrimaryElement(scope);
  }

  function getExamFocusLockBlockedNodes() {
    const nodes = [
      refs.headerRoot,
      document.querySelector(".profile-hub"),
      refs.breadcrumbs,
      refs.statusBar,
      refs.settingsPanel,
      refs.headerOverflowMenu,
      refs.headerSectionsSheet
    ];

    const unique = [];
    const seen = new Set();
    nodes.forEach((node) => {
      if (!(node instanceof HTMLElement) || seen.has(node)) {
        return;
      }
      seen.add(node);
      unique.push(node);
    });

    return unique;
  }

  function setExamFocusLockNodeState(node, blocked) {
    if (!(node instanceof HTMLElement)) {
      return;
    }

    if (blocked) {
      if (!Object.prototype.hasOwnProperty.call(node.dataset, "examLockPrevAriaHidden")) {
        const prevAriaHidden = node.getAttribute("aria-hidden");
        node.dataset.examLockPrevAriaHidden = prevAriaHidden === null ? "__none__" : prevAriaHidden;
      }
      if ("inert" in node) {
        node.inert = true;
      }
      node.setAttribute("aria-hidden", "true");
      node.dataset.examLockBlocked = "1";
      return;
    }

    if ("inert" in node) {
      node.inert = false;
    }

    if (Object.prototype.hasOwnProperty.call(node.dataset, "examLockPrevAriaHidden")) {
      const prevAriaHidden = node.dataset.examLockPrevAriaHidden;
      if (prevAriaHidden === "__none__") {
        node.removeAttribute("aria-hidden");
      } else if (typeof prevAriaHidden === "string") {
        node.setAttribute("aria-hidden", prevAriaHidden);
      }
      delete node.dataset.examLockPrevAriaHidden;
    }
    delete node.dataset.examLockBlocked;
  }

  function setExamFocusTrapGestureListeners(active) {
    const shouldEnable = !!active;
    if (shouldEnable === examFocusTrapGestureListenersActive) {
      return;
    }

    const gestureOptions = { capture: true, passive: false };
    if (shouldEnable) {
      document.addEventListener("touchstart", handleExamFocusTrapPointerDown, gestureOptions);
      document.addEventListener("wheel", handleExamFocusTrapWheel, gestureOptions);
      document.addEventListener("touchmove", handleExamFocusTrapTouchMove, gestureOptions);
    } else {
      document.removeEventListener("touchstart", handleExamFocusTrapPointerDown, gestureOptions);
      document.removeEventListener("wheel", handleExamFocusTrapWheel, gestureOptions);
      document.removeEventListener("touchmove", handleExamFocusTrapTouchMove, gestureOptions);
    }

    examFocusTrapGestureListenersActive = shouldEnable;
  }

  function syncExamFocusLockState(options = {}) {
    const scope = getActiveExamFocusScope();
    const shouldLock = !!scope;
    setExamFocusTrapGestureListeners(shouldLock);

    if (document.body instanceof HTMLElement) {
      document.body.classList.toggle("exam-focus-locked", shouldLock);
      document.body.dataset.examLockActive = shouldLock ? "1" : "0";
    }
    if (document.documentElement instanceof HTMLElement) {
      document.documentElement.classList.toggle("exam-focus-locked-page", shouldLock);
      document.documentElement.dataset.examLockActive = shouldLock ? "1" : "0";
    }

    const blockedNodes = getExamFocusLockBlockedNodes();
    blockedNodes.forEach((node) => setExamFocusLockNodeState(node, shouldLock));

    if (!shouldLock || !(scope instanceof HTMLElement)) {
      examFocusLockStateActive = false;
      return;
    }

    closeHeaderTransientUi();
    setSettingsPanelOpen(false);

    const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (!activeElement || !scope.contains(activeElement)) {
      focusExamPrimaryElement(scope);
    }

    if (!examFocusLockStateActive && !options.skipScrollIntoView) {
      scope.scrollIntoView({ block: "start", inline: "nearest", behavior: "auto" });
    }

    examFocusLockStateActive = true;
  }

  function handleExamFocusTrapKeydown(event) {
    const key = asText(event.key, "").trim();
    if (key !== "Tab") {
      return false;
    }

    const scope = getActiveExamFocusScope();
    if (!scope) {
      return false;
    }

    const focusables = getFocusableElementsWithin(scope);
    if (!focusables.length) {
      event.preventDefault();
      scope.focus();
      return true;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const activeInside = active ? scope.contains(active) : false;

    if (!activeInside) {
      event.preventDefault();
      first.focus();
      return true;
    }

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
      return true;
    }

    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
      return true;
    }

    return false;
  }

  function openSubject(subjectId) {
    if (!subjectId) {
      return;
    }

    state.view.level = 2;
    state.view.subjectId = subjectId;
    state.view.chapterId = null;
    state.view.tab = "bank";
    state.pagination.page = 1;
    sanitizeView();
    render();
  }

  function openChapter(chapterId) {
    if (!chapterId) {
      return;
    }

    state.view.level = 3;
    state.view.chapterId = chapterId;
    state.view.tab = "bank";
    state.pagination.page = 1;
    sanitizeView();
    render();

    const subject = getActiveSubject();
    const chapter = getActiveChapter();
    if (subject && chapter) {
      void ensureChapterQuestionsLoaded(subject, chapter);
    }
  }

  function getChapterRouteHash(subjectId, chapterId, tab = "bank") {
    const safeSubjectId = asText(subjectId, "").trim();
    const safeChapterId = asText(chapterId, "").trim();
    const safeTab = asText(tab, "bank").trim() || "bank";
    if (!safeSubjectId || !safeChapterId) {
      return "";
    }
    const semester = getActiveReviewTerm();
    return `#/term/${encodeURIComponent(semester)}/course/${encodeURIComponent(safeSubjectId)}/chapter/${encodeURIComponent(safeChapterId)}/${encodeURIComponent(safeTab)}`;
  }

  function updateChapterRouteHash(subjectId, chapterId, tab = "bank") {
    const nextHash = getChapterRouteHash(subjectId, chapterId, tab);
    if (!nextHash) {
      return;
    }

    if (window.location.hash === nextHash) {
      return;
    }

    try {
      if (window.history && typeof window.history.replaceState === "function") {
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${nextHash}`);
      } else {
        window.location.hash = nextHash;
      }
    } catch {
      window.location.hash = nextHash;
    }
  }

  function navigateToChapter(subjectId, chapterId, options = {}) {
    const safeSubjectId = asText(subjectId, "").trim();
    const safeChapterId = asText(chapterId, "").trim();
    if (!safeSubjectId || !safeChapterId) {
      return;
    }

    if (state.view.subjectId !== safeSubjectId) {
      state.view.subjectId = safeSubjectId;
    }

    openChapter(safeChapterId);

    if (options.updateHash !== false) {
      updateChapterRouteHash(safeSubjectId, safeChapterId, asText(options.tab, "bank"));
    }
  }

  function openChapterFromMap(actionTarget) {
    const subjectId = asText(actionTarget?.dataset?.subjectId, state.view.subjectId || "");
    const chapterId = asText(actionTarget?.dataset?.chapterId, "");
    if (!subjectId || !chapterId) {
      return;
    }
    navigateToChapter(subjectId, chapterId, { tab: "bank" });
  }

  function handleChapterMove(actionTarget, direction) {
    const subjectId = asText(actionTarget.dataset.subjectId, "");
    const chapterId = asText(actionTarget.dataset.chapterId, "");
    if (!subjectId || !chapterId || !Number.isInteger(direction)) {
      return;
    }

    const subject = state.subjects.find((item) => item.id === subjectId);
    if (!subject || !Array.isArray(subject.chapters) || subject.chapters.length < 2) {
      return;
    }

    const currentIndex = subject.chapters.findIndex((item) => item.id === chapterId);
    if (currentIndex < 0) {
      return;
    }

    const targetIndex = currentIndex + direction;
    if (targetIndex < 0 || targetIndex >= subject.chapters.length) {
      return;
    }

    const [chapter] = subject.chapters.splice(currentIndex, 1);
    subject.chapters.splice(targetIndex, 0, chapter);
    normalizeSubjectChapterOrder(subject);

    persistSubjects();
    render();
    setStatus(direction < 0 ? "فصل به بالا منتقل شد." : "فصل به پایین منتقل شد.", "ok");
  }

  function addSubjectFromForm(form) {
    const input = form.elements.namedItem("subjectName");
    const name = asText(input?.value, "").trim();
    if (!name) {
      setStatus("نام درس نمی تواند خالی باشد.", "error");
      return;
    }

    state.subjects.push({ id: createId("sub"), name, chapters: [] });

    if (input) {
      input.value = "";
    }

    persistSubjects();
    render();
    setStatus("درس جدید ثبت شد.", "ok");
  }

  function addChapterFromForm(form) {
    const subject = getActiveSubject();
    if (!subject) {
      setStatus("ابتدا یک درس انتخاب کنید.", "error");
      return;
    }

    const input = form.elements.namedItem("chapterName");
    const name = asText(input?.value, "").trim();
    if (!name) {
      setStatus("نام فصل نمی تواند خالی باشد.", "error");
      return;
    }

    subject.chapters.push({
      id: createId("ch"),
      order: subject.chapters.length + 1,
      name,
      questionsFile: null,
      questions: [],
      questionsLoaded: true,
      tree: []
    });
    normalizeSubjectChapterOrder(subject);

    if (input) {
      input.value = "";
    }

    persistSubjects();
    render();
    setStatus("فصل جدید اضافه شد.", "ok");
  }

  function generateExamFromForm(form) {
    const subject = getActiveSubject();
    const runtime = getActiveRuntime();
    if (!subject || !runtime) {
      return;
    }

    const formData = new FormData(form);
    const chapterIds = formData.getAll("chapterIds").map((item) => asText(item, "")).filter(Boolean);
    const selectedChapters = subject.chapters.filter((item) => chapterIds.includes(item.id));
    const chapterSpecs = selectedChapters.map((item) => {
      const chapterPool = dedupeQuestionsById(Array.isArray(item.questions) ? item.questions : []);
      const rawChapterCount = Number.parseInt(asText(formData.get(`chapterCount::${item.id}`), "0"), 10);
      const requestedRaw = Number.isFinite(rawChapterCount) ? rawChapterCount : 0;
      return {
        chapter: item,
        pool: chapterPool,
        capacity: chapterPool.length,
        requestedRaw
      };
    });
    const rawPool = chapterSpecs.flatMap((item) => item.pool);
    const pool = dedupeQuestionsById(rawPool);

    if (!chapterIds.length || !pool.length) {
      runtime.exam = null;
      setStatus("حداقل یک فصل دارای سوال انتخاب کنید.", "error");
      render();
      return;
    }

    const countValue = Number.parseInt(asText(formData.get("examCount"), "0"), 10);
    const examProfile = asText(formData.get("examProfile"), "mixed");
    const examOrder = asText(formData.get("examOrder"), "random");
    const examDifficultyPlan = normalizeExamDifficultyPlan(formData.get("examDifficultyPlan"));
    const durationValue = Number.parseInt(asText(formData.get("examDuration"), "0"), 10);
    const requestedCount = Number.isFinite(countValue) ? countValue : 1;
    const safeTargetCount = clampNumber(requestedCount, 1, pool.length, Math.min(10, pool.length));
    const preferredPlan = Object.fromEntries(
      chapterSpecs.map((item) => [item.chapter.id, clampNumber(item.requestedRaw, 0, item.capacity, 0)])
    );
    let requestedChapterCounts = preferredPlan;
    let requestedTotal = Object.values(requestedChapterCounts).reduce((sum, value) => sum + (Number(value) || 0), 0);

    if (requestedTotal <= 0) {
      requestedChapterCounts = buildBalancedExamChapterPlan(
        chapterSpecs.map((item) => ({ id: item.chapter.id, maxCount: item.capacity })),
        safeTargetCount
      );
      requestedTotal = Object.values(requestedChapterCounts).reduce((sum, value) => sum + (Number(value) || 0), 0);
    }

    if (requestedTotal <= 0) {
      runtime.exam = null;
      setStatus("برای فصل‌های انتخابی، سهم سوال معتبر قابل تولید نیست.", "error");
      render();
      return;
    }

    const safeDuration = clampNumber(durationValue, EXAM_DURATION_MIN, EXAM_DURATION_MAX, EXAM_DURATION_DEFAULT);
    const selectedPerChapter = [];
    const actualChapterCounts = {};

    chapterSpecs.forEach((spec) => {
      const planned = clampNumber(requestedChapterCounts[spec.chapter.id], 0, spec.capacity, 0);
      if (planned <= 0 || !spec.capacity) {
        actualChapterCounts[spec.chapter.id] = 0;
        return;
      }

      const chunk = selectQuestionsByExamProfile(spec.pool, planned, examProfile, examDifficultyPlan);
      actualChapterCounts[spec.chapter.id] = chunk.length;
      if (chunk.length) {
        selectedPerChapter.push(...chunk);
      }
    });

    const selected = dedupeQuestionsById(selectedPerChapter);
    const orderedSelected = orderExamQuestions(selected, examOrder);
    const nowMs = Date.now();

    if (!orderedSelected.length) {
      runtime.exam = null;
      setStatus("با تنظیمات فعلی، سوالی برای آزمون تولید نشد.", "error");
      render();
      return;
    }

    runtime.exam = {
      profile: examProfile,
      order: normalizeExamOrder(examOrder),
      difficultyPlan: examDifficultyPlan,
      duration: safeDuration,
      count: orderedSelected.length,
      chapterIds,
      requestedCount: requestedTotal,
      requestedChapterCounts,
      actualChapterCounts,
      ids: orderedSelected.map((item) => item.id),
      page: 1,
      poolCount: pool.length,
      createdAt: new Date().toISOString(),
      examCode: createExamCode(),
      completed: false,
      completedReason: "",
      completedAt: "",
      evaluation: null,
      answerMarks: {},
      timer: {
        durationMs: safeDuration * 60 * 1000,
        startedAtMs: nowMs,
        endsAtMs: nowMs + safeDuration * 60 * 1000
      }
    };

    if (orderedSelected.length < requestedTotal) {
      setStatus(`از ${requestedTotal} سهم درخواستی، ${orderedSelected.length} سوال قابل تولید بود.`, "ok");
    } else {
      setStatus("آزمون جدید با سهم‌بندی فصل‌ها و توزیع هوشمند سختی تولید شد.", "ok");
    }

    touchExamRuntimeAutosave(true);
    render();
  }

  function setExamChapterSelection(checked) {
    const form = refs.levelContainer.querySelector(".exam-builder-form");
    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    const inputs = form.querySelectorAll('input[name="chapterIds"]');
    inputs.forEach((input) => {
      if (input instanceof HTMLInputElement) {
        input.checked = !!checked;
      }
    });
    rebalanceExamChapterCountsForm(form);
  }

  function buildBalancedExamChapterPlan(chapters, targetCount, preferredMap = null) {
    const entries = Array.isArray(chapters) ? chapters : [];
    const normalized = entries
      .map((item) => ({
        id: asText(item?.id, "").trim(),
        maxCount: Math.max(0, Number(item?.maxCount) || 0)
      }))
      .filter((item) => !!item.id);
    const plan = {};
    normalized.forEach((item) => {
      plan[item.id] = 0;
    });

    const active = normalized.filter((item) => item.maxCount > 0);
    if (!active.length) {
      return plan;
    }

    if (preferredMap && typeof preferredMap === "object") {
      active.forEach((item) => {
        const raw = Number.parseInt(asText(preferredMap[item.id], "0"), 10);
        const value = Number.isFinite(raw) ? raw : 0;
        plan[item.id] = clampNumber(value, 0, item.maxCount, 0);
      });
      const preferredTotal = active.reduce((sum, item) => sum + (plan[item.id] || 0), 0);
      if (preferredTotal > 0) {
        return plan;
      }
    }

    const totalCapacity = active.reduce((sum, item) => sum + item.maxCount, 0);
    const safeTarget = clampNumber(targetCount, 1, totalCapacity, Math.min(10, totalCapacity));
    let remaining = safeTarget;
    let cursor = 0;
    let guard = totalCapacity * 3 + 32;

    while (remaining > 0 && guard > 0) {
      const current = active[cursor % active.length];
      if (plan[current.id] < current.maxCount) {
        plan[current.id] += 1;
        remaining -= 1;
      }
      cursor += 1;
      guard -= 1;
      if (active.every((item) => plan[item.id] >= item.maxCount)) {
        break;
      }
    }

    return plan;
  }

  function rebalanceExamChapterCountsForm(form, options = {}) {
    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    const preserveExisting = !!options.preserveExisting;
    const targetInput = form.elements.namedItem("examCount");
    const targetRaw = Number.parseInt(asText(targetInput?.value, "0"), 10);
    const targetCount = Number.isFinite(targetRaw) ? targetRaw : 1;

    const chapterInputs = Array.from(form.querySelectorAll('input[name="chapterIds"]')).filter(
      (item) => item instanceof HTMLInputElement
    );

    const chapterEntries = chapterInputs.map((checkbox) => {
      const container = checkbox.closest(".exam-chapter-check");
      const countInput = container?.querySelector('input[data-role="exam-chapter-count"]');
      const maxRaw = Number.parseInt(asText(countInput?.max, "0"), 10);
      const maxCount = Number.isFinite(maxRaw) ? Math.max(0, maxRaw) : 0;
      return {
        id: asText(checkbox.value, "").trim(),
        checked: checkbox.checked,
        maxCount,
        countInput: countInput instanceof HTMLInputElement ? countInput : null
      };
    });

    const selected = chapterEntries.filter((item) => item.checked && item.id);
    const preferredMap = preserveExisting
      ? Object.fromEntries(
          selected.map((item) => {
            const raw = Number.parseInt(asText(item.countInput?.value, "0"), 10);
            return [item.id, Number.isFinite(raw) ? raw : 0];
          })
        )
      : null;

    const plan = buildBalancedExamChapterPlan(
      selected.map((item) => ({ id: item.id, maxCount: item.maxCount })),
      targetCount,
      preferredMap
    );

    chapterEntries.forEach((item) => {
      if (!(item.countInput instanceof HTMLInputElement)) {
        return;
      }

      if (!item.checked) {
        item.countInput.value = "0";
        item.countInput.disabled = true;
        return;
      }

      item.countInput.disabled = false;
      item.countInput.value = String(plan[item.id] || 0);
    });
  }

  function handleExamBalanceCounts(target) {
    const form =
      (target instanceof HTMLElement ? target.closest(".exam-builder-form") : null) ||
      refs.levelContainer.querySelector(".exam-builder-form");
    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    rebalanceExamChapterCountsForm(form);
    setStatus("سهم سوال فصل‌ها به‌صورت مساوی و بهینه تنظیم شد.", "ok");
  }

  function handleExamBuilderSelectionChange(target) {
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    const form = target.closest(".exam-builder-form");
    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    rebalanceExamChapterCountsForm(form);
  }

  function handleExamTargetCountChange(target) {
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    const form = target.closest(".exam-builder-form");
    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    rebalanceExamChapterCountsForm(form);
  }

  function clearComputedMapCaches(options = {}) {
    const reviewOnly = options?.reviewOnly === true;
    chapterReviewSnapshotCache.clear();
    bankFilterResultCache.clear();
    if (reviewOnly) {
      return;
    }
    chapterTopicOptionsCache.clear();
  }

  function setBoundedMapCache(cacheMap, key, value, limit = 180) {
    if (!(cacheMap instanceof Map)) {
      return;
    }
    if (cacheMap.has(key)) {
      cacheMap.delete(key);
    }
    cacheMap.set(key, value);
    if (cacheMap.size <= limit) {
      return;
    }
    const overflow = cacheMap.size - limit;
    const iterator = cacheMap.keys();
    for (let index = 0; index < overflow; index += 1) {
      const item = iterator.next();
      if (item.done) {
        break;
      }
      cacheMap.delete(item.value);
    }
  }

  function bumpReviewMetadataRevision() {
    reviewMetadataRevision += 1;
    clearComputedMapCaches({ reviewOnly: true });
  }

  function bumpSubjectsRevision() {
    subjectsRevision += 1;
    settingsStatsCache.revision = -1;
    clearComputedMapCaches();
  }

  function isSettingsPanelOpen() {
    return refs.settingsPanel instanceof HTMLElement && refs.settingsPanel.classList.contains("is-open");
  }

  function stringifyRuntimeError(reason) {
    if (reason instanceof Error) {
      return asText(reason.message, "خطای ناشناخته");
    }
    if (typeof reason === "string") {
      return reason;
    }
    if (reason && typeof reason === "object") {
      const objectMessage = asText(reason.message, "").trim();
      if (objectMessage) {
        return objectMessage;
      }
      try {
        const serialized = JSON.stringify(reason);
        if (serialized && serialized !== "{}") {
          return serialized;
        }
      } catch {
        // ignore serialization issue
      }
    }
    return "خطای ناشناخته";
  }

  function isIgnorableRuntimeErrorMessage(message) {
    const text = asText(message, "");
    if (!text) {
      return false;
    }
    return /ResizeObserver loop (limit exceeded|completed with undelivered notifications)/i.test(text);
  }

  function reportRuntimeError(reason, context = "runtime") {
    const message = stringifyRuntimeError(reason);
    if (isIgnorableRuntimeErrorMessage(message)) {
      return;
    }

    if (reason instanceof Error) {
      console.error(`[${context}]`, reason);
    } else {
      console.error(`[${context}]`, message, reason);
    }

    const now = Date.now();
    if (now - lastRuntimeErrorStatusAtMs < RUNTIME_ERROR_STATUS_COOLDOWN_MS) {
      return;
    }

    setStatus(`خطای داخلی (${context}) مدیریت شد. برنامه پایدار نگه داشته شد.`, "error");
    lastRuntimeErrorStatusAtMs = now;
  }

  function forceReleaseExamFocusLock(reason = "") {
    setExamFocusTrapGestureListeners(false);
    examFocusLockStateActive = false;

    if (document.body instanceof HTMLElement) {
      document.body.classList.remove("exam-focus-locked");
      document.body.dataset.examLockActive = "0";
    }

    if (document.documentElement instanceof HTMLElement) {
      document.documentElement.classList.remove("exam-focus-locked-page");
      document.documentElement.dataset.examLockActive = "0";
    }

    const blockedNodes = getExamFocusLockBlockedNodes();
    blockedNodes.forEach((node) => setExamFocusLockNodeState(node, false));

    if (reason) {
      console.info(`[exam-focus-lock] stale lock released (${reason})`);
    }
  }

  function healMobileScrollLock(reason = "") {
    if (!isMobileViewportActive()) {
      return;
    }

    const bodyLocked = document.body instanceof HTMLElement && document.body.classList.contains("exam-focus-locked");
    const htmlLocked =
      document.documentElement instanceof HTMLElement && document.documentElement.classList.contains("exam-focus-locked-page");

    if (!bodyLocked && !htmlLocked) {
      return;
    }

    const activeScope = getActiveExamFocusScope();
    if (activeScope) {
      return;
    }

    forceReleaseExamFocusLock(reason || "mobile-scroll-heal");
  }

  function renderEmergencyFallback() {
    if (!(refs.levelContainer instanceof HTMLElement)) {
      return;
    }

    const panel = document.createElement("section");
    panel.className = "surface runtime-fallback";
    panel.setAttribute("role", "alert");

    const title = document.createElement("h2");
    title.className = "runtime-fallback-title";
    title.textContent = "حالت ایمن فعال شد";

    const desc = document.createElement("p");
    desc.className = "runtime-fallback-text";
    desc.textContent = "برای پایداری موبایل، رابط به حالت ساده برگشت. روی «بارگذاری مجدد» بزن.";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "glass-btn runtime-fallback-btn";
    button.textContent = "بارگذاری مجدد";
    button.addEventListener("click", () => {
      window.location.reload();
    });

    panel.append(title, desc, button);
    refs.levelContainer.replaceChildren(panel);
  }

  function attemptMobileSoftRecovery(context = "runtime") {
    if (!isMobileViewportActive()) {
      return;
    }

    const now = Date.now();
    if (now < mobileSoftRecoveryLockedUntilMs) {
      return;
    }
    mobileSoftRecoveryLockedUntilMs = now + MOBILE_SOFT_RECOVERY_COOLDOWN_MS;

    if (state.sync.handshakeInProgress || state.sync.pullInProgress || state.sync.pushInProgress) {
      return;
    }

    try {
      healMobileScrollLock(`soft-recovery:${context}`);
      queueRender();
      setStatus(`بازیابی خودکار موبایل (${context}) انجام شد.`, "info");
    } catch (error) {
      reportRuntimeError(error, "mobile-soft-recovery");
      renderEmergencyFallback();
    }
  }

  function setupAutomaticMaintenanceLoop() {
    stopAutomaticMaintenanceLoop();
    scheduleAutomaticMaintenance("bootstrap", { delayMs: AUTO_MAINTENANCE_START_DELAY_MS });
  }

  function stopAutomaticMaintenanceLoop() {
    if (autoMaintenanceTimerId !== null) {
      window.clearTimeout(autoMaintenanceTimerId);
      autoMaintenanceTimerId = null;
    }
  }

  function resolveAutomaticMaintenanceIntervalMs() {
    if (document.hidden) {
      return AUTO_MAINTENANCE_INTERVAL_HIDDEN_MS;
    }
    if (isMobileViewportActive() || isMobilePerformanceLiteActive()) {
      return AUTO_MAINTENANCE_INTERVAL_MOBILE_MS;
    }
    return AUTO_MAINTENANCE_INTERVAL_DESKTOP_MS;
  }

  function scheduleAutomaticMaintenance(reason = "", options = {}) {
    const forceReschedule = options?.forceReschedule === true;
    if (autoMaintenanceTimerId !== null && !forceReschedule) {
      return;
    }

    if (autoMaintenanceTimerId !== null) {
      window.clearTimeout(autoMaintenanceTimerId);
      autoMaintenanceTimerId = null;
    }

    const requestedDelay = Number(options?.delayMs);
    const resolvedDelay = Number.isFinite(requestedDelay) && requestedDelay > 0
      ? requestedDelay
      : resolveAutomaticMaintenanceIntervalMs();
    const safeDelay = Math.max(30000, Math.round(resolvedDelay));

    autoMaintenanceTimerId = window.setTimeout(() => {
      autoMaintenanceTimerId = null;
      void runAutomaticMaintenanceCycle(reason || "timer");
    }, safeDelay);
  }

  async function requestAutomaticMaintenance(reason = "", options = {}) {
    const minInterval = Number(options?.minIntervalMs);
    const safeMinInterval = Number.isFinite(minInterval) && minInterval > 0 ? minInterval : 0;
    const now = Date.now();
    if (safeMinInterval > 0 && now - autoMaintenanceLastRunAtMs < safeMinInterval) {
      scheduleAutomaticMaintenance("throttled", { forceReschedule: true });
      return false;
    }
    await runAutomaticMaintenanceCycle(reason || "manual");
    return true;
  }

  async function runAutomaticMaintenanceCycle(reason = "") {
    if (autoMaintenanceInFlight) {
      scheduleAutomaticMaintenance("busy-retry", {
        forceReschedule: true,
        delayMs: Math.min(90000, resolveAutomaticMaintenanceIntervalMs())
      });
      return;
    }

    autoMaintenanceInFlight = true;
    const startedAt = Date.now();
    try {
      const pruneResult = pruneTransientRuntimeState();

      const reviewChanged = reconcileReviewMetadataAfterDataChange({
        migrateLegacy: false,
        persist: false
      });
      if (reviewChanged) {
        persistReviewMetadata();
      }

      if (pruneResult.hasRuntimeChanges) {
        syncLiveTimerLifecycle();
      }

      await runBrowserCacheMaintenance();

      if (isMobileViewportActive()) {
        healMobileScrollLock(`maintenance:${reason || "auto"}`);
      }
    } catch (error) {
      reportRuntimeError(error, "auto-maintenance");
    } finally {
      autoMaintenanceInFlight = false;
      autoMaintenanceLastRunAtMs = Date.now();
      const elapsed = autoMaintenanceLastRunAtMs - startedAt;
      const nextDelay = Math.max(60000, resolveAutomaticMaintenanceIntervalMs() - Math.min(elapsed, 120000));
      scheduleAutomaticMaintenance("cycle-complete", {
        forceReschedule: true,
        delayMs: nextDelay
      });
    }
  }

  function collectValidRuntimeKeys(subjects = state.subjects) {
    const subjectIds = new Set();
    const chapterKeys = new Set();

    (Array.isArray(subjects) ? subjects : []).forEach((subject) => {
      const subjectId = asText(subject?.id, "").trim();
      if (!subjectId) {
        return;
      }
      subjectIds.add(subjectId);

      const chapters = Array.isArray(subject?.chapters) ? subject.chapters : [];
      chapters.forEach((chapter) => {
        const chapterId = asText(chapter?.id, "").trim();
        if (!chapterId) {
          return;
        }
        chapterKeys.add(`${subjectId}::${chapterId}`);
      });
    });

    return { subjectIds, chapterKeys };
  }

  function cleanupStaleReviewNoteTimers(validScopeKeys) {
    const safeValidKeys = validScopeKeys instanceof Set ? validScopeKeys : new Set();
    let debounceCleared = 0;
    let indicatorCleared = 0;

    for (const [scopedKey, timerId] of reviewNoteDebounceMap.entries()) {
      if (safeValidKeys.has(scopedKey)) {
        continue;
      }
      window.clearTimeout(timerId);
      reviewNoteDebounceMap.delete(scopedKey);
      debounceCleared += 1;
    }

    for (const [scopedKey, timerId] of reviewNoteSavedIndicatorTimers.entries()) {
      if (safeValidKeys.has(scopedKey)) {
        continue;
      }
      window.clearTimeout(timerId);
      reviewNoteSavedIndicatorTimers.delete(scopedKey);
      indicatorCleared += 1;
    }

    return {
      debounceCleared,
      indicatorCleared
    };
  }

  function pruneTransientRuntimeState() {
    const { subjectIds, chapterKeys } = collectValidRuntimeKeys(state.subjects);
    const validScopeKeys = getAllQuestionScopeKeys(state.subjects);

    let runtimeEntriesRemoved = 0;
    let uiEntriesRemoved = 0;
    let mapStateRemoved = 0;
    let treeStateRemoved = 0;

    for (const key of Array.from(chapterRuntime.keys())) {
      if (chapterKeys.has(key)) {
        continue;
      }
      chapterRuntime.delete(key);
      runtimeEntriesRemoved += 1;
    }

    for (const key of Array.from(chapterUiState.keys())) {
      if (chapterKeys.has(key)) {
        continue;
      }
      chapterUiState.delete(key);
      uiEntriesRemoved += 1;
    }

    for (const key of Array.from(chapterMapUiState.keys())) {
      if (subjectIds.has(key)) {
        continue;
      }
      chapterMapUiState.delete(key);
      mapStateRemoved += 1;
    }

    for (const key of Array.from(chapterTreeCollapseState.keys())) {
      if (subjectIds.has(key)) {
        continue;
      }
      chapterTreeCollapseState.delete(key);
      treeStateRemoved += 1;
    }

    const reviewTimerCleanup = cleanupStaleReviewNoteTimers(validScopeKeys);

    if (state.view.tab !== "bank" && visibleQuestionLookup.size) {
      visibleQuestionLookup.clear();
    }

    return {
      runtimeEntriesRemoved,
      uiEntriesRemoved,
      mapStateRemoved,
      treeStateRemoved,
      reviewTimersCleared: reviewTimerCleanup.debounceCleared + reviewTimerCleanup.indicatorCleared,
      hasRuntimeChanges:
        runtimeEntriesRemoved > 0 ||
        uiEntriesRemoved > 0 ||
        mapStateRemoved > 0 ||
        treeStateRemoved > 0 ||
        reviewTimerCleanup.debounceCleared > 0 ||
        reviewTimerCleanup.indicatorCleared > 0
    };
  }

  function parseCacheVersionParts(value) {
    const raw = asText(value, "").trim().replace(/^v/i, "");
    if (!raw) {
      return [];
    }
    return raw
      .split(".")
      .map((item) => Number.parseInt(item, 10))
      .map((item) => (Number.isFinite(item) ? item : 0));
  }

  function compareCacheVersionParts(a, b) {
    const left = Array.isArray(a) ? a : [];
    const right = Array.isArray(b) ? b : [];
    const length = Math.max(left.length, right.length);
    for (let index = 0; index < length; index += 1) {
      const diff = (left[index] || 0) - (right[index] || 0);
      if (diff !== 0) {
        return diff;
      }
    }
    return 0;
  }

  async function requestServiceWorkerMaintenance() {
    if (!("serviceWorker" in navigator)) {
      return false;
    }

    let registration = null;
    try {
      registration = await navigator.serviceWorker.getRegistration(PWA_SERVICE_WORKER_PATH);
      if (!registration) {
        registration = await navigator.serviceWorker.getRegistration();
      }
    } catch {
      registration = null;
    }

    const target =
      registration?.active ||
      registration?.waiting ||
      registration?.installing ||
      navigator.serviceWorker.controller ||
      null;
    if (!target || typeof target.postMessage !== "function") {
      return false;
    }

    target.postMessage({
      type: "RUN_MAINTENANCE",
      source: "app-auto-maintenance",
      requestedAt: new Date().toISOString()
    });
    return true;
  }

  async function runBrowserCacheMaintenance() {
    await requestServiceWorkerMaintenance();

    if (!("caches" in window)) {
      return;
    }

    const keys = await caches.keys();
    const safeKeys = Array.isArray(keys) ? keys.filter((key) => asText(key, "").startsWith(CACHE_KEY_PREFIX)) : [];
    if (!safeKeys.length) {
      return;
    }

    const bucket = {
      static: [],
      runtime: []
    };

    safeKeys.forEach((cacheName) => {
      const match = /^mqb-(static|runtime)-(.+)$/i.exec(asText(cacheName, "").trim());
      if (!match) {
        return;
      }
      const role = match[1].toLowerCase();
      const version = parseCacheVersionParts(match[2]);
      bucket[role].push({ name: cacheName, version });
    });

    const removable = [];
    ["static", "runtime"].forEach((role) => {
      const entries = bucket[role];
      if (!entries || entries.length <= 1) {
        return;
      }
      entries.sort((a, b) => compareCacheVersionParts(b.version, a.version));
      entries.slice(1).forEach((entry) => removable.push(entry.name));
    });

    if (!removable.length) {
      return;
    }

    await Promise.allSettled(removable.map((cacheName) => caches.delete(cacheName)));
  }

  function isReducedMotionPreferred() {
    return typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function dismissAppBootSplash() {
    if (bootSplashDismissed) {
      return;
    }
    const splash = refs.appBootSplash;
    bootSplashDismissed = true;
    if (!(splash instanceof HTMLElement)) {
      if (document.body instanceof HTMLElement) {
        document.body.classList.add("app-boot-done");
      }
      return;
    }

    splash.setAttribute("aria-hidden", "true");
    if (isReducedMotionPreferred()) {
      splash.hidden = true;
      if (document.body instanceof HTMLElement) {
        document.body.classList.add("app-boot-done");
      }
      return;
    }

    splash.classList.add("is-hiding");
    window.setTimeout(() => {
      splash.hidden = true;
      splash.classList.remove("is-hiding");
      if (document.body instanceof HTMLElement) {
        document.body.classList.add("app-boot-done");
      }
    }, 360);
  }

  function buildRenderContextKey() {
    return [
      String(state.view.level),
      asText(state.view.subjectId, "-"),
      asText(state.view.chapterId, "-"),
      asText(state.view.tab, "-")
    ].join("|");
  }

  function triggerAppViewTransition() {
    const container = refs.levelContainer;
    if (!(container instanceof HTMLElement) || isReducedMotionPreferred()) {
      return;
    }

    if (renderTransitionCleanupTimerId) {
      window.clearTimeout(renderTransitionCleanupTimerId);
      renderTransitionCleanupTimerId = 0;
    }

    container.classList.remove("is-view-transitioning");
    if (document.body instanceof HTMLElement) {
      document.body.classList.remove("is-view-transitioning");
    }
    void container.offsetWidth;
    container.classList.add("is-view-transitioning");
    if (document.body instanceof HTMLElement) {
      document.body.classList.add("is-view-transitioning");
    }

    renderTransitionCleanupTimerId = window.setTimeout(() => {
      container.classList.remove("is-view-transitioning");
      if (document.body instanceof HTMLElement) {
        document.body.classList.remove("is-view-transitioning");
      }
      renderTransitionCleanupTimerId = 0;
    }, APP_VIEW_TRANSITION_MS + 80);
  }

  function clearPressFeedback(target) {
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const timerId = pressFeedbackTimers.get(target);
    if (timerId) {
      window.clearTimeout(timerId);
      pressFeedbackTimers.delete(target);
    }
    target.classList.remove("is-pressed");
  }

  function handlePressFeedbackPointerDown(event) {
    if (!(event.target instanceof Element) || !event.isPrimary) {
      return;
    }
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    const pressable = event.target.closest(APP_PRESSABLE_SELECTOR);
    if (!(pressable instanceof HTMLElement)) {
      return;
    }
    if (pressable.hasAttribute("disabled") || pressable.getAttribute("aria-disabled") === "true") {
      return;
    }

    clearPressFeedback(pressable);
    pressable.classList.add("is-pressed");
    const timerId = window.setTimeout(() => {
      pressable.classList.remove("is-pressed");
      pressFeedbackTimers.delete(pressable);
    }, 220);
    pressFeedbackTimers.set(pressable, timerId);
  }

  function handlePressFeedbackPointerRelease(event) {
    if (!(event.target instanceof Element)) {
      return;
    }
    const pressable = event.target.closest(APP_PRESSABLE_SELECTOR);
    clearPressFeedback(pressable);
  }

  function recoverFromRenderFailure(error) {
    reportRuntimeError(error, "render");

    if (isMobileViewportActive()) {
      try {
        state.view.level = 1;
        state.view.subjectId = null;
        state.view.chapterId = null;
        state.view.tab = "bank";
        sanitizeView();
        visibleQuestionLookup.clear();
        disconnectMathObserver();
        activeChapterMapView = null;
        renderBreadcrumbs();
        renderSubjectsLevel();
        lastRenderContextKey = buildRenderContextKey();
        syncExamFocusLockState({ skipScrollIntoView: true });
        syncLiveTimerLifecycle();
        setStatus("برای پایداری موبایل، صفحه اصلی بازیابی شد.", "info");
        return;
      } catch (recoveryError) {
        reportRuntimeError(recoveryError, "render-recovery");
      }
    }

    renderEmergencyFallback();
  }

  function queueRender() {
    if (renderQueued) {
      return;
    }
    renderQueued = true;
    renderRafId = window.requestAnimationFrame(() => {
      renderQueued = false;
      renderRafId = 0;
      render();
    });
  }

  function isPrintMediaQueryActive() {
    return typeof window.matchMedia === "function" && window.matchMedia("print").matches;
  }

  function clearStalePrintBodyClasses(reason = "") {
    const body = document.body;
    if (!(body instanceof HTMLElement)) {
      return false;
    }
    if (isPrintMediaQueryActive()) {
      return false;
    }

    const printClassNames = ["print-exam-only", "print-exam-mobile", "print-exam-with-answers"];
    let changed = false;
    if (body.dataset.printViewport === "desktop") {
      delete body.dataset.printViewport;
      applyViewportMode(state.viewportMode);
      changed = true;
    }
    printClassNames.forEach((className) => {
      if (!body.classList.contains(className)) {
        return;
      }
      body.classList.remove(className);
      changed = true;
    });

    if (!changed) {
      return false;
    }

    const examRegions = document.querySelectorAll(".exam-session-region");
    examRegions.forEach((region) => {
      if (!(region instanceof HTMLElement)) {
        return;
      }
      try {
        clearExamPrintPagination(region);
        ensureExamPrintAnswerSheet(region, { includeAnswers: false });
      } catch (error) {
        reportRuntimeError(error, `print-recovery:${reason}`);
      }
    });

    return true;
  }

  function scheduleUiVisibilityHealthCheck(contextKey = "") {
    if (uiHealthCheckRafId) {
      window.cancelAnimationFrame(uiHealthCheckRafId);
      uiHealthCheckRafId = 0;
    }

    uiHealthCheckRafId = window.requestAnimationFrame(() => {
      uiHealthCheckRafId = 0;
      runUiVisibilityHealthCheck(contextKey || buildRenderContextKey());
    });
  }

  function runUiVisibilityHealthCheck(contextKey = "") {
    if (!(refs.levelContainer instanceof HTMLElement)) {
      return;
    }

    clearStalePrintBodyClasses("health-check");

    if (state.view.level !== 3) {
      uiHealthLastIssueContext = "";
      return;
    }

    const panelSelectors = {
      bank: ".question-bank-panel:not(.practice-mode-panel):not(.exam-mode-panel):not(.chapter-map-panel)",
      practice: ".practice-mode-panel",
      exam: ".exam-mode-panel",
      "chapter-map": ".chapter-map-panel"
    };

    const panelSelector = panelSelectors[state.view.tab];
    if (!panelSelector) {
      return;
    }

    const panel = refs.levelContainer.querySelector(panelSelector);
    if (!(panel instanceof HTMLElement)) {
      return;
    }

    const panelStyle = window.getComputedStyle(panel);
    const panelHidden =
      panel.hidden || panelStyle.display === "none" || panelStyle.visibility === "hidden" || panelStyle.opacity === "0";

    let issue = "";
    if (panelHidden) {
      issue = `${state.view.tab}:panel-hidden`;
    } else if (state.view.tab === "practice") {
      const practiceCard = panel.querySelector(".practice-question-card");
      if (practiceCard instanceof HTMLElement) {
        const hasPrimaryActions = !!practiceCard.querySelector(".practice-focus-actions .practice-action-btn");
        if (!hasPrimaryActions) {
          issue = "practice:missing-actions";
        }
      }
    }

    if (!issue) {
      uiHealthLastIssueContext = "";
      return;
    }

    const normalizedContext = contextKey || buildRenderContextKey();
    const issueKey = `${normalizedContext}:${issue}`;
    if (uiHealthLastIssueContext === issueKey) {
      return;
    }
    uiHealthLastIssueContext = issueKey;

    queueRender();
    setStatus("اختلال نمایشی موقت تشخیص داده شد و بازسازی خودکار انجام شد.", "info");
  }

  function render() {
    try {
      const previousContextKey = lastRenderContextKey;
      const finalizeRenderCycle = () => {
        const currentContextKey = buildRenderContextKey();
        lastRenderContextKey = currentContextKey;
        if (previousContextKey && currentContextKey !== previousContextKey) {
          triggerAppViewTransition();
        }
        syncHybridOrientationPolicy("render");
        debouncedPersistLastSession();
        scheduleUiVisibilityHealthCheck(currentContextKey);
      };

      if (driveDeferredRenderTimerId) {
        window.clearTimeout(driveDeferredRenderTimerId);
        driveDeferredRenderTimerId = null;
      }

      if (renderRafId) {
        window.cancelAnimationFrame(renderRafId);
        renderRafId = 0;
        renderQueued = false;
      }

      sanitizeView();
      syncViewLevelBodyClasses();
      syncMobilePerformanceMode();
      syncDesktopPerformanceMode();
      visibleQuestionLookup.clear();
      disconnectMathObserver();
      activeChapterMapView = null;

      renderBreadcrumbs();
      if (isSettingsPanelOpen()) {
        refreshSettingsOverview();
      }
      healMobileScrollLock("render-cycle");
      clearStalePrintBodyClasses("render-cycle");

      const subject = getActiveSubject();
      const chapter = getActiveChapter();
      refreshHeaderQuickTools(subject, chapter);
      syncExamCountdownLayoutVars();

      if (state.view.level === 1) {
        renderSubjectsLevel();
        syncExamFocusLockState({ skipScrollIntoView: true });
        syncLiveTimerLifecycle();
        finalizeRenderCycle();
        return;
      }

      if (state.view.level === 2 && subject) {
        renderChaptersLevel(subject);
        syncExamFocusLockState({ skipScrollIntoView: true });
        syncLiveTimerLifecycle();
        finalizeRenderCycle();
        return;
      }

      if (state.view.level === 3 && subject && chapter) {
        renderChapterLevel(subject, chapter);
        syncExamFocusLockState();
        syncLiveTimerLifecycle();
        finalizeRenderCycle();
        return;
      }

      state.view.level = 1;
      state.view.subjectId = null;
      state.view.chapterId = null;
      renderSubjectsLevel();
      syncExamFocusLockState({ skipScrollIntoView: true });
      syncLiveTimerLifecycle();
      finalizeRenderCycle();
    } catch (error) {
      recoverFromRenderFailure(error);
    }
  }

  function syncViewLevelBodyClasses() {
    if (!(document.body instanceof HTMLElement)) {
      return;
    }
    const isHome = state.view.level === 1;
    const isChapters = state.view.level === 2;
    const isChapter = state.view.level === 3;
    document.body.classList.toggle("view-level-home", isHome);
    document.body.classList.toggle("view-level-chapters", isChapters);
    document.body.classList.toggle("view-level-chapter", isChapter);
  }

  function renderBreadcrumbs() {
    if (refs.breadcrumbs instanceof HTMLElement) {
      refs.breadcrumbs.dataset.level = String(state.view.level);
      refs.breadcrumbs.classList.toggle("is-home", state.view.level === 1);
      refs.breadcrumbs.classList.toggle("is-nested", state.view.level > 1);
    }

    const fragment = document.createDocumentFragment();

    if (state.view.level === 1) {
      fragment.append(createBreadcrumbLabel("درس ها"));
      refs.breadcrumbs.replaceChildren(fragment);
      return;
    }

    const subject = getActiveSubject();
    const chapter = getActiveChapter();

    fragment.append(createBreadcrumbButton("درس ها", "goto-subjects"));

    if (subject) {
      fragment.append(createSeparator());
      if (state.view.level === 2) {
        fragment.append(createBreadcrumbLabel(subject.name));
      } else {
        fragment.append(createBreadcrumbButton(subject.name, "goto-chapters"));
      }
    }

    if (state.view.level === 3 && chapter) {
      fragment.append(createSeparator());
      fragment.append(createBreadcrumbLabel(chapter.name));
    }

    refs.breadcrumbs.replaceChildren(fragment);
  }

  function renderSubjectsLevel() {
    const fragment = document.createDocumentFragment();
    const dashboard = document.createElement("section");
    dashboard.className = "subjects-dashboard";
    const enableStagger = shouldEnableStaggerAnimations();
    const dataStats = getSettingsDataStats();

    const totalChapters = Math.max(0, Number(dataStats?.chapters) || 0);
    const totalQuestions = Math.max(0, Number(dataStats?.questions) || 0);

    const head = document.createElement("header");
    head.className = "subjects-dashboard-head";

    const title = document.createElement("h2");
    title.textContent = "درس ها";

    const subtitle = document.createElement("p");
    subtitle.textContent = `${state.subjects.length} درس در بانک سوالات شما ثبت شده است.`;

    head.append(title, subtitle);
    dashboard.append(head);

    const stats = document.createElement("section");
    stats.className = "subjects-dashboard-stats";
    stats.append(
      createSubjectsStatChip("تعداد درس", String(state.subjects.length)),
      createSubjectsStatChip("مجموع فصل ها", String(totalChapters)),
      createSubjectsStatChip("مجموع سوال ها", String(totalQuestions))
    );
    dashboard.append(stats);

    const grid = document.createElement("section");
    grid.className = "subjects-premium-grid";

    const addCard = document.createElement("form");
    addCard.className = "subject-add-card";
    addCard.dataset.action = "add-subject";

    const addHead = document.createElement("div");
    addHead.className = "subject-add-head";

    const addIcon = document.createElement("span");
    addIcon.className = "subject-add-icon";
    addIcon.innerHTML = '<span class="subject-add-shell"></span><span class="subject-add-track subject-add-track-a"></span><span class="subject-add-track subject-add-track-b"></span><span class="subject-add-prism"></span><span class="subject-add-flare"></span>';

    const addCopy = document.createElement("div");
    addCopy.className = "subject-add-copy";

    const addLabel = document.createElement("strong");
    addLabel.className = "subject-add-label";
    addLabel.textContent = "افزودن درس جدید";

    const addCaption = document.createElement("p");
    addCaption.className = "subject-add-caption";
    addCaption.textContent = "نام درس را وارد کنید تا کارت اختصاصی آن ساخته شود.";

    const addInput = document.createElement("input");
    addInput.className = "subject-add-input";
    addInput.name = "subjectName";
    addInput.type = "text";
    addInput.placeholder = "مثال: ریاضی مهندسی";
    addInput.required = true;

    addCopy.append(addLabel, addCaption);
    addHead.append(addIcon, addCopy);

    const addAction = document.createElement("div");
    addAction.className = "subject-add-action";

    const addButton = document.createElement("button");
    addButton.type = "submit";
    addButton.className = "subject-add-btn";
    addButton.innerHTML = '<span class="subject-add-btn-icon" aria-hidden="true">+</span><span>ثبت درس</span>';

    addAction.append(addInput, addButton);
    addCard.append(addHead, addAction);
    grid.append(addCard);

    if (state.subjects.length) {
      const cards = document.createDocumentFragment();
      state.subjects.forEach((subject, index) => {
        const totalQuestions = countSubjectQuestions(subject);
        const shell = document.createElement("article");
        shell.className = `subject-premium-card card-shell deletable-node${enableStagger ? " stagger-item" : ""}`;
        if (enableStagger) {
          shell.style.setProperty("--stagger-index", String(index));
        }

        const openButton = document.createElement("button");
        openButton.type = "button";
        openButton.className = "subject-open-btn";
        openButton.dataset.action = "open-subject";
        openButton.dataset.subjectId = subject.id;

        const cardTitle = document.createElement("h3");
        cardTitle.textContent = subject.name;

        const cardHint = document.createElement("p");
        cardHint.textContent = "ورود به فصل ها و مدیریت کامل سوالات";

        const meta = document.createElement("div");
        meta.className = "subject-card-meta";

        const chaptersBadge = document.createElement("span");
        chaptersBadge.className = "subject-badge subject-badge-chapters";
        chaptersBadge.textContent = `${subject.chapters.length} فصل`;

        const questionsBadge = document.createElement("span");
        questionsBadge.className = "subject-badge subject-badge-questions";
        questionsBadge.textContent = `${totalQuestions} سوال`;

        const stateBadge = document.createElement("span");
        stateBadge.className = `subject-badge ${totalQuestions ? "subject-badge-ready" : "subject-badge-empty"}`;
        stateBadge.textContent = totalQuestions ? "آماده تمرین و آزمون" : "هنوز سوال ندارد";

        meta.append(chaptersBadge, questionsBadge, stateBadge);
        openButton.append(cardTitle, cardHint, meta);

        const removeButton = createDeleteIconButton("request-delete-subject", {
          subjectId: subject.id
        });

        shell.append(openButton, removeButton);
        cards.append(shell);
      });
      grid.append(cards);
    }

    dashboard.append(grid);
    fragment.append(dashboard);
    refs.levelContainer.replaceChildren(fragment);
  }

  function createMergedSubjectTreeSection(subject, orderedChapters) {
    const section = document.createElement("section");
    section.className = "lesson-merged-tree-section";

    const head = document.createElement("header");
    head.className = "lesson-merged-tree-head";

    const title = document.createElement("h3");
    title.append(createLessonIcon("map", 14), document.createTextNode("نمودار درختی ادغام‌شده فصل‌ها"));

    const chapterCount = Array.isArray(orderedChapters) ? orderedChapters.length : 0;
    const mappedCount = (orderedChapters || []).reduce(
      (count, chapterItem) => count + (getChapterTreeNodeCount(chapterItem) > 0 ? 1 : 0),
      0
    );
    const caption = document.createElement("p");
    caption.textContent = `ترتیب نمایش مطابق ترتیب فصل‌ها است. ${mappedCount} فصل دارای tree از ${chapterCount} فصل.`;

    head.append(title, caption);
    section.append(head);

    const panel = document.createElement("section");
    panel.className = "lesson-merged-tree-panel chapter-map-merged-subject";
    section.append(panel);

    const fallbackChapter = orderedChapters?.[0] || { id: "", name: "" };
    renderChapterMapMode(panel, subject, fallbackChapter, { hideLegend: true });
    return section;
  }

  function renderChaptersLevel(subject) {
    const fragment = document.createDocumentFragment();
    const dashboard = document.createElement("section");
    dashboard.className = "lesson-dashboard";
    const orderedChapters = getOrderedChapters(subject);
    const enableStagger = shouldEnableStaggerAnimations();
    const subjectSummary = getSubjectSummaryMetrics(subject);

    const totalChapters = orderedChapters.length;
    const loadedChapters = subjectSummary.loadedChapters;
    const totalQuestions = subjectSummary.totalQuestions;
    const averageDifficulty = subjectSummary.averageDifficultyText;

    const head = document.createElement("header");
    head.className = "lesson-dashboard-head";

    const titleRow = document.createElement("div");
    titleRow.className = "lesson-title-row";
    titleRow.append(createLessonIcon("book", 14));

    const titleWrap = document.createElement("div");
    const title = document.createElement("h2");
    title.textContent = `درس ${subject.name}`;

    const subtitle = document.createElement("p");
    subtitle.textContent = "فصل ها را مدیریت کنید و وارد بانک سوالات، تمرین و آزمون شوید.";
    titleWrap.append(title, subtitle);
    titleRow.append(titleWrap);

    const stats = document.createElement("section");
    stats.className = "lesson-dashboard-stats";
    stats.append(
      createLessonStatChip("فصل ها", String(totalChapters), "layers"),
      createLessonStatChip("فصل های بارگذاری شده", String(loadedChapters), "check"),
      createLessonStatChip("مجموع سوال ها", String(totalQuestions), "grid"),
      createLessonStatChip("میانگین سختی", averageDifficulty === "-" ? "-" : `${averageDifficulty} / 5`, "spark")
    );

    head.append(titleRow, stats);
    dashboard.append(head);

    const addCard = document.createElement("form");
    addCard.className = "lesson-add-card";
    addCard.dataset.action = "add-chapter";

    const addTop = document.createElement("div");
    addTop.className = "lesson-add-top";
    addTop.append(createLessonIcon("plus", 13));

    const addCopy = document.createElement("div");
    const addTitle = document.createElement("h3");
    addTitle.textContent = "افزودن فصل جدید";

    const addCaption = document.createElement("p");
    addCaption.textContent = "فصل جدید را بساز و سریع وارد مدیریت سوالات آن شو.";
    addCopy.append(addTitle, addCaption);
    addTop.append(addCopy);

    const addAction = document.createElement("div");
    addAction.className = "lesson-add-action";

    const addInput = document.createElement("input");
    addInput.name = "chapterName";
    addInput.type = "text";
    addInput.placeholder = "مثال: مشتق و کاربردها";
    addInput.required = true;

    const addButton = document.createElement("button");
    addButton.type = "submit";
    addButton.className = "primary lesson-add-btn";
    addButton.append(createLessonIcon("plus", 12), document.createTextNode("ثبت فصل"));

    addAction.append(addInput, addButton);
    addCard.append(addTop, addAction);
    dashboard.append(addCard);

    const grid = document.createElement("section");
    grid.className = "lesson-chapter-grid";

    if (!totalChapters) {
      grid.append(createEmptyState("هنوز فصلی برای این درس ثبت نشده است."));
    } else {
      const cards = document.createDocumentFragment();

      orderedChapters.forEach((chapter, index) => {
        const questionCount = Array.isArray(chapter?.questions) ? chapter.questions.length : 0;
        const chapterAvgDifficulty = getChapterAverageDifficulty(chapter);

        const shell = document.createElement("article");
        shell.className = `lesson-chapter-card card-shell deletable-node${enableStagger ? " stagger-item" : ""}`;
        if (enableStagger) {
          shell.style.setProperty("--stagger-index", String(index));
        }

        const card = document.createElement("button");
        card.type = "button";
        card.className = "lesson-chapter-open";
        card.dataset.action = "open-chapter";
        card.dataset.chapterId = chapter.id;

        const chapterHead = document.createElement("div");
        chapterHead.className = "lesson-chapter-head";

        const chapterTitle = document.createElement("h3");
        chapterTitle.textContent = `${index + 1}. ${chapter.name}`;

        const chapterSubtitle = document.createElement("p");
        chapterSubtitle.textContent = chapter.questionsLoaded
          ? "ورود به بانک سوال، تمرین و آزمون این فصل"
          : "سوال های این فصل در اولین ورود بارگذاری می شوند";
        chapterHead.append(chapterTitle, chapterSubtitle);

        const chapterMeta = document.createElement("div");
        chapterMeta.className = "lesson-chapter-meta";

        const countBadge = document.createElement("span");
        countBadge.className = "lesson-chapter-badge lesson-chapter-badge-count";
        countBadge.textContent = `${questionCount} سوال`;

        const loadBadge = document.createElement("span");
        loadBadge.className = `lesson-chapter-badge lesson-chapter-badge-load ${chapter.questionsLoaded ? "is-ready" : "is-loading"}`;
        loadBadge.textContent = chapter.questionsLoaded ? "آماده" : "در انتظار بارگذاری";

        const difficultyBadge = document.createElement("span");
        difficultyBadge.className = "lesson-chapter-badge lesson-chapter-badge-difficulty";
        difficultyBadge.textContent =
          chapterAvgDifficulty === null ? "بدون سختی ثبت شده" : `سختی ${chapterAvgDifficulty.toFixed(1)} / 5`;

        chapterMeta.append(countBadge, loadBadge, difficultyBadge);
        card.append(chapterHead, chapterMeta);

        const tools = document.createElement("div");
        tools.className = "chapter-card-tools";

        const moveUpButton = createChapterMoveButton("move-chapter-up", subject.id, chapter.id, index === 0);
        moveUpButton.classList.add("chapter-tool-up");
        const moveDownButton = createChapterMoveButton("move-chapter-down", subject.id, chapter.id, index === totalChapters - 1);
        moveDownButton.classList.add("chapter-tool-down");

        const removeButton = createDeleteIconButton("request-delete-chapter", {
          subjectId: subject.id,
          chapterId: chapter.id
        });
        removeButton.classList.add("chapter-tool-delete");

        tools.append(moveUpButton, moveDownButton, removeButton);

        shell.append(card, tools);
        cards.append(shell);
      });

      grid.append(cards);
    }

    dashboard.append(grid);
    dashboard.append(createMergedSubjectTreeSection(subject, orderedChapters));
    fragment.append(dashboard);
    refs.levelContainer.replaceChildren(fragment);
  }
  function renderChapterLevel(subject, chapter) {
    const runtime = getRuntime(subject.id, chapter.id);
    const fragment = document.createDocumentFragment();

    const head = document.createElement("section");
    head.className = "chapter-head";

    const title = document.createElement("h2");
    title.textContent = `${subject.name} | ${chapter.name}`;

    const subtitle = document.createElement("p");
    const questionCount = chapter.questions?.length || 0;
    subtitle.textContent = chapter.questionsLoaded
      ? `${questionCount} سوال در این فصل ثبت شده است.`
      : "در حال بارگذاری سوالات از فایل JSON...";

    head.append(title, subtitle);
    fragment.append(head);

    const tabs = document.createElement("div");
    tabs.className = "tabs";
    tabs.append(
      createTabButton("bank", "بانک سوالات", "grid"),
      createTabButton("practice", "حالت تمرین", "spark"),
      createTabButton("exam", "حالت آزمون", "book"),
      createTabButton("chapter-map", "نمودار درختی فصل‌ها", "map")
    );
    fragment.append(tabs);

    const panel = document.createElement("section");
    panel.className = "tab-panel";

    if (runtime.loading) {
      panel.append(createLoader("در حال بارگذاری سوالات..."));
      fragment.append(panel);
      refs.levelContainer.replaceChildren(fragment);
      return;
    }

    if (state.view.tab === "bank") {
      renderQuestionBank(panel, subject, chapter);
    } else if (state.view.tab === "practice") {
      renderPracticeMode(panel, subject, chapter, runtime);
    } else if (state.view.tab === "chapter-map") {
      renderChapterMapMode(panel, subject, chapter);
    } else {
      renderExamMode(panel, subject, chapter, runtime);
    }

    fragment.append(panel);
    refs.levelContainer.replaceChildren(fragment);
    observeMathWithin(refs.levelContainer);
    queueAssetHydrationWithin(refs.levelContainer);
  }

  function renderQuestionBank(panel, subject, chapter) {
    const questions = chapter.questions || [];
    const uiState = getChapterUiState(subject.id, chapter.id);
    const mobilePerfMode = isMobileViewportActive();
    const allowInlineEdit = !mobilePerfMode;
    const enableStagger = shouldEnableStaggerAnimations();
    reconcileSelectedQuestions(uiState, questions);
    reconcileQuestionTimers(uiState, questions);
    if (!allowInlineEdit) {
      uiState.editingQuestionId = "";
    }
    if (uiState.editingQuestionId && !questions.some((item) => asText(item?.id, "") === uiState.editingQuestionId)) {
      uiState.editingQuestionId = "";
    }
    panel.classList.add("question-bank-panel");
    if (mobilePerfMode) {
      panel.classList.add("question-bank-mobile-perf");
    }
    if (isDesktopPerformanceLiteActive()) {
      panel.classList.add("question-bank-desktop-perf");
    }

    panel.append(createQuestionFilterBar(subject.id, chapter.id, uiState));

    const filteredQuestions = getFilteredBankQuestions(subject, chapter);
    panel.append(
      createQuestionBankOverview({
        totalCount: questions.length,
        filteredCount: filteredQuestions.length,
        selectedCount: uiState.selectedIds.size,
        activeFilters: countActiveBankFilters(uiState)
      })
    );

    if (!questions.length) {
      panel.append(createEmptyState("برای این فصل سوالی وجود ندارد."));
      return;
    }

    if (!filteredQuestions.length) {
      panel.append(createEmptyState("نتیجه ای با فیلتر انتخابی پیدا نشد."));
      panel.append(createFilterResetBar(subject.id, chapter.id));
      panel.append(createBulkDeleteBar(subject.id, chapter.id, uiState.selectedIds.size));
      panel.append(createQuestionDangerZone(subject.id, chapter.id, questions.length));
      return;
    }

    const effectivePageSize = mobilePerfMode ? Math.max(6, Math.min(8, state.pagination.pageSize || PAGE_SIZE)) : state.pagination.pageSize;
    const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / effectivePageSize));
    state.pagination.page = clampNumber(state.pagination.page, 1, totalPages, 1);

    const startIndex = (state.pagination.page - 1) * effectivePageSize;
    const endIndex = Math.min(startIndex + effectivePageSize, filteredQuestions.length);
    const pageItems = filteredQuestions.slice(startIndex, endIndex);

    panel.append(createMetaRow(`نمایش ${startIndex + 1} تا ${endIndex} از ${filteredQuestions.length} سوال`));
    panel.append(createPager(state.pagination.page, totalPages, "bank-prev", "bank-next"));

    const list = document.createElement("section");
    list.className = "question-list";
    const listFragment = document.createDocumentFragment();

    pageItems.forEach((question, index) => {
      const timerSnapshot = getQuestionTimerSnapshotFromState(uiState, question.id);
      const card = createQuestionCard({
        question,
        order: startIndex + index + 1,
        subjectId: subject.id,
        chapterId: chapter.id,
        withDisclosures: true,
        selectable: true,
        selected: uiState.selectedIds.has(question.id),
        showSolveTimer: true,
        timerSnapshot,
        showTopic: true,
        withQuestionDelete: true,
        withSolvedToggle: true,
        staggerIndex: index,
        enableStagger
      });
      if (allowInlineEdit) {
        const headTools = card.querySelector(".question-head-tools");
        if (headTools instanceof HTMLElement) {
          const deleteButton = headTools.querySelector(".icon-delete-btn-inline");
          headTools.insertBefore(
            createQuestionEditToggleButton(subject.id, chapter.id, question.id, uiState.editingQuestionId === question.id),
            deleteButton || null
          );
        }

        if (uiState.editingQuestionId === question.id) {
          card.append(createQuestionInlineEditForm({ subjectId: subject.id, chapterId: chapter.id, question }));
        }
      }
      listFragment.append(card);
    });

    list.append(listFragment);
    panel.append(list);
    queueAssetHydrationWithin(list);
    panel.append(createPager(state.pagination.page, totalPages, "bank-prev", "bank-next"));
    panel.append(createBulkDeleteBar(subject.id, chapter.id, uiState.selectedIds.size));
    panel.append(createQuestionDangerZone(subject.id, chapter.id, questions.length));
  }

  function renderPracticeMode(panel, subject, chapter, runtime) {
    const questions = Array.isArray(chapter.questions) ? chapter.questions : [];
    panel.classList.add("question-bank-panel", "practice-mode-panel", "practice-modernized");
    const mobilePerfMode = isMobileViewportActive();
    const enableStagger = shouldEnableStaggerAnimations();
    if (mobilePerfMode) {
      panel.classList.add("practice-mobile-perf");
    }
    if (isDesktopPerformanceLiteActive()) {
      panel.classList.add("practice-desktop-perf");
    }

    if (!questions.length) {
      panel.append(createEmptyState("برای تمرین سوالی در دسترس نیست."));
      return;
    }

    const poolInfo = resolvePracticePool(questions, runtime.practiceProfile, runtime.practiceIncludeSolved);
    runtime.practiceProfile = poolInfo.profile;
    preparePracticeRuntime(runtime, poolInfo.pool);

    const selectedQuestion = poolInfo.pool.find((item) => item.id === runtime.practiceId) || poolInfo.pool[0];
    if (!selectedQuestion) {
      panel.append(
        createEmptyState(
          runtime.practiceIncludeSolved
            ? "برای پروفایل انتخابی سوالی در دسترس نیست."
            : "در حالت فقط سوالات حل نشده، موردی برای تمرین پیدا نشد."
        )
      );
      return;
    }

    runtime.practiceId = selectedQuestion.id;
    runtime.practiceRevealHint = !!runtime.practiceRevealHint;
    runtime.practiceRevealSolution = !!runtime.practiceRevealSolution;
    trackPracticeSeen(runtime, selectedQuestion.id);

    const seenCount = runtime.practiceSeenIds.length;
    const totalPool = poolInfo.pool.length;
    const coveragePercent = totalPool ? Math.round((seenCount / totalPool) * 100) : 0;
    const questionPosition = Math.max(1, poolInfo.pool.findIndex((item) => item.id === selectedQuestion.id) + 1);

    const toolbar = document.createElement("section");
    toolbar.className = "qb-filter-bar practice-toolbar";
    const practiceFiltersCollapsed = runtime.practiceFiltersCollapsed === true;

    const toolbarTop = document.createElement("div");
    toolbarTop.className = "practice-toolbar-top";

    const toolbarTitle = document.createElement("h4");
    toolbarTitle.className = "practice-toolbar-title";
    toolbarTitle.append(createPracticeIcon("flash", 13), document.createTextNode("حالت تمرین"));

    const toolbarProgress = document.createElement("span");
    toolbarProgress.className = "practice-toolbar-progress";
    toolbarProgress.textContent = `پوشش جلسه ${coveragePercent}% (${seenCount} از ${totalPool})`;

    const toolbarToggleBtn = document.createElement("button");
    toolbarToggleBtn.type = "button";
    toolbarToggleBtn.className = "practice-toolbar-toggle";
    toolbarToggleBtn.dataset.action = "practice-toggle-filters-panel";
    toolbarToggleBtn.setAttribute("aria-expanded", practiceFiltersCollapsed ? "false" : "true");
    toolbarToggleBtn.setAttribute("aria-label", practiceFiltersCollapsed ? "نمایش فیلترهای تمرین" : "بستن فیلترهای تمرین");
    toolbarToggleBtn.innerHTML = `<span>${practiceFiltersCollapsed ? "نمایش فیلترها" : "بستن فیلترها"}</span><i class="qb-filter-toggle-caret" aria-hidden="true"></i>`;
    toolbarTop.append(toolbarTitle, toolbarProgress, toolbarToggleBtn);

    const profileBar = document.createElement("div");
    profileBar.className = "practice-profile-bar";
    profileBar.append(
      createPracticeProfileChip("all", runtime.practiceProfile === "all"),
      createPracticeProfileChip("medium", runtime.practiceProfile === "medium"),
      createPracticeProfileChip("hard", runtime.practiceProfile === "hard")
    );

    if (poolInfo.fallbacked) {
      const fallbackNotice = document.createElement("span");
      fallbackNotice.className = "practice-profile-note";
      fallbackNotice.textContent = "پروفایل انتخابی سوال کافی نداشت؛ نمایش روی همه سوال ها تنظیم شد.";
      profileBar.append(fallbackNotice);
    }

    const optionsBar = document.createElement("div");
    optionsBar.className = "practice-options-bar";
    optionsBar.append(createPracticeSolvedFilterSwitch(runtime.practiceIncludeSolved));

    const metaStrip = document.createElement("div");
    metaStrip.className = "practice-meta-strip practice-meta-strip-modern";
    const difficultyValue = `${clampNumber(selectedQuestion?.difficulty, 1, 5, 3)}/5`;
    const topicValue = resolveQuestionTopicLabel(selectedQuestion) || "بدون موضوع";
    const methodValue = resolveQuestionMethodLabel(selectedQuestion, "") || "بدون روش";
    const solvedValue = resolveQuestionSolvedFlag(selectedQuestion) ? "حل شده" : "حل نشده";

    metaStrip.append(
      createPracticeMetaChip("سختی", difficultyValue, "progress"),
      createPracticeMetaChip("موضوع", topicValue, "target"),
      createPracticeMetaChip("روش", methodValue, "chapter"),
      createPracticeMetaChip("وضعیت", solvedValue, resolveQuestionSolvedFlag(selectedQuestion) ? "check" : "flash")
    );

    const toolbarFilters = document.createElement("div");
    toolbarFilters.className = "practice-toolbar-filters";
    toolbarFilters.hidden = practiceFiltersCollapsed;
    if (practiceFiltersCollapsed) {
      toolbarFilters.classList.add("is-collapsed");
    }
    toolbarFilters.append(profileBar, optionsBar, metaStrip);

    toolbar.append(toolbarTop, toolbarFilters);
    panel.append(toolbar);

    const overview = document.createElement("section");
    overview.className = "qb-overview";
    overview.append(
      createQuestionBankStat("کل سوال ها", String(questions.length)),
      createQuestionBankStat("سوالات پروفایل", String(totalPool)),
      createQuestionBankStat("پوشش جلسه", `${coveragePercent}%`),
      createQuestionBankStat("مشاهده شده", String(seenCount))
    );
    panel.append(overview);

    panel.append(
      createMetaRow(
        `سوال ${questionPosition} از ${totalPool} | مسیر جلسه ${runtime.practiceCursor + 1} / ${Math.max(1, runtime.practiceHistory.length)}`
      )
    );

    const list = document.createElement("section");
    list.className = "question-list";

    const card = createQuestionCard({
      question: selectedQuestion,
      order: questionPosition,
      subjectId: subject.id,
      chapterId: chapter.id,
      withDisclosures: false,
      selectable: false,
      withSolvedToggle: true,
      withQuestionDelete: false,
      staggerIndex: 0,
      enableStagger
    });
    card.classList.add("practice-question-card");

    const controls = document.createElement("div");
    controls.className = "practice-focus-actions";

    const hintBtn = createPracticeActionButton({
      action: "practice-reveal-hint",
      label: runtime.practiceRevealHint ? "بستن راهنما" : "نمایش راهنما",
      icon: "hint",
      active: runtime.practiceRevealHint
    });

    const solutionBtn = createPracticeActionButton({
      action: "practice-reveal-solution",
      label: runtime.practiceRevealSolution ? "بستن حل تشریحی" : "نمایش حل تشریحی",
      icon: "solution",
      active: runtime.practiceRevealSolution
    });

    const prevBtn = createPracticeActionButton({
      action: "practice-prev",
      label: "سوال قبلی",
      icon: "prev",
      variant: "nav"
    });
    prevBtn.disabled = runtime.practiceCursor <= 0;

    const nextBtn = createPracticeActionButton({
      action: "practice-next",
      label: "سوال بعدی",
      icon: "next",
      variant: "next",
      primary: true
    });
    nextBtn.classList.add("practice-next-btn");

    const randomBtn = createPracticeActionButton({
      action: "practice-random",
      label: "تصادفی جدید",
      icon: "random",
      variant: "random"
    });

    const copyQuestionBtn = createPracticeActionButton({
      action: "practice-copy-question",
      label: "کپی صورت سوال",
      icon: "copy",
      variant: "utility"
    });
    copyQuestionBtn.dataset.subjectId = subject.id;
    copyQuestionBtn.dataset.chapterId = chapter.id;
    copyQuestionBtn.dataset.questionId = selectedQuestion.id;

    const reviewEntry = getQuestionReviewEntry(subject.id, chapter.id, selectedQuestion.id);
    const reviewStatus = normalizeReviewStatus(reviewEntry?.status || "");
    const reviewToggleBtn = createPracticeActionButton({
      action: "practice-toggle-review",
      label: reviewStatus === "review" ? "خروج از مرور" : "نیاز به مرور",
      icon: "bookmark",
      active: reviewStatus === "review",
      variant: "utility"
    });
    reviewToggleBtn.dataset.subjectId = subject.id;
    reviewToggleBtn.dataset.chapterId = chapter.id;
    reviewToggleBtn.dataset.questionId = selectedQuestion.id;

    copyQuestionBtn.classList.add("practice-copy-question-btn");
    reviewToggleBtn.classList.add("practice-review-toggle-btn");

    const solutionStack = document.createElement("div");
    solutionStack.className = "practice-solution-stack";
    solutionStack.append(solutionBtn, randomBtn);

    controls.append(hintBtn, solutionStack, prevBtn, nextBtn, copyQuestionBtn);
    if (mobilePerfMode) {
      const utilityRow = document.createElement("div");
      utilityRow.className = "practice-utility-actions";
      utilityRow.append(reviewToggleBtn);
      card.append(controls, utilityRow);
    } else {
      controls.append(reviewToggleBtn);
      card.append(controls);
    }

    if (runtime.practiceRevealHint) {
      card.append(createPracticeRevealPanel("hint", "راهنما", getQuestionHintText(selectedQuestion)));
    }

    if (runtime.practiceRevealSolution) {
      card.append(createPracticeRevealPanel("solution", "حل تشریحی", getQuestionSolutionText(selectedQuestion)));
    }

    const pendingRevealScrollTarget = asText(runtime.practiceRevealScrollTarget, "");
    if (pendingRevealScrollTarget) {
      runtime.practiceRevealScrollTarget = "";
      window.requestAnimationFrame(() => {
        const revealNode = card.querySelector(`.practice-reveal-${pendingRevealScrollTarget}`);
        if (revealNode instanceof HTMLElement) {
          revealNode.scrollIntoView({
            block: "nearest",
            inline: "nearest",
            behavior: getOptimizedScrollBehavior("smooth")
          });
        }
      });
    }

    list.append(card);
    panel.append(list);
    observeMathWithin(list);
    queueAssetHydrationWithin(list);
  }

  function createPracticeActionButton({ action, label, icon, active = false, variant = "", primary = false }) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.action = action;
    button.setAttribute("aria-label", label);
    button.className = [
      "practice-action-btn",
      variant ? `practice-action-${variant}` : "",
      active ? "is-active" : "",
      primary ? "primary" : ""
    ]
      .filter(Boolean)
      .join(" ");
    button.append(createPracticeIcon(icon, 13), document.createTextNode(label));
    return button;
  }

  function createPracticeProfileChip(profile, isActive) {
    const iconMap = { all: "all", medium: "medium", hard: "hard" };
    const chip = document.createElement("button");
    chip.type = "button";
    chip.dataset.action = "practice-set-profile";
    chip.dataset.profile = profile;
    chip.className = `practice-profile-chip${isActive ? " is-active" : ""}`;
    chip.append(createPracticeIcon(iconMap[profile] || "all", 12), document.createTextNode(getPracticeProfileLabel(profile)));
    return chip;
  }

  function createPracticeSolvedFilterSwitch(includeSolved) {
    const wrap = document.createElement("label");
    wrap.className = "practice-solved-switch";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.className = "practice-solved-switch-input";
    input.dataset.action = "practice-include-solved";
    input.checked = !!includeSolved;

    const ui = document.createElement("span");
    ui.className = "practice-solved-switch-ui";

    const text = document.createElement("span");
    text.className = "practice-solved-switch-text";
    text.textContent = includeSolved ? "سوالات حل شده هم نمایش داده شود" : "فقط سوالات حل نشده نمایش داده شود";

    wrap.append(input, ui, text);
    return wrap;
  }

  function createPracticeMetaChip(label, value, iconKind = "progress") {
    const chip = document.createElement("article");
    chip.className = "practice-meta-chip";
    chip.title = `${label}: ${value}`;
    chip.append(createPracticeIcon(iconKind, 12));

    const copy = document.createElement("span");
    copy.className = "practice-meta-copy";

    const labelNode = document.createElement("em");
    labelNode.textContent = label;

    const valueNode = document.createElement("strong");
    valueNode.textContent = value;

    copy.append(labelNode, valueNode);
    chip.append(copy);
    return chip;
  }

  function createPracticeRevealPanel(kind, title, content) {
    const box = document.createElement("section");
    box.className = `practice-reveal-box is-open practice-reveal-${kind}`;
    box.dataset.kind = kind;
    box.setAttribute("role", "region");
    box.setAttribute("aria-label", title);

    const shouldRenderHeader = true;
    let head = null;
    if (shouldRenderHeader) {
      head = document.createElement("header");
      head.className = "practice-reveal-head";
      head.append(createPracticeIcon(kind, 13), document.createTextNode(title));
    }

    const body = document.createElement("div");
    body.className = "practice-reveal-content";
    const text = asText(content, "").trim();
    const fallback = kind === "hint" ? "برای این سوال راهنمایی ثبت نشده است." : "برای این سوال حل تشریحی ثبت نشده است.";
    body.append(buildRichTextFragment(text || fallback));
    if (!text) {
      box.classList.add("is-empty");
    }

    const footer = document.createElement("footer");
    footer.className = "practice-reveal-footer";
    footer.textContent =
      kind === "hint" ? "راهنما مسیر حل را نشان می‌دهد؛ سپس خودت پاسخ را کامل کن." : "حل تشریحی را با پاسخ خودت مقایسه کن و نکته‌ها را یادداشت کن.";

    if (head) {
      box.append(head, body, footer);
    } else {
      box.append(body, footer);
    }
    return box;
  }

  function createPracticeIcon(kind, size = 14) {
    const icon = document.createElement("span");
    icon.className = `practice-icon practice-icon-${asText(kind, "flash")}`;
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = getPracticeIconSvg(kind);

    const svg = icon.querySelector("svg");
    if (svg instanceof SVGElement) {
      svg.setAttribute("width", String(size));
      svg.setAttribute("height", String(size));
    }
    return icon;
  }

  function getPracticeIconSvg(kind) {
    const key = asText(kind, "flash");
    const icons = {
      flash:
        '<svg viewBox="0 0 24 24" fill="none"><path d="M13 2L6 13h5l-1 9 8-12h-5l0-8z"></path></svg>',
      target:
        '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8"></circle><circle cx="12" cy="12" r="4"></circle><circle cx="12" cy="12" r="1.5"></circle></svg>',
      hint:
        '<svg viewBox="0 0 24 24" fill="none"><path d="M9.2 9.2a3 3 0 0 1 5.2 2c0 1.4-1 2.2-1.9 2.8-.7.5-1.1 1-1.1 1.7"></path><circle cx="12" cy="17.2" r="0.9"></circle><circle cx="12" cy="12" r="9"></circle></svg>',
      solution:
        '<svg viewBox="0 0 24 24" fill="none"><path d="M6 4h9l3 3v13H6z"></path><path d="M15 4v4h4"></path><path d="M9 12h6"></path><path d="M9 16h6"></path></svg>',
      prev:
        '<svg viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6"></path></svg>',
      next:
        '<svg viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6"></path></svg>',
      random:
        '<svg viewBox="0 0 24 24" fill="none"><path d="M4 7h3l3 4 4-6h6"></path><path d="M17 5l3 0v3"></path><path d="M4 17h3l3-4 4 6h6"></path><path d="M17 16h3v3"></path></svg>',
      progress:
        '<svg viewBox="0 0 24 24" fill="none"><path d="M4 15l4-4 3 3 5-6 4 4"></path><path d="M4 20h16"></path></svg>',
      copy:
        '<svg viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="11" height="11" rx="2"></rect><rect x="4" y="4" width="11" height="11" rx="2"></rect></svg>',
      bookmark:
        '<svg viewBox="0 0 24 24" fill="none"><path d="M7 4.5h10a1.2 1.2 0 0 1 1.2 1.2v14.1L12 16.5l-6.2 3.3V5.7A1.2 1.2 0 0 1 7 4.5Z"></path></svg>',
      check:
        '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.2"></circle><path d="m8.7 12.3 2.3 2.3 4.3-4.3"></path></svg>',
      subject:
        '<svg viewBox="0 0 24 24" fill="none"><path d="M5 4.5h9a3 3 0 0 1 3 3V20H8a3 3 0 0 0-3 3"></path><path d="M8 4.5v18"></path></svg>',
      chapter:
        '<svg viewBox="0 0 24 24" fill="none"><path d="M12 4l8 4-8 4-8-4 8-4z"></path><path d="M4 12l8 4 8-4"></path></svg>',
      all:
        '<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="7" height="7" rx="1.5"></rect><rect x="13" y="4" width="7" height="7" rx="1.5"></rect><rect x="4" y="13" width="7" height="7" rx="1.5"></rect><rect x="13" y="13" width="7" height="7" rx="1.5"></rect></svg>',
      medium:
        '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8"></circle><path d="M12 8v4l2 2"></path></svg>',
      hard:
        '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3l2.2 5.1L20 10l-4.5 3.7L16.8 20 12 17l-4.8 3 1.3-6.3L4 10l5.8-1.9L12 3z"></path></svg>'
    };

    return icons[key] || icons.flash;
  }

  function normalizePracticeProfile(value) {
    const safe = asText(value, "all");
    return ["all", "medium", "hard"].includes(safe) ? safe : "all";
  }

  function getPracticeProfileLabel(profile) {
    const labels = {
      all: "همه سوال ها",
      medium: "تمرکز متوسط",
      hard: "چالش سخت"
    };
    return labels[normalizePracticeProfile(profile)] || labels.all;
  }

  function resolvePracticePool(questions, profile, includeSolved = true) {
    const source = Array.isArray(questions) ? questions : [];
    const basePool = includeSolved ? source.slice() : source.filter((item) => !resolveQuestionSolvedFlag(item));
    const requested = normalizePracticeProfile(profile);

    if (!basePool.length) {
      return { profile: requested, pool: [], fallbacked: false };
    }

    if (requested === "all") {
      return { profile: "all", pool: basePool, fallbacked: false };
    }

    const range = DIFFICULTY_PROFILES[requested];
    if (!range) {
      return { profile: "all", pool: basePool, fallbacked: true };
    }

    const filtered = basePool.filter((item) => {
      const difficulty = clampNumber(item?.difficulty, 1, 5, 3);
      return difficulty >= range.min && difficulty <= range.max;
    });

    if (filtered.length) {
      return { profile: requested, pool: filtered, fallbacked: false };
    }

    return { profile: "all", pool: basePool, fallbacked: true };
  }

  function preparePracticeRuntime(runtime, pool) {
    if (!runtime || !Array.isArray(pool) || !pool.length) {
      return;
    }

    const validIds = new Set(pool.map((item) => item.id));

    runtime.practiceHistory = Array.isArray(runtime.practiceHistory)
      ? runtime.practiceHistory.filter((id) => validIds.has(id))
      : [];
    runtime.practiceSeenIds = Array.isArray(runtime.practiceSeenIds)
      ? runtime.practiceSeenIds.filter((id) => validIds.has(id))
      : [];

    const historyFallback = runtime.practiceHistory.length ? runtime.practiceHistory.length - 1 : -1;
    runtime.practiceCursor = clampNumber(runtime.practiceCursor, -1, historyFallback, historyFallback);

    if (runtime.practiceId && !validIds.has(runtime.practiceId)) {
      runtime.practiceId = null;
    }

    if (!runtime.practiceId && runtime.practiceHistory.length && runtime.practiceCursor >= 0) {
      runtime.practiceId = runtime.practiceHistory[runtime.practiceCursor] || null;
    }

    if (!runtime.practiceId) {
      runtime.practiceId = pickRandomQuestionId(pool);
    }

    if (!runtime.practiceId) {
      runtime.practiceHistory = [];
      runtime.practiceCursor = -1;
      return;
    }

    if (!runtime.practiceHistory.length) {
      runtime.practiceHistory = [runtime.practiceId];
      runtime.practiceCursor = 0;
      return;
    }

    const cursorId = runtime.practiceHistory[runtime.practiceCursor] || "";
    if (cursorId !== runtime.practiceId) {
      const indexInHistory = runtime.practiceHistory.lastIndexOf(runtime.practiceId);
      if (indexInHistory >= 0) {
        runtime.practiceCursor = indexInHistory;
      } else {
        runtime.practiceHistory.push(runtime.practiceId);
        runtime.practiceCursor = runtime.practiceHistory.length - 1;
      }
    }
  }

  function trackPracticeSeen(runtime, questionId) {
    if (!runtime || !questionId) {
      return;
    }

    if (!Array.isArray(runtime.practiceSeenIds)) {
      runtime.practiceSeenIds = [];
    }

    if (!runtime.practiceSeenIds.includes(questionId)) {
      runtime.practiceSeenIds.push(questionId);
    }
  }

  function resetPracticeRevealState(runtime) {
    if (!runtime) {
      return;
    }
    runtime.practiceRevealHint = false;
    runtime.practiceRevealSolution = false;
    runtime.practiceRevealScrollTarget = "";
  }

  function chooseNextPracticeQuestionId(pool, runtime) {
    const seenSet = new Set(Array.isArray(runtime?.practiceSeenIds) ? runtime.practiceSeenIds : []);
    const unseen = pool.filter((item) => !seenSet.has(item.id) && item.id !== runtime?.practiceId);
    if (unseen.length) {
      return pickRandomQuestionId(unseen);
    }
    return pickRandomQuestionId(pool, runtime?.practiceId);
  }

  function pushPracticeHistory(runtime, nextId) {
    if (!runtime || !nextId) {
      return;
    }

    if (!Array.isArray(runtime.practiceHistory)) {
      runtime.practiceHistory = [];
    }

    if (runtime.practiceCursor < runtime.practiceHistory.length - 1) {
      runtime.practiceHistory = runtime.practiceHistory.slice(0, runtime.practiceCursor + 1);
    }

    runtime.practiceHistory.push(nextId);
    runtime.practiceCursor = runtime.practiceHistory.length - 1;
    runtime.practiceId = nextId;
  }

  function stepPracticeQuestion(step) {
    const runtime = getActiveRuntime();
    const chapter = getActiveChapter();
    if (!runtime || !chapter) {
      return;
    }

    const questions = Array.isArray(chapter.questions) ? chapter.questions : [];
    const poolInfo = resolvePracticePool(questions, runtime.practiceProfile, runtime.practiceIncludeSolved);
    runtime.practiceProfile = poolInfo.profile;

    if (!poolInfo.pool.length) {
      return;
    }

    preparePracticeRuntime(runtime, poolInfo.pool);

    if (step < 0) {
      if (runtime.practiceCursor <= 0) {
        setStatus("به اولین سوال تمرین این جلسه رسیده ای.");
        return;
      }

      runtime.practiceCursor -= 1;
      runtime.practiceId = runtime.practiceHistory[runtime.practiceCursor] || runtime.practiceId;
    } else {
      const nextId = chooseNextPracticeQuestionId(poolInfo.pool, runtime);
      if (!nextId || nextId === runtime.practiceId) {
        setStatus("در این پروفایل تنها یک سوال فعال است.");
        return;
      }
      pushPracticeHistory(runtime, nextId);
    }

    resetPracticeRevealState(runtime);
    trackPracticeSeen(runtime, runtime.practiceId);
    render();
  }

  function randomizePracticeQuestion() {
    const runtime = getActiveRuntime();
    const chapter = getActiveChapter();
    if (!runtime || !chapter) {
      return;
    }

    const questions = Array.isArray(chapter.questions) ? chapter.questions : [];
    const poolInfo = resolvePracticePool(questions, runtime.practiceProfile, runtime.practiceIncludeSolved);
    runtime.practiceProfile = poolInfo.profile;

    if (!poolInfo.pool.length) {
      return;
    }

    preparePracticeRuntime(runtime, poolInfo.pool);
    const nextId = pickRandomQuestionId(poolInfo.pool, runtime.practiceId);

    if (!nextId || nextId === runtime.practiceId) {
      setStatus("سوال دیگری برای نمایش وجود ندارد.");
      return;
    }

    pushPracticeHistory(runtime, nextId);
    resetPracticeRevealState(runtime);
    trackPracticeSeen(runtime, runtime.practiceId);
    render();
  }

  function setPracticeProfile(target) {
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const runtime = getActiveRuntime();
    const chapter = getActiveChapter();
    if (!runtime || !chapter) {
      return;
    }

    const requested = normalizePracticeProfile(target.dataset.profile);
    const questions = Array.isArray(chapter.questions) ? chapter.questions : [];
    const poolInfo = resolvePracticePool(questions, requested, runtime.practiceIncludeSolved);

    runtime.practiceProfile = poolInfo.profile;
    runtime.practiceHistory = [];
    runtime.practiceCursor = -1;
    runtime.practiceSeenIds = [];
    runtime.practiceId = pickRandomQuestionId(poolInfo.pool, runtime.practiceId);
    resetPracticeRevealState(runtime);

    if (poolInfo.fallbacked && requested !== "all") {
      setStatus(`برای پروفایل ${getPracticeProfileLabel(requested)} سوال کافی نبود؛ همه سوال ها نمایش داده شد.`);
    }

    render();
  }

  function handlePracticeFiltersPanelToggle() {
    const runtime = getActiveRuntime();
    if (!runtime) {
      return;
    }

    runtime.practiceFiltersCollapsed = !runtime.practiceFiltersCollapsed;
    render();
  }

  function renderExamMode(panel, subject, chapter, runtime) {
    examAnswerHydrationToken += 1;
    panel.classList.add("question-bank-panel", "exam-mode-panel");
    const mobilePerfMode = isMobileViewportActive();
    const enableStagger = shouldEnableStaggerAnimations();
    if (mobilePerfMode) {
      panel.classList.add("exam-mobile-perf");
    }
    if (isDesktopPerformanceLiteActive()) {
      panel.classList.add("exam-desktop-perf");
    }

    const form = document.createElement("form");
    form.className = "exam-builder-form qb-filter-bar";
    form.dataset.action = "generate-exam";

    const totalQuestions = countSubjectQuestions(subject);

    const head = document.createElement("header");
    head.className = "exam-builder-head";

    const headTitle = document.createElement("h3");
    headTitle.className = "exam-builder-title";
    headTitle.append(createExamIcon("spark", 15), document.createTextNode("سازنده آزمون پیشرفته"));

    const headCaption = document.createElement("p");
    headCaption.textContent = "فصل های موردنظر را انتخاب کنید و سهم سوال هر فصل را به شکل مساوی یا دستی تنظیم کنید.";

    const stats = document.createElement("div");
    stats.className = "exam-builder-stats";
    stats.append(
      createExamStatChip("فصل ها", String(subject.chapters.length), "layers"),
      createExamStatChip("بانک سوال", String(totalQuestions), "grid"),
      createExamStatChip("درس", subject.name, "book")
    );
    head.append(headTitle, headCaption, stats);
    form.append(head);

    const chaptersPane = document.createElement("section");
    chaptersPane.className = "exam-pane exam-pane-chapters";

    const chapterToolbar = document.createElement("div");
    chapterToolbar.className = "exam-chapter-toolbar";

    const chapterLabel = document.createElement("strong");
    chapterLabel.className = "exam-chapter-title";
    chapterLabel.append(createExamIcon("layers", 14), document.createTextNode("انتخاب فصل های آزمون"));

    const chapterActions = document.createElement("div");
    chapterActions.className = "exam-chapter-toolbar-actions";

    const selectAll = document.createElement("button");
    selectAll.type = "button";
    selectAll.className = "exam-chip-btn";
    selectAll.dataset.action = "exam-select-all-chapters";
    selectAll.append(createExamIcon("check", 13), document.createTextNode("انتخاب همه"));

    const clearAll = document.createElement("button");
    clearAll.type = "button";
    clearAll.className = "exam-chip-btn";
    clearAll.dataset.action = "exam-clear-chapters";
    clearAll.append(createExamIcon("clear", 13), document.createTextNode("پاک کردن"));

    const balanceCounts = document.createElement("button");
    balanceCounts.type = "button";
    balanceCounts.className = "exam-chip-btn";
    balanceCounts.dataset.action = "exam-balance-counts";
    balanceCounts.append(createExamIcon("sort", 13), document.createTextNode("تقسیم مساوی"));

    chapterActions.append(selectAll, clearAll, balanceCounts);
    chapterToolbar.append(chapterLabel, chapterActions);

    const chapterBlock = document.createElement("section");
    chapterBlock.className = "exam-chapter-grid";

    const availableChapterIds = new Set(subject.chapters.map((item) => asText(item.id, "").trim()).filter(Boolean));
    const savedChapterIds = Array.isArray(runtime.exam?.chapterIds)
      ? runtime.exam.chapterIds.map((item) => asText(item, "").trim()).filter((item) => availableChapterIds.has(item))
      : [];
    const selectedChapterIdSet = new Set(savedChapterIds.length ? savedChapterIds : [chapter.id]);
    const defaultRequestedCountRaw = Number.parseInt(
      asText(runtime.exam?.requestedCount, asText(runtime.exam?.count, "10")),
      10
    );
    const defaultRequestedCount = Number.isFinite(defaultRequestedCountRaw) ? defaultRequestedCountRaw : 10;
    const defaultRequestedPlan = buildBalancedExamChapterPlan(
      subject.chapters
        .filter((item) => selectedChapterIdSet.has(item.id))
        .map((item) => ({
          id: item.id,
          maxCount: Array.isArray(item.questions) ? item.questions.length : 0
        })),
      defaultRequestedCount,
      runtime.exam?.requestedChapterCounts && typeof runtime.exam.requestedChapterCounts === "object"
        ? runtime.exam.requestedChapterCounts
        : null
    );

    subject.chapters.forEach((item, index) => {
      const checkbox = document.createElement("article");
      checkbox.className = "exam-chapter-check";
      checkbox.style.setProperty("--stagger-index", String(index));

      const input = document.createElement("input");
      input.type = "checkbox";
      input.name = "chapterIds";
      input.value = item.id;
      input.dataset.action = "exam-toggle-chapter";
      const chapterInputId = createId("exam-chapter");
      input.id = chapterInputId;

      const chapterQuestions = Array.isArray(item.questions) ? item.questions : [];
      const hasQuestions = chapterQuestions.length > 0;
      input.checked = hasQuestions && selectedChapterIdSet.has(item.id);
      input.disabled = !hasQuestions;

      const ui = document.createElement("label");
      ui.className = "exam-chapter-check-ui";
      ui.setAttribute("for", chapterInputId);
      if (!hasQuestions) {
        ui.classList.add("is-disabled");
      }
      const averageDifficulty = chapterQuestions.length
        ? (
            chapterQuestions.reduce((sum, question) => sum + clampNumber(question?.difficulty, 1, 5, 3), 0) /
            chapterQuestions.length
          ).toFixed(1)
        : "-";

      const chapterName = document.createElement("strong");
      chapterName.className = "exam-chapter-name";
      chapterName.append(createExamIcon("book", 12), document.createTextNode(item.name));

      const chapterMeta = document.createElement("small");
      chapterMeta.textContent = hasQuestions
        ? `${chapterQuestions.length} سوال | سختی میانگین ${averageDifficulty}`
        : "این فصل فعلا سوالی ندارد.";

      ui.append(chapterName, chapterMeta);

      const countWrap = document.createElement("div");
      countWrap.className = "exam-chapter-count-wrap";

      const countLabel = document.createElement("span");
      countLabel.className = "exam-chapter-count-label";
      countLabel.textContent = "تعداد سوال این فصل";

      const chapterCountInput = document.createElement("input");
      chapterCountInput.type = "number";
      chapterCountInput.className = "exam-chapter-count-input";
      chapterCountInput.name = `chapterCount::${item.id}`;
      chapterCountInput.min = "0";
      chapterCountInput.max = String(chapterQuestions.length);
      chapterCountInput.step = "1";
      chapterCountInput.dataset.role = "exam-chapter-count";
      chapterCountInput.dataset.chapterId = item.id;
      chapterCountInput.value = String(defaultRequestedPlan[item.id] || 0);
      chapterCountInput.disabled = !input.checked || !hasQuestions;

      countWrap.append(countLabel, chapterCountInput);
      checkbox.append(input, ui, countWrap);
      chapterBlock.append(checkbox);
    });
    chaptersPane.append(chapterToolbar, chapterBlock);

    const controlsPane = document.createElement("section");
    controlsPane.className = "exam-pane exam-pane-controls";

    const controlsTitle = document.createElement("h4");
    controlsTitle.className = "exam-pane-title";
    controlsTitle.append(createExamIcon("spark", 13), document.createTextNode("تنظیمات تولید آزمون"));

    const controls = document.createElement("div");
    controls.className = "exam-builder-controls";

    const countInput = document.createElement("input");
    countInput.type = "number";
    countInput.name = "examCount";
    countInput.min = "1";
    countInput.max = "200";
    countInput.value = String(runtime.exam?.requestedCount || runtime.exam?.count || 10);
    countInput.placeholder = "تعداد سوال";
    countInput.dataset.action = "exam-target-count";

    const durationInput = document.createElement("input");
    durationInput.type = "number";
    durationInput.name = "examDuration";
    durationInput.min = String(EXAM_DURATION_MIN);
    durationInput.max = String(EXAM_DURATION_MAX);
    durationInput.value = String(
      clampNumber(runtime.exam?.duration, EXAM_DURATION_MIN, EXAM_DURATION_MAX, EXAM_DURATION_DEFAULT)
    );
    durationInput.placeholder = "مدت (دقیقه)";

    const profileSelect = document.createElement("select");
    profileSelect.name = "examProfile";
    profileSelect.append(
      createOption("mixed", "ترکیبی"),
      createOption("mostly-hard", "اغلب سخت"),
      createOption("only-easy", "فقط آسان"),
      createOption("only-hard", "فقط سخت"),
      createOption("step-up", "پلکانی (آسان به سخت)")
    );
    profileSelect.value = runtime.exam?.profile || "mixed";

    const orderSelect = document.createElement("select");
    orderSelect.name = "examOrder";
    orderSelect.append(
      createOption("random", "ترتیب تصادفی"),
      createOption("easy-first", "چینش آسان به سخت"),
      createOption("hard-first", "چینش سخت به آسان")
    );
    orderSelect.value = asText(runtime.exam?.order, "random");

    const difficultyPlanSelect = document.createElement("select");
    difficultyPlanSelect.name = "examDifficultyPlan";
    difficultyPlanSelect.append(
      createOption("smart-balanced", "هوشمند متعادل"),
      createOption("standard", "استاندارد آزمون"),
      createOption("challenge", "چالشی (تمرکز سخت)")
    );
    difficultyPlanSelect.value = normalizeExamDifficultyPlan(runtime.exam?.difficultyPlan);

    const submit = document.createElement("button");
    submit.type = "submit";
    submit.className = "primary exam-generate-btn";
    submit.append(createExamIcon("spark", 15), document.createTextNode("ساخت آزمون"));

    controls.append(
      createExamControlField("تعداد سوال", countInput, "count"),
      createExamControlField("زمان (دقیقه)", durationInput, "clock"),
      createExamControlField("پروفایل آزمون", profileSelect, "profile"),
      createExamControlField("توزیع سختی", difficultyPlanSelect, "spark"),
      createExamControlField("چینش سوالات", orderSelect, "sort"),
      submit
    );
    controlsPane.append(controlsTitle, controls);

    form.append(chaptersPane, controlsPane);
    rebalanceExamChapterCountsForm(form, { preserveExisting: true });
    panel.append(form);
    panel.append(createExamLibraryPanel(subject, chapter, runtime));

    const hasExamSession = !!(runtime?.exam && Array.isArray(runtime.exam.ids) && runtime.exam.ids.length);
    panel.classList.toggle("exam-session-ready", hasExamSession);
    panel.classList.remove("exam-session-completed");

    if (!runtime.exam || !runtime.exam.ids.length) {
      panel.append(createEmptyState("فصل ها را انتخاب کنید و آزمون تولید کنید."));
      return;
    }

    const selectedQuestions = buildExamSelectedQuestions(subject, runtime.exam);

    if (!selectedQuestions.length) {
      panel.append(createEmptyState("موردی برای نمایش آزمون یافت نشد."));
      return;
    }

    ensureExamTimerState(runtime.exam);
    ensureExamCompletionState(runtime.exam);
    if (!runtime.exam.completed && getExamRemainingMs(runtime.exam) <= 0) {
      completeExamSession(runtime, "timeout");
      setStatus("زمان آزمون به پایان رسید. پاسخ‌نامه نمایش داده شد.", "ok");
      showToast("زمان آزمون تمام شد. پاسخ‌نامه آماده است.", "ok");
    }
    if (runtime.exam.completed) {
      updateExamEvaluationFromMarks(runtime.exam);
      panel.classList.add("exam-session-completed");
    }

    if (runtime.exam.completed) {
      panel.append(createExamCompletionBanner(runtime.exam, selectedQuestions.length));
    } else {
      panel.classList.add("exam-has-live-timer");
      panel.append(createExamCountdownPanel(runtime.exam, subject.id, chapter.id));
    }

    const distribution = summarizeQuestionDifficulty(selectedQuestions);
    const safeDuration = clampNumber(runtime.exam?.duration, EXAM_DURATION_MIN, EXAM_DURATION_MAX, EXAM_DURATION_DEFAULT);
    const createdAtLabel = formatIsoDateTime(runtime.exam?.createdAt);
    const selectedChapterCount = Array.isArray(runtime.exam?.chapterIds) ? runtime.exam.chapterIds.length : 0;
    const selectedChapterNames = subject.chapters
      .filter((item) => Array.isArray(runtime.exam?.chapterIds) && runtime.exam.chapterIds.includes(item.id))
      .map((item) => item.name);
    const examCode = resolveExamCode(runtime.exam);
    const scorePlan = buildExamPointPlan(selectedQuestions);
    const totalScore = scorePlan.reduce((sum, value) => sum + value, 0);

    const overview = document.createElement("section");
    overview.className = "qb-overview";
    overview.append(
      createQuestionBankStat("کل سوال ها", String(totalQuestions)),
      createQuestionBankStat("فصل انتخابی", String(selectedChapterCount)),
      createQuestionBankStat("خروجی آزمون", String(selectedQuestions.length)),
      createQuestionBankStat("زمان", `${safeDuration} دقیقه`),
      createQuestionBankStat("بارم کل", formatExamScore(totalScore))
    );
    panel.append(overview);

    panel.append(
      createMetaRow(
        `کد ${examCode} | پروفایل ${getExamProfileLabel(runtime.exam.profile)} | توزیع ${getExamDifficultyPlanLabel(
          runtime.exam.difficultyPlan
        )} | چینش ${getExamOrderLabel(runtime.exam.order)} | تاریخ ساخت ${createdAtLabel}`
      )
    );

    const actionRow = document.createElement("div");
    actionRow.className = "exam-paper-actions";

    const quickStats = document.createElement("div");
    quickStats.className = "exam-paper-quick-stats";
    quickStats.append(
      createExamStatChip("سوال", String(selectedQuestions.length), "count"),
      createExamStatChip("متوسط", String(distribution.medium), "spark"),
      createExamStatChip("دشوار", String(distribution.hard), "bolt"),
      createExamStatChip("آسان", String(distribution.easy), "leaf"),
      createExamStatChip("بارم", formatExamScore(totalScore), "grid")
    );

    const sessionActions = document.createElement("div");
    sessionActions.className = "exam-actions-grid";

    const printBtn = document.createElement("button");
    printBtn.type = "button";
    printBtn.className = "btn-exam btn-exam-primary btn-exam-primary-print";
    printBtn.dataset.action = "print-exam";
    printBtn.append(createExamIcon("print", 15), document.createTextNode("PDF سوالات"));

    const printWithAnswersBtn = document.createElement("button");
    printWithAnswersBtn.type = "button";
    printWithAnswersBtn.className = "btn-exam btn-exam-ghost btn-exam-ghost-copy";
    printWithAnswersBtn.dataset.action = "print-exam-with-answers";
    printWithAnswersBtn.append(createExamIcon("book", 14), document.createTextNode("PDF پاسخنامه"));

    const copyCodeBtn = document.createElement("button");
    copyCodeBtn.type = "button";
    copyCodeBtn.className = "btn-exam btn-exam-ghost btn-exam-ghost-copy";
    copyCodeBtn.dataset.action = "exam-copy-code";
    copyCodeBtn.dataset.subjectId = subject.id;
    copyCodeBtn.dataset.chapterId = chapter.id;
    copyCodeBtn.dataset.examCode = examCode;
    copyCodeBtn.append(createExamIcon("paper", 14), document.createTextNode("کپی کد آزمون"));

    const resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.className = runtime.exam.completed
      ? "btn-exam btn-exam-ghost btn-exam-ghost-copy"
      : "btn-exam btn-exam-ghost-danger";
    resetBtn.dataset.action = "exam-reset";
    resetBtn.dataset.subjectId = subject.id;
    resetBtn.dataset.chapterId = chapter.id;
    resetBtn.append(
      createExamIcon("spark", 14),
      document.createTextNode(runtime.exam.completed ? "ساخت آزمون جدید" : "لغو آزمون")
    );

    const saveSessionBtn = document.createElement("button");
    saveSessionBtn.type = "button";
    saveSessionBtn.className = "btn-exam btn-exam-ghost btn-exam-ghost-copy";
    saveSessionBtn.dataset.action = "exam-save-session";
    saveSessionBtn.dataset.subjectId = subject.id;
    saveSessionBtn.dataset.chapterId = chapter.id;
    saveSessionBtn.append(createExamIcon("grid", 14), document.createTextNode("ذخیره آزمون"));

    if (!runtime.exam.completed) {
      const finishBtn = document.createElement("button");
      finishBtn.type = "button";
      finishBtn.className = "btn-exam btn-exam-primary btn-exam-primary-finish";
      finishBtn.dataset.action = "exam-finish";
      finishBtn.dataset.subjectId = subject.id;
      finishBtn.dataset.chapterId = chapter.id;
      finishBtn.append(createExamIcon("check", 14), document.createTextNode("اتمام آزمون"));
      sessionActions.append(finishBtn);
    }

    sessionActions.append(copyCodeBtn, printBtn, printWithAnswersBtn, saveSessionBtn, resetBtn);
    actionRow.append(quickStats, sessionActions);
    const sessionRegion = document.createElement("section");
    sessionRegion.className = "exam-session-region";
    sessionRegion.dataset.subjectId = subject.id;
    sessionRegion.dataset.chapterId = chapter.id;
    if (!runtime.exam.completed) {
      sessionRegion.dataset.examFocusLock = "active";
      sessionRegion.tabIndex = -1;
      sessionRegion.setAttribute("aria-label", "برگه فعال آزمون");
    }
    sessionRegion.append(actionRow);

    const paper = document.createElement("section");
    paper.className = "exam-paper";
    paper.tabIndex = -1;
    if (runtime.exam.completed) {
      paper.classList.add("is-completed");
    }

    const paperHead = document.createElement("header");
    paperHead.className = "exam-paper-head";

    const brandRow = document.createElement("div");
    brandRow.className = "exam-paper-brand-row";

    const brand = document.createElement("div");
    brand.className = "exam-paper-brand";

    const paperTitle = document.createElement("h3");
    paperTitle.className = "exam-paper-title";
    paperTitle.append(createExamIcon("paper", 15), document.createTextNode("برگه آزمون استاندارد"));

    const paperCaption = document.createElement("p");
    paperCaption.textContent = `${subject.name} | تنظیم شده برای ${selectedChapterCount} فصل`;
    brand.append(paperTitle, paperCaption);

    const paperCode = document.createElement("span");
    paperCode.className = "exam-paper-code";
    paperCode.textContent = `کد آزمون: ${examCode}`;
    brandRow.append(brand, paperCode);

    const paperMetaGrid = document.createElement("div");
    paperMetaGrid.className = "exam-paper-meta-grid";
    const chapterHeaderValue = selectedChapterNames.length === 1
      ? selectedChapterNames[0]
      : selectedChapterNames.length
        ? `${selectedChapterNames.length} فصل`
        : chapter.name;
    paperMetaGrid.append(
      createExamMetaPill("فصل", chapterHeaderValue, "chapter"),
      createExamMetaPill("درس", subject.name, "subject"),
      createExamMetaPill("تعداد سوال", String(selectedQuestions.length), "count"),
      createExamMetaPill("پروفایل", getExamProfileLabel(runtime.exam.profile), "profile"),
      createExamMetaPill("توزیع سختی", getExamDifficultyPlanLabel(runtime.exam.difficultyPlan), "difficulty-plan"),
      createExamMetaPill("چینش", getExamOrderLabel(runtime.exam.order), "order"),
      createExamMetaPill("زمان", `${safeDuration} دقیقه`, "duration"),
      createExamMetaPill("بارم کل", formatExamScore(totalScore), "score"),
      createExamMetaPill("تاریخ ساخت", createdAtLabel, "created-at")
    );

    const chapterList = document.createElement("div");
    chapterList.className = "exam-paper-chapter-list";
    (selectedChapterNames.length ? selectedChapterNames : [chapter.name]).forEach((chapterName) => {
      const pill = document.createElement("span");
      pill.className = "exam-paper-chapter-pill";
      pill.textContent = chapterName;
      chapterList.append(pill);
    });

    const profileSnapshot = getSettingsProfileSnapshot();
    const studentName = asText(profileSnapshot?.name, "").trim() || "دانشجو";

    const studentLine = document.createElement("p");
    studentLine.className = "exam-paper-student-line";
    studentLine.textContent = `نام دانشجو: ${studentName}`;

    paperHead.append(brandRow, paperMetaGrid, chapterList, studentLine);

    const examList = document.createElement("section");
    examList.className = "question-list exam-paper-list";
    const examListFragment = document.createDocumentFragment();
    const deferredAnswerBlocks = [];

    selectedQuestions.forEach((question, index) => {
      const difficulty = clampNumber(question?.difficulty, 1, 5, 3);
      const questionScore = scorePlan[index] || 0;

      const item = createQuestionCard({
        question,
        order: index + 1,
        subjectId: subject.id,
        chapterId: chapter.id,
        withDisclosures: false,
        selectable: false,
        withSolvedToggle: false,
        showSolvedState: false,
        withQuestionDelete: false,
        staggerIndex: index,
        enableStagger
      });
      item.classList.add("exam-paper-item");

      const questionMeta = document.createElement("div");
      questionMeta.className = "exam-paper-question-meta";

      const chapterTag = document.createElement("span");
      chapterTag.className = "exam-paper-question-tag";
      chapterTag.textContent = `فصل: ${asText(question?.chapter, chapter.name)}`;

      const difficultyTag = document.createElement("span");
      difficultyTag.className = "exam-paper-question-tag";
      difficultyTag.textContent = `سختی: ${renderDifficultyStars(difficulty)}`;

      const pointTag = document.createElement("span");
      pointTag.className = "exam-paper-question-points";
      pointTag.textContent = `بارم: ${formatExamScore(questionScore)}`;

      questionMeta.append(chapterTag, difficultyTag, pointTag);
      item.append(questionMeta);
      if (runtime.exam.completed) {
        const shouldDeferAnswerBlock = mobilePerfMode && selectedQuestions.length >= 14 && index >= 4;
        if (shouldDeferAnswerBlock) {
          const skeleton = createExamQuestionAnswerSkeleton(index + 1);
          item.append(skeleton);
          deferredAnswerBlocks.push({
            placeholder: skeleton,
            question,
            order: index + 1
          });
        } else {
          item.append(createExamQuestionAnswerBlock(subject.id, chapter.id, runtime.exam, question, index + 1));
        }
      }
      examListFragment.append(item);
    });
    examList.append(examListFragment);

    const printGoodLuck = document.createElement("p");
    printGoodLuck.className = "exam-paper-print-goodluck";
    printGoodLuck.textContent = "موفق باشی";

    paper.append(paperHead, examList, printGoodLuck);
    sessionRegion.append(paper);
    if (mobilePerfMode || isStandaloneMobileModeActive()) {
      sessionRegion.append(createExamMobileNavDock(subject.id, chapter.id, selectedQuestions.length));
      bindExamMobileNavAutoSync(sessionRegion);
    }
    panel.append(sessionRegion);
    if (runtime.exam.completed) {
      if (deferredAnswerBlocks.length) {
        scheduleExamAnswerHydration(examList, deferredAnswerBlocks, subject.id, chapter.id, runtime.exam);
      }
      panel.append(createExamEvaluationPanel(subject, chapter, runtime.exam, selectedQuestions.length, selectedQuestions));
    } else {
      window.requestAnimationFrame(() => {
        if (!sessionRegion.isConnected || state.view.tab !== "exam") {
          return;
        }
        const runtimeNow = getActiveRuntime();
        if (!runtimeNow?.exam || runtimeNow.exam.completed) {
          return;
        }
        focusExamPrimaryElement(sessionRegion);
        window.setTimeout(() => {
          const runtimeLatest = getActiveRuntime();
          const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
          if (!sessionRegion.isConnected || state.view.tab !== "exam" || !runtimeLatest?.exam || runtimeLatest.exam.completed) {
            return;
          }
          if (!activeElement || !sessionRegion.contains(activeElement)) {
            focusExamPrimaryElement(sessionRegion);
          }
        }, 70);
      });
    }
    observeMathWithin(paper);
    queueAssetHydrationWithin(paper);
    if (mobilePerfMode || isStandaloneMobileModeActive()) {
      window.requestAnimationFrame(() => {
        if (sessionRegion.isConnected) {
          syncExamMobileNavDock(sessionRegion);
        }
      });
    }
  }

  function createExamLibraryPanel(subject, chapter, runtime) {
    const section = document.createElement("section");
    section.className = "exam-library-panel";

    const head = document.createElement("div");
    head.className = "exam-library-head";

    const title = document.createElement("h4");
    title.className = "exam-library-title";
    title.append(createExamIcon("grid", 13), document.createTextNode("بانک آزمون‌های ذخیره‌شده"));

    const note = document.createElement("p");
    note.className = "exam-library-note";
    note.textContent = "آزمون‌های همین درس را ذخیره کن تا بعدا دوباره اجرا یا ویرایش شوند.";
    head.append(title, note);
    section.append(head);

    const entries = getExamLibraryEntriesForSubject(subject.id).slice(0, 12);
    const list = document.createElement("div");
    list.className = "exam-library-list";

    if (!entries.length) {
      const empty = document.createElement("p");
      empty.className = "exam-library-empty";
      empty.textContent = "هنوز آزمونی ذخیره نشده است.";
      list.append(empty);
    } else {
      entries.forEach((entry) => {
        const item = document.createElement("article");
        item.className = `exam-library-item${entry.chapterId === chapter.id ? " is-current" : ""}`;
        item.dataset.examLibraryId = entry.id;

        const itemTitle = document.createElement("strong");
        itemTitle.className = "exam-library-item-title";
        itemTitle.textContent = entry.label;

        const itemMeta = document.createElement("p");
        itemMeta.className = "exam-library-item-meta";
        itemMeta.textContent = `${entry.chapterName} | ${entry.requestedCount} سوال | ${entry.duration} دقیقه | ${getExamProfileLabel(
          entry.profile
        )} | ${getExamDifficultyPlanLabel(entry.difficultyPlan)}`;

        const itemDate = document.createElement("small");
        itemDate.className = "exam-library-item-date";
        itemDate.textContent = `آخرین بروزرسانی: ${formatIsoDateTime(entry.updatedAt || entry.createdAt)}`;

        const actions = document.createElement("div");
        actions.className = "exam-library-actions";

        const runBtn = document.createElement("button");
        runBtn.type = "button";
        runBtn.className = "exam-library-btn";
        runBtn.dataset.action = "exam-run-saved";
        runBtn.dataset.examLibraryId = entry.id;
        runBtn.textContent = "اجرا";

        const editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.className = "exam-library-btn";
        editBtn.dataset.action = "exam-edit-saved";
        editBtn.dataset.examLibraryId = entry.id;
        editBtn.textContent = "ویرایش";

        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "exam-library-btn is-danger";
        removeBtn.dataset.action = "exam-delete-saved";
        removeBtn.dataset.examLibraryId = entry.id;
        removeBtn.textContent = "حذف";

        actions.append(runBtn, editBtn, removeBtn);
        item.append(itemTitle, itemMeta, itemDate, actions);
        list.append(item);
      });
    }

    const saveNowBtn = document.createElement("button");
    saveNowBtn.type = "button";
    saveNowBtn.className = "exam-library-save-btn";
    saveNowBtn.dataset.action = "exam-save-session";
    saveNowBtn.dataset.subjectId = subject.id;
    saveNowBtn.dataset.chapterId = chapter.id;
    saveNowBtn.disabled = !(runtime?.exam && Array.isArray(runtime.exam.ids) && runtime.exam.ids.length);
    saveNowBtn.append(createExamIcon("check", 13), document.createTextNode("ذخیره آزمون فعلی"));

    section.append(list, saveNowBtn);
    return section;
  }

  function buildExamLibraryEntryLabel(subject, chapter, exam, questionCount) {
    const safeSubjectName = asText(subject?.name, "درس");
    const safeChapterName = asText(chapter?.name, "فصل");
    const countLabel = Math.max(1, Number(questionCount) || Number(exam?.requestedCount) || 1);
    return `آزمون ${safeSubjectName} | ${safeChapterName} | ${countLabel} سوال`;
  }

  function buildExamLibraryEntryPayload(subject, chapter, exam) {
    if (!subject || !chapter || !exam || !Array.isArray(exam.ids) || !exam.ids.length) {
      return null;
    }

    const nowIso = new Date().toISOString();
    const ids = sanitizeRuntimeIdSequence(exam.ids);
    if (!ids.length) {
      return null;
    }

    return normalizeExamLibraryEntry({
      id: createId("exlib"),
      label: buildExamLibraryEntryLabel(subject, chapter, exam, ids.length),
      subjectId: subject.id,
      chapterId: chapter.id,
      subjectName: subject.name,
      chapterName: chapter.name,
      profile: asText(exam.profile, "mixed"),
      order: normalizeExamOrder(exam.order),
      difficultyPlan: normalizeExamDifficultyPlan(exam.difficultyPlan),
      duration: clampNumber(exam.duration, EXAM_DURATION_MIN, EXAM_DURATION_MAX, EXAM_DURATION_DEFAULT),
      requestedCount: Math.max(1, Number(exam.requestedCount) || ids.length),
      chapterIds: Array.isArray(exam.chapterIds) ? exam.chapterIds : [chapter.id],
      requestedChapterCounts:
        exam.requestedChapterCounts && typeof exam.requestedChapterCounts === "object" ? exam.requestedChapterCounts : {},
      ids,
      createdAt: nowIso,
      updatedAt: nowIso
    });
  }

  function buildExamLibrarySignature(entry) {
    if (!entry || typeof entry !== "object") {
      return "";
    }

    const ids = sanitizeRuntimeIdSequence(entry.ids);
    if (!ids.length) {
      return "";
    }

    const chapterIds = sanitizeRuntimeIdSequence(entry.chapterIds);
    const chapterPlan = normalizeExamLibraryChapterPlan(entry.requestedChapterCounts);
    const chapterPlanSignature = Object.keys(chapterPlan)
      .sort()
      .map((chapterId) => `${chapterId}:${chapterPlan[chapterId]}`)
      .join("|");

    return [
      asText(entry.subjectId, "").trim(),
      asText(entry.chapterId, "").trim(),
      asText(entry.profile, "mixed").trim().toLowerCase(),
      normalizeExamOrder(entry.order),
      normalizeExamDifficultyPlan(entry.difficultyPlan),
      String(clampNumber(entry.duration, EXAM_DURATION_MIN, EXAM_DURATION_MAX, EXAM_DURATION_DEFAULT)),
      String(Math.max(1, Number(entry.requestedCount) || ids.length)),
      chapterIds.join(","),
      chapterPlanSignature,
      ids.join(",")
    ].join("::");
  }

  function handleExamSaveSession(target) {
    const subjectId = asText(target?.dataset?.subjectId, asText(state.view.subjectId, "")).trim();
    const chapterId = asText(target?.dataset?.chapterId, asText(state.view.chapterId, "")).trim();
    const subject = state.subjects.find((item) => asText(item?.id, "").trim() === subjectId) || null;
    const chapter =
      subject && Array.isArray(subject.chapters)
        ? subject.chapters.find((item) => asText(item?.id, "").trim() === chapterId) || null
        : null;
    const runtime = subjectId && chapterId ? getRuntimeIfExists(subjectId, chapterId) : null;

    if (!subject || !chapter || !runtime?.exam || !Array.isArray(runtime.exam.ids) || !runtime.exam.ids.length) {
      setStatus("برای ذخیره، ابتدا یک آزمون معتبر بساز.", "error");
      return;
    }

    const payload = buildExamLibraryEntryPayload(subject, chapter, runtime.exam);
    if (!payload) {
      setStatus("آزمون فعلی قابل ذخیره‌سازی نیست.", "error");
      return;
    }

    const payloadSignature = buildExamLibrarySignature(payload);
    const entries = Array.isArray(state.examLibrary) ? state.examLibrary : [];
    const duplicateIndex =
      payloadSignature && entries.length
        ? entries.findIndex((item) => buildExamLibrarySignature(item) === payloadSignature)
        : -1;
    if (duplicateIndex >= 0) {
      const existing = normalizeExamLibraryEntry(entries[duplicateIndex]);
      if (existing) {
        payload.id = existing.id;
        payload.createdAt = existing.createdAt;
      }
      payload.updatedAt = new Date().toISOString();
    }

    const nextEntries =
      duplicateIndex >= 0 ? [payload, ...entries.filter((_, index) => index !== duplicateIndex)] : [payload, ...entries];
    state.examLibrary = sanitizeExamLibraryCollection(nextEntries);
    persistExamLibrary();
    touchExamRuntimeAutosave(true);
    render();
    setStatus(duplicateIndex >= 0 ? "نسخه جدید آزمون جایگزین نسخه قبلی شد." : "آزمون در بانک آزمون‌های ذخیره‌شده ثبت شد.", "ok");
  }

  async function handleExamRunSaved(target) {
    const entryId = asText(target?.dataset?.examLibraryId, "").trim();
    const entry = getExamLibraryEntryById(entryId);
    if (!entry) {
      setStatus("آزمون ذخیره‌شده پیدا نشد.", "error");
      return;
    }

    const subject = state.subjects.find((item) => asText(item?.id, "").trim() === asText(entry.subjectId, "").trim()) || null;
    const chapter =
      subject && Array.isArray(subject.chapters)
        ? subject.chapters.find((item) => asText(item?.id, "").trim() === asText(entry.chapterId, "").trim()) || null
        : null;
    if (!subject || !chapter) {
      setStatus("درس/فصل آزمون ذخیره‌شده دیگر وجود ندارد.", "error");
      pruneExamLibraryAgainstSubjects();
      return;
    }

    if (!chapter.questionsLoaded && chapter.questionsFile) {
      try {
        await ensureChapterQuestionsLoaded(subject, chapter, { silent: true });
      } catch (error) {
        console.error(error);
      }
    }

    const byId = getSubjectQuestionIndex(subject);
    const validQuestions = sanitizeRuntimeIdSequence(entry.ids).map((id) => byId.get(id)).filter(Boolean);
    if (!validQuestions.length) {
      setStatus("هیچ سوال معتبری از این آزمون ذخیره‌شده باقی نمانده است.", "error");
      return;
    }

    const validIds = validQuestions.map((item) => asText(item?.id, "").trim()).filter(Boolean);
    const validIdSet = new Set(validIds);
    const chapterIds = (Array.isArray(entry.chapterIds) ? entry.chapterIds : [])
      .map((id) => asText(id, "").trim())
      .filter((id) => subject.chapters.some((chapterItem) => asText(chapterItem?.id, "").trim() === id));
    const actualChapterCounts = {};
    (subject.chapters || []).forEach((chapterItem) => {
      const chapterItemId = asText(chapterItem?.id, "").trim();
      if (!chapterItemId) {
        return;
      }
      const count = (Array.isArray(chapterItem?.questions) ? chapterItem.questions : []).reduce((sum, question) => {
        return validIdSet.has(asText(question?.id, "").trim()) ? sum + 1 : sum;
      }, 0);
      if (count > 0 || chapterIds.includes(chapterItemId)) {
        actualChapterCounts[chapterItemId] = count;
      }
    });

    const nowMs = Date.now();
    const runtime = getRuntime(subject.id, chapter.id);
    runtime.exam = {
      profile: asText(entry.profile, "mixed"),
      order: normalizeExamOrder(entry.order),
      difficultyPlan: normalizeExamDifficultyPlan(entry.difficultyPlan),
      duration: clampNumber(entry.duration, EXAM_DURATION_MIN, EXAM_DURATION_MAX, EXAM_DURATION_DEFAULT),
      count: validIds.length,
      chapterIds: chapterIds.length ? chapterIds : [chapter.id],
      requestedCount: clampNumber(entry.requestedCount, 1, 200, validIds.length),
      requestedChapterCounts: normalizeExamLibraryChapterPlan(entry.requestedChapterCounts),
      actualChapterCounts,
      ids: validIds,
      page: 1,
      poolCount: countSubjectQuestions(subject),
      createdAt: new Date().toISOString(),
      examCode: createExamCode(),
      completed: false,
      completedReason: "",
      completedAt: "",
      evaluation: null,
      answerMarks: {},
      timer: {
        durationMs: clampNumber(entry.duration, EXAM_DURATION_MIN, EXAM_DURATION_MAX, EXAM_DURATION_DEFAULT) * 60 * 1000,
        startedAtMs: nowMs,
        endsAtMs: nowMs + clampNumber(entry.duration, EXAM_DURATION_MIN, EXAM_DURATION_MAX, EXAM_DURATION_DEFAULT) * 60 * 1000
      }
    };

    state.view.level = 3;
    state.view.subjectId = subject.id;
    state.view.chapterId = chapter.id;
    state.view.tab = "exam";
    state.pagination.page = 1;
    sanitizeView();

    entry.updatedAt = new Date().toISOString();
    state.examLibrary = sanitizeExamLibraryCollection(state.examLibrary || []);
    persistExamLibrary();
    touchExamRuntimeAutosave(true);
    render();
    setStatus("آزمون ذخیره‌شده اجرا شد.", "ok");
  }

  function handleExamEditSaved(target) {
    const entryId = asText(target?.dataset?.examLibraryId, "").trim();
    const entry = getExamLibraryEntryById(entryId);
    if (!entry) {
      setStatus("آزمون ذخیره‌شده پیدا نشد.", "error");
      return;
    }

    const subject = state.subjects.find((item) => asText(item?.id, "").trim() === asText(entry.subjectId, "").trim()) || null;
    const chapter =
      subject && Array.isArray(subject.chapters)
        ? subject.chapters.find((item) => asText(item?.id, "").trim() === asText(entry.chapterId, "").trim()) || null
        : null;
    if (!subject || !chapter) {
      setStatus("درس/فصل آزمون ذخیره‌شده دیگر وجود ندارد.", "error");
      pruneExamLibraryAgainstSubjects();
      return;
    }

    const runtime = getRuntime(subject.id, chapter.id);
    runtime.exam = buildExamDraftState({
      profile: entry.profile,
      order: entry.order,
      difficultyPlan: entry.difficultyPlan,
      duration: entry.duration,
      count: entry.requestedCount,
      requestedCount: entry.requestedCount,
      chapterIds: entry.chapterIds,
      requestedChapterCounts: entry.requestedChapterCounts,
      actualChapterCounts: {}
    });

    entry.updatedAt = new Date().toISOString();
    state.examLibrary = sanitizeExamLibraryCollection(state.examLibrary || []);
    persistExamLibrary();

    state.view.level = 3;
    state.view.subjectId = subject.id;
    state.view.chapterId = chapter.id;
    state.view.tab = "exam";
    state.pagination.page = 1;
    sanitizeView();
    touchExamRuntimeAutosave(true);
    render();
    setStatus("تنظیمات آزمون ذخیره‌شده داخل سازنده بارگذاری شد.", "ok");
  }

  function handleExamDeleteSaved(target) {
    const entryId = asText(target?.dataset?.examLibraryId, "").trim();
    if (!entryId) {
      return;
    }

    const entry = getExamLibraryEntryById(entryId);
    if (!entry) {
      return;
    }

    const approved = window.confirm(`آزمون ذخیره‌شده «${entry.label}» حذف شود؟`);
    if (!approved) {
      return;
    }

    state.examLibrary = (state.examLibrary || []).filter((item) => asText(item?.id, "").trim() !== entryId);
    persistExamLibrary();
    touchExamRuntimeAutosave(true);
    render();
    setStatus("آزمون ذخیره‌شده حذف شد.", "ok");
  }

  function createExamMobileNavDock(subjectId, chapterId, totalCount) {
    const nav = document.createElement("div");
    nav.className = "exam-mobile-nav-dock";
    nav.dataset.subjectId = subjectId;
    nav.dataset.chapterId = chapterId;
    nav.dataset.totalCount = String(Math.max(0, Number(totalCount) || 0));

    const prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "exam-mobile-nav-btn";
    prevBtn.dataset.action = "exam-jump-prev";
    prevBtn.dataset.subjectId = subjectId;
    prevBtn.dataset.chapterId = chapterId;
    prevBtn.textContent = "سوال قبلی";

    const indicator = document.createElement("span");
    indicator.className = "exam-mobile-nav-indicator";
    indicator.dataset.role = "exam-mobile-nav-indicator";
    indicator.textContent = "1 / 1";

    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "exam-mobile-nav-btn";
    nextBtn.dataset.action = "exam-jump-next";
    nextBtn.dataset.subjectId = subjectId;
    nextBtn.dataset.chapterId = chapterId;
    nextBtn.textContent = "سوال بعدی";

    nav.append(prevBtn, indicator, nextBtn);
    return nav;
  }

  function bindExamMobileNavAutoSync(scope) {
    if (!(scope instanceof HTMLElement)) {
      return;
    }
    if (scope.dataset.examNavAutoSyncBound === "1") {
      return;
    }
    scope.dataset.examNavAutoSyncBound = "1";

    let rafId = 0;
    const requestSync = () => {
      if (rafId) {
        return;
      }
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        if (!scope.isConnected) {
          return;
        }
        syncExamMobileNavDock(scope);
      });
    };

    scope.addEventListener("scroll", requestSync, { passive: true });
    scope.addEventListener("touchmove", requestSync, { passive: true });
  }

  function resolveExamQuestionCards(scope) {
    if (!(scope instanceof HTMLElement)) {
      return [];
    }
    return Array.from(scope.querySelectorAll(".exam-paper-item")).filter((item) => item instanceof HTMLElement);
  }

  function resolveCurrentExamCardIndex(scope, cards) {
    const list = Array.isArray(cards) ? cards : [];
    if (!list.length) {
      return -1;
    }

    const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (activeElement) {
      const focusedCard = activeElement.closest(".exam-paper-item");
      if (focusedCard instanceof HTMLElement) {
        const focusedIndex = list.indexOf(focusedCard);
        if (focusedIndex >= 0) {
          return focusedIndex;
        }
      }
    }

    const viewportAnchor = Math.max(64, Math.round(window.innerHeight * 0.26));
    let bestIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;
    list.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const distance = Math.abs(rect.top - viewportAnchor);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    });
    return bestIndex;
  }

  function syncExamMobileNavDock(scope, explicitIndex = null) {
    if (!(scope instanceof HTMLElement)) {
      return;
    }
    const dock = scope.querySelector(".exam-mobile-nav-dock");
    if (!(dock instanceof HTMLElement)) {
      return;
    }

    const cards = resolveExamQuestionCards(scope);
    if (!cards.length) {
      dock.hidden = true;
      return;
    }
    dock.hidden = false;

    const total = cards.length;
    const fallbackIndex = resolveCurrentExamCardIndex(scope, cards);
    const currentIndex =
      Number.isFinite(Number(explicitIndex)) && Number(explicitIndex) >= 0
        ? Math.min(total - 1, Math.max(0, Number(explicitIndex)))
        : Math.max(0, fallbackIndex);

    dock.dataset.currentIndex = String(currentIndex);
    const indicator = dock.querySelector('[data-role="exam-mobile-nav-indicator"]');
    if (indicator instanceof HTMLElement) {
      indicator.textContent = `${currentIndex + 1} / ${total}`;
    }

    const prevBtn = dock.querySelector('[data-action="exam-jump-prev"]');
    if (prevBtn instanceof HTMLButtonElement) {
      prevBtn.disabled = currentIndex <= 0;
    }
    const nextBtn = dock.querySelector('[data-action="exam-jump-next"]');
    if (nextBtn instanceof HTMLButtonElement) {
      nextBtn.disabled = currentIndex >= total - 1;
    }
  }

  function handleExamQuestionJump(target, direction) {
    const scope =
      target?.closest(".exam-session-region") ||
      refs.levelContainer?.querySelector(".exam-session-region") ||
      null;
    if (!(scope instanceof HTMLElement)) {
      return;
    }

    const cards = resolveExamQuestionCards(scope);
    if (!cards.length) {
      return;
    }

    const currentIndex = resolveCurrentExamCardIndex(scope, cards);
    const safeDirection = Number(direction) >= 0 ? 1 : -1;
    const nextIndex = Math.min(cards.length - 1, Math.max(0, currentIndex + safeDirection));
    const targetCard = cards[nextIndex];
    if (!(targetCard instanceof HTMLElement)) {
      return;
    }

    targetCard.scrollIntoView({
      block: "start",
      inline: "nearest",
      behavior: "smooth"
    });

    const focusTarget = targetCard.querySelector(".question-card");
    if (focusTarget instanceof HTMLElement) {
      focusTarget.setAttribute("tabindex", "-1");
      try {
        focusTarget.focus({ preventScroll: true });
      } catch {
        focusTarget.focus();
      }
    }

    syncExamMobileNavDock(scope, nextIndex);
  }

  function createExamPrintAnswerSheet(questionList = []) {
    const questions = Array.isArray(questionList) ? questionList : [];
    const section = document.createElement("section");
    section.className = "exam-paper-answer-sheet";

    const heading = document.createElement("h4");
    heading.className = "exam-paper-answer-sheet-title";
    heading.textContent = "پاسخنامه تشریحی";

    const caption = document.createElement("p");
    caption.className = "exam-paper-answer-sheet-caption";
    caption.textContent = "این بخش مخصوص نسخه PDF پاسخنامه است.";

    const list = document.createElement("div");
    list.className = "exam-paper-answer-sheet-list";

    questions.forEach((question, index) => {
      const item = document.createElement("article");
      item.className = "exam-paper-answer-item";

      const title = document.createElement("strong");
      title.className = "exam-paper-answer-item-title";
      title.textContent = `پاسخ سوال ${index + 1}`;

      const body = document.createElement("div");
      body.className = "exam-paper-answer-item-body";
      body.append(buildRichTextFragment(getQuestionSolutionText(question) || "برای این سوال پاسخ تشریحی ثبت نشده است."));

      item.append(title, body);
      list.append(item);
    });

    if (!questions.length) {
      const empty = document.createElement("p");
      empty.className = "exam-paper-answer-sheet-empty";
      empty.textContent = "هیچ سوالی برای پاسخنامه پیدا نشد.";
      list.append(empty);
    }

    section.append(heading, caption, list);
    return section;
  }

  function ensureExamPrintAnswerSheet(examScope, options = {}) {
    if (!(examScope instanceof HTMLElement)) {
      return null;
    }

    const includeAnswers = options.includeAnswers === true;
    const paper = examScope.querySelector(".exam-paper");
    if (!(paper instanceof HTMLElement)) {
      return null;
    }

    const existing = paper.querySelector(".exam-paper-answer-sheet");
    if (!includeAnswers) {
      if (existing instanceof HTMLElement) {
        existing.remove();
      }
      return null;
    }

    if (existing instanceof HTMLElement) {
      return existing;
    }

    const subjectId = asText(examScope.dataset.subjectId, "").trim();
    const chapterId = asText(examScope.dataset.chapterId, "").trim();
    if (!subjectId || !chapterId) {
      return null;
    }
    const runtime = getRuntimeIfExists(subjectId, chapterId);
    const subject = state.subjects.find((item) => asText(item?.id, "").trim() === subjectId) || null;
    if (!runtime?.exam || !subject) {
      return null;
    }

    const selectedQuestions = buildExamSelectedQuestions(subject, runtime.exam);
    const answerSheet = createExamPrintAnswerSheet(selectedQuestions);
    const printGoodLuck = paper.querySelector(".exam-paper-print-goodluck");
    if (printGoodLuck instanceof HTMLElement) {
      paper.insertBefore(answerSheet, printGoodLuck);
    } else {
      paper.append(answerSheet);
    }
    observeMathWithin(answerSheet);
    queueAssetHydrationWithin(answerSheet);
    return answerSheet;
  }

  function renderChapterMapMode(panel, subject, chapter, options = {}) {
    panel.classList.add("question-bank-panel", "chapter-map-panel");

    const orderedChapters = getOrderedChapters(subject);
    const activeChapterId = asText(chapter?.id, "").trim();
    const chaptersWithTree = orderedChapters.filter((item) => getChapterTreeNodeCount(item) > 0);
    const renderChapters = chaptersWithTree;
    const hideLegend = options?.hideLegend === true;
    const uiState = getChapterMapUiState(subject.id);
    const mobilePerfMode = isMobileViewportActive();
    const desktopLite = isDesktopPerformanceLiteActive();
    if (mobilePerfMode) {
      panel.classList.add("chapter-map-mobile-perf");
      uiState.fxEnabled = false;
    }
    if (desktopLite) {
      panel.classList.add("chapter-map-desktop-perf");
      uiState.fxEnabled = false;
    }

    const toolbar = document.createElement("section");
    toolbar.className = "qb-filter-bar chapter-map-toolbar";

    const toolbarTop = document.createElement("div");
    toolbarTop.className = "chapter-map-toolbar-top";

    const toolbarTitle = document.createElement("h4");
    toolbarTitle.className = "chapter-map-toolbar-title";
    toolbarTitle.append(createLessonIcon("map", 14), document.createTextNode("نمودار درختی سفارشی فصل‌ها"));

    const toolbarMeta = document.createElement("span");
    toolbarMeta.className = "chapter-map-toolbar-meta";
    toolbarMeta.textContent = `${chaptersWithTree.length} فصل دارای tree از ${orderedChapters.length} فصل`;
    toolbarTop.append(toolbarTitle, toolbarMeta);

    const toolbarSearch = document.createElement("div");
    toolbarSearch.className = "chapter-map-search-wrap";

    const searchIcon = document.createElement("span");
    searchIcon.className = "chapter-map-search-icon";
    searchIcon.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6"></circle><path d="M16 16l4 4"></path></svg>';

    const searchInput = document.createElement("input");
    searchInput.type = "search";
    searchInput.className = "chapter-map-search";
    searchInput.placeholder = "جستجو فصل در نمودار";
    searchInput.value = uiState.query;
    searchInput.dataset.action = "chapter-map-search";
    searchInput.dataset.subjectId = subject.id;
    searchInput.setAttribute("aria-label", "جستجو در نمودار درختی فصل‌ها");
    searchInput.addEventListener("keydown", (event) => {
      if (asText(event?.key, "").trim() !== "Enter") {
        return;
      }
      event.preventDefault();
      uiState.query = asText(searchInput.value, "").trim();
      if (expandChapterTreeBranchesForSearch(subject.id, uiState.query)) {
        render();
      }
      applyChapterMapSearch(subject.id, uiState.query);
    });

    const actions = document.createElement("div");
    actions.className = "chapter-map-actions";

    const fitBtn = document.createElement("button");
    fitBtn.type = "button";
    fitBtn.className = "chapter-map-action-btn";
    fitBtn.dataset.action = "chapter-map-fit-view";
    fitBtn.append(createLessonIcon("map", 12), document.createTextNode("تناسب دید"));

    const resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.className = "chapter-map-action-btn";
    resetBtn.dataset.action = "chapter-map-reset-view";
    resetBtn.append(createLessonIcon("layers", 12), document.createTextNode("بازنشانی"));

    const exportBtn = document.createElement("button");
    exportBtn.type = "button";
    exportBtn.className = "chapter-map-action-btn chapter-map-action-btn-primary";
    exportBtn.dataset.action = "chapter-map-export-png";
    exportBtn.append(createLessonIcon("grid", 12), document.createTextNode("خروجی PNG"));

    const addNodeBtn = document.createElement("button");
    addNodeBtn.type = "button";
    addNodeBtn.className = "chapter-map-action-btn";
    addNodeBtn.dataset.action = "chapter-map-add-node";
    addNodeBtn.append(createLessonIcon("plus", 12), document.createTextNode("افزودن شاخه"));

    const renameNodeBtn = document.createElement("button");
    renameNodeBtn.type = "button";
    renameNodeBtn.className = "chapter-map-action-btn";
    renameNodeBtn.dataset.action = "chapter-map-rename-node";
    renameNodeBtn.append(createLessonIcon("edit", 12), document.createTextNode("تغییر نام"));

    const deleteNodeBtn = document.createElement("button");
    deleteNodeBtn.type = "button";
    deleteNodeBtn.className = "chapter-map-action-btn";
    deleteNodeBtn.dataset.action = "chapter-map-delete-node";
    deleteNodeBtn.append(createLessonIcon("trash", 12), document.createTextNode("حذف شاخه"));

    actions.append(addNodeBtn, renameNodeBtn, deleteNodeBtn, fitBtn, resetBtn, exportBtn);
    toolbarSearch.append(searchIcon, searchInput, actions);
    toolbar.append(toolbarTop, toolbarSearch);
    panel.append(toolbar);

    const layout = document.createElement("section");
    layout.className = `chapter-map-layout chapter-map-layout-tree${hideLegend ? " chapter-map-layout-no-legend" : ""}`;

    const stage = document.createElement("article");
    stage.className = "chapter-map-stage chapter-map-stage-tree";

    const canvas = document.createElement("div");
    canvas.className = "chapter-map-canvas chapter-map-canvas-tree";
    canvas.dataset.subjectId = subject.id;
    canvas.dataset.chapterId = activeChapterId;
    canvas.append(createLoader("در حال آماده‌سازی درخت فصل‌ها..."));

    stage.append(canvas);

    if (hideLegend) {
      layout.append(stage);
    } else {
      const legend = createChapterMapLegend(subject.id, orderedChapters, activeChapterId);
      layout.append(stage, legend);
    }
    panel.append(layout);

    if (!orderedChapters.length) {
      canvas.replaceChildren(createEmptyState("برای این درس فصلی ثبت نشده است."));
      return;
    }

    if (!chaptersWithTree.length) {
      canvas.replaceChildren(
        createEmptyState("هنوز tree مستقلی برای فصل‌ها ثبت نشده است. از ورود JSON درختی استفاده کن.")
      );
      return;
    }

    const safeChapter = chapter && typeof chapter === "object" ? chapter : { id: activeChapterId, name: "" };
    void mountChapterMapVisualization(canvas, subject, safeChapter, renderChapters, uiState);
  }

  function getChapterTreeNodeCount(chapter) {
    const treeNodes = normalizeChapterTreePayload(chapter?.tree ?? []);
    if (!Array.isArray(treeNodes) || !treeNodes.length) {
      return 0;
    }

    let count = 0;
    const stack = [...treeNodes];
    while (stack.length) {
      const current = stack.pop();
      if (!current || typeof current !== "object") {
        continue;
      }
      count += 1;
      const children = Array.isArray(current.children)
        ? current.children
        : Array.isArray(current.tree)
          ? current.tree
          : [];
      for (let index = children.length - 1; index >= 0; index -= 1) {
        stack.push(children[index]);
      }
    }
    return count;
  }

  function createChapterMapLegend(subjectId, chapters, activeChapterId = "") {
    const aside = document.createElement("aside");
    aside.className = "chapter-map-legend";
    aside.dataset.subjectId = subjectId;

    const head = document.createElement("header");
    head.className = "chapter-map-legend-head";

    const title = document.createElement("h5");
    title.append(createLessonIcon("layers", 12), document.createTextNode("فصل‌های درس"));

    const caption = document.createElement("p");
    caption.textContent = "نمایش بر اساس tree مستقل هر فصل";
    head.append(title, caption);

    const list = document.createElement("div");
    list.className = "chapter-map-legend-list";

    chapters.forEach((chapter, index) => {
      const treeNodeCount = getChapterTreeNodeCount(chapter);

      const item = document.createElement("button");
      item.type = "button";
      item.className = `chapter-map-legend-item${chapter.id === activeChapterId ? " is-current" : ""}`;
      item.dataset.action = "map-open-chapter";
      item.dataset.subjectId = subjectId;
      item.dataset.chapterId = chapter.id;
      item.dataset.searchKey = normalizeLookupKey(chapter.name);

      const main = document.createElement("span");
      main.className = "chapter-map-legend-main";

      const orderPill = document.createElement("span");
      orderPill.className = "chapter-map-order-pill";
      orderPill.textContent = String(index + 1);

      const name = document.createElement("strong");
      name.textContent = chapter.name;
      main.append(orderPill, name);

      const meta = document.createElement("span");
      meta.className = "chapter-map-legend-meta";

      const total = document.createElement("span");
      total.className = "chapter-map-legend-total";
      total.textContent = treeNodeCount > 0 ? `${treeNodeCount} گره` : "tree ثبت نشده";
      meta.append(total);

      item.append(main, meta);
      list.append(item);
    });

    aside.append(head, list);
    return aside;
  }

  function getChapterMapUiState(subjectId) {
    const safeSubjectId = asText(subjectId, "");
    if (!safeSubjectId) {
      return { query: "", fxEnabled: true, simpleView: false };
    }

    const defaultSimpleView = false;
    if (!chapterMapUiState.has(safeSubjectId)) {
      chapterMapUiState.set(safeSubjectId, {
        query: "",
        fxEnabled: true,
        simpleView: defaultSimpleView
      });
    }

    const stateRef = chapterMapUiState.get(safeSubjectId);
    if (typeof stateRef.query !== "string") {
      stateRef.query = "";
    }
    if (typeof stateRef.fxEnabled !== "boolean") {
      stateRef.fxEnabled = true;
    }
    if (typeof stateRef.simpleView !== "boolean") {
      stateRef.simpleView = defaultSimpleView;
    }
    return stateRef;
  }

  function getChapterTreeCollapseState(subjectId) {
    const safeSubjectId = asText(subjectId, "").trim();
    if (!safeSubjectId) {
      return new Set();
    }

    if (!chapterTreeCollapseState.has(safeSubjectId)) {
      const nextSet = new Set();
      nextSet[TREE_COLLAPSE_INIT_FLAG] = false;
      chapterTreeCollapseState.set(safeSubjectId, nextSet);
    }

    const stateSet = chapterTreeCollapseState.get(safeSubjectId);
    if (!(stateSet instanceof Set)) {
      const fallbackSet = new Set();
      fallbackSet[TREE_COLLAPSE_INIT_FLAG] = false;
      chapterTreeCollapseState.set(safeSubjectId, fallbackSet);
      return fallbackSet;
    }
    if (typeof stateSet[TREE_COLLAPSE_INIT_FLAG] !== "boolean") {
      stateSet[TREE_COLLAPSE_INIT_FLAG] = false;
    }
    return stateSet;
  }

  function resolveTreeChildrenForMapNode(node) {
    if (!node || typeof node !== "object") {
      return [];
    }
    const childCandidates = [node.children, node.tree, node.nodes, node.items, node.branches, node.map];
    for (const candidate of childCandidates) {
      if (Array.isArray(candidate)) {
        return candidate;
      }
    }
    return [];
  }

  function resolveTreeNodeRendererId(node, index, parentToken = "") {
    const explicitId = asText(node?.id, "").trim();
    if (explicitId) {
      return explicitId;
    }
    return `${parentToken || "ch"}-${index + 1}`;
  }

  function expandChapterTreeBranchesForSearch(subjectId, rawQuery = "") {
    const safeSubjectId = asText(subjectId, "").trim();
    const query = normalizeLookupKey(rawQuery);
    if (!safeSubjectId || !query) {
      return false;
    }

    const subject = state.subjects.find((item) => asText(item?.id, "").trim() === safeSubjectId);
    if (!subject || !Array.isArray(subject.chapters) || !subject.chapters.length) {
      return false;
    }

    const collapseState = getChapterTreeCollapseState(safeSubjectId);
    let changed = false;
    const openNode = (nodeId) => {
      const safeNodeId = asText(nodeId, "").trim();
      if (!safeNodeId) {
        return;
      }
      if (collapseState.delete(safeNodeId)) {
        changed = true;
      }
    };

    subject.chapters.forEach((chapter) => {
      const chapterId = asText(chapter?.id, "").trim();
      if (!chapterId) {
        return;
      }
      const chapterNameKey = normalizeLookupKey(chapter?.name);
      const treeNodes = Array.isArray(chapter?.tree) ? chapter.tree : [];
      let chapterMatched = chapterNameKey.includes(query);

      const visitNode = (node, index, parentToken, ancestorIds) => {
        if (!node || typeof node !== "object") {
          return false;
        }
        const nodeId = resolveTreeNodeRendererId(node, index, parentToken);
        const nameKey = normalizeLookupKey(node?.name ?? node?.title ?? node?.label);
        const children = resolveTreeChildrenForMapNode(node);
        const nextAncestors = ancestorIds.concat(nodeId);
        let matched = nameKey.includes(query);

        children.forEach((childNode, childIndex) => {
          if (visitNode(childNode, childIndex, `${nodeId}-`, nextAncestors)) {
            matched = true;
          }
        });

        if (matched) {
          chapterMatched = true;
          ancestorIds.forEach((ancestorId) => openNode(ancestorId));
          openNode(nodeId);
        }
        return matched;
      };

      treeNodes.forEach((treeNode, treeIndex) => {
        visitNode(treeNode, treeIndex, `${chapterId}-`, [chapterId]);
      });

      if (chapterMatched) {
        openNode(chapterId);
      }
    });

    if (changed) {
      debouncedPersistLastSession();
    }
    return changed;
  }

  function handleChapterMapSearchInput(actionTarget) {
    if (!(actionTarget instanceof HTMLInputElement)) {
      return;
    }

    const subjectId = asText(actionTarget.dataset.subjectId, state.view.subjectId || "");
    if (!subjectId) {
      return;
    }

    const uiState = getChapterMapUiState(subjectId);
    uiState.query = asText(actionTarget.value, "").trim();
    if (expandChapterTreeBranchesForSearch(subjectId, uiState.query)) {
      render();
    }
    debouncedChapterMapSearchUpdate(subjectId, uiState.query);
  }

  function applyChapterMapSearch(subjectId, rawQuery = "") {
    const safeSubjectId = asText(subjectId, "").trim();
    if (!safeSubjectId) {
      return;
    }

    if (!activeChapterMapView || activeChapterMapView.subjectId !== safeSubjectId) {
      return;
    }
    if (activeChapterMapView.rootCanvas instanceof HTMLElement && !activeChapterMapView.rootCanvas.isConnected) {
      activeChapterMapView = null;
      return;
    }

    const query = normalizeLookupKey(rawQuery);

    if (activeChapterMapView.mode === "fallback") {
      const list = activeChapterMapView.listItems || [];
      let firstMatch = null;

      list.forEach((item) => {
        const key = asText(item.dataset.searchKey, "");
        const matched = !query || key.includes(query);
        item.hidden = !matched;
        item.classList.toggle("is-search-match", !!query && matched);
        if (!firstMatch && matched) {
          firstMatch = item;
        }
      });

      if (firstMatch instanceof HTMLElement) {
        firstMatch.scrollIntoView({
          block: "nearest",
          behavior: query ? getOptimizedScrollBehavior("smooth") : "auto"
        });
      }

      const legendItems = activeChapterMapView.legendItems || [];
      legendItems.forEach((item) => {
        const key = asText(item.dataset.searchKey, "");
        const matched = !!query && key.includes(query);
        item.classList.toggle("is-search-match", matched);
      });
      return;
    }

    const nodes = activeChapterMapView.nodes || [];
    const matches = [];
    nodes.forEach((node) => {
      const matched = !query || node.searchKey.includes(query);
      node.element?.classList.toggle("is-search-match", !!query && matched);
      node.link?.classList.toggle("is-search-match", !!query && matched);
      (node.pathLinks || []).forEach((segment) => {
        segment.classList.toggle("is-search-match", !!query && matched);
      });
      node.legend?.classList.toggle("is-search-match", !!query && matched);
      if (query && matched) {
        matches.push(node);
      }
    });

    if (matches.length) {
      if (typeof activeChapterMapView.focusTreeNode === "function" && matches[0].nodeId) {
        activeChapterMapView.focusTreeNode(matches[0].nodeId, { center: true, animated: true, source: "search" });
      } else if (typeof activeChapterMapView.focusNode === "function" && matches[0].chapter?.id) {
        activeChapterMapView.focusNode(matches[0].chapter.id, { center: true, animated: true, source: "search" });
      } else {
        centerChapterMapOnNode(matches[0].chapter?.id || "", true);
      }
      if (matches[0].legend instanceof HTMLElement) {
        matches[0].legend.scrollIntoView({
          block: "nearest",
          behavior: getOptimizedScrollBehavior("smooth")
        });
      }
    }
  }

  async function mountChapterMapVisualization(canvas, subject, chapter, chapters, uiState) {
    if (!(canvas instanceof HTMLElement)) {
      return;
    }
    const activeChapterId = asText(chapter?.id, "").trim();

    const renderToken = createId("map-render");
    canvas.dataset.renderToken = renderToken;
    canvas.replaceChildren(createLoader("در حال آماده‌سازی درخت فصل‌ها..."));

    const d3Ready = await ensureD3Ready();
    const inChapterMapTab =
      state.view.level === 3 &&
      state.view.tab === "chapter-map" &&
      state.view.subjectId === subject.id;
    const inLessonDashboard = state.view.level === 2 && state.view.subjectId === subject.id;
    const isStillValid =
      canvas.isConnected &&
      canvas.dataset.renderToken === renderToken &&
      (inChapterMapTab || inLessonDashboard);

    if (!isStillValid) {
      return;
    }

    if (!d3Ready || !window.d3) {
      renderChapterMapFallback(canvas, subject, chapters, activeChapterId, "موتور نمودار در دسترس نبود. نمای فهرست فعال شد.");
      applyChapterMapSearch(subject.id, uiState.query);
      return;
    }

    try {
      renderChapterMapWithD3(canvas, subject, chapters, activeChapterId, { uiState });
      applyChapterMapSearch(subject.id, uiState.query);
    } catch (error) {
      console.error(error);
      renderChapterMapFallback(canvas, subject, chapters, activeChapterId, "رندر درختی انجام نشد. نمای فهرست فعال شد.");
      applyChapterMapSearch(subject.id, uiState.query);
    }
  }

  function renderChapterMapFallback(canvas, subject, chapters, activeChapterId, note) {
    const wrapper = document.createElement("section");
    wrapper.className = "chapter-map-fallback";
    wrapper.setAttribute("data-view", "list");

    const noteBox = document.createElement("p");
    noteBox.className = "chapter-map-fallback-note";
    noteBox.textContent = note;
    wrapper.append(noteBox);

    const list = document.createElement("div");
    list.className = "chapter-map-fallback-list";
    list.setAttribute("role", "tree");
    list.setAttribute("aria-label", `فهرست فصل‌های درس ${subject.name}`);

    chapters.forEach((chapter, index) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = `chapter-map-fallback-item${chapter.id === activeChapterId ? " is-current" : ""}`;
      item.dataset.action = "map-open-chapter";
      item.dataset.subjectId = subject.id;
      item.dataset.chapterId = chapter.id;
      item.dataset.searchKey = normalizeLookupKey(chapter.name);
      item.setAttribute("role", "treeitem");
      item.setAttribute("aria-level", "2");

      const treeNodeCount = getChapterTreeNodeCount(chapter);
      const treeLabel = treeNodeCount > 0 ? `${treeNodeCount} گره` : "tree ثبت نشده";
      item.setAttribute(
        "aria-label",
        `فصل ${index + 1}: ${chapter.name}، ${treeLabel}. رفتن به بانک سوالات`
      );

      const title = document.createElement("strong");
      title.textContent = `${index + 1}. ${chapter.name}`;

      const meta = document.createElement("span");
      meta.className = "chapter-map-fallback-meta";
      meta.textContent = treeLabel;

      item.append(title, meta);
      list.append(item);
    });

    wrapper.append(list);
    canvas.replaceChildren(wrapper);
    canvas.dataset.renderWidth = String(Math.round(canvas.clientWidth || 0));

    const legendItems = Array.from(
      canvas
        .closest(".chapter-map-layout")
        ?.querySelectorAll('.chapter-map-legend-item[data-subject-id]')
        || []
    );

    activeChapterMapView = {
      mode: "fallback",
      subjectId: subject.id,
      rootCanvas: canvas,
      listItems: Array.from(list.querySelectorAll("[data-search-key]")),
      legendItems
    };
  }

  function renderChapterMapWithD3(canvas, subject, chapters, activeChapterId = "", options = {}) {
    const d3 = window.d3;
    if (!d3 || typeof d3.select !== "function") {
      throw new Error("D3 is unavailable.");
    }

    const externalTreeRenderer = window.chapterTreeRenderer;
    if (!externalTreeRenderer || typeof externalTreeRenderer.render !== "function") {
      throw new Error("Tree renderer is unavailable.");
    }

    const legendItems = Array.from(
      canvas
        .closest(".chapter-map-layout")
        ?.querySelectorAll('.chapter-map-legend-item[data-subject-id]')
        || []
    );

    const renderedView = externalTreeRenderer.render({
      canvas,
      d3,
      subject,
      chapters,
      activeChapterId: asText(activeChapterId, ""),
      legendItems,
      treeOnlyMode: true,
      mobileViewport: isMobileViewportActive(),
      createId,
      asText,
      splitLabelForMap,
      normalizeLookupKey,
      getChapterNeedsReviewCount,
      clampNumber,
      lowPowerMode: isMobileViewportActive() || isMobilePerformanceLiteActive() || isDesktopPerformanceLiteActive(),
      fxEnabled: options?.uiState?.fxEnabled !== false,
      collapseState: getChapterTreeCollapseState(subject.id),
      onCollapseStateChanged: () => {
        debouncedPersistLastSession();
      },
      onNavigate: (chapterId) => {
        navigateToChapter(subject.id, chapterId, { tab: "bank" });
      },
      onRerender: (nextActiveChapterId = "") => {
        const safeActive = asText(nextActiveChapterId, "").trim() || asText(state.view.chapterId, "").trim() || activeChapterId;
        const latestUiState = getChapterMapUiState(subject.id);
        renderChapterMapWithD3(canvas, subject, chapters, safeActive, { uiState: latestUiState });
        const uiState = getChapterMapUiState(subject.id);
        applyChapterMapSearch(subject.id, uiState.query);
      }
    });

    if (!renderedView || typeof renderedView !== "object") {
      throw new Error("Tree renderer failed.");
    }

    activeChapterMapView = renderedView;
  }

  function centerChapterMapOnNode(chapterId, animated = true, scale = 1.18) {
    if (!activeChapterMapView) {
      return;
    }

    if (typeof activeChapterMapView.focusNode === "function") {
      activeChapterMapView.focusNode(chapterId, { center: true, animated, scale, source: "center" });
      return;
    }

    if (activeChapterMapView.mode !== "orbit") {
      return;
    }

    const node = activeChapterMapView.nodes.find((item) => item.chapter.id === chapterId);
    if (!node) {
      return;
    }

    const safeScale = isMobileViewportActive() ? Math.min(scale, 1.06) : scale;
    const d3 = activeChapterMapView.d3;
    const transform = d3.zoomIdentity
      .translate(activeChapterMapView.width / 2 - node.x * safeScale, activeChapterMapView.height / 2 - node.y * safeScale)
      .scale(safeScale);

    if (animated && !isMobileViewportActive()) {
      activeChapterMapView.svg.transition().duration(320).call(activeChapterMapView.zoom.transform, transform);
    } else {
      activeChapterMapView.svg.call(activeChapterMapView.zoom.transform, transform);
    }
  }

  function resetChapterMapView() {
    if (!activeChapterMapView || !(activeChapterMapView.svg && activeChapterMapView.zoom && activeChapterMapView.identity)) {
      return;
    }

    if (isMobileViewportActive() || activeChapterMapView.mode === "tree") {
      activeChapterMapView.svg.call(activeChapterMapView.zoom.transform, activeChapterMapView.identity);
      return;
    }

    activeChapterMapView.svg.transition().duration(240).call(activeChapterMapView.zoom.transform, activeChapterMapView.identity);
  }

  function fitChapterMapView() {
    if (!activeChapterMapView || !(activeChapterMapView.svg && activeChapterMapView.zoom)) {
      return;
    }

    const fitTransform = activeChapterMapView.fitTransform || activeChapterMapView.identity;
    if (!fitTransform) {
      return;
    }

    if (isMobileViewportActive()) {
      activeChapterMapView.svg.call(activeChapterMapView.zoom.transform, fitTransform);
      return;
    }

    activeChapterMapView.svg.transition().duration(240).call(activeChapterMapView.zoom.transform, fitTransform);
  }

  function toggleChapterMapFx(actionTarget) {
    const subjectId = asText(actionTarget.dataset.subjectId, state.view.subjectId || "");
    if (!subjectId) {
      return;
    }

    if (isMobileViewportActive()) {
      setStatus("افکت متحرک نقشه در حالت موبایل غیرفعال است.", "ok");
      return;
    }

    const uiState = getChapterMapUiState(subjectId);
    if (uiState.simpleView) {
      setStatus("در نمای فهرست، افکت متحرک فعال نمی‌شود.", "ok");
      return;
    }
    uiState.fxEnabled = !uiState.fxEnabled;

    const layout = refs.levelContainer.querySelector(".chapter-map-layout");
    if (layout instanceof HTMLElement) {
      layout.classList.toggle("map-fx-off", !uiState.fxEnabled);
    }

    if (actionTarget instanceof HTMLButtonElement) {
      actionTarget.classList.toggle("is-active", uiState.fxEnabled);
      actionTarget.setAttribute("aria-pressed", uiState.fxEnabled ? "true" : "false");
      actionTarget.replaceChildren(createLessonIcon("spark", 12), document.createTextNode(uiState.fxEnabled ? "FX روشن" : "FX خاموش"));
    }
  }

  function toggleChapterMapSimple(actionTarget) {
    const subjectId = asText(actionTarget?.dataset?.subjectId, state.view.subjectId || "");
    if (!subjectId) {
      return;
    }
    const uiState = getChapterMapUiState(subjectId);
    uiState.simpleView = false;
    if (state.view.level === 3 && state.view.tab === "chapter-map" && state.view.subjectId === subjectId) {
      render();
    }
    setStatus("نمای قدیمی نمودار حذف شد و فقط ساختار جدید درختی فعال است.", "ok");
  }

  function findSubjectByIdSafe(subjectId) {
    const safeSubjectId = asText(subjectId, "").trim();
    if (!safeSubjectId) {
      return null;
    }
    return state.subjects.find((subject) => asText(subject?.id, "").trim() === safeSubjectId) || null;
  }

  function ensureChapterTreeArray(chapter) {
    if (!chapter || typeof chapter !== "object") {
      return [];
    }
    if (Array.isArray(chapter.tree)) {
      return chapter.tree;
    }
    chapter.tree = [];
    return chapter.tree;
  }

  function ensureTreeNodeChildrenArray(node) {
    if (!node || typeof node !== "object") {
      return [];
    }
    if (Array.isArray(node.children)) {
      return node.children;
    }
    if (Array.isArray(node.tree)) {
      node.children = node.tree;
      delete node.tree;
      return node.children;
    }
    node.children = [];
    return node.children;
  }

  function findTreeNodeByRendererIdInChapter(chapter, targetNodeId) {
    const safeTarget = asText(targetNodeId, "").trim();
    const chapterId = asText(chapter?.id, "").trim();
    if (!safeTarget || !chapterId) {
      return null;
    }
    if (safeTarget === chapterId) {
      return {
        isChapterRoot: true,
        chapter,
        chapterId,
        nodeId: chapterId,
        node: null,
        parentArray: null,
        index: -1,
        parentId: ""
      };
    }

    const visit = (nodes, parentToken, parentId, depth) => {
      if (!Array.isArray(nodes)) {
        return null;
      }
      for (let index = 0; index < nodes.length; index += 1) {
        const current = nodes[index];
        if (!current || typeof current !== "object") {
          continue;
        }
        const nodeId = resolveTreeNodeRendererId(current, index, parentToken);
        if (nodeId === safeTarget) {
          return {
            isChapterRoot: false,
            chapter,
            chapterId,
            nodeId,
            node: current,
            parentArray: nodes,
            index,
            parentId,
            depth,
            parentToken
          };
        }
        const children = ensureTreeNodeChildrenArray(current);
        const nested = visit(children, `${nodeId}-`, nodeId, depth + 1);
        if (nested) {
          return nested;
        }
      }
      return null;
    };

    const rootNodes = ensureChapterTreeArray(chapter);
    return visit(rootNodes, `${chapterId}-`, chapterId, 2);
  }

  function collectTreeNodeIdsForCollapse(node, index, parentToken) {
    if (!node || typeof node !== "object") {
      return [];
    }
    const nodeId = resolveTreeNodeRendererId(node, index, parentToken);
    const ids = [nodeId];
    const children = resolveTreeChildrenForMapNode(node);
    children.forEach((childNode, childIndex) => {
      ids.push(...collectTreeNodeIdsForCollapse(childNode, childIndex, `${nodeId}-`));
    });
    return ids;
  }

  function resolveActiveTreeNodeSelection() {
    if (!activeChapterMapView || activeChapterMapView.mode !== "tree") {
      setStatus("ابتدا نمودار درختی را باز کن.", "error");
      return null;
    }
    const subject = findSubjectByIdSafe(activeChapterMapView.subjectId);
    if (!subject) {
      setStatus("درس فعال برای ویرایش شاخه پیدا نشد.", "error");
      return null;
    }

    let selectedNode =
      typeof activeChapterMapView.getSelectedNode === "function" ? activeChapterMapView.getSelectedNode() : null;
    if (!selectedNode && Array.isArray(activeChapterMapView.nodes) && activeChapterMapView.nodes.length) {
      selectedNode =
        activeChapterMapView.nodes.find((node) => asText(node?.chapterId, "") === asText(state.view.chapterId, "")) ||
        activeChapterMapView.nodes[0];
    }
    if (!selectedNode || !selectedNode.nodeId) {
      setStatus("یک شاخه از نمودار را انتخاب کن.", "error");
      return null;
    }

    if (typeof activeChapterMapView.selectTreeNode === "function") {
      activeChapterMapView.selectTreeNode(selectedNode.nodeId, { center: false });
    }

    return { subject, selectedNode };
  }

  function requestTreeNodeLabelInput(promptTitle, initialValue = "") {
    const value = window.prompt(promptTitle, asText(initialValue, "").trim());
    if (value === null) {
      return "";
    }
    return asText(value, "").trim();
  }

  function handleChapterMapAddNode() {
    const context = resolveActiveTreeNodeSelection();
    if (!context) {
      return;
    }

    const { subject, selectedNode } = context;
    const nodeLabel = requestTreeNodeLabelInput("نام شاخه جدید را وارد کن:");
    if (!nodeLabel) {
      return;
    }

    let targetChapter = null;
    let parentNode = null;
    let parentNodeId = "";

    (subject.chapters || []).some((chapter) => {
      const match = findTreeNodeByRendererIdInChapter(chapter, selectedNode.nodeId);
      if (!match) {
        return false;
      }
      targetChapter = chapter;
      parentNode = match.node;
      parentNodeId = match.nodeId;
      if (match.isChapterRoot) {
        parentNode = null;
      }
      return true;
    });

    if (!targetChapter) {
      setStatus("گره انتخابی برای افزودن شاخه پیدا نشد.", "error");
      return;
    }

    const targetChildren = parentNode ? ensureTreeNodeChildrenArray(parentNode) : ensureChapterTreeArray(targetChapter);
    targetChildren.push({
      id: createId("tn"),
      name: nodeLabel,
      children: []
    });

    const collapseState = getChapterTreeCollapseState(subject.id);
    collapseState.delete(parentNodeId);
    collapseState.delete(asText(targetChapter?.id, "").trim());

    persistSubjects();
    debouncedPersistLastSession();
    render();
    setStatus(`شاخه «${nodeLabel}» اضافه شد.`, "ok");
  }

  function handleChapterMapRenameNode() {
    const context = resolveActiveTreeNodeSelection();
    if (!context) {
      return;
    }
    const { subject, selectedNode } = context;

    let targetMatch = null;
    (subject.chapters || []).some((chapter) => {
      const match = findTreeNodeByRendererIdInChapter(chapter, selectedNode.nodeId);
      if (!match || match.isChapterRoot) {
        return false;
      }
      targetMatch = match;
      return true;
    });

    if (!targetMatch || !targetMatch.node) {
      setStatus("برای تغییر نام، یک شاخه داخلی را انتخاب کن.", "error");
      return;
    }

    const nextLabel = requestTreeNodeLabelInput("نام جدید شاخه را وارد کن:", asText(targetMatch.node?.name, ""));
    if (!nextLabel) {
      return;
    }

    targetMatch.node.name = nextLabel;
    persistSubjects();
    debouncedPersistLastSession();
    render();
    setStatus("نام شاخه به‌روزرسانی شد.", "ok");
  }

  function handleChapterMapDeleteNode() {
    const context = resolveActiveTreeNodeSelection();
    if (!context) {
      return;
    }
    const { subject, selectedNode } = context;

    let targetMatch = null;
    (subject.chapters || []).some((chapter) => {
      const match = findTreeNodeByRendererIdInChapter(chapter, selectedNode.nodeId);
      if (!match || match.isChapterRoot) {
        return false;
      }
      targetMatch = match;
      return true;
    });

    if (!targetMatch || !targetMatch.node || !Array.isArray(targetMatch.parentArray)) {
      setStatus("برای حذف، یک شاخه داخلی را انتخاب کن.", "error");
      return;
    }

    const targetLabel = asText(targetMatch.node?.name, "بدون نام");
    if (!window.confirm(`شاخه «${targetLabel}» حذف شود؟`)) {
      return;
    }

    const collapseState = getChapterTreeCollapseState(subject.id);
    const removedNodeIds = collectTreeNodeIdsForCollapse(targetMatch.node, targetMatch.index, targetMatch.parentToken);
    removedNodeIds.forEach((nodeId) => {
      collapseState.delete(asText(nodeId, "").trim());
    });

    targetMatch.parentArray.splice(targetMatch.index, 1);

    persistSubjects();
    debouncedPersistLastSession();
    render();
    setStatus("شاخه انتخابی حذف شد.", "ok");
  }

  async function exportChapterMapToPng(actionTarget) {
    const panel = actionTarget.closest(".chapter-map-panel") || refs.levelContainer;
    if (!(panel instanceof HTMLElement)) {
      return;
    }

    const svg = panel.querySelector(".chapter-map-svg");
    if (!(svg instanceof SVGElement)) {
      setStatus("برای خروجی، ابتدا نمودار درختی را بارگذاری کنید.", "error");
      return;
    }

    try {
      const viewBox = svg.viewBox?.baseVal;
      const width = Math.max(640, Math.round(viewBox?.width || svg.clientWidth || 640));
      const height = Math.max(420, Math.round(viewBox?.height || svg.clientHeight || 420));

      const serialized = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([serialized], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      const image = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Canvas context is unavailable.");
      }

      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--bg-main").trim() || "#0f141c";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(image, 0, 0, width, height);
      URL.revokeObjectURL(url);

      const pngBlob = await new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), "image/png");
      });

      if (!(pngBlob instanceof Blob)) {
        throw new Error("PNG export failed.");
      }

      const subject = getActiveSubject();
      const fileNameBase = normalizeLookupKey(subject?.name || "chapter-map").replace(/\s+/g, "-") || "chapter-map";
      const downloadUrl = URL.createObjectURL(pngBlob);
      const anchor = document.createElement("a");
      anchor.href = downloadUrl;
      anchor.download = `${fileNameBase}-chapter-tree.png`;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1200);

      setStatus("خروجی PNG نمودار ذخیره شد.", "ok");
    } catch (error) {
      console.error(error);
      setStatus("خروجی PNG انجام نشد.", "error");
    }
  }

  async function ensureD3Ready() {
    if (window.d3 && typeof window.d3.select === "function") {
      state.d3.ready = true;
      state.d3.loadingPromise = null;
      return true;
    }

    if (state.d3.loadingPromise) {
      return state.d3.loadingPromise;
    }

    state.d3.loadingPromise = new Promise((resolve) => {
      const existing = document.querySelector('script[data-lib="d3-v7"]');
      if (existing instanceof HTMLScriptElement) {
        const onLoad = () => {
          const ready = !!(window.d3 && typeof window.d3.select === "function");
          state.d3.ready = ready;
          state.d3.loadingPromise = null;
          resolve(ready);
        };
        existing.addEventListener("load", onLoad, { once: true });
        existing.addEventListener(
          "error",
          () => {
            state.d3.ready = false;
            state.d3.loadingPromise = null;
            resolve(false);
          },
          { once: true }
        );
        return;
      }

      const script = document.createElement("script");
      script.src = D3_CDN_URL;
      script.async = true;
      script.dataset.lib = "d3-v7";
      script.addEventListener(
        "load",
        () => {
          const ready = !!(window.d3 && typeof window.d3.select === "function");
          state.d3.ready = ready;
          state.d3.loadingPromise = null;
          resolve(ready);
        },
        { once: true }
      );
      script.addEventListener(
        "error",
        () => {
          state.d3.ready = false;
          state.d3.loadingPromise = null;
          resolve(false);
        },
        { once: true }
      );
      document.head.append(script);
    });

    return state.d3.loadingPromise;
  }

  function splitLabelForMap(text, maxChars = 18) {
    const safe = asText(text, "").replace(/\s+/g, " ").trim();
    if (!safe) {
      return "-";
    }
    if (safe.length <= maxChars) {
      return safe;
    }
    const trimmed = safe.slice(0, Math.max(1, maxChars - 1)).trim();
    return `${trimmed}…`;
  }

  function getOrderedChapters(subject) {
    if (!subject || !Array.isArray(subject.chapters)) {
      return [];
    }

    const sorted = subject.chapters
      .map((chapter, index) => ({
        chapter,
        index,
        order: Number.isFinite(Number(chapter?.order)) ? Number(chapter.order) : index + 1
      }))
      .sort((a, b) => {
        if (a.order === b.order) {
          return a.index - b.index;
        }
        return a.order - b.order;
      })
      .map((entry) => entry.chapter);

    subject.chapters = sorted;

    normalizeSubjectChapterOrder(subject);
    return subject.chapters;
  }

  function normalizeSubjectChapterOrder(subject) {
    if (!subject || !Array.isArray(subject.chapters)) {
      return;
    }

    subject.chapters.forEach((chapter, index) => {
      if (!chapter || typeof chapter !== "object") {
        return;
      }
      chapter.order = index + 1;
    });
  }

  function getChapterNeedsReviewCount(chapter, subjectId = "", chapterId = "") {
    const questions = Array.isArray(chapter?.questions) ? chapter.questions : [];
    if (!questions.length) {
      return 0;
    }

    const safeSubjectId = asText(subjectId, "").trim();
    const safeChapterId = asText(chapterId, "").trim();
    if (safeSubjectId && safeChapterId) {
      const counts = getChapterReviewStatusCounts(safeSubjectId, safeChapterId, questions);
      return counts.review;
    }

    return questions.reduce((count, question) => count + (resolveNeedsReviewFlag(question) ? 1 : 0), 0);
  }

  function createQuestionCard({
    question,
    order,
    subjectId,
    chapterId,
    withDisclosures,
    selectable = false,
    selected = false,
    showSolveTimer = false,
    timerSnapshot = null,
    showTopic = false,
    withQuestionDelete = false,
    withSolvedToggle = false,
    showSolvedState = true,
    staggerIndex = 0,
    enableStagger = true
  }) {
    const card = document.createElement("article");
    card.className = `question-card deletable-node${enableStagger ? " stagger-item" : ""}${
      isDesktopPerformanceLiteActive() ? " perf-lite-card" : ""
    }`;
    card.tabIndex = 0;
    card.dataset.subjectId = subjectId;
    card.dataset.chapterId = chapterId;
    card.dataset.questionId = question.id;
    if (enableStagger) {
      card.style.setProperty("--stagger-index", String(staggerIndex));
    }

    const head = document.createElement("header");
    head.className = "question-head";

    const headLead = document.createElement("div");
    headLead.className = "question-head-main";

    const index = document.createElement("span");
    index.className = "question-index";
    index.textContent = `سوال ${order}`;

    if (selectable) {
      const checkLabel = createQuestionSelectControl({
        subjectId,
        chapterId,
        questionId: question.id,
        checked: !!selected
      });
      headLead.append(checkLabel);
    }

    headLead.append(index);

    if (showSolvedState) {
      headLead.append(createQuestionSolvedStateBadge(question));
    }

    headLead.append(createQuestionReviewStateBadge(subjectId, chapterId, question.id));

    let topicChip = null;
    if (showTopic) {
      topicChip = createQuestionTopicInlineChip(question);
    }

    const headTail = document.createElement("div");
    headTail.className = "question-head-tools";

    const stars = document.createElement("span");
    stars.className = "stars";
    stars.title = `سطح سختی ${question.difficulty} از 5`;
    stars.textContent = renderDifficultyStars(question.difficulty);

    headTail.append(stars);

    if (withSolvedToggle) {
      headTail.append(createQuestionSolvedToggleButton(subjectId, chapterId, question));
    }

    if (withQuestionDelete) {
      const removeButton = createDeleteIconButton("request-delete-question", {
        subjectId,
        chapterId,
        questionId: question.id
      });
      headTail.append(removeButton);
    }

    head.append(headLead, headTail);
    if (topicChip) {
      const methodRow = document.createElement("div");
      methodRow.className = "question-head-method-row";
      methodRow.append(topicChip);
      head.append(methodRow);
    }

    const body = document.createElement("div");
    body.className = "question-body";
    if (isMathOnlyRichText(question.question)) {
      body.classList.add("question-body-math-only");
    }
    const questionAssets = normalizeQuestionAssetPayload(question);
    let renderedByAssetPlugin = false;
    if (
      questionPdfAssetPlugin &&
      typeof questionPdfAssetPlugin.renderQuestionBodyWithAssets === "function" &&
      questionAssets.length
    ) {
      try {
        questionPdfAssetPlugin.renderQuestionBodyWithAssets({
          bodyElement: body,
          question: {
            ...question,
            assets: questionAssets
          },
          buildRichTextFragment
        });
        renderedByAssetPlugin = true;
      } catch (error) {
        console.error("Question asset render failed. Fallback to text body.", error);
      }
    }
    if (!renderedByAssetPlugin) {
      body.append(buildRichTextFragment(question.question));
    }

    const cardSections = [head];

    if (showSolveTimer) {
      cardSections.push(
        createQuestionSolveTimerStrip({
          subjectId,
          chapterId,
          questionId: question.id,
          snapshot: timerSnapshot
        })
      );
    }

    cardSections.push(body);
    cardSections.push(createQuestionReviewControls(subjectId, chapterId, question.id));
    card.append(...cardSections);

    if (!withDisclosures) {
      syncQuestionReviewUiForCard(card);
      return card;
    }

    const token = rememberVisibleQuestion(subjectId, chapterId, question);

    const tools = document.createElement("div");
    tools.className = "question-tools";

    const hintButton = document.createElement("button");
    hintButton.type = "button";
    hintButton.className = "tool-btn tool-btn-hint";
    hintButton.dataset.action = "toggle-hint";
    hintButton.dataset.kind = "hint";
    hintButton.dataset.token = token;
    hintButton.setAttribute("aria-expanded", "false");
    hintButton.textContent = "نمایش راهنما";

    const solutionButton = document.createElement("button");
    solutionButton.type = "button";
    solutionButton.className = "tool-btn tool-btn-solution";
    solutionButton.dataset.action = "toggle-solution";
    solutionButton.dataset.kind = "solution";
    solutionButton.dataset.token = token;
    solutionButton.setAttribute("aria-expanded", "false");
    solutionButton.textContent = "نمایش حل";

    tools.append(hintButton, solutionButton);

    const hintPanel = document.createElement("section");
    hintPanel.className = "disclosure disclosure-hint";
    hintPanel.hidden = true;
    hintPanel.dataset.kind = "hint";
    hintPanel.dataset.token = token;

    const solutionPanel = document.createElement("section");
    solutionPanel.className = "disclosure disclosure-solution";
    solutionPanel.hidden = true;
    solutionPanel.dataset.kind = "solution";
    solutionPanel.dataset.token = token;

    card.append(tools, hintPanel, solutionPanel);
    syncQuestionReviewUiForCard(card);
    return card;
  }

  function createQuestionSolvedStateBadge(question) {
    const solved = resolveQuestionSolvedFlag(question);
    const badge = document.createElement("span");
    badge.className = `question-solved-badge${solved ? " is-solved" : " is-unsolved"}`;
    badge.title = solved ? "حل شده" : "حل نشده";
    badge.setAttribute("aria-label", solved ? "حل شده" : "حل نشده");
    badge.innerHTML = solved
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M8 12.5l2.7 2.7L16 9.8"></path></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M8 12h8"></path></svg>';
    return badge;
  }

  function createQuestionReviewStateBadge(subjectId, chapterId, questionId) {
    const entry = getQuestionReviewEntry(subjectId, chapterId, questionId);
    const status = normalizeReviewStatus(entry?.status || "");
    const label = getReviewStatusLabel(status);

    const badge = document.createElement("span");
    badge.className = "question-review-badge";
    badge.dataset.role = "question-review-badge";
    badge.hidden = !status;
    badge.textContent = label;
    badge.setAttribute("aria-label", status ? `وضعیت مرور: ${label}` : "بدون وضعیت مرور");
    badge.title = status ? `وضعیت مرور: ${label}` : "بدون وضعیت مرور";

    if (status) {
      badge.classList.add(`is-${status}`);
    }

    return badge;
  }

  function createQuestionReviewControls(subjectId, chapterId, questionId) {
    const entry = getQuestionReviewEntry(subjectId, chapterId, questionId);
    const status = normalizeReviewStatus(entry?.status || "");
    const hasStatus = !!status;
    const noteText = asText(entry?.note, "");

    const wrap = document.createElement("section");
    wrap.className = "question-review-tools";

    const row = document.createElement("div");
    row.className = "question-review-row";

    const title = document.createElement("span");
    title.className = "question-review-title";
    title.textContent = "وضعیت مرور";

    const group = document.createElement("div");
    group.className = "question-review-group";
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", "کنترل وضعیت مرور سوال");

    const statusOptions = [
      { status: "review", label: "نیاز به مرور", ariaLabel: "ثبت به عنوان نیاز به مرور مجدد" },
      { status: "key", label: "نکته کلیدی", ariaLabel: "ثبت به عنوان نکته کلیدی" },
      { status: "mastered", label: "کاملا مسلط", ariaLabel: "ثبت به عنوان کاملا مسلط" }
    ];

    statusOptions.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `question-review-btn${status === option.status ? " is-active" : ""}`;
      button.dataset.action = "question-review-status";
      button.dataset.subjectId = subjectId;
      button.dataset.chapterId = chapterId;
      button.dataset.questionId = questionId;
      button.dataset.status = option.status;
      button.setAttribute("aria-pressed", status === option.status ? "true" : "false");
      button.setAttribute("aria-label", option.ariaLabel);
      button.textContent = option.label;
      group.append(button);
    });

    const noteToggle = document.createElement("button");
    noteToggle.type = "button";
    noteToggle.className = `question-review-note-toggle${noteText ? " is-active" : ""}`;
    noteToggle.dataset.action = "toggle-question-review-note";
    noteToggle.dataset.subjectId = subjectId;
    noteToggle.dataset.chapterId = chapterId;
    noteToggle.dataset.questionId = questionId;
    noteToggle.disabled = !hasStatus;
    noteToggle.setAttribute("aria-expanded", noteText ? "true" : "false");
    noteToggle.setAttribute("aria-label", "باز کردن بخش یادداشت مرور");
    noteToggle.textContent = "یادداشت";

    row.append(title, group, noteToggle);
    wrap.append(row);
    if (noteText) {
      wrap.append(
        createQuestionReviewNotePanel({
          subjectId,
          chapterId,
          questionId,
          noteText,
          disabled: !hasStatus,
          open: true
        })
      );
    }
    return wrap;
  }

  function createQuestionReviewNotePanel({
    subjectId,
    chapterId,
    questionId,
    noteText = "",
    disabled = false,
    open = false
  }) {
    const safeText = asText(noteText, "");
    const panel = document.createElement("div");
    panel.className = "question-review-note";
    panel.hidden = !open;
    panel.classList.toggle("is-open", !!open);

    const noteInput = document.createElement("textarea");
    noteInput.className = "question-review-note-input";
    noteInput.rows = 2;
    noteInput.maxLength = REVIEW_NOTE_MAX_LENGTH;
    noteInput.dataset.action = "question-review-note-input";
    noteInput.dataset.subjectId = subjectId;
    noteInput.dataset.chapterId = chapterId;
    noteInput.dataset.questionId = questionId;
    noteInput.disabled = !!disabled;
    noteInput.placeholder = "یادداشت کوتاه (اختیاری)";
    noteInput.value = safeText;

    const noteMeta = document.createElement("div");
    noteMeta.className = "question-review-note-meta";

    const noteStatus = document.createElement("span");
    noteStatus.className = "question-review-note-status";
    noteStatus.dataset.role = "question-review-note-status";
    noteStatus.dataset.subjectId = subjectId;
    noteStatus.dataset.chapterId = chapterId;
    noteStatus.dataset.questionId = questionId;
    noteStatus.dataset.state = "idle";
    noteStatus.textContent = "";

    const noteChars = document.createElement("span");
    noteChars.className = "question-review-note-chars";
    noteChars.dataset.role = "question-review-note-chars";
    noteChars.dataset.subjectId = subjectId;
    noteChars.dataset.chapterId = chapterId;
    noteChars.dataset.questionId = questionId;
    noteChars.textContent = `${safeText.length} / ${REVIEW_NOTE_MAX_LENGTH}`;

    noteMeta.append(noteStatus, noteChars);
    panel.append(noteInput, noteMeta);
    return panel;
  }

  function createQuestionSolvedToggleButton(subjectId, chapterId, question) {
    const solved = resolveQuestionSolvedFlag(question);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `question-solved-toggle${solved ? " is-solved" : ""}`;
    button.dataset.action = "toggle-question-solved";
    button.dataset.subjectId = subjectId;
    button.dataset.chapterId = chapterId;
    button.dataset.questionId = question.id;
    button.setAttribute("aria-pressed", solved ? "true" : "false");
    button.title = solved ? "ثبت به عنوان حل نشده" : "ثبت به عنوان حل شده";
    button.innerHTML = solved
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 12.5l3 3L17 8.5"></path></svg><span>حل شده</span>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 12h10"></path></svg><span>حل نشده</span>';
    return button;
  }

  function createQuestionTopicInlineChip(question) {
    const topicMeta = resolveQuestionTopicMeta(question);
    const chip = document.createElement("span");
    chip.className = "question-topic-chip";
    chip.title = topicMeta.displayLabel;
    chip.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16"></path><path d="M6 12h12"></path><path d="M8 17h8"></path></svg>';

    const text = document.createElement("span");
    text.className = "question-topic-chip-text";
    text.textContent = topicMeta.displayLabel;
    chip.append(text);

    return chip;
  }

  function createQuestionSolveTimerStrip({ subjectId, chapterId, questionId, snapshot }) {
    const safeSnapshot = snapshot && typeof snapshot === "object" ? snapshot : { elapsedMs: 0, running: false };
    const elapsedMs = Number.isFinite(Number(safeSnapshot.elapsedMs))
      ? Math.max(0, Number(safeSnapshot.elapsedMs))
      : 0;
    const isRunning = !!safeSnapshot.running;

    const strip = document.createElement("section");
    strip.className = `question-solve-strip${isRunning ? " is-running" : ""}`;

    const main = document.createElement("div");
    main.className = "question-solve-main";

    const orb = document.createElement("span");
    orb.className = "question-solve-orb";
    orb.setAttribute("aria-hidden", "true");
    orb.innerHTML = '<i class="question-solve-orb-core"></i><i class="question-solve-orb-wave"></i>';

    const copy = document.createElement("div");
    copy.className = "question-solve-copy";

    const label = document.createElement("span");
    label.className = "question-solve-label";
    label.textContent = "زمان حل سوال";

    const value = document.createElement("strong");
    value.className = "question-solve-value";
    value.dataset.role = "question-solve-value";
    value.dataset.subjectId = subjectId;
    value.dataset.chapterId = chapterId;
    value.dataset.questionId = questionId;
    value.textContent = formatDurationClock(elapsedMs);

    const stateText = document.createElement("span");
    stateText.className = "question-solve-state";
    stateText.textContent = isRunning ? "در حال ثبت زمان" : elapsedMs > 0 ? "توقف شده" : "آماده شروع";

    copy.append(label, value, stateText);
    main.append(orb, copy);

    const actions = document.createElement("div");
    actions.className = "question-solve-actions";

    const startBtn = document.createElement("button");
    startBtn.type = "button";
    startBtn.className = "question-solve-btn question-solve-btn-start";
    startBtn.dataset.action = "question-timer-start";
    startBtn.dataset.subjectId = subjectId;
    startBtn.dataset.chapterId = chapterId;
    startBtn.dataset.questionId = questionId;
    startBtn.disabled = isRunning;
    startBtn.textContent = "شروع";
    startBtn.setAttribute("aria-label", isRunning ? "تایمر در حال اجرا است" : "شروع تایمر حل سوال");

    const pauseBtn = document.createElement("button");
    pauseBtn.type = "button";
    pauseBtn.className = "question-solve-btn question-solve-btn-pause";
    pauseBtn.dataset.action = "question-timer-pause";
    pauseBtn.dataset.subjectId = subjectId;
    pauseBtn.dataset.chapterId = chapterId;
    pauseBtn.dataset.questionId = questionId;
    pauseBtn.disabled = !isRunning;
    pauseBtn.textContent = "توقف";
    pauseBtn.setAttribute("aria-label", "توقف تایمر حل سوال");

    const resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.className = "question-solve-btn question-solve-btn-reset";
    resetBtn.dataset.action = "question-timer-reset";
    resetBtn.dataset.subjectId = subjectId;
    resetBtn.dataset.chapterId = chapterId;
    resetBtn.dataset.questionId = questionId;
    resetBtn.disabled = isRunning || elapsedMs <= 0;
    resetBtn.textContent = "ریست";
    resetBtn.setAttribute("aria-label", "بازنشانی تایمر حل سوال");

    actions.append(startBtn, pauseBtn, resetBtn);
    strip.append(main, actions);
    return strip;
  }

  function toggleDisclosure(button, kind) {
    const token = button.dataset.token;
    if (!token) {
      return;
    }

    const card = button.closest(".question-card");
    if (!card) {
      return;
    }

    const panel = card.querySelector(`.disclosure[data-kind="${kind}"][data-token="${token}"]`);
    if (!panel) {
      return;
    }

    const isOpen = !panel.hidden;
    if (isOpen) {
      panel.hidden = true;
      panel.classList.remove("is-open");
      button.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
      button.textContent = kind === "hint" ? "نمایش راهنما" : "نمایش حل";
      return;
    }

    if (panel.dataset.rendered !== "1") {
      const question = visibleQuestionLookup.get(token);
      const content = kind === "hint" ? getQuestionHintText(question) : getQuestionSolutionText(question);
      panel.replaceChildren(buildRichTextFragment(content || "موردی ثبت نشده است."));
      panel.dataset.rendered = "1";
    }

    panel.hidden = false;
    panel.classList.add("is-open");
    button.classList.add("is-open");
    button.setAttribute("aria-expanded", "true");
    button.textContent = kind === "hint" ? "بستن راهنما" : "بستن حل";
    observeMathWithin(panel);
  }
  function buildRichTextFragment(rawText) {
    const text = cleanQuestionContentText(rawText, { trim: false });
    const fragment = document.createDocumentFragment();
    const lines = text.split(/\r?\n/);

    if (!lines.length) {
      const line = document.createElement("p");
      line.className = "text-line";
      line.textContent = "";
      fragment.append(line);
      return fragment;
    }

    lines.forEach((lineText) => {
      const line = document.createElement("p");
      line.className = "text-line";
      const hasMath = appendMathAwareText(line, lineText);
      if (hasMath) {
        line.classList.add("text-line-has-math");
      }
      fragment.append(line);
    });

    return fragment;
  }

  function isMathOnlyRichText(rawText) {
    const text = cleanQuestionContentText(rawText, { trim: false });
    if (!asText(text, "").trim()) {
      return false;
    }

    const pattern = /(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$[^$\n]+\$)/g;
    const parts = text.split(pattern);
    let hasMath = false;

    for (const part of parts) {
      if (!part) {
        continue;
      }

      const mathInfo = parseMathPart(part);
      if (mathInfo) {
        if (asText(mathInfo.expr, "").trim()) {
          hasMath = true;
        }
        continue;
      }

      if (asText(part, "").trim()) {
        return false;
      }
    }

    return hasMath;
  }

  function appendMathAwareText(container, rawLine) {
    const line = asText(rawLine, "");
    const pattern = /(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$[^$\n]+\$)/g;
    const parts = line.split(pattern);
    let hasMath = false;

    if (!parts.length) {
      container.append(document.createTextNode(line));
      return false;
    }

    const localFragment = document.createDocumentFragment();

    parts.forEach((part) => {
      if (!part) {
        return;
      }

      const mathInfo = parseMathPart(part);
      if (!mathInfo) {
        localFragment.append(document.createTextNode(part));
        return;
      }
      hasMath = true;

      const node = document.createElement(mathInfo.display ? "div" : "span");
      node.className = "math-node lazy-math";
      node.setAttribute("dir", "ltr");
      node.dataset.expr = mathInfo.expr;
      node.dataset.display = mathInfo.display ? "1" : "0";
      node.textContent = mathInfo.expr;

      localFragment.append(node);
    });

    container.append(localFragment);
    return hasMath;
  }

  function parseMathPart(part) {
    if (part.startsWith("$$") && part.endsWith("$$")) {
      return { display: true, expr: part.slice(2, -2).trim() };
    }

    if (part.startsWith("\\[") && part.endsWith("\\]")) {
      return { display: true, expr: part.slice(2, -2).trim() };
    }

    if (part.startsWith("\\(") && part.endsWith("\\)")) {
      return { display: false, expr: part.slice(2, -2).trim() };
    }

    if (part.startsWith("$") && part.endsWith("$") && part.length >= 2) {
      return { display: false, expr: part.slice(1, -1).trim() };
    }

    return null;
  }

  function observeMathWithin(root) {
    if (!root) {
      return;
    }

    const targets = root.querySelectorAll(".lazy-math");
    if (!targets.length) {
      return;
    }

    const observer = getMathObserver();
    targets.forEach((node) => observer.observe(node));
  }

  function queueAssetHydrationWithin(root) {
    if (!(root instanceof HTMLElement) && !(root instanceof Document)) {
      return;
    }
    if (
      !questionPdfAssetPlugin ||
      typeof questionPdfAssetPlugin.hydrateAssetsInRoot !== "function"
    ) {
      return;
    }

    pendingAssetHydrationRoots.add(root);
    if (assetHydrationRafId) {
      return;
    }

    assetHydrationRafId = window.requestAnimationFrame(() => {
      assetHydrationRafId = 0;
      const roots = Array.from(pendingAssetHydrationRoots);
      pendingAssetHydrationRoots.clear();
      if (!roots.length) {
        return;
      }

      const appUltraMode = isStandaloneAppUltraPerformanceActive();
      const concurrency = appUltraMode ? 1 : isMobileViewportActive() ? 2 : 3;
      roots.forEach((scope) => {
        try {
          void questionPdfAssetPlugin.hydrateAssetsInRoot(scope, { concurrency });
        } catch (error) {
          console.error("Question asset hydration queue failed.", error);
        }
      });
    });
  }

  function getMathObserver() {
    if (mathObserver) {
      return mathObserver;
    }

    const appUltraMode = isStandaloneAppUltraPerformanceActive();
    const mobileMathMode = isMobileViewportActive() || isMobilePerformanceLiteActive() || appUltraMode;

    mathObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          observer.unobserve(entry.target);
          enqueueMathNodeForRender(entry.target);
        });
      },
      { root: null, rootMargin: appUltraMode ? "96px 0px" : mobileMathMode ? "140px 0px" : "220px 0px", threshold: 0.01 }
    );

    return mathObserver;
  }

  function disconnectMathObserver() {
    if (mathObserver) {
      mathObserver.disconnect();
    }
    if (mathRenderFlushRafId) {
      window.cancelAnimationFrame(mathRenderFlushRafId);
      mathRenderFlushRafId = 0;
    }
    mathRenderFlushPending = false;
    mathWarmupPromise = null;
    pendingMathRenderQueue = [];
    queuedMathNodes = new WeakSet();
  }

  function enqueueMathNodeForRender(node) {
    if (!(node instanceof HTMLElement) || node.dataset.rendered === "1" || queuedMathNodes.has(node)) {
      return;
    }
    queuedMathNodes.add(node);
    pendingMathRenderQueue.push(node);
    scheduleMathRenderFlush();
  }

  function scheduleMathRenderFlush() {
    if (mathRenderFlushRafId || !pendingMathRenderQueue.length) {
      return;
    }
    mathRenderFlushRafId = window.requestAnimationFrame(() => {
      mathRenderFlushRafId = 0;
      void flushPendingMathRenderQueue();
    });
  }

  async function flushPendingMathRenderQueue() {
    if (mathRenderFlushPending || !pendingMathRenderQueue.length) {
      return;
    }

    mathRenderFlushPending = true;
    try {
      if (!(window.katex && typeof window.katex.render === "function")) {
        if (!mathWarmupPromise) {
          mathWarmupPromise = ensureKaTeX()
            .catch(() => null)
            .finally(() => {
              mathWarmupPromise = null;
            });
        }
        await mathWarmupPromise;
      }

      const appUltraMode = isStandaloneAppUltraPerformanceActive();
      const mobileMathMode = isMobileViewportActive() || isMobilePerformanceLiteActive() || appUltraMode;
      const frameBudgetMs = appUltraMode ? 3 : mobileMathMode ? 5 : 11;
      const maxPerFrame = appUltraMode ? 1 : mobileMathMode ? 2 : 6;
      const frameStart = performance.now();
      let renderedCount = 0;

      while (pendingMathRenderQueue.length && renderedCount < maxPerFrame) {
        if (renderedCount > 0 && performance.now() - frameStart >= frameBudgetMs) {
          break;
        }
        const node = pendingMathRenderQueue.shift();
        if (!(node instanceof HTMLElement)) {
          continue;
        }
        queuedMathNodes.delete(node);
        renderMathNodeImmediate(node);
        renderedCount += 1;
      }
    } finally {
      mathRenderFlushPending = false;
      if (pendingMathRenderQueue.length) {
        scheduleMathRenderFlush();
      }
    }
  }

  function finalizeRenderedMathNode(node) {
    if (!(node instanceof HTMLElement)) {
      return;
    }
    node.setAttribute("dir", "ltr");
    node.dataset.rendered = "1";
    node.classList.remove("lazy-math");
  }

  function renderMathNodeImmediate(node) {
    if (!(node instanceof HTMLElement) || node.dataset.rendered === "1" || !node.isConnected) {
      return;
    }

    const expr = asText(node.dataset.expr, "");
    if (!expr) {
      finalizeRenderedMathNode(node);
      return;
    }

    try {
      if (window.katex && typeof window.katex.render === "function") {
        window.katex.render(expr, node, {
          throwOnError: false,
          displayMode: node.dataset.display === "1",
          trust: false,
          output: "html"
        });
      } else {
        node.textContent = expr;
      }
    } catch (error) {
      node.textContent = expr;
      console.error(error);
    } finally {
      finalizeRenderedMathNode(node);
    }
  }

  async function renderMathNode(node) {
    if (!(node instanceof HTMLElement) || node.dataset.rendered === "1") {
      return;
    }

    try {
      if (!(window.katex && typeof window.katex.render === "function")) {
        await ensureKaTeX();
      }
    } catch (error) {
      console.error(error);
    }
    renderMathNodeImmediate(node);
  }

  function ensureKaTeX() {
    if (state.katex.ready && window.katex) {
      return Promise.resolve();
    }

    if (state.katex.loadingPromise) {
      return state.katex.loadingPromise;
    }

    state.katex.loadingPromise = Promise.all([
      loadStyleOnce("katex-style", "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"),
      loadScriptOnce("katex-script", "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js")
    ])
      .then(() => {
        if (!window.katex) {
          throw new Error("KaTeX did not initialize");
        }
        state.katex.ready = true;
      })
      .catch((error) => {
        state.katex.ready = false;
        state.katex.loadingPromise = null;
        throw error;
      });

    return state.katex.loadingPromise;
  }

  async function ensureChapterQuestionsLoaded(subject, chapter, options = {}) {
    const force = !!options.force;
    if (!subject || !chapter || (chapter.questionsLoaded && !force)) {
      return;
    }
    const silent = !!options.silent;
    const filePath = asText(chapter?.questionsFile, "").trim();
    if (!filePath) {
      if (!Array.isArray(chapter.questions)) {
        chapter.questions = [];
      }
      chapter.questionsLoaded = true;
      return;
    }

    const runtime = getRuntime(subject.id, chapter.id);
    if (runtime.loadPromise) {
      return runtime.loadPromise;
    }

    if (!silent) {
      runtime.loading = true;
      render();
    }

    runtime.loadPromise = (async () => {
      try {
        const payload = await fetchJsonWithOfflineCache(filePath);
        if (!payload) {
          throw new Error(`Unable to load ${filePath}`);
        }

        const rawQuestions = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.questions)
            ? payload.questions
            : [];

        chapter.questions = normalizeQuestions(rawQuestions, chapter.name);
        chapter.questionsLoaded = true;
        // Loading bundled chapter JSON should not be treated as a user edit for cloud sync.
        persistSubjects({ trackEdit: false, queueAuto: false });
        if (!silent) {
          setStatus("سوالات فصل با موفقیت بارگذاری شد.", "ok");
        }
      } catch (error) {
        if (!Array.isArray(chapter.questions)) {
          chapter.questions = [];
        }
        if (!silent) {
          chapter.questionsLoaded = true;
        }
        console.error(error);
        if (!silent) {
          setStatus("بارگذاری فایل سوالات ناموفق بود.", "error");
        }
      } finally {
        runtime.loading = false;
        runtime.loadPromise = null;

        if (!silent && isActiveChapter(subject.id, chapter.id)) {
          render();
        }
      }
    })();

    return runtime.loadPromise;
  }

  function createToolbar(titleText, subtitleText) {
    const wrapper = document.createElement("section");
    wrapper.className = "toolbar";

    const head = document.createElement("div");
    head.className = "toolbar-head";

    const group = document.createElement("div");
    const title = document.createElement("h2");
    title.textContent = titleText;

    const subtitle = document.createElement("p");
    subtitle.textContent = subtitleText;

    group.append(title, subtitle);
    head.append(group);
    wrapper.append(head);

    return wrapper;
  }

  function createTabButton(tab, label, iconKind = "") {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `tab-btn${state.view.tab === tab ? " active" : ""}`;
    button.dataset.action = "switch-tab";
    button.dataset.tab = tab;

    if (iconKind) {
      const icon = createLessonIcon(iconKind, 12);
      icon.classList.add("tab-btn-icon");
      button.append(icon);
    }

    const text = document.createElement("span");
    text.textContent = label;
    button.append(text);
    return button;
  }

  function createOption(value, label) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    return option;
  }

  function createExamControlField(labelText, control, iconKind = "") {
    const field = document.createElement("label");
    field.className = "exam-control-field";

    const label = document.createElement("span");
    label.className = "exam-control-label";
    if (iconKind) {
      label.append(createExamIcon(iconKind, 13));
    }
    label.append(document.createTextNode(labelText));

    field.append(label, control);
    return field;
  }

  function createExamStatChip(label, value, iconKind = "spark") {
    const chip = document.createElement("span");
    chip.className = "exam-stat-chip";

    if (iconKind) {
      chip.append(createExamIcon(iconKind, 13));
    }

    const copy = document.createElement("span");
    copy.className = "exam-stat-copy";

    const labelNode = document.createElement("em");
    labelNode.textContent = label;

    const valueNode = document.createElement("strong");
    valueNode.textContent = value;

    copy.append(labelNode, valueNode);
    chip.append(copy);
    return chip;
  }

  function createExamMetaPill(label, value, key = "") {
    const pill = document.createElement("span");
    pill.className = "exam-paper-meta-pill";
    const safeKey = asText(key, "").trim();
    if (safeKey) {
      pill.dataset.metaKey = safeKey;
    }

    const labelNode = document.createElement("em");
    labelNode.textContent = `${label}:`;

    const valueNode = document.createElement("strong");
    valueNode.textContent = value;

    pill.append(labelNode, valueNode);
    return pill;
  }

  function createExamIcon(kind, size = 14) {
    const icon = document.createElement("span");
    icon.className = `exam-icon exam-icon-${asText(kind, "spark")}`;
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = getExamIconSvg(kind);

    const svg = icon.querySelector("svg");
    if (svg instanceof SVGElement) {
      svg.setAttribute("width", String(size));
      svg.setAttribute("height", String(size));
    }

    return icon;
  }

  function getExamIconSvg(kind) {
    const key = asText(kind, "spark");
    const icons = {
      spark:
        '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3l1.9 4.8L19 10l-5.1 2.2L12 17l-1.9-4.8L5 10l5.1-2.2L12 3z"></path></svg>',
      layers:
        '<svg viewBox="0 0 24 24" fill="none"><path d="M12 4l8 4-8 4-8-4 8-4z"></path><path d="M4 12l8 4 8-4"></path><path d="M4 16l8 4 8-4"></path></svg>',
      grid:
        '<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="7" height="7" rx="1.5"></rect><rect x="13" y="4" width="7" height="7" rx="1.5"></rect><rect x="4" y="13" width="7" height="7" rx="1.5"></rect><rect x="13" y="13" width="7" height="7" rx="1.5"></rect></svg>',
      book:
        '<svg viewBox="0 0 24 24" fill="none"><path d="M5 4.5h9a3 3 0 0 1 3 3V20H8a3 3 0 0 0-3 3"></path><path d="M8 4.5v18"></path></svg>',
      check:
        '<svg viewBox="0 0 24 24" fill="none"><path d="M4 12l4.5 4.5L20 7"></path></svg>',
      clear:
        '<svg viewBox="0 0 24 24" fill="none"><path d="M5 5l14 14"></path><path d="M19 5L5 19"></path></svg>',
      count:
        '<svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16"></path><path d="M4 12h16"></path><path d="M4 17h16"></path></svg>',
      clock:
        '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8"></circle><path d="M12 8v5l3 2"></path></svg>',
      profile:
        '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.5"></circle><path d="M5 19c1.8-3.5 4.4-5 7-5s5.2 1.5 7 5"></path></svg>',
      sort:
        '<svg viewBox="0 0 24 24" fill="none"><path d="M7 6h10"></path><path d="M9 12h8"></path><path d="M11 18h6"></path></svg>',
      bolt:
        '<svg viewBox="0 0 24 24" fill="none"><path d="M13 2L6 13h5l-1 9 8-12h-5l0-8z"></path></svg>',
      leaf:
        '<svg viewBox="0 0 24 24" fill="none"><path d="M19 5c-6 0-10 4-10 10 0 2.5 1.1 4.6 3 6 4.8-1 8-5 8-10V5z"></path><path d="M9 15c2-2 4.4-3.4 7-4"></path></svg>',
      print:
        '<svg viewBox="0 0 24 24" fill="none"><path d="M7 8V4h10v4"></path><rect x="5" y="10" width="14" height="7" rx="2"></rect><path d="M7 17h10v3H7z"></path></svg>',
      paper:
        '<svg viewBox="0 0 24 24" fill="none"><path d="M7 3h8l4 4v14H7z"></path><path d="M15 3v5h4"></path><path d="M10 13h6"></path><path d="M10 17h6"></path></svg>'
    };

    return icons[key] || icons.spark;
  }

  function formatDurationClock(value) {
    const totalSeconds = Math.max(0, Math.floor(Number(value) / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const mm = String(minutes).padStart(2, "0");
    const ss = String(seconds).padStart(2, "0");
    if (hours <= 0) {
      return `${mm}:${ss}`;
    }

    const hh = String(hours).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  }

  function ensureExamTimerState(exam) {
    if (!exam || typeof exam !== "object") {
      return null;
    }

    const safeDuration = clampNumber(exam?.duration, EXAM_DURATION_MIN, EXAM_DURATION_MAX, EXAM_DURATION_DEFAULT);
    const durationMs = safeDuration * 60 * 1000;
    const nowMs = Date.now();

    if (!exam.timer || typeof exam.timer !== "object") {
      exam.timer = {
        durationMs,
        startedAtMs: nowMs,
        endsAtMs: nowMs + durationMs
      };
      return exam.timer;
    }

    exam.timer.durationMs = Number.isFinite(Number(exam.timer.durationMs))
      ? Math.max(60 * 1000, Number(exam.timer.durationMs))
      : durationMs;

    exam.timer.startedAtMs = Number.isFinite(Number(exam.timer.startedAtMs))
      ? Number(exam.timer.startedAtMs)
      : nowMs;

    exam.timer.endsAtMs = Number.isFinite(Number(exam.timer.endsAtMs))
      ? Number(exam.timer.endsAtMs)
      : exam.timer.startedAtMs + exam.timer.durationMs;

    return exam.timer;
  }

  function getExamRemainingMs(exam, nowMs = Date.now()) {
    const timer = ensureExamTimerState(exam);
    if (!timer) {
      return 0;
    }
    return Math.max(0, timer.endsAtMs - nowMs);
  }

  function createExamCountdownPanel(exam, subjectId, chapterId) {
    const timer = ensureExamTimerState(exam);
    if (!timer) {
      return createEmptyState("تایمر آزمون فعال نیست.");
    }

    const remainingMs = getExamRemainingMs(exam);
    const progressRatio = timer.durationMs > 0 ? Math.max(0, Math.min(1, remainingMs / timer.durationMs)) : 0;

    const panel = document.createElement("section");
    panel.className = "exam-countdown-panel exam-countdown-panel-pinned";

    if (remainingMs <= EXAM_WARNING_THRESHOLD_MS) {
      panel.classList.add("is-warning");
    }

    const top = document.createElement("div");
    top.className = "exam-countdown-top";

    const label = document.createElement("span");
    label.className = "exam-countdown-label";
    label.textContent = "زمان باقی مانده آزمون";

    const value = document.createElement("strong");
    value.className = "exam-countdown-value";
    value.dataset.role = "exam-countdown-value";
    value.dataset.subjectId = subjectId;
    value.dataset.chapterId = chapterId;
    value.textContent = formatDurationClock(remainingMs);

    top.append(label, value);

    const track = document.createElement("div");
    track.className = "exam-countdown-track";

    const fill = document.createElement("i");
    fill.dataset.role = "exam-countdown-progress";
    fill.dataset.subjectId = subjectId;
    fill.dataset.chapterId = chapterId;
    fill.style.width = `${Math.round(progressRatio * 100)}%`;

    track.append(fill);

    panel.append(top, track);
    return panel;
  }

  function ensureExamCompletionState(exam) {
    if (!exam || typeof exam !== "object") {
      return;
    }

    exam.completed = !!exam.completed;
    exam.completedReason = asText(exam.completedReason, "");
    exam.completedAt = asText(exam.completedAt, "");
    ensureExamAnswerMarksState(exam);

    if (exam.completed) {
      updateExamEvaluationFromMarks(exam);
      return;
    }

    if (!exam.evaluation || typeof exam.evaluation !== "object") {
      exam.evaluation = null;
      return;
    }

    const evaluatedTotal = clampNumber(exam.evaluation.totalCount, 1, 100000, 1);
    const evaluatedCorrect = clampNumber(exam.evaluation.correctCount, 0, evaluatedTotal, 0);
    const percent = Math.round((evaluatedCorrect / evaluatedTotal) * 100);
    const scoreOn20 = Math.round(((evaluatedCorrect / evaluatedTotal) * 20) * 10) / 10;
    const tier = resolveExamPerformanceTier(scoreOn20);

    exam.evaluation.correctCount = evaluatedCorrect;
    exam.evaluation.totalCount = evaluatedTotal;
    exam.evaluation.percent = percent;
    exam.evaluation.scoreOn20 = scoreOn20;
    exam.evaluation.scoreLabel = formatExamScore(scoreOn20);
    exam.evaluation.tierKey = tier.key;
    exam.evaluation.tierLabel = tier.label;
    exam.evaluation.message = tier.message;
    exam.evaluation.updatedAt = asText(exam.evaluation.updatedAt, "");
  }

  function completeExamSession(runtime, reason = "timeout") {
    if (!runtime?.exam || runtime.exam.completed) {
      return false;
    }

    const nowMs = Date.now();
    ensureExamTimerState(runtime.exam);
    ensureExamCompletionState(runtime.exam);

    runtime.exam.completed = true;
    runtime.exam.completedReason = asText(reason, "timeout");
    runtime.exam.completedAt = new Date(nowMs).toISOString();
    if (runtime.exam.timer && typeof runtime.exam.timer === "object") {
      runtime.exam.timer.endsAtMs = nowMs;
    }
    ensureExamAnswerMarksState(runtime.exam);
    updateExamEvaluationFromMarks(runtime.exam);
    touchExamRuntimeAutosave(true);

    return true;
  }

  function createExamCompletionBanner(exam, questionCount) {
    const section = document.createElement("section");
    section.className = "exam-completion-banner";

    const heading = document.createElement("h4");
    heading.className = "exam-completion-title";
    heading.append(createExamIcon("check", 14), document.createTextNode("آزمون به پایان رسید"));

    const finishedAt = formatIsoDateTime(exam?.completedAt);
    const text = document.createElement("p");
    text.className = "exam-completion-caption";
    text.textContent = `ارزیابی ${questionCount} سوالی آماده است. زمان پایان: ${finishedAt}`;

    section.append(heading, text);
    return section;
  }

  function normalizeExamAnswerMark(value) {
    const mark = asText(value, "").trim().toLowerCase();
    if (mark === "correct") {
      return "correct";
    }
    if (mark === "wrong" || mark === "incorrect" || mark === "unanswered") {
      return "wrong";
    }
    return "";
  }

  function ensureExamAnswerMarksState(exam) {
    if (!exam || typeof exam !== "object") {
      return {};
    }

    const source = exam.answerMarks && typeof exam.answerMarks === "object" ? exam.answerMarks : {};
    const normalized = {};
    const validIds = new Set(Array.isArray(exam.ids) ? exam.ids.map((item) => asText(item, "")) : []);

    Object.entries(source).forEach(([questionId, value]) => {
      const safeQuestionId = asText(questionId, "").trim();
      if (!safeQuestionId || (validIds.size && !validIds.has(safeQuestionId))) {
        return;
      }
      const mark = normalizeExamAnswerMark(value);
      if (!mark) {
        return;
      }
      normalized[safeQuestionId] = mark;
    });

    exam.answerMarks = normalized;
    return exam.answerMarks;
  }

  function resolveExamQuestionMark(exam, questionId) {
    const safeQuestionId = asText(questionId, "").trim();
    if (!safeQuestionId) {
      return "";
    }
    const marks = ensureExamAnswerMarksState(exam);
    return normalizeExamAnswerMark(marks[safeQuestionId]);
  }

  function setExamQuestionMark(exam, questionId, mark) {
    if (!exam || typeof exam !== "object") {
      return "";
    }

    const safeQuestionId = asText(questionId, "").trim();
    if (!safeQuestionId) {
      return "";
    }

    const nextMark = normalizeExamAnswerMark(mark);
    const marks = ensureExamAnswerMarksState(exam);
    if (!nextMark) {
      delete marks[safeQuestionId];
      return "";
    }

    marks[safeQuestionId] = nextMark;
    return nextMark;
  }

  function summarizeExamAnswerMarks(exam, fallbackTotalCount = 0) {
    const ids = Array.isArray(exam?.ids) ? exam.ids.map((item) => asText(item, "")).filter(Boolean) : [];
    const totalCount = ids.length || Math.max(0, Number(fallbackTotalCount) || 0);
    const marks = ensureExamAnswerMarksState(exam);

    let correctCount = 0;
    let wrongCount = 0;

    ids.forEach((id) => {
      const mark = normalizeExamAnswerMark(marks[id]);
      if (mark === "correct") {
        correctCount += 1;
      } else if (mark === "wrong") {
        wrongCount += 1;
      }
    });

    if (!ids.length && marks && typeof marks === "object") {
      Object.values(marks).forEach((value) => {
        const mark = normalizeExamAnswerMark(value);
        if (mark === "correct") {
          correctCount += 1;
        } else if (mark === "wrong") {
          wrongCount += 1;
        }
      });
    }

    const unresolved = Math.max(0, totalCount - correctCount - wrongCount);
    return {
      totalCount,
      correctCount,
      wrongCount,
      unresolvedCount: unresolved,
      markedCount: correctCount + wrongCount
    };
  }

  function updateExamEvaluationFromMarks(exam, fallbackTotalCount = 0) {
    if (!exam || typeof exam !== "object") {
      return null;
    }

    const summary = summarizeExamAnswerMarks(exam, fallbackTotalCount);
    const base = buildExamEvaluation(summary.correctCount, Math.max(1, summary.totalCount));
    exam.evaluation = {
      ...base,
      wrongCount: summary.wrongCount,
      unresolvedCount: summary.unresolvedCount,
      markedCount: summary.markedCount,
      source: "question-marks"
    };
    return exam.evaluation;
  }

  function createExamQuestionAnswerBlock(subjectId, chapterId, exam, question, questionOrder) {
    const safeOrder = Math.max(1, Number(questionOrder) || 1);
    const questionId = asText(question?.id, "").trim();
    const currentMark = resolveExamQuestionMark(exam, questionId);

    const block = document.createElement("section");
    block.className = "exam-question-review";
    block.classList.add(currentMark ? `is-${currentMark}` : "is-pending");

    const top = document.createElement("div");
    top.className = "exam-question-review-top";

    const title = document.createElement("strong");
    title.className = "exam-question-review-title";
    title.textContent = `پاسخ سوال ${safeOrder}`;

    const markGroup = document.createElement("div");
    markGroup.className = "exam-question-mark-group";
    markGroup.setAttribute("role", "group");
    markGroup.setAttribute("aria-label", `ارزیابی پاسخ سوال ${safeOrder}`);

    const createMarkButton = (value, label, iconSvg) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `exam-question-mark-btn${currentMark === value ? " is-active" : ""}`;
      button.dataset.action = "exam-mark-answer";
      button.dataset.subjectId = subjectId;
      button.dataset.chapterId = chapterId;
      button.dataset.questionId = questionId;
      button.dataset.mark = value;
      button.setAttribute("aria-pressed", currentMark === value ? "true" : "false");
      button.setAttribute("aria-label", label);
      button.innerHTML = `${iconSvg}<span>${label}</span>`;
      return button;
    };

    markGroup.append(
      createMarkButton(
        "correct",
        "درست",
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4 4L19 7.5"></path></svg>'
      ),
      createMarkButton(
        "wrong",
        "غلط / بی‌پاسخ",
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h12"></path></svg>'
      )
    );

    top.append(title, markGroup);

    const statusLine = document.createElement("p");
    statusLine.className = "exam-question-mark-state";
    if (currentMark === "correct") {
      statusLine.textContent = "وضعیت فعلی: پاسخ درست ثبت شده است.";
      statusLine.classList.add("is-correct");
    } else if (currentMark === "wrong") {
      statusLine.textContent = "وضعیت فعلی: در گروه غلط / بی‌پاسخ قرار گرفت.";
      statusLine.classList.add("is-wrong");
    } else {
      statusLine.textContent = "وضعیت فعلی: هنوز برای این سوال ارزیابی ثبت نشده است.";
    }

    const answerBody = document.createElement("div");
    answerBody.className = "exam-question-answer-body";
    answerBody.append(buildRichTextFragment(getQuestionSolutionText(question) || "برای این سوال پاسخ تشریحی ثبت نشده است."));

    block.append(top, statusLine, answerBody);
    return block;
  }

  function createExamQuestionAnswerSkeleton(questionOrder) {
    const safeOrder = Math.max(1, Number(questionOrder) || 1);
    const block = document.createElement("section");
    block.className = "exam-question-review exam-question-review-skeleton";
    block.setAttribute("aria-hidden", "true");
    block.innerHTML =
      `<div class="exam-question-review-top">` +
      `<strong class="exam-question-review-title">پاسخ سوال ${safeOrder}</strong>` +
      `<div class="exam-question-mark-group">` +
      `<span class="exam-question-mark-btn exam-question-mark-btn-skeleton"><span>در حال آماده‌سازی...</span></span>` +
      `</div>` +
      `</div>` +
      `<p class="exam-question-mark-state">در حال بارگذاری پاسخ تشریحی...</p>` +
      `<div class="exam-question-answer-body exam-question-answer-body-skeleton">` +
      `<span class="exam-answer-skeleton-line line-a"></span>` +
      `<span class="exam-answer-skeleton-line line-b"></span>` +
      `</div>`;
    return block;
  }

  function scheduleExamAnswerHydration(examList, pendingEntries, subjectId, chapterId, exam) {
    if (!(examList instanceof HTMLElement) || !Array.isArray(pendingEntries) || !pendingEntries.length) {
      return;
    }

    const token = ++examAnswerHydrationToken;
    const appUltraMode = isStandaloneAppUltraPerformanceActive();
    const isMobilePerf = isMobileViewportActive() || appUltraMode;
    const batchSize = appUltraMode ? 1 : isMobilePerf ? 1 : 5;
    const frameBudgetMs = appUltraMode ? 3 : isMobilePerf ? 4 : 10;

    const hydrateBatch = () => {
      if (token !== examAnswerHydrationToken || !examList.isConnected || state.view.tab !== "exam") {
        return;
      }

      const runtime = getRuntimeIfExists(subjectId, chapterId);
      if (!runtime?.exam || !runtime.exam.completed || runtime.exam !== exam) {
        return;
      }

      const frameStart = performance.now();
      let rendered = 0;
      const deferredMathRoots = [];
      while (pendingEntries.length && rendered < batchSize) {
        if (performance.now() - frameStart > frameBudgetMs) {
          break;
        }
        const entry = pendingEntries.shift();
        if (!entry || !(entry.placeholder instanceof HTMLElement) || !entry.placeholder.isConnected) {
          continue;
        }
        const answerBlock = createExamQuestionAnswerBlock(subjectId, chapterId, exam, entry.question, entry.order);
        entry.placeholder.replaceWith(answerBlock);
        if (isMobilePerf) {
          deferredMathRoots.push(answerBlock);
        } else {
          observeMathWithin(answerBlock);
        }
        rendered += 1;
      }

      if (deferredMathRoots.length) {
        window.requestAnimationFrame(() => {
          if (token !== examAnswerHydrationToken || state.view.tab !== "exam") {
            return;
          }
          deferredMathRoots.forEach((node) => {
            if (node instanceof HTMLElement && node.isConnected) {
              observeMathWithin(node);
            }
          });
        });
      }

      if (pendingEntries.length) {
        window.requestAnimationFrame(hydrateBatch);
      }
    };

    window.requestAnimationFrame(hydrateBatch);
  }

  function resolveExamPerformanceTier(scoreOn20) {
    const score = Number(scoreOn20);
    if (!Number.isFinite(score)) {
      return {
        key: "unknown",
        label: "نامشخص",
        message: "اطلاعات کافی برای تحلیل وضعیت وجود ندارد."
      };
    }

    if (score >= 18) {
      return {
        key: "excellent",
        label: "عالی",
        message: "تسلط شما روی این درس بسیار خوب است."
      };
    }
    if (score >= 15) {
      return {
        key: "very-good",
        label: "خیلی خوب",
        message: "عملکرد شما خوب است و با مرور محدود بهتر می‌شود."
      };
    }
    if (score >= 12) {
      return {
        key: "good",
        label: "خوب",
        message: "پایه مناسب دارید؛ تمرین هدفمند نتیجه را بهتر می‌کند."
      };
    }
    if (score >= 10) {
      return {
        key: "acceptable",
        label: "قابل قبول",
        message: "عبور کردید اما برای تثبیت نیاز به تمرین بیشتر دارید."
      };
    }
    return {
      key: "needs-work",
      label: "نیاز به تقویت",
      message: "بهتر است دوباره روی مفاهیم اصلی این درس کار کنید."
    };
  }

  function buildExamEvaluation(correctCount, totalCount) {
    const safeTotal = Math.max(1, Number(totalCount) || 1);
    const safeCorrect = clampNumber(correctCount, 0, safeTotal, 0);
    const percent = Math.round((safeCorrect / safeTotal) * 100);
    const scoreOn20 = Math.round(((safeCorrect / safeTotal) * 20) * 10) / 10;
    const tier = resolveExamPerformanceTier(scoreOn20);
    return {
      correctCount: safeCorrect,
      totalCount: safeTotal,
      percent,
      scoreOn20,
      scoreLabel: formatExamScore(scoreOn20),
      tierKey: tier.key,
      tierLabel: tier.label,
      message: tier.message,
      updatedAt: new Date().toISOString()
    };
  }

  function buildExamAnalysisInsights(exam, questions) {
    const list = Array.isArray(questions) ? questions : [];
    const marks = ensureExamAnswerMarksState(exam);
    const chapterMap = new Map();
    const topicMap = new Map();
    const difficultyMap = new Map();
    for (let level = 1; level <= 5; level += 1) {
      difficultyMap.set(level, { level, total: 0, correct: 0, wrong: 0, unresolved: 0 });
    }

    let hardTotal = 0;
    let hardCorrect = 0;

    list.forEach((question) => {
      const questionId = asText(question?.id, "").trim();
      const mark = normalizeExamAnswerMark(marks[questionId]);
      const chapterName = asText(question?.chapter, "بدون فصل");
      const topicName = resolveQuestionTopicLabel(question);
      const difficulty = clampNumber(question?.difficulty, 1, 5, 3);

      if (!chapterMap.has(chapterName)) {
        chapterMap.set(chapterName, { name: chapterName, total: 0, correct: 0, wrong: 0, unresolved: 0 });
      }
      const chapterStat = chapterMap.get(chapterName);
      chapterStat.total += 1;

      if (!topicMap.has(topicName)) {
        topicMap.set(topicName, { name: topicName, total: 0, issue: 0 });
      }
      const topicStat = topicMap.get(topicName);
      topicStat.total += 1;

      const diffStat = difficultyMap.get(difficulty);
      diffStat.total += 1;

      if (mark === "correct") {
        chapterStat.correct += 1;
        diffStat.correct += 1;
        if (difficulty >= 4) {
          hardCorrect += 1;
        }
      } else if (mark === "wrong") {
        chapterStat.wrong += 1;
        diffStat.wrong += 1;
        topicStat.issue += 1;
      } else {
        chapterStat.unresolved += 1;
        diffStat.unresolved += 1;
        topicStat.issue += 1;
      }

      if (difficulty >= 4) {
        hardTotal += 1;
      }
    });

    const chapterStats = Array.from(chapterMap.values()).map((entry) => {
      const total = Math.max(1, entry.total);
      const correctRate = Math.round((entry.correct / total) * 100);
      const issueRate = Math.round(((entry.wrong + entry.unresolved) / total) * 100);
      return {
        ...entry,
        correctRate,
        issueRate
      };
    });

    const strongestChapter = [...chapterStats]
      .sort((a, b) => b.correctRate - a.correctRate || b.total - a.total)
      .find((item) => item.total > 0) || null;

    const weakestChapter = [...chapterStats]
      .sort((a, b) => b.issueRate - a.issueRate || b.total - a.total)
      .find((item) => item.issueRate > 0) || null;

    const hardQuestionPerformance = {
      total: hardTotal,
      correct: hardCorrect,
      percent: hardTotal ? Math.round((hardCorrect / hardTotal) * 100) : null
    };

    const topicStats = Array.from(topicMap.values())
      .map((entry) => ({
        ...entry,
        issueRate: entry.total ? Math.round((entry.issue / entry.total) * 100) : 0
      }))
      .sort((a, b) => b.issueRate - a.issueRate || b.total - a.total);

    const weakTopics = topicStats.filter((entry) => entry.issueRate > 0).slice(0, 3);

    const chapterPriority = [...chapterStats]
      .filter((entry) => entry.issueRate > 0)
      .sort((a, b) => b.issueRate - a.issueRate || b.total - a.total)
      .slice(0, 3);

    return {
      chapterStats,
      chapterPriority,
      topicStats,
      weakTopics,
      difficultyStats: Array.from(difficultyMap.values()),
      strongestChapter,
      weakestChapter,
      hardQuestionPerformance
    };
  }

  function createExamEvaluationPanel(subject, chapter, exam, questionCount, questions = []) {
    const safeQuestionCount = Math.max(1, Number(questionCount) || 1);
    const summary = summarizeExamAnswerMarks(exam, safeQuestionCount);
    const result =
      updateExamEvaluationFromMarks(exam, safeQuestionCount) ||
      buildExamEvaluation(summary.correctCount, Math.max(1, summary.totalCount));
    const insights = buildExamAnalysisInsights(exam, questions);
    const safeTotal = Math.max(1, summary.totalCount);
    const wrongPercent = Math.round((summary.wrongCount / safeTotal) * 100);
    const unresolvedPercent = Math.round((summary.unresolvedCount / safeTotal) * 100);

    const section = document.createElement("section");
    section.className = "exam-eval-panel";
    section.dataset.subjectId = subject.id;
    section.dataset.chapterId = chapter.id;

    const heading = document.createElement("h4");
    heading.className = "exam-eval-title";
    heading.append(createExamIcon("profile", 14), document.createTextNode("ارزیابی عملکرد شما"));

    const caption = document.createElement("p");
    caption.className = "exam-eval-caption";
    caption.textContent = "زیر هر سوال وضعیت پاسخ خود را تعیین کنید تا تحلیل نهایی به صورت خودکار محاسبه شود.";

    const markStats = document.createElement("div");
    markStats.className = "exam-eval-mark-stats";
    markStats.append(
      createExamMetaPill("درست", `${summary.correctCount} (${result.percent}%)`),
      createExamMetaPill("غلط / بی‌پاسخ", `${summary.wrongCount} (${wrongPercent}%)`),
      createExamMetaPill("ثبت نشده", `${summary.unresolvedCount} (${unresolvedPercent}%)`)
    );

    const unresolvedHint = document.createElement("p");
    unresolvedHint.className = "exam-eval-unresolved";
    unresolvedHint.textContent = summary.unresolvedCount
      ? `برای ${summary.unresolvedCount} سوال هنوز ارزیابی ثبت نشده است.`
      : "وضعیت همه سوال‌ها مشخص شده است.";
    unresolvedHint.classList.toggle("is-complete", summary.unresolvedCount === 0);

    section.append(heading, caption, markStats, unresolvedHint);

    const resultCard = document.createElement("div");
    resultCard.className = `exam-eval-result exam-eval-result-${asText(result.tierKey, "good")}`;

    const resultTop = document.createElement("div");
    resultTop.className = "exam-eval-result-top";
    resultTop.append(
      createExamMetaPill("پاسخ درست", `${result.correctCount} از ${result.totalCount}`),
      createExamMetaPill("درصد", `${result.percent}%`),
      createExamMetaPill("نمره", `${result.scoreLabel} از 20`)
    );

    const status = document.createElement("p");
    status.className = "exam-eval-status";
    status.textContent = `تحلیل درس ${subject.name}: ${result.tierLabel} | ${result.message}`;

    resultCard.append(resultTop, status);
    section.append(resultCard);

    const insightList = document.createElement("ul");
    insightList.className = "exam-eval-insight-list";

    const appendInsight = (text, tone = "") => {
      const item = document.createElement("li");
      item.className = "exam-eval-insight-item";
      if (tone) {
        item.classList.add(`is-${tone}`);
      }
      item.textContent = text;
      insightList.append(item);
    };

    if (insights.strongestChapter) {
      appendInsight(
        `بهترین عملکرد: ${insights.strongestChapter.name} با دقت ${insights.strongestChapter.correctRate}%`,
        "strong"
      );
    }
    if (insights.weakestChapter) {
      appendInsight(
        `نیاز به مرور بیشتر: ${insights.weakestChapter.name} (خطا/عدم ثبت: ${insights.weakestChapter.issueRate}%)`,
        "weak"
      );
    }
    if (insights.hardQuestionPerformance.total > 0) {
      appendInsight(
        `عملکرد سوالات سخت (سطح 4 و 5): ${insights.hardQuestionPerformance.correct} از ${insights.hardQuestionPerformance.total} (${insights.hardQuestionPerformance.percent}%)`,
        "focus"
      );
    }
    if (summary.unresolvedCount > 0) {
      appendInsight(`برای تحلیل دقیق‌تر، ${summary.unresolvedCount} سوال باقیمانده را هم ارزیابی کنید.`, "weak");
    } else {
      appendInsight("همه سوال‌ها ارزیابی شده‌اند و تحلیل کامل است.", "strong");
    }

    section.append(insightList);

    const recommendationPanel = document.createElement("section");
    recommendationPanel.className = "exam-eval-recommendation";

    const recommendationTitle = document.createElement("h5");
    recommendationTitle.className = "exam-eval-recommendation-title";
    recommendationTitle.textContent = "برنامه پیشنهادی تمرین";

    const recommendationList = document.createElement("ul");
    recommendationList.className = "exam-eval-recommendation-list";

    const appendRecommendation = (text) => {
      const item = document.createElement("li");
      item.className = "exam-eval-recommendation-item";
      item.textContent = text;
      recommendationList.append(item);
    };

    if (insights.chapterPriority.length) {
      const top = insights.chapterPriority[0];
      appendRecommendation(
        `اولویت اول: فصل «${top.name}» را مرور کن (نرخ خطا/بی‌پاسخ ${top.issueRate}%).`
      );
    }
    if (insights.weakTopics.length) {
      appendRecommendation(
        `موضوع‌های نیازمند تمرین بیشتر: ${insights.weakTopics.map((item) => item.name).join("، ")}.`
      );
    }
    if (insights.hardQuestionPerformance.total > 0 && (insights.hardQuestionPerformance.percent || 0) < 55) {
      appendRecommendation("برای سوالات سخت، یک جلسه تمرین هدفمند سطح 4 و 5 بگذار.");
    }
    if (summary.unresolvedCount > 0) {
      appendRecommendation(`قبل از آزمون بعدی، وضعیت ${summary.unresolvedCount} سوال ثبت‌نشده را مشخص کن.`);
    }
    if (!recommendationList.children.length) {
      appendRecommendation("عملکردت پایدار است؛ برای تثبیت، یک آزمون ترکیبی کوتاه دیگر برگزار کن.");
    }

    recommendationPanel.append(recommendationTitle, recommendationList);
    section.append(recommendationPanel);

    if (insights.chapterStats.length > 1) {
      const chapterGrid = document.createElement("div");
      chapterGrid.className = "exam-eval-chapter-grid";

      insights.chapterStats.forEach((entry) => {
        const card = document.createElement("article");
        card.className = "exam-eval-chapter-card";
        if (insights.strongestChapter && insights.strongestChapter.name === entry.name) {
          card.classList.add("is-strong");
        }
        if (insights.weakestChapter && insights.weakestChapter.name === entry.name) {
          card.classList.add("is-weak");
        }

        const cardTitle = document.createElement("strong");
        cardTitle.className = "exam-eval-chapter-title";
        cardTitle.textContent = entry.name;

        const cardMeta = document.createElement("div");
        cardMeta.className = "exam-eval-chapter-meta";
        cardMeta.append(
          createExamMetaPill("کل", String(entry.total)),
          createExamMetaPill("درست", String(entry.correct)),
          createExamMetaPill("غلط/بی‌پاسخ", String(entry.wrong + entry.unresolved))
        );

        const cardRate = document.createElement("p");
        cardRate.className = "exam-eval-chapter-rate";
        cardRate.textContent = `دقت ${entry.correctRate}%`;

        card.append(cardTitle, cardMeta, cardRate);
        chapterGrid.append(card);
      });

      section.append(chapterGrid);
    }

    return section;
  }

  function formatIsoDateTime(value) {
    const text = asText(value, "");
    if (!text) {
      return "-";
    }

    const parsed = new Date(text);
    if (Number.isNaN(parsed.getTime())) {
      return "-";
    }

    return parsed.toLocaleString("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function createExamCode() {
    const nowToken = Date.now().toString(36).toUpperCase().slice(-6);
    const randomToken = Math.random().toString(36).toUpperCase().slice(2, 4);
    return `EX-${nowToken}${randomToken}`;
  }

  function resolveExamCode(exam) {
    const existing = asText(exam?.examCode, "").trim();
    if (existing) {
      return existing;
    }

    const generated = createExamCode();
    if (exam && typeof exam === "object") {
      exam.examCode = generated;
    }
    return generated;
  }

  function buildExamPointPlan(questions, desiredTotal = 20) {
    const list = Array.isArray(questions) ? questions : [];
    if (!list.length) {
      return [];
    }

    const totalScore = Math.max(desiredTotal, list.length);
    const weights = list.map((item) => {
      const difficulty = clampNumber(item?.difficulty, 1, 5, 3);
      if (difficulty <= 2) {
        return 1;
      }
      if (difficulty >= 4) {
        return 1.4;
      }
      return 1.2;
    });

    const weightSum = weights.reduce((sum, value) => sum + value, 0) || list.length;
    const plan = weights.map((weight) => Math.round(((weight / weightSum) * totalScore) * 10) / 10);

    let gap = Math.round((totalScore - plan.reduce((sum, value) => sum + value, 0)) * 10) / 10;
    let guard = 0;
    while (Math.abs(gap) >= 0.1 && guard < 400) {
      const index = guard % plan.length;
      const step = gap > 0 ? 0.1 : -0.1;
      const next = Math.round((plan[index] + step) * 10) / 10;
      if (next >= 0.5) {
        plan[index] = next;
        gap = Math.round((gap - step) * 10) / 10;
      }
      guard += 1;
    }

    return plan;
  }

  function formatExamScore(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return "-";
    }

    const rounded = Math.round(numeric * 10) / 10;
    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  }

  function getExamAnswerLineCount(question) {
    const difficulty = clampNumber(question?.difficulty, 1, 5, 3);
    if (difficulty <= 2) {
      return 2;
    }
    if (difficulty >= 4) {
      return 4;
    }
    return 3;
  }

  function createBreadcrumbButton(text, action) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.action = action;
    button.className = "crumb-node crumb-link";
    button.setAttribute("aria-label", asText(text, "مسیر"));
    button.title = asText(text, "");
    button.textContent = text;
    return button;
  }

  function createBreadcrumbLabel(text) {
    const label = document.createElement("span");
    label.className = "crumb-node crumb-current";
    label.setAttribute("aria-current", "page");
    label.title = asText(text, "");
    label.textContent = text;
    return label;
  }

  function createSeparator() {
    const separator = document.createElement("span");
    separator.className = "crumb-sep";
    separator.setAttribute("aria-hidden", "true");
    separator.textContent = "/";
    return separator;
  }

  function createMetaRow(text) {
    const row = document.createElement("div");
    row.className = "meta-row";

    const label = document.createElement("span");
    label.textContent = text;

    row.append(label);
    return row;
  }

  function createQuestionBankOverview({ totalCount, filteredCount, selectedCount, activeFilters }) {
    const row = document.createElement("section");
    row.className = "qb-overview";
    row.append(
      createQuestionBankStat("کل سوال ها", String(totalCount)),
      createQuestionBankStat("نتایج فعلی", String(filteredCount)),
      createQuestionBankStat("انتخاب شده", String(selectedCount)),
      createQuestionBankStat("فیلترهای فعال", String(activeFilters))
    );
    return row;
  }

  function createQuestionBankStat(label, value) {
    const chip = document.createElement("article");
    chip.className = "qb-stat-chip";

    const title = document.createElement("span");
    title.className = "qb-stat-label";
    title.textContent = label;

    const number = document.createElement("strong");
    number.className = "qb-stat-value";
    number.textContent = value;

    chip.append(title, number);
    return chip;
  }

  function createSubjectsStatChip(label, value) {
    const chip = document.createElement("article");
    chip.className = "subjects-stat-chip";

    const number = document.createElement("strong");
    number.className = "subjects-stat-value";
    number.textContent = value;

    const title = document.createElement("span");
    title.className = "subjects-stat-label";
    title.textContent = label;

    chip.append(number, title);
    return chip;
  }

  function createLessonStatChip(label, value, iconKind = "spark") {
    const chip = document.createElement("article");
    chip.className = "lesson-stat-chip";

    const head = document.createElement("span");
    head.className = "lesson-stat-head";
    head.append(createLessonIcon(iconKind, 12));

    const labelNode = document.createElement("em");
    labelNode.textContent = label;
    head.append(labelNode);

    const valueNode = document.createElement("strong");
    valueNode.textContent = value;

    chip.append(head, valueNode);
    return chip;
  }

  function createLessonIcon(kind, size = 14) {
    const icon = document.createElement("span");
    icon.className = `lesson-icon lesson-icon-${asText(kind, "spark")}`;
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = getLessonIconSvg(kind);

    const svg = icon.querySelector("svg");
    if (svg instanceof SVGElement) {
      svg.setAttribute("width", String(size));
      svg.setAttribute("height", String(size));
    }

    return icon;
  }

  function getLessonIconSvg(kind) {
    const key = asText(kind, "spark");
    const icons = {
      spark:
        '<svg viewBox="0 0 24 24" fill="none"><path d="M12 4l1.8 4.5L18 10l-4.2 1.6L12 16l-1.8-4.4L6 10l4.2-1.5L12 4z"></path></svg>',
      book:
        '<svg viewBox="0 0 24 24" fill="none"><path d="M5 4.5h9a3 3 0 0 1 3 3V20H8a3 3 0 0 0-3 3"></path><path d="M8 4.5v18"></path></svg>',
      layers:
        '<svg viewBox="0 0 24 24" fill="none"><path d="M12 4l8 4-8 4-8-4 8-4z"></path><path d="M4 12l8 4 8-4"></path></svg>',
      check:
        '<svg viewBox="0 0 24 24" fill="none"><path d="M4.5 12l4 4L19 6.5"></path></svg>',
      grid:
        '<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="7" height="7" rx="1.5"></rect><rect x="13" y="4" width="7" height="7" rx="1.5"></rect><rect x="4" y="13" width="7" height="7" rx="1.5"></rect><rect x="13" y="13" width="7" height="7" rx="1.5"></rect></svg>',
      plus:
        '<svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>',
      map:
        '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="5.5" r="2"></circle><circle cx="5.5" cy="17" r="2"></circle><circle cx="18.5" cy="17" r="2"></circle><path d="M12 7.5V12"></path><path d="M6.9 15.9l3.8-2.5"></path><path d="M17.1 15.9L13.3 13.4"></path></svg>'
    };

    return icons[key] || icons.spark;
  }

  function getChapterAverageDifficulty(chapter) {
    const questions = Array.isArray(chapter?.questions) ? chapter.questions : [];
    if (!questions.length) {
      return null;
    }
    const cached = chapterAverageDifficultyCache.get(chapter);
    if (
      cached &&
      cached.revision === subjectsRevision &&
      cached.questionCount === questions.length &&
      cached.value !== undefined
    ) {
      return cached.value;
    }

    const total = questions.reduce((sum, item) => sum + clampNumber(item?.difficulty, 1, 5, 3), 0);
    const value = total / questions.length;
    chapterAverageDifficultyCache.set(chapter, {
      revision: subjectsRevision,
      questionCount: questions.length,
      value
    });
    return value;
  }

  function getSubjectSummaryMetrics(subject) {
    const chapters = Array.isArray(subject?.chapters) ? subject.chapters : [];
    if (!subject || !chapters.length) {
      return {
        totalChapters: 0,
        loadedChapters: 0,
        totalQuestions: 0,
        averageDifficulty: null,
        averageDifficultyText: "-"
      };
    }

    const cached = subjectSummaryCache.get(subject);
    if (
      cached &&
      cached.revision === subjectsRevision &&
      cached.chapterCount === chapters.length
    ) {
      return cached.value;
    }

    let loadedChapters = 0;
    let totalQuestions = 0;
    let difficultyTotal = 0;
    let difficultyCount = 0;

    chapters.forEach((chapter) => {
      if (chapter?.questionsLoaded) {
        loadedChapters += 1;
      }

      const questions = Array.isArray(chapter?.questions) ? chapter.questions : [];
      totalQuestions += questions.length;

      questions.forEach((question) => {
        difficultyTotal += clampNumber(question?.difficulty, 1, 5, 3);
      });
      difficultyCount += questions.length;
    });

    const averageDifficulty = difficultyCount ? difficultyTotal / difficultyCount : null;
    const value = {
      totalChapters: chapters.length,
      loadedChapters,
      totalQuestions,
      averageDifficulty,
      averageDifficultyText: averageDifficulty === null ? "-" : averageDifficulty.toFixed(1)
    };

    subjectSummaryCache.set(subject, {
      revision: subjectsRevision,
      chapterCount: chapters.length,
      value
    });

    return value;
  }

  function createFilterResetBar(subjectId, chapterId) {
    const bar = document.createElement("div");
    bar.className = "qb-empty-reset-row";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "qb-clear-btn";
    button.dataset.action = "bank-clear-filters";
    button.dataset.subjectId = subjectId;
    button.dataset.chapterId = chapterId;
    button.textContent = "بازنشانی فیلترها";

    bar.append(button);
    return bar;
  }

  function countActiveBankFilters(uiState) {
    if (!uiState) {
      return 0;
    }

    let count = 0;
    if (asText(uiState.query, "").trim()) {
      count += 1;
    }
    if (uiState.difficultyStars instanceof Set && uiState.difficultyStars.size) {
      count += 1;
    }
    if (normalizeBankTopicKey(uiState.topicKey) !== "all") {
      count += 1;
    }
    if (normalizeSolvedFilterMode(uiState.solvedMode) !== "all") {
      count += 1;
    }
    if (normalizeReviewFilterMode(uiState.reviewMode) !== "all") {
      count += 1;
    }
    if (normalizeBankSortMode(uiState.sortMode) !== "default") {
      count += 1;
    }
    return count;
  }

  function syncActiveFilterChipsExpansion(uiState, previousActiveCount = 0) {
    if (!uiState) {
      return;
    }

    const prevCount = Math.max(0, Number(previousActiveCount) || 0);
    const nextCount = countActiveBankFilters(uiState);

    if (nextCount <= 0) {
      uiState.activeFilterChipsExpanded = false;
      return;
    }

    if (prevCount <= 0 && nextCount > 0) {
      uiState.activeFilterChipsExpanded = true;
      return;
    }

    if (typeof uiState.activeFilterChipsExpanded !== "boolean") {
      uiState.activeFilterChipsExpanded = true;
    }
  }

  function normalizeSolvedFilterMode(value) {
    const safe = asText(value, "all");
    return safe === "solved" || safe === "unsolved" ? safe : "all";
  }

  function normalizeBankSortMode(value) {
    const safe = asText(value, "default");
    const allowed = new Set(["default", "difficulty-desc", "difficulty-asc"]);
    return allowed.has(safe) ? safe : "default";
  }

  function sortBankQuestions(questions, sortMode) {
    const mode = normalizeBankSortMode(sortMode);
    if (mode === "default") {
      return questions;
    }

    const sorted = questions.slice();

    sorted.sort((a, b) => {
      const difficultyA = clampNumber(a?.difficulty, 1, 5, 3);
      const difficultyB = clampNumber(b?.difficulty, 1, 5, 3);
      const lengthA = getQuestionNormalizedTextLength(a);
      const lengthB = getQuestionNormalizedTextLength(b);

      if (mode === "difficulty-desc") {
        return difficultyB - difficultyA || lengthB - lengthA;
      }
      if (mode === "difficulty-asc") {
        return difficultyA - difficultyB || lengthA - lengthB;
      }
      return 0;
    });

    return sorted;
  }

  function getQuestionNormalizedTextLength(question) {
    if (!question || typeof question !== "object") {
      return 0;
    }

    const sourceText = asText(question?.question_text, asText(question?.question, ""));
    const cached = questionNormalizedLengthCache.get(question);
    if (cached && cached.sourceText === sourceText) {
      return cached.length;
    }

    const length = sourceText.replace(/\s+/g, "").length;
    questionNormalizedLengthCache.set(question, { sourceText, length });
    return length;
  }

  function createPager(currentPage, totalPages, prevAction, nextAction) {
    const pager = document.createElement("nav");
    pager.className = "pagination";

    const prev = document.createElement("button");
    prev.type = "button";
    prev.dataset.action = prevAction;
    prev.textContent = "قبلی";
    prev.disabled = currentPage <= 1;

    const info = document.createElement("span");
    info.className = "pager-info";
    info.textContent = `${currentPage} / ${totalPages}`;

    const next = document.createElement("button");
    next.type = "button";
    next.dataset.action = nextAction;
    next.textContent = "بعدی";
    next.disabled = currentPage >= totalPages;

    pager.append(prev, info, next);
    return pager;
  }

  function createEmptyState(text) {
    const empty = document.createElement("div");
    empty.className = "empty-state premium-empty-state";
    empty.innerHTML =
      '<svg viewBox="0 0 120 90" aria-hidden="true"><rect x="12" y="20" width="96" height="58" rx="10"></rect><path d="M24 36h72"></path><path d="M24 50h45"></path><circle cx="88" cy="50" r="9"></circle><path d="M84 50h8"></path><path d="M88 46v8"></path></svg>';
    const label = document.createElement("p");
    label.textContent = text;
    empty.append(label);
    return empty;
  }

  function createLoader(text) {
    const loader = document.createElement("div");
    loader.className = "loader";
    loader.textContent = text;
    return loader;
  }

  function createQuestionFilterBar(subjectId, chapterId, uiState) {
    const filterBar = document.createElement("section");
    filterBar.className = "qb-filter-bar qb-filter-pill-mode qb-filter-layout-v2";

    const topicOptions = getChapterTopicOptions(subjectId, chapterId);
    const currentTopicKey = normalizeBankTopicKey(uiState.topicKey);
    const currentTopicLabel = resolveTopicLabelByKey(topicOptions, currentTopicKey);
    const currentSolvedMode = normalizeSolvedFilterMode(uiState.solvedMode);
    const currentReviewMode = normalizeReviewFilterMode(uiState.reviewMode);
    const currentSortMode = normalizeBankSortMode(uiState.sortMode);
    const activeFilterCount = countActiveBankFilters(uiState);
    const hasActiveFilterChips = activeFilterCount > 0;
    const filtersCollapsed = uiState.bankFiltersCollapsed === true;
    const chipsExpanded = hasActiveFilterChips ? uiState.activeFilterChipsExpanded !== false : false;
    const chipsRowId = `qb-active-chips-${asText(subjectId, "").replace(/[^a-zA-Z0-9_-]/g, "")}-${asText(
      chapterId,
      ""
    ).replace(/[^a-zA-Z0-9_-]/g, "")}`;
    const collapseBodyId = `qb-filter-collapse-${asText(subjectId, "").replace(/[^a-zA-Z0-9_-]/g, "")}-${asText(
      chapterId,
      ""
    ).replace(/[^a-zA-Z0-9_-]/g, "")}`;
    const chapter = findChapterByIds(subjectId, chapterId);
    const reviewCounts = getChapterReviewStatusCounts(subjectId, chapterId, chapter?.questions || []);

    const primaryRow = document.createElement("div");
    primaryRow.className = "qb-filter-row-primary";

    const searchWrap = document.createElement("label");
    searchWrap.className = "qb-search-wrap qb-search-wrap-primary";

    const searchIcon = document.createElement("span");
    searchIcon.className = "qb-filter-icon";
    searchIcon.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-3.5-3.5"></path></svg>';

    const searchInput = document.createElement("input");
    searchInput.type = "search";
    searchInput.className = "qb-search-input";
    searchInput.placeholder = "جستجو در متن سوال...";
    searchInput.value = asText(uiState.query, "");
    searchInput.dataset.action = "bank-search";
    searchInput.dataset.subjectId = subjectId;
    searchInput.dataset.chapterId = chapterId;
    searchInput.autocomplete = "off";

    searchWrap.append(searchIcon, searchInput);

    const rowActions = document.createElement("div");
    rowActions.className = "qb-filter-row-actions";

    const activeCountPill = document.createElement("button");
    activeCountPill.type = "button";
    activeCountPill.className = "qb-filter-active-count qb-filter-active-toggle";
    activeCountPill.dataset.action = "bank-toggle-active-filters";
    activeCountPill.dataset.subjectId = subjectId;
    activeCountPill.dataset.chapterId = chapterId;
    activeCountPill.disabled = !hasActiveFilterChips || filtersCollapsed;
    activeCountPill.setAttribute("aria-expanded", chipsExpanded ? "true" : "false");
    activeCountPill.setAttribute("aria-controls", chipsRowId);
    activeCountPill.setAttribute("aria-label", hasActiveFilterChips ? "باز و بسته کردن فیلترهای انتخابی" : "فیلتر فعالی وجود ندارد");
    activeCountPill.innerHTML = `<span>فیلتر فعال: ${activeFilterCount}</span><i class="qb-filter-toggle-caret" aria-hidden="true"></i>`;

    const panelToggleBtn = document.createElement("button");
    panelToggleBtn.type = "button";
    panelToggleBtn.className = "qb-filter-active-count qb-filter-active-toggle qb-filter-panel-toggle";
    panelToggleBtn.dataset.action = "bank-toggle-filters-panel";
    panelToggleBtn.dataset.subjectId = subjectId;
    panelToggleBtn.dataset.chapterId = chapterId;
    panelToggleBtn.setAttribute("aria-expanded", filtersCollapsed ? "false" : "true");
    panelToggleBtn.setAttribute("aria-controls", collapseBodyId);
    panelToggleBtn.setAttribute("aria-label", filtersCollapsed ? "باز کردن پنل فیلترها" : "بستن پنل فیلترها");
    panelToggleBtn.innerHTML = `<span>${filtersCollapsed ? "نمایش فیلترها" : "بستن فیلترها"}</span><i class="qb-filter-toggle-caret" aria-hidden="true"></i>`;

    const clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.className = "qb-clear-btn qb-clear-btn-compact";
    clearBtn.dataset.action = "bank-clear-filters";
    clearBtn.dataset.subjectId = subjectId;
    clearBtn.dataset.chapterId = chapterId;
    clearBtn.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14"></path><path d="M19 5L5 19"></path></svg><span>پاکسازی</span>';

    rowActions.append(panelToggleBtn, activeCountPill, clearBtn);
    primaryRow.append(searchWrap, rowActions);

    const activeChipsRow = createActiveFilterChipsRow({
      subjectId,
      chapterId,
      uiState,
      topicLabel: currentTopicLabel,
      expanded: chipsExpanded,
      hideWhenEmpty: true
    });
    activeChipsRow.id = chipsRowId;

    const groupsGrid = document.createElement("section");
    groupsGrid.className = "qb-filter-groups-grid";

    const sortModeLabelMap = {
      default: "پیش فرض",
      "difficulty-desc": "سخت",
      "difficulty-asc": "آسان"
    };
    const solvedModeLabelMap = {
      all: "همه",
      solved: "حل شده",
      unsolved: "حل نشده"
    };
    const reviewModeLabel =
      currentReviewMode === "none" ? "بدون وضعیت" : currentReviewMode === "all" ? "همه" : getReviewStatusLabel(currentReviewMode);

    const luxCard = document.createElement("article");
    luxCard.className = "qb-filter-group-card qb-lux-triple-card is-wide";

    const luxGrid = document.createElement("div");
    luxGrid.className = "qb-lux-triple-grid";

    const sortGroup = document.createElement("div");
    sortGroup.className = "qb-sort-group";
    [
      {
        mode: "default",
        label: "پیش فرض",
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 7h12"></path><path d="M6 12h12"></path><path d="M6 17h12"></path></svg>'
      },
      {
        mode: "difficulty-desc",
        label: "سخت",
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 16l4-4 4 4"></path><path d="M12 8v8"></path></svg>'
      },
      {
        mode: "difficulty-asc",
        label: "آسان",
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 12l4 4 4-4"></path><path d="M12 16V8"></path></svg>'
      }
    ].forEach((item) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = `qb-sort-chip${currentSortMode === item.mode ? " is-active" : ""}`;
      chip.dataset.action = "bank-sort-mode";
      chip.dataset.subjectId = subjectId;
      chip.dataset.chapterId = chapterId;
      chip.dataset.mode = item.mode;
      chip.innerHTML = `${item.icon}<span>${item.label}</span>`;
      sortGroup.append(chip);
    });

    const solvedGroup = document.createElement("div");
    solvedGroup.className = "qb-solved-group";
    [
      { mode: "all", label: "همه" },
      { mode: "solved", label: "حل شده" },
      { mode: "unsolved", label: "حل نشده" }
    ].forEach((item) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = `qb-solved-chip${currentSolvedMode === item.mode ? " is-active" : ""}`;
      chip.dataset.action = "bank-solved-filter";
      chip.dataset.subjectId = subjectId;
      chip.dataset.chapterId = chapterId;
      chip.dataset.mode = item.mode;
      chip.textContent = item.label;
      solvedGroup.append(chip);
    });

    const reviewGroup = document.createElement("div");
    reviewGroup.className = "qb-review-group";
    [
      { mode: "all", label: "همه" },
      { mode: "review", label: "مرور" },
      { mode: "key", label: "کلیدی" },
      { mode: "mastered", label: "مسلط" },
      { mode: "none", label: "بدون وضعیت" }
    ].forEach((item) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = `qb-review-chip${currentReviewMode === item.mode ? " is-active" : ""}`;
      chip.dataset.action = "bank-review-filter";
      chip.dataset.subjectId = subjectId;
      chip.dataset.chapterId = chapterId;
      chip.dataset.mode = item.mode;
      chip.textContent = item.label;
      reviewGroup.append(chip);
    });

    const reviewCounters = document.createElement("div");
    reviewCounters.className = "qb-review-counters";
    [
      { kind: "review", label: "مرور", count: reviewCounts.review },
      { kind: "key", label: "کلیدی", count: reviewCounts.key },
      { kind: "mastered", label: "مسلط", count: reviewCounts.mastered }
    ].forEach((item) => {
      const counter = document.createElement("span");
      counter.className = `qb-review-counter qb-review-counter-${item.kind}`;
      const labelNode = document.createElement("em");
      labelNode.textContent = item.label;
      const countNode = document.createElement("strong");
      countNode.dataset.role = "bank-review-counter";
      countNode.dataset.subjectId = subjectId;
      countNode.dataset.chapterId = chapterId;
      countNode.dataset.kind = item.kind;
      countNode.textContent = String(item.count);
      counter.append(labelNode, countNode);
      reviewCounters.append(counter);
    });

    luxGrid.append(
      createLuxFilterPanel({
        panelClass: "is-sort",
        title: "مرتب‌سازی",
        subtitle: `فعال: ${sortModeLabelMap[currentSortMode] || "پیش فرض"}`,
        icon:
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 6h10"></path><path d="M9 12h8"></path><path d="M11 18h6"></path></svg>',
        controls: sortGroup
      }),
      createLuxFilterPanel({
        panelClass: "is-solved",
        title: "وضعیت حل",
        subtitle: `فعال: ${solvedModeLabelMap[currentSolvedMode] || "همه"}`,
        icon:
          '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"></circle><path d="M9 12l2 2 4-4"></path></svg>',
        controls: solvedGroup
      }),
      createLuxFilterPanel({
        panelClass: "is-review",
        title: "وضعیت مرور",
        subtitle: `فعال: ${reviewModeLabel}`,
        icon:
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h12"></path><path d="M12 6v12"></path><circle cx="12" cy="12" r="8"></circle></svg>',
        controls: reviewGroup,
        footer: reviewCounters
      })
    );

    luxCard.append(luxGrid);
    groupsGrid.append(luxCard);

    const topicBody = document.createElement("div");
    topicBody.className = "qb-filter-topic-body";

    const topicSelectWrap = document.createElement("label");
    topicSelectWrap.className = "qb-filter-topic-select-wrap";
    const topicSelectLabel = document.createElement("span");
    topicSelectLabel.className = "qb-filter-topic-select-label";
    topicSelectLabel.textContent = "نوع / روش سوال";

    const topicSelect = document.createElement("select");
    topicSelect.className = "qb-topic-select";
    topicSelect.dataset.action = "bank-topic-filter";
    topicSelect.dataset.subjectId = subjectId;
    topicSelect.dataset.chapterId = chapterId;
    topicSelect.setAttribute("aria-label", "فیلتر نوع و روش سوال");
    const allTopicOption = document.createElement("option");
    allTopicOption.value = "all";
    allTopicOption.textContent = "همه نوع‌ها";
    topicSelect.append(allTopicOption);
    topicOptions.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.key;
      option.textContent = item.count > 0 ? `${item.label} (${item.count})` : item.label;
      topicSelect.append(option);
    });
    topicSelect.value = topicOptions.some((item) => item.key === currentTopicKey) ? currentTopicKey : "all";
    topicSelectWrap.append(topicSelectLabel, topicSelect);

    const topicQuick = document.createElement("div");
    topicQuick.className = "qb-topic-quick";
    const quickMap = new Map();
    quickMap.set("all", { key: "all", label: "همه" });
    topicOptions
      .slice()
      .sort((a, b) => (Number(b?.count) || 0) - (Number(a?.count) || 0))
      .slice(0, 6)
      .forEach((item) => {
        if (!item?.key || quickMap.has(item.key)) {
          return;
        }
        quickMap.set(item.key, { key: item.key, label: item.label });
      });
    if (currentTopicKey !== "all" && !quickMap.has(currentTopicKey)) {
      quickMap.set(currentTopicKey, { key: currentTopicKey, label: currentTopicLabel });
    }
    Array.from(quickMap.values()).forEach((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `qb-topic-quick-btn${item.key === currentTopicKey ? " is-active" : ""}`;
      button.dataset.action = "bank-topic-quick";
      button.dataset.subjectId = subjectId;
      button.dataset.chapterId = chapterId;
      button.dataset.topicKey = item.key;
      button.textContent = item.label;
      topicQuick.append(button);
    });

    topicBody.append(topicSelectWrap, topicQuick);
    groupsGrid.append(
      createFilterGroupCard({
        title: "نوع / روش سوال",
        icon:
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16"></path><path d="M6 12h12"></path><path d="M8 18h8"></path></svg>',
        body: topicBody,
        wide: true
      })
    );

    const difficultyStrip = document.createElement("div");
    difficultyStrip.className = "qb-filter-difficulty-strip";

    const difficultyCaption = document.createElement("span");
    difficultyCaption.className = "qb-filter-strip-label";
    difficultyCaption.textContent = "سطح سختی";

    const pillGroup = document.createElement("div");
    pillGroup.className = "qb-pill-group";
    for (let star = 1; star <= 5; star += 1) {
      const pill = document.createElement("button");
      pill.type = "button";
      pill.className = `qb-pill${uiState.difficultyStars.has(star) ? " is-active" : ""}`;
      pill.dataset.action = "toggle-difficulty-pill";
      pill.dataset.subjectId = subjectId;
      pill.dataset.chapterId = chapterId;
      pill.dataset.star = String(star);
      pill.textContent = `${"★".repeat(star)}${"☆".repeat(5 - star)}`;
      pillGroup.append(pill);
    }
    difficultyStrip.append(difficultyCaption, pillGroup);

    const filterBody = document.createElement("div");
    filterBody.className = "qb-filter-collapse-body";
    filterBody.id = collapseBodyId;
    filterBody.hidden = filtersCollapsed;
    if (filtersCollapsed) {
      filterBody.classList.add("is-collapsed");
    }
    filterBody.append(activeChipsRow, groupsGrid, difficultyStrip);

    filterBar.append(primaryRow, filterBody);
    return filterBar;
  }

  function createFilterGroupCard({ title, icon, body, wide = false }) {
    const card = document.createElement("article");
    card.className = `qb-filter-group-card${wide ? " is-wide" : ""}`;

    const head = document.createElement("header");
    head.className = "qb-filter-group-head";

    const titleNode = document.createElement("h5");
    titleNode.className = "qb-filter-group-title";
    titleNode.innerHTML = `${icon}<span>${title}</span>`;
    head.append(titleNode);

    const content = document.createElement("div");
    content.className = "qb-filter-group-body";
    if (body instanceof HTMLElement) {
      content.append(body);
    }

    card.append(head, content);
    return card;
  }

  function createLuxFilterPanel({ title, subtitle = "", icon, controls, footer = null, panelClass = "" }) {
    const section = document.createElement("section");
    section.className = `qb-lux-filter-panel${panelClass ? ` ${panelClass}` : ""}`;

    const head = document.createElement("header");
    head.className = "qb-lux-filter-head";

    const titleWrap = document.createElement("div");
    titleWrap.className = "qb-lux-filter-title-wrap";

    const titleNode = document.createElement("h6");
    titleNode.className = "qb-lux-filter-title";
    titleNode.innerHTML = `${icon}<span>${title}</span>`;

    const subtitleNode = document.createElement("span");
    subtitleNode.className = "qb-lux-filter-subtitle";
    subtitleNode.textContent = asText(subtitle, "");

    titleWrap.append(titleNode, subtitleNode);
    head.append(titleWrap);

    const body = document.createElement("div");
    body.className = "qb-lux-filter-controls";
    if (controls instanceof HTMLElement) {
      body.append(controls);
    }

    section.append(head, body);
    if (footer instanceof HTMLElement) {
      const foot = document.createElement("div");
      foot.className = "qb-lux-filter-foot";
      foot.append(footer);
      section.append(foot);
    }

    return section;
  }

  function createActiveFilterChipsRow({
    subjectId,
    chapterId,
    uiState,
    topicLabel,
    expanded = true,
    hideWhenEmpty = false
  }) {
    const row = document.createElement("div");
    row.className = "qb-active-chips-row";
    row.setAttribute("aria-live", "polite");

    const chips = [];
    const query = asText(uiState.query, "").trim();
    const solvedMode = normalizeSolvedFilterMode(uiState.solvedMode);
    const reviewMode = normalizeReviewFilterMode(uiState.reviewMode);
    const sortMode = normalizeBankSortMode(uiState.sortMode);
    const topicKey = normalizeBankTopicKey(uiState.topicKey);
    const difficultyStars =
      uiState.difficultyStars instanceof Set
        ? Array.from(uiState.difficultyStars).filter((star) => star >= 1 && star <= 5).sort((a, b) => a - b)
        : [];

    if (query) {
      const safeQuery = query.length > 28 ? `${query.slice(0, 28)}...` : query;
      chips.push({ type: "query", label: `جستجو: ${safeQuery}` });
    }

    difficultyStars.forEach((star) => {
      chips.push({
        type: "difficulty",
        value: String(star),
        label: `سختی ${"★".repeat(star)}`
      });
    });

    if (topicKey !== "all") {
      chips.push({ type: "topic", label: `نوع: ${asText(topicLabel, "نوع/روش")}` });
    }

    if (solvedMode !== "all") {
      chips.push({
        type: "solved",
        label: solvedMode === "solved" ? "وضعیت حل: حل شده" : "وضعیت حل: حل نشده"
      });
    }

    if (reviewMode !== "all") {
      const reviewLabel = reviewMode === "none" ? "بدون وضعیت" : getReviewStatusLabel(reviewMode);
      chips.push({ type: "review", label: `وضعیت مرور: ${reviewLabel}` });
    }

    if (sortMode !== "default") {
      const sortLabel = sortMode === "difficulty-desc" ? "مرتب‌سازی: سخت" : "مرتب‌سازی: آسان";
      chips.push({ type: "sort", label: sortLabel });
    }

    if (!chips.length) {
      row.hidden = !!hideWhenEmpty;
      const placeholder = document.createElement("span");
      placeholder.className = "qb-active-chip-placeholder";
      placeholder.textContent = "فیلتر فعالی انتخاب نشده است.";
      row.append(placeholder);
      row.classList.add("is-empty");
      return row;
    }

    chips.forEach((chip) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "qb-active-chip";
      button.dataset.action = "bank-remove-filter-chip";
      button.dataset.subjectId = subjectId;
      button.dataset.chapterId = chapterId;
      button.dataset.filterType = chip.type;
      if (chip.value) {
        button.dataset.value = chip.value;
      }
      button.innerHTML = `<span>${chip.label}</span><i aria-hidden="true">×</i>`;
      row.append(button);
    });

    if (!expanded) {
      row.hidden = true;
      row.classList.add("is-collapsed");
    }

    return row;
  }

  function createBulkDeleteBar(subjectId, chapterId, selectedCount) {
    const bar = document.createElement("section");
    bar.className = `bulk-delete-bar${selectedCount > 0 ? " is-active" : ""}`;
    bar.dataset.subjectId = subjectId;
    bar.dataset.chapterId = chapterId;

    const count = document.createElement("span");
    count.className = "bulk-delete-count";
    count.textContent = selectedCount > 0 ? `${selectedCount} سوال انتخاب شده` : "هیچ سوالی انتخاب نشده است";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "bulk-delete-btn";
    button.dataset.action = "delete-selected-questions";
    button.dataset.subjectId = subjectId;
    button.dataset.chapterId = chapterId;
    button.disabled = selectedCount <= 0;
    button.textContent = "حذف موارد انتخاب شده";

    bar.append(count, button);
    return bar;
  }

  function createQuestionDangerZone(subjectId, chapterId, totalCount) {
    const wrap = document.createElement("section");
    wrap.className = "question-danger-zone";
    wrap.dataset.subjectId = subjectId;
    wrap.dataset.chapterId = chapterId;

    const copy = document.createElement("div");
    copy.className = "question-danger-copy";

    const title = document.createElement("strong");
    title.textContent = "حذف کامل سوالات فصل";

    const subtitle = document.createElement("span");
    subtitle.textContent = `${Math.max(0, Number(totalCount) || 0)} سوال در این فصل ثبت شده است.`;
    copy.append(title, subtitle);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "bulk-delete-btn bulk-delete-btn-danger";
    button.dataset.action = "delete-all-questions";
    button.dataset.subjectId = subjectId;
    button.dataset.chapterId = chapterId;
    button.textContent = "حذف کامل سوالات";

    wrap.append(copy, button);
    return wrap;
  }

  function createDeleteIconButton(action, ids = {}) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `icon-delete-btn${action === "request-delete-question" ? " icon-delete-btn-inline" : ""}`;
    button.dataset.action = action;
    button.setAttribute("aria-label", "حذف");
    button.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"></path><path d="M8 6V4h8v2"></path><path d="M7 6l1 14h8l1-14"></path><path d="M10 10v7"></path><path d="M14 10v7"></path></svg>';

    Object.entries(ids).forEach(([key, value]) => {
      button.dataset[key] = value;
    });

    return button;
  }

  function createQuestionEditToggleButton(subjectId, chapterId, questionId, expanded = false) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `icon-edit-btn-inline${expanded ? " is-active" : ""}`;
    button.dataset.action = "toggle-question-edit";
    button.dataset.subjectId = subjectId;
    button.dataset.chapterId = chapterId;
    button.dataset.questionId = questionId;
    button.setAttribute("aria-label", expanded ? "بستن ویرایش سوال" : "ویرایش سوال");
    button.setAttribute("aria-expanded", expanded ? "true" : "false");
    button.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l4.2-1 9.7-9.8-3.2-3.2L5 15.8z"></path><path d="M13.8 6.2l3.2 3.2"></path><path d="M4 20h16"></path></svg>';
    return button;
  }

  function stringifyQuestionAssetsForInlineEdit(question) {
    const assets = normalizeQuestionAssetPayload(question);
    if (!assets.length) {
      return "[]";
    }
    try {
      return JSON.stringify(assets, null, 2);
    } catch {
      return "[]";
    }
  }

  function createQuestionInlineEditForm({ subjectId, chapterId, question }) {
    const form = document.createElement("form");
    form.className = "question-edit-form";
    form.dataset.action = "save-question-edit";
    form.dataset.subjectId = subjectId;
    form.dataset.chapterId = chapterId;
    form.dataset.questionId = question.id;

    const head = document.createElement("div");
    head.className = "question-edit-head";

    const title = document.createElement("strong");
    title.textContent = "ویرایش سریع سوال";

    const helper = document.createElement("span");
    helper.textContent = "صورت سوال، راهنما، حل و assets را ویرایش کنید.";
    head.append(title, helper);

    const compactGrid = document.createElement("div");
    compactGrid.className = "question-edit-grid";

    const topicField = document.createElement("label");
    topicField.className = "question-edit-field";
    topicField.innerHTML = '<span>مبحث</span>';
    const topicInput = document.createElement("input");
    topicInput.type = "text";
    topicInput.name = "topic";
    topicInput.maxLength = 120;
    topicInput.value = asText(question?.topic, "");
    topicField.append(topicInput);

    const methodField = document.createElement("label");
    methodField.className = "question-edit-field";
    methodField.innerHTML = '<span>روش حل</span>';
    const methodInput = document.createElement("input");
    methodInput.type = "text";
    methodInput.name = "method";
    methodInput.maxLength = 160;
    methodInput.value = asText(question?.method, "");
    methodField.append(methodInput);

    const difficultyField = document.createElement("label");
    difficultyField.className = "question-edit-field";
    difficultyField.innerHTML = '<span>سختی</span>';
    const difficultySelect = document.createElement("select");
    difficultySelect.name = "difficulty";
    const safeDifficulty = clampNumber(question?.difficulty, 1, 5, 3);
    for (let level = 1; level <= 5; level += 1) {
      const option = document.createElement("option");
      option.value = String(level);
      option.textContent = `${level} - ${renderDifficultyStars(level)}`;
      option.selected = level === safeDifficulty;
      difficultySelect.append(option);
    }
    difficultyField.append(difficultySelect);

    const solvedField = document.createElement("label");
    solvedField.className = "question-edit-check";
    const solvedInput = document.createElement("input");
    solvedInput.type = "checkbox";
    solvedInput.name = "solved";
    solvedInput.value = "1";
    solvedInput.checked = resolveQuestionSolvedFlag(question);
    const solvedText = document.createElement("span");
    solvedText.textContent = "وضعیت حل‌شده";
    solvedField.append(solvedInput, solvedText);

    compactGrid.append(topicField, methodField, difficultyField, solvedField);

    const questionField = document.createElement("label");
    questionField.className = "question-edit-field question-edit-field-block";
    questionField.innerHTML = '<span>صورت سوال</span>';
    const questionTextarea = document.createElement("textarea");
    questionTextarea.name = "question";
    questionTextarea.rows = 4;
    questionTextarea.required = true;
    questionTextarea.value = asText(question?.question_text, asText(question?.question, ""));
    questionField.append(questionTextarea);

    const hintField = document.createElement("label");
    hintField.className = "question-edit-field question-edit-field-block";
    hintField.innerHTML = '<span>راهنما</span>';
    const hintTextarea = document.createElement("textarea");
    hintTextarea.name = "hint";
    hintTextarea.rows = 3;
    hintTextarea.value = asText(question?.hint, "");
    hintField.append(hintTextarea);

    const solutionField = document.createElement("label");
    solutionField.className = "question-edit-field question-edit-field-block";
    solutionField.innerHTML = '<span>پاسخ / راه‌حل</span>';
    const solutionTextarea = document.createElement("textarea");
    solutionTextarea.name = "solution";
    solutionTextarea.rows = 4;
    solutionTextarea.value = asText(question?.solution, asText(question?.step_by_step_solution, ""));
    solutionField.append(solutionTextarea);

    const assetsField = document.createElement("label");
    assetsField.className = "question-edit-field question-edit-field-block question-edit-field-assets";
    assetsField.innerHTML = '<span>تصاویر سوال (assets JSON)</span>';

    const assetsTextarea = document.createElement("textarea");
    assetsTextarea.name = "assets";
    assetsTextarea.rows = 6;
    assetsTextarea.dir = "ltr";
    assetsTextarea.spellcheck = false;
    assetsTextarea.value = stringifyQuestionAssetsForInlineEdit(question);
    assetsField.append(assetsTextarea);

    const assetsHint = document.createElement("small");
    assetsHint.className = "question-edit-field-hint";
    assetsHint.innerHTML =
      'در صورت سوال از <code>[[img:1]]</code> استفاده کن. برای هر تصویر در <code>assets</code> یک آیتم <code>mode=url</code> یا <code>mode=pdf-crop</code> بگذار.';
    assetsField.append(assetsHint);

    const assetsTools = document.createElement("div");
    assetsTools.className = "question-edit-assets-tools";

    const sourcePdfButton = document.createElement("button");
    sourcePdfButton.type = "button";
    sourcePdfButton.className = "question-edit-assets-btn";
    sourcePdfButton.dataset.action = "open-question-pdf-source";
    sourcePdfButton.textContent = "انتخاب فایل مرجع";

    const clearAssetsButton = document.createElement("button");
    clearAssetsButton.type = "button";
    clearAssetsButton.className = "question-edit-assets-btn ghost";
    clearAssetsButton.textContent = "پاک‌سازی assets";
    clearAssetsButton.addEventListener("click", () => {
      assetsTextarea.value = "[]";
      assetsTextarea.focus();
    });

    assetsTools.append(sourcePdfButton, clearAssetsButton);
    assetsField.append(assetsTools);

    const actions = document.createElement("div");
    actions.className = "question-edit-actions";

    const saveButton = document.createElement("button");
    saveButton.type = "submit";
    saveButton.className = "question-edit-btn question-edit-btn-save";
    saveButton.textContent = "ذخیره تغییرات";

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className = "question-edit-btn question-edit-btn-cancel";
    cancelButton.dataset.action = "cancel-question-edit";
    cancelButton.dataset.subjectId = subjectId;
    cancelButton.dataset.chapterId = chapterId;
    cancelButton.dataset.questionId = question.id;
    cancelButton.textContent = "انصراف";

    actions.append(saveButton, cancelButton);
    form.append(head, compactGrid, questionField, hintField, solutionField, assetsField, actions);
    return form;
  }

  function createChapterMoveButton(action, subjectId, chapterId, disabled = false) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "icon-order-btn";
    button.dataset.action = action;
    button.dataset.subjectId = subjectId;
    button.dataset.chapterId = chapterId;
    button.disabled = !!disabled;
    button.setAttribute("aria-label", action === "move-chapter-up" ? "انتقال فصل به بالا" : "انتقال فصل به پایین");
    button.innerHTML =
      action === "move-chapter-up"
        ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5l-6 6"></path><path d="M12 5l6 6"></path><path d="M12 6v13"></path></svg>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19l-6-6"></path><path d="M12 19l6-6"></path><path d="M12 5v13"></path></svg>';
    return button;
  }

  function createQuestionSelectControl({ subjectId, chapterId, questionId, checked }) {
    const label = document.createElement("label");
    label.className = "qb-check";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.className = "qb-check-input";
    input.dataset.action = "toggle-question-select";
    input.dataset.subjectId = subjectId;
    input.dataset.chapterId = chapterId;
    input.dataset.questionId = questionId;
    input.checked = !!checked;
    input.setAttribute("aria-label", "انتخاب سوال");

    const ui = document.createElement("span");
    ui.className = "qb-check-ui";
    ui.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l4 4 10-10"></path></svg>';

    label.append(input, ui);
    return label;
  }

  function getChapterUiState(subjectId, chapterId) {
    const key = `${subjectId}::${chapterId}`;
    if (!chapterUiState.has(key)) {
      chapterUiState.set(key, {
        query: "",
        difficultyStars: new Set(),
        topicKey: "all",
        solvedMode: "all",
        reviewMode: "all",
        sortMode: "default",
        bankFiltersCollapsed: true,
        activeFilterChipsExpanded: true,
        selectedIds: new Set(),
        questionTimers: new Map(),
        activeQuestionTimerId: "",
        editingQuestionId: ""
      });
    }

    const stateRef = chapterUiState.get(key);
    if (!(stateRef.difficultyStars instanceof Set)) {
      stateRef.difficultyStars = new Set();
    }
    if (!(stateRef.selectedIds instanceof Set)) {
      stateRef.selectedIds = new Set();
    }
    if (!(stateRef.questionTimers instanceof Map)) {
      stateRef.questionTimers = new Map();
    }
    if (typeof stateRef.activeQuestionTimerId !== "string") {
      stateRef.activeQuestionTimerId = "";
    }
    if (typeof stateRef.editingQuestionId !== "string") {
      stateRef.editingQuestionId = "";
    }
    if (typeof stateRef.sortMode !== "string") {
      stateRef.sortMode = "default";
    }
    if (typeof stateRef.bankFiltersCollapsed !== "boolean") {
      stateRef.bankFiltersCollapsed = true;
    }
    if (typeof stateRef.activeFilterChipsExpanded !== "boolean") {
      stateRef.activeFilterChipsExpanded = true;
    }
    stateRef.topicKey = normalizeBankTopicKey(stateRef.topicKey);
    stateRef.solvedMode = normalizeSolvedFilterMode(stateRef.solvedMode);
    stateRef.reviewMode = normalizeReviewFilterMode(stateRef.reviewMode);

    return stateRef;
  }

  function clearChapterUi(subjectId, chapterId) {
    chapterUiState.delete(`${subjectId}::${chapterId}`);
    invalidateRunningQuestionTimersCache();
  }

  function clearSubjectUi(subjectId) {
    const prefix = `${subjectId}::`;
    Array.from(chapterUiState.keys()).forEach((key) => {
      if (key.startsWith(prefix)) {
        chapterUiState.delete(key);
      }
    });
    invalidateRunningQuestionTimersCache();
    chapterMapUiState.delete(subjectId);
    chapterTreeCollapseState.delete(subjectId);
  }

  function clearSubjectRuntime(subjectId) {
    const prefix = `${subjectId}::`;
    Array.from(chapterRuntime.keys()).forEach((key) => {
      if (key.startsWith(prefix)) {
        chapterRuntime.delete(key);
      }
    });
  }

  function getFilteredBankQuestions(subject, chapter) {
    if (!subject || !chapter) {
      return [];
    }

    const questions = Array.isArray(chapter.questions) ? chapter.questions : [];
    const uiState = getChapterUiState(subject.id, chapter.id);
    const query = asText(uiState.query, "").trim().toLowerCase();
    const difficultyStars = uiState.difficultyStars;
    const topicKey = normalizeBankTopicKey(uiState.topicKey);
    const solvedMode = normalizeSolvedFilterMode(uiState.solvedMode);
    const reviewMode = normalizeReviewFilterMode(uiState.reviewMode);
    const sortMode = normalizeBankSortMode(uiState.sortMode);
    const safeTermKey = getActiveReviewTermKey();
    const hasDifficulty = difficultyStars instanceof Set && difficultyStars.size > 0;

    if (
      !query &&
      !hasDifficulty &&
      topicKey === "all" &&
      solvedMode === "all" &&
      reviewMode === "all" &&
      sortMode === "default"
    ) {
      return questions;
    }

    const difficultyKey = hasDifficulty
      ? Array.from(difficultyStars).filter((star) => star >= 1 && star <= 5).sort((a, b) => a - b).join(",")
      : "";
    const cacheKey = [
      String(subjectsRevision),
      String(reviewMetadataRevision),
      normalizeProfileSemesterValue(safeTermKey, "2"),
      asText(subject.id, "").trim(),
      asText(chapter.id, "").trim(),
      query,
      difficultyKey,
      topicKey,
      solvedMode,
      reviewMode,
      sortMode
    ].join("||");

    const cached = bankFilterResultCache.get(cacheKey);
    if (cached && cached.questionsRef === questions) {
      return cached.result;
    }

    const reviewSnapshot =
      reviewMode === "all" ? null : getChapterReviewSnapshot(subject.id, chapter.id, questions, safeTermKey);

    const filtered = questions.filter((question) => {
      const text = getQuestionSearchText(question);
      const textMatch = !query || text.includes(query);
      const difficultyMatch = !hasDifficulty || difficultyStars.has(clampNumber(question?.difficulty, 1, 5, 3));
      const topicMatch = matchesQuestionTopicFilter(question, topicKey);
      const solvedMatch =
        solvedMode === "all"
          ? true
          : solvedMode === "solved"
            ? resolveQuestionSolvedFlag(question)
            : !resolveQuestionSolvedFlag(question);
      let reviewMatch = true;
      if (reviewMode !== "all") {
        const questionId = asText(question?.id, "").trim();
        const status = questionId ? normalizeReviewStatus(reviewSnapshot?.statusById?.get(questionId) || "") : "";
        reviewMatch = reviewMode === "none" ? !status : status === reviewMode;
      }
      return textMatch && difficultyMatch && topicMatch && solvedMatch && reviewMatch;
    });

    const result = sortBankQuestions(filtered, sortMode);
    setBoundedMapCache(
      bankFilterResultCache,
      cacheKey,
      {
        questionsRef: questions,
        result
      },
      220
    );
    return result;
  }

  function normalizeBankTopicKey(value) {
    const normalized = normalizeLookupKey(value);
    return normalized || "all";
  }

  function extractQuestionTopicText(source) {
    if (!source || typeof source !== "object") {
      return "";
    }

    const candidates = [
      source.topic,
      source.subtopic,
      source.topic_name,
      source.section,
      source.question_topic,
      source.category,
      source.type,
      source.mabhas,
      source.mabhath,
      source["topic-fa"],
      source["مبحث"]
    ];

    for (const candidate of candidates) {
      const text = asText(candidate, "").trim();
      if (text) {
        return text;
      }
    }
    return "";
  }

  function extractQuestionMethodText(source) {
    if (!source || typeof source !== "object") {
      return "";
    }

    const candidates = [
      source.method,
      source.solve_method,
      source.solution_method,
      source.method_name,
      source.technique,
      source.approach,
      source.strategy,
      source.problem_type,
      source.question_type,
      source["روش"],
      source["روش حل"]
    ];

    for (const candidate of candidates) {
      const text = asText(candidate, "").trim();
      if (text) {
        return text;
      }
    }

    if (Array.isArray(source.tags)) {
      const mergedTags = source.tags
        .map((item) => asText(item, "").trim())
        .filter(Boolean)
        .join("، ");
      if (mergedTags) {
        return mergedTags;
      }
    }

    return "";
  }

  function resolveQuestionTopicLabel(source, fallback = "عمومی") {
    const topicText = extractQuestionTopicText(source);
    if (topicText) {
      return topicText;
    }
    return asText(fallback, "").trim() || "عمومی";
  }

  function resolveQuestionMethodLabel(source, fallback = "") {
    const methodText = extractQuestionMethodText(source);
    if (methodText) {
      return methodText;
    }
    return asText(fallback, "").trim();
  }

  function resolveQuestionTopicMeta(source) {
    if (source && typeof source === "object" && !Array.isArray(source)) {
      const cachedMeta = questionTopicMetaCache.get(source);
      if (cachedMeta) {
        return cachedMeta;
      }
    }

    let topicLabel = resolveQuestionTopicLabel(source);
    let methodLabel = resolveQuestionMethodLabel(source, "");
    if (methodLabel && normalizeLookupKey(topicLabel) === normalizeLookupKey("عمومی")) {
      topicLabel = methodLabel;
      methodLabel = "";
    }
    const topicKey = `topic:${normalizeLookupKey(topicLabel)}`;
    const methodDiffers =
      !!methodLabel && normalizeLookupKey(methodLabel) !== normalizeLookupKey(topicLabel);
    const displayLabel = methodDiffers ? `${topicLabel} | روش: ${methodLabel}` : topicLabel;
    const methodKey = methodDiffers ? `method:${normalizeLookupKey(`${topicLabel}::${methodLabel}`)}` : "";

    const meta = {
      topicLabel,
      methodLabel,
      topicKey,
      methodKey,
      displayLabel,
      methodDiffers
    };
    if (source && typeof source === "object" && !Array.isArray(source)) {
      questionTopicMetaCache.set(source, meta);
    }
    return meta;
  }

  function resolveQuestionTopicKey(source) {
    const topicMeta = resolveQuestionTopicMeta(source);
    return topicMeta.methodKey || topicMeta.topicKey;
  }

  function getChapterTopicOptions(subjectId, chapterId) {
    const chapter = findChapterByIds(subjectId, chapterId);
    const questions = Array.isArray(chapter?.questions) ? chapter.questions : [];
    const safeSubjectId = asText(subjectId, "").trim();
    const safeChapterId = asText(chapterId, "").trim();
    const cacheKey = `${subjectsRevision}::${safeSubjectId}::${safeChapterId}`;
    if (safeSubjectId && safeChapterId && chapterTopicOptionsCache.has(cacheKey)) {
      const cached = chapterTopicOptionsCache.get(cacheKey);
      if (cached?.questionsRef === questions) {
        return cached.options;
      }
    }

    const map = new Map();

    questions.forEach((question) => {
      const topicMeta = resolveQuestionTopicMeta(question);

      if (topicMeta.topicKey) {
        const topicEntry = map.get(topicMeta.topicKey) || {
          key: topicMeta.topicKey,
          label: topicMeta.topicLabel,
          count: 0,
          rank: 0,
          sortLabel: topicMeta.topicLabel
        };
        topicEntry.count += 1;
        map.set(topicMeta.topicKey, topicEntry);
      }

      if (topicMeta.methodKey) {
        const methodEntry = map.get(topicMeta.methodKey) || {
          key: topicMeta.methodKey,
          label: topicMeta.displayLabel,
          count: 0,
          rank: 1,
          sortLabel: topicMeta.displayLabel
        };
        methodEntry.count += 1;
        map.set(topicMeta.methodKey, methodEntry);
      }
    });

    const options = Array.from(map.values()).sort((a, b) => {
      if (a.rank !== b.rank) {
        return a.rank - b.rank;
      }
      return a.sortLabel.localeCompare(b.sortLabel, "fa", { sensitivity: "base" });
    });

    if (safeSubjectId && safeChapterId) {
      setBoundedMapCache(
        chapterTopicOptionsCache,
        cacheKey,
        {
          questionsRef: questions,
          options
        },
        120
      );
    }

    return options;
  }

  function matchesQuestionTopicFilter(question, selectedTopicKey) {
    const key = normalizeBankTopicKey(selectedTopicKey);
    if (key === "all") {
      return true;
    }

    const topicMeta = resolveQuestionTopicMeta(question);

    if (key.startsWith("topic:")) {
      return key === topicMeta.topicKey;
    }

    if (key.startsWith("method:")) {
      return key === topicMeta.methodKey;
    }

    const legacyTopicKey = normalizeLookupKey(topicMeta.topicLabel);
    const legacyDisplayKey = normalizeLookupKey(topicMeta.displayLabel);
    return key === legacyTopicKey || key === legacyDisplayKey;
  }

  function getQuestionSearchText(question) {
    if (question && typeof question === "object") {
      const rawQuestionText = asText(question?.question_text, asText(question?.question, ""));
      const rawHint = asText(question?.hint, "");
      const rawSolution = asText(question?.step_by_step_solution, asText(question?.solution, ""));
      const rawTopic = asText(question?.topic, "");
      const rawMethod = asText(question?.method, "");
      const rawChapter = asText(question?.chapter, "");
      const cacheKey = `${rawQuestionText}\u241f${rawHint}\u241f${rawSolution}\u241f${rawTopic}\u241f${rawMethod}\u241f${rawChapter}`;
      const cached = questionSearchTextCache.get(question);
      if (cached && cached.key === cacheKey) {
        return cached.value;
      }

      const text = cleanQuestionContentText(rawQuestionText, { keepLineBreaks: false });
      const hint = cleanQuestionContentText(rawHint, { keepLineBreaks: false });
      const solution = cleanQuestionContentText(rawSolution, { keepLineBreaks: false });
      const topicMeta = resolveQuestionTopicMeta(question);
      const value = `${text} ${hint} ${solution} ${topicMeta.topicLabel} ${topicMeta.methodLabel} ${rawChapter}`.toLowerCase();
      questionSearchTextCache.set(question, { key: cacheKey, value });
      return value;
    }

    const text = cleanQuestionContentText(asText(question?.question_text, asText(question?.question, "")), {
      keepLineBreaks: false
    });
    const hint = cleanQuestionContentText(asText(question?.hint, ""), { keepLineBreaks: false });
    const solution = cleanQuestionContentText(asText(question?.step_by_step_solution, asText(question?.solution, "")), {
      keepLineBreaks: false
    });
    const topicMeta = resolveQuestionTopicMeta(question);
    const chapter = asText(question?.chapter, "");
    return `${text} ${hint} ${solution} ${topicMeta.topicLabel} ${topicMeta.methodLabel} ${chapter}`.toLowerCase();
  }

  function getQuestionHintText(question) {
    return cleanQuestionContentText(asText(question?.hint, ""));
  }

  function getQuestionSolutionText(question) {
    return cleanQuestionContentText(asText(question?.step_by_step_solution, asText(question?.solution, "")));
  }

  function getQuestionTimerEntry(uiState, questionId, createIfMissing = false) {
    if (!uiState || !(uiState.questionTimers instanceof Map)) {
      return null;
    }

    const safeQuestionId = asText(questionId, "");
    if (!safeQuestionId) {
      return null;
    }

    let entry = uiState.questionTimers.get(safeQuestionId);
    if (!entry && createIfMissing) {
      entry = { elapsedMs: 0, running: false, startedAtMs: 0 };
      uiState.questionTimers.set(safeQuestionId, entry);
    }

    if (!entry || typeof entry !== "object") {
      return null;
    }

    const runningBeforeNormalize = !!entry.running;
    entry.elapsedMs = Number.isFinite(Number(entry.elapsedMs)) ? Math.max(0, Number(entry.elapsedMs)) : 0;
    entry.running = !!entry.running;
    entry.startedAtMs = Number.isFinite(Number(entry.startedAtMs)) ? Number(entry.startedAtMs) : 0;
    if (entry.running && entry.startedAtMs <= 0) {
      entry.running = false;
      entry.startedAtMs = 0;
    }
    if (runningBeforeNormalize && !entry.running) {
      invalidateRunningQuestionTimersCache();
    }
    return entry;
  }

  function getQuestionTimerSnapshotFromState(uiState, questionId, nowMs = Date.now()) {
    const entry = getQuestionTimerEntry(uiState, questionId, false);
    if (!entry) {
      return { elapsedMs: 0, running: false };
    }

    if (!entry.running) {
      return { elapsedMs: entry.elapsedMs, running: false };
    }

    const liveElapsed = Math.max(0, nowMs - entry.startedAtMs);
    return {
      elapsedMs: entry.elapsedMs + liveElapsed,
      running: true
    };
  }

  function handleExamEvaluateScore(target) {
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const subjectId = asText(target.dataset.subjectId, "");
    const chapterId = asText(target.dataset.chapterId, "");
    if (!subjectId || !chapterId) {
      return;
    }

    const runtime = getRuntimeIfExists(subjectId, chapterId);
    if (!runtime?.exam) {
      setStatus("ابتدا آزمون را ایجاد کنید.", "error");
      return;
    }

    ensureExamCompletionState(runtime.exam);
    if (!runtime.exam.completed) {
      setStatus("این بخش پس از پایان آزمون فعال می‌شود.", "error");
      return;
    }

    const result = updateExamEvaluationFromMarks(runtime.exam);
    if (!result) {
      setStatus("تحلیل آزمون قابل محاسبه نیست.", "error");
      return;
    }

    setStatus(`نمره شما ${result.scoreLabel} از 20 محاسبه شد.`, "ok");
    touchExamRuntimeAutosave(false);
    scheduleExamCompletedEvaluationRefresh(subjectId, chapterId, runtime.exam, 0);
  }

  function handleExamQuestionMark(target) {
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const subjectId = asText(target.dataset.subjectId, "");
    const chapterId = asText(target.dataset.chapterId, "");
    const questionId = asText(target.dataset.questionId, "");
    const requestedMark = normalizeExamAnswerMark(target.dataset.mark);
    if (!subjectId || !chapterId || !questionId || !requestedMark) {
      return;
    }

    const runtime = getRuntimeIfExists(subjectId, chapterId);
    if (!runtime?.exam) {
      setStatus("ابتدا آزمون را ایجاد کنید.", "error");
      return;
    }

    ensureExamCompletionState(runtime.exam);
    if (!runtime.exam.completed) {
      setStatus("ارزیابی سوالات فقط بعد از اتمام آزمون فعال می‌شود.", "error");
      return;
    }

    const currentMark = resolveExamQuestionMark(runtime.exam, questionId);
    const nextMark = currentMark === requestedMark ? "" : requestedMark;
    setExamQuestionMark(runtime.exam, questionId, nextMark);

    const result = updateExamEvaluationFromMarks(runtime.exam);
    if (nextMark === "correct") {
      setStatus("این سوال به عنوان پاسخ درست ثبت شد.", "ok");
    } else if (nextMark === "wrong") {
      setStatus("این سوال در گروه غلط / بی‌پاسخ ثبت شد.", "ok");
    } else {
      setStatus("ارزیابی این سوال پاک شد.", "ok");
    }

    if (result) {
      showToast(`نمره فعلی: ${result.scoreLabel} از 20`, "success", 1600);
    }
    touchExamRuntimeAutosave(false);

    const reviewBlock = target.closest(".exam-question-review");
    if (reviewBlock instanceof HTMLElement) {
      syncExamQuestionReviewBlockUi(reviewBlock, nextMark);
    }

    scheduleExamCompletedEvaluationRefresh(subjectId, chapterId, runtime.exam);
  }

  function syncExamQuestionReviewBlockUi(block, mark) {
    if (!(block instanceof HTMLElement)) {
      return;
    }

    const safeMark = normalizeExamAnswerMark(mark);
    block.classList.remove("is-correct", "is-wrong", "is-pending");
    block.classList.add(safeMark ? `is-${safeMark}` : "is-pending");

    const markButtons = block.querySelectorAll(".exam-question-mark-btn");
    markButtons.forEach((button) => {
      if (!(button instanceof HTMLButtonElement)) {
        return;
      }
      const buttonMark = normalizeExamAnswerMark(button.dataset.mark);
      const isActive = !!safeMark && buttonMark === safeMark;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    const stateLine = block.querySelector(".exam-question-mark-state");
    if (stateLine instanceof HTMLElement) {
      stateLine.classList.remove("is-correct", "is-wrong");
      if (safeMark === "correct") {
        stateLine.textContent = "وضعیت فعلی: پاسخ درست ثبت شده است.";
        stateLine.classList.add("is-correct");
      } else if (safeMark === "wrong") {
        stateLine.textContent = "وضعیت فعلی: در گروه غلط / بی‌پاسخ قرار گرفت.";
        stateLine.classList.add("is-wrong");
      } else {
        stateLine.textContent = "وضعیت فعلی: هنوز برای این سوال ارزیابی ثبت نشده است.";
      }
    }
  }

  function getSubjectQuestionIndex(subject) {
    if (!subject || !Array.isArray(subject?.chapters)) {
      return new Map();
    }

    const cached = subjectQuestionIndexCache.get(subject);
    if (
      cached &&
      cached.revision === subjectsRevision &&
      cached.chapterCount === subject.chapters.length
    ) {
      return cached.map;
    }

    const map = new Map();
    subject.chapters.forEach((chapter) => {
      const questions = Array.isArray(chapter?.questions) ? chapter.questions : [];
      questions.forEach((question) => {
        const questionId = asText(question?.id, "").trim();
        if (questionId) {
          map.set(questionId, question);
        }
      });
    });

    subjectQuestionIndexCache.set(subject, {
      revision: subjectsRevision,
      chapterCount: subject.chapters.length,
      map
    });

    return map;
  }

  function buildExamSelectedQuestions(subject, exam) {
    if (!subject || !exam || !Array.isArray(exam.ids) || !exam.ids.length) {
      return [];
    }

    const byId = getSubjectQuestionIndex(subject);
    return exam.ids.map((id) => byId.get(asText(id, "").trim())).filter(Boolean);
  }

  function refreshExamCompletedEvaluationUi(subjectId, chapterId, exam) {
    if (!(refs.levelContainer instanceof HTMLElement) || !exam || typeof exam !== "object") {
      return false;
    }

    const evalPanels = refs.levelContainer.querySelectorAll(".exam-eval-panel");
    let oldPanel = null;
    evalPanels.forEach((panel) => {
      if (!(panel instanceof HTMLElement)) {
        return;
      }
      if (asText(panel.dataset.subjectId, "") === subjectId && asText(panel.dataset.chapterId, "") === chapterId) {
        oldPanel = panel;
      }
    });
    if (!(oldPanel instanceof HTMLElement)) {
      return false;
    }

    const subject = state.subjects.find((item) => asText(item?.id, "") === subjectId) || null;
    const chapter =
      subject && Array.isArray(subject.chapters)
        ? subject.chapters.find((item) => asText(item?.id, "") === chapterId) || null
        : null;
    if (!subject || !chapter) {
      return false;
    }

    const selectedQuestions = buildExamSelectedQuestions(subject, exam);
    if (!selectedQuestions.length) {
      return false;
    }

    const newPanel = createExamEvaluationPanel(subject, chapter, exam, selectedQuestions.length, selectedQuestions);
    oldPanel.replaceWith(newPanel);
    observeMathWithin(newPanel);
    return true;
  }

  function scheduleExamCompletedEvaluationRefresh(subjectId, chapterId, exam, delayMs = null) {
    const safeSubjectId = asText(subjectId, "").trim();
    const safeChapterId = asText(chapterId, "").trim();
    if (!safeSubjectId || !safeChapterId || !exam || typeof exam !== "object") {
      return;
    }

    if (examEvalRefreshTimerId) {
      window.clearTimeout(examEvalRefreshTimerId);
      examEvalRefreshTimerId = 0;
    }

    const waitMs = Number.isFinite(Number(delayMs))
      ? Math.max(0, Number(delayMs))
      : isMobileViewportActive()
        ? 120
        : 28;

    examEvalRefreshTimerId = window.setTimeout(() => {
      examEvalRefreshTimerId = 0;
      const runtime = getRuntimeIfExists(safeSubjectId, safeChapterId);
      if (!runtime?.exam || runtime.exam !== exam || !runtime.exam.completed) {
        return;
      }
      if (!refreshExamCompletedEvaluationUi(safeSubjectId, safeChapterId, runtime.exam)) {
        queueRender();
      }
    }, waitMs);
  }

  function buildExamDraftState(exam) {
    const source = exam && typeof exam === "object" ? exam : {};
    const chapterIds = Array.isArray(source.chapterIds)
      ? source.chapterIds.map((item) => asText(item, "")).filter(Boolean)
      : [];

    return {
      profile: asText(source.profile, "mixed"),
      order: normalizeExamOrder(source.order),
      difficultyPlan: normalizeExamDifficultyPlan(source.difficultyPlan),
      duration: clampNumber(source.duration, EXAM_DURATION_MIN, EXAM_DURATION_MAX, EXAM_DURATION_DEFAULT),
      count: clampNumber(source.count, 1, 200, 10),
      requestedCount: clampNumber(
        source.requestedCount,
        1,
        200,
        clampNumber(source.count, 1, 200, 10)
      ),
      chapterIds,
      requestedChapterCounts:
        source.requestedChapterCounts && typeof source.requestedChapterCounts === "object"
          ? source.requestedChapterCounts
          : {},
      actualChapterCounts:
        source.actualChapterCounts && typeof source.actualChapterCounts === "object" ? source.actualChapterCounts : {},
      ids: [],
      page: 1,
      poolCount: Number.isFinite(Number(source.poolCount)) ? Math.max(0, Number(source.poolCount)) : 0,
      completed: true,
      completedReason: "draft",
      completedAt: "",
      evaluation: null,
      answerMarks: {},
      timer: null
    };
  }

  function handleExamFinish(target) {
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const subjectId = asText(target.dataset.subjectId, "");
    const chapterId = asText(target.dataset.chapterId, "");
    if (!subjectId || !chapterId) {
      return;
    }

    const runtime = getRuntimeIfExists(subjectId, chapterId);
    if (!runtime?.exam || !Array.isArray(runtime.exam.ids) || !runtime.exam.ids.length) {
      setStatus("آزمون فعالی برای اتمام وجود ندارد.", "error");
      return;
    }

    ensureExamCompletionState(runtime.exam);
    if (runtime.exam.completed) {
      setStatus("این آزمون قبلا پایان یافته است.", "ok");
      return;
    }

    completeExamSession(runtime, "manual");
    setStatus("آزمون پایان یافت. پاسخ‌ها و ارزیابی سوال‌به‌سوال فعال شد.", "ok");
    showToast("آزمون پایان یافت. پاسخ‌ها زیر سوالات نمایش داده شد.", "success", 2800);
    render();
  }

  function handleExamReset(target) {
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const subjectId = asText(target.dataset.subjectId, "");
    const chapterId = asText(target.dataset.chapterId, "");
    if (!subjectId || !chapterId) {
      return;
    }

    const runtime = getRuntimeIfExists(subjectId, chapterId);
    if (!runtime?.exam) {
      setStatus("آزمونی برای بازنشانی وجود ندارد.", "error");
      return;
    }

    ensureExamCompletionState(runtime.exam);
    const wasCompleted = !!runtime.exam.completed;
    const confirmMessage = wasCompleted
      ? "آزمون فعلی بسته شود و فرم ساخت آزمون جدید باز شود؟"
      : "آزمون در حال اجرا لغو شود و به فرم ساخت آزمون برگردید؟";
    const approved = window.confirm(confirmMessage);
    if (!approved) {
      return;
    }

    runtime.exam = buildExamDraftState(runtime.exam);
    touchExamRuntimeAutosave(true);

    if (wasCompleted) {
      setStatus("آزمون قبلی بسته شد. آماده ساخت آزمون جدید هستید.", "ok");
      showToast("فرم آزمون جدید آماده شد.", "success", 2600);
    } else {
      setStatus("آزمون فعلی لغو شد. می‌توانید آزمون جدید بسازید.", "ok");
      showToast("آزمون لغو شد.", "success", 2400);
    }

    render();
  }

  async function copyTextToClipboard(text) {
    const safeText = asText(text, "").trim();
    if (!safeText) {
      return false;
    }

    if (window.isSecureContext && navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(safeText);
        return true;
      } catch (error) {
        console.warn("Clipboard API write failed.", error);
      }
    }

    try {
      const textarea = document.createElement("textarea");
      textarea.value = safeText;
      textarea.readOnly = true;
      textarea.style.position = "fixed";
      textarea.style.top = "-9999px";
      textarea.style.opacity = "0";
      document.body.append(textarea);
      textarea.focus();
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
      const copied = document.execCommand("copy");
      textarea.remove();
      return !!copied;
    } catch (error) {
      console.warn("Clipboard fallback write failed.", error);
      return false;
    }
  }

  async function handleCopySchemaAiPrompt(target) {
    const promptText = getAiJsonExtractorPromptTemplate();
    const copied = await copyTextToClipboard(promptText);
    const trigger = target instanceof HTMLButtonElement ? target : null;
    if (trigger) {
      const originalLabel = asText(trigger.dataset.originalLabel, "").trim() || asText(trigger.textContent, "").trim() || "کپی سریع پرامپت";
      trigger.dataset.originalLabel = originalLabel;
      trigger.textContent = copied ? "کپی شد" : "کپی نشد";
      window.setTimeout(() => {
        if (document.contains(trigger)) {
          trigger.textContent = originalLabel;
        }
      }, 1400);
    }

    if (copied) {
      setStatus("پرامپت استخراج سوال در کلیپ بورد کپی شد.", "ok");
      showToast("پرامپت آماده کپی شد.", "success", 2200);
      return;
    }

    setStatus("کپی خودکار پرامپت انجام نشد. متن را دستی کپی کنید.", "error");
    showToast("کپی خودکار در دسترس نیست.", "error", 2400);
  }

  async function handleExamCopyCode(target) {
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const subjectId = asText(target.dataset.subjectId, "");
    const chapterId = asText(target.dataset.chapterId, "");
    const runtime =
      subjectId && chapterId ? getRuntimeIfExists(subjectId, chapterId) : getActiveRuntime();
    const exam = runtime?.exam;
    if (!exam || !Array.isArray(exam.ids) || !exam.ids.length) {
      setStatus("ابتدا آزمون را ایجاد کنید تا کد آن قابل کپی باشد.", "error");
      return;
    }

    const examCode = asText(target.dataset.examCode, "").trim() || resolveExamCode(exam);
    if (!examCode) {
      setStatus("کد آزمون در دسترس نیست.", "error");
      return;
    }
    target.dataset.examCode = examCode;

    const copied = await copyTextToClipboard(examCode);
    if (copied) {
      setStatus(`کد آزمون ${examCode} کپی شد.`, "ok");
      showToast("کد آزمون در کلیپ‌بورد ذخیره شد.", "success", 2200);
      return;
    }

    setStatus("امکان کپی خودکار وجود ندارد. کد آزمون را دستی کپی کنید.", "error");
    showToast(`کد آزمون: ${examCode}`, "info", 3000);
  }

  async function handlePrintExam(target, options = {}) {
    const trigger = target instanceof HTMLElement ? target : null;
    const includeAnswers = options.includeAnswers === true;
    const examScope =
      trigger?.closest(".exam-session-region") ||
      refs.levelContainer?.querySelector(".exam-session-region") ||
      document.querySelector(".exam-session-region");

    if (!(examScope instanceof HTMLElement)) {
      setStatus("برگه آزمون برای چاپ پیدا نشد.", "error");
      return;
    }

    const examList = examScope.querySelector(".exam-paper-list");
    if (!(examList instanceof HTMLElement) || !examList.children.length) {
      setStatus("سوالی برای خروجی چاپ موجود نیست.", "error");
      return;
    }

    if (typeof window.print !== "function") {
      setStatus("چاپ در این محیط پشتیبانی نمی‌شود.", "error");
      return;
    }

    // Unified print profile: always use desktop-quality layout for PDF output
    // across desktop, mobile, app and auto modes.
    const mobileLikePrint = false;
    const body = document.body instanceof HTMLElement ? document.body : null;
    const viewportClassNames = ["force-mobile", "auto-mobile", "force-desktop", "auto-desktop"];
    const previousViewportClasses = body
      ? viewportClassNames.filter((className) => body.classList.contains(className))
      : [];
    let printViewportForced = false;
    const forceDesktopViewportForPrint = () => {
      if (!(body instanceof HTMLElement) || printViewportForced) {
        return;
      }
      printViewportForced = true;
      body.classList.remove(...viewportClassNames);
      body.classList.add("force-desktop");
      body.dataset.printViewport = "desktop";
    };
    const restoreViewportAfterPrint = () => {
      if (!(body instanceof HTMLElement) || !printViewportForced) {
        return;
      }
      body.classList.remove(...viewportClassNames);
      previousViewportClasses.forEach((className) => {
        body.classList.add(className);
      });
      if (body.dataset.printViewport === "desktop") {
        delete body.dataset.printViewport;
      }
      printViewportForced = false;
    };

    forceDesktopViewportForPrint();
    ensureExamPrintAnswerSheet(examScope, { includeAnswers });

    try {
      await prepareExamPrintMath(examScope);
      await prepareExamPrintAssets(examScope, { mobileLike: mobileLikePrint });
    } catch (error) {
      console.error(error);
    }

    const printClassName = "print-exam-only";
    const printMobileClassName = "print-exam-mobile";
    const printWithAnswersClassName = "print-exam-with-answers";
    let cleanupTimerId = 0;
    let visibilityChangeHandler = null;
    let focusSafetyHandler = null;
    let pageShowSafetyHandler = null;
    const detachPrintSafetyListeners = () => {
      if (typeof visibilityChangeHandler === "function") {
        document.removeEventListener("visibilitychange", visibilityChangeHandler, true);
      }
      if (typeof focusSafetyHandler === "function") {
        window.removeEventListener("focus", focusSafetyHandler, true);
      }
      if (typeof pageShowSafetyHandler === "function") {
        window.removeEventListener("pageshow", pageShowSafetyHandler, true);
      }
      visibilityChangeHandler = null;
      focusSafetyHandler = null;
      pageShowSafetyHandler = null;
    };
    const clearPrintMode = () => {
      clearExamPrintPagination(examScope);
      if (document.body) {
        document.body.classList.remove(printClassName);
        document.body.classList.remove(printMobileClassName);
        document.body.classList.remove(printWithAnswersClassName);
      }
      restoreViewportAfterPrint();
      ensureExamPrintAnswerSheet(examScope, { includeAnswers: false });
      if (cleanupTimerId) {
        window.clearTimeout(cleanupTimerId);
        cleanupTimerId = 0;
      }
      detachPrintSafetyListeners();
    };

    const beforePrintHandler = () => {
      document.body?.classList.add(printClassName);
      if (mobileLikePrint) {
        document.body?.classList.add(printMobileClassName);
      }
      if (includeAnswers) {
        document.body?.classList.add(printWithAnswersClassName);
      }
      prepareExamPrintPagination(examScope, { mobileLike: mobileLikePrint, includeAnswers });
    };

    const afterPrintHandler = () => {
      clearPrintMode();
      window.removeEventListener("beforeprint", beforePrintHandler);
      window.removeEventListener("afterprint", afterPrintHandler);
    };

    const safeCleanupIfPrintEnded = () => {
      if (isPrintMediaQueryActive()) {
        return;
      }
      afterPrintHandler();
    };

    visibilityChangeHandler = () => {
      if (!document.hidden) {
        window.setTimeout(safeCleanupIfPrintEnded, 140);
      }
    };
    focusSafetyHandler = () => {
      window.setTimeout(safeCleanupIfPrintEnded, 180);
    };
    pageShowSafetyHandler = () => {
      window.setTimeout(safeCleanupIfPrintEnded, 220);
    };

    window.addEventListener("beforeprint", beforePrintHandler);
    window.addEventListener("afterprint", afterPrintHandler, { once: true });
    document.addEventListener("visibilitychange", visibilityChangeHandler, true);
    window.addEventListener("focus", focusSafetyHandler, true);
    window.addEventListener("pageshow", pageShowSafetyHandler, true);
    document.body?.classList.add(printClassName);
    if (mobileLikePrint) {
      document.body?.classList.add(printMobileClassName);
    }
    if (includeAnswers) {
      document.body?.classList.add(printWithAnswersClassName);
    }
    await waitForRenderFrames(mobileLikePrint ? 3 : 2);
    prepareExamPrintPagination(examScope, { mobileLike: mobileLikePrint, includeAnswers });
    await waitForRenderFrames(mobileLikePrint ? 2 : 1);
    cleanupTimerId = window.setTimeout(safeCleanupIfPrintEnded, 30000);
    try {
      window.print();
    } catch (error) {
      console.error("Exam print invocation failed.", error);
      setStatus("شروع چاپ ممکن نشد.", "error");
      afterPrintHandler();
    }
  }

  async function prepareExamPrintMath(root) {
    if (!(root instanceof HTMLElement)) {
      return;
    }

    const pendingMathNodes = Array.from(root.querySelectorAll(".lazy-math"));
    if (!pendingMathNodes.length) {
      return;
    }

    await Promise.allSettled(pendingMathNodes.map((node) => renderMathNode(node)));
    await waitForRenderFrames(2);
  }

  async function prepareExamPrintAssets(root, options = {}) {
    if (!(root instanceof HTMLElement)) {
      return;
    }
    if (
      !questionPdfAssetPlugin ||
      typeof questionPdfAssetPlugin.hydrateAssetsInRoot !== "function"
    ) {
      return;
    }

    const mobileLike = !!options.mobileLike;
    try {
      await questionPdfAssetPlugin.hydrateAssetsInRoot(root, { concurrency: mobileLike ? 2 : 3 });
    } catch (error) {
      console.error("Exam print asset hydration failed.", error);
    }
    await waitForQuestionAssetImages(root, { timeoutMs: mobileLike ? 6500 : 4200 });
    await waitForRenderFrames(mobileLike ? 3 : 2);
  }

  function isMobileLikePrintMode() {
    if (isMobileViewportActive()) {
      return true;
    }
    if (isStandaloneMobileModeActive()) {
      return true;
    }
    if (document.body?.classList.contains("standalone-native-app")) {
      return true;
    }
    const viewportWidth = Number(window.innerWidth) || Number(document.documentElement?.clientWidth) || 0;
    return viewportWidth > 0 && viewportWidth <= 1023;
  }

  async function waitForQuestionAssetImages(root, options = {}) {
    if (!(root instanceof HTMLElement)) {
      return;
    }
    const images = Array.from(root.querySelectorAll(".question-asset-image")).filter(
      (node) => node instanceof HTMLImageElement
    );
    if (!images.length) {
      return;
    }

    const timeoutMs = clampNumber(options.timeoutMs, 800, 14000, 5000);
    await Promise.allSettled(images.map((image) => waitForImageElementReady(image, timeoutMs)));
  }

  function waitForImageElementReady(image, timeoutMs = 5000) {
    if (!(image instanceof HTMLImageElement)) {
      return Promise.resolve();
    }

    const decodeIfAvailable = () => {
      if (typeof image.decode === "function") {
        return image.decode().catch(() => {});
      }
      return Promise.resolve();
    };

    if (image.complete && Number(image.naturalWidth) > 0) {
      return decodeIfAvailable();
    }

    return new Promise((resolve) => {
      let settled = false;
      let timeoutId = 0;
      const cleanup = () => {
        if (settled) {
          return;
        }
        settled = true;
        image.removeEventListener("load", handleLoad);
        image.removeEventListener("error", handleDone);
        if (timeoutId) {
          window.clearTimeout(timeoutId);
          timeoutId = 0;
        }
        resolve();
      };

      const handleDone = () => {
        cleanup();
      };

      const handleLoad = () => {
        decodeIfAvailable().finally(cleanup);
      };

      image.addEventListener("load", handleLoad, { once: true });
      image.addEventListener("error", handleDone, { once: true });
      timeoutId = window.setTimeout(handleDone, timeoutMs);
    });
  }

  function clearExamPrintPagination(root) {
    if (!(root instanceof HTMLElement)) {
      return;
    }
    root
      .querySelectorAll(
        ".exam-paper-item.exam-print-break-before, .exam-paper-item.exam-print-tight, .exam-paper-answer-item.exam-print-break-before, .exam-paper-answer-item.exam-print-tight"
      )
      .forEach((item) => {
        if (!(item instanceof HTMLElement)) {
          return;
        }
        item.classList.remove("exam-print-break-before", "exam-print-tight");
      });
  }

  function prepareExamPrintPagination(root, options = {}) {
    if (!(root instanceof HTMLElement)) {
      return;
    }
    clearExamPrintPagination(root);

    const includeAnswers = options.includeAnswers === true;
    const listSelector = includeAnswers ? ".exam-paper-answer-sheet-list" : ".exam-paper-list";
    const list = root.querySelector(listSelector);
    if (!(list instanceof HTMLElement)) {
      return;
    }

    const itemSelector = includeAnswers ? ".exam-paper-answer-item" : ".exam-paper-item";
    const items = Array.from(list.querySelectorAll(itemSelector)).filter((item) => item instanceof HTMLElement);
    if (!items.length) {
      return;
    }

    // Let print layout flow naturally so items stay as contiguous as possible.
    // CSS `break-inside: avoid-page` keeps each item intact when possible.
  }

  function waitForRenderFrames(frameCount = 1) {
    const safeFrameCount = Math.max(1, Math.floor(Number(frameCount) || 1));
    return new Promise((resolve) => {
      let remaining = safeFrameCount;
      const tick = () => {
        if (remaining <= 0) {
          resolve();
          return;
        }
        remaining -= 1;
        window.requestAnimationFrame(tick);
      };
      window.requestAnimationFrame(tick);
    });
  }

  function handleBankSearchInput(target) {
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    const subjectId = asText(target.dataset.subjectId, "");
    const chapterId = asText(target.dataset.chapterId, "");
    if (!subjectId || !chapterId) {
      return;
    }

    debouncedBankSearchUpdate(subjectId, chapterId, target.value);
  }

  function applyBankSearchFilter(subjectId, chapterId, value) {
    const uiState = getChapterUiState(subjectId, chapterId);
    const previousActiveCount = countActiveBankFilters(uiState);
    uiState.query = asText(value, "");
    syncActiveFilterChipsExpansion(uiState, previousActiveCount);
    state.pagination.page = 1;

    if (isActiveChapter(subjectId, chapterId) && state.view.tab === "bank") {
      queueRender();
    }
  }

  function handleDifficultyPillToggle(target) {
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const subjectId = asText(target.dataset.subjectId, "");
    const chapterId = asText(target.dataset.chapterId, "");
    const starValue = Number.parseInt(asText(target.dataset.star, "0"), 10);
    if (!subjectId || !chapterId) {
      return;
    }

    const uiState = getChapterUiState(subjectId, chapterId);
    const previousActiveCount = countActiveBankFilters(uiState);
    if (starValue >= 1 && starValue <= 5) {
      if (uiState.difficultyStars.has(starValue)) {
        uiState.difficultyStars.delete(starValue);
      } else {
        uiState.difficultyStars.add(starValue);
      }
    }
    syncActiveFilterChipsExpansion(uiState, previousActiveCount);
    state.pagination.page = 1;
    queueRender();
  }

  function handleBankTopicFilterChange(target) {
    if (!(target instanceof HTMLSelectElement)) {
      return;
    }

    const subjectId = asText(target.dataset.subjectId, "");
    const chapterId = asText(target.dataset.chapterId, "");
    if (!subjectId || !chapterId) {
      return;
    }

    const uiState = getChapterUiState(subjectId, chapterId);
    const previousActiveCount = countActiveBankFilters(uiState);
    uiState.topicKey = normalizeBankTopicKey(target.value);
    syncActiveFilterChipsExpansion(uiState, previousActiveCount);
    state.pagination.page = 1;
    queueRender();
  }

  function resolveTopicLabelByKey(topicOptions, key) {
    const normalizedKey = normalizeBankTopicKey(key);
    if (normalizedKey === "all") {
      return "همه نوع‌ها";
    }
    const list = Array.isArray(topicOptions) ? topicOptions : [];
    const matched = list.find((item) => asText(item?.key, "") === normalizedKey);
    return asText(matched?.label, "نوع/روش");
  }

  function handleBankTopicQuick(target) {
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const subjectId = asText(target.dataset.subjectId, "");
    const chapterId = asText(target.dataset.chapterId, "");
    if (!subjectId || !chapterId) {
      return;
    }

    const uiState = getChapterUiState(subjectId, chapterId);
    const previousActiveCount = countActiveBankFilters(uiState);
    uiState.topicKey = normalizeBankTopicKey(target.dataset.topicKey);
    syncActiveFilterChipsExpansion(uiState, previousActiveCount);
    state.pagination.page = 1;
    queueRender();
  }

  function handleQuestionTimerStart(target) {
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const subjectId = asText(target.dataset.subjectId, "");
    const chapterId = asText(target.dataset.chapterId, "");
    const questionId = asText(target.dataset.questionId, "");
    if (!subjectId || !chapterId || !questionId) {
      return;
    }

    const uiState = getChapterUiState(subjectId, chapterId);
    const nowMs = Date.now();

    const activeId = asText(uiState.activeQuestionTimerId, "");
    let timerStateChanged = false;
    if (activeId && activeId !== questionId) {
      const activeEntry = getQuestionTimerEntry(uiState, activeId, false);
      if (activeEntry?.running) {
        activeEntry.elapsedMs += Math.max(0, nowMs - activeEntry.startedAtMs);
        activeEntry.running = false;
        activeEntry.startedAtMs = 0;
        timerStateChanged = true;
      }
    }

    const entry = getQuestionTimerEntry(uiState, questionId, true);
    if (!entry) {
      return;
    }

    if (!entry.running) {
      entry.running = true;
      entry.startedAtMs = nowMs;
      timerStateChanged = true;
    }

    uiState.activeQuestionTimerId = questionId;
    if (timerStateChanged) {
      invalidateRunningQuestionTimersCache();
    }
    refreshQuestionTimerInteractionUi(nowMs);
  }

  function handleQuestionTimerPause(target) {
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const subjectId = asText(target.dataset.subjectId, "");
    const chapterId = asText(target.dataset.chapterId, "");
    const questionId = asText(target.dataset.questionId, "");
    if (!subjectId || !chapterId || !questionId) {
      return;
    }

    const uiState = getChapterUiState(subjectId, chapterId);
    const entry = getQuestionTimerEntry(uiState, questionId, false);
    if (!entry || !entry.running) {
      return;
    }

    const nowMs = Date.now();
    entry.elapsedMs += Math.max(0, nowMs - entry.startedAtMs);
    entry.running = false;
    entry.startedAtMs = 0;

    if (uiState.activeQuestionTimerId === questionId) {
      uiState.activeQuestionTimerId = "";
    }

    invalidateRunningQuestionTimersCache();
    refreshQuestionTimerInteractionUi(nowMs);
  }

  function handleQuestionTimerReset(target) {
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const subjectId = asText(target.dataset.subjectId, "");
    const chapterId = asText(target.dataset.chapterId, "");
    const questionId = asText(target.dataset.questionId, "");
    if (!subjectId || !chapterId || !questionId) {
      return;
    }

    const uiState = getChapterUiState(subjectId, chapterId);
    const entry = getQuestionTimerEntry(uiState, questionId, true);
    if (!entry) {
      return;
    }

    const wasRunning = !!entry.running;
    entry.elapsedMs = 0;
    entry.running = false;
    entry.startedAtMs = 0;

    if (uiState.activeQuestionTimerId === questionId) {
      uiState.activeQuestionTimerId = "";
    }

    if (wasRunning) {
      invalidateRunningQuestionTimersCache();
    }
    refreshQuestionTimerInteractionUi(Date.now());
  }

  function refreshQuestionTimerInteractionUi(nowMs = Date.now()) {
    updateQuestionSolveTimerUi(nowMs);
    syncLiveTimerLifecycle();
  }

  function handleBankSortModeClick(target) {
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const subjectId = asText(target.dataset.subjectId, "");
    const chapterId = asText(target.dataset.chapterId, "");
    if (!subjectId || !chapterId) {
      return;
    }

    const uiState = getChapterUiState(subjectId, chapterId);
    const previousActiveCount = countActiveBankFilters(uiState);
    const nextMode = normalizeBankSortMode(target.dataset.mode);
    uiState.sortMode = nextMode;
    syncActiveFilterChipsExpansion(uiState, previousActiveCount);
    state.pagination.page = 1;
    queueRender();
  }

  function handleBankSolvedFilterClick(target) {
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const subjectId = asText(target.dataset.subjectId, "");
    const chapterId = asText(target.dataset.chapterId, "");
    if (!subjectId || !chapterId) {
      return;
    }

    const uiState = getChapterUiState(subjectId, chapterId);
    const previousActiveCount = countActiveBankFilters(uiState);
    uiState.solvedMode = normalizeSolvedFilterMode(target.dataset.mode);
    syncActiveFilterChipsExpansion(uiState, previousActiveCount);
    state.pagination.page = 1;
    queueRender();
  }

  function handleBankReviewFilterClick(target) {
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const subjectId = asText(target.dataset.subjectId, "");
    const chapterId = asText(target.dataset.chapterId, "");
    if (!subjectId || !chapterId) {
      return;
    }

    const uiState = getChapterUiState(subjectId, chapterId);
    const previousActiveCount = countActiveBankFilters(uiState);
    uiState.reviewMode = normalizeReviewFilterMode(target.dataset.mode);
    syncActiveFilterChipsExpansion(uiState, previousActiveCount);
    state.pagination.page = 1;
    queueRender();
  }

  function handleBankActiveFiltersToggle(target) {
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const subjectId = asText(target.dataset.subjectId, "");
    const chapterId = asText(target.dataset.chapterId, "");
    if (!subjectId || !chapterId) {
      return;
    }

    const uiState = getChapterUiState(subjectId, chapterId);
    const activeCount = countActiveBankFilters(uiState);
    if (activeCount <= 0) {
      uiState.activeFilterChipsExpanded = false;
      queueRender();
      return;
    }

    uiState.activeFilterChipsExpanded = !uiState.activeFilterChipsExpanded;
    queueRender();
  }

  function handleBankFiltersPanelToggle(target) {
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const subjectId = asText(target.dataset.subjectId, "");
    const chapterId = asText(target.dataset.chapterId, "");
    if (!subjectId || !chapterId) {
      return;
    }

    const uiState = getChapterUiState(subjectId, chapterId);
    uiState.bankFiltersCollapsed = !uiState.bankFiltersCollapsed;
    queueRender();
  }

  function handleBankRemoveFilterChip(target) {
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const subjectId = asText(target.dataset.subjectId, "");
    const chapterId = asText(target.dataset.chapterId, "");
    const filterType = asText(target.dataset.filterType, "");
    if (!subjectId || !chapterId || !filterType) {
      return;
    }

    const uiState = getChapterUiState(subjectId, chapterId);
    if (!uiState) {
      return;
    }

    if (filterType === "query") {
      uiState.query = "";
    } else if (filterType === "topic") {
      uiState.topicKey = "all";
    } else if (filterType === "solved") {
      uiState.solvedMode = "all";
    } else if (filterType === "review") {
      uiState.reviewMode = "all";
    } else if (filterType === "sort") {
      uiState.sortMode = "default";
    } else if (filterType === "difficulty") {
      const star = Number.parseInt(asText(target.dataset.value, "0"), 10);
      if (star >= 1 && star <= 5) {
        uiState.difficultyStars.delete(star);
      }
    } else {
      return;
    }

    syncActiveFilterChipsExpansion(uiState, countActiveBankFilters(uiState));

    state.pagination.page = 1;
    queueRender();
  }

  function handleBankClearFilters(target) {
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const subjectId = asText(target.dataset.subjectId, "");
    const chapterId = asText(target.dataset.chapterId, "");
    if (!subjectId || !chapterId) {
      return;
    }

    const uiState = getChapterUiState(subjectId, chapterId);
    uiState.query = "";
    uiState.difficultyStars.clear();
    uiState.topicKey = "all";
    uiState.solvedMode = "all";
    uiState.reviewMode = "all";
    uiState.sortMode = "default";
    uiState.activeFilterChipsExpanded = false;

    state.pagination.page = 1;
    queueRender();
  }

  function handleQuestionSolvedToggle(target) {
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const subjectId = asText(target.dataset.subjectId, "");
    const chapterId = asText(target.dataset.chapterId, "");
    const questionId = asText(target.dataset.questionId, "");
    if (!subjectId || !chapterId || !questionId) {
      return;
    }

    const chapter = findChapterByIds(subjectId, chapterId);
    if (!chapter) {
      return;
    }

    const question = (chapter.questions || []).find((item) => asText(item?.id, "") === questionId);
    if (!question) {
      return;
    }

    const nextSolved = !resolveQuestionSolvedFlag(question);
    question.solved = nextSolved;
    question.isSolved = nextSolved;
    if (question.progress && typeof question.progress === "object" && !Array.isArray(question.progress)) {
      question.progress.solved = nextSolved;
      question.progress.isSolved = nextSolved;
    }
    persistSubjects();
    if (shouldRenderAfterSolvedToggle(subjectId, chapterId)) {
      queueRender();
    } else {
      syncQuestionSolvedUiForVisibleCard(subjectId, chapterId, questionId);
    }
    setStatus(nextSolved ? "سوال به عنوان حل شده ثبت شد." : "وضعیت سوال روی حل نشده قرار گرفت.", "ok");
  }

  function handleQuestionReviewStatusClick(target) {
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const subjectId = asText(target.dataset.subjectId, "");
    const chapterId = asText(target.dataset.chapterId, "");
    const questionId = asText(target.dataset.questionId, "");
    const status = asText(target.dataset.status, "");
    if (!subjectId || !chapterId || !questionId || !status) {
      return;
    }

    applyQuestionReviewStatusChange(subjectId, chapterId, questionId, status);
  }

  function applyQuestionReviewStatusChange(subjectId, chapterId, questionId, status, options = {}) {
    const result = toggleQuestionReviewStatus(subjectId, chapterId, questionId, status);
    if (!result.changed) {
      return;
    }

    const question = findQuestionByIds(subjectId, chapterId, questionId);
    if (question) {
      clearQuestionLegacyReviewFlags(question);
    }

    const scopedKey = result.scopedKey || buildReviewScopeKey(subjectId, chapterId, questionId);
    if (scopedKey) {
      const noteTimer = reviewNoteDebounceMap.get(scopedKey);
      if (noteTimer) {
        window.clearTimeout(noteTimer);
        reviewNoteDebounceMap.delete(scopedKey);
      }
      const indicatorTimer = reviewNoteSavedIndicatorTimers.get(scopedKey);
      if (indicatorTimer) {
        window.clearTimeout(indicatorTimer);
        reviewNoteSavedIndicatorTimers.delete(scopedKey);
      }
    }

    const nextStatus = normalizeReviewStatus(result.entry?.status || "");
    if (shouldRenderAfterReviewStatusChange(subjectId, chapterId)) {
      render();
    } else {
      syncQuestionReviewUiForVisibleCards(subjectId, chapterId, questionId);
      refreshChapterReviewCounters(subjectId, chapterId);
    }

    const statusLabel = getReviewStatusLabel(nextStatus);
    const prefix = options.fromKeyboard ? "میانبر صفحه‌کلید" : "وضعیت مرور";
    if (!nextStatus) {
      setStatus(`${prefix}: برچسب سوال پاک شد.`, "ok");
      return;
    }

    setStatus(`${prefix}: سوال در حالت «${statusLabel}» قرار گرفت.`, "ok");
  }

  function shouldRenderAfterReviewStatusChange(subjectId, chapterId) {
    if (!isActiveChapter(subjectId, chapterId) || state.view.tab !== "bank") {
      return false;
    }

    const uiState = getChapterUiState(subjectId, chapterId);
    return normalizeReviewFilterMode(uiState.reviewMode) !== "all";
  }

  function shouldRenderAfterSolvedToggle(subjectId, chapterId) {
    if (!isActiveChapter(subjectId, chapterId) || state.view.tab !== "bank") {
      return true;
    }
    const uiState = getChapterUiState(subjectId, chapterId);
    return normalizeSolvedFilterMode(uiState.solvedMode) !== "all";
  }

  function syncQuestionSolvedUiForVisibleCard(subjectId, chapterId, questionId) {
    const card = findVisibleQuestionCard(subjectId, chapterId, questionId);
    if (!(card instanceof HTMLElement)) {
      return;
    }

    const question = findQuestionByIds(subjectId, chapterId, questionId);
    syncQuestionSolvedUiForCard(card, question);
  }

  function syncQuestionSolvedUiForCard(card, question) {
    if (!(card instanceof HTMLElement) || !question) {
      return;
    }

    const solved = resolveQuestionSolvedFlag(question);
    const solvedBadge = card.querySelector(".question-solved-badge");
    if (solvedBadge instanceof HTMLElement) {
      solvedBadge.classList.remove("is-solved", "is-unsolved");
      solvedBadge.classList.add(solved ? "is-solved" : "is-unsolved");
      solvedBadge.title = solved ? "حل شده" : "حل نشده";
      solvedBadge.setAttribute("aria-label", solved ? "حل شده" : "حل نشده");
      solvedBadge.innerHTML = solved
        ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M8 12.5l2.7 2.7L16 9.8"></path></svg>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M8 12h8"></path></svg>';
    }

    const solvedBtn = card.querySelector('[data-action="toggle-question-solved"]');
    if (solvedBtn instanceof HTMLButtonElement) {
      solvedBtn.classList.toggle("is-solved", solved);
      solvedBtn.setAttribute("aria-pressed", solved ? "true" : "false");
      solvedBtn.title = solved ? "ثبت به عنوان حل نشده" : "ثبت به عنوان حل شده";
      solvedBtn.innerHTML = solved
        ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 12.5l3 3L17 8.5"></path></svg><span>حل شده</span>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 12h10"></path></svg><span>حل نشده</span>';
    }
  }

  function handleQuestionReviewNoteToggle(target) {
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const card = target.closest(".question-card");
    if (!(card instanceof HTMLElement)) {
      return;
    }

    const subjectId = asText(target.dataset.subjectId, "");
    const chapterId = asText(target.dataset.chapterId, "");
    const questionId = asText(target.dataset.questionId, "");
    if (!subjectId || !chapterId || !questionId) {
      return;
    }

    const entry = getQuestionReviewEntry(subjectId, chapterId, questionId);
    if (!entry) {
      setStatus("برای ثبت یادداشت، ابتدا وضعیت مرور سوال را انتخاب کن.", "error");
      return;
    }

    let panel = card.querySelector(".question-review-note");
    let shouldOpen = true;
    if (panel instanceof HTMLElement) {
      shouldOpen = panel.hidden;
    }

    if (!(panel instanceof HTMLElement) && shouldOpen) {
      panel = createQuestionReviewNotePanel({
        subjectId,
        chapterId,
        questionId,
        noteText: asText(entry?.note, ""),
        disabled: !entry,
        open: true
      });
      const toolsWrap = card.querySelector(".question-review-tools");
      if (toolsWrap instanceof HTMLElement) {
        toolsWrap.append(panel);
      } else {
        card.append(panel);
      }
    }

    if (!(panel instanceof HTMLElement)) {
      return;
    }

    panel.hidden = !shouldOpen;
    panel.classList.toggle("is-open", shouldOpen);
    target.classList.toggle("is-active", shouldOpen);
    target.setAttribute("aria-expanded", shouldOpen ? "true" : "false");

    if (shouldOpen) {
      const input = panel.querySelector('[data-action="question-review-note-input"]');
      if (input instanceof HTMLTextAreaElement) {
        input.focus();
      }
    }
  }

  function handleQuestionReviewNoteInput(target) {
    if (!(target instanceof HTMLTextAreaElement)) {
      return;
    }

    const subjectId = asText(target.dataset.subjectId, "");
    const chapterId = asText(target.dataset.chapterId, "");
    const questionId = asText(target.dataset.questionId, "");
    if (!subjectId || !chapterId || !questionId) {
      return;
    }

    const cappedValue = cleanReviewNoteText(target.value);
    if (target.value !== cappedValue) {
      target.value = cappedValue;
    }

    const scopedKey = buildReviewScopeKey(subjectId, chapterId, questionId);
    if (!scopedKey) {
      return;
    }

    syncQuestionReviewNoteChars(subjectId, chapterId, questionId, cappedValue.length);
    setQuestionReviewNoteStatusMessage(subjectId, chapterId, questionId, "در حال ذخیره...", "saving");

    const currentTimer = reviewNoteDebounceMap.get(scopedKey);
    if (currentTimer) {
      window.clearTimeout(currentTimer);
    }

    const timerId = window.setTimeout(() => {
      reviewNoteDebounceMap.delete(scopedKey);
      const result = setQuestionReviewNote(subjectId, chapterId, questionId, cappedValue);
      if (result.blocked) {
        setQuestionReviewNoteStatusMessage(
          subjectId,
          chapterId,
          questionId,
          "ابتدا وضعیت مرور را انتخاب کن",
          "error"
        );
        return;
      }

      setQuestionReviewNoteStatusMessage(subjectId, chapterId, questionId, "ذخیره شد", "saved");
      if (result.changed) {
        syncQuestionReviewUiForVisibleCards(subjectId, chapterId, questionId);
      }
    }, REVIEW_NOTE_DEBOUNCE_MS);

    reviewNoteDebounceMap.set(scopedKey, timerId);
  }

  function setQuestionReviewNoteStatusMessage(subjectId, chapterId, questionId, message, stateLabel = "saved") {
    const nodes = refs.levelContainer.querySelectorAll('[data-role="question-review-note-status"]');
    nodes.forEach((node) => {
      if (!(node instanceof HTMLElement)) {
        return;
      }
      if (
        asText(node.dataset.subjectId, "") !== subjectId ||
        asText(node.dataset.chapterId, "") !== chapterId ||
        asText(node.dataset.questionId, "") !== questionId
      ) {
        return;
      }

      node.textContent = asText(message, "");
      node.dataset.state = asText(stateLabel, "saved");
    });

    if (stateLabel !== "saved" && stateLabel !== "error") {
      return;
    }

    const key = buildReviewScopeKey(subjectId, chapterId, questionId);
    if (!key) {
      return;
    }

    const activeTimer = reviewNoteSavedIndicatorTimers.get(key);
    if (activeTimer) {
      window.clearTimeout(activeTimer);
    }

    const hideTimer = window.setTimeout(() => {
      const visibleNodes = refs.levelContainer.querySelectorAll('[data-role="question-review-note-status"]');
      visibleNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) {
          return;
        }
        if (
          asText(node.dataset.subjectId, "") !== subjectId ||
          asText(node.dataset.chapterId, "") !== chapterId ||
          asText(node.dataset.questionId, "") !== questionId
        ) {
          return;
        }
        node.textContent = "";
        node.dataset.state = "idle";
      });
      reviewNoteSavedIndicatorTimers.delete(key);
    }, stateLabel === "error" ? 2200 : 1600);

    reviewNoteSavedIndicatorTimers.set(key, hideTimer);
  }

  function syncQuestionReviewNoteChars(subjectId, chapterId, questionId, length) {
    const counterNodes = refs.levelContainer.querySelectorAll('[data-role="question-review-note-chars"]');
    counterNodes.forEach((node) => {
      if (!(node instanceof HTMLElement)) {
        return;
      }
      if (
        asText(node.dataset.subjectId, "") !== subjectId ||
        asText(node.dataset.chapterId, "") !== chapterId ||
        asText(node.dataset.questionId, "") !== questionId
      ) {
        return;
      }
      node.textContent = `${Math.max(0, length)} / ${REVIEW_NOTE_MAX_LENGTH}`;
    });
  }

  function syncQuestionReviewUiForVisibleCards(subjectId, chapterId, questionId) {
    const card = findVisibleQuestionCard(subjectId, chapterId, questionId);
    if (card) {
      syncQuestionReviewUiForCard(card);
    }
  }

  function findVisibleQuestionCard(subjectId, chapterId, questionId) {
    if (!(refs.levelContainer instanceof HTMLElement)) {
      return null;
    }

    const escapeAttr = (value) => {
      const raw = asText(value, "");
      if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
        return CSS.escape(raw);
      }
      return raw.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    };

    const selector = `.question-card[data-subject-id="${escapeAttr(subjectId)}"][data-chapter-id="${escapeAttr(
      chapterId
    )}"][data-question-id="${escapeAttr(questionId)}"]`;

    const directCard = refs.levelContainer.querySelector(selector);
    if (directCard instanceof HTMLElement) {
      return directCard;
    }

    const fallbackCards = refs.levelContainer.querySelectorAll(".question-card");
    for (const card of fallbackCards) {
      if (!(card instanceof HTMLElement)) {
        continue;
      }
      if (
        asText(card.dataset.subjectId, "") === subjectId &&
        asText(card.dataset.chapterId, "") === chapterId &&
        asText(card.dataset.questionId, "") === questionId
      ) {
        return card;
      }
    }

    return null;
  }

  function syncQuestionReviewUiForCard(card) {
    if (!(card instanceof HTMLElement)) {
      return;
    }

    const subjectId = asText(card.dataset.subjectId, "");
    const chapterId = asText(card.dataset.chapterId, "");
    const questionId = asText(card.dataset.questionId, "");
    if (!subjectId || !chapterId || !questionId) {
      return;
    }

    const entry = getQuestionReviewEntry(subjectId, chapterId, questionId);
    const status = normalizeReviewStatus(entry?.status || "");
    const statusLabel = getReviewStatusLabel(status);

    const badge = card.querySelector('[data-role="question-review-badge"]');
    if (badge instanceof HTMLElement) {
      badge.hidden = !status;
      badge.classList.remove("is-review", "is-key", "is-mastered");
      if (status) {
        badge.classList.add(`is-${status}`);
      }
      badge.textContent = statusLabel;
      badge.setAttribute("aria-label", status ? `وضعیت مرور: ${statusLabel}` : "بدون وضعیت مرور");
      badge.title = status ? `وضعیت مرور: ${statusLabel}` : "بدون وضعیت مرور";
    }

    const statusButtons = card.querySelectorAll('[data-action="question-review-status"]');
    statusButtons.forEach((button) => {
      if (!(button instanceof HTMLButtonElement)) {
        return;
      }
      const buttonStatus = normalizeReviewStatus(button.dataset.status);
      const isActive = !!status && buttonStatus === status;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    let notePanel = card.querySelector(".question-review-note");
    const noteToggle = card.querySelector('[data-action="toggle-question-review-note"]');
    const noteText = asText(entry?.note, "");
    if (!(notePanel instanceof HTMLElement) && noteText) {
      const toolsWrap = card.querySelector(".question-review-tools");
      const createdPanel = createQuestionReviewNotePanel({
        subjectId,
        chapterId,
        questionId,
        noteText,
        disabled: !status,
        open: true
      });
      if (toolsWrap instanceof HTMLElement) {
        toolsWrap.append(createdPanel);
      } else {
        card.append(createdPanel);
      }
      notePanel = createdPanel;
    }

    if (notePanel instanceof HTMLElement) {
      const textarea = notePanel.querySelector('[data-action="question-review-note-input"]');
      if (textarea instanceof HTMLTextAreaElement) {
        textarea.disabled = !status;
        if (textarea.value !== noteText) {
          textarea.value = noteText;
        }
        syncQuestionReviewNoteChars(subjectId, chapterId, questionId, noteText.length);
      }

      if (!status) {
        notePanel.hidden = true;
        notePanel.classList.remove("is-open");
      }
    }

    if (noteToggle instanceof HTMLButtonElement) {
      const isOpen = notePanel instanceof HTMLElement ? !notePanel.hidden : false;
      noteToggle.classList.toggle("is-active", isOpen);
      noteToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      noteToggle.disabled = !status;
      noteToggle.title = status ? "افزودن یادداشت کوتاه" : "ابتدا وضعیت مرور را انتخاب کن";
    }
  }

  function refreshChapterReviewCounters(subjectId, chapterId) {
    if (!isActiveChapter(subjectId, chapterId) || state.view.tab !== "bank") {
      return;
    }

    const chapter = findChapterByIds(subjectId, chapterId);
    if (!chapter) {
      return;
    }
    const counts = getChapterReviewStatusCounts(subjectId, chapterId, chapter.questions || []);
    const counterNodes = refs.levelContainer.querySelectorAll('[data-role="bank-review-counter"]');
    counterNodes.forEach((node) => {
      if (!(node instanceof HTMLElement)) {
        return;
      }
      if (
        asText(node.dataset.subjectId, "") !== subjectId ||
        asText(node.dataset.chapterId, "") !== chapterId
      ) {
        return;
      }
      const kind = asText(node.dataset.kind, "");
      if (kind === "review" || kind === "key" || kind === "mastered") {
        node.textContent = String(counts[kind]);
      }
    });
  }

  function handlePracticeIncludeSolvedChange(target) {
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    const runtime = getActiveRuntime();
    if (!runtime) {
      return;
    }

    runtime.practiceIncludeSolved = !!target.checked;
    runtime.practiceHistory = [];
    runtime.practiceCursor = -1;
    runtime.practiceSeenIds = [];
    runtime.practiceId = null;
    resetPracticeRevealState(runtime);
    render();
  }

  function togglePracticeReveal(kind) {
    const runtime = getActiveRuntime();
    if (!runtime) {
      return;
    }

    if (kind === "hint") {
      const nextState = !runtime.practiceRevealHint;
      runtime.practiceRevealHint = nextState;
      if (nextState) {
        runtime.practiceRevealScrollTarget = "hint";
      }
    }

    if (kind === "solution") {
      const nextState = !runtime.practiceRevealSolution;
      runtime.practiceRevealSolution = nextState;
      if (nextState) {
        runtime.practiceRevealScrollTarget = "solution";
      }
    }

    render();
  }

  async function handlePracticeCopyQuestion(target) {
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const subjectId = asText(target.dataset.subjectId, asText(state.view.subjectId, ""));
    const chapterId = asText(target.dataset.chapterId, asText(state.view.chapterId, ""));
    const questionId = asText(target.dataset.questionId, "");
    if (!subjectId || !chapterId || !questionId) {
      setStatus("اطلاعات سوال برای کپی کامل نیست.", "error");
      return;
    }

    const subject = state.subjects.find((item) => asText(item?.id, "") === subjectId) || null;
    const chapter = subject?.chapters?.find((item) => asText(item?.id, "") === chapterId) || null;
    const question = findQuestionByIds(subjectId, chapterId, questionId);
    if (!question) {
      setStatus("سوال انتخابی پیدا نشد.", "error");
      return;
    }

    const statement = cleanQuestionContentText(asText(question.question_text, asText(question.question, ""))).trim();
    const payload = [
      `درس: ${asText(subject?.name, "-")}`,
      `فصل: ${asText(chapter?.name, asText(question?.chapter, "-"))}`,
      "",
      statement || "متن سوال ثبت نشده است."
    ].join("\n");

    const copied = await copyTextToClipboard(payload);
    if (!copied) {
      setStatus("کپی صورت سوال انجام نشد.", "error");
      return;
    }

    setStatus("صورت سوال در کلیپ‌بورد کپی شد.", "ok");
    showToast("کپی صورت سوال انجام شد.", "success", 1800);
  }

  function handlePracticeToggleReview(target) {
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const subjectId = asText(target.dataset.subjectId, asText(state.view.subjectId, ""));
    const chapterId = asText(target.dataset.chapterId, asText(state.view.chapterId, ""));
    const questionId = asText(target.dataset.questionId, "");
    if (!subjectId || !chapterId || !questionId) {
      return;
    }

    applyQuestionReviewStatusChange(subjectId, chapterId, questionId, "review");
    render();
  }

  function normalizeExamDifficultyPlan(value) {
    const safe = asText(value, "smart-balanced").trim().toLowerCase();
    return ["smart-balanced", "standard", "challenge"].includes(safe) ? safe : "smart-balanced";
  }

  function getExamDifficultyPlanLabel(plan) {
    const map = {
      "smart-balanced": "هوشمند متعادل",
      standard: "استاندارد آزمون",
      challenge: "چالشی"
    };
    return map[normalizeExamDifficultyPlan(plan)] || "هوشمند متعادل";
  }

  function resolveExamDifficultyWeights(profile, plan) {
    const safePlan = normalizeExamDifficultyPlan(plan);
    const safeProfile = asText(profile, "mixed").trim().toLowerCase();

    const base =
      safePlan === "challenge"
        ? { easy: 0.18, medium: 0.32, hard: 0.5 }
        : safePlan === "standard"
          ? { easy: 0.3, medium: 0.5, hard: 0.2 }
          : { easy: 0.26, medium: 0.46, hard: 0.28 };

    if (safeProfile === "mostly-hard") {
      return { easy: 0.12, medium: 0.33, hard: 0.55 };
    }

    return base;
  }

  function buildExamDifficultyBuckets(questions) {
    const buckets = {
      easy: [],
      medium: [],
      hard: []
    };

    (Array.isArray(questions) ? questions : []).forEach((item) => {
      const difficulty = clampNumber(item?.difficulty, 1, 5, 3);
      if (difficulty <= 2) {
        buckets.easy.push(item);
      } else if (difficulty >= 4) {
        buckets.hard.push(item);
      } else {
        buckets.medium.push(item);
      }
    });

    return buckets;
  }

  function buildExamDifficultyQuotaPlan(buckets, targetCount, weights) {
    const safeTarget = Math.max(0, Number(targetCount) || 0);
    const capacities = {
      easy: Array.isArray(buckets?.easy) ? buckets.easy.length : 0,
      medium: Array.isArray(buckets?.medium) ? buckets.medium.length : 0,
      hard: Array.isArray(buckets?.hard) ? buckets.hard.length : 0
    };
    const desired = {
      easy: safeTarget * Math.max(0, Number(weights?.easy) || 0),
      medium: safeTarget * Math.max(0, Number(weights?.medium) || 0),
      hard: safeTarget * Math.max(0, Number(weights?.hard) || 0)
    };
    const quotas = {
      easy: Math.min(capacities.easy, Math.floor(desired.easy)),
      medium: Math.min(capacities.medium, Math.floor(desired.medium)),
      hard: Math.min(capacities.hard, Math.floor(desired.hard))
    };

    let remaining = safeTarget - (quotas.easy + quotas.medium + quotas.hard);
    while (remaining > 0) {
      let bestKey = "";
      let bestGap = -Infinity;
      ["easy", "medium", "hard"].forEach((key) => {
        if (quotas[key] >= capacities[key]) {
          return;
        }
        const gap = desired[key] - quotas[key];
        if (gap > bestGap) {
          bestGap = gap;
          bestKey = key;
        }
      });
      if (!bestKey) {
        break;
      }
      quotas[bestKey] += 1;
      remaining -= 1;
    }

    return quotas;
  }

  function sampleQuestionsByDifficultyPlan(questions, count, profile, difficultyPlan) {
    const list = Array.isArray(questions) ? questions : [];
    if (!list.length) {
      return [];
    }

    const safeCount = clampNumber(count, 1, list.length, Math.min(10, list.length));
    const safeProfile = asText(profile, "mixed").trim().toLowerCase();
    const buckets = buildExamDifficultyBuckets(list);

    if (safeProfile === "only-easy") {
      const source = buckets.easy.length ? buckets.easy : list;
      return sampleWithoutReplacement(source, Math.min(safeCount, source.length));
    }

    if (safeProfile === "only-hard") {
      const source = buckets.hard.length ? buckets.hard : list;
      return sampleWithoutReplacement(source, Math.min(safeCount, source.length));
    }

    const weights = resolveExamDifficultyWeights(safeProfile, difficultyPlan);
    const quotas = buildExamDifficultyQuotaPlan(buckets, safeCount, weights);
    const selected = [
      ...sampleWithoutReplacement(buckets.easy, Math.min(quotas.easy, buckets.easy.length)),
      ...sampleWithoutReplacement(buckets.medium, Math.min(quotas.medium, buckets.medium.length)),
      ...sampleWithoutReplacement(buckets.hard, Math.min(quotas.hard, buckets.hard.length))
    ];
    const usedIds = new Set(selected.map((item) => asText(item?.id, "").trim()).filter(Boolean));

    if (selected.length < safeCount) {
      const remainingPool = list.filter((item) => !usedIds.has(asText(item?.id, "").trim()));
      const rest = sampleWithoutReplacement(remainingPool, Math.min(safeCount - selected.length, remainingPool.length));
      selected.push(...rest);
    }

    const deduped = dedupeQuestionsById(selected).slice(0, safeCount);
    if (safeProfile === "step-up") {
      return deduped.sort((a, b) => clampNumber(a?.difficulty, 1, 5, 3) - clampNumber(b?.difficulty, 1, 5, 3));
    }
    return deduped;
  }

  function selectQuestionsByExamProfile(pool, count, profile, difficultyPlan = "smart-balanced") {
    const questions = Array.isArray(pool) ? pool : [];
    if (!questions.length) {
      return [];
    }

    const safeCount = clampNumber(count, 1, questions.length, Math.min(10, questions.length));
    const normalizedProfile = asText(profile, "mixed").trim().toLowerCase();

    const easyPool = questions.filter((item) => clampNumber(item?.difficulty, 1, 5, 3) <= 2);
    const hardPool = questions.filter((item) => clampNumber(item?.difficulty, 1, 5, 3) >= 4);

    if (normalizedProfile === "only-easy") {
      const source = easyPool.length ? easyPool : questions;
      return sampleWithoutReplacement(source, Math.min(safeCount, source.length));
    }

    if (normalizedProfile === "only-hard") {
      const source = hardPool.length ? hardPool : questions;
      return sampleWithoutReplacement(source, Math.min(safeCount, source.length));
    }

    return sampleQuestionsByDifficultyPlan(questions, safeCount, normalizedProfile, difficultyPlan);
  }

  function getExamProfileLabel(profile) {
    const map = {
      mixed: "ترکیبی",
      "mostly-hard": "اغلب سخت",
      "only-easy": "فقط آسان",
      "only-hard": "فقط سخت",
      "step-up": "پلکانی (آسان به سخت)"
    };
    return map[asText(profile, "mixed")] || "ترکیبی";
  }

  function normalizeExamOrder(order) {
    const safe = asText(order, "random");
    return ["random", "easy-first", "hard-first"].includes(safe) ? safe : "random";
  }

  function orderExamQuestions(questions, order) {
    const mode = normalizeExamOrder(order);
    const list = Array.isArray(questions) ? questions.slice() : [];
    if (mode === "random") {
      return sampleWithoutReplacement(list, list.length);
    }
    if (mode === "easy-first") {
      return list.sort((a, b) => clampNumber(a?.difficulty, 1, 5, 3) - clampNumber(b?.difficulty, 1, 5, 3));
    }
    return list.sort((a, b) => clampNumber(b?.difficulty, 1, 5, 3) - clampNumber(a?.difficulty, 1, 5, 3));
  }

  function getExamOrderLabel(order) {
    const map = {
      random: "تصادفی",
      "easy-first": "آسان به سخت",
      "hard-first": "سخت به آسان"
    };
    return map[normalizeExamOrder(order)] || "تصادفی";
  }

  function sampleBalancedByDifficulty(questions, count) {
    const groups = new Map([
      [1, []],
      [2, []],
      [3, []],
      [4, []],
      [5, []]
    ]);

    questions.forEach((item) => {
      const key = clampNumber(item?.difficulty, 1, 5, 3);
      groups.get(key).push(item);
    });

    groups.forEach((value, key) => {
      groups.set(key, sampleWithoutReplacement(value, value.length));
    });

    const order = [3, 2, 4, 1, 5];
    const result = [];
    const usedIds = new Set();

    while (result.length < count) {
      let added = false;
      for (const key of order) {
        if (result.length >= count) {
          break;
        }
        const bucket = groups.get(key);
        if (!bucket || !bucket.length) {
          continue;
        }
        const next = bucket.shift();
        if (!next || usedIds.has(next.id)) {
          continue;
        }
        result.push(next);
        usedIds.add(next.id);
        added = true;
      }
      if (!added) {
        break;
      }
    }

    if (result.length < count) {
      const remaining = questions.filter((item) => !usedIds.has(item.id));
      const rest = sampleWithoutReplacement(remaining, Math.min(count - result.length, remaining.length));
      result.push(...rest);
    }

    return result.slice(0, count);
  }

  function dedupeQuestionsById(questions) {
    const unique = [];
    const ids = new Set();
    (questions || []).forEach((item) => {
      const id = asText(item?.id, "");
      if (!id || ids.has(id)) {
        return;
      }
      ids.add(id);
      unique.push(item);
    });
    return unique;
  }

  function summarizeQuestionDifficulty(questions) {
    const summary = { easy: 0, medium: 0, hard: 0 };
    (questions || []).forEach((item) => {
      const difficulty = clampNumber(item?.difficulty, 1, 5, 3);
      if (difficulty <= 2) {
        summary.easy += 1;
      } else if (difficulty >= 4) {
        summary.hard += 1;
      } else {
        summary.medium += 1;
      }
    });
    return summary;
  }

  function handleQuestionSelectionChange(target) {
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    const subjectId = asText(target.dataset.subjectId, "");
    const chapterId = asText(target.dataset.chapterId, "");
    const questionId = asText(target.dataset.questionId, "");
    if (!subjectId || !chapterId || !questionId) {
      return;
    }

    const uiState = getChapterUiState(subjectId, chapterId);
    if (target.checked) {
      uiState.selectedIds.add(questionId);
    } else {
      uiState.selectedIds.delete(questionId);
    }

    refreshBulkDeleteBar(subjectId, chapterId);
  }

  function reconcileSelectedQuestions(uiState, questions) {
    if (!uiState || !uiState.selectedIds.size) {
      return;
    }

    const validIds = new Set((questions || []).map((item) => item.id));
    Array.from(uiState.selectedIds).forEach((id) => {
      if (!validIds.has(id)) {
        uiState.selectedIds.delete(id);
      }
    });
  }

  function reconcileQuestionTimers(uiState, questions) {
    if (!uiState || !(uiState.questionTimers instanceof Map)) {
      return;
    }

    const validIds = new Set((questions || []).map((item) => item.id));
    let removedRunningTimer = false;
    Array.from(uiState.questionTimers.keys()).forEach((questionId) => {
      if (validIds.has(questionId)) {
        return;
      }
      const timerEntry = uiState.questionTimers.get(questionId);
      if (timerEntry?.running) {
        removedRunningTimer = true;
      }
      uiState.questionTimers.delete(questionId);
    });

    if (uiState.activeQuestionTimerId && !validIds.has(uiState.activeQuestionTimerId)) {
      uiState.activeQuestionTimerId = "";
    }
    if (removedRunningTimer) {
      invalidateRunningQuestionTimersCache();
    }
  }

  function refreshBulkDeleteBar(subjectId, chapterId) {
    if (!isActiveChapter(subjectId, chapterId) || state.view.tab !== "bank") {
      return;
    }

    const bar = refs.levelContainer.querySelector(".bulk-delete-bar");
    if (!(bar instanceof HTMLElement)) {
      return;
    }

    if (bar.dataset.subjectId !== subjectId || bar.dataset.chapterId !== chapterId) {
      return;
    }

    const uiState = getChapterUiState(subjectId, chapterId);
    const selectedCount = uiState.selectedIds.size;
    const countNode = bar.querySelector(".bulk-delete-count");
    const buttonNode = bar.querySelector(".bulk-delete-btn");

    bar.classList.toggle("is-active", selectedCount > 0);

    if (countNode) {
      countNode.textContent = selectedCount > 0 ? `${selectedCount} سوال انتخاب شده` : "هیچ سوالی انتخاب نشده است";
    }

    if (buttonNode instanceof HTMLButtonElement) {
      buttonNode.disabled = selectedCount <= 0;
    }
  }

  function handleQuestionEditToggle(target) {
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (isMobileViewportActive()) {
      return;
    }

    const subjectId = asText(target.dataset.subjectId, "");
    const chapterId = asText(target.dataset.chapterId, "");
    const questionId = asText(target.dataset.questionId, "");
    if (!subjectId || !chapterId || !questionId) {
      return;
    }

    const chapter = findChapterByIds(subjectId, chapterId);
    if (!chapter || !Array.isArray(chapter.questions) || !chapter.questions.some((item) => item?.id === questionId)) {
      return;
    }

    const uiState = getChapterUiState(subjectId, chapterId);
    uiState.editingQuestionId = uiState.editingQuestionId === questionId ? "" : questionId;

    if (isActiveChapter(subjectId, chapterId) && state.view.tab === "bank") {
      queueRender();
    }
  }

  function handleQuestionEditCancel(target) {
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const subjectId = asText(target.dataset.subjectId, "");
    const chapterId = asText(target.dataset.chapterId, "");
    if (!subjectId || !chapterId) {
      return;
    }

    const uiState = getChapterUiState(subjectId, chapterId);
    if (!uiState.editingQuestionId) {
      return;
    }
    uiState.editingQuestionId = "";

    if (isActiveChapter(subjectId, chapterId) && state.view.tab === "bank") {
      queueRender();
    }
  }

  function parseQuestionAssetsDraft(rawText) {
    const source = asText(rawText, "").trim();
    if (!source) {
      return {
        ok: true,
        assets: [],
        repaired: false,
        repairActions: []
      };
    }

    const parsed = parseJsonTextWithDiagnostics(source);
    if (!parsed?.ok) {
      const firstCause = Array.isArray(parsed?.causes) && parsed.causes.length ? asText(parsed.causes[0], "").trim() : "";
      return {
        ok: false,
        message: firstCause || asText(parsed?.summary, "JSON مربوط به assets معتبر نیست."),
        repaired: false,
        repairActions: []
      };
    }

    const value = parsed.value;
    const entries = Array.isArray(value)
      ? value
      : value && typeof value === "object"
        ? [value]
        : null;

    if (!entries) {
      return {
        ok: false,
        message: "فرمت assets باید آرایه یا آبجکت JSON باشد.",
        repaired: false,
        repairActions: []
      };
    }

    const normalized = normalizeQuestionAssetPayload({ assets: entries });
    if (entries.length > 0 && !normalized.length) {
      return {
        ok: false,
        message:
          "assets معتبر نیست. برای هر تصویر از mode=url یا mode=pdf-crop (همراه page و bbox) استفاده کن.",
        repaired: false,
        repairActions: []
      };
    }

    return {
      ok: true,
      assets: normalized,
      repaired: !!parsed.repaired,
      repairActions: Array.isArray(parsed.repairActions) ? parsed.repairActions : []
    };
  }

  function saveQuestionEditFromForm(form) {
    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    if (isMobileViewportActive()) {
      setStatus("ویرایش سوال فقط در نمای دسکتاپ فعال است.", "error");
      return;
    }

    const subjectId = asText(form.dataset.subjectId, "");
    const chapterId = asText(form.dataset.chapterId, "");
    const questionId = asText(form.dataset.questionId, "");
    if (!subjectId || !chapterId || !questionId) {
      setStatus("شناسه سوال برای ویرایش ناقص است.", "error");
      return;
    }

    const chapter = findChapterByIds(subjectId, chapterId);
    const question = findQuestionByIds(subjectId, chapterId, questionId);
    if (!chapter || !question) {
      setStatus("سوال انتخاب شده برای ویرایش پیدا نشد.", "error");
      return;
    }

    const formData = new FormData(form);
    const nextQuestionText = cleanQuestionContentText(asText(formData.get("question"), ""));
    if (!nextQuestionText) {
      setStatus("صورت سوال نمی‌تواند خالی باشد.", "error");
      return;
    }

    const nextHintText = cleanQuestionContentText(asText(formData.get("hint"), ""));
    const nextSolutionText = cleanQuestionContentText(asText(formData.get("solution"), ""));
    const nextTopic = cleanQuestionContentText(asText(formData.get("topic"), "")).trim() || "عمومی";
    const nextMethod = cleanQuestionContentText(asText(formData.get("method"), "")).trim();
    const nextDifficulty = clampNumber(Number.parseInt(asText(formData.get("difficulty"), "3"), 10), 1, 5, 3);
    const nextSolved = formData.get("solved") !== null;
    const parsedAssets = parseQuestionAssetsDraft(asText(formData.get("assets"), ""));
    if (!parsedAssets.ok) {
      setStatus(asText(parsedAssets.message, "JSON مربوط به assets معتبر نیست."), "error");
      showToast("فرمت assets نامعتبر است.", "error", 2600);
      return;
    }

    question.topic = nextTopic;
    question.method = nextMethod;
    question.difficulty = nextDifficulty;
    question.question = nextQuestionText;
    question.question_text = nextQuestionText;
    question.hint = nextHintText;
    question.solution = nextSolutionText;
    question.step_by_step_solution = nextSolutionText;
    question.solved = nextSolved;
    question.assets = parsedAssets.assets;
    question.chapter = asText(question.chapter, chapter.name) || chapter.name;

    const uiState = getChapterUiState(subjectId, chapterId);
    uiState.editingQuestionId = "";

    persistSubjects();
    render();
    if (parsedAssets.repaired) {
      const repairSuffix = parsedAssets.repairActions.length
        ? ` (${parsedAssets.repairActions.length} اصلاح خودکار)`
        : "";
      setStatus(`ویرایش سوال ذخیره شد${repairSuffix}.`, "ok");
      showToast("assets با اصلاح خودکار ذخیره شد.", "info", 2500);
      return;
    }
    setStatus("ویرایش سوال ذخیره شد.", "ok");
    showToast("تغییرات سوال با موفقیت ذخیره شد.", "success", 2200);
  }

  function buildDeleteUndoRuntimeEntriesSnapshot() {
    const runtimeEntries = [];
    chapterRuntime.forEach((runtime, key) => {
      const [subjectId, chapterId] = asText(key, "").trim().split("::");
      if (!subjectId || !chapterId) {
        return;
      }
      const runtimeSnapshot = serializeChapterRuntimeSnapshot(runtime);
      if (!runtimeSnapshot) {
        return;
      }
      runtimeEntries.push({
        subjectId,
        chapterId,
        runtime: runtimeSnapshot
      });
    });
    return runtimeEntries;
  }

  function restoreDeleteUndoRuntimeEntries(runtimeEntries) {
    if (!Array.isArray(runtimeEntries) || !runtimeEntries.length) {
      return;
    }

    runtimeEntries.forEach((entry) => {
      const subjectId = asText(entry?.subjectId, "").trim();
      const chapterId = asText(entry?.chapterId, "").trim();
      if (!subjectId || !chapterId) {
        return;
      }
      const chapter = findChapterByIds(subjectId, chapterId);
      if (!chapter) {
        return;
      }
      const runtime = getRuntime(subjectId, chapterId);
      applyChapterRuntimeSnapshot(runtime, entry.runtime);
      reconcileRuntimeAfterQuestionMutation(subjectId, chapterId, chapter);
    });
  }

  function captureDeleteUndoSnapshot() {
    return {
      subjects: cloneJsonValue(state.subjects, []),
      terms: cloneJsonValue(state.terms, {}),
      session: buildLastSessionSnapshot(),
      runtimeEntries: buildDeleteUndoRuntimeEntriesSnapshot()
    };
  }

  function restoreDeleteUndoSnapshot(snapshot) {
    if (!snapshot || !Array.isArray(snapshot.subjects)) {
      return false;
    }

    state.subjects = cloneJsonValue(snapshot.subjects, []);
    state.terms = sanitizeReviewTermsObject(snapshot.terms);
    chapterRuntime.clear();
    chapterUiState.clear();
    chapterMapUiState.clear();
    chapterTreeCollapseState.clear();
    activeChapterMapView = null;

    restoreDeleteUndoRuntimeEntries(snapshot.runtimeEntries);
    applyLastSessionSnapshotState(snapshot.session, { restoreRuntime: false });
    sanitizeView();

    reconcileReviewMetadataAfterDataChange({ migrateLegacy: false, persist: false });
    persistSubjects();
    persistReviewMetadata();
    persistPreferences();
    render();
    return true;
  }

  function offerDeleteUndoToast(snapshot, deletedMessage = "مورد انتخابی حذف شد.") {
    if (!snapshot) {
      return;
    }

    const token = createId("undo");
    pendingDeleteUndoToken = token;
    showActionToast(
      `${deletedMessage} برای بازگردانی، اینجا بزن.`,
      "بازگردانی",
      () => {
        if (pendingDeleteUndoToken !== token) {
          return;
        }
        pendingDeleteUndoToken = "";
        if (restoreDeleteUndoSnapshot(snapshot)) {
          setStatus("حذف انجام‌شده بازگردانی شد.", "ok");
          showToast("حذف با موفقیت بازگردانی شد.", "success", 2400);
          return;
        }
        setStatus("بازگردانی حذف انجام نشد.", "error");
        showToast("بازگردانی حذف ناموفق بود.", "error", 2600);
      },
      { timeout: DELETE_UNDO_TOAST_TIMEOUT_MS, kind: "info" }
    );
  }

  async function handleSubjectDelete(actionTarget) {
    const subjectId = asText(actionTarget.dataset.subjectId, "");
    if (!subjectId) {
      return;
    }

    const subjectIndex = state.subjects.findIndex((item) => item.id === subjectId);
    if (subjectIndex < 0) {
      return;
    }
    const undoSnapshot = captureDeleteUndoSnapshot();

    await animateDeletion(actionTarget.closest(".card-shell"));

    state.subjects.splice(subjectIndex, 1);
    clearSubjectRuntime(subjectId);
    clearSubjectUi(subjectId);
    chapterMapUiState.delete(subjectId);
    chapterTreeCollapseState.delete(subjectId);
    activeChapterMapView = null;

    if (state.view.subjectId === subjectId) {
      state.view.level = 1;
      state.view.subjectId = null;
      state.view.chapterId = null;
      state.view.tab = "bank";
      state.pagination.page = 1;
    }

    reconcileReviewMetadataAfterDataChange({ migrateLegacy: false });
    pruneExamLibraryAgainstSubjects();
    persistSubjects();
    sanitizeView();
    render();
    setStatus("درس حذف شد.", "ok");
    offerDeleteUndoToast(undoSnapshot, "درس حذف شد.");
  }

  async function handleChapterDelete(actionTarget) {
    const subjectId = asText(actionTarget.dataset.subjectId, "");
    const chapterId = asText(actionTarget.dataset.chapterId, "");
    if (!subjectId || !chapterId) {
      return;
    }

    const subject = state.subjects.find((item) => item.id === subjectId);
    if (!subject) {
      return;
    }

    const chapterIndex = subject.chapters.findIndex((item) => item.id === chapterId);
    if (chapterIndex < 0) {
      return;
    }
    const undoSnapshot = captureDeleteUndoSnapshot();

    await animateDeletion(actionTarget.closest(".card-shell"));

    subject.chapters.splice(chapterIndex, 1);
    normalizeSubjectChapterOrder(subject);
    chapterRuntime.delete(`${subjectId}::${chapterId}`);
    clearChapterUi(subjectId, chapterId);

    if (state.view.chapterId === chapterId) {
      state.view.level = 2;
      state.view.chapterId = null;
      state.view.tab = "bank";
      state.pagination.page = 1;
    }

    reconcileReviewMetadataAfterDataChange({ migrateLegacy: false });
    pruneExamLibraryAgainstSubjects();
    persistSubjects();
    sanitizeView();
    render();
    setStatus("فصل حذف شد.", "ok");
    offerDeleteUndoToast(undoSnapshot, "فصل حذف شد.");
  }

  async function handleSingleQuestionDelete(actionTarget) {
    const subjectId = asText(actionTarget.dataset.subjectId, "");
    const chapterId = asText(actionTarget.dataset.chapterId, "");
    const questionId = asText(actionTarget.dataset.questionId, "");
    if (!subjectId || !chapterId || !questionId) {
      return;
    }

    const chapter = findChapterByIds(subjectId, chapterId);
    if (!chapter) {
      return;
    }

    const index = chapter.questions.findIndex((item) => item.id === questionId);
    if (index < 0) {
      return;
    }
    const undoSnapshot = captureDeleteUndoSnapshot();

    await animateDeletion(actionTarget.closest(".question-card"));

    chapter.questions.splice(index, 1);
    removeQuestionReviewMetadataFromAllTerms(subjectId, chapterId, questionId);

    const uiState = getChapterUiState(subjectId, chapterId);
    uiState.selectedIds.delete(questionId);
    const removedTimer = uiState.questionTimers.get(questionId);
    uiState.questionTimers.delete(questionId);
    if (uiState.activeQuestionTimerId === questionId) {
      uiState.activeQuestionTimerId = "";
    }
    if (removedTimer?.running) {
      invalidateRunningQuestionTimersCache();
    }

    reconcileRuntimeAfterQuestionMutation(subjectId, chapterId, chapter);
    persistSubjects();
    render();
    setStatus("سوال حذف شد.", "ok");
    offerDeleteUndoToast(undoSnapshot, "سوال حذف شد.");
  }

  async function handleBulkQuestionDelete(actionTarget) {
    const subjectId = asText(actionTarget.dataset.subjectId, "");
    const chapterId = asText(actionTarget.dataset.chapterId, "");
    if (!subjectId || !chapterId) {
      return;
    }

    const chapter = findChapterByIds(subjectId, chapterId);
    if (!chapter) {
      return;
    }

    const uiState = getChapterUiState(subjectId, chapterId);
    if (!uiState.selectedIds.size) {
      return;
    }
    const undoSnapshot = captureDeleteUndoSnapshot();

    const cards = refs.levelContainer.querySelectorAll(".question-card");
    cards.forEach((card) => {
      const id = asText(card.dataset.questionId, "");
      if (uiState.selectedIds.has(id)) {
        card.classList.add("is-removing");
      }
    });
    await wait(DELETE_ANIMATION_MS);

    const selectedIds = new Set(uiState.selectedIds);
    const beforeCount = chapter.questions.length;
    chapter.questions = chapter.questions.filter((item) => !selectedIds.has(item.id));
    const removedCount = beforeCount - chapter.questions.length;
    let reviewMetaRemoved = false;
    selectedIds.forEach((questionId) => {
      reviewMetaRemoved =
        removeQuestionReviewMetadataFromAllTerms(subjectId, chapterId, questionId, { persist: false }) || reviewMetaRemoved;
    });
    if (reviewMetaRemoved) {
      persistReviewMetadata();
    }

    uiState.selectedIds.clear();
    let removedRunningTimer = false;
    selectedIds.forEach((questionId) => {
      const timerEntry = uiState.questionTimers.get(questionId);
      if (timerEntry?.running) {
        removedRunningTimer = true;
      }
      uiState.questionTimers.delete(questionId);
    });
    if (uiState.activeQuestionTimerId && selectedIds.has(uiState.activeQuestionTimerId)) {
      uiState.activeQuestionTimerId = "";
    }
    if (removedRunningTimer) {
      invalidateRunningQuestionTimersCache();
    }
    reconcileRuntimeAfterQuestionMutation(subjectId, chapterId, chapter);
    persistSubjects();
    render();
    setStatus(`${removedCount} سوال حذف شد.`, "ok");
    if (removedCount > 0) {
      offerDeleteUndoToast(undoSnapshot, `${removedCount} سوال حذف شد.`);
    }
  }

  async function handleAllQuestionsDelete(actionTarget) {
    const subjectId = asText(actionTarget.dataset.subjectId, "");
    const chapterId = asText(actionTarget.dataset.chapterId, "");
    if (!subjectId || !chapterId) {
      return;
    }

    const chapter = findChapterByIds(subjectId, chapterId);
    if (!chapter) {
      return;
    }

    const totalCount = Array.isArray(chapter.questions) ? chapter.questions.length : 0;
    if (!totalCount) {
      setStatus("سوالی برای حذف کامل وجود ندارد.", "error");
      return;
    }

    const approved = window.confirm(`تمام ${totalCount} سوال این فصل به صورت کامل حذف شود؟`);
    if (!approved) {
      return;
    }
    const undoSnapshot = captureDeleteUndoSnapshot();

    const cards = refs.levelContainer.querySelectorAll(".question-card");
    cards.forEach((card) => card.classList.add("is-removing"));
    await wait(DELETE_ANIMATION_MS);

    const questionIds = chapter.questions.map((item) => asText(item?.id, "")).filter(Boolean);
    let reviewMetaRemoved = false;
    questionIds.forEach((questionId) => {
      reviewMetaRemoved =
        removeQuestionReviewMetadataFromAllTerms(subjectId, chapterId, questionId, { persist: false }) || reviewMetaRemoved;
    });
    if (reviewMetaRemoved) {
      persistReviewMetadata();
    }

    chapter.questions = [];

    const uiState = getChapterUiState(subjectId, chapterId);
    uiState.selectedIds.clear();
    const hadRunningTimer = Array.from(uiState.questionTimers.values()).some((entry) => entry?.running);
    uiState.questionTimers.clear();
    uiState.activeQuestionTimerId = "";
    if (hadRunningTimer) {
      invalidateRunningQuestionTimersCache();
    }

    reconcileRuntimeAfterQuestionMutation(subjectId, chapterId, chapter);
    persistSubjects();
    render();
    setStatus("همه سوالات فصل حذف شدند.", "ok");
    offerDeleteUndoToast(undoSnapshot, "تمام سوالات فصل حذف شد.");
  }

  function findChapterByIds(subjectId, chapterId) {
    const subject = state.subjects.find((item) => item.id === subjectId);
    if (!subject) {
      return null;
    }

    return subject.chapters.find((item) => item.id === chapterId) || null;
  }

  function findQuestionByIds(subjectId, chapterId, questionId) {
    const chapter = findChapterByIds(subjectId, chapterId);
    if (!chapter || !Array.isArray(chapter.questions)) {
      return null;
    }

    return chapter.questions.find((item) => asText(item?.id, "") === asText(questionId, "")) || null;
  }

  function clearQuestionLegacyReviewFlags(question) {
    if (!question || typeof question !== "object") {
      return;
    }

    [
      "legacyReviewStatus",
      "reviewStatus",
      "review_state",
      "reviewState",
      "starred",
      "isStarred",
      "key",
      "keyPoint",
      "isKeyPoint",
      "mastered",
      "isMastered",
      "needsReview"
    ].forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(question, key)) {
        delete question[key];
      }
    });

    if (question.progress && typeof question.progress === "object" && !Array.isArray(question.progress)) {
      [
        "reviewStatus",
        "reviewState",
        "starred",
        "keyPoint",
        "mastered",
        "needsReview"
      ].forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(question.progress, key)) {
          delete question.progress[key];
        }
      });
    }
  }

  function reconcileRuntimeAfterQuestionMutation(subjectId, chapterId, chapter) {
    const runtime = getRuntime(subjectId, chapterId);
    const questionIds = new Set((chapter.questions || []).map((item) => item.id));

    if (!questionIds.size) {
      runtime.practiceId = null;
      runtime.practiceProfile = "all";
      runtime.practiceHistory = [];
      runtime.practiceCursor = -1;
      runtime.practiceSeenIds = [];
      runtime.practiceRevealHint = false;
      runtime.practiceRevealSolution = false;
      runtime.practiceRevealScrollTarget = "";
      runtime.exam = null;
      return;
    }

    if (runtime.practiceId && !questionIds.has(runtime.practiceId)) {
      runtime.practiceId = null;
    }

    runtime.practiceHistory = Array.isArray(runtime.practiceHistory)
      ? runtime.practiceHistory.filter((id) => questionIds.has(id))
      : [];
    runtime.practiceSeenIds = Array.isArray(runtime.practiceSeenIds)
      ? runtime.practiceSeenIds.filter((id) => questionIds.has(id))
      : [];

    const historyFallback = runtime.practiceHistory.length ? runtime.practiceHistory.length - 1 : -1;
    runtime.practiceCursor = clampNumber(runtime.practiceCursor, -1, historyFallback, historyFallback);

    if (!runtime.practiceId && runtime.practiceHistory.length && runtime.practiceCursor >= 0) {
      runtime.practiceId = runtime.practiceHistory[runtime.practiceCursor] || null;
    }

    if (runtime.exam?.ids?.length) {
      runtime.exam.ids = runtime.exam.ids.filter((id) => questionIds.has(id));
      if (!runtime.exam.ids.length) {
        runtime.exam = null;
      } else {
        runtime.exam.count = runtime.exam.ids.length;
        runtime.exam.page = 1;
      }
    }
  }

  async function animateDeletion(node) {
    if (!(node instanceof HTMLElement)) {
      return;
    }

    if (isMobileViewportActive()) {
      return;
    }

    node.classList.add("is-removing");
    await wait(DELETE_ANIMATION_MS);
  }

  function wait(timeout) {
    return new Promise((resolve) => {
      window.setTimeout(resolve, timeout);
    });
  }

  function debounce(callback, timeout) {
    let timerId = null;
    return (...args) => {
      clearTimeout(timerId);
      timerId = window.setTimeout(() => {
        callback(...args);
      }, timeout);
    };
  }

  function pickRandomQuestionId(questions, excludeId = "") {
    if (!Array.isArray(questions) || !questions.length) {
      return null;
    }

    if (questions.length > 1) {
      const filtered = questions.filter((item) => item?.id !== excludeId);
      if (filtered.length) {
        const idx = Math.floor(Math.random() * filtered.length);
        return filtered[idx].id;
      }
    }

    const index = Math.floor(Math.random() * questions.length);
    return questions[index].id;
  }

  function sampleWithoutReplacement(pool, count) {
    const result = pool.slice();

    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }

    return result.slice(0, count);
  }

  function countSubjectQuestions(subject) {
    if (!subject || !Array.isArray(subject.chapters)) {
      return 0;
    }
    const cached = subjectQuestionCountCache.get(subject);
    if (
      cached &&
      cached.revision === subjectsRevision &&
      cached.chapterCount === subject.chapters.length
    ) {
      return cached.value;
    }

    const value = subject.chapters.reduce((sum, chapter) => {
      const count = Array.isArray(chapter?.questions) ? chapter.questions.length : 0;
      return sum + count;
    }, 0);

    subjectQuestionCountCache.set(subject, {
      revision: subjectsRevision,
      chapterCount: subject.chapters.length,
      value
    });

    return value;
  }

  function rememberVisibleQuestion(subjectId, chapterId, question) {
    const token = `${subjectId}::${chapterId}::${question.id}`;
    visibleQuestionLookup.set(token, question);
    return token;
  }

  function renderDifficultyStars(value) {
    const safe = clampNumber(value, 1, 5, 3);
    return `${"★".repeat(safe)}${"☆".repeat(5 - safe)}`;
  }

  function normalizeReviewStatus(value) {
    const safe = asText(value, "").trim().toLowerCase();
    return safe === "review" || safe === "key" || safe === "mastered" ? safe : "";
  }

  function normalizeReviewFilterMode(value) {
    const safe = asText(value, "all").trim().toLowerCase();
    return safe === "review" || safe === "key" || safe === "mastered" || safe === "none" ? safe : "all";
  }

  function cleanReviewNoteText(value) {
    const normalized = cleanQuestionContentText(asText(value, ""));
    return normalized.length > REVIEW_NOTE_MAX_LENGTH ? normalized.slice(0, REVIEW_NOTE_MAX_LENGTH) : normalized;
  }

  function normalizeReviewUpdatedAt(value) {
    const raw = asText(value, "").trim();
    if (!raw) {
      return new Date().toISOString();
    }
    const parsedMs = Date.parse(raw);
    return Number.isFinite(parsedMs) ? new Date(parsedMs).toISOString() : new Date().toISOString();
  }

  function normalizeReviewEntry(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return null;
    }

    const status = normalizeReviewStatus(value.status);
    if (!status) {
      return null;
    }

    const next = {
      status,
      updatedAt: normalizeReviewUpdatedAt(value.updatedAt)
    };

    const note = cleanReviewNoteText(value.note);
    if (note) {
      next.note = note;
    }

    return next;
  }

  function sanitizeReviewTermsObject(source) {
    if (!source || typeof source !== "object" || Array.isArray(source)) {
      return {};
    }

    const sanitized = {};
    Object.entries(source).forEach(([termKey, termValue]) => {
      const safeTermKey = normalizeProfileSemesterValue(termKey, "2");
      const reviewSource =
        termValue && typeof termValue === "object" && !Array.isArray(termValue)
          ? termValue.review
          : null;
      const safeReview = {};

      if (reviewSource && typeof reviewSource === "object" && !Array.isArray(reviewSource)) {
        Object.entries(reviewSource).forEach(([scopedId, rawEntry]) => {
          const normalizedEntry = normalizeReviewEntry(rawEntry);
          if (normalizedEntry && asText(scopedId, "").trim()) {
            safeReview[asText(scopedId, "").trim()] = normalizedEntry;
          }
        });
      }

      if (!sanitized[safeTermKey]) {
        sanitized[safeTermKey] = { review: {} };
      }
      sanitized[safeTermKey].review = { ...sanitized[safeTermKey].review, ...safeReview };
    });

    return sanitized;
  }

  function restoreReviewMetadata() {
    const raw = localStorage.getItem(STORAGE_KEYS.review);
    if (!raw) {
      state.terms = {};
      ensureTermReviewStore();
      return;
    }

    try {
      const payload = parseJsonSafe(raw, {});
      const source =
        payload && typeof payload === "object" && !Array.isArray(payload) && payload.terms && typeof payload.terms === "object"
          ? payload.terms
          : payload;
      state.terms = sanitizeReviewTermsObject(source);
    } catch (error) {
      console.error(error);
      state.terms = {};
    }

    ensureTermReviewStore();
    bumpReviewMetadataRevision();
    updateLocalSyncHash();
    scheduleDriveSyncDiagnosticsRender();
  }

  function persistReviewMetadata() {
    try {
      localStorage.setItem(
        STORAGE_KEYS.review,
        JSON.stringify({
          version: 1,
          updatedAt: new Date().toISOString(),
          terms: sanitizeReviewTermsObject(state.terms)
        })
      );
      bumpReviewMetadataRevision();
      markLocalDataEdited();
      queueAutomaticDriveSync("review");
    } catch (error) {
      console.error(error);
    }
  }

  function normalizeExamLibraryTimestamp(value) {
    const raw = asText(value, "").trim();
    if (!raw) {
      return new Date().toISOString();
    }
    const parsedMs = Date.parse(raw);
    return Number.isFinite(parsedMs) ? new Date(parsedMs).toISOString() : new Date().toISOString();
  }

  function normalizeExamLibraryChapterPlan(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return {};
    }
    const plan = {};
    Object.entries(value).forEach(([chapterId, rawCount]) => {
      const safeChapterId = asText(chapterId, "").trim();
      if (!safeChapterId) {
        return;
      }
      const parsed = Number.parseInt(asText(rawCount, "0"), 10);
      plan[safeChapterId] = Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
    });
    return plan;
  }

  function normalizeExamLibraryEntry(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return null;
    }

    const subjectId = asText(value.subjectId, "").trim();
    const chapterId = asText(value.chapterId, "").trim();
    if (!subjectId || !chapterId) {
      return null;
    }

    const chapterIds = sanitizeRuntimeIdSequence(value.chapterIds);
    const ids = sanitizeRuntimeIdSequence(value.ids);
    const rawProfile = asText(value.profile, "mixed").trim().toLowerCase();
    const profile = ["mixed", "mostly-hard", "only-easy", "only-hard", "step-up"].includes(rawProfile)
      ? rawProfile
      : "mixed";
    const requestedCountRaw = Number.parseInt(asText(value.requestedCount, String(ids.length || 10)), 10);
    const requestedCount = Number.isFinite(requestedCountRaw) ? Math.max(1, requestedCountRaw) : Math.max(1, ids.length || 10);

    return {
      id: asText(value.id, createId("exlib")).trim() || createId("exlib"),
      label: asText(value.label, "").trim() || "آزمون ذخیره‌شده",
      subjectId,
      chapterId,
      subjectName: asText(value.subjectName, "").trim() || "درس",
      chapterName: asText(value.chapterName, "").trim() || "فصل",
      profile,
      order: normalizeExamOrder(value.order),
      difficultyPlan: normalizeExamDifficultyPlan(value.difficultyPlan),
      duration: clampNumber(value.duration, EXAM_DURATION_MIN, EXAM_DURATION_MAX, EXAM_DURATION_DEFAULT),
      requestedCount,
      chapterIds: chapterIds.length ? chapterIds : [chapterId],
      requestedChapterCounts: normalizeExamLibraryChapterPlan(value.requestedChapterCounts),
      ids,
      createdAt: normalizeExamLibraryTimestamp(value.createdAt),
      updatedAt: normalizeExamLibraryTimestamp(value.updatedAt || value.createdAt)
    };
  }

  function sanitizeExamLibraryCollection(source) {
    const entries = Array.isArray(source) ? source : [];
    const normalized = [];
    const usedIds = new Set();

    entries.forEach((entry) => {
      const normalizedEntry = normalizeExamLibraryEntry(entry);
      if (!normalizedEntry) {
        return;
      }
      if (usedIds.has(normalizedEntry.id)) {
        normalizedEntry.id = createId("exlib");
      }
      usedIds.add(normalizedEntry.id);
      normalized.push(normalizedEntry);
    });

    normalized.sort((a, b) => Date.parse(b.updatedAt || b.createdAt || 0) - Date.parse(a.updatedAt || a.createdAt || 0));
    return normalized.slice(0, EXAM_LIBRARY_MAX_ITEMS);
  }

  function restoreExamLibrary() {
    const raw = localStorage.getItem(STORAGE_KEYS.examLibrary);
    if (!raw) {
      state.examLibrary = [];
      return;
    }

    try {
      const payload = parseJsonSafe(raw, []);
      const source = Array.isArray(payload?.items) ? payload.items : payload;
      state.examLibrary = sanitizeExamLibraryCollection(source);
    } catch (error) {
      console.error(error);
      state.examLibrary = [];
    }
  }

  function persistExamLibrary() {
    try {
      state.examLibrary = sanitizeExamLibraryCollection(state.examLibrary);
      localStorage.setItem(
        STORAGE_KEYS.examLibrary,
        JSON.stringify({
          version: 1,
          updatedAt: new Date().toISOString(),
          items: state.examLibrary
        })
      );
    } catch (error) {
      console.error(error);
    }
  }

  function pruneExamLibraryAgainstSubjects(options = {}) {
    const subjectMap = new Map();
    (state.subjects || []).forEach((subject) => {
      const subjectId = asText(subject?.id, "").trim();
      if (!subjectId) {
        return;
      }
      const chapterIds = new Set((subject?.chapters || []).map((chapter) => asText(chapter?.id, "").trim()).filter(Boolean));
      subjectMap.set(subjectId, chapterIds);
    });

    const previous = Array.isArray(state.examLibrary) ? state.examLibrary : [];
    const next = previous.filter((entry) => {
      const subjectId = asText(entry?.subjectId, "").trim();
      const chapterId = asText(entry?.chapterId, "").trim();
      const chapterIds = subjectMap.get(subjectId);
      return !!(subjectId && chapterId && chapterIds && chapterIds.has(chapterId));
    });

    const changed = next.length !== previous.length;
    if (changed) {
      state.examLibrary = next;
      if (options.persist !== false) {
        persistExamLibrary();
      }
    } else if (!Array.isArray(state.examLibrary)) {
      state.examLibrary = next;
    }
    return changed;
  }

  function getExamLibraryEntryById(entryId) {
    const safeId = asText(entryId, "").trim();
    if (!safeId) {
      return null;
    }
    return (state.examLibrary || []).find((item) => asText(item?.id, "").trim() === safeId) || null;
  }

  function getExamLibraryEntriesForSubject(subjectId) {
    const safeSubjectId = asText(subjectId, "").trim();
    if (!safeSubjectId) {
      return [];
    }
    return (state.examLibrary || [])
      .filter((item) => asText(item?.subjectId, "").trim() === safeSubjectId)
      .sort((a, b) => Date.parse(b.updatedAt || b.createdAt || 0) - Date.parse(a.updatedAt || a.createdAt || 0));
  }

  function getActiveReviewTermKey() {
    const profile = getSettingsProfileSnapshot();
    return normalizeProfileSemesterValue(profile?.semester, "2");
  }

  function ensureTermReviewStore(termKey = getActiveReviewTermKey()) {
    const safeTerm = normalizeProfileSemesterValue(termKey, "2");
    if (!state.terms || typeof state.terms !== "object" || Array.isArray(state.terms)) {
      state.terms = {};
    }
    if (!state.terms[safeTerm] || typeof state.terms[safeTerm] !== "object" || Array.isArray(state.terms[safeTerm])) {
      state.terms[safeTerm] = { review: {} };
    }
    if (!state.terms[safeTerm].review || typeof state.terms[safeTerm].review !== "object" || Array.isArray(state.terms[safeTerm].review)) {
      state.terms[safeTerm].review = {};
    }
    return state.terms[safeTerm].review;
  }

  function getAllQuestionScopeKeys(subjects = state.subjects) {
    const keys = new Set();
    (subjects || []).forEach((subject) => {
      const subjectId = asText(subject?.id, "");
      (subject?.chapters || []).forEach((chapter) => {
        const chapterId = asText(chapter?.id, "");
        (chapter?.questions || []).forEach((question) => {
          const questionId = asText(question?.id, "");
          const scopedKey = buildReviewScopeKey(subjectId, chapterId, questionId);
          if (scopedKey) {
            keys.add(scopedKey);
          }
        });
      });
    });
    return keys;
  }

  function buildReviewScopeKey(subjectId, chapterId, questionId) {
    const safeSubjectId = asText(subjectId, "").trim();
    const safeChapterId = asText(chapterId, "").trim();
    const safeQuestionId = asText(questionId, "").trim();
    if (!safeSubjectId || !safeChapterId || !safeQuestionId) {
      return "";
    }
    return `${safeSubjectId}::${safeChapterId}::${safeQuestionId}`;
  }

  function getQuestionReviewEntry(subjectId, chapterId, questionId, termKey = getActiveReviewTermKey()) {
    const scopedKey = buildReviewScopeKey(subjectId, chapterId, questionId);
    if (!scopedKey) {
      return null;
    }
    const reviewStore = ensureTermReviewStore(termKey);
    const normalized = normalizeReviewEntry(reviewStore[scopedKey]);
    if (!normalized) {
      if (Object.prototype.hasOwnProperty.call(reviewStore, scopedKey)) {
        delete reviewStore[scopedKey];
      }
      return null;
    }
    reviewStore[scopedKey] = normalized;
    return normalized;
  }

  function setQuestionReviewStatus(subjectId, chapterId, questionId, status, termKey = getActiveReviewTermKey()) {
    const scopedKey = buildReviewScopeKey(subjectId, chapterId, questionId);
    if (!scopedKey) {
      return { changed: false, entry: null, scopedKey: "" };
    }

    const reviewStore = ensureTermReviewStore(termKey);
    const safeStatus = normalizeReviewStatus(status);
    const existingEntry = normalizeReviewEntry(reviewStore[scopedKey]);

    if (!safeStatus) {
      if (!existingEntry) {
        return { changed: false, entry: null, scopedKey };
      }
      delete reviewStore[scopedKey];
      persistReviewMetadata();
      return { changed: true, entry: null, scopedKey };
    }

    const nextEntry = {
      status: safeStatus,
      updatedAt: new Date().toISOString()
    };
    if (existingEntry?.note) {
      nextEntry.note = existingEntry.note;
    }

    const changed =
      !existingEntry ||
      existingEntry.status !== nextEntry.status ||
      asText(existingEntry.note, "") !== asText(nextEntry.note, "");
    if (!changed) {
      reviewStore[scopedKey] = {
        ...nextEntry,
        updatedAt: existingEntry.updatedAt
      };
      return { changed: false, entry: reviewStore[scopedKey], scopedKey };
    }

    reviewStore[scopedKey] = nextEntry;
    persistReviewMetadata();
    return { changed: true, entry: nextEntry, scopedKey };
  }

  function toggleQuestionReviewStatus(subjectId, chapterId, questionId, status, termKey = getActiveReviewTermKey()) {
    const safeStatus = normalizeReviewStatus(status);
    if (!safeStatus) {
      return { changed: false, entry: null, scopedKey: "" };
    }

    const currentEntry = getQuestionReviewEntry(subjectId, chapterId, questionId, termKey);
    if (currentEntry?.status === safeStatus) {
      return setQuestionReviewStatus(subjectId, chapterId, questionId, "", termKey);
    }

    return setQuestionReviewStatus(subjectId, chapterId, questionId, safeStatus, termKey);
  }

  function setQuestionReviewNote(subjectId, chapterId, questionId, note, termKey = getActiveReviewTermKey()) {
    const scopedKey = buildReviewScopeKey(subjectId, chapterId, questionId);
    if (!scopedKey) {
      return { changed: false, blocked: true, scopedKey: "" };
    }

    const reviewStore = ensureTermReviewStore(termKey);
    const existing = normalizeReviewEntry(reviewStore[scopedKey]);
    if (!existing) {
      return { changed: false, blocked: true, scopedKey };
    }

    const cleanNote = cleanReviewNoteText(note);
    const nextEntry = {
      status: existing.status,
      updatedAt: new Date().toISOString()
    };

    if (cleanNote) {
      nextEntry.note = cleanNote;
    }

    const previousNote = asText(existing.note, "");
    const changed = previousNote !== asText(nextEntry.note, "");
    reviewStore[scopedKey] = changed ? nextEntry : { ...existing, updatedAt: nextEntry.updatedAt };
    if (changed) {
      persistReviewMetadata();
    }

    return { changed, blocked: false, scopedKey, entry: reviewStore[scopedKey] };
  }

  function removeQuestionReviewMetadataFromAllTerms(subjectId, chapterId, questionId, options = {}) {
    const scopedKey = buildReviewScopeKey(subjectId, chapterId, questionId);
    if (!scopedKey) {
      return false;
    }

    const noteTimer = reviewNoteDebounceMap.get(scopedKey);
    if (noteTimer) {
      window.clearTimeout(noteTimer);
      reviewNoteDebounceMap.delete(scopedKey);
    }
    const indicatorTimer = reviewNoteSavedIndicatorTimers.get(scopedKey);
    if (indicatorTimer) {
      window.clearTimeout(indicatorTimer);
      reviewNoteSavedIndicatorTimers.delete(scopedKey);
    }

    let removed = false;
    Object.values(state.terms || {}).forEach((termValue) => {
      const reviewStore = termValue?.review;
      if (!reviewStore || typeof reviewStore !== "object" || Array.isArray(reviewStore)) {
        return;
      }
      if (!Object.prototype.hasOwnProperty.call(reviewStore, scopedKey)) {
        return;
      }
      delete reviewStore[scopedKey];
      removed = true;
    });

    if (removed && options.persist !== false) {
      persistReviewMetadata();
    }
    return removed;
  }

  function normalizeLegacyBooleanFlag(value) {
    const parsed = parseQuestionSolvedFlagValue(value);
    if (parsed !== null) {
      return parsed;
    }
    const text = asText(value, "").trim().toLowerCase();
    if (!text) {
      return false;
    }
    return ["active", "starred", "flagged", "important", "key", "mastered", "master"].includes(text);
  }

  function resolveLegacyKeyFlag(question) {
    if (!question || typeof question !== "object") {
      return false;
    }
    return !!(
      normalizeLegacyBooleanFlag(question.starred) ||
      normalizeLegacyBooleanFlag(question.isStarred) ||
      normalizeLegacyBooleanFlag(question.key) ||
      normalizeLegacyBooleanFlag(question.keyPoint) ||
      normalizeLegacyBooleanFlag(question.isKeyPoint) ||
      normalizeLegacyBooleanFlag(question?.progress?.starred) ||
      normalizeLegacyBooleanFlag(question?.progress?.keyPoint)
    );
  }

  function resolveLegacyMasteredFlag(question) {
    if (!question || typeof question !== "object") {
      return false;
    }

    if (
      normalizeLegacyBooleanFlag(question.mastered) ||
      normalizeLegacyBooleanFlag(question.isMastered) ||
      normalizeLegacyBooleanFlag(question?.progress?.mastered)
    ) {
      return true;
    }

    const reviewState = asText(question.reviewState, "").trim().toLowerCase();
    if (reviewState === "mastered" || reviewState === "done") {
      return true;
    }

    const proficiency = asText(question.proficiency, "").trim().toLowerCase();
    if (proficiency === "mastered" || proficiency === "high") {
      return true;
    }

    return false;
  }

  function resolveLegacyReviewStatusForQuestion(question) {
    const explicitStatus = normalizeReviewStatus(
      question?.status ||
        question?.reviewStatus ||
        question?.review_status ||
        question?.progress?.reviewStatus ||
        question?.legacyReviewStatus
    );
    if (explicitStatus) {
      return explicitStatus;
    }

    if (resolveNeedsReviewFlag(question)) {
      return "review";
    }
    if (resolveLegacyKeyFlag(question)) {
      return "key";
    }
    if (resolveLegacyMasteredFlag(question)) {
      return "mastered";
    }
    return "";
  }

  function migrateLegacyReviewMetadataFromQuestions(subjects = state.subjects, termKey = getActiveReviewTermKey()) {
    const safeTerm = normalizeProfileSemesterValue(termKey, "2");
    const reviewStore = ensureTermReviewStore(safeTerm);
    let changedCount = 0;

    (subjects || []).forEach((subject) => {
      const subjectId = asText(subject?.id, "");
      (subject?.chapters || []).forEach((chapter) => {
        const chapterId = asText(chapter?.id, "");
        (chapter?.questions || []).forEach((question) => {
          const questionId = asText(question?.id, "");
          const scopedKey = buildReviewScopeKey(subjectId, chapterId, questionId);
          if (!scopedKey) {
            return;
          }

          const existingEntry = normalizeReviewEntry(reviewStore[scopedKey]);
          if (existingEntry) {
            reviewStore[scopedKey] = existingEntry;
            return;
          }

          const legacyStatus = resolveLegacyReviewStatusForQuestion(question);
          if (!legacyStatus) {
            return;
          }

          reviewStore[scopedKey] = {
            status: legacyStatus,
            updatedAt: new Date().toISOString()
          };
          changedCount += 1;
        });
      });
    });

    return changedCount;
  }

  function pruneReviewMetadataAgainstQuestions(subjects = state.subjects) {
    const validScopedKeys = getAllQuestionScopeKeys(subjects);
    let changed = false;

    Object.entries(state.terms || {}).forEach(([termKey, termValue]) => {
      const safeTerm = normalizeProfileSemesterValue(termKey, "2");
      if (safeTerm !== termKey) {
        state.terms[safeTerm] = termValue;
        delete state.terms[termKey];
        changed = true;
      }

      const reviewStore = ensureTermReviewStore(safeTerm);
      Object.entries(reviewStore).forEach(([scopedKey, rawEntry]) => {
        if (!validScopedKeys.has(scopedKey)) {
          delete reviewStore[scopedKey];
          changed = true;
          return;
        }

        const normalized = normalizeReviewEntry(rawEntry);
        if (!normalized) {
          delete reviewStore[scopedKey];
          changed = true;
          return;
        }

        if (
          normalized.status !== rawEntry?.status ||
          asText(normalized.note, "") !== asText(rawEntry?.note, "") ||
          normalized.updatedAt !== asText(rawEntry?.updatedAt, "")
        ) {
          reviewStore[scopedKey] = normalized;
          changed = true;
        }
      });
    });

    return changed;
  }

  function reconcileReviewMetadataAfterDataChange(options = {}) {
    const migrateLegacy = options.migrateLegacy !== false;
    const safeTerm = getActiveReviewTermKey();
    ensureTermReviewStore(safeTerm);

    let changed = false;
    if (migrateLegacy) {
      changed = migrateLegacyReviewMetadataFromQuestions(state.subjects, safeTerm) > 0 || changed;
    }

    changed = pruneReviewMetadataAgainstQuestions(state.subjects) || changed;
    if (changed || options.persist === true) {
      persistReviewMetadata();
    }

    return changed;
  }

  function getReviewStatusLabel(status) {
    if (status === "review") {
      return "مرور";
    }
    if (status === "key") {
      return "کلیدی";
    }
    if (status === "mastered") {
      return "مسلط";
    }
    return "";
  }

  function buildChapterReviewSnapshotCacheKey(subjectId, chapterId, termKey, questionCount) {
    return [
      String(subjectsRevision),
      String(reviewMetadataRevision),
      normalizeProfileSemesterValue(termKey, "2"),
      asText(subjectId, "").trim(),
      asText(chapterId, "").trim(),
      String(Math.max(0, Number(questionCount) || 0))
    ].join("::");
  }

  function getChapterReviewSnapshot(subjectId, chapterId, questions = [], termKey = getActiveReviewTermKey()) {
    const list = Array.isArray(questions) ? questions : [];
    const safeSubjectId = asText(subjectId, "").trim();
    const safeChapterId = asText(chapterId, "").trim();
    const safeTerm = normalizeProfileSemesterValue(termKey, "2");

    if (!safeSubjectId || !safeChapterId) {
      return {
        statusById: new Map(),
        counts: { review: 0, key: 0, mastered: 0, none: list.length, total: list.length }
      };
    }

    const cacheKey = buildChapterReviewSnapshotCacheKey(safeSubjectId, safeChapterId, safeTerm, list.length);
    const cached = chapterReviewSnapshotCache.get(cacheKey);
    if (cached && cached.questionsRef === list) {
      return cached.snapshot;
    }

    const reviewStore = ensureTermReviewStore(safeTerm);
    const statusById = new Map();
    const counts = { review: 0, key: 0, mastered: 0, none: 0, total: list.length };

    list.forEach((question) => {
      const questionId = asText(question?.id, "").trim();
      if (!questionId) {
        counts.none += 1;
        return;
      }
      const scopedKey = buildReviewScopeKey(safeSubjectId, safeChapterId, questionId);
      const status = normalizeReviewStatus(reviewStore?.[scopedKey]?.status || "");
      if (status) {
        statusById.set(questionId, status);
        counts[status] += 1;
      } else {
        counts.none += 1;
      }
    });

    const snapshot = { statusById, counts };
    setBoundedMapCache(
      chapterReviewSnapshotCache,
      cacheKey,
      {
        questionsRef: list,
        snapshot
      },
      180
    );
    return snapshot;
  }

  function getChapterReviewStatusCounts(subjectId, chapterId, questions = []) {
    const list = Array.isArray(questions) ? questions : [];
    const counts = getChapterReviewSnapshot(subjectId, chapterId, list).counts;
    return {
      review: counts.review,
      key: counts.key,
      mastered: counts.mastered,
      none: counts.none,
      total: counts.total
    };
  }

  function matchesQuestionReviewFilter(subjectId, chapterId, question, reviewMode) {
    const safeMode = normalizeReviewFilterMode(reviewMode);
    if (safeMode === "all") {
      return true;
    }

    const status = normalizeReviewStatus(
      ensureTermReviewStore(getActiveReviewTermKey())?.[buildReviewScopeKey(subjectId, chapterId, asText(question?.id, ""))]?.status || ""
    );
    if (safeMode === "none") {
      return !status;
    }
    return status === safeMode;
  }

  function serializeChapterTreeCollapseState() {
    const snapshot = {};
    for (const [subjectId, rawSet] of chapterTreeCollapseState.entries()) {
      const safeSubjectId = asText(subjectId, "").trim();
      if (!safeSubjectId || !(rawSet instanceof Set)) {
        continue;
      }
      const closed = Array.from(rawSet).map((item) => asText(item, "").trim()).filter(Boolean);
      snapshot[safeSubjectId] = {
        closed,
        initialized: rawSet[TREE_COLLAPSE_INIT_FLAG] === true
      };
    }
    return snapshot;
  }

  function restoreChapterTreeCollapseState(snapshot) {
    chapterTreeCollapseState.clear();
    if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) {
      return;
    }

    Object.entries(snapshot).forEach(([subjectId, payload]) => {
      const safeSubjectId = asText(subjectId, "").trim();
      if (!safeSubjectId) {
        return;
      }
      const nextSet = new Set();
      let initialized = false;

      if (Array.isArray(payload)) {
        payload.forEach((entry) => {
          const nodeId = asText(entry, "").trim();
          if (nodeId) {
            nextSet.add(nodeId);
          }
        });
        initialized = true;
      } else if (payload && typeof payload === "object") {
        const closed = Array.isArray(payload.closed) ? payload.closed : [];
        closed.forEach((entry) => {
          const nodeId = asText(entry, "").trim();
          if (nodeId) {
            nextSet.add(nodeId);
          }
        });
        initialized = payload.initialized !== false;
      }

      nextSet[TREE_COLLAPSE_INIT_FLAG] = initialized;
      chapterTreeCollapseState.set(safeSubjectId, nextSet);
    });
  }

  function buildPreferencesPayload() {
    return {
      theme: state.theme,
      viewportMode: state.viewportMode,
      allowScheduleLandscape: state.allowScheduleLandscape === true,
      treeCollapseState: serializeChapterTreeCollapseState(),
      lastSession: buildLastSessionSnapshot()
    };
  }

  function persistLastSessionPreferences() {
    persistPreferences();
  }

  function cloneJsonValue(value, fallback = null) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch {
      return fallback;
    }
  }

  function sanitizeRuntimeIdSequence(value) {
    if (!Array.isArray(value)) {
      return [];
    }
    return value.map((item) => asText(item, "").trim()).filter(Boolean);
  }

  function serializeChapterRuntimeSnapshot(runtime) {
    if (!runtime || typeof runtime !== "object") {
      return null;
    }

    const practiceHistory = sanitizeRuntimeIdSequence(runtime.practiceHistory);
    const historyFallback = practiceHistory.length ? practiceHistory.length - 1 : -1;
    const parsedCursor = Number.parseInt(asText(runtime.practiceCursor, String(historyFallback)), 10);
    const practiceCursor = Number.isFinite(parsedCursor)
      ? Math.max(-1, Math.min(parsedCursor, historyFallback))
      : historyFallback;

    return {
      practiceId: asText(runtime.practiceId, "").trim() || null,
      practiceProfile: normalizePracticeProfile(runtime.practiceProfile),
      practiceIncludeSolved: runtime.practiceIncludeSolved !== false,
      practiceFiltersCollapsed: runtime.practiceFiltersCollapsed !== false,
      practiceHistory,
      practiceCursor,
      practiceSeenIds: sanitizeRuntimeIdSequence(runtime.practiceSeenIds),
      practiceRevealHint: !!runtime.practiceRevealHint,
      practiceRevealSolution: !!runtime.practiceRevealSolution,
      practiceRevealScrollTarget: asText(runtime.practiceRevealScrollTarget, ""),
      exam: cloneJsonValue(runtime.exam, null)
    };
  }

  function applyChapterRuntimeSnapshot(runtime, runtimeSnapshot) {
    if (!runtime || typeof runtime !== "object") {
      return;
    }

    const normalized = serializeChapterRuntimeSnapshot(runtimeSnapshot);
    if (!normalized) {
      return;
    }

    runtime.loading = false;
    runtime.loadPromise = null;
    runtime.practiceId = normalized.practiceId;
    runtime.practiceProfile = normalized.practiceProfile;
    runtime.practiceIncludeSolved = normalized.practiceIncludeSolved;
    runtime.practiceFiltersCollapsed = normalized.practiceFiltersCollapsed;
    runtime.practiceHistory = normalized.practiceHistory.slice();
    const historyFallback = runtime.practiceHistory.length ? runtime.practiceHistory.length - 1 : -1;
    runtime.practiceCursor = Math.max(-1, Math.min(normalized.practiceCursor, historyFallback));
    runtime.practiceSeenIds = normalized.practiceSeenIds.slice();
    runtime.practiceRevealHint = normalized.practiceRevealHint;
    runtime.practiceRevealSolution = normalized.practiceRevealSolution;
    runtime.practiceRevealScrollTarget = normalized.practiceRevealScrollTarget;
    runtime.exam = cloneJsonValue(normalized.exam, null);

    if (!runtime.practiceId && runtime.practiceHistory.length && runtime.practiceCursor >= 0) {
      runtime.practiceId = runtime.practiceHistory[runtime.practiceCursor] || null;
    }
  }

  function buildLastSessionSnapshot() {
    const viewLevel = clampNumber(state.view.level, 1, 3, 1);
    const viewTab = asText(state.view.tab, "bank");
    const safeTab = ["bank", "practice", "exam", "chapter-map"].includes(viewTab) ? viewTab : "bank";
    const snapshot = {
      view: {
        level: viewLevel,
        subjectId: asText(state.view.subjectId, "").trim() || null,
        chapterId: asText(state.view.chapterId, "").trim() || null,
        tab: safeTab
      },
      page: Math.max(1, Number.parseInt(asText(state.pagination.page, "1"), 10) || 1),
      activeRuntime: null
    };

    if (snapshot.view.level === 1) {
      snapshot.view.subjectId = null;
      snapshot.view.chapterId = null;
      snapshot.view.tab = "bank";
    } else if (snapshot.view.level === 2) {
      snapshot.view.chapterId = null;
      snapshot.view.tab = "bank";
    }

    if (snapshot.view.level === 3 && snapshot.view.subjectId && snapshot.view.chapterId) {
      const runtime = getRuntimeIfExists(snapshot.view.subjectId, snapshot.view.chapterId);
      const runtimeSnapshot = serializeChapterRuntimeSnapshot(runtime);
      if (runtimeSnapshot) {
        snapshot.activeRuntime = {
          subjectId: snapshot.view.subjectId,
          chapterId: snapshot.view.chapterId,
          runtime: runtimeSnapshot
        };
      }
    }

    return snapshot;
  }

  function normalizeLastSessionSnapshot(snapshot) {
    if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) {
      return null;
    }

    const viewSource = snapshot.view && typeof snapshot.view === "object" ? snapshot.view : {};
    const safeLevel = clampNumber(viewSource.level, 1, 3, 1);
    const viewTab = asText(viewSource.tab, "bank");
    const safeTab = ["bank", "practice", "exam", "chapter-map"].includes(viewTab) ? viewTab : "bank";
    const safePageRaw = Number.parseInt(asText(snapshot.page, "1"), 10);
    const normalized = {
      view: {
        level: safeLevel,
        subjectId: asText(viewSource.subjectId, "").trim() || null,
        chapterId: asText(viewSource.chapterId, "").trim() || null,
        tab: safeTab
      },
      page: Number.isFinite(safePageRaw) && safePageRaw > 0 ? safePageRaw : 1,
      activeRuntime: null
    };

    if (normalized.view.level === 1) {
      normalized.view.subjectId = null;
      normalized.view.chapterId = null;
      normalized.view.tab = "bank";
      return normalized;
    }

    if (normalized.view.level === 2) {
      normalized.view.chapterId = null;
      normalized.view.tab = "bank";
      return normalized;
    }

    const runtimeSource = snapshot.activeRuntime;
    if (runtimeSource && typeof runtimeSource === "object" && !Array.isArray(runtimeSource)) {
      const subjectId = asText(runtimeSource.subjectId, "").trim();
      const chapterId = asText(runtimeSource.chapterId, "").trim();
      const runtimeSnapshot = serializeChapterRuntimeSnapshot(runtimeSource.runtime);
      if (subjectId && chapterId && runtimeSnapshot) {
        normalized.activeRuntime = {
          subjectId,
          chapterId,
          runtime: runtimeSnapshot
        };
      }
    }

    return normalized;
  }

  function applyLastSessionSnapshotState(snapshot, options = {}) {
    const normalized = normalizeLastSessionSnapshot(snapshot);
    if (!normalized) {
      return false;
    }

    state.view.level = normalized.view.level;
    state.view.subjectId = normalized.view.subjectId;
    state.view.chapterId = normalized.view.chapterId;
    state.view.tab = normalized.view.tab;
    state.pagination.page = normalized.page;

    const shouldRestoreRuntime = options.restoreRuntime !== false;
    if (!shouldRestoreRuntime || !normalized.activeRuntime) {
      return true;
    }

    const runtimeSubjectId = normalized.activeRuntime.subjectId;
    const runtimeChapterId = normalized.activeRuntime.chapterId;
    const chapter = findChapterByIds(runtimeSubjectId, runtimeChapterId);
    if (!chapter) {
      return true;
    }

    const runtime = getRuntime(runtimeSubjectId, runtimeChapterId);
    applyChapterRuntimeSnapshot(runtime, normalized.activeRuntime.runtime);
    reconcileRuntimeAfterQuestionMutation(runtimeSubjectId, runtimeChapterId, chapter);
    return true;
  }

  function applyPendingSessionRestoreSnapshot() {
    if (!pendingSessionRestoreSnapshot) {
      return;
    }
    const snapshot = pendingSessionRestoreSnapshot;
    pendingSessionRestoreSnapshot = null;
    applyLastSessionSnapshotState(snapshot, { restoreRuntime: true });
  }

  function restorePreferences() {
    const raw = localStorage.getItem(STORAGE_KEYS.prefs);
    if (!raw) {
      applyTheme(state.theme);
      setScheduleLandscapePreference(false, { persist: false, refreshOverview: false, reason: "prefs-default" });
      applyViewportMode("auto");
      restoreChapterTreeCollapseState(null);
      refreshSettingsOverview();
      lastPersistedPreferencesSignature = JSON.stringify(buildPreferencesPayload());
      return;
    }

    try {
      const prefs = JSON.parse(raw);
      applyTheme(asText(prefs.theme, state.theme));
      setScheduleLandscapePreference(prefs.allowScheduleLandscape, {
        persist: false,
        refreshOverview: false,
        reason: "prefs-restore"
      });
      applyViewportMode(asText(prefs.viewportMode, "auto"));
      restoreChapterTreeCollapseState(prefs.treeCollapseState);
      const restoredSession = normalizeLastSessionSnapshot(prefs.lastSession);
      if (restoredSession) {
        pendingSessionRestoreSnapshot = restoredSession;
        applyLastSessionSnapshotState(restoredSession, { restoreRuntime: false });
      }
      refreshSettingsOverview();
      lastPersistedPreferencesSignature = JSON.stringify(buildPreferencesPayload());
    } catch {
      applyTheme(state.theme);
      setScheduleLandscapePreference(false, { persist: false, refreshOverview: false, reason: "prefs-fallback" });
      applyViewportMode("auto");
      restoreChapterTreeCollapseState(null);
      refreshSettingsOverview();
      lastPersistedPreferencesSignature = JSON.stringify(buildPreferencesPayload());
    }
  }

  function persistPreferences() {
    try {
      const payload = buildPreferencesPayload();
      const signature = JSON.stringify(payload);
      if (signature === lastPersistedPreferencesSignature) {
        return;
      }
      localStorage.setItem(STORAGE_KEYS.prefs, signature);
      lastPersistedPreferencesSignature = signature;
    } catch (error) {
      console.error(error);
    }
  }

  function applyTheme(theme) {
    const safeTheme = THEMES.includes(theme) ? theme : "dark-graphite";
    state.theme = safeTheme;
    document.documentElement.dataset.theme = safeTheme;
    refs.themeSelect.value = safeTheme;
    syncThemeColorMeta(safeTheme);
    updateProfileQuickThemeControls();
    refreshSettingsOverview();
  }

  function applyViewportMode(mode) {
    const safeMode = VIEWPORT_MODES.includes(mode) ? mode : "auto";
    state.viewportMode = safeMode;

    document.body.classList.remove("force-mobile", "force-desktop", "auto-mobile", "auto-desktop");

    if (safeMode === "mobile") {
      state.viewportAutoResolved = "mobile";
      document.body.classList.add("force-mobile");
    }

    if (safeMode === "desktop") {
      state.viewportAutoResolved = "desktop";
      document.body.classList.add("force-desktop");
    }

    if (safeMode === "auto") {
      const resolved = resolveAutoViewportMode();
      state.viewportAutoResolved = resolved;
      document.body.classList.add(resolved === "mobile" ? "auto-mobile" : "auto-desktop");
      // Compatibility bridge: keep legacy force-* selectors aligned with resolved auto mode.
      document.body.classList.add(resolved === "mobile" ? "force-mobile" : "force-desktop");
      const metrics = getViewportAutoMetrics();
      autoViewportLastResolvedAtMs = Date.now();
      autoViewportLastSwitchWidth = Math.max(0, Number(metrics?.viewportWidth) || 0);
    }

    document.body.dataset.viewportResolved = state.viewportAutoResolved;
    syncPwaDisplayModeClasses();
    syncMobilePerformanceMode();
    syncDesktopPerformanceMode();
    healMobileScrollLock("viewport-mode");
    updateViewportModeControls();
    syncHybridOrientationPolicy("viewport-mode");
    refreshSettingsOverview();
  }

  function isLikelyMobileUserAgent() {
    const nav = window.navigator || {};
    const uaDataMobile =
      nav.userAgentData && typeof nav.userAgentData.mobile === "boolean" ? nav.userAgentData.mobile : null;
    if (typeof uaDataMobile === "boolean") {
      return uaDataMobile;
    }

    const ua = asText(nav.userAgent, "").toLowerCase();
    if (!ua) {
      return false;
    }

    return /(android|iphone|ipod|mobile|iemobile|opera mini|windows phone)/.test(ua);
  }

  function getViewportAutoMetrics() {
    const docWidth = Math.max(Number(document.documentElement?.clientWidth) || 0, 0);
    const innerWidth = Math.max(Number(window.innerWidth) || 0, 0);
    const visualWidth =
      window.visualViewport && Number.isFinite(window.visualViewport.width)
        ? Math.max(Math.round(window.visualViewport.width), 0)
        : 0;
    const widthCandidates = [docWidth, innerWidth, visualWidth].filter((value) => Number.isFinite(value) && value > 0);
    const minWidth = widthCandidates.length ? Math.min(...widthCandidates) : 0;
    const maxWidth = widthCandidates.length ? Math.max(...widthCandidates) : 0;
    const widthSpread = Math.max(0, maxWidth - minWidth);
    let viewportWidth = docWidth || innerWidth || visualWidth || 0;
    if (widthCandidates.length > 1) {
      if (widthSpread >= AUTO_VIEWPORT_WIDTH_SPREAD_TOLERANCE_PX) {
        // Prefer the smallest stable width when engines report mixed viewport widths (mobile UI chrome / pinch jitter).
        viewportWidth = minWidth;
      } else if (!docWidth) {
        viewportWidth = Math.round((minWidth + maxWidth) / 2);
      }
    }

    const maxTouchPoints = Number(window.navigator?.maxTouchPoints);
    const touchPoints = Number.isFinite(maxTouchPoints) && maxTouchPoints > 0 ? maxTouchPoints : 0;
    const canMatchMedia = typeof window.matchMedia === "function";
    const coarsePointer = canMatchMedia && window.matchMedia("(pointer: coarse)").matches;
    const finePointer = canMatchMedia && window.matchMedia("(pointer: fine)").matches;
    const noHover = canMatchMedia && window.matchMedia("(hover: none)").matches;
    const hasHover = canMatchMedia && window.matchMedia("(hover: hover)").matches;
    const userAgentMobile = isLikelyMobileUserAgent();
    const likelyTouchDevice = coarsePointer || noHover || touchPoints >= 2;
    const likelyDesktopInput = finePointer && hasHover && touchPoints === 0 && !coarsePointer;

    return {
      viewportWidth,
      minWidth,
      maxWidth,
      widthSpread,
      touchPoints,
      coarsePointer,
      finePointer,
      noHover,
      hasHover,
      userAgentMobile,
      likelyTouchDevice,
      likelyDesktopInput
    };
  }

  function resolveAutoViewportMode() {
    const metrics = getViewportAutoMetrics();
    const hasMediaQuery = typeof window.matchMedia === "function";
    const mediaMobile = hasMediaQuery && window.matchMedia(`(max-width: ${AUTO_VIEWPORT_BREAKPOINT}px)`).matches;
    const width = metrics.viewportWidth;

    const mobileSignalStrength =
      (metrics.userAgentMobile ? 2 : 0) + (metrics.likelyTouchDevice ? 1 : 0) + (metrics.noHover ? 1 : 0);
    const hasStrongMobileSignals = mobileSignalStrength >= 2 && !metrics.likelyDesktopInput;

    if (width <= 0) {
      return hasStrongMobileSignals || mediaMobile ? "mobile" : "desktop";
    }

    const lowerThreshold = AUTO_VIEWPORT_BREAKPOINT - AUTO_VIEWPORT_HYSTERESIS_PX;
    const upperThreshold = AUTO_VIEWPORT_BREAKPOINT + AUTO_VIEWPORT_HYSTERESIS_PX;

    if (width <= lowerThreshold) {
      return "mobile";
    }

    if (width >= upperThreshold) {
      if (hasStrongMobileSignals && width <= AUTO_VIEWPORT_TOUCH_DESKTOP_GUARD_PX) {
        return "mobile";
      }
      return "desktop";
    }

    if (state.viewportAutoResolved === "mobile") {
      if (metrics.likelyDesktopInput && !hasStrongMobileSignals && width >= AUTO_VIEWPORT_BREAKPOINT + 28) {
        return "desktop";
      }
      return "mobile";
    }

    if (state.viewportAutoResolved === "desktop") {
      if (hasStrongMobileSignals && width <= AUTO_VIEWPORT_TOUCH_DESKTOP_GUARD_PX) {
        return "mobile";
      }
      return "desktop";
    }

    if (hasStrongMobileSignals) {
      return "mobile";
    }
    return mediaMobile ? "mobile" : "desktop";
  }

  function isMobileViewportActive() {
    return state.viewportMode === "mobile" || state.viewportAutoResolved === "mobile";
  }

  function resolveMobilePerformanceLite() {
    if (!isMobileViewportActive()) {
      return false;
    }

    // Final stability mode: any resolved mobile viewport runs in lite mode by default.
    return true;
  }

  function resolveDesktopPerformanceLite() {
    if (isMobileViewportActive()) {
      return false;
    }

    const stats = getSettingsDataStats();
    const subjectCount = Math.max(0, Number(stats?.subjects) || 0);
    const totalChapters = Math.max(0, Number(stats?.chapters) || 0);
    const totalQuestions = Math.max(0, Number(stats?.questions) || 0);
    if (subjectCount >= DESKTOP_PERF_LITE_SUBJECTS || totalChapters >= DESKTOP_PERF_LITE_TOTAL_CHAPTERS) {
      return true;
    }
    if (totalQuestions >= DESKTOP_PERF_LITE_TOTAL_QUESTIONS) {
      return true;
    }

    const chapter = getActiveChapter();
    const chapterQuestionCount = Array.isArray(chapter?.questions) ? chapter.questions.length : 0;
    if (chapterQuestionCount >= DESKTOP_PERF_LITE_CHAPTER_QUESTIONS) {
      return true;
    }

    if (state.view.level === 3 && state.view.tab === "chapter-map") {
      const subject = getActiveSubject();
      const chapterCount = Array.isArray(subject?.chapters) ? subject.chapters.length : 0;
      if (chapterCount >= DESKTOP_PERF_LITE_TREE_CHAPTERS || chapterQuestionCount >= DESKTOP_PERF_LITE_BANK_CHAPTER_QUESTIONS) {
        return true;
      }
      if (chapterCount >= 8) {
        return true;
      }
    }

    if (state.view.level === 3 && state.view.tab === "bank" && chapterQuestionCount >= DESKTOP_PERF_LITE_BANK_CHAPTER_QUESTIONS) {
      return true;
    }

    if (
      state.view.level === 3 &&
      (state.view.tab === "practice" || state.view.tab === "exam") &&
      chapterQuestionCount >= DESKTOP_PERF_LITE_PRACTICE_EXAM_QUESTIONS
    ) {
      return true;
    }

    return false;
  }

  function syncMobilePerformanceMode() {
    if (!(document.body instanceof HTMLElement)) {
      mobilePerformanceLite = false;
      return false;
    }

    const mobileActive = isMobileViewportActive();
    const prevLite = mobilePerformanceLite;
    const prevUltra = document.body.classList.contains("mobile-ultra");
    const nextLite = resolveMobilePerformanceLite();
    mobilePerformanceLite = nextLite;
    document.body.classList.toggle("mobile-lite", nextLite);
    const nextUltra = nextLite && mobileActive;
    document.body.classList.toggle("mobile-ultra", nextUltra);
    document.body.dataset.mobilePerf = nextLite ? "lite" : "full";

    if (state.gapi.autoSyncEnabled && (prevLite !== nextLite || prevUltra !== nextUltra)) {
      setupDriveAutoPullLoop();
    }

    return nextLite;
  }

  function syncDesktopPerformanceMode() {
    if (!(document.body instanceof HTMLElement)) {
      desktopPerformanceLite = false;
      return false;
    }

    const nextLite = resolveDesktopPerformanceLite();
    desktopPerformanceLite = nextLite;
    document.body.classList.toggle("desktop-lite", nextLite && !isMobileViewportActive());
    document.body.dataset.desktopPerf = nextLite ? "lite" : "full";
    return nextLite;
  }

  function isMobilePerformanceLiteActive() {
    return mobilePerformanceLite;
  }

  function isDesktopPerformanceLiteActive() {
    return desktopPerformanceLite;
  }

  function shouldEnableStaggerAnimations() {
    return (
      !isMobileViewportActive() &&
      !isMobilePerformanceLiteActive() &&
      !isDesktopPerformanceLiteActive() &&
      !isStandaloneAppUltraPerformanceActive()
    );
  }

  function getOptimizedScrollBehavior(preferred = "smooth") {
    if (
      isMobilePerformanceLiteActive() ||
      isMobileViewportActive() ||
      isDesktopPerformanceLiteActive() ||
      isStandaloneAppUltraPerformanceActive()
    ) {
      return "auto";
    }
    return preferred;
  }

  function setViewportMode(mode) {
    const safeMode = VIEWPORT_MODES.includes(asText(mode, "")) ? asText(mode, "auto") : "auto";
    if (safeMode === state.viewportMode && !(safeMode === "auto")) {
      return;
    }

    applyViewportMode(safeMode);
    persistPreferences();
    setStatus(`حالت نمایش روی ${VIEWPORT_LABELS[safeMode]} تنظیم شد.`, "ok");
  }

  function normalizeScheduleLandscapePreference(value, fallback = false) {
    if (typeof value === "boolean") {
      return value;
    }

    const parsed = parseQuestionSolvedFlagValue(value);
    if (parsed !== null) {
      return parsed;
    }

    const text = asText(value, "").trim().toLowerCase();
    if (!text) {
      return !!fallback;
    }

    if (["enable", "enabled", "active", "landscape", "allow"].includes(text)) {
      return true;
    }

    if (["disable", "disabled", "inactive", "portrait", "deny"].includes(text)) {
      return false;
    }

    return !!fallback;
  }

  function shouldControlHybridOrientationPolicy() {
    return isStandaloneDisplayMode() || isMobileViewportActive() || isLikelyMobileUserAgent();
  }

  function isQuestionLandscapeContextActive() {
    if (state.view.level !== 3) {
      return false;
    }

    const allowedTabs = new Set(["bank", "practice", "exam", "chapter-map"]);
    if (!allowedTabs.has(state.view.tab)) {
      return false;
    }

    if (!(refs.levelContainer instanceof HTMLElement)) {
      return false;
    }

    const activePanelSelectorMap = {
      bank: ".question-bank-panel",
      practice: ".practice-mode-panel",
      exam: ".exam-mode-panel",
      "chapter-map": ".chapter-map-panel"
    };
    const activePanelSelector = activePanelSelectorMap[state.view.tab] || "";
    const activePanel = activePanelSelector ? refs.levelContainer.querySelector(activePanelSelector) : null;
    if (!(activePanel instanceof HTMLElement)) {
      return false;
    }

    // Make landscape available only when question-centric UI is visible.
    const questionNode = activePanel.querySelector(
      ".question-card, .practice-question-card, .exam-paper, .exam-paper-list, .exam-chapter-grid, .chapter-map-layout, .chapter-map-stage, .chapter-map-canvas, .chapter-map-legend"
    );
    if (!(questionNode instanceof HTMLElement)) {
      return false;
    }

    const computed = window.getComputedStyle(activePanel);
    return computed.display !== "none" && computed.visibility !== "hidden";
  }

  function shouldAllowLandscapeInQuestionViews() {
    return state.allowScheduleLandscape === true && isQuestionLandscapeContextActive();
  }

  function updateScheduleLandscapeControls() {
    const enabled = state.allowScheduleLandscape === true;
    const activeNow = shouldAllowLandscapeInQuestionViews();
    const stateLabel = enabled ? (activeNow ? "فعال در بانک/تمرین/آزمون/درختی" : "فعال (فعلا Portrait)") : "غیرفعال";
    const toggleButtons = document.querySelectorAll("[data-action='toggle-schedule-landscape']");

    toggleButtons.forEach((button) => {
      if (!(button instanceof HTMLButtonElement)) {
        return;
      }

      button.classList.toggle("is-active", enabled);
      button.setAttribute("aria-pressed", enabled ? "true" : "false");

      const stateNode = button.querySelector(".hybrid-orientation-btn-state");
      if (stateNode instanceof HTMLElement) {
        stateNode.textContent = stateLabel;
      }
    });

    if (refs.scheduleLandscapeToggleState instanceof HTMLElement) {
      refs.scheduleLandscapeToggleState.textContent = stateLabel;
    }

    if (document.body instanceof HTMLElement) {
      document.body.dataset.scheduleLandscape = enabled ? "enabled" : "disabled";
    }
  }

  function applyHybridOrientationTargetMode(targetMode, reason = "") {
    const orientationApi = window.screen?.orientation;
    if (!orientationApi || typeof orientationApi.lock !== "function") {
      if (document.body instanceof HTMLElement) {
        document.body.dataset.hybridOrientationSupport = "unsupported";
      }
      return;
    }

    if (targetMode === lastRequestedOrientationPolicyMode) {
      return;
    }

    lastRequestedOrientationPolicyMode = targetMode;
    if (document.body instanceof HTMLElement) {
      document.body.dataset.hybridOrientationSupport = "supported";
      document.body.dataset.hybridOrientationMode = targetMode;
    }

    const applyLock = async () => {
      try {
        if (targetMode === "any") {
          if (typeof orientationApi.unlock === "function") {
            orientationApi.unlock();
          } else {
            await orientationApi.lock("any");
          }
          return;
        }
        await orientationApi.lock(targetMode);
      } catch (error) {
        const errorName = asText(error?.name, "");
        const expectedError =
          errorName === "NotSupportedError" ||
          errorName === "SecurityError" ||
          errorName === "TypeError" ||
          errorName === "AbortError" ||
          errorName === "NotAllowedError";
        if (!expectedError) {
          console.warn("Hybrid orientation policy apply failed.", reason, error);
        }
        lastRequestedOrientationPolicyMode = "";
      }
    };

    void applyLock();
  }

  function syncHybridOrientationPolicy(reason = "manual") {
    updateScheduleLandscapeControls();

    if (!(document.body instanceof HTMLElement)) {
      return;
    }

    const shouldControl = shouldControlHybridOrientationPolicy();
    const allowLandscapeNow = shouldAllowLandscapeInQuestionViews();
    document.body.dataset.hybridOrientationPolicy = allowLandscapeNow ? "question-landscape" : "portrait-lock";

    if (!shouldControl) {
      document.body.dataset.hybridOrientationSupport = "not-needed";
      document.body.dataset.hybridOrientationMode = "none";
      lastRequestedOrientationPolicyMode = "";
      return;
    }

    const targetMode = allowLandscapeNow ? "any" : "portrait-primary";
    applyHybridOrientationTargetMode(targetMode, reason);
  }

  function setScheduleLandscapePreference(enabled, options = {}) {
    const nextValue = normalizeScheduleLandscapePreference(enabled, false);
    state.allowScheduleLandscape = nextValue;

    updateScheduleLandscapeControls();
    syncHybridOrientationPolicy(asText(options.reason, "schedule-pref"));

    if (options.persist === true) {
      persistPreferences();
    }

    if (options.refreshOverview === true) {
      refreshSettingsOverview();
    }

    if (options.announce === true) {
      const message = nextValue
        ? "سیاست هیبرید فعال شد: در بانک سوالات، تمرین، آزمون و نمودار درختی Landscape مجاز است."
        : "سیاست هیبرید غیرفعال شد: برنامه روی Portrait قفل شد.";
      showToast(message, "success", 3200);
      setStatus(message, "ok");
    }
  }

  function toggleScheduleLandscapePreference() {
    setScheduleLandscapePreference(!state.allowScheduleLandscape, {
      persist: true,
      announce: true,
      refreshOverview: true,
      reason: "toggle-schedule-landscape"
    });
  }

  function handleProfileQuickTheme(target) {
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const nextTheme = asText(target.dataset.theme, "").trim();
    if (!nextTheme || !THEMES.includes(nextTheme)) {
      return;
    }

    if (state.theme === nextTheme) {
      return;
    }

    applyTheme(nextTheme);
    persistPreferences();
    setStatus(`تم «${getCurrentThemeLabel()}» فعال شد.`, "ok");
  }

  function refreshAutoViewportModeIfNeeded() {
    if (state.viewportMode !== "auto") {
      return;
    }

    const resolved = resolveAutoViewportMode();
    if (resolved === state.viewportAutoResolved) {
      return;
    }

    const now = Date.now();
    const metrics = getViewportAutoMetrics();
    const viewportWidth = Math.max(0, Number(metrics?.viewportWidth) || 0);
    const nearBreakpoint = Math.abs(viewportWidth - AUTO_VIEWPORT_BREAKPOINT) <= AUTO_VIEWPORT_HYSTERESIS_PX + 18;
    const switchedRecently = now - autoViewportLastResolvedAtMs < AUTO_VIEWPORT_SWITCH_MIN_INTERVAL_MS;
    const widthNearPrevious = autoViewportLastSwitchWidth > 0 && Math.abs(viewportWidth - autoViewportLastSwitchWidth) <= 24;
    if (nearBreakpoint && switchedRecently && widthNearPrevious) {
      return;
    }

    applyViewportMode("auto");
  }

  function refreshChapterMapLayoutIfNeeded() {
    if (state.view.level !== 2 && state.view.level !== 3) {
      return;
    }
    if (state.view.level === 3 && state.view.tab !== "chapter-map") {
      return;
    }

    const subject = getActiveSubject();
    if (!subject) {
      return;
    }
    const orderedChapters = getOrderedChapters(subject);
    const chapter = state.view.level === 3 ? getActiveChapter() : orderedChapters[0] || { id: "", name: "" };
    if (!chapter) {
      return;
    }
    const renderChapters = orderedChapters.filter((item) => getChapterTreeNodeCount(item) > 0);
    if (!renderChapters.length) {
      return;
    }

    const canvas = refs.levelContainer.querySelector(
      ".lesson-merged-tree-panel .chapter-map-canvas, .chapter-map-panel .chapter-map-canvas"
    );
    if (!(canvas instanceof HTMLElement)) {
      return;
    }

    const nextWidth = Math.round(canvas.clientWidth || 0);
    const renderedWidth = Number.parseInt(asText(canvas.dataset.renderWidth, "0"), 10) || 0;
    if (renderedWidth > 0 && Math.abs(nextWidth - renderedWidth) < 18) {
      return;
    }

    const uiState = getChapterMapUiState(subject.id);
    void mountChapterMapVisualization(canvas, subject, chapter, renderChapters, uiState);
  }

  function updateViewportModeButtonList(modeButtons) {
    modeButtons.forEach((button) => {
      if (!(button instanceof HTMLButtonElement)) {
        return;
      }

      const mode = asText(button.dataset.mode, "auto");
      const isActive = mode === state.viewportMode;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function updateViewportModeControls() {
    if (refs.viewportModeBar instanceof HTMLElement) {
      const settingsButtons = refs.viewportModeBar.querySelectorAll("[data-action='set-viewport-mode']");
      updateViewportModeButtonList(settingsButtons);

      const autoButton = refs.viewportModeBar.querySelector("[data-mode='auto']");
      if (autoButton instanceof HTMLButtonElement) {
        const stateNode = autoButton.querySelector(".viewport-mode-state");
        if (stateNode instanceof HTMLElement) {
          stateNode.textContent = state.viewportAutoResolved === "mobile" ? "موبایل" : "دسکتاپ";
        }
      }
    }

    const profileButtons = document.querySelectorAll(".profile-quick-viewport-btn[data-action='set-viewport-mode']");
    updateViewportModeButtonList(profileButtons);

    const profileAutoButton = document.querySelector(".profile-quick-viewport-btn[data-mode='auto']");
    if (profileAutoButton instanceof HTMLButtonElement) {
      const resolvedLabel = state.viewportAutoResolved === "mobile" ? "موبایل" : "دسکتاپ";
      profileAutoButton.title = `خودکار (${resolvedLabel})`;
    }
  }

  function updateProfileQuickThemeControls() {
    const quickThemeButtons = document.querySelectorAll("[data-action='profile-set-theme']");
    quickThemeButtons.forEach((button) => {
      if (!(button instanceof HTMLButtonElement)) {
        return;
      }
      const theme = asText(button.dataset.theme, "");
      const isActive = theme === state.theme;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    const themeLabelNode = document.getElementById("profileQuickThemeLabel");
    if (themeLabelNode instanceof HTMLElement) {
      themeLabelNode.textContent = `تم فعال: ${getCurrentThemeLabel()}`;
    }
  }

  function updateProfileQuickSyncShortcut(driveState = getDriveSettingsState()) {
    const quickSyncButton = document.getElementById("profileQuickSyncBtn");
    const quickSyncState = document.getElementById("profileQuickSyncState");
    if (!(quickSyncButton instanceof HTMLButtonElement)) {
      return;
    }

    const isBusy = !!state.gapi.syncInFlight || !!asText(state.sync.lockOwner, "").trim();
    const safeLevel = driveState?.level === "ok" || driveState?.level === "warn" ? driveState.level : "muted";
    quickSyncButton.dataset.syncLevel = safeLevel;
    quickSyncButton.title = asText(driveState?.meta, "همگام سازی با گوگل درایو");

    if (quickSyncState instanceof HTMLElement) {
      quickSyncState.textContent = isBusy ? "در حال همگام سازی..." : asText(driveState?.label, "تنظیم نشده");
    }
  }

  function cycleViewportMode() {
    const index = VIEWPORT_MODES.indexOf(state.viewportMode);
    const next = VIEWPORT_MODES[(index + 1) % VIEWPORT_MODES.length];
    setViewportMode(next);
  }

  function loadStoredSubjects() {
    const raw = localStorage.getItem(STORAGE_KEYS.data);
    if (!raw) {
      return [];
    }

    try {
      const payload = JSON.parse(raw);
      return normalizeSubjects(payload);
    } catch {
      return [];
    }
  }

  function stripLegacyDefaultSubjects(subjects) {
    if (!Array.isArray(subjects) || !subjects.length) {
      return [];
    }

    return subjects.filter((subject) => {
      const subjectId = asText(subject?.id, "").toLowerCase();
      if (LEGACY_DEFAULT_SUBJECT_IDS.has(subjectId)) {
        return false;
      }

      const subjectNameKey = normalizeLookupKey(subject?.name);
      if (!LEGACY_DEFAULT_SUBJECT_NAME_KEYS.has(subjectNameKey)) {
        return true;
      }

      const chapters = Array.isArray(subject?.chapters) ? subject.chapters : [];
      const questionCount = chapters.reduce((sum, chapter) => {
        const questions = Array.isArray(chapter?.questions) ? chapter.questions.length : 0;
        return sum + questions;
      }, 0);

      const appearsLegacyDefault = chapters.length <= 2 && questionCount <= 6;
      return !appearsLegacyDefault;
    });
  }

  function persistSubjects(options = {}) {
    const trackEdit = options.trackEdit !== false;
    const queueAuto = options.queueAuto !== false;
    try {
      state.subjects.forEach((subject) => normalizeSubjectChapterOrder(subject));
      bumpSubjectsRevision();
      localStorage.setItem(
        STORAGE_KEYS.data,
        JSON.stringify({ subjects: exportSubjects(state.subjects) })
      );
      if (trackEdit) {
        markLocalDataEdited();
      }
      if (queueAuto) {
        queueAutomaticDriveSync("persist");
      }
    } catch (error) {
      console.error(error);
      setStatus("ذخیره سازی محلی انجام نشد.", "error");
    }
  }

  function exportSubjects(subjects) {
    return subjects.map((subject) => ({
      id: subject.id,
      name: subject.name,
      chapters: (subject.chapters || []).map((chapter, chapterIndex) => ({
        id: chapter.id,
        order: Number.isFinite(Number(chapter?.order)) ? Number(chapter.order) : chapterIndex + 1,
        name: chapter.name,
        questionsFile: chapter.questionsFile || null,
        questionsLoaded: !!chapter.questionsLoaded,
        tree: normalizeChapterTreePayload(chapter?.tree ?? chapter?.children ?? []),
        questions: (chapter.questions || []).map((question) => getCachedExportQuestionPayload(question))
      }))
    }));
  }

  function getCachedExportQuestionPayload(question) {
    if (!question || typeof question !== "object") {
      return {
        id: "",
        chapter: "",
        topic: "عمومی",
        method: "",
        difficulty: 3,
        question: "",
        question_text: "",
        hint: "",
        solution: "",
        step_by_step_solution: "",
        solved: false
      };
    }

    const baseQuestion = asText(question.question, "");
    const baseQuestionText = asText(question.question_text, baseQuestion);
    const baseHint = asText(question.hint, "");
    const baseSolution = asText(question.solution, asText(question.step_by_step_solution, ""));
    const baseStepSolution = asText(question.step_by_step_solution, asText(question.solution, ""));
    const baseAssets = normalizeQuestionAssetPayload(question);
    const solved = resolveQuestionSolvedFlag(question);
    const serializedAssets = JSON.stringify(baseAssets);
    const cacheKey = [
      asText(question.id, ""),
      asText(question.chapter, ""),
      asText(question.topic, ""),
      asText(question.method, ""),
      String(clampNumber(question.difficulty, 1, 5, 3)),
      baseQuestion,
      baseQuestionText,
      baseHint,
      baseSolution,
      baseStepSolution,
      solved ? "1" : "0",
      serializedAssets
    ].join("\u241f");

    const cached = questionExportCache.get(question);
    if (cached && cached.key === cacheKey) {
      return cached.payload;
    }

    const payload = {
      id: question.id,
      chapter: question.chapter,
      topic: resolveQuestionTopicLabel(question),
      method: resolveQuestionMethodLabel(question, ""),
      difficulty: clampNumber(question.difficulty, 1, 5, 3),
      question: cleanQuestionContentText(baseQuestion),
      question_text: cleanQuestionContentText(baseQuestionText),
      hint: cleanQuestionContentText(baseHint),
      solution: cleanQuestionContentText(baseSolution),
      step_by_step_solution: cleanQuestionContentText(baseStepSolution),
      assets: baseAssets,
      solved
    };
    questionExportCache.set(question, { key: cacheKey, payload });
    return payload;
  }

  function sanitizeView() {
    if (state.view.level <= 1) {
      state.view.level = 1;
      state.view.subjectId = null;
      state.view.chapterId = null;
      state.view.tab = "bank";
      return;
    }

    const subject = getActiveSubject();
    if (!subject) {
      state.view.level = 1;
      state.view.subjectId = null;
      state.view.chapterId = null;
      state.view.tab = "bank";
      return;
    }

    if (state.view.level === 2) {
      state.view.chapterId = null;
      state.view.tab = "bank";
      return;
    }

    const chapter = getActiveChapter();
    if (!chapter) {
      state.view.level = 2;
      state.view.chapterId = null;
      state.view.tab = "bank";
      return;
    }

    if (!["bank", "practice", "exam", "chapter-map"].includes(state.view.tab)) {
      state.view.tab = "bank";
    }
  }

  function getActiveSubject() {
    if (!state.view.subjectId) {
      return null;
    }

    return state.subjects.find((item) => item.id === state.view.subjectId) || null;
  }

  function getActiveChapter() {
    const subject = getActiveSubject();
    if (!subject || !state.view.chapterId) {
      return null;
    }

    return subject.chapters.find((item) => item.id === state.view.chapterId) || null;
  }

  function getRuntime(subjectId, chapterId) {
    const key = `${subjectId}::${chapterId}`;

    if (!chapterRuntime.has(key)) {
      chapterRuntime.set(key, {
        loading: false,
        loadPromise: null,
        practiceId: null,
        practiceProfile: "all",
        practiceIncludeSolved: true,
        practiceFiltersCollapsed: true,
        practiceHistory: [],
        practiceCursor: -1,
        practiceSeenIds: [],
        practiceRevealHint: false,
        practiceRevealSolution: false,
        practiceRevealScrollTarget: "",
        exam: null
      });
    }
    const runtime = chapterRuntime.get(key);
    if (typeof runtime.practiceIncludeSolved !== "boolean") {
      runtime.practiceIncludeSolved = true;
    }
    if (typeof runtime.practiceFiltersCollapsed !== "boolean") {
      runtime.practiceFiltersCollapsed = true;
    }
    return runtime;
  }

  function getActiveRuntime() {
    const subject = getActiveSubject();
    const chapter = getActiveChapter();
    if (!subject || !chapter) {
      return null;
    }

    return getRuntime(subject.id, chapter.id);
  }

  function getRuntimeIfExists(subjectId, chapterId) {
    return chapterRuntime.get(`${subjectId}::${chapterId}`) || null;
  }

  function hasRunningExamTimers(nowMs = Date.now()) {
    for (const runtime of chapterRuntime.values()) {
      if (!runtime?.exam) {
        continue;
      }
      ensureExamCompletionState(runtime.exam);
      if (runtime.exam.completed) {
        continue;
      }
      if (getExamRemainingMs(runtime.exam, nowMs) > 0) {
        return true;
      }
    }
    return false;
  }

  function invalidateRunningQuestionTimersCache() {
    hasRunningQuestionTimersCacheValid = false;
  }

  function hasRunningQuestionTimers() {
    if (hasRunningQuestionTimersCacheValid) {
      return hasRunningQuestionTimersCache;
    }

    let running = false;
    for (const uiState of chapterUiState.values()) {
      if (!(uiState?.questionTimers instanceof Map)) {
        continue;
      }
      for (const entry of uiState.questionTimers.values()) {
        if (entry?.running) {
          running = true;
          break;
        }
      }
      if (running) {
        break;
      }
    }

    hasRunningQuestionTimersCache = running;
    hasRunningQuestionTimersCacheValid = true;
    return running;
  }

  function touchExamRuntimeAutosave(force = false) {
    const nowMs = Date.now();
    if (force || nowMs - lastExamRuntimeAutosaveAtMs >= EXAM_RUNTIME_AUTOSAVE_INTERVAL_MS) {
      lastExamRuntimeAutosaveAtMs = nowMs;
      debouncedPersistLastSession();
    }
  }

  function syncLiveTimerLifecycle() {
    const nowMs = Date.now();
    const examTimersRunning = hasRunningExamTimers(nowMs);
    const questionTimersRunning = hasRunningQuestionTimers();
    const shouldRun = examTimersRunning || questionTimersRunning;

    if (shouldRun && liveTimerIntervalId === null) {
      liveTimerIntervalId = window.setInterval(tickLiveTimers, LIVE_TIMER_TICK_MS);
    }

    if (!shouldRun && liveTimerIntervalId !== null) {
      window.clearInterval(liveTimerIntervalId);
      liveTimerIntervalId = null;
    }

    if (examTimersRunning || state.view.tab === "exam") {
      syncExamCountdownLayoutVars({ throttle: true, nowMs });
    }
    updateQuestionFloatTimerWidget(nowMs);
  }

  function syncExamCountdownLayoutVars(options = {}) {
    const root = document.documentElement;
    if (!(root instanceof HTMLElement)) {
      return;
    }

    const nowMs = Number.isFinite(Number(options.nowMs)) ? Number(options.nowMs) : Date.now();
    const shouldThrottle = !!options.throttle;
    const throttleWindow = isMobileViewportActive() ? EXAM_LAYOUT_SYNC_THROTTLE_MOBILE_MS : EXAM_LAYOUT_SYNC_THROTTLE_MS;
    if (shouldThrottle && nowMs - lastExamLayoutSyncAtMs < throttleWindow) {
      return;
    }
    lastExamLayoutSyncAtMs = nowMs;

    const header = document.querySelector(".topbar.premium-topbar");
    const headerBottom =
      header instanceof HTMLElement ? Math.max(0, Math.round(header.getBoundingClientRect().bottom)) : 0;
    const topOffset = headerBottom + 10;
    if (topOffset !== lastExamLayoutHeaderBottom) {
      root.style.setProperty("--exam-countdown-top-offset", `calc(env(safe-area-inset-top, 0px) + ${topOffset}px)`);
      lastExamLayoutHeaderBottom = topOffset;
    }

    const timerPanel =
      refs.levelContainer instanceof HTMLElement
        ? refs.levelContainer.querySelector(".exam-countdown-panel-pinned")
        : null;
    const panelHeight =
      timerPanel instanceof HTMLElement ? Math.max(58, Math.round(timerPanel.getBoundingClientRect().height)) : 72;
    if (panelHeight !== lastExamLayoutPanelHeight) {
      root.style.setProperty("--exam-countdown-panel-height", `${panelHeight}px`);
      lastExamLayoutPanelHeight = panelHeight;
    }
  }

  function tickLiveTimers() {
    const nowMs = Date.now();
    const expireResult = expireFinishedExamSessions(nowMs);
    if (expireResult.shouldRender) {
      render();
      return;
    }

    if (hasRunningExamTimers(nowMs)) {
      touchExamRuntimeAutosave(false);
    }
    updateExamCountdownUi(nowMs);
    updateQuestionSolveTimerUi(nowMs);
    syncLiveTimerLifecycle();
  }

  function expireFinishedExamSessions(nowMs = Date.now()) {
    let expiredCount = 0;
    let shouldRender = false;

    for (const [runtimeKey, runtime] of chapterRuntime.entries()) {
      if (!runtime?.exam) {
        continue;
      }
      ensureExamCompletionState(runtime.exam);
      if (runtime.exam.completed) {
        continue;
      }

      const remainingMs = getExamRemainingMs(runtime.exam, nowMs);
      if (remainingMs > 0) {
        continue;
      }

      completeExamSession(runtime, "timeout");
      expiredCount += 1;

      const separatorIndex = runtimeKey.indexOf("::");
      const subjectId = separatorIndex >= 0 ? runtimeKey.slice(0, separatorIndex) : "";
      const chapterId = separatorIndex >= 0 ? runtimeKey.slice(separatorIndex + 2) : "";
      if (subjectId && chapterId && isActiveChapter(subjectId, chapterId) && state.view.tab === "exam") {
        shouldRender = true;
      }
    }

    if (expiredCount > 0) {
      setStatus("زمان آزمون به پایان رسید. پاسخ‌نامه نمایش داده شد.", "ok");
      showToast("زمان آزمون تمام شد. پاسخ‌نامه آماده است.", "ok");
    }

    return { expiredCount, shouldRender };
  }

  function updateExamCountdownUi(nowMs = Date.now()) {
    const timerValueNodes = refs.levelContainer.querySelectorAll('[data-role="exam-countdown-value"]');
    timerValueNodes.forEach((node) => {
      if (!(node instanceof HTMLElement)) {
        return;
      }

      const subjectId = asText(node.dataset.subjectId, "");
      const chapterId = asText(node.dataset.chapterId, "");
      const runtime = subjectId && chapterId ? getRuntimeIfExists(subjectId, chapterId) : null;
      const exam = runtime?.exam || null;
      const remainingMs = exam ? getExamRemainingMs(exam, nowMs) : 0;

      const nextLabel = formatDurationClock(remainingMs);
      if (node.textContent !== nextLabel) {
        node.textContent = nextLabel;
      }
      const panel = node.closest(".exam-countdown-panel");
      if (panel instanceof HTMLElement) {
        panel.classList.toggle("is-warning", remainingMs > 0 && remainingMs <= EXAM_WARNING_THRESHOLD_MS);
      }
    });

    const progressNodes = refs.levelContainer.querySelectorAll('[data-role="exam-countdown-progress"]');
    progressNodes.forEach((node) => {
      if (!(node instanceof HTMLElement)) {
        return;
      }

      const subjectId = asText(node.dataset.subjectId, "");
      const chapterId = asText(node.dataset.chapterId, "");
      const runtime = subjectId && chapterId ? getRuntimeIfExists(subjectId, chapterId) : null;
      const exam = runtime?.exam || null;
      const timer = exam ? ensureExamTimerState(exam) : null;
      const remainingMs = exam ? getExamRemainingMs(exam, nowMs) : 0;
      const ratio = timer?.durationMs ? Math.max(0, Math.min(1, remainingMs / timer.durationMs)) : 0;
      const nextWidth = `${Math.round(ratio * 100)}%`;
      if (node.dataset.widthPercent !== nextWidth) {
        node.style.width = nextWidth;
        node.dataset.widthPercent = nextWidth;
      }
    });
  }

  function updateQuestionSolveTimerUi(nowMs = Date.now()) {
    if (state.view.tab !== "bank") {
      return;
    }

    const timerValueNodes = refs.levelContainer.querySelectorAll('[data-role="question-solve-value"]');
    timerValueNodes.forEach((node) => {
      if (!(node instanceof HTMLElement)) {
        return;
      }

      const subjectId = asText(node.dataset.subjectId, "");
      const chapterId = asText(node.dataset.chapterId, "");
      const questionId = asText(node.dataset.questionId, "");
      if (!subjectId || !chapterId || !questionId) {
        return;
      }

      const uiState = getChapterUiState(subjectId, chapterId);
      const snapshot = getQuestionTimerSnapshotFromState(uiState, questionId, nowMs);
      const elapsedMs = Math.max(0, Number(snapshot.elapsedMs) || 0);
      const nextLabel = formatDurationClock(elapsedMs);
      if (node.textContent !== nextLabel) {
        node.textContent = nextLabel;
      }

      const strip = node.closest(".question-solve-strip");
      if (!(strip instanceof HTMLElement)) {
        return;
      }

      strip.classList.toggle("is-running", !!snapshot.running);

      const stateNode = strip.querySelector(".question-solve-state");
      if (stateNode instanceof HTMLElement) {
        stateNode.textContent = snapshot.running ? "در حال ثبت زمان" : elapsedMs > 0 ? "توقف شده" : "آماده شروع";
      }

      const startBtn = strip.querySelector('[data-action="question-timer-start"]');
      if (startBtn instanceof HTMLButtonElement) {
        startBtn.disabled = !!snapshot.running;
        if (startBtn.textContent !== "شروع") {
          startBtn.textContent = "شروع";
        }
        startBtn.setAttribute("aria-label", snapshot.running ? "تایمر در حال اجرا است" : "شروع تایمر حل سوال");
      }

      const pauseBtn = strip.querySelector('[data-action="question-timer-pause"]');
      if (pauseBtn instanceof HTMLButtonElement) {
        pauseBtn.disabled = !snapshot.running;
      }

      const resetBtn = strip.querySelector('[data-action="question-timer-reset"]');
      if (resetBtn instanceof HTMLButtonElement) {
        resetBtn.disabled = snapshot.running || elapsedMs <= 0;
      }
    });
  }

  function ensureQuestionFloatTimerWidget() {
    if (!(document.body instanceof HTMLElement)) {
      return null;
    }

    if (questionFloatTimerWidget instanceof HTMLElement && document.body.contains(questionFloatTimerWidget)) {
      return questionFloatTimerWidget;
    }

    const widget = document.createElement("aside");
    widget.className = "question-float-timer";
    widget.hidden = true;
    widget.setAttribute("aria-hidden", "true");
    widget.innerHTML =
      '<div class="question-float-ring"><i></i></div>' +
      '<div class="question-float-core">' +
      '<span class="question-float-label">زمان حل</span>' +
      '<strong class="question-float-value" data-role="question-float-value">00:00</strong>' +
      '<small class="question-float-meta" data-role="question-float-meta">سوال فعال</small>' +
      "</div>";

    document.body.append(widget);
    questionFloatTimerWidget = widget;
    return widget;
  }

  function hideQuestionFloatTimerWidget(widget = questionFloatTimerWidget) {
    if (!(widget instanceof HTMLElement)) {
      return;
    }
    widget.classList.remove("is-visible");
    widget.setAttribute("aria-hidden", "true");
    widget.hidden = true;
  }

  function resolveRunningQuestionTimerState(nowMs = Date.now()) {
    let picked = null;

    for (const [runtimeKey, uiState] of chapterUiState.entries()) {
      if (!(uiState?.questionTimers instanceof Map)) {
        continue;
      }

      const separatorIndex = runtimeKey.indexOf("::");
      if (separatorIndex < 0) {
        continue;
      }
      const subjectId = runtimeKey.slice(0, separatorIndex);
      const chapterId = runtimeKey.slice(separatorIndex + 2);

      for (const [questionId, entry] of uiState.questionTimers.entries()) {
        if (!entry?.running) {
          continue;
        }

        const snapshot = getQuestionTimerSnapshotFromState(uiState, questionId, nowMs);
        if (!snapshot.running) {
          continue;
        }

        const activePriority = isActiveChapter(subjectId, chapterId) && state.view.tab === "bank" ? 2 : 1;
        if (picked && picked.priority >= activePriority) {
          continue;
        }

        const subject = state.subjects.find((item) => item.id === subjectId) || null;
        const chapter = subject?.chapters?.find((item) => item.id === chapterId) || null;
        const order = resolveQuestionOrderInChapter(chapter, questionId);

        picked = {
          priority: activePriority,
          subjectId,
          chapterId,
          questionId,
          elapsedMs: snapshot.elapsedMs,
          subjectName: asText(subject?.name, ""),
          chapterName: asText(chapter?.name, ""),
          questionOrder: order
        };

        if (activePriority === 2) {
          return picked;
        }
      }
    }

    return picked;
  }

  function resolveQuestionOrderInChapter(chapter, questionId) {
    const questions = Array.isArray(chapter?.questions) ? chapter.questions : [];
    if (!questions.length) {
      return 0;
    }
    return questions.findIndex((question) => question?.id === questionId) + 1;
  }

  function updateQuestionFloatTimerWidget(nowMs = Date.now()) {
    const widget = ensureQuestionFloatTimerWidget();
    if (!(widget instanceof HTMLElement)) {
      return;
    }

    const liteMode = isMobilePerformanceLiteActive();
    widget.classList.toggle("is-lite", liteMode);

    const runningState = resolveRunningQuestionTimerState(nowMs);
    if (!runningState) {
      hideQuestionFloatTimerWidget(widget);
      return;
    }

    const valueNode = widget.querySelector('[data-role="question-float-value"]');
    const metaNode = widget.querySelector('[data-role="question-float-meta"]');

    const elapsedMs = Math.max(0, Number(runningState.elapsedMs) || 0);
    const progressCycleMs = liteMode ? 90000 : 60000;
    const progressRatio = (elapsedMs % progressCycleMs) / progressCycleMs;
    const progressDeg = Math.round(progressRatio * 360);
    const nextProgress = `${progressDeg}deg`;

    if (valueNode instanceof HTMLElement) {
      const nextValue = formatDurationClock(elapsedMs);
      if (valueNode.textContent !== nextValue) {
        valueNode.textContent = nextValue;
      }
    }

    if (metaNode instanceof HTMLElement) {
      const nextMeta =
        runningState.questionOrder > 0 ? `سوال ${runningState.questionOrder}` : asText(runningState.chapterName, "سوال فعال");
      if (metaNode.textContent !== nextMeta) {
        metaNode.textContent = nextMeta;
      }
    }

    if (widget.dataset.progressDeg !== nextProgress) {
      widget.style.setProperty("--timer-progress-deg", nextProgress);
      widget.dataset.progressDeg = nextProgress;
    }

    const nextTitle = [runningState.subjectName, runningState.chapterName].filter(Boolean).join(" | ");
    if (widget.title !== nextTitle) {
      widget.title = nextTitle;
    }
    widget.hidden = false;
    widget.setAttribute("aria-hidden", "false");
    widget.classList.add("is-visible");
  }

  function isActiveChapter(subjectId, chapterId) {
    return state.view.level === 3 && state.view.subjectId === subjectId && state.view.chapterId === chapterId;
  }

  function setStatus(message, kind = "info") {
    clearTimeout(statusTimer);

    if (!(refs.statusBar instanceof HTMLElement)) {
      return;
    }

    refs.statusBar.dataset.error = "0";
    refs.statusBar.dataset.ok = "0";

    if (!message) {
      refs.statusBar.textContent = "";
      return;
    }

    refs.statusBar.textContent = message;

    if (kind === "error") {
      refs.statusBar.dataset.error = "1";
    }

    if (kind === "ok") {
      refs.statusBar.dataset.ok = "1";
    }

    statusTimer = window.setTimeout(() => {
      refs.statusBar.textContent = "";
      refs.statusBar.dataset.error = "0";
      refs.statusBar.dataset.ok = "0";
    }, 5500);
  }

  function createId(prefix) {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return `${prefix}-${window.crypto.randomUUID()}`;
    }

    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function clampNumber(value, min, max, fallback) {
    const number = Number.parseInt(value, 10);
    if (!Number.isFinite(number)) {
      return fallback;
    }

    if (number < min) {
      return min;
    }

    if (number > max) {
      return max;
    }

    return number;
  }

  function asText(value, fallback) {
    if (typeof value === "string") {
      return value;
    }

    if (typeof value === "number") {
      return String(value);
    }

    return fallback;
  }

  function cleanQuestionContentText(value, options = {}) {
    const keepLineBreaks = options.keepLineBreaks !== false;
    const trim = options.trim !== false;
    const source = asText(value, "");
    if (!source) {
      return "";
    }

    const normalizedSource = source.replace(/\r\n?/g, "\n").replace(/\u00a0/g, " ");
    const mathPattern = /(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$[^$\n]+\$)/g;
    const parts = normalizedSource.split(mathPattern);

    const cleaned = parts
      .map((part) => {
        if (!part) {
          return "";
        }
        if (parseMathPart(part)) {
          return part;
        }
        return decodeVisibleEscapedControlsInPlainText(part, keepLineBreaks);
      })
      .join("");

    let output = cleaned;
    if (keepLineBreaks) {
      output = output
        .replace(/[ \t\v\f]+/g, " ")
        .replace(/ *\n */g, "\n")
        .replace(/\n{3,}/g, "\n\n");
    } else {
      output = output.replace(/\s+/g, " ");
    }

    return trim ? output.trim() : output;
  }

  function decodeVisibleEscapedControlsInPlainText(rawText, keepLineBreaks = true) {
    const source = asText(rawText, "");
    if (!source || !source.includes("\\")) {
      return source;
    }

    const lineBreakToken = keepLineBreaks ? "\n" : " ";
    let output = "";

    for (let i = 0; i < source.length; i += 1) {
      const char = source.charAt(i);
      if (char !== "\\") {
        output += char;
        continue;
      }

      const c1 = source.charAt(i + 1);
      const c2 = source.charAt(i + 2);
      const c3 = source.charAt(i + 3);
      const c4 = source.charAt(i + 4);
      const c5 = source.charAt(i + 5);
      const c6 = source.charAt(i + 6);

      if (c1 === "\\" && c2 === "r" && c3 === "\\" && c4 === "n") {
        output += lineBreakToken;
        i += 4;
        continue;
      }
      if (c1 === "\\" && (c2 === "n" || c2 === "r")) {
        output += lineBreakToken;
        i += 2;
        continue;
      }
      if (c1 === "\\" && (c2 === "t" || c2 === "b" || c2 === "f")) {
        output += " ";
        i += 2;
        continue;
      }
      if (c1 === "\\" && c2 === "u" && /^[0-9a-fA-F]{4}$/.test(`${c3}${c4}${c5}${c6}`)) {
        const codePoint = Number.parseInt(`${c3}${c4}${c5}${c6}`, 16);
        if (codePoint >= 0 && codePoint <= 0x1f) {
          output += codePoint === 0x09 ? " " : lineBreakToken;
          i += 6;
          continue;
        }
      }

      if (c1 === "r" && c2 === "\\" && c3 === "n") {
        output += lineBreakToken;
        i += 3;
        continue;
      }
      if (c1 === "n" || c1 === "r") {
        output += lineBreakToken;
        i += 1;
        continue;
      }
      if (c1 === "t" || c1 === "b" || c1 === "f") {
        output += " ";
        i += 1;
        continue;
      }
      if (c1 === "u" && /^[0-9a-fA-F]{4}$/.test(`${c2}${c3}${c4}${c5}`)) {
        const codePoint = Number.parseInt(`${c2}${c3}${c4}${c5}`, 16);
        if (codePoint >= 0 && codePoint <= 0x1f) {
          output += codePoint === 0x09 ? " " : lineBreakToken;
          i += 5;
          continue;
        }
      }

      output += "\\";
    }

    return output;
  }

  function escapeHtmlText(value) {
    return asText(value, "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function readDriveConfig() {
    const raw = localStorage.getItem(STORAGE_KEYS.drive);
    const parsed = raw ? parseJsonSafe(raw, DEFAULT_DRIVE_CONFIG) : DEFAULT_DRIVE_CONFIG;
    return normalizeDriveConfig(parsed);
  }

  function readDriveConfigFromInputs() {
    return normalizeDriveConfig({
      clientId: asText(refs.driveClientId?.value, ""),
      fileId: asText(refs.driveFileId?.value, "")
    });
  }

  function normalizeDriveConfig(config) {
    return {
      clientId: asText(config?.clientId, "").trim(),
      fileId: asText(config?.fileId, "").trim()
    };
  }

  function resolvePreferredDriveFileId(config = readDriveConfig()) {
    const safeConfig = normalizeDriveConfig(config);
    return asText(safeConfig.fileId || state.sync?.remote?.fileId, "").trim();
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function normalizeSyncMergeResult(value) {
    const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
    return {
      subjects: Math.max(0, Number(source.subjects) || 0),
      chapters: Math.max(0, Number(source.chapters) || 0),
      questions: Math.max(0, Number(source.questions) || 0),
      localAdded: Math.max(0, Number(source.localAdded) || 0),
      remoteAdded: Math.max(0, Number(source.remoteAdded) || 0),
      termsTouched: Math.max(0, Number(source.termsTouched) || 0),
      mode: asText(source.mode, "none")
    };
  }

  function normalizeDriveSyncMeta(payload) {
    const source = payload && typeof payload === "object" && !Array.isArray(payload) ? payload : {};
    const remote = source.remote && typeof source.remote === "object" && !Array.isArray(source.remote) ? source.remote : {};
    const debugEvents = Array.isArray(source.debugEvents) ? source.debugEvents.slice(-DRIVE_DEBUG_LOG_LIMIT) : [];
    return {
      localHash: asText(source.localHash, "").trim(),
      lastPushAt: asText(source.lastPushAt, "").trim(),
      lastPullAt: asText(source.lastPullAt, "").trim(),
      lastSyncedAt: asText(source.lastSyncedAt, "").trim(),
      lastLocalEditAt: asText(source.lastLocalEditAt, "").trim(),
      lastMergeResult: normalizeSyncMergeResult(source.lastMergeResult),
      remote: {
        fileId: asText(remote.fileId, "").trim(),
        modifiedTime: asText(remote.modifiedTime, "").trim(),
        md5Checksum: asText(remote.md5Checksum, "").trim()
      },
      lastError: asText(source.lastError, "").trim(),
      lastErrorStack: asText(source.lastErrorStack, "").trim(),
      debugEvents: debugEvents
        .map((item) => {
          if (!item || typeof item !== "object" || Array.isArray(item)) {
            return null;
          }
          return {
            at: asText(item.at, "").trim() || nowIso(),
            step: asText(item.step, "log").trim(),
            detail: asText(item.detail, "").trim()
          };
        })
        .filter(Boolean)
    };
  }

  function readDriveSyncMeta() {
    const raw = localStorage.getItem(STORAGE_KEYS.driveSyncMeta);
    if (!raw) {
      return null;
    }
    const parsed = parseJsonSafe(raw, null);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }
    return normalizeDriveSyncMeta(parsed);
  }

  function persistDriveSyncMetaNow() {
    try {
      localStorage.setItem(
        STORAGE_KEYS.driveSyncMeta,
        JSON.stringify({
          version: 1,
          updatedAt: nowIso(),
          ...normalizeDriveSyncMeta(state.sync)
        })
      );
    } catch (error) {
      console.error(error);
    }
  }

  function persistDriveSyncMeta(options = {}) {
    const immediate = options.immediate === true;
    if (immediate) {
      if (driveSyncMetaPersistTimerId) {
        window.clearTimeout(driveSyncMetaPersistTimerId);
        driveSyncMetaPersistTimerId = null;
      }
      persistDriveSyncMetaNow();
      return;
    }

    if (driveSyncMetaPersistTimerId) {
      return;
    }
    driveSyncMetaPersistTimerId = window.setTimeout(() => {
      driveSyncMetaPersistTimerId = null;
      persistDriveSyncMetaNow();
    }, DRIVE_SYNC_META_PERSIST_DEBOUNCE_MS);
  }

  function flushPendingDriveSyncMetaPersist() {
    persistDriveSyncMeta({ immediate: true });
  }

  function restoreDriveSyncMeta() {
    const meta = readDriveSyncMeta();
    if (meta) {
      state.sync.localHash = meta.localHash;
      state.sync.lastPushAt = meta.lastPushAt;
      state.sync.lastPullAt = meta.lastPullAt;
      state.sync.lastSyncedAt = meta.lastSyncedAt;
      state.sync.lastLocalEditAt = meta.lastLocalEditAt;
      state.sync.lastMergeResult = normalizeSyncMergeResult(meta.lastMergeResult);
      state.sync.remote = {
        fileId: meta.remote.fileId,
        modifiedTime: meta.remote.modifiedTime,
        md5Checksum: meta.remote.md5Checksum
      };
      state.sync.lastError = meta.lastError;
      state.sync.lastErrorStack = meta.lastErrorStack;
      state.sync.debugEvents = Array.isArray(meta.debugEvents) ? meta.debugEvents : [];
    }
    updateLocalSyncHash();
    scheduleDriveSyncDiagnosticsRender({ force: true });
  }

  function readSyncDebugPreference() {
    const raw = asText(localStorage.getItem(STORAGE_KEYS.driveSyncDebug), "").trim().toLowerCase();
    return raw === "1" || raw === "true";
  }

  function persistSyncDebugPreference(enabled) {
    try {
      localStorage.setItem(STORAGE_KEYS.driveSyncDebug, enabled ? "1" : "0");
    } catch (error) {
      console.error(error);
    }
  }

  function restoreSyncDebugPreference() {
    state.sync.debugEnabled = readSyncDebugPreference();
  }

  function updateSyncMeta(partial = {}, options = {}) {
    if (!partial || typeof partial !== "object" || Array.isArray(partial)) {
      return;
    }
    if (Object.prototype.hasOwnProperty.call(partial, "localHash")) {
      state.sync.localHash = asText(partial.localHash, "").trim();
    }
    if (Object.prototype.hasOwnProperty.call(partial, "lastPushAt")) {
      state.sync.lastPushAt = asText(partial.lastPushAt, "").trim();
    }
    if (Object.prototype.hasOwnProperty.call(partial, "lastPullAt")) {
      state.sync.lastPullAt = asText(partial.lastPullAt, "").trim();
    }
    if (Object.prototype.hasOwnProperty.call(partial, "lastSyncedAt")) {
      state.sync.lastSyncedAt = asText(partial.lastSyncedAt, "").trim();
    }
    if (Object.prototype.hasOwnProperty.call(partial, "lastLocalEditAt")) {
      state.sync.lastLocalEditAt = asText(partial.lastLocalEditAt, "").trim();
    }
    if (Object.prototype.hasOwnProperty.call(partial, "lastMergeResult")) {
      state.sync.lastMergeResult = normalizeSyncMergeResult(partial.lastMergeResult);
    }
    if (Object.prototype.hasOwnProperty.call(partial, "remote")) {
      const remote = partial.remote && typeof partial.remote === "object" && !Array.isArray(partial.remote) ? partial.remote : {};
      state.sync.remote = {
        fileId: asText(remote.fileId, state.sync.remote.fileId).trim(),
        modifiedTime: asText(remote.modifiedTime, state.sync.remote.modifiedTime).trim(),
        md5Checksum: asText(remote.md5Checksum, state.sync.remote.md5Checksum).trim()
      };
    }
    if (Object.prototype.hasOwnProperty.call(partial, "lastError")) {
      state.sync.lastError = asText(partial.lastError, "").trim();
    }
    if (Object.prototype.hasOwnProperty.call(partial, "lastErrorStack")) {
      state.sync.lastErrorStack = asText(partial.lastErrorStack, "").trim();
    }

    if (options.persist !== false) {
      persistDriveSyncMeta({ immediate: options.persistImmediate === true });
    }
    if (options.render !== false) {
      scheduleDriveSyncDiagnosticsRender({ force: options.forceRender === true });
    }
  }

  function updateLocalSyncHash() {
    const envelope = buildSyncEnvelopeFromLocalState();
    const serialized = JSON.stringify({
      subjects: envelope.subjects,
      terms: envelope.terms
    });
    const hash = hashTextFnv1a(serialized);
    updateSyncMeta({ localHash: hash }, { persist: false, render: false });
    return hash;
  }

  function markLocalDataEdited() {
    if (state.sync.suppressLocalEditTracking) {
      return;
    }
    updateSyncMeta({ lastLocalEditAt: nowIso() }, { persist: true, render: false });
    updateLocalSyncHash();
    scheduleDriveSyncDiagnosticsRender({ force: true });
  }

  function hashTextFnv1a(text) {
    const source = asText(text, "");
    let hash = 0x811c9dc5;
    for (let i = 0; i < source.length; i += 1) {
      hash ^= source.charCodeAt(i);
      hash = (hash * 0x01000193) >>> 0;
    }
    return `fnv1a-${hash.toString(16).padStart(8, "0")}`;
  }

  function formatSyncDateLabel(iso) {
    const raw = asText(iso, "").trim();
    if (!raw) {
      return "-";
    }
    const parsed = Date.parse(raw);
    if (!Number.isFinite(parsed)) {
      return raw;
    }
    try {
      return new Intl.DateTimeFormat("fa-IR", {
        dateStyle: "short",
        timeStyle: "medium",
        hour12: false
      }).format(new Date(parsed));
    } catch {
      return new Date(parsed).toLocaleString();
    }
  }

  function summarizeSyncMergeResult(result = state.sync.lastMergeResult) {
    const safe = normalizeSyncMergeResult(result);
    const modeLabelMap = {
      none: "بدون اجرا",
      same: "بدون تغییر",
      pull: "دریافت",
      push: "ارسال",
      merge: "ادغام",
      create: "ایجاد",
      update: "به روزرسانی"
    };
    const modeLabel = modeLabelMap[safe.mode] || safe.mode || "نامشخص";
    return `${modeLabel} | ${safe.subjects} درس • ${safe.chapters} فصل • ${safe.questions} سوال | محلی+${safe.localAdded} • ابری+${safe.remoteAdded}`;
  }

  function setDiagText(id, value) {
    const node = document.getElementById(id);
    if (!(node instanceof HTMLElement)) {
      return;
    }
    node.textContent = asText(value, "-");
  }

  function isDriveSyncDiagnosticsVisible() {
    if (!isSettingsPanelOpen()) {
      return false;
    }
    if (!(refs.settingsPanel instanceof HTMLElement)) {
      return false;
    }
    const cloudPanel = refs.settingsPanel.querySelector('.settings-tab-panel[data-tab-panel="cloud-sync"]');
    return cloudPanel instanceof HTMLElement && cloudPanel.classList.contains("is-active");
  }

  function scheduleDriveSyncDiagnosticsRender(options = {}) {
    const force = options.force === true;
    if (force) {
      if (driveDiagRenderTimerId) {
        window.clearTimeout(driveDiagRenderTimerId);
        driveDiagRenderTimerId = null;
      }
      driveDiagLastRenderAtMs = Date.now();
      renderDriveSyncDiagnostics({ force: true });
      return;
    }

    if (driveDiagRenderTimerId) {
      return;
    }
    const waitMs = Math.max(0, DRIVE_DIAG_RENDER_THROTTLE_MS - (Date.now() - driveDiagLastRenderAtMs));
    driveDiagRenderTimerId = window.setTimeout(() => {
      driveDiagRenderTimerId = null;
      driveDiagLastRenderAtMs = Date.now();
      renderDriveSyncDiagnostics();
    }, waitMs);
  }

  function renderDriveSyncDiagnostics(options = {}) {
    const force = options.force === true;
    if (!force && !isDriveSyncDiagnosticsVisible()) {
      return;
    }

    const connected = !!readDriveConfig().clientId;
    const tokenOk = isDriveAccessTokenUsable(state.gapi.accessToken, state.gapi.accessTokenExpiresAt);
    const activeFileId = asText(readDriveConfig().fileId || state.sync.remote.fileId, "").trim();
    const debugToggle = refs.driveSyncDebugToggle;
    if (debugToggle instanceof HTMLInputElement) {
      debugToggle.checked = !!state.sync.debugEnabled;
    }

    setDiagText("driveDiagConnected", connected ? "متصل" : "غیرفعال");
    setDiagText("driveDiagToken", tokenOk ? "معتبر" : connected ? "نیازمند ورود" : "ندارد");
    setDiagText("driveDiagFileId", activeFileId || "ثبت نشده");
    setDiagText("driveDiagRemoteModified", formatSyncDateLabel(state.sync.remote.modifiedTime));
    setDiagText("driveDiagRemoteMd5", asText(state.sync.remote.md5Checksum, "") || "-");
    setDiagText("driveDiagLocalHash", state.sync.localHash || "-");
    setDiagText("driveDiagLastPull", formatSyncDateLabel(state.sync.lastPullAt));
    setDiagText("driveDiagLastPush", formatSyncDateLabel(state.sync.lastPushAt));
    setDiagText("driveDiagMergeResult", summarizeSyncMergeResult(state.sync.lastMergeResult));

    const errorNode = document.getElementById("driveDiagLastError");
    if (errorNode instanceof HTMLElement) {
      const stack = asText(state.sync.lastErrorStack, "").trim();
      const message = asText(state.sync.lastError, "").trim();
      errorNode.textContent = stack || message || "-";
    }

    const logNode = document.getElementById("driveSyncDebugLog");
    if (logNode instanceof HTMLElement) {
      const events = Array.isArray(state.sync.debugEvents) ? state.sync.debugEvents : [];
      if (!events.length) {
        logNode.textContent = "لاگی ثبت نشده است.";
      } else {
        logNode.textContent = events
          .slice(-40)
          .map((entry) => `[${formatSyncDateLabel(entry.at)}] ${entry.step}${entry.detail ? `\n${entry.detail}` : ""}`)
          .join("\n\n");
      }
    }
  }

  function syncDebugLog(step, detail = "", options = {}) {
    const safeStep = asText(step, "sync");
    const level = options.level === "error" ? "error" : options.level === "warn" ? "warn" : "info";
    const shouldKeepWhenQuiet = level !== "info" || safeStep === "sync:start" || safeStep === "sync:done";
    if (!state.sync.debugEnabled && !shouldKeepWhenQuiet) {
      return;
    }

    let detailText = "";
    if (typeof detail === "string") {
      detailText = detail;
    } else if (detail !== undefined && detail !== null) {
      try {
        detailText = JSON.stringify(detail, null, 2);
      } catch {
        detailText = String(detail);
      }
    }

    if (!state.sync.debugEnabled && detailText.length > 340) {
      detailText = `${detailText.slice(0, 340)}...`;
    }

    const event = {
      at: nowIso(),
      step: safeStep,
      detail: asText(detailText, "").trim()
    };
    state.sync.debugEvents.push(event);
    if (state.sync.debugEvents.length > DRIVE_DEBUG_LOG_LIMIT) {
      state.sync.debugEvents.splice(0, state.sync.debugEvents.length - DRIVE_DEBUG_LOG_LIMIT);
    }
    if (state.sync.debugEnabled) {
      const method = level === "error" ? "error" : level === "warn" ? "warn" : "log";
      console[method](`[sync] ${event.step}`, event.detail || "");
    }
    persistDriveSyncMeta();
    scheduleDriveSyncDiagnosticsRender();
  }

  function clearSyncLastError() {
    updateSyncMeta(
      {
        lastError: "",
        lastErrorStack: ""
      },
      { persist: true, render: true }
    );
  }

  function captureSyncError(error, context = "") {
    const message = asText(error?.message, "خطای نامشخص در همگام سازی.");
    const stack = asText(error?.stack, message);
    const title = context ? `${context}: ${message}` : message;
    updateSyncMeta(
      {
        lastError: title,
        lastErrorStack: stack
      },
      { persist: true, render: true }
    );
    syncDebugLog("error", stack, { level: "error" });
  }

  function handleSyncDebugToggle(target) {
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    state.sync.debugEnabled = !!target.checked;
    persistSyncDebugPreference(state.sync.debugEnabled);
    scheduleDriveSyncDiagnosticsRender({ force: true });
    const label = state.sync.debugEnabled ? "لاگ دقیق سینک فعال شد." : "لاگ دقیق سینک غیرفعال شد.";
    setStatus(label, "ok");
  }

  async function handleCopySyncError() {
    const text = asText(state.sync.lastErrorStack || state.sync.lastError, "").trim();
    if (!text) {
      showToast("خطایی برای کپی وجود ندارد.", "info");
      return;
    }
    const copied = await copyTextToClipboard(text);
    showToast(copied ? "متن خطا کپی شد." : "کپی خطا ناموفق بود.", copied ? "success" : "error");
  }

  async function handleCopySyncLog() {
    const entries = Array.isArray(state.sync.debugEvents) ? state.sync.debugEvents : [];
    const text = entries
      .slice(-120)
      .map((entry) => `[${entry.at}] ${entry.step}${entry.detail ? `\n${entry.detail}` : ""}`)
      .join("\n\n")
      .trim();
    if (!text) {
      showToast("لاگی برای کپی وجود ندارد.", "info");
      return;
    }
    const copied = await copyTextToClipboard(text);
    showToast(copied ? "لاگ سینک کپی شد." : "کپی لاگ ناموفق بود.", copied ? "success" : "error");
  }

  function normalizeDriveSyncProfile(value) {
    const safe = asText(value, DRIVE_SYNC_PROFILE_DEFAULT).trim().toLowerCase();
    return Object.prototype.hasOwnProperty.call(DRIVE_SYNC_PROFILES, safe) ? safe : DRIVE_SYNC_PROFILE_DEFAULT;
  }

  function getDriveSyncProfileConfig(profile = state.sync.profile) {
    const safeProfile = normalizeDriveSyncProfile(profile);
    return DRIVE_SYNC_PROFILES[safeProfile] || DRIVE_SYNC_PROFILES[DRIVE_SYNC_PROFILE_DEFAULT];
  }

  function getDriveSyncProfileLabel(profile = state.sync.profile) {
    const config = getDriveSyncProfileConfig(profile);
    return asText(config?.label, "کم‌مصرف");
  }

  function readDriveSyncProfilePreference() {
    const raw = asText(localStorage.getItem(STORAGE_KEYS.driveSyncProfile), "").trim();
    return normalizeDriveSyncProfile(raw || DRIVE_SYNC_PROFILE_DEFAULT);
  }

  function persistDriveSyncProfilePreference(profile) {
    try {
      localStorage.setItem(STORAGE_KEYS.driveSyncProfile, normalizeDriveSyncProfile(profile));
    } catch (error) {
      console.error(error);
    }
  }

  function syncDriveSyncProfileControl() {
    const select = refs.driveSyncProfileSelect;
    const hint = refs.driveSyncProfileHint;
    const activeProfile = normalizeDriveSyncProfile(state.sync.profile);
    const activeConfig = getDriveSyncProfileConfig(activeProfile);

    if (select instanceof HTMLSelectElement) {
      select.value = activeProfile;
    }

    if (hint instanceof HTMLElement) {
      const pullDesktopSec = Math.round((Number(activeConfig?.autoPullIntervalDesktopMs) || DRIVE_AUTO_PULL_INTERVAL_MS) / 1000);
      const pullMobileSec = Math.round((Number(activeConfig?.autoPullIntervalMobileMs) || DRIVE_AUTO_PULL_INTERVAL_MOBILE_MS) / 1000);
      const pushWindowSec = Math.round((Number(activeConfig?.autoPushMinIntervalMs) || DRIVE_AUTO_PUSH_MIN_INTERVAL_MS) / 1000);
      hint.textContent = `پروفایل «${getDriveSyncProfileLabel(activeProfile)}»: Pull دسکتاپ ~ ${pullDesktopSec}s، موبایل ~ ${pullMobileSec}s، Push حداقلی ~ ${pushWindowSec}s.`;
    }
  }

  function applyDriveSyncProfile(profile, options = {}) {
    const nextProfile = normalizeDriveSyncProfile(profile);
    const changed = state.sync.profile !== nextProfile;
    state.sync.profile = nextProfile;
    if (options.persist !== false) {
      persistDriveSyncProfilePreference(nextProfile);
    }
    syncDriveSyncProfileControl();
    if (changed) {
      clearDriveAutoSyncTimer();
      setupDriveAutoPullLoop();
      scheduleDriveSyncDiagnosticsRender({ force: true });
      if (options.refresh !== false) {
        refreshSettingsOverview();
      }
    } else if (options.refresh === true) {
      refreshSettingsOverview();
    }
  }

  function restoreDriveSyncProfilePreference() {
    applyDriveSyncProfile(readDriveSyncProfilePreference(), { persist: false, refresh: false });
  }

  function handleDriveSyncProfileChange(target) {
    if (!(target instanceof HTMLSelectElement)) {
      return;
    }
    const nextProfile = normalizeDriveSyncProfile(target.value);
    applyDriveSyncProfile(nextProfile, { persist: true, refresh: true });
    showToast(`پروفایل سینک روی «${getDriveSyncProfileLabel(nextProfile)}» تنظیم شد.`, "success", 2200);
    setStatus(`پروفایل سینک: ${getDriveSyncProfileLabel(nextProfile)}.`, "ok");
  }

  function readDriveAutoSyncPreference() {
    const raw = localStorage.getItem(STORAGE_KEYS.driveAuto);
    return raw === "1" || raw === "true";
  }

  function persistDriveAutoSyncPreference(enabled) {
    try {
      localStorage.setItem(STORAGE_KEYS.driveAuto, enabled ? "1" : "0");
    } catch (error) {
      console.error(error);
    }
  }

  function restoreDriveAutoSyncPreference() {
    setDriveAutoSyncEnabled(readDriveAutoSyncPreference(), { persist: false });
  }

  function clearDriveAutoAuthGuardNotice() {
    driveAutoAuthGuardNotifiedAtMs = 0;
  }

  function handleDriveBackgroundAuthRequired(reason = "background-auth") {
    syncDebugLog("sync:auto-auth-paused", reason, { level: "warn" });
    if (state.gapi.autoSyncEnabled) {
      setDriveAutoSyncEnabled(false, { persist: false });
    }

    const now = Date.now();
    const shouldNotify = now - driveAutoAuthGuardNotifiedAtMs > 12000;
    if (shouldNotify) {
      driveAutoAuthGuardNotifiedAtMs = now;
      const message =
        "برای جلوگیری از لوپ ورود گوگل در موبایل، همگام‌سازی خودکار موقتاً متوقف شد. برای ادامه، یک‌بار دستی «همگام‌سازی» را بزنید.";
      showToast(message, "info", 5400);
      setStatus(message, "warn");
    }
  }

  function markDriveScrollActivity() {
    if (!isMobileViewportActive()) {
      return;
    }
    driveScrollActiveUntilMs = Date.now() + DRIVE_SCROLL_IDLE_GRACE_MS;
  }

  function isDriveScrollActive() {
    return isMobileViewportActive() && Date.now() < driveScrollActiveUntilMs;
  }

  function getDriveScrollDeferMs() {
    const remaining = Math.max(0, driveScrollActiveUntilMs - Date.now());
    return Math.min(DRIVE_SCROLL_DEFER_MAX_MS, remaining + 140);
  }

  function queueRenderAfterDriveScrollIdle() {
    if (!isDriveScrollActive()) {
      queueRender();
      return;
    }

    if (driveDeferredRenderTimerId) {
      return;
    }

    const delayMs = Math.max(180, getDriveScrollDeferMs());
    driveDeferredRenderTimerId = window.setTimeout(() => {
      driveDeferredRenderTimerId = null;
      queueRender();
    }, delayMs);
  }

  function scheduleDriveAutoPullDeferred() {
    if (driveAutoPullDeferredTimerId) {
      return;
    }
    const delayMs = Math.max(220, getDriveScrollDeferMs());
    driveAutoPullDeferredTimerId = window.setTimeout(() => {
      driveAutoPullDeferredTimerId = null;
      void runDriveAutoPullTick();
    }, delayMs);
  }

  function setDriveAutoSyncEnabled(enabled, options = {}) {
    const nextValue = !!enabled;
    state.gapi.autoSyncEnabled = nextValue;
    if (nextValue) {
      clearDriveAutoAuthGuardNotice();
    }
    if (options.persist !== false) {
      persistDriveAutoSyncPreference(nextValue);
    }
    if (nextValue) {
      void warmupDriveSilentSession();
    } else {
      clearDriveAuthRefreshTimer();
    }
    setupDriveAutoPullLoop();
    scheduleDriveSyncDiagnosticsRender();
  }

  async function warmupDriveSilentSession() {
    try {
      const config = readDriveConfig();
      await ensureGoogleDriveReady();
      const hasUsableToken =
        isDriveAccessTokenUsable(state.gapi.accessToken, state.gapi.accessTokenExpiresAt) ||
        hydrateDriveAccessTokenFromCache(config);
      if (!hasUsableToken) {
        syncDebugLog("connect:warmup-skip", "no cached token; waiting for manual sync");
        return;
      }
      await getDriveAccessToken({ interactive: false });
    } catch (error) {
      const code = asText(error?.code, "").toLowerCase();
      if (["auth_required", "auth_silent_failed", "auth_denied"].includes(code)) {
        handleDriveBackgroundAuthRequired("warmup");
        return;
      }
      if (!["auth_required", "auth_silent_failed", "auth_denied"].includes(code)) {
        syncDebugLog("connect:warmup-failed", asText(error?.message, "failed"), { level: "warn" });
      }
    }
  }

  function clearDriveAutoSyncTimer() {
    if (driveAutoSyncTimerId) {
      window.clearTimeout(driveAutoSyncTimerId);
      driveAutoSyncTimerId = null;
    }
  }

  function clearDriveAutoPullTimer() {
    if (driveAutoPullTimerId) {
      window.clearInterval(driveAutoPullTimerId);
      driveAutoPullTimerId = null;
    }
    if (driveAutoPullPrimeTimerId) {
      window.clearTimeout(driveAutoPullPrimeTimerId);
      driveAutoPullPrimeTimerId = null;
    }
    if (driveAutoPullDeferredTimerId) {
      window.clearTimeout(driveAutoPullDeferredTimerId);
      driveAutoPullDeferredTimerId = null;
    }
  }

  function resolveAutoPullMinIntervalMs() {
    const config = getDriveSyncProfileConfig();
    return isMobileViewportActive()
      ? Number(config?.autoPullMinMobileMs) || DRIVE_AUTO_PULL_MIN_INTERVAL_MOBILE_MS
      : Number(config?.autoPullMinDesktopMs) || DRIVE_AUTO_PULL_MIN_INTERVAL_MS;
  }

  function resolveAutoPullIntervalMs() {
    const config = getDriveSyncProfileConfig();
    return isMobileViewportActive()
      ? Number(config?.autoPullIntervalMobileMs) || DRIVE_AUTO_PULL_INTERVAL_MOBILE_MS
      : Number(config?.autoPullIntervalDesktopMs) || DRIVE_AUTO_PULL_INTERVAL_MS;
  }

  function resolveAutoPullPrimeDelayMs() {
    const config = getDriveSyncProfileConfig();
    return isMobileViewportActive()
      ? Number(config?.autoPullPrimeDelayMobileMs) || DRIVE_AUTO_PULL_PRIME_DELAY_MOBILE_MS
      : Number(config?.autoPullPrimeDelayDesktopMs) || DRIVE_AUTO_PULL_PRIME_DELAY_MS;
  }

  function resolveAutoPullPrimeMinGapMs() {
    const config = getDriveSyncProfileConfig();
    return Number(config?.autoPullPrimeMinGapMs) || DRIVE_AUTO_PULL_PRIME_MIN_GAP_MS;
  }

  function resolveAutoPushDebounceMs() {
    const config = getDriveSyncProfileConfig();
    return Number(config?.autoPushDebounceMs) || DRIVE_AUTO_SYNC_DEBOUNCE_MS;
  }

  function resolveAutoPushMinIntervalMs() {
    const config = getDriveSyncProfileConfig();
    return Number(config?.autoPushMinIntervalMs) || DRIVE_AUTO_PUSH_MIN_INTERVAL_MS;
  }

  function getLastSyncActivityAtMs() {
    return Math.max(
      parseSyncTimestampMs(state.sync.lastSyncedAt),
      parseSyncTimestampMs(state.sync.lastPullAt),
      parseSyncTimestampMs(state.sync.lastPushAt)
    );
  }

  function hasPendingLocalSyncChanges() {
    const localEditAt = parseSyncTimestampMs(state.sync.lastLocalEditAt);
    if (localEditAt <= 0) {
      return false;
    }
    const syncedAt = Math.max(parseSyncTimestampMs(state.sync.lastSyncedAt), parseSyncTimestampMs(state.sync.lastPushAt));
    return localEditAt > syncedAt;
  }

  function setupDriveAutoPullLoop() {
    clearDriveAutoPullTimer();
    if (!state.gapi.autoSyncEnabled) {
      return;
    }
    const config = readDriveConfig();
    const validation = validateDriveCredentials(config, true);
    const preferredFileId = resolvePreferredDriveFileId(config);
    if (!validation.ok || !preferredFileId) {
      return;
    }
    if (!config.fileId) {
      saveDriveFileId(preferredFileId);
    }
    const loopIntervalMs = resolveAutoPullIntervalMs();
    driveAutoPullTimerId = window.setInterval(() => {
      void runDriveAutoPullTick();
    }, loopIntervalMs);

    const lastSyncActivityAtMs = getLastSyncActivityAtMs();
    const sinceLastActivityMs =
      lastSyncActivityAtMs > 0 ? Math.max(0, Date.now() - lastSyncActivityAtMs) : Number.POSITIVE_INFINITY;
    if (sinceLastActivityMs >= resolveAutoPullPrimeMinGapMs()) {
      driveAutoPullPrimeTimerId = window.setTimeout(() => {
        driveAutoPullPrimeTimerId = null;
        void runDriveAutoPullTick();
      }, resolveAutoPullPrimeDelayMs());
    }
  }

  function shouldSkipSyncBecauseBusy() {
    return !!(state.sync.handshakeInProgress || state.sync.pullInProgress || state.sync.pushInProgress);
  }

  function withDriveSyncLock(owner, worker) {
    const run = driveSyncLockQueue.then(async () => {
      state.gapi.syncInFlight = true;
      state.sync.lockOwner = asText(owner, "sync");
      scheduleDriveSyncDiagnosticsRender();
      updateDriveActionButtons();
      try {
        return await worker();
      } finally {
        state.sync.lockOwner = "";
        state.gapi.syncInFlight = false;
        scheduleDriveSyncDiagnosticsRender();
        updateDriveActionButtons();
      }
    });
    driveSyncLockQueue = run.catch(() => {});
    return run;
  }

  function queueAutomaticDriveSync(trigger = "") {
    if (!state.gapi.autoSyncEnabled || state.gapi.syncInFlight || shouldSkipSyncBecauseBusy()) {
      return;
    }
    if (!hasPendingLocalSyncChanges()) {
      return;
    }

    const config = readDriveConfig();
    const validation = validateDriveCredentials(config, true);
    const preferredFileId = resolvePreferredDriveFileId(config);
    if (!validation.ok || !preferredFileId) {
      return;
    }
    if (!config.fileId) {
      saveDriveFileId(preferredFileId);
    }

    clearDriveAutoSyncTimer();
    const scrollExtraDelay = isDriveScrollActive() ? getDriveScrollDeferMs() : 0;
    const autoPushMinIntervalMs = resolveAutoPushMinIntervalMs();
    const elapsedSinceLastAutoPushMs =
      driveLastAutoPushAtMs > 0 ? Math.max(0, Date.now() - driveLastAutoPushAtMs) : Number.POSITIVE_INFINITY;
    const pushCooldownLeftMs =
      Number.isFinite(elapsedSinceLastAutoPushMs) && elapsedSinceLastAutoPushMs < autoPushMinIntervalMs
        ? autoPushMinIntervalMs - elapsedSinceLastAutoPushMs
        : 0;
    const delayMs = Math.max(resolveAutoPushDebounceMs() + scrollExtraDelay, pushCooldownLeftMs);
    driveAutoSyncTimerId = window.setTimeout(() => {
      driveAutoSyncTimerId = null;
      void runAutomaticDriveSync(trigger);
    }, delayMs);
  }

  async function runAutomaticDriveSync(trigger = "") {
    if (!state.gapi.autoSyncEnabled || shouldSkipSyncBecauseBusy()) {
      return;
    }
    if (!hasPendingLocalSyncChanges()) {
      return;
    }
    if (document.hidden) {
      return;
    }
    if (isDriveScrollActive()) {
      queueAutomaticDriveSync("scroll-idle");
      return;
    }
    const elapsedSinceLastAutoPushMs =
      driveLastAutoPushAtMs > 0 ? Math.max(0, Date.now() - driveLastAutoPushAtMs) : Number.POSITIVE_INFINITY;
    if (elapsedSinceLastAutoPushMs < resolveAutoPushMinIntervalMs()) {
      queueAutomaticDriveSync("push-cooldown");
      return;
    }
    await withDriveSyncLock(`auto-push:${trigger}`, async () => {
      try {
        await performDriveSyncCycle({
          interactive: false,
          source: `auto-push:${trigger}`,
          mode: "auto-push"
        });
        driveLastAutoPushAtMs = Date.now();
      } catch (error) {
        const code = asText(error?.code, "").toLowerCase();
        if (["auth_required", "auth_silent_failed", "auth_denied", "auth_popup_blocked"].includes(code)) {
          handleDriveBackgroundAuthRequired(`auto-push:${trigger}:${code || "auth"}`);
          return;
        }
        if (!["auth_required", "auth_silent_failed", "auth_denied"].includes(code)) {
          console.error(error);
        }
      }
    });
  }

  async function runDriveAutoPullTick() {
    if (!state.gapi.autoSyncEnabled || shouldSkipSyncBecauseBusy()) {
      return;
    }
    if (document.hidden) {
      return;
    }
    if (isDriveScrollActive()) {
      scheduleDriveAutoPullDeferred();
      return;
    }
    const lastPullActivityAtMs = Math.max(driveLastAutoPullAtMs, parseSyncTimestampMs(state.sync.lastPullAt));
    if (lastPullActivityAtMs > 0 && Date.now() - lastPullActivityAtMs < resolveAutoPullMinIntervalMs()) {
      return;
    }
    const config = readDriveConfig();
    const validation = validateDriveCredentials(config, true);
    const preferredFileId = resolvePreferredDriveFileId(config);
    if (!validation.ok || !preferredFileId) {
      return;
    }
    if (!config.fileId) {
      saveDriveFileId(preferredFileId);
    }
    await withDriveSyncLock("auto-pull", async () => {
      try {
        await performDriveSyncCycle({
          interactive: false,
          source: "auto-pull",
          mode: "auto-pull"
        });
        driveLastAutoPullAtMs = Date.now();
      } catch (error) {
        const code = asText(error?.code, "").toLowerCase();
        if (["auth_required", "auth_silent_failed", "auth_denied", "auth_popup_blocked"].includes(code)) {
          handleDriveBackgroundAuthRequired(`auto-pull:${code || "auth"}`);
          return;
        }
        if (!["auth_required", "auth_silent_failed", "auth_denied"].includes(code)) {
          console.error(error);
        }
      }
    });
  }

  function isDriveAccessTokenUsable(token, expiresAt) {
    const safeToken = asText(token, "").trim();
    if (!safeToken) {
      return false;
    }

    const numericExpiry = Number(expiresAt);
    if (!Number.isFinite(numericExpiry) || numericExpiry <= 0) {
      return true;
    }

    return numericExpiry > Date.now() + DRIVE_TOKEN_EXPIRY_SKEW_MS;
  }

  function readDriveAuthCache() {
    const raw = localStorage.getItem(STORAGE_KEYS.driveAuth);
    if (!raw) {
      return null;
    }

    const parsed = parseJsonSafe(raw, null);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }

    return {
      clientId: asText(parsed.clientId, "").trim(),
      accessToken: asText(parsed.accessToken, "").trim(),
      expiresAt: Number(parsed.expiresAt) || 0
    };
  }

  function clearDriveAuthRefreshTimer() {
    if (driveAuthRefreshTimerId) {
      window.clearTimeout(driveAuthRefreshTimerId);
      driveAuthRefreshTimerId = null;
    }
  }

  function scheduleDriveAccessTokenRefresh(expiresAt = state.gapi.accessTokenExpiresAt) {
    clearDriveAuthRefreshTimer();
    const safeExpiry = Number(expiresAt);
    if (!Number.isFinite(safeExpiry) || safeExpiry <= 0) {
      return;
    }

    const refreshAheadMs = Math.max(DRIVE_TOKEN_REFRESH_AHEAD_MS, DRIVE_TOKEN_EXPIRY_SKEW_MS * 2);
    const delayMs = Math.max(5000, safeExpiry - Date.now() - refreshAheadMs);
    driveAuthRefreshTimerId = window.setTimeout(() => {
      driveAuthRefreshTimerId = null;
      if (isDriveAccessTokenUsable(state.gapi.accessToken, state.gapi.accessTokenExpiresAt)) {
        scheduleDriveAccessTokenRefresh(state.gapi.accessTokenExpiresAt);
        return;
      }

      if (state.gapi.accessToken || state.gapi.accessTokenExpiresAt) {
        syncDebugLog("connect:token-expired", "background refresh disabled; manual sync required", { level: "warn" });
      }
      state.gapi.accessToken = "";
      state.gapi.accessTokenExpiresAt = 0;
      clearDriveAuthCache();
      if (state.gapi.autoSyncEnabled) {
        handleDriveBackgroundAuthRequired("token-expired");
      }
    }, delayMs);
  }

  function persistDriveAuthCache(accessToken, expiresAt, clientId = readDriveConfig().clientId) {
    const safeToken = asText(accessToken, "").trim();
    const safeClientId = asText(clientId, "").trim();
    if (!safeToken || !safeClientId) {
      return;
    }

    const safeExpiry = Number(expiresAt) || 0;
    try {
      localStorage.setItem(
        STORAGE_KEYS.driveAuth,
        JSON.stringify({
          clientId: safeClientId,
          accessToken: safeToken,
          expiresAt: safeExpiry,
          updatedAt: new Date().toISOString()
        })
      );
      scheduleDriveAccessTokenRefresh(safeExpiry);
    } catch (error) {
      console.error(error);
    }
  }

  function clearDriveAuthCache() {
    clearDriveAuthRefreshTimer();
    try {
      localStorage.removeItem(STORAGE_KEYS.driveAuth);
    } catch (error) {
      console.error(error);
    }
  }

  function hydrateDriveAccessTokenFromCache(config = readDriveConfig()) {
    const cached = readDriveAuthCache();
    const configClientId = asText(config?.clientId, "").trim();
    if (!cached || !configClientId || cached.clientId !== configClientId) {
      state.gapi.accessToken = "";
      state.gapi.accessTokenExpiresAt = 0;
      return false;
    }

    if (!isDriveAccessTokenUsable(cached.accessToken, cached.expiresAt)) {
      state.gapi.accessToken = "";
      state.gapi.accessTokenExpiresAt = 0;
      return false;
    }

    state.gapi.accessToken = cached.accessToken;
    state.gapi.accessTokenExpiresAt = Number(cached.expiresAt) || 0;
    scheduleDriveAccessTokenRefresh(state.gapi.accessTokenExpiresAt);
    return true;
  }

  function isLikelyDriveClientId(value) {
    const safe = asText(value, "").trim();
    return !!safe && /apps\.googleusercontent\.com$/i.test(safe);
  }

  function validateDriveCredentials(config, requireComplete = true) {
    const safe = normalizeDriveConfig(config);
    const hasClientId = !!safe.clientId;
    const hasAny = hasClientId;
    const hasBoth = hasClientId;
    const clientFormatValid = !hasClientId || isLikelyDriveClientId(safe.clientId);
    const formatsValid = clientFormatValid;

    if (requireComplete && !hasBoth) {
      return {
        ok: false,
        hasAny,
        hasBoth,
        formatsValid,
        message: "برای اتصال گوگل‌درایو، فیلد شناسه مشتری باید کامل باشد."
      };
    }

    if (!formatsValid) {
      return {
        ok: false,
        hasAny,
        hasBoth,
        formatsValid,
        message: "فرمت شناسه مشتری معتبر نیست. باید با apps.googleusercontent.com تمام شود."
      };
    }

    return {
      ok: requireComplete ? hasBoth : true,
      hasAny,
      hasBoth,
      formatsValid,
      message: ""
    };
  }

  function extractDriveCredentialsFromObject(source) {
    if (!source || typeof source !== "object") {
      return { clientId: "" };
    }

    const seen = new Set();
    const queue = [source];
    let clientId = "";
    let safety = 0;

    while (queue.length && safety < 160) {
      safety += 1;
      const current = queue.shift();
      if (!current || typeof current !== "object" || seen.has(current)) {
        continue;
      }
      seen.add(current);

      Object.entries(current).forEach(([key, value]) => {
        const keyName = asText(key, "").toLowerCase();
        if (typeof value === "string") {
          if (!clientId && (keyName === "client_id" || keyName === "clientid") && isLikelyDriveClientId(value)) {
            clientId = value.trim();
          }
        } else if (value && typeof value === "object") {
          queue.push(value);
        }
      });

      if (clientId) {
        break;
      }
    }

    return { clientId };
  }

  function tryApplyDriveCredentialBlobFromInput(input) {
    if (!(input instanceof HTMLInputElement)) {
      return false;
    }

    const raw = asText(input.value, "").trim();
    if (!raw || raw.length < 20 || !raw.startsWith("{")) {
      return false;
    }

    const parsed = parseJsonSafe(raw, null);
    if (!parsed || typeof parsed !== "object") {
      return false;
    }

    const extracted = extractDriveCredentialsFromObject(parsed);
    if (!extracted.clientId) {
      return false;
    }

    if (refs.driveClientId instanceof HTMLInputElement && extracted.clientId) {
      refs.driveClientId.value = extracted.clientId;
    }

    if (input === refs.driveClientId && extracted.clientId) {
      input.value = extracted.clientId;
    }

    showToast("اطلاعات اتصال از متن JSON استخراج شد. حالا روی «ذخیره اطلاعات اتصال» بزنید.", "success", 2800);
    return true;
  }

  function handleDriveConfigInput(actionTarget) {
    if (actionTarget instanceof HTMLInputElement) {
      tryApplyDriveCredentialBlobFromInput(actionTarget);
    }
    refreshSettingsOverview();
  }

  function restoreDriveConfig() {
    const config = readDriveConfig();
    if (refs.driveClientId instanceof HTMLInputElement) {
      refs.driveClientId.value = config.clientId;
    }
    if (refs.driveFileId instanceof HTMLInputElement) {
      refs.driveFileId.value = config.fileId;
    }
    updateSyncMeta(
      {
        remote: {
          fileId: config.fileId,
          modifiedTime: state.sync.remote.modifiedTime,
          md5Checksum: state.sync.remote.md5Checksum
        }
      },
      { persist: true, render: false }
    );
    if (config.clientId) {
      void warmupDriveSilentSession();
    }
    setupDriveAutoPullLoop();
    refreshSettingsOverview();
  }

  function persistDriveConfig(config = readDriveConfigFromInputs()) {
    try {
      localStorage.setItem(STORAGE_KEYS.drive, JSON.stringify(normalizeDriveConfig(config)));
      refreshSettingsOverview();
    } catch (error) {
      console.error(error);
    }
  }

  function saveDriveCredentials() {
    const fromInputs = readDriveConfigFromInputs();
    const current = readDriveConfig();
    const merged = normalizeDriveConfig({
      clientId: fromInputs.clientId,
      fileId: current.fileId
    });

    const validation = validateDriveCredentials(merged, true);
    if (!validation.ok) {
      showToast(validation.message, "error");
      setStatus(validation.message, "error");
      return;
    }

    persistDriveConfig(merged);
    resetGoogleDriveRuntime();
    restoreDriveConfig();
    refreshSettingsOverview();
    showToast("اطلاعات اتصال با موفقیت ذخیره شد.", "success");
    setStatus("اطلاعات اتصال ذخیره شد.", "ok");
  }

  function maybePersistDriveCredentialsFromInputs() {
    if (!hasUnsavedDriveCredentials()) {
      return false;
    }

    const local = readDriveConfigFromInputs();
    const validation = validateDriveCredentials(local, true);
    if (!validation.ok) {
      throw new Error(validation.message);
    }

    const stored = readDriveConfig();
    persistDriveConfig({
      clientId: local.clientId,
      fileId: stored.fileId
    });
    resetGoogleDriveRuntime();
    restoreDriveConfig();
    return true;
  }

  function resetGoogleDriveRuntime() {
    state.gapi.ready = false;
    state.gapi.loadingPromise = null;
    state.gapi.tokenClient = null;
    state.gapi.configKey = "";
    state.gapi.accessToken = "";
    state.gapi.accessTokenExpiresAt = 0;
    driveAuthRequestPromise = null;
    clearDriveAuthRefreshTimer();
    clearDriveAuthCache();
    clearDriveAutoSyncTimer();
    clearDriveAutoPullTimer();
    driveLastAutoPushAtMs = 0;
    driveLastAutoPullAtMs = 0;
  }

  function parseJsonSafe(raw, fallback) {
    try {
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  function loadScriptOnce(id, src) {
    return new Promise((resolve, reject) => {
      const existing = document.getElementById(id);
      if (existing) {
        const alreadyReady =
          existing.dataset.loaded === "1" ||
          (existing instanceof HTMLScriptElement && /loaded|complete/i.test(asText(existing.readyState, "")));
        if (alreadyReady) {
          existing.dataset.loaded = "1";
          resolve();
          return;
        }

        if (existing.dataset.loaded === "1") {
          resolve();
          return;
        }

        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error(`Failed loading ${src}`)), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.id = id;
      script.src = src;
      script.async = true;

      script.addEventListener("load", () => {
        script.dataset.loaded = "1";
        resolve();
      });
      script.addEventListener("error", () => reject(new Error(`Failed loading ${src}`)));

      document.head.append(script);
    });
  }

  function loadStyleOnce(id, href) {
    return new Promise((resolve, reject) => {
      const existing = document.getElementById(id);
      if (existing) {
        resolve();
        return;
      }

      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = href;

      link.addEventListener("load", () => resolve());
      link.addEventListener("error", () => reject(new Error(`Failed loading ${href}`)));

      document.head.append(link);
    });
  }
  async function handleDriveDownload() {
    clearDriveAutoSyncTimer();
    setStatus("در حال دریافت داده از گوگل درایو...");
    try {
      const autoSaved = maybePersistDriveCredentialsFromInputs();
      if (autoSaved) {
        showToast("اطلاعات اتصال جدید ذخیره شد.", "success", 2400);
      }
      await ensureDriveInteractiveAuthForManualSync();
      await withDriveSyncLock("manual-download", async () => {
        await performDriveSyncCycle({
          interactive: true,
          source: "manual-download",
          mode: "pull-only"
        });
      });
      setDriveAutoSyncEnabled(true);
      refreshSettingsOverview();
      setStatus("داده ها از گوگل درایو دریافت و اعمال شد.", "ok");
    } catch (error) {
      if (asText(error?.code, "").toLowerCase() === "auth_redirect_started") {
        const message = resolveDriveSyncFailureMessage(error, "در حال انتقال به ورود گوگل...");
        showToast(message, "info", 3200);
        setStatus(message, "info");
        return;
      }
      console.error(error);
      setStatus(resolveDriveSyncFailureMessage(error, "دریافت از گوگل درایو انجام نشد."), "error");
    }
  }

  async function handleDriveUpload() {
    clearDriveAutoSyncTimer();
    setStatus("در حال ارسال داده به گوگل درایو...");
    try {
      const autoSaved = maybePersistDriveCredentialsFromInputs();
      if (autoSaved) {
        showToast("اطلاعات اتصال جدید ذخیره شد.", "success", 2400);
      }
      await ensureDriveInteractiveAuthForManualSync();
      await withDriveSyncLock("manual-upload", async () => {
        await performDriveSyncCycle({
          interactive: true,
          source: "manual-upload",
          mode: "push-only"
        });
      });
      setDriveAutoSyncEnabled(true);
      refreshSettingsOverview();
      setStatus("داده ها در گوگل درایو به روز شد.", "ok");
    } catch (error) {
      if (asText(error?.code, "").toLowerCase() === "auth_redirect_started") {
        const message = resolveDriveSyncFailureMessage(error, "در حال انتقال به ورود گوگل...");
        showToast(message, "info", 3200);
        setStatus(message, "info");
        return;
      }
      console.error(error);
      setStatus(resolveDriveSyncFailureMessage(error, "ارسال به گوگل درایو انجام نشد."), "error");
    }
  }

  async function ensureGoogleDriveReady() {
    const config = readDriveConfig();
    syncDebugLog("connect:prepare", `clientId=${asText(config.clientId, "").trim() ? "set" : "missing"}`);

    const validation = validateDriveCredentials(config, true);
    if (!validation.ok) {
      throw new Error(validation.message);
    }

    const configKey = config.clientId;

    if (state.gapi.ready && state.gapi.configKey === configKey) {
      return;
    }

    if (state.gapi.loadingPromise) {
      return state.gapi.loadingPromise;
    }

    state.gapi.loadingPromise = loadScriptOnce("google-gis-script", "https://accounts.google.com/gsi/client")
      .then(() => {
        if (!window.google?.accounts?.oauth2?.initTokenClient) {
          throw new Error("Google Identity Services در دسترس نیست.");
        }
        state.gapi.tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: config.clientId,
          scope: DRIVE_OAUTH_SCOPE,
          callback: () => {}
        });
        state.gapi.ready = true;
        state.gapi.configKey = configKey;
        if (!hydrateDriveAccessTokenFromCache(config)) {
          state.gapi.accessToken = "";
          state.gapi.accessTokenExpiresAt = 0;
        }
        syncDebugLog("connect:ready", "Google token client initialized");
        state.gapi.loadingPromise = null;
      })
      .catch((error) => {
        state.gapi.loadingPromise = null;
        state.gapi.ready = false;
        state.gapi.configKey = "";
        state.gapi.accessToken = "";
        state.gapi.accessTokenExpiresAt = 0;
        syncDebugLog("connect:ready-failed", asText(error?.message, "failed"), { level: "error" });
        throw error;
      });

    return state.gapi.loadingPromise;
  }

  function shouldRetryDriveAuthSilently(error) {
    const code = asText(error?.code, asText(error?.message, "")).toLowerCase();
    return ["interaction_required", "consent_required", "login_required", "account_selection_required"].includes(code);
  }

  function isDrivePopupInteractionError(error) {
    const code = asText(error?.code, asText(error?.type, asText(error?.message, ""))).toLowerCase();
    return [
      "popup_closed",
      "popup_failed_to_open",
      "popup_blocked",
      "popup_blocked_by_browser",
      "auth_popup_blocked"
    ].includes(code);
  }

  function resolveDriveSyncFailureMessage(error, fallbackMessage) {
    const code = asText(error?.code, "").toLowerCase();
    if (code === "auth_redirect_started") {
      return "در حال انتقال به ورود گوگل... پس از تایید، خودکار به برنامه برمی گردی.";
    }
    if (code === "auth_redirect_state_mismatch") {
      return "اعتبار ورود گوگل معتبر نبود. لطفاً دوباره همگام سازی را بزنید.";
    }
    if (code === "auth_redirect_error") {
      return "ورود گوگل در حالت ریدایرکت کامل نشد. دوباره همگام سازی را بزنید.";
    }
    if (isDrivePopupInteractionError(error)) {
      return "پنجره ورود گوگل مسدود شد. برای جلوگیری از این مشکل، ورود مستقیم (redirect) شروع می شود.";
    }
    if (["auth_required", "auth_silent_failed"].includes(code)) {
      return "احراز هویت گوگل نیاز به تایید دستی دارد. دوباره روی همگام سازی بزنید و ورود را کامل کنید.";
    }
    return asText(error?.message, fallbackMessage);
  }

  function readDriveAuthRedirectContext() {
    try {
      const raw = sessionStorage.getItem(DRIVE_AUTH_REDIRECT_SESSION_KEY);
      if (!raw) {
        return null;
      }
      const parsed = parseJsonSafe(raw, null);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return null;
      }
      return {
        state: asText(parsed.state, "").trim(),
        returnHash: asText(parsed.returnHash, "").trim(),
        clientId: asText(parsed.clientId, "").trim(),
        createdAt: asText(parsed.createdAt, "").trim()
      };
    } catch {
      return null;
    }
  }

  function persistDriveAuthRedirectContext(context) {
    try {
      const payload = {
        state: asText(context?.state, "").trim(),
        returnHash: asText(context?.returnHash, "").trim(),
        clientId: asText(context?.clientId, "").trim(),
        createdAt: asText(context?.createdAt, nowIso()).trim()
      };
      sessionStorage.setItem(DRIVE_AUTH_REDIRECT_SESSION_KEY, JSON.stringify(payload));
    } catch (error) {
      console.error(error);
    }
  }

  function clearDriveAuthRedirectContext() {
    try {
      sessionStorage.removeItem(DRIVE_AUTH_REDIRECT_SESSION_KEY);
    } catch (error) {
      console.error(error);
    }
  }

  function normalizeDriveRouteHash(hashValue) {
    const rawHash = asText(hashValue, "").trim();
    if (!rawHash) {
      return "";
    }
    if (rawHash.startsWith("#/")) {
      return rawHash;
    }
    if (rawHash.startsWith("/")) {
      return `#${rawHash}`;
    }
    return "";
  }

  function restoreHashAfterDriveAuth(returnHash) {
    const safeHash = normalizeDriveRouteHash(returnHash);
    const nextUrl = `${window.location.pathname}${window.location.search}${safeHash}`;
    try {
      if (window.history && typeof window.history.replaceState === "function") {
        window.history.replaceState(null, "", nextUrl);
        return;
      }
    } catch {
      // Ignore and fallback to hash assignment.
    }
    window.location.hash = safeHash;
  }

  function createDriveAuthRedirectStateToken() {
    try {
      if (window.crypto?.getRandomValues) {
        const array = new Uint32Array(2);
        window.crypto.getRandomValues(array);
        return `mqb-${Date.now().toString(36)}-${array[0].toString(36)}${array[1].toString(36)}`;
      }
    } catch {
      // Ignore and fallback.
    }
    return `mqb-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  }

  function consumeDriveOAuthRedirectResult() {
    const rawHash = asText(window.location.hash, "").trim();
    if (!rawHash || rawHash.startsWith("#/")) {
      return { handled: false, ok: false, error: null };
    }

    const fragment = rawHash.startsWith("#") ? rawHash.slice(1) : rawHash;
    if (!/(^|&)access_token=/.test(fragment) && !/(^|&)error=/.test(fragment)) {
      return { handled: false, ok: false, error: null };
    }

    const redirectContext = readDriveAuthRedirectContext();
    const returnHash = normalizeDriveRouteHash(redirectContext?.returnHash || "");

    let params;
    try {
      params = new URLSearchParams(fragment);
    } catch (error) {
      clearDriveAuthRedirectContext();
      restoreHashAfterDriveAuth(returnHash);
      const parseError = new Error("پاسخ ورود گوگل قابل پردازش نبود.");
      parseError.code = "auth_redirect_error";
      syncDebugLog("connect:redirect-parse-failed", asText(error?.message, "invalid hash"), { level: "error" });
      return { handled: true, ok: false, error: parseError };
    }

    const returnedState = asText(params.get("state"), "").trim();
    const expectedState = asText(redirectContext?.state, "").trim();
    const oauthError = asText(params.get("error"), "").trim();
    const oauthErrorDescription = asText(params.get("error_description"), "").trim();
    const accessToken = asText(params.get("access_token"), "").trim();
    const expiresInSeconds = Number(params.get("expires_in"));

    clearDriveAuthRedirectContext();
    restoreHashAfterDriveAuth(returnHash);

    if (expectedState && expectedState !== returnedState) {
      const stateError = new Error("اعتبار سنجی ورود گوگل ناموفق بود.");
      stateError.code = "auth_redirect_state_mismatch";
      syncDebugLog(
        "connect:redirect-state-mismatch",
        `expected=${expectedState.slice(0, 12)}... got=${returnedState.slice(0, 12)}...`,
        { level: "error" }
      );
      return { handled: true, ok: false, error: stateError };
    }

    if (oauthError) {
      const redirectError = new Error(oauthErrorDescription || oauthError);
      redirectError.code = "auth_redirect_error";
      syncDebugLog("connect:redirect-error", `${oauthError}${oauthErrorDescription ? ` | ${oauthErrorDescription}` : ""}`, {
        level: "warn"
      });
      return { handled: true, ok: false, error: redirectError };
    }

    if (!accessToken) {
      const missingTokenError = new Error("توکن ورود گوگل دریافت نشد.");
      missingTokenError.code = "auth_redirect_error";
      syncDebugLog("connect:redirect-missing-token", "no access_token in redirect response", { level: "error" });
      return { handled: true, ok: false, error: missingTokenError };
    }

    const expiresAt = Number.isFinite(expiresInSeconds) && expiresInSeconds > 0
      ? Date.now() + expiresInSeconds * 1000
      : Date.now() + 45 * 60 * 1000;
    const activeClientId = asText(readDriveConfig().clientId, "").trim();
    const contextClientId = asText(redirectContext?.clientId, "").trim();
    const persistClientId = contextClientId || activeClientId;

    state.gapi.accessToken = accessToken;
    state.gapi.accessTokenExpiresAt = expiresAt;
    persistDriveAuthCache(accessToken, expiresAt, persistClientId);
    syncDebugLog("connect:redirect-token-ok", `expiresAt=${new Date(expiresAt).toISOString()}`);
    scheduleDriveSyncDiagnosticsRender({ force: true });

    return { handled: true, ok: true, error: null };
  }

  function startDriveOAuthRedirectAuth(options = {}) {
    const config = readDriveConfig();
    const validation = validateDriveCredentials(config, true);
    if (!validation.ok) {
      const configError = new Error(validation.message);
      configError.code = "auth_redirect_error";
      throw configError;
    }

    const redirectUri = `${window.location.origin}${window.location.pathname}`;
    const stateToken = createDriveAuthRedirectStateToken();
    const returnHash = normalizeDriveRouteHash(window.location.hash);
    const prompt = asText(options.prompt, "").trim() || "consent";

    persistDriveAuthRedirectContext({
      state: stateToken,
      returnHash,
      clientId: config.clientId,
      createdAt: nowIso()
    });

    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: redirectUri,
      response_type: "token",
      scope: DRIVE_OAUTH_SCOPE,
      include_granted_scopes: "true",
      state: stateToken,
      prompt
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    syncDebugLog("connect:redirect-start", `reason=${asText(options.reason, "popup")} uri=${redirectUri}`, {
      level: "warn"
    });

    try {
      window.location.assign(authUrl);
      const redirectStart = new Error("Google auth redirect started.");
      redirectStart.code = "auth_redirect_started";
      throw redirectStart;
    } catch (error) {
      if (asText(error?.code, "").toLowerCase() === "auth_redirect_started") {
        throw error;
      }
      const redirectFailed = new Error("انتقال به ورود گوگل انجام نشد.");
      redirectFailed.code = "auth_redirect_error";
      throw redirectFailed;
    }
  }

  function shouldPreferDriveRedirectAuth(options = {}) {
    if (options.preferRedirect === true) {
      return true;
    }
    if (options.preferRedirect === false) {
      return false;
    }
    return isMobileViewportActive();
  }

  async function ensureDriveInteractiveAuthForManualSync(options = {}) {
    const force = options.force === true;
    if (!state.gapi.ready || !state.gapi.tokenClient || force) {
      await ensureGoogleDriveReady();
    }
    if (!force && isDriveAccessTokenUsable(state.gapi.accessToken, state.gapi.accessTokenExpiresAt)) {
      return state.gapi.accessToken;
    }
    if (!force) {
      hydrateDriveAccessTokenFromCache(readDriveConfig());
      if (isDriveAccessTokenUsable(state.gapi.accessToken, state.gapi.accessTokenExpiresAt)) {
        return state.gapi.accessToken;
      }
    }

    try {
      return await getDriveAccessToken({ interactive: true, forceRefresh: force });
    } catch (error) {
      if (isDrivePopupInteractionError(error)) {
        syncDebugLog("connect:popup-blocked", asText(error?.message, "popup blocked"), { level: "warn" });
        startDriveOAuthRedirectAuth({ reason: "popup-blocked", prompt: "consent" });
      }
      throw error;
    }
  }

  async function requestDriveAccessToken(prompt = "", options = {}) {
    if (!state.gapi.ready || !state.gapi.tokenClient) {
      await ensureGoogleDriveReady();
    }
    const interactive = options.interactive !== false;
    const safePrompt = asText(prompt, "").trim() || (interactive ? "" : "none");
    syncDebugLog("connect:auth-request", safePrompt || "silent");

    return new Promise((resolve, reject) => {
      let settled = false;
      const settleResolve = (value) => {
        if (settled) {
          return;
        }
        settled = true;
        state.gapi.tokenClient.error_callback = () => {};
        resolve(value);
      };
      const settleReject = (error) => {
        if (settled) {
          return;
        }
        settled = true;
        state.gapi.tokenClient.error_callback = () => {};
        reject(error);
      };

      state.gapi.tokenClient.callback = (response) => {
        if (!response || response.error) {
          const authError = new Error(asText(response?.error, "Google authentication failed."));
          authError.code = asText(response?.error, "auth_failed");
          settleReject(authError);
          return;
        }

        const token = asText(response.access_token, "").trim();
        if (!token) {
          const authError = new Error("Google authentication failed.");
          authError.code = "auth_missing_token";
          settleReject(authError);
          return;
        }

        const expiresInSeconds = Number(response.expires_in);
        const expiresAt = Number.isFinite(expiresInSeconds) && expiresInSeconds > 0
          ? Date.now() + expiresInSeconds * 1000
          : Date.now() + 45 * 60 * 1000;

        state.gapi.accessToken = token;
        state.gapi.accessTokenExpiresAt = expiresAt;
        persistDriveAuthCache(token, expiresAt);
        syncDebugLog("connect:token-ok", `expiresAt=${new Date(expiresAt).toISOString()}`);
        settleResolve(token);
      };

      state.gapi.tokenClient.error_callback = (response) => {
        const popupCode = asText(response?.type, asText(response?.error, "auth_popup_error"));
        const popupError = new Error(asText(response?.message, popupCode || "Google authentication popup failed."));
        popupError.code = popupCode || "auth_popup_error";
        settleReject(popupError);
      };

      try {
        state.gapi.tokenClient.requestAccessToken({
          prompt: safePrompt,
          include_granted_scopes: true
        });
      } catch (error) {
        settleReject(error);
      }
    }).catch((error) => {
      const code = asText(error?.code, "").toLowerCase();
      if (!interactive && shouldRetryDriveAuthSilently({ code })) {
        const silentError = new Error("احراز هویت بی‌صدا ناموفق بود.");
        silentError.code = "auth_silent_failed";
        syncDebugLog("connect:auth-silent-failed", asText(error?.message, silentError.code), { level: "warn" });
        throw silentError;
      }
      syncDebugLog("connect:auth-failed", asText(error?.message, "failed"), { level: "error" });
      throw error;
    });
  }

  async function getDriveAccessToken(options = {}) {
    const forceRefresh = !!options.forceRefresh;
    const interactive = options.interactive !== false;
    const preferRedirectAuth = interactive && shouldPreferDriveRedirectAuth(options);
    if (!state.gapi.ready || !state.gapi.tokenClient) {
      await ensureGoogleDriveReady();
    }

    if (forceRefresh) {
      state.gapi.accessToken = "";
      state.gapi.accessTokenExpiresAt = 0;
      clearDriveAuthCache();
    }

    if (isDriveAccessTokenUsable(state.gapi.accessToken, state.gapi.accessTokenExpiresAt)) {
      return state.gapi.accessToken;
    }

    hydrateDriveAccessTokenFromCache(readDriveConfig());
    if (isDriveAccessTokenUsable(state.gapi.accessToken, state.gapi.accessTokenExpiresAt)) {
      return state.gapi.accessToken;
    }

    if (driveAuthRequestPromise) {
      try {
        const sharedToken = await driveAuthRequestPromise;
        if (isDriveAccessTokenUsable(sharedToken, state.gapi.accessTokenExpiresAt)) {
          return sharedToken;
        }
      } catch (sharedError) {
        if (!interactive) {
          throw sharedError;
        }
      }
    }

    const authRequest = (async () => {
      if (!interactive) {
        const silentAuthError = new Error("برای ادامه همگام‌سازی خودکار، یک‌بار همگام‌سازی دستی لازم است.");
        silentAuthError.code = "auth_required";
        syncDebugLog("connect:token-background-blocked", "manual sync required", { level: "warn" });
        throw silentAuthError;
      }

      try {
        return await requestDriveAccessToken("none", { interactive: false });
      } catch (silentError) {
        syncDebugLog("connect:token-interactive-silent-miss", asText(silentError?.message, "silent miss"), {
          level: "warn"
        });
      }

      if (preferRedirectAuth) {
        startDriveOAuthRedirectAuth({ reason: "interactive-token", prompt: "consent" });
      }

      try {
        return await requestDriveAccessToken("", { interactive: true });
      } catch (error) {
        if (isDrivePopupInteractionError(error)) {
          startDriveOAuthRedirectAuth({ reason: "interactive-popup-blocked", prompt: "consent" });
        }
        if (!shouldRetryDriveAuthSilently(error)) {
          throw error;
        }
        try {
          return await requestDriveAccessToken("consent", { interactive: true });
        } catch (consentError) {
          if (isDrivePopupInteractionError(consentError)) {
            startDriveOAuthRedirectAuth({ reason: "interactive-popup-consent-blocked", prompt: "consent" });
          }
          throw consentError;
        }
      }
    })();

    driveAuthRequestPromise = authRequest;
    try {
      return await authRequest;
    } finally {
      if (driveAuthRequestPromise === authRequest) {
        driveAuthRequestPromise = null;
      }
    }
  }

  function isDriveRetryableStatus(status) {
    return DRIVE_RETRYABLE_STATUS_CODES.has(Number(status) || 0);
  }

  function resolveDriveRetryDelayMs(attemptIndex = 0) {
    const safeAttempt = Math.max(0, Number(attemptIndex) || 0);
    const expDelay = DRIVE_FETCH_RETRY_BASE_DELAY_MS * (2 ** safeAttempt);
    const jitter = Math.floor(Math.random() * 180);
    return Math.min(DRIVE_FETCH_RETRY_MAX_DELAY_MS, expDelay + jitter);
  }

  async function fetchDriveWithAuth(url, init = {}, options = {}) {
    const interactive = options.interactive !== false;
    const method = asText(init?.method, "GET").trim().toUpperCase() || "GET";
    const retryableMethod = method !== "POST";
    const allowRetry = options.allowRetry !== false && retryableMethod;
    const maxAttempts = allowRetry ? Math.max(1, Number(options.retryAttempts) || DRIVE_FETCH_RETRY_ATTEMPTS) : 1;
    let lastError = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      const attemptIdx = attempt - 1;
      let token = await getDriveAccessToken({ interactive });
      let headers = new Headers(init?.headers || {});
      headers.set("Authorization", `Bearer ${token}`);

      let response = null;
      try {
        response = await fetch(url, {
          ...init,
          headers
        });
      } catch (error) {
        lastError = error;
        if (!allowRetry || attempt >= maxAttempts) {
          throw error;
        }
        syncDebugLog("http:retry-network", `${method} attempt=${attempt}/${maxAttempts} (initial request)`, {
          level: "warn"
        });
        await wait(resolveDriveRetryDelayMs(attemptIdx));
        continue;
      }

      if ((response.status === 401 || response.status === 403) && options.retryAuth !== false) {
        try {
          token = await getDriveAccessToken({ forceRefresh: true, interactive: false });
        } catch (silentError) {
          if (!interactive) {
            throw silentError;
          }
          token = await getDriveAccessToken({ forceRefresh: true, interactive: true });
        }
        headers = new Headers(init?.headers || {});
        headers.set("Authorization", `Bearer ${token}`);
        try {
          response = await fetch(url, {
            ...init,
            headers
          });
        } catch (error) {
          lastError = error;
          if (!allowRetry || attempt >= maxAttempts) {
            throw error;
          }
          syncDebugLog("http:retry-network", `${method} attempt=${attempt}/${maxAttempts} (after auth refresh)`, {
            level: "warn"
          });
          await wait(resolveDriveRetryDelayMs(attemptIdx));
          continue;
        }
      }

      if (allowRetry && attempt < maxAttempts && isDriveRetryableStatus(response.status)) {
        syncDebugLog("http:retry-status", `${method} status=${response.status} attempt=${attempt}/${maxAttempts}`, {
          level: "warn"
        });
        await wait(resolveDriveRetryDelayMs(attemptIdx));
        continue;
      }

      return response;
    }

    if (lastError) {
      throw lastError;
    }
    throw new Error("Drive request failed after retries.");
  }

  async function ensureQuestionsReadyForDriveSync(options = {}) {
    const silent = options.silent !== false;
    const pending = [];

    state.subjects.forEach((subject) => {
      (subject?.chapters || []).forEach((chapter) => {
        if (!chapter || !chapter.questionsFile) {
          return;
        }
        const hasQuestionsArray = Array.isArray(chapter.questions);
        const needsReload = !chapter.questionsLoaded || !hasQuestionsArray || chapter.questions.length === 0;
        if (needsReload) {
          pending.push({ subject, chapter });
        }
      });
    });

    if (!pending.length) {
      return { total: 0, loaded: 0, failed: [], failedCount: 0 };
    }

    if (!silent) {
      setStatus(`در حال آماده‌سازی ${pending.length} فصل برای همگام‌سازی...`);
    }

    let loaded = 0;
    const failed = [];
    for (const item of pending) {
      try {
        await ensureChapterQuestionsLoaded(item.subject, item.chapter, { silent: true, force: true });
        const chapterReady =
          !!item.chapter.questionsLoaded || (Array.isArray(item.chapter.questions) && item.chapter.questions.length > 0);
        if (chapterReady) {
          loaded += 1;
        } else {
          failed.push({
            subjectName: asText(item.subject?.name, ""),
            chapterName: asText(item.chapter?.name, "")
          });
        }
      } catch (error) {
        console.error(error);
        failed.push({
          subjectName: asText(item.subject?.name, ""),
          chapterName: asText(item.chapter?.name, "")
        });
      }
    }

    if (!silent) {
      if (failed.length) {
        setStatus(`آماده‌سازی ناقص بود (${loaded}/${pending.length}).`, "warn");
      } else {
        setStatus(`آماده‌سازی سوالات کامل شد (${loaded}/${pending.length}).`, "ok");
      }
    }

    return {
      total: pending.length,
      loaded,
      failed,
      failedCount: failed.length
    };
  }

  function cloneSubjectsForDriveSync(subjects) {
    const exported = exportSubjects(Array.isArray(subjects) ? subjects : []);
    return normalizeSubjects({ subjects: exported });
  }

  function cloneQuestionForDriveSync(question, chapterName) {
    const questionText = cleanQuestionContentText(asText(question?.question_text, asText(question?.question, "")));
    if (!questionText) {
      return null;
    }
    const hintText = cleanQuestionContentText(asText(question?.hint, ""));
    const solutionText = cleanQuestionContentText(asText(question?.step_by_step_solution, asText(question?.solution, "")));
    const preferredId = asText(question?.id, "").trim();

    return applyIncomingQuestionReviewDefaults({
      id: preferredId,
      chapter: asText(question?.chapter, chapterName),
      topic: resolveQuestionTopicLabel(question),
      method: resolveQuestionMethodLabel(question, ""),
      difficulty: clampNumber(question?.difficulty, 1, 5, 3),
      question: questionText,
      question_text: questionText,
      hint: hintText,
      solution: solutionText,
      step_by_step_solution: solutionText,
      solved: resolveQuestionSolvedFlag(question)
    });
  }

  function appendQuestionForDriveSync(chapter, question, duplicateKeys) {
    if (!chapter || !question || !(duplicateKeys instanceof Set)) {
      return false;
    }

    if (!Array.isArray(chapter.questions)) {
      chapter.questions = [];
    }

    const normalizedQuestion = cloneQuestionForDriveSync(question, chapter.name);
    if (!normalizedQuestion) {
      return false;
    }

    const duplicateKey = resolveQuestionDuplicateKey(normalizedQuestion);
    if (duplicateKey && duplicateKeys.has(duplicateKey)) {
      return false;
    }

    const safeId = asText(normalizedQuestion.id, "").trim();
    const hasIdConflict = safeId && chapter.questions.some((item) => asText(item?.id, "").trim() === safeId);
    normalizedQuestion.id = hasIdConflict || !safeId ? createId("q") : safeId;
    chapter.questions.push(normalizedQuestion);

    if (duplicateKey) {
      duplicateKeys.add(duplicateKey);
    }
    return true;
  }

  function mergeSubjectsForDriveSync(primarySubjects, secondarySubjects) {
    const merged = cloneSubjectsForDriveSync(primarySubjects);
    const safeIncoming = cloneSubjectsForDriveSync(secondarySubjects);
    const subjectMap = new Map();

    merged.forEach((subject) => {
      subjectMap.set(normalizeLookupKey(subject?.name), subject);
    });

    safeIncoming.forEach((incomingSubject) => {
      const subjectKey = normalizeLookupKey(incomingSubject?.name);
      if (!subjectKey) {
        return;
      }

      let targetSubject = subjectMap.get(subjectKey);
      if (!targetSubject) {
        const clonedSubject = cloneSubjectsForDriveSync([incomingSubject])[0];
        if (!clonedSubject) {
          return;
        }
        merged.push(clonedSubject);
        subjectMap.set(subjectKey, clonedSubject);
        return;
      }

      if (!Array.isArray(targetSubject.chapters)) {
        targetSubject.chapters = [];
      }

      const chapterMap = new Map();
      targetSubject.chapters.forEach((chapter) => {
        chapterMap.set(normalizeLookupKey(chapter?.name), chapter);
      });

      (incomingSubject?.chapters || []).forEach((incomingChapter, incomingIndex) => {
        const chapterKey = normalizeLookupKey(incomingChapter?.name);
        if (!chapterKey) {
          return;
        }

        let targetChapter = chapterMap.get(chapterKey);
        if (!targetChapter) {
          targetChapter = {
            id: asText(incomingChapter?.id, createId("ch")),
            order:
              Number.isFinite(Number(incomingChapter?.order)) && Number(incomingChapter?.order) > 0
                ? Number(incomingChapter.order)
                : targetSubject.chapters.length + incomingIndex + 1,
            name: asText(incomingChapter?.name, `فصل ${incomingIndex + 1}`),
            questionsFile: typeof incomingChapter?.questionsFile === "string" ? incomingChapter.questionsFile : null,
            questions: [],
            questionsLoaded: true,
            tree: normalizeChapterTreePayload(incomingChapter?.tree ?? incomingChapter?.children ?? [])
          };
          targetSubject.chapters.push(targetChapter);
          chapterMap.set(chapterKey, targetChapter);
        }

        if (!targetChapter.questionsFile && typeof incomingChapter?.questionsFile === "string") {
          targetChapter.questionsFile = incomingChapter.questionsFile;
        }

        if (!Array.isArray(targetChapter.questions)) {
          targetChapter.questions = [];
        }
        if (!Array.isArray(targetChapter.tree)) {
          targetChapter.tree = normalizeChapterTreePayload(targetChapter?.tree ?? []);
        }
        if (!targetChapter.tree.length) {
          const incomingTree = normalizeChapterTreePayload(incomingChapter?.tree ?? incomingChapter?.children ?? []);
          if (incomingTree.length || Array.isArray(incomingChapter?.tree)) {
            targetChapter.tree = incomingTree;
          }
        }
        const duplicateKeys = createChapterQuestionDuplicateKeySet(targetChapter);
        (incomingChapter?.questions || []).forEach((incomingQuestion) => {
          appendQuestionForDriveSync(targetChapter, incomingQuestion, duplicateKeys);
        });
        targetChapter.questionsLoaded =
          !!targetChapter.questionsLoaded || !!incomingChapter?.questionsLoaded || targetChapter.questions.length > 0;
      });

      normalizeSubjectChapterOrder(targetSubject);
    });

    return merged;
  }

  function serializeSubjectsForDriveSync(subjects) {
    return JSON.stringify(exportSubjects(Array.isArray(subjects) ? subjects : []));
  }

  function countQuestionsInSubjects(subjects) {
    return (Array.isArray(subjects) ? subjects : []).reduce((subjectSum, subject) => {
      const chapterList = Array.isArray(subject?.chapters) ? subject.chapters : [];
      const chapterQuestions = chapterList.reduce((chapterSum, chapter) => {
        const questionList = Array.isArray(chapter?.questions) ? chapter.questions : [];
        return chapterSum + questionList.length;
      }, 0);
      return subjectSum + chapterQuestions;
    }, 0);
  }

  function applySubjectsFromCloudSync(subjects, options = {}) {
    const normalized = cloneSubjectsForDriveSync(subjects);
    if (!normalized.length) {
      return false;
    }

    state.subjects = normalized;
    if (options.resetView) {
      state.view.level = 1;
      state.view.subjectId = null;
      state.view.chapterId = null;
      state.view.tab = "bank";
      state.pagination.page = 1;
    }

    chapterRuntime.clear();
    chapterUiState.clear();
    chapterMapUiState.clear();
    chapterTreeCollapseState.clear();
    activeChapterMapView = null;
    reconcileReviewMetadataAfterDataChange({ migrateLegacy: true });
    pruneExamLibraryAgainstSubjects({ persist: true });
    persistSubjects();
    sanitizeView();
    if (options.render !== false) {
      render();
    }
    return true;
  }

  function countSyncEntities(subjects) {
    const safeSubjects = Array.isArray(subjects) ? subjects : [];
    const chapters = safeSubjects.reduce((sum, subject) => {
      const list = Array.isArray(subject?.chapters) ? subject.chapters : [];
      return sum + list.length;
    }, 0);
    const questions = countQuestionsInSubjects(safeSubjects);
    return {
      subjects: safeSubjects.length,
      chapters,
      questions
    };
  }

  function countReviewEntriesInTerms(terms) {
    const safeTerms = sanitizeReviewTermsObject(terms);
    return Object.values(safeTerms).reduce((sum, termValue) => {
      const reviewStore = termValue?.review;
      if (!reviewStore || typeof reviewStore !== "object" || Array.isArray(reviewStore)) {
        return sum;
      }
      return sum + Object.keys(reviewStore).length;
    }, 0);
  }

  function cloneTermsForDriveSync(terms = state.terms) {
    return sanitizeReviewTermsObject(terms);
  }

  function buildSyncEnvelopeFromLocalState() {
    const localTerms = cloneTermsForDriveSync(state.terms);
    const localSubjects = exportSubjects(cloneSubjectsForDriveSync(state.subjects));
    const localStamp = asText(state.sync.lastLocalEditAt, "").trim();
    return {
      schemaVersion: SYNC_SCHEMA_VERSION,
      updatedAt: localStamp,
      lastLocalEditAt: localStamp,
      lastSyncedAt: asText(state.sync.lastSyncedAt, "").trim(),
      terms: localTerms,
      subjects: localSubjects
    };
  }

  function normalizeSyncEnvelopePayload(payload) {
    const source = payload && typeof payload === "object" && !Array.isArray(payload) ? payload : {};
    const subjectsSource =
      Array.isArray(source.subjects) || Array.isArray(source)
        ? source
        : source.data && typeof source.data === "object" && source.data
          ? source.data
          : source;
    const subjects = normalizeSubjects(subjectsSource);
    const termsSource =
      source.terms && typeof source.terms === "object"
        ? source.terms
        : source.reviewMetadata && typeof source.reviewMetadata === "object" && source.reviewMetadata.terms
          ? source.reviewMetadata.terms
          : source.review && typeof source.review === "object"
            ? source.review
            : {};
    const terms = sanitizeReviewTermsObject(termsSource);

    return {
      schemaVersion: Number(source.schemaVersion) || 1,
      updatedAt: asText(source.updatedAt, "").trim(),
      lastLocalEditAt: asText(source.lastLocalEditAt, "").trim(),
      lastSyncedAt: asText(source.lastSyncedAt, "").trim(),
      subjects,
      terms
    };
  }

  function parseSyncTimestampMs(value) {
    const raw = asText(value, "").trim();
    if (!raw) {
      return 0;
    }
    const parsed = Date.parse(raw);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function pickPreferredSyncEntity(localEntity, remoteEntity, options = {}) {
    const localStamp = parseSyncTimestampMs(localEntity?.updatedAt);
    const remoteStamp = parseSyncTimestampMs(remoteEntity?.updatedAt);
    const fallback = options.fallback === "remote" ? "remote" : "local";
    if (remoteStamp > localStamp) {
      return { preferred: remoteEntity, secondary: localEntity, winner: "remote" };
    }
    if (localStamp > remoteStamp) {
      return { preferred: localEntity, secondary: remoteEntity, winner: "local" };
    }
    if (fallback === "remote") {
      return { preferred: remoteEntity, secondary: localEntity, winner: "remote" };
    }
    return { preferred: localEntity, secondary: remoteEntity, winner: "local" };
  }

  function normalizeQuestionForSync(question, chapterName) {
    const normalized = cloneQuestionForDriveSync(question, chapterName);
    if (!normalized) {
      return null;
    }
    normalized.id = asText(question?.id, normalized.id).trim();
    const updatedAt = asText(question?.updatedAt, "").trim();
    if (updatedAt) {
      normalized.updatedAt = updatedAt;
    }
    return normalized;
  }

  function mergeQuestionEntitiesForSync(localQuestion, remoteQuestion, options = {}) {
    const local = normalizeQuestionForSync(localQuestion, asText(localQuestion?.chapter, ""));
    const remote = normalizeQuestionForSync(remoteQuestion, asText(remoteQuestion?.chapter, ""));
    if (!local && !remote) {
      return null;
    }
    if (!local) {
      return remote;
    }
    if (!remote) {
      return local;
    }

    const fallback = options.fallback === "remote" ? "remote" : "local";
    const selection = pickPreferredSyncEntity(local, remote, { fallback });
    const merged = {
      ...selection.secondary,
      ...selection.preferred
    };
    merged.id = asText(selection.preferred?.id, asText(selection.secondary?.id, "")).trim();
    merged.solved = resolveQuestionSolvedFlag(selection.preferred);
    const mergedUpdatedAt =
      parseSyncTimestampMs(local.updatedAt) >= parseSyncTimestampMs(remote.updatedAt) ? local.updatedAt : remote.updatedAt;
    if (asText(mergedUpdatedAt, "").trim()) {
      merged.updatedAt = mergedUpdatedAt;
    }
    return normalizeQuestionForSync(merged, asText(merged.chapter, "")) || merged;
  }

  function mergeQuestionListsForSync(localQuestions, remoteQuestions, chapterName, options = {}) {
    const localList = Array.isArray(localQuestions) ? localQuestions : [];
    const remoteList = Array.isArray(remoteQuestions) ? remoteQuestions : [];
    const result = [];
    const idIndex = new Map();
    const textIndex = new Map();

    const upsertQuestion = (rawQuestion, source) => {
      const normalized = normalizeQuestionForSync(rawQuestion, chapterName);
      if (!normalized) {
        return;
      }
      const safeId = asText(normalized.id, "").trim();
      const duplicateKey = resolveQuestionDuplicateKey(normalized);
      let index = -1;

      // Text match is the strongest signal for same question across devices.
      if (duplicateKey && textIndex.has(duplicateKey)) {
        index = textIndex.get(duplicateKey);
      } else if (safeId && idIndex.has(safeId)) {
        const collisionIndex = idIndex.get(safeId);
        const existing = result[collisionIndex];
        const existingDuplicateKey = resolveQuestionDuplicateKey(existing);
        const hasConflictingText =
          !!duplicateKey &&
          !!existingDuplicateKey &&
          duplicateKey !== existingDuplicateKey;

        if (!hasConflictingText) {
          index = collisionIndex;
        } else {
          // Same id but different text -> keep both, regenerate id later.
          normalized.id = "";
        }
      }

      if (index >= 0) {
        const existing = result[index];
        const merged = source === "remote"
          ? mergeQuestionEntitiesForSync(existing, normalized, options)
          : mergeQuestionEntitiesForSync(normalized, existing, options);
        if (merged) {
          result[index] = merged;
          const mergedId = asText(merged.id, "").trim();
          const mergedDuplicateKey = resolveQuestionDuplicateKey(merged);
          if (mergedId) {
            idIndex.set(mergedId, index);
          }
          if (mergedDuplicateKey) {
            textIndex.set(mergedDuplicateKey, index);
          }
        }
        return;
      }

      const nextIndex = result.length;
      result.push(normalized);
      if (safeId) {
        idIndex.set(safeId, nextIndex);
      }
      if (duplicateKey) {
        textIndex.set(duplicateKey, nextIndex);
      }
    };

    localList.forEach((question) => upsertQuestion(question, "local"));
    remoteList.forEach((question) => upsertQuestion(question, "remote"));

    const usedIds = new Set();
    return result.map((question) => {
      const copy = normalizeQuestionForSync(question, chapterName) || question;
      let safeId = asText(copy.id, "").trim();
      if (!safeId || usedIds.has(safeId)) {
        safeId = createId("q");
        while (usedIds.has(safeId)) {
          safeId = createId("q");
        }
      }
      copy.id = safeId;
      usedIds.add(safeId);
      return copy;
    });
  }

  function ensureNonDestructiveQuestionMerge(localSubjects, remoteSubjects, mergedSubjects, options = {}) {
    const localCount = countQuestionsInSubjects(localSubjects);
    const remoteCount = countQuestionsInSubjects(remoteSubjects);
    const requiredMinCount = Math.max(localCount, remoteCount);
    const mergedCount = countQuestionsInSubjects(mergedSubjects);

    if (mergedCount >= requiredMinCount) {
      return {
        subjects: mergedSubjects,
        applied: false,
        requiredMinCount,
        baseMergedCount: mergedCount,
        finalCount: mergedCount,
        recovered: 0
      };
    }

    const unionLocalFirst = mergeSubjectsForDriveSync(localSubjects, remoteSubjects);
    const unionRemoteFirst = mergeSubjectsForDriveSync(remoteSubjects, localSubjects);
    const candidates = [mergedSubjects, unionLocalFirst, unionRemoteFirst];
    let bestSubjects = candidates[0];
    let bestCount = countQuestionsInSubjects(bestSubjects);

    for (let i = 1; i < candidates.length; i += 1) {
      const candidate = candidates[i];
      const candidateCount = countQuestionsInSubjects(candidate);
      if (candidateCount > bestCount) {
        bestSubjects = candidate;
        bestCount = candidateCount;
      }
    }

    const reinforced = mergeSubjectsDeepForSync(bestSubjects, mergedSubjects, {
      fallback: options.fallback
    });
    const reinforcedCount = countQuestionsInSubjects(reinforced);
    const finalSubjects = reinforcedCount >= bestCount ? reinforced : bestSubjects;
    const finalCount = Math.max(bestCount, reinforcedCount);

    return {
      subjects: finalSubjects,
      applied: true,
      requiredMinCount,
      baseMergedCount: mergedCount,
      finalCount,
      recovered: Math.max(0, finalCount - mergedCount)
    };
  }

  function mergeChapterTreesForSync(localTree, remoteTree, options = {}) {
    const localNormalized = normalizeChapterTreePayload(localTree);
    const remoteNormalized = normalizeChapterTreePayload(remoteTree);

    if (!localNormalized.length && !remoteNormalized.length) {
      return [];
    }
    if (!localNormalized.length) {
      return remoteNormalized;
    }
    if (!remoteNormalized.length) {
      return localNormalized;
    }

    const fallback = asText(options.fallback, "").trim().toLowerCase();
    if (fallback === "remote") {
      return remoteNormalized;
    }
    if (fallback === "local") {
      return localNormalized;
    }

    // Tree content is authored manually; keep local when both sides have data.
    return localNormalized;
  }

  function normalizeChapterForSync(chapter, fallbackOrder = 1) {
    const safeName = asText(chapter?.name, "").trim();
    if (!safeName) {
      return null;
    }
    const safeOrder = Number.isFinite(Number(chapter?.order)) && Number(chapter.order) > 0 ? Number(chapter.order) : fallbackOrder;
    const questions = Array.isArray(chapter?.questions) ? chapter.questions : [];
    return {
      id: asText(chapter?.id, "").trim(),
      order: safeOrder,
      name: safeName,
      questionsFile: typeof chapter?.questionsFile === "string" ? chapter.questionsFile : null,
      questions,
      questionsLoaded: !!chapter?.questionsLoaded || questions.length > 0,
      tree: normalizeChapterTreePayload(chapter?.tree ?? chapter?.children ?? []),
      updatedAt: asText(chapter?.updatedAt, "").trim()
    };
  }

  function mergeChapterEntitiesForSync(localChapter, remoteChapter, options = {}) {
    const local = normalizeChapterForSync(localChapter, Number(localChapter?.order) || 1);
    const remote = normalizeChapterForSync(remoteChapter, Number(remoteChapter?.order) || 1);
    if (!local && !remote) {
      return null;
    }
    if (!local) {
      const remoteOnly = normalizeChapterForSync(remote, Number(remote?.order) || 1);
      if (!remoteOnly) {
        return null;
      }
      remoteOnly.questions = mergeQuestionListsForSync([], remoteOnly.questions, remoteOnly.name, options);
      return remoteOnly;
    }
    if (!remote) {
      const localOnly = normalizeChapterForSync(local, Number(local?.order) || 1);
      if (!localOnly) {
        return null;
      }
      localOnly.questions = mergeQuestionListsForSync(localOnly.questions, [], localOnly.name, options);
      return localOnly;
    }

    const selection = pickPreferredSyncEntity(local, remote, { fallback: options.fallback });
    const base = {
      ...selection.secondary,
      ...selection.preferred
    };
    base.id = asText(selection.preferred?.id, asText(selection.secondary?.id, "")).trim() || createId("ch");
    base.name = asText(selection.preferred?.name, asText(selection.secondary?.name, "فصل")).trim();
    base.order =
      Number.isFinite(Number(selection.preferred?.order)) && Number(selection.preferred?.order) > 0
        ? Number(selection.preferred.order)
        : Number.isFinite(Number(selection.secondary?.order)) && Number(selection.secondary?.order) > 0
          ? Number(selection.secondary.order)
          : 1;
    base.questions = mergeQuestionListsForSync(local.questions, remote.questions, base.name, options);
    base.questionsLoaded = true;
    base.tree = mergeChapterTreesForSync(local.tree, remote.tree, options);
    if (!base.questionsFile && typeof selection.secondary?.questionsFile === "string") {
      base.questionsFile = selection.secondary.questionsFile;
    }
    return base;
  }

  function normalizeSubjectForSync(subject, fallbackName = "درس") {
    const safeName = asText(subject?.name, "").trim() || fallbackName;
    const chapters = Array.isArray(subject?.chapters) ? subject.chapters : [];
    return {
      id: asText(subject?.id, "").trim(),
      name: safeName,
      chapters,
      updatedAt: asText(subject?.updatedAt, "").trim()
    };
  }

  function getSyncSubjectMergeKey(subject) {
    const nameKey = normalizeLookupKey(subject?.name);
    if (nameKey) {
      return `name:${nameKey}`;
    }
    const id = asText(subject?.id, "").trim();
    return id ? `id:${id}` : "";
  }

  function getSyncChapterMergeKey(chapter) {
    const nameKey = normalizeLookupKey(chapter?.name);
    if (nameKey) {
      return `name:${nameKey}`;
    }
    const id = asText(chapter?.id, "").trim();
    return id ? `id:${id}` : "";
  }

  function mergeSubjectEntitiesForSync(localSubject, remoteSubject, options = {}) {
    const local = normalizeSubjectForSync(localSubject, asText(localSubject?.name, "درس"));
    const remote = normalizeSubjectForSync(remoteSubject, asText(remoteSubject?.name, "درس"));
    if (!local && !remote) {
      return null;
    }
    if (!local) {
      const remoteOnly = normalizeSubjectForSync(remote, "درس");
      remoteOnly.chapters = (remoteOnly.chapters || [])
        .map((chapter, index) => mergeChapterEntitiesForSync(null, chapter, { ...options, fallback: "remote", index }))
        .filter(Boolean);
      return remoteOnly;
    }
    if (!remote) {
      const localOnly = normalizeSubjectForSync(local, "درس");
      localOnly.chapters = (localOnly.chapters || [])
        .map((chapter, index) => mergeChapterEntitiesForSync(chapter, null, { ...options, fallback: "local", index }))
        .filter(Boolean);
      return localOnly;
    }

    const selection = pickPreferredSyncEntity(local, remote, { fallback: options.fallback });
    const merged = {
      ...selection.secondary,
      ...selection.preferred
    };
    merged.id = asText(selection.preferred?.id, asText(selection.secondary?.id, "")).trim() || createId("sub");
    merged.name = asText(selection.preferred?.name, asText(selection.secondary?.name, "درس")).trim() || "درس";

    const chapterMap = new Map();
    (local.chapters || []).forEach((chapter, index) => {
      const normalized = normalizeChapterForSync(chapter, index + 1);
      if (!normalized) {
        return;
      }
      const key = getSyncChapterMergeKey(normalized);
      if (!key) {
        return;
      }
      chapterMap.set(key, { local: normalized, remote: null });
    });
    (remote.chapters || []).forEach((chapter, index) => {
      const normalized = normalizeChapterForSync(chapter, index + 1);
      if (!normalized) {
        return;
      }
      const key = getSyncChapterMergeKey(normalized);
      if (!key) {
        return;
      }
      const existing = chapterMap.get(key) || { local: null, remote: null };
      existing.remote = normalized;
      chapterMap.set(key, existing);
    });

    merged.chapters = Array.from(chapterMap.values())
      .map((entry, index) =>
        mergeChapterEntitiesForSync(entry.local, entry.remote, {
          ...options,
          fallback: options.fallback,
          index
        })
      )
      .filter(Boolean)
      .sort((a, b) => {
        const aOrder = Number.isFinite(Number(a?.order)) ? Number(a.order) : 9999;
        const bOrder = Number.isFinite(Number(b?.order)) ? Number(b.order) : 9999;
        if (aOrder === bOrder) {
          return normalizeLookupKey(a?.name).localeCompare(normalizeLookupKey(b?.name), "fa");
        }
        return aOrder - bOrder;
      });
    return merged;
  }

  function mergeSubjectsDeepForSync(localSubjects, remoteSubjects, options = {}) {
    const localList = Array.isArray(localSubjects) ? localSubjects : [];
    const remoteList = Array.isArray(remoteSubjects) ? remoteSubjects : [];
    const subjectMap = new Map();

    localList.forEach((subject, index) => {
      const normalized = normalizeSubjectForSync(subject, `درس ${index + 1}`);
      if (!normalized) {
        return;
      }
      const key = getSyncSubjectMergeKey(normalized);
      if (!key) {
        return;
      }
      subjectMap.set(key, { local: normalized, remote: null });
    });

    remoteList.forEach((subject, index) => {
      const normalized = normalizeSubjectForSync(subject, `درس ${index + 1}`);
      if (!normalized) {
        return;
      }
      const key = getSyncSubjectMergeKey(normalized);
      if (!key) {
        return;
      }
      const existing = subjectMap.get(key) || { local: null, remote: null };
      existing.remote = normalized;
      subjectMap.set(key, existing);
    });

    return Array.from(subjectMap.values())
      .map((entry, index) =>
        mergeSubjectEntitiesForSync(entry.local, entry.remote, {
          ...options,
          index
        })
      )
      .filter(Boolean);
  }

  function reviewStatusPriority(status) {
    const safe = normalizeReviewStatus(status);
    if (safe === "review") {
      return 3;
    }
    if (safe === "key") {
      return 2;
    }
    if (safe === "mastered") {
      return 1;
    }
    return 0;
  }

  function mergeReviewEntryForSync(localEntry, remoteEntry, fallback = "local") {
    const local = normalizeReviewEntry(localEntry);
    const remote = normalizeReviewEntry(remoteEntry);
    if (!local && !remote) {
      return null;
    }
    if (!local) {
      return remote;
    }
    if (!remote) {
      return local;
    }

    const localStamp = parseSyncTimestampMs(local.updatedAt);
    const remoteStamp = parseSyncTimestampMs(remote.updatedAt);
    if (remoteStamp > localStamp) {
      return remote;
    }
    if (localStamp > remoteStamp) {
      return local;
    }

    const localPriority = reviewStatusPriority(local.status);
    const remotePriority = reviewStatusPriority(remote.status);
    if (remotePriority > localPriority) {
      return remote;
    }
    if (localPriority > remotePriority) {
      return local;
    }

    if (fallback === "remote") {
      return {
        ...remote,
        note: asText(remote.note, "").trim() || asText(local.note, "").trim() || undefined
      };
    }
    return {
      ...local,
      note: asText(local.note, "").trim() || asText(remote.note, "").trim() || undefined
    };
  }

  function mergeReviewTermsForSync(localTerms, remoteTerms, options = {}) {
    const safeLocal = sanitizeReviewTermsObject(localTerms);
    const safeRemote = sanitizeReviewTermsObject(remoteTerms);
    const termKeys = new Set([...Object.keys(safeLocal), ...Object.keys(safeRemote)]);
    const mergedTerms = {};
    let touched = 0;

    termKeys.forEach((termKey) => {
      const safeTermKey = normalizeProfileSemesterValue(termKey, "2");
      const localReview = safeLocal[safeTermKey]?.review || {};
      const remoteReview = safeRemote[safeTermKey]?.review || {};
      const scopedKeys = new Set([...Object.keys(localReview), ...Object.keys(remoteReview)]);
      const mergedReview = {};

      scopedKeys.forEach((scopedKey) => {
        const mergedEntry = mergeReviewEntryForSync(localReview[scopedKey], remoteReview[scopedKey], options.fallback);
        if (mergedEntry) {
          mergedReview[scopedKey] = mergedEntry;
          touched += 1;
        }
      });

      mergedTerms[safeTermKey] = { review: mergedReview };
    });

    return {
      terms: sanitizeReviewTermsObject(mergedTerms),
      touched
    };
  }

  function serializeSyncBundleForCompare(bundle) {
    const subjects = exportSubjects(cloneSubjectsForDriveSync(bundle?.subjects || []));
    const terms = sanitizeReviewTermsObject(bundle?.terms || {});
    return JSON.stringify({
      subjects,
      terms
    });
  }

  function collectQuestionSignatureSet(subjects) {
    const signatures = new Set();
    (subjects || []).forEach((subject) => {
      const subjectKey = normalizeLookupKey(subject?.name);
      (subject?.chapters || []).forEach((chapter) => {
        const chapterKey = normalizeLookupKey(chapter?.name);
        (chapter?.questions || []).forEach((question) => {
          const textKey = resolveQuestionDuplicateKey(question);
          const idKey = asText(question?.id, "").trim();
          const signature = textKey
            ? `${subjectKey}::${chapterKey}::${textKey}`
            : idKey
              ? `${subjectKey}::${chapterKey}::id:${idKey}`
              : "";
          if (signature) {
            signatures.add(signature);
          }
        });
      });
    });
    return signatures;
  }

  function countSetDelta(baseSet, targetSet) {
    let count = 0;
    targetSet.forEach((key) => {
      if (!baseSet.has(key)) {
        count += 1;
      }
    });
    return count;
  }

  function mergeSyncBundles(localBundle, remoteBundle, options = {}) {
    const localStats = countSyncEntities(localBundle.subjects);
    const remoteStats = countSyncEntities(remoteBundle.subjects);
    const localRootStamp = parseSyncTimestampMs(localBundle.updatedAt || localBundle.lastLocalEditAt);
    const remoteRootStamp = parseSyncTimestampMs(remoteBundle.updatedAt || remoteBundle.lastLocalEditAt);
    let fallback = localRootStamp > remoteRootStamp ? "local" : "remote";
    if (options.forcePreferRemote) {
      fallback = "remote";
    }
    if (options.forcePreferLocal) {
      fallback = "local";
    }

    const mergedPrimarySubjects = mergeSubjectsDeepForSync(localBundle.subjects, remoteBundle.subjects, { fallback });
    const nonDestructiveGuard = ensureNonDestructiveQuestionMerge(
      localBundle.subjects,
      remoteBundle.subjects,
      mergedPrimarySubjects,
      { fallback }
    );
    const mergedSubjects = nonDestructiveGuard.subjects;
    const reviewMerge = mergeReviewTermsForSync(localBundle.terms, remoteBundle.terms, { fallback });
    const mergedBundle = {
      schemaVersion: SYNC_SCHEMA_VERSION,
      updatedAt: nowIso(),
      lastLocalEditAt: fallback === "local" ? (localBundle.lastLocalEditAt || nowIso()) : (remoteBundle.lastLocalEditAt || nowIso()),
      lastSyncedAt: nowIso(),
      subjects: mergedSubjects,
      terms: reviewMerge.terms
    };

    const localSignatureSet = collectQuestionSignatureSet(localBundle.subjects);
    const remoteSignatureSet = collectQuestionSignatureSet(remoteBundle.subjects);
    const mergedSignatureSet = collectQuestionSignatureSet(mergedSubjects);
    const localAdded = countSetDelta(localSignatureSet, mergedSignatureSet);
    const remoteAdded = countSetDelta(remoteSignatureSet, mergedSignatureSet);
    const mergedStats = countSyncEntities(mergedSubjects);

    return {
      bundle: mergedBundle,
      stats: {
        ...mergedStats,
        localAdded,
        remoteAdded,
        termsTouched: reviewMerge.touched,
        localBefore: localStats,
        remoteBefore: remoteStats,
        safeguardApplied: nonDestructiveGuard.applied,
        safeguardRecovered: nonDestructiveGuard.recovered,
        safeguardRequiredMin: nonDestructiveGuard.requiredMinCount,
        safeguardBaseMerged: nonDestructiveGuard.baseMergedCount,
        safeguardFinal: nonDestructiveGuard.finalCount
      }
    };
  }

  function applyMergedSyncState(bundle, options = {}) {
    const normalizedSubjects = cloneSubjectsForDriveSync(bundle?.subjects || []);
    const normalizedTerms = sanitizeReviewTermsObject(bundle?.terms || {});
    const shouldRender = options.render !== false;
    const nonBlockingRender = options.nonBlockingRender === true;

    state.sync.suppressLocalEditTracking = true;
    try {
      state.subjects = normalizedSubjects;
      state.terms = normalizedTerms;
      ensureTermReviewStore();

      chapterRuntime.clear();
      chapterUiState.clear();
      chapterMapUiState.clear();
      chapterTreeCollapseState.clear();
      activeChapterMapView = null;

      reconcileReviewMetadataAfterDataChange({ migrateLegacy: true, persist: true });
      pruneExamLibraryAgainstSubjects({ persist: true });
      persistSubjects({ trackEdit: false, queueAuto: false });
      sanitizeView();
      if (shouldRender) {
        if (nonBlockingRender) {
          queueRenderAfterDriveScrollIdle();
        } else {
          render();
        }
      }
    } finally {
      state.sync.suppressLocalEditTracking = false;
    }

    updateLocalSyncHash();
    scheduleDriveSyncDiagnosticsRender();
    return true;
  }

  async function resolveDriveSyncFile(options = {}) {
    const interactive = options.interactive !== false;
    const preferRicher = options.preferRicher === true;
    const forcedFileId = asText(options.forcedFileId, "").trim();
    const fileName = asText(options.fileName, DRIVE_SYNC_FILENAME).trim() || DRIVE_SYNC_FILENAME;
    const legacyNames = [DRIVE_SYNC_FILENAME, "question_bank.json", "subjects.json"];
    const preferredStoredId = forcedFileId || asText(readDriveConfig().fileId, "").trim();
    let selectedFile = null;

    if (preferredStoredId) {
      try {
        syncDebugLog("file:probe-stored", preferredStoredId);
        const byId = await fetchDriveFileMetadataById(preferredStoredId, { interactive });
        if (byId?.id) {
          selectedFile = byId;
          if (!preferRicher) {
            saveDriveFileId(byId.id);
            updateSyncMeta(
              {
                remote: {
                  fileId: asText(byId.id, "").trim(),
                  modifiedTime: asText(byId.modifiedTime, "").trim(),
                  md5Checksum: asText(byId.md5Checksum, "").trim()
                }
              },
              { persist: true, render: true }
            );
            return byId;
          }
        }
      } catch (error) {
        syncDebugLog("file:stored-invalid", asText(error?.message, "lookup failed"), { level: "warn" });
      }
    }

    const candidates = await findDriveJsonFileCandidatesByName(fileName, { interactive, legacyNames });
    const candidatePool = dedupeDriveFileCandidates([
      ...(selectedFile ? [selectedFile] : []),
      ...candidates
    ]);

    let found = selectedFile;
    if (candidatePool.length > 1) {
      const bestCandidate = await pickBestDriveSyncFileCandidate(candidatePool, {
        interactive,
        maxCandidates: 12
      });
      if (bestCandidate?.file?.id) {
        found = bestCandidate.file;
        syncDebugLog(
          "file:selected-best",
          `id=${asText(found.id, "")} q=${Math.max(0, Number(bestCandidate.stats?.questions) || 0)} candidates=${bestCandidate.candidates}`
        );
      }
    } else if (!found && candidatePool.length === 1) {
      found = candidatePool[0];
    }

    if (found?.id) {
      saveDriveFileId(found.id);
      updateSyncMeta(
        {
          remote: {
            fileId: asText(found.id, "").trim(),
            modifiedTime: asText(found.modifiedTime, "").trim(),
            md5Checksum: asText(found.md5Checksum, "").trim()
          }
        },
        { persist: true, render: true }
      );
      syncDebugLog("file:found", `id=${found.id} name=${asText(found.name, fileName)}`);
      return found;
    }

    syncDebugLog("file:not-found", fileName, { level: "warn" });
    return null;
  }

  function determineSyncResultMode(localSnapshot, remoteSnapshot, mergedSnapshot, uploadPerformed, requestedMode) {
    if (requestedMode === "connect-handshake") {
      return "handshake";
    }
    if (localSnapshot === remoteSnapshot && mergedSnapshot === localSnapshot) {
      return "same";
    }
    if (mergedSnapshot === remoteSnapshot && mergedSnapshot !== localSnapshot) {
      return "pull";
    }
    if (mergedSnapshot === localSnapshot && mergedSnapshot !== remoteSnapshot) {
      return uploadPerformed ? "push" : "update";
    }
    return uploadPerformed ? "merge" : "pull";
  }

  async function verifyUploadedSyncSnapshot(fileId, expectedSnapshot, options = {}) {
    const safeFileId = asText(fileId, "").trim();
    if (!safeFileId) {
      return false;
    }
    const expected = asText(expectedSnapshot, "").trim();
    if (!expected) {
      return false;
    }

    const attempts = clampNumber(options.attempts, 1, 4, 3);
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      try {
        const payload = await fetchDriveJsonById(safeFileId, { interactive: options.interactive !== false });
        const normalized = normalizeSyncEnvelopePayload(payload);
        const snapshot = serializeSyncBundleForCompare(normalized);
        if (snapshot === expected) {
          return true;
        }
        syncDebugLog("upload:verify-mismatch", `attempt=${attempt}/${attempts} fileId=${safeFileId}`, {
          level: "warn"
        });
      } catch (error) {
        syncDebugLog("upload:verify-error", asText(error?.message, "verification failed"), { level: "warn" });
      }

      if (attempt < attempts) {
        await wait(resolveDriveRetryDelayMs(attempt - 1));
      }
    }
    return false;
  }

  async function performDriveSyncCycle(options = {}) {
    const interactive = options.interactive !== false;
    const requestedMode = asText(options.mode, "manual-sync");
    const source = asText(options.source, requestedMode);
    const forcedFileId = asText(options.forcedFileId, "").trim();
    const fileName = asText(options.forcedFileName, DRIVE_SYNC_FILENAME).trim() || DRIVE_SYNC_FILENAME;
    const pullOnly = requestedMode === "pull-only" || requestedMode === "auto-pull";
    const pushOnly = requestedMode === "push-only";
    const isHandshake = requestedMode === "connect-handshake";
    const startedAtMs = Date.now();

    state.sync.handshakeInProgress = isHandshake;
    state.sync.pullInProgress = false;
    state.sync.pushInProgress = false;
    clearSyncLastError();
    syncDebugLog("sync:start", `source=${source} mode=${requestedMode}`);

    try {
      const validation = validateDriveCredentials(readDriveConfig(), true);
      if (!validation.ok) {
        throw new Error(validation.message);
      }

      await ensureGoogleDriveReady();
      const preloadResult = await ensureQuestionsReadyForDriveSync({ silent: true });
      if (preloadResult.total > 0) {
        syncDebugLog("local:preload", `ready=${preloadResult.loaded}/${preloadResult.total}`);
      }
      const preloadFailedCount = Math.max(0, Number(preloadResult.failedCount) || 0);
      const strictPreloadRequired = pushOnly || requestedMode === "auto-push";
      const safeToUploadLocalSnapshot = preloadFailedCount <= 0;
      if (preloadFailedCount > 0 && strictPreloadRequired) {
        const failedPreview = preloadResult.failed
          .slice(0, 2)
          .map((entry) => `${entry.subjectName || "درس"} / ${entry.chapterName || "فصل"}`)
          .join(" | ");
        throw new Error(
          `برای جلوگیری از انتقال ناقص، ${preloadFailedCount} فصل کامل بارگذاری نشد. ${failedPreview ? `نمونه: ${failedPreview}` : ""}`.trim()
        );
      }
      if (preloadFailedCount > 0 && !strictPreloadRequired) {
        syncDebugLog("local:preload-partial", `failed=${preloadFailedCount} (pull-continue, upload-guarded)`, {
          level: "warn"
        });
      }

      const localBundle = normalizeSyncEnvelopePayload(buildSyncEnvelopeFromLocalState());
      const localSnapshot = serializeSyncBundleForCompare(localBundle);
      const localStats = countSyncEntities(localBundle.subjects);
      const localHash = updateLocalSyncHash();
      syncDebugLog("local:snapshot", `hash=${localHash} q=${localStats.questions}`);

      const resolvedFile = await resolveDriveSyncFile({
        interactive,
        fileName,
        forcedFileId,
        preferRicher: isHandshake || pullOnly
      });

      if (!resolvedFile?.id) {
        if (pullOnly) {
          throw new Error("فایل همگام سازی در گوگل درایو پیدا نشد.");
        }
        if (!safeToUploadLocalSnapshot) {
          throw new Error(
            "فایل همگام‌سازی پیدا نشد و بخشی از داده‌های محلی کامل بارگذاری نشده‌اند. برای جلوگیری از ارسال ناقص، ابتدا روی دستگاهی که داده کامل دارد یک‌بار همگام‌سازی را اجرا کنید."
          );
        }

        const isSparseHandshakeClient =
          isHandshake &&
          localStats.questions <= 0 &&
          localStats.subjects <= 1 &&
          localStats.chapters <= 1;
        if (isSparseHandshakeClient) {
          syncDebugLog("sync:create-skipped", "handshake on sparse local state; waiting for richer remote", {
            level: "warn"
          });
          throw new Error(
            "فایل همگام سازی پیدا نشد. برای جلوگیری از ساخت فایل خالی، ابتدا روی دستگاهی که سوالات دارد یک‌بار «همگام سازی» را بزنید."
          );
        }

        const createPayload = JSON.stringify(localBundle, null, 2);
        state.sync.pushInProgress = true;
        const created = await uploadDriveJsonContent(createPayload, fileName, "", {
          interactive,
          createInAppData: true
        });
        state.sync.pushInProgress = false;
        const createdId = asText(created?.id, "").trim();
        if (!createdId) {
          throw new Error("ساخت فایل همگام سازی موفق نبود.");
        }
        saveDriveFileId(createdId);
        const createdMeta = await fetchDriveFileMetadataById(createdId, { interactive });
        const stats = countSyncEntities(localBundle.subjects);
        const completedAt = nowIso();
        updateSyncMeta(
          {
            lastPushAt: completedAt,
            lastSyncedAt: completedAt,
            lastLocalEditAt: asText(localBundle.lastLocalEditAt, "").trim() || completedAt,
            remote: {
              fileId: createdId,
              modifiedTime: asText(createdMeta?.modifiedTime, "").trim(),
              md5Checksum: asText(createdMeta?.md5Checksum, "").trim()
            },
            lastMergeResult: {
              ...stats,
              localAdded: 0,
              remoteAdded: stats.questions,
              termsTouched: countReviewEntriesInTerms(localBundle.terms),
              mode: "create"
            }
          },
          { persist: true, render: true }
        );
        setDriveAutoSyncEnabled(true);
        setupDriveAutoPullLoop();
        syncDebugLog("sync:create", `fileId=${createdId}`);
        const createdQuestions = Math.max(0, Number(stats.questions) || 0);
        return {
          id: createdId,
          mode: "create",
          localAddedCount: 0,
          cloudAddedCount: createdQuestions,
          localQuestionCount: createdQuestions,
          remoteQuestionCount: createdQuestions,
          mergedQuestionCount: createdQuestions,
          expectedMinQuestionCount: createdQuestions
        };
      }

      let activeFileId = asText(resolvedFile.id, "").trim();
      saveDriveFileId(activeFileId);
      state.sync.pullInProgress = true;
      syncDebugLog("download:start", `fileId=${activeFileId}`);
      let remoteRawPayload = await fetchDriveJsonById(activeFileId, { interactive });
      state.sync.pullInProgress = false;
      let pulledAt = nowIso();
      updateSyncMeta({ lastPullAt: pulledAt }, { persist: true, render: false });

      let remoteBundle = normalizeSyncEnvelopePayload(remoteRawPayload);
      let remoteSnapshot = serializeSyncBundleForCompare(remoteBundle);
      let remoteStats = countSyncEntities(remoteBundle.subjects);
      syncDebugLog("remote:snapshot", `q=${remoteStats.questions}`);

      const shouldProbeRicherRemote =
        (isHandshake || pullOnly || (!pushOnly && localStats.questions <= 0)) &&
        remoteStats.questions <= 0;
      if (shouldProbeRicherRemote) {
        const richerCandidate = await findRicherDriveSyncFileCandidate(activeFileId, fileName, {
          interactive,
          currentQuestions: remoteStats.questions
        });
        const richerFileId = asText(richerCandidate?.file?.id, "").trim();
        const richerQuestionCount = Math.max(0, Number(richerCandidate?.questionCount) || 0);
        if (richerFileId && richerFileId !== activeFileId && richerQuestionCount > remoteStats.questions) {
          syncDebugLog(
            "file:promote-richer",
            `from=${activeFileId} to=${richerFileId} q=${remoteStats.questions}->${richerQuestionCount}`,
            { level: "warn" }
          );
          activeFileId = richerFileId;
          saveDriveFileId(activeFileId);
          state.sync.pullInProgress = true;
          syncDebugLog("download:retry-richer", `fileId=${activeFileId}`);
          remoteRawPayload = await fetchDriveJsonById(activeFileId, { interactive });
          state.sync.pullInProgress = false;
          pulledAt = nowIso();
          updateSyncMeta({ lastPullAt: pulledAt }, { persist: true, render: false });
          remoteBundle = normalizeSyncEnvelopePayload(remoteRawPayload);
          remoteSnapshot = serializeSyncBundleForCompare(remoteBundle);
          remoteStats = countSyncEntities(remoteBundle.subjects);
          syncDebugLog("remote:snapshot-richer", `q=${remoteStats.questions}`);
        }
      }

      const localSparse =
        localStats.questions <= 2 &&
        localStats.subjects <= 1 &&
        localStats.chapters <= 1 &&
        countReviewEntriesInTerms(localBundle.terms) <= 2;
      const remoteRicher = remoteStats.questions > localStats.questions;
      const firstSyncPreferRemote = remoteRicher && localSparse;

      const mergedResult = mergeSyncBundles(localBundle, remoteBundle, {
        forcePreferRemote: firstSyncPreferRemote
      });
      const mergedBundle = mergedResult.bundle;
      const mergedSnapshot = serializeSyncBundleForCompare(mergedBundle);
      if (mergedResult.stats.safeguardApplied) {
        syncDebugLog(
          "merge:safeguard",
          `Recovered ${mergedResult.stats.safeguardRecovered} questions (base=${mergedResult.stats.safeguardBaseMerged}, final=${mergedResult.stats.safeguardFinal}, minRequired=${mergedResult.stats.safeguardRequiredMin})`,
          { level: "warn" }
        );
      }

      if (mergedSnapshot !== localSnapshot) {
        syncDebugLog("merge:apply-local", `source=${source}`);
        state.sync.pullInProgress = true;
        try {
          applyMergedSyncState(mergedBundle, {
            render: true,
            nonBlockingRender: !interactive
          });
        } finally {
          state.sync.pullInProgress = false;
        }
      } else if (state.view.level === 3 && ["bank", "practice", "exam"].includes(state.view.tab)) {
        if (interactive) {
          queueRender();
        }
      }

      const expectedMergedQuestions = Math.max(0, Number(mergedResult.stats.questions) || 0);
      if (expectedMergedQuestions > 0) {
        let localAfterMergeStats = countSyncEntities(state.subjects);
        if (localAfterMergeStats.questions < expectedMergedQuestions) {
          syncDebugLog(
            "merge:state-repair",
            `expected=${expectedMergedQuestions} actual=${localAfterMergeStats.questions}`,
            { level: "warn" }
          );
          applyMergedSyncState(mergedBundle, {
            render: true,
            nonBlockingRender: !interactive
          });
          localAfterMergeStats = countSyncEntities(state.subjects);
          if (localAfterMergeStats.questions < expectedMergedQuestions) {
            throw new Error(
              `پس از همگام سازی، تعداد سوالات محلی کمتر از انتظار است (${localAfterMergeStats.questions}/${expectedMergedQuestions}). لطفا دوباره همگام سازی را اجرا کنید.`
            );
          }
        }
      }

      let shouldUploadMerged = !pullOnly;
      if (requestedMode === "auto-pull") {
        shouldUploadMerged = false;
      }
      if (pushOnly) {
        shouldUploadMerged = true;
      }
      if (remoteSnapshot === mergedSnapshot && !pushOnly) {
        shouldUploadMerged = false;
      }
      if (firstSyncPreferRemote && !pushOnly) {
        shouldUploadMerged = false;
      }
      if (!safeToUploadLocalSnapshot && shouldUploadMerged) {
        shouldUploadMerged = false;
        syncDebugLog("sync:upload-skipped-preload", `failed=${preloadFailedCount}`, {
          level: "warn"
        });
      }

      let uploadPerformed = false;
      let uploadFileId = activeFileId;
      if (shouldUploadMerged) {
        state.sync.pushInProgress = true;
        const uploadPayload = JSON.stringify(mergedBundle, null, 2);
        const uploadResult = await uploadDriveJsonContent(uploadPayload, fileName, activeFileId, { interactive });
        state.sync.pushInProgress = false;
        uploadPerformed = true;
        uploadFileId = asText(uploadResult?.id, activeFileId).trim() || activeFileId;
        if (uploadFileId) {
          saveDriveFileId(uploadFileId);
        }
      }
      if (uploadPerformed && interactive) {
        const verified = await verifyUploadedSyncSnapshot(uploadFileId || activeFileId, mergedSnapshot, {
          interactive: false,
          attempts: 3
        });
        if (!verified) {
          throw new Error("تایید نهایی فایل همگام سازی انجام نشد. لطفا دوباره همگام سازی را اجرا کنید.");
        }
      }

      let remoteMetaAfter = resolvedFile;
      if (uploadPerformed) {
        remoteMetaAfter = await fetchDriveFileMetadataById(uploadFileId, { interactive });
      } else if (activeFileId && activeFileId !== asText(resolvedFile?.id, "").trim()) {
        try {
          remoteMetaAfter = (await fetchDriveFileMetadataById(activeFileId, { interactive })) || resolvedFile;
        } catch (error) {
          syncDebugLog("file:promote-meta-failed", asText(error?.message, "metadata failed"), { level: "warn" });
          remoteMetaAfter = resolvedFile;
        }
      }
      const completedAt = nowIso();
      const cloudAddedCount = uploadPerformed ? mergedResult.stats.remoteAdded : 0;
      const resultMode = determineSyncResultMode(
        localSnapshot,
        remoteSnapshot,
        mergedSnapshot,
        uploadPerformed,
        requestedMode
      );

      updateSyncMeta(
        {
          lastPullAt: pulledAt,
          lastPushAt: uploadPerformed ? completedAt : state.sync.lastPushAt,
          lastSyncedAt: completedAt,
          lastLocalEditAt: asText(mergedBundle.lastLocalEditAt, state.sync.lastLocalEditAt),
          remote: {
            fileId: asText(remoteMetaAfter?.id, uploadFileId || activeFileId).trim(),
            modifiedTime: asText(remoteMetaAfter?.modifiedTime, "").trim(),
            md5Checksum: asText(remoteMetaAfter?.md5Checksum, "").trim()
          },
          lastMergeResult: {
            subjects: mergedResult.stats.subjects,
            chapters: mergedResult.stats.chapters,
            questions: mergedResult.stats.questions,
            localAdded: mergedResult.stats.localAdded,
            remoteAdded: cloudAddedCount,
            termsTouched: mergedResult.stats.termsTouched,
            mode: resultMode
          }
        },
        { persist: true, render: true }
      );

      setDriveAutoSyncEnabled(true);
      setupDriveAutoPullLoop();
      syncDebugLog("sync:done", `mode=${resultMode} duration=${Date.now() - startedAtMs}ms`);
      const localQuestionCount = Math.max(0, Number(countSyncEntities(state.subjects).questions) || 0);
      const remoteQuestionCount = Math.max(0, Number(remoteStats.questions) || 0);
      const mergedQuestionCount = Math.max(0, Number(mergedResult.stats.questions) || 0);
      const expectedMinQuestionCount = Math.max(localStats.questions, remoteQuestionCount, mergedQuestionCount);
      return {
        id: asText(remoteMetaAfter?.id, uploadFileId || activeFileId).trim(),
        mode: resultMode,
        localAddedCount: mergedResult.stats.localAdded,
        cloudAddedCount,
        localQuestionCount,
        remoteQuestionCount,
        mergedQuestionCount,
        expectedMinQuestionCount
      };
    } catch (error) {
      captureSyncError(error, source);
      throw error;
    } finally {
      state.sync.handshakeInProgress = false;
      state.sync.pullInProgress = false;
      state.sync.pushInProgress = false;
      scheduleDriveSyncDiagnosticsRender();
    }
  }

  async function downloadFromJson(fileId = readDriveConfig().fileId, options = {}) {
    const safeFileId = asText(fileId, "").trim();
    return withDriveSyncLock("download-helper", async () => {
      await performDriveSyncCycle({
        interactive: options.interactive !== false,
        source: "download-helper",
        mode: "pull-only",
        forcedFileId: safeFileId || ""
      });
      return cloneSubjectsForDriveSync(state.subjects);
    });
  }

  async function uploadToJson(fileName = DRIVE_SYNC_FILENAME, fileId = readDriveConfig().fileId, options = {}) {
    const safeFileId = asText(fileId, "").trim();
    return withDriveSyncLock("upload-helper", async () => {
      return performDriveSyncCycle({
        interactive: options.interactive !== false,
        source: "upload-helper",
        mode: "push-only",
        forcedFileId: safeFileId || "",
        forcedFileName: asText(fileName, DRIVE_SYNC_FILENAME)
      });
    });
  }

  async function handleGoogleDriveSync() {
    setSyncButtonLoading(true);
    clearDriveAutoSyncTimer();
    setStatus("در حال همگام سازی با گوگل درایو...");

    try {
      const localQuestionsBeforeSync = getLocalQuestionCountForSync();
      const autoSaved = maybePersistDriveCredentialsFromInputs();
      if (autoSaved) {
        showToast("اطلاعات اتصال جدید ذخیره شد.", "success", 2400);
      }

      const storedValidation = validateDriveCredentials(readDriveConfig(), true);
      if (!storedValidation.ok) {
        throw new Error(storedValidation.message);
      }

      await ensureDriveInteractiveAuthForManualSync();

      const result = await withDriveSyncLock("manual-connect", async () =>
        performDriveSyncCycle({
          interactive: true,
          source: "manual-connect",
          mode: "connect-handshake"
        })
      );
      const mobileRecovery = await ensureMobileManualSyncQuestionTransfer(localQuestionsBeforeSync, result);
      const modeTextMap = {
        pull: "دریافت از ابر",
        update: "به روزرسانی ابر",
        merge: "ادغام دوطرفه",
        create: "ایجاد فایل ابری",
        same: "همگام و بدون تغییر",
        push: "ارسال محلی",
        handshake: "اتصال و دریافت"
      };
      const modeText = modeTextMap[result.mode] || "همگام سازی";
      const localAddedCount = Number(result?.localAddedCount) || 0;
      const cloudAddedCount = Number(result?.cloudAddedCount) || 0;
      const syncDetails = [];
      if (localAddedCount > 0) {
        syncDetails.push(`${localAddedCount} سوال جدید از ابر دریافت شد`);
      }
      if (cloudAddedCount > 0) {
        syncDetails.push(`${cloudAddedCount} سوال جدید به ابر ارسال شد`);
      }
      if (mobileRecovery.applied) {
        syncDetails.push("بازیابی خودکار موبایل انجام شد");
      }
      const detailText = syncDetails.length ? ` | ${syncDetails.join(" • ")}` : "";
      const successMessage = `همگام سازی موفق بود (${modeText})${detailText}.`;
      setDriveAutoSyncEnabled(true);
      refreshSettingsOverview();
      showToast(successMessage, "success");
      setStatus(successMessage, "ok");
    } catch (error) {
      if (asText(error?.code, "").toLowerCase() === "auth_redirect_started") {
        const message = resolveDriveSyncFailureMessage(error, "در حال انتقال به ورود گوگل...");
        showToast(message, "info", 3200);
        setStatus(message, "info");
        return;
      }
      console.error(error);
      const message = resolveDriveSyncFailureMessage(error, "همگام سازی گوگل درایو انجام نشد.");
      showToast(message, "error");
      setStatus(message, "error");
    } finally {
      setSyncButtonLoading(false);
    }
  }

  async function syncQuestionBankWithGoogleDrive(options = {}) {
    const settings = typeof options === "string" ? { source: options } : options;
    return withDriveSyncLock("manual-sync", async () =>
      performDriveSyncCycle({
        interactive: settings.interactive !== false,
        source: asText(settings.source, "manual-sync"),
        mode: asText(settings.mode, "manual-sync")
      })
    );
  }

  function getLocalQuestionCountForSync() {
    return Math.max(0, Number(countSyncEntities(state.subjects).questions) || 0);
  }

  function resolveSyncResultQuestionCount(result, key) {
    if (!result || typeof result !== "object") {
      return 0;
    }
    return Math.max(0, Number(result[key]) || 0);
  }

  function resolveExpectedMinQuestionsAfterManualSync(localBeforeQuestions, result) {
    const localBase = Math.max(0, Number(localBeforeQuestions) || 0);
    const localAdded = Math.max(0, Number(result?.localAddedCount) || 0);
    const mergedQuestions = Math.max(0, Number(state.sync.lastMergeResult?.questions) || 0);
    const resultMerged = resolveSyncResultQuestionCount(result, "mergedQuestionCount");
    const resultRemote = resolveSyncResultQuestionCount(result, "remoteQuestionCount");
    const resultExpected = resolveSyncResultQuestionCount(result, "expectedMinQuestionCount");
    return Math.max(localBase, localBase + localAdded, mergedQuestions, resultMerged, resultRemote, resultExpected);
  }

  async function ensureMobileManualSyncQuestionTransfer(localBeforeQuestions, primaryResult) {
    if (!isMobileViewportActive()) {
      return { attempted: false, applied: false, finalQuestions: getLocalQuestionCountForSync(), expectedMin: 0 };
    }

    const expectedMin = resolveExpectedMinQuestionsAfterManualSync(localBeforeQuestions, primaryResult);
    const currentQuestions = getLocalQuestionCountForSync();
    if (expectedMin <= 0 || currentQuestions >= expectedMin) {
      return { attempted: false, applied: false, finalQuestions: currentQuestions, expectedMin };
    }

    syncDebugLog("sync:mobile-recovery-start", `current=${currentQuestions} expectedMin=${expectedMin}`, { level: "warn" });
    setStatus("در حال پایدارسازی همگام سازی موبایل و بازیابی کامل سوالات...");
    await ensureDriveInteractiveAuthForManualSync();

    let finalQuestions = currentQuestions;
    let recoveryAttempts = 0;
    let richerAttempted = false;
    let lastRecoveryResult = null;

    while (finalQuestions < expectedMin && recoveryAttempts < 2) {
      recoveryAttempts += 1;
      const recoverySource = recoveryAttempts === 1 ? "manual-mobile-recovery" : "manual-mobile-recovery-retry";
      lastRecoveryResult = await withDriveSyncLock(recoverySource, async () =>
        performDriveSyncCycle({
          interactive: true,
          source: recoverySource,
          mode: "pull-only"
        })
      );
      finalQuestions = Math.max(
        getLocalQuestionCountForSync(),
        resolveSyncResultQuestionCount(lastRecoveryResult, "localQuestionCount"),
        resolveSyncResultQuestionCount(lastRecoveryResult, "mergedQuestionCount")
      );

      if (finalQuestions >= expectedMin) {
        break;
      }

      const currentFileId = asText(readDriveConfig().fileId || state.sync.remote.fileId, "").trim();
      const richerCandidate = await findRicherDriveSyncFileCandidate(currentFileId, DRIVE_SYNC_FILENAME, {
        interactive: true,
        currentQuestions: finalQuestions
      });
      const richerFileId = asText(richerCandidate?.file?.id, "").trim();
      if (richerFileId && richerFileId !== currentFileId) {
        richerAttempted = true;
        syncDebugLog("sync:mobile-recovery-richer", `from=${currentFileId || "-"} to=${richerFileId}`, { level: "warn" });
        lastRecoveryResult = await withDriveSyncLock("manual-mobile-recovery-richer", async () =>
          performDriveSyncCycle({
            interactive: true,
            source: "manual-mobile-recovery-richer",
            mode: "pull-only",
            forcedFileId: richerFileId
          })
        );
        finalQuestions = Math.max(
          getLocalQuestionCountForSync(),
          resolveSyncResultQuestionCount(lastRecoveryResult, "localQuestionCount"),
          resolveSyncResultQuestionCount(lastRecoveryResult, "mergedQuestionCount")
        );
      }

      if (finalQuestions < expectedMin && recoveryAttempts < 2) {
        await wait(420 * recoveryAttempts);
      }
    }

    if (finalQuestions < expectedMin) {
      const fallbackRemote = Math.max(
        resolveSyncResultQuestionCount(primaryResult, "remoteQuestionCount"),
        resolveSyncResultQuestionCount(lastRecoveryResult, "remoteQuestionCount")
      );
      throw new Error(
        `همگام سازی موبایل کامل نشد: تعداد سوالات ${finalQuestions} است ولی حداقل مورد انتظار ${expectedMin} می‌باشد.` +
          (fallbackRemote > 0 ? ` تعداد سوالات فایل ابری: ${fallbackRemote}.` : "")
      );
    }

    syncDebugLog(
      "sync:mobile-recovery-done",
      `final=${finalQuestions} expectedMin=${expectedMin} attempts=${recoveryAttempts}${richerAttempted ? " richer=1" : ""}`
    );
    queueRenderAfterDriveScrollIdle();
    return { attempted: true, applied: true, finalQuestions, expectedMin, attempts: recoveryAttempts };
  }

  async function fetchDriveJsonById(fileId, options = {}) {
    const safeFileId = asText(fileId, "").trim();
    if (!safeFileId) {
      throw new Error("شناسه فایل ابری معتبر نیست.");
    }
    syncDebugLog("download:request", `fileId=${safeFileId}`);
    const response = await fetchDriveWithAuth(
      `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(safeFileId)}?alt=media`,
      { method: "GET" },
      { interactive: options.interactive !== false }
    );

    if (!response.ok) {
      throw new Error(`Drive download failed (${response.status})`);
    }
    const payload = await response.json();
    syncDebugLog("download:ok", `fileId=${safeFileId}`);
    return payload;
  }

  async function fetchDriveFileMetadataById(fileId, options = {}) {
    const safeFileId = asText(fileId, "").trim();
    if (!safeFileId) {
      return null;
    }
    const params = new URLSearchParams({
      fields: "id,name,modifiedTime,md5Checksum,size,appProperties"
    });
    const response = await fetchDriveWithAuth(
      `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(safeFileId)}?${params.toString()}`,
      { method: "GET" },
      { interactive: options.interactive !== false, retryAuth: options.retryAuth !== false }
    );
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error(`Drive metadata lookup failed (${response.status})`);
    }
    const payload = await response.json();
    return payload && typeof payload === "object" ? payload : null;
  }

  function escapeDriveQueryValue(value) {
    return asText(value, "").replace(/\\/g, "\\\\").replace(/'/g, "\\'");
  }

  function dedupeDriveFileCandidates(files) {
    const source = Array.isArray(files) ? files : [];
    const map = new Map();
    source.forEach((file) => {
      const id = asText(file?.id, "").trim();
      if (!id || map.has(id)) {
        return;
      }
      map.set(id, file);
    });
    return Array.from(map.values());
  }

  function sortDriveFileCandidates(files) {
    return dedupeDriveFileCandidates(files).sort((a, b) => {
      const aTagged = asText(a?.appProperties?.uqbSyncKey, "").trim() === "question-bank-v2";
      const bTagged = asText(b?.appProperties?.uqbSyncKey, "").trim() === "question-bank-v2";
      if (aTagged !== bTagged) {
        return aTagged ? -1 : 1;
      }
      const aModified = parseSyncTimestampMs(a?.modifiedTime);
      const bModified = parseSyncTimestampMs(b?.modifiedTime);
      return bModified - aModified;
    });
  }

  async function findDriveJsonFileCandidatesByName(fileName, options = {}) {
    const primaryName = asText(fileName, DRIVE_SYNC_FILENAME).trim() || DRIVE_SYNC_FILENAME;
    const legacyNames = Array.isArray(options.legacyNames) ? options.legacyNames : [];
    const namePool = [primaryName, ...legacyNames]
      .map((name) => asText(name, "").trim())
      .filter((name, index, arr) => !!name && arr.indexOf(name) === index);
    const nameClause = namePool.map((name) => `name='${escapeDriveQueryValue(name)}'`).join(" or ");
    const taggedQuery =
      `trashed=false and mimeType='application/json' and (` +
      `appProperties has { key='uqbSyncKey' and value='question-bank-v2' }` +
      (nameClause ? ` or ${nameClause}` : "") +
      `)`;
    const nameOnlyQuery = nameClause ? `trashed=false and mimeType='application/json' and (${nameClause})` : "";
    const buildSearchParams = (query) =>
      new URLSearchParams({
        q: query,
        orderBy: "modifiedTime desc",
        pageSize: "30",
        fields: "files(id,name,modifiedTime,md5Checksum,size,appProperties)"
      });

    const searchSpaces = (Array.isArray(options.searchSpaces) && options.searchSpaces.length
      ? options.searchSpaces
      : DRIVE_FILE_SEARCH_SPACES
    )
      .map((space) => asText(space, "").trim())
      .filter((space, index, arr) => arr.indexOf(space) === index);

    const interactive = options.interactive !== false;
    const mergedFiles = [];
    let successCount = 0;

    for (const space of searchSpaces) {
      const runSearch = async (queryText) => {
        const params = buildSearchParams(queryText);
        if (space) {
          params.set("spaces", space);
        }
        const url = `https://www.googleapis.com/drive/v3/files?${params.toString()}`;
        const response = await fetchDriveWithAuth(url, { method: "GET" }, { interactive });
        if (!response.ok) {
          return { ok: false, status: response.status, files: [] };
        }
        const payload = await response.json();
        return {
          ok: true,
          status: response.status,
          files: Array.isArray(payload?.files) ? payload.files : []
        };
      };

      syncDebugLog("file:search", `${space || "all"} | ${taggedQuery}`);
      let result = await runSearch(taggedQuery);
      if (!result.ok && result.status === 400 && nameOnlyQuery) {
        syncDebugLog("file:search-fallback", `${space || "all"} | ${nameOnlyQuery}`, { level: "warn" });
        result = await runSearch(nameOnlyQuery);
      }

      if (!result.ok) {
        syncDebugLog("file:search-space-failed", `${space || "all"} status=${result.status}`, { level: "warn" });
        continue;
      }

      successCount += 1;
      mergedFiles.push(...result.files);
    }

    if (!successCount) {
      throw new Error("Drive file lookup failed (no searchable space).");
    }

    const files = sortDriveFileCandidates(mergedFiles);
    if (!files.length) {
      return [];
    }

    const exactNamed = files.filter((file) => asText(file?.name, "").trim() === primaryName);
    return exactNamed.length ? sortDriveFileCandidates(exactNamed) : files;
  }

  async function pickBestDriveSyncFileCandidate(files, options = {}) {
    const candidates = sortDriveFileCandidates(files);
    if (!candidates.length) {
      return { file: null, stats: null, candidates: 0 };
    }

    const maxCandidates = clampNumber(options.maxCandidates, 1, 12, 6);
    const scanList = candidates.slice(0, maxCandidates);
    let bestFile = scanList[0];
    let bestStats = null;
    let bestScore = Number.NEGATIVE_INFINITY;

    for (const file of scanList) {
      const fileId = asText(file?.id, "").trim();
      if (!fileId) {
        continue;
      }
      const tagged = asText(file?.appProperties?.uqbSyncKey, "").trim() === "question-bank-v2";
      const modifiedScore = parseSyncTimestampMs(file?.modifiedTime);
      let stats = null;
      let questionScore = -1;

      try {
        const payload = await fetchDriveJsonById(fileId, { interactive: options.interactive !== false });
        const normalized = normalizeSyncEnvelopePayload(payload);
        stats = countSyncEntities(normalized.subjects);
        questionScore = Math.max(0, Number(stats?.questions) || 0);
      } catch (error) {
        syncDebugLog("file:candidate-read-failed", `id=${fileId} ${asText(error?.message, "failed")}`, { level: "warn" });
      }

      const score = questionScore * 1e12 + (tagged ? 1e9 : 0) + modifiedScore;
      if (score > bestScore) {
        bestScore = score;
        bestFile = file;
        bestStats = stats;
      }
    }

    return {
      file: bestFile,
      stats: bestStats,
      candidates: candidates.length
    };
  }

  async function findDriveJsonFileByName(fileName, options = {}) {
    const candidates = await findDriveJsonFileCandidatesByName(fileName, options);
    return candidates.length ? candidates[0] : null;
  }

  async function findDriveJsonFileCandidatesBroad(options = {}) {
    const interactive = options.interactive !== false;
    const preferredNames = new Set(
      [DRIVE_SYNC_FILENAME, "question_bank.json", "subjects.json"]
        .map((name) => asText(name, "").trim())
        .filter(Boolean)
    );
    const searchSpaces = DRIVE_FILE_SEARCH_SPACES
      .map((space) => asText(space, "").trim())
      .filter((space, index, arr) => arr.indexOf(space) === index);
    const mergedFiles = [];
    let successCount = 0;

    for (const space of searchSpaces) {
      const params = new URLSearchParams({
        q: "trashed=false and mimeType='application/json'",
        orderBy: "modifiedTime desc",
        pageSize: "40",
        fields: "files(id,name,modifiedTime,md5Checksum,size,appProperties)"
      });
      if (space) {
        params.set("spaces", space);
      }
      const url = `https://www.googleapis.com/drive/v3/files?${params.toString()}`;
      syncDebugLog("file:search-broad", space || "all");
      const response = await fetchDriveWithAuth(url, { method: "GET" }, { interactive });
      if (!response.ok) {
        syncDebugLog("file:search-broad-failed", `${space || "all"} status=${response.status}`, { level: "warn" });
        continue;
      }
      const payload = await response.json();
      mergedFiles.push(...(Array.isArray(payload?.files) ? payload.files : []));
      successCount += 1;
    }

    if (!successCount) {
      return [];
    }

    const files = sortDriveFileCandidates(mergedFiles);
    const preferred = files.filter((file) => {
      const tagged = asText(file?.appProperties?.uqbSyncKey, "").trim() === "question-bank-v2";
      const named = preferredNames.has(asText(file?.name, "").trim());
      return tagged || named;
    });
    return preferred.length ? preferred : files;
  }

  async function findRicherDriveSyncFileCandidate(currentFileId, fileName, options = {}) {
    const safeCurrentId = asText(currentFileId, "").trim();
    const currentQuestions = Math.max(0, Number(options.currentQuestions) || 0);
    const interactive = options.interactive !== false;
    const legacyNames = [DRIVE_SYNC_FILENAME, "question_bank.json", "subjects.json"];
    let byNameCandidates = [];
    try {
      byNameCandidates = await findDriveJsonFileCandidatesByName(fileName, { interactive, legacyNames });
    } catch (error) {
      syncDebugLog("file:richer-search-name-failed", asText(error?.message, "failed"), { level: "warn" });
    }

    let candidatePool = dedupeDriveFileCandidates(byNameCandidates);
    if (!candidatePool.length || currentQuestions <= 0) {
      let broadCandidates = [];
      try {
        broadCandidates = await findDriveJsonFileCandidatesBroad({ interactive });
      } catch (error) {
        syncDebugLog("file:richer-search-broad-failed", asText(error?.message, "failed"), { level: "warn" });
      }
      candidatePool = dedupeDriveFileCandidates([...candidatePool, ...broadCandidates]);
    }

    const filteredCandidates = candidatePool.filter((file) => {
      const fileId = asText(file?.id, "").trim();
      return !!fileId && fileId !== safeCurrentId;
    });
    if (!filteredCandidates.length) {
      return null;
    }

    const best = await pickBestDriveSyncFileCandidate(filteredCandidates, {
      interactive,
      maxCandidates: 24
    });
    const bestFileId = asText(best?.file?.id, "").trim();
    const bestQuestionCount = Math.max(0, Number(best?.stats?.questions) || 0);
    if (!bestFileId || bestQuestionCount <= currentQuestions) {
      return null;
    }
    return {
      ...best,
      questionCount: bestQuestionCount
    };
  }

  async function uploadDriveJsonContent(jsonPayload, fileName, fileId = "", options = {}) {
    const createInAppData = options.createInAppData !== false;
    const metadata = {
      name: asText(fileName, DRIVE_SYNC_FILENAME).trim() || DRIVE_SYNC_FILENAME,
      mimeType: "application/json",
      appProperties: {
        uqbSyncKey: "question-bank-v2",
        uqbSchemaVersion: String(SYNC_SCHEMA_VERSION)
      }
    };
    const isUpdate = !!fileId;
    if (!isUpdate && createInAppData) {
      metadata.parents = ["appDataFolder"];
    }
    const boundary = `sync_${Date.now()}`;
    const multipartBody = buildDriveMultipartBody(metadata, jsonPayload, boundary);
    const endpoint = isUpdate
      ? `https://www.googleapis.com/upload/drive/v3/files/${encodeURIComponent(fileId)}?uploadType=multipart`
      : "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";

    syncDebugLog(
      "upload:start",
      `${isUpdate ? "patch" : "create"} -> ${metadata.name}${!isUpdate && createInAppData ? " @appDataFolder" : ""}`
    );
    const response = await fetchDriveWithAuth(
      endpoint,
      {
        method: isUpdate ? "PATCH" : "POST",
        headers: {
          "Content-Type": `multipart/related; boundary=${boundary}`
        },
        body: multipartBody
      },
      { interactive: options.interactive !== false }
    );

    if (!response.ok) {
      if (!isUpdate && createInAppData && [400, 403].includes(response.status)) {
        syncDebugLog(
          "upload:create-appdata-fallback",
          `status=${response.status} retrying without appDataFolder`,
          { level: "warn" }
        );
        return uploadDriveJsonContent(jsonPayload, fileName, fileId, {
          ...options,
          createInAppData: false
        });
      }
      throw new Error(`Drive sync upload failed (${response.status})`);
    }

    const payload = await response.json();
    syncDebugLog("upload:ok", `fileId=${asText(payload?.id, fileId || "")}`);
    return payload;
  }

  function buildDriveMultipartBody(metadata, payload, boundary) {
    return (
      `--${boundary}\r\n` +
      "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
      `${JSON.stringify(metadata)}\r\n` +
      `--${boundary}\r\n` +
      "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
      `${payload}\r\n` +
      `--${boundary}--`
    );
  }

  function hasUnsavedDriveCredentials() {
    const stored = readDriveConfig();
    const local = readDriveConfigFromInputs();
    return stored.clientId !== local.clientId;
  }

  function saveDriveFileId(fileId) {
    const safeId = asText(fileId, "").trim();
    if (!safeId) {
      return;
    }

    const nextConfig = normalizeDriveConfig({ ...readDriveConfig(), fileId: safeId });
    persistDriveConfig(nextConfig);
    restoreDriveConfig();
  }

  function setSyncButtonLoading(isLoading) {
    const driveButton = document.getElementById("driveSyncBtn");
    const profileButton = document.getElementById("profileQuickSyncBtn");
    const buttons = [driveButton, profileButton].filter((item) => item instanceof HTMLButtonElement);
    buttons.forEach((button) => {
      button.disabled = isLoading;
      button.classList.toggle("is-loading", isLoading);
    });

    if (driveButton instanceof HTMLButtonElement) {
      const label = driveButton.querySelector(".sync-label");
      if (label) {
        label.textContent = isLoading ? "در حال همگام سازی..." : "همگام سازی با گوگل درایو";
      }
    }

    if (profileButton instanceof HTMLButtonElement) {
      const quickLabel = profileButton.querySelector(".profile-quick-sync-label");
      if (quickLabel instanceof HTMLElement) {
        quickLabel.textContent = isLoading ? "در حال همگام سازی..." : "همگام سازی گوگل درایو";
      }
    }

    if (!isLoading) {
      updateDriveActionButtons();
    }
    updateProfileQuickSyncShortcut();
    updateHeaderSyncPill();
  }

  function showToast(message, kind = "info", timeout = 3600) {
    if (!refs.toastStack) {
      return;
    }

    const toast = document.createElement("article");
    toast.className = `toast-item toast-${kind}`;
    toast.textContent = asText(message, "");
    refs.toastStack.append(toast);

    requestAnimationFrame(() => {
      toast.classList.add("is-visible");
    });

    window.setTimeout(() => {
      toast.classList.remove("is-visible");
      window.setTimeout(() => {
        toast.remove();
      }, 220);
    }, timeout);
  }

  function showActionToast(message, actionLabel, onAction, options = {}) {
    if (!refs.toastStack) {
      return;
    }

    const kind = asText(options.kind, "info");
    const timeout = Math.max(1400, Number.parseInt(asText(options.timeout, "5200"), 10) || 5200);
    const toast = document.createElement("article");
    toast.className = `toast-item toast-${kind} toast-item-action`;

    const text = document.createElement("span");
    text.className = "toast-text";
    text.textContent = asText(message, "");

    const action = document.createElement("button");
    action.type = "button";
    action.className = "toast-action-btn";
    action.textContent = asText(actionLabel, "انجام");

    let closed = false;
    let removeTimerId = 0;
    const dispose = () => {
      if (closed) {
        return;
      }
      closed = true;
      toast.classList.remove("is-visible");
      if (removeTimerId) {
        window.clearTimeout(removeTimerId);
      }
      removeTimerId = window.setTimeout(() => {
        toast.remove();
      }, 220);
    };

    action.addEventListener("click", () => {
      if (closed) {
        return;
      }
      try {
        if (typeof onAction === "function") {
          onAction();
        }
      } catch (error) {
        console.error(error);
      } finally {
        dispose();
      }
    });

    toast.append(text, action);
    refs.toastStack.append(toast);

    requestAnimationFrame(() => {
      toast.classList.add("is-visible");
    });

    window.setTimeout(() => {
      dispose();
    }, timeout);
  }

  function initPremiumEnhancements() {
    setupHeaderChrome();
    setupSettingsPanel();
    setupSettingsUtilities();
    setupSchemaGuideModal();
    setupUserProfileCard();
    setupLocalJsonTransfer();
  }

  function setupHeaderChrome() {
    syncHeaderLiftState();

    const requestHeaderLiftSync = () => {
      if (headerLiftRafId) {
        return;
      }
      headerLiftRafId = window.requestAnimationFrame(() => {
        headerLiftRafId = 0;
        syncHeaderLiftState();
      });
    };

    window.addEventListener(
      "scroll",
      () => {
        requestHeaderLiftSync();
      },
      { passive: true }
    );

    document.addEventListener("click", (event) => {
      if (!isHeaderTransientUiOpen()) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const insideOverflowMenu = refs.headerOverflowMenu instanceof HTMLElement && refs.headerOverflowMenu.contains(target);
      const insideOverflowToggle =
        refs.headerOverflowToggle instanceof HTMLElement && refs.headerOverflowToggle.contains(target);
      const insideSectionsSheet = refs.headerSectionsSheet instanceof HTMLElement && refs.headerSectionsSheet.contains(target);
      const insideSectionsToggle =
        refs.headerSectionsToggle instanceof HTMLElement && refs.headerSectionsToggle.contains(target);

      if (insideOverflowMenu || insideOverflowToggle || insideSectionsSheet || insideSectionsToggle) {
        return;
      }

      closeHeaderTransientUi();
    });
  }

  function syncHeaderLiftState() {
    if (!(refs.headerRoot instanceof HTMLElement)) {
      return;
    }
    refs.headerRoot.classList.toggle("is-lifted", window.scrollY > 8);
  }

  function isHeaderTransientUiOpen() {
    const overflowOpen = refs.headerOverflowMenu instanceof HTMLElement && refs.headerOverflowMenu.classList.contains("is-open");
    const sheetOpen = refs.headerSectionsSheet instanceof HTMLElement && refs.headerSectionsSheet.classList.contains("is-open");
    return overflowOpen || sheetOpen;
  }

  function closeHeaderTransientUi() {
    setHeaderOverflowMenuOpen(false);
    setHeaderSectionsSheetOpen(false);
  }

  function setHeaderOverflowMenuOpen(isOpen) {
    if (!(refs.headerOverflowMenu instanceof HTMLElement) || !(refs.headerOverflowToggle instanceof HTMLButtonElement)) {
      return;
    }

    refs.headerOverflowMenu.hidden = !isOpen;
    refs.headerOverflowMenu.classList.toggle("is-open", isOpen);
    refs.headerOverflowToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");

    if (isOpen) {
      const firstItem = refs.headerOverflowMenu.querySelector(".appbar-overflow-item");
      if (firstItem instanceof HTMLButtonElement) {
        window.requestAnimationFrame(() => {
          firstItem.focus();
        });
      }
      return;
    }

    if (document.activeElement instanceof Element && refs.headerOverflowMenu.contains(document.activeElement)) {
      refs.headerOverflowToggle.focus();
    }
  }

  function toggleHeaderOverflowMenu() {
    if (!(refs.headerOverflowMenu instanceof HTMLElement)) {
      return;
    }

    const nextOpen = !refs.headerOverflowMenu.classList.contains("is-open");
    if (nextOpen) {
      setSettingsPanelOpen(false);
      setHeaderSectionsSheetOpen(false);
    }
    setHeaderOverflowMenuOpen(nextOpen);
  }

  function setHeaderSectionsSheetOpen(isOpen) {
    if (!(refs.headerSectionsSheet instanceof HTMLElement) || !(refs.headerSectionsToggle instanceof HTMLButtonElement)) {
      return;
    }

    refs.headerSectionsSheet.hidden = !isOpen;
    refs.headerSectionsSheet.classList.toggle("is-open", isOpen);
    refs.headerSectionsSheet.setAttribute("aria-hidden", isOpen ? "false" : "true");
    refs.headerSectionsToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    document.body.classList.toggle("header-sheet-open", isOpen);

    if (isOpen) {
      const firstItem = refs.headerSectionsSheet.querySelector(".appbar-sections-item");
      if (firstItem instanceof HTMLButtonElement) {
        window.requestAnimationFrame(() => {
          firstItem.focus();
        });
      }
      return;
    }

    if (document.activeElement instanceof Element && refs.headerSectionsSheet.contains(document.activeElement)) {
      refs.headerSectionsToggle.focus();
    }
  }

  function toggleHeaderSectionsSheet() {
    if (!(refs.headerSectionsSheet instanceof HTMLElement)) {
      return;
    }

    const nextOpen = !refs.headerSectionsSheet.classList.contains("is-open");
    if (nextOpen) {
      setSettingsPanelOpen(false);
      setHeaderOverflowMenuOpen(false);
    }
    setHeaderSectionsSheetOpen(nextOpen);
  }

  function handleHeaderBackNavigation() {
    closeHeaderTransientUi();

    if (state.view.level <= 1) {
      return;
    }

    if (state.view.level === 3) {
      state.view.level = 2;
      state.view.chapterId = null;
      state.view.tab = "bank";
      state.pagination.page = 1;
      render();
      return;
    }

    if (state.view.level === 2) {
      state.view.level = 1;
      state.view.subjectId = null;
      state.view.chapterId = null;
      state.view.tab = "bank";
      state.pagination.page = 1;
      render();
      return;
    }

    return;
  }

  function focusPrimarySearchField() {
    closeHeaderTransientUi();

    const focusSearch = (selector) => {
      const field = document.querySelector(selector);
      if (!(field instanceof HTMLInputElement)) {
        return false;
      }
      field.focus();
      field.select();
      return true;
    };

    if (state.view.level !== 3) {
      setStatus("جستجو در صفحه بانک سوالات فعال می‌شود.");
      return;
    }

    if (state.view.tab === "chapter-map") {
      if (focusSearch(".chapter-map-search")) {
        return;
      }
      window.requestAnimationFrame(() => {
        focusSearch(".chapter-map-search");
      });
      return;
    }

    if (state.view.tab !== "bank") {
      state.view.tab = "bank";
      state.pagination.page = 1;
      render();
      window.requestAnimationFrame(() => {
        focusSearch(".qb-search-input");
      });
      return;
    }

    if (!focusSearch(".qb-search-input")) {
      window.requestAnimationFrame(() => {
        focusSearch(".qb-search-input");
      });
    }
  }

  function setupSchemaGuideModal() {
    renderSchemaCodeExample();
    closeSchemaModal({ immediate: true });
  }

  function openSchemaModal() {
    const modal = document.getElementById("schemaModal");
    const trigger = document.getElementById("jsonSchemaInfoBtn");
    if (!(modal instanceof HTMLElement)) {
      return;
    }

    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    if (trigger instanceof HTMLButtonElement) {
      trigger.setAttribute("aria-expanded", "true");
    }

    requestAnimationFrame(() => {
      modal.classList.add("is-open");
    });
  }

  function closeSchemaModal(options = {}) {
    const modal = document.getElementById("schemaModal");
    const trigger = document.getElementById("jsonSchemaInfoBtn");
    if (!(modal instanceof HTMLElement)) {
      return;
    }

    const immediate = !!options.immediate;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    if (trigger instanceof HTMLButtonElement) {
      trigger.setAttribute("aria-expanded", "false");
    }

    if (immediate) {
      modal.hidden = true;
      return;
    }

    window.setTimeout(() => {
      if (!modal.classList.contains("is-open")) {
        modal.hidden = true;
      }
    }, 180);
  }

  function renderSchemaCodeExample() {
    const code = document.getElementById("schemaCodeBlock");
    if (!(code instanceof HTMLElement)) {
      return;
    }

    const exactRowObject = {
      subject: "ریاضی",
      chapter: "حد و پیوستگی",
      topic: "حدهای مثلثاتی",
      method: "جایگذاری",
      difficulty: 3,
      question_text: "با توجه به شکل، حد lim(x->0) sin(x)/x را محاسبه کنید. [[img:1]]",
      hint: "از حد معروف مثلثاتی استفاده کن.",
      step_by_step_solution: "طبق حد پایه سینوس، نتیجه برابر 1 است.",
      assets: [
        {
          type: "image",
          mode: "pdf-crop",
          page: 1,
          bbox: [0.11, 0.28, 0.88, 0.62],
          bbox_unit: "ratio"
        }
      ],
      solved: false,
      needsReview: true
    };

    const exactRowArray = [exactRowObject];
    const exactQuestionsObject = {
      questions: [exactRowObject]
    };
    const exactSubjectsTree = {
      subjects: [
        {
          name: "ریاضی",
          chapters: [
            {
              name: "حد و پیوستگی",
              questions: [
                {
                  topic: "حدهای مثلثاتی",
                  method: "جایگذاری",
                  difficulty: 3,
                  question_text: "با توجه به شکل، حد lim(x->0) sin(x)/x را محاسبه کنید. [[img:1]]",
                  hint: "از حد معروف مثلثاتی استفاده کن.",
                  step_by_step_solution: "طبق حد پایه سینوس، نتیجه برابر 1 است.",
                  assets: [
                    {
                      type: "image",
                      mode: "pdf-crop",
                      page: 1,
                      bbox: [0.11, 0.28, 0.88, 0.62],
                      bbox_unit: "ratio"
                    }
                  ],
                  solved: false,
                  needsReview: true
                }
              ]
            }
          ]
        }
      ]
    };
    const exactChapterTreeOnly = {
      type: "chapter-tree",
      trees: [
        {
          subject: "ریاضی",
          chapter: "حد و پیوستگی",
          tree: [
            {
              name: "مفهوم حد",
              children: [
                { name: "حد راست و چپ", children: [] },
                { name: "وجود حد", children: [] }
              ]
            },
            { name: "حدهای مثلثاتی", children: [] }
          ]
        }
      ]
    };
    const exactExportEnvelope = {
      format: "question-bank-export-v3",
      exportedAt: "2026-03-02T12:00:00.000Z",
      subjects: exactSubjectsTree.subjects,
      chapterTreePayload: exactChapterTreeOnly
    };

    const canonicalTreeJson = JSON.stringify(exactSubjectsTree, null, 2);
    const chapterTreeOnlyJson = JSON.stringify(exactChapterTreeOnly, null, 2);
    const exportEnvelopeJson = JSON.stringify(exactExportEnvelope, null, 2);
    const rowArrayJson = JSON.stringify(exactRowArray, null, 2);
    const questionsObjectJson = JSON.stringify(exactQuestionsObject, null, 2);
    const singleRowJson = JSON.stringify(exactRowObject, null, 2);
    const aiPromptTemplate = getAiJsonExtractorPromptTemplate();

    code.textContent = questionsObjectJson;

    const notes = document.getElementById("schemaGuideNotes");
    if (notes instanceof HTMLElement) {
      notes.innerHTML = [
        '<section class="schema-ai-prompt-card" aria-label="پرامپت پیشنهادی هوش مصنوعی">',
        '<div class="schema-ai-prompt-head">',
        "<strong>پرامپت آماده برای استخراج سوال / نمودار درختی</strong>",
        '<button class="schema-ai-prompt-copy" type="button" data-action="copy-ai-json-prompt">کپی سریع پرامپت</button>',
        "</div>",
        '<p class="schema-ai-prompt-note">این متن را مستقیم به AI بده؛ حالت سوال یا درختی را مشخص کن و خروجی JSON را بدون ویرایش بچسبان.</p>',
        `<pre class="schema-ai-prompt-code" dir="ltr">${escapeHtmlText(aiPromptTemplate)}</pre>`,
        "</section>",
        '<ul class="schema-guide-list">',
        "<li><strong>فرمت پیشنهادی (سریع‌ترین):</strong> ریشه خروجی را روی <code>{\"questions\":[...]}</code> بگذار.</li>",
        "<li><strong>ریشه‌های معتبر:</strong> <code>{\"questions\":[...]}</code> یا <code>[...]</code> یا <code>{\"subjects\":[...]}</code> یا یک سوال تکی <code>{...}</code>.</li>",
        "<li><strong>خروجی برنامه:</strong> فایل خروجی استاندارد شامل <code>subjects</code> (داده سوالات) و <code>chapterTreePayload</code> (نسخه مستقل نمودار درختی) است.</li>",
        "<li><strong>قانون JSON:</strong> فقط کوتیشن دوتایی <code>\" \"</code>، بدون کامنت، بدون trailing comma، بدون <code>undefined</code>/<code>NaN</code>/<code>Infinity</code>.</li>",
        "<li><strong>فیلدهای لازم:</strong> حداقل <code>question_text</code> (یا <code>question</code>)؛ خارج از فصل فعال، <code>subject</code> و <code>chapter</code> هم لازم است.</li>",
        "<li><strong>تصویر داخل سوال (روش 3):</strong> در متن از <code>[[img:1]]</code> استفاده کن و در <code>assets</code> آیتم <code>{\"type\":\"image\",\"mode\":\"pdf-crop\",\"page\":1,\"bbox\":[x1,y1,x2,y2],\"bbox_unit\":\"ratio\"}</code> بگذار. فایل مرجع می‌تواند PDF یا PNG/JPEG باشد.</li>",
        "<li><strong>نکته مهم:</strong> فرمول ریاضی تصویر نیست؛ فرمول‌ها را متنی (LaTeX) بنویس. اگر پاسخ در منبع وجود داشت همان پاسخ را حفظ کن.</li>",
        "<li><strong>واحد bbox:</strong> مقدار <code>bbox_unit</code> می‌تواند <code>ratio</code> یا <code>percent</code> یا <code>px</code> باشد.</li>",
        "<li><strong>داخل فصل فعال:</strong> همه سوال‌ها مستقیم به همان فصل اضافه می‌شوند و <code>subject/chapter</code> ورودی نادیده گرفته می‌شود.</li>",
        "<li><strong>ورود مستقل درختی:</strong> اگر فقط مایندمپ می‌خواهی، JSON جداگانه بده: <code>{\"type\":\"chapter-tree\",\"trees\":[{\"subject\":\"...\",\"chapter\":\"...\",\"tree\":[...]}]}</code>. این مسیر به سوالات کاری ندارد.</li>",
        "<li><strong>ادغام بدون تکرار:</strong> ورود فایل و متن هر دو Merge هستند و سوال تکراری (بر اساس متن سوال در همان فصل) دوباره اضافه نمی‌شود.</li>",
        "<li><strong>وضعیت پیش‌فرض مرور:</strong> تمام سوال‌های واردشده ابتدا روی <code>نیاز به مرور</code> قرار می‌گیرند (بعداً می‌توانی دستی تغییر بدهی).</li>",
        "<li><strong>Auto-Fix:</strong> خطاهای رایج JSON تا حد ممکن خودکار اصلاح می‌شوند، ولی خروجی تمیز همیشه بهتر است.</li>",
        "</ul>",
        '<details class="schema-guide-detail" open>',
        "<summary>نمونه پیشنهادی (برای AI): <code>{\"questions\":[...]}</code></summary>",
        `<pre class="schema-pre"><code dir="ltr">${escapeHtmlText(questionsObjectJson)}</code></pre>`,
        "</details>",
        '<details class="schema-guide-detail">',
        "<summary>نمونه ردیفی: <code>[...]</code></summary>",
        `<pre class="schema-pre"><code dir="ltr">${escapeHtmlText(rowArrayJson)}</code></pre>`,
        "</details>",
        '<details class="schema-guide-detail">',
        "<summary>نمونه درختی: <code>{\"subjects\":[...]}</code></summary>",
        `<pre class="schema-pre"><code dir="ltr">${escapeHtmlText(canonicalTreeJson)}</code></pre>`,
        "</details>",
        '<details class="schema-guide-detail">',
        "<summary>نمونه خروجی استاندارد برنامه: <code>{\"format\":\"question-bank-export-v3\",...}</code></summary>",
        `<pre class="schema-pre"><code dir="ltr">${escapeHtmlText(exportEnvelopeJson)}</code></pre>`,
        "</details>",
        '<details class="schema-guide-detail">',
        "<summary>نمونه مستقل درختی (بدون سوال): <code>{\"type\":\"chapter-tree\",\"trees\":[...]}</code></summary>",
        `<pre class="schema-pre"><code dir="ltr">${escapeHtmlText(chapterTreeOnlyJson)}</code></pre>`,
        "</details>",
        '<details class="schema-guide-detail">',
        "<summary>نمونه دقیق سوال تکی: <code>{...}</code></summary>",
        `<pre class="schema-pre"><code dir="ltr">${escapeHtmlText(singleRowJson)}</code></pre>`,
        "</details>"
      ].join("");
    }
  }

  function getAiJsonExtractorPromptTemplate() {
    return [
      "تو یک دستیار دقیق برای استخراج سوالات ریاضی و تولید نمودار درختی فصل‌ها هستی.",
      "خروجی باید فقط JSON معتبر باشد؛ هیچ متن اضافه، هیچ Markdown و هیچ code fence ننویس.",
      "",
      "مرحله شروع:",
      "1) اگر نام درس/فصل/موضوع داده نشده بود، فقط همین را بپرس: «لطفاً نام درس، نام فصل و موضوع سوالات را مشخص کن.»",
      "2) بعد از دریافت اطلاعات، فقط یکی از دو mode زیر را اجرا کن.",
      "",
      "mode ها (برای کاهش توکن خیلی مهم):",
      "1) mode=questions: فقط وقتی کاربر استخراج سوال می‌خواهد.",
      "2) mode=chapter-tree: فقط وقتی کاربر «فقط نمودار درختی/مایندمپ» می‌خواهد.",
      "3) در mode=questions هیچ tree تولید نکن.",
      "4) در mode=chapter-tree هیچ سوالی تولید نکن.",
      "",
      "قوانین مشترک:",
      "1) وفاداری کامل: متن سوال را بدون بازنویسی و بدون حدس کپی کن.",
      "2) فقط مواردی را استخراج کن که واقعاً در فایل دیده می‌شوند.",
      "3) ترتیب سوال‌ها باید دقیقاً مطابق فایل باشد.",
      "4) اگر چیزی نامشخص بود، مقدار «نامشخص» بگذار.",
      "5) اگر پاسخ/کلید پاسخ از قبل در منبع وجود دارد، همان پاسخ را بدون تغییر حفظ کن.",
      "6) اگر پاسخ آماده وجود ندارد، حل را کامل و دقیق انجام بده.",
      "7) step_by_step_solution باید کامل و مرحله‌به‌مرحله باشد.",
      "",
      "قوانین ریاضی و تصویر:",
      "1) فرمول ریاضی تصویر نیست؛ فرمول‌ها را متنی (LaTeX) بنویس.",
      "2) همه فرمول‌ها داخل $...$ باشند.",
      "3) [[img:n]] و assets فقط برای شکل/نمودار/جدول/تصویر واقعی باشند، نه فرمول.",
      "4) اگر شکل واقعی وجود دارد، مارکر [[img:1]] (یا [[img:2]] ...) را در question_text بگذار.",
      '5) برای هر شکل در assets آیتم بگذار: {"type":"image","mode":"pdf-crop","page":1,"bbox":[0.1,0.2,0.9,0.6],"bbox_unit":"ratio"}',
      "6) اگر شکل واقعی ندارد، assets حتماً [] باشد.",
      "7) منبع تصویر می‌تواند PDF یا PNG/JPEG باشد.",
      "",
      "خروجی mode=questions (فقط همین ریشه):",
      "{",
      '  "questions": [',
      "    {",
      '      "subject": "{{نام_درس}}",',
      '      "chapter": "{{نام_فصل}}",',
      '      "topic": "{{موضوع}}",',
      '      "method": "نامشخص",',
      '      "difficulty": 3,',
      '      "question_text": "متن کامل سوال",',
      '      "hint": "راهنمای کوتاه و مفید",',
      '      "step_by_step_solution": "راه‌حل کامل و مرحله‌به‌مرحله",',
      '      "assets": [],',
      '      "solved": false,',
      '      "needsReview": true',
      "    }",
      "  ]",
      "}",
      "",
      "خروجی mode=chapter-tree (فقط همین ریشه):",
      "{",
      '  "type": "chapter-tree",',
      '  "trees": [',
      "    {",
      '      "subject": "{{نام_درس}}",',
      '      "chapter": "{{نام_فصل}}",',
      '      "tree": [',
      '        {"name":"گره اصلی","children":[{"name":"زیرگره","children":[]}]}',
      "      ]",
      "    }",
      "  ]",
      "}",
      "",
      "قواعد chapter-tree:",
      "1) هر گره فقط name و children داشته باشد.",
      "2) برای فصل خالی، tree را دقیقاً [] بده.",
      "3) در این mode هیچ فیلد سوال تولید نکن.",
      "",
      "بررسی نهایی قبل از ارسال:",
      '1) اگر mode=questions => فقط {"questions":[...]}',
      '2) اگر mode=chapter-tree => فقط {"type":"chapter-tree","trees":[...]}'
    ].join("\n");
  }

  function setupSettingsPanel() {
    const panel = refs.settingsPanel;
    const toggleButton = refs.settingsPanelToggle;
    if (!(panel instanceof HTMLElement) || !(toggleButton instanceof HTMLButtonElement)) {
      return;
    }

    setSettingsPanelOpen(false);
    switchSettingsTab("appearance");

    document.addEventListener("click", (event) => {
      if (!panel.classList.contains("is-open")) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const settingsToggleAction = target.closest('[data-action="toggle-settings-panel"]');
      if (settingsToggleAction instanceof HTMLElement) {
        return;
      }

      if (panel.contains(target) || toggleButton.contains(target)) {
        return;
      }

      setSettingsPanelOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeSchemaModal();
        closeHeaderTransientUi();
        setSettingsPanelOpen(false);
      }
    });
  }

  function toggleSettingsPanel() {
    const panel = refs.settingsPanel;
    if (!(panel instanceof HTMLElement)) {
      return;
    }
    setSettingsPanelOpen(!panel.classList.contains("is-open"));
  }

  function setSettingsPanelOpen(isOpen) {
    const panel = refs.settingsPanel;
    const toggleButton = refs.settingsPanelToggle;
    if (!(panel instanceof HTMLElement) || !(toggleButton instanceof HTMLButtonElement)) {
      return;
    }

    panel.classList.toggle("is-open", isOpen);
    panel.setAttribute("aria-hidden", isOpen ? "false" : "true");
    toggleButton.setAttribute("aria-expanded", isOpen ? "true" : "false");

    if (isOpen) {
      refreshSettingsOverview();
    }
    syncStandaloneScrollTopVisibility();
  }

  function switchSettingsTab(tabName) {
    const panel = refs.settingsPanel;
    if (!(panel instanceof HTMLElement)) {
      return;
    }

    const safe = asText(tabName, "appearance");
    const allowedTabs = new Set(["appearance", "cloud-sync", "advanced"]);
    const nextTab = allowedTabs.has(safe) ? safe : "appearance";

    const tabButtons = panel.querySelectorAll(".settings-tab-btn");
    const tabPanels = panel.querySelectorAll(".settings-tab-panel");

    tabButtons.forEach((button) => {
      const isActive = button instanceof HTMLElement && button.dataset.tab === nextTab;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    tabPanels.forEach((section) => {
      const isActive = section instanceof HTMLElement && section.dataset.tabPanel === nextTab;
      section.classList.toggle("is-active", isActive);
    });

    if (nextTab === "cloud-sync") {
      scheduleDriveSyncDiagnosticsRender({ force: true });
    }
  }

  function setupSettingsUtilities() {
    refreshSettingsOverview();
  }

  function refreshSettingsOverview() {
    const dataOverview = document.getElementById("settingsOverviewData");
    const appearanceOverview = document.getElementById("settingsOverviewAppearance");
    const profileOverview = document.getElementById("settingsOverviewProfile");
    const cloudOverview = document.getElementById("settingsOverviewCloud");
    const driveMeta = document.getElementById("settingsDriveMeta");
    const drivePill = document.getElementById("driveSyncStatePill");

    const stats = getSettingsDataStats();
    if (dataOverview instanceof HTMLElement) {
      dataOverview.textContent = `${stats.subjects} درس • ${stats.chapters} فصل • ${stats.questions} سوال`;
    }

    if (appearanceOverview instanceof HTMLElement) {
      const themeLabel = getCurrentThemeLabel();
      const viewportLabel = VIEWPORT_LABELS[state.viewportMode] || VIEWPORT_LABELS.auto;
      const resolvedLabel = state.viewportAutoResolved === "mobile" ? "موبایل" : "دسکتاپ";
      const hybridLabel = state.allowScheduleLandscape ? "چرخش هیبرید: فعال" : "چرخش هیبرید: غیرفعال";
      appearanceOverview.textContent =
        state.viewportMode === "auto"
          ? `${themeLabel} • نمایش خودکار (${resolvedLabel}) • ${hybridLabel}`
          : `${themeLabel} • نمایش ${viewportLabel} • ${hybridLabel}`;
    }

    if (profileOverview instanceof HTMLElement) {
      const profile = getSettingsProfileSnapshot();
      profileOverview.textContent = getSettingsProfileStateText(profile);
    }

    const driveState = getDriveSettingsState();
    if (cloudOverview instanceof HTMLElement) {
      cloudOverview.textContent = driveState.summary;
    }
    if (driveMeta instanceof HTMLElement) {
      driveMeta.textContent = driveState.meta;
    }
    if (drivePill instanceof HTMLElement) {
      setDriveStatePill(drivePill, driveState.level, driveState.label);
    }
    syncDriveSyncProfileControl();

    updateProfileQuickThemeControls();
    updateScheduleLandscapeControls();
    updateProfileQuickSyncShortcut(driveState);
    updateDriveActionButtons();
    scheduleDriveSyncDiagnosticsRender();
    updateHeaderSyncPill(driveState);
  }

  function refreshHeaderQuickTools(subject = getActiveSubject(), chapter = getActiveChapter()) {
    let contextText = "نمای کلی همه درس‌ها";
    if (state.view.level === 2 && subject) {
      contextText = `مدیریت فصل‌های درس ${subject.name}`;
    } else if (state.view.level === 3 && subject && chapter) {
      contextText = `${subject.name} / ${chapter.name}`;
    }

    if (refs.headerQuickContext instanceof HTMLElement) {
      refs.headerQuickContext.textContent = contextText;
    }

    let modeText = "نمایش: درس‌ها";
    let modeKey = "subjects";
    let pageTitle = "درس‌ها";
    if (state.view.level === 2) {
      modeText = "نمایش: فصل‌ها";
      modeKey = "chapters";
      pageTitle = "فصل‌ها";
    } else if (state.view.level === 3) {
      const tabLabels = {
        bank: "نمایش: بانک سوالات",
        practice: "نمایش: تمرین",
        exam: "نمایش: آزمون",
        "chapter-map": "نمایش: نمودار درختی"
      };
      const tabTitles = {
        bank: "بانک سوالات",
        practice: "تمرین",
        exam: "آزمون",
        "chapter-map": "نمودار درختی"
      };
      modeText = tabLabels[state.view.tab] || "نمایش: بانک سوالات";
      pageTitle = tabTitles[state.view.tab] || "بانک سوالات";
      const tabModeKeys = {
        bank: "bank",
        practice: "practice",
        exam: "exam",
        "chapter-map": "map"
      };
      modeKey = tabModeKeys[state.view.tab] || "bank";
    }

    if (refs.headerPageTitle instanceof HTMLElement) {
      refs.headerPageTitle.textContent = pageTitle;
    }

    if (refs.headerQuickMode instanceof HTMLElement) {
      refs.headerQuickMode.textContent = modeText;
      refs.headerQuickMode.dataset.view = modeKey;
      refs.headerQuickMode.setAttribute("aria-label", modeText);
    }

    if (refs.headerBackBtn instanceof HTMLButtonElement) {
      const canGoBack = state.view.level > 1;
      refs.headerBackBtn.hidden = false;
      refs.headerBackBtn.setAttribute("aria-hidden", "false");
      refs.headerBackBtn.disabled = !canGoBack;
      refs.headerBackBtn.setAttribute("aria-disabled", canGoBack ? "false" : "true");
      refs.headerBackBtn.title = canGoBack ? "بازگشت" : "در صفحه اصلی";
    }

    if (refs.headerQuickGotoSubjects instanceof HTMLButtonElement) {
      refs.headerQuickGotoSubjects.classList.toggle("is-active", state.view.level === 1);
    }

    if (refs.headerQuickGotoChapters instanceof HTMLButtonElement) {
      const hasSubject = !!subject;
      refs.headerQuickGotoChapters.disabled = !hasSubject || state.view.level === 1;
      refs.headerQuickGotoChapters.classList.toggle("is-active", state.view.level === 2);
    }

    const canSwitchTab = state.view.level === 3 && !!subject && !!chapter;
    setHeaderQuickTabButtonState(refs.headerQuickTabBank, "bank", canSwitchTab);
    setHeaderQuickTabButtonState(refs.headerQuickTabPractice, "practice", canSwitchTab);
    setHeaderQuickTabButtonState(refs.headerQuickTabExam, "exam", canSwitchTab);
    setHeaderQuickTabButtonState(refs.headerQuickTabMap, "chapter-map", canSwitchTab);

    syncHeaderMenuButtonStates(subject, canSwitchTab);
    updateHeaderSyncPill();
    syncStandaloneMobileDock(subject, chapter);
    syncStandaloneScrollTopVisibility();
  }

  function setHeaderQuickTabButtonState(button, tab, canSwitch) {
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }

    button.disabled = !canSwitch;
    button.classList.toggle("is-active", canSwitch && state.view.tab === tab);
  }

  function syncHeaderMenuButtonStates(subject, canSwitchTab) {
    if (!(refs.headerRoot instanceof HTMLElement)) {
      return;
    }

    const hasSubject = !!subject;
    const menuButtons = refs.headerRoot.querySelectorAll(".appbar-overflow-item, .appbar-sections-item");
    menuButtons.forEach((button) => {
      if (!(button instanceof HTMLButtonElement)) {
        return;
      }

      const action = asText(button.dataset.action, "");
      const tab = asText(button.dataset.tab, "");
      let isActive = false;

      if (action === "goto-subjects") {
        button.disabled = false;
        isActive = state.view.level === 1;
      } else if (action === "goto-chapters") {
        button.disabled = !hasSubject || state.view.level === 1;
        isActive = state.view.level === 2;
      } else if (action === "switch-tab") {
        button.disabled = !canSwitchTab;
        isActive = canSwitchTab && tab === state.view.tab;
      } else {
        button.disabled = false;
      }

      button.classList.toggle("is-active", isActive);
    });
  }

  function updateHeaderSyncPill(driveState = getDriveSettingsState()) {
    if (!(refs.headerSyncPill instanceof HTMLElement)) {
      return;
    }

    const activeFileId = asText(readDriveConfig().fileId || state.sync.remote.fileId, "").trim();
    const busy = !!state.gapi.syncInFlight || !!asText(state.sync.lockOwner, "").trim();

    let chipState = "muted";
    let chipText = "غیرفعال";
    if (busy) {
      chipState = "syncing";
      chipText = "در حال همگام‌سازی";
    } else if (driveState?.level === "ok" && activeFileId) {
      chipState = "ok";
      chipText = "متصل";
    } else if (driveState?.level === "ok" || driveState?.level === "warn") {
      chipState = "warn";
      chipText = "آماده";
    }

    refs.headerSyncPill.dataset.state = chipState;
    refs.headerSyncPill.textContent = `همگام‌سازی: ${chipText}`;
    refs.headerSyncPill.title = asText(driveState?.meta, "");
  }

  function getSettingsDataStats() {
    if (settingsStatsCache.revision === subjectsRevision) {
      return settingsStatsCache.stats;
    }

    const subjects = Array.isArray(state.subjects) ? state.subjects.length : 0;
    let chapters = 0;
    let questions = 0;

    (state.subjects || []).forEach((subject) => {
      const chapterList = Array.isArray(subject?.chapters) ? subject.chapters : [];
      chapters += chapterList.length;
      chapterList.forEach((chapter) => {
        const questionList = Array.isArray(chapter?.questions) ? chapter.questions : [];
        questions += questionList.length;
      });
    });

    settingsStatsCache.stats = { subjects, chapters, questions };
    settingsStatsCache.revision = subjectsRevision;
    return settingsStatsCache.stats;
  }

  function getCurrentThemeLabel() {
    if (!(refs.themeSelect instanceof HTMLSelectElement)) {
      return "تم فعال";
    }

    const option = refs.themeSelect.selectedOptions?.[0];
    if (option && option.textContent) {
      return option.textContent.trim();
    }

    return "تم فعال";
  }

  function getSettingsProfileSnapshot() {
    const refsProfile = getProfileRefs();
    if (refsProfile) {
      return {
        name: asText(refsProfile.nameInput.value, "").trim(),
        major: asText(refsProfile.majorInput.value, "").trim(),
        semester: asText(refsProfile.semesterInput.value, "").trim()
      };
    }

    const stored = parseJsonSafe(localStorage.getItem(PROFILE_STORAGE_KEY), {});
    return {
      name: asText(stored?.name, "").trim(),
      major: asText(stored?.major, "").trim(),
      semester: asText(stored?.semester, "").trim()
    };
  }

  function getSettingsProfileStateText(profile) {
    const completion = [profile?.name, profile?.major, profile?.semester].filter((value) => !!asText(value, "").trim()).length;
    if (completion === 3) {
      return "کامل (نام، رشته، ترم)";
    }
    if (completion === 2) {
      return "تقریبا کامل (2 از 3)";
    }
    if (completion === 1) {
      return "در حال تکمیل (1 از 3)";
    }
    return "در حال تکمیل";
  }

  function getDriveSettingsState() {
    const stored = readDriveConfig();
    const local = readDriveConfigFromInputs();
    const storedValidation = validateDriveCredentials(stored, false);
    const localValidation = validateDriveCredentials(local, false);
    const hasStoredCredentials = !!stored.clientId;
    const hasLocalCredentials = !!local.clientId;
    const hasAnyLocalInput = !!local.clientId;
    const hasFileId = !!stored.fileId;
    const hasUnsavedChanges = stored.clientId !== local.clientId;
    const profileLabel = getDriveSyncProfileLabel();

    if (!hasStoredCredentials && !hasAnyLocalInput) {
      return {
        level: "muted",
        label: "تنظیم نشده",
        summary: "بدون اتصال ابری",
        meta: "برای فعال سازی، شناسه مشتری را وارد و ذخیره کنید."
      };
    }

    if (hasAnyLocalInput && !hasLocalCredentials) {
      return {
        level: "warn",
        label: "اطلاعات ناقص",
        summary: "اتصال ابری ناقص است",
        meta: "برای ذخیره، فیلد «شناسه مشتری» را تکمیل کنید."
      };
    }

    if (hasAnyLocalInput && !localValidation.formatsValid) {
      return {
        level: "warn",
        label: "فرمت نامعتبر",
        summary: "فرمت اطلاعات اتصال صحیح نیست",
        meta: localValidation.message
      };
    }

    if (hasStoredCredentials && !storedValidation.formatsValid) {
      return {
        level: "warn",
        label: "نیازمند اصلاح",
        summary: "اطلاعات ذخیره شده معتبر نیست",
        meta: "فرمت اطلاعات ذخیره شده را اصلاح و مجددا ذخیره کنید."
      };
    }

    if (hasLocalCredentials && hasUnsavedChanges) {
      return {
        level: "warn",
        label: "در انتظار ذخیره",
        summary: "اطلاعات جدید هنوز ذخیره نشده است",
        meta: "ابتدا روی «ذخیره اطلاعات اتصال» بزنید، سپس همگام سازی را اجرا کنید."
      };
    }

    if (hasStoredCredentials && hasFileId) {
      const autoSyncText = state.gapi.autoSyncEnabled ? "همگام سازی خودکار فعال است." : "همگام سازی خودکار هنوز فعال نشده است.";
      const lastSyncText = state.sync.lastSyncedAt ? `آخرین همگام سازی: ${formatSyncDateLabel(state.sync.lastSyncedAt)}` : "هنوز همگام سازی انجام نشده است.";
      return {
        level: "ok",
        label: "آماده کامل",
        summary: "اتصال پایدار با فایل همگام سازی",
        meta: `شناسه فایل متصل: ${shortenDriveFileId(stored.fileId)} | پروفایل: ${profileLabel} | ${autoSyncText} | ${lastSyncText}`
      };
    }

    return {
      level: hasStoredCredentials ? "ok" : "warn",
      label: hasStoredCredentials ? "آماده همگام سازی" : "نیازمند تکمیل",
      summary: hasStoredCredentials ? "اتصال ذخیره شده و آماده ایجاد فایل" : "اطلاعات اتصال ناقص است",
      meta: hasStoredCredentials
        ? `در اولین همگام سازی، فایل question_bank.json به صورت خودکار ساخته می شود. پروفایل فعال: ${profileLabel}.`
        : "شناسه مشتری باید کامل وارد شود."
    };
  }

  function setDriveStatePill(pill, level, label) {
    if (!(pill instanceof HTMLElement)) {
      return;
    }

    pill.classList.remove("settings-state-ok", "settings-state-warn", "settings-state-muted");
    const safeLevel = level === "ok" || level === "warn" ? level : "muted";
    pill.classList.add(`settings-state-${safeLevel}`);
    pill.textContent = asText(label, "تنظیم نشده");
  }

  function shortenDriveFileId(fileId) {
    const safe = asText(fileId, "").trim();
    if (safe.length <= 20) {
      return safe || "ثبت نشده";
    }
    return `${safe.slice(0, 8)}...${safe.slice(-7)}`;
  }

  function updateDriveActionButtons() {
    const saveButton = document.querySelector('[data-action="save-drive-credentials"]');
    const syncButton = document.getElementById("driveSyncBtn");
    const profileSyncButton = document.getElementById("profileQuickSyncBtn");
    const uploadButton = document.querySelector('[data-action="sync-upload"]');
    const downloadButton = document.querySelector('[data-action="sync-download"]');

    const stored = readDriveConfig();
    const hasUnsavedChanges = hasUnsavedDriveCredentials();
    const localValidation = validateDriveCredentials(readDriveConfigFromInputs(), false);
    const storedValidation = validateDriveCredentials(stored, true);

    const canSave = hasUnsavedChanges && localValidation.hasBoth && localValidation.formatsValid;
    if (saveButton instanceof HTMLButtonElement) {
      saveButton.disabled = !canSave;
      saveButton.title = canSave ? "اطلاعات جدید آماده ذخیره است" : "برای ذخیره، شناسه مشتری معتبر و تغییر یافته باشد";
    }

    const effectiveReady = hasUnsavedChanges
      ? localValidation.hasBoth && localValidation.formatsValid
      : storedValidation.ok;
    const isBusy = !!state.gapi.syncInFlight || !!asText(state.sync.lockOwner, "").trim();

    if (syncButton instanceof HTMLButtonElement && !syncButton.classList.contains("is-loading")) {
      syncButton.disabled = !effectiveReady || isBusy;
      syncButton.title = isBusy
        ? "همگام سازی در حال اجرا است"
        : effectiveReady
          ? "شروع همگام سازی خودکار"
          : "ابتدا شناسه مشتری معتبر را وارد کنید";
    }

    if (profileSyncButton instanceof HTMLButtonElement && !profileSyncButton.classList.contains("is-loading")) {
      profileSyncButton.disabled = !effectiveReady || isBusy;
      profileSyncButton.title = isBusy
        ? "همگام سازی در حال اجرا است"
        : effectiveReady
          ? "شروع همگام سازی گوگل درایو"
          : "ابتدا شناسه مشتری معتبر را در تنظیمات ذخیره کنید";
    }

    if (uploadButton instanceof HTMLButtonElement) {
      uploadButton.disabled = !effectiveReady || isBusy;
    }

    if (downloadButton instanceof HTMLButtonElement) {
      downloadButton.disabled = !effectiveReady || !stored.fileId || isBusy;
    }

    updateHeaderSyncPill();
  }

  function resetAppearanceSettings() {
    applyTheme("dark-graphite");
    setScheduleLandscapePreference(false, {
      persist: false,
      refreshOverview: false,
      reason: "reset-appearance"
    });
    applyViewportMode("auto");
    persistPreferences();
    refreshSettingsOverview();
    showToast("تنظیمات ظاهر به حالت پیش فرض برگشت.", "success");
    setStatus("ظاهر برنامه بازنشانی شد.", "ok");
  }

  function clearStoredDriveFileId() {
    const stored = readDriveConfig();
    if (!stored.fileId) {
      setStatus("شناسه فایل برای پاک سازی وجود ندارد.");
      return;
    }

    persistDriveConfig({ ...stored, fileId: "" });
    setDriveAutoSyncEnabled(false);
    clearDriveAutoPullTimer();
    updateSyncMeta(
      {
        remote: {
          fileId: "",
          modifiedTime: "",
          md5Checksum: ""
        }
      },
      { persist: true, render: true }
    );
    restoreDriveConfig();
    refreshSettingsOverview();
    showToast("شناسه فایل همگام سازی پاک شد.", "success");
    setStatus("شناسه فایل پاک سازی شد.", "ok");
  }

  function triggerSettingsImportPicker() {
    const input = document.getElementById("settingsImportInput");
    if (!(input instanceof HTMLInputElement)) {
      return;
    }
    input.click();
  }

  async function handleSettingsJsonImportChange(actionTarget) {
    if (!(actionTarget instanceof HTMLInputElement)) {
      return;
    }

    const file = actionTarget.files?.[0];
    if (!file) {
      return;
    }

    try {
      await importSettingsFromJsonFile(file);
      showToast("تنظیمات از فایل JSON بازیابی شد.", "success");
      setStatus("ورود تنظیمات انجام شد.", "ok");
    } catch (error) {
      console.error(error);
      const message = asText(error?.message, "ورود فایل تنظیمات انجام نشد.");
      showToast(message, "error");
      setStatus(message, "error");
    } finally {
      actionTarget.value = "";
    }
  }

  async function importSettingsFromJsonFile(file) {
    const raw = await file.text();
    const payload = parseJsonSafe(raw, null);
    const normalized = normalizeSettingsImportPayload(payload);

    if (!normalized.hasAny) {
      throw new Error("ساختار فایل تنظیمات معتبر نیست.");
    }

    if (normalized.preferences) {
      applyTheme(normalized.preferences.theme);
      setScheduleLandscapePreference(normalized.preferences.allowScheduleLandscape, {
        persist: false,
        refreshOverview: false,
        reason: "settings-import"
      });
      applyViewportMode(normalized.preferences.viewportMode);
      applyDriveSyncProfile(normalized.preferences.syncProfile, { persist: true, refresh: false });
      persistPreferences();
    }

    if (normalized.drive) {
      persistDriveConfig(normalized.drive);
      restoreDriveConfig();
      resetGoogleDriveRuntime();
    }

    if (normalized.profile) {
      applyImportedProfile(normalized.profile);
    }

    if (normalized.review) {
      applyImportedReviewMetadata(normalized.review);
    }

    refreshSettingsOverview();
  }

  function normalizeSettingsImportPayload(payload) {
    if (!payload || typeof payload !== "object") {
      return { hasAny: false, preferences: null, drive: null, profile: null, review: null };
    }

    const source = payload;
    const preferencesSource =
      source.preferences && typeof source.preferences === "object" ? source.preferences : source;
    const driveSource = source.drive && typeof source.drive === "object" ? source.drive : source;
    const profileSource = source.profile && typeof source.profile === "object" ? source.profile : source;
    const reviewSource =
      source.reviewMetadata && typeof source.reviewMetadata === "object"
        ? source.reviewMetadata
        : source.review && typeof source.review === "object"
          ? source.review
          : null;

    const hasPreferencesSection =
      Object.prototype.hasOwnProperty.call(preferencesSource, "theme") ||
      Object.prototype.hasOwnProperty.call(preferencesSource, "viewportMode") ||
      Object.prototype.hasOwnProperty.call(preferencesSource, "allowScheduleLandscape") ||
      Object.prototype.hasOwnProperty.call(preferencesSource, "syncProfile");
    const hasDriveSection =
      Object.prototype.hasOwnProperty.call(driveSource, "clientId") ||
      Object.prototype.hasOwnProperty.call(driveSource, "fileId");
    const hasProfileSection =
      Object.prototype.hasOwnProperty.call(profileSource, "name") ||
      Object.prototype.hasOwnProperty.call(profileSource, "major") ||
      Object.prototype.hasOwnProperty.call(profileSource, "semester");
    const hasReviewSection = !!reviewSource;

    const preferences = hasPreferencesSection
      ? {
          theme: THEMES.includes(asText(preferencesSource.theme, state.theme)) ? asText(preferencesSource.theme, state.theme) : state.theme,
          viewportMode: VIEWPORT_MODES.includes(asText(preferencesSource.viewportMode, state.viewportMode))
            ? asText(preferencesSource.viewportMode, state.viewportMode)
            : state.viewportMode,
          allowScheduleLandscape: normalizeScheduleLandscapePreference(
            preferencesSource.allowScheduleLandscape,
            state.allowScheduleLandscape
          ),
          syncProfile: normalizeDriveSyncProfile(preferencesSource.syncProfile)
        }
      : null;

    const drive = hasDriveSection
      ? normalizeDriveConfig({
          clientId: driveSource.clientId,
          fileId: driveSource.fileId
        })
      : null;

    const profile = hasProfileSection
      ? {
          name: asText(profileSource.name, "").trim(),
          major: asText(profileSource.major, "").trim(),
          semester: asText(profileSource.semester, "").trim()
        }
      : null;
    const review = hasReviewSection
      ? sanitizeReviewTermsObject(
          reviewSource.terms && typeof reviewSource.terms === "object" ? reviewSource.terms : reviewSource
        )
      : null;
    const hasReviewPayload = !!(review && Object.keys(review).length);

    return {
      hasAny: !!(preferences || drive || profile || hasReviewPayload),
      preferences,
      drive,
      profile,
      review: hasReviewPayload ? review : null
    };
  }

  function applyImportedReviewMetadata(reviewTerms) {
    const importedTerms = sanitizeReviewTermsObject(reviewTerms);
    if (!Object.keys(importedTerms).length) {
      return;
    }

    const mergedTerms = sanitizeReviewTermsObject(state.terms);
    Object.entries(importedTerms).forEach(([termKey, termValue]) => {
      if (!mergedTerms[termKey]) {
        mergedTerms[termKey] = { review: {} };
      }
      mergedTerms[termKey].review = {
        ...mergedTerms[termKey].review,
        ...(termValue?.review || {})
      };
    });

    state.terms = mergedTerms;
    reconcileReviewMetadataAfterDataChange({ migrateLegacy: false, persist: true });
    if (state.view.level === 3 && ["bank", "practice", "exam"].includes(state.view.tab)) {
      render();
    }
  }

  function applyImportedProfile(profile) {
    const safeProfile = {
      name: asText(profile?.name, "").trim(),
      major: asText(profile?.major, "").trim(),
      semester: normalizeProfileSemesterValue(profile?.semester, "2")
    };

    const refsProfile = getProfileRefs();
    if (refsProfile) {
      refsProfile.nameInput.value = safeProfile.name;
      refsProfile.majorInput.value = safeProfile.major;
      refsProfile.semesterInput.value = safeProfile.semester;
      syncProfileFromInputs();
      return;
    }

    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(safeProfile));
    } catch (error) {
      console.error(error);
    }
  }

  function exportSettingsToLocalJson() {
    const payload = JSON.stringify(buildSettingsExportPayload(), null, 2);
    const blob = new Blob([payload], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const stamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `question-bank-settings-${stamp}.json`;
    link.style.display = "none";

    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    showToast("خروجی تنظیمات آماده دانلود شد.", "success");
    setStatus("فایل تنظیمات دانلود شد.", "ok");
  }

  function buildSettingsExportPayload() {
    const driveFromInputs = readDriveConfigFromInputs();
    const profile = getSettingsProfileSnapshot();
    const stats = getSettingsDataStats();

    return {
      version: SETTINGS_EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      preferences: {
        theme: state.theme,
        viewportMode: state.viewportMode,
        allowScheduleLandscape: state.allowScheduleLandscape === true,
        syncProfile: normalizeDriveSyncProfile(state.sync.profile)
      },
      drive: normalizeDriveConfig(driveFromInputs),
      profile,
      reviewMetadata: {
        terms: sanitizeReviewTermsObject(state.terms)
      },
      meta: {
        subjects: stats.subjects,
        chapters: stats.chapters,
        questions: stats.questions
      }
    };
  }

  function resetAllSettings() {
    const approved = window.confirm("تمام تنظیمات کاربری (ظاهر، اتصال ابری و پروفایل) بازنشانی شود؟");
    if (!approved) {
      return;
    }

    try {
      localStorage.removeItem(STORAGE_KEYS.prefs);
      localStorage.removeItem(STORAGE_KEYS.drive);
      localStorage.removeItem(STORAGE_KEYS.driveAuto);
      localStorage.removeItem(STORAGE_KEYS.driveSyncProfile);
      localStorage.removeItem(STORAGE_KEYS.driveAuth);
      localStorage.removeItem(STORAGE_KEYS.driveSyncMeta);
      localStorage.removeItem(STORAGE_KEYS.driveSyncDebug);
      localStorage.removeItem(PROFILE_STORAGE_KEY);
    } catch (error) {
      console.error(error);
    }

    applyTheme("dark-graphite");
    setScheduleLandscapePreference(false, {
      persist: false,
      refreshOverview: false,
      reason: "reset-all-settings"
    });
    applyViewportMode("auto");
    persistPreferences();
    persistDriveConfig(DEFAULT_DRIVE_CONFIG);
    setDriveAutoSyncEnabled(false);
    applyDriveSyncProfile(DRIVE_SYNC_PROFILE_DEFAULT, { persist: true, refresh: false });
    state.sync.localHash = "";
    state.sync.lastPushAt = "";
    state.sync.lastPullAt = "";
    state.sync.lastSyncedAt = "";
    state.sync.lastLocalEditAt = "";
    state.sync.lastError = "";
    state.sync.lastErrorStack = "";
    state.sync.remote = { fileId: "", modifiedTime: "", md5Checksum: "" };
    state.sync.lastMergeResult = normalizeSyncMergeResult(null);
    state.sync.debugEvents = [];
    driveLastAutoPushAtMs = 0;
    driveLastAutoPullAtMs = 0;
    restoreDriveConfig();
    resetGoogleDriveRuntime();

    const refsProfile = getProfileRefs();
    if (refsProfile) {
      refsProfile.nameInput.value = "";
      refsProfile.majorInput.value = "";
      refsProfile.semesterInput.value = "2";
      refsProfile.nameInput.dataset.touched = "false";
      syncProfileFromInputs({ forceValidate: false });
    }

    refreshSettingsOverview();
    showToast("تنظیمات کاربری با موفقیت بازنشانی شد.", "success");
    setStatus("بازنشانی تنظیمات انجام شد.", "ok");
  }

  function setupUserProfileCard() {
    const refsProfile = getProfileRefs();
    if (!refsProfile) {
      stopProfileDateTimeTicker();
      return;
    }

    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    const stored = raw ? parseJsonSafe(raw, {}) : {};

    refsProfile.nameInput.value = asText(stored.name, "");
    refsProfile.majorInput.value = asText(stored.major, "");
    refsProfile.semesterInput.value = normalizeProfileSemesterValue(stored.semester, "2");
    refsProfile.nameInput.dataset.touched = "false";
    refsProfile.nameInput.addEventListener("blur", () => {
      refsProfile.nameInput.dataset.touched = "true";
      syncProfileFromInputs({ forceValidate: true });
    });
    syncProfileFromInputs({ forceValidate: false });
    startProfileDateTimeTicker();
  }

  function getProfileRefs() {
    const nameInput = document.getElementById("profileName");
    const majorInput = document.getElementById("profileMajor");
    const semesterInput = document.getElementById("profileSemester");
    const greeting = document.getElementById("profileGreeting");
    const dateTimeLabel = document.getElementById("profileDateTime");
    const savePill = document.getElementById("profileSavePill");
    const nameError = document.getElementById("profileNameError");

    const semesterControlIsValid = semesterInput instanceof HTMLInputElement || semesterInput instanceof HTMLSelectElement;
    if (
      !(nameInput instanceof HTMLInputElement) ||
      !(majorInput instanceof HTMLInputElement) ||
      !semesterControlIsValid ||
      !(greeting instanceof HTMLElement)
    ) {
      return null;
    }

    return {
      nameInput,
      majorInput,
      semesterInput,
      greeting,
      dateTimeLabel: dateTimeLabel instanceof HTMLElement ? dateTimeLabel : null,
      savePill: savePill instanceof HTMLElement ? savePill : null,
      nameError: nameError instanceof HTMLElement ? nameError : null
    };
  }

  function toLatinDigits(value) {
    const map = {
      "۰": "0",
      "۱": "1",
      "۲": "2",
      "۳": "3",
      "۴": "4",
      "۵": "5",
      "۶": "6",
      "۷": "7",
      "۸": "8",
      "۹": "9",
      "٠": "0",
      "١": "1",
      "٢": "2",
      "٣": "3",
      "٤": "4",
      "٥": "5",
      "٦": "6",
      "٧": "7",
      "٨": "8",
      "٩": "9"
    };
    return asText(value, "").replace(/[۰-۹٠-٩]/g, (match) => map[match] || match);
  }

  function normalizeProfileSemesterValue(value, fallback = "2") {
    const normalizedFallback = String(clampNumber(Number.parseInt(asText(fallback, "2"), 10), 1, 10, 2));
    const raw = toLatinDigits(value).trim();
    if (!raw) {
      return normalizedFallback;
    }

    const match = raw.match(/\d{1,2}/);
    if (!match) {
      return normalizedFallback;
    }

    const parsed = Number.parseInt(match[0], 10);
    if (!Number.isFinite(parsed)) {
      return normalizedFallback;
    }

    return String(clampNumber(parsed, 1, 10, Number.parseInt(normalizedFallback, 10)));
  }

  function getProfileDateTimeFormatters() {
    if (getProfileDateTimeFormatters.cache) {
      return getProfileDateTimeFormatters.cache;
    }

    const weekdayFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      weekday: "long"
    });
    const dateFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian-nu-latn", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
    const fullDateFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian-nu-latn", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
    const timeFormatter = new Intl.DateTimeFormat("fa-IR-u-nu-latn", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });

    getProfileDateTimeFormatters.cache = {
      weekdayFormatter,
      dateFormatter,
      fullDateFormatter,
      timeFormatter
    };
    return getProfileDateTimeFormatters.cache;
  }

  function formatProfileJalaliDateTime(now = new Date()) {
    const { weekdayFormatter, dateFormatter, fullDateFormatter, timeFormatter } = getProfileDateTimeFormatters();
    return {
      weekday: weekdayFormatter.format(now),
      date: dateFormatter.format(now),
      time: timeFormatter.format(now),
      fullDateTime: `${fullDateFormatter.format(now)} • ساعت ${timeFormatter.format(now)}`
    };
  }

  function renderProfileDateTimeLabel(refsProfile, now = new Date()) {
    if (!refsProfile || !(refsProfile.dateTimeLabel instanceof HTMLElement)) {
      return;
    }

    const payload = formatProfileJalaliDateTime(now);
    let weekdayNode = refsProfile.dateTimeLabel.querySelector(".profile-datetime-day");
    let valueNode = refsProfile.dateTimeLabel.querySelector(".profile-datetime-main");
    let dateNode = null;
    let separatorNode = null;
    let timeNode = null;

    if (!(weekdayNode instanceof HTMLElement) || !(valueNode instanceof HTMLElement)) {
      refsProfile.dateTimeLabel.replaceChildren();

      weekdayNode = document.createElement("span");
      weekdayNode.className = "profile-datetime-day";

      valueNode = document.createElement("span");
      valueNode.className = "profile-datetime-main";

      refsProfile.dateTimeLabel.append(weekdayNode, valueNode);
    }

    dateNode = valueNode.querySelector(".profile-datetime-date");
    separatorNode = valueNode.querySelector(".profile-datetime-sep");
    timeNode = valueNode.querySelector(".profile-datetime-time");

    if (!(dateNode instanceof HTMLElement) || !(separatorNode instanceof HTMLElement) || !(timeNode instanceof HTMLElement)) {
      valueNode.replaceChildren();

      dateNode = document.createElement("span");
      dateNode.className = "profile-datetime-date";

      separatorNode = document.createElement("span");
      separatorNode.className = "profile-datetime-sep";
      separatorNode.textContent = "•";

      timeNode = document.createElement("span");
      timeNode.className = "profile-datetime-time";

      valueNode.append(dateNode, separatorNode, timeNode);
    }

    weekdayNode.textContent = payload.weekday;
    dateNode.textContent = payload.date;
    timeNode.textContent = `ساعت ${payload.time}`;
    refsProfile.dateTimeLabel.setAttribute("aria-label", payload.fullDateTime);
    refsProfile.dateTimeLabel.dateTime = now.toISOString();
  }

  function stopProfileDateTimeTicker() {
    if (profileDateTimePrimeTimeoutId !== null) {
      window.clearTimeout(profileDateTimePrimeTimeoutId);
      profileDateTimePrimeTimeoutId = null;
    }

    if (profileDateTimeIntervalId !== null) {
      window.clearInterval(profileDateTimeIntervalId);
      profileDateTimeIntervalId = null;
    }
  }

  function startProfileDateTimeTicker() {
    stopProfileDateTimeTicker();

    const refsProfile = getProfileRefs();
    if (!refsProfile || !(refsProfile.dateTimeLabel instanceof HTMLElement)) {
      return;
    }

    const tick = () => {
      if (document.hidden) {
        return;
      }
      const currentRefs = getProfileRefs();
      if (!currentRefs || !(currentRefs.dateTimeLabel instanceof HTMLElement)) {
        stopProfileDateTimeTicker();
        return;
      }
      renderProfileDateTimeLabel(currentRefs);
    };

    renderProfileDateTimeLabel(refsProfile);
    const msToNextMinute = PROFILE_DATETIME_TICK_MS - (Date.now() % PROFILE_DATETIME_TICK_MS);
    profileDateTimePrimeTimeoutId = window.setTimeout(() => {
      profileDateTimePrimeTimeoutId = null;
      tick();
      profileDateTimeIntervalId = window.setInterval(tick, PROFILE_DATETIME_TICK_MS);
    }, Math.max(500, msToNextMinute));
  }

  function setProfileSaveState(level, label) {
    const refsProfile = getProfileRefs();
    if (!refsProfile || !(refsProfile.savePill instanceof HTMLElement)) {
      return;
    }
    refsProfile.savePill.dataset.state = asText(level, "saved");
    refsProfile.savePill.textContent = asText(label, "ذخیره شد");
  }

  function setProfileNameErrorState(refsProfile, shouldShowError) {
    if (!refsProfile) {
      return;
    }

    const showError = !!shouldShowError;
    refsProfile.nameInput.setAttribute("aria-invalid", showError ? "true" : "false");
    const field = refsProfile.nameInput.closest(".profile-field");
    if (field instanceof HTMLElement) {
      field.classList.toggle("is-invalid", showError);
    }
    if (refsProfile.nameError instanceof HTMLElement) {
      refsProfile.nameError.hidden = !showError;
    }
  }

  function computeProfileAccentHue(profile) {
    const seed = `${profile.name}|${profile.major}|${profile.semester}`;
    if (!seed.replace(/\|/g, "").trim()) {
      return 198;
    }

    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
      hash = (hash * 31 + seed.charCodeAt(i)) % 1000003;
    }

    return 178 + (hash % 36);
  }

  function applyProfileIconTheme(profile, completion) {
    const root = document.documentElement;
    if (!(root instanceof HTMLElement)) {
      return;
    }

    const hue = computeProfileAccentHue(profile);
    const glowLevel = completion >= 3 ? 0.4 : completion === 2 ? 0.33 : completion === 1 ? 0.26 : 0.2;

    root.style.setProperty("--profile-accent-hue", String(hue));
    root.style.setProperty("--profile-accent-glow", glowLevel.toFixed(2));
  }

  function updateProfileSectionVisibility(completion) {
    const profileSection = document.querySelector(".profile-hub");
    const profileFormCard = document.querySelector(".profile-card-form");

    if (profileSection instanceof HTMLElement) {
      profileSection.hidden = false;
      profileSection.setAttribute("aria-hidden", "false");
    }

    if (profileFormCard instanceof HTMLElement) {
      profileFormCard.dataset.completion = String(completion);
    }
  }

  function syncProfileFromInputs(options = {}) {
    const refsProfile = getProfileRefs();
    if (!refsProfile) {
      return;
    }

    const previousReviewTerm = asText(refsProfile.semesterInput.dataset.reviewTerm, "");
    const semesterValue = normalizeProfileSemesterValue(refsProfile.semesterInput.value, "2");
    if (refsProfile.semesterInput.value !== semesterValue) {
      refsProfile.semesterInput.value = semesterValue;
    }
    refsProfile.semesterInput.dataset.reviewTerm = semesterValue;
    ensureTermReviewStore(semesterValue);

    const profile = {
      name: asText(refsProfile.nameInput.value, "").trim(),
      major: asText(refsProfile.majorInput.value, "").trim(),
      semester: semesterValue
    };

    const completion = [profile.name, profile.major, profile.semester].filter((value) => !!asText(value, "").trim()).length;
    applyProfileIconTheme(profile, completion);
    updateProfileSectionVisibility(completion);

    const nameTouched = refsProfile.nameInput.dataset.touched === "true";
    const shouldValidateName = !!options.forceValidate || nameTouched;
    const hasValidName = profile.name.length > 0;
    setProfileNameErrorState(refsProfile, shouldValidateName && !hasValidName);

    const level = String(completion);
    const profileSurface = document.querySelector(".profile-hub");
    const avatar = document.getElementById("profileAvatar");
    const brandIcon = document.querySelector(".header-brand-icon");
    if (profileSurface instanceof HTMLElement) {
      profileSurface.dataset.profileLevel = level;
    }
    if (avatar instanceof HTMLElement) {
      avatar.dataset.profileLevel = level;
    }
    if (brandIcon instanceof HTMLElement) {
      brandIcon.dataset.profileLevel = level;
    }

    const majorPart = profile.major ? `، ${profile.major}` : "";
    refsProfile.greeting.textContent = `سلام ${profile.name || "دوست عزیز"}، ${`ترم ${profile.semester}`}${majorPart}`;
    renderProfileDateTimeLabel(refsProfile);

    setProfileSaveState("saving", "در حال ذخیره...");
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      setProfileSaveState("saved", "ذخیره شد");
    } catch (error) {
      console.error(error);
      setProfileSaveState("error", "ذخیره ناموفق");
    }

    const semesterChanged = previousReviewTerm && previousReviewTerm !== semesterValue;
    if (semesterChanged && state.view.level === 3 && ["bank", "practice", "exam"].includes(state.view.tab)) {
      state.pagination.page = 1;
      render();
    }

    refreshSettingsOverview();
  }

  function handleProfileStartNewSemester() {
    const refsProfile = getProfileRefs();
    if (!refsProfile) {
      return;
    }

    refsProfile.nameInput.dataset.touched = "true";
    if (!asText(refsProfile.nameInput.value, "").trim()) {
      setProfileNameErrorState(refsProfile, true);
      setProfileSaveState("error", "نام دانشجو لازم است");
      refsProfile.nameInput.focus();
      showToast("برای شروع ترم جدید، ابتدا نام دانشجو را وارد کنید.", "error");
      setStatus("شروع ترم جدید انجام نشد: نام دانشجو خالی است.", "error");
      return;
    }

    const currentSemester = Number.parseInt(normalizeProfileSemesterValue(refsProfile.semesterInput.value, "2"), 10);
    const nextSemester = Math.min(10, currentSemester + 1);
    refsProfile.semesterInput.value = String(nextSemester);
    syncProfileFromInputs({ forceValidate: true });

    if (nextSemester === currentSemester) {
      showToast("ترم فعال روی 10 قرار دارد و بیشتر نمی‌شود.", "info");
      setStatus("ترم فعال روی 10 باقی ماند.", "ok");
      return;
    }

    showToast(`ترم جدید شروع شد: ترم ${nextSemester}`, "success");
    setStatus(`ترم فعال به ترم ${nextSemester} تغییر کرد.`, "ok");
  }

  function handleProfileSaveInfo() {
    const refsProfile = getProfileRefs();
    if (!refsProfile) {
      return;
    }

    refsProfile.nameInput.dataset.touched = "true";
    syncProfileFromInputs({ forceValidate: true });

    const name = asText(refsProfile.nameInput.value, "").trim();
    if (!name) {
      setProfileSaveState("error", "نام دانشجو لازم است");
      refsProfile.nameInput.focus();
      showToast("برای ثبت اطلاعات، نام دانشجو را وارد کنید.", "error");
      setStatus("ثبت اطلاعات انجام نشد: نام دانشجو خالی است.", "error");
      return;
    }

    setProfileSaveState("saved", "ذخیره شد");
    showToast("اطلاعات دانشجو با موفقیت ثبت شد.", "success", 2200);
    setStatus("اطلاعات دانشجو ذخیره شد.", "ok");
  }

  function clearQuestionPdfPreviewUi(message = "") {
    const frame = document.getElementById("questionPdfPreviewFrame");
    const image = document.getElementById("questionSourcePreviewImage");
    const placeholder = document.getElementById("questionPdfPreviewPlaceholder");

    if (frame instanceof HTMLIFrameElement) {
      frame.hidden = true;
      frame.src = "about:blank";
    }
    if (image instanceof HTMLImageElement) {
      image.hidden = true;
      image.removeAttribute("src");
    }
    if (placeholder instanceof HTMLElement) {
      placeholder.hidden = false;
      placeholder.textContent =
        asText(message, "").trim() || "برای نمایش پیش‌نمایش، فایل مرجع را انتخاب کن.";
    }

    if (questionPdfPreviewObjectUrl) {
      try {
        URL.revokeObjectURL(questionPdfPreviewObjectUrl);
      } catch {
        // ignore object URL cleanup issues
      }
      questionPdfPreviewObjectUrl = "";
    }
  }

  function isImageReferenceFile(file) {
    if (!(file instanceof File)) {
      return false;
    }
    const fileType = asText(file.type, "").trim().toLowerCase();
    const fileName = asText(file.name, "").trim().toLowerCase();
    if (fileType.startsWith("image/")) {
      return true;
    }
    return fileName.endsWith(".png") || fileName.endsWith(".jpg") || fileName.endsWith(".jpeg");
  }

  function setQuestionPdfPreviewFromFile(file) {
    const frame = document.getElementById("questionPdfPreviewFrame");
    const image = document.getElementById("questionSourcePreviewImage");
    const placeholder = document.getElementById("questionPdfPreviewPlaceholder");
    if (!(frame instanceof HTMLIFrameElement) || !(placeholder instanceof HTMLElement)) {
      return;
    }
    if (!(file instanceof File)) {
      clearQuestionPdfPreviewUi();
      return;
    }

    clearQuestionPdfPreviewUi();
    questionPdfPreviewObjectUrl = URL.createObjectURL(file);
    if (isImageReferenceFile(file) && image instanceof HTMLImageElement) {
      image.src = questionPdfPreviewObjectUrl;
      image.hidden = false;
    } else {
      frame.src = questionPdfPreviewObjectUrl;
      frame.hidden = false;
    }
    placeholder.hidden = true;
  }

  function setupLocalJsonTransfer() {
    const importButton = document.getElementById("jsonImportBtn");
    const exportButton = document.getElementById("jsonExportBtn");
    const importInput = document.getElementById("jsonImportInput");
    const questionPdfSourceBtn = document.getElementById("questionPdfSourceBtn");
    const questionPdfSourceInput = document.getElementById("questionPdfSourceInput");
    const questionPdfSourceStatus = document.getElementById("questionPdfSourceStatus");

    if (
      !(importButton instanceof HTMLButtonElement) ||
      !(exportButton instanceof HTMLButtonElement) ||
      !(importInput instanceof HTMLInputElement)
    ) {
      return;
    }

    importButton.addEventListener("click", () => {
      importInput.click();
    });

    importInput.addEventListener("change", async () => {
      const file = importInput.files?.[0];
      if (!file) {
        return;
      }

      try {
        const result = await importSubjectsFromLocalJson(file);
        clearJsonImportDiagnostics();
        const treeUpdated = Number(result?.treeUpdatedCount) || 0;
        const treeCleared = Number(result?.treeClearedCount) || 0;
        const treeSuffix =
          treeUpdated > 0 || treeCleared > 0
            ? ` (درختی: ${treeUpdated} فصل به‌روزرسانی شد، ${treeCleared} فصل خالی شد)`
            : "";
        if (result?.mode === "chapter-tree") {
          const createdSuffix = ` (${Number(result.newSubjects) || 0} درس جدید، ${Number(result.newChapters) || 0} فصل جدید)`;
          const invalidSuffix = Number(result.invalidRows) > 0 ? ` (${result.invalidRows} ردیف نامعتبر رد شد)` : "";
          setStatus(
            `${Number(result.updatedCount) || 0} درخت فصل از فایل JSON ثبت/به‌روزرسانی شد.${createdSuffix}${invalidSuffix}`,
            "ok"
          );
        } else if (result?.mode === "append-active-chapter") {
          const duplicateSuffix =
            Number(result.duplicateCount) > 0 ? ` (${result.duplicateCount} سوال تکراری نادیده گرفته شد)` : "";
          const skippedSuffix =
            Number(result.skippedCount) > 0 ? ` (${result.skippedCount} ردیف نامعتبر رد شد)` : "";
          setStatus(
            `${result.addedCount} سوال به فصل «${result.chapterName}» از درس «${result.subjectName}» اضافه شد.${duplicateSuffix}${skippedSuffix}${treeSuffix}`,
            "ok"
          );
        } else if (result?.mode === "merge-upsert") {
          const duplicateSuffix =
            Number(result.duplicateCount) > 0 ? ` (${result.duplicateCount} سوال تکراری اضافه نشد)` : "";
          const skippedSuffix =
            Number(result.skippedCount) > 0 ? ` (${result.skippedCount} ردیف نامعتبر رد شد)` : "";
          if (Number(result.addedCount) > 0) {
            const createdSuffix = ` (${result.newSubjects} درس جدید، ${result.newChapters} فصل جدید)`;
            setStatus(
              `${result.addedCount} سوال از فایل JSON به بانک موجود اضافه شد.${createdSuffix}${duplicateSuffix}${skippedSuffix}${treeSuffix}`,
              "ok"
            );
          } else if (Number(result.duplicateCount) > 0) {
            setStatus(`سوال جدیدی اضافه نشد؛ تمام سوال‌های فایل تکراری بودند.${skippedSuffix}${treeSuffix}`, "ok");
          } else {
            setStatus(`ورود JSON انجام شد اما سوال جدیدی قابل‌افزودن نبود.${skippedSuffix}${treeSuffix}`, "ok");
          }
        } else {
          const duplicateSuffix =
            Number(result?.duplicateCount) > 0 ? ` (${result.duplicateCount} سوال تکراری حذف شد)` : "";
          setStatus(`فایل JSON با موفقیت وارد شد.${duplicateSuffix}${treeSuffix}`, "ok");
        }
      } catch (error) {
        console.error(error);
        const diagnostic = resolveJsonImportDiagnostic(error);
        renderJsonImportDiagnostics(diagnostic, "error");
        setStatus(diagnostic.summary, "error");
      } finally {
        importInput.value = "";
      }
    });

    const syncQuestionPdfSourceUi = () => {
      if (!(questionPdfSourceStatus instanceof HTMLElement)) {
        return;
      }
      if (!questionPdfAssetPlugin || typeof questionPdfAssetPlugin.getSourceSummary !== "function") {
        questionPdfSourceStatus.textContent = "فایل مرجع: افزونه غیرفعال است.";
        clearQuestionPdfPreviewUi("پیش‌نمایش فایل مرجع در این مرورگر غیرفعال است.");
        return;
      }
      const summary = questionPdfAssetPlugin.getSourceSummary();
      if (!summary?.attached) {
        questionPdfSourceStatus.textContent = "فایل مرجع: انتخاب نشده";
        clearQuestionPdfPreviewUi();
        return;
      }
      const sourceKind = asText(summary.kind, "").trim().toLowerCase();
      const pages = Number(summary.pages) || 0;
      const sizeMb = Number(summary.size) > 0 ? (Number(summary.size) / (1024 * 1024)).toFixed(2) : "0.00";
      if (sourceKind === "image") {
        const width = Number(summary.width) || 0;
        const height = Number(summary.height) || 0;
        questionPdfSourceStatus.textContent = `فایل مرجع: ${summary.name} | تصویر ${width}×${height} | ${sizeMb} MB`;
        return;
      }
      questionPdfSourceStatus.textContent = `فایل مرجع: ${summary.name} | ${pages} صفحه | ${sizeMb} MB`;
    };

    if (questionPdfSourceBtn instanceof HTMLButtonElement && questionPdfSourceInput instanceof HTMLInputElement) {
      questionPdfSourceBtn.addEventListener("click", () => {
        questionPdfSourceInput.click();
      });

      questionPdfSourceInput.addEventListener("change", async () => {
        const file = questionPdfSourceInput.files?.[0];
        if (!file) {
          return;
        }
        if (!questionPdfAssetPlugin || typeof questionPdfAssetPlugin.attachSourcePdfFile !== "function") {
          setStatus("پشتیبانی برش فایل مرجع فعال نیست.", "error");
          questionPdfSourceInput.value = "";
          return;
        }

        try {
          const summary = await questionPdfAssetPlugin.attachSourcePdfFile(file);
          syncQuestionPdfSourceUi();
          setQuestionPdfPreviewFromFile(file);
          const sourceKind = asText(summary?.kind, "").trim().toLowerCase();
          const pageCount = Number(summary?.pages) || 0;
          if (sourceKind === "image") {
            const width = Number(summary?.width) || 0;
            const height = Number(summary?.height) || 0;
            setStatus(`فایل مرجع تصویری «${asText(summary?.name, file.name)}» (${width}×${height}) ثبت شد.`, "ok");
            showToast("فایل مرجع تصویری با موفقیت انتخاب شد.", "success", 2300);
          } else {
            setStatus(`فایل مرجع «${asText(summary?.name, file.name)}» با ${pageCount} صفحه ثبت شد.`, "ok");
            showToast("فایل مرجع با موفقیت انتخاب شد.", "success", 2300);
          }
          render();
        } catch (error) {
          const errorCode = asText(error?.code, "");
          if (errorCode === "PDF_ATTACH_STALE") {
            return;
          }
          console.error(error);
          setStatus(asText(error?.message, "بارگذاری فایل مرجع ناموفق بود."), "error");
          showToast("فایل مرجع معتبر نیست یا بارگذاری نشد.", "error", 2800);
        } finally {
          questionPdfSourceInput.value = "";
        }
      });
    }

    syncQuestionPdfSourceUi();

    exportButton.addEventListener("click", () => {
      try {
        exportSubjectsToLocalJson();
        setStatus("خروجی JSON دانلود شد.", "ok");
      } catch (error) {
        console.error(error);
        setStatus("خروجی JSON انجام نشد.", "error");
      }
    });
  }

  function openQuestionPdfSourcePicker() {
    const input = document.getElementById("questionPdfSourceInput");
    if (input instanceof HTMLInputElement) {
      input.click();
    }
  }

  function clearQuestionPdfSource() {
    const status = document.getElementById("questionPdfSourceStatus");
    const input = document.getElementById("questionPdfSourceInput");
    if (!questionPdfAssetPlugin || typeof questionPdfAssetPlugin.clearSourcePdfFile !== "function") {
      if (status instanceof HTMLElement) {
        status.textContent = "فایل مرجع: افزونه غیرفعال است.";
      }
      if (input instanceof HTMLInputElement) {
        input.value = "";
      }
      clearQuestionPdfPreviewUi("پیش‌نمایش فایل مرجع در این مرورگر غیرفعال است.");
      return;
    }
    const releaseInfo = questionPdfAssetPlugin.clearSourcePdfFile();
    if (status instanceof HTMLElement) {
      status.textContent = "فایل مرجع: انتخاب نشده";
    }
    if (input instanceof HTMLInputElement) {
      input.value = "";
    }
    clearQuestionPdfPreviewUi();
    const releasedBytes = Number(releaseInfo?.releasedSourceBytes) || 0;
    const releasedMb = releasedBytes > 0 ? (releasedBytes / (1024 * 1024)).toFixed(2) : "0.00";
    const revokedObjectUrls = Number(releaseInfo?.revokedObjectUrls) || 0;
    const resetFigureCount = Number(releaseInfo?.resetFigureCount) || 0;
    setStatus(
      `فایل مرجع حذف شد. آزادسازی تقریبی: ${releasedMb} MB | تصاویر پاک‌سازی‌شده: ${resetFigureCount} | URLهای آزادشده: ${revokedObjectUrls}`,
      "ok"
    );
    render();
  }

  async function importSubjectsFromLocalJson(file) {
    const text = await file.text();
    const summary = await importQuestionsFromJsonText(text);

    if (summary?.importKind === "tree") {
      return {
        mode: "chapter-tree",
        ...summary
      };
    }

    if (summary?.lockedToActiveChapter) {
      return {
        mode: "append-active-chapter",
        ...summary
      };
    }

    return {
      mode: "merge-upsert",
      ...summary
    };
  }

  function buildChapterTreeRowsForExport(subjects, options = {}) {
    const includeEmpty = options.includeEmpty !== false;
    const rows = [];
    (subjects || []).forEach((subject) => {
      const subjectName = asText(subject?.name, "").trim();
      if (!subjectName) {
        return;
      }
      (subject?.chapters || []).forEach((chapter, chapterIndex) => {
        const chapterName = asText(chapter?.name, "").trim();
        if (!chapterName) {
          return;
        }
        const tree = normalizeChapterTreePayload(chapter?.tree ?? chapter?.children ?? []);
        if (!includeEmpty && !tree.length) {
          return;
        }
        rows.push({
          subject: subjectName,
          chapter: chapterName,
          order: Number.isFinite(Number(chapter?.order)) ? Number(chapter.order) : chapterIndex + 1,
          tree
        });
      });
    });
    return rows;
  }

  function buildChapterTreeExportPayload(subjects, options = {}) {
    return {
      type: "chapter-tree",
      trees: buildChapterTreeRowsForExport(subjects, options)
    };
  }

  function exportSubjectsToLocalJson() {
    const payloadObject = {
      format: "question-bank-export-v3",
      exportedAt: new Date().toISOString(),
      subjects: exportSubjects(state.subjects),
      chapterTreePayload: buildChapterTreeExportPayload(state.subjects, { includeEmpty: true })
    };
    const payload = JSON.stringify(payloadObject, null, 2);
    const blob = new Blob([payload], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const stamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `question-bank-${stamp}.json`;
    link.style.display = "none";

    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function clearJsonImportDiagnostics() {
    const panel = refs.jsonImportDiagnostics;
    if (!(panel instanceof HTMLElement)) {
      return;
    }

    panel.hidden = true;
    panel.dataset.state = "idle";
    panel.innerHTML = "";
  }

  function renderJsonImportDiagnostics(report, kind = "error") {
    const panel = refs.jsonImportDiagnostics;
    if (!(panel instanceof HTMLElement)) {
      return;
    }

    const safeReport = resolveJsonImportDiagnostic({ importDiagnostic: report });
    const causes = safeReport.causes.length ? safeReport.causes : ["علت مشخصی دریافت نشد."];
    const tips = safeReport.tips || [];
    const causeItems = causes.map((item) => `<li>${escapeHtmlText(item)}</li>`).join("");
    const tipItems = tips.map((item) => `<li>${escapeHtmlText(item)}</li>`).join("");

    const body = [
      `<p class="json-import-diag-title">${escapeHtmlText(safeReport.title)}</p>`,
      `<p class="json-import-diag-summary">${escapeHtmlText(safeReport.summary)}</p>`,
      '<section class="json-import-diag-section">',
      '<h4 class="json-import-diag-heading">دلایل تشخیص‌داده‌شده</h4>',
      `<ul class="json-import-diag-list">${causeItems}</ul>`,
      "</section>",
      tips.length
        ? [
            '<section class="json-import-diag-section">',
            '<h4 class="json-import-diag-heading">پیشنهاد برای رفع</h4>',
            `<ul class="json-import-diag-list">${tipItems}</ul>`,
            "</section>"
          ].join("")
        : "",
      safeReport.codeFrame
        ? [
            '<section class="json-import-diag-section">',
            '<h4 class="json-import-diag-heading">محل تقریبی خطا</h4>',
            `<pre class="json-import-diag-code" dir="ltr">${escapeHtmlText(safeReport.codeFrame)}</pre>`,
            "</section>"
          ].join("")
        : ""
    ].join("");

    panel.dataset.state = kind === "warn" ? "warn" : "error";
    panel.hidden = false;
    panel.innerHTML = body;
  }

  function resolveJsonImportDiagnostic(error) {
    const fallbackSummary = asText(error?.message, "ورود JSON متنی انجام نشد.").trim() || "ورود JSON متنی انجام نشد.";
    const diagnostic = error?.importDiagnostic;

    if (!diagnostic || typeof diagnostic !== "object") {
      return {
        title: "ورود JSON متنی ناموفق",
        summary: fallbackSummary,
        causes: [fallbackSummary],
        tips: ["JSON ورودی را با «راهنمای JSON» مقایسه کن و دوباره امتحان کن."],
        codeFrame: ""
      };
    }

    const causes = Array.isArray(diagnostic.causes)
      ? diagnostic.causes.map((item) => asText(item, "").trim()).filter(Boolean)
      : [];
    const tips = Array.isArray(diagnostic.tips)
      ? diagnostic.tips.map((item) => asText(item, "").trim()).filter(Boolean)
      : [];

    return {
      title: asText(diagnostic.title, "ورود JSON متنی ناموفق").trim() || "ورود JSON متنی ناموفق",
      summary: asText(diagnostic.summary, fallbackSummary).trim() || fallbackSummary,
      causes,
      tips,
      codeFrame: asText(diagnostic.codeFrame, "")
    };
  }

  function createJsonImportError(message, report = {}) {
    const summary = asText(message, "ورود JSON متنی انجام نشد.").trim() || "ورود JSON متنی انجام نشد.";
    const error = new Error(summary);
    error.importDiagnostic = {
      title: asText(report.title, "ورود JSON متنی ناموفق").trim() || "ورود JSON متنی ناموفق",
      summary: asText(report.summary, summary).trim() || summary,
      causes: Array.isArray(report.causes)
        ? report.causes.map((item) => asText(item, "").trim()).filter(Boolean)
        : [],
      tips: Array.isArray(report.tips) ? report.tips.map((item) => asText(item, "").trim()).filter(Boolean) : [],
      codeFrame: asText(report.codeFrame, "")
    };
    return error;
  }

  function parseJsonTextWithDiagnostics(rawText) {
    try {
      return {
        ok: true,
        value: JSON.parse(rawText),
        autoRepaired: false,
        repairActions: [],
        repairedText: asText(rawText, "")
      };
    } catch (error) {
      const parseMessage = asText(error?.message, "خطای ناشناخته در تحلیل JSON.");
      const location = resolveJsonParseLocation(rawText, parseMessage);
      const causes = [parseMessage];
      const tips = [
        "کلیدها و مقادیر متنی را فقط با کوتیشن دوتایی \"\" بنویس.",
        "بعد از آخرین آیتم در object/array از comma انتهایی استفاده نکن."
      ];
      let summary = "متن JSON از نظر سینتکس معتبر نیست.";
      let codeFrame = "";
      const repairAttempt = autoRepairJsonText(rawText, parseMessage);

      if (location) {
        summary = `متن JSON از نظر سینتکس معتبر نیست (خط ${location.line}، ستون ${location.column}).`;
        causes.unshift(`محل تقریبی خطا: خط ${location.line}، ستون ${location.column} (position ${location.position}).`);
        if (location.unexpectedChar === "'") {
          tips.unshift("از کوتیشن تکی ' استفاده نکن؛ فقط کوتیشن دوتایی \"\" مجاز است.");
        }
        if (location.trailingCommaLikely) {
          tips.unshift("به‌احتمال زیاد قبل از } یا ] یک comma اضافی گذاشته‌ای.");
        }
        if (/bad control character/i.test(parseMessage)) {
          tips.unshift(
            "داخل متن سوال کاراکتر کنترلی خام وجود دارد (مثل Tab یا Enter واقعی داخل string). سیستم سعی می‌کند خودکار آن را escape کند."
          );
        }
        if (/bad escaped character|bad escape|invalid escape/i.test(parseMessage)) {
          tips.unshift(
            "اگر فرمول LaTeX داری، بک‌اسلش‌ها را دوتایی بنویس (مثل \\\\mathbb، \\\\mathcal، \\\\cup). بخش اصلاح خودکار هم این مورد را تا حد ممکن ترمیم می‌کند."
          );
        }
        codeFrame = `${location.lineText}\n${" ".repeat(Math.max(0, location.column - 1))}^`;
      }

      if (repairAttempt.changed) {
        try {
          return {
            ok: true,
            value: JSON.parse(repairAttempt.text),
            autoRepaired: true,
            repairActions: repairAttempt.actions,
            repairedText: repairAttempt.text
          };
        } catch (repairError) {
          const repairMessage = asText(repairError?.message, "تلاش اصلاح خودکار انجام شد اما هنوز خطا وجود دارد.");
          causes.unshift(`تلاش اصلاح خودکار انجام شد ولی نامعتبر ماند: ${repairMessage}`);
          causes.push(`اقدام‌های اصلاح خودکار: ${repairAttempt.actions.join(" | ")}`);
          tips.unshift("متن را به یک JSON خالص (بدون توضیح اضافی بیرون از object/array) تبدیل کن.");
        }
      } else {
        tips.unshift("اگر متن را از جایی کپی کرده‌ای، code fence و توضیحات اضافه را حذف کن.");
      }

      return {
        ok: false,
        summary,
        causes,
        tips,
        codeFrame,
        autoRepaired: false,
        repairActions: [],
        repairedText: asText(rawText, "")
      };
    }
  }

  function autoRepairJsonText(rawText, errorText = "") {
    const original = asText(rawText, "");
    let text = original;
    const actions = [];

    const applyStep = (label, transform) => {
      const nextText = asText(transform(text), "");
      if (nextText !== text) {
        text = nextText;
        if (!actions.includes(label)) {
          actions.push(label);
        }
      }
    };

    // Step 0: extract first balanced JSON block
    applyStep("استخراج بلوک JSON اصلی", extractFirstBalancedJsonBlock);

    // Step 1: cleanup
    applyStep("پاکسازی BOM/کنترل‌کاراکتر/line ending", normalizeJsonInputPrelude);

    // Step 2: normalize quotes/comments
    applyStep("حذف پوسته ```json ... ```", stripJsonCodeFences);
    applyStep("نرمال‌سازی نقل‌قول‌های هوشمند", normalizeJsonSmartQuotes);
    applyStep("حذف کامنت‌های // و /* */", stripJsonComments);
    applyStep("تبدیل stringهای کوتیشن‌تکی به کوتیشن‌دوتایی", convertSingleQuotedJsonStrings);

    // Step 3: generic syntax repair
    applyStep("نرمال‌سازی جداکننده‌های غیر استاندارد", normalizeJsonDelimitersOutsideStrings);
    applyStep("تبدیل keyهای بدون کوتیشن به key معتبر JSON", quoteUnquotedJsonKeys);
    applyStep("ترمیم comma/colonهای جاافتاده بین آیتم‌ها", insertMissingJsonCommas);
    applyStep("حذف commaهای انتهایی قبل از ] یا }", removeJsonTrailingCommas);
    applyStep("تبدیل literalهای ناسازگار (True/False/None/undefined/Infinity/NaN)", normalizeJsonLiteralKeywordsOutsideStrings);

    // Step 4: string-level repair
    applyStep("اصلاح newline/control خام داخل string", escapeMultilineDoubleQuotedStrings);
    applyStep("Double-Escape بک‌اسلش‌های LaTeX در stringها", forceLatexDoubleEscapeInJsonStrings);
    applyStep("اصلاح escapeهای نامعتبر و literal کردن بک‌اسلش‌های لاتک", normalizeJsonStringEscapes);

    // Step 5: bracket balance
    applyStep("بالانس براکت‌ها/آکولادها", balanceJsonBrackets);

    // Step 6: use error text hints
    applyStep("اصلاح هدایت‌شده بر اساس ERROR_TEXT", (value) => applyErrorGuidedJsonRepair(value, errorText));

    // Step 7: mandatory self-validation pass
    applyStep("اعتبارسنجی نهایی state-machine و ترمیم", runJsonSelfValidationRepairPass);

    // final trims/fallbacks
    applyStep("تبدیل NDJSON به آرایه JSON", convertNdjsonToJsonArray);
    applyStep("تبدیل چند ریشه JSON به آرایه", wrapMultipleTopLevelJsonValuesAsArray);
    applyStep("حذف ; انتهایی", removeJsonTrailingSemicolon);
    applyStep("Trim خروجی به یک ریشه JSON معتبر", trimToSingleTopLevelJsonRoot);
    applyStep("حذف فاصله‌های نامرئی ناسازگار", normalizeNonBreakingSpaces);

    if (!isJsonParsable(text)) {
      for (let attempt = 0; attempt < 2; attempt += 1) {
        const before = text;
        text = runJsonSelfValidationRepairPass(text);
        text = normalizeJsonStringEscapes(text);
        text = insertMissingJsonCommas(text);
        text = removeJsonTrailingCommas(text);
        text = balanceJsonBrackets(text);
        text = trimToSingleTopLevelJsonRoot(text);
        if (text !== before && !actions.includes("تکرار ترمیم نهایی")) {
          actions.push("تکرار ترمیم نهایی");
        }
        if (isJsonParsable(text) || text === before) {
          break;
        }
      }
    }

    return {
      changed: text !== original || actions.length > 0,
      text,
      actions
    };
  }

  function isJsonParsable(rawText) {
    try {
      JSON.parse(asText(rawText, ""));
      return true;
    } catch {
      return false;
    }
  }

  function normalizeJsonInputPrelude(rawText) {
    let text = asText(rawText, "");
    text = text.replace(/^\ufeff/, "");
    text = text.replace(/\r\n?/g, "\n");
    text = text.replace(/[\u200b\u200c\u200d]/g, "");
    text = stripControlCharsOutsideStrings(text);
    return text;
  }

  function stripControlCharsOutsideStrings(rawText) {
    const source = asText(rawText, "");
    let output = "";
    let inString = false;
    let escaping = false;

    for (let i = 0; i < source.length; i += 1) {
      const char = source.charAt(i);
      const code = char.charCodeAt(0);
      if (char === "\u0000") {
        continue;
      }

      if (inString) {
        output += char;
        if (escaping) {
          escaping = false;
          continue;
        }
        if (char === "\\") {
          escaping = true;
          continue;
        }
        if (char === '"') {
          inString = false;
        }
        continue;
      }

      if (char === '"') {
        inString = true;
        output += char;
        continue;
      }

      if (code <= 0x1f && char !== "\n" && char !== "\t") {
        continue;
      }
      output += char;
    }
    return output;
  }

  function extractFirstBalancedJsonBlock(rawText) {
    const source = asText(rawText, "");
    if (!source.trim()) {
      return source;
    }

    const firstObject = source.indexOf("{");
    const firstArray = source.indexOf("[");
    const starts = [firstObject, firstArray].filter((value) => value >= 0);
    if (!starts.length) {
      return source.trim();
    }
    const start = Math.min(...starts);

    const segment = extractBalancedJsonSlice(source, start);
    if (segment) {
      return segment.trim();
    }
    return source.slice(start).trim();
  }

  function extractBalancedJsonSlice(sourceText, startIndex) {
    const source = asText(sourceText, "");
    const start = Math.max(0, Math.min(Number(startIndex) || 0, Math.max(0, source.length - 1)));
    let inString = false;
    let quoteChar = "";
    let escaping = false;
    const stack = [];

    const matchesPair = (openChar, closeChar) =>
      (openChar === "{" && closeChar === "}") || (openChar === "[" && closeChar === "]");

    for (let i = start; i < source.length; i += 1) {
      const char = source.charAt(i);

      if (inString) {
        if (escaping) {
          escaping = false;
          continue;
        }
        if (char === "\\") {
          escaping = true;
          continue;
        }
        if (char === quoteChar) {
          inString = false;
          quoteChar = "";
        }
        continue;
      }

      if (char === '"' || char === "'") {
        inString = true;
        quoteChar = char;
        continue;
      }

      if (char === "{" || char === "[") {
        stack.push(char);
        continue;
      }

      if (char === "}" || char === "]") {
        if (!stack.length) {
          continue;
        }
        const top = stack[stack.length - 1];
        if (!matchesPair(top, char)) {
          continue;
        }
        stack.pop();
        if (!stack.length) {
          return source.slice(start, i + 1);
        }
      }
    }

    return "";
  }

  function collectTopLevelJsonSegments(sourceText) {
    const source = asText(sourceText, "");
    const segments = [];
    let inString = false;
    let escaping = false;
    const stack = [];
    let segmentStart = -1;

    for (let i = 0; i < source.length; i += 1) {
      const char = source.charAt(i);
      if (inString) {
        if (escaping) {
          escaping = false;
          continue;
        }
        if (char === "\\") {
          escaping = true;
          continue;
        }
        if (char === '"') {
          inString = false;
        }
        continue;
      }

      if (char === '"') {
        inString = true;
        continue;
      }

      if (char === "{" || char === "[") {
        if (!stack.length) {
          segmentStart = i;
        }
        stack.push(char);
        continue;
      }

      if (char === "}" || char === "]") {
        if (!stack.length) {
          continue;
        }
        const top = stack[stack.length - 1];
        const matches = (top === "{" && char === "}") || (top === "[" && char === "]");
        if (!matches) {
          continue;
        }
        stack.pop();
        if (!stack.length && segmentStart >= 0) {
          segments.push({
            start: segmentStart,
            end: i + 1,
            text: source.slice(segmentStart, i + 1)
          });
          segmentStart = -1;
        }
      }
    }

    return segments;
  }

  function extractPrimaryJsonPayload(rawText) {
    const text = asText(rawText, "").trim();
    if (!text) {
      return text;
    }

    const segments = collectTopLevelJsonSegments(text);
    if (!segments.length) {
      const firstBrace = text.indexOf("{");
      const firstBracket = text.indexOf("[");
      const starts = [firstBrace, firstBracket].filter((value) => value >= 0);
      if (!starts.length) {
        return text;
      }
      return text.slice(Math.min(...starts)).trim();
    }

    const parseableSegments = segments.filter((segment) => isJsonParsable(segment.text));
    if (parseableSegments.length) {
      return parseableSegments
        .reduce((best, segment) => (segment.text.length > best.text.length ? segment : best), parseableSegments[0])
        .text.trim();
    }

    const longest = segments.reduce((best, current) => (current.text.length > best.text.length ? current : best), segments[0]);
    return longest.text.trim();
  }

  function stripJsonCodeFences(rawText) {
    const text = asText(rawText, "");
    const trimmed = text.trim();
    const exactFenceMatch = /^```(?:json|js|javascript)?\s*([\s\S]*?)\s*```$/i.exec(trimmed);
    if (exactFenceMatch) {
      return exactFenceMatch[1];
    }
    return text.replace(/^\s*```(?:json|js|javascript)?\s*/i, "").replace(/\s*```\s*$/i, "");
  }

  function extractLikelyJsonEnvelope(rawText) {
    const text = asText(rawText, "").trim();
    if (!text) {
      return text;
    }

    const startsAsJson = text.startsWith("{") || text.startsWith("[");
    const endsAsJson = text.endsWith("}") || text.endsWith("]");
    if (startsAsJson && endsAsJson) {
      return text;
    }

    const firstObject = text.indexOf("{");
    const firstArray = text.indexOf("[");
    const startCandidates = [firstObject, firstArray].filter((value) => value >= 0);
    if (!startCandidates.length) {
      return text;
    }
    const start = Math.min(...startCandidates);
    const startChar = text.charAt(start);
    const end = startChar === "{" ? text.lastIndexOf("}") : text.lastIndexOf("]");
    if (end <= start) {
      return text;
    }
    return text.slice(start, end + 1);
  }

  function unwrapJsonAssignment(rawText) {
    const text = asText(rawText, "").trim();
    const assignmentMatch =
      /^(?:(?:const|let|var)\s+[A-Za-z_$][\w$]*|module\.exports|exports\.[A-Za-z_$][\w$]*)\s*=\s*([\s\S]*?)\s*;?\s*$/i.exec(
        text
      );
    if (!assignmentMatch) {
      return text;
    }
    return asText(assignmentMatch[1], "").trim();
  }

  function normalizeJsonSmartQuotes(rawText) {
    return asText(rawText, "")
      .replace(/[“”«»„‟]/g, '"')
      .replace(/[’‘‚‛]/g, "'");
  }

  function normalizeNonBreakingSpaces(rawText) {
    return asText(rawText, "")
      .replace(/\u00a0/g, " ")
      .replace(/\u200b/g, "")
      .replace(/\u200c/g, "")
      .replace(/\u200d/g, "")
      .replace(/\ufeff/g, "");
  }

  function stripJsonComments(rawText) {
    const source = asText(rawText, "");
    let output = "";
    let inString = false;
    let quoteChar = "";
    let escaping = false;
    let inLineComment = false;
    let inBlockComment = false;

    for (let i = 0; i < source.length; i += 1) {
      const char = source.charAt(i);
      const next = source.charAt(i + 1);

      if (inLineComment) {
        if (char === "\n") {
          inLineComment = false;
          output += char;
        }
        continue;
      }

      if (inBlockComment) {
        if (char === "*" && next === "/") {
          inBlockComment = false;
          i += 1;
          continue;
        }
        if (char === "\n") {
          output += "\n";
        }
        continue;
      }

      if (inString) {
        output += char;
        if (escaping) {
          escaping = false;
          continue;
        }
        if (char === "\\") {
          escaping = true;
          continue;
        }
        if (char === quoteChar) {
          inString = false;
          quoteChar = "";
        }
        continue;
      }

      if (char === '"' || char === "'") {
        inString = true;
        quoteChar = char;
        output += char;
        continue;
      }

      if (char === "/" && next === "/") {
        inLineComment = true;
        i += 1;
        continue;
      }

      if (char === "/" && next === "*") {
        inBlockComment = true;
        i += 1;
        continue;
      }

      output += char;
    }

    return output;
  }

  function convertSingleQuotedJsonStrings(rawText) {
    const source = asText(rawText, "");
    let output = "";
    let inDouble = false;
    let inSingle = false;
    let escaping = false;

    for (let i = 0; i < source.length; i += 1) {
      const char = source.charAt(i);

      if (inDouble) {
        output += char;
        if (escaping) {
          escaping = false;
          continue;
        }
        if (char === "\\") {
          escaping = true;
          continue;
        }
        if (char === '"') {
          inDouble = false;
        }
        continue;
      }

      if (inSingle) {
        if (escaping) {
          if (char === '"') {
            output += '\\"';
          } else {
            output += char;
          }
          escaping = false;
          continue;
        }
        if (char === "\\") {
          output += "\\";
          escaping = true;
          continue;
        }
        if (char === "'") {
          output += '"';
          inSingle = false;
          continue;
        }
        if (char === '"') {
          output += '\\"';
          continue;
        }
        if (char === "\n") {
          output += "\\n";
          continue;
        }
        if (char === "\r") {
          continue;
        }
        output += char;
        continue;
      }

      if (char === '"') {
        inDouble = true;
        output += char;
        continue;
      }
      if (char === "'") {
        inSingle = true;
        output += '"';
        continue;
      }
      output += char;
    }

    return output;
  }

  function quoteUnquotedJsonKeys(rawText) {
    const source = asText(rawText, "");
    return source.replace(/([{,]\s*)([A-Za-z_\u0600-\u06ff][A-Za-z0-9_\-\u0600-\u06ff]*)(\s*:)/g, '$1"$2"$3');
  }

  function removeJsonTrailingCommas(rawText) {
    let text = asText(rawText, "");
    let previous = "";
    while (text !== previous) {
      previous = text;
      text = text.replace(/,\s*(?=[}\]])/g, "");
    }
    return text;
  }

  function removeJsonTrailingSemicolon(rawText) {
    return asText(rawText, "").replace(/;\s*$/g, "");
  }

  function normalizeJsonDelimitersOutsideStrings(rawText) {
    const source = asText(rawText, "");
    let output = "";
    let inString = false;
    let escaping = false;

    for (let i = 0; i < source.length; i += 1) {
      const char = source.charAt(i);
      if (inString) {
        output += char;
        if (escaping) {
          escaping = false;
          continue;
        }
        if (char === "\\") {
          escaping = true;
          continue;
        }
        if (char === '"') {
          inString = false;
        }
        continue;
      }

      if (char === '"') {
        inString = true;
        output += char;
        continue;
      }

      if (char === "،" || char === "，") {
        output += ",";
        continue;
      }
      if (char === "：" || char === "∶") {
        output += ":";
        continue;
      }
      if (char === "؛") {
        output += ",";
        continue;
      }
      output += char;
    }
    return output;
  }

  function escapeMultilineDoubleQuotedStrings(rawText) {
    const source = asText(rawText, "");
    let output = "";
    let inString = false;
    let escaping = false;

    for (let i = 0; i < source.length; i += 1) {
      const char = source.charAt(i);
      if (!inString) {
        if (char === '"') {
          inString = true;
        }
        output += char;
        continue;
      }

      if (escaping) {
        output += char;
        escaping = false;
        continue;
      }
      if (char === "\\") {
        output += char;
        escaping = true;
        continue;
      }
      if (char === '"') {
        output += char;
        inString = false;
        continue;
      }

      const charCode = char.charCodeAt(0);
      if (char === "\r") {
        if (source.charAt(i + 1) === "\n") {
          i += 1;
        }
        output += "\\n";
        continue;
      }
      if (char === "\n") {
        output += "\\n";
        continue;
      }
      if (char === "\t") {
        output += "\\t";
        continue;
      }
      if (char === "\b") {
        output += "\\b";
        continue;
      }
      if (char === "\f") {
        output += "\\f";
        continue;
      }
      if (char === "\u2028") {
        output += "\\u2028";
        continue;
      }
      if (char === "\u2029") {
        output += "\\u2029";
        continue;
      }
      if (charCode >= 0 && charCode <= 0x1f) {
        output += `\\u${charCode.toString(16).padStart(4, "0")}`;
        continue;
      }
      output += char;
    }

    return output;
  }

  function normalizeJsonStringEscapes(rawText) {
    const source = asText(rawText, "");
    let output = "";
    let inString = false;
    let escaping = false;

    for (let i = 0; i < source.length; i += 1) {
      const char = source.charAt(i);
      if (!inString) {
        if (char === '"') {
          inString = true;
        }
        output += char;
        continue;
      }

      if (escaping) {
        escaping = false;
        output += char;
        continue;
      }

      if (char === "\\") {
        const next = source.charAt(i + 1);
        if (!next) {
          output += "\\\\";
          continue;
        }

        if (next === "u") {
          const hex = source.slice(i + 2, i + 6);
          if (/^[0-9a-fA-F]{4}$/.test(hex)) {
            output += `\\u${hex}`;
            i += 5;
            continue;
          }
          output += "\\\\u";
          i += 1;
          continue;
        }

        if (next === '"' || next === "\\" || next === "/") {
          output += `\\${next}`;
          i += 1;
          continue;
        }

        if ("bfnrt".includes(next)) {
          const after = source.charAt(i + 2);
          const isLatexLike = /[A-Za-z]/.test(after);
          output += isLatexLike ? `\\\\${next}` : `\\${next}`;
          i += 1;
          continue;
        }

        if (next === "\n") {
          output += "\\n";
          i += 1;
          continue;
        }

        if (next === "\r") {
          if (source.charAt(i + 2) === "\n") {
            i += 1;
          }
          output += "\\n";
          i += 1;
          continue;
        }

        output += `\\\\${next}`;
        i += 1;
        continue;
      }

      if (char === '"') {
        if (isLikelyStringTerminator(source, i)) {
          inString = false;
          output += char;
        } else {
          output += '\\"';
        }
        continue;
      }

      const charCode = char.charCodeAt(0);
      if (char === "\r") {
        if (source.charAt(i + 1) === "\n") {
          i += 1;
        }
        output += "\\n";
        continue;
      }
      if (char === "\n") {
        output += "\\n";
        continue;
      }
      if (char === "\t") {
        output += "\\t";
        continue;
      }
      if (char === "\b") {
        output += "\\b";
        continue;
      }
      if (char === "\f") {
        output += "\\f";
        continue;
      }
      if (charCode >= 0 && charCode <= 0x1f) {
        output += `\\u${charCode.toString(16).padStart(4, "0")}`;
        continue;
      }

      output += char;
    }

    return output;
  }

  function forceLatexDoubleEscapeInJsonStrings(rawText) {
    const source = asText(rawText, "");
    let output = "";
    let inString = false;
    let escaping = false;

    for (let i = 0; i < source.length; i += 1) {
      const char = source.charAt(i);
      if (!inString) {
        if (char === '"') {
          inString = true;
        }
        output += char;
        continue;
      }

      if (escaping) {
        escaping = false;
        output += char;
        continue;
      }

      if (char === "\\") {
        const next = source.charAt(i + 1);
        if (!next) {
          output += "\\\\";
          continue;
        }
        if (next === "\\") {
          output += "\\\\";
          i += 1;
          continue;
        }
        if (next === "u") {
          const hex = source.slice(i + 2, i + 6);
          if (/^[0-9a-fA-F]{4}$/.test(hex)) {
            output += `\\u${hex}`;
            i += 5;
            continue;
          }
          output += "\\\\u";
          i += 1;
          continue;
        }
        if ("bfnrt".includes(next)) {
          const after = source.charAt(i + 2);
          output += /[A-Za-z]/.test(after) ? `\\\\${next}` : `\\${next}`;
          i += 1;
          continue;
        }
        if (next === '"' || next === "/") {
          output += `\\${next}`;
          i += 1;
          continue;
        }
        if (/[A-Za-z]/.test(next)) {
          output += `\\\\${next}`;
          i += 1;
          continue;
        }
        output += `\\\\${next}`;
        i += 1;
        continue;
      }

      if (char === '"') {
        inString = false;
      }
      output += char;
    }

    return output;
  }

  function findNextNonWhitespaceIndex(sourceText, fromIndex) {
    const source = asText(sourceText, "");
    let cursor = Math.max(0, Number(fromIndex) || 0);
    while (cursor < source.length && /\s/.test(source.charAt(cursor))) {
      cursor += 1;
    }
    return cursor < source.length ? cursor : -1;
  }

  function isLikelyStringTerminator(sourceText, quoteIndex) {
    const source = asText(sourceText, "");
    const nextIndex = findNextNonWhitespaceIndex(source, (Number(quoteIndex) || 0) + 1);
    if (nextIndex < 0) {
      return true;
    }
    const next = source.charAt(nextIndex);
    if (next === "," || next === "}" || next === "]" || next === ":" || next === '"' || next === "{" || next === "[") {
      return true;
    }
    if (next === "-" || /[0-9]/.test(next)) {
      return true;
    }
    if (next === "t" || next === "f" || next === "n") {
      return true;
    }
    return false;
  }

  function normalizeJsonLiteralKeywordsOutsideStrings(rawText) {
    const source = asText(rawText, "");
    const isTokenChar = (char) => /[A-Za-z0-9_\-.]/.test(char);
    const replacementMap = new Map([
      ["True", "true"],
      ["TRUE", "true"],
      ["False", "false"],
      ["FALSE", "false"],
      ["None", "null"],
      ["NONE", "null"],
      ["Null", "null"],
      ["NULL", "null"],
      ["nil", "null"],
      ["Nil", "null"],
      ["NIL", "null"],
      ["undefined", "null"],
      ["Undefined", "null"],
      ["UNDEFINED", "null"],
      ["NaN", '"NaN"'],
      ["nan", '"NaN"'],
      ["NAN", '"NaN"'],
      ["Infinity", '"Infinity"'],
      ["-Infinity", '"-Infinity"'],
      ["+Infinity", '"+Infinity"'],
      ["INF", '"Infinity"'],
      ["inf", '"Infinity"']
    ]);

    let output = "";
    let i = 0;
    let inString = false;
    let escaping = false;
    while (i < source.length) {
      const char = source.charAt(i);
      if (inString) {
        output += char;
        if (escaping) {
          escaping = false;
          i += 1;
          continue;
        }
        if (char === "\\") {
          escaping = true;
          i += 1;
          continue;
        }
        if (char === '"') {
          inString = false;
        }
        i += 1;
        continue;
      }

      if (char === '"') {
        inString = true;
        output += char;
        i += 1;
        continue;
      }

      if (/[A-Za-z+\-]/.test(char)) {
        let j = i + 1;
        while (j < source.length && isTokenChar(source.charAt(j))) {
          j += 1;
        }
        const token = source.slice(i, j);
        output += replacementMap.has(token) ? replacementMap.get(token) : token;
        i = j;
        continue;
      }

      output += char;
      i += 1;
    }

    return output;
  }

  function insertMissingJsonCommas(rawText) {
    const source = asText(rawText, "");
    const tokens = tokenizeLooseJson(source);
    if (!tokens.length) {
      return source;
    }

    const significantTokens = tokens.filter((token) => token.type !== "whitespace");
    const significantIndices = new Map();
    significantTokens.forEach((token, index) => {
      significantIndices.set(token, index);
    });

    const insertions = [];
    const insertionKeys = new Set();
    const stack = [];

    const recordInsertion = (position, value) => {
      const key = `${position}:${value}`;
      if (insertionKeys.has(key)) {
        return;
      }
      insertionKeys.add(key);
      insertions.push({ position, value });
    };

    const getNextSignificantToken = (token) => {
      const index = significantIndices.get(token);
      if (index === undefined) {
        return null;
      }
      return significantTokens[index + 1] || null;
    };

    for (const token of significantTokens) {
      const ctx = stack.length ? stack[stack.length - 1] : null;
      const nextToken = getNextSignificantToken(token);

      if (ctx?.type === "array" && ctx.state === "comma_or_end") {
        const missingComma =
          token.type !== "punct" ||
          (token.value !== "," && token.value !== "]");
        if (missingComma && isLooseJsonValueStart(token, nextToken)) {
          recordInsertion(token.start, ",");
          ctx.state = "value_or_end";
        }
      }

      if (ctx?.type === "object" && ctx.state === "comma_or_end") {
        const missingComma =
          token.type !== "punct" ||
          (token.value !== "," && token.value !== "}");
        if (missingComma && isLooseJsonObjectKeyStart(token, nextToken)) {
          recordInsertion(token.start, ",");
          ctx.state = "key_or_end";
        }
      }

      if (ctx?.type === "object" && ctx.state === "colon") {
        const hasColon = token.type === "punct" && token.value === ":";
        if (!hasColon && isLooseJsonValueStart(token, nextToken)) {
          recordInsertion(token.start, ":");
          ctx.state = "value";
        }
      }

      const activeCtx = stack.length ? stack[stack.length - 1] : null;

      if (token.type === "punct") {
        if (token.value === "{") {
          if (activeCtx?.type === "array" && activeCtx.state === "value_or_end") {
            activeCtx.state = "comma_or_end";
          } else if (activeCtx?.type === "object" && activeCtx.state === "value") {
            activeCtx.state = "comma_or_end";
          }
          stack.push({ type: "object", state: "key_or_end" });
          continue;
        }

        if (token.value === "[") {
          if (activeCtx?.type === "array" && activeCtx.state === "value_or_end") {
            activeCtx.state = "comma_or_end";
          } else if (activeCtx?.type === "object" && activeCtx.state === "value") {
            activeCtx.state = "comma_or_end";
          }
          stack.push({ type: "array", state: "value_or_end" });
          continue;
        }

        if (token.value === "}") {
          if (stack.length && stack[stack.length - 1].type === "object") {
            stack.pop();
          }
          const parent = stack.length ? stack[stack.length - 1] : null;
          if (parent?.type === "array" && parent.state === "value_or_end") {
            parent.state = "comma_or_end";
          } else if (parent?.type === "object" && parent.state === "value") {
            parent.state = "comma_or_end";
          }
          continue;
        }

        if (token.value === "]") {
          if (stack.length && stack[stack.length - 1].type === "array") {
            stack.pop();
          }
          const parent = stack.length ? stack[stack.length - 1] : null;
          if (parent?.type === "array" && parent.state === "value_or_end") {
            parent.state = "comma_or_end";
          } else if (parent?.type === "object" && parent.state === "value") {
            parent.state = "comma_or_end";
          }
          continue;
        }

        if (token.value === ",") {
          const parent = stack.length ? stack[stack.length - 1] : null;
          if (parent?.type === "array") {
            parent.state = "value_or_end";
          } else if (parent?.type === "object") {
            parent.state = "key_or_end";
          }
          continue;
        }

        if (token.value === ":") {
          const parent = stack.length ? stack[stack.length - 1] : null;
          if (parent?.type === "object") {
            parent.state = "value";
          }
          continue;
        }
      }

      if (!activeCtx) {
        continue;
      }

      if (activeCtx.type === "array" && activeCtx.state === "value_or_end" && isLooseJsonValueStart(token, nextToken)) {
        activeCtx.state = "comma_or_end";
        continue;
      }

      if (activeCtx.type === "object") {
        if (activeCtx.state === "key_or_end" && isLooseJsonObjectKeyStart(token, nextToken)) {
          activeCtx.state = "colon";
          continue;
        }
        if (activeCtx.state === "value" && isLooseJsonValueStart(token, nextToken)) {
          activeCtx.state = "comma_or_end";
          continue;
        }
      }
    }

    if (!insertions.length) {
      return source;
    }

    const sortedInsertions = [...insertions].sort((a, b) => {
      if (a.position !== b.position) {
        return a.position - b.position;
      }
      if (a.value === b.value) {
        return 0;
      }
      return a.value === ":" ? -1 : 1;
    });

    let output = "";
    let cursor = 0;
    for (const insertion of sortedInsertions) {
      const { position, value } = insertion;
      output += source.slice(cursor, position);
      output += value;
      cursor = position;
    }
    output += source.slice(cursor);
    return output;
  }

  function balanceJsonBrackets(rawText) {
    const source = asText(rawText, "");
    let output = "";
    let inString = false;
    let escaping = false;
    const stack = [];

    const getCloseForOpen = (openChar) => (openChar === "{" ? "}" : "]");
    const matchesPair = (openChar, closeChar) =>
      (openChar === "{" && closeChar === "}") || (openChar === "[" && closeChar === "]");

    for (let i = 0; i < source.length; i += 1) {
      const char = source.charAt(i);
      if (inString) {
        output += char;
        if (escaping) {
          escaping = false;
          continue;
        }
        if (char === "\\") {
          escaping = true;
          continue;
        }
        if (char === '"') {
          inString = false;
        }
        continue;
      }

      if (char === '"') {
        inString = true;
        output += char;
        continue;
      }

      if (char === "{" || char === "[") {
        stack.push(char);
        output += char;
        continue;
      }

      if (char === "}" || char === "]") {
        if (!stack.length) {
          continue;
        }
        while (stack.length && !matchesPair(stack[stack.length - 1], char)) {
          output += getCloseForOpen(stack.pop());
        }
        if (!stack.length) {
          continue;
        }
        stack.pop();
        output += char;
        continue;
      }

      output += char;
    }

    while (stack.length) {
      output += getCloseForOpen(stack.pop());
    }
    return output;
  }

  function trimToSingleTopLevelJsonRoot(rawText) {
    const source = asText(rawText, "").trim();
    if (!source) {
      return source;
    }
    if ((source.startsWith("{") || source.startsWith("[")) && isJsonParsable(source)) {
      return source;
    }

    const segments = collectTopLevelJsonSegments(source);
    if (!segments.length) {
      return source;
    }

    const parseableSegments = segments.filter((segment) => isJsonParsable(segment.text));
    if (parseableSegments.length) {
      return parseableSegments.reduce((best, segment) => (segment.text.length > best.text.length ? segment : best), parseableSegments[0]).text.trim();
    }

    return segments[0].text.trim();
  }

  function applyErrorGuidedJsonRepair(rawText, errorText) {
    const message = asText(errorText, "").trim();
    if (!message) {
      return asText(rawText, "");
    }

    let text = asText(rawText, "");
    const location = resolveJsonParseLocation(text, message);
    const hasEscapeIssue = /bad escaped character|bad escape|invalid escape|bad control character/i.test(message);
    const hasCommaIssue = /expected\s+','\s+or\s+'[}\]]'|expected property name|unexpected token/i.test(message);
    const hasStringIssue = /unterminated string|string literal|unexpected end of json input/i.test(message);

    if (hasEscapeIssue) {
      if (location && location.position >= 0) {
        text = repairJsonStringWindowAtPosition(text, location.position);
      }
      text = normalizeJsonStringEscapes(text);
      text = escapeMultilineDoubleQuotedStrings(text);
    }

    if (hasCommaIssue) {
      if (location && location.position >= 0) {
        text = insertCommaNearJsonPosition(text, location.position);
      }
      text = insertMissingJsonCommas(text);
      text = removeJsonTrailingCommas(text);
    }

    if (hasStringIssue) {
      text = normalizeJsonStringEscapes(text);
      text = escapeMultilineDoubleQuotedStrings(text);
    }

    return text;
  }

  function repairJsonStringWindowAtPosition(rawText, position) {
    const source = asText(rawText, "");
    const pos = Math.max(0, Math.min(Number(position) || 0, source.length));
    const start = Math.max(0, pos - 512);
    const end = Math.min(source.length, pos + 512);
    const windowText = source.slice(start, end);
    const repairedWindow = normalizeJsonStringEscapes(escapeMultilineDoubleQuotedStrings(windowText));
    if (repairedWindow === windowText) {
      return source;
    }
    return `${source.slice(0, start)}${repairedWindow}${source.slice(end)}`;
  }

  function insertCommaNearJsonPosition(rawText, position) {
    const source = asText(rawText, "");
    const pos = Math.max(0, Math.min(Number(position) || 0, source.length));
    let left = pos - 1;
    while (left >= 0 && /\s/.test(source.charAt(left))) {
      left -= 1;
    }
    const right = findNextNonWhitespaceIndex(source, pos);
    if (left < 0 || right < 0) {
      return source;
    }
    const leftChar = source.charAt(left);
    const rightChar = source.charAt(right);
    const leftLooksLikeValue = leftChar === '"' || leftChar === "}" || leftChar === "]" || /[0-9eE]/.test(leftChar);
    const rightLooksLikeValueStart =
      rightChar === '"' ||
      rightChar === "{" ||
      rightChar === "[" ||
      rightChar === "-" ||
      /[0-9]/.test(rightChar) ||
      rightChar === "t" ||
      rightChar === "f" ||
      rightChar === "n";
    if (!leftLooksLikeValue || !rightLooksLikeValueStart) {
      return source;
    }
    return `${source.slice(0, right)},${source.slice(right)}`;
  }

  function validateJsonStateMachine(rawText) {
    const source = asText(rawText, "");
    let inString = false;
    let escaping = false;
    const stack = [];

    const isHex = (char) => /[0-9a-fA-F]/.test(char);
    const matchesPair = (openChar, closeChar) =>
      (openChar === "{" && closeChar === "}") || (openChar === "[" && closeChar === "]");

    for (let i = 0; i < source.length; i += 1) {
      const char = source.charAt(i);

      if (inString) {
        if (escaping) {
          escaping = false;
          if (char === '"' || char === "\\" || char === "/" || char === "b" || char === "f" || char === "n" || char === "r" || char === "t") {
            continue;
          }
          if (char === "u") {
            const hex = source.slice(i + 1, i + 5);
            if (hex.length !== 4 || !hex.split("").every(isHex)) {
              return { ok: false, kind: "invalid_escape", index: i };
            }
            i += 4;
            continue;
          }
          return { ok: false, kind: "invalid_escape", index: i };
        }

        if (char === "\\") {
          escaping = true;
          continue;
        }
        if (char === '"') {
          inString = false;
          continue;
        }
        if (char === "\n" || char === "\r") {
          return { ok: false, kind: "raw_newline_in_string", index: i };
        }
        continue;
      }

      if (char === '"') {
        inString = true;
        continue;
      }

      if (char === "{" || char === "[") {
        stack.push(char);
        continue;
      }

      if (char === "}" || char === "]") {
        if (!stack.length) {
          return { ok: false, kind: "extra_closing_bracket", index: i };
        }
        const top = stack[stack.length - 1];
        if (!matchesPair(top, char)) {
          return { ok: false, kind: "mismatched_bracket", index: i };
        }
        stack.pop();
      }
    }

    if (inString || escaping) {
      return { ok: false, kind: "unclosed_string", index: source.length - 1 };
    }
    if (stack.length) {
      return { ok: false, kind: "unclosed_bracket", index: source.length - 1 };
    }
    const trimmed = source.trim();
    if (trimmed && !trimmed.endsWith("}") && !trimmed.endsWith("]")) {
      return { ok: false, kind: "invalid_root_tail", index: source.length - 1 };
    }

    return { ok: true, kind: "ok", index: -1 };
  }

  function runJsonSelfValidationRepairPass(rawText) {
    let text = asText(rawText, "");
    text = trimToSingleTopLevelJsonRoot(text);

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const stateCheck = validateJsonStateMachine(text);
      if (stateCheck.ok && isJsonParsable(text)) {
        return text;
      }

      if (stateCheck.kind === "invalid_escape" || stateCheck.kind === "raw_newline_in_string") {
        text = normalizeJsonStringEscapes(escapeMultilineDoubleQuotedStrings(text));
      } else if (stateCheck.kind === "unclosed_string") {
        text = `${text}"`;
      } else if (
        stateCheck.kind === "extra_closing_bracket" ||
        stateCheck.kind === "mismatched_bracket" ||
        stateCheck.kind === "unclosed_bracket" ||
        stateCheck.kind === "invalid_root_tail"
      ) {
        text = balanceJsonBrackets(text);
      }

      text = insertMissingJsonCommas(text);
      text = removeJsonTrailingCommas(text);
      text = trimToSingleTopLevelJsonRoot(text);
    }

    return text;
  }

  function tokenizeLooseJson(sourceText) {
    const source = asText(sourceText, "");
    const tokens = [];
    let i = 0;
    while (i < source.length) {
      const char = source.charAt(i);

      if (/\s/.test(char)) {
        const start = i;
        i += 1;
        while (i < source.length && /\s/.test(source.charAt(i))) {
          i += 1;
        }
        tokens.push({
          type: "whitespace",
          value: source.slice(start, i),
          start,
          end: i
        });
        continue;
      }

      if (char === '"') {
        const start = i;
        i += 1;
        let escaping = false;
        while (i < source.length) {
          const current = source.charAt(i);
          if (escaping) {
            escaping = false;
            i += 1;
            continue;
          }
          if (current === "\\") {
            escaping = true;
            i += 1;
            continue;
          }
          if (current === '"') {
            i += 1;
            break;
          }
          i += 1;
        }
        tokens.push({
          type: "string",
          value: source.slice(start, i),
          start,
          end: i
        });
        continue;
      }

      if ("{}[],:".includes(char)) {
        tokens.push({
          type: "punct",
          value: char,
          start: i,
          end: i + 1
        });
        i += 1;
        continue;
      }

      if (char === "-" || /[0-9]/.test(char)) {
        const start = i;
        i += 1;
        while (i < source.length && /[0-9eE+\-.]/.test(source.charAt(i))) {
          i += 1;
        }
        tokens.push({
          type: "number",
          value: source.slice(start, i),
          start,
          end: i
        });
        continue;
      }

      if (/[A-Za-z_\u0600-\u06ff]/.test(char)) {
        const start = i;
        i += 1;
        while (i < source.length && /[A-Za-z0-9_\-\u0600-\u06ff]/.test(source.charAt(i))) {
          i += 1;
        }
        const value = source.slice(start, i);
        const isLiteral = value === "true" || value === "false" || value === "null";
        tokens.push({
          type: isLiteral ? "literal" : "identifier",
          value,
          start,
          end: i
        });
        continue;
      }

      tokens.push({
        type: "other",
        value: char,
        start: i,
        end: i + 1
      });
      i += 1;
    }
    return tokens;
  }

  function isLooseJsonValueStart(token, nextToken) {
    if (!token) {
      return false;
    }
    if (token.type === "string") {
      return !isLooseJsonObjectKeyStart(token, nextToken);
    }
    if (token.type === "number" || token.type === "literal") {
      return true;
    }
    if (token.type === "punct" && (token.value === "{" || token.value === "[")) {
      return true;
    }
    return false;
  }

  function isLooseJsonObjectKeyStart(token, nextToken) {
    if (!token || !nextToken) {
      return false;
    }
    const keyLike = token.type === "string" || token.type === "identifier";
    return keyLike && nextToken.type === "punct" && nextToken.value === ":";
  }

  function wrapMultipleTopLevelJsonValuesAsArray(rawText) {
    const source = asText(rawText, "").trim();
    if (!source) {
      return source;
    }
    if (source.startsWith("[") && source.endsWith("]")) {
      return source;
    }

    const segments = [];
    let inString = false;
    let escaping = false;
    let depth = 0;
    let segmentStart = -1;

    for (let i = 0; i < source.length; i += 1) {
      const char = source.charAt(i);
      if (inString) {
        if (escaping) {
          escaping = false;
          continue;
        }
        if (char === "\\") {
          escaping = true;
          continue;
        }
        if (char === '"') {
          inString = false;
        }
        continue;
      }

      if (char === '"') {
        inString = true;
        continue;
      }

      if ((char === "{" || char === "[") && depth === 0) {
        segmentStart = i;
      }

      if (char === "{" || char === "[") {
        depth += 1;
      } else if ((char === "}" || char === "]") && depth > 0) {
        depth -= 1;
        if (depth === 0 && segmentStart >= 0) {
          segments.push(source.slice(segmentStart, i + 1).trim());
          segmentStart = -1;
        }
      }
    }

    if (depth !== 0 || segments.length < 2) {
      return source;
    }

    const joined = segments.filter(Boolean).join(",\n");
    if (!joined) {
      return source;
    }
    return `[\n${joined}\n]`;
  }

  function convertNdjsonToJsonArray(rawText) {
    const source = asText(rawText, "").trim();
    if (!source) {
      return source;
    }
    if (source.startsWith("{") || source.startsWith("[")) {
      return source;
    }

    const lines = source
      .split(/\r\n|\n|\r/)
      .map((line) => line.trim())
      .filter(Boolean);
    if (lines.length < 2) {
      return source;
    }

    const normalizedLines = [];
    for (const line of lines) {
      const normalized = line.replace(/,\s*$/g, "").trim();
      if (!normalized) {
        continue;
      }
      try {
        JSON.parse(normalized);
        normalizedLines.push(normalized);
      } catch {
        return source;
      }
    }

    if (normalizedLines.length < 2) {
      return source;
    }
    return `[\n${normalizedLines.join(",\n")}\n]`;
  }

  function resolveJsonParseLocation(rawText, parseMessage) {
    const source = asText(rawText, "");
    const message = asText(parseMessage, "");
    const positionMatch = /position\s+(\d+)/i.exec(message);
    if (positionMatch) {
      const index = Number.parseInt(positionMatch[1], 10);
      if (Number.isFinite(index)) {
        const safeIndex = Math.max(0, Math.min(index, source.length));
        const lineColumn = resolveLineColumnFromIndex(source, safeIndex);
        const unexpectedChar = source.charAt(safeIndex) || "";
        const previousChar = findPreviousNonWhitespaceChar(source, safeIndex);
        return {
          position: safeIndex,
          line: lineColumn.line,
          column: lineColumn.column,
          lineText: lineColumn.lineText,
          unexpectedChar,
          trailingCommaLikely: (unexpectedChar === "}" || unexpectedChar === "]") && previousChar === ","
        };
      }
    }

    const lineColumnMatch = /line\s+(\d+)\s+column\s+(\d+)/i.exec(message);
    if (lineColumnMatch) {
      const line = Number.parseInt(lineColumnMatch[1], 10);
      const column = Number.parseInt(lineColumnMatch[2], 10);
      if (Number.isFinite(line) && Number.isFinite(column)) {
        const lineText = getLineTextByNumber(source, line);
        return {
          position: -1,
          line,
          column: Math.max(1, column),
          lineText,
          unexpectedChar: lineText.charAt(Math.max(0, column - 1)) || "",
          trailingCommaLikely: false
        };
      }
    }

    return null;
  }

  function resolveLineColumnFromIndex(sourceText, index) {
    const source = asText(sourceText, "");
    const safeIndex = Math.max(0, Math.min(Number(index) || 0, source.length));
    let line = 1;
    let lineStart = 0;
    for (let i = 0; i < safeIndex; i += 1) {
      const char = source.charAt(i);
      if (char === "\n") {
        line += 1;
        lineStart = i + 1;
      } else if (char === "\r") {
        line += 1;
        if (source.charAt(i + 1) === "\n") {
          i += 1;
        }
        lineStart = i + 1;
      }
    }

    let lineEnd = source.indexOf("\n", lineStart);
    if (lineEnd < 0) {
      lineEnd = source.length;
    }
    const lineText = source.slice(lineStart, lineEnd).replace(/\r$/, "");
    return {
      line,
      column: safeIndex - lineStart + 1,
      lineText
    };
  }

  function getLineTextByNumber(sourceText, lineNumber) {
    const source = asText(sourceText, "");
    const lines = source.split(/\r\n|\n|\r/);
    const index = Math.max(0, (Number(lineNumber) || 1) - 1);
    return lines[index] || "";
  }

  function findPreviousNonWhitespaceChar(sourceText, index) {
    const source = asText(sourceText, "");
    let cursor = Math.max(0, Math.min(Number(index) || 0, source.length)) - 1;
    while (cursor >= 0) {
      const char = source.charAt(cursor);
      if (!/\s/.test(char)) {
        return char;
      }
      cursor -= 1;
    }
    return "";
  }

  function buildJsonPayloadShapeDiagnostic(payload) {
    const causes = [];
    const tips = [
      "یکی از این ریشه‌ها را استفاده کن: {\"subjects\":[...]} یا [...] یا {\"questions\":[...]} یا یک آبجکت سوال تکی.",
      "برای هر سوال، حداقل question_text یا question باید مقدار داشته باشد.",
      "اگر سوال‌ها داخل wrapperهایی مثل data/payload/results/items هستند، همان wrapper را نگه دار؛ سیستم خودش استخراج می‌کند.",
      "برای ورود مستقل نمودار درختی از فرمت جدا استفاده کن: {\"type\":\"chapter-tree\",\"trees\":[{\"subject\":\"...\",\"chapter\":\"...\",\"tree\":[...]}]}."
    ];

    if (Array.isArray(payload)) {
      if (!payload.length) {
        causes.push("ریشه JSON یک آرایه خالی است و هیچ سوالی داخل آن وجود ندارد.");
      } else {
        causes.push(`ریشه JSON آرایه است (${payload.length} آیتم)، اما هیچ آیتمی به سوال معتبر تبدیل نشد.`);
        causes.push(`نمونه نوع آیتم اول: ${describeJsonImportRowShape(payload[0])}.`);
      }
      return { causes, tips };
    }

    if (payload && typeof payload === "object") {
      const keys = Object.keys(payload);
      if ("questions" in payload && !Array.isArray(payload.questions)) {
        causes.push("کلید questions وجود دارد اما مقدار آن آرایه نیست.");
      }
      if ("subjects" in payload && !Array.isArray(payload.subjects)) {
        causes.push("کلید subjects وجود دارد اما مقدار آن آرایه نیست.");
      }
      if ("question" in payload || "question_text" in payload) {
        causes.push("آبجکت سوال تکی تشخیص داده شد اما فیلدهای ضروری دیگر ناقص است.");
      } else if (!("questions" in payload) && !("subjects" in payload)) {
        causes.push("در ریشه JSON هیچ‌کدام از کلیدهای subjects یا questions یافت نشد.");
      }
      if (keys.length) {
        const previewKeys = keys.slice(0, 12).join(", ");
        causes.push(`کلیدهای سطح ریشه: ${previewKeys}${keys.length > 12 ? ", ..." : ""}.`);
      }
      return { causes, tips };
    }

    causes.push(`نوع ریشه JSON باید object یا array باشد، اما مقدار فعلی از نوع ${typeof payload} است.`);
    return { causes, tips };
  }

  function summarizeJsonImportRowValidation(rows, options = {}) {
    const sampleMessages = [];
    let invalidRows = 0;
    let autoCarryForwardRows = 0;
    let fallbackSubjectName = asText(options.fallbackSubjectName, "").trim();
    let fallbackChapterName = asText(options.fallbackChapterName, "").trim();
    const forcedSubjectName = asText(options.forcedSubjectName, "").trim();
    const forcedChapterName = asText(options.forcedChapterName, "").trim();

    (rows || []).forEach((row, index) => {
      const inspection = inspectJsonImportRow(row, {
        ...options,
        forcedSubjectName,
        forcedChapterName,
        fallbackSubjectName,
        fallbackChapterName
      });
      if (inspection.valid) {
        if (inspection.resolvedSubjectName) {
          fallbackSubjectName = inspection.resolvedSubjectName;
        }
        if (inspection.resolvedChapterName) {
          fallbackChapterName = inspection.resolvedChapterName;
        }
        if (inspection.usedFallbackSubject || inspection.usedFallbackChapter) {
          autoCarryForwardRows += 1;
        }
        return;
      }
      invalidRows += 1;
      if (sampleMessages.length >= 6) {
        return;
      }
      const rowShape = describeJsonImportRowShape(row);
      sampleMessages.push(`ردیف ${index + 1} (${rowShape}): ${inspection.reasons.join(" | ")}`);
    });

    return {
      totalRows: Array.isArray(rows) ? rows.length : 0,
      invalidRows,
      validRows: Math.max(0, (Array.isArray(rows) ? rows.length : 0) - invalidRows),
      sampleMessages,
      autoCarryForwardRows
    };
  }

  function inspectJsonImportRow(row, options = {}) {
    const reasons = [];
    const rowObject = coerceQuestionRowInputToObject(row);
    if (!rowObject || typeof rowObject !== "object" || Array.isArray(rowObject)) {
      return {
        valid: false,
        reasons: ["این ردیف باید یک object باشد (مثال: { ... })."],
        resolvedSubjectName: "",
        resolvedChapterName: "",
        usedFallbackSubject: false,
        usedFallbackChapter: false
      };
    }

    const forcedSubjectName = asText(options.forcedSubjectName, "").trim();
    const forcedChapterName = asText(options.forcedChapterName, "").trim();
    const fallbackSubjectName = asText(options.fallbackSubjectName, "").trim();
    const fallbackChapterName = asText(options.fallbackChapterName, "").trim();
    const extractedSubjectName = extractImportedSubjectName(rowObject);
    const extractedChapterName = extractImportedChapterName(rowObject);
    const questionText = extractImportedQuestionText(rowObject);

    const resolvedSubjectName = forcedSubjectName || extractedSubjectName || fallbackSubjectName;
    const resolvedChapterName = forcedChapterName || extractedChapterName || fallbackChapterName;
    const usedFallbackSubject = !forcedSubjectName && !extractedSubjectName && !!fallbackSubjectName;
    const usedFallbackChapter = !forcedChapterName && !extractedChapterName && !!fallbackChapterName;

    if (!questionText) {
      reasons.push("فیلد الزامی question_text یا question خالی/ناموجود است.");
    }

    if (!resolvedSubjectName) {
      reasons.push("فیلد subject (یا معادل‌هایش) خالی/ناموجود است.");
    }

    if (!resolvedChapterName) {
      reasons.push("فیلد chapter (یا معادل‌هایش) خالی/ناموجود است.");
    }

    return {
      valid: reasons.length === 0,
      reasons,
      resolvedSubjectName,
      resolvedChapterName,
      usedFallbackSubject,
      usedFallbackChapter
    };
  }

  function describeJsonImportRowShape(row) {
    if (row === null) {
      return "null";
    }
    if (Array.isArray(row)) {
      return "array";
    }
    if (typeof row !== "object") {
      return typeof row;
    }

    const keys = Object.keys(row).slice(0, 7);
    if (!keys.length) {
      return "object بدون کلید";
    }
    return `keys: ${keys.join(", ")}${Object.keys(row).length > 7 ? ", ..." : ""}`;
  }

  async function handleJsonTextImport() {
    const jsonTextInput = document.getElementById("jsonImportText");
    if (!(jsonTextInput instanceof HTMLTextAreaElement)) {
      return;
    }

    clearJsonImportDiagnostics();

    try {
      const summary = await importQuestionsFromJsonText(jsonTextInput.value);
      if (summary.importKind === "tree") {
        const treeInvalidRows = Number(summary.invalidRows) || 0;
        const hasTreeWarnings = treeInvalidRows > 0;
        if (hasTreeWarnings) {
          renderJsonImportDiagnostics(
            {
              title: "گزارش ورود JSON درختی",
              summary: "ورود نمودار درختی انجام شد، اما بعضی ردیف‌ها نامعتبر بودند.",
              causes: [
                `${treeInvalidRows} ردیف به‌دلیل نبود subject/chapter معتبر یا tree قابل‌تحلیل نادیده گرفته شد.`,
                ...(summary.invalidRowMessages || [])
              ],
              tips: [
                "برای هر ردیف tree، نام subject و chapter را مشخص کن.",
                "فرمت tree باید آرایه/آبجکت باشد (یا [] برای خالی‌کردن نمودار فصل)."
              ]
            },
            "warn"
          );
        } else {
          clearJsonImportDiagnostics();
        }

        const updatedCount = Number(summary.updatedCount) || 0;
        const unchangedCount = Number(summary.unchangedCount) || 0;
        const clearedCount = Number(summary.clearedCount) || 0;
        const newSubjects = Number(summary.newSubjects) || 0;
        const newChapters = Number(summary.newChapters) || 0;
        const autoFixSuffix = summary.autoRepairApplied ? " (اصلاح خودکار JSON انجام شد)" : "";
        const details = ` (${newSubjects} درس جدید، ${newChapters} فصل جدید، ${clearedCount} فصل با درخت خالی)`;
        const statusLead =
          updatedCount > 0
            ? `${updatedCount} درخت فصل ثبت/به‌روزرسانی شد.`
            : unchangedCount > 0
              ? "درخت‌های ارسالی معتبر بودند اما تغییری نسبت به داده فعلی نداشتند."
              : "ورود درختی انجام شد.";
        setStatus(`${statusLead}${details}${autoFixSuffix}`, "ok");
        showToast("ورود JSON درختی با موفقیت انجام شد.", "success");
        jsonTextInput.value = "";
        return;
      }
      const hasSkippedRows = summary.skippedCount > 0;
      const hasAutoRepair = summary.autoRepairApplied === true;
      const hasCarryForward = summary.autoCarryForwardRows > 0;
      const hasDuplicateRows = Number(summary.duplicateCount) > 0;
      const hasTreeInvalidRows = Number(summary.treeInvalidRows) > 0;
      const treeUpdatedCount = Number(summary.treeUpdatedCount) || 0;
      const treeClearedCount = Number(summary.treeClearedCount) || 0;
      const treeSuffix =
        treeUpdatedCount > 0 || treeClearedCount > 0
          ? ` (درختی: ${treeUpdatedCount} فصل به‌روزرسانی شد، ${treeClearedCount} فصل خالی شد)`
          : "";
      const shouldShowWarningPanel = hasSkippedRows || hasAutoRepair || hasCarryForward || hasDuplicateRows || hasTreeInvalidRows;
      const autoFixSuffix = hasAutoRepair || hasCarryForward ? " (اصلاح خودکار اعمال شد)" : "";
      const duplicateSuffix = hasDuplicateRows ? ` (${summary.duplicateCount} سوال تکراری اضافه نشد)` : "";

      if (shouldShowWarningPanel) {
        const warningCauses = [];
        const warningTips = [];

        if (hasAutoRepair) {
          warningCauses.push("متن JSON به‌صورت خودکار اصلاح شد و سپس با موفقیت پردازش شد.");
          if (Array.isArray(summary.autoRepairActions) && summary.autoRepairActions.length) {
            warningCauses.push(`اقدام‌های اصلاح خودکار: ${summary.autoRepairActions.join(" | ")}`);
          }
          warningTips.push("برای نتیجه پایدارتر، از این به بعد JSON را با کوتیشن دوتایی و بدون کامنت وارد کن.");
        }

        if (hasCarryForward) {
          warningCauses.push(
            `${summary.autoCarryForwardRows} ردیف با استفاده از subject/chapter ردیف قبلی تکمیل شد (حذف خطای قابل‌حل).`
          );
          warningTips.push("اگر می‌خواهی داده قابل‌خواندن‌تر باشد، subject/chapter را برای همه ردیف‌ها صریح وارد کن.");
        }

        if (hasSkippedRows) {
          const skippedLabel = summary.skippedCount === 1 ? "۱ ردیف" : `${summary.skippedCount} ردیف`;
          warningCauses.push(`${skippedLabel} هنوز نامعتبر بود و رد شد.`);
          warningCauses.push(...(summary.invalidRowMessages || []));
          warningTips.push(
            ...(summary.lockedToActiveChapter
              ? [
                  "در صفحه فصل، فیلدهای subject/chapter نادیده گرفته می‌شوند.",
                  "برای هر ردیف فقط وجود question_text یا question کافی است."
                ]
              : [
                  "خارج از صفحه فصل، هر ردیف باید subject و chapter داشته باشد.",
                  "برای هر ردیف فقط وجود question_text یا question کافی است."
                ])
          );
        }

        if (hasDuplicateRows) {
          warningCauses.push(`${summary.duplicateCount} ردیف تکراری تشخیص داده شد و اضافه نشد.`);
          warningTips.push("برای جلوگیری از تکرار، متن question/question_text را قبل از ورود چک کن.");
        }
        if (hasTreeInvalidRows) {
          warningCauses.push(`${summary.treeInvalidRows} ردیف tree نامعتبر بود و اعمال نشد.`);
          warningTips.push("برای tree از subject + chapter + tree(array/object) استفاده کن.");
        }

        const warningSummary = hasSkippedRows
          ? "بخشی از داده‌ها وارد شد، اما هنوز چند ردیف نامعتبر بود."
          : hasDuplicateRows
            ? "ورود انجام شد، اما برخی ردیف‌های تکراری نادیده گرفته شدند."
            : "ورود انجام شد و خطاهای قابل‌حل به‌صورت خودکار اصلاح شدند.";
        renderJsonImportDiagnostics(
          {
            title: "گزارش ورود JSON متنی",
            summary: warningSummary,
            causes: warningCauses,
            tips: warningTips
          },
          "warn"
        );
      } else {
        clearJsonImportDiagnostics();
      }

      if (summary.lockedToActiveChapter) {
        if (!hasSkippedRows) {
          setStatus(
            `${summary.addedCount} سوال به فصل «${summary.chapterName}» از درس «${summary.subjectName}» اضافه شد.${duplicateSuffix}${autoFixSuffix}${treeSuffix}`,
            "ok"
          );
        } else {
          const skippedLabel = summary.skippedCount === 1 ? "۱ ردیف" : `${summary.skippedCount} ردیف`;
          setStatus(
            `${summary.addedCount} سوال اضافه شد، اما ${skippedLabel} نامعتبر بود و رد شد.${duplicateSuffix}${autoFixSuffix}${treeSuffix}`,
            "ok"
          );
        }
      } else {
        if (!hasSkippedRows) {
          const details = ` (${summary.newSubjects} درس جدید، ${summary.newChapters} فصل جدید)`;
          setStatus(`${summary.addedCount} سوال از متن JSON اضافه شد.${details}${duplicateSuffix}${autoFixSuffix}${treeSuffix}`, "ok");
        } else {
          const skippedLabel = summary.skippedCount === 1 ? "۱ ردیف" : `${summary.skippedCount} ردیف`;
          setStatus(
            `${summary.addedCount} سوال اضافه شد، اما ${skippedLabel} نامعتبر بود و رد شد.${duplicateSuffix}${autoFixSuffix}${treeSuffix}`,
            "ok"
          );
        }
      }
      if (summary.addedCount > 0) {
        showToast("ورود JSON متنی با موفقیت انجام شد.", "success");
      } else if (hasDuplicateRows) {
        showToast("سوال جدیدی اضافه نشد؛ تمام ردیف‌ها تکراری بودند.", "info");
      } else {
        showToast("ورود JSON متنی پردازش شد.", "info");
      }
      jsonTextInput.value = "";
    } catch (error) {
      console.error(error);
      const diagnostic = resolveJsonImportDiagnostic(error);
      renderJsonImportDiagnostics(diagnostic, "error");
      setStatus(diagnostic.summary, "error");
      showToast("ورود JSON متنی ناموفق بود. جزئیات عیب‌یابی نمایش داده شد.", "error");
    }
  }

  function clearJsonTextImportInput() {
    const jsonTextInput = document.getElementById("jsonImportText");
    if (!(jsonTextInput instanceof HTMLTextAreaElement)) {
      return;
    }

    jsonTextInput.value = "";
    clearJsonImportDiagnostics();
    jsonTextInput.focus();
  }

  function normalizeJsonImportModeValue(value) {
    const key = asText(value, "")
      .trim()
      .toLowerCase()
      .replace(/[_\s]+/g, "-");
    if (!key) {
      return "";
    }
    if (["tree", "chapter-tree", "chaptertree", "mindmap", "mind-map", "map-tree"].includes(key)) {
      return "tree";
    }
    if (["question", "questions", "bank", "question-bank", "questionbank"].includes(key)) {
      return "questions";
    }
    return "";
  }

  function resolveJsonPayloadImportMode(payload) {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return "";
    }
    const modeCandidates = [
      payload.importType,
      payload.import_type,
      payload.mode,
      payload.type,
      payload.schema,
      payload.format
    ];
    for (const candidate of modeCandidates) {
      const mode = normalizeJsonImportModeValue(candidate);
      if (mode) {
        return mode;
      }
    }
    return "";
  }

  function hasChapterTreePayloadSignal(payload, depth = 0) {
    if (depth > 7) {
      return false;
    }
    if (Array.isArray(payload)) {
      return payload.some((item) => hasChapterTreePayloadSignal(item, depth + 1));
    }
    if (!payload || typeof payload !== "object") {
      return false;
    }

    const source = unwrapQuestionRowWrapper(payload);
    const directTree = resolveChapterTreeSource(source);
    if (directTree.found) {
      return true;
    }

    if (Array.isArray(source.subjects)) {
      const subjectHasTree = source.subjects.some((subject) =>
        Array.isArray(subject?.chapters)
          && subject.chapters.some((chapter) => resolveChapterTreeSource(chapter).found)
      );
      if (subjectHasTree) {
        return true;
      }
    }

    const nestedKeys = [
      "trees",
      "chapterTrees",
      "chapter_trees",
      "chapterTreePayload",
      "chapter_tree_payload",
      "chapterTree",
      "mindmaps",
      "maps",
      "data",
      "payload",
      "result",
      "results",
      "response",
      "body",
      "content",
      "dataset"
    ];
    for (const key of nestedKeys) {
      if (hasChapterTreePayloadSignal(source[key], depth + 1)) {
        return true;
      }
    }

    return false;
  }

  function resolveChapterTreeSource(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return { found: false, value: null, key: "" };
    }
    const treeKeys = ["tree", "children", "mindmap", "mindMap", "map", "nodes", "branches"];
    for (const key of treeKeys) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        return { found: true, value: value[key], key };
      }
    }
    const chapterObject = value.chapter;
    if (chapterObject && typeof chapterObject === "object" && !Array.isArray(chapterObject)) {
      for (const key of treeKeys) {
        if (Object.prototype.hasOwnProperty.call(chapterObject, key)) {
          return { found: true, value: chapterObject[key], key: `chapter.${key}` };
        }
      }
    }
    return { found: false, value: null, key: "" };
  }

  function extractSingleChapterTreeRow(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return null;
    }
    const source = unwrapQuestionRowWrapper(value);
    const treeSource = resolveChapterTreeSource(source);
    if (!treeSource.found) {
      return null;
    }
    return {
      subjectName: extractImportedSubjectName(source),
      chapterName: extractImportedChapterName(source),
      treePayload: treeSource.value
    };
  }

  function extractSubjectChapterTreeRows(subjects) {
    const rows = [];
    (subjects || []).forEach((subjectNode) => {
      if (!subjectNode || typeof subjectNode !== "object") {
        return;
      }
      const subjectName = resolveImportedNameCandidate(subjectNode.name ?? subjectNode.subject ?? subjectNode.title);
      const chapters = Array.isArray(subjectNode.chapters) ? subjectNode.chapters : [];
      chapters.forEach((chapterNode) => {
        if (!chapterNode || typeof chapterNode !== "object") {
          return;
        }
        const treeSource = resolveChapterTreeSource(chapterNode);
        if (!treeSource.found) {
          return;
        }
        rows.push({
          subjectName,
          chapterName: resolveImportedNameCandidate(chapterNode.name ?? chapterNode.chapter ?? chapterNode.title),
          treePayload: treeSource.value
        });
      });
    });
    return rows;
  }

  function extractChapterTreeRowsFromJsonPayload(payload, depth = 0) {
    if (depth > 7) {
      return [];
    }
    if (Array.isArray(payload)) {
      return payload.flatMap((item) => extractChapterTreeRowsFromJsonPayload(item, depth + 1));
    }
    if (!payload || typeof payload !== "object") {
      return [];
    }

    const source = unwrapQuestionRowWrapper(payload);
    let rows = [];

    if (Array.isArray(source.subjects)) {
      rows = rows.concat(extractSubjectChapterTreeRows(source.subjects));
    }

    const directRow = extractSingleChapterTreeRow(source);
    if (directRow) {
      rows.push(directRow);
    }

    const collectionKeys = ["trees", "chapterTrees", "chapter_trees", "mindmaps", "maps"];
    collectionKeys.forEach((key) => {
      const value = source[key];
      if (Array.isArray(value)) {
        rows = rows.concat(value.flatMap((item) => extractChapterTreeRowsFromJsonPayload(item, depth + 1)));
      } else if (value && typeof value === "object") {
        rows = rows.concat(extractChapterTreeRowsFromJsonPayload(value, depth + 1));
      }
    });

    const wrapperKeys = [
      "data",
      "payload",
      "result",
      "results",
      "response",
      "body",
      "content",
      "dataset",
      "chapterTreePayload",
      "chapter_tree_payload",
      "chapterTree"
    ];
    wrapperKeys.forEach((key) => {
      const nested = source[key];
      if (!nested) {
        return;
      }
      rows = rows.concat(extractChapterTreeRowsFromJsonPayload(nested, depth + 1));
    });

    return rows;
  }

  function importChapterTreesFromJsonPayload(payload, options = {}) {
    const rows = extractChapterTreeRowsFromJsonPayload(payload);
    const hasSignal = hasChapterTreePayloadSignal(payload);
    if (!rows.length) {
      return {
        handled: false,
        hasSignal
      };
    }

    const activeTarget = resolveActiveChapterImportTarget();
    let validRows = 0;
    let invalidRows = 0;
    let updatedCount = 0;
    let unchangedCount = 0;
    let clearedCount = 0;
    let newSubjects = 0;
    let newChapters = 0;
    const invalidRowMessages = [];

    rows.forEach((row, index) => {
      const rawSubjectName = asText(row?.subjectName, "").trim();
      const rawChapterName = asText(row?.chapterName, "").trim();
      const subjectName = rawSubjectName || activeTarget?.subject?.name || "";
      const chapterName = rawChapterName || activeTarget?.chapter?.name || "";
      const treePayload = row?.treePayload;
      const treeShapeValid = treePayload === null || Array.isArray(treePayload) || (treePayload && typeof treePayload === "object");

      if (!subjectName || !chapterName || !treeShapeValid) {
        invalidRows += 1;
        if (invalidRowMessages.length < 6) {
          const details = [];
          if (!subjectName) {
            details.push("subject نامشخص");
          }
          if (!chapterName) {
            details.push("chapter نامشخص");
          }
          if (!treeShapeValid) {
            details.push("tree باید آرایه/آبجکت/[] باشد");
          }
          invalidRowMessages.push(`ردیف tree ${index + 1}: ${details.join(" | ")}`);
        }
        return;
      }

      validRows += 1;
      let subject = findSubjectByName(subjectName);
      if (!subject) {
        subject = {
          id: createId("sub"),
          name: subjectName,
          chapters: []
        };
        state.subjects.push(subject);
        newSubjects += 1;
      }

      let chapter = findChapterByName(subject, chapterName);
      if (!chapter) {
        chapter = {
          id: createId("ch"),
          order: subject.chapters.length + 1,
          name: chapterName,
          questionsFile: null,
          questions: [],
          questionsLoaded: true,
          tree: []
        };
        subject.chapters.push(chapter);
        normalizeSubjectChapterOrder(subject);
        newChapters += 1;
      }

      if (!Array.isArray(chapter.questions)) {
        chapter.questions = [];
      }
      if (typeof chapter.questionsLoaded !== "boolean") {
        chapter.questionsLoaded = true;
      }

      const beforeTree = normalizeChapterTreePayload(chapter?.tree ?? chapter?.children ?? []);
      const nextTree = normalizeChapterTreePayload(treePayload);
      chapter.tree = nextTree;

      const changed = JSON.stringify(beforeTree) !== JSON.stringify(nextTree);
      if (changed) {
        updatedCount += 1;
      } else {
        unchangedCount += 1;
      }
      if (!nextTree.length) {
        clearedCount += 1;
      }
    });

    if (!validRows) {
      return {
        handled: false,
        hasSignal,
        importKind: "tree",
        validRows: 0,
        invalidRows,
        invalidRowMessages,
        updatedCount: 0,
        unchangedCount: 0,
        clearedCount: 0,
        newSubjects: 0,
        newChapters: 0
      };
    }

    const shouldCommit = options.commit !== false;
    if (shouldCommit) {
      persistSubjects();
      sanitizeView();
      render();
    }

    return {
      handled: true,
      hasSignal,
      importKind: "tree",
      validRows,
      invalidRows,
      invalidRowMessages,
      updatedCount,
      unchangedCount,
      clearedCount,
      newSubjects,
      newChapters,
      committed: shouldCommit
    };
  }

  async function importQuestionsFromJsonText(rawText) {
    const sourceText = asText(rawText, "").trim();
    if (!sourceText) {
      throw createJsonImportError("متن JSON خالی است.", {
        title: "ورود JSON متنی ناموفق",
        summary: "متن JSON خالی است و چیزی برای پردازش وجود ندارد.",
        causes: ["textarea ورود متنی خالی ارسال شده است."],
        tips: ["یک JSON معتبر وارد کن و دوباره «افزودن» را بزن."]
      });
    }

    const parsed = parseJsonTextWithDiagnostics(sourceText);
    if (!parsed.ok) {
      throw createJsonImportError("متن JSON معتبر نیست.", {
        title: "خطای سینتکس JSON",
        summary: parsed.summary,
        causes: parsed.causes,
        tips: parsed.tips,
        codeFrame: parsed.codeFrame
      });
    }
    const payload = parsed.value;
    const autoRepairApplied = parsed.autoRepaired === true;
    const autoRepairActions = Array.isArray(parsed.repairActions) ? parsed.repairActions : [];
    const importMode = resolveJsonPayloadImportMode(payload);
    const rows = extractQuestionRowsFromJsonPayload(payload);
    if (importMode === "tree") {
      const forcedTreeImport = importChapterTreesFromJsonPayload(payload, { forceTreeMode: true, commit: true });
      if (forcedTreeImport.handled) {
        return {
          ...forcedTreeImport,
          autoRepairApplied,
          autoRepairActions
        };
      }
      throw createJsonImportError("ساختار tree شناسایی شد اما قابل‌اعمال نبود.", {
        title: "ورود JSON درختی ناموفق",
        summary: "JSON به‌عنوان درخت فصل تشخیص داده شد، ولی ردیف معتبر برای اعمال پیدا نشد.",
        causes: forcedTreeImport.invalidRowMessages?.length
          ? forcedTreeImport.invalidRowMessages
          : [
              "یا subject/chapter مشخص نشده است.",
              "یا مقدار tree آرایه/آبجکت معتبر نیست."
            ],
        tips: [
          "نمونه سریع: {\"type\":\"chapter-tree\",\"trees\":[{\"subject\":\"ریاضی\",\"chapter\":\"حد\",\"tree\":[{\"name\":\"مفهوم حد\",\"children\":[]}]}]}",
          "برای پاک‌کردن درخت فصل: {\"type\":\"chapter-tree\",\"trees\":[{\"subject\":\"ریاضی\",\"chapter\":\"حد\",\"tree\":[]}]}"
        ]
      });
    }

    if (!rows.length) {
      const treeImport = importChapterTreesFromJsonPayload(payload, { forceTreeMode: false, commit: true });
      if (treeImport.handled) {
        return {
          ...treeImport,
          autoRepairApplied,
          autoRepairActions
        };
      }
      if (treeImport.hasSignal) {
        throw createJsonImportError("ساختار tree شناسایی شد اما قابل‌اعمال نبود.", {
          title: "ورود JSON درختی ناموفق",
          summary: "JSON شبیه داده درختی بود، اما هیچ ردیف معتبر برای اعمال پیدا نشد.",
          causes: treeImport.invalidRowMessages?.length
            ? treeImport.invalidRowMessages
            : ["ردیف‌های tree فاقد subject/chapter یا tree معتبر هستند."],
          tips: [
            "برای هر ردیف tree، subject و chapter را مشخص کن.",
            "فرمت tree باید آرایه/آبجکت باشد. برای خالی‌کردن فصل از [] استفاده کن."
          ]
        });
      }

      const payloadDiagnostic = buildJsonPayloadShapeDiagnostic(payload);
      throw createJsonImportError("در متن JSON سوال معتبری پیدا نشد.", {
        title: "ساختار JSON برای ورود سوال نامعتبر است",
        summary: "در داده ارسالی هیچ ردیف سوال قابل تشخیص پیدا نشد.",
        causes: payloadDiagnostic.causes,
        tips: payloadDiagnostic.tips
      });
    }

    const activeTarget = resolveActiveChapterImportTarget();
    const payloadDefaults = activeTarget
      ? { subjectName: "", chapterName: "" }
      : resolvePayloadLevelImportDefaults(payload);
    const rowValidation = summarizeJsonImportRowValidation(rows, {
      forcedSubjectName: activeTarget?.subject?.name || "",
      forcedChapterName: activeTarget?.chapter?.name || "",
      fallbackSubjectName: payloadDefaults.subjectName,
      fallbackChapterName: payloadDefaults.chapterName
    });

    if (!rowValidation.validRows) {
      throw createJsonImportError("هیچ سوال قابل افزودنی در متن JSON پیدا نشد.", {
        title: "فیلدهای ضروری سوال ناقص است",
        summary: `هیچ‌کدام از ${rowValidation.totalRows} ردیف شرایط حداقلی برای ورود را نداشتند.`,
        causes: rowValidation.sampleMessages,
        tips: activeTarget
          ? [
              "داخل صفحه فصل، برای هر ردیف فقط وجود question_text یا question کافی است.",
              "اگر مقدار سوال تکی داری، آن را در question_text یا question قرار بده."
            ]
          : [
              "خارج از صفحه فصل، هر ردیف باید subject + chapter + question_text/question داشته باشد.",
              "از راهنمای JSON برای یکی از فرمت‌های دقیق پشتیبانی‌شده استفاده کن."
            ]
      });
    }

    if (activeTarget) {
      const summary = await appendRowsToSpecificChapter(rows, activeTarget);
      const treeImport = importChapterTreesFromJsonPayload(payload, { forceTreeMode: false, commit: true });
      return {
        ...summary,
        lockedToActiveChapter: true,
        duplicateCount: Number(summary.duplicateCount) || 0,
        skippedCount: rowValidation.invalidRows,
        invalidRowMessages: rowValidation.sampleMessages,
        autoCarryForwardRows: rowValidation.autoCarryForwardRows,
        treeApplied: !!treeImport.handled,
        treeUpdatedCount: Number(treeImport.updatedCount) || 0,
        treeClearedCount: Number(treeImport.clearedCount) || 0,
        treeInvalidRows: Number(treeImport.invalidRows) || 0,
        autoRepairApplied,
        autoRepairActions
      };
    }

    const loadingTouchedChapters = new Set();
    const chapterDuplicateKeyCache = new Map();
    let addedCount = 0;
    let newSubjects = 0;
    let newChapters = 0;
    let duplicateCount = 0;

    let carrySubjectName = payloadDefaults.subjectName;
    let carryChapterName = payloadDefaults.chapterName;

    for (const row of rows) {
      const normalized = normalizeImportedQuestionRow(row, {
        fallbackSubjectName: carrySubjectName,
        fallbackChapterName: carryChapterName
      });
      if (!normalized) {
        continue;
      }

      carrySubjectName = normalized.subjectName;
      carryChapterName = normalized.chapterName;

      let subject = findSubjectByName(normalized.subjectName);
      if (!subject) {
        subject = {
          id: createId("sub"),
          name: normalized.subjectName,
          chapters: []
        };
        state.subjects.push(subject);
        newSubjects += 1;
      }

      let chapter = findChapterByName(subject, normalized.chapterName);
      if (!chapter) {
        chapter = {
          id: createId("ch"),
          order: subject.chapters.length + 1,
          name: normalized.chapterName,
          questionsFile: null,
          questions: [],
          questionsLoaded: true,
          tree: []
        };
        subject.chapters.push(chapter);
        normalizeSubjectChapterOrder(subject);
        newChapters += 1;
      }

      if (!Array.isArray(chapter.questions)) {
        chapter.questions = [];
      }
      if (!Array.isArray(chapter.tree)) {
        chapter.tree = normalizeChapterTreePayload(chapter?.tree ?? chapter?.children ?? []);
      }

      if (!chapter.questionsLoaded && chapter.questionsFile) {
        const runtimeKey = `${subject.id}::${chapter.id}`;
        if (!loadingTouchedChapters.has(runtimeKey)) {
          loadingTouchedChapters.add(runtimeKey);
          try {
            await ensureChapterQuestionsLoaded(subject, chapter);
          } catch (error) {
            console.error(error);
          }
        }
      }

      chapter.questionsLoaded = true;

      const chapterRuntimeKey = `${subject.id}::${chapter.id}`;
      if (!chapterDuplicateKeyCache.has(chapterRuntimeKey)) {
        chapterDuplicateKeyCache.set(chapterRuntimeKey, createChapterQuestionDuplicateKeySet(chapter));
      }
      const chapterDuplicateKeys = chapterDuplicateKeyCache.get(chapterRuntimeKey);

      if (!appendImportedQuestionIfUnique(chapter, normalized.question, chapterDuplicateKeys)) {
        duplicateCount += 1;
        continue;
      }

      addedCount += 1;
    }

    if (!addedCount && !duplicateCount) {
      throw createJsonImportError("هیچ سوال قابل افزودنی در متن JSON پیدا نشد.", {
        title: "ورود JSON متنی ناموفق",
        summary: "با وجود تحلیل اولیه، هیچ سوالی وارد نشد.",
        causes: rowValidation.sampleMessages.length
          ? rowValidation.sampleMessages
          : ["تمام ردیف‌ها در مرحله نرمال‌سازی رد شدند."],
        tips: [
          "فیلدهای subject و chapter و question_text/question را بررسی کن.",
          "یک نمونه ساده از راهنمای JSON را تست کن تا خط پایه سالم باشد."
        ]
      });
    }

    if (addedCount > 0) {
      reconcileReviewMetadataAfterDataChange({ migrateLegacy: true });
      persistSubjects();
      sanitizeView();
      render();
    }
    const treeImport = importChapterTreesFromJsonPayload(payload, { forceTreeMode: false, commit: true });

    return {
      addedCount,
      newSubjects,
      newChapters,
      duplicateCount,
      skippedCount: rowValidation.invalidRows,
      invalidRowMessages: rowValidation.sampleMessages,
      autoCarryForwardRows: rowValidation.autoCarryForwardRows,
      treeApplied: !!treeImport.handled,
      treeUpdatedCount: Number(treeImport.updatedCount) || 0,
      treeClearedCount: Number(treeImport.clearedCount) || 0,
      treeInvalidRows: Number(treeImport.invalidRows) || 0,
      autoRepairApplied,
      autoRepairActions
    };
  }

  function extractQuestionRowsFromJsonPayload(payload, depth = 0) {
    if (depth > 8) {
      return [];
    }

    if (Array.isArray(payload)) {
      if (!payload.length) {
        return [];
      }
      const hasSubjectShape = payload.some((item) => isLikelySubjectNode(item));
      if (hasSubjectShape) {
        return flattenSubjectsToQuestionRows(normalizeSubjects(payload));
      }
      return payload.map((item) => unwrapQuestionRowWrapper(item));
    }

    if (!payload || typeof payload !== "object") {
      return [];
    }

    const normalizedPayload = unwrapQuestionRowWrapper(payload);

    if (Array.isArray(normalizedPayload.questions)) {
      return normalizedPayload.questions.map((item) => unwrapQuestionRowWrapper(item));
    }

    if (isObjectCollectionMap(normalizedPayload.questions)) {
      const mappedRows = Object.values(normalizedPayload.questions).map((item) => unwrapQuestionRowWrapper(item));
      if (mappedRows.length) {
        return mappedRows;
      }
    }

    if (Array.isArray(normalizedPayload.subjects)) {
      return flattenSubjectsToQuestionRows(normalizeSubjects(normalizedPayload));
    }

    if (isObjectCollectionMap(normalizedPayload.subjects)) {
      const mappedSubjects = Object.values(normalizedPayload.subjects);
      if (mappedSubjects.some((item) => isLikelySubjectNode(item))) {
        return flattenSubjectsToQuestionRows(normalizeSubjects({ subjects: mappedSubjects }));
      }
    }

    if (isLikelyQuestionRowObject(normalizedPayload)) {
      return [normalizedPayload];
    }

    const wrapperKeys = [
      "rows",
      "items",
      "list",
      "records",
      "entries",
      "result",
      "results",
      "data",
      "payload",
      "response",
      "body",
      "content",
      "dataset",
      "questionsData",
      "bank"
    ];
    for (const key of wrapperKeys) {
      const candidate = normalizedPayload[key];
      if (candidate === undefined || candidate === null) {
        continue;
      }
      const nestedRows = extractQuestionRowsFromJsonPayload(candidate, depth + 1);
      if (nestedRows.length) {
        return nestedRows;
      }
    }

    const objectValues = Object.values(normalizedPayload)
      .map((item) => unwrapQuestionRowWrapper(item))
      .filter((item) => item && typeof item === "object" && !Array.isArray(item));
    if (objectValues.length && objectValues.every((item) => isLikelyQuestionRowObject(item))) {
      return objectValues;
    }

    return [];
  }

  function isLikelySubjectNode(value) {
    return !!(value && typeof value === "object" && Array.isArray(value.chapters));
  }

  function hasSubjectsCollectionShape(payload) {
    if (Array.isArray(payload)) {
      return payload.some((item) => isLikelySubjectNode(item));
    }

    if (!payload || typeof payload !== "object") {
      return false;
    }

    if (Array.isArray(payload.subjects)) {
      return true;
    }
    if (isObjectCollectionMap(payload.subjects)) {
      return Object.values(payload.subjects).some((item) => isLikelySubjectNode(item));
    }
    return false;
  }

  function isObjectCollectionMap(value) {
    return !!(value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length);
  }

  function isLikelyQuestionRowObject(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return false;
    }

    if (
      "question_text" in value ||
      "question" in value ||
      "questionText" in value ||
      "text" in value ||
      "prompt" in value ||
      "متن سوال" in value ||
      "سوال" in value
    ) {
      return true;
    }

    if (value.question && typeof value.question === "object" && !Array.isArray(value.question)) {
      const nested = value.question;
      return "question_text" in nested || "question" in nested || "text" in nested || "prompt" in nested;
    }

    return !!extractImportedQuestionText(value);
  }

  function unwrapQuestionRowWrapper(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return value;
    }

    const merged = { ...value };
    const candidateSources = [];
    if (value.question && typeof value.question === "object" && !Array.isArray(value.question)) {
      candidateSources.push(value.question);
    }
    if (value.data && typeof value.data === "object" && !Array.isArray(value.data)) {
      candidateSources.push(value.data);
    }
    if (value.payload && typeof value.payload === "object" && !Array.isArray(value.payload)) {
      candidateSources.push(value.payload);
    }
    if (value.item && typeof value.item === "object" && !Array.isArray(value.item)) {
      candidateSources.push(value.item);
    }
    if (value.fields && typeof value.fields === "object" && !Array.isArray(value.fields)) {
      candidateSources.push(value.fields);
    }

    for (const source of candidateSources) {
      for (const [key, nestedValue] of Object.entries(source)) {
        const current = merged[key];
        const currentIsBlank = current === undefined || current === null || asText(current, "").trim() === "";
        if (currentIsBlank) {
          merged[key] = nestedValue;
        }
      }
    }

    return merged;
  }

  function resolvePayloadLevelImportDefaults(payload) {
    if (!payload || typeof payload !== "object") {
      return {
        subjectName: "",
        chapterName: ""
      };
    }

    const probeCandidates = [payload, payload.meta, payload.context, payload.info, payload.payload, payload.data].filter(
      (item) => item && typeof item === "object" && !Array.isArray(item)
    );

    let subjectName = "";
    let chapterName = "";
    for (const candidate of probeCandidates) {
      if (!subjectName) {
        subjectName = extractImportedSubjectName(candidate);
      }
      if (!chapterName) {
        chapterName = extractImportedChapterName(candidate);
      }
      if (subjectName && chapterName) {
        break;
      }
    }

    return { subjectName, chapterName };
  }

  function resolveActiveChapterImportTarget() {
    if (state.view.level !== 3) {
      return null;
    }

    const subject = getActiveSubject();
    const chapter = getActiveChapter();
    if (!subject || !chapter) {
      return null;
    }

    return { subject, chapter };
  }

  async function appendRowsToSpecificChapter(rows, target) {
    if (!target?.subject || !target?.chapter) {
      throw new Error("فصل فعال برای افزودن سوال شناسایی نشد.");
    }

    const subject = target.subject;
    const chapter = target.chapter;

    if (!Array.isArray(chapter.questions)) {
      chapter.questions = [];
    }
    if (!Array.isArray(chapter.tree)) {
      chapter.tree = normalizeChapterTreePayload(chapter?.tree ?? chapter?.children ?? []);
    }

    if (!chapter.questionsLoaded && chapter.questionsFile) {
      try {
        await ensureChapterQuestionsLoaded(subject, chapter);
      } catch (error) {
        console.error(error);
      }
    }

    chapter.questionsLoaded = true;
    let addedCount = 0;
    let duplicateCount = 0;
    const chapterDuplicateKeys = createChapterQuestionDuplicateKeySet(chapter);

    for (const row of rows) {
      const normalized = normalizeImportedQuestionRow(row, {
        forcedSubjectName: subject.name,
        forcedChapterName: chapter.name
      });
      if (!normalized) {
        continue;
      }

      if (!appendImportedQuestionIfUnique(chapter, normalized.question, chapterDuplicateKeys)) {
        duplicateCount += 1;
        continue;
      }
      addedCount += 1;
    }

    if (!addedCount && !duplicateCount) {
      throw new Error("هیچ سوال قابل افزودنی در داده ارسالی پیدا نشد.");
    }

    if (addedCount > 0) {
      reconcileReviewMetadataAfterDataChange({ migrateLegacy: true });
      persistSubjects();
      sanitizeView();
      render();
    }

    return {
      addedCount,
      newSubjects: 0,
      newChapters: 0,
      subjectName: subject.name,
      chapterName: chapter.name,
      duplicateCount
    };
  }

  function buildSubjectsFromQuestionRows(rows) {
    if (!Array.isArray(rows) || !rows.length) {
      return [];
    }

    const subjectOrder = [];
    const subjectMap = new Map();
    const chapterMaps = new Map();

    rows.forEach((row) => {
      const normalized = normalizeImportedQuestionRow(row);
      if (!normalized) {
        return;
      }

      const subjectName = normalized.subjectName;
      const chapterName = normalized.chapterName;
      const subjectKey = normalizeLookupKey(subjectName);
      const chapterKey = normalizeLookupKey(chapterName);

      let subject = subjectMap.get(subjectKey);
      if (!subject) {
        subject = {
          id: createId("sub"),
          name: subjectName,
          chapters: []
        };
        subjectMap.set(subjectKey, subject);
        subjectOrder.push(subject);
        chapterMaps.set(subjectKey, new Map());
      }

      const chapterMap = chapterMaps.get(subjectKey);
      let chapter = chapterMap?.get(chapterKey);
      if (!chapter) {
        chapter = {
          id: createId("ch"),
          order: subject.chapters.length + 1,
          name: chapterName,
          questionsFile: null,
          questionsLoaded: true,
          tree: [],
          questions: []
        };
        chapterMap?.set(chapterKey, chapter);
        subject.chapters.push(chapter);
      }

      chapter.questions.push({
        ...normalized.question
      });
    });

    return normalizeSubjects({ subjects: subjectOrder });
  }

  function flattenSubjectsToQuestionRows(subjects) {
    const rows = [];
    (subjects || []).forEach((subject) => {
      (subject?.chapters || []).forEach((chapter) => {
        (chapter?.questions || []).forEach((question) => {
          rows.push({
            id: question.id,
            subject: subject.name,
            chapter: chapter.name,
            topic: resolveQuestionTopicLabel(question),
            method: resolveQuestionMethodLabel(question, ""),
            difficulty: question.difficulty,
            question_text: cleanQuestionContentText(asText(question.question_text, asText(question.question, ""))),
            hint: cleanQuestionContentText(asText(question.hint, "")),
            step_by_step_solution: cleanQuestionContentText(
              asText(question.step_by_step_solution, asText(question.solution, ""))
            ),
            assets: normalizeQuestionAssetPayload(question),
            needsReview: resolveNeedsReviewFlag(question),
            solved: resolveQuestionSolvedFlag(question)
          });
        });
      });
    });
    return rows;
  }

  function normalizeImportedQuestionRow(row, options = {}) {
    const rowObject = coerceQuestionRowInputToObject(row);
    if (!rowObject || typeof rowObject !== "object") {
      return null;
    }

    const forcedSubjectName = asText(options.forcedSubjectName, "").trim();
    const forcedChapterName = asText(options.forcedChapterName, "").trim();
    const fallbackSubjectName = asText(options.fallbackSubjectName, "").trim();
    const fallbackChapterName = asText(options.fallbackChapterName, "").trim();
    const subjectName = forcedSubjectName || extractImportedSubjectName(rowObject) || fallbackSubjectName;
    const chapterName = forcedChapterName || extractImportedChapterName(rowObject) || fallbackChapterName;
    const questionText = cleanQuestionContentText(extractImportedQuestionText(rowObject));

    if (!subjectName || !chapterName || !questionText) {
      return null;
    }

    const topic = resolveQuestionTopicLabel(rowObject);
    const method = resolveQuestionMethodLabel(rowObject, "");
    const difficulty = clampNumber(normalizePossibleNumberText(resolveImportedDifficulty(rowObject)), 1, 5, 3);
    const hint = cleanQuestionContentText(extractImportedHintText(rowObject));
    const solution = cleanQuestionContentText(extractImportedSolutionText(rowObject));
    const assets = normalizeQuestionAssetPayload(rowObject);

    return {
      subjectName,
      chapterName,
      question: applyIncomingQuestionReviewDefaults({
        id: "",
        chapter: chapterName,
        topic,
        method,
        difficulty,
        question: questionText,
        question_text: questionText,
        hint,
        solution,
        step_by_step_solution: solution,
        assets,
        solved: false
      })
    };
  }

  function buildQuestionDuplicateTextKey(value) {
    const text = cleanQuestionContentText(asText(value, ""), { keepLineBreaks: false });
    if (!text) {
      return "";
    }
    return normalizePossibleNumberText(text)
      .replace(/\u200c/g, " ")
      .replace(/[ي]/g, "ی")
      .replace(/[ك]/g, "ک")
      .replace(/[أإٱآ]/g, "ا")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function resolveQuestionDuplicateKey(question) {
    if (!question || typeof question !== "object") {
      return "";
    }
    return buildQuestionDuplicateTextKey(asText(question.question_text, asText(question.question, "")));
  }

  function createChapterQuestionDuplicateKeySet(chapter) {
    const keys = new Set();
    const questions = Array.isArray(chapter?.questions) ? chapter.questions : [];
    questions.forEach((question) => {
      const key = resolveQuestionDuplicateKey(question);
      if (key) {
        keys.add(key);
      }
    });
    return keys;
  }

  function ensureImportedQuestionDefaults(question) {
    if (!question || typeof question !== "object") {
      return null;
    }
    applyIncomingQuestionReviewDefaults(question);
    question.solved = false;
    question.isSolved = false;
    question.assets = normalizeQuestionAssetPayload(question);
    if (question.progress && typeof question.progress === "object") {
      question.progress.solved = false;
      question.progress.isSolved = false;
    }
    return question;
  }

  function appendImportedQuestionIfUnique(chapter, question, chapterDuplicateKeys) {
    if (!chapter || !question || !(chapterDuplicateKeys instanceof Set)) {
      return false;
    }
    if (!Array.isArray(chapter.questions)) {
      chapter.questions = [];
    }

    const normalizedQuestion = ensureImportedQuestionDefaults(question);
    if (!normalizedQuestion) {
      return false;
    }

    const duplicateKey = resolveQuestionDuplicateKey(normalizedQuestion);
    if (duplicateKey && chapterDuplicateKeys.has(duplicateKey)) {
      return false;
    }

    normalizedQuestion.id = ensureUniqueQuestionId(chapter);
    chapter.questions.push(normalizedQuestion);
    if (duplicateKey) {
      chapterDuplicateKeys.add(duplicateKey);
    }
    return true;
  }

  function applyImportQuestionPoliciesToSubjects(subjects) {
    const source = Array.isArray(subjects) ? subjects : [];
    let duplicateCount = 0;

    const nextSubjects = source.map((subject) => {
      const chapters = Array.isArray(subject?.chapters) ? subject.chapters : [];
      const nextChapters = chapters.map((chapter) => {
        const questions = Array.isArray(chapter?.questions) ? chapter.questions : [];
        const chapterKeys = new Set();
        const dedupedQuestions = [];

        questions.forEach((question) => {
          const normalizedQuestion = ensureImportedQuestionDefaults({ ...(question || {}) });
          if (!normalizedQuestion) {
            return;
          }

          const duplicateKey = resolveQuestionDuplicateKey(normalizedQuestion);
          if (duplicateKey && chapterKeys.has(duplicateKey)) {
            duplicateCount += 1;
            return;
          }

          dedupedQuestions.push(normalizedQuestion);
          if (duplicateKey) {
            chapterKeys.add(duplicateKey);
          }
        });

        return {
          ...chapter,
          questions: dedupedQuestions,
          questionsLoaded: !!chapter?.questionsLoaded || dedupedQuestions.length > 0 || !chapter?.questionsFile
        };
      });

      return {
        ...subject,
        chapters: nextChapters
      };
    });

    return {
      subjects: nextSubjects,
      duplicateCount
    };
  }

  function coerceQuestionRowInputToObject(row) {
    if (row && typeof row === "object" && !Array.isArray(row)) {
      return unwrapQuestionRowWrapper(row);
    }

    if (typeof row === "string" || typeof row === "number") {
      const text = asText(row, "").trim();
      if (!text) {
        return null;
      }
      return {
        question_text: text,
        question: text
      };
    }

    return null;
  }

  function extractImportedSubjectName(row) {
    const candidates = [
      row.subject,
      row.subject_name,
      row.subjectName,
      row.subject_title,
      row.subjectTitle,
      row.lesson,
      row.course,
      row["درس"]
    ];

    for (const candidate of candidates) {
      const text = resolveImportedNameCandidate(candidate);
      if (text) {
        return text;
      }
    }
    return "";
  }

  function extractImportedChapterName(row) {
    const candidates = [
      row.chapter,
      row.chapter_name,
      row.chapterName,
      row.chapter_title,
      row.chapterTitle,
      row.section,
      row["فصل"]
    ];

    for (const candidate of candidates) {
      const text = resolveImportedNameCandidate(candidate);
      if (text) {
        return text;
      }
    }
    return "";
  }

  function resolveImportedNameCandidate(candidate) {
    if (typeof candidate === "string" || typeof candidate === "number") {
      return asText(candidate, "").trim();
    }
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
      return "";
    }

    const nestedCandidates = [
      candidate.name,
      candidate.title,
      candidate.label,
      candidate.value,
      candidate.text,
      candidate.subject,
      candidate.chapter
    ];
    for (const nested of nestedCandidates) {
      const text = asText(nested, "").trim();
      if (text) {
        return text;
      }
    }
    return "";
  }

  function extractImportedQuestionText(row) {
    const candidates = [
      row.question_text,
      row.question,
      row.questionText,
      row.question_body,
      row.questionBody,
      row.text,
      row.body,
      row.content,
      row.description,
      row.prompt,
      row["متن سوال"],
      row["سوال"]
    ];
    for (const candidate of candidates) {
      const text = resolveImportedTextCandidate(candidate);
      if (text) {
        return cleanQuestionContentText(text);
      }
    }
    return "";
  }

  function extractImportedHintText(row) {
    const candidates = [row.hint, row.guide, row.help, row.note, row.tip, row["راهنما"], row["نکته"]];
    for (const candidate of candidates) {
      const text = resolveImportedTextCandidate(candidate);
      if (text) {
        return cleanQuestionContentText(text);
      }
    }
    return "";
  }

  function extractImportedSolutionText(row) {
    const candidates = [
      row.step_by_step_solution,
      row.solution,
      row.answer,
      row.explanation,
      row.analysis,
      row.workout,
      row["حل"],
      row["پاسخ"],
      row["پاسخ تشریحی"]
    ];
    for (const candidate of candidates) {
      const text = resolveImportedTextCandidate(candidate);
      if (text) {
        return cleanQuestionContentText(text);
      }
    }
    return "";
  }

  function normalizeQuestionAssetPayload(source) {
    if (!source || typeof source !== "object") {
      return [];
    }
    if (
      questionPdfAssetPlugin &&
      typeof questionPdfAssetPlugin.normalizeAssetsFromQuestion === "function"
    ) {
      const normalized = questionPdfAssetPlugin.normalizeAssetsFromQuestion(source);
      return Array.isArray(normalized) ? normalized : [];
    }
    if (Array.isArray(source.assets)) {
      return source.assets
        .filter((item) => item && typeof item === "object" && !Array.isArray(item))
        .map((item, index) => {
          const mode = asText(item.mode, "").trim().toLowerCase();
          const page = Number.parseInt(asText(item.page, ""), 10);
          const bbox = Array.isArray(item.bbox) ? item.bbox.slice(0, 4).map((value) => Number(value)) : [];
          return {
            id: asText(item.id, `asset-${index + 1}`),
            type: asText(item.type, "image"),
            mode: mode || (Number.isFinite(page) && bbox.length === 4 ? "pdf-crop" : "url"),
            src: asText(item.src, ""),
            page: Number.isFinite(page) ? page : null,
            bbox: bbox.length === 4 ? bbox : null,
            bboxUnit: asText(item.bboxUnit, asText(item.bbox_unit, "")),
            marker: Number.isFinite(Number(item.marker)) ? Number(item.marker) : null,
            caption: asText(item.caption, ""),
            alt: asText(item.alt, "")
          };
        });
    }
    return [];
  }

  function resolveImportedTextCandidate(candidate) {
    if (typeof candidate === "string" || typeof candidate === "number") {
      return asText(candidate, "").trim();
    }
    if (typeof candidate === "boolean") {
      return candidate ? "true" : "false";
    }
    if (Array.isArray(candidate)) {
      const merged = candidate
        .map((item) => resolveImportedTextCandidate(item))
        .filter(Boolean)
        .join("\n")
        .trim();
      return merged;
    }
    if (!candidate || typeof candidate !== "object") {
      return "";
    }

    const nestedCandidates = [
      candidate.text,
      candidate.value,
      candidate.content,
      candidate.body,
      candidate.description,
      candidate.question_text,
      candidate.question,
      candidate.prompt
    ];
    for (const nested of nestedCandidates) {
      const text = resolveImportedTextCandidate(nested);
      if (text) {
        return text;
      }
    }
    return "";
  }

  function resolveImportedDifficulty(row) {
    const candidates = [
      row.difficulty,
      row.level,
      row.diff,
      row.difficulty_level,
      row.difficultyLevel,
      row["سختی"],
      row["سطح"]
    ];
    for (const candidate of candidates) {
      if (typeof candidate === "string" && candidate.trim()) {
        const raw = candidate.trim();
        const mapped = mapDifficultyWordToNumber(raw);
        return mapped || raw;
      }
      if (typeof candidate === "number" && Number.isFinite(candidate)) {
        return String(candidate);
      }
      if (candidate && typeof candidate === "object" && !Array.isArray(candidate)) {
        const nestedRaw = resolveImportedTextCandidate(candidate);
        if (nestedRaw) {
          const mapped = mapDifficultyWordToNumber(nestedRaw);
          return mapped || nestedRaw;
        }
      }
    }
    return asText(row?.difficulty, "");
  }

  function mapDifficultyWordToNumber(value) {
    const key = normalizeLookupKey(value);
    const map = new Map([
      ["easy", "1"],
      ["simple", "1"],
      ["beginner", "1"],
      ["اسون", "1"],
      ["آسون", "1"],
      ["ساده", "1"],
      ["راحت", "1"],
      ["medium", "3"],
      ["normal", "3"],
      ["متوسط", "3"],
      ["mid", "3"],
      ["hard", "5"],
      ["difficult", "5"],
      ["advanced", "5"],
      ["سخت", "5"],
      ["خیلی سخت", "5"],
      ["پیشرفته", "5"]
    ]);
    return map.get(key) || "";
  }

  function normalizePossibleNumberText(value) {
    const source = asText(value, "").trim();
    if (!source) {
      return source;
    }
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
    let normalized = "";
    for (const char of source) {
      const persianIndex = persianDigits.indexOf(char);
      if (persianIndex >= 0) {
        normalized += String(persianIndex);
        continue;
      }
      const arabicIndex = arabicDigits.indexOf(char);
      if (arabicIndex >= 0) {
        normalized += String(arabicIndex);
        continue;
      }
      normalized += char;
    }
    return normalized;
  }

  function findSubjectByName(name) {
    const target = normalizeLookupKey(name);
    return state.subjects.find((subject) => normalizeLookupKey(subject?.name) === target) || null;
  }

  function findChapterByName(subject, name) {
    if (!subject || !Array.isArray(subject.chapters)) {
      return null;
    }
    const target = normalizeLookupKey(name);
    return subject.chapters.find((chapter) => normalizeLookupKey(chapter?.name) === target) || null;
  }

  function normalizeLookupKey(value) {
    const text = normalizePossibleNumberText(asText(value, ""))
      .replace(/\u200c/g, " ")
      .replace(/[ي]/g, "ی")
      .replace(/[ك]/g, "ک")
      .replace(/[أإٱآ]/g, "ا")
      .toLowerCase();
    return text.replace(/\s+/g, " ").trim();
  }

  function toQuestionIdToken(value) {
    const raw = asText(value, "").trim().toLowerCase();
    const token = raw
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9_-]+/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    return token || "chapter";
  }

  function collectAllQuestionIds() {
    const ids = new Set();
    state.subjects.forEach((subject) => {
      (subject?.chapters || []).forEach((chapter) => {
        (chapter?.questions || []).forEach((question) => {
          const id = asText(question?.id, "").trim();
          if (id) {
            ids.add(id);
          }
        });
      });
    });
    return ids;
  }

  function ensureUniqueQuestionId(chapter) {
    const questions = Array.isArray(chapter?.questions) ? chapter.questions : [];
    const chapterToken = toQuestionIdToken(asText(chapter?.id, asText(chapter?.name, "chapter")));
    const prefix = `q-${chapterToken}-`;
    const globalIds = collectAllQuestionIds();

    let maxSequence = 0;
    questions.forEach((question) => {
      const id = asText(question?.id, "").trim();
      if (!id || !id.startsWith(prefix)) {
        return;
      }
      const suffix = Number.parseInt(id.slice(prefix.length), 10);
      if (Number.isFinite(suffix) && suffix > maxSequence) {
        maxSequence = suffix;
      }
    });

    let next = Math.max(maxSequence + 1, questions.length + 1);
    let candidate = `${prefix}${next}`;
    while (globalIds.has(candidate)) {
      next += 1;
      candidate = `${prefix}${next}`;
    }
    return candidate;
  }

  initPremiumEnhancements();
})();
