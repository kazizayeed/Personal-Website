/**
 * Portfolio Website - Main JavaScript
 * Handles navigation, gallery zoom, scroll effects, and accessibility
 * @author Kazi Zayeed
 * @version 2.0.0
 */

'use strict';

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Add event listeners to multiple elements
 * @param {NodeList|Array} elements - Collection of DOM elements
 * @param {string} eventType - Event type (e.g., 'click', 'scroll')
 * @param {Function} callback - Callback function to execute
 */
const addEventOnElements = (elements, eventType, callback) => {
  if (!elements || elements.length === 0) {
    console.warn(`No elements found for event: ${eventType}`);
    return;
  }

  elements.forEach(element => {
    element.addEventListener(eventType, callback);
  });
};

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
const debounce = (func, wait = 250) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function to limit function execution rate
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
const throttle = (func, limit = 100) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// ========================================
// MOBILE NAVIGATION MODULE
// ========================================

const NavigationModule = (() => {
  let navbar = null;
  let navTogglers = null;
  let navLinks = null;
  let header = null;
  let isNavOpen = false;

  /**
   * Initialize navigation functionality
   */
  const init = () => {
    // Get DOM elements
    navbar = document.querySelector('[data-navbar]');
    navTogglers = document.querySelectorAll('[data-nav-toggler]');
    navLinks = document.querySelectorAll('[data-navbar] a');
    header = document.querySelector('[data-header]');

    // Early return if elements don't exist
    if (!navbar || !navTogglers.length) {
      console.warn('Navigation elements not found');
      return;
    }

    // Set up event listeners
    setupEventListeners();
    
    console.log('✅ Navigation module initialized');
  };

  /**
   * Toggle navigation menu
   */
  const toggleNavbar = () => {
    isNavOpen = !isNavOpen;
    navbar.classList.toggle('active');
    document.body.classList.toggle('nav-active');

    // Update ARIA attributes for accessibility
    navTogglers.forEach(toggler => {
      toggler.setAttribute('aria-expanded', isNavOpen);
    });

    // Trap focus within navigation when open
    if (isNavOpen) {
      trapFocus(navbar);
    }
  };

  /**
   * Close navigation menu
   */
  const closeNavbar = () => {
    if (!isNavOpen) return;

    isNavOpen = false;
    navbar.classList.remove('active');
    document.body.classList.remove('nav-active');

    navTogglers.forEach(toggler => {
      toggler.setAttribute('aria-expanded', 'false');
    });
  };

  /**
   * Trap focus within an element
   * @param {HTMLElement} element - Element to trap focus within
   */
  const trapFocus = (element) => {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    // Focus first element
    setTimeout(() => firstFocusable.focus(), 100);

    // Handle Tab key
    element.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    });
  };

  /**
   * Set up all event listeners
   */
  const setupEventListeners = () => {
    // Toggle button click
    addEventOnElements(navTogglers, 'click', toggleNavbar);

    // Close menu when clicking nav links
    addEventOnElements(navLinks, 'click', closeNavbar);

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isNavOpen) {
        closeNavbar();
        navTogglers[0]?.focus(); // Return focus to toggle button
      }
    });

    // Close menu on window resize (desktop)
    window.addEventListener('resize', debounce(() => {
      if (window.innerWidth >= 768 && isNavOpen) {
        closeNavbar();
      }
    }));

    // Handle header scroll effect
    if (header) {
      setupScrollEffect();
    }
  };

  /**
   * Add active class to header on scroll
   */
  const setupScrollEffect = () => {
    const handleScroll = throttle(() => {
      if (window.scrollY > 100) {
        header.classList.add('active');
      } else {
        header.classList.remove('active');
      }
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
  };

  return { init };
})();

// ========================================
// SKILLS ANIMATION MODULE
// ========================================

const SkillsAnimationModule = (() => {
  let skillBars = null;
  let hasAnimated = false;

  /**
   * Initialize skills animation
   */
  const init = () => {
    skillBars = document.querySelectorAll('.skill-fill');

    if (!skillBars || skillBars.length === 0) {
      console.info('No skill bars found');
      return;
    }

    // Use Intersection Observer to trigger animation when visible
    setupIntersectionObserver();
    console.log(`✅ Skills animation module initialized with ${skillBars.length} skills`);
  };

  /**
   * Set up Intersection Observer for scroll-triggered animation
   */
  const setupIntersectionObserver = () => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          animateSkillBars();
          hasAnimated = true;
        }
      });
    }, options);

    // Observe the skills section
    const skillsSection = document.querySelector('.skills-section');
    if (skillsSection) {
      observer.observe(skillsSection);
    }
  };

  /**
   * Animate all skill bars
   */
  const animateSkillBars = () => {
    skillBars.forEach((bar, index) => {
      const width = bar.getAttribute('data-width');
      
      // Stagger the animation for each bar
      setTimeout(() => {
        bar.style.setProperty('--skill-width', `${width}%`);
        bar.classList.add('animated');
      }, index * 100); // 100ms delay between each bar
    });
  };

  return { init };
})();

// ========================================
// SMOOTH SCROLL MODULE
// ========================================

const SmoothScrollModule = (() => {
  /**
   * Initialize smooth scrolling for anchor links
   */
  const init = () => {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    if (anchorLinks.length === 0) return;

    anchorLinks.forEach(link => {
      link.addEventListener('click', handleAnchorClick);
    });

    console.log('✅ Smooth scroll module initialized');
  };

  /**
   * Handle anchor link clicks
   * @param {Event} e - Click event
   */
  const handleAnchorClick = (e) => {
    const href = e.currentTarget.getAttribute('href');

    // Skip if just "#" or empty
    if (!href || href === '#') return;

    const targetElement = document.querySelector(href);

    if (!targetElement) return;

    e.preventDefault();

    // Calculate position accounting for fixed header
    const headerHeight = document.querySelector('[data-header]')?.offsetHeight || 0;
    const targetPosition = targetElement.offsetTop - headerHeight - 20;

    // Smooth scroll
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });

    // Update URL without jumping
    if (history.pushState) {
      history.pushState(null, null, href);
    }

    // Set focus for accessibility
    targetElement.setAttribute('tabindex', '-1');
    targetElement.focus();
    setTimeout(() => targetElement.removeAttribute('tabindex'), 1000);
  };

  return { init };
})();

// ========================================
// PERFORMANCE MONITORING MODULE
// ========================================

const PerformanceModule = (() => {
  /**
   * Initialize performance monitoring
   */
  const init = () => {
    // Only run in development
    const isDevelopment = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1';

    if (!isDevelopment) return;

    if (!('PerformanceObserver' in window)) {
      console.warn('PerformanceObserver not supported');
      return;
    }

    try {
      monitorCoreWebVitals();
      console.log('✅ Performance monitoring initialized');
    } catch (error) {
      console.error('Error initializing performance monitoring:', error);
    }
  };

  /**
   * Monitor Core Web Vitals
   */
  const monitorCoreWebVitals = () => {
    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('🎨 LCP:', Math.round(lastEntry.startTime), 'ms');
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        const fid = entry.processingStart - entry.startTime;
        console.log('⚡ FID:', Math.round(fid), 'ms');
      });
    });
    fidObserver.observe({ type: 'first-input', buffered: true });

    // Cumulative Layout Shift (CLS)
    let clsScore = 0;
    const clsObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (!entry.hadRecentInput) {
          clsScore += entry.value;
        }
      });
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });

    // Log on page load
    window.addEventListener('load', () => {
      const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
      if (fcpEntry) {
        console.log('🖼️ FCP:', Math.round(fcpEntry.startTime), 'ms');
      }

      console.log('📐 CLS Score:', clsScore.toFixed(4));

      const navTiming = performance.getEntriesByType('navigation')[0];
      if (navTiming) {
        console.log('🚀 DOM Interactive:', Math.round(navTiming.domInteractive), 'ms');
        console.log('✅ Page Load:', Math.round(navTiming.loadEventEnd), 'ms');
      }
    });
  };

  return { init };
})();

// ========================================
// LAZY LOADING MODULE
// ========================================

const LazyLoadModule = (() => {
  /**
   * Initialize lazy loading for images
   */
  const init = () => {
    // Check for native lazy loading support
    if ('loading' in HTMLImageElement.prototype) {
      const images = document.querySelectorAll('img[loading="lazy"]');
      console.log(`✨ Native lazy loading enabled for ${images.length} images`);
      return;
    }

    // Fallback using Intersection Observer
    const images = document.querySelectorAll('img[data-src]');
    
    if (images.length === 0) return;

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    images.forEach(img => imageObserver.observe(img));
    console.log('✅ Lazy loading initialized with Intersection Observer');
  };

  return { init };
})();

// ========================================
// MAIN INITIALIZATION
// ========================================

/**
 * Initialize all modules when DOM is ready
 */
const initializeApp = () => {
  try {
    NavigationModule.init();
    SkillsAnimationModule.init();
    SmoothScrollModule.init();
    LazyLoadModule.init();
    PerformanceModule.init();

    console.log('✅ Portfolio website fully initialized');
  } catch (error) {
    console.error('❌ Error during initialization:', error);
  }
};

// Run initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  // DOM is already loaded
  initializeApp();
}

// Export modules for potential reuse (optional)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    NavigationModule,
    SkillsAnimationModule,
    SmoothScrollModule,
    PerformanceModule,
    LazyLoadModule
  };
}