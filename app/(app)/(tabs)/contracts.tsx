import { Screen } from '@/components/Screen';
import { TestCard } from '@/shared/components/TestCard';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ContractsScreen() {
    return (
        <Screen>
            <ScrollView>
                <View>
                    <View className="py-6">
                        <Text className='text-white/90 font-bold ml-2 text-base'>12 Propuestas</Text>
                        <Text className='text-white text-2xl font-bold ml-2'>Propuestas</Text>
                    </View>
                </View>
                <View>
                    <TestCard
                        onPress={() => console.log('HOPLA')} 
                        image="" 
                        title="Mesa" 
                        status="pending" 
                        provider="Juan Rodriguez - Carpintería" 
                        date="2025/01/01" 
                        price={1234}
                    />
                    <TestCard
                        onPress={() => console.log('HOPLA')} 
                        image="" 
                        title="Mesa" 
                        status="accepted" 
                        provider="Juan Rodriguez - Carpintería" 
                        date="2025/01/01" 
                        price={1234}
                    />
                    <TestCard
                        onPress={() => console.log('HOPLA')} 
                        image="" 
                        title="Mesa" 
                        status="rejected" 
                        provider="Juan Rodriguez - Carpintería" 
                        date="2025/01/01" 
                        price={1234}
                    />
                    <TestCard
                        onPress={() => console.log('HOPLA')} 
                        image="" 
                        title="Mesa" 
                        status="accepted" 
                        provider="Juan Rodriguez - Carpintería" 
                        date="2025/01/01" 
                        price={1234}
                    />
                    <TestCard
                        onPress={() => console.log('HOPLA')} 
                        image="" 
                        title="Mesa" 
                        status="accepted" 
                        provider="Juan Rodriguez - Carpintería" 
                        date="2025/01/01" 
                        price={1234}
                    />
                    <TestCard
                        onPress={() => console.log('HOPLA')} 
                        image="" 
                        title="Mesa" 
                        status="accepted" 
                        provider="Juan Rodriguez - Carpintería" 
                        date="2025/01/01" 
                        price={1234}
                    />
                    <TestCard
                        onPress={() => console.log('HOPLA')} 
                        image="" 
                        title="Mesa" 
                        status="accepted" 
                        provider="Juan Rodriguez - Carpintería" 
                        date="2025/01/01" 
                        price={1234}
                    />
                    <TestCard
                        onPress={() => console.log('HOPLA')} 
                        image="" 
                        title="Mesa" 
                        status="accepted" 
                        provider="Juan Rodriguez - Carpintería" 
                        date="2025/01/01" 
                        price={1234}
                    />
                    <TestCard
                        onPress={() => console.log('HOPLA')} 
                        image="" 
                        title="Mesa" 
                        status="accepted" 
                        provider="Juan Rodriguez - Carpintería" 
                        date="2025/01/01" 
                        price={1234}
                    />
                </View>
            </ScrollView>
        </Screen>
        
    );   
}

    const styles = StyleSheet.create({


    });