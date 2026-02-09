/* ============================================================
   AirSync Systems — script.js
   Scroll reveal, counters, ROI calculator, FAQ, mobile menu,
   email confirmation animation
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
     6. FAQ ACCORDION
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
     9. ANIMATED PHONE CHAT + EMAIL CONFIRMATION
     ---------------------------------------------------------- */
  var textPhoneMock = document.getElementById('textPhoneMock');
  var emailConfirm = document.getElementById('emailConfirm');

  if (textPhoneMock && 'IntersectionObserver' in window) {
    var chatObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateChat(entry.target);
          chatObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    chatObserver.observe(textPhoneMock);
  }

  function animateChat(mockEl) {
    var bubbles = mockEl.querySelectorAll('.chat-bubble');
    var typingEl = mockEl.querySelector('.typing-indicator');
    var content = mockEl.querySelector('.phone-content');
    var delay = 500;

    bubbles.forEach(function (bubble) {
      var isOutgoing = bubble.classList.contains('chat-outgoing');
      var typingDuration = isOutgoing ? 1200 : 800;

      // Show typing indicator
      setTimeout(function () {
        typingEl.classList.remove('chat-hidden');
        typingEl.classList.add('chat-visible');
        if (isOutgoing) {
          typingEl.classList.add('typing-outgoing');
        } else {
          typingEl.classList.remove('typing-outgoing');
        }
        content.scrollTop = content.scrollHeight;
      }, delay);

      delay += typingDuration;

      // Hide typing, show message
      setTimeout(function () {
        typingEl.classList.remove('chat-visible');
        typingEl.classList.add('chat-hidden');
        bubble.classList.remove('chat-hidden');
        bubble.classList.add('chat-visible');
        content.scrollTop = content.scrollHeight;
      }, delay);

      delay += 600;
    });

    // Hide typing indicator permanently after sequence
    setTimeout(function () {
      typingEl.style.display = 'none';
    }, delay);

    // Email confirmation animation: phone shrinks, email card fades in
    if (emailConfirm) {
      setTimeout(function () {
        mockEl.classList.add('phone-shrunk');
      }, delay + 1000);

      setTimeout(function () {
        emailConfirm.classList.add('email-visible');
      }, delay + 1500);
    }
  }

  /* ----------------------------------------------------------
     10. VOICE BOT ANIMATION
     ---------------------------------------------------------- */
  var voiceBotDemo = document.getElementById('voiceBotDemo');

  if (voiceBotDemo && 'IntersectionObserver' in window) {
    var voiceBotObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateVoiceBot(entry.target);
          voiceBotObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    voiceBotObserver.observe(voiceBotDemo);
  }

  function animateVoiceBot(demoEl) {
    var callPhone = demoEl.querySelector('.call-phone');
    var callIncoming = demoEl.querySelector('.call-screen-incoming');
    var callConnected = demoEl.querySelector('.call-screen-connected');
    var callEnded = demoEl.querySelector('.call-screen-ended');
    var callTranscript = demoEl.querySelector('.call-transcript');
    var transcriptLines = demoEl.querySelectorAll('.transcript-line');
    var waveformBars = demoEl.querySelectorAll('.call-waveform-bar');
    var callTimer = demoEl.querySelector('.call-timer');
    var callEndedDuration = demoEl.querySelector('.call-ended-duration');
    var transcriptTitle = demoEl.querySelector('.call-transcript-title');
    var timerInterval = null;
    var timerSeconds = 0;

    function formatTime(seconds) {
      var m = Math.floor(seconds / 60);
      var s = seconds % 60;
      return m + ':' + (s < 10 ? '0' : '') + s;
    }

    function startTimer() {
      timerSeconds = 0;
      callTimer.textContent = '0:00';
      timerInterval = setInterval(function () {
        timerSeconds++;
        callTimer.textContent = formatTime(timerSeconds);
      }, 1000);
    }

    function stopTimer() {
      clearInterval(timerInterval);
      if (callEndedDuration) {
        callEndedDuration.textContent = formatTime(timerSeconds);
      }
    }

    // Word-count-based delay: 400ms base pause + 80ms per word
    function getLineDelay(line) {
      var text = line.querySelector('.transcript-text');
      if (!text) return 800;
      var words = text.textContent.trim().split(/\s+/).length;
      return 400 + words * 80;
    }

    var stageDelay = 0;

    // Stage 1: Show incoming call screen (2s)
    setTimeout(function () {
      callIncoming.classList.add('call-screen-visible');
    }, stageDelay);
    stageDelay += 2000;

    // Stage 2: Answer — connected screen + waveform + timer starts
    setTimeout(function () {
      callIncoming.classList.remove('call-screen-visible');
      callConnected.classList.add('call-screen-visible');
      startTimer();
      waveformBars.forEach(function (bar, idx) {
        setTimeout(function () {
          bar.classList.add('waveform-animated');
        }, idx * 100);
      });
    }, stageDelay);
    stageDelay += 1500;

    // Stage 3: Transcript panel slides in
    setTimeout(function () {
      callPhone.classList.add('phone-call-active');
      callTranscript.classList.add('transcript-visible');
      transcriptTitle.classList.add('transcript-visible');
    }, stageDelay);
    stageDelay += 500;

    // Stage 4: Transcript lines appear with natural word-count pacing
    var cumulativeDelay = stageDelay;
    transcriptLines.forEach(function (line) {
      (function (lineEl, delay) {
        setTimeout(function () {
          lineEl.classList.add('transcript-line-visible');
          setTimeout(function () {
            callTranscript.scrollTo({
              top: callTranscript.scrollHeight,
              behavior: 'smooth'
            });
          }, 150);
        }, delay);
      })(line, cumulativeDelay);
      cumulativeDelay += getLineDelay(line);
    });

    // Stage 5: Show confirmation bar after last line settles
    var confirmDelay = cumulativeDelay + 800;
    setTimeout(function () {
      demoEl.classList.add('stage-confirm');
      setTimeout(function () {
        callTranscript.scrollTo({
          top: callTranscript.scrollHeight,
          behavior: 'smooth'
        });
      }, 150);
    }, confirmDelay);

    // Stage 6: Call ended — stop timer, stop waveform, cleanup transcript
    var endDelay = confirmDelay + 1500;
    setTimeout(function () {
      stopTimer();
      callConnected.classList.remove('call-screen-visible');
      callEnded.classList.add('call-screen-visible');
      waveformBars.forEach(function (bar) {
        bar.classList.remove('waveform-animated');
      });
      callTranscript.classList.add('transcript-ended');
      transcriptTitle.classList.add('transcript-ended');
    }, endDelay);

    // Stage 7: Trigger email envelope animation after call ends
    setTimeout(function () {
      var textBotSection = document.querySelector('#text-bot');
      if (textBotSection) {
        var envelopeWrapper = textBotSection.querySelector('.envelope-wrapper');
        if (envelopeWrapper) {
          envelopeWrapper.classList.add('envelope-visible');
          setTimeout(function () {
            envelopeWrapper.classList.add('envelope-open');
          }, 300);
        }
      }
    }, endDelay + 500);
  }

  /* ----------------------------------------------------------
     11. WEBSITE BOT CURSOR DEMO ANIMATION
     ---------------------------------------------------------- */
  var websiteBotDemo = document.getElementById('websiteBotDemo');

  if (websiteBotDemo && 'IntersectionObserver' in window) {
    var websiteBotObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateWebsiteBot(entry.target);
          websiteBotObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    websiteBotObserver.observe(websiteBotDemo);
  }

  function animateWebsiteBot(demoEl) {
    var demoCursor = demoEl.querySelector('#demoCursor');
    var chatPrompt = demoEl.querySelector('#chatPrompt');
    var chatWidget = demoEl.querySelector('#chatWidget');
    var chatBubbles = demoEl.querySelectorAll('.chat-widget-bubble');
    var browserBody = demoEl.querySelector('.browser-body');

    var stageDelay = 0;

    // Stage 1: Cursor appears (0.5s)
    setTimeout(function () {
      demoEl.classList.add('cursor-active');
      demoCursor.style.top = '80px';
      demoCursor.style.left = '20px';
    }, stageDelay);
    stageDelay += 500;

    // Stage 2: Cursor browses (2s) - animate movement
    setTimeout(function () {
      demoCursor.style.transition = 'all 0.6s ease-out';
      demoCursor.style.top = '140px';
      demoCursor.style.left = '80px';

      setTimeout(function () {
        demoCursor.style.top = '200px';
        demoCursor.style.left = '40px';
      }, 600);
    }, stageDelay);
    stageDelay += 2000;

    // Stage 3: Chat prompt appears (1s)
    setTimeout(function () {
      chatPrompt.classList.add('visible');
    }, stageDelay);
    stageDelay += 1000;

    // Stage 4: Cursor moves to prompt (1s)
    setTimeout(function () {
      demoCursor.style.top = 'calc(100% - 60px)';
      demoCursor.style.left = 'calc(100% - 60px)';
    }, stageDelay);
    stageDelay += 1000;

    // Stage 5: Click animation (0.5s)
    setTimeout(function () {
      demoCursor.style.transform = 'scale(0.85)';
      setTimeout(function () {
        demoCursor.style.transform = 'scale(1)';
      }, 200);
    }, stageDelay);
    stageDelay += 500;

    // Stage 6: Chat widget opens (0.5s)
    setTimeout(function () {
      chatWidget.classList.add('widget-open');
    }, stageDelay);
    stageDelay += 500;

    // Stage 7: Chat bubbles appear one by one (3.5s)
    setTimeout(function () {
      chatBubbles.forEach(function (bubble, idx) {
        setTimeout(function () {
          bubble.classList.add('wb-visible');
          if (browserBody) {
            browserBody.scrollTop = browserBody.scrollHeight;
          }
        }, idx * 600);
      });
    }, stageDelay);
  }

  /* ----------------------------------------------------------
     12. INVOICE AUTO-FILL ANIMATION
     ---------------------------------------------------------- */
  var invoiceDemo = document.getElementById('invoiceDemo');

  if (invoiceDemo && 'IntersectionObserver' in window) {
    var invoiceObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateInvoice(entry.target);
          invoiceObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    invoiceObserver.observe(invoiceDemo);
  }

  function animateInvoice(demoEl) {
    var metaRows = demoEl.querySelectorAll('.invoice-meta-row');
    var items = demoEl.querySelectorAll('.invoice-item');
    var totalAmount = demoEl.querySelector('#invoiceTotalAmount');
    var badge = demoEl.querySelector('#invoiceBadge');
    var statusBar = demoEl.querySelector('#invoiceStatusBar');
    var deposited = demoEl.querySelector('#invoiceDeposited');

    var stageDelay = 0;

    // Stage 1: Show meta rows (1s)
    metaRows.forEach(function (row, idx) {
      setTimeout(function () {
        row.classList.add('inv-visible');
      }, stageDelay + idx * 250);
    });
    stageDelay += 1000;

    // Stage 2: Show invoice items one by one (2s)
    items.forEach(function (item, idx) {
      setTimeout(function () {
        item.classList.add('inv-visible');
      }, stageDelay + idx * 400);
    });
    stageDelay += 2000;

    // Stage 3: Animate total counter (1.5s)
    setTimeout(function () {
      if (totalAmount && totalAmount.getAttribute('data-count') === null) {
        totalAmount.setAttribute('data-count', '1350');
        totalAmount.setAttribute('data-prefix', '$');
        animateCounter(totalAmount);
        totalAmount.classList.add('inv-visible');
      }
    }, stageDelay);
    stageDelay += 1500;

    // Stage 4: Show status bar / Mark as Paid (1s)
    setTimeout(function () {
      statusBar.classList.add('inv-visible');
      if (badge) {
        badge.classList.add('badge-visible');
        badge.textContent = 'PAID';
        badge.className = 'invoice-badge badge-visible invoice-badge-paid';
      }
    }, stageDelay);
    stageDelay += 1000;

    // Stage 5: Show deposited confirmation (1.5s)
    setTimeout(function () {
      deposited.classList.add('inv-visible');
    }, stageDelay);
  }

  /* ----------------------------------------------------------
     13. REVIEWS BEFORE/AFTER TRANSFORMATION ANIMATION
     ---------------------------------------------------------- */
  var reviewsDemo = document.getElementById('reviewsDemo');

  if (reviewsDemo && 'IntersectionObserver' in window) {
    var reviewsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateReviews(entry.target);
          reviewsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    reviewsObserver.observe(reviewsDemo);
  }

  function animateReviews(demoEl) {
    var reviewsLabel = demoEl.querySelector('#reviewsLabel');
    var reviewsStars = demoEl.querySelector('#reviewsStars');
    var reviewsRating = demoEl.querySelector('#reviewsRating');
    var reviewsCount = demoEl.querySelector('#reviewsCount');
    var reviewsSampleStars = demoEl.querySelector('#reviewsSampleStars');
    var reviewsSampleText = demoEl.querySelector('#reviewsSampleText');
    var reviewsSampleAuthor = demoEl.querySelector('#reviewsSampleAuthor');
    var reviewsSampleMeta = demoEl.querySelector('#reviewsSampleMeta');

    var stageDelay = 0;

    // Hold on before state for 2s
    stageDelay += 2000;

    // Stage 1: Start transition to "after" state (3s)
    setTimeout(function () {
      // Change CSS class to trigger color transitions
      demoEl.classList.remove('state-before');
      demoEl.classList.add('state-after');

      // Update label
      if (reviewsLabel) {
        reviewsLabel.textContent = 'After';
      }

      // Update stars: 3 → 5
      if (reviewsStars) {
        reviewsStars.textContent = '★★★★★';
      }

      // Update rating counter (3.2 → 4.9)
      if (reviewsRating) {
        var ratingEl = reviewsRating;
        var ratingStart = 3.2;
        var ratingTarget = 4.9;
        var ratingDuration = 1500;
        var ratingStartTime = null;

        function stepRating(timestamp) {
          if (!ratingStartTime) ratingStartTime = timestamp;
          var progress = Math.min((timestamp - ratingStartTime) / ratingDuration, 1);
          var easedProgress = 1 - Math.pow(1 - progress, 3);
          var current = ratingStart + (ratingTarget - ratingStart) * easedProgress;
          ratingEl.textContent = current.toFixed(1);

          if (progress < 1) {
            requestAnimationFrame(stepRating);
          }
        }

        requestAnimationFrame(stepRating);
      }

      // Update review count counter (14 → 127)
      if (reviewsCount) {
        reviewsCount.setAttribute('data-count', '127');
        reviewsCount.textContent = '14';
        animateCounter(reviewsCount);
      }

      // Update sample review stars
      if (reviewsSampleStars) {
        reviewsSampleStars.textContent = '★★★★★';
      }

      // Update sample review text
      if (reviewsSampleText) {
        reviewsSampleText.textContent = '"Best plumber in town. Fast response, fair price, cleaned up after themselves. 10/10."';
      }

      // Update sample review author
      if (reviewsSampleAuthor) {
        reviewsSampleAuthor.textContent = 'Sarah M.';
      }

      // Update sample review meta
      if (reviewsSampleMeta) {
        reviewsSampleMeta.textContent = 'Google • 2 days ago';
      }
    }, stageDelay);
  }

  /* ----------------------------------------------------------
     14. HVAC STATS PANEL ANIMATION
     ---------------------------------------------------------- */
  var hvacStatsPanel = document.querySelector('.hvac-stats-panel');

  if (hvacStatsPanel && 'IntersectionObserver' in window) {
    var hvacObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Animate counter numbers
          var hvacStatNumbers = hvacStatsPanel.querySelectorAll('.hvac-stat-number');
          hvacStatNumbers.forEach(function (el) {
            animateCounter(el);
          });
          hvacObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    hvacObserver.observe(hvacStatsPanel);
  } else if (hvacStatsPanel) {
    // Fallback for browsers without IntersectionObserver
    var hvacStatNumbers = hvacStatsPanel.querySelectorAll('.hvac-stat-number');
    hvacStatNumbers.forEach(animateCounter);
  }

  /* ----------------------------------------------------------
     15. REDUCED MOTION CHECK
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
      // Show all chat bubbles instantly
      document.querySelectorAll('.chat-hidden').forEach(function (el) {
        el.classList.remove('chat-hidden');
        el.classList.add('chat-visible');
      });
      // Show email confirmation instantly
      if (emailConfirm) {
        emailConfirm.classList.add('email-visible');
      }
    }
  }

  handleReducedMotion();
  prefersReducedMotion.addEventListener('change', handleReducedMotion);

})();
