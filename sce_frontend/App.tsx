import { StyleSheet, StatusBar } from 'react-native';
import React, { FC } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import StudentAddPage from './Components/StudentAddPage';
import StudentDetailsPage from './Components/StudentDetailsPage';
import StudentListPage from './Components/StudentListPage';
import LoginPage from './Components/LoginPage';
import RegisterPage from './Components/RegisterPage';
import UserDetails from './Components/UserDetails';
import EditUserPage from './Components/EditUserPage';
import RecipeUpload from './Components/RecipeUploadPage';
import UserRecipesPage from './Components/UserRecipesPage';
import EditRecipePage from './Components/EditRecipePage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const StudentsListStack = createNativeStackNavigator();

const StudentsListScreen: FC = () => {
  return (
    <StudentsListStack.Navigator>
      <StudentsListStack.Screen name="StudentListPage" component={StudentListPage} options={{ title: 'Students List' }} />
      <StudentsListStack.Screen name="StudentDetailsPage" component={StudentDetailsPage} options={{ title: 'Student Details' }} />
      <StudentsListStack.Screen name="StudentAddPage" component={StudentAddPage} options={{ title: 'Add New Student' }} />
      <StudentsListStack.Screen name="UserDetails" component={UserDetails} options={{ title: 'User Details' }} />
      <StudentsListStack.Screen name="EditUserPage" component={EditUserPage} options={{ title: 'Edit User' }} />
      <StudentsListStack.Screen name="RecipeUpload" component={RecipeUpload} options={{ title: 'Edit User' }} />
      <StudentsListStack.Screen name="UserRecipesPage" component={UserRecipesPage} options={{ title: 'My Recipe' }} />
      <StudentsListStack.Screen name="EditRecipePage" component={EditRecipePage} options={{ title: 'Edit Recipe' }} />

    </StudentsListStack.Navigator>
  );
};

const MainApp: FC = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="StudentsListScreen" component={StudentsListScreen} options={{ headerShown: false }} />
      <Tab.Screen name="UserRecipesPage" component={UserRecipesPage} options={{ title: 'My Recipe' }} />
      <Tab.Screen name="UserDetails" component={UserDetails} options={{ title: 'User Details' }} />

    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterPage} options={{ headerShown: false }} />
        <Stack.Screen name="UserDetails" component={UserDetails} options={{ headerShown: false }} />
        <Stack.Screen name="MainApp" component={MainApp} options={{ headerShown: false }} />
        <Stack.Screen name="EditUserPage" component={EditUserPage} options={{ headerShown: false }} />
        <Stack.Screen name="UserRecipesPage" component={UserRecipesPage} options={{ headerShown: false }} />
        <Stack.Screen name="RecipeUpload" component={RecipeUpload} options={{ headerShown: false }} />
        <Stack.Screen name="EditRecipePage" component={EditRecipePage} options={{ headerShown: false }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
    flex: 1,
    flexDirection: 'column',
  },
});