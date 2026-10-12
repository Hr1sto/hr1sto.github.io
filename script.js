(() => {
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const siteNav = document.querySelector('[data-site-nav]');

  const closeMenu = () => {
    if (!menuToggle || !siteNav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Отвори менюто');
    siteNav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };

  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
      const willOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
      menuToggle.setAttribute('aria-expanded', String(willOpen));
      menuToggle.setAttribute('aria-label', willOpen ? 'Затвори менюто' : 'Отвори менюто');
      siteNav.classList.toggle('is-open', willOpen);
      document.body.classList.toggle('menu-open', willOpen);
    });

    siteNav.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 860) closeMenu();
    });
  }

  const galleryButtons = Array.from(document.querySelectorAll('[data-lightbox-item]'));
  const lightbox = document.querySelector('[data-lightbox]');

  if (galleryButtons.length && lightbox) {
    const lightboxImage = lightbox.querySelector('[data-lightbox-image]');
    const lightboxCaption = lightbox.querySelector('[data-lightbox-caption]');
    const closeButton = lightbox.querySelector('[data-lightbox-close]');
    const previousButton = lightbox.querySelector('[data-lightbox-prev]');
    const nextButton = lightbox.querySelector('[data-lightbox-next]');
    let currentIndex = 0;
    let lastTrigger = null;

    const showImage = (index) => {
      currentIndex = (index + galleryButtons.length) % galleryButtons.length;
      const selected = galleryButtons[currentIndex];
      const image = selected.querySelector('img');
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      lightboxCaption.textContent = image.alt;
    };

    const openLightbox = (index, trigger) => {
      lastTrigger = trigger;
      showImage(index);
      lightbox.hidden = false;
      document.body.classList.add('lightbox-open');
      closeButton.focus();
    };

    const closeLightbox = () => {
      lightbox.hidden = true;
      document.body.classList.remove('lightbox-open');
      lightboxImage.removeAttribute('src');
      if (lastTrigger) lastTrigger.focus();
    };

    galleryButtons.forEach((button, index) => {
      button.addEventListener('click', () => openLightbox(index, button));
    });

    closeButton.addEventListener('click', closeLightbox);
    previousButton.addEventListener('click', () => showImage(currentIndex - 1));
    nextButton.addEventListener('click', () => showImage(currentIndex + 1));

    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (event) => {
      if (lightbox.hidden) {
        if (event.key === 'Escape') closeMenu();
        return;
      }

      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (event.key === 'ArrowRight') showImage(currentIndex + 1);
      if (event.key === 'Tab') {
        const controls = [closeButton, previousButton, nextButton];
        const activeIndex = controls.indexOf(document.activeElement);
        event.preventDefault();
        const nextIndex = event.shiftKey
          ? (activeIndex - 1 + controls.length) % controls.length
          : (activeIndex + 1) % controls.length;
        controls[nextIndex].focus();
      }
    });
  } else {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }
})();
