import { ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenProps = {
    children: ReactNode;
};

export function SingleEntityScreen({ children }: ScreenProps) {
    return (
        <SafeAreaView className="flex-1 bg-primarybg-servilink">
            <View className="flex-1">
                {children}
            </View>
        </SafeAreaView>
    );
}
