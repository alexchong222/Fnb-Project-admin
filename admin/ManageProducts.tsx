import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
} from 'react-native';



const API_BASE_URL = 'http://backendfoodorder-prod.us-east-1.elasticbeanstalk.com/api/product';

interface Category {
  categoryId: number;
  name: string;
  desc: string;
}

interface Product {
  productId: number;
  name: string;
  desc: string;
  price: string;
  stock: string;
  category: string;
  image: string;
}

const ManageProductScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProductName, setNewProductName] = useState<string>('');
  const [newProductDesc, setNewProductDesc] = useState<string>('');
  const [newProductPrice, setNewProductPrice] = useState<string>('');
  const [newProductStock, setNewProductStock] = useState<string>('');
  const [newProductCategory, setNewProductCategory] = useState<string>('');
  const [newProductImage, setNewProductImage] = useState<string>('');

  const [ModalProductName, setModalProductName] = useState<string>('');
  const [ModalProductDesc, setModalProductDesc] = useState<string>('');
  const [ModalProductPrice, setModalProductPrice] = useState<string>('');
  const [ModalProductStock, setModalProductStock] = useState<string>('');
  const [ModalProductCategory, setModalProductCategory] = useState<string>('');
  const [ModalProductImage, setModalProductImage] = useState<string>('');

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCategoryDialogVisible, setIsCategoryDialogVisible] = useState(false);
  const [isCategoryDialogVisible2, setIsCategoryDialogVisible2] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addProduct = async () => {
    try {
      // Check for empty fields
      if (!newProductName || !newProductDesc || !newProductPrice || !newProductStock || !newProductCategory || !newProductImage) {
        Alert.alert('Error', 'All fields are required');
        return;
      }
  
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newProductName,
          desc: newProductDesc,
          price: newProductPrice,
          stock: newProductStock,
          category: newProductCategory,
          image: newProductImage,
        }),
      });
      const data: Product = await response.json();
      setProducts([...products, data]);
      // Clear input fields after adding a product
      setNewProductName('');
      setNewProductDesc('');
      setNewProductPrice('');
      setNewProductStock('');
      setNewProductCategory('');
      setNewProductImage('');
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const deleteProduct = async (productId: number) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this product?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await fetch(`${API_BASE_URL}/${productId}`, {
                method: 'DELETE',
              });
              setProducts(products.filter((product) => product.productId !== productId));
            } catch (error) {
              console.error('Error deleting product:', error);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const updateProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);

    // Populate input fields with current values when Update button is clicked
    setModalProductName(product.name);
    setModalProductDesc(product.desc);
    setModalProductPrice(product.price);
    setModalProductStock(product.stock);
    setModalProductCategory(product.category);
    setModalProductImage(product.image);
  };

  const handleUpdate = async () => {
    try {
      if (!ModalProductName || !ModalProductDesc || !ModalProductPrice || !ModalProductStock || !ModalProductCategory || !ModalProductImage) {
        Alert.alert('Error', 'All fields are required');
        return;
      }

      if (!selectedProduct) {
        console.error('Selected product is null');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/${selectedProduct.productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: selectedProduct.productId,
          name: ModalProductName || selectedProduct.name,
          desc: ModalProductDesc || selectedProduct.desc,
          price: ModalProductPrice || selectedProduct.price,
          stock: ModalProductStock || selectedProduct.stock,
          category: ModalProductCategory || selectedProduct.category,
          image: ModalProductImage || selectedProduct.image,
        }),
      });

      const updatedProduct: Product = await response.json();

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.productId === updatedProduct.productId ? updatedProduct : product
        )
      );

      setIsModalVisible(false);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const [categories, setCategories] = useState<Category[]>([]);
 

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://backendfoodorder-prod.us-east-1.elasticbeanstalk.com/api/category');
        const categoriesData = await response.json();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const renderCategoryRadioButtons = () => (
    <View>
      {categories.map((category) => (
        <TouchableOpacity key={category.categoryId} onPress={() => setModalProductCategory(category.name)}>
          <Text style={styles.categoryOption}>{category.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderCategoryRadioButtons2 = () => (
    <View>
      {categories.map((category) => (
        <TouchableOpacity key={category.categoryId} onPress={() => setNewProductCategory(category.name)}>
          <Text style={styles.categoryOption}>{category.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

        

  return (
    <View style={styles.container}>
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Update Product</Text>
          <TextInput
            style={styles.modalInput}
            placeholder={`Product Name: ${selectedProduct?.name}`}
            value={ModalProductName}
            onChangeText={(text) => setModalProductName(text)}
          />
          <TextInput
            style={styles.modalInput}
            placeholder={`Product Description: ${selectedProduct?.desc}`}
            value={ModalProductDesc}
            onChangeText={(text) => setModalProductDesc(text)}
          />
          <TextInput
            style={styles.modalInput}
            placeholder={`Product Price: ${selectedProduct?.price}`}
            value={ModalProductPrice}
            onChangeText={(text) => setModalProductPrice(text)}
          />
          <TextInput
            style={styles.modalInput}
            placeholder={`Product Stock: ${selectedProduct?.stock}`}
            value={ModalProductStock}
            onChangeText={(text) => setModalProductStock(text)}
          />
          <TouchableOpacity onPress={() => setIsCategoryDialogVisible(true)}>
            <Text style={styles.modalInput}>
              Category: {ModalProductCategory || selectedProduct?.category}
            </Text>
          </TouchableOpacity>
          <TextInput
            style={styles.modalInput}
            placeholder={`Product Image URL: ${selectedProduct?.image}`}
            value={ModalProductImage}
            onChangeText={(text) => setModalProductImage(text)}
          />
          <View style={styles.modalButtonContainer}>
            <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
            <Button title="Update" onPress={handleUpdate} />
          </View>
        </View>
      </Modal>

      <Modal
  visible={isCategoryDialogVisible}
  transparent
  animationType="slide"
  onRequestClose={() => setIsCategoryDialogVisible(false)}
>
  <View style={styles.categoryDialogContainer}>
    <Text style={styles.modalTitle}>Select Category</Text>
    {renderCategoryRadioButtons()}
    <Button title="Close" onPress={() => setIsCategoryDialogVisible(false)} />
  </View>
</Modal>

<Modal
  visible={isCategoryDialogVisible2}
  transparent
  animationType="slide"
  onRequestClose={() => setIsCategoryDialogVisible2(false)}
>
  <View style={styles.categoryDialogContainer}>
    <Text style={styles.modalTitle}>Select Category</Text>
    {renderCategoryRadioButtons2()}
    <Button title="Close" onPress={() => setIsCategoryDialogVisible2(false)} />
  </View>
</Modal>

     

      <Text style={styles.title}>Manage Products</Text>

      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={newProductName}
        onChangeText={(text) => setNewProductName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Product Description"
        value={newProductDesc}
        onChangeText={(text) => setNewProductDesc(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Product Price"
        value={newProductPrice}
        onChangeText={(text) => setNewProductPrice(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Product Stock"
        value={newProductStock}
        onChangeText={(text) => setNewProductStock(text)}
      />
      <TouchableOpacity onPress={() => setIsCategoryDialogVisible2(true)}>
            <Text style={styles.modalInput}>
              Category: {newProductCategory || selectedProduct?.category}
            </Text>
          </TouchableOpacity>

          
      <TextInput
        style={styles.input}
        placeholder="Product Image URL"
        value={newProductImage}
        onChangeText={(text) => setNewProductImage(text)}
      />

      <Button title="Add Product" onPress={addProduct} />

      <FlatList
        data={products}
        keyExtractor={(item) => item.productId.toString()}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productTitle}>Product Name: {item.name}</Text>
              <Text style={styles.productTitle}>Description: {item.desc}</Text>
              <Text style={styles.productTitle}>Price: {item.price}</Text>
              <Text style={styles.productTitle}>Stock: {item.stock}</Text>
              <Text style={styles.productTitle}>Category: {item.category}</Text>

              {/* Move Delete and Update buttons here */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => deleteProduct(item.productId)}>
                  <Text style={styles.deleteButton}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => updateProduct(item)}>
                  <Text style={styles.updateButton}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
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
  input: {
    height: 40,
    width: 300,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 8,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 5,
    width: '95%',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  productInfo: {
    flex: 1,
    marginLeft: 10,
  },
  productTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  deleteButton: {
    backgroundColor: 'lightblue',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    fontWeight: 'bold',
  },
  updateButton: {
    backgroundColor: 'lightblue',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    fontWeight: 'bold',
  },

  modalContainer: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 10,
    marginTop: 100,
    margin: 40,
  },
  categoryOption: {
    fontSize: 18,
    borderWidth: 1,  // Add border width
    borderColor: 'lightgray',  // Set border color
    borderRadius: 5,  // Add border radius for rounded corners
    padding: 10,  // Add padding for better spacing
    marginVertical: 10,
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

  categoryDialogContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 'auto', 
    marginTop: 'auto',// Push the modal to the bottom
    margin: 20,
    padding: 20,
    maxHeight: '80%', // Set a maximum height
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'flex-start', // Align items to the start
  },
});

export default ManageProductScreen;
