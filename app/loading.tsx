import { Terminal } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[350px] relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col items-center gap-6 z-10">
        {/* Animated Icon Container */}
        <div className="relative">
          {/* Outer glowing border ring */}
          <div className="absolute inset-0 rounded-2xl border border-accent/30 animate-ping opacity-75" />
          
          <div className="bg-card-bg p-4 rounded-2xl border border-card-border shadow-xl relative animate-pulse flex items-center justify-center">
            <Terminal className="w-8 h-8 text-accent animate-bounce" />
          </div>
        </div>

        {/* Text Logo */}
        <div className="flex flex-col items-center gap-1.5">
          <h2 className="text-xl font-bold tracking-wider text-foreground flex items-center gap-1">
            monkey<span className="text-accent">code</span>
            <span className="inline-block w-1.5 h-5 bg-accent animate-caret-blink" />
          </h2>
          <p className="text-xs text-untyped tracking-widest uppercase animate-pulse">
            Loading Environment...
          </p>
        </div>

        {/* Loading progress bar indicator */}
        <div className="w-48 h-1 bg-card-border rounded-full overflow-hidden mt-2">
          <div className="h-full bg-accent animate-[loading-bar_1.5s_infinite_ease-in-out] w-1/3 rounded-full" />
        </div>
      </div>
    </div>
  );
}
