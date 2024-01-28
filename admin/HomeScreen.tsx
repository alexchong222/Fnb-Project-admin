// HomeScreen.tsx
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define the type for the navigation prop
type HomeScreenNavigationProp = StackNavigationProp<any, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const navigateToAdminPage = (screenName: string) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
   
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigateToAdminPage('ManageOrder')}
        >
          <Text style={styles.cardText}>Manage Order</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigateToAdminPage('ManageProducts')}
        >
          <Text style={styles.cardText}>Products</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigateToAdminPage('ManageUsers')}
        >
          <Text style={styles.cardText}>Manage Users</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigateToAdminPage('ManageCategory')}
        >
          <Text style={styles.cardText}>Category</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  card: {
    width: '45%', 
    height: 100,
    backgroundColor: '#007BFF',
    borderRadius: 10,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
