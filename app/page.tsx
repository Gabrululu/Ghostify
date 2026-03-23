import NavBar from '@/components/ui/NavBar';
import Footer from '@/components/ui/Footer';
import Hero from '@/components/landing/Hero';
import Ticker from '@/components/landing/Ticker';
import HowItWorks from '@/components/landing/HowItWorks';
import StackGrid from '@/components/landing/StackGrid';
import BigQuote from '@/components/landing/BigQuote';

export default function LandingPage() {
  return (
    <main style={{ backgroundColor: '#04060f', minHeight: '100vh' }}>
      <NavBar />
      <Hero />
      <Ticker />
      <HowItWorks />
      <StackGrid />
      <BigQuote />
      <Footer />
    </main>
  );
}
