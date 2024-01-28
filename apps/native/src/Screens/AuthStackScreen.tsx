import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from './WelcomeScreenOne';
// Import other screens as needed

const AuthStack = createStackNavigator();

// Auth stack navigator
const AuthStackScreen = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen name="SignIn" component={SignInScreen} />
    {/* Other auth screens */}
  </AuthStack.Navigator>
);

export default AuthStackScreen;