import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TextInput, Image, FlatList, Linking, Modal, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getDatabase, ref, get, set, child, remove, push, update } from 'firebase/database';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import uuid from 'react-native-uuid';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../supabaseconfig';
import { Buffer } from 'buffer';

export default function VisualizarProcessoConcluido({ route, navigation }) {
  const { processoID, advogado, photoAdvogado } = route.params || {};

  const [numero, setNumero] = useState('');
  const [nomeCliente, setNomeCliente] = useState('');
  const [cpf, setCpf] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('');
  const [arquivos, setArquivos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const tiposProcesso = [
    'Processo de conhecimento',
    'Processo cautelar',
    'Processo de execução',
    'Outros',
  ];

  useEffect(() => {
    if (!processoID) return;

    const db = getDatabase();
    const dbRef = ref(db);

    get(child(dbRef, `processosConcluidos/${processoID}/numero`)).then(snapshot => {
      setNumero(snapshot.val() || '');
    });
    get(child(dbRef, `processosConcluidos/${processoID}/nomeCliente`)).then(snapshot => {
      setNomeCliente(snapshot.val() || '');
    });
    get(child(dbRef, `processosConcluidos/${processoID}/cpfCliente`)).then(snapshot => {
      setCpf(snapshot.val() || '');
    });
    get(child(dbRef, `processosConcluidos/${processoID}/descricao`)).then(snapshot => {
      setDescricao(snapshot.val() || '');
    });
    get(child(dbRef, `processosConcluidos/${processoID}/tipo`)).then(snapshot => {
      setTipo(snapshot.val() || '');
    });
    get(child(dbRef, `processosConcluidos/${processoID}/arquivos`)).then(snapshot => {
      setArquivos(snapshot.val() || []);
    });
  }, [processoID]);

  return (
    <ScrollView style={estilo.container_principal}>

          {/* NUMERO */}
        <Text style={estilo.numero}>{'[ ' + numero + ' ]'}</Text>

        {/* CLIENTE */}
        <View style={estilo.container_pessoas}>
          <Image
            source={photoAdvogado ? { } : require('../assets/icon.png')}
            style={estilo.avatar}
          />
          <Text style={estilo.nome}>{nomeCliente}</Text>
          <Text style={{color: 'gray', fontSize: 12}}>{ ' (CLIENTE)'}</Text>
        </View>

        {/* ADVOGADO */}
        <View style={estilo.container_pessoas}>
          <Image
            source={photoAdvogado ? { uri: photoAdvogado } : require('../assets/icon.png')}
            style={estilo.avatar}
          />
          <Text style={estilo.nome}>{advogado}</Text>
          <Text style={{color: 'gray', fontSize: 12}}>{ ' (ADVOGADO)'}</Text>
        </View>

        {/* IMPUTS */}
        <View style={estilo.container_imput}> 
          <TextInput placeholder={'Numero do processo'} value={numero} style={estilo.imput} />
          <TextInput placeholder={'Nome do cliente'} value={nomeCliente} style={estilo.imput} />
          <TextInput placeholder={'CPF do cliente'} value={cpf} style={estilo.imput} />
          {/* DESCRIÇÃO */}
          <TextInput
                    placeholder={'Inserir descrição do processo'}
                    value={descricao}
                    style={[estilo.imput, { height: 100}]}
                    multiline
                    />

              {/* SELECIONAR TIPO DE PROCESSO */}
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={estilo.imput}
                >
                <Text>{tipo || 'Selecionar tipo do processo'}</Text>
              </TouchableOpacity>

        {/* DOCUMENTOS */}
        <Text style={{ marginTop: 20, alignSelf: 'flex-start', marginBottom: 5 }}>Documentos do cliente:</Text>
        <View style={{ minHeight: 30, width: 375, backgroundColor: '#ddd', padding: 10, borderRadius: 10, marginBottom: 10 }}>
          {arquivos.length === 0 ? (
            <Text style={{ fontStyle: 'italic', color: '#555' }}>Nenhum arquivo adicionado</Text>
          ) : (
            <FlatList
            
              data={arquivos}
              keyExtractor={(item, index) => `${item.name}_${index}`}
              renderItem={({ item, index }) => (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <Text style={{ flex: 1 }} onPress={() => { item.url ? Linking.openURL(item.url) : Alert.alert('Atenção', 'O arquivo ainda está sendo enviado.');}}>
                    <MaterialCommunityIcons name="folder" size={20} /> {item.url ? item.name : <ActivityIndicator size={15} color="black" paddingHorizontal={10} />}
                  </Text>
                </View>
              )}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const estilo = StyleSheet.create({
 container_principal: {

  },
  Status: {
    marginTop: 15,
    height: 30,
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#28a745',
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 10,
  },
  container_pessoas: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 45,
  },
  avatar: {   
    width: 60,
    height: 60,
    borderRadius: 50,
    marginTop: 20,
    margin: 15,
    borderWidth: 2,
    borderColor: '#007bff',
  },
  numero: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
  },
  nome: {
    fontSize: 14
  },
  container_imput: {
    marginTop: 10,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  imput: {
    width: 375  ,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },



// Styles Selecionar Tipo de processo
modalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
modalContent: {
  width: 300,
  padding: 20,
  backgroundColor: 'white',
  borderRadius: 10,
},
modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  textAlign: 'center',
},
modalItem: {
  padding: 10,
  borderBottomWidth: 1,
  borderColor: '#ccc',
},
closeButton: {
  backgroundColor: '#000',
  padding: 10,
  borderRadius: 5,
  alignItems: 'center',
},

botaoArquivo: {
  backgroundColor: '#bbb',
  padding: 10,
  borderRadius: 10,
  alignItems: 'center',
},
iconButton: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#333',
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 20,
  alignSelf: 'center',
},
icon: {
    marginRight: 10,
  },

  // Styles botoes finais
  viewbotoes: {
    height: 50,
    width: 375,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  botao: {
    flexDirection: 'row',
    marginTop: 5,
    height: 40,
    width: 115,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
