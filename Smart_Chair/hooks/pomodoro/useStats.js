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
        try {
            // 현재 요일 구하기 (0: 일요일, 1: 월요일, ...)
            const today = new Date().getDay();
            const dayIndex = today === 0 ? 6 : today - 1; // 월요일이 0이 되도록 조정

            // 새로운 통계 데이터 생성
            const newWeeklyData = {
                ...stats.weeklyData,
                datasets: [{
                    data: stats.weeklyData.datasets[0].data.map((count, index) =>
                        index === dayIndex ? count + 1 : count
                    )
                }]
            };

            const newStats = {
                totalPomodoros: stats.totalPomodoros + 1,
                totalFocusTime: stats.totalFocusTime + focusTime,
                weeklyData: newWeeklyData
            };

            // 통계 저장 및 상태 업데이트
            await AsyncStorage.setItem('pomodoroStats', JSON.stringify(newStats));
            setStats(newStats);

            console.log('통계 업데이트:', {
                총_뽀모도로: newStats.totalPomodoros,
                총_집중시간: newStats.totalFocusTime,
                요일별_데이터: newStats.weeklyData.datasets[0].data
            });
        } catch (error) {
            console.error('통계 저장 실패:', error);
        }
    };

    return { stats, updateStats };
};