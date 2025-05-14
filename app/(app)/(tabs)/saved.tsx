import { Screen } from '@/components/Screen';
import { StyleSheet, Text } from 'react-native';


export default function Saved() {
  return (
    <Screen>
      <Text className='text-red-700'>
        Hola
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
