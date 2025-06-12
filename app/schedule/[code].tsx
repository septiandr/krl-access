import { TrainSchedule } from "@/api/getSchedule";
import { filters, timeFilters } from "@/constants/filter";
import { filterSchedule } from "@/helper/filterStation";
import { formatTime } from "@/helper/formatTime";
import { getCardBackgroundColor } from "@/helper/getCardBackgroundColor";
import { useSchedule } from "@/hooks/useGetSchedule";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Schedule: React.FC = () => {
  const [schedule, setSchedule] = useState<TrainSchedule[] | null>(null);
  console.log("🚀 ~ schedule:", schedule)
  const { code, name } = useLocalSearchParams();
  const [filteredValue, setFilteredValue] = useState<TrainSchedule[] | null>(
    null
  );

  const { loading, error } = useSchedule({ stationId: code }, (data) =>
    setSchedule(data?.data ?? null)
);

  const [activeFilter, setActiveFilter] = useState("");
  const [activeTimeFilter, setActiveTimeFilter] = useState("");
  const router = useRouter();

  const onChangeFilter = (value: string) => {
    setActiveFilter(value);
    try {
      if (schedule?.length !== 0) {
        const filtered = filterSchedule(schedule, value, activeTimeFilter);
        setFilteredValue(value ? filtered || null : schedule);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onChangeTimeFilter = (value: string) => {
    try {
      setActiveTimeFilter(value);
      if (schedule?.length !== 0) {
        const timeFilterList = filterSchedule(schedule, activeFilter, value);
        setFilteredValue(timeFilterList || null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (schedule && schedule.length > 0) {
      setFilteredValue(schedule);
    }
  }, [schedule]);

  const renderItem = ({ item }: { item: TrainSchedule }) => (
    <View
      style={[
        styles.card,
        { backgroundColor: getCardBackgroundColor(item.dest) },
      ]}
    >
      <View style={{ flex: 3 }}>
        <Text style={styles.text}>
          {String(name).toUpperCase()} - {item.dest}
        </Text>
        <Text style={styles.time}>Berangkat: {formatTime(item.time_est)}</Text>
        <Text style={styles.time}>Tiba: {formatTime(item.dest_time)}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: "#4A90E2" }]}
          onPress={() =>
            router.navigate({
              pathname: "/train/[trainid]",
              params: {
                trainid: item.train_id,
                start: name,
                color: getCardBackgroundColor(item.dest),
                finish: item.dest,
              },
            })
          }
        >
          <Text style={[styles.filterText, { color: "#fff" }]}>View</Text>
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

  if (error?.message) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error.message}</Text>
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
    <View style={styles.container}>
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
          style={{ paddingRight: 8 }}
          onPress={() => router.back()}
        >
          <AntDesign name="arrowleft" size={24} color="#4A90E2" />
        </TouchableOpacity>
        <Text style={styles.title}>Stasiun {name}</Text>
      </View>

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
      <Text style={styles.filterLabel}>Time Filter:</Text>
      <View style={styles.filterContainer}>
        {timeFilters.map((filter) => (
          <TouchableOpacity
            key={filter.value}
            style={[
              styles.filterButton,
              activeTimeFilter === filter.value && styles.activeFilterButton,
              { paddingVertical: 8, paddingHorizontal: 25 },
            ]}
            onPress={() => onChangeTimeFilter(filter.value)}
          >
            <Text
              style={[
                styles.filterText,
                activeTimeFilter === filter.value && styles.activeFilterText,
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
    </View>
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
    color: "#4A90E2",
  },
  card: {
    borderRadius: 12,
    gap: 10,
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
    fontSize: 16,
    color: "#4A90E2",
    marginBottom: 2,
    fontWeight: "700", // Menambahkan gaya teks bold untuk dest
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
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  filterText: {
    color: "#111827",
    fontWeight: "600",
  },
  activeFilterButton: {
    backgroundColor: "#60A5FA",
  },
  activeFilterText: {
    color: "#FFFFFF",
  },
});

export default Schedule;
