import { Text, View, Image, TouchableOpacity } from 'react-native';
import styles from '../styles';

function telaInicial({navigation}) {
 return (
 <View style ={styles.container_principal}>

<View>
 <Image source={require('../assets/snack-icon.png')} style={{flexDirection:"flex-start",alignItems:'center',justifyContent:'center'}} />
 <View style={{flexDirection:"center",alignItems:'center',justifyContent:'center'}}>
  <Text> </Text>
  <Text style={{fontWeight: 'bold'}}> Leandro Silva</Text>
  <Text style={{fontWeight: 'bold'}}> Advocacia e consultoria</Text>
  <Text> </Text>
 </View>
</View>


<View style={styles.botao}>
<TouchableOpacity>
<Text style={styles.texto_botao}> Registrar-se </Text>
</TouchableOpacity>
</View>

<View style={styles.botao}>
<TouchableOpacity>
<Text style={styles.texto_botao}> Entrar </Text>
</TouchableOpacity>
</View>

</View>
 );
}

export default telaInicial;