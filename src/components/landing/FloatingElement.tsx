
import { LucideIcon } from 'lucide-react';

interface FloatingElementProps {
  icon: LucideIcon;
  className?: string;
  delay?: number;
}

export function FloatingElement({ icon: Icon, className = "", delay = 0 }: FloatingElementProps) {
  return (
    <div 
      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/90 backdrop-blur-sm shadow-xl flex items-center justify-center animate-bounce hover:scale-110 transition-transform duration-300 ${className}`}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: '3s',
        animationIterationCount: 'infinite'
      }}
    >
      <Icon className="w-8 h-8 sm:w-10 sm:h-10" />
    </div>
  );
}
