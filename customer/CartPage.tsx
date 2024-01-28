import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const CartPage: React.FC = ({ route }) => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [productDetails, setProductDetails] = useState<{ [key: number]: any }>({});
  const { userId } = route.params ?? {}; 

  // State to keep track of the total amount
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const fetchCartDetails = async () => {
    try {
      const response = await fetch(`http://backendfoodorder-prod.us-east-1.elasticbeanstalk.com/api/cart`);
      if (!response.ok) {
        console.error(`Failed to fetch cart details. Status: ${response.status}`);
        return;
      }

      const data = await response.json();
      const userCartItems: CartItem[] = data.filter((item: any) => item.userId === userId);
      setCartItems(userCartItems);

      // Fetch all product details
      const detailsPromises = userCartItems.map((item) => fetchProductDetails(item.productId));
      const details = await Promise.all(detailsPromises);

      // Organize product details in an object
      const detailsObject: { [key: number]: any } = {};
      details.forEach((detail, index) => {
        detailsObject[userCartItems[index].productId] = detail;
      });

      setProductDetails(detailsObject);

      // Calculate and set the total amount
      const total = userCartItems.reduce((acc, item) => acc + parseFloat(item.totalAmount), 0);
      setTotalAmount(total);
    } catch (error) {
      console.error('Error fetching cart details:', error);
    }
  };

  const fetchProductDetails = async (productId: number) => {
    try {
      const response = await fetch(`http://backendfoodorder-prod.us-east-1.elasticbeanstalk.com/api/product/${productId}`);
      if (!response.ok) {
        console.error(`Failed to fetch product details. Status: ${response.status}`);
        return null;
      }

      const data = await response.json();
      console.log('Product details:', data);
      return data;
    } catch (error) {
      console.error('Error fetching product details:', error);
      return null;
    }
  };

  const handleDelete = async (cartId: number) => {
    try {
      const response = await fetch(`http://backendfoodorder-prod.us-east-1.elasticbeanstalk.com/api/cart/${cartId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        console.error(`Failed to delete item. Status: ${response.status}`);
        return;
      }

      // Remove the deleted item from the state
      setCartItems((prevCartItems) => prevCartItems.filter((item) => item.cartId !== cartId));

      // Recalculate and set the total amount after deletion
      const total = cartItems.reduce((acc, item) => acc + parseFloat(item.totalAmount), 0);
      setTotalAmount(total);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch(`http://backendfoodorder-prod.us-east-1.elasticbeanstalk.com/api/order/${userId}/${totalAmount}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId.toString(),
          totalAmount: totalAmount.toFixed(2),
          orderStatus: '', // You might want to set appropriate values here
          deliveryStatus: '',
          ratings: '',
          dtAdded: '',
        }),
      });
  
      if (!response.ok) {
        console.error(`Failed to checkout. Status: ${response.status}`);
        return;
      }
  
      // Display success message
      Alert.alert('Success', 'Checkout successful');
  
      // Clear the cart after successful checkout
      setCartItems([]);
      setTotalAmount(0);
    } catch (error) {
      console.error('Error during checkout:', error);
      // Display error message
      Alert.alert('Error', 'Failed to checkout');
    }
  };

  // useFocusEffect to execute the fetchCartDetails function when the component gains focus
  useFocusEffect(
    React.useCallback(() => {
      fetchCartDetails();
    }, [userId])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Cart Page</Text>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyCartText}>Your cart is empty.</Text>
      ) : (
        cartItems.map((item) => {
          const productDetail = productDetails[item.productId];

          if (!productDetail) {
            return null;
          }

        return (
          <View key={item.cartId} style={styles.cartItem}>
            <Image source={{ uri: productDetail.image }} style={styles.productImage} />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{productDetail.name}</Text>
              <Text style={styles.price}>Price: ${productDetail.price}</Text>
              <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
              <Text style={styles.totalAmount}>Total Amount: ${item.totalAmount}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.cartId)} style={styles.deleteButton}>
              <Icon name="trash-outline" size={25} color="red" />
            </TouchableOpacity>
          </View>
        );
      })
      )}
      {cartItems.length > 0 && (
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total Amount: ${totalAmount.toFixed(2)}</Text>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
      </View>
      )}
    </ScrollView>
  );
};

interface CartItem {
  cartId: number;
  productId: number;
  userId: number;
  price: string;
  quantity: string;
  totalAmount: string;
  dtAdded: string;
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: 'white',
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
    marginBottom: 5,
  },
  quantity: {
    fontSize: 14,
    marginBottom: 5,
  },
  totalAmount: {
    fontSize: 14,
  },
  deleteButton: {
    marginLeft: 10,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyCartText: {
    fontSize: 16,
    color: 'gray',
  },
});


export default CartPage;
