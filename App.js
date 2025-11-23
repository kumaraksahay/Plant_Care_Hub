// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import SignUpScreen from './SignUpScreen';
// import SignInScreen from './SignInScreen';
// import DashboardScreen from './DashboardScreen';
// import ResetPasswordScreen from './ResetPasswordScreen';
// import WelcomeScreen from './WelcomeScreen';
// import AdminDashboardScreen from './AdminDashboardScreen';
// import ManageProductsScreen from './ManageProductsScreen';
// import AddProductScreen from './AddProductScreen';
// import UpdateProductScreen from './UpdateProductScreen';
// import DeleteProductScreen from './DeleteProductScreen';
// import ReminderScreen from './ReminderScreen';
// import ChatScreen from './ChatScreen';
// import ProductDetailsScreen from './ProductDetailsScreen';
// import BuyProductScreen from './BuyProductScreen';
// import CartScreen from './CartScreen';
// import ManageOrdersScreen from './ManageOrdersScreen';
// import CareGuideScreen from './CareGuideScreen';
// import PlantCareDetailScreen from './PlantCareDetailScreen';
// import DiseaseDetailScreen from './DiseaseDetailScreen';
// import AddReminderScreen from './AddReminderScreen';
// import EditReminderScreen from './EditReminderScreen';
// import ReminderHistoryScreen from './ReminderHistoryScreen';
// import FindPlantScreen from './FindPlantScreen';
// const Stack = createStackNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
//         <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
//         <Stack.Screen name="SignInScreen" component={SignInScreen} />
//         <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
//         <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
//         <Stack.Screen name="AdminDashboardScreen" component={AdminDashboardScreen} />
//         <Stack.Screen name="ManageProductsScreen" component={ManageProductsScreen} />
//         <Stack.Screen name="ManageOrdersScreen" component={ManageOrdersScreen} />
//         <Stack.Screen name="AddProductScreen" component={AddProductScreen} />
//         <Stack.Screen name="ProductDetailsScreen" component={ProductDetailsScreen} />
//         <Stack.Screen name="UpdateProductScreen" component={UpdateProductScreen} />
//         <Stack.Screen name="DeleteProductScreen" component={DeleteProductScreen} />
//         <Stack.Screen name="BuyProductScreen" component={BuyProductScreen} />
//         <Stack.Screen name="CartScreen" component={CartScreen} />
//         <Stack.Screen name="ReminderScreen" component={ReminderScreen} />
//         <Stack.Screen name="ChatScreen" component={ChatScreen} />
//         <Stack.Screen name="CareGuideScreen" component={CareGuideScreen} />
//         <Stack.Screen name="PlantCareDetailScreen" component={PlantCareDetailScreen} />
//         <Stack.Screen name="DiseaseDetailScreen" component={DiseaseDetailScreen} />
//         <Stack.Screen name="AddReminderScreen" component={AddReminderScreen} />
//         <Stack.Screen name="EditReminderScreen" component={EditReminderScreen} />
//         <Stack.Screen name= "ReminderHistoryScreen" component={ReminderHistoryScreen}/>
//         <Stack.Screen name= 'FindPlantScreen' component={FindPlantScreen}/>
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }




import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SignUpScreen from './SignUpScreen';
import SignInScreen from './SignInScreen';
import DashboardScreen from './DashboardScreen';
import ResetPasswordScreen from './ResetPasswordScreen';
import WelcomeScreen from './WelcomeScreen';
import AdminDashboardScreen from './AdminDashboardScreen';
import ManageProductsScreen from './ManageProductsScreen';
import AddProductScreen from './AddProductScreen';
import UpdateProductScreen from './UpdateProductScreen';
import DeleteProductScreen from './DeleteProductScreen';
import ReminderScreen from './ReminderScreen';
import ChatScreen from './ChatScreen';
import ProductDetailsScreen from './ProductDetailsScreen';
import BuyProductScreen from './BuyProductScreen';
import CartScreen from './CartScreen';
import ManageOrdersScreen from './ManageOrdersScreen';
import CareGuideScreen from './CareGuideScreen';
import PlantCareDetailScreen from './PlantCareDetailScreen';
import DiseaseDetailScreen from './DiseaseDetailScreen';
import AddReminderScreen from './AddReminderScreen';
import EditReminderScreen from './EditReminderScreen';
import ReminderHistoryScreen from './ReminderHistoryScreen';
import FindPlantScreen from './FindPlantScreen';
import ResultScreen from './ResultScreen';
import SettingsScreen from './SettingsScreen';
import AddPlantScreen from './AddPlantScreen';
import MyPlantsScreen from './MyPlantsScreen';
import AnimationScreen from './AnimationScreen';


const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
          <Stack.Screen name="SignInScreen" component={SignInScreen} cooking />
          <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
          <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
          <Stack.Screen name="AdminDashboardScreen" component={AdminDashboardScreen} />
          <Stack.Screen name="ManageProductsScreen" component={ManageProductsScreen} />
          <Stack.Screen name="ManageOrdersScreen" component={ManageOrdersScreen} />
          <Stack.Screen name="AddProductScreen" component={AddProductScreen} />
          <Stack.Screen name="ProductDetailsScreen" component={ProductDetailsScreen} />
          <Stack.Screen name="UpdateProductScreen" component={UpdateProductScreen} />
          <Stack.Screen name="DeleteProductScreen" component={DeleteProductScreen} />
          <Stack.Screen name="BuyProductScreen" component={BuyProductScreen} />
          <Stack.Screen name="CartScreen" component={CartScreen} />
          <Stack.Screen name="ReminderScreen" component={ReminderScreen} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          <Stack.Screen name="CareGuideScreen" component={CareGuideScreen} />
          <Stack.Screen name="PlantCareDetailScreen" component={PlantCareDetailScreen} />
          <Stack.Screen name="DiseaseDetailScreen" component={DiseaseDetailScreen} />
          <Stack.Screen name="AddReminderScreen" component={AddReminderScreen} />
          <Stack.Screen name="EditReminderScreen" component={EditReminderScreen} />
          <Stack.Screen name="ReminderHistoryScreen" component={ReminderHistoryScreen} />
          <Stack.Screen name="FindPlantScreen" component={FindPlantScreen} />
          <Stack.Screen name="ResultScreen" component={ResultScreen} />
          <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
          <Stack.Screen name="AddPlantScreen" component={AddPlantScreen} />
          <Stack.Screen name="MyPlantsScreen" component={MyPlantsScreen} />
          <Stack.Screen name="AnimationScreen" component={AnimationScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}