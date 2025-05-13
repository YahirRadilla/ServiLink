import { Screen } from '@/components/Screen';
import { Link } from 'expo-router';
import { StyleSheet, Text } from 'react-native';


export default function IndexScreen() {
  /*   const user = useUserStore((state) => state.user);
  
    useUserStore.getState().setUser(emptyUser);
   */
  return (
    <Screen>

      <Text className='text-red-700'>
        Hola
      </Text>
      <Link className='text-red-600' href="/54">
        Holas
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({

});
