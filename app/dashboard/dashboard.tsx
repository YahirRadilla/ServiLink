import { SingleEntityScreen } from "@/components/SingleEntityScreen";
import { useDashboard } from "@/features/dashboard/useDashboard";
import BackButton from "@/shared/components/BackButton";
import KpiCard from "@/shared/components/KpiCard";
import { Stack } from "expo-router";
import LottieView from "lottie-react-native";
import { Dimensions, ScrollView, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";

export default function DashboardScreen() {
    const { data, loading } = useDashboard();

    if (loading || !data) {
        return (
            <SingleEntityScreen>
                <Stack.Screen options={{ headerShown: false }} />
                <View className="flex-1 justify-center items-center bg-primarybg-servilink px-4">
                    <LottieView
                        source={require("@/assets/animations/loading.json")}
                        autoPlay
                        loop
                        style={{ width: 120, height: 120 }}
                    />
                    <Text className="text-white/60 mt-4 text-base">Cargando Dashboard...</Text>
                </View>
            </SingleEntityScreen>
        );
    }

    const screenWidth = Dimensions.get("window").width - 32;

    return (
        <SingleEntityScreen>
            <View className="flex-row items-center justify-between w-full p-4">
                <View className="flex-row items-center">
                    <View className="bg-black/50 p-2 rounded-full mr-2">
                        <BackButton />
                    </View>
                    <Text
                        numberOfLines={2}
                        style={{ maxWidth: "60%" }}
                        ellipsizeMode="tail"
                        className="font-semibold text-lg text-white"
                    >
                        Dashboard ServiLink
                    </Text>
                </View>
            </View>

            <ScrollView className="p-4">
                {/* KPIs RÁPIDOS */}
                <View className="mt-2">
                    {/* SECCIÓN: Propuestas */}
                    <Text className="text-white text-base font-semibold mb-2">Propuestas</Text>
                    <View className="flex-row flex-wrap justify-between mb-4">
                        <KpiCard title="Total" value={data.proposalsTotal} />
                        <KpiCard title="Aceptadas" value={data.proposalsAccepted} />
                        <KpiCard title="Rechazadas" value={data.proposalsRejected} />
                        <KpiCard title="Pendientes" value={data.proposalsPending} />
                        <KpiCard title="Resp. Prom. (hrs)" value={data.avgResponseTime.toFixed(2)} full />
                    </View>

                    {/* SECCIÓN: Contratos */}
                    <Text className="text-white text-base font-semibold mb-2">Contratos</Text>
                    <View className="flex-row flex-wrap justify-between mb-4">
                        <KpiCard title="Activos" value={data.contractsActive} />
                        <KpiCard title="Finalizados" value={data.contractsFinished} />
                        <KpiCard title="Ofertas por contrato" value={data.avgOffersPerContract.toFixed(2)} full />
                    </View>

                    {/* SECCIÓN: Reseñas */}
                    <Text className="text-white text-base font-semibold mb-2">Reseñas</Text>
                    <View className="flex-row flex-wrap justify-between mb-4">
                        <KpiCard title="Total" value={data.totalReviews} />
                        <KpiCard title="Promedio" value={data.avgRating.toFixed(2)} />
                        <KpiCard title="Negativas" value={data.negativeReviews} />
                    </View>

                    {/* SECCIÓN: Pagos */}
                    <Text className="text-white text-base font-semibold mb-2">Pagos</Text>
                    <View className="flex-row flex-wrap justify-between mb-2">
                        <KpiCard title="Exitosos" value={data.totalSuccessfulPayments} />
                        <KpiCard title="Total Recaudado" value={`$${(data.totalRevenue / 100).toFixed(2)} MXN`} full />
                    </View>
                </View>


                {/* RESEÑAS POR ESTRELLA */}
                <View className="mb-10">
                    <Text className="text-white text-lg font-semibold">Distribución de Calificaciones</Text>
                    <BarChart
                        data={{
                            labels: data.reviewsStats?.map((r) => `${r.star}⭐`) || [],
                            datasets: [{ data: data.reviewsStats?.map((r) => r.count) || [] }],
                        }}
                        width={screenWidth}
                        height={220}
                        fromZero
                        yAxisLabel=""
                        yAxisSuffix=""
                        chartConfig={{
                            backgroundColor: "#1e1e1e",
                            backgroundGradientFrom: "#1e1e1e",
                            backgroundGradientTo: "#1e1e1e",
                            decimalPlaces: 0,
                            color: () => `rgba(59, 130, 246, 1)`,
                            labelColor: () => "#fff",
                        }}
                        style={{ borderRadius: 16 }}
                    />
                </View>
                {/* ALERTA */}
                {data.negativeReviews > 5 && (
                    <View className="bg-red-100 border-l-4 border-red-500 p-3 mt-6 rounded-md">
                        <Text className="text-red-800 font-semibold">⚠ Atención</Text>
                        <Text className="text-red-700 text-sm">
                            Hay más de 5 reseñas negativas. Considera evaluar los servicios contratados recientemente.
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SingleEntityScreen>
    );
}
