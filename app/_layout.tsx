import StationList from '@/components/StationList'
import React from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const App = () => {
    const {top} = useSafeAreaInsets()
  return (
    <View style={{marginTop:top, flex:1}}>
      <StationList />
    </View>
  )
}

export default App