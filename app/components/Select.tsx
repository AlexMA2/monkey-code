import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface SelectProps {
  value: string;
  onChange: (value: any) => void;
  options: SelectOption[];
  placeholder?: string;
  labelPrefix?: string;
}

export default function Select({ value, onChange, options, placeholder, labelPrefix }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-44 items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-300 shadow-sm hover:bg-zinc-900/50 focus:outline-none focus:ring-1 focus:ring-accent transition-all cursor-pointer"
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption?.icon && <selectedOption.icon className="w-4 h-4 text-zinc-400" />}
          <span className="truncate">
            {labelPrefix && <span className="text-zinc-500 mr-1">{labelPrefix}</span>}
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <ChevronDown className={`h-4 w-4 text-zinc-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-1 min-w-[11rem] w-full origin-top-right rounded-lg border border-zinc-800 bg-zinc-950 p-1 text-zinc-300 shadow-md focus:outline-none animate-in fade-in-50 zoom-in-95 duration-100">
          <div className="py-1">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`relative flex w-full cursor-pointer select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm text-left outline-none transition-colors ${
                    isSelected
                      ? 'bg-zinc-900 text-white font-medium'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
                  }`}
                >
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    {isSelected && <Check className="h-4 w-4 text-accent" />}
                  </span>
                  <span className="flex items-center gap-2 truncate">
                    {option.icon && <option.icon className="w-4 h-4 text-zinc-400" />}
                    <span>{option.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
