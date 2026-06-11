'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, Type, Sliders, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@components/ui/button';

export type SettingCategory = 'cursor' | 'font' | 'common';

interface SidebarProps {
  activeCategory: SettingCategory;
  setActiveCategory: (category: SettingCategory) => void;
}

export default function Sidebar({ activeCategory, setActiveCategory }: SidebarProps) {
  const categories: { val: SettingCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { val: 'common', label: 'Commonly Used', icon: Sliders },
    { val: 'cursor', label: 'Cursor Settings', icon: Sparkles },
    { val: 'font', label: 'Font & Layout', icon: Type },
  ];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll);
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      ro.disconnect();
    };
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -120 : 120, behavior: 'smooth' });
  };

  return (
    <div className="w-full md:w-64 shrink-0 flex flex-col gap-2 border-b md:border-b-0 md:border-r border-card-border pb-4 md:pb-0 md:pr-4">
      {/* Mobile: horizontal scrollable tabs with arrow controls */}
      <div className="flex md:hidden items-center gap-1 w-full">
        {/* Left arrow */}
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
          className={`shrink-0 p-1.5 rounded-lg border border-card-border bg-card-bg text-foreground/70 transition-all duration-150
            ${canScrollLeft ? 'opacity-100 hover:text-accent hover:border-accent/40' : 'opacity-20 cursor-default'}`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable tabs */}
        <div
          ref={scrollRef}
          className="flex-1 flex flex-row gap-2 overflow-x-auto scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.val;
            return (
              <Button
                key={cat.val}
                onClick={() => setActiveCategory(cat.val)}
                variant={isActive ? 'accentSubtle' : 'ghost'}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap shrink-0 h-auto"
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          aria-label="Scroll right"
          className={`shrink-0 p-1.5 rounded-lg border border-card-border bg-card-bg text-foreground/70 transition-all duration-150
            ${canScrollRight ? 'opacity-100 hover:text-accent hover:border-accent/40' : 'opacity-20 cursor-default'}`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Desktop: vertical tabs */}
      <div className="hidden md:flex flex-col gap-2">
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
    </div>
  );
}
