import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { supabase } from './supabaseconfig'; // ou o caminho certo do seu arquivo

export default function TesteStorage() {
  const [arquivos, setArquivos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const listarArquivos = async () => {
      try {
        const { data, error } = await supabase
          .storage
          .from('profile-pictures') // nome do bucket que você está usando
          .list('', {
            limit: 10, // opcional: limitar a quantidade para teste
            offset: 0,
            sortBy: { column: 'name', order: 'asc' },
          });

        if (error) {
          console.error('Erro ao listar arquivos:', error.message);
        } else {
          console.log('Arquivos encontrados:', data);
          setArquivos(data);
        }
      } catch (e) {
        console.error('Erro inesperado:', e);
      } finally {
        setCarregando(false);
      }
    };

    listarArquivos();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {carregando ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView>
          {arquivos.length > 0 ? (
            arquivos.map((arquivo, index) => (
              <Text key={index} style={{ marginBottom: 10 }}>
                {arquivo.name}
              </Text>
            ))
          ) : (
            <Text>Nenhum arquivo encontrado no bucket.</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}
