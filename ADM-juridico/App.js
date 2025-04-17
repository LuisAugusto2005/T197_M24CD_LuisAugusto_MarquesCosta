import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// Importação das telas
import TelaInicial from './screens/EnterScreen';


// Criação do Stack Navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="TelaInicial"
      >
        <Stack.Screen name="TelaInicial" component={TelaInicial} options={{title: 'Home', headerTitleAlign: 'center'}} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}