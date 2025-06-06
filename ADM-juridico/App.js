import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// Importação das telas
import TelaInicial from './screens/EnterScreen';
import TelaSignIn from './screens/SignIn';
import TelaLogIn from './screens/LogIn';
import TelaPerfil from './screens/Perfil';
import TelaClientes from './screens/TelaClientes';
import TelaListaProcessos from './screens/ListaProcessos';
import TelaListaProcessosConcluidos from './screens/ListaProcessosConcluidos';
import TelaCadastrarProcesso from './screens/CadastrarProcesso'
import VisualizarProcesso from './screens/VisualizarProcesso'
import VisualizarProcessoConcluido from './screens/VisualizarProcessoConcluido'
import Status from './screens/status'

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
        <Stack.Screen name ="TelaListaProcessos" component={TelaListaProcessos} options={{title: 'Lista de Processos', headerTitleAlign: 'center'}} />
        <Stack.Screen name ="TelaListaProcessosConcluidos" component={TelaListaProcessosConcluidos} options={{title: 'Lista de Processos Concluidos', headerTitleAlign: 'center'}} />
        <Stack.Screen name ="TelaCadastrarProcesso" component={TelaCadastrarProcesso} options={{title: 'Cadastrar Processo', headerTitleAlign: 'center'}} />
        <Stack.Screen name ="TelaVisualizarProcesso" component={VisualizarProcesso} options={{title: 'Visualizar Processo', headerTitleAlign: 'center'}} />
        <Stack.Screen name ="TelaVisualizarProcessoConcluido" component={VisualizarProcessoConcluido} options={{title: 'Visualizar Processo Concluido', headerTitleAlign: 'center'}} />
        <Stack.Screen name ="TelaStatus" component={Status} options={{title: 'Status do Processo', headerTitleAlign: 'center'}} />


        <Stack.Screen name ="TelaSupaTeste" component={TelaSupaTeste} options={{title: 'supa', headerTitleAlign: 'center'}} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}