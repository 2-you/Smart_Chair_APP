import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Button } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

const PostureCorrection = () => {
    const [currentWeight, setCurrentWeight] = useState(70);
    const [initialWeight, setInitialWeight] = useState(null); // 초기 체중 저장
    const [weightThreshold] = useState(0.03);
    const [isCorrectPosture, setIsCorrectPosture] = useState(true);
    const [postureData, setPostureData] = useState([
        { date: '1일', correct: 0, incorrect: 0 },
        { date: '2일', correct: 0, incorrect: 0 },
        { date: '3일', correct: 0, incorrect: 0 }
    ]);
    const [isMeasuring, setIsMeasuring] = useState(false); // 측정 시작 여부

    const startMeasuring = () => {
        setIsMeasuring(true); // 측정 시작
        setInitialWeight(null); // 초기 체중 초기화
        let weightSum = 0;
        let weightCount = 0;

        const measureInterval = setInterval(async () => {
            try {
                const response = await axios.get('http://192.168.214.64:5000/api/weight');
                const weight = response.data.current_weight;

                if (weight > 0) {
                    weightSum += weight;
                    weightCount += 1;
                }
            } catch (error) {
                console.error('체중 데이터를 가져오는 중 오류 발생:', error);
            }

            if (weightCount >= 5) { // 5초 동안 측정
                clearInterval(measureInterval);
                const averageWeight = weightSum / weightCount; // 평균 체중 계산
                setInitialWeight(averageWeight); // 초기 체중 설정
                console.log('초기 체중:', averageWeight * 1.5);
            }
        }, 1000); // 1초마다 측정
    };

    // 실시간 자세 시뮬레이션
    useEffect(() => {
        const fetchWeight = async () => {
            if (initialWeight !== null) {
                try {
                    const response = await axios.get('http://192.168.214.64:5000/api/weight');
                    const weight = response.data.current_weight;

                    const lowerBound = initialWeight * 0.5; // 5% 낮은 값
                    const upperBound = initialWeight * 1.5; // 5% 높은 값

                    if (weight >= lowerBound && weight <= upperBound) {
                        setCurrentWeight(weight);
                        setIsCorrectPosture(true); // 초기 체중 범위 내에 있을 경우 올바른 자세로 설정
                    } else {
                        setIsCorrectPosture(false); // 초기 체중 범위 밖일 경우 잘못된 자세로 설정
                    }
                    console.log('현재 체중:', weight * 1.5);
                } catch (error) {
                    console.error('체중 데이터를 가져오는 중 오류 발생:', error);
                    setIsCorrectPosture(false); // 오류 발생 시 잘못된 자세로 설정
                }
            }
        };

        let postureInterval;
        if (isMeasuring && initialWeight !== null) {
            postureInterval = setInterval(() => {
                fetchWeight();
            }, 1000);

            return () => {
                clearInterval(postureInterval);
            };
        }
    }, [isMeasuring, initialWeight]);

    // 통계 업데이트
    useEffect(() => {
        if (isMeasuring) {
            setPostureData(prevData => {
                const newData = [...prevData];
                const todayIndex = newData.length - 1; // 오늘의 데이터 인덱스
                if (isCorrectPosture) {
                    newData[todayIndex].correct += 1; // 1시간 단위로 추가
                } else {
                    newData[todayIndex].incorrect += 1; // 1시간 단위로 추가
                }
                return newData;
            });
        }
    }, [isCorrectPosture, isMeasuring]);

    // 통계 표시 부분 수정
    const formatTime = (time) => {
        return (time / 10).toFixed(1); // 10으로 나누고 소수점 1자리로 포맷
    };

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

            <Button title="측정 시작" onPress={startMeasuring} />

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
                        {formatTime(postureData[2].correct)}시간
                    </Text>
                </View>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>오늘의 잘못된 자세</Text>
                    <Text style={[styles.summaryValue, { color: '#F44336' }]}>
                        {formatTime(postureData[2].incorrect)}시간
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
