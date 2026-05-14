import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import TrustedByItem from './TrustedByItem';

interface TrustedByItem {
  id: string;
  src: string;
  alt: string;
  name?: string;
  title?: string;
  quote?: string;
  href?: string;
}

interface TrustedByMarqueeProps {
  items: TrustedByItem[];
  speed?: number; // px per second
  rowCount?: 1 | 2;
  direction?: 'ltr' | 'rtl';
  density?: 'compact' | 'comfortable';
  pauseOnHover?: boolean;
  className?: string;
}

// Approximate card width in px (testimonial ~280px + gap ~24px)
const CARD_WIDTH_PX = 304;

const TrustedByMarquee: React.FC<TrustedByMarqueeProps> = ({
  items,
  speed = 40,
  rowCount = 1,
  direction = 'ltr',
  density = 'comfortable',
  pauseOnHover = true,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
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

  // Pause when tab is hidden
  useEffect(() => {
    const onVisibility = () => setIsPaused(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const gap = density === 'compact' ? 'gap-3 sm:gap-4' : 'gap-4 sm:gap-6';
  const shouldAnimate = isVisible && !shouldReduceMotion;

  const getRowItems = (rowIndex: number) =>
    rowCount === 1 ? items : items.filter((_, i) => i % 2 === rowIndex);

  const renderRow = (rowIndex: number) => {
    const rowItems = getRowItems(rowIndex);
    if (!rowItems.length) return null;

    // Duplicate for seamless CSS loop (-50% = one full set)
    const duplicated = [...rowItems, ...rowItems];
    const duration = (rowItems.length * CARD_WIDTH_PX) / speed;
    const animClass = direction === 'ltr' ? 'animate-marquee' : 'animate-marquee-rtl';

    return (
      <div className="relative overflow-hidden" key={`row-${rowIndex}`}>
        <div className="absolute inset-y-0 left-0 w-6 sm:w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-6 sm:w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div
          className={`flex ${gap} py-2 ${shouldAnimate ? animClass : ''} ${isPaused ? 'animate-marquee-paused' : ''}`}
          style={{ animationDuration: `${duration}s` }}
        >
          {duplicated.map((item, index) => (
            <TrustedByItem key={`${item.id}-${index}`} {...item} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <section
      ref={containerRef}
      className={`w-full ${className}`}
      aria-labelledby="trustedby-heading"
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <div className="text-center mb-6 sm:mb-8">
        <h2
          id="trustedby-heading"
          className="text-lg sm:text-xl font-semibold text-foreground mb-2"
        >
          Trusted by people near you
        </h2>
        <p className="text-sm text-muted-foreground">Real sellers from Chennai & nearby</p>
        <div className="sr-only">Trusted by {items.length}+ local sellers and early users</div>
      </div>

      <div className="space-y-2 sm:space-y-4">
        {renderRow(0)}
        {rowCount === 2 && (
          <div className="hidden md:block">{renderRow(1)}</div>
        )}
      </div>
    </section>
  );
};

export default TrustedByMarquee;
