import * as Notifications from 'expo-notifications'

export async function showLocalNotification(title: string, body: string, data?: any) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            data: data || {}
        },
        trigger: {
            seconds: 2,
            repeats: false,
        } as Notifications.TimeIntervalTriggerInput,
    })
}
