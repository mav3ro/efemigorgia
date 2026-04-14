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
const accordionItems = document.querySelectorAll(".accordion-item");
const contactSubmitButton = contactForm ? contactForm.querySelector(".contact-form__submit") : null;

let toastTimer = null;
const toastNode = document.createElement("div");
toastNode.className = "site-toast";
toastNode.hidden = true;
toastNode.setAttribute("role", "status");
toastNode.setAttribute("aria-live", "polite");
body.appendChild(toastNode);

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
    }
  });
}

const openContactModal = () => {
  if (!contactModal) {
    return;
  }

  contactModal.hidden = false;
  body.classList.add("modal-open");
};

const closeContactModal = () => {
  if (!contactModal) {
    return;
  }

  contactModal.hidden = true;
  body.classList.remove("modal-open");
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

contactOpenButtons.forEach((button) => {
  button.addEventListener("click", openContactModal);
});

contactCloseButtons.forEach((button) => {
  button.addEventListener("click", closeContactModal);
});

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

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
}

if (accordionItems.length) {
  accordionItems.forEach((item) => {
    new AccordionAnimator(item);
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
