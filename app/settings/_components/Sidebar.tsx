'use client';

import React from 'react';
import { Sparkles, Type, Sliders } from 'lucide-react';

export type SettingCategory = 'cursor' | 'font' | 'common';

interface SidebarProps {
  activeCategory: SettingCategory;
  setActiveCategory: (category: SettingCategory) => void;
}

export default function Sidebar({ activeCategory, setActiveCategory }: SidebarProps) {
  const categories: { val: SettingCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { val: 'cursor', label: 'Cursor Settings', icon: Sparkles },
    { val: 'font', label: 'Font & Layout', icon: Type },
    { val: 'common', label: 'Commonly Used', icon: Sliders },
  ];

  return (
    <div className="w-full md:w-64 flex flex-row md:flex-col gap-2 border-b md:border-b-0 md:border-r border-card-border pb-4 md:pb-0 md:pr-4">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = activeCategory === cat.val;
        return (
          <button
            key={cat.val}
            onClick={() => setActiveCategory(cat.val)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer text-left ${
              isActive
                ? 'bg-accent/10 text-accent border border-accent/25'
                : 'text-untyped hover:bg-card-muted hover:text-foreground border border-transparent'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
