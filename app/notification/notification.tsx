import Constants from 'expo-constants'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { Stack } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Alert, Button, Platform, Text, View } from 'react-native'

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: false, // add this property
        shouldShowList: false, // add this property
    }),
})

export default function PushNotificationScreen() {
    const [expoPushToken, setExpoPushToken] = useState('')
    const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([])
    const [notification, setNotification] = useState<Notifications.Notification>()
    const notificationListener = useRef<Notifications.Subscription>(null);
    const responseListener = useRef<Notifications.Subscription>(null);

    useEffect(() => {
        registerForPushNotificationsAsync().then((token) => token && setExpoPushToken(token))

        if (Platform.OS === 'android') {
            Notifications.getNotificationChannelsAsync().then((value) => setChannels(value ?? []))
        }

        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
            setNotification(notification)
        })

        responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            console.log('User tapped notification:', response)
        })

        return () => {
            if (notificationListener.current) Notifications.removeNotificationSubscription(notificationListener.current)
            if (responseListener.current) Notifications.removeNotificationSubscription(responseListener.current)
        }
    }, [])

    const handleScheduleNotification = async () => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: '¡Tienes un nuevo mensaje! 📬',
                body: 'Este es el cuerpo de la notificación',
                data: { ejemplo: 'datos extra', test: { clave: 'valor' } },
            },
            trigger: {
                seconds: 2,
                repeats: false,
            } as Notifications.TimeIntervalTriggerInput,
        })

    }

    return (
        <View className="flex-1 bg-gray-900 p-4 pt-16">
            <Stack.Screen options={{ headerShown: false }} />
            <Text className="text-white text-2xl font-bold mb-4">Push Notifications</Text>

            <Text className="text-white text-sm mb-2">Expo Push Token:</Text>
            <Text className="text-gray-300 text-xs mb-4 break-all">{expoPushToken}</Text>

            <Text className="text-white text-sm mb-2">Canales disponibles:</Text>
            <Text className="text-gray-300 text-xs mb-4">{JSON.stringify(channels.map((c) => c.id), null, 2)}</Text>

            <Text className="text-white text-sm mb-2">Última notificación:</Text>
            {notification ? (
                <View className="mb-4">
                    <Text className="text-gray-200">Título: {notification.request.content.title}</Text>
                    <Text className="text-gray-200">Cuerpo: {notification.request.content.body}</Text>
                    <Text className="text-gray-400 text-xs">
                        Data: {JSON.stringify(notification.request.content.data)}
                    </Text>
                </View>
            ) : (
                <Text className="text-gray-500 mb-4">Ninguna aún.</Text>
            )}

            <Button title="Probar notificación local" onPress={handleScheduleNotification} />
        </View>
    )
}

async function registerForPushNotificationsAsync() {
    let token

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        })
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync()
        let finalStatus = existingStatus
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync()
            finalStatus = status
        }
        if (finalStatus !== 'granted') {
            Alert.alert('Permiso requerido', 'No se pudo obtener permisos de notificaciones.')
            return
        }

        try {
            const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId
            if (!projectId) throw new Error('No se encontró el projectId en la configuración')

            token = (await Notifications.getExpoPushTokenAsync({ projectId })).data
            console.log('Expo push token:', token)
        } catch (error) {
            console.error(error)
            token = `Error: ${error}`
        }
    } else {
        Alert.alert('Solo dispositivos reales', 'Debes usar un dispositivo físico para probar notificaciones.')
    }

    return token
}
