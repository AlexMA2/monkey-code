import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/_utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-accent text-background font-black hover:shadow-lg hover:shadow-accent/20 hover:scale-[1.02] active:scale-[0.98]',
        destructive:
          'bg-error text-white font-semibold hover:bg-error/90 hover:scale-[1.02] active:scale-[0.98]',
        outline:
          'border border-card-border bg-card-bg text-foreground hover:border-untyped/40 hover:bg-card-muted/50 hover:text-foreground',
        secondary:
          'bg-card-muted text-foreground border border-card-border hover:bg-card-border',
        ghost:
          'text-untyped hover:bg-card-muted hover:text-foreground border border-transparent',
        link: 'text-accent underline-offset-4 hover:underline',
        accentSubtle:
          'bg-accent/15 text-accent border border-accent/20 hover:bg-accent/25',
        correctSubtle:
          'bg-correct/10 border-correct/40 text-correct hover:bg-correct/15',
      },
      size: {
        default: 'h-9 px-4 py-2 text-sm',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8 text-sm',
        xl: 'px-8 py-4 text-sm font-black rounded-2xl',
        icon: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
