'use client';

import { Button } from '@components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@components/ui/dialog';
import { RotateCcw } from 'lucide-react';
import { useState } from 'react';

interface ResetConfirmDialogProps {
  sectionName: string;
  onConfirm: () => void;
}

export default function ResetConfirmDialog({ sectionName, onConfirm }: ResetConfirmDialogProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-xs font-semibold px-3 py-1.5 h-auto hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all duration-200 gap-1.5"
        >
          <RotateCcw className="w-3 h-3" />
          Reset to Default
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-destructive" />
            Reset {sectionName}?
          </DialogTitle>
          <DialogDescription>
            This will restore all <span className="font-semibold text-foreground">{sectionName}</span> settings back to their default values. Any custom changes you made will be lost.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="text-sm"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            className="text-sm font-semibold gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Yes, Reset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
