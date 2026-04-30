import type { Metadata } from 'next';
import HeroSection from '@/components/back-to-school/HeroSection';
import BenefitsSection from '@/components/back-to-school/BenefitsSection';
import FeaturedKitsSection from '@/components/back-to-school/FeaturedKitsSection';
import HowItWorksSection from '@/components/back-to-school/HowItWorksSection';
import CTASection from '@/components/back-to-school/CTASection';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Back-to-School Meal Kits | Quick & Easy Dinners for Busy Families',
  description: 'Stress-free dinners ready in 20 minutes or less. Kid-approved meal kits with everything included. Perfect for busy school nights.',
};

export default function BackToSchoolPage() {
  return (
    <main className={styles.container}>
      <HeroSection />
      <BenefitsSection />
      <FeaturedKitsSection />
      <HowItWorksSection />
      <CTASection />
    </main>
  );
}
