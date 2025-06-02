import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ListaProcessos({navigation}) {
  const [processos, setProcessos] = useState([]);
  const [processosID, setProcessosID] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const dbRef = ref(getDatabase(), 'processos');
    const unsubscribe = onValue(dbRef, snapshot => {
      const data = snapshot.val() || {};
      // transforma objeto de objetos em array
      const lista = Object.entries(data).map(([id, item]) => ({
        id,
        numero: item.numero,
        nomeCliente: item.nomeCliente,
        advogado: item.advogado || '—',
        FotoDoAvogado: item.FotoDoAvogado || null
      }));
      setProcessosID(data);
      setProcessos(lista);
    });
    return () => unsubscribe();
  }, []);

  // filtra por número do processo ou nome do advogado
  const filtrados = processos.filter(p =>
    p.numero.toLowerCase().includes(search.toLowerCase()) ||
    p.advogado.toLowerCase().includes(search.toLowerCase()) ||
    p.nomeCliente.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('TelaVisualizarProcesso', {
        processoID: item.id,
        advogado: item.advogado,
        photo: item.FotoDoAvogado })}>
      <Image
        source={
          item.FotoDoAvogado
            ? { uri: item.FotoDoAvogado}
            : require('../assets/icon.png')
        }
        style={styles.avatar}
      />
      <View style={styles.textContainer}>
        <Text style={styles.numero}>( {item.numero} )</Text>
        <Text style={styles.cliente}>{item.nomeCliente} (CLIENTE)</Text>
        <Text style={styles.advogado}>| {item.advogado} (ADVOGADO)</Text>
      </View>
      
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}></Text>
      <View style={styles.searchWrapper}>
        <MaterialCommunityIcons
          name="magnify"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Número do Processo / Advogado"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <FlatList
        data={filtrados}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2eaf9',
    marginHorizontal: 16,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  searchIcon: { marginRight: 6 },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12
  },
  textContainer: { flex: 1 },
  numero: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: 14
  },
  cliente: {
    fontSize: 13,
    color: '#333',
    marginTop: 2
  },
  advogado: {
    fontSize: 12,
    color: 'gray',
    marginTop: 2
  }
});
