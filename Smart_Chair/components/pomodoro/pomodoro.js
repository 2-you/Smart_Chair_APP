import React, { useState, useEffect } from 'react';
import { View, FlatList, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTimer } from '../../hooks/pomodoro/useTimer';
import { useStats } from '../../hooks/pomodoro/useStats';
import { useNotifications } from '../../hooks/pomodoro/useNotifications';
import { Timer } from './Timer';
import { Settings } from './Settings';
import { Statistics } from './Statistics';
import { TaskList } from './TaskList';
import { COLORS, DEFAULT_WORK_TIME, DEFAULT_SHORT_BREAK, DEFAULT_LONG_BREAK } from '../../constants/pomodoro';
import tw from 'twrnc';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 알림 설정
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

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
            scheduleNotification(true);

            if (timer.cycles + 1 >= 4) {
                timer.setMinutes(settings.longBreakTime);
                timer.setCycles(0);
            } else {
                timer.setMinutes(settings.shortBreakTime);
                timer.setCycles(timer.cycles + 1);
            }
        } else {
            scheduleNotification(false);
            timer.setMinutes(settings.workTime);
        }

        timer.setIsWork(!timer.isWork);
    };

    const timer = useTimer(settings.workTime, handleTimerComplete);

    // 앱 시작시 저장된 할 일 목록 불러오기
    useEffect(() => {
        const loadTasks = async () => {
            try {
                const savedTasks = await AsyncStorage.getItem('tasks');
                if (savedTasks) {
                    setTasks(JSON.parse(savedTasks));
                }
            } catch (error) {
                console.error('할 일 목록을 불러오는데 실패했습니다:', error);
            }
        };

        loadTasks();
    }, []);

    const addTask = async (newTask) => {
        try {
            const updatedTasks = [...tasks, newTask];
            await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
            setTasks(updatedTasks);
            if (!currentTask) {
                setCurrentTask(newTask);
            }
        } catch (error) {
            console.error('할 일을 저장하는데 실패했습니다:', error);
        }
    };

    const deleteTask = async (taskId) => {
        try {
            const updatedTasks = tasks.filter(task => task.id !== taskId);
            await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
            setTasks(updatedTasks);
            if (currentTask?.id === taskId) {
                setCurrentTask(null);
            }
        } catch (error) {
            console.error('할 일을 삭제하는데 실패했습니다:', error);
        }
    };

    const updateTask = async (updatedTask) => {
        try {
            const updatedTasks = tasks.map(task =>
                task.id === updatedTask.id ? updatedTask : task
            );
            await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
            setTasks(updatedTasks);
        } catch (error) {
            console.error('할 일 업데이트에 실패했습니다:', error);
        }
    };

    const handlePomodoroComplete = async () => {
        if (currentTask) {
            const updatedTask = {
                ...currentTask,
                completedPomodoros: currentTask.completedPomodoros + 1
            };
            await updateTask(updatedTask);
            setCurrentTask(updatedTask);

            // 목표한 뽀모도로 수를 달성했을 때 알림
            if (updatedTask.completedPomodoros >= updatedTask.estimatedPomodoros) {
                Alert.alert(
                    "목표 달성! 🎉",
                    `${updatedTask.name} 작업의 목표 뽀모도로 수를 달성했습니다!`
                );
            }
        }

        // 타이머 상태 업데이트
        setIsActive(false);
        setMinutes(settings.workTime);
        setSeconds(0);
        setIsWork(true);
    };

    // 시간대별 색상 관리
    const [colors, setColors] = useState(COLORS.morning);

    // 타이머 진행도에 따른 배경색 업데이트
    const updateBackgroundColor = () => {
        const totalSeconds = settings.workTime * 60;
        const currentSeconds = timer.minutes * 60 + timer.seconds;
        const progress = currentSeconds / totalSeconds;

        if (progress > 0.75) {  // 25% 미만 진행
            setColors(COLORS.morning);
        } else if (progress > 0.5) {  // 25~50% 진행
            setColors(COLORS.noon);
        } else if (progress > 0.25) {  // 50~75% 진행
            setColors(COLORS.evening);
        } else {  // 75% 이상 진행
            setColors(COLORS.night);
        }
    };

    // 타이머 틱마다 배경색 업데이트
    useEffect(() => {
        if (timer.isActive && timer.isWork) {  // 작업 시간일 때만 배경색 변경
            updateBackgroundColor();
        }
    }, [timer.minutes, timer.seconds]);

    // 타이머 리셋될 때 초기 배경색으로 변경
    useEffect(() => {
        if (!timer.isActive) {
            setColors(COLORS.morning);
        }
    }, [timer.isActive]);

    // 설정 변경시 타이머 업데이트
    useEffect(() => {
        if (!timer.isActive) {
            timer.setMinutes(timer.isWork ? settings.workTime : settings.shortBreakTime);
        }
    }, [settings]);

    // useEffect를 사용하여 타이머 상태 관리
    useEffect(() => {
        // 타이머 관련 상태를 여기서 초기화하거나 업데이트
    }, [currentTask]); // currentTask가 변경될 때만 실행

    // 렌더링할 섹션들을 배열로 정의
    const sections = [
        {
            key: 'settings', component: (
                <Settings
                    settings={settings}
                    onSettingsChange={setSettings}
                />
            )
        },
        {
            key: 'statistics', component: (
                <Statistics stats={stats} />
            )
        },
        {
            key: 'taskList', component: (
                <TaskList
                    tasks={tasks}
                    currentTask={currentTask}
                    onTaskSelect={setCurrentTask}
                    onTaskAdd={addTask}
                    onTaskDelete={deleteTask}
                    onTaskUpdate={updateTask}
                />
            )
        }
    ];

    const renderItem = ({ item }) => item.component;

    return (
        <View style={tw`flex-1`}>
            <LinearGradient
                colors={colors}
                style={tw`absolute inset-0`}
            />
            <FlatList
                data={sections}
                renderItem={renderItem}
                keyExtractor={item => item.key}
                scrollEnabled={true}
                showsVerticalScrollIndicator={true}
                style={tw`flex-1`}
                contentContainerStyle={tw`p-4`}
                ListHeaderComponent={() => (
                    <View style={tw`bg-white/80 rounded-xl p-6 mb-6`}>
                        <Timer
                            minutes={timer.minutes}
                            seconds={timer.seconds}
                            isWork={timer.isWork}
                            cycles={timer.cycles}
                            currentTask={currentTask}
                            isActive={timer.isActive}
                            onToggle={() => timer.setIsActive(!timer.isActive)}
                            onReset={() => {
                                timer.setIsActive(false);
                                timer.setMinutes(settings.workTime);
                                timer.setSeconds(0);
                            }}
                            onComplete={handlePomodoroComplete}
                        />
                    </View>
                )}
            />
        </View>
    );
};

export default Pomodoro;