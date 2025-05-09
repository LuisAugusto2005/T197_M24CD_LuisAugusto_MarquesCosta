import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, FlatList, Modal, StyleSheet, Alert } from 'react-native';
import { Buffer } from 'buffer';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../supabaseconfig';
import { MaterialCommunityIcons } from 'react-native-vector-icons';

export default function AbrirProcesso() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('');
  const [photo, setPhoto] = useState(null);
  const [arquivos, setArquivos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const tiposProcesso = [
    'Processo de conhecimento',
    'Processo cautelar',
    'Processo de execução',
    'Outros',
  ];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled && result.assets.length > 0) {
      setPhoto(result.assets[0].uri);
    }
  };

  const adicionarArquivo = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const file = result.assets[0];
      setArquivos((prev) => [...prev, file]); // Apenas adiciona localmente
    }
  };

  const concluirProcesso = async () => {
  const arquivosEnviados = [];

  for (const file of arquivos) {
    try {
      
      const fileBase64 = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      
      const buffer = Buffer.from(fileBase64, 'base64');

      console.log(`Enviando arquivo: ${file.name} - Tamanho: ${buffer.length} bytes`);

      // Faz o upload do PDF para o Supabase
      const { error } = await supabase.storage
        .from('documentos')
        .upload(`pdfs/${file.name}`, buffer, {
          contentType: 'application/pdf',
        });

      if (!error) {
        arquivosEnviados.push(file.name);
      } else {
        console.error('Erro ao enviar PDF:', error.message);
      }
    } catch (err) {
      console.error('Erro ao processar arquivo:', err.message);
    }
  }

  console.log({
    nome,
    cpf,
    titulo,
    descricao,
    tipo,
    arquivos: arquivosEnviados,
  });
  Alert.alert('Sucesso', 'Processo aberto com sucesso', [{ text: 'OK' }]);
};



  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>Abrir Processo</Text>

      <TouchableOpacity onPress={pickImage} style={{ alignSelf: 'center', marginVertical: 20 }}>
        <Image
          source={photo ? { uri: photo } : require('../assets/icon.png')}
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />
      </TouchableOpacity>

      <TextInput placeholder="Nome do cliente" value={nome} onChangeText={setNome} style={estilo.input} />
      <TextInput placeholder="CPF do cliente" value={cpf} onChangeText={setCpf} style={estilo.input} />
      <TextInput placeholder="Inserir título do processo" value={titulo} onChangeText={setTitulo} style={estilo.input} />
      <TextInput
        placeholder="Inserir descrição do processo"
        value={descricao}
        onChangeText={setDescricao}
        style={[estilo.input, { height: 100 }]}
        multiline
      />
      
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={estilo.input}
      >
        <Text>{tipo || 'Selecionar tipo do processo'}</Text>
      </TouchableOpacity>

      {/* Modal para selecionar o tipo do processo */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecionar Tipo de Processo</Text>
            <FlatList
              data={tiposProcesso}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
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
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: 'white' }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={{ marginTop: 20, marginBottom: 5 }}>Documentos do cliente:</Text>
      <View style={{ minHeight: 100, backgroundColor: '#ddd', padding: 10, borderRadius: 10, marginBottom: 10 }}>
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

      <TouchableOpacity onPress={concluirProcesso} style={estilo.botaoFinal}>
        <Text style={{ color: 'white' }}>Concluir Processo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const estilo = {
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  botaoArquivo: {
    marginTop: 10,
    backgroundColor: '#bbb',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  botaoFinal: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
};

const styles = StyleSheet.create({
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
});
