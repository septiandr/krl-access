import { TrainSchedule } from "@/api/getTrainTimeList";
import { formatTime } from "@/helper/formatTime";
import { useGetTrainTime } from "@/hooks/useGetTrainTime";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const TrainScheduleList: React.FC = () => {
  const history = useRouter();
  const [schedules, setSchedules] = useState<TrainSchedule[] | null>(null);
  const { trainid, start, color, finish } = useLocalSearchParams();

  const { loading, error, data } = useGetTrainTime(trainid as string);

  useEffect(() => {
    if (data && data.data) {
      setSchedules(data.data);
    } else {
      setSchedules(null);
    }
  }, [data]);

  const renderItem = ({ item }: { item: TrainSchedule }) => (
    <View style={[styles.card, { backgroundColor: "#60A5FA" }]}>
      <Text style={[styles.detailText, { fontWeight: "400", fontSize: 16 }]}>
        {item.station_name}
      </Text>
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

  if (error?.message) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error.message}</Text>
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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
          gap: 8,
          marginHorizontal: 8,
        }}
      >
        <TouchableOpacity
          style={{ paddingTop: 8, paddingRight: 8 }}
          onPress={() => history.back()}
        >
          <AntDesign name="arrowleft" size={24} color="#4A90E2" />
        </TouchableOpacity>
        <Text style={styles.trainName}>
          {String(start).toUpperCase()} - {finish}
        </Text>
      </View>
      <FlatList
        data={schedules}
        keyExtractor={(item) => item.train_id + item.station_id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{
          paddingBottom: 20,
          paddingTop: 20,
          paddingHorizontal: 15,
        }}
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
    textAlign: "center",
    fontWeight: "700",
    color: "#4A90E2",
    marginBottom: 8,
    marginTop: 16,
  },
  detailText: {
    fontSize: 18,
    color: "#fff",
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
