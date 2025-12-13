import { View, Text } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

const Logo = ({size=32,height=16,width=16}: {size: number;height: number;width: number}) => {
  return (
     <View className={`-rotate-3 bg-primary-100 rounded-xl flex items-center justify-center  border-text-main  w-${width} h-${height}`}>
              <MaterialIcons name="auto-awesome" size={size} color="#1c1c0d" />
            </View>
  )
}

export default Logo