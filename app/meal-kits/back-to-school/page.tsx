import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import styles from "./page.module.css";

const benefits = [
  {
    title: "Ready in 20 Minutes",
    description:
      "Fast-prep dinners help families move from backpacks to the table without the usual weeknight scramble.",
  },
  {
    title: "Kid-Approved Recipes",
    description:
      "Family-friendly favorites keep picky eaters happy while still feeling fresh, colorful, and satisfying.",
  },
  {
    title: "Everything Included",
    description:
      "Pre-portioned ingredients and simple recipe cards remove the guesswork so dinner feels easy again.",
  },
];

const featuredKits = [
  {
    name: "Taco Tuesday Kit",
    prepTime: "15 min prep",
    price: "$24",
    image: "/kit-taco.svg",
    alt: "Illustrated taco night meal kit with tortillas, vegetables, and toppings.",
  },
  {
    name: "Pasta Night Kit",
    prepTime: "20 min prep",
    price: "$26",
    image: "/kit-pasta.svg",
    alt: "Illustrated pasta meal kit with noodles, sauce, and garlic bread.",
  },
  {
    name: "Sheet Pan Chicken Kit",
    prepTime: "20 min prep",
    price: "$28",
    image: "/kit-sheet-pan.svg",
    alt: "Illustrated sheet pan chicken meal kit with vegetables and herbs.",
  },
];

const steps = [
  {
    title: "Pick your kits",
    description:
      "Choose the weeknight winners your family wants most, from taco night to easy pasta favorites.",
  },
  {
    title: "We deliver",
    description:
      "Your chilled meal kits arrive at the door with fresh ingredients portioned for stress-free prep.",
  },
  {
    title: "Cook & enjoy",
    description:
      "Follow the simple recipe card, get dinner on the table fast, and enjoy more calm in the evening rush.",
  },
];

export const metadata: Metadata = {
  title: "AM-23 | Back-to-School Meal Kits",
  description:
    "Quick and easy meal kits for busy school nights, built for families who need fast weeknight dinner ideas.",
};

export default function BackToSchoolPage() {
  return (
    <main className={styles.page}>
      <section className={`${styles.section} ${styles.hero}`}>
        <div className={styles.heroShell}>
          <div>
            <span className={styles.eyebrow}>Back-to-school meal kits</span>
            <h1 className={styles.heroTitle}>
              Quick &amp; Easy Meal Kits for Busy School Nights
            </h1>
            <p className={styles.heroText}>
              Stress-free dinners ready in minutes for busy families.
            </p>
            <p className={styles.heroText}>
              Discover warm, family-friendly meal kits designed for hectic
              weeknights, with quick prep, easy cleanup, and comforting flavors
              everyone can look forward to.
            </p>
            <div className={styles.heroActions}>
              <Link className={styles.primaryAction} href="#featured-meal-kits">
                Explore featured kits
              </Link>
              <Link className={styles.secondaryAction} href="#how-it-works">
                See how it works
              </Link>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <Image
              className={styles.heroImage}
              src="/hero-back-to-school.svg"
              alt="Warm family dinner scene with meal kits, lunchboxes, and back-to-school details."
              width={680}
              height={560}
              priority
            />
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.benefits}`} aria-labelledby="benefits-heading">
        <h2 className={styles.sectionHeading} id="benefits-heading">
          Why busy families love these kits
        </h2>
        <p className={styles.sectionIntro}>
          Built for packed calendars and hungry kids, each kit helps dinner feel
          faster, simpler, and more enjoyable from the first step to the last
          bite.
        </p>
        <div className={styles.benefitGrid}>
          {benefits.map((benefit, index) => (
            <article className={styles.benefitCard} key={benefit.title}>
              <span className={styles.benefitNumber}>{index + 1}</span>
              <h3 className={styles.benefitTitle}>{benefit.title}</h3>
              <p className={styles.benefitDescription}>{benefit.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className={`${styles.section} ${styles.featured}`}
        id="featured-meal-kits"
        aria-labelledby="featured-heading"
      >
        <h2 className={styles.sectionHeading} id="featured-heading">
          Featured meal kits
        </h2>
        <p className={styles.sectionIntro}>
          A curated lineup of quick-prep favorites helps families keep busy
          school nights on track without sacrificing a dinner everyone will
          enjoy.
        </p>
        <div className={styles.kitGrid}>
          {featuredKits.map((kit) => (
            <article className={styles.kitCard} key={kit.name}>
              <div className={styles.kitImageWrap}>
                <Image
                  className={styles.kitImage}
                  src={kit.image}
                  alt={kit.alt}
                  width={520}
                  height={360}
                />
              </div>
              <h3 className={styles.kitTitle}>{kit.name}</h3>
              <p className={styles.kitMeta}>
                <span className={styles.metaAccent}>{kit.prepTime}</span> ·
                Flavor-packed ingredients for easy family dinners.
              </p>
              <div className={styles.priceRow}>
                <span className={styles.price}>{kit.price}</span>
                <span className={styles.kitButton}>Add to plan</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className={`${styles.section} ${styles.steps}`}
        id="how-it-works"
        aria-labelledby="steps-heading"
      >
        <h2 className={styles.sectionHeading} id="steps-heading">
          How It Works
        </h2>
        <p className={styles.sectionIntro}>
          Three simple steps make back-to-school dinners easier from Monday
          through Friday.
        </p>
        <div className={styles.stepsGrid}>
          {steps.map((step, index) => (
            <article className={styles.stepCard} key={step.title}>
              <span className={styles.stepNumber}>{index + 1}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </article>
          ))}
        </div>
        <p className={styles.footerNote}>
          Campaign preview only — checkout buttons are visual placeholders for
          AM-23.
        </p>
      </section>
    </main>
  );
}

