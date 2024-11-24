import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    // Timer 스타일
    timerCard: {
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        margin: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    timerText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#333',
    },
    statusText: {
        fontSize: 18,
        color: '#666',
        marginBottom: 10,
    },
    cycleText: {
        fontSize: 16,
        color: '#666',
        marginTop: 10,
    },
    currentTaskText: {
        fontSize: 16,
        color: '#4A90E2',
        marginTop: 10,
    },

    // Settings 스타일
    settingsContainer: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        margin: 15,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 5,
        width: 60,
        textAlign: 'center',
    },

    // Statistics 스타일
    statsContainer: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        margin: 15,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4A90E2',
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    chartContainer: {
        alignItems: 'center',
        marginTop: 20,
    },

    // TaskList 스타일
    taskListContainer: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        margin: 15,
    },
    addTaskRow: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    taskInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
    },
    addButton: {
        backgroundColor: '#4A90E2',
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    taskItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    activeTask: {
        backgroundColor: '#f0f9ff',
    },
    taskText: {
        fontSize: 16,
        color: '#333',
    },
    completedTask: {
        textDecorationLine: 'line-through',
        color: '#999',
    },

    // 공통 스타일
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
});