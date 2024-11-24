import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import tw from 'twrnc';

export const Statistics = ({ stats }) => {
    // 현재 데이터의 최대값 계산
    const currentMax = Math.max(...stats.weeklyData.datasets[0].data);

    // 데이터가 없으면 1, 있으면 최대값 + 1을 최대값으로 설정
    const maxY = currentMax === 0 ? 1 : currentMax + 1;

    // Y축 구간 설정 (최대값이 4 이하면 최대값만큼, 그 이상이면 4개 구간)
    const segments = maxY <= 4 ? maxY : 4;

    return (
        <View style={tw`bg-white/80 rounded-xl p-6 mb-6`}>
            <Text style={tw`text-xl font-bold mb-4 text-gray-800`}>통계</Text>

            <View style={tw`flex-row justify-between mb-6`}>
                <View style={tw`items-center`}>
                    <Text style={tw`text-2xl font-bold text-blue-500`}>{stats.totalPomodoros}</Text>
                    <Text style={tw`text-sm text-gray-600`}>완료한 뽀모도로</Text>
                </View>

                <View style={tw`items-center`}>
                    <Text style={tw`text-2xl font-bold text-blue-500`}>{stats.totalFocusTime}</Text>
                    <Text style={tw`text-sm text-gray-600`}>총 집중 시간(분)</Text>
                </View>
            </View>

            <View style={tw`items-center`}>
                <BarChart
                    data={{
                        labels: ['월', '화', '수', '목', '금', '토', '일'],
                        datasets: [{
                            data: stats.weeklyData.datasets[0].data
                        }]
                    }}
                    width={Dimensions.get('window').width - 64}
                    height={220}
                    chartConfig={{
                        backgroundColor: '#ffffff',
                        backgroundGradientFrom: '#ffffff',
                        backgroundGradientTo: '#ffffff',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                        propsForVerticalLabels: {
                            fontSize: 12,
                        },
                        propsForHorizontalLabels: {
                            fontSize: 12,
                        },
                        formatYLabel: (value) => Math.round(value),
                    }}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                    }}
                    showValuesOnTopOfBars={true}
                    fromZero={true}
                    segments={segments}
                    withInnerLines={true}
                />
            </View>
        </View>
    );
};