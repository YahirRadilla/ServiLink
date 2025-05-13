import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, Text, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';


export default function RootLayout() {

  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="(app)/(tabs)" options={{
          headerShown: true,
          headerTitle: '',
          headerStyle: { backgroundColor: '#161622' },
          headerTintColor: 'white',
          headerLeft: () => {
            return (
              <View>
                <Text className='text-white/90 font-bold ml-2 text-base'>Bienvenido</Text>
                <Text className='text-white text-3xl font-bold ml-2'>David</Text>
              </View>
            )
          },
          headerRight: () => {
            return (
              <>
                <Image className='mr-2' source={require('../assets/images/logo.png')} />
              </>
            )
          }
        }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
