import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { useTimer } from '../../hooks/pomodoro/useTimer';
import { useStats } from '../../hooks/pomodoro/useStats';
import { useNotifications } from '../../hooks/pomodoro/useNotifications';
import { Timer } from './Timer';
import { Settings } from './Settings';
import { Statistics } from './Statistics';
import { TaskList } from './TaskList';
import { getTimeOfDay } from '../../utils/pomoUtils';
import { COLORS, DEFAULT_WORK_TIME, DEFAULT_SHORT_BREAK, DEFAULT_LONG_BREAK } from '../../constants/pomodoro';
import styles from './styles';

const Pomodoro = () => {
    // 기본 상태 관리
    const [settings, setSettings] = useState({
        workTime: DEFAULT_WORK_TIME,
        shortBreakTime: DEFAULT_SHORT_BREAK,
        longBreakTime: DEFAULT_LONG_BREAK,
        focusModeEnabled: false
    });

    const [tasks, setTasks] = useState([]);
    const [currentTask, setCurrentTask] = useState(null);

    // 커스텀 훅 사용
    const { stats, updateStats } = useStats();
    const { scheduleNotification } = useNotifications();

    const handleTimerComplete = () => {
        if (timer.isWork) {
            updateStats(settings.workTime);
            scheduleNotification();

            if (timer.cycles + 1 >= 4) {
                timer.setMinutes(settings.longBreakTime);
                timer.setCycles(0);
            } else {
                timer.setMinutes(settings.shortBreakTime);
                timer.setCycles(timer.cycles + 1);
            }
        } else {
            timer.setMinutes(settings.workTime);
        }

        timer.setIsWork(!timer.isWork);
    };

    const timer = useTimer(settings.workTime, handleTimerComplete);

    // 작업 관리 함수들
    const selectTask = (task) => {
        setCurrentTask(task);
    };

    const addTask = (newTask) => {
        setTasks([...tasks, newTask]);
    };

    // 시간대별 색상 관리
    const [colors, setColors] = useState(COLORS.morning);

    useEffect(() => {
        const timeOfDay = getTimeOfDay();
        setColors(COLORS[timeOfDay]);
    }, []);

    // 설정 변경시 타이머 업데이트
    useEffect(() => {
        if (!timer.isActive) {
            timer.setMinutes(timer.isWork ? settings.workTime : settings.shortBreakTime);
        }
    }, [settings]);

    return (
        <ScrollView style={styles.container}>
            <Timer
                {...timer}
                currentTask={currentTask}
                colors={colors}
                onToggle={() => timer.setIsActive(!timer.isActive)}
                onReset={() => {
                    timer.setIsActive(false);
                    timer.setMinutes(settings.workTime);
                    timer.setSeconds(0);
                }}
            />
            <Settings
                settings={settings}
                onSettingsChange={setSettings}
            />
            <Statistics stats={stats} />
            <TaskList
                tasks={tasks}
                currentTask={currentTask}
                onTaskSelect={selectTask}
                onTaskAdd={addTask}
            />
        </ScrollView>
    );
};

export default Pomodoro;