import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { getDatabase, ref, get, update } from 'firebase/database';
import { Ionicons } from '@expo/vector-icons';

export default function TelaStatus({ route }) {
  const { processoID } = route.params;

  const [fases, setFases] = useState({
  'Fase Postulatória (ou Fase de Conhecimento)': { concluido: false, data: null },
  'Fase Saneadora': { concluido: false, data: null },
  'Fase de Instrução': { concluido: false, data: null },
  'Fase Decisória': { concluido: false, data: null },
  'Fase Recursal': { concluido: false, data: null },
  'Fase de Cumprimento de Sentença / Execução': { concluido: false, data: null },
  'Fase Final (Arquivamento)': { concluido: false, data: null },
});


  useEffect(() => {
    const db = getDatabase();
    const refFases = ref(db, `processos/${processoID}/fases`);
    get(refFases).then((snapshot) => {
      if (snapshot.exists()) {
        setFases(snapshot.val());
      }
    });
  }, [processoID]);

  const toggleFase = (fase) => {
    const agora = new Date();
    const dataFormatada = `${agora.getHours()}:${String(
      agora.getMinutes()
    ).padStart(2, '0')} ${String(agora.getDate()).padStart(2, '0')}/${String(
      agora.getMonth() + 1
    ).padStart(2, '0')}/${String(agora.getFullYear()).slice(2)}`;
    const novaFase = {
      ...fases[fase],
      concluido: !fases[fase].concluido,
      data: !fases[fase].concluido ? dataFormatada : null,
    };
    const novasFases = { ...fases, [fase]: novaFase };

    setFases(novasFases);

    const db = getDatabase();
    update(ref(db, `processos/${processoID}/fases`), novasFases);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Fases do processo</Text>

      <FlatList
        data={Object.entries(fases)}
        keyExtractor={([fase]) => fase}
        renderItem={({ item }) => {
          const [fase, { concluido, data }] = item;
          return (
            <TouchableOpacity
              onPress={() => toggleFase(fase)}
              style={styles.card}>
              <Ionicons
                name={concluido ? 'checkbox-outline' : 'square-outline'}
                size={24}
                color="#000"
                style={styles.checkbox}
              />
              <View style={styles.textoContainer}>
                <Text style={styles.nomeFase}>{fase}</Text>
                {data && <Text style={styles.dataFase}>{data}</Text>}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    marginRight: 12,
  },
  textoContainer: {
    flex: 1,
  },
  nomeFase: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  dataFase: {
    fontSize: 13,
    color: '#777',
    marginTop: 5,
  },
});
