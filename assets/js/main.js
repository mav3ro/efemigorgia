const body = document.body;
const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const mobileLinks = document.querySelectorAll("[data-mobile-link]");
const yearNode = document.querySelector("[data-year]");
const heroMedia = document.querySelector("[data-hero-media]");
const heroVideo = document.querySelector("[data-hero-video]");
const contactModal = document.querySelector("[data-contact-modal]");
const contactOpenButtons = document.querySelectorAll("[data-contact-open]");
const contactCloseButtons = document.querySelectorAll("[data-contact-close]");
const contactForm = document.querySelector("[data-contact-form]");
const poetNoteOpenButton = document.querySelector("[data-note-open]");
const poetNoteModal = document.querySelector("[data-note-modal]");
const poetNoteCloseButtons = document.querySelectorAll("[data-note-close]");
const transliterationModal = document.querySelector("[data-transliteration-modal]");
const transliterationOpenButtons = document.querySelectorAll("[data-transliteration-open]");
const transliterationCloseButtons = document.querySelectorAll("[data-transliteration-close]");
const poemBonusModal = document.querySelector("[data-poem-bonus-modal]");
const poemBonusTrigger = document.querySelector("[data-poem-bonus-open]");
const poemBonusCloseButtons = document.querySelectorAll("[data-poem-bonus-close]");
const accordionItems = document.querySelectorAll(".accordion-item");
const contactSubmitButton = contactForm ? contactForm.querySelector(".contact-form__submit") : null;
const contactFieldNodes = contactForm
  ? {
      name: contactForm.querySelector('input[name="name"]'),
      email: contactForm.querySelector('input[name="email"]'),
      subject: contactForm.querySelector('input[name="subject"]'),
      message: contactForm.querySelector('textarea[name="message"]')
    }
  : {};
const contactFieldLimits = {
  name: 30,
  subject: 30,
  message: 1000
};
const contactFieldLabels = {
  name: "Imię",
  subject: "Temat",
  message: "Wiadomość"
};
const scrollTopButtons = document.querySelectorAll("[data-scroll-top]");
const accordionHeartButtons = document.querySelectorAll("[data-accordion-heart]");
const poemLineNodes = document.querySelectorAll("[data-poem-line]");
const poemTryLuckButton = document.querySelector("[data-poem-random-reveal]");
const poemPasswordForm = document.querySelector("[data-poem-password-form]");
const poemPasswordInput = document.querySelector("[data-poem-password]");
const poemPasswordSubmit = document.querySelector("[data-poem-password-submit]");
const heartStorageKey = "efemigorgia:liked-hearts";
const defaultSecretHash = "128df13c1e54ffaaafcc9d07ec7427d61f764214e6ae0321de23c94d261d0860";
const glyphPoemPassword = "DDTGRS";
const glyphPoemRandomRevealRatio = 0.4;
const glyphPoemAlphabetUpper = Array.from("AĄBCĆDEĘFGHIJKLŁMNŃOÓPQRSŚTUVWXYZŹŻ");
const glyphPoemAlphabetLower = Array.from("aąbcćdeęfghijklłmnńoópqrsśtuvwxyzźż");
const pageName = (() => {
  const rawPath = window.location.pathname.split("/").pop() || "index.html";
  const cleanPath = rawPath.split("?")[0].split("#")[0];

  return cleanPath.replace(/\.html$/i, "") || "index";
})();
const poemSearchPageLabels = {
  "milosc.html": "Miłość",
  "pustka.html": "Pustka",
  "wola.html": "Wola",
  "erotyzm.html": "Erotyzm",
  "slonce.html": "Słońce",
  "smierc.html": "Śmierć",
  "przeklenstwo.html": "Przekleństwo",
  "krzyk.html": "Krzyk",
  "dom.html": "Dom"
};

const normalizeSearchText = (value = "") =>
  value
    .toString()
    .normalize("NFD")
    .toLowerCase()
    .replace(/ł/g, "l")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const createPoemSlug = (value = "") => normalizeSearchText(value).replace(/\s+/g, "-");

const buildPoemSearchDestination = (page, href, title) => {
  const basePath = href && href !== "#" ? href : page;
  const separator = basePath.includes("?") ? "&" : "?";

  return `${basePath}${separator}poem=${encodeURIComponent(createPoemSlug(title))}`;
};

const getAccordionSummaryTitleNode = (summary) => {
  if (!(summary instanceof HTMLElement)) {
    return null;
  }

  return (
    Array.from(summary.children).find(
      (child) =>
        child instanceof HTMLSpanElement &&
        !child.classList.contains("accordion-summary__tag")
    ) || null
  );
};

const getHomePoemSearchEntries = () => {
  const rawIndex = window.homeSearchIndex;

  if (!rawIndex || typeof rawIndex !== "object") {
    return [];
  }

  const entries = [];
  const seen = new Set();

  Object.entries(rawIndex).forEach(([page, items]) => {
    if (!Array.isArray(items)) {
      return;
    }

    items.forEach((item) => {
      const normalizedItem =
        typeof item === "string"
          ? { title: item }
          : item && typeof item === "object"
            ? item
            : null;

      if (!normalizedItem || typeof normalizedItem.title !== "string") {
        return;
      }

      const title = normalizedItem.title.trim();
      const href = typeof normalizedItem.href === "string" ? normalizedItem.href.trim() : "";
      const slug = createPoemSlug(title);

      if (!title || !slug) {
        return;
      }

      const destination = buildPoemSearchDestination(page, href, title);
      const dedupeKey = `${destination}|${slug}`;

      if (seen.has(dedupeKey)) {
        return;
      }

      seen.add(dedupeKey);
      entries.push({
        title,
        page,
        href,
        slug,
        destination,
        category: poemSearchPageLabels[page] || page.replace(/\.html$/i, ""),
        searchText: normalizeSearchText(title)
      });
    });
  });

  return entries;
};

const initHomePoemSearch = () => {
  const root = document.querySelector("[data-hero-search]");
  const form = document.querySelector("[data-hero-search-form]");
  const input = document.querySelector("[data-hero-search-input]");
  const results = document.querySelector("[data-hero-search-results]");
  const status = document.querySelector("[data-hero-search-status]");

  if (!root || !form || !input || !results || !status) {
    return;
  }

  const entries = getHomePoemSearchEntries();
  let currentMatches = [];

  const renderResults = (matches) => {
    const fragment = document.createDocumentFragment();

    matches.forEach((entry) => {
      const link = document.createElement("a");
      const title = document.createElement("span");
      const meta = document.createElement("span");

      link.className = "hero-search__result";
      link.href = entry.destination;
      title.className = "hero-search__result-title";
      title.textContent = entry.title;
      meta.className = "hero-search__result-meta";
      meta.textContent = entry.category;

      link.append(title, meta);
      fragment.appendChild(link);
    });

    results.replaceChildren(fragment);
    results.hidden = false;
  };

  const sortMatches = (matches, query) =>
    matches.sort((left, right) => {
      const leftScore =
        left.searchText === query ? 0 : left.searchText.startsWith(query) ? 1 : 2;
      const rightScore =
        right.searchText === query ? 0 : right.searchText.startsWith(query) ? 1 : 2;

      if (leftScore !== rightScore) {
        return leftScore - rightScore;
      }

      return left.title.localeCompare(right.title, "pl");
    });

  const updateSearch = () => {
    const rawQuery = input.value.trim();
    const normalizedQuery = normalizeSearchText(rawQuery);
    const queryParts = normalizedQuery ? normalizedQuery.split(" ").filter(Boolean) : [];

    if (!queryParts.length) {
      currentMatches = [];
      results.hidden = true;
      results.replaceChildren();
      status.textContent = "";
      return;
    }

    currentMatches = sortMatches(
      entries.filter((entry) => queryParts.every((part) => entry.searchText.includes(part))),
      normalizedQuery
    );

    if (!currentMatches.length) {
      results.hidden = true;
      results.replaceChildren();
      status.textContent = "Brak tytułów dla tej frazy.";
      return;
    }

    renderResults(currentMatches);
    status.textContent = `Znalezione tytuły: ${currentMatches.length}`;
  };

  if (!entries.length) {
    status.textContent = "Baza tytułów jest chwilowo niedostępna.";
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!currentMatches.length) {
      return;
    }

    window.location.href = currentMatches[0].destination;
  });

  input.addEventListener("input", updateSearch);
};

const revealPoemSearchTargetFromUrl = () => {
  const poemParam = new URLSearchParams(window.location.search).get("poem");
  const poemSlug = createPoemSlug(poemParam || "");

  if (!poemSlug) {
    return;
  }

  const candidates = [];

  document.querySelectorAll(".accordion-item").forEach((item) => {
    const titleNode = getAccordionSummaryTitleNode(item.querySelector(".accordion-summary"));

    if (titleNode) {
      candidates.push({ container: item, titleNode });
    }
  });

  document.querySelectorAll(".accordion-link-item").forEach((item) => {
    const titleNode = item.querySelector(".accordion-link-item__title");

    if (titleNode) {
      candidates.push({ container: item, titleNode });
    }
  });

  const glyphTitle = document.querySelector(".glyph-stage__title");
  if (glyphTitle) {
    candidates.push({
      container: glyphTitle.closest(".glyph-stage__inner") || glyphTitle,
      titleNode: glyphTitle
    });
  }

  const textTitle = document.querySelector(".text-stage__title");
  if (textTitle) {
    candidates.push({
      container: textTitle.closest(".text-stage__inner") || textTitle,
      titleNode: textTitle
    });
  }

  const match = candidates.find(
    ({ titleNode }) => createPoemSlug(titleNode.textContent || "") === poemSlug
  );

  if (!match || !(match.container instanceof HTMLElement)) {
    return;
  }

  let scrollDelay = 60;

  if (match.container instanceof HTMLDetailsElement && !match.container.open) {
    const animator = match.container.__accordionAnimator;
    const canAnimate =
      animator &&
      typeof animator.open === "function" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (canAnimate) {
      animator.open();
      scrollDelay = 180;
    } else {
      match.container.open = true;
    }
  }

  window.setTimeout(() => {
    document.querySelectorAll(".is-search-target").forEach((node) => {
      node.classList.remove("is-search-target");
    });

    match.container.classList.add("is-search-target");
    match.container.scrollIntoView({
      block: "center",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth"
    });

    window.setTimeout(() => {
      match.container.classList.remove("is-search-target");
    }, 3200);
  }, scrollDelay);
};

const setTestId = (element, testId) => {
  if (!element || !testId) {
    return;
  }

  element.setAttribute("data-testid", testId);
};

const setTestIdBySelector = (selector, testId, root = document) => {
  setTestId(root.querySelector(selector), testId);
};

const isSecretAccordionItem = (item) =>
  item instanceof HTMLElement && item.classList.contains("accordion-item--secret");
const isAccordionDetailsItem = (item) => item instanceof HTMLDetailsElement;

const assignCommonTestIds = () => {
  setTestId(document.body, `page-${pageName}`);
  setTestId(document.querySelector(".page-shell"), "page-shell");
  setTestId(header, "site-header");
  setTestId(document.querySelector(".site-nav"), "site-nav");
  setTestId(document.querySelector(".nav-cluster--left .nav-link[href=\"index.html\"]"), "nav-home-link");
  setTestId(document.querySelector(".nav-cluster--left .nav-link[href=\"tworczosc.html\"]"), "nav-works-link");
  setTestId(document.querySelector(".nav-cluster--right .nav-link[href=\"efemigorgia.html\"]"), "nav-efemigorgia-link");
  setTestId(document.querySelector(".nav-cluster--right .nav-link[href=\"de-mour.html\"]"), "nav-de-mour-link");
  setTestId(document.querySelector(".nav-logo"), "nav-logo-link");
  setTestId(navToggle, "nav-toggle");
  setTestId(mobileMenu, "mobile-menu");
  setTestId(document.querySelector(".mobile-menu .mobile-link[href=\"index.html\"]"), "mobile-home-link");
  setTestId(document.querySelector(".mobile-menu .mobile-link[href=\"tworczosc.html\"]"), "mobile-works-link");
  setTestId(document.querySelector(".mobile-menu .mobile-link[href=\"efemigorgia.html\"]"), "mobile-efemigorgia-link");
  setTestId(document.querySelector(".mobile-menu .mobile-link[href=\"de-mour.html\"]"), "mobile-de-mour-link");
  setTestId(document.querySelector(".site-footer"), "site-footer");
  setTestId(document.querySelector(".site-footer__social"), "footer-social-links");
  setTestId(document.querySelector(".site-footer [data-contact-open]"), "footer-contact-button");
  setTestId(document.querySelector(".site-footer [data-note-open]"), "footer-poet-note-button");
  setTestId(document.querySelector(".site-footer a[aria-label=\"Instagram\"]"), "footer-instagram-link");
  setTestId(document.querySelector(".site-footer a[aria-label=\"TikTok\"]"), "footer-tiktok-link");
  setTestId(contactModal, "contact-modal");
  setTestId(document.querySelector(".contact-modal__backdrop"), "contact-modal-backdrop");
  setTestId(document.querySelector(".contact-modal__dialog"), "contact-modal-dialog");
  setTestId(document.querySelector(".contact-modal__close"), "contact-modal-close");
  setTestId(contactForm, "contact-form");
  setTestId(document.querySelector(".contact-form input[name=\"name\"]"), "contact-name-input");
  setTestId(document.querySelector(".contact-form input[name=\"email\"]"), "contact-email-input");
  setTestId(document.querySelector(".contact-form input[name=\"subject\"]"), "contact-subject-input");
  setTestId(document.querySelector(".contact-form textarea[name=\"message\"]"), "contact-message-input");
  setTestId(contactSubmitButton, "contact-submit-button");
  setTestId(poetNoteModal, "poet-note-modal");
  setTestId(document.querySelector(".note-modal__text"), "poet-note-text");
};

const assignHomeTestIds = () => {
  setTestId(document.querySelector("main.site-main"), "main-home");
  setTestId(document.querySelector(".hero"), "home-hero");
  setTestId(document.querySelector(".hero__media"), "home-hero-media");
  setTestId(document.querySelector("[data-hero-video]"), "home-hero-video");
  setTestId(document.querySelector(".hero__fallback"), "home-hero-fallback");
  setTestId(document.querySelector("[data-hero-search]"), "home-hero-search");
  setTestId(document.querySelector("[data-hero-search-input]"), "home-hero-search-input");
  setTestId(document.querySelector("[data-hero-search-status]"), "home-hero-search-status");
  setTestId(document.querySelector("[data-hero-search-results]"), "home-hero-search-results");
};

const assignGalleryTestIds = () => {
  setTestId(document.querySelector("main.site-main--gallery"), "main-gallery");
  setTestId(document.querySelector(".gallery-grid"), "gallery-grid");

  document.querySelectorAll(".gallery-tile").forEach((tile, index) => {
    const link = tile.querySelector(".gallery-tile__link");
    const href = link ? (link.getAttribute("href") || "").replace(/\.html$/i, "") : `tile-${index + 1}`;
    const safeName = href || `tile-${index + 1}`;

    setTestId(tile, `gallery-tile-${safeName}`);
    setTestId(link, `gallery-link-${safeName}`);
  });
};

const assignTextStageTestIds = (baseName) => {
  setTestId(document.querySelector("main"), `main-${baseName}`);
  setTestId(document.querySelector(".text-stage"), `${baseName}-text-stage`);
  setTestId(document.querySelector(".text-stage__title"), `${baseName}-title`);
  setTestId(document.querySelector(".text-stage__body"), `${baseName}-body`);
};

const assignPosterPageTestIds = () => {
  setTestId(document.querySelector("main.site-main"), "main-de-mour");
  setTestId(document.querySelector(".hero"), "de-mour-hero");
  setTestId(document.querySelector(".hero__media"), "de-mour-media");
  setTestId(document.querySelector(".hero__poster"), "de-mour-poster");
  setTestId(document.querySelector(".hero__content"), "de-mour-content");
  setTestId(document.querySelector(".text-stage__title"), "de-mour-title");
  setTestId(document.querySelector(".text-stage__body"), "de-mour-body");
};

const assignGlyphPoemPageTestIds = () => {
  setTestId(document.querySelector("main.site-main--page"), "main-wielki-czas");
  setTestId(document.querySelector(".glyph-stage"), "wielki-czas-stage");
  setTestId(document.querySelector(".glyph-stage__title"), "wielki-czas-title");
  setTestId(document.querySelector("[data-transliteration-open]"), "wielki-czas-transliteration-open");
  setTestId(transliterationModal, "wielki-czas-transliteration-modal");
  setTestId(document.querySelector(".transliteration-modal__canvas"), "wielki-czas-transliteration-canvas");
  setTestId(poemTryLuckButton, "wielki-czas-random-reveal");
  setTestId(poemPasswordForm, "wielki-czas-password-form");
  setTestId(poemPasswordInput, "wielki-czas-password-input");
  setTestId(poemPasswordSubmit, "wielki-czas-password-submit");
  setTestId(poemBonusTrigger, "wielki-czas-bonus-open");
  setTestId(poemBonusModal, "wielki-czas-bonus-modal");
  setTestId(document.querySelector(".portrait-modal__image"), "wielki-czas-bonus-image");

  poemLineNodes.forEach((line, index) => {
    const number = index + 1;
    setTestId(line, `wielki-czas-line-${number}`);
    setTestId(line.querySelector("[data-poem-text]"), `wielki-czas-line-text-${number}`);
  });
};

const initGalleryReveal = () => {
  const galleryGrid = document.querySelector(".gallery-grid");
  const galleryTiles = Array.from(document.querySelectorAll(".gallery-tile"));

  if (!galleryGrid || !galleryTiles.length) {
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  galleryGrid.classList.add("is-staged");

  requestAnimationFrame(() => {
    galleryGrid.classList.add("is-revealed");
  });
};

const assignAccordionTestIds = (baseName) => {
  setTestId(document.querySelector("main.site-main--accordion"), `main-${baseName}`);
  setTestId(document.querySelector(".accordion-stage"), `${baseName}-accordion-stage`);
  setTestId(document.querySelector(".accordion-stage__title"), `${baseName}-accordion-title`);
  setTestId(document.querySelector(".accordion-tools"), `${baseName}-accordion-tools`);
  setTestId(document.querySelector("[data-accordion-search]"), `${baseName}-accordion-search`);
  setTestId(document.querySelector("[data-accordion-filter-button=\"all\"]"), `${baseName}-filter-all`);
  setTestId(document.querySelector("[data-accordion-filter-button=\"2025\"]"), `${baseName}-filter-2025`);
  setTestId(document.querySelector("[data-accordion-filter-button=\"2026\"]"), `${baseName}-filter-2026`);
  setTestId(document.querySelector("[data-accordion-toggle-all]"), `${baseName}-toggle-all`);
  setTestId(document.querySelector("[data-accordion-favorites]"), `${baseName}-favorites-button`);
  setTestId(document.querySelector("[data-accordion-random]"), `${baseName}-random-button`);
  setTestId(document.querySelector(".accordion-list, .accordion-link-list"), `${baseName}-accordion-list`);
  setTestId(document.querySelector("[data-accordion-empty]"), `${baseName}-accordion-empty`);
  setTestId(document.querySelector("[data-accordion-counter]"), `${baseName}-accordion-counter`);
  setTestId(document.querySelector("[data-accordion-counter-value]"), `${baseName}-accordion-counter-value`);
  setTestId(document.querySelector("[data-scroll-top]"), `${baseName}-scroll-top`);

  document.querySelectorAll(".accordion-item, .accordion-link-item").forEach((item, index) => {
    const itemNumber = index + 1;
    const isSecret = isSecretAccordionItem(item);
    const suffix = isSecret ? "secret" : `${itemNumber}`;
    const summary = item.querySelector(".accordion-summary, .accordion-link-item__main");
    const content = item.querySelector(".accordion-content");
    const heart = item.querySelector("[data-accordion-heart]");

    setTestId(item, `${baseName}-accordion-item-${suffix}`);
    setTestId(summary, `${baseName}-accordion-summary-${suffix}`);
    setTestId(content, `${baseName}-accordion-content-${suffix}`);
    setTestId(heart, `${baseName}-accordion-heart-${suffix}`);
  });

  setTestId(document.querySelector("[data-secret-input]"), `${baseName}-secret-input`);
  setTestId(document.querySelector("[data-secret-submit]"), `${baseName}-secret-submit`);
};

const assignPageSpecificTestIds = () => {
  switch (pageName) {
    case "index":
      assignHomeTestIds();
      break;
    case "tworczosc":
      assignGalleryTestIds();
      initGalleryReveal();
      break;
    case "efemigorgia":
      assignTextStageTestIds("efemigorgia");
      break;
    case "de-mour":
      assignPosterPageTestIds();
      break;
    case "wielki-czas":
      assignGlyphPoemPageTestIds();
      break;
    case "milosc":
    case "chec":
    case "dom":
    case "erotyzm":
    case "krzyk":
    case "przeklenstwo":
    case "pustka":
    case "slonce":
    case "smierc":
      assignAccordionTestIds(pageName);
      break;
    default:
      break;
  }
};

const readLikedHearts = () => {
  try {
    const stored = window.localStorage.getItem(heartStorageKey);
    const parsed = stored ? JSON.parse(stored) : {};

    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const writeLikedHearts = (value) => {
  try {
    window.localStorage.setItem(heartStorageKey, JSON.stringify(value));
  } catch {
    // Ignore storage errors so the hearts still work as normal toggles.
  }
};

const getHeartId = (button, index) =>
  button.dataset.heartId || `${window.location.pathname}::heart-${index}`;

const setHeartState = (button, isActive) => {
  button.classList.toggle("is-active", isActive);
  button.setAttribute("aria-pressed", String(isActive));
  button.setAttribute("aria-label", isActive ? "Usuń polubienie pytania" : "Polub pytanie");

  const icon = button.querySelector("span");
  if (icon) {
    icon.textContent = isActive ? "♥" : "♡";
  }
};

let toastTimer = null;
let isContactSubmitting = false;
const toastNode = document.createElement("div");
toastNode.className = "site-toast";
toastNode.hidden = true;
toastNode.setAttribute("role", "status");
toastNode.setAttribute("aria-live", "polite");
setTestId(toastNode, "site-toast");
body.appendChild(toastNode);

assignCommonTestIds();
assignPageSpecificTestIds();
initHomePoemSearch();

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const syncHeader = () => {
  if (!header) {
    return;
  }

  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

const setMenuState = (isOpen) => {
  if (!navToggle || !mobileMenu) {
    return;
  }

  navToggle.setAttribute("aria-expanded", String(isOpen));
  mobileMenu.classList.toggle("is-open", isOpen);
  body.classList.toggle("menu-open", isOpen);
};

const syncModalState = () => {
  const hasOpenModal = Boolean(
    (contactModal && !contactModal.hidden) ||
    (poetNoteModal && !poetNoteModal.hidden) ||
    (transliterationModal && !transliterationModal.hidden) ||
    (poemBonusModal && !poemBonusModal.hidden)
  );

  body.classList.toggle("modal-open", hasOpenModal);
};

if (navToggle && mobileMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    setMenuState(!isOpen);
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuState(false);
      closeContactModal();
      closePoetNoteModal();
      closeTransliterationModal();
      closePoemBonusModal();
    }
  });
}

const openContactModal = () => {
  if (!contactModal) {
    return;
  }

  contactModal.hidden = false;
  syncModalState();
};

const closeContactModal = () => {
  if (!contactModal) {
    return;
  }

  contactModal.hidden = true;
  syncModalState();
};

const openPoetNoteModal = () => {
  if (!poetNoteModal) {
    return;
  }

  poetNoteModal.hidden = false;
  syncModalState();
};

const closePoetNoteModal = () => {
  if (!poetNoteModal) {
    return;
  }

  poetNoteModal.hidden = true;
  syncModalState();
};

const openTransliterationModal = () => {
  if (!transliterationModal) {
    return;
  }

  transliterationModal.hidden = false;
  syncModalState();
};

const closeTransliterationModal = () => {
  if (!transliterationModal) {
    return;
  }

  transliterationModal.hidden = true;
  syncModalState();
};

const openPoemBonusModal = () => {
  if (!poemBonusModal) {
    return;
  }

  poemBonusModal.hidden = false;
  syncModalState();
};

const closePoemBonusModal = () => {
  if (!poemBonusModal) {
    return;
  }

  poemBonusModal.hidden = true;
  syncModalState();
};

const showToast = (message, tone = "success") => {
  if (!toastNode) {
    return;
  }

  clearTimeout(toastTimer);
  toastNode.textContent = message;
  toastNode.dataset.tone = tone;
  toastNode.hidden = false;

  requestAnimationFrame(() => {
    toastNode.classList.add("is-visible");
  });

  toastTimer = window.setTimeout(() => {
    toastNode.classList.remove("is-visible");

    window.setTimeout(() => {
      toastNode.hidden = true;
    }, 220);
  }, 4200);
};

const ensureContactFieldErrors = () => {
  if (!contactForm) {
    return;
  }

  Object.entries(contactFieldNodes).forEach(([fieldName, field]) => {
    if (!(field instanceof HTMLElement)) {
      return;
    }

    const fieldWrapper = field.closest(".contact-form__field");

    if (!fieldWrapper || fieldWrapper.querySelector(".contact-form__error")) {
      return;
    }

    const errorNode = document.createElement("p");
    const errorId = `contact-error-${fieldName}`;

    errorNode.className = "contact-form__error";
    errorNode.id = errorId;
    errorNode.hidden = true;
    setTestId(errorNode, `${fieldName}-contact-error`);
    field.setAttribute("aria-describedby", errorId);
    fieldWrapper.appendChild(errorNode);
  });
};

const getContactErrorNode = (field) => {
  if (!(field instanceof HTMLElement)) {
    return null;
  }

  return field.closest(".contact-form__field")?.querySelector(".contact-form__error") || null;
};

const setContactFieldError = (field, message = "") => {
  if (!(field instanceof HTMLElement)) {
    return;
  }

  const fieldWrapper = field.closest(".contact-form__field");
  const errorNode = getContactErrorNode(field);
  const hasError = Boolean(message);

  field.setAttribute("aria-invalid", String(hasError));
  fieldWrapper?.classList.toggle("is-invalid", hasError);

  if (!errorNode) {
    return;
  }

  errorNode.textContent = message;
  errorNode.hidden = !hasError;
};

const clearContactFormErrors = () => {
  Object.values(contactFieldNodes).forEach((field) => setContactFieldError(field, ""));
};

const clearNativeContactFieldLimits = () => {
  Object.values(contactFieldNodes).forEach((field) => {
    if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) {
      return;
    }

    field.removeAttribute("maxlength");
  });
};

const getContactFieldError = (field) => {
  if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) {
    return "";
  }

  const rawValue = field.value || "";
  const trimmedValue = rawValue.trim();

  if (!rawValue.length) {
    return "To pole nie może być puste.";
  }

  if (!trimmedValue.length) {
    return "To pole nie może składać się wyłącznie ze spacji.";
  }

  if (field.name === "name" && !/^[\p{L}\s]+$/u.test(trimmedValue)) {
    return "Imię może zawierać tylko litery i spacje.";
  }

  if (
    field.name === "email" &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)
  ) {
    return "Wpisz poprawny adres e-mail.";
  }

  if (field.name in contactFieldLimits && rawValue.length > contactFieldLimits[field.name]) {
    return `${contactFieldLabels[field.name]} może mieć maksymalnie ${contactFieldLimits[field.name]} znaków.`;
  }

  if (field.name === "message" && trimmedValue.length <= 10) {
    return "Wiadomość musi mieć więcej niż 10 znaków.";
  }

  return "";
};

const validateContactField = (field) => {
  const errorMessage = getContactFieldError(field);
  setContactFieldError(field, errorMessage);
  return !errorMessage;
};

const validateContactForm = () => {
  const fields = Object.values(contactFieldNodes).filter(Boolean);
  let isValid = true;

  fields.forEach((field) => {
    if (!validateContactField(field)) {
      isValid = false;
    }
  });

  return isValid;
};

contactOpenButtons.forEach((button) => {
  button.addEventListener("click", openContactModal);
});

contactCloseButtons.forEach((button) => {
  button.addEventListener("click", closeContactModal);
});

if (poetNoteOpenButton) {
  poetNoteOpenButton.addEventListener("click", openPoetNoteModal);
}

poetNoteCloseButtons.forEach((button) => {
  button.addEventListener("click", closePoetNoteModal);
});

transliterationOpenButtons.forEach((button) => {
  button.addEventListener("click", openTransliterationModal);
});

transliterationCloseButtons.forEach((button) => {
  button.addEventListener("click", closeTransliterationModal);
});

if (poemBonusTrigger) {
  poemBonusTrigger.addEventListener("click", openPoemBonusModal);
}

poemBonusCloseButtons.forEach((button) => {
  button.addEventListener("click", closePoemBonusModal);
});

const setPoemLineState = (line, isRevealed) => {
  if (!(line instanceof HTMLElement)) {
    return;
  }

  const textNode = line.querySelector("[data-poem-text]");

  if (!(textNode instanceof HTMLElement)) {
    return;
  }

  line.classList.toggle("is-revealed", isRevealed);
};

const preparePoemTextWords = (textNode) => {
  if (!(textNode instanceof HTMLElement) || textNode.dataset.wordsReady === "true") {
    return;
  }

  const fragment = document.createDocumentFragment();

  (textNode.textContent || "").split(/(\s+)/).forEach((token) => {
    if (!token.length) {
      return;
    }

    if (/^\s+$/.test(token)) {
      fragment.append(document.createTextNode(token));
      return;
    }

    const wordNode = document.createElement("span");

    wordNode.className = "glyph-poem__word";
    wordNode.dataset.wordTarget = token;
    wordNode.textContent = token;
    fragment.appendChild(wordNode);
  });

  textNode.textContent = "";
  textNode.appendChild(fragment);
  textNode.dataset.wordsReady = "true";
};

const getPoemWordNodes = () => {
  const wordNodes = [];

  poemLineNodes.forEach((line) => {
    wordNodes.push(...Array.from(line.querySelectorAll(".glyph-poem__word")));
  });

  return wordNodes;
};

const getPoemAlphabetForCharacter = (character) => {
  if (glyphPoemAlphabetUpper.includes(character)) {
    return glyphPoemAlphabetUpper;
  }

  if (glyphPoemAlphabetLower.includes(character)) {
    return glyphPoemAlphabetLower;
  }

  return null;
};

const stopPoemWordAnimation = (node) => {
  if (!(node instanceof HTMLElement)) {
    return;
  }

  if (typeof node.__poemRevealDelayId === "number") {
    window.clearTimeout(node.__poemRevealDelayId);
    node.__poemRevealDelayId = null;
  }

  if (typeof node.__poemRevealIntervalId === "number") {
    window.clearInterval(node.__poemRevealIntervalId);
    node.__poemRevealIntervalId = null;
  }

  if (typeof node.__poemRevealFrameId === "number") {
    window.cancelAnimationFrame(node.__poemRevealFrameId);
    node.__poemRevealFrameId = null;
  }
};

const resetPoemWordNode = (node) => {
  if (!(node instanceof HTMLElement)) {
    return;
  }

  stopPoemWordAnimation(node);
  node.classList.remove("is-revealing", "is-revealed", "is-concealing");
  node.textContent = node.dataset.wordTarget || node.textContent || "";
};

const updatePoemRevealButton = (isActive) => {
  if (!(poemTryLuckButton instanceof HTMLButtonElement)) {
    return;
  }

  poemTryLuckButton.textContent = isActive ? "Zakryj" : "Odkryj";
  poemTryLuckButton.setAttribute("aria-pressed", String(isActive));
};

const hidePartialPoemWords = ({ animated = false } = {}) => {
  getPoemWordNodes().forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }

    if (!animated) {
      resetPoemWordNode(node);
      return;
    }

    if (!node.classList.contains("is-revealed") && !node.classList.contains("is-revealing")) {
      resetPoemWordNode(node);
      return;
    }

    stopPoemWordAnimation(node);
    node.textContent = node.dataset.wordTarget || node.textContent || "";
    node.classList.remove("is-revealing", "is-revealed", "is-concealing");
    node.classList.remove("is-concealing");
    void node.offsetWidth;
    node.classList.add("is-concealing");
    node.addEventListener(
      "animationend",
      () => {
        resetPoemWordNode(node);
      },
      { once: true }
    );
  });

  updatePoemRevealButton(false);
};

const getDeterministicPoemRevealNodes = () => {
  const wordNodes = getPoemWordNodes();

  if (!wordNodes.length) {
    return [];
  }

  const revealCount = Math.max(
    1,
    Math.round(wordNodes.length * glyphPoemRandomRevealRatio)
  );

  return [...wordNodes]
    .map((node, index) => ({
      node,
      score:
        ((((index + 1) * 1103515245) >>> 0) +
          (((node.dataset.wordTarget || node.textContent || "").codePointAt(0) || 0) * 12345)) >>>
        0
    }))
    .sort((left, right) => left.score - right.score)
    .slice(0, revealCount)
    .map(({ node }) => node);
};

const startPoemWordRevealAnimation = (node, delay = 0) => {
  if (!(node instanceof HTMLElement)) {
    return;
  }

  const targetWord = node.dataset.wordTarget || node.textContent || "";
  const characters = Array.from(targetWord).map((character) => {
    const alphabet = getPoemAlphabetForCharacter(character);

    return {
      target: character,
      alphabet,
      targetIndex: alphabet ? alphabet.indexOf(character) : -1
    };
  });
  const characterStaggerMs = 18;
  const baseDurationMs = 260;
  const stepDurationMs = 26;
  const totalDurationMs = characters.reduce((maxDuration, character, index) => {
    if (!character.alphabet || character.targetIndex <= 0) {
      return Math.max(maxDuration, index * characterStaggerMs);
    }

    const characterDuration = baseDurationMs + character.targetIndex * stepDurationMs;
    return Math.max(maxDuration, index * characterStaggerMs + characterDuration);
  }, baseDurationMs);

  const renderStep = (elapsed) => {
    node.textContent = characters
      .map((character, index) => {
        if (!character.alphabet || character.targetIndex <= 0) {
          return character.target;
        }

        const localElapsed = Math.max(0, elapsed - index * characterStaggerMs);
        const characterDuration = baseDurationMs + character.targetIndex * stepDurationMs;
        const progress = Math.min(localElapsed / characterDuration, 1);
        const revealedIndex = Math.min(
          character.targetIndex,
          Math.floor(progress * (character.targetIndex + 1))
        );

        return character.alphabet[revealedIndex];
      })
      .join("");
  };

  const finish = () => {
    stopPoemWordAnimation(node);
    node.textContent = targetWord;
    node.classList.remove("is-revealing");
    node.classList.add("is-revealed");
  };

  const start = () => {
    node.classList.remove("is-concealing", "is-revealed");
    node.classList.add("is-revealing");
    renderStep(0);

    if (totalDurationMs <= 0) {
      finish();
      return;
    }

    const startTime = performance.now();
    const animate = (frameTime) => {
      const elapsed = frameTime - startTime;

      if (elapsed >= totalDurationMs) {
        finish();
        return;
      }

      renderStep(elapsed);
      node.__poemRevealFrameId = window.requestAnimationFrame(animate);
    };

    node.__poemRevealFrameId = window.requestAnimationFrame(animate);
  };

  stopPoemWordAnimation(node);

  if (delay > 0) {
    node.__poemRevealDelayId = window.setTimeout(start, delay);
    return;
  }

  start();
};

const revealDeterministicPoemWords = () => {
  const revealNodes = getDeterministicPoemRevealNodes();

  if (!revealNodes.length) {
    return;
  }

  hidePartialPoemWords();

  revealNodes.forEach((node, index) => {
    startPoemWordRevealAnimation(node, index * 45);
  });

  updatePoemRevealButton(true);
};

if (poemLineNodes.length) {
  poemLineNodes.forEach((line) => {
    const textNode = line.querySelector("[data-poem-text]");

    if (!(textNode instanceof HTMLElement)) {
      return;
    }

    preparePoemTextWords(textNode);
    setPoemLineState(line, false);
  });

  if (poemTryLuckButton instanceof HTMLButtonElement) {
    updatePoemRevealButton(false);

    poemTryLuckButton.addEventListener("click", () => {
      if (poemPasswordInput?.dataset.unlocked === "true") {
        return;
      }

      if (poemTryLuckButton.getAttribute("aria-pressed") === "true") {
        hidePartialPoemWords({ animated: true });
        return;
      }

      revealDeterministicPoemWords();
    });
  }

  if (poemPasswordInput instanceof HTMLInputElement && poemPasswordForm instanceof HTMLFormElement) {
    const defaultPlaceholder = poemPasswordInput.getAttribute("placeholder") || "";

    const unlockPoem = () => {
      hidePartialPoemWords();
      poemLineNodes.forEach((line) => setPoemLineState(line, true));
      poemPasswordInput.dataset.unlocked = "true";
      poemPasswordInput.classList.add("is-unlocked");
      poemPasswordInput.classList.remove("is-error");
      poemPasswordInput.type = "text";
      poemPasswordInput.value = "Odblokowano";
      poemPasswordInput.placeholder = "";
      poemPasswordInput.readOnly = true;

      if (poemPasswordSubmit instanceof HTMLButtonElement) {
        poemPasswordSubmit.disabled = true;
      }

      if (poemTryLuckButton instanceof HTMLButtonElement) {
        poemTryLuckButton.disabled = true;
      }

      if (poemBonusTrigger instanceof HTMLButtonElement) {
        poemBonusTrigger.hidden = false;
      }
    };

    const tryUnlockPoem = () => {
      if (poemPasswordInput.dataset.unlocked === "true") {
        return;
      }

      const attempt = poemPasswordInput.value.trim();

      if (!attempt) {
        return;
      }

      if (attempt === glyphPoemPassword) {
        unlockPoem();
        return;
      }

      poemPasswordInput.classList.add("is-error");
      showToast("Nieprawidłowe hasło.", "error");
    };

    poemPasswordInput.addEventListener("focus", () => {
      if (poemPasswordInput.dataset.unlocked !== "true") {
        poemPasswordInput.placeholder = "";
      }
    });

    poemPasswordInput.addEventListener("blur", () => {
      if (
        poemPasswordInput.dataset.unlocked !== "true" &&
        !poemPasswordInput.value.trim().length
      ) {
        poemPasswordInput.placeholder = defaultPlaceholder;
      }
    });

    poemPasswordInput.addEventListener("input", () => {
      poemPasswordInput.classList.remove("is-error");
    });

    poemPasswordForm.addEventListener("submit", (event) => {
      event.preventDefault();
      tryUnlockPoem();
    });
  }
}

if (contactForm) {
  contactForm.setAttribute("novalidate", "");
  ensureContactFieldErrors();
  clearNativeContactFieldLimits();

  Object.values(contactFieldNodes).forEach((field) => {
    if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) {
      return;
    }

    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true" || field.value.trim().length) {
        validateContactField(field);
      }
    });

    field.addEventListener("blur", () => {
      validateContactField(field);
    });
  });

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (isContactSubmitting) {
      return;
    }

    if (!validateContactForm()) {
      Object.values(contactFieldNodes).find((field) => field?.getAttribute("aria-invalid") === "true")?.focus();
      return;
    }

    const formData = new FormData(contactForm);
    const contactEmail = contactForm.dataset.contactEmail || "";
    const email = (formData.get("email") || "").toString().trim();
    const subject = (formData.get("subject") || "").toString().trim();
    const message = (formData.get("message") || "").toString().trim();
    const submitLabel = contactSubmitButton ? contactSubmitButton.textContent : "";
    const pageName = window.location.pathname.split("/").pop() || "index.html";
    const pageUrl = window.location.protocol === "file:"
      ? `http://localhost:3000/${pageName}`
      : window.location.href;

    if (!contactEmail) {
      showToast("Brak adresu kontaktowego w formularzu.", "error");
      return;
    }

    const payload = {
      name: (formData.get("name") || "").toString().trim(),
      email,
      subject,
      message,
      _subject: `Efemigorgia | ${subject || "Nowa wiadomość"}`,
      _replyto: email,
      _captcha: "false",
      _template: "table",
      _url: pageUrl
    };

    if (contactSubmitButton) {
      contactSubmitButton.disabled = true;
      contactSubmitButton.textContent = "Wysyłanie...";
    }

    isContactSubmitting = true;

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${contactEmail}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Nie udało się wysłać formularza.");
      }

      const responseMessage = (result.message || "").toLowerCase();
      const requiresActivation =
        responseMessage.includes("confirm") || responseMessage.includes("activate");

      contactForm.reset();
      clearContactFormErrors();
      closeContactModal();

      if (requiresActivation) {
        showToast(
          "Sprawdź skrzynkę hrabiademour@gmail.com i aktywuj formularz FormSubmit. Po aktywacji kolejne wiadomości będą wysyłane normalnie.",
          "info"
        );
      } else {
        showToast("Wiadomość została wysłana.", "success");
      }
    } catch (error) {
      showToast(
        error instanceof Error
          ? `${error.message} Jesli testujesz lokalnie, otworz strone przez http://localhost:3000.`
          : "Wysyłka nie powiodła się. Jeśli testujesz lokalnie, otwórz stronę przez http://localhost:3000.",
        "error"
      );
    } finally {
      isContactSubmitting = false;

      if (contactSubmitButton) {
        contactSubmitButton.disabled = false;
        contactSubmitButton.textContent = submitLabel;
      }
    }
  });
}

class AccordionAnimator {
  constructor(item) {
    this.item = item;
    this.summary = item.querySelector(".accordion-summary");
    this.content = item.querySelector(".accordion-content");
    this.animation = null;
    this.contentAnimation = null;
    this.isClosing = false;
    this.isExpanding = false;

    if (!this.summary || !this.content) {
      return;
    }

    this.summary.addEventListener("click", (event) => this.onClick(event));
  }

  onClick(event) {
    if (
      event.target instanceof Element &&
      event.target.closest("button, input, textarea, select, option, label")
    ) {
      return;
    }

    if (
      isSecretAccordionItem(this.item) &&
      this.item.dataset.secretUnlocked !== "true"
    ) {
      event.preventDefault();
      return;
    }

    event.preventDefault();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.item.open = !this.item.open;
      return;
    }

    this.item.style.overflow = "hidden";

    if (this.isClosing || !this.item.open) {
      this.open();
      return;
    }

    if (this.isExpanding || this.item.open) {
      this.shrink();
    }
  }

  shrink() {
    this.isClosing = true;

    const startHeight = `${this.item.offsetHeight}px`;
    const endHeight = `${this.summary.offsetHeight}px`;

    this.cancelAnimations();
    this.animateContent(false);

    this.animation = this.item.animate(
      { height: [startHeight, endHeight] },
      {
        duration: 420,
        easing: "cubic-bezier(0.32, 0, 0.2, 1)"
      }
    );

    this.animation.onfinish = () => this.onAnimationFinish(false);
    this.animation.oncancel = () => {
      this.isClosing = false;
    };
  }

  open() {
    this.item.style.height = `${this.item.offsetHeight}px`;
    this.item.open = true;

    requestAnimationFrame(() => this.expand());
  }

  expand() {
    this.isExpanding = true;

    const startHeight = `${this.item.offsetHeight}px`;
    const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`;

    this.cancelAnimations();
    this.animateContent(true);

    this.animation = this.item.animate(
      { height: [startHeight, endHeight] },
      {
        duration: 520,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)"
      }
    );

    this.animation.onfinish = () => this.onAnimationFinish(true);
    this.animation.oncancel = () => {
      this.isExpanding = false;
    };
  }

  animateContent(isOpening) {
    this.contentAnimation = this.content.animate(
      isOpening
        ? [
            { opacity: 0, transform: "translateY(-10px)" },
            { opacity: 1, transform: "translateY(0)" }
          ]
        : [
            { opacity: 1, transform: "translateY(0)" },
            { opacity: 0, transform: "translateY(-10px)" }
          ],
      {
        duration: isOpening ? 420 : 260,
        easing: "ease",
        fill: "forwards"
      }
    );
  }

  cancelAnimations() {
    if (this.animation) {
      this.animation.cancel();
    }

    if (this.contentAnimation) {
      this.contentAnimation.cancel();
    }
  }

  onAnimationFinish(isOpen) {
    this.item.open = isOpen;
    this.animation = null;
    this.contentAnimation = null;
    this.isClosing = false;
    this.isExpanding = false;
    this.item.style.height = "";
    this.item.style.overflow = "";
  }

  close() {
    if (!this.item.open && !this.isExpanding) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.item.open = false;
      return;
    }

    this.item.style.overflow = "hidden";
    this.shrink();
  }
}

if (accordionItems.length) {
  accordionItems.forEach((item) => {
    item.__accordionAnimator = new AccordionAnimator(item);
  });

  accordionItems.forEach((item, index) => {
    const content = item.querySelector(".accordion-content");

    if (!content || content.querySelector("[data-accordion-close]")) {
      return;
    }

    const closeButton = document.createElement("button");

    closeButton.type = "button";
    closeButton.className = "accordion-content__close";
    closeButton.textContent = "Ukryj";
    closeButton.setAttribute("data-accordion-close", "");
    setTestId(closeButton, `${pageName}-accordion-close-${index + 1}`);

    closeButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const animator = item.__accordionAnimator;

      if (animator && typeof animator.close === "function") {
        animator.close();
        return;
      }

      item.open = false;
    });

    content.appendChild(closeButton);
  });
}

const hashSecretValue = async (value) => {
  if (!window.crypto?.subtle || typeof TextEncoder === "undefined") {
    throw new Error("Brak obsługi bezpiecznej weryfikacji hasła w tej przeglądarce.");
  }

  const encoded = new TextEncoder().encode(value);
  const digest = await window.crypto.subtle.digest("SHA-256", encoded);

  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
};

const secretAccordionItems = document.querySelectorAll(".accordion-item.accordion-item--secret");

if (secretAccordionItems.length) {
  secretAccordionItems.forEach((item) => {
    const secretInput = item.querySelector("[data-secret-input]");
    const secretSubmit = item.querySelector("[data-secret-submit]");
    const secretTitleNode = item.querySelector("[data-secret-title-node]");
    const secretTitle = item.dataset.secretTitle || "Ukryty tekst";
    const secretHash = item.dataset.secretHash || defaultSecretHash;
    let isCheckingSecret = false;

    if (!secretInput || !secretSubmit || !secretTitleNode || !secretHash) {
      return;
    }

    const unlockSecret = () => {
      item.dataset.secretUnlocked = "true";
      secretTitleNode.textContent = secretTitle;
      secretInput.classList.remove("is-error");
      secretInput.classList.add("is-unlocked");
      secretInput.type = "text";
      secretInput.value = "Odblokowano";
      secretInput.disabled = true;
      secretSubmit.textContent = "Gotowe";
      secretSubmit.disabled = true;
      item.open = true;
    };

    const handleAttempt = async () => {
      if (item.dataset.secretUnlocked === "true" || isCheckingSecret) {
        return;
      }

      const attempt = secretInput.value;

      if (!attempt) {
        secretInput.classList.remove("is-error");
        return;
      }

      isCheckingSecret = true;
      secretSubmit.disabled = true;

      try {
        const attemptHash = await hashSecretValue(attempt);

        if (attemptHash === secretHash) {
          unlockSecret();
          return;
        }

        secretInput.classList.add("is-error");
        showToast("Nieprawidłowe hasło.", "error");
      } catch (error) {
        showToast(
          error instanceof Error ? error.message : "Nie udało się zweryfikować hasła.",
          "error"
        );
      } finally {
        isCheckingSecret = false;

        if (item.dataset.secretUnlocked !== "true") {
          secretSubmit.disabled = false;
        }
      }
    };

    secretInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        void handleAttempt();
      }
    });

    secretInput.addEventListener("input", () => {
      secretInput.classList.remove("is-error");
    });

    secretSubmit.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      void handleAttempt();
    });
  });
}

if (accordionHeartButtons.length) {
  const likedHearts = readLikedHearts();

  accordionHeartButtons.forEach((button, index) => {
    const heartId = getHeartId(button, index);

    if (likedHearts[heartId]) {
      setHeartState(button, true);
    }

    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const isActive = !button.classList.contains("is-active");

      setHeartState(button, isActive);

      if (isActive) {
        likedHearts[heartId] = true;
      } else {
        delete likedHearts[heartId];
      }

      writeLikedHearts(likedHearts);
      button.dispatchEvent(
        new CustomEvent("accordionheartchange", {
          bubbles: true
        })
      );
    });
  });
}

const accordionFilterRoots = document.querySelectorAll("[data-accordion-filter]");

if (accordionFilterRoots.length) {
  accordionFilterRoots.forEach((root) => {
    const stage = root.closest(".accordion-stage__inner");
    const searchInput = root.querySelector("[data-accordion-search]");
    const filterButtons = Array.from(root.querySelectorAll("[data-accordion-filter-button]"));
    const toggleAllButton = root.querySelector("[data-accordion-toggle-all]");
    const favoritesButton = root.querySelector("[data-accordion-favorites]");
    const randomButton = root.querySelector("[data-accordion-random]");
    const counterValue = stage.querySelector("[data-accordion-counter-value]");
    const accordionList = stage ? stage.querySelector(".accordion-list, .accordion-link-list") : null;
    const filterItems = accordionList
      ? Array.from(
          accordionList.querySelectorAll(
            ".accordion-item[data-accordion-year], .accordion-link-item[data-accordion-year]"
          )
        )
      : [];
    const emptyState = accordionList ? accordionList.querySelector("[data-accordion-empty]") : null;

    if (!stage || !searchInput || !filterButtons.length || !accordionList || !filterItems.length) {
      return;
    }

    let activeYear = "all";
    let favoritesMode = false;
    let randomItem = null;

    const getMatchingItems = () => {
      const query = searchInput.value.trim().toLowerCase();

      return filterItems.filter((item) => {
        const itemYear = item.dataset.accordionYear || "";
        const matchesYear = activeYear === "all" || itemYear === activeYear;
        const haystack = item.textContent ? item.textContent.toLowerCase() : "";
        const matchesQuery = !query || haystack.includes(query);

        return matchesYear && matchesQuery;
      });
    };

    const getVisibleItems = () => filterItems.filter((item) => !item.hidden);
    const getUnlockedVisibleItems = () =>
      getVisibleItems().filter((item) => !isSecretAccordionItem(item));

    const getFavoriteItems = () =>
      filterItems.filter((item) => {
        const heartButton = item.querySelector("[data-accordion-heart]");

        return Boolean(heartButton && heartButton.classList.contains("is-active"));
      });

    const updateFavoritesButton = () => {
      if (!favoritesButton) {
        return;
      }

      const hasFavorites = getFavoriteItems().length > 0;

      favoritesButton.disabled = !hasFavorites && !favoritesMode;
      favoritesButton.textContent = favoritesMode ? "Wszystkie" : "Ulubione";
      favoritesButton.setAttribute("aria-pressed", String(favoritesMode));
    };

    const updateRandomButton = () => {
      if (!randomButton) {
        return;
      }

      const matchingItems = getMatchingItems();
      const isRandomMode = Boolean(randomItem);

      randomButton.disabled = !matchingItems.length;
      randomButton.textContent = isRandomMode ? "Wszystkie" : "Losuj";
      randomButton.setAttribute("aria-pressed", String(isRandomMode));
    };

    const updateToggleAllButton = () => {
      if (!toggleAllButton) {
        return;
      }

      const visibleItems = getUnlockedVisibleItems().filter((item) => isAccordionDetailsItem(item));
      const hasVisibleItems = visibleItems.length > 0;
      const allOpen = hasVisibleItems && visibleItems.every((item) => item.open);

      toggleAllButton.disabled = !hasVisibleItems;
      toggleAllButton.textContent = allOpen ? "Ukryj wszystkie" : "Rozwiń wszystkie";
      toggleAllButton.setAttribute("aria-pressed", String(allOpen));
    };

    const runFilter = () => {
      const matchingItems = getMatchingItems();
      const favoritesItems = favoritesMode
        ? matchingItems.filter((item) => getFavoriteItems().includes(item))
        : matchingItems;
      const visibleItems =
        randomItem && matchingItems.includes(randomItem)
          ? [randomItem]
          : favoritesItems;
      let visibleCount = 0;

      filterItems.forEach((item) => {
        const isVisible = visibleItems.includes(item);

        item.hidden = !isVisible;

        if (!isVisible) {
          if (isAccordionDetailsItem(item)) {
            item.open = false;
          }

          return;
        }

        visibleCount += 1;
      });

      if (emptyState) {
        emptyState.hidden = visibleCount !== 0;
      }

      if (counterValue) {
        counterValue.textContent = String(visibleCount);
      }

      updateToggleAllButton();
      updateFavoritesButton();
      updateRandomButton();
    };

    searchInput.addEventListener("input", () => {
      randomItem = null;
      runFilter();
    });

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        activeYear = button.dataset.accordionFilterButton || "all";
        randomItem = null;

        filterButtons.forEach((filterButton) => {
          const isActive = filterButton === button;
          filterButton.classList.toggle("is-active", isActive);
          filterButton.setAttribute("aria-pressed", String(isActive));
        });

        runFilter();
      });
    });

    if (toggleAllButton) {
      toggleAllButton.addEventListener("click", () => {
        const visibleItems = getUnlockedVisibleItems().filter((item) => isAccordionDetailsItem(item));
        const allOpen = visibleItems.length > 0 && visibleItems.every((item) => item.open);

        visibleItems.forEach((item) => {
          item.open = !allOpen;
        });

        updateToggleAllButton();
      });
    }

    if (randomButton) {
      randomButton.addEventListener("click", () => {
        favoritesMode = false;

        if (randomItem) {
          const previousRandomItem = randomItem;
          randomItem = null;
          runFilter();
          if (isAccordionDetailsItem(previousRandomItem)) {
            previousRandomItem.open = false;
          }
          updateToggleAllButton();
          return;
        }

        const matchingItems = getMatchingItems().filter((item) => !isSecretAccordionItem(item));

        if (!matchingItems.length) {
          return;
        }

        const pool = randomItem
          ? matchingItems.filter((item) => item !== randomItem)
          : matchingItems;
        const selectionPool = pool.length ? pool : matchingItems;
        const randomIndex = Math.floor(Math.random() * selectionPool.length);

        randomItem = selectionPool[randomIndex];
        runFilter();
        if (isAccordionDetailsItem(randomItem)) {
          randomItem.open = true;
        }
        updateToggleAllButton();
      });
    }

    filterItems.forEach((item) => {
      const heartButton = item.querySelector("[data-accordion-heart]");

      if (heartButton) {
        heartButton.addEventListener("accordionheartchange", () => {
          window.requestAnimationFrame(runFilter);
        });
      }

      item.addEventListener("toggle", () => {
        window.requestAnimationFrame(updateToggleAllButton);
      });
    });

    if (favoritesButton) {
      favoritesButton.addEventListener("click", () => {
        if (favoritesMode) {
          favoritesMode = false;
          runFilter();
          return;
        }

        favoritesMode = true;
        randomItem = null;
        runFilter();
      });
    }

    runFilter();
  });
}

revealPoemSearchTargetFromUrl();

if (scrollTopButtons.length) {
  scrollTopButtons.forEach((button) => {
    button.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth"
      });
    });
  });
}

if (heroMedia && heroVideo) {
  const markReady = () => heroMedia.classList.add("is-video-ready");

  heroVideo.addEventListener("canplay", markReady, { once: true });
  heroVideo.addEventListener(
    "loadeddata",
    () => {
      if (heroVideo.readyState >= 2) {
        markReady();
      }
    },
    { once: true }
  );

  heroVideo.addEventListener("error", () => {
    heroMedia.classList.remove("is-video-ready");
  });

  const sourceNode = heroVideo.querySelector("source");
  if (sourceNode) {
    sourceNode.addEventListener("error", () => {
      heroMedia.classList.remove("is-video-ready");
    });
  }

  const autoplayAttempt = heroVideo.play();
  if (autoplayAttempt && typeof autoplayAttempt.catch === "function") {
    autoplayAttempt.catch(() => {
      heroMedia.classList.remove("is-video-ready");
    });
  }
}
