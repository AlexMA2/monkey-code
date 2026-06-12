'use client';

import { Button } from '@components/ui/button';
import { setPageLoading } from '@store/configSlice';
import { useAppDispatch } from '@store/hooks';
import { Settings, Terminal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { targetText, typingTimeline } from './constants';
import { ROUTES } from '@/_constants/routes';

export default function HeroSection() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [timelineIndex, setTimelineIndex] = useState(0);

  useEffect(() => {
    const currentStep = typingTimeline[timelineIndex];
    const timer = setTimeout(() => {
      setTimelineIndex((prev) => (prev + 1) % typingTimeline.length);
    }, currentStep.delay);
    return () => clearTimeout(timer);
  }, [timelineIndex]);

  const currentTyped = typingTimeline[timelineIndex].text;

  const handleNavigation = (path: string) => {
    let targetPath = path;
    if (path === ROUTES.SETTINGS) {
      const savedTab = typeof window !== "undefined" ? localStorage.getItem("last_settings_tab") : null;
      if (savedTab) {
        targetPath = `${ROUTES.SETTINGS}?tab=${savedTab}`;
      }
    }
    dispatch(setPageLoading(true));
    router.push(targetPath);
  };

  return (
    <div className="lg:col-span-7 flex flex-col gap-6 text-left">
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
        Improve Your <br />
        <span className="inline-block relative text-accent">
          {targetText.split("").map((char, idx) => {
            const typedChar = currentTyped[idx];
            const isCurrent = idx === currentTyped.length;
            const isLastChar = idx === targetText.length - 1;
            const isFinished = currentTyped.length === targetText.length;

            let charClass = "text-accent/20";
            let displayChar = char;

            if (idx < currentTyped.length) {
              if (typedChar === char) {
                charClass = "text-accent font-black transition-colors duration-100";
              } else {
                charClass = "text-error bg-error-dim border-b-2 border-error font-black transition-all duration-75";
                displayChar = typedChar;
              }
            }

            return (
              <span key={idx} className={`relative ${charClass}`}>
                {isCurrent && (
                  <span className="absolute w-[3px] h-[1.15em] bg-accent top-0.5 -left-[1.5px] animate-caret-blink" />
                )}
                {isLastChar && isFinished && (
                  <span className="absolute w-[3px] h-[1.15em] bg-accent top-0.5 left-full ml-0.5 animate-caret-blink" />
                )}
                {displayChar}
              </span>
            );
          })}
        </span>
      </h2>

      <p className="text-sm md:text-base text-untyped leading-relaxed max-w-lg">
        Monkeycode is a minimalist, developer-focused typing test simulator. Practice typing real syntax blocks, handle indentations, auto-closing brackets, and track your precise CPM & WPM speed.
      </p>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-4">
        <Button
          onClick={() => handleNavigation(ROUTES.CODING)}
          variant="default"
          size="xl"
          className="group relative flex items-center justify-center gap-3"
        >
          <span>Start Typing Test</span>
          <Terminal className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Button>

        <Button
          onClick={() => handleNavigation(ROUTES.SETTINGS)}
          variant="outline"
          className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl font-bold text-sm text-untyped hover:text-foreground h-auto"
        >
          <Settings className="w-4 h-4" />
          <span>Configure IDE</span>
        </Button>
      </div>
    </div>
  );
}
