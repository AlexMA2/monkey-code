import { Award, Code, Keyboard, Settings } from 'lucide-react';

export default function FeatureCards() {
  return (
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
  );
}
