import React, { useState, useEffect, useRef } from 'react';
import { FaRegSnowflake, FaSnowman } from 'react-icons/fa';
import { GiSnowBottle, GiSnowflake2, GiSnowman, GiTensionSnowflake } from 'react-icons/gi';
import './winter-decorations.scss';

const WINTER_MONTHS = [11, 0, 1]; // December, January, February (qish oylari)

const WinterDecorations: React.FC = () => {
    const snowContainerRef = useRef<HTMLDivElement>(null);
    const [snowflakes, setSnowflakes] = useState<Array<{ id: number; left: number; delay: number; duration: number; size: number }>>([]);

    const isWinter = () => {
        const month = new Date().getMonth();
        return WINTER_MONTHS.includes(month);
    };

    useEffect(() => {
        const createSnowflakes = () => {
            const newSnowflakes = [];
            for (let i = 0; i < 50; i++) {
                newSnowflakes.push({
                    id: i,
                    left: Math.random() * 100,
                    delay: Math.random() * 5,
                    duration: 8 + Math.random() * 8,
                    size: 5 + Math.random() * 10
                });
            }
            setSnowflakes(newSnowflakes);
        };
        createSnowflakes();
    }, []);

    if (!isWinter()) {
        return null;
    }

    return (
        <>
            <div className="snow-container" ref={snowContainerRef}>
                {snowflakes.map((flake) => (
                    <div
                        key={flake.id}
                        className="snowflake"
                        style={{
                            left: `${flake.left}%`,
                            animationDelay: `${flake.delay}s`,
                            animationDuration: `${flake.duration}s`,
                            fontSize: `${flake.size}px`
                        }}
                    >
                        <FaRegSnowflake />
                    </div>
                ))}
            </div>
            <div className="christmas-decorations">
                <div className="decoration decoration-1">
                    <GiSnowflake2 />
                </div>
                <div className="decoration decoration-2">
                    <GiTensionSnowflake />
                </div>
                <div className="decoration decoration-3">
                    <GiSnowBottle />
                </div>
                <div className="decoration decoration-4">
                    <GiSnowman />
                </div>
                <div className="decoration decoration-5">
                    <FaSnowman />
                </div>
                <div className="decoration decoration-6">
                    <GiSnowflake2 />
                </div>
            </div>
        </>
    );
};

export default WinterDecorations;
