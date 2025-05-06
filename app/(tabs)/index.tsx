import { Screen } from '@/components/Screen';
import { Link } from 'expo-router';
import { StyleSheet, Text } from 'react-native';


export default function HomeScreen() {
  return (
    <Screen>

      <Text className='text-red-700'>
        Hola1
      </Text>
      <Link className='text-red-600' href="/54">
        Holas
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({

});
