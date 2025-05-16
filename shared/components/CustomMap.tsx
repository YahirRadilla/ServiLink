import { Dimensions, StyleSheet, View } from "react-native";
import MapView from "react-native-maps";

export default function CustomMap() {
    const { width } = Dimensions.get("window");

    return (
        <View style={[styles.container, { width }]}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 13.0827,
                    longitude: 80.2707,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
                customMapStyle={mapStyle}
                showsUserLocation={true}
                showsMyLocationButton={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 200,
        borderRadius: 20,
        overflow: "hidden",
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

const mapStyle = [
    {
        elementType: "geometry",
        stylers: [{ color: "#f5f5f5" }],
    },
    {
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }],
    },
    {
        elementType: "labels.text.fill",
        stylers: [{ color: "#616161" }],
    },
    {
        elementType: "labels.text.stroke",
        stylers: [{ color: "#f5f5f5" }],
    },
    {
        featureType: "administrative.land_parcel",
        stylers: [{ visibility: "off" }],
    },
    {
        featureType: "poi",
        stylers: [{ visibility: "off" }],
    },
    {
        featureType: "road",
        stylers: [{ color: "#ffffff" }],
    },
    {
        featureType: "road.arterial",
        stylers: [{ color: "#eeeeee" }],
    },
    {
        featureType: "road.highway",
        stylers: [{ color: "#dadada" }],
    },
    {
        featureType: "water",
        stylers: [{ color: "#c9c9c9" }],
    },
];
