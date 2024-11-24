import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

export const useNotifications = (isWork, onComplete) => {
    useEffect(() => {
        const setupNotifications = async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                return;
            }
        };

        setupNotifications();
    }, []);

    const scheduleNotification = async () => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: isWork ? '휴식 시간!' : '작업 시간!',
                body: isWork ?
                    '잠시 휴식을 취하세요.' :
                    '다시 작업을 시작할 시간입니다.',
            },
            trigger: null,
        });
    };

    return { scheduleNotification };
};