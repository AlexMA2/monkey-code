import React from 'react';
import { PASSWORD_REQUIREMENTS } from '../constants';

interface PasswordRequirementsProps {
  password: string;
}

export default function PasswordRequirements({ password }: PasswordRequirementsProps) {
  if (password.length === 0) return null;

  return (
    <div className="text-xs space-y-1 bg-card-muted/30 border border-card-border/50 rounded-xl p-3 mt-1 transition-all duration-300">
      <p className="text-[10px] uppercase font-semibold text-untyped tracking-wider mb-1.5">
        Password Requirements
      </p>
      {PASSWORD_REQUIREMENTS.map((req) => {
        const met = req.test(password);
        return (
          <div key={req.id} className="flex items-center gap-2">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                met ? 'bg-correct' : 'bg-untyped/40'
              }`}
            />
            <span className={met ? 'text-correct font-medium' : 'text-untyped/70'}>
              {req.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
