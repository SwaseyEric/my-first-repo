import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * CloseX Component
 * 
 * A premium, architectural close button where the "X" icon breaks into 4 distinct pieces
 * when the drawer/modal is open, and snaps back together when clicked to close.
 * 
 * Design Philosophy:
 * - "Exploded" state indicates the potential to "Heal/Close"
 * - Animation is spring-based but controlled (high damping) to feel mechanical/precise.
 * - No rotation scaling, just pure translation for the break effect.
 * 
 * Usage:
 * <CloseX isOpen={isDrawerOpen} onRequestClose={() => setIsDrawerOpen(false)} />
 * 
 * Animation Tuning:
 * - BREAK_DISTANCE: How far the pieces move outward (px)
 * - CLOSE_DELAY: Time to wait after clicking before triggering close (ms)
 * - SPRING_CONFIG: Physics of the movement
 */

interface CloseXProps {
    isOpen: boolean;
    onRequestClose: () => void;
    size?: number;
    className?: string;
}

// --- Configuration ---
const BREAK_DISTANCE = 5; // px to move outward from center
const CLOSE_DELAY = 200; // ms to wait for "healing" animation before closing
const SPRING_CONFIG = {
    type: 'spring',
    stiffness: 400,
    damping: 30, // High damping for "no overshoot" / precise feel
    mass: 0.8
};

const CloseX: React.FC<CloseXProps> = ({
    isOpen,
    onRequestClose,
    size = 44,
    className = ''
}) => {
    const [isClosing, setIsClosing] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    // Reset closing state when `isOpen` changes externally
    useEffect(() => {
        if (isOpen) {
            setIsClosing(false);
        }
    }, [isOpen]);

    const handleClick = () => {
        // 1. Trigger internal "healing" animation state
        setIsClosing(true);

        // 2. Wait for animation, then trigger actual close
        setTimeout(() => {
            onRequestClose();
        }, shouldReduceMotion ? 0 : CLOSE_DELAY);
    };

    // Logic: 
    // If we are currently "closing" (user clicked), we want to be in the "Healed" state (0 distance).
    // If we are "open" and NOT closing, we want to be in "Exploded" state (BREAK_DISTANCE).
    // If we are closed (!isOpen), we want to be in "Healed" state (0).
    const isExploded = isOpen && !isClosing;

    // Calculate distances for the 4 quadrants
    // Top-Left, Top-Right, Bottom-Left, Bottom-Right relative to center opacity/rotation
    // Actually, simpler to treat them as Upper diagonal and Lower diagonal segments split in half?
    // Let's frame it as 4 rectangles.

    // Stroke width relative to size
    const strokeWidth = 2;
    const segmentLength = (size * 0.4); // Length of one half-diagonal

    // Variants for the 4 pieces
    // We'll define them by their translation direction
    // piece 1: Top-Left (moves up-left)
    // piece 2: Top-Right (moves up-right)
    // piece 3: Bottom-Left (moves down-left)
    // piece 4: Bottom-Right (moves down-right)
    // Note: Since they form an X, 1 and 4 are one diagonal, 2 and 3 are the other.

    // Wait, standard X is 2 crossing lines.
    // We need to simulate those lines breaking.
    // Line A: Top-Left to Bottom-Right. Breaks into Top-Left piece and Bottom-Right piece.
    // Line B: Top-Right to Bottom-Left. Breaks into Top-Right piece and Bottom-Left piece.

    const dist = shouldReduceMotion ? 0 : (isExploded ? BREAK_DISTANCE : 0);

    return (
        <motion.button
            type="button"
            aria-label="Close"
            onClick={handleClick}
            className={`relative rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${className}`}
            style={{ width: size, height: size }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
        >
            <div className="relative w-5 h-5 flex items-center justify-center">
                {/* We construct the X from 4 separate divs to allow independent movement */}

                {/* Diagonal 1: Top-Left to Bottom-Right */}
                {/* Top-Left Segment */}
                <motion.div
                    className="absolute bg-white dark:bg-zinc-900 rounded-sm"
                    style={{
                        width: '12px', // Approx half length
                        height: '2px',
                        top: '50%',
                        left: '50%',
                        originX: 1, // Anchor to center
                        originY: 0.5,
                    }}
                    initial={{ rotate: 45, x: '-50%', y: '-50%' }} // Center anchor
                    animate={{
                        rotate: 45,
                        x: `calc(-50% - ${dist * 0.707}px)`, // Move neg X
                        y: `calc(-50% - ${dist * 0.707}px)`  // Move neg Y
                    }}
                    transition={SPRING_CONFIG}
                />

                {/* Bottom-Right Segment */}
                <motion.div
                    className="absolute bg-white dark:bg-zinc-900 rounded-sm"
                    style={{
                        width: '12px',
                        height: '2px',
                        top: '50%',
                        left: '50%',
                        originX: 0, // Anchor to center
                        originY: 0.5,
                    }}
                    initial={{ rotate: 45, x: '-50%', y: '-50%' }}
                    animate={{
                        rotate: 45,
                        x: `calc(-50% + ${dist * 0.707}px)`,
                        y: `calc(-50% + ${dist * 0.707}px)`
                    }}
                    transition={SPRING_CONFIG}
                />

                {/* Diagonal 2: Top-Right to Bottom-Left */}
                {/* Top-Right Segment */}
                <motion.div
                    className="absolute bg-white dark:bg-zinc-900 rounded-sm"
                    style={{
                        width: '12px',
                        height: '2px',
                        top: '50%',
                        left: '50%',
                        originX: 0,
                        originY: 0.5,
                    }}
                    initial={{ rotate: -45, x: '-50%', y: '-50%' }}
                    animate={{
                        rotate: -45,
                        x: `calc(-50% + ${dist * 0.707}px)`,
                        y: `calc(-50% - ${dist * 0.707}px)`
                    }}
                    transition={SPRING_CONFIG}
                />

                {/* Bottom-Left Segment */}
                <motion.div
                    className="absolute bg-white dark:bg-zinc-900 rounded-sm"
                    style={{
                        width: '12px',
                        height: '2px',
                        top: '50%',
                        left: '50%',
                        originX: 1,
                        originY: 0.5,
                    }}
                    initial={{ rotate: -45, x: '-50%', y: '-50%' }}
                    animate={{
                        rotate: -45,
                        x: `calc(-50% - ${dist * 0.707}px)`,
                        y: `calc(-50% + ${dist * 0.707}px)`
                    }}
                    transition={SPRING_CONFIG}
                />
            </div>
        </motion.button>
    );
};

export default CloseX;

// --- Example Usage ---
/*
const ExampleDrawer = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-zinc-900 p-6 shadow-2xl">
      <div className="flex justify-end p-4">
        <CloseX 
            isOpen={isOpen} 
            onRequestClose={() => setIsOpen(false)} 
        />
      </div>
      <div className="mt-10 text-white/50">
        Drawer Content
      </div>
    </div>
  );
};
*/
