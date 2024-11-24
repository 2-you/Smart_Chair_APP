import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useTimer = (workTime, onComplete) => {
    const [minutes, setMinutes] = useState(workTime);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isWork, setIsWork] = useState(true);
    const [cycles, setCycles] = useState(0);

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                if (seconds === 0) {
                    if (minutes === 0) {
                        clearInterval(interval);
                        onComplete();
                        return;
                    }
                    setSeconds(59);
                    setMinutes(minutes - 1);
                } else {
                    setSeconds(seconds - 1);
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive, minutes, seconds]);

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
        setCycles
    };
};