import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles from '../styles';

import { get, ref, child } from 'firebase/database';
import { db } from '../firebaseconfig';

export default function LogIn({ navigation }) {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleLogin = async () => {
  try {
    const snapshot = await get(ref(db, 'usuarios'));

    if (!snapshot.exists()) {
      Alert.alert('Erro', 'Nenhum usuário cadastrado.');
      return;
    }

    const users = snapshot.val();

    // Procurar o usuário pelo CPF
    let userFound = null;
    Object.values(users).forEach((user) => {
      if (user.cpf === cpf) {
        userFound = user;
      }
    });

    if (!userFound) {
      Alert.alert('Erro', 'CPF não encontrado.');
      return;
    }

    if (userFound.senha !== senha) {
      Alert.alert('Erro', 'Senha incorreta.');
      return;
    }

    console.log('Login realizado com sucesso:', userFound.email, userFound.nome);
    navigation.navigate('TelaPerfil', {
      email: userFound.email,
      nome: userFound.nome
    });

  } catch (error) {
    console.error('Erro ao fazer login:', error);
    Alert.alert('Erro ao entrar', 'Ocorreu um problema ao tentar logar.');
  }
};


  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Image
          source={require('../assets/Logo_LS.png')}
          style={{ width: 150, height: 150, resizeMode: 'contain' }}
        />
      </View>

      <View style={styles.formBox}>
        <Text>CPF</Text>
        <TextInput
          placeholder="Inserir CPF"
          style={styles.input}
          value={cpf}
          onChangeText={setCpf}
        />

        <Text>Senha</Text>
        <TextInput
          placeholder="Inserir Senha"
          style={styles.input}
          secureTextEntry={!mostrarSenha}
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity
          onPress={() => setMostrarSenha(!mostrarSenha)}
          style={{ position: 'absolute', right: 33, top: 125 }}
        >
          <MaterialCommunityIcons name={mostrarSenha ? 'eye' : 'eye-off'} size={20} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <Text>Não tem conta?</Text>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TelaSignIn')}>
          <Text style={styles.buttonText}>Registrar-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
