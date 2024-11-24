import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';

const PostureCorrection = () => {
    const [currentWeight, setCurrentWeight] = useState(70);
    const [isCorrectPosture, setIsCorrectPosture] = useState(true);
    const [postureData, setPostureData] = useState([
        { date: '1일', correct: 6, incorrect: 2 },
        { date: '2일', correct: 5, incorrect: 3 },
        { date: '3일', correct: 0, incorrect: 0 }
    ]);

    // 실시간 자세 시뮬레이션
    useEffect(() => {
        // 5초마다 자세 상태 변경
        const postureInterval = setInterval(() => {
            setIsCorrectPosture(prev => {
                const newState = Math.random() > 0.3; // 70% 확률로 올바른 자세

                // 현재 날짜의 데이터 업데이트
                setPostureData(prevData => {
                    const newData = [...prevData];
                    const today = newData[2]; // 마지막 인덱스가 오늘

                    // 10초당 1시간으로 계산 (시뮬레이션 용)
                    if (newState) {
                        today.correct += 0.1;
                    } else {
                        today.incorrect += 0.1;
                    }

                    // 소수점 한 자리까지만 표시
                    today.correct = parseFloat(today.correct.toFixed(1));
                    today.incorrect = parseFloat(today.incorrect.toFixed(1));

                    return newData;
                });

                return newState;
            });
        }, 5000); // 5초마다 실행

        return () => {
            clearInterval(postureInterval);
        };
    }, []);

    // 차트 데이터 구성
    const chartData = {
        labels: postureData.map(data => data.date),
        datasets: [
            {
                data: postureData.map(data => data.correct),
                color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`, // 초록색
                strokeWidth: 2
            },
            {
                data: postureData.map(data => data.incorrect),
                color: (opacity = 1) => `rgba(244, 67, 54, ${opacity})`, // 빨간색
                strokeWidth: 2
            }
        ],
        legend: ['올바른 자세', '잘못된 자세']
    };

    // 알림 효과
    useEffect(() => {
        if (!isCorrectPosture) {
            // todo: 진동 알림
            // Vibration.vibrate(500);

            // 콘솔에 경고 메시지
            console.log('자세가 바르지 않습니다! 자세를 교정해주세요.');
        }
    }, [isCorrectPosture]);

    return (
        <LinearGradient
            colors={['#ffffff', '#e1f5fe', '#81d4fa']}
            style={styles.container}
        >
            <View style={styles.statusContainer}>
                <Text style={styles.statusTitle}>현재 자세 상태</Text>
                <View style={[
                    styles.statusIndicator,
                    { backgroundColor: isCorrectPosture ? '#4CAF50' : '#F44336' }
                ]}>
                    <Text style={styles.statusText}>
                        {isCorrectPosture ? '올바른 자세' : '잘못된 자세'}
                    </Text>
                </View>
                {!isCorrectPosture && (
                    <Text style={styles.warningText}>자세가 바르지 않습니다!</Text>
                )}
            </View>

            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>최근 3일 자세 기록</Text>
                <Text style={styles.chartSubtitle}>(단위: 시간)</Text>
                <LineChart
                    data={chartData}
                    width={Dimensions.get('window').width - 40}
                    height={220}
                    yAxisSuffix="h"
                    chartConfig={{
                        backgroundColor: '#ffffff',
                        backgroundGradientFrom: '#ffffff',
                        backgroundGradientTo: '#ffffff',
                        decimalPlaces: 1,
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2"
                        },
                        strokeWidth: 2,
                        useShadowColorFromDataset: true
                    }}
                    bezier
                    style={styles.chart}
                    legend={chartData.legend}
                />
            </View>

            <View style={styles.summaryContainer}>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>오늘의 올바른 자세</Text>
                    <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>
                        {postureData[2].correct}시간
                    </Text>
                </View>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>오늘의 잘못된 자세</Text>
                    <Text style={[styles.summaryValue, { color: '#F44336' }]}>
                        {postureData[2].incorrect}시간
                    </Text>
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    statusContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    statusTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    statusIndicator: {
        padding: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },
    statusText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    chartContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 15,
        borderRadius: 10,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    chartSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
        textAlign: 'center',
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    summaryValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    warningText: {
        color: '#F44336',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    }
});

export default PostureCorrection;
