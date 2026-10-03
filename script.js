const WHATSAPP_BASE_URL = "https://wa.me/";

const whatsappMessages = {
  general: "Hi DigiMaraa Construction, I would like to discuss a construction project.",
  quote: "Hi DigiMaraa Construction, I would like to request a quote for my construction project.",
  project: "Hi DigiMaraa Construction, I would like to discuss my construction project."
};

const serviceMessages = {
  "Home Construction": "Hi DigiMaraa Construction, I am interested in home construction. I would like to discuss my requirements.",
  "Architectural Planning": "Hi DigiMaraa Construction, I am interested in architectural planning. I would like to discuss my project requirements.",
  "Interior Works": "Hi DigiMaraa Construction, I am interested in your interior works. Please share more details.",
  "Renovation & Remodeling": "Hi DigiMaraa Construction, I am interested in renovation/remodeling services. I would like to discuss my project.",
  "Customized Construction": "Hi DigiMaraa Construction, I am interested in customized construction. I would like to discuss my specific requirements.",
  "Project Execution": "Hi DigiMaraa Construction, I am interested in project execution services. I would like to discuss my project."
};

function openWhatsApp(message) {
  const url = `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const header = document.querySelector("[data-header]");
const backToTop = document.querySelector("[data-back-to-top]");
let scrollTicking = false;

function updateScrollUI() {
  if (header) {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  if (backToTop) {
    const shouldShow = window.scrollY > 720;
    if (shouldShow && backToTop.hidden) {
      backToTop.hidden = false;
    } else if (!shouldShow && !backToTop.hidden) {
      backToTop.hidden = true;
    }
  }

  scrollTicking = false;
}

function handleScroll() {
  if (!scrollTicking) {
    window.requestAnimationFrame(updateScrollUI);
    scrollTicking = true;
  }
}

window.addEventListener("scroll", handleScroll, { passive: true });
updateScrollUI();

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion.matches ? "auto" : "smooth"
    });
  });
}

document.querySelectorAll("[data-whatsapp-intent]").forEach((button) => {
  button.addEventListener("click", () => {
    const intent = button.dataset.whatsappIntent;
    openWhatsApp(whatsappMessages[intent] || whatsappMessages.general);
  });
});

document.querySelectorAll("[data-whatsapp-service]").forEach((button) => {
  button.addEventListener("click", () => {
    const service = button.dataset.whatsappService;
    openWhatsApp(serviceMessages[service] || `Hi DigiMaraa Construction, I would like to know more about ${service}.`);
  });
});

const menu = document.querySelector("#mobile-menu");
const menuOpenButton = document.querySelector("[data-menu-open]");
const menuCloseButton = document.querySelector("[data-menu-close]");
const mobileLinks = document.querySelectorAll("[data-mobile-link]");
let menuIsOpen = false;
let previouslyFocusedElement = null;

function getMenuFocusableElements() {
  if (!menu) {
    return [];
  }

  return [...menu.querySelectorAll("a[href], button:not([disabled])")].filter((element) => !element.hasAttribute("inert"));
}

function openMenu() {
  if (!menu || !menuOpenButton || menuIsOpen) {
    return;
  }

  menuIsOpen = true;
  previouslyFocusedElement = document.activeElement;
  menu.removeAttribute("inert");
  menu.setAttribute("aria-hidden", "false");
  menuOpenButton.setAttribute("aria-expanded", "true");
  header?.classList.add("is-menu-open");
  document.body.classList.add("menu-open");
  window.setTimeout(() => menuCloseButton?.focus(), 180);
}

function closeMenu({ restoreFocus = true } = {}) {
  if (!menu || !menuOpenButton || !menuIsOpen) {
    return;
  }

  menuIsOpen = false;
  menu.setAttribute("aria-hidden", "true");
  menuOpenButton.setAttribute("aria-expanded", "false");
  header?.classList.remove("is-menu-open");
  document.body.classList.remove("menu-open");
  window.setTimeout(() => {
    if (!menuIsOpen) {
      menu.setAttribute("inert", "");
    }
  }, 320);

  if (restoreFocus) {
    (previouslyFocusedElement instanceof HTMLElement ? previouslyFocusedElement : menuOpenButton).focus();
  }
}

menuOpenButton?.addEventListener("click", openMenu);
menuCloseButton?.addEventListener("click", () => closeMenu());
mobileLinks.forEach((link) => link.addEventListener("click", () => closeMenu({ restoreFocus: false })));

document.addEventListener("keydown", (event) => {
  if (!menuIsOpen) {
    return;
  }

  if (event.key === "Escape") {
    event.preventDefault();
    closeMenu();
    return;
  }

  if (event.key !== "Tab") {
    return;
  }

  const focusableElements = getMenuFocusableElements();
  if (!focusableElements.length) {
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
});

function scrollToTarget(target) {
  if (!target) {
    return;
  }

  target.scrollIntoView({
    behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    block: "start"
  });

  if (!target.hasAttribute("tabindex")) {
    target.setAttribute("tabindex", "-1");
  }

  target.focus({ preventScroll: true });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const hash = link.getAttribute("href");
    if (!hash || hash === "#") {
      return;
    }

    const target = document.querySelector(hash);
    if (!target) {
      return;
    }

    event.preventDefault();
    const menuWasOpen = menuIsOpen;
    closeMenu({ restoreFocus: false });
    window.setTimeout(() => scrollToTarget(target), menuWasOpen ? 330 : prefersReducedMotion.matches ? 0 : 80);

    try {
      window.history.pushState(null, "", hash);
    } catch (error) {
      window.location.hash = hash;
    }
  });
});

const revealElements = document.querySelectorAll(".reveal");

if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.11,
    rootMargin: "0px 0px -45px 0px"
  });

  revealElements.forEach((element) => revealObserver.observe(element));
}

const navigationLinks = document.querySelectorAll("[data-nav-link], [data-mobile-link]");
const observedSections = [...new Set([...navigationLinks].map((link) => link.getAttribute("href")))]
  .map((href) => document.querySelector(href))
  .filter(Boolean);

function setActiveNavigation(id) {
  navigationLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

if ("IntersectionObserver" in window && observedSections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visibleEntries = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (visibleEntries[0]) {
      setActiveNavigation(visibleEntries[0].target.id);
    }
  }, {
    rootMargin: "-28% 0px -58% 0px",
    threshold: [0, 0.1, 0.25]
  });

  observedSections.forEach((section) => sectionObserver.observe(section));
}

const faqButtons = [...document.querySelectorAll(".faq-item h3 button")];
const faqItems = [...document.querySelectorAll(".faq-item")];

function setFaqPanelState(item, isOpen) {
  const button = item.querySelector("h3 button");
  const panel = item.querySelector(".faq-panel");
  if (!button || !panel) {
    return;
  }

  item.classList.toggle("is-open", isOpen);
  button.setAttribute("aria-expanded", String(isOpen));
  panel.setAttribute("aria-hidden", String(!isOpen));
  panel.style.height = isOpen ? `${panel.scrollHeight}px` : "0px";
}

faqItems.forEach((item) => {
  const button = item.querySelector("h3 button");
  const panel = item.querySelector(".faq-panel");

  if (item.classList.contains("is-open") && panel) {
    button?.setAttribute("aria-expanded", "true");
    panel.setAttribute("aria-hidden", "false");
    panel.style.height = "0px";
    window.requestAnimationFrame(() => {
      panel.style.height = `${panel.scrollHeight}px`;
    });
  } else {
    setFaqPanelState(item, false);
  }

  button?.addEventListener("click", () => {
    const shouldOpen = button.getAttribute("aria-expanded") !== "true";
    faqItems.forEach((otherItem) => {
      if (otherItem !== item) {
        setFaqPanelState(otherItem, false);
      }
    });
    setFaqPanelState(item, shouldOpen);
  });
});

faqButtons.forEach((button, index) => {
  button.addEventListener("keydown", (event) => {
    let nextIndex = index;

    if (event.key === "ArrowDown") {
      nextIndex = (index + 1) % faqButtons.length;
    } else if (event.key === "ArrowUp") {
      nextIndex = (index - 1 + faqButtons.length) % faqButtons.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = faqButtons.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    faqButtons[nextIndex].focus();
  });
});

window.addEventListener("resize", () => {
  const openFaq = document.querySelector(".faq-item.is-open .faq-panel");
  if (openFaq) {
    openFaq.style.height = `${openFaq.scrollHeight}px`;
  }
});

const carousel = document.querySelector("[data-carousel]");

if (carousel) {
  const track = carousel.querySelector("[data-carousel-track]");
  const slides = [...carousel.querySelectorAll("[data-carousel-slide]")];
  const previousButton = carousel.querySelector("[data-carousel-prev]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  const dotsContainer = carousel.querySelector("[data-carousel-dots]");
  let currentSlide = 0;
  let pointerStartX = 0;

  const dots = slides.map((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel-dot";
    dot.setAttribute("aria-label", `Show testimonial ${index + 1}`);
    dot.addEventListener("click", () => setCarouselSlide(index));
    dotsContainer?.append(dot);
    return dot;
  });

  function setCarouselSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    if (track) {
      track.style.transform = `translate3d(-${currentSlide * 100}%, 0, 0)`;
    }

    slides.forEach((slide, slideIndex) => {
      const isCurrent = slideIndex === currentSlide;
      slide.setAttribute("aria-hidden", String(!isCurrent));
    });

    dots.forEach((dot, dotIndex) => {
      const isCurrent = dotIndex === currentSlide;
      dot.classList.toggle("is-active", isCurrent);
      if (isCurrent) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });
  }

  previousButton?.addEventListener("click", () => setCarouselSlide(currentSlide - 1));
  nextButton?.addEventListener("click", () => setCarouselSlide(currentSlide + 1));

  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setCarouselSlide(currentSlide - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setCarouselSlide(currentSlide + 1);
    }
  });

  carousel.addEventListener("pointerdown", (event) => {
    pointerStartX = event.clientX;
  }, { passive: true });

  carousel.addEventListener("pointerup", (event) => {
    const swipeDistance = event.clientX - pointerStartX;
    if (Math.abs(swipeDistance) > 50) {
      setCarouselSlide(currentSlide + (swipeDistance < 0 ? 1 : -1));
    }
  }, { passive: true });

  setCarouselSlide(0);
}

const reviewPlaceholder = document.querySelector("[data-review-placeholder]");
const reviewStatus = document.querySelector("[data-review-status]");
let reviewStatusTimer;

reviewPlaceholder?.addEventListener("click", () => {
  if (!reviewStatus) {
    return;
  }

  window.clearTimeout(reviewStatusTimer);
  reviewStatus.textContent = "Verified Google review link coming soon.";
  reviewStatusTimer = window.setTimeout(() => {
    reviewStatus.textContent = "";
  }, 5000);
});
