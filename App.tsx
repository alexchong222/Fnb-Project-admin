import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './admin/HomeScreen';
import AdminPage from './admin/AdminPage';
import ManageOrder from './admin/ManageOrder';
import ManageUsers from './admin/ManageUsers';
import ManageProducts from './admin/ManageProducts';
import ManageCategory from './admin/ManageCategory';
import ViewOrderDetail from './ViewOrderDetail';
import CustomerHomePage from './customer/Homepage';
import ProductDetailPage from './customer/ProductDetailPage';
import Login from './Login';
import Register from './Register';


// Define the RootStackParamList
export type RootStackParamList = {
  Home: undefined;
  AdminPage: undefined;
  ManageOrder: undefined;
  ManageUsers: undefined;
  ManageProducts: undefined;
  ManageCategory: undefined;
  CustomerHomePage: undefined;
  ProductDetailPage: { productId:number, userId: number };
  ViewOrderDetail: { orderId: number; totalAmount?: string };
  Login: { userId: number };
  Register: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CustomerHomePage" component={CustomerHomePage} />
        <Stack.Screen name="AdminPage" component={AdminPage} />
        <Stack.Screen name="ManageOrder" component={ManageOrder} />
        <Stack.Screen name="ManageUsers" component={ManageUsers} />
        <Stack.Screen name="ManageProducts" component={ManageProducts} />
        <Stack.Screen name="ManageCategory" component={ManageCategory} />
        <Stack.Screen name="ProductDetailPage" component={ProductDetailPage} />
        <Stack.Screen name="ViewOrderDetail" component={ViewOrderDetail} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
