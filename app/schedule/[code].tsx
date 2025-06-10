import {
  getSchedule,
  TrainSchedule,
  TrainScheduleResponse,
} from "@/api/getSchedule";
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

const Schedule: React.FC = () => {
  const [schedule, setSchedule] = useState<TrainSchedule[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { code, name } = useLocalSearchParams();
  const [filteredValue, setFilteredValue] = useState<TrainSchedule[] | null>(null);
  const [activeFilter, setActiveFilter] = useState("");
  const router = useRouter();
  
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
        setFilteredValue(filtered);
      } else {
        setError("Gagal mengambil jadwal kereta.");
      }
    };

    fetchSchedule();
  }, []);

  const onChangeFilter = (value: string) => {
    setActiveFilter(value);
    try {
      if (schedule?.length !== 0) {
        const filtered = schedule?.filter((item) =>
          item.dest.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredValue(value ? filtered || null : schedule);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCardBackgroundColor = (destination: string) => {
    const lowerDest = destination.toLowerCase();
    if (lowerDest.includes("yogyakarta")) return "#E0F2FE"; // biru muda
    if (lowerDest.includes("palur")) return "#FEF3C7"; // kuning muda
    return "#FFFFFF";
  };

  const renderItem = ({ item }: { item: TrainSchedule }) => (
    <View style={[styles.card, { backgroundColor: getCardBackgroundColor(item.dest) }]}>
      <View>
        <Text style={styles.trainName}>{item.ka_name}</Text>
        <Text style={styles.text}>Rute: {item.route_name}</Text>
        <Text style={styles.text}>Dari: {name}</Text>
        <Text style={styles.text}>Tujuan: {item.dest}</Text>
        <Text style={styles.time}>Berangkat: {item.time_est}</Text>
        <Text style={styles.time}>Tiba: {item.dest_time}</Text>
      </View>
      <View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => router.navigate({
            pathname: "/train/[trainid]",
            params: {
              trainid: item.train_id,
              start: name,
              color: getCardBackgroundColor(item.dest),
              finish: item.dest,
            },
          })}
        >
          <Text
            style={styles.filterText}
          >
            Lihat
          </Text>
        </TouchableOpacity>
      </View>
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

  const filters = [
    { label: "Semua", value: "" },
    { label: "Palur", value: "palur" },
    { label: "Yogyakarta", value: "yogyakarta" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Jadwal Kereta • {name}</Text>

      <Text style={styles.filterLabel}>Filter:</Text>
      <View style={styles.filterContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.value}
            style={[
              styles.filterButton,
              activeFilter === filter.value && styles.activeFilterButton,
            ]}
            onPress={() => onChangeFilter(filter.value)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === filter.value && styles.activeFilterText,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredValue}
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
    paddingVertical: 15,
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
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  filterLabel: {
    color: "#111827",
    fontWeight: "500",
    marginBottom: 10,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  filterButton: {
    backgroundColor: "#E5E7EB",
    paddingVertical: 25,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  filterText: {
    color: "#111827",
    fontWeight: "500",
  },
  activeFilterButton: {
    backgroundColor: "#60A5FA",
  },
  activeFilterText: {
    color: "#FFFFFF",
  },
});

export default Schedule;
