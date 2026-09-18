import React, { useEffect, useState } from 'react';

const app = () => {
    const [mouse, setMouse] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMouse({
                x: e.clientX,
                y: e.clientY,
            });
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <>
            {/* Hidden SVG Filter that applies horizontal wave displacement */}
            <svg style={{ position: "absolute", width: 0, height: 0 }}>
                <filter id="horizontal-wave">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.04 0.01"
                        numOctaves="2"
                        result="noise"
                    >
                        <animate
                            attributeName="baseFrequency"
                            dur="4s"
                            values="0.04 0.01; 0.08 0.01; 0.04 0.01"
                            repeatCount="indefinite"
                        />
                    </feTurbulence>
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="noise"
                        scale="12"
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>
            </svg>

            {/* Mouse Follower Wrapper */}
            <div
                className='d-none d-md-block'
                style={{
                    position: "fixed",
                    left: `${mouse.x + 18}px`,
                    top: `${mouse.y + 18}px`,
                    width: "60px",
                    height: "40px",
                    zIndex: 999999,
                    pointerEvents: "none",
                    transition:
                        "left 0.8s cubic-bezier(0.22, 1, 0.36, 1), top 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
            >
                <img
                    src="https://flagcdn.com/w80/in.png"
                    alt="India Flag"
                    className="india-wave-flag-horizontal"
                />
            </div>
        </>
    )
}

export default app
