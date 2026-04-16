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
const scrollTopButtons = document.querySelectorAll("[data-scroll-top]");
const accordionHeartButtons = document.querySelectorAll("[data-accordion-heart]");
const heartStorageKey = "efemigorgia:liked-hearts";
const defaultSecretHash = "128df13c1e54ffaaafcc9d07ec7427d61f764214e6ae0321de23c94d261d0860";
const pageName = (() => {
  const rawPath = window.location.pathname.split("/").pop() || "index.html";
  const cleanPath = rawPath.split("?")[0].split("#")[0];

  return cleanPath.replace(/\.html$/i, "") || "index";
})();

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
  setTestId(document.querySelector(".accordion-list"), `${baseName}-accordion-list`);
  setTestId(document.querySelector("[data-accordion-empty]"), `${baseName}-accordion-empty`);
  setTestId(document.querySelector("[data-accordion-counter]"), `${baseName}-accordion-counter`);
  setTestId(document.querySelector("[data-accordion-counter-value]"), `${baseName}-accordion-counter-value`);
  setTestId(document.querySelector("[data-scroll-top]"), `${baseName}-scroll-top`);

  document.querySelectorAll(".accordion-item").forEach((item, index) => {
    const itemNumber = index + 1;
    const isSecret = isSecretAccordionItem(item);
    const suffix = isSecret ? "secret" : `${itemNumber}`;
    const summary = item.querySelector(".accordion-summary");
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
      break;
    case "efemigorgia":
      assignTextStageTestIds("efemigorgia");
      break;
    case "de-mour":
      assignPosterPageTestIds();
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
    (poetNoteModal && !poetNoteModal.hidden)
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

  if (
    field.name === "email" &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)
  ) {
    return "Wpisz poprawny adres e-mail.";
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

if (contactForm) {
  contactForm.setAttribute("novalidate", "");
  ensureContactFieldErrors();

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
    const accordionList = stage ? stage.querySelector(".accordion-list") : null;
    const filterItems = accordionList
      ? Array.from(accordionList.querySelectorAll(".accordion-item[data-accordion-year]"))
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

      const visibleItems = getUnlockedVisibleItems();
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
          item.open = false;
        } else {
          visibleCount += 1;
        }
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
        const visibleItems = getUnlockedVisibleItems();
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
          previousRandomItem.open = false;
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
        randomItem.open = true;
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
