import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TabNavigation } from './TabNavigator';
import ReciepeDetailScreen from '../screens/ReciepeDetailScreen';
import SavedItemsScreen from '../screens/SavedItemsScreen';



const Stack = createStackNavigator();

const ScreenStack: React.FC = () => {
    return (

        <Stack.Navigator initialRouteName="TabNavigation" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="TabNavigation" component={TabNavigation} />
            <Stack.Screen name="ReciepeDetailScreen" component={ReciepeDetailScreen} />
            <Stack.Screen name="SavedItemsScreen" component={SavedItemsScreen} />
        </Stack.Navigator>

    );
};

export default ScreenStack;
