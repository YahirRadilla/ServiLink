import { Dimensions, View } from "react-native";
import { BarChart } from "react-native-chart-kit";

export default function StatsChart({ reviews }: { reviews: any[] }) {
    const labels = ["1⭐", "2⭐", "3⭐", "4⭐", "5⭐"];
    const counts = [1, 2, 3, 4, 5].map(
        (n) => reviews.filter((r) => r.rating === n).length
    );

    return (
        <View className="mb-4">
            <BarChart
                data={{
                    labels,
                    datasets: [{ data: counts }],
                }}
                width={Dimensions.get("window").width - 32}
                height={220}
                fromZero
                chartConfig={{
                    backgroundColor: "#fff",
                    backgroundGradientFrom: "#fff",
                    backgroundGradientTo: "#fff",
                    decimalPlaces: 0,
                    color: () => `rgba(54, 99, 235, 1)`,
                    labelColor: () => "#000",
                }}
                yAxisLabel="Rating Count"
                yAxisSuffix=" reviews"
                style={{ borderRadius: 16 }}
            />
        </View>
    );
}
