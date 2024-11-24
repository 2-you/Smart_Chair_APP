import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Switch,
    ScrollView,
    TextInput,
    Alert,
    Vibration,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { LineChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';

// 알림 설정
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

const DEFAULT_WORK_TIME = 25;
const DEFAULT_SHORT_BREAK = 5;
const DEFAULT_LONG_BREAK = 15;
const CYCLES_BEFORE_LONG_BREAK = 4;

// 배경 색상 설정
const getDayNightColors = (progress) => {
    // progress는 0(시작)에서 1(종료) 사이의 값
    const colors = {
        morning: ['#87CEEB', '#FFF4E3'], // 아침 하늘색에서 밝은 노란색
        noon: ['#4A90E2', '#87CEEB'],    // 낮 파란색
        evening: ['#FF9666', '#4A90E2'],  // 저녁 노을
        night: ['#1A2B3C', '#2C3E50']    // 밤하늘
    };

    if (progress < 0.25) return colors.morning;
    if (progress < 0.5) return colors.noon;
    if (progress < 0.75) return colors.evening;
    return colors.night;
};

const Pomodoro = () => {
    // 타이머 상태
    const [minutes, setMinutes] = useState(DEFAULT_WORK_TIME);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isWork, setIsWork] = useState(true);
    const [cycles, setCycles] = useState(0);

    // 설정
    const [workTime, setWorkTime] = useState(DEFAULT_WORK_TIME);
    const [shortBreakTime, setShortBreakTime] = useState(DEFAULT_SHORT_BREAK);
    const [longBreakTime, setLongBreakTime] = useState(DEFAULT_LONG_BREAK);
    const [focusModeEnabled, setFocusModeEnabled] = useState(false);

    // 통계
    const [totalFocusTime, setTotalFocusTime] = useState(0);
    const [completedPomodoros, setCompletedPomodoros] = useState(0);
    const [dailyStats, setDailyStats] = useState([]);

    // 할 일 목록
    const [tasks, setTasks] = useState([]);
    const [currentTask, setCurrentTask] = useState(null);

    // 소리 효과
    const [sound, setSound] = useState();

    // 데이터 로드
    useEffect(() => {
        loadData();
        setupNotifications();
    }, []);

    const loadData = async () => {
        try {
            const savedStats = await AsyncStorage.getItem('stats');
            if (savedStats) {
                const stats = JSON.parse(savedStats);
                setTotalFocusTime(stats.totalFocusTime || 0);
                setCompletedPomodoros(stats.completedPomodoros || 0);
                setDailyStats(stats.dailyStats || []);
            }

            const savedTasks = await AsyncStorage.getItem('tasks');
            if (savedTasks) {
                setTasks(JSON.parse(savedTasks));
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    // 알림 설정
    const setupNotifications = async () => {
        try {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                Alert.alert('알림 권한이 필요합니다.');
                return;
            }
        } catch (error) {
            console.log('알림 설정 오류:', error);
        }
    };

    // 타이머 로직
    useEffect(() => {
        let interval = null;

        if (isActive) {
            interval = setInterval(() => {
                if (seconds === 0) {
                    if (minutes === 0) {
                        clearInterval(interval);
                        handleTimerComplete();
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

    const handleTimerComplete = async () => {
        try {
            Vibration.vibrate();

            // 알림 전송
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: isWork ? '휴식 시간!' : '작업 시작!',
                    body: isWork ? '잠시 휴식을 취하세요.' : '다시 집중할 시간입니다.',
                },
                trigger: null, // 즉시 알림
            });

            // 나머지 타이머 완료 로직
            if (isWork) {
                const newCycles = cycles + 1;
                setCycles(newCycles);
                setCompletedPomodoros(prev => prev + 1);
                setTotalFocusTime(prev => prev + workTime);

                if (newCycles % CYCLES_BEFORE_LONG_BREAK === 0) {
                    setMinutes(longBreakTime);
                } else {
                    setMinutes(shortBreakTime);
                }
                setIsWork(false);

                // 현재 작업 업데이트
                if (currentTask) {
                    const updatedTasks = tasks.map(task =>
                        task.id === currentTask.id
                            ? { ...task, completedPomodoros: task.completedPomodoros + 1 }
                            : task
                    );
                    setTasks(updatedTasks);
                    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
                }
            } else {
                setMinutes(workTime);
                setIsWork(true);
            }

            updateStats();
        } catch (error) {
            console.log('타이머 완료 처리 오류:', error);
        }
    };

    const updateStats = async () => {
        const today = new Date().toISOString().split('T')[0];
        const updatedStats = [...dailyStats];
        const todayStats = updatedStats.find(stat => stat.date === today);

        if (todayStats) {
            todayStats.completedPomodoros += 1;
            todayStats.totalFocusTime += workTime;
        } else {
            updatedStats.push({
                date: today,
                completedPomodoros: 1,
                totalFocusTime: workTime,
            });
        }

        setDailyStats(updatedStats);
        await AsyncStorage.setItem('stats', JSON.stringify({
            totalFocusTime,
            completedPomodoros,
            dailyStats: updatedStats,
        }));
    };

    // 타이머 컨트롤
    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setMinutes(workTime);
        setSeconds(0);
        setIsWork(true);
        setCycles(0);
    };

    // 할 일 관리
    const addTask = async (taskName) => {
        const newTask = {
            id: Date.now().toString(),
            name: taskName,
            completedPomodoros: 0,
            estimatedPomodoros: 4,
        };
        const updatedTasks = [...tasks, newTask];
        setTasks(updatedTasks);
        await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    };

    const selectTask = (task) => {
        setCurrentTask(task);
        resetTimer();
    };

    // 타이머 진행률 업데이트
    const [timerProgress, setTimerProgress] = useState(0);

    useEffect(() => {
        if (isActive && isWork) {
            const totalSeconds = workTime * 60;
            const currentSeconds = (workTime * 60) - (minutes * 60 + seconds);
            const progress = currentSeconds / totalSeconds;
            setTimerProgress(progress);
        }
    }, [minutes, seconds, isActive, isWork]);

    // UI 렌더링
    return (
        <View style={tw`flex-1`}>
            <LinearGradient
                colors={getDayNightColors(timerProgress)}
                style={tw`absolute inset-0`}
            />
            <ScrollView style={tw`flex-1 px-5 py-4`}>
                <View style={tw`bg-white/80 rounded-xl p-6 mb-6 shadow-lg`}>
                    <Text style={styles.statusText}>
                        {isWork ? '작업 시간' : '휴식 시간'}
                    </Text>
                    <Text style={styles.timerText}>
                        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </Text>
                    <Text style={styles.cycleText}>완료한 사이클: {cycles}</Text>

                    {currentTask && (
                        <Text style={styles.currentTaskText}>
                            현재 작업: {currentTask.name}
                        </Text>
                    )}
                </View>

                <View style={tw`bg-white/80 rounded-xl p-6 mb-6`}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, isActive ? styles.stopButton : styles.startButton]}
                            onPress={toggleTimer}
                        >
                            <Text style={styles.buttonText}>
                                {isActive ? '일시정지' : '시작'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.resetButton]}
                            onPress={resetTimer}
                        >
                            <Text style={styles.buttonText}>리셋</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={tw`bg-white/80 rounded-xl p-6 mb-6`}>
                    <View style={styles.settingsSection}>
                        <Text style={styles.sectionTitle}>설정</Text>
                        <View style={styles.settingItem}>
                            <Text>작업 시간 (분)</Text>
                            <TextInput
                                style={styles.input}
                                value={String(workTime)}
                                onChangeText={(text) => setWorkTime(parseInt(text) || DEFAULT_WORK_TIME)}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.settingItem}>
                            <Text>짧은 휴식 (분)</Text>
                            <TextInput
                                style={styles.input}
                                value={String(shortBreakTime)}
                                onChangeText={(text) => setShortBreakTime(parseInt(text) || DEFAULT_SHORT_BREAK)}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.settingItem}>
                            <Text>긴 휴식 (분)</Text>
                            <TextInput
                                style={styles.input}
                                value={String(longBreakTime)}
                                onChangeText={(text) => setLongBreakTime(parseInt(text) || DEFAULT_LONG_BREAK)}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.settingItem}>
                            <Text>포커스 모드</Text>
                            <Switch
                                value={focusModeEnabled}
                                onValueChange={setFocusModeEnabled}
                            />
                        </View>
                    </View>
                </View>

                <View style={tw`bg-white/80 rounded-xl p-6 mb-6`}>
                    <View style={styles.statsSection}>
                        <Text style={styles.sectionTitle}>통계</Text>
                        <Text>총 집중 시간: {Math.floor(totalFocusTime / 60)}시간 {totalFocusTime % 60}분</Text>
                        <Text>완료한 뽀모도로: {completedPomodoros}개</Text>

                        {dailyStats.length > 0 && (
                            <LineChart
                                data={{
                                    labels: dailyStats.slice(-7).map(stat => stat.date.slice(5)),
                                    datasets: [{
                                        data: dailyStats.slice(-7).map(stat => stat.completedPomodoros)
                                    }]
                                }}
                                width={300}
                                height={200}
                                chartConfig={{
                                    backgroundColor: '#ffffff',
                                    backgroundGradientFrom: '#ffffff',
                                    backgroundGradientTo: '#ffffff',
                                    color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
                                }}
                                style={styles.chart}
                            />
                        )}
                    </View>
                </View>

                <View style={tw`bg-white/80 rounded-xl p-6 mb-6`}>
                    <View style={styles.tasksSection}>
                        <Text style={styles.sectionTitle}>할 일 목록</Text>
                        <TextInput
                            style={styles.taskInput}
                            placeholder="새로운 할 일 추가"
                            onSubmitEditing={(e) => addTask(e.nativeEvent.text)}
                        />
                        {tasks.map(task => (
                            <TouchableOpacity
                                key={task.id}
                                style={[
                                    styles.taskItem,
                                    currentTask?.id === task.id && styles.selectedTask
                                ]}
                                onPress={() => selectTask(task)}
                            >
                                <Text>{task.name}</Text>
                                <Text>완료: {task.completedPomodoros}/{task.estimatedPomodoros}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    timerCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 30,
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 30,
    },
    statusText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    timerText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#007bff',
        marginBottom: 10,
    },
    cycleText: {
        fontSize: 16,
        color: '#666',
    },
    currentTaskText: {
        fontSize: 18,
        color: '#333',
        marginTop: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 30,
    },
    button: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginHorizontal: 10,
        minWidth: 120,
        alignItems: 'center',
    },
    startButton: {
        backgroundColor: '#28a745',
    },
    stopButton: {
        backgroundColor: '#dc3545',
    },
    resetButton: {
        backgroundColor: '#6c757d',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    settingsSection: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 15,
        marginBottom: 30,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 8,
        width: 80,
        textAlign: 'center',
    },
    statsSection: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 15,
        marginBottom: 30,
    },
    chart: {
        marginVertical: 15,
        borderRadius: 15,
    },
    tasksSection: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 15,
        marginBottom: 30,
    },
    taskInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 12,
        marginBottom: 15,
    },
    taskItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f8f9fa',
        borderRadius: 10,
        marginBottom: 10,
    },
    selectedTask: {
        backgroundColor: '#e3f2fd',
        borderWidth: 1,
        borderColor: '#007bff',
    },
});

export default Pomodoro;