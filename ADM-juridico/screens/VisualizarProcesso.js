import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  Image,
  FlatList,
  Linking,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  getDatabase,
  ref,
  get,
  set,
  child,
  remove,
  push,
  update,
} from 'firebase/database';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import uuid from 'react-native-uuid';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../supabaseconfig';
import { Buffer } from 'buffer';

export default function VisualizarProcesso({ route, navigation }) {
  const { processoID, advogado, photoAdvogado } = route.params || {};

  const [numero, setNumero] = useState('');
  const [nomeCliente, setNomeCliente] = useState('');
  const [cpf, setCpf] = useState('');
  const [descricao, setDescricao] = useState('');
  const [area, setArea] = useState('');
  const [tipo, setTipo] = useState('');
  const [arquivos, setArquivos] = useState([]);
  const [modalTipoVisible, setModalTipoVisible] = useState(false);
  const [photoCliente, setPhotoCliente] = useState('');

  const tipoProcesso = {
  'Direito Civil': [
    'Inventário',
    'Divórcio',
    'Cobrança',
    'Danos Morais',
    'Responsabilidade Civil',
  ],
  'Direito Penal': [
    'Homicídio',
    'Furto/Roubo',
    'Tráfico de Drogas',
    'Crimes Contra a Honra',
    'Violência Doméstica',
  ],
  'Direito Trabalhista': [
    'Rescisão Contratual',
    'Horas Extras',
    'Assédio Moral',
    'Verbas Rescisórias',
    'Reintegração ao Emprego',
  ],
  'Direito Tributário': [
    'Execução Fiscal',
    'Isenção de Impostos',
    'Compensação Tributária',
    'Anulação de Débito',
    'Planejamento Tributário',
  ],
  'Direito Constitucional': [
    'Mandado de Segurança',
    'Ação Direta de Inconstitucionalidade (ADI)',
    'Ação Popular',
    'Habeas Corpus',
    'Direitos Fundamentais',
  ],
};

  useEffect(() => {
    if (!processoID) return;

    const db = getDatabase();
    const dbRef = ref(db);

    get(child(dbRef, `processos/${processoID}/numero`)).then((snapshot) => {
      setNumero(snapshot.val() || '');
    });
    get(child(dbRef, `processos/${processoID}/nomeCliente`)).then(
      (snapshot) => {
        setNomeCliente(snapshot.val() || '');
      }
    );
    get(child(dbRef, `processos/${processoID}/cpfCliente`)).then((snapshot) => {
      setCpf(snapshot.val() || '');
    });
    get(child(dbRef, `processos/${processoID}/descricao`)).then((snapshot) => {
      setDescricao(snapshot.val() || '');
    });
    get(child(dbRef, `processos/${processoID}/area/area`)).then((snapshot) => {
      setArea(snapshot.val() || '');
    });
    get(child(dbRef, `processos/${processoID}/area/tipo`)).then((snapshot) => {
      setTipo(snapshot.val() || '');
    });
    get(child(dbRef, `processos/${processoID}/arquivos`)).then((snapshot) => {
      setArquivos(snapshot.val() || []);
    });
    get(child(dbRef, `processos/${processoID}/FotoCliente`)).then(
      (snapshot) => {
        setPhotoCliente(snapshot.val() || '');
      }
    );
  }, [processoID]);

  const adicionarArquivo = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const file = result.assets[0];
      setArquivos((prev) => [...prev, file]); // Adiciona localmente
      await url(file); // Passa o arquivo direto
    }
  };

  const url = async (file) => {
    if (!file.url) {
      try {
        const fileBase64 = await FileSystem.readAsStringAsync(file.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const fileName = `documento_${Date.now()}_${file.name}`;
        const buffer = Buffer.from(fileBase64, 'base64');

        const { error: uploadError } = await supabase.storage
          .from('documentos')
          .upload(fileName, buffer, {
            contentType: 'application/pdf',
            upsert: true,
          });

        if (uploadError) {
          console.error('Erro ao enviar PDF:', uploadError.message);
          return;
        }

        const { data: publicData } = await supabase.storage
          .from('documentos')
          .getPublicUrl(fileName);

        if (publicData?.publicUrl) {
          file.url = publicData.publicUrl;

          // Atualiza o estado com a nova URL
          setArquivos((prev) =>
            prev.map((f) =>
              f.uri === file.uri ? { ...f, url: publicData.publicUrl } : f
            )
          );
          console.log('Url implementada no arquivo:', file.name);
        }
      } catch (err) {
        console.error('Erro ao processar arquivo:', err.message);
      }
    }
  };

  const excluirProcesso = async (processoID) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este processo?',
      [
        { text: 'Cancelar' },
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              const db = getDatabase();
              const processoRef = ref(db, `processos/${processoID}`);

              await remove(processoRef);

              console.log('Processo removido com sucesso!');
              navigation.goBack();
            } catch (error) {
              console.error('Erro ao remover processo:', error);
            }
          },
        },
      ]
    );
  };

  const atualizarProcesso = async (processoID) => {
    try {
      const db = getDatabase();
      const processoRef = ref(db, `processos/${processoID}`);

      const atualizacaoData = {
        numero: numero,
        nomeCliente: nomeCliente,
        cpfCliente: cpf,
        descricao: descricao,
        tipo: tipo,
        arquivos: arquivos,
        advogado: advogado,
        FotoDoAvogado: photoAdvogado,
        FotoCliente: photoCliente,
      };

      await update(processoRef, atualizacaoData);

      console.log('Processo atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar processo:', error);
    }
  };

  const concluirProcesso = async (processoID) => {
    Alert.alert(
      'Confirmar conclusão do processo',
      'Este processo sera rotulado como finalizado (Nenhuma alteração sera aceita)',
      [
        { text: 'Cancelar' },
        {
          text: 'Concluir',
          onPress: async () => {
            try {
              const db = getDatabase();

              const dadosFinais = {
                numero: numero,
                nomeCliente: nomeCliente,
                cpfCliente: cpf,
                descricao: descricao,
                tipo: tipo,
                arquivos: arquivos,
                advogado: advogado,
                FotoDoAvogado: photoAdvogado,
                FotoCliente: photoCliente,
              };

              const userId = uuid.v4();
              await set(ref(db, 'processosConcluidos/' + userId), dadosFinais);
              await remove(ref(db, `processos/${processoID}`));

              console.log('Processo concluido com sucesso!');
              navigation.goBack();
            } catch (error) {
              console.error('Erro ao concluir processo:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={estilo.container_principal}>
      {/* NUMERO */}
      <Text style={estilo.numero}>{'[ ' + numero + ' ]'}</Text>

      {/* STATUS BAR */}
      <TouchableOpacity
        style={estilo.Status}
        onPress={() => navigation.navigate('TelaStatus', { processoID })}>
        <Text style={{ marginTop: 5, marginLeft: 20 }}>Status:</Text>
        <Text style={{ marginTop: 5, marginRight: 20, marginLeft: 5 }}>
          Em Andamento
        </Text>
      </TouchableOpacity>

      {/* CLIENTE */}
      <View style={estilo.container_pessoas}>
        <Image
          source={
            photoCliente ? { uri: photoCliente } : require('../assets/icon.png')
          }
          style={estilo.avatar}
        />
        <Text style={estilo.nome}>{nomeCliente}</Text>
        <Text style={{ color: 'gray', fontSize: 12 }}>{' (CLIENTE)'}</Text>
      </View>

      {/* ADVOGADO */}
      <View style={estilo.container_pessoas}>
        <Image
          source={
            photoAdvogado
              ? { uri: photoAdvogado }
              : require('../assets/icon.png')
          }
          style={estilo.avatar}
        />
        <Text style={estilo.nome}>{advogado}</Text>
        <Text style={{ color: 'gray', fontSize: 12 }}>{' (ADVOGADO)'}</Text>
      </View>

      {/* IMPUTS */}
      <View style={estilo.container_imput}>
        <TextInput
          placeholder={'Numero do processo'}
          value={numero}
          onChangeText={setNumero}
          style={estilo.imput}
        />
        <TextInput
          placeholder={'Nome do cliente'}
          value={nomeCliente}
          onChangeText={setNomeCliente}
          style={estilo.imput}
        />
        <TextInput
          placeholder={'CPF do cliente'}
          value={cpf}
          onChangeText={setCpf}
          style={estilo.imput}
        />
        {/* DESCRIÇÃO */}
        <TextInput
          placeholder={'Inserir descrição do processo'}
          value={descricao}
          onChangeText={setDescricao}
          style={[estilo.imput, { height: 100 }]}
          multiline
        />

        {/* Modal para selecionar o area do processo */}
              <TouchableOpacity
                onPress={() => Alert.alert('Erro', 'Não é possivel alterar a area do processo após o cadastro inicial')}
                style={estilo.imput}>
                <Text>{area}</Text>
              </TouchableOpacity>
        
              {/* Modal para selecionar o tipo do processo */}
              <TouchableOpacity
                onPress={() => area ? setModalTipoVisible(true) : Alert.alert('Erro', 'Selecione a area do processo primeiro')}
                style={estilo.imput}>
                <Text>{tipo || 'Selecionar tipo do processo'}</Text>
              </TouchableOpacity>
        
              <Modal
                visible={modalTipoVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalTipoVisible(false)}>
                <View style={estilo.modalContainer}>
                  <View style={estilo.modalContent}>
                    <Text style={estilo.modalTitle}>Selecionar Tipo de Processo</Text>
                    <FlatList
                      data={tipoProcesso[area]}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={estilo.modalItem}
                          onPress={() => {
                            setTipo(item);
                            setModalTipoVisible(false);
                          }}>
                          <Text>{item}</Text>
                        </TouchableOpacity>
                      )}
                    />
                    <TouchableOpacity
                      style={estilo.closeButton}
                      onPress={() => setModalTipoVisible(false)}>
                      <Text style={{ color: 'white' }}>Fechar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

        {/* DOCUMENTOS */}
        <Text
          style={{ marginTop: 20, alignSelf: 'flex-start', marginBottom: 5 }}>
          Documentos do cliente:
        </Text>
        <View
          style={{
            minHeight: 100,
            width: 375,
            backgroundColor: '#ddd',
            padding: 10,
            borderRadius: 10,
            marginBottom: 10,
          }}>
          {arquivos.length === 0 ? (
            <Text style={{ fontStyle: 'italic', color: '#555' }}>
              Nenhum arquivo adicionado
            </Text>
          ) : (
            <FlatList
              data={arquivos}
              keyExtractor={(item, index) => `${item.name}_${index}`}
              renderItem={({ item, index }) => (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 5,
                  }}>
                  <Text
                    style={{ flex: 1 }}
                    onPress={() => {
                      item.url
                        ? Linking.openURL(item.url)
                        : Alert.alert(
                            'Atenção',
                            'O arquivo ainda está sendo enviado.'
                          );
                    }}>
                    <MaterialCommunityIcons name="folder" size={20} />{' '}
                    {item.url ? (
                      item.name
                    ) : (
                      <ActivityIndicator
                        size={15}
                        color="black"
                        paddingHorizontal={10}
                      />
                    )}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setArquivos((prev) => prev.filter((_, i) => i !== index));
                    }}>
                    <Text style={{ fontWeight: 'bold' }}>
                      <MaterialCommunityIcons name="close-circle" size={20} />
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
          <TouchableOpacity
            onPress={adicionarArquivo}
            style={estilo.botaoArquivo}>
            <Text>
              <MaterialCommunityIcons name="paperclip" size={20} /> Adicionar
              Arquivo
            </Text>
          </TouchableOpacity>
        </View>

        <View style={estilo.viewbotoes}>
          {/* EXCLUIR */}
          <TouchableOpacity
            style={estilo.botao}
            onPress={() => excluirProcesso(processoID)}>
            <MaterialCommunityIcons
              name="text-box-remove"
              size={20}
              color="#fff"
              style={estilo.icon}
            />
            <Text style={{ color: 'white' }}>Excluir</Text>
          </TouchableOpacity>

          {/* SALVAR */}
          <TouchableOpacity
            style={estilo.botao}
            onPress={() => atualizarProcesso(processoID)}>
            <MaterialCommunityIcons
              name="text-box"
              size={20}
              color="#fff"
              style={estilo.icon}
            />
            <Text style={{ color: 'white' }}>Salvar</Text>
          </TouchableOpacity>

          {/* CONCLUIR PROCESSO */}
          <TouchableOpacity
            style={estilo.botao}
            onPress={() => concluirProcesso(processoID)}>
            <MaterialCommunityIcons
              name="text-box-check"
              size={20}
              color="#fff"
              style={estilo.icon}
            />
            <Text style={{ color: 'white' }}>Concluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const estilo = StyleSheet.create({
  container_principal: {},
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
    fontSize: 14,
  },
  container_imput: {
    marginTop: 10,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  imput: {
    width: 375,
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
    justifyContent: 'space-around',
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