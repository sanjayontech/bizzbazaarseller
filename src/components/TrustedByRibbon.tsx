import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

interface TrustedByRibbonProps {
  className?: string;
  speed?: number;
  pauseOnHover?: boolean;
}

const ITEMS = [
  'Local Store Owners',
  'Chennai Retailers',
  'Small Business Community',
  'Neighborhood Shops',
  'Family Businesses',
  'Local Entrepreneurs',
  'Community Markets',
  'Regional Sellers',
  'Trusted Vendors',
  'Local Commerce',
  'Nearby Businesses',
  'Community Partners',
];

// Each item is ~200px text + 64px separator gap = 264px
const ITEM_WIDTH_PX = 264;

const TrustedByRibbon: React.FC<TrustedByRibbonProps> = ({
  className = '',
  speed = 50,
  pauseOnHover = true,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const duplicated = [...ITEMS, ...ITEMS];
  const duration = (ITEMS.length * ITEM_WIDTH_PX) / speed;
  const shouldAnimate = isVisible && !shouldReduceMotion;

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-gradient-to-r from-primary/5 via-primary/3 to-primary/5 border-y border-primary/10 ${className}`}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <div className="absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />

      <div className="relative py-3 sm:py-4 overflow-hidden">
        <div
          className={`flex items-center whitespace-nowrap ${shouldAnimate ? 'animate-marquee' : ''} ${isPaused ? 'animate-marquee-paused' : ''}`}
          style={{ animationDuration: `${duration}s` }}
        >
          {duplicated.map((item, index) => (
            <React.Fragment key={`${item}-${index}`}>
              <span className="text-sm sm:text-base font-medium text-foreground/80 tracking-wide">
                Trusted by {item}
              </span>
              <div className="mx-6 sm:mx-8 flex items-center space-x-2">
                <div className="w-1 h-1 bg-primary/40 rounded-full" />
                <div className="w-1.5 h-1.5 bg-primary/60 rounded-full" />
                <div className="w-1 h-1 bg-primary/40 rounded-full" />
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {!shouldReduceMotion && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
          style={{ width: '200%', left: '-100%', animation: 'ribbon-shine 3s ease-in-out infinite' }}
        />
      )}

      <div className="sr-only">
        Trusted by local businesses and community partners in Chennai and nearby areas
      </div>
    </div>
  );
};

export default TrustedByRibbon;
