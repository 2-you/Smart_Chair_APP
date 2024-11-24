import React from 'react';
import { View, Text, Switch, TextInput } from 'react-native';
import styles from './styles';

export const Settings = ({ settings, onSettingsChange }) => {
    const handleChange = (key, value) => {
        onSettingsChange({
            ...settings,
            [key]: value
        });
    };

    return (
        <View style={styles.settingsContainer}>
            <Text style={styles.sectionTitle}>설정</Text>

            <View style={styles.settingRow}>
                <Text>작업 시간 (분)</Text>
                <TextInput
                    style={styles.input}
                    value={String(settings.workTime)}
                    onChangeText={(value) => handleChange('workTime', parseInt(value) || 0)}
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.settingRow}>
                <Text>짧은 휴식 시간 (분)</Text>
                <TextInput
                    style={styles.input}
                    value={String(settings.shortBreakTime)}
                    onChangeText={(value) => handleChange('shortBreakTime', parseInt(value) || 0)}
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.settingRow}>
                <Text>긴 휴식 시간 (분)</Text>
                <TextInput
                    style={styles.input}
                    value={String(settings.longBreakTime)}
                    onChangeText={(value) => handleChange('longBreakTime', parseInt(value) || 0)}
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.settingRow}>
                <Text>집중 모드</Text>
                <Switch
                    value={settings.focusModeEnabled}
                    onValueChange={(value) => handleChange('focusModeEnabled', value)}
                />
            </View>
        </View>
    );
};