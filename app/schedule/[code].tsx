import { getSchedule, TrainSchedule, TrainScheduleResponse } from "@/api/getSchedule";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const Schedule: React.FC = () => {
  const [schedule, setSchedule] = useState<TrainSchedule[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { code, name } = useLocalSearchParams();

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      setError(null);

      const response: TrainScheduleResponse | null = await getSchedule({
        stationId: code as string,
      });

      setLoading(false);

      if (response && response.status === 200) {
        const filtered = response.data.filter(
          (item) => item.color !== "#0084D8"
        );
        setSchedule(filtered);
      } else {
        setError("Gagal mengambil jadwal kereta.");
      }
    };

    fetchSchedule();
  }, []);

  const renderItem = ({ item }: { item: TrainSchedule }) => (
    <View style={styles.card}>
      <Text style={styles.trainName}>{item.ka_name}</Text>
      <Text style={styles.text}>Rute: {item.route_name}</Text>
      <Text style={styles.text}>Dari: {name}</Text>
      <Text style={styles.text}>Tujuan: {item.dest}</Text>
      <Text style={styles.time}>Berangkat: {item.time_est}</Text>
      <Text style={styles.time}>Tiba: {item.dest_time}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#333" />
        <Text style={styles.loadingText}>Memuat jadwal...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!schedule || schedule.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Tidak ada jadwal tersedia.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Jadwal Kereta • {name}</Text>
      <FlatList
        data={schedule}
        keyExtractor={(item) => item.train_id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
    color: "#111827",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  trainName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 2,
  },
  time: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
    marginTop: 4,
  },
  separator: {
    height: 12,
  },
  loadingText: {
    marginTop: 8,
    color: "#4B5563",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
  },
});

export default Schedule;
