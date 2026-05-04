/* ============================================================
   Main Interactivity
   Premium Features Promo Landing Page
   ============================================================ */

(function () {
  'use strict';

  /* ------- FAQ Accordion ----------------------------------- */
  function initFaq() {
    var items = document.querySelectorAll('.faq__item');
    items.forEach(function (item) {
      var btn = item.querySelector('.faq__question');
      var answer = item.querySelector('.faq__answer');
      if (!btn || !answer) return;

      btn.setAttribute('aria-expanded', 'false');
      answer.setAttribute('role', 'region');
      answer.id = answer.id || 'faq-answer-' + Math.random().toString(36).substr(2, 6);
      btn.setAttribute('aria-controls', answer.id);

      btn.addEventListener('click', function () {
        var isOpen = item.getAttribute('data-open') === 'true';
        // Close all
        items.forEach(function (other) {
          other.setAttribute('data-open', 'false');
          var otherBtn = other.querySelector('.faq__question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        });
        // Toggle current
        if (!isOpen) {
          item.setAttribute('data-open', 'true');
          btn.setAttribute('aria-expanded', 'true');
        }
      });

      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });
  }

  /* ------- Smooth scroll for anchor links ------------------ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href').substring(1);
        var target = document.getElementById(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          target.focus({ preventScroll: true });
        }
      });
    });
  }

  /* ------- Init -------------------------------------------- */
  function init() {
    initFaq();
    initSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for testing
  window.__premiumPromoMain = { initFaq: initFaq, initSmoothScroll: initSmoothScroll };
})();
