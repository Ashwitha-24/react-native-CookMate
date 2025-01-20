import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RecipeChat from '../screens/ReciepeChat';


const Tab = createBottomTabNavigator();

export const TabNavigation = () => {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="ReciepeChat" component={RecipeChat} />
        </Tab.Navigator>
    );
};
