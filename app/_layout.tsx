import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';


export default function RootLayout() {


  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{
          headerShown: true,
          headerTitle: 'ServiLink',
          headerStyle: { backgroundColor: '#170F49' },
          headerTintColor: 'white',
          headerLeft: () => {
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
