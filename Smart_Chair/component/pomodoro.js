import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const Pomodoro = () => {
    const [minutes, setMinutes] = useState(25);
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
                        // 타이머 종료 시
                        clearInterval(interval);
                        if (isWork) {
                            // 작업 시간 종료 -> 휴식 시간 시작
                            setMinutes(5);
                            setIsWork(false);
                        } else {
                            // 휴식 시간 종료 -> 작업 시간 시작
                            setMinutes(25);
                            setIsWork(true);
                            setCycles(cycles + 1);
                        }
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
    }, [isActive, minutes, seconds, isWork]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setMinutes(25);
        setSeconds(0);
        setIsWork(true);
        setCycles(0);
    };

    return (
        <View style={styles.container}>
            <View style={styles.timerCard}>
                <Text style={styles.statusText}>
                    {isWork ? '작업 시간' : '휴식 시간'}
                </Text>
                <Text style={styles.timerText}>
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </Text>
                <Text style={styles.cycleText}>완료한 사이클: {cycles}</Text>
            </View>

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
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f7',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    timerCard: {
        backgroundColor: '#ffffff',
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
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
});

export default Pomodoro;