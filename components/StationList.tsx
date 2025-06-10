import { useRouter } from 'expo-router';
import React from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import stations from '../constants/station.json';

type Station = {
  code: string;
  name: string;
};

const StationList = () => {
  const router = useRouter();

  const handlePress = (station: Station) => {
    router.navigate({
      pathname: '/schedule/[code]',
      params: {
        code: station.code,
        name: station.name,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Keberangkatan</Text>
      <FlatList
        data={stations}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handlePress(item)}
            style={({ pressed }) => [
              styles.item,
              pressed && styles.itemPressed,
            ]}
          >
            <Text style={styles.text}>{item.name}</Text>
            <Text style={styles.code}>({item.code})</Text>
          </Pressable>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FAFAFA',
      padding: 20,
    },
    heading: {
      fontSize: 22,
      fontWeight: '700',
      marginBottom: 16,
      color: '#4A90E2', // Soft blue
    },
    item: {
      backgroundColor: '#60A5FA',
      padding: 18,
      borderRadius: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 5,
        },
        android: {
          elevation: 1.5,
        },
      }),
    },
    itemPressed: {
      backgroundColor: '#F0F4FF', // Light pastel blue on press
    },
    text: {
      fontSize: 16,
      color: '#ffff',
      fontWeight: '500',
    },
    code: {
      fontSize: 14,
      color: '#ffff',
    },
  });
  

export default StationList;
