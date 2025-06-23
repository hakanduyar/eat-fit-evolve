
import { LucideIcon } from 'lucide-react';

interface FloatingElementProps {
  icon: LucideIcon;
  className?: string;
  delay?: number;
}

export function FloatingElement({ icon: Icon, className = "", delay = 0 }: FloatingElementProps) {
  return (
    <div 
      className={`w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-white/90 backdrop-blur-sm shadow-xl flex items-center justify-center animate-bounce hover:scale-110 transition-transform duration-300 z-0 ${className}`}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: '3s',
        animationIterationCount: 'infinite'
      }}
    >
      <Icon className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
    </div>
  );
}
