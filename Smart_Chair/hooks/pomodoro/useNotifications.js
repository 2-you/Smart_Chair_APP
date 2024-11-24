import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

// 알림 설정
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export const useNotifications = () => {
    useEffect(() => {
        const setupNotifications = async () => {
            try {
                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;

                if (existingStatus !== 'granted') {
                    const { status } = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }

                if (finalStatus !== 'granted') {
                    console.log('알림 권한이 거부되었습니다.');
                    return;
                }
            } catch (error) {
                console.log('알림 설정 중 오류:', error);
            }
        };

        setupNotifications();
    }, []);

    const scheduleNotification = async (isWork) => {
        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: isWork ? '휴식 시간!' : '작업 시간!',
                    body: isWork ?
                        '잠시 휴식을 취하세요.' :
                        '다시 작업을 시작할 시간입니다.',
                    sound: 'default',
                },
                trigger: null,  // 즉시 알림
            });
        } catch (error) {
            console.log('알림 예약 중 오류:', error);
        }
    };

    return { scheduleNotification };
};