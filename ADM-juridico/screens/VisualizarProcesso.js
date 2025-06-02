import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TextInput, Image, FlatList, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getDatabase, ref, get, child } from 'firebase/database';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

export default function VisualizarProcesso({ route, navigation }) {
  const { processoID, advogado, photo } = route.params || {};

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

    get(child(dbRef, `processos/${processoID}/numero`)).then(snapshot => {
      setNumero(snapshot.val() || '');
    });
    get(child(dbRef, `processos/${processoID}/nomeCliente`)).then(snapshot => {
      setNomeCliente(snapshot.val() || '');
    });
    get(child(dbRef, `processos/${processoID}/cpfCliente`)).then(snapshot => {
      setCpf(snapshot.val() || '');
    });
    get(child(dbRef, `processos/${processoID}/descricao`)).then(snapshot => {
      setDescricao(snapshot.val() || '');
    });
    get(child(dbRef, `processos/${processoID}/tipo`)).then(snapshot => {
      setTipo(snapshot.val() || '');
    });
    get(child(dbRef, `processos/${processoID}/arquivos`)).then(snapshot => {
      setArquivos(snapshot.val() || []);
    });
  }, [processoID]);

  const adicionarArquivo = async () => {
        const result = await DocumentPicker.getDocumentAsync({
          type: 'application/pdf',
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setArquivos((prev) => [...prev, file]); // Adiciona localmente
      }
    };

  return (
    <ScrollView style={estilo.container_principal}>

        <Text style={estilo.numero}>{'[ ' + numero + ' ]'}</Text>

          <TouchableOpacity style={estilo.Status}> 
           <Text style={{marginTop: 5, marginRight: 5, marginLeft: 20, }}>
              Status: 
           </Text>
           <Text style={{marginTop: 5, marginRight: 20, marginLeft: 5, }}>
              Em Andamento
           </Text>
          </TouchableOpacity>


        {/* CLIENTE */}
        <View style={estilo.container_pessoas}>
          <Image
            source={photo ? { } : require('../assets/icon.png')}
            style={estilo.avatar}
          />
          <Text style={estilo.nome}>{nomeCliente}</Text>
          <Text style={{color: 'gray', fontSize: 12}}>{ ' (CLIENTE)'}</Text>
        </View>

        {/* ADVOGADO */}
        <View style={estilo.container_pessoas}>
          <Image
            source={photo ? { uri: photo } : require('../assets/icon.png')}
            style={estilo.avatar}
          />
          <Text style={estilo.nome}>{advogado}</Text>
          <Text style={{color: 'gray', fontSize: 12}}>{ ' (ADVOGADO)'}</Text>
        </View>

        {/* IMPUTS */}
        <View style={estilo.container_imput}> 
          <TextInput placeholder={'Numero do processo'} value={numero} onChangeText={setNumero} style={estilo.imput} />
          <TextInput placeholder={'Nome do cliente'} value={nomeCliente} onChangeText={setNomeCliente} style={estilo.imput} />
          <TextInput placeholder={'CPF do cliente'} value={cpf} onChangeText={setCpf} style={estilo.imput} />
          {/* DESCRIÇÃO */}
          <TextInput
                    placeholder={'Inserir descrição do processo'}
                    value={descricao}
                    onChangeText={setDescricao}
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
              
              <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
                >
                <View style={estilo.modalContainer}>
                  <View style={estilo.modalContent}>
                    <Text style={estilo.modalTitle}>Selecionar Tipo de Processo</Text>
                    <FlatList
                      data={tiposProcesso}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                        style={estilo.modalItem}
                        onPress={() => {
                          setTipo(item);
                          setModalVisible(false);
                        }}
                        >
                          <Text>{item}</Text>
                        </TouchableOpacity>
                      )}
                      />
                    <TouchableOpacity
                      style={estilo.closeButton}
                      onPress={() => setModalVisible(false)}
                      >
                      <Text style={{ color: 'white' }}>Fechar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>


        {/* DOCUMENTOS */}
        <Text style={{ marginTop: 20, alignSelf: 'flex-start', marginBottom: 5 }}>Documentos do cliente:</Text>
        <View style={{ minHeight: 100, width: 375, backgroundColor: '#ddd', padding: 10, borderRadius: 10, marginBottom: 10 }}>
          {arquivos.length === 0 ? (
            <Text style={{ fontStyle: 'italic', color: '#555' }}>Nenhum arquivo adicionado</Text>
          ) : (
            <FlatList
              data={arquivos}
              keyExtractor={(item, index) => `${item.name}_${index}`}
              renderItem={({ item, index }) => (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <Text style={{ flex: 1 }}>
                    <MaterialCommunityIcons name="folder" size={20} /> {item.name}
                  </Text>
                  <TouchableOpacity onPress={() => {
                    setArquivos(prev => prev.filter((_, i) => i !== index));
                  }}>
                    <Text style={{ color: 'red', fontWeight: 'bold' }}>
                      <MaterialCommunityIcons name="close-circle" size={20} />
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
          <TouchableOpacity onPress={adicionarArquivo} style={estilo.botaoArquivo}>
            <Text>
              <MaterialCommunityIcons name="paperclip" size={20} /> Adicionar Arquivo
            </Text>
          </TouchableOpacity>
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
    backgroundColor: '#4caf50',
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
    margin: 20,
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
      marginBottom: 15,
      textAlign: 'center',
    },
    modalItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderColor: '#ccc',
    },
    closeButton: {
      marginTop: 15,
      backgroundColor: '#000',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
  
    botaoArquivo: {
      marginTop: 10,
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
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
});
