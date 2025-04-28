  import React, { useState } from 'react';
  import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
  import { Buffer } from 'buffer';
  import * as ImagePicker from 'expo-image-picker';
  import * as FileSystem from 'expo-file-system';

  import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
  //import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { getFirestore, collection, addDoc } from 'firebase/firestore';
  import { supabase } from '../supabaseconfig';

  import styles from '../styles';
  import { auth, db, storage } from '../firebaseconfig';

  export default function SignIn() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
    const [image, setImage] = useState(null);

    const [imageUri, setImageUri] = useState(null);
    const [imageType, setImageType] = useState(null);

    const pickImage = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
      let uri = result.assets?.[0]?.uri
      let type = result.assets?.[0]?.mimeType
      console.log(uri, type)

      if (!result.canceled) {
        const asset = result.assets?.[0];
        setImage(asset.uri);
        setImageUri(asset.uri);
        setImageType(asset.mimeType);
      }
    };

    const handleRegister = async () => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;
  
        let photoURL = null;
  
        // Se tiver imagem selecionada
        if (imageUri && imageType) {
          const fileName = `profile_${user.uid}_${Date.now()}.jpg`;
  
          try {
            // Lê a imagem como base64
            const fileBase64 = await FileSystem.readAsStringAsync(imageUri, {
              encoding: FileSystem.EncodingType.Base64,
            });
  
            // Envia para o Supabase
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
          } catch (uploadEx) {
            console.error('Erro ao processar imagem:', uploadEx.message);
          }
        }
  
        // Atualiza o perfil do usuário no Firebase
        await updateProfile(user, {
          displayName: nome,
          photoURL: photoURL,
        });

        console.log(photoURL);
  
        // Salva os dados no Firestore
        await addDoc(collection(db, 'usuarios'), {
          uid: user.uid,
          nome,
          email,
          cpf,
          photoURL,
          criadoEm: new Date().toISOString(),
        });
  
        Alert.alert('Sucesso', 'Usuário registrado com sucesso!');
      } catch (error) {
        console.error('Erro ao registrar:', error.message);
        Alert.alert('Erro', error.message);
      }
    };

    return (
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
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          {image && (
            <Image source={{ uri: image }} style={{ width: 100, height: 100, marginBottom: 10, borderRadius: 10 }} />
          )}

          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Adicionar Foto</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Registrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }