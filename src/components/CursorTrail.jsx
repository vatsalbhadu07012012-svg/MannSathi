import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const lerp = (start, end, amount) => start + (end - start) * amount;

const createTrail = (count) =>
    Array.from({ length: count }, () => ({
        x: 0,
        y: 0,
        opacity: 0,
        scale: 0.18,
    }));

const getProfile = () => {
    if (typeof window === "undefined") {
        return { enabled: false, particleCount: 0, particleSize: 0, glowIntensity: 0, speed: 0.2 };
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth < 768;

    if (prefersReducedMotion) {
        return { enabled: false, particleCount: 0, particleSize: 0, glowIntensity: 0, speed: 0.2 };
    }

    if (isCoarsePointer && isSmallScreen) {
        return { enabled: false, particleCount: 0, particleSize: 0, glowIntensity: 0, speed: 0.2 };
    }

    if (isCoarsePointer) {
        return { enabled: true, particleCount: 8, particleSize: 7, glowIntensity: 1.08, speed: 0.2 };
    }

    return { enabled: true, particleCount: 14, particleSize: 8, glowIntensity: 1.28, speed: 0.24 };
};

const CursorTrail = ({ config = {} }) => {
    const { theme } = useTheme();

    const resolvedConfig = useMemo(
        () => ({
            particleCount: 14,
            particleSize: 8,
            glowIntensity: 1.28,
            speed: 0.24,
            ...config,
        }),
        [config],
    );

    const [profile, setProfile] = useState(() => getProfile());
    const [ripples, setRipples] = useState([]);
    const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);

    const pointerRef = useRef({ x: 0, y: 0, active: false });
    const pointsRef = useRef(createTrail(resolvedConfig.particleCount));
    const particleRefs = useRef([]);
    const isHoveringRef = useRef(false);
    const frameRef = useRef(null);

    const particleCount = profile.enabled ? Math.max(profile.particleCount || resolvedConfig.particleCount, 4) : 0;
    const particleSize = profile.enabled ? profile.particleSize || resolvedConfig.particleSize : 0;
    const glowIntensity = profile.enabled ? profile.glowIntensity || resolvedConfig.glowIntensity : 0;

    useEffect(() => {
        pointsRef.current = createTrail(particleCount);
        particleRefs.current = [];
    }, [particleCount]);

    useEffect(() => {
        if (typeof window === "undefined") {
            return undefined;
        }

        const updateProfile = () => {
            setProfile(getProfile());
        };

        updateProfile();

        const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        const pointerQuery = window.matchMedia("(pointer: coarse)");

        const onMotionChange = () => updateProfile();
        const onPointerChange = () => updateProfile();

        if (motionQuery.addEventListener) {
            motionQuery.addEventListener("change", onMotionChange);
            pointerQuery.addEventListener("change", onPointerChange);
        } else {
            motionQuery.addListener(onMotionChange);
            pointerQuery.addListener(onPointerChange);
        }

        window.addEventListener("resize", updateProfile);

        return () => {
            if (motionQuery.removeEventListener) {
                motionQuery.removeEventListener("change", onMotionChange);
                pointerQuery.removeEventListener("change", onPointerChange);
            } else {
                motionQuery.removeListener(onMotionChange);
                pointerQuery.removeListener(onPointerChange);
            }
            window.removeEventListener("resize", updateProfile);
        };
    }, []);

    useEffect(() => {
        if (!profile.enabled) {
            return undefined;
        }

        const handlePointerMove = (event) => {
            pointerRef.current = {
                x: event.clientX,
                y: event.clientY,
                active: true,
            };
        };

        const handlePointerLeave = () => {
            pointerRef.current.active = false;
        };

        const handlePointerDown = (event) => {
            const rippleCount = theme === "dark" ? 5 : 4;
            const newRipples = Array.from({ length: rippleCount }, (_, index) => ({
                id: `${Date.now()}-${index}-${Math.random()}`,
                x: event.clientX,
                y: event.clientY,
                size: 8 + Math.random() * 16,
                delay: index * 18,
            }));

            setRipples((current) => [...current, ...newRipples]);
            window.setTimeout(() => {
                setRipples((current) => current.filter((ripple) => !newRipples.some((item) => item.id === ripple.id)));
            }, 360);
        };

        const handleHover = (event) => {
            const target = event.target;
            const interactive = target instanceof Element && target.closest("a, button, input, textarea, select, [role='button'], [data-cursor-hover], .interactive");

            if (interactive) {
                if (!isHoveringRef.current) {
                    isHoveringRef.current = true;
                    setIsHoveringInteractive(true);
                }
            } else if (isHoveringRef.current) {
                isHoveringRef.current = false;
                setIsHoveringInteractive(false);
            }
        };

        const handleMouseLeave = () => {
            if (isHoveringRef.current) {
                isHoveringRef.current = false;
                setIsHoveringInteractive(false);
            }
        };

        window.addEventListener("pointermove", handlePointerMove, { passive: true });
        window.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("mouseover", handleHover);
        document.addEventListener("mouseout", handleMouseLeave);
        document.addEventListener("mouseleave", handlePointerLeave);

        const animate = () => {
            const points = pointsRef.current;
            const { x, y, active } = pointerRef.current;
            const hoverBoost = isHoveringRef.current ? 1.12 : 1;

            if (active && Number.isFinite(x) && Number.isFinite(y)) {
                points[0].x = lerp(points[0].x, x, 0.24 + (profile.speed || resolvedConfig.speed) * 0.2);
                points[0].y = lerp(points[0].y, y, 0.24 + (profile.speed || resolvedConfig.speed) * 0.2);
                points[0].opacity = 0.92;
                points[0].scale = hoverBoost;

                for (let index = 1; index < points.length; index += 1) {
                    const previous = points[index - 1];
                    const current = points[index];
                    current.x = lerp(current.x, previous.x, 0.2 + (profile.speed || resolvedConfig.speed) * 0.08);
                    current.y = lerp(current.y, previous.y, 0.2 + (profile.speed || resolvedConfig.speed) * 0.08);
                    const ratio = index / Math.max(points.length - 1, 1);
                    current.opacity = clamp(0.74 - ratio * 0.58, 0.04, 0.8) * (hoverBoost > 1 ? 1.04 : 1);
                    current.scale = clamp((hoverBoost * (1 - ratio * 0.42)) * 0.9, 0.22, 1.1);
                }
            } else {
                points[0].opacity *= 0.86;
                points[0].scale *= 0.94;
                for (let index = 1; index < points.length; index += 1) {
                    const current = points[index];
                    current.opacity *= 0.86;
                    current.scale *= 0.92;
                }
            }

            points.forEach((point, index) => {
                const element = particleRefs.current[index];
                if (!element) {
                    return;
                }

                const accentColors = theme === "dark" ? ["#67e8f9", "#a855f7", "#38bdf8", "#f8fafc"] : ["#38bdf8", "#93c5fd", "#7c3aed", "#ffffff"];
                const color = accentColors[index % accentColors.length];
                const size = (particleSize || resolvedConfig.particleSize) + index * 0.3;
                const glowSize = (glowIntensity || resolvedConfig.glowIntensity) * 10 + index * 1.4;

                element.style.left = `${point.x}px`;
                element.style.top = `${point.y}px`;
                element.style.width = `${size}px`;
                element.style.height = `${size}px`;
                element.style.opacity = point.opacity;
                element.style.transform = `translate(-50%, -50%) scale(${point.scale * (isHoveringInteractive ? 1.08 : 1)})`;
                element.style.background = `radial-gradient(circle, rgba(255,255,255,0.96) 0%, ${color} 45%, rgba(255,255,255,0) 78%)`;
                element.style.boxShadow = `0 0 ${glowSize}px ${color}55, 0 0 ${glowSize * 1.3}px rgba(255,255,255,0.12)`;
                element.style.filter = theme === "dark" ? "blur(0.7px)" : "blur(0.35px)";
                element.style.mixBlendMode = theme === "dark" ? "screen" : "normal";
            });

            frameRef.current = window.requestAnimationFrame(animate);
        };

        frameRef.current = window.requestAnimationFrame(animate);

        return () => {
            window.cancelAnimationFrame(frameRef.current);
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("mouseover", handleHover);
            document.removeEventListener("mouseout", handleMouseLeave);
            document.removeEventListener("mouseleave", handlePointerLeave);
        };
    }, [profile.enabled, profile.speed, theme, particleSize, glowIntensity, isHoveringInteractive, resolvedConfig.glowIntensity, resolvedConfig.particleSize, resolvedConfig.speed]);

    if (!profile.enabled) {
        return null;
    }

    return (
        <div aria-hidden="true" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, overflow: "hidden" }}>
            <style>{`
                @keyframes cursor-ripple {
                    0% {
                        transform: translate(-50%, -50%) scale(0.8);
                        opacity: 0.95;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(1.8);
                        opacity: 0;
                    }
                }
            `}</style>
            {Array.from({ length: particleCount }).map((_, index) => (
                <span
                    key={index}
                    ref={(element) => {
                        if (element) {
                            particleRefs.current[index] = element;
                        }
                    }}
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: particleSize || resolvedConfig.particleSize,
                        height: particleSize || resolvedConfig.particleSize,
                        borderRadius: "999px",
                        transform: "translate(-50%, -50%) scale(0.18)",
                        opacity: 0,
                        background: "rgba(255,255,255,0.96)",
                        boxShadow: "0 0 16px rgba(255,255,255,0.14)",
                        pointerEvents: "none",
                    }}
                />
            ))}
            {ripples.map((ripple) => (
                <span
                    key={ripple.id}
                    style={{
                        position: "absolute",
                        left: ripple.x,
                        top: ripple.y,
                        width: ripple.size,
                        height: ripple.size,
                        borderRadius: "999px",
                        transform: "translate(-50%, -50%)",
                        border: `1px solid ${theme === "dark" ? "rgba(125, 211, 252, 0.65)" : "rgba(56, 189, 248, 0.45)"}`,
                        boxShadow: `0 0 14px ${theme === "dark" ? "rgba(103, 232, 249, 0.26)" : "rgba(56, 189, 248, 0.18)"}`,
                        opacity: 0.9,
                        animation: "cursor-ripple 360ms ease-out forwards",
                        animationDelay: `${ripple.delay}ms`,
                    }}
                />
            ))}
        </div>
    );
};

export default CursorTrail;
