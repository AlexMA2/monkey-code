import React from 'react';
import {
  Select as RadixSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface SelectOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  labelPrefix?: string;
  className?: string;
}

export default function Select({
  value,
  onChange,
  options,
  placeholder,
  labelPrefix,
  className = 'w-44',
}: SelectProps) {
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={className}>
      <RadixSelect value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          {selectedOption?.icon && (
            <selectedOption.icon className="w-4 h-4 text-untyped flex-shrink-0" />
          )}
          <span className="truncate text-left flex items-center">
            {labelPrefix && (
              <span className="text-untyped mr-1">{labelPrefix}</span>
            )}
            <SelectValue placeholder={placeholder} />
          </span>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              icon={option.icon}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </RadixSelect>
    </div>
  );
}
