/* ============================================================
   Analytics & Event Tracking
   Premium Features Promo Landing Page
   ============================================================ */

(function () {
  'use strict';

  /**
   * Lightweight analytics helper.
   * Delegates to window.analytics (Segment-style) or dataLayer (GTM)
   * when available, and always logs to console in development.
   */
  var Analytics = {
    /** Push an event. */
    track: function (eventName, properties) {
      properties = properties || {};
      properties.page = 'premium-features-promo';
      properties.timestamp = new Date().toISOString();

      // Segment / generic analytics
      if (window.analytics && typeof window.analytics.track === 'function') {
        window.analytics.track(eventName, properties);
      }

      // Google Tag Manager dataLayer
      if (window.dataLayer && typeof window.dataLayer.push === 'function') {
        window.dataLayer.push({
          event: eventName,
          eventProperties: properties,
        });
      }

      // Dev logging
      if (
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1'
      ) {
        console.log('[Analytics]', eventName, properties);
      }
    },

    /** Record a page view. */
    pageView: function () {
      this.track('page_view', {
        title: document.title,
        url: window.location.href,
        referrer: document.referrer,
      });
    },
  };

  /* ------- Page View --------------------------------------- */
  Analytics.pageView();

  /* ------- CTA Click Tracking ------------------------------ */
  document.addEventListener('click', function (e) {
    var cta = e.target.closest('[data-track-cta]');
    if (!cta) return;

    Analytics.track('cta_click', {
      cta_type: cta.getAttribute('data-track-cta'),
      cta_text: cta.textContent.trim(),
      section: closestSectionId(cta),
    });
  });

  /* ------- Section Interaction Tracking -------------------- */
  document.addEventListener('click', function (e) {
    var section = e.target.closest('[data-track-section]');
    if (!section) return;

    Analytics.track('section_interaction', {
      section: section.getAttribute('data-track-section'),
      element: e.target.tagName.toLowerCase(),
    });
  });

  /* ------- Scroll Depth Tracking --------------------------- */
  var scrollMilestones = [25, 50, 75, 100];
  var milestonesFired = {};

  function getScrollPercent() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (docHeight === 0) return 0;
    return Math.round((scrollTop / docHeight) * 100);
  }

  var scrollThrottle = null;
  window.addEventListener('scroll', function () {
    if (scrollThrottle) return;
    scrollThrottle = setTimeout(function () {
      scrollThrottle = null;
      var pct = getScrollPercent();
      for (var i = 0; i < scrollMilestones.length; i++) {
        var m = scrollMilestones[i];
        if (pct >= m && !milestonesFired[m]) {
          milestonesFired[m] = true;
          Analytics.track('scroll_depth', { depth: m });
        }
      }
    }, 200);
  });

  /* ------- Helpers ----------------------------------------- */
  function closestSectionId(el) {
    while (el && el !== document.body) {
      if (el.id) return el.id;
      if (el.getAttribute && el.getAttribute('data-track-section')) {
        return el.getAttribute('data-track-section');
      }
      el = el.parentElement;
    }
    return 'unknown';
  }

  // Expose for testing
  window.__premiumPromoAnalytics = Analytics;
})();
