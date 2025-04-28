import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

import { auth } from '../firebaseconfig';
import styles from '../styles';

export default function Perfil() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    //const auth = getAuth();
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
      <Text style={perfilStyles.title}>Processos</Text>
      <Image
        source={
          userData.photoURL
            ? { uri: userData.photoURL }
            : require('../assets/icon.png') // use uma imagem padrão se não tiver foto
        }
        style={perfilStyles.avatar}
      />
      <Text style={perfilStyles.nome}>{userData.nome}</Text>
      <Text style={perfilStyles.email}>{userData.email}</Text>

      <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Abrir Processo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
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
});
