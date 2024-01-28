import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import Modal from 'react-native-modal';
import { Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App'; 

const API_BASE_URL = 'http://backendfoodorder-prod.us-east-1.elasticbeanstalk.com/api/order';

interface OrderData {
  orderId: number;
  userId: number;
  totalAmount: string;
  orderStatus: string;
  deliveryStatus: string;
  ratings: string;
  dtAdded: string;
}

type ManageOrderScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ManageOrder'>;

type Props = {
  navigation: ManageOrderScreenNavigationProp;
};

const ManageOrderScreen: React.FC<Props> = ({ navigation }) => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orderIdToUpdate, setOrderIdToUpdate] = useState<number | null>(null);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  useEffect(() => {
    fetchOrderData();
  }, []);

  const fetchOrderData = async () => {
    try {
      const response = await axios.get<OrderData[]>(API_BASE_URL);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      // Retrieve the order data before updating
      const currentOrder = orders.find((order) => order.orderId === orderId);

      if (!currentOrder) {
        console.error('Order not found for update');
        return;
      }

      // Create the JSON body with updated status
      const updatedOrderData = {
        orderId: currentOrder.orderId,
        userId: currentOrder.userId,
        totalAmount: currentOrder.totalAmount,
        orderStatus: newStatus, // Updated status
        deliveryStatus: currentOrder.deliveryStatus,
        ratings: currentOrder.ratings,
        dtAdded: currentOrder.dtAdded,
      };

      // Make the update request with the provided values
      const response = await axios.put<OrderData>(
        `${API_BASE_URL}/${newStatus}/${orderId}`,
        updatedOrderData
      );

      const updatedOrder: OrderData = response.data;

      setOrders((prevOrders) => {
        return prevOrders.map((order) =>
          order.orderId === orderId ? { ...order, ...updatedOrder } : order
        );
      });

      Alert.alert('Success', 'Order status updated successfully!');
    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert('Error', 'Failed to update order status. Please try again.');
    }
  };

  const viewOrderDetails = (orderId: number, totalAmount: string) => {
    // Pass both orderId and totalAmount to the ViewOrderDetail screen
    navigation.navigate('ViewOrderDetail', { orderId, totalAmount });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Orders</Text>

      <ScrollView style={styles.scrollView}>
        <View style={styles.orderItem}>
          <Text style={[styles.tableHeader, { flex: 1 }]}>OrderID</Text>
          <Text style={[styles.tableHeader, { flex: 2 }]}>Total Amount</Text>
          <Text style={[styles.tableHeader, { flex: 2 }]}>Order Status</Text>
          <Text style={[styles.tableHeader, { flex: 2 }]}>Delivery Status</Text>
          <Text style={[styles.tableHeader, { flex: 2 }]}>Actions</Text>
        </View>

        {orders.map((item) => (
          <View key={item.orderId} style={styles.orderItem}>
            <Text style={{ flex: 1 }}>{item.orderId}</Text>
            <Text style={{ flex: 2 }}>{item.totalAmount}</Text>
            <Text style={{ flex: 2 }}>{item.orderStatus}</Text>
            <Text style={{ flex: 2 }}>{item.deliveryStatus}</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => viewOrderDetails(item.orderId, item.totalAmount)}>
              <Text>Details</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setOrderIdToUpdate(item.orderId);
                toggleModal();
              }}>
              <Text>Manage</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Manage Order Status</Text>
          <View style={styles.modalButtonContainer}>
            <View style={styles.modalButton}>
              <Button
                title="Complete Order"
                onPress={() => {
                  updateOrderStatus(orderIdToUpdate || 0, 'complete');
                  toggleModal();
                }}
              />
            </View>
            <View style={styles.modalButton}>
              <Button
                title="Cancel Order"
                onPress={() => {
                  updateOrderStatus(orderIdToUpdate || 0, 'cancel');
                  toggleModal();
                }}
              />
            </View>
            <View style={styles.modalButton}>
              <Button
                title="Cancel"
                onPress={() => {
                  toggleModal();
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  orderItem: {
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
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  modalButton: {
    flex: 0.5, // Equal width for each button
    margin: 1,
  },
  tableHeader: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 10,
    margin: 3,
    borderRadius: 5,
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
});

export default ManageOrderScreen;
