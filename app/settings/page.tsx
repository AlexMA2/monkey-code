'use client';

import React, { useState } from 'react';
import Sidebar, { SettingCategory } from '@components/Sidebar';
import CursorSettings from '@components/CursorSettings';
import FontSettings from '@components/FontSettings';
import CommonSettings from '@components/CommonSettings';

export default function Settings() {
  const [activeCategory, setActiveCategory] = useState<SettingCategory>('cursor');

  return (
    <main className="flex-1 flex flex-col justify-center py-6 relative z-10 animate-in fade-in duration-200">
      <div className="w-full max-w-5xl mx-auto px-4 py-8 flex-1 flex flex-col md:flex-row gap-8 min-h-[500px]">
        {/* Sidebar Navigation */}
        <Sidebar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

        {/* Settings Grid Content */}
        <div className="flex-1 overflow-y-auto max-h-[600px] ">
          {activeCategory === 'cursor' && <CursorSettings />}
          {activeCategory === 'font' && <FontSettings />}
          {activeCategory === 'common' && <CommonSettings />}
        </div>
      </div>
    </main>
  );
}
