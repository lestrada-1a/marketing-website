/**
 * Premium Features Promo — JavaScript
 * Analytics tracking, scroll depth, FAQ interactions, mobile menu, smooth scroll
 */

(function () {
  'use strict';

  // ─── Analytics Helper ───────────────────────────────────────────────
  function trackEvent(category, action, label) {
    // Push to dataLayer (Google Tag Manager compatible)
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'promo_event',
      eventCategory: category,
      eventAction: action,
      eventLabel: label,
    });

    // Console logging in development
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      console.log('[Analytics]', category, '|', action, '|', label);
    }
  }

  // ─── Page View ──────────────────────────────────────────────────────
  trackEvent('page', 'view', document.title);

  // ─── CTA Click Tracking ────────────────────────────────────────────
  document.addEventListener('click', function (e) {
    var tracked = e.target.closest('[data-track]');
    if (tracked) {
      trackEvent('cta', 'click', tracked.getAttribute('data-track'));
    }
  });

  // ─── Scroll Depth Tracking ─────────────────────────────────────────
  var scrollThresholds = [25, 50, 75, 100];
  var scrollFired = {};

  function getScrollPercent() {
    var h = document.documentElement;
    var b = document.body;
    var st = h.scrollTop || b.scrollTop;
    var sh = (h.scrollHeight || b.scrollHeight) - h.clientHeight;
    return sh > 0 ? Math.round((st / sh) * 100) : 0;
  }

  var scrollTimer = null;
  window.addEventListener('scroll', function () {
    if (scrollTimer) return;
    scrollTimer = setTimeout(function () {
      scrollTimer = null;
      var pct = getScrollPercent();
      scrollThresholds.forEach(function (threshold) {
        if (pct >= threshold && !scrollFired[threshold]) {
          scrollFired[threshold] = true;
          trackEvent('scroll', 'depth', threshold + '%');
        }
      });
    }, 200);
  }, { passive: true });

  // ─── Section Visibility Tracking ───────────────────────────────────
  if ('IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var section = entry.target.getAttribute('data-track-section') ||
                        entry.target.getAttribute('id');
          if (section) {
            trackEvent('section', 'view', section);
          }
          sectionObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('[data-track-section], section[id]').forEach(function (el) {
      sectionObserver.observe(el);
    });
  }

  // ─── FAQ Interaction Tracking ──────────────────────────────────────
  document.querySelectorAll('.faq-item').forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) {
        var label = item.getAttribute('data-track-section') || 'faq-item';
        trackEvent('faq', 'open', label);
      }
    });
  });

  // ─── Mobile Menu ───────────────────────────────────────────────────
  var menuToggle = document.querySelector('.mobile-menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      var expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !expanded);
      mobileMenu.hidden = expanded;
      menuToggle.classList.toggle('is-active', !expanded);
      document.body.classList.toggle('menu-open', !expanded);
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.hidden = true;
        menuToggle.classList.remove('is-active');
        document.body.classList.remove('menu-open');
      });
    });
  }

  // ─── Smooth Scroll for Anchor Links ────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerOffset = 80;
        var elementPosition = target.getBoundingClientRect().top;
        var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
        // Update URL without jumping
        history.pushState(null, null, targetId);
      }
    });
  });

  // ─── Scroll Animations ─────────────────────────────────────────────
  if ('IntersectionObserver' in window) {
    var animObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          animObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll(
      '.benefit-card, .feature-layout, .testimonial-card, .pricing-card, .faq-item'
    ).forEach(function (el) {
      el.classList.add('animate-target');
      animObserver.observe(el);
    });
  }

  // ─── Header Scroll Effect ─────────────────────────────────────────
  var header = document.querySelector('.site-header');
  var lastScroll = 0;

  window.addEventListener('scroll', function () {
    var currentScroll = window.pageYOffset;
    if (currentScroll > 60) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

})();
