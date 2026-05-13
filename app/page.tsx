import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>Seasonal campaign</p>
        <h1 className={styles.title}>Back-to-school meal kits are live.</h1>
        <p className={styles.description}>
          Explore the campaign landing page built for busy families who need
          quick, stress-free weeknight dinners.
        </p>
        <Link className={styles.link} href="/meal-kits/back-to-school">
          View AM-23 landing page
        </Link>
      </section>
    </main>
  );
}

