import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AdminPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>This Admin Page</Text>
      <Text>This is a simple Admin Page.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default AdminPage;
