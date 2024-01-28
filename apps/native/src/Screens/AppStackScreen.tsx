import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './HomeScreen';

const AppStack = createStackNavigator();

const AppStackScreen = () => (
    <AppStack.Navigator>
      <AppStack.Screen name="Home" component={HomeScreen} />
      {/* Other main app screens */}
    </AppStack.Navigator>
  );

export default AppStackScreen;