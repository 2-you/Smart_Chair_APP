import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import tw from 'twrnc';

export const TaskList = ({
    tasks,
    currentTask,
    onTaskSelect,
    onTaskAdd,
    onTaskDelete
}) => {
    const [newTaskName, setNewTaskName] = useState('');

    const handleAddTask = () => {
        if (newTaskName.trim()) {
            onTaskAdd({
                id: Date.now().toString(),
                name: newTaskName.trim(),
                completedPomodoros: 0,
                estimatedPomodoros: 4,
            });
            setNewTaskName('');
        }
    };

    const handleLongPress = (task) => {
        Alert.alert(
            "작업 삭제",
            `"${task.name}" 작업을 삭제하시겠습니까?`,
            [
                {
                    text: "취소",
                    style: "cancel"
                },
                {
                    text: "삭제",
                    onPress: () => onTaskDelete(task.id),
                    style: "destructive"
                }
            ]
        );
    };

    const renderTask = ({ item }) => (
        <TouchableOpacity
            style={[
                tw`p-4 bg-white rounded-lg mb-2 flex-row justify-between items-center`,
                currentTask?.id === item.id && tw`bg-blue-50 border border-blue-200`
            ]}
            onPress={() => onTaskSelect(item)}
            onLongPress={() => handleLongPress(item)}
            delayLongPress={500}
        >
            <Text style={tw`text-base text-gray-800 flex-1`}>
                {item.name}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={tw`bg-white/80 rounded-xl p-6 mb-6`}>
            <Text style={tw`text-xl font-bold mb-4 text-gray-800`}>
                할 일 목록
            </Text>

            <View style={tw`flex-row mb-4`}>
                <TextInput
                    style={tw`flex-1 p-3 bg-gray-100 rounded-lg mr-2`}
                    value={newTaskName}
                    onChangeText={setNewTaskName}
                    placeholder="새로운 할 일 추가"
                    placeholderTextColor="#999"
                />
                <TouchableOpacity
                    style={tw`px-4 py-3 bg-blue-500 rounded-lg justify-center`}
                    onPress={handleAddTask}
                >
                    <Text style={tw`text-white font-bold`}>추가</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={tasks}
                renderItem={renderTask}
                keyExtractor={item => item.id}
                style={tw`w-full`}
            />
        </View>
    );
};

export default TaskList;