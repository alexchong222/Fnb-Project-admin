import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';

type RootStackParamList = {
  ViewOrderDetail: { orderId: number; totalAmount: string };
};

type OrderDetails = {
  orderDetailsId: number;
  orderId: number;
  productId: number;
  quantity: string;
  price: string;
  totalAmount: string;
  dtAdded: string;
};

type ViewOrderDetailScreenRouteProp = RouteProp<RootStackParamList, 'ViewOrderDetail'>;
type ViewOrderDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ViewOrderDetail'>;

interface Props {
  route: ViewOrderDetailScreenRouteProp;
  navigation: ViewOrderDetailScreenNavigationProp;
}

const ViewOrderDetail: React.FC<Props> = ({ route, navigation }) => {
  const { orderId, totalAmount } = route.params;
  const [orderDetails, setOrderDetails] = useState<OrderDetails[]>([]);

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get<OrderDetails[]>(
        `http://backendfoodorder-prod.us-east-1.elasticbeanstalk.com/api/OrderDetails/user/${orderId}`
      );
      setOrderDetails(response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const renderOrderDetailItem = ({ item }: { item: OrderDetails }) => (
    <View style={styles.orderDetailItem}>
      <Text style={styles.detailTitle}>Product ID: {item.productId}</Text>
      <Text>Quantity: {item.quantity}</Text>
      <Text>Price: ${item.price}</Text>
      <Text>Total Amount: RM {item.totalAmount}</Text>
      <Text>Date Added: {item.dtAdded}</Text>
    </View>
  );

  const calculateGrandTotal = () => {
    return orderDetails.reduce((total, item) => total + parseFloat(item.totalAmount), 0).toFixed(2);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Details</Text>
      <Text style={styles.orderId}>Order ID: {orderId}</Text>
      <FlatList
        data={orderDetails}
        renderItem={renderOrderDetailItem}
        keyExtractor={(item) => item.orderDetailsId.toString()}
      />
      <Text style={styles.grandTotal}>Grand Total: RM {calculateGrandTotal()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  orderDetailItem: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'lightgray',
    padding: 16,
    borderRadius: 8,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  grandTotal: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
  },
});

export default ViewOrderDetail;
