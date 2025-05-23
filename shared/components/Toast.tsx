import { Ionicons } from '@expo/vector-icons';
import React, { Ref, useImperativeHandle, useRef, useState } from 'react';
import { LayoutChangeEvent, StyleSheet } from 'react-native';
import Animated, {
    Easing,
    Extrapolation,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming
} from 'react-native-reanimated';

export interface IToast {
    show: (text: string, type: 'info' | 'success' | 'error', duration: number) => void;
    hide: (callback?: () => void) => void;
}

type ConfigProps = {
    text?: string;
    type?: 'info' | 'success' | 'error';
    duration: number;
}

interface Props {
    ref: Ref<IToast>;
    duration?: number;
    onHide?: () => void;
}

const Toast: React.FC<Props> = React.forwardRef(({ duration = 400, onHide }, ref) => {
    const [textLength, setTextLength] = useState(0);
    const [toastHeight, setToastHeight] = useState(0);
    const [config, setConfig] = useState<ConfigProps>({
        text: undefined,
        type: undefined,
        duration: 0
    });

    const visibleState = useRef(false);
    const timer = useRef<number | null>(null);

    const transY = useSharedValue(-100);
    const textOpacity = useSharedValue(0);
    const iconTranslate = useSharedValue(0);

    useImperativeHandle(ref, () => ({
        show,
        hide
    }));

    const rView = useAnimatedStyle(() => ({
        transform: [{ translateY: transY.value }],
        opacity: interpolate(transY.value, [-toastHeight, 80], [0, 1], Extrapolation.CLAMP)
    }), [toastHeight]);

    const rInnerView = useAnimatedStyle(() => {
        const backgroundColor = config.type === 'success' ? '#1f8503' : config.type === 'error' ? '#f00a1d' : '#0077ed';

        return {
            alignSelf: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 40
        };
    }, [config]);

    const rIcon = useAnimatedStyle(() => ({
        transform: [{ translateX: iconTranslate.value }],
        opacity: interpolate(transY.value, [-100, 80], [0, 1])
    }));

    const rText = useAnimatedStyle(() => ({
        opacity: textOpacity.value
    }));

    return (
        <Animated.View onLayout={handleViewLayout} style={[styles.container, rView]}>
            <Animated.View style={rInnerView}>
                <Animated.View style={rIcon}>{generateIcon()}</Animated.View>
                {config.text && (
                    <Animated.Text
                        onLayout={handleTextLayout}
                        style={[styles.text, rText, { marginLeft: 8 }]}
                    >
                        {config.text}
                    </Animated.Text>
                )}
            </Animated.View>
        </Animated.View>
    );

    function show(text: string, type: 'info' | 'success' | 'error', duration: number) {
        if (timer.current) clearTimeout(timer.current);

        // Reinicia valores
        transY.value = -100;
        iconTranslate.value = 0;
        textOpacity.value = 0;
        visibleState.current = true;

        // Primero colocamos texto en DOM para medir ancho
        setConfig({ text, type, duration });

        // Usamos un pequeño delay para esperar layout
        setTimeout(() => {
            // Aparece toast
            transY.value = withTiming(80, { duration: 300 });

            // Luego desplazamos ícono y mostramos texto
            iconTranslate.value = withDelay(300, withTiming(-textLength / 2, { duration: 300 }));
            textOpacity.value = withDelay(300, withTiming(1, { duration: 300 }));

            // Luego de duración total, animamos salida
            timer.current = setTimeout(() => {
                textOpacity.value = withTiming(0, { duration: 200 });
                iconTranslate.value = withTiming(0, { duration: 200 });
                hideToast();
            }, duration);
        }, 50); // pequeño delay para permitir layout y medir ancho de texto
    }


    function hide(callback?: () => void) {
        hideToast(callback);
    }

    function generateIcon() {
        let iconName: keyof typeof Ionicons.glyphMap = "information-circle-outline";
        const color = "white";

        if (config?.type === "success") {
            iconName = "checkmark-circle-outline";
        } else if (config?.type === "error") {
            iconName = "close-circle-outline";
        }

        return <Ionicons name={iconName} size={20} color={color} />;
    }

    function hideToast(callback?: () => void) {
        if (timer.current) clearTimeout(timer.current);

        transY.value = withDelay(150, withTiming(-toastHeight || -100, {
            duration: 300,
            easing: Easing.bezierFn(0.36, 0, 0.66, -0.56)
        }, () => {
            runOnJS(handleOnFinish)(callback);
        }));
    }

    function handleOnFinish(callback?: () => void) {
        setConfig({ text: undefined, type: undefined, duration: 0 });
        if (onHide) onHide();
        if (callback) setTimeout(callback, 100);
        visibleState.current = false;
    }

    function handleTextLayout(event: LayoutChangeEvent) {
        const width = Math.floor(event.nativeEvent.layout.width);
        if (textLength !== width) setTextLength(width);
    }

    function handleViewLayout(event: LayoutChangeEvent) {
        const height = event.nativeEvent.layout.height;
        if (toastHeight !== height) setToastHeight(height);
    }
});

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 100
    },
    text: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
        textAlign: 'center'
    }
});

export default Toast;
