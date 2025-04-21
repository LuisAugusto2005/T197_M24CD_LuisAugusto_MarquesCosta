import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import styles from '../styles';

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebaseconfig';

export default function LogIn({navigation}) {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    //const auth = getAuth(app);
    //const db = getFirestore(app);

    try {
      const q = query(collection(db, 'usuarios'), where('cpf', '==', cpf));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert('Erro', 'CPF não encontrado.');
        return;
      }

      const userData = querySnapshot.docs[0].data();
      const email = userData.email;
      const nome = userData.nome;

      await signInWithEmailAndPassword(auth, email, senha);

      //Alert.alert('Bem-vindo!', `Olá, ${nome}! Você entrou com sucesso.`);
      navigation.navigate('TelaPerfil');

    } catch (error) {
      console.error('Erro ao fazer login:', error.message);
      Alert.alert('Erro ao entrar', 'Verifique CPF e senha.');
    }
  };

  return (
    <View style={styles.container}>

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
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}
