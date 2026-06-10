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
        className="flex h-9 w-44 items-center justify-between rounded-lg border border-card-border bg-card-bg px-3 py-2 text-sm text-foreground shadow-sm hover:bg-card-muted/50 focus:outline-none focus:ring-1 focus:ring-accent transition-all cursor-pointer"
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption?.icon && <selectedOption.icon className="w-4 h-4 text-untyped" />}
          <span className="truncate">
            {labelPrefix && <span className="text-untyped mr-1">{labelPrefix}</span>}
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <ChevronDown className={`h-4 w-4 text-untyped transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 z-[100] mt-1 min-w-[11rem] w-full origin-top-right rounded-lg border border-card-border bg-card-bg p-1 text-foreground shadow-md focus:outline-none animate-in fade-in-50 zoom-in-95 duration-100 backdrop-blur-md">
          <div className="py-1">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`relative flex w-full cursor-pointer select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm text-left outline-none transition-colors ${
                    isSelected
                      ? 'bg-card-muted text-foreground font-semibold border-l-2 border-accent'
                      : 'text-untyped hover:bg-card-muted/60 hover:text-foreground'
                  }`}
                >
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    {isSelected && <Check className="h-4 w-4 text-accent" />}
                  </span>
                  <span className="flex items-center gap-2 truncate">
                    {option.icon && <option.icon className="w-4 h-4 text-untyped" />}
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
