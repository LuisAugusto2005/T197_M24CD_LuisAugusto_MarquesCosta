import { Text, View, Image, TouchableOpacity } from 'react-native';
import styles from '../styles';

function telaInicial({navigation}) {
 return (
 <View style ={styles.container_principal}>

<View>
 <Image source={require('../assets/Logo_LS.png')} style={{flexDirection:"flex-start",alignItems:'center',justifyContent:'center'}} />
 <View style={{flexDirection:"center",alignItems:'center',justifyContent:'center'}}>
  <Text> </Text>
  <Text style={{fontWeight: 'bold', fontSize: 20}}> Leandro Silva</Text>
  <Text style={{fontWeight: 'bold', fontSize: 18, marginBottom: 20}}> Advocacia e consultoria</Text>
  <Text> </Text>
 </View>
</View>

{/* 
<View style={[styles.botao, {marginBottom: 15}]}>
<TouchableOpacity onPress={() => navigation.navigate('TelaSignIn')}>
<Text style={styles.texto_botao}> Registrar-se </Text>
</TouchableOpacity>
</View>
 */}

<View style={styles.botao}>
<TouchableOpacity onPress={() => navigation.navigate('TelaLogIn')}>
<Text style={styles.texto_botao}> Entrar </Text>
</TouchableOpacity>
</View>

</View>
 );
}

export default telaInicial;