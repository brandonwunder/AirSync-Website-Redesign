/* ============================================================
   AirSync Systems — script.js
   Scroll reveal, counters, ROI calculator, FAQ, mobile menu
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. NAV SCROLL BEHAVIOR
     ---------------------------------------------------------- */
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  function onScroll() {
    const y = window.scrollY;
    if (y > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ----------------------------------------------------------
     2. MOBILE MENU
     ---------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ----------------------------------------------------------
     3. PRODUCTS DROPDOWN
     ---------------------------------------------------------- */
  const dropdown = document.getElementById('productsDropdown');
  const trigger = dropdown.querySelector('.nav-dropdown-trigger');

  trigger.addEventListener('click', function (e) {
    e.stopPropagation();
    const isOpen = dropdown.classList.toggle('open');
    trigger.setAttribute('aria-expanded', isOpen);
  });

  // Close dropdown on outside click
  document.addEventListener('click', function (e) {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    }
  });

  // Close dropdown on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      dropdown.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    }
  });

  /* ----------------------------------------------------------
     4. SCROLL REVEAL (IntersectionObserver)
     ---------------------------------------------------------- */
  var revealElements = document.querySelectorAll('.reveal, .reveal-stagger');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: just show everything
    revealElements.forEach(function (el) {
      el.classList.add('revealed');
    });
  }

  /* ----------------------------------------------------------
     5. ANIMATED NUMBER COUNTERS
     ---------------------------------------------------------- */
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el) {
    if (el.dataset.animated) return;
    el.dataset.animated = 'true';

    var target = parseInt(el.dataset.count, 10);
    var prefix = el.dataset.prefix || '';
    var suffix = el.dataset.suffix || '';
    var duration = 1500; // ms
    var start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var easedProgress = easeOutCubic(progress);
      var current = Math.round(easedProgress * target);

      el.textContent = prefix + current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  var counterElements = document.querySelectorAll('[data-count]');

  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterElements.forEach(function (el) {
      counterObserver.observe(el);
    });
  } else {
    counterElements.forEach(animateCounter);
  }

  /* ----------------------------------------------------------
     6. ROI CALCULATOR
     ---------------------------------------------------------- */
  var crewSlider = document.getElementById('roiCrew');
  var crewLabel = document.getElementById('roiCrewLabel');
  var crewDisplay = document.getElementById('roiCrewDisplay');
  var ticketInput = document.getElementById('roiTicket');
  var ticketDisplay = document.getElementById('roiTicketDisplay');
  var totalInline = document.getElementById('roiTotalInline');
  var totalEl = document.getElementById('roiTotal');
  var jobsEl = document.getElementById('roiJobs');
  var hoursEl = document.getElementById('roiHours');
  var recoveredEl = document.getElementById('roiRecovered');
  var savedEl = document.getElementById('roiSaved');

  function formatCurrency(n) {
    if (n >= 1000) {
      return '$' + Math.round(n / 1000) + 'K';
    }
    return '$' + n.toLocaleString();
  }

  function formatCurrencyFull(n) {
    return '$' + n.toLocaleString();
  }

  function calculateROI() {
    var crew = parseInt(crewSlider.value, 10) || 5;
    var ticket = parseInt(ticketInput.value.replace(/[^0-9]/g, ''), 10) || 800;

    // Formulas (conservative, realistic estimates)
    // Missed calls recovered per week = crew * 1 (1 recovered call per tech per week)
    // Booking rate = 40% of recovered calls become jobs
    var missedPerWeek = crew * 1;
    var extraJobs = Math.round(missedPerWeek * 52 * 0.4);
    var extraRevenue = extraJobs * ticket;

    // Hours saved per week = 3 base + 1.5 per technician
    var hoursSaved = Math.round(3 + crew * 1.5);

    // Recovered from cold leads = crew * $6,000/year
    var recovered = crew * 6000;

    // Answering service savings = crew * $3,000/year
    var saved = crew * 3000;

    // Total annual value
    var total = extraRevenue + recovered + saved;

    // Update displays
    crewLabel.textContent = crew;
    crewDisplay.textContent = crew;
    ticketDisplay.textContent = '$' + ticket.toLocaleString();
    totalInline.textContent = formatCurrencyFull(total);
    totalEl.textContent = formatCurrencyFull(total);
    jobsEl.textContent = extraJobs.toLocaleString();
    hoursEl.textContent = hoursSaved + '+';
    recoveredEl.textContent = formatCurrency(recovered);
    savedEl.textContent = formatCurrency(saved);
  }

  crewSlider.addEventListener('input', calculateROI);
  ticketInput.addEventListener('input', calculateROI);
  ticketInput.addEventListener('blur', function () {
    // Clean up formatting on blur
    var val = parseInt(ticketInput.value.replace(/[^0-9]/g, ''), 10);
    if (val && val > 0) {
      ticketInput.value = val;
    } else {
      ticketInput.value = '800';
    }
    calculateROI();
  });

  // Initial calculation
  calculateROI();

  /* ----------------------------------------------------------
     7. FAQ ACCORDION
     ---------------------------------------------------------- */
  var faqItems = document.querySelectorAll('.faq-question');

  faqItems.forEach(function (question) {
    question.addEventListener('click', function () {
      var item = question.closest('.faq-item');
      var isOpen = item.classList.contains('open');

      // Close all others
      document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      item.classList.toggle('open', !isOpen);
      question.setAttribute('aria-expanded', !isOpen);
    });

    // Keyboard accessibility
    question.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });
  });

  /* ----------------------------------------------------------
     8. SMOOTH SCROLL FOR ANCHOR LINKS
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var navHeight = nav.offsetHeight;
        var top = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ----------------------------------------------------------
     10. REDUCED MOTION CHECK
     ---------------------------------------------------------- */
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function handleReducedMotion() {
    if (prefersReducedMotion.matches) {
      // Instantly reveal all elements
      document.querySelectorAll('.reveal, .reveal-stagger').forEach(function (el) {
        el.classList.add('revealed');
      });
      // Instantly set counter values
      counterElements.forEach(function (el) {
        if (!el.dataset.animated) {
          el.dataset.animated = 'true';
          var target = parseInt(el.dataset.count, 10);
          var prefix = el.dataset.prefix || '';
          var suffix = el.dataset.suffix || '';
          el.textContent = prefix + target.toLocaleString() + suffix;
        }
      });
    }
  }

  handleReducedMotion();
  prefersReducedMotion.addEventListener('change', handleReducedMotion);

})();
