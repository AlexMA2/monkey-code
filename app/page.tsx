import FeatureCards from './_components/home/FeatureCards';
import HeroSection from './_components/home/HeroSection';

export default function Home() {
  return (
    <main className="flex-1 flex flex-col justify-center py-12 px-6 max-w-5xl mx-auto w-full relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <HeroSection />
        <FeatureCards />
      </div>
    </main>
  );
}
