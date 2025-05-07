import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import styles from '../styles';

const clientes = [
  { id: '1', nome: 'Nome do cliente', imagem: require('../assets/icon.png') },
  { id: '2', nome: 'Nome do cliente', imagem: require('../assets/icon.png') },
  { id: '3', nome: 'Nome do cliente', imagem: require('../assets/icon.png') },
  { id: '4', nome: 'Nome do cliente', imagem: require('../assets/icon.png') },
  { id: '5', nome: 'Nome do cliente', imagem: require('../assets/icon.png') },
  { id: '6', nome: 'Nome do cliente', imagem: require('../assets/icon.png') },
  { id: '7', nome: 'Nome do cliente', imagem: require('../assets/icon.png') },
];

export default function TelaClientes({ navigation }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={clienteStyles.itemContainer}>
      <Image
        source={item.imagem}
        style={clienteStyles.imagem}
      />
      <View>
        <Text style={clienteStyles.nome}>{item.nome}</Text>
        <Text style={clienteStyles.tempo}>{item.tempo}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={clienteStyles.titulo}>Lista de Clientes</Text>
      <Text style={clienteStyles.subtitulo}>Escolha o Cliente do processo</Text>
      <FlatList
        data={clientes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const clienteStyles = StyleSheet.create({
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  subtitulo: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
    color: 'gray',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  imagem: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  nome: {
    fontSize: 16,
    fontWeight: '500',
  },
  tempo: {
    color: 'gray',
    fontSize: 12,
  },
});
