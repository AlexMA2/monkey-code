import React from 'react';
import { Settings2, Braces, AlignLeft, Type, Sparkles } from 'lucide-react';
import { IDEConfig } from '../hooks/useTypingTest';

interface IDEConfigPanelProps {
  config: IDEConfig;
  setConfig: React.Dispatch<React.SetStateAction<IDEConfig>>;
}

export default function IDEConfigPanel({ config, setConfig }: IDEConfigPanelProps) {
  const toggleBracket = () => {
    setConfig((prev) => ({ ...prev, autoCloseBrackets: !prev.autoCloseBrackets }));
  };

  const toggleIndent = () => {
    setConfig((prev) => ({ ...prev, autoIndent: !prev.autoIndent }));
  };

  const setFontSize = (size: number) => {
    setConfig((prev) => ({ ...prev, fontSize: size }));
  };

  const setCaretStyle = (style: IDEConfig['caretStyle']) => {
    setConfig((prev) => ({ ...prev, caretStyle: style }));
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 mt-8">
      <div className="bg-zinc-950/40 border border-zinc-800/80 rounded-2xl p-5 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4 border-b border-zinc-900 pb-3">
          <Settings2 className="w-4 h-4 text-accent" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            IDE Preferences (VS Code Simulator)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Autoclose brackets */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-zinc-500 flex items-center gap-1.5">
              <Braces className="w-3.5 h-3.5" /> Auto-Close Brackets
            </span>
            <button
              onClick={toggleBracket}
              className={`w-full py-2 px-3 rounded-lg text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                config.autoCloseBrackets
                  ? 'bg-correct/10 border-correct/40 text-correct'
                  : 'bg-zinc-900/50 border-zinc-800 text-zinc-400'
              }`}
            >
              {config.autoCloseBrackets ? 'Enabled ( ) [ ] { } " "' : 'Disabled'}
            </button>
          </div>

          {/* Smart indentation */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-zinc-500 flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5" /> Smart Indent
            </span>
            <button
              onClick={toggleIndent}
              className={`w-full py-2 px-3 rounded-lg text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                config.autoIndent
                  ? 'bg-correct/10 border-correct/40 text-correct'
                  : 'bg-zinc-900/50 border-zinc-800 text-zinc-400'
              }`}
            >
              {config.autoIndent ? 'Auto Jump Indents' : 'Type All Spaces'}
            </button>
          </div>

          {/* Font Size */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-zinc-500 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5" /> Font Size
            </span>
            <div className="flex bg-zinc-900/50 rounded-lg p-1 border border-zinc-800">
              {[14, 16, 18, 20].map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`flex-1 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    config.fontSize === size
                      ? 'bg-zinc-800 text-accent'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {size}px
                </button>
              ))}
            </div>
          </div>

          {/* Caret Style */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-zinc-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Cursor Style
            </span>
            <div className="flex bg-zinc-900/50 rounded-lg p-1 border border-zinc-800">
              {(['line', 'block', 'underline'] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => setCaretStyle(style)}
                  className={`flex-1 py-1 rounded-md text-xs font-bold capitalize transition-all cursor-pointer ${
                    config.caretStyle === style
                      ? 'bg-zinc-800 text-accent'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
