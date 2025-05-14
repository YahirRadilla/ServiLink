import { Screen } from '@/components/Screen';
import { useUserStore } from '@/entities/users';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
// @ts-ignore
import Logo from '../../../shared/svg/logo.svg';


export default function Index() {
    const user = useUserStore((state) => state.user);
    console.log(user);

    return (
        <Screen>
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingVertical: 24,
                    paddingHorizontal: 12
                }}
                keyboardShouldPersistTaps="handled"
            >

                <View className='flex-row items-center justify-between'>
                    <View>
                        <Text className='text-white/90 font-bold ml-2 text-base'>Bienvenido</Text>
                        <Text className='text-white text-2xl font-bold ml-2'>{user?.name}</Text>
                    </View>
                    <Logo />
                </View>

            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({

});
