import { ReactNode } from 'react';
import { View } from "react-native";


type ScreenProps = {
    children: ReactNode;
};

export function Screen({ children }: ScreenProps) {
    return <View className="flex-1 bg-primarybg-servilink pt-4 px-2">{children}</View>;
}