import StationList from '@/components/StationList';
import { SplashScreen } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

const App = () => {
  return (
    <View style={{flex:1}}>
      <StationList />
    </View>
  )
}

export default App