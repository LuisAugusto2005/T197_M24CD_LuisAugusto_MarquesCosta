import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TextInput, Image, FlatList, Linking, Modal, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getDatabase, ref, get, set, child, remove, push, update } from 'firebase/database';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../supabaseconfig';
import { Buffer } from 'buffer';

export default function status({ route, navigation }) {

  return (
    <Text>Oi</Text>
  );
}

const estilo = StyleSheet.create({
 
});