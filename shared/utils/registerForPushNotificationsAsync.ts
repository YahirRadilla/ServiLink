import Constants from 'expo-constants'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { Alert, Platform } from 'react-native'

export async function registerForPushNotificationsAsync(): Promise<string | null> {
    let token: string | null = null

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
            return null
        }

        try {
            const projectId =
                Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId
            if (!projectId) throw new Error('No se encontró el projectId en la configuración')

            token = (await Notifications.getExpoPushTokenAsync({ projectId })).data
            console.log('Expo push token:', token)
        } catch (error) {
            console.error('Error al obtener el token de notificación:', error)
            token = null
        }
    } else {
        Alert.alert('Solo en dispositivos reales', 'Debes usar un dispositivo físico para recibir notificaciones.')
    }

    return token
}
