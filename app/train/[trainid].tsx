import { getTrainSchedule, TrainSchedule } from "@/api/getTrainTimeList";
import { formatTime } from "@/helper/formatTime";
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

const TrainScheduleList: React.FC = () => {
  const [schedules, setSchedules] = useState<TrainSchedule[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { trainid, start, color, finish } = useLocalSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await getTrainSchedule(trainid as string);
      setLoading(false);

      if (res && res.status === 200) {
        setSchedules(res.data);
      } else {
        setError("Gagal mengambil data jadwal.");
      }
    };

    fetchData();
  }, [trainid]);

  const renderItem = ({ item }: { item: TrainSchedule }) => (
    <View style={[styles.card, { backgroundColor: color as string }]}>
      <Text style={styles.detailText}>{item.station_name}</Text>
      <Text style={styles.detailText}>{formatTime(item.time_est)}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#555" />
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

  if (!schedules || schedules.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Tidak ada jadwal tersedia.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.trainName}>{String(start).toUpperCase()} - {finish}</Text>
      <FlatList
        data={schedules}
        keyExtractor={(item) => item.train_id + item.station_id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{ paddingBottom: 20, paddingTop:20, paddingHorizontal:15 }}
      />
    </SafeAreaView>
  );
};

export default TrainScheduleList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  trainName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    marginTop: 16,
  },
  detailText: {
    fontSize: 18,
    color: "#374151",
    marginBottom: 2,
    fontWeight: "700",
  },
  separator: {
    height: 12,
  },
  loadingText: {
    marginTop: 10,
    color: "#6B7280",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#9CA3AF",
  },
});
