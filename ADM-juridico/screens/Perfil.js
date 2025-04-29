import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { auth } from '../firebaseconfig';
import styles from '../styles';

export default function Perfil({ navigation }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserData({
        nome: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });
    }
  }, []);

  if (!userData) {
    return <Text style={{ marginTop: 40, textAlign: 'center' }}>Carregando perfil...</Text>;
  }

  return (
    <View style={styles.container}>
      <Image
        source={
          userData.photoURL
            ? { uri: userData.photoURL }
            : require('../assets/icon.png')
        }
        style={perfilStyles.avatar}
      />
      <Text style={perfilStyles.nome}>{userData.nome}</Text>
      <Text style={perfilStyles.email}>{userData.email}</Text>

      <TouchableOpacity style={perfilStyles.iconButton} onPress={() => navigation.navigate('TelaClientes')}>
        <MaterialCommunityIcons name="pencil" size={20} color="#fff" style={perfilStyles.icon} />
        <Text style={styles.buttonText}>Abrir Processo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={perfilStyles.iconButton}>
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
