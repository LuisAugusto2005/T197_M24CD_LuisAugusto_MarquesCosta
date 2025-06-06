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
  console.log(nome);
  return (
    <View style={styles.container}>
      <Image
        source={photoURL ? { uri: photoURL } : require('../assets/icon.png')}
        style={perfilStyles.avatar}
      />
      <Text style={perfilStyles.nome}>{nome}</Text>
      <Text style={perfilStyles.email}>{email}</Text>

      <TouchableOpacity style={perfilStyles.iconButton} onPress={() => navigation.navigate('TelaCadastrarProcesso', {
        nome: nome,
        photoURL: photoURL,
      })}>
        
        <MaterialCommunityIcons name="text-box-plus" size={20} color="#fff" style={perfilStyles.icon} />
        <Text style={styles.buttonText}>Cadastrar Processo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={perfilStyles.iconButton} onPress={() => navigation.navigate('TelaListaProcessos')}>
        <MaterialCommunityIcons name="text-box-search" size={20} color="#fff" style={perfilStyles.icon} />
        <Text style={styles.buttonText}>Lista de Processos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={perfilStyles.iconButton} onPress={() => navigation.navigate('TelaListaProcessosConcluidos')}>
        <MaterialCommunityIcons name="text-box-check" size={20} color="#fff" style={perfilStyles.icon} />
        <Text style={styles.buttonText}>Processos Concluidos</Text>
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
    width: 200,
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
