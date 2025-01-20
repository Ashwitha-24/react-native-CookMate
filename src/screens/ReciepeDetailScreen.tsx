import React, { useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, ActivityIndicator, SafeAreaView, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipeDetailsById } from '../store/reciepeSlice';
import { RootState, AppDispatch } from '../store/store';
import { useRoute, useNavigation } from '@react-navigation/native';

const ReciepeDetailScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation();
    const route = useRoute();
    const { recipeId } = route.params as { recipeId: number };

    // Select recipe details and status from store
    const { selectedRecipe, status, error } = useSelector((state: RootState) => state.recipes);

    useEffect(() => {
        // Dispatch the action to fetch recipe details by ID when the screen is loaded
        dispatch(fetchRecipeDetailsById(recipeId));
    }, [dispatch, recipeId]);

    // Render loading indicator if the recipe details are being fetched
    if (status === 'loading') {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    // Render error message if there is an error
    if (status === 'failed') {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error}</Text>
                <Button title="Go Back" onPress={() => navigation.goBack()} />
            </View>
        );
    }

    // Render recipe details once the data is successfully fetched
    if (selectedRecipe) {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <Image source={{ uri: selectedRecipe.image }} style={styles.recipeImage} />
                    <Text style={styles.title}>{selectedRecipe.title}</Text>
                    <Text style={styles.instructions}>{selectedRecipe.instructions}</Text>

                    <Text style={styles.subtitle}>Ingredients:</Text>
                    <View style={{ marginVertical: 20 }}>
                        {selectedRecipe.ingredients.map((ingredient) => (
                            <Text key={ingredient.id} style={styles.ingredient}>
                                {ingredient.amount} {ingredient.unit} of {ingredient.name}
                            </Text>
                        ))}
                    </View>

                    <Button title="Go Back" onPress={() => navigation.goBack()} />
                </ScrollView>
            </SafeAreaView>
        );
    }

    return null;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recipeImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 16,
    },
    instructions: {
        marginTop: 16,
        fontSize: 16,
    },
    subtitle: {
        marginTop: 24,
        fontSize: 18,
        fontWeight: 'bold',
    },
    ingredient: {
        marginTop: 8,
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
    },
});

export default ReciepeDetailScreen;
