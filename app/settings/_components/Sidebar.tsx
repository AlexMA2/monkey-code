'use client';

import React from 'react';
import { Sparkles, Type, Sliders } from 'lucide-react';
import { Button } from '@components/ui/button';

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
          <Button
            key={cat.val}
            onClick={() => setActiveCategory(cat.val)}
            variant={isActive ? 'accentSubtle' : 'ghost'}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold justify-start w-full h-auto"
          >
            <Icon className="w-4 h-4" />
            <span>{cat.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
