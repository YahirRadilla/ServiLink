import { Image, Pressable, Text } from 'react-native';

export function GoogleLoginButton({ onPress }: { onPress: () => void }) {
    return (
        <Pressable
            onPress={onPress}
            className="flex-row items-center justify-center bg-white border border-gray-300 py-3 px-4 rounded-xl w-full shadow-md"
        >
            <Image
                source={require('@/assets/images/google.png')}
                style={{ width: 20, height: 20, marginRight: 8 }}
            />
            <Text className="text-black text-base font-bold">Continúa con Google</Text>
        </Pressable>
    );
}
