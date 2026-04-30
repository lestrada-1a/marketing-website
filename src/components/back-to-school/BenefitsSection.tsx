import styles from './BenefitsSection.module.css';

interface BenefitCard {
  icon: string;
  title: string;
  description: string;
}

const benefits: BenefitCard[] = [
  {
    icon: '⏱️',
    title: 'Ready in 20 Minutes',
    description: 'Our meal kits are designed for busy weeknights. From opening the box to plating dinner, everything is ready in 20 minutes or less.',
  },
  {
    icon: '👨‍👩‍👧‍👦',
    title: 'Kid-Approved Recipes',
    description: 'Every recipe is tested and loved by kids. No more mealtime battles — just happy, well-fed families around the dinner table.',
  },
  {
    icon: '📦',
    title: 'Everything Included',
    description: 'Pre-portioned ingredients, easy-to-follow recipe cards, and all the seasonings you need. Just open, cook, and enjoy.',
  },
];

export default function BenefitsSection() {
  return (
    <section className={styles.benefits}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {benefits.map((benefit, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.icon}>{benefit.icon}</div>
              <h3 className={styles.title}>{benefit.title}</h3>
              <p className={styles.description}>{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
