/**
 * Interactivity Tests
 * Tests FAQ accordion and analytics tracking behavior.
 */

const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(
  path.resolve(__dirname, '..', 'index.html'),
  'utf-8'
);

const mainJsSource = fs.readFileSync(
  path.resolve(__dirname, '..', 'js', 'main.js'),
  'utf-8'
);

/**
 * Helper: set up a fresh DOM from the HTML, then execute main.js
 * so the FAQ accordion and smooth-scroll handlers are initialised.
 */
function setupDOM() {
  document.documentElement.innerHTML = new DOMParser()
    .parseFromString(html, 'text/html')
    .documentElement.innerHTML;

  // Execute main.js in the current jsdom global scope
  // eslint-disable-next-line no-eval
  eval(mainJsSource);
}

describe('FAQ Accordion', () => {
  beforeEach(() => {
    setupDOM();
  });

  test('FAQ items start closed', () => {
    const items = document.querySelectorAll('.faq__item');
    items.forEach((item) => {
      expect(item.getAttribute('data-open')).toBe('false');
    });
  });

  test('FAQ buttons have correct ARIA attributes after init', () => {
    const buttons = document.querySelectorAll('.faq__question');
    expect(buttons.length).toBeGreaterThan(0);
    buttons.forEach((btn) => {
      expect(btn.getAttribute('aria-expanded')).toBe('false');
      expect(btn.getAttribute('type')).toBe('button');
    });
  });

  test('clicking a FAQ question opens the answer', () => {
    const firstItem = document.querySelector('.faq__item');
    const firstBtn = firstItem.querySelector('.faq__question');

    firstBtn.click();

    expect(firstItem.getAttribute('data-open')).toBe('true');
    expect(firstBtn.getAttribute('aria-expanded')).toBe('true');
  });

  test('clicking an open FAQ question closes it', () => {
    const firstItem = document.querySelector('.faq__item');
    const firstBtn = firstItem.querySelector('.faq__question');

    // Open
    firstBtn.click();
    expect(firstItem.getAttribute('data-open')).toBe('true');

    // Close
    firstBtn.click();
    expect(firstItem.getAttribute('data-open')).toBe('false');
    expect(firstBtn.getAttribute('aria-expanded')).toBe('false');
  });

  test('opening one FAQ item closes others (accordion behavior)', () => {
    const items = document.querySelectorAll('.faq__item');
    const firstBtn = items[0].querySelector('.faq__question');
    const secondBtn = items[1].querySelector('.faq__question');

    // Open first
    firstBtn.click();
    expect(items[0].getAttribute('data-open')).toBe('true');

    // Open second — first should close
    secondBtn.click();
    expect(items[0].getAttribute('data-open')).toBe('false');
    expect(items[1].getAttribute('data-open')).toBe('true');
  });

  test('FAQ answers have role="region" after init', () => {
    const answers = document.querySelectorAll('.faq__answer');
    expect(answers.length).toBeGreaterThan(0);
    answers.forEach((answer) => {
      expect(answer.getAttribute('role')).toBe('region');
    });
  });

  test('FAQ buttons have aria-controls linking to answers', () => {
    const buttons = document.querySelectorAll('.faq__question');
    buttons.forEach((btn) => {
      const controlsId = btn.getAttribute('aria-controls');
      expect(controlsId).toBeTruthy();
      const answer = document.getElementById(controlsId);
      expect(answer).not.toBeNull();
      expect(answer.classList.contains('faq__answer')).toBe(true);
    });
  });
});

describe('Analytics tracking setup', () => {
  let analyticsJs;

  beforeAll(() => {
    analyticsJs = fs.readFileSync(
      path.resolve(__dirname, '..', 'js', 'analytics.js'),
      'utf-8'
    );
  });

  test('analytics script defines tracking functions', () => {
    expect(analyticsJs).toMatch(/track/);
    expect(analyticsJs).toMatch(/pageView/);
    expect(analyticsJs).toMatch(/scroll_depth/);
  });

  test('analytics tracks CTA clicks via data-track-cta', () => {
    expect(analyticsJs).toMatch(/data-track-cta/);
    expect(analyticsJs).toMatch(/cta_click/);
  });

  test('analytics tracks section interactions', () => {
    expect(analyticsJs).toMatch(/data-track-section/);
    expect(analyticsJs).toMatch(/section_interaction/);
  });

  test('analytics tracks scroll milestones (25, 50, 75, 100)', () => {
    expect(analyticsJs).toMatch(/25/);
    expect(analyticsJs).toMatch(/50/);
    expect(analyticsJs).toMatch(/75/);
    expect(analyticsJs).toMatch(/100/);
  });

  test('analytics supports Segment and GTM', () => {
    expect(analyticsJs).toMatch(/window\.analytics/);
    expect(analyticsJs).toMatch(/dataLayer/);
  });
});

describe('Smooth scroll', () => {
  test('anchor links with # hrefs all point to existing targets', () => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const anchors = doc.querySelectorAll('a[href^="#"]');
    expect(anchors.length).toBeGreaterThan(0);

    anchors.forEach((anchor) => {
      const targetId = anchor.getAttribute('href').substring(1);
      if (targetId) {
        const target = doc.getElementById(targetId);
        expect(target).not.toBeNull();
      }
    });
  });
});
