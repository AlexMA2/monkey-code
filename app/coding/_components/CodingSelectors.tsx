import Select from '@components/Select';
import { Clock, Code, Layers, Sparkles } from "lucide-react";
import { ProgrammingLanguage, TypingMode } from "../_utils/codeSnippets";

// Local component for selectors (Language, Mode, Time Limit)
interface CodingSelectorsProps {
  language: ProgrammingLanguage;
  setLanguage: (lang: ProgrammingLanguage) => void;
  mode: TypingMode;
  setMode: (m: TypingMode) => void;
  timeLimit: number | null;
  setTimeLimit: (t: number | null) => void;
}

export default function CodingSelectors({
  language,
  setLanguage,
  mode,
  setMode,
  timeLimit,
  setTimeLimit,
}: CodingSelectorsProps) {
  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'rust', label: 'Rust' },
    { value: 'cpp', label: 'C++' },
    { value: 'go', label: 'Go' },
    { value: 'htmlcss', label: 'HTML/CSS' },
  ];

  const modeOptions = [
    { value: 'snippets', label: 'Snippets', icon: Code },
    { value: 'structures', label: 'Data Structures', icon: Layers },
    { value: 'chaos', label: 'Chaos Mode', icon: Sparkles },
  ];

  const times = [15, 30, 60];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 mb-6">
      <div className="flex flex-wrap gap-4 items-center justify-between bg-card-bg border border-card-border rounded-2xl p-4 backdrop-blur-md">
        {/* Dropdown Selectors */}
        <div className="flex flex-wrap flex-row items-center gap-4">
          <Select
            value={language}
            onChange={(val) => setLanguage(val as ProgrammingLanguage)}
            options={languageOptions}
            labelPrefix="Language:"
            className="w-52"
          />

          <Select
            value={mode}
            onChange={(val) => setMode(val as TypingMode)}
            options={modeOptions}
            labelPrefix="Mode:"
            className="w-52"
          />
        </div>

        {/* Times selector */}
        <div className="flex items-center gap-3 bg-card-bg border border-card-border px-3 py-1.5 rounded-lg">
          <Clock className="w-4 h-4 text-untyped" />
          <div className="flex gap-1.5">
            {times.map((t) => (
              <button
                key={t}
                onClick={() => setTimeLimit(t)}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all duration-200 cursor-pointer ${
                  timeLimit === t
                    ? 'bg-accent/15 border border-accent/30 text-accent'
                    : 'text-untyped border border-transparent hover:text-foreground'
                }`}
              >
                {t}s
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}