'use client';

import styles from './FeaturedKitsSection.module.css';

interface MealKit {
  id: string;
  name: string;
  prepTime: number;
  servings: number;
  price: number;
  description: string;
  emoji: string;
  color: string;
}

const mealKits: MealKit[] = [
  {
    id: 'taco-tuesday',
    name: 'Taco Tuesday Kit',
    prepTime: 15,
    servings: 4,
    price: 24.99,
    description: 'Build-your-own tacos with seasoned ground beef, fresh toppings, and all the fixings your family will love.',
    emoji: '🌮',
    color: '#FFB347',
  },
  {
    id: 'pasta-night',
    name: 'Pasta Night Kit',
    prepTime: 20,
    servings: 4,
    price: 22.99,
    description: 'Creamy pasta with a delicious sauce, tender vegetables, and a touch of parmesan cheese for the perfect comfort meal.',
    emoji: '🍝',
    color: '#FFB6C1',
  },
  {
    id: 'stir-fry-express',
    name: 'Stir-Fry Express Kit',
    prepTime: 15,
    servings: 4,
    price: 23.99,
    description: 'Colorful veggie stir-fry with your choice of protein, served over fluffy rice with a savory sauce.',
    emoji: '🥢',
    color: '#90EE90',
  },
  {
    id: 'mac-cheese',
    name: 'Homestyle Mac & Cheese Kit',
    prepTime: 20,
    servings: 4,
    price: 19.99,
    description: 'Creamy, dreamy mac and cheese made with real cheese sauce. A classic that kids and adults both adore.',
    emoji: '🧀',
    color: '#FFD700',
  },
];

export default function FeaturedKitsSection() {
  const handleAddToKit = (kitName: string) => {
    alert(`${kitName} added to cart! This is a UI placeholder.`);
  };

  return (
    <section id="featured-kits" className={styles.featured}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Featured Meal Kits</h2>
          <p className={styles.subtitle}>Choose from our most popular family-friendly options</p>
        </div>

        <div className={styles.grid}>
          {mealKits.map((kit) => (
            <div key={kit.id} className={styles.card}>
              <div
                className={styles.imageArea}
                style={{ backgroundColor: kit.color }}
              >
                <span className={styles.emoji}>{kit.emoji}</span>
              </div>

              <div className={styles.content}>
                <h3 className={styles.kitName}>{kit.name}</h3>

                <div className={styles.badges}>
                  <span className={styles.badge}>⏱️ {kit.prepTime} min</span>
                  <span className={styles.badge}>👥 Serves {kit.servings}</span>
                </div>

                <p className={styles.description}>{kit.description}</p>

                <div className={styles.footer}>
                  <span className={styles.price}>${kit.price.toFixed(2)}</span>
                  <button
                    className={styles.addButton}
                    onClick={() => handleAddToKit(kit.name)}
                  >
                    Add to Kit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
