import React from 'react';
import { View, Text } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import styles from './styles';

export const Statistics = ({ stats }) => {
    return (
        <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>통계</Text>

            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{stats.totalPomodoros}</Text>
                    <Text style={styles.statLabel}>완료한 뽀모도로</Text>
                </View>

                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{stats.totalFocusTime}</Text>
                    <Text style={styles.statLabel}>총 집중 시간</Text>
                </View>
            </View>

            <View style={styles.chartContainer}>
                <BarChart
                    data={stats.weeklyData}
                    width={300}
                    height={200}
                    chartConfig={{
                        backgroundColor: '#ffffff',
                        backgroundGradientFrom: '#ffffff',
                        backgroundGradientTo: '#ffffff',
                        color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
                    }}
                />
            </View>
        </View>
    );
};