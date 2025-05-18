import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// Importação das telas
import TelaInicial from './screens/EnterScreen';
import TelaSignIn from './screens/SignIn';
import TelaLogIn from './screens/LogIn';
import TelaPerfil from './screens/Perfil';
import TelaClientes from './screens/TelaClientes';
// import TelaListaProcessos from './screens/ListaProcessos';
import TelaListaProcessos from './screens/ListaProcessosFeitos';
import TelaCadastrarProcesso from './screens/CadastrarProcesso'

import TelaSupaTeste from './supabaseTESTE'


// Criação do Stack Navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="TelaLogIn"
        //initialRouteName="TelaSupaTeste"
      >
        <Stack.Screen name="TelaInicial" component={TelaInicial} options={{title: 'Home', headerTitleAlign: 'center'}} />
        <Stack.Screen name ="TelaSignIn" component={TelaSignIn} options={{title: 'Sign-In', headerTitleAlign: 'center'}} />
        <Stack.Screen name ="TelaLogIn" component={TelaLogIn} options={{title: 'Log-In', headerTitleAlign: 'center'}} />
        <Stack.Screen name ="TelaPerfil" component={TelaPerfil} options={{title: 'Perfil', headerTitleAlign: 'center'}} />
        <Stack.Screen name ="TelaClientes" component={TelaClientes} options={{title: 'Lista de Clientes', headerTitleAlign: 'center'}} />
        <Stack.Screen name ="TelaListaProcessos" component={TelaListaProcessos} options={{title: 'Lista dos Processos', headerTitleAlign: 'center'}} />
        <Stack.Screen name ="TelaCadastrarProcesso" component={TelaCadastrarProcesso} options={{title: 'Cadastrar Processo', headerTitleAlign: 'center'}} />


        <Stack.Screen name ="TelaSupaTeste" component={TelaSupaTeste} options={{title: 'supa', headerTitleAlign: 'center'}} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}