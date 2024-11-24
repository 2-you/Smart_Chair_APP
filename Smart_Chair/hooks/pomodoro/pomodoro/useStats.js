import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useStats = () => {
    const [stats, setStats] = useState({
        totalPomodoros: 0,
        totalFocusTime: 0,
        weeklyData: {
            labels: ['월', '화', '수', '목', '금', '토', '일'],
            datasets: [{
                data: [0, 0, 0, 0, 0, 0, 0]
            }]
        }
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const savedStats = await AsyncStorage.getItem('pomodoroStats');
            if (savedStats) {
                setStats(JSON.parse(savedStats));
            }
        } catch (error) {
            console.error('통계 로딩 실패:', error);
        }
    };

    const updateStats = async (focusTime) => {
        const newStats = {
            ...stats,
            totalPomodoros: stats.totalPomodoros + 1,
            totalFocusTime: stats.totalFocusTime + focusTime
        };

        try {
            await AsyncStorage.setItem('pomodoroStats', JSON.stringify(newStats));
            setStats(newStats);
        } catch (error) {
            console.error('통계 저장 실패:', error);
        }
    };

    return { stats, updateStats };
};