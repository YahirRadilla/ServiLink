import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable } from 'react-native';

export default function SaveButton() {
    const [saved, setSaved] = React.useState(false);

    return (
        <Pressable onPress={() => setSaved(!saved)}>
            <Ionicons
                name={saved ? "bookmark" : "bookmark-outline"}
                size={26}
                color={saved ? "#ffd700" : "#eff0f6"}
            />
        </Pressable>
    );
}
