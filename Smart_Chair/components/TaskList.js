import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import styles from './styles';

export const TaskList = ({ tasks, currentTask, onTaskSelect, onTaskAdd }) => {
    const [newTaskName, setNewTaskName] = useState('');

    const handleAddTask = () => {
        if (newTaskName.trim()) {
            onTaskAdd({
                id: Date.now(),
                name: newTaskName.trim(),
                completed: false
            });
            setNewTaskName('');
        }
    };

    const renderTask = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.taskItem,
                currentTask?.id === item.id && styles.activeTask
            ]}
            onPress={() => onTaskSelect(item)}
        >
            <Text style={[
                styles.taskText,
                item.completed && styles.completedTask
            ]}>
                {item.name}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.taskListContainer}>
            <Text style={styles.sectionTitle}>작업 목록</Text>

            <View style={styles.addTaskRow}>
                <TextInput
                    style={styles.taskInput}
                    value={newTaskName}
                    onChangeText={setNewTaskName}
                    placeholder="새로운 작업 추가"
                />
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddTask}
                >
                    <Text style={styles.addButtonText}>추가</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={tasks}
                renderItem={renderTask}
                keyExtractor={item => item.id.toString()}
                style={styles.taskList}
            />
        </View>
    );
};