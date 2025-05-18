import React from 'react';
import { Pressable, Text, View } from 'react-native';

export function TopSegmented({ isClient, handleTabPress, activeTab }: { isClient: boolean, handleTabPress: (tab: string) => void, activeTab: string }) {



    return (
        <View className="flex-row items-center bg-[#1b1b1d] rounded-lg overflow-hidden">
            <View className={`flex-1 ${activeTab === 'proposals' && 'bg-links-servilink'} border-r border-white/20`}>
                <Pressable
                    android_ripple={{ color: "#ffffff10" }}
                    className="p-2"
                    onPress={() => handleTabPress('proposals')}
                    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                    <Text className="text-white text-center">Propuestas</Text>
                </Pressable>
            </View>

            <View className={`flex-1 ${activeTab === 'contracts' && 'bg-links-servilink'} border-r border-white/20`}>
                <Pressable
                    android_ripple={{ color: "#ffffff10" }}
                    className="p-2"
                    onPress={() => handleTabPress('contracts')}
                    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                    <Text className="text-white text-center">Contratos</Text>
                </Pressable>
            </View>

            {!isClient && (
                <View className={`flex-1 ${activeTab === 'posts' && 'bg-links-servilink'}`}>
                    <Pressable
                        android_ripple={{ color: "#ffffff10" }}
                        onPress={() => handleTabPress('posts')}
                        className="p-2"
                        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                    >
                        <Text className="text-white text-center">Posts</Text>
                    </Pressable>
                </View>
            )}

        </View>
    )
}