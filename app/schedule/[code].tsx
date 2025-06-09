import { getSchedule, TrainSchedule, TrainScheduleResponse } from "@/api/getSchedule";
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";


const Schedule: React.FC = () => {
  const [schedule, setSchedule] = useState<TrainSchedule[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { code } = useLocalSearchParams();
  console.log("🚀 ~ code:", code)


  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      setError(null);

      const response: TrainScheduleResponse | null = await getSchedule({ stationId: code as string });

      setLoading(false);

      if (response && response.status === 200) {
        setSchedule(response.data);
      } else {
        setError("Gagal mengambil jadwal kereta.");
      }
    };

    fetchSchedule();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading jadwal...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  if (!schedule || schedule.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Tidak ada jadwal kereta.</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: TrainSchedule }) => (
    <View style={[styles.itemContainer, { backgroundColor: item.color || "#eee" }]}>
      <Text style={styles.trainName}>{item.ka_name}</Text>
      <Text>Rute: {item.route_name}</Text>
      <Text>Tujuan: {item.dest}</Text>
      <Text>Estimasi Berangkat: {item.time_est}</Text>
      <Text>Waktu Tiba: {item.dest_time}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={styles.title}>Jadwal Kereta</Text>
      <FlatList
        data={schedule}
        keyExtractor={(item) => item.train_id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  itemContainer: {
    padding: 12,
    borderRadius: 8,
  },
  trainName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
});

export default Schedule;
