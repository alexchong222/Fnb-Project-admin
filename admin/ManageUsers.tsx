import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import Modal from 'react-native-modal';
import { Alert } from 'react-native';


const API_BASE_URL = 'http://backendfoodorder-prod.us-east-1.elasticbeanstalk.com/api/user';

interface UserData {
  userId: number;
  email: string;
  password: string;
  userLevel: string;
  dtAdded: string;
}

const ManageUsersScreen: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [newUserEmail, setNewUserEmail] = useState<string>('');
  const [newUserPassword, setNewUserPassword] = useState<string>('');
  const [updatedEmail, setUpdatedEmail] = useState<string>('');
  const [updatedPassword, setUpdatedPassword] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userIdToUpdate, setUserIdToUpdate] = useState<number | null>(null);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get<UserData[]>(API_BASE_URL);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const addUser = async () => {
    try {

      if (!newUserEmail.trim() || !newUserPassword.trim()) {
        Alert.alert('Error', 'Email and Password cannot be empty.');
        return;
      }
      const response = await axios.post<UserData>(API_BASE_URL, {
        email: newUserEmail,
        password: newUserPassword,
      });
      const data: UserData = response.data;
      setUsers([...users, data]);
      setNewUserEmail('');
      setNewUserPassword('');
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const deleteUser = async (userId: number) => {
    try {
      // Display a confirmation alert before deleting
      Alert.alert(
        'Confirm Deletion',
        'Are you sure you want to delete this user?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: async () => {
              await axios.delete(`${API_BASE_URL}/${userId}`);
              setUsers(users.filter((user) => user.userId !== userId));
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

 

  const updateUser = (userId: number) => {
    try {
      const userToUpdate = users.find((user) => user.userId === userId);
  
      if (!userToUpdate) {
        console.error('User not found for update');
        return;
      }
  
      // Set the initial values for the input fields
      setUpdatedEmail(userToUpdate.email);
      setUpdatedPassword(userToUpdate.password);
      setUserIdToUpdate(userId);
  
      // Open the modal
      toggleModal();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  
  const handleUpdate = async () => {
    try {
      if (userIdToUpdate === null) {
        console.error('User ID to update is null');
        return;
      }
      if (!updatedEmail.trim() || !updatedPassword.trim()) {
        Alert.alert('Error', 'Email and Password cannot be empty.');
        return;
      }
  
      // Fetch the current user data
      const currentUserResponse = await axios.get<UserData>(`${API_BASE_URL}/${userIdToUpdate}`);
      const currentUser: UserData = currentUserResponse.data;
  
      // Make the update request with the provided values
      const response = await axios.put<UserData>(
        `${API_BASE_URL}/${userIdToUpdate}`,
        {
          userId: userIdToUpdate, // Include userId in the request body
          email: updatedEmail,
          password: updatedPassword,
          userLevel: currentUser.userLevel, // Use the current userLevel
          dtAdded: currentUser.dtAdded, // Use the current dtAdded
        }
      );
  
      const updatedUser: UserData = response.data;
  
      // Update the state with the modified user
      setUsers((prevUsers) => {
        return prevUsers.map((user) =>
          user.userId === userIdToUpdate ? { ...user, ...updatedUser } : user
        );
      });
  
      // Close the modal
      toggleModal();
  
      // Refresh the user data
      await fetchUserData();
  
      // Show success message
      Alert.alert('Success', 'User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
  
      // Show error message
      Alert.alert('Error', 'Failed to update user. Please try again.');
    }
  };
  
  
  
  
  return (
    <View style={styles.container}>
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Update User</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Enter email"
            value={updatedEmail}
            onChangeText={(text) => setUpdatedEmail(text)}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Enter password"
            value={updatedPassword}
            onChangeText={(text) => setUpdatedPassword(text)}
          />
          <View style={styles.modalButtonContainer}>
            <Button title="Cancel" onPress={toggleModal} />
            <Button title="Update" onPress={handleUpdate} />
          </View>
        </View>
      </Modal>

      <Text style={styles.title}>Manage Users</Text>

      <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        value={newUserEmail}
        onChangeText={(text) => setNewUserEmail(text)}
      />
    </View>

    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Enter password"
        value={newUserPassword}
        onChangeText={(text) => setNewUserPassword(text)}
      />
    </View>

    <View style={styles.buttonContainer}>
      <Button title="Add User" onPress={addUser} />
      
    </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.userItem}>
          <Text style={[styles.tableHeader, { flex: 1 }]}>UserID</Text>
          <Text style={[styles.tableHeader, { flex: 2 }]}>Email</Text>
          <Text style={[styles.tableHeader, { flex: 2 }]}>Password</Text>
          <Text style={[styles.tableHeader, { flex: 2 }]}>Actions</Text>
        </View>

        {users.map((item) => (
          <View key={item.userId} style={styles.userItem}>
            <Text style={{ flex: 1 }}>{item.userId}</Text>
            <Text style={{ flex: 2 }}>{item.email}</Text>
            <Text style={{ flex: 2 }}>{item.password}</Text>
            <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => updateUser(item.userId)}><Text>Update</Text></TouchableOpacity>


              <TouchableOpacity style={styles.button} onPress={() => deleteUser(item.userId)}>
                <Text>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    marginStart: 20,
    marginEnd: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    marginStart: 20,
    marginEnd: 20,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom:10,
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    padding: 8,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 5,
  },
  scrollView: {
    width: '90%',
    marginStart: 13,
    marginEnd: 13,
  },
  tableHeader: {
    fontWeight: 'bold',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ManageUsersScreen;
