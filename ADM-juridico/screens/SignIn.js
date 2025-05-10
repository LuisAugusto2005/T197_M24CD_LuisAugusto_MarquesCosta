import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { Buffer } from 'buffer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { supabase } from '../supabaseconfig';

import styles from '../styles';
import { db } from '../firebaseconfig';
import uuid from 'react-native-uuid';

export default function SignIn() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaconf, setSenhaconf] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarSenhaconf, setMostrarSenhaconf] = useState(false);
  const [image, setImage] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [imageType, setImageType] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets?.[0];
      setImage(asset.uri);
      setImageUri(asset.uri);
      setImageType(asset.mimeType);
    }
  };

  const handleRegister = async () => {
    const auth = getAuth();
    let photoURL = null;

    try {
      // Cria usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      // Envia imagem para Supabase
      if (imageUri && imageType) {
        const fileName = `profile_${user.uid}_${Date.now()}.jpg`;

        const fileBase64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('profile-pictures')
          .upload(fileName, Buffer.from(fileBase64, 'base64'), {
            contentType: imageType,
            upsert: true,
          });

        if (uploadError) {
          console.error('Erro ao enviar imagem:', uploadError.message);
        } else {
          const { data: publicData } = await supabase
            .storage
            .from('profile-pictures')
            .getPublicUrl(fileName);

          photoURL = publicData.publicUrl;
        }
      }

      // Atualiza perfil do usuário no Firebase Auth
      await updateProfile(user, {
        displayName: nome,
        photoURL: photoURL,
      });

      // Salva no Realtime Database
      const userId = uuid.v4();
      await set(ref(db, 'usuarios/' + userId), {
        nome,
        email,
        cpf,
        senha,
        photoURL: photoURL || null,
        criadoEm: new Date().toISOString(),
      });

      Alert.alert('Sucesso', 'Usuário registrado com sucesso!');
    } catch (error) {
      console.error('Erro ao registrar:', error.message);
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.formBox}>
          <Text>Nome completo</Text>
          <TextInput
            placeholder="Inserir nome"
            style={styles.input}
            value={nome}
            onChangeText={setNome}
          />

          <Text>Email</Text>
          <TextInput
            placeholder="Inserir Email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          <Text>CPF</Text>
          <TextInput
            placeholder="Inserir CPF"
            style={styles.input}
            value={cpf}
            onChangeText={setCpf}
          />

          <Text>Senha</Text>
          <TextInput
            placeholder="Inserir Senha"
            style={styles.input}
            secureTextEntry={!mostrarSenha}
            value={senha}
            onChangeText={setSenha}
          />
          <TouchableOpacity
            onPress={() => setMostrarSenha(!mostrarSenha)}
            style={{ position: 'absolute', right: 33, top: 278 }}
          >
            <MaterialCommunityIcons name={mostrarSenha ? "eye" : "eye-off"} size={20} />
          </TouchableOpacity>

          <Text>Confirmar Senha</Text>
          <TextInput
            placeholder="Confirme sua Senha"
            style={styles.input}
            secureTextEntry={!mostrarSenhaconf}
            value={senhaconf}
            onChangeText={setSenhaconf}
          />
          <TouchableOpacity
            onPress={() => setMostrarSenhaconf(!mostrarSenhaconf)}
            style={{ position: 'absolute', right: 33, top: 354 }}
          >
            <MaterialCommunityIcons name={mostrarSenhaconf ? "eye" : "eye-off"} size={20} />
          </TouchableOpacity>

          {image && (
            <Image source={{ uri: image }} style={{ width: 100, height: 100, marginBottom: 10, borderRadius: 10 }} />
          )}

          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Adicionar Foto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (senha === senhaconf) {
                handleRegister();
              } else {
                Alert.alert("Erro", "As senhas não coincidem");
              }
            }}
          >
            <Text style={styles.buttonText}>Registrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
