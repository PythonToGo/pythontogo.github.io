(function () {
  let currentSlide = 0;
  let slides, totalSlides, wrapper, indicatorsContainer, prevBtn, nextBtn;

  function initSlider() {
    slides = document.querySelectorAll('.about-slide');
    totalSlides = slides.length;
    wrapper = document.getElementById('sliderWrapper');
    indicatorsContainer = document.getElementById('sliderIndicators');
    prevBtn = document.querySelector('.about-slider-nav.prev');
    nextBtn = document.querySelector('.about-slider-nav.next');

    if (
      !slides.length ||
      !wrapper ||
      !indicatorsContainer ||
      !prevBtn ||
      !nextBtn
    ) {
      console.error('Slider elements not found');
      return;
    }

    // Create indicators
    indicatorsContainer.innerHTML = '';
    slides.forEach((_, index) => {
      const indicator = document.createElement('button');
      indicator.className =
        'about-slider-indicator' + (index === 0 ? ' active' : '');
      indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
      indicator.onclick = () => goToSlide(index);
      indicatorsContainer.appendChild(indicator);
    });

    // Initialize section navigation buttons
    initSectionNavButtons();

    // Adjust bookmark position based on sidebar width
    adjustBookmarkPosition();

    // Initialize first slide
    updateSlider();
  }

  function adjustBookmarkPosition() {
    const bookmark = document.querySelector('.section-nav-bookmark');
    if (!bookmark) return;

    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      const sidebarRect = sidebar.getBoundingClientRect();
      const isLeftSidebar = sidebarRect.left < window.innerWidth / 2;

      if (isLeftSidebar) {
        const sidebarRight = sidebarRect.right;
        bookmark.style.left = `${sidebarRight + 32}px`;
        bookmark.style.right = 'auto';
      } else {
        const sidebarLeft = window.innerWidth - sidebarRect.left;
        bookmark.style.right = `${sidebarLeft + 32}px`;
        bookmark.style.left = 'auto';
      }
    } else {
      bookmark.style.right = '2rem';
      bookmark.style.left = 'auto';
    }

    // adjust position when window is resized
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (sidebar) {
          const sidebarRect = sidebar.getBoundingClientRect();
          const isLeftSidebar = sidebarRect.left < window.innerWidth / 2;

          if (isLeftSidebar) {
            const sidebarRight = sidebarRect.right;
            bookmark.style.left = `${sidebarRight + 32}px`;
            bookmark.style.right = 'auto';
          } else {
            const sidebarLeft = window.innerWidth - sidebarRect.left;
            bookmark.style.right = `${sidebarLeft + 32}px`;
            bookmark.style.left = 'auto';
          }
        } else {
          bookmark.style.right = '2rem';
          bookmark.style.left = 'auto';
        }
      }, 100);
    });
  }

  function initSectionNavButtons() {
    const bookmark = document.querySelector('.section-nav-bookmark');
    const sectionNavButtons = document.querySelectorAll('.section-nav-btn');

    sectionNavButtons.forEach((button) => {
      const slideIndex = parseInt(button.getAttribute('data-slide'));

      button.addEventListener('click', () => {
        goToSlide(slideIndex);
      });
    });

    if (bookmark) {
      let expandTimeout;
      let collapseTimeout;

      bookmark.addEventListener('mouseenter', () => {
        clearTimeout(collapseTimeout);
        expandTimeout = setTimeout(() => {
          bookmark.classList.add('expanded');
        }, 100);
      });

      bookmark.addEventListener('mouseleave', () => {
        clearTimeout(expandTimeout);
        collapseTimeout = setTimeout(() => {
          bookmark.classList.remove('expanded');
        }, 300);
      });

      bookmark.addEventListener('click', (e) => {
        if (e.target.classList.contains('section-nav-btn')) {
          return;
        }
        bookmark.classList.toggle('expanded');
      });
    }
  }

  function updateSlider() {
    if (!wrapper || !slides) return;

    wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Update active slide
    slides.forEach((slide, index) => {
      if (index === currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Update indicators
    const indicators = document.querySelectorAll('.about-slider-indicator');
    indicators.forEach((indicator, index) => {
      if (index === currentSlide) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });

    // Update button states
    if (prevBtn) prevBtn.disabled = currentSlide === 0;
    if (nextBtn) nextBtn.disabled = currentSlide === totalSlides - 1;

    // Update section navigation buttons
    const sectionNavButtons = document.querySelectorAll('.section-nav-btn');
    sectionNavButtons.forEach((button, index) => {
      const slideIndex = parseInt(button.getAttribute('data-slide'));
      if (slideIndex === currentSlide) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }

  function changeSlide(direction) {
    const newSlide = currentSlide + direction;
    if (newSlide >= 0 && newSlide < totalSlides) {
      currentSlide = newSlide;
      updateSlider();
    }
  }

  function goToSlide(index) {
    if (index >= 0 && index < totalSlides) {
      currentSlide = index;
      updateSlider();
    }
  }

  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initSlider();
    });
  } else {
    // DOM already loaded
    initSlider();
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      changeSlide(-1);
    } else if (e.key === 'ArrowRight') {
      changeSlide(1);
    }
  });

  // Touch/swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  document.addEventListener(
    'touchstart',
    (e) => {
      if (e.target.closest('.about-slider-container')) {
        touchStartX = e.changedTouches[0].screenX;
      }
    },
    { passive: true }
  );

  document.addEventListener(
    'touchend',
    (e) => {
      if (e.target.closest('.about-slider-container')) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }
    },
    { passive: true }
  );

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next slide
        changeSlide(1);
      } else {
        // Swipe right - previous slide
        changeSlide(-1);
      }
    }
  }

  // Make functions globally available
  window.changeSlide = changeSlide;
  window.goToSlide = goToSlide;
})();
