Recipe Chatbot App
This is a React Native application designed to allow users to search for food recipes using both text input and voice recognition. The app fetches recipes from the Spoonacular API and displays the list of ingredients and cooking instructions. Users can save recipes to their viewed list, and the app also supports offline persistence using Redux and local storage.

Features
Voice Recognition: Users can ask for recipes using voice commands.
Text Input: Users can type queries to search for recipes.
Recipe List: Displays a list of recipes based on the search query.
Recipe Details: When a user selects a recipe, detailed information including ingredients and instructions is displayed.
Save Recipes: Users can save viewed recipes in the local storage for later reference.
Redux for State Management: All state management, including the list of recipes and selected recipe details, is handled with Redux Toolkit.
Libraries and Tools Used
React Native: Framework for building the mobile app.
TypeScript: Typed superset of JavaScript for enhanced developer experience.
Redux Toolkit: For managing global app state (recipes, selected recipe details, etc.).
Axios: For making HTTP requests to the Spoonacular API.
React Navigation: For managing app navigation, including the bottom tab navigator.
React Native Voice: For implementing voice recognition functionality.
Spoonacular API: To fetch food recipes and their details.
AsyncStorage: To save recipes for offline use (managed through Redux).
Requirements
Node.js
npm or yarn
Android Studio / Xcode (for running the app on an emulator or real device)
Setup
Follow these steps to set up the project locally.

1. Clone the Repository
https://github.com/Ashwitha-24/react-native-CookMate.git

2. Install Dependencies
Use npm or yarn to install the dependencies.
npm install
3. Setup Android or iOS Emulator/Device
For Android: Make sure you have Android Studio installed and configured.
For iOS: Ensure you have Xcode installed and configured.
4. Run the App
Android
npm run android
This command will build and run the app on your Android emulator or connected device.
iOS
If you're on a Mac and want to run the app on iOS:
npm run ios
5. API Key Setup
You need an API key to access the Spoonacular API.

Step 1: Create an account at Spoonacular API.
Step 2: After signing up, create a new API key from the Spoonacular API dashboard.
Step 3: Store the API key in the recipeSlice within the store folder, under src/store/recipeSlice.ts.

6. Permissions for Voice Recognition
For Android, you need to request microphone permissions to use voice recognition.

Android: Add the following permissions in android/app/src/main/AndroidManifest.xml:
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.INTERNET" />



For Android:
Add the following permissions in android/app/src/main/AndroidManifest.xml to request microphone access and other necessary permissions.
<key>NSMicrophoneUsageDescription</key>
<string>We need access to your microphone to recognize your voice for searching recipes.</string>


After that, make sure to grant the necessary permissions for the microphone and other resources when you run the app.


7.Project Structure

/src
  /navigation              # Tab and Stack Navigation setup

  /store                   # Redux store and slices (e.g., recipeSlice)

  /screens                 # Screens (RecipeChat, RecipeDetails, SavedItems)

Navigation: The navigation folder handles tab and stack navigation using react-navigation.

Store: The store folder contains the Redux store and the recipeSlice, which handles fetching recipes from the API, managing state, and storing viewed recipes.

Screens:
RecipeChatScreen: Allows users to search and speak to get the related recipes list.

RecipeDetailsScreen: Displays detailed information about the selected recipe (ingredients, instructions).

SavedItemsScreen: Shows a list of saved recipes, including their instructions and ingredients.







