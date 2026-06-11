'use client';

import React from 'react';
import { setPageLoading } from '@/_store/configSlice';
import { useAppDispatch } from '@/_store/hooks';
import { Award, Code, Keyboard, Settings, Terminal } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleNavigation = (path: string) => {
    console.log("🚀 ~ handleNavigation ~ path:", path);
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
            <span className="text-accent bg-clip-text bg-gradient-to-r from-accent to-accent/80">
              Code Typing Speed
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
