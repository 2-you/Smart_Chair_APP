export const formatTime = (minutes, seconds) => {
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const calculateProgress = (totalSeconds, currentMinutes, currentSeconds) => {
    const remainingSeconds = (currentMinutes * 60) + currentSeconds;
    return 1 - (remainingSeconds / totalSeconds);
};

export const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'noon';
    if (hour >= 17 && hour < 20) return 'evening';
    return 'night';
};