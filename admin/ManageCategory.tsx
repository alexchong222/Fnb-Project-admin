import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import Modal from 'react-native-modal';
import { Alert } from 'react-native';

const API_BASE_URL = 'http://backendfoodorder-prod.us-east-1.elasticbeanstalk.com/api/category';

interface CategoryData {
  categoryId: number;
  name: string;
  desc: string;
}

const ManageCategoryScreen: React.FC = () => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [newCategoryDesc, setNewCategoryDesc] = useState<string>('');
  const [updatedCategoryName, setUpdatedCategoryName] = useState<string>('');
  const [updatedCategoryDesc, setUpdatedCategoryDesc] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [categoryIdToUpdate, setCategoryIdToUpdate] = useState<number | null>(null);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);

  const fetchCategoryData = async () => {
    try {
      const response = await axios.get<CategoryData[]>(API_BASE_URL);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const addCategory = async () => {
    try {
      if (!newCategoryName || !newCategoryDesc) {
        // Show error message if name or description is empty
        Alert.alert('Error', 'Name and description are required fields.');
        return;
      }
  
      const response = await axios.post<CategoryData>(API_BASE_URL, {
        name: newCategoryName,
        desc: newCategoryDesc,
      });
      const data: CategoryData = response.data;
      setCategories([...categories, data]);
      setNewCategoryName('');
      setNewCategoryDesc('');
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const deleteCategory = async (categoryId: number) => {
    try {
      // Display a confirmation alert before deleting
      Alert.alert(
        'Confirm Deletion',
        'Are you sure you want to delete this category?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: async () => {
              await axios.delete(`${API_BASE_URL}/${categoryId}`);
              setCategories(categories.filter((category) => category.categoryId !== categoryId));
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const updateCategory = (categoryId: number) => {
    try {
      const categoryToUpdate = categories.find((category) => category.categoryId === categoryId);

      if (!categoryToUpdate) {
        console.error('Category not found for update');
        return;
      }

      // Set the initial values for the input fields
      setUpdatedCategoryName(categoryToUpdate.name);
      setUpdatedCategoryDesc(categoryToUpdate.desc);
      setCategoryIdToUpdate(categoryId);

      // Open the modal
      toggleModal();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      if (categoryIdToUpdate === null) {
        console.error('Category ID to update is null');
        return;
      }
      if (!updatedCategoryName || !updatedCategoryDesc) {
        // Show error message if name or description is empty
        Alert.alert('Error', 'Name and description are required fields.');
        return;
      }

      // Fetch the current category data
      const currentCategoryResponse = await axios.get<CategoryData>(`${API_BASE_URL}/${categoryIdToUpdate}`);
      const currentCategory: CategoryData = currentCategoryResponse.data;

      // Make the update request with the provided values
      const response = await axios.put<CategoryData>(
        `${API_BASE_URL}/${categoryIdToUpdate}`,
        {
          categoryId: categoryIdToUpdate, // Include categoryId in the request body
          name: updatedCategoryName,
          desc: updatedCategoryDesc,
        }
      );

      const updatedCategory: CategoryData = response.data;

      // Update the state with the modified category
      setCategories((prevCategories) => {
        return prevCategories.map((category) =>
          category.categoryId === categoryIdToUpdate ? { ...category, ...updatedCategory } : category
        );
      });

      // Close the modal
      toggleModal();

      // Refresh the category data
      await fetchCategoryData();

      // Show success message
      Alert.alert('Success', 'Category updated successfully!');
    } catch (error) {
      console.error('Error updating category:', error);

      // Show error message
      Alert.alert('Error', 'Failed to update category. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Update Category</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Enter name"
            value={updatedCategoryName}
            onChangeText={(text) => setUpdatedCategoryName(text)}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Enter description"
            value={updatedCategoryDesc}
            onChangeText={(text) => setUpdatedCategoryDesc(text)}
          />
          <View style={styles.modalButtonContainer}>
            <Button title="Cancel" onPress={toggleModal} />
            <Button title="Update" onPress={handleUpdate} />
          </View>
        </View>
      </Modal>

      <Text style={styles.title}>Manage Categories</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter name"
          value={newCategoryName}
          onChangeText={(text) => setNewCategoryName(text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter description"
          value={newCategoryDesc}
          onChangeText={(text) => setNewCategoryDesc(text)}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Add Category" onPress={addCategory} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.categoryItem}>
          <Text style={[styles.tableHeader, { flex: 1 }]}>CategoryID</Text>
          <Text style={[styles.tableHeader, { flex: 2 }]}>Name</Text>
          <Text style={[styles.tableHeader, { flex: 2 }]}>Description</Text>
          <Text style={[styles.tableHeader, { flex: 2 }]}>Actions</Text>
        </View>

        {categories.map((item) => (
          <View key={item.categoryId} style={styles.categoryItem}>
            <Text style={{ flex: 1 }}>{item.categoryId}</Text>
            <Text style={{ flex: 2 }}>{item.name}</Text>
            <Text style={{ flex: 2 }}>{item.desc}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => updateCategory(item.categoryId)}>
                <Text>Update</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={() => deleteCategory(item.categoryId)}>
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
      marginBottom: 10,
    },
    button: {
      backgroundColor: 'lightblue',
      padding: 10,
      margin: 5,
      borderRadius: 5,
    },
    categoryItem: {
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

  export default ManageCategoryScreen;
