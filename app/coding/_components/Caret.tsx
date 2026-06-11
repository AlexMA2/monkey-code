import React from 'react';
import { IDEConfig } from '@hooks/useTypingTest';

interface CaretProps {
  ideConfig: IDEConfig;
}

export default function Caret({ ideConfig }: CaretProps) {
  const style = ideConfig.cursorStyle;
  const blinking = ideConfig.cursorBlinking;
  const width = ideConfig.cursorWidth;
  
  let blinkClass = '';
  if (blinking === 'blink') blinkClass = 'animate-caret-blink';
  else if (blinking === 'smooth') blinkClass = 'animate-caret-smooth';
  else if (blinking === 'phase') blinkClass = 'animate-caret-phase';
  else if (blinking === 'expand') blinkClass = 'animate-caret-expand';
  
  const glideTransition: React.CSSProperties = ideConfig.cursorSmoothCaretAnimation === 'on' 
    ? { transition: 'left 0.08s ease-out, top 0.08s ease-out' }
    : {};

  const caretStyles: Record<string, React.CSSProperties> = {
    'line': { width: `${width}px`, height: '1.2em', top: '2px', ...glideTransition },
    'line-thin': { width: '1px', height: '1.2em', top: '2px', ...glideTransition },
    'block': { width: '8px', height: '1.2em', opacity: 0.5, zIndex: -10, top: '2px', ...glideTransition },
    'block-outline': { width: '8px', height: '1.2em', border: '1px solid var(--color-accent)', backgroundColor: 'transparent', zIndex: 10, top: '2px', ...glideTransition },
    'underline': { width: '8px', height: '3px', bottom: '0px', ...glideTransition },
    'underline-thin': { width: '8px', height: '1px', bottom: '0px', ...glideTransition },
  };

  const baseClass = `inline-block bg-accent absolute left-0 ${blinkClass}`;
  
  return (
    <span 
      className={baseClass} 
      style={caretStyles[style] || caretStyles['line']} 
    />
  );
}
