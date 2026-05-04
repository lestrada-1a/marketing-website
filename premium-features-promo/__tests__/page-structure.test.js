/**
 * Page Structure Tests
 * Verifies all required sections are present and structured correctly.
 */

const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(
  path.resolve(__dirname, '..', 'index.html'),
  'utf-8'
);

let document;

beforeAll(() => {
  document = new DOMParser().parseFromString(html, 'text/html');
});

describe('Page metadata & SEO', () => {
  test('has a descriptive <title>', () => {
    const title = document.querySelector('title');
    expect(title).not.toBeNull();
    expect(title.textContent).toMatch(/premium/i);
    expect(title.textContent).toMatch(/roadmaps/i);
  });

  test('has a meta description', () => {
    const meta = document.querySelector('meta[name="description"]');
    expect(meta).not.toBeNull();
    expect(meta.getAttribute('content').length).toBeGreaterThan(50);
  });

  test('has Open Graph tags', () => {
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    expect(ogTitle).not.toBeNull();
    expect(ogDesc).not.toBeNull();
  });

  test('has lang attribute on <html>', () => {
    expect(document.documentElement.getAttribute('lang')).toBe('en');
  });
});

describe('Accessibility basics', () => {
  test('has a skip-to-content link', () => {
    const skip = document.querySelector('.skip-link');
    expect(skip).not.toBeNull();
    expect(skip.getAttribute('href')).toBe('#main-content');
  });

  test('has a <main> element with id', () => {
    const main = document.querySelector('main#main-content');
    expect(main).not.toBeNull();
  });

  test('navigation has aria-label', () => {
    const nav = document.querySelector('nav[aria-label]');
    expect(nav).not.toBeNull();
  });

  test('all sections have aria-labelledby pointing to a heading', () => {
    const sections = document.querySelectorAll('section[aria-labelledby]');
    expect(sections.length).toBeGreaterThanOrEqual(6);
    sections.forEach((section) => {
      const labelId = section.getAttribute('aria-labelledby');
      const heading = section.querySelector('#' + labelId);
      expect(heading).not.toBeNull();
    });
  });

  test('FAQ buttons have aria-expanded attribute', () => {
    const buttons = document.querySelectorAll('.faq__question');
    expect(buttons.length).toBeGreaterThan(0);
    buttons.forEach((btn) => {
      expect(btn.hasAttribute('aria-expanded')).toBe(true);
    });
  });

  test('images and decorative SVGs have appropriate alt/aria-hidden', () => {
    const decorativeSvgs = document.querySelectorAll('svg[aria-hidden="true"]');
    expect(decorativeSvgs.length).toBeGreaterThan(0);

    const featureVisuals = document.querySelectorAll('.feature__visual[role="img"]');
    featureVisuals.forEach((visual) => {
      expect(visual.hasAttribute('aria-label')).toBe(true);
    });
  });
});

describe('Required page sections', () => {
  test('has Hero section', () => {
    const hero = document.querySelector('#hero');
    expect(hero).not.toBeNull();
    expect(hero.querySelector('h1')).not.toBeNull();
  });

  test('has Benefits overview section', () => {
    const benefits = document.querySelector('#benefits');
    expect(benefits).not.toBeNull();
    const cards = benefits.querySelectorAll('.benefit-card');
    expect(cards.length).toBeGreaterThanOrEqual(3);
  });

  test('has Roadmaps deep-dive section', () => {
    const roadmaps = document.querySelector('#roadmaps');
    expect(roadmaps).not.toBeNull();
    expect(roadmaps.querySelector('h2').textContent).toMatch(/roadmaps/i);
    expect(roadmaps.querySelector('.feature__list')).not.toBeNull();
  });

  test('has Flexible Hierarchy deep-dive section', () => {
    const hierarchy = document.querySelector('#flexible-hierarchy');
    expect(hierarchy).not.toBeNull();
    expect(hierarchy.querySelector('h2').textContent).toMatch(/flexible hierarchy/i);
    expect(hierarchy.querySelector('.feature__list')).not.toBeNull();
  });

  test('has Social Proof section with testimonials', () => {
    const social = document.querySelector('#social-proof');
    expect(social).not.toBeNull();
    const testimonials = social.querySelectorAll('.testimonial-card');
    expect(testimonials.length).toBeGreaterThanOrEqual(3);
  });

  test('has Pricing teaser section with plan cards', () => {
    const pricing = document.querySelector('#pricing');
    expect(pricing).not.toBeNull();
    const plans = pricing.querySelectorAll('.plan-card');
    expect(plans.length).toBeGreaterThanOrEqual(3);
    // Premium plan should be featured
    const featured = pricing.querySelector('.plan-card--featured');
    expect(featured).not.toBeNull();
  });

  test('has FAQ section with questions', () => {
    const faq = document.querySelector('#faq');
    expect(faq).not.toBeNull();
    const items = faq.querySelectorAll('.faq__item');
    expect(items.length).toBeGreaterThanOrEqual(4);
  });

  test('has Final CTA section', () => {
    const finalCta = document.querySelector('#final-cta');
    expect(finalCta).not.toBeNull();
    expect(finalCta.querySelector('h2')).not.toBeNull();
  });

  test('has footer', () => {
    const footer = document.querySelector('footer[role="contentinfo"]');
    expect(footer).not.toBeNull();
  });
});

describe('CTAs', () => {
  test('has primary CTA (Start Premium Trial) in hero', () => {
    const heroCta = document.querySelector('#hero [data-track-cta="hero-primary"]');
    expect(heroCta).not.toBeNull();
    expect(heroCta.textContent).toMatch(/premium trial/i);
  });

  test('has secondary CTA (Compare Plans) in hero', () => {
    const secondaryCta = document.querySelector('#hero [data-track-cta="hero-secondary"]');
    expect(secondaryCta).not.toBeNull();
    expect(secondaryCta.textContent).toMatch(/compare plans/i);
  });

  test('has CTA in Roadmaps section', () => {
    const cta = document.querySelector('#roadmaps [data-track-cta]');
    expect(cta).not.toBeNull();
  });

  test('has CTA in Flexible Hierarchy section', () => {
    const cta = document.querySelector('#flexible-hierarchy [data-track-cta]');
    expect(cta).not.toBeNull();
  });

  test('has CTAs in final CTA section', () => {
    const ctas = document.querySelectorAll('#final-cta [data-track-cta]');
    expect(ctas.length).toBeGreaterThanOrEqual(2);
  });

  test('has navigation CTA', () => {
    const navCta = document.querySelector('.navbar [data-track-cta="nav-trial"]');
    expect(navCta).not.toBeNull();
  });
});

describe('Analytics data attributes', () => {
  test('all major sections have data-track-section', () => {
    const tracked = document.querySelectorAll('[data-track-section]');
    const sectionNames = Array.from(tracked).map((el) =>
      el.getAttribute('data-track-section')
    );
    expect(sectionNames).toContain('hero');
    expect(sectionNames).toContain('benefits');
    expect(sectionNames).toContain('roadmaps');
    expect(sectionNames).toContain('flexible-hierarchy');
    expect(sectionNames).toContain('social-proof');
    expect(sectionNames).toContain('pricing');
    expect(sectionNames).toContain('faq');
    expect(sectionNames).toContain('final-cta');
  });

  test('CTAs have data-track-cta attributes', () => {
    const ctas = document.querySelectorAll('[data-track-cta]');
    expect(ctas.length).toBeGreaterThanOrEqual(8);
    ctas.forEach((cta) => {
      expect(cta.getAttribute('data-track-cta')).toBeTruthy();
    });
  });
});

describe('Content quality', () => {
  test('headings follow correct hierarchy (no skipped levels)', () => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let lastLevel = 0;
    headings.forEach((h) => {
      const level = parseInt(h.tagName.charAt(1));
      // Should not skip more than 1 level
      if (lastLevel > 0) {
        expect(level).toBeLessThanOrEqual(lastLevel + 1);
      }
      lastLevel = level;
    });
  });

  test('has exactly one h1', () => {
    const h1s = document.querySelectorAll('h1');
    expect(h1s.length).toBe(1);
  });

  test('Roadmaps section mentions key benefits', () => {
    const roadmaps = document.querySelector('#roadmaps');
    const text = roadmaps.textContent.toLowerCase();
    expect(text).toMatch(/timeline|visualize/);
    expect(text).toMatch(/dependenc/);
    expect(text).toMatch(/stakeholder|progress/);
  });

  test('Flexible Hierarchy section mentions key benefits', () => {
    const hierarchy = document.querySelector('#flexible-hierarchy');
    const text = hierarchy.textContent.toLowerCase();
    expect(text).toMatch(/custom/);
    expect(text).toMatch(/hierarchy|level/);
    expect(text).toMatch(/organization|cross-functional/);
  });
});

describe('Performance & loading', () => {
  test('scripts use defer attribute', () => {
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach((script) => {
      expect(
        script.hasAttribute('defer') || script.hasAttribute('async')
      ).toBe(true);
    });
  });

  test('stylesheets are loaded in <head>', () => {
    const headStyles = document.querySelectorAll('head link[rel="stylesheet"]');
    expect(headStyles.length).toBeGreaterThanOrEqual(2);
  });
});
