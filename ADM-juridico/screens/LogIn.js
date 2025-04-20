import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import styles from '../styles';

export default function LogIn() {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');

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

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}
