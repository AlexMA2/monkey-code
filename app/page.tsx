import Image from 'next/image';
import HeroSection from './_components/home/HeroSection';

export default function Home() {
  return (
    <main className="flex-1 flex flex-col justify-center py-12 px-6 max-w-5xl mx-auto w-full relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <HeroSection />
        {/* Animated Icon */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <Image
            src="/logo-v2.png"
            alt="MonkeyCode Logo"
            width={350}
            height={350}
            className="w-full max-w-[300px] lg:max-w-full h-auto object-contain "
            priority
          />
        </div>

      </div>
    </main>
  );
}
