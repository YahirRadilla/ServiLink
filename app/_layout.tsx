import { useNotificationListener } from '@/features/notifications/useNotificationListener';
import Toast, { IToast } from '@/shared/components/Toast';
import { useToastStore } from '@/shared/toastStore';
import { StripeProvider } from '@stripe/stripe-react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
export default function RootLayout() {
  useNotificationListener();
  const toastRef = useRef<IToast>(null);
  const setToastRef = useToastStore((s) => s.setToastRef);


  useEffect(() => {
    if (toastRef.current) {
      setToastRef(toastRef.current);
    }
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StripeProvider
        publishableKey="pk_test_51RSvCs2fv0xNPjGzWnfebcbezI6OsGnaMwKZ9RCHq53SCGN81k4XEALcqioHlYNSaIRnnbJFTIXRWwL0Bz7QvENQ009dgJfc7M"
        merchantIdentifier="merchant.com.servilink"
      >
        <SafeAreaProvider>
          <Stack>
            <Stack.Screen name="(app)/(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>


          <Toast ref={toastRef} />

          <StatusBar style="light" />
        </SafeAreaProvider>
      </StripeProvider>
    </GestureHandlerRootView>
  );
}

