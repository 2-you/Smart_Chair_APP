import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';

export const Timer = ({
    minutes,
    seconds,
    isWork,
    cycles,
    currentTask,
    colors
}) => {
    return (
        <View style={tw`flex-1`}>
            <LinearGradient
                colors={colors}
                style={tw`absolute inset-0`}
            />
            <View style={styles.timerCard}>
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
        </View>
    );
};