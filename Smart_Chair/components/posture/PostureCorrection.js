import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';

const PostureCorrection = () => {
    const [currentWeight, setCurrentWeight] = useState(70); // 기본값
    const [weightHistory, setWeightHistory] = useState([]);
    const [isCorrectPosture, setIsCorrectPosture] = useState(true);

    // 올바른 자세 범위 계산
    const minWeight = currentWeight * 0.97; // -3%
    const maxWeight = currentWeight * 1.03; // +3%

    useEffect(() => {
        // 무게 데이터 시뮬레이션 (실제로는 센서에서 데이터를 받아와야 함)
        const mockWeightData = [
            { date: '6/1', weight: 69 },
            { date: '6/2', weight: 71 },
            { date: '6/3', weight: 72 },
        ];
        setWeightHistory(mockWeightData);

        // 실시간 무게 감지 시뮬레이션
        const interval = setInterval(() => {
            const simulatedWeight = currentWeight + (Math.random() * 6 - 3);
            setIsCorrectPosture(simulatedWeight >= minWeight && simulatedWeight <= maxWeight);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

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
            </View>

            <View style={styles.weightRangeContainer}>
                <Text style={styles.rangeText}>올바른 자세 범위:</Text>
                <Text style={styles.rangeValues}>
                    {minWeight.toFixed(1)}kg ~ {maxWeight.toFixed(1)}kg
                </Text>
            </View>

            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>최근 3일 무게 기록</Text>
                <LineChart
                    data={{
                        labels: weightHistory.map(data => data.date),
                        datasets: [{
                            data: weightHistory.map(data => Number(data.weight) || 0)
                        }]
                    }}
                    width={Dimensions.get('window').width - 40}
                    height={220}
                    yAxisSuffix="kg"
                    chartConfig={{
                        backgroundColor: '#ffffff',
                        backgroundGradientFrom: '#ffffff',
                        backgroundGradientTo: '#ffffff',
                        decimalPlaces: 1,
                        color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: "#2196f3"
                        }
                    }}
                    bezier
                    style={styles.chart}
                />
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
    weightRangeContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 15,
        borderRadius: 10,
        marginBottom: 30,
    },
    rangeText: {
        fontSize: 16,
        marginBottom: 5,
    },
    rangeValues: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2196f3',
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
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    }
});

export default PostureCorrection;
