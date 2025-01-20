// SavedItemsScreen.tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store'; // Assuming your store is in the store folder
import { useNavigation } from '@react-navigation/native';

const SavedItemsScreen: React.FC = () => {
    const navigation = useNavigation();
    // Access viewed recipes from the store
    const viewedRecipes = useSelector((state: RootState) => state.recipes.viewedRecipes);

    // Render a single viewed recipe item
    const renderViewedRecipe = ({ item }: { item: { id: number; title: string; image: string } }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('ReciepeDetailScreen', { recipeId: item.id })}
            style={styles.recipeContainer}
        >
            <Image source={{ uri: item.image }} style={styles.recipeImage} />
            <Text style={styles.recipeTitle} numberOfLines={1}>{item.title}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={{ marginVertical: 50 }}>
                <Text style={{ color: "#000000" }} onPress={() => navigation.goBack()}>Back</Text>
                <Text style={styles.title}>Saved Recipes</Text>

            </View>

            <FlatList
                data={viewedRecipes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderViewedRecipe}
                contentContainerStyle={styles.listContent}
            />
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
    recipeContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        elevation: 3, // Shadow for Android
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
    },
    recipeImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 16,
    },
    recipeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    listContent: {
        paddingBottom: 20,
    },
});

export default SavedItemsScreen;
