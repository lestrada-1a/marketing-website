import styles from './HowItWorksSection.module.css';

interface Step {
  number: number;
  icon: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: 1,
    icon: '🛒',
    title: 'Pick Your Kits',
    description: 'Browse our family-friendly menu and choose the meal kits that work for your week.',
  },
  {
    number: 2,
    icon: '🚚',
    title: 'We Deliver',
    description: 'Fresh ingredients delivered right to your door, packed with care and ready to cook.',
  },
  {
    number: 3,
    icon: '🍽️',
    title: 'Cook & Enjoy',
    description: 'Follow our simple recipe cards and have a delicious dinner on the table in minutes.',
  },
];

export default function HowItWorksSection() {
  return (
    <section className={styles.howItWorks}>
      <div className={styles.container}>
        <h2 className={styles.title}>How It Works</h2>

        <div className={styles.stepsContainer}>
          {steps.map((step, index) => (
            <div key={step.number} className={styles.step}>
              <div className={styles.stepNumber}>{step.number}</div>
              <div className={styles.stepIcon}>{step.icon}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
              {index < steps.length - 1 && <div className={styles.connector} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
