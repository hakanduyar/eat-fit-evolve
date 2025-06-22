
import { LucideIcon } from 'lucide-react';

interface FloatingElementProps {
  icon: LucideIcon;
  className?: string;
  delay?: number;
}

export function FloatingElement({ icon: Icon, className = "", delay = 0 }: FloatingElementProps) {
  return (
    <div 
      className={`w-12 h-12 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center animate-bounce ${className}`}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: '3s'
      }}
    >
      <Icon className="w-6 h-6" />
    </div>
  );
}
