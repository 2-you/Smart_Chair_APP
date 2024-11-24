import { useState, useEffect } from 'react';

export const useTimer = (initialMinutes, onComplete) => {
    const [minutes, setMinutes] = useState(initialMinutes || 25);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isWork, setIsWork] = useState(true);
    const [cycles, setCycles] = useState(0);

    useEffect(() => {
        setMinutes(initialMinutes || 25);
        setSeconds(0);
    }, [initialMinutes]);

    useEffect(() => {
        let interval = null;

        if (isActive) {
            interval = setInterval(() => {
                if (seconds > 0) {
                    setSeconds(seconds - 1);
                } else if (minutes > 0) {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                } else {
                    setIsActive(false);
                    if (onComplete) {
                        onComplete();
                    }
                }
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isActive, minutes, seconds, onComplete]);

    return {
        minutes,
        seconds,
        isActive,
        isWork,
        cycles,
        setMinutes,
        setSeconds,
        setIsActive,
        setIsWork,
        setCycles,
    };
};