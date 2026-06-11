'use client';

import React, { useEffect, useState } from 'react';
import { setPageLoading } from '@store/configSlice';
import { useAppDispatch } from '@store/hooks';
import { Award, Code, Keyboard, Settings, Terminal } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const targetText = "Code Typing Speed";
  const typingTimeline = [
    { text: "", delay: 1000 },
    { text: "C", delay: 180 },
    { text: "Co", delay: 150 },
    { text: "Cod", delay: 120 },
    { text: "Code", delay: 160 },
    { text: "Code ", delay: 200 },
    { text: "Code T", delay: 220 },
    { text: "Code Ty", delay: 140 },
    { text: "Code Typ", delay: 130 },
    { text: "Code Typo", delay: 500 }, // Error state!
    { text: "Code Typ", delay: 200 },  // Backspace
    { text: "Code Typi", delay: 250 }, // Corrected type
    { text: "Code Typin", delay: 140 },
    { text: "Code Typing", delay: 160 },
    { text: "Code Typing ", delay: 185 },
    { text: "Code Typing S", delay: 220 },
    { text: "Code Typing Sp", delay: 130 },
    { text: "Code Typing Spe", delay: 120 },
    { text: "Code Typing Spee", delay: 150 },
    { text: "Code Typing Speed", delay: 3500 }, // Hold complete state
  ];

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
    dispatch(setPageLoading(true));
    router.push(path);
  };

  return (
    <main className="flex-1 flex flex-col justify-center py-12 px-6 max-w-5xl mx-auto w-full relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Welcome & CTA */}
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
            <button
              onClick={() => handleNavigation('/coding')}
              className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-accent text-background font-black text-sm rounded-2xl hover:shadow-lg hover:shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
            >
              <span>Start Typing Test</span>
              <Terminal className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            
            <button
              onClick={() => handleNavigation('/settings')}
              className="flex items-center justify-center gap-2.5 px-6 py-4 bg-card-bg border border-card-border hover:border-untyped/40 rounded-2xl font-bold text-sm text-untyped hover:text-foreground hover:bg-card-muted/50 transition-all cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              <span>Configure IDE</span>
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Card Display */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Syntactic */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-5 hover:border-accent/40 transition-all duration-300 group">
            <div className="bg-accent/10 w-9 h-9 rounded-xl flex items-center justify-center border border-accent/20 text-accent mb-4 group-hover:scale-110 transition-transform">
              <Code className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground mb-1.5">Syntactic Accuracy</h3>
            <p className="text-xs text-untyped leading-relaxed">
              Type loops, definitions, classes, and logic rather than plain dictionary sentences.
            </p>
          </div>

          {/* Card 2: Custom Themes */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-5 hover:border-accent/40 transition-all duration-300 group">
            <div className="bg-accent/10 w-9 h-9 rounded-xl flex items-center justify-center border border-accent/20 text-accent mb-4 group-hover:scale-110 transition-transform">
              <Settings className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground mb-1.5">IDE Customization</h3>
            <p className="text-xs text-untyped leading-relaxed">
              Tweak fonts, caret style, blinking speed, tab sizes, and auto-closing triggers.
            </p>
          </div>

          {/* Card 3: Realtime Charts */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-5 hover:border-accent/40 transition-all duration-300 group">
            <div className="bg-accent/10 w-9 h-9 rounded-xl flex items-center justify-center border border-accent/20 text-accent mb-4 group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground mb-1.5">Performance Telemetry</h3>
            <p className="text-xs text-untyped leading-relaxed">
              Analyze live timelines displaying speed drops and error spikes in real-time.
            </p>
          </div>

          {/* Card 4: Shortcuts */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-5 hover:border-accent/40 transition-all duration-300 group">
            <div className="bg-accent/10 w-9 h-9 rounded-xl flex items-center justify-center border border-accent/20 text-accent mb-4 group-hover:scale-110 transition-transform">
              <Keyboard className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground mb-1.5">Quick Restart</h3>
            <p className="text-xs text-untyped leading-relaxed">
              Press <kbd className="px-1 bg-card-muted text-foreground/80 rounded border border-card-border text-[10px]">Tab</kbd> + <kbd className="px-1 bg-card-muted text-foreground/80 rounded border border-card-border text-[10px]">Enter</kbd> to restart typing instantly.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
