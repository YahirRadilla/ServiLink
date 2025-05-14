import { Image, Pressable, Text, View } from 'react-native';

type TestCardProps = {
    onPress: () => void;
    image: string;
    title: string;
    status: 'accepted' | 'pending' | 'rejected';
    provider: string;
    date: string;
    price: number;
};

export function TestCard({ 
    onPress,
    image,
    title,
    status,
    provider,
    date,
    price,
}: TestCardProps) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                { opacity: pressed ? 0.8 : 1 },
            ]}>
            <View className="flex-row w-full rounded-xl p-3 gap-x-4 items-center h-28 mb-6">
                <View>
                    <Image source={{ uri: image }} className = "w-28 h-28 rounded-xl bg-black  " resizeMode="cover" />
                </View>

                <View className="flex-1 justify-end h-full">
                        <View className="flex-row items-center gap-x-2 h-full ">
                            <Text className="text-white font-semibold text-2xl">{title}</Text>
                            <View className={`px-3 py-1.5 rounded-xl ${status === 'accepted' ? 'bg-active-status-servilink/40': status === 'pending' ? 'bg-pending-status-servilink/40': 'bg-finished-status-servilink/40'}`}>
                                <Text className={`text-white text-xs font-bold uppercase ${status === 'accepted' ? 'text-active-status-servilink': status === 'pending' ? 'text-pending-status-servilink':'text-finished-status-servilink'}`}>{status}</Text>
                            </View>
                        </View>
                        <View className="flex-col">
                            <Text className="text-white/90 text-sm">{provider}</Text>
                            <Text className="text-white/90 text-xs">{date}</Text>
                        </View>
                </View>

                <View className="h-full justify-between items-end">
                    <Image source={{ uri: image }} className = "align- w-6 h-6 bg-black  " resizeMode="cover" />
                    <Text className="text-links-servilink font-bold text-base">${price}</Text>
                </View>
            </View>
            
        </Pressable>
    );
}