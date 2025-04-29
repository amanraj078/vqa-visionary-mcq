
import React from 'react';
import { PageTransition } from '@/components/layout/PageTransition';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { Features } from '@/components/home/Features';
import { HowItWorks } from '@/components/home/HowItWorks';
import { Testimonials } from '@/components/home/Testimonials';

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen">
        <Navbar />
        <main>
          <Hero />
          <Features />
          <HowItWorks />
          <Testimonials />
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
