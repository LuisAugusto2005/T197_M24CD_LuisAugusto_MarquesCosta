import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

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

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleRegister = async () => {
    //const auth = getAuth(app);
    //const db = getFirestore(app);
    //const storage = getStorage(app);

    try {
      // Cria o usuário no Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      let photoURL = null;


      if (image) {
        // Upload da imagem para o Supabase
        const response = await fetch(image);
        const blob = await response.blob();
        
        const fileName = `profile_${user.uid}_${Date.now()}.jpg`; // Nome único

        const { data, error } = await supabase
          .storage
          .from('profile-pictures') // nome do seu bucket
          .upload(fileName, blob, {
            contentType: 'image/jpeg',
          });

        if (error) {
          console.error('Erro ao enviar imagem:', error.message);
        } else {
          // Pega a URL pública
          const { data: publicData } = supabase
            .storage
            .from('profile-pictures')
            .getPublicUrl(fileName);

          photoURL = publicData.publicUrl;
        }
      }


      await updateProfile(user, {
        displayName: nome,
        photoURL: photoURL,
      });

      // Salva dados adicionais no Firestore
      await addDoc(collection(db, 'usuarios'), {
        uid: user.uid,
        nome,
        email,
        //cpf, //teste
        photoURL,
        criadoEm: new Date().toISOString(),
      });

      alert('Usuário registrado com sucesso!');
    } catch (error) {
      console.error('Erro ao registrar:', error.message);
      alert('Erro: ' + error.message);
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
