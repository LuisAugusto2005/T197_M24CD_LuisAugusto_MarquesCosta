import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles from '../styles';

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebaseconfig';

export default function LogIn({ navigation }) {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleLogin = async () => {
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

      navigation.navigate('TelaPerfil');

    } catch (error) {
      console.error('Erro ao fazer login:', error.message);
      Alert.alert('Erro ao entrar', 'Verifique CPF e senha.');
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
            style={{ position: 'absolute', right: 33, top: 125}}
          >
          <MaterialCommunityIcons name={mostrarSenha ? "eye" : "eye-off"}  size={20}/>
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
