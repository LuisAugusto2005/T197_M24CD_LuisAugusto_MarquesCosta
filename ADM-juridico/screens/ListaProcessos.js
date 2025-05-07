import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import styles from '../styles';

const processos = [
    { id: '1', nome: 'Nome do processo', advogado: 'Nome do Advogado', cliente: 'Nome do Cliente', imagem: require('../assets/icon.png') },
    { id: '2', nome: 'Nome do processo', advogado: 'Nome do Advogado', cliente: 'Nome do Cliente', imagem: require('../assets/icon.png') },
    { id: '3', nome: 'Nome do processo', advogado: 'Nome do Advogado', cliente: 'Nome do Cliente', imagem: require('../assets/icon.png') },
    { id: '4', nome: 'Nome do processo', advogado: 'Nome do Advogado', cliente: 'Nome do Cliente', imagem: require('../assets/icon.png') },
    { id: '5', nome: 'Nome do processo', advogado: 'Nome do Advogado', cliente: 'Nome do Cliente', imagem: require('../assets/icon.png') },
    { id: '6', nome: 'Nome do processo', advogado: 'Nome do Advogado', cliente: 'Nome do Cliente', imagem: require('../assets/icon.png') },
    { id: '7', nome: 'Nome do processo', advogado: 'Nome do Advogado', cliente: 'Nome do Cliente', imagem: require('../assets/icon.png') },
];

export default function TelaListaProcessos({ navigation }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={processosStyles.itemContainer}>
      <Image
        source={item.imagem}
        style={processosStyles.imagem}
      />
      <View>
        <Text style={processosStyles.nome}>{item.nome}</Text>
        <Text style={processosStyles.advogado}>{item.advogado}</Text>
        <Text style={processosStyles.cliente}>{item.cliente}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={processosStyles.titulo}>Lista de Processoss</Text>
      <Text style={processosStyles.subtitulo}>Processos em Andamento</Text>
      <FlatList
        data={processos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const processosStyles = StyleSheet.create({
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
  advogado: {
    color: 'gray',
    fontSize: 12,
  },
  cliente: {
    color: 'gray',
    fontSize: 12,
  },
});
