import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';

export const Timer = ({
    minutes,
    seconds,
    isWork,
    cycles,
    currentTask,
    isActive,
    onToggle,
    onReset,
}) => {
    return (
        <View style={tw`flex-1 items-center justify-center mb-6`}>
            <View style={tw`bg-white/80 rounded-xl p-8 w-full items-center`}>
                <Text style={tw`text-xl font-bold text-gray-800 mb-2`}>
                    {isWork ? '작업 시간' : '휴식 시간'}
                </Text>
                <Text style={tw`text-6xl font-bold text-gray-900 mb-4`}>
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </Text>
                <Text style={tw`text-lg text-gray-600 mb-4`}>
                    완료한 사이클: {cycles}
                </Text>
                {currentTask && (
                    <Text style={tw`text-lg text-gray-600 mb-6`}>
                        현재 작업: {currentTask.name}
                    </Text>
                )}

                <View style={tw`flex-row justify-center`}>
                    <TouchableOpacity
                        style={tw`px-6 py-3 bg-blue-500 rounded-lg mx-1`}
                        onPress={onToggle}
                    >
                        <Text style={tw`text-white font-bold text-lg`}>
                            {isActive ? '일시정지' : '시작'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={tw`px-6 py-3 bg-gray-500 rounded-lg`}
                        onPress={onReset}
                    >
                        <Text style={tw`text-white font-bold text-lg`}>
                            리셋
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};