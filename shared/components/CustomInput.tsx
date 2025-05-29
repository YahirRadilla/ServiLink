import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TextInputProps,
    View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

interface CustomInputProps extends TextInputProps {
    type?: 'text' | 'email' | 'password' | 'number' | 'checkbox' | 'date' | 'select' | 'image' | 'location';
    placeholder?: string;
    className?: string;
    label?: string;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    onDateChange?: (date: Date) => void;
    options?: string[];
    value?: any;
    error?: string;
    onChangeText?: (text: any) => void;
}

export default function CustomInput({
    type = 'text',
    placeholder,
    label,
    checked = false,
    onCheckedChange,
    onDateChange,
    onChangeText,
    value,
    error,
    options = [],
    ...rest
}: CustomInputProps) {
    const [isHidden, setIsHidden] = useState(type === 'password');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [mapVisible, setMapVisible] = useState(false);
    const [pickedLocation, setPickedLocation] = useState<any>(value || null);
    const mapCustomStyle = [ { "elementType": "geometry", "stylers": [ { "color": "#242f3e" } ] }, { "elementType": "labels.text.fill", "stylers": [ { "color": "#746855" } ] }, { "elementType": "labels.text.stroke", "stylers": [ { "color": "#242f3e" } ] }, { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [ { "color": "#d59563" } ] }, { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [ { "color": "#d59563" } ] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [ { "color": "#263c3f" } ] }, { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [ { "color": "#6b9a76" } ] }, { "featureType": "road", "elementType": "geometry", "stylers": [ { "color": "#38414e" } ] }, { "featureType": "road", "elementType": "geometry.stroke", "stylers": [ { "color": "#212a37" } ] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [ { "color": "#9ca5b3" } ] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [ { "color": "#746855" } ] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [ { "color": "#1f2835" } ] }, { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [ { "color": "#f3d19c" } ] }, { "featureType": "transit", "elementType": "geometry", "stylers": [ { "color": "#2f3948" } ] }, { "featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [ { "color": "#d59563" } ] }, { "featureType": "water", "elementType": "geometry", "stylers": [ { "color": "#17263c" } ] }, { "featureType": "water", "elementType": "labels.text.fill", "stylers": [ { "color": "#515c6d" } ] }, { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [ { "color": "#17263c" } ] } ]

    const keyboardType =
        type === 'email' ? 'email-address' :
            type === 'number' ? 'numeric' : 'default';

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) onDateChange?.(selectedDate);
    };

    const handlePickImages = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            const uris = result.assets.map((asset) => asset.uri);
            onChangeText?.([...(value || []), ...uris]);
        }
    };

    const openMap = async () => {
        setLoadingLocation(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            alert('Permiso de ubicación denegado');
            setLoadingLocation(false);
            return;
        }
        const current = await Location.getCurrentPositionAsync({});
        const coords = {
            latitude: current.coords.latitude,
            longitude: current.coords.longitude,
        };
        setPickedLocation(coords);
        setMapVisible(true);
        setLoadingLocation(false);
    };

    const confirmLocation = () => {
        if (pickedLocation) {
            onChangeText?.(pickedLocation);
            setMapVisible(false);
        }
    };

    if (type === 'checkbox') {
        return (
            <Pressable onPress={() => onCheckedChange?.(!checked)} className="flex-row items-center gap-x-2">
                <View className={`w-5 h-5 rounded border border-auth-border-servilink items-center justify-center ${checked ? 'bg-primary-servilink border-primary-servilink' : ''}`}>
                    {checked && <Ionicons name="checkmark" size={14} color="white" />}
                </View>
                <Text className="text-white/90">{label}</Text>
            </Pressable>
        );
    }

    if (type === 'date') {
        return (
            <View className="gap-y-2">
                {label && <Text className="text-white/90 pt-4">{label}</Text>}
                <Pressable onPress={() => setShowDatePicker(true)} className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-500' : 'border-auth-border-servilink'} flex-row justify-between items-center`}>
                    <Text className={`text-white/50 ${!value ? 'italic' : ''}`}>
                        {value instanceof Date && !isNaN(value.getTime())
                        ? dayjs(value).format("DD/MM/YYYY")
                        : placeholder || 'Seleccionar fecha'}
                    </Text>
                    <Ionicons name="calendar-outline" size={22} color="#888" />
                </Pressable>
                {showDatePicker && (
                    <DateTimePicker
                        value={value || new Date()}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}
                {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
            </View>
        );
    }

    if (type === 'select') {
        return (
            <View className="gap-y-2">
                {label && <Text className="text-white/90 pt-4">{label}</Text>}
                <Pressable onPress={() => setShowDropdown(true)} className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-500' : 'border-auth-border-servilink'} flex-row justify-between items-center`}>
                    <Text className={`text-white/90 ${!value ? 'text-white/50 italic' : ''}`}>{value || placeholder || 'Selecciona una opción'}</Text>
                    <Ionicons name="chevron-down-outline" size={20} color="#888" />
                </Pressable>
                {error && <Text className="text-red-500 text-sm">{error}</Text>}
                <Modal visible={showDropdown} transparent animationType="fade">
                    <Pressable className="flex-1 bg-black/50 justify-end" onPress={() => setShowDropdown(false)}>
                        <View className="bg-primarybg-servilink p-4 rounded-t-2xl max-h-[50%]">
                            <FlatList
                                data={options}
                                keyExtractor={(item) => item}
                                renderItem={({ item }) => (
                                    <Pressable onPress={() => { onChangeText?.(item); setShowDropdown(false); }} className="py-3 border-b border-white/10">
                                        <Text className="text-white text-base">{item}</Text>
                                    </Pressable>
                                )}
                            />
                        </View>
                    </Pressable>
                </Modal>
            </View>
        );
    }

    if (type === 'image') {
        return (
            <View className="gap-y-2">
                {label && <Text className="text-white/90 pt-4">{label}</Text>}
                <Pressable onPress={handlePickImages} className={`w-full h-48 rounded-xl border border-auth-border-servilink ${error ? 'border-red-500' : 'border-auth-border-servilink'} items-center justify-center`}>
                    <Ionicons name="cloud-upload-outline" size={32} color="#3D5DC7" />
                    <Text className="text-white/60 mt-2">Seleccionar imágenes</Text>
                </Pressable>
                {Array.isArray(value) && value.length > 0 && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
                        {value.map((uri, index) => (
                            <View key={index} className="relative mr-2">
                                <Image source={{ uri }} className="w-28 h-28 rounded-lg" resizeMode="cover" />
                                <Pressable
                                    onPress={() => {
                                        const newImages = [...value];
                                        newImages.splice(index, 1);
                                        onChangeText?.(newImages);
                                    }}
                                    className="absolute top-1 right-1 bg-black/60 rounded-full p-1"
                                >
                                    <Ionicons name="close" size={16} color="#fff" />
                                </Pressable>
                            </View>
                        ))}
                    </ScrollView>
                )}
                {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
            </View>
        );
    }

    if (type === 'location') {
        return (
            <View className="gap-y-2">
                {label && <Text className="text-white/90 pt-4">{label}</Text>}
                <Pressable onPress={openMap} className={`w-full px-4 py-3 rounded-xl border border-auth-border-servilink ${error ? 'border-red-500' : 'border-auth-border-servilink'} flex-row justify-between items-center`}>
                    <Text className="text-white/50">
                        {value?.latitude && value?.longitude
                            ? `${value.latitude.toFixed(5)}, ${value.longitude.toFixed(5)}`
                            : placeholder || 'Seleccionar ubicación'}
                    </Text>
                    <Ionicons name="location-outline" size={22} color="#888" />
                </Pressable>

                {loadingLocation && <ActivityIndicator className="mt-2" color="white" />}

                <Modal visible={mapVisible} animationType="slide">
                    <View className="flex-1">
                        <MapView
                            customMapStyle={mapCustomStyle}
                            style={{ flex: 1 }}
                            region={{
                                latitude: pickedLocation?.latitude || 24.1443,
                                longitude: pickedLocation?.longitude || -110.3005,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            }}
                            onPress={(e) => setPickedLocation(e.nativeEvent.coordinate)}
                        >
                            {pickedLocation && (
                                <Marker coordinate={pickedLocation} draggable onDragEnd={(e) => setPickedLocation(e.nativeEvent.coordinate)} />
                            )}
                        </MapView>

                        <View className="absolute bottom-8 w-full px-6">
                            <Pressable onPress={confirmLocation} className="bg-links-servilink py-4 rounded-xl">
                                <Text className="text-white text-center font-bold">Confirmar ubicación</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>

                {value?.latitude && (
                    <View className="mt-4 rounded-xl overflow-hidden h-48 w-full">
                        <MapView
                            customMapStyle={mapCustomStyle}
                            style={{ flex: 1 }}
                            region={{
                                latitude: value.latitude,
                                longitude: value.longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            }}
                        >
                            <Marker coordinate={value} />
                        </MapView>
                    </View>
                )}

                {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
            </View>
        );
    }

    return (
        <View className="gap-y-2">
            {label && <Text className="text-white/90 pt-4">{label}</Text>}
            <View className="relative w-full">
                <TextInput
                    className={`w-full px-4 py-3 rounded-xl bg-transparent text-white/90 border ${error ? 'border-red-500' : 'border-auth-border-servilink'} pr-12`}
                    placeholder={placeholder}
                    placeholderTextColor="#888"
                    secureTextEntry={type === 'password' && isHidden}
                    keyboardType={keyboardType}
                    autoCapitalize={type === 'email' ? 'none' : 'sentences'}
                    value={value}
                    onChangeText={onChangeText}
                    {...rest}
                />
                {type === 'password' && (
                    <Pressable onPress={() => setIsHidden(!isHidden)} className="absolute right-4 top-0 bottom-0 justify-center">
                        <Ionicons name={isHidden ? 'eye-off-outline' : 'eye-outline'} size={22} color="#888" />
                    </Pressable>
                )}
            </View>
            {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
        </View>
    );
}
