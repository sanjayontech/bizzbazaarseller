import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

interface AnimatedGradientBackgroundProps {
    className?: string;
    variant?: 'aurora' | 'mesh' | 'radial';
    intensity?: 'subtle' | 'medium' | 'vibrant';
    interactive?: boolean;
}

export const AnimatedGradientBackground = ({
    className = '',
    variant = 'aurora',
    intensity = 'medium',
    interactive: _interactive = true,
}: AnimatedGradientBackgroundProps) => {
    const shouldReduceMotion = useReducedMotion();

    const intensityOpacity = {
        subtle: 0.15,
        medium: 0.25,
        vibrant: 0.4,
    };

    const blobOpacity = intensityOpacity[intensity];

    return (
        <div
            className={`absolute inset-0 overflow-hidden ${className}`}
            style={{ zIndex: -1 }}
        >
            {/* Base gradient */}
            <div
                className="absolute inset-0"
                style={{
                    background: `linear-gradient(135deg,
                        hsl(266 64% 98%) 0%,
                        hsl(266 30% 96%) 50%,
                        hsl(145 20% 97%) 100%
                    )`,
                }}
            />

            {variant === 'aurora' && !shouldReduceMotion && (
                <>
                    {/* Primary aurora blob - Purple */}
                    <div
                        className="absolute rounded-full bg-aurora-blob-primary"
                        style={{
                            width: '60%',
                            height: '60%',
                            left: '10%',
                            top: '10%',
                            background: `radial-gradient(circle, hsl(266 64% 55% / ${blobOpacity}) 0%, transparent 70%)`,
                            filter: 'blur(60px)',
                            animation: 'aurora-blob-1 15s ease-in-out infinite',
                            willChange: 'transform',
                        }}
                    />

                    {/* Secondary aurora blob - Teal */}
                    <div
                        className="absolute rounded-full"
                        style={{
                            width: '50%',
                            height: '50%',
                            right: '5%',
                            bottom: '15%',
                            background: `radial-gradient(circle, hsl(175 70% 45% / ${blobOpacity * 0.7}) 0%, transparent 70%)`,
                            filter: 'blur(70px)',
                            animation: 'aurora-blob-2 18s ease-in-out infinite',
                            animationDelay: '2s',
                            willChange: 'transform',
                        }}
                    />

                    {/* Tertiary blob - Pink accent */}
                    <div
                        className="absolute rounded-full"
                        style={{
                            width: '35%',
                            height: '35%',
                            left: '50%',
                            top: '40%',
                            background: `radial-gradient(circle, hsl(330 70% 60% / ${blobOpacity * 0.5}) 0%, transparent 70%)`,
                            filter: 'blur(50px)',
                            animation: 'aurora-blob-3 20s ease-in-out infinite',
                            animationDelay: '4s',
                            willChange: 'transform',
                        }}
                    />
                </>
            )}

            {variant === 'radial' && (
                <div
                    className="absolute inset-0"
                    style={{
                        background: `
                            radial-gradient(circle at 20% 30%, hsl(266 64% 55% / ${blobOpacity}) 0%, transparent 50%),
                            radial-gradient(circle at 80% 70%, hsl(175 70% 45% / ${blobOpacity}) 0%, transparent 40%),
                            radial-gradient(circle at 50% 50%, hsl(330 70% 60% / ${blobOpacity * 0.5}) 0%, transparent 60%)
                        `,
                    }}
                />
            )}

            {/* Noise texture overlay */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    opacity: 0.03,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Vignette */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 0%, hsl(0 0% 100% / 0.3) 100%)',
                }}
            />
        </div>
    );
};

export default AnimatedGradientBackground;
