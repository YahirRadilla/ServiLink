import Toast, { IToast } from '@/shared/components/Toast';
import { useToastStore } from '@/shared/toastStore';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {

  const toastRef = useRef<IToast>(null);
  const setToastRef = useToastStore((s) => s.setToastRef);


  useEffect(() => {
    if (toastRef.current) {
      setToastRef(toastRef.current);
    }
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="(app)/(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>


        <Toast ref={toastRef} />

        <StatusBar style="light" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

