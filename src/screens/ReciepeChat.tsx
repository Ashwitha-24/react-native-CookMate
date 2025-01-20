import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Platform,
    Alert,
} from 'react-native';
import Voice, {
    SpeechRecognizedEvent,
    SpeechResultsEvent,
    SpeechErrorEvent,
} from '@react-native-community/voice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipes, addViewedRecipe } from '../store/reciepeSlice';
import { RootState, AppDispatch } from '../store/store';
import { useNavigation } from '@react-navigation/native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const RecipeChat: React.FC = () => {
    const [query, setQuery] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [recognized, setRecognized] = useState('');
    const [results, setResults] = useState<string[]>([]);
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation();
    const { recipes, status, error: fetchError } = useSelector(
        (state: RootState) => state.recipes
    );

    useEffect(() => {
        Voice.onSpeechStart = onSpeechStart;
        Voice.onSpeechRecognized = onSpeechRecognized;
        Voice.onSpeechEnd = onSpeechEnd;
        Voice.onSpeechError = onSpeechError;
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechPartialResults = onSpeechPartialResults;

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    // Permission check function
    const checkPermissions = async () => {
        try {
            let permissionStatus;

            if (Platform.OS === 'ios') {
                permissionStatus = await request(PERMISSIONS.IOS.MICROPHONE);
            } else if (Platform.OS === 'android') {
                permissionStatus = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
            }

            return permissionStatus === RESULTS.GRANTED;
        } catch (error) {
            console.error('Error checking permission:', error);
            return false;
        }
    };

    // Start voice recognition
    const handleVoiceStart = async () => {
        const hasPermission = await checkPermissions();
        if (hasPermission) {
            setRecognized('');
            setResults([]);
            try {
                await Voice.start('en-US');  // Set language to 'en-US' explicitly
                setIsListening(true);
            } catch (error) {
                console.error('Error starting voice recognition:', error);
                Alert.alert('Error starting voice recognition', 'Please try again.');
            }
        } else {
            Alert.alert('Microphone permission is required to start voice recognition');
        }
    };

    // Stop voice recognition
    const handleVoiceStop = async () => {
        try {
            await Voice.stop();
            setIsListening(false);
        } catch (error) {
            console.error('Error stopping voice recognition:', error);
        }
    };

    // Handle voice events
    const onSpeechStart = () => setRecognized('√');
    const onSpeechRecognized = () => setRecognized('√');
    const onSpeechEnd = () => console.log('Speech Ended');
    const onSpeechError = (e: SpeechErrorEvent) => {
        console.error('Speech Error: ', e.error);
        Alert.alert('Speech Error', JSON.stringify(e.error));  // Display the error for debugging
    };
    const onSpeechResults = (e: SpeechResultsEvent) => {
        setResults(e.value);
        if (e.value && e.value.length > 0) {
            setQuery(e.value[0]);
            handleSearch(e.value[0]);  // Search using the first recognized phrase
            handleVoiceStop(); // Stop listening after getting the result
        }
    };
    const onSpeechPartialResults = (e: SpeechResultsEvent) => setResults(e.value);

    // Handle search function for both typed and voice input
    const handleSearch = (searchQuery: string) => {
        if (searchQuery.trim()) {
            dispatch(fetchRecipes(searchQuery.trim())); // Fetch recipes from API
        }
    };

    // Render each recipe
    const renderRecipe = ({ item }: { item: { id: number; title: string; image: string } }) => (
        <TouchableOpacity onPress={() => handleRecipeClick(item)} style={styles.recipeContainer}>
            <Image
                source={{ uri: item.image }}
                style={styles.recipeImage}
                onError={(e) => console.error('Image failed to load:', e.nativeEvent.error)}
            />
            <Text style={styles.recipeTitle}>{item.title}</Text>
        </TouchableOpacity>
    );

    // Handle recipe click to view details
    const handleRecipeClick = (recipe: { id: number; title: string; image: string }) => {
        dispatch(addViewedRecipe(recipe));
        navigation.navigate('ReciepeDetailScreen', { recipeId: recipe.id });
    };

    // Handle saved items screen navigation
    const handleSaved = () => {
        navigation.navigate('SavedItemsScreen');
    };

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 50 }}>
                <Text style={styles.title}>Recipe Chatbot</Text>
                <Button title="Saved" onPress={handleSaved} />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Search for recipes..."
                    value={query}
                    onChangeText={setQuery}
                />
                <Button title="Search" onPress={() => handleSearch(query)} />
                <TouchableOpacity onPress={handleVoiceStart}>
                    <Text style={styles.voiceButton}>{isListening ? 'Stop Listening' : 'Speak'}</Text>
                </TouchableOpacity>
            </View>

            {/* Display voice recognition query */}
            <Text>Searched Query:</Text>
            {results.map((result, index) => (
                <Text key={`result-${index}`}>{result}</Text>
            ))}

            {/* Loading indicator */}
            {status === 'loading' && <ActivityIndicator size="large" color="#0000ff" />}

            {/* Error message */}
            {fetchError && <Text style={styles.errorText}>{fetchError}</Text>}

            {/* FlatList to render recipes */}
            <FlatList
                data={recipes[query] || []}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderRecipe}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    input: { flex: 1, borderWidth: 1, padding: 8, marginRight: 8 },
    voiceButton: { color: 'orange', marginLeft: 8 },
    recipeContainer: {
        flex: 1,
        margin: 8,
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        width: '48%',
    },
    recipeImage: { width: '100%', height: 150, borderRadius: 8 },
    recipeTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 8, textAlign: 'center' },
    columnWrapper: { justifyContent: 'space-between', marginBottom: 16 },
    listContent: { paddingBottom: 20 },
    errorText: { color: 'red', textAlign: 'center', marginTop: 16 },
});

export default RecipeChat;
