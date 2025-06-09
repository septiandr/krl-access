import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import stations from '../constants/station.json';

type Station = {
    code: string;
    name: string;
};

const StationList = () => {
    const router = useRouter();
    console.log("🚀 ~ StationList ~ router:", router)

    const handlePress = (station :Station) => {
        router.navigate({
            pathname: '/schedule',
            params: {
                code: station.code,
            }
        });
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={stations}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handlePress(item)} style={styles.item}>
                        <Text style={styles.text}>{item.name} ({item.code})</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f8f8',
    },
    item: {
        padding: 16,
        marginVertical: 8,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    text: {
        fontSize: 16,
        color: '#333',
    },
});

export default StationList;