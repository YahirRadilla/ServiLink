import { Screen } from '@/components/Screen';
import { useAuth } from '@/features/auth/useAuth';
import { CustomButton } from '@/shared/components/CustomButton';
import { StyleSheet, Text } from 'react-native';


export default function Profile() {

    const { signOut } = useAuth();

    return (
        <Screen>
            <Text className='text-red-700'>
                Users
            </Text>


            <CustomButton
                className='mt-6'
                label="Cerrar sesion"
                onPress={signOut}
            />
        </Screen>
    );
}

const styles = StyleSheet.create({

});
