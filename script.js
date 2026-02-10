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
      [400, 1000],   // #6 OUTGOING: AI asks for address (42 chars)
      [600, 800],    // #7 INCOMING: customer gives address (35 chars)
      [400, 1200],   // #8 OUTGOING: AI confirms address (52 chars)
      [500, 500],    // #9 INCOMING: quick confirmation (16 chars)
      [400, 1600]    // #10 OUTGOING: AI confirms booking (120 chars)
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

      // Step 5: Shift calendar up + show booking banner
      setTimeout(function () {
        tabletMock.classList.add('calendar-booked');
        var bookingBanner = document.getElementById('bookingBanner');
        if (bookingBanner) {
          bookingBanner.classList.add('banner-visible');
        }
      }, calendarDelay + 4000);
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
  var TRANSCRIPT_BOT_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="9" width="14" height="10" rx="2"/><line x1="12" y1="4" x2="12" y2="9"/><circle cx="12" cy="3" r="1.5"/><circle cx="9" cy="13" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="13" r="1" fill="currentColor" stroke="none"/><line x1="9.5" y1="16.5" x2="14.5" y2="16.5"/><line x1="3" y1="13" x2="5" y2="13"/><line x1="19" y1="13" x2="21" y2="13"/></svg>';
  var TRANSCRIPT_CUSTOMER_IMG = '<img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Homeowner" width="32" height="32">';

  // Transcript messages: { time (seconds into call), speaker, text }
  var TRANSCRIPT_SCRIPT = [
    { time: 1, speaker: 'customer', text: "I need help! A pipe just burst under my kitchen sink and water is going everywhere!" },
    { time: 5, speaker: 'bot', text: "I understand this is an emergency. Let\u2019s get this handled right now. Do you know where your main water shutoff valve is?" },
    { time: 10, speaker: 'customer', text: "I think it\u2019s somewhere in the basement? I don\u2019t know, there\u2019s so much water!" },
    { time: 14, speaker: 'bot', text: "That\u2019s okay, stay calm. Head to your basement and look for a round valve on the main water line \u2014 it\u2019s usually near where the pipe enters your house." },
    { time: 20, speaker: 'customer', text: "Okay I\u2019m heading down there\u2026 I see some pipes along the wall\u2026" },
    { time: 24, speaker: 'bot', text: "Look for a valve with a round handle or a lever. Turn it clockwise until it stops to shut off the water completely." },
    { time: 29, speaker: 'customer', text: "I found it! Turning it now\u2026 okay, I think the water stopped!" },
    { time: 32, speaker: 'bot', text: "Perfect. Let me get an emergency plumber out to you right away. What\u2019s your address?" },
    { time: 36, speaker: 'customer', text: "It\u2019s 847 Oakwood Drive in Riverside." },
    { time: 38, speaker: 'bot', text: "Just to confirm \u2014 847 Oakwood Drive, Riverside. Is that correct?" },
    { time: 40, speaker: 'customer', text: "Yes, that\u2019s right." },
    { time: 42, speaker: 'bot', text: "Perfect. Checking emergency availability now\u2026" },
    { time: 44, speaker: 'bot', text: "I have a licensed plumber available. Booking them for an emergency visit." },
    { time: 47, speaker: 'customer', text: "How soon can they get here?" },
    { time: 49, speaker: 'bot', text: "They\u2019ll be at your door within 45 minutes. Sending you a text confirmation with their name and ETA now." },
    { time: 51, speaker: 'customer', text: "Thank you so much. You literally saved me." }
  ];

  function createTranscriptMessage(speaker, text) {
    var msg = document.createElement('div');
    msg.className = 'transcript-msg';

    var avatar = document.createElement('div');
    avatar.className = 'transcript-avatar transcript-avatar-' + speaker;
    avatar.innerHTML = speaker === 'bot' ? TRANSCRIPT_BOT_SVG : TRANSCRIPT_CUSTOMER_IMG;

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

  function createTranscriptTyping(speaker) {
    var el = document.createElement('div');
    el.className = 'transcript-typing';
    var avatar = document.createElement('div');
    avatar.className = 'transcript-avatar transcript-avatar-' + speaker;
    avatar.innerHTML = speaker === 'bot' ? TRANSCRIPT_BOT_SVG : TRANSCRIPT_CUSTOMER_IMG;
    var dots = document.createElement('div');
    dots.className = 'transcript-typing-dots';
    dots.innerHTML = '<span class="transcript-typing-dot"></span><span class="transcript-typing-dot"></span><span class="transcript-typing-dot"></span>';
    el.appendChild(avatar);
    el.appendChild(dots);
    return el;
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

      // Show transcript panel at 1 second into the call
      var PANEL_DELAY = 1000;
      var TYPING_LEAD = 1500;
      setTimeout(function () {
        if (voiceTranscript) voiceTranscript.classList.add('transcript-visible');
        if (transcriptHeader) transcriptHeader.classList.add('transcript-active');
      }, PANEL_DELAY);

      // Schedule transcript messages with typing indicators
      if (transcriptMessages) {
        TRANSCRIPT_SCRIPT.forEach(function (entry) {
          var msgTime = entry.time * 1000;
          // Typing dots appear TYPING_LEAD ms before the message, but never before the panel is visible
          var typingTime = Math.max(PANEL_DELAY, msgTime - TYPING_LEAD);
          var typingDuration = msgTime - typingTime;

          // Show typing dots
          setTimeout(function () {
            var typingEl = createTranscriptTyping(entry.speaker);
            transcriptMessages.appendChild(typingEl);
            requestAnimationFrame(function () { typingEl.classList.add('msg-visible'); });
            transcriptMessages.scrollTop = transcriptMessages.scrollHeight;

            // Replace with actual message
            setTimeout(function () {
              var msgEl = createTranscriptMessage(entry.speaker, entry.text);
              transcriptMessages.replaceChild(msgEl, typingEl);
              requestAnimationFrame(function () { msgEl.classList.add('msg-visible'); });
              transcriptMessages.scrollTop = transcriptMessages.scrollHeight;
            }, Math.max(typingDuration, 300));
          }, typingTime);
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
      var chatBody = chatWidget.querySelector('.chat-widget-body');
      if (chatBody) chatBody.scrollTop = 0;
    }, stageDelay);
    stageDelay += 500;

    // Stage 7: Chat bubbles appear with natural pacing
    var chatBody = chatWidget.querySelector('.chat-widget-body');
    var bubbleDelays = [0, 1200, 3000, 4200, 6000, 7200, 8800, 10000, 11500, 12700, 14500];
    setTimeout(function () {
      chatBubbles.forEach(function (bubble, idx) {
        setTimeout(function () {
          bubble.classList.add('wb-visible');
          // Skip scroll for first bubble, let it stay at top
          if (idx > 0 && chatBody) {
            setTimeout(function () {
              // Calculate where this bubble ends
              var bubbleBottom = bubble.offsetTop + bubble.offsetHeight;
              // Only scroll if bubble extends below visible area
              if (bubbleBottom > chatBody.scrollTop + chatBody.clientHeight) {
                // Scroll to show this bubble's bottom at viewport bottom
                chatBody.scrollTo({
                  top: bubbleBottom - chatBody.clientHeight,
                  behavior: 'smooth'
                });
              }
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
     13. REVIEWS — Review Recovery Dashboard Animation
     ---------------------------------------------------------- */
  var reviewsDemo = document.getElementById('reviewsDemo');

  if (reviewsDemo && 'IntersectionObserver' in window) {
    var reviewsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateReviewsDashboard(entry.target);
          reviewsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    reviewsObserver.observe(reviewsDemo);
  }

  function animateReviewsDashboard(demoEl) {
    var ratingNumber = demoEl.querySelector('.reviews-rating-number');
    var feedCards = demoEl.querySelectorAll('.review-card');
    var stageDelay = 0;

    // Stage 1: Animate rating number (0.0 -> 5.0)
    setTimeout(function () {
      animateDecimalCounter(ratingNumber, 5.0, 1500);
      ratingNumber.classList.add('rv-visible');
    }, stageDelay);
    stageDelay += 1200;

    // Stage 2: Start notification feed cycling
    var currentCardIndex = 0;

    setTimeout(function () {
      feedCards[0].classList.add('rc-active');

      // If first card is a recovery card, trigger its animation
      if (feedCards[0].classList.contains('review-card-recovery')) {
        triggerRecoveryAnimation(feedCards[0]);
      }

      setInterval(function () {
        var prevCard = feedCards[currentCardIndex];
        prevCard.classList.remove('rc-active');
        prevCard.classList.add('rc-exit-up');

        setTimeout(function () {
          prevCard.classList.remove('rc-exit-up');
          // Reset recovery card to initial state for replay next cycle
          if (prevCard.classList.contains('review-card-recovery')) {
            resetRecoveryCard(prevCard);
          }
        }, 500);

        currentCardIndex = (currentCardIndex + 1) % feedCards.length;
        var nextCard = feedCards[currentCardIndex];
        nextCard.classList.add('rc-active');

        // Trigger recovery animation for any recovery card
        if (nextCard.classList.contains('review-card-recovery')) {
          triggerRecoveryAnimation(nextCard);
        }
      }, 3000);
    }, stageDelay);
  }

  function animateDecimalCounter(el, target, duration) {
    var start = null;
    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var easedProgress = easeOutCubic(progress);
      var current = (easedProgress * target).toFixed(1);
      el.textContent = current;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  function triggerRecoveryAnimation(card) {
    var starsContainer = card.querySelector('.review-card-stars');
    var textEl = card.querySelector('.review-card-text');
    var labelEl = card.querySelector('.review-recovery-label');
    var recoveredText = card.getAttribute('data-recovered-text');
    var initialStars = parseInt(card.getAttribute('data-initial-stars'), 10);

    setTimeout(function () {
      card.classList.add('rc-recovered');

      var stars = starsContainer.querySelectorAll('.rc-star');
      var delay = 0;
      for (var i = initialStars; i < 5; i++) {
        (function (idx) {
          setTimeout(function () {
            stars[idx].classList.add('filled');
          }, delay);
        })(i);
        delay += 200;
      }

      setTimeout(function () {
        textEl.textContent = '\u201C' + recoveredText + '\u201D';
      }, delay + 100);

      setTimeout(function () {
        labelEl.classList.add('rv-visible');
      }, delay + 400);
    }, 1500);
  }

  function resetRecoveryCard(card) {
    var starsContainer = card.querySelector('.review-card-stars');
    var textEl = card.querySelector('.review-card-text');
    var labelEl = card.querySelector('.review-recovery-label');
    var initialStars = parseInt(card.getAttribute('data-initial-stars'), 10);
    var initialText = card.getAttribute('data-initial-text');

    card.classList.remove('rc-recovered');

    var stars = starsContainer.querySelectorAll('.rc-star');
    for (var i = 0; i < 5; i++) {
      if (i < initialStars) {
        stars[i].classList.add('filled');
      } else {
        stars[i].classList.remove('filled');
      }
    }

    textEl.textContent = '\u201C' + initialText + '\u201D';
    labelEl.classList.remove('rv-visible');
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
      if (calTablet) calTablet.classList.add('calendar-booked');
      var rmBanner = document.getElementById('bookingBanner');
      if (rmBanner) rmBanner.classList.add('banner-visible');
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
      // Show reviews dashboard in final state instantly
      var reviewsEl = document.getElementById('reviewsDemo');
      if (reviewsEl) {
        var rn = reviewsEl.querySelector('.reviews-rating-number');
        if (rn) { rn.textContent = '5.0'; rn.classList.add('rv-visible'); }
        var firstCard = reviewsEl.querySelector('.review-card[data-index="0"]');
        if (firstCard) firstCard.classList.add('rc-active');
      }
    }
  }

  handleReducedMotion();
  prefersReducedMotion.addEventListener('change', handleReducedMotion);

  // ============================================================
  // 16. CTA MODAL — Open/Close, Form Validation, Mock Calendar
  // ============================================================

  var ctaModal = document.getElementById('ctaModal');
  var ctaForm = document.getElementById('ctaForm');
  var ctaUrlError = document.getElementById('ctaUrlError');
  var ctaMockCalendar = document.getElementById('ctaMockCalendar');
  var ctaSlotConfirmation = document.getElementById('ctaSlotConfirmation');
  var previousFocus = null;

  // --- Open / Close ---
  function openModal() {
    if (!ctaModal) return;
    previousFocus = document.activeElement;
    // Reset to form screen
    ctaModal.classList.remove('confirmed');
    if (ctaForm) ctaForm.reset();
    if (ctaUrlError) ctaUrlError.classList.remove('visible');
    // Clear input errors
    var errInputs = ctaModal.querySelectorAll('.input-error');
    for (var i = 0; i < errInputs.length; i++) errInputs[i].classList.remove('input-error');
    // Clear calendar
    if (ctaMockCalendar) ctaMockCalendar.innerHTML = '';
    if (ctaSlotConfirmation) ctaSlotConfirmation.textContent = '';
    // Show modal
    ctaModal.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
    // Close mobile menu if open
    var mobileMenu = document.getElementById('mobileMenu');
    var hamburger = document.getElementById('hamburger');
    if (mobileMenu && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      if (hamburger) hamburger.classList.remove('open');
    }
    // Focus first input
    setTimeout(function() {
      var firstInput = ctaModal.querySelector('input');
      if (firstInput) firstInput.focus();
    }, 100);
  }

  function closeModal() {
    if (!ctaModal) return;
    ctaModal.classList.remove('modal-open');
    document.body.style.overflow = '';
    if (previousFocus) previousFocus.focus();
  }

  // Bind all CTA triggers
  var ctaTriggers = document.querySelectorAll('.cta-open-modal');
  for (var i = 0; i < ctaTriggers.length; i++) {
    ctaTriggers[i].addEventListener('click', function(e) {
      e.preventDefault();
      openModal();
    });
  }

  // Close button
  var closeBtn = ctaModal ? ctaModal.querySelector('.cta-modal-close') : null;
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Close on confirm screen close button
  var confirmClose = ctaModal ? ctaModal.querySelector('.cta-confirm-close') : null;
  if (confirmClose) confirmClose.addEventListener('click', function(e) {
    e.preventDefault();
    closeModal();
  });

  // Overlay click
  if (ctaModal) {
    ctaModal.addEventListener('click', function(e) {
      if (e.target === ctaModal) closeModal();
    });
  }

  // Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && ctaModal && ctaModal.classList.contains('modal-open')) {
      closeModal();
    }
  });

  // --- Form Validation & Submit ---
  if (ctaForm) {
    ctaForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var valid = true;

      // Clear previous errors
      var allInputs = ctaForm.querySelectorAll('input');
      for (var i = 0; i < allInputs.length; i++) allInputs[i].classList.remove('input-error');
      if (ctaUrlError) ctaUrlError.classList.remove('visible');

      // Check required fields
      var name = ctaForm.querySelector('#ctaName');
      var phone = ctaForm.querySelector('#ctaPhone');
      var email = ctaForm.querySelector('#ctaEmail');
      if (name && !name.value.trim()) { name.classList.add('input-error'); valid = false; }
      if (phone && !phone.value.trim()) { phone.classList.add('input-error'); valid = false; }
      if (email && !email.value.trim()) { email.classList.add('input-error'); valid = false; }

      // Check at least one URL
      var website = ctaForm.querySelector('#ctaWebsite');
      var facebook = ctaForm.querySelector('#ctaFacebook');
      var otherUrl = ctaForm.querySelector('#ctaOtherUrl');
      var hasUrl = (website && website.value.trim()) || (facebook && facebook.value.trim()) || (otherUrl && otherUrl.value.trim());
      if (!hasUrl) {
        if (ctaUrlError) ctaUrlError.classList.add('visible');
        valid = false;
      }

      if (!valid) return;

      // Success — show confirmation
      ctaModal.classList.add('confirmed');
      buildMockCalendar();
      // Scroll modal card to top
      var card = ctaModal.querySelector('.cta-modal-card');
      if (card) card.scrollTop = 0;
    });
  }

  // --- Mock Calendar ---
  function buildMockCalendar() {
    if (!ctaMockCalendar) return;
    ctaMockCalendar.innerHTML = '';
    if (ctaSlotConfirmation) ctaSlotConfirmation.textContent = '';

    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth();
    var today = now.getDate();
    var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    // Header
    var header = document.createElement('div');
    header.className = 'cta-cal-header';
    header.innerHTML = '<button type="button" disabled>&larr;</button><span>' + monthNames[month] + ' ' + year + '</span><button type="button" disabled>&rarr;</button>';
    ctaMockCalendar.appendChild(header);

    // Weekday labels
    var weekdays = document.createElement('div');
    weekdays.className = 'cta-cal-weekdays';
    var dayLabels = ['S','M','T','W','T','F','S'];
    for (var i = 0; i < 7; i++) {
      var d = document.createElement('span');
      d.textContent = dayLabels[i];
      weekdays.appendChild(d);
    }
    ctaMockCalendar.appendChild(weekdays);

    // Day grid
    var daysContainer = document.createElement('div');
    daysContainer.className = 'cta-cal-days';
    var firstDay = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();

    // Empty cells for offset
    for (var i = 0; i < firstDay; i++) {
      var empty = document.createElement('div');
      empty.className = 'cta-cal-day';
      daysContainer.appendChild(empty);
    }

    // Available days: next 5 business days from today
    var availableDays = [];
    var checkDate = new Date(year, month, today + 1);
    while (availableDays.length < 5) {
      var dow = checkDate.getDay();
      if (dow !== 0 && dow !== 6 && checkDate.getMonth() === month) {
        availableDays.push(checkDate.getDate());
      }
      checkDate.setDate(checkDate.getDate() + 1);
      if (checkDate.getMonth() !== month && availableDays.length < 5) break;
    }

    // Slots container (below days)
    var slotsContainer = document.createElement('div');
    slotsContainer.className = 'cta-cal-slots';

    for (var d = 1; d <= daysInMonth; d++) {
      var dayEl = document.createElement('div');
      dayEl.className = 'cta-cal-day';
      dayEl.textContent = d;
      if (d < today) {
        dayEl.classList.add('past');
      } else if (availableDays.indexOf(d) !== -1) {
        dayEl.classList.add('available');
        (function(dayNum) {
          dayEl.addEventListener('click', function() {
            // Deselect all
            var allDays = daysContainer.querySelectorAll('.cta-cal-day');
            for (var j = 0; j < allDays.length; j++) allDays[j].classList.remove('selected');
            this.classList.add('selected');
            if (ctaSlotConfirmation) ctaSlotConfirmation.textContent = '';
            showTimeSlots(slotsContainer, dayNum);
          });
        })(d);
      }
      daysContainer.appendChild(dayEl);
    }

    ctaMockCalendar.appendChild(daysContainer);
    ctaMockCalendar.appendChild(slotsContainer);
  }

  function showTimeSlots(container, dayNum) {
    container.innerHTML = '';
    var times = ['9:00 AM', '10:30 AM', '1:00 PM', '2:30 PM', '4:00 PM'];
    for (var i = 0; i < times.length; i++) {
      var slot = document.createElement('button');
      slot.type = 'button';
      slot.className = 'cta-cal-slot';
      slot.textContent = times[i];
      (function(timeText) {
        slot.addEventListener('click', function() {
          // Deselect all slots
          var allSlots = container.querySelectorAll('.cta-cal-slot');
          for (var j = 0; j < allSlots.length; j++) allSlots[j].classList.remove('selected');
          this.classList.add('selected');
          if (ctaSlotConfirmation) {
            ctaSlotConfirmation.textContent = 'Selected ' + timeText + ' — we\'ll see you then!';
          }
        });
      })(times[i]);
      container.appendChild(slot);
    }
  }

  /* ----------------------------------------------------------
     17. SPOTLIGHT CURSOR GLOW ON CARDS (Stripe/Aceternity)
     ---------------------------------------------------------- */
  var spotlightCards = document.querySelectorAll('.spotlight-card');
  spotlightCards.forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
      card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
    });
  });

  /* ----------------------------------------------------------
     18. 3D PERSPECTIVE TILT ON HVAC STATS PANEL (Aceternity)
     ---------------------------------------------------------- */
  var tiltPanel = document.querySelector('.hvac-stats-panel');
  if (tiltPanel && !prefersReducedMotion.matches) {
    tiltPanel.addEventListener('mousemove', function(e) {
      var rect = tiltPanel.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      var rotateX = ((y - centerY) / centerY) * -3;
      var rotateY = ((x - centerX) / centerX) * 3;
      tiltPanel.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
    });
    tiltPanel.addEventListener('mouseleave', function() {
      tiltPanel.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
    });
  }

  /* ----------------------------------------------------------
     19. DIRECTIONAL SCROLL REVEALS
     ---------------------------------------------------------- */
  var directionalReveals = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-scale, .reveal-blur');
  if ('IntersectionObserver' in window) {
    var dirRevealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          dirRevealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    directionalReveals.forEach(function(el) { dirRevealObserver.observe(el); });
  } else {
    directionalReveals.forEach(function(el) { el.classList.add('revealed'); });
  }

  /* ----------------------------------------------------------
     20. STAGGERED COUNTER CASCADE
     ---------------------------------------------------------- */
  // Override default counter observer to stagger HVAC and ROI counters
  function staggerCountersIn(container) {
    var counters = container.querySelectorAll('[data-count]');
    counters.forEach(function(el, idx) {
      setTimeout(function() {
        animateCounter(el);
      }, idx * 200);
    });
  }

  // Re-observe ROI breakdown for staggered effect
  var roiBreakdown = document.querySelector('.roi-breakdown');
  if (roiBreakdown && 'IntersectionObserver' in window) {
    var roiStaggerObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          staggerCountersIn(entry.target);
          roiStaggerObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    roiStaggerObserver.observe(roiBreakdown);
  }

  /* ----------------------------------------------------------
     21. MODAL FOCUS TRAP
     ---------------------------------------------------------- */
  if (ctaModal) {
    ctaModal.addEventListener('keydown', function(e) {
      if (e.key !== 'Tab') return;
      var focusable = ctaModal.querySelectorAll('input, button, [tabindex]:not([tabindex="-1"]), a[href]');
      if (focusable.length === 0) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* ----------------------------------------------------------
     22. INLINE FORM VALIDATION WITH MICRO-FEEDBACK
     ---------------------------------------------------------- */
  if (ctaForm) {
    var formInputs = ctaForm.querySelectorAll('input[required]');
    formInputs.forEach(function(input) {
      input.addEventListener('blur', function() {
        validateField(input);
      });
      input.addEventListener('input', function() {
        // Clear errors as user types
        if (input.classList.contains('input-error')) {
          input.classList.remove('input-error');
          var errEl = input.parentElement.querySelector('.cta-field-error');
          if (errEl) errEl.classList.remove('visible');
        }
        // Show success state
        if (input.value.trim()) {
          input.classList.add('input-success');
        } else {
          input.classList.remove('input-success');
        }
      });
    });

    function validateField(input) {
      var value = input.value.trim();
      var errEl = input.parentElement.querySelector('.cta-field-error');
      if (!value) {
        input.classList.add('input-error');
        input.classList.remove('input-success');
        if (errEl) errEl.classList.add('visible');
      } else {
        input.classList.remove('input-error');
        input.classList.add('input-success');
        if (errEl) errEl.classList.remove('visible');
        // Email validation
        if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          input.classList.add('input-error');
          input.classList.remove('input-success');
          if (errEl) {
            errEl.textContent = 'Please enter a valid email address';
            errEl.classList.add('visible');
          }
        }
      }
    }
  }

  /* ----------------------------------------------------------
     23. LENIS SMOOTH SCROLL
     ---------------------------------------------------------- */
  if (typeof Lenis !== 'undefined' && !prefersReducedMotion.matches) {
    var lenis = new Lenis({
      duration: 1.2,
      easing: function(t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      orientation: 'vertical',
      smoothWheel: true
    });
    function lenisRaf(time) {
      lenis.raf(time);
      requestAnimationFrame(lenisRaf);
    }
    requestAnimationFrame(lenisRaf);
  }

})();
