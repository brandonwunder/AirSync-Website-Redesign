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
     9. ANIMATED PHONE CHAT + CALENDAR BOOKING
     ---------------------------------------------------------- */
  var textPhoneMock = document.getElementById('textPhoneMock');

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

    // Calendar elements
    var tabletMock = document.getElementById('tabletMock');
    var calendarTargetSlot = document.getElementById('calendarTargetSlot');
    var calendarConfirm = document.getElementById('calendarConfirm');

    // Per-bubble timing: [readPause, typingDuration]
    // readPause = processing time before typing starts
    // typingDuration = how long the dots bounce
    var timings = [
      [800, 900],    // #1 INCOMING: customer initiates (38 chars)
      [600, 1800],   // #2 OUTGOING: AI composes long pricing answer (113 chars)
      [1200, 1100],  // #3 INCOMING: customer reads pricing, decides (58 chars)
      [500, 1400],   // #4 OUTGOING: AI checks calendar (74 chars)
      [800, 600],    // #5 INCOMING: quick decision (24 chars)
      [400, 1600]    // #6 OUTGOING: AI confirms booking (95 chars)
    ];

    var delay = 500;

    bubbles.forEach(function (bubble, idx) {
      var isOutgoing = bubble.classList.contains('chat-outgoing');
      var timing = timings[idx] || [600, 1000];
      var readPause = timing[0];
      var typingDuration = timing[1];

      delay += readPause;

      // Show typing indicator
      (function (d, outgoing) {
        setTimeout(function () {
          typingEl.style.display = 'flex';
          typingEl.classList.remove('chat-hidden');
          typingEl.classList.add('chat-visible');
          if (outgoing) {
            typingEl.classList.add('typing-outgoing');
          } else {
            typingEl.classList.remove('typing-outgoing');
          }
          content.scrollTop = content.scrollHeight;
        }, d);
      })(delay, isOutgoing);

      delay += typingDuration;

      // Hide typing, show message
      (function (d) {
        setTimeout(function () {
          typingEl.classList.remove('chat-visible');
          typingEl.classList.add('chat-hidden');
          bubble.classList.remove('chat-hidden');
          bubble.classList.add('chat-visible');
          content.scrollTop = content.scrollHeight;
        }, d);
      })(delay);
    });

    // Hide typing indicator permanently
    setTimeout(function () {
      typingEl.style.display = 'none';
    }, delay + 200);

    // === CALENDAR BOOKING ANIMATION ===
    var calendarDelay = delay;

    if (tabletMock && calendarTargetSlot && calendarConfirm) {
      // Step 1: Tablet slides in
      setTimeout(function () {
        tabletMock.classList.add('calendar-visible');
      }, calendarDelay + 800);

      // Step 2: Book the 10 AM slot
      setTimeout(function () {
        var slotEvent = calendarTargetSlot.querySelector('.calendar-slot-event');
        var slotText = calendarTargetSlot.querySelector('.calendar-slot-placeholder');
        if (slotEvent && slotText) {
          slotText.textContent = 'Kitchen Drain - Clear';
          slotEvent.classList.remove('calendar-slot-empty');
          slotEvent.classList.add('calendar-slot-booked');
        }
      }, calendarDelay + 2000);

      // Step 3: Pulse glow on booked slot
      setTimeout(function () {
        var slotEvent = calendarTargetSlot.querySelector('.calendar-slot-event');
        if (slotEvent) {
          slotEvent.classList.add('slot-pulse');
        }
      }, calendarDelay + 2800);

      // Step 4: "Added to Calendar" confirmation
      setTimeout(function () {
        calendarConfirm.classList.add('confirm-visible');
      }, calendarDelay + 3400);
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

  // SVG icons for transcript avatars
  var TRANSCRIPT_BOT_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>';
  var TRANSCRIPT_CUSTOMER_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';

  // Transcript messages: { time (seconds into call), speaker, text }
  var TRANSCRIPT_SCRIPT = [
    { time: 1, speaker: 'customer', text: "Oh my God, I need help! A pipe just burst under my kitchen sink and water is going everywhere!" },
    { time: 5, speaker: 'bot', text: "I understand this is an emergency. Let\u2019s get this handled right now. Do you know where your main water shutoff valve is?" },
    { time: 10, speaker: 'customer', text: "I think it\u2019s somewhere in the basement? I don\u2019t know, there\u2019s so much water!" },
    { time: 14, speaker: 'bot', text: "That\u2019s okay, stay calm. Head to your basement and look for a round valve on the main water line \u2014 it\u2019s usually near where the pipe enters your house." },
    { time: 20, speaker: 'customer', text: "Okay I\u2019m heading down there\u2026 I see some pipes along the wall\u2026" },
    { time: 24, speaker: 'bot', text: "Look for a valve with a round handle or a lever. Turn it clockwise until it stops to shut off the water completely." },
    { time: 29, speaker: 'customer', text: "I found it! Turning it now\u2026 okay, I think the water stopped!" },
    { time: 32, speaker: 'bot', text: "Perfect. Let me get an emergency plumber out to you right away. What\u2019s your address?" },
    { time: 36, speaker: 'customer', text: "It\u2019s 847 Oakwood Drive in Riverside." },
    { time: 38, speaker: 'bot', text: "Got it \u2014 847 Oakwood Drive, Riverside. Checking emergency availability\u2026" },
    { time: 42, speaker: 'bot', text: "I have a licensed plumber available now. Booking them for an emergency visit." },
    { time: 46, speaker: 'customer', text: "Oh thank God. How soon can they get here?" },
    { time: 48, speaker: 'bot', text: "They\u2019ll be at your door within 45 minutes. Sending you a text confirmation with their name and ETA now." },
    { time: 51, speaker: 'customer', text: "Thank you so much. You literally saved me." }
  ];

  function createTranscriptMessage(speaker, text) {
    var msg = document.createElement('div');
    msg.className = 'transcript-msg';

    var avatar = document.createElement('div');
    avatar.className = 'transcript-avatar transcript-avatar-' + speaker;
    avatar.innerHTML = speaker === 'bot' ? TRANSCRIPT_BOT_SVG : TRANSCRIPT_CUSTOMER_SVG;

    var bubble = document.createElement('div');
    bubble.className = 'transcript-bubble';

    var speakerEl = document.createElement('span');
    speakerEl.className = 'transcript-speaker transcript-speaker-' + speaker;
    speakerEl.textContent = speaker === 'bot' ? 'AirSync AI' : 'Homeowner';

    var textEl = document.createElement('p');
    textEl.className = 'transcript-text';
    textEl.textContent = text;

    bubble.appendChild(speakerEl);
    bubble.appendChild(textEl);
    msg.appendChild(avatar);
    msg.appendChild(bubble);

    return msg;
  }

  function animateVoiceBot(demoEl) {
    var callPhone = demoEl.querySelector('.call-phone');
    var callIncoming = demoEl.querySelector('.call-screen-incoming');
    var callConnected = demoEl.querySelector('.call-screen-connected');
    var callEnded = demoEl.querySelector('.call-screen-ended');
    var waveformBars = demoEl.querySelectorAll('.call-waveform-bar');
    var callTimer = demoEl.querySelector('.call-timer');
    var callEndedDuration = demoEl.querySelector('.call-ended-duration');

    // Transcript elements
    var voiceTranscript = document.getElementById('voiceTranscript');
    var transcriptHeader = document.getElementById('transcriptHeader');
    var transcriptMessages = document.getElementById('transcriptMessages');

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

    var stageDelay = 0;

    // Stage 1: Show incoming call screen (2s)
    setTimeout(function () {
      callIncoming.classList.add('call-screen-visible');
    }, stageDelay);
    stageDelay += 2000;

    // Stage 2: Answer — connected screen + waveform + timer + transcript
    setTimeout(function () {
      callIncoming.classList.remove('call-screen-visible');
      callConnected.classList.add('call-screen-visible');
      startTimer();
      callPhone.classList.add('phone-call-active');
      waveformBars.forEach(function (bar, idx) {
        setTimeout(function () {
          bar.classList.add('waveform-animated');
        }, idx * 100);
      });

      // Show transcript panel and activate header
      if (voiceTranscript) voiceTranscript.classList.add('transcript-visible');
      if (transcriptHeader) transcriptHeader.classList.add('transcript-active');

      // Schedule transcript messages
      if (transcriptMessages) {
        TRANSCRIPT_SCRIPT.forEach(function (entry) {
          setTimeout(function () {
            var msgEl = createTranscriptMessage(entry.speaker, entry.text);
            transcriptMessages.appendChild(msgEl);
            requestAnimationFrame(function () {
              msgEl.classList.add('msg-visible');
            });
            transcriptMessages.scrollTop = transcriptMessages.scrollHeight;
          }, entry.time * 1000);
        });
      }
    }, stageDelay);

    // Stage 3: Call ended after 52s connected
    var endDelay = stageDelay + 52000;
    setTimeout(function () {
      stopTimer();
      callConnected.classList.remove('call-screen-visible');
      callEnded.classList.add('call-screen-visible');
      waveformBars.forEach(function (bar) {
        bar.classList.remove('waveform-animated');
      });
      // Stop transcript live indicator
      if (transcriptHeader) transcriptHeader.classList.remove('transcript-active');
    }, endDelay);
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

    // Stage 7: Chat bubbles appear with natural pacing
    var chatBody = chatWidget.querySelector('.chat-widget-body');
    var bubbleDelays = [0, 1200, 3200, 4200, 6000];
    setTimeout(function () {
      chatBubbles.forEach(function (bubble, idx) {
        setTimeout(function () {
          bubble.classList.add('wb-visible');
          if (chatBody && chatBody.scrollHeight > chatBody.clientHeight) {
            setTimeout(function () {
              chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: 'smooth' });
            }, 100);
          }
        }, bubbleDelays[idx] || idx * 1200);
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
      // Show tablet + calendar in booked state instantly
      var calTablet = document.getElementById('tabletMock');
      if (calTablet) calTablet.classList.add('calendar-visible');
      var calSlot = document.getElementById('calendarTargetSlot');
      if (calSlot) {
        var ev = calSlot.querySelector('.calendar-slot-event');
        var tx = calSlot.querySelector('.calendar-slot-placeholder');
        if (ev && tx) {
          tx.textContent = 'Kitchen Drain - Clear';
          ev.classList.remove('calendar-slot-empty');
          ev.classList.add('calendar-slot-booked');
        }
      }
      var calConf = document.getElementById('calendarConfirm');
      if (calConf) calConf.classList.add('confirm-visible');
      // Show voice transcript with all messages instantly
      var vt = document.getElementById('voiceTranscript');
      if (vt) vt.classList.add('transcript-visible');
      var th = document.getElementById('transcriptHeader');
      if (th) th.classList.add('transcript-active');
      var tm = document.getElementById('transcriptMessages');
      if (tm) {
        TRANSCRIPT_SCRIPT.forEach(function (entry) {
          var msgEl = createTranscriptMessage(entry.speaker, entry.text);
          msgEl.classList.add('msg-visible');
          tm.appendChild(msgEl);
        });
      }
    }
  }

  handleReducedMotion();
  prefersReducedMotion.addEventListener('change', handleReducedMotion);

})();
