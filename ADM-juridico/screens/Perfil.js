import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import firebase from 'firebase/app';

import styles from '../styles';

export default function Perfil({ route, navigation }) {
  const { nome, email, photoURL } = route.params || {};
  console.log(photoURL);

  if (!nome || !email) {
    return <Text style={{ marginTop: 40, textAlign: 'center' }}>Dados do perfil não encontrados.</Text>;
  }

  return (
    <View style={styles.container}>
      <Image
        source={photoURL ? { uri: photoURL } : require('../assets/icon.png')}
        style={perfilStyles.avatar}
      />
      <Text style={perfilStyles.nome}>{nome}</Text>
      <Text style={perfilStyles.email}>{email}</Text>

      <TouchableOpacity style={perfilStyles.iconButton} onPress={() => navigation.navigate('TelaAbrirProcesso')}>
        <MaterialCommunityIcons name="pencil" size={20} color="#fff" style={perfilStyles.icon} />
        <Text style={styles.buttonText}>Abrir Processo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={perfilStyles.iconButton} onPress={() => navigation.navigate('TelaListaProcessos')}>
        <MaterialCommunityIcons name="magnify" size={20} color="#fff" style={perfilStyles.icon} />
        <Text style={styles.buttonText}>Lista de Processos</Text>
      </TouchableOpacity>
    </View>
  );
}

const perfilStyles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginTop: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#007bff',
  },
  nome: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
  },
  email: {
    textAlign: 'center',
    color: 'gray',
    marginBottom: 20,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'center',
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
});
