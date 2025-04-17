import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
 container_principal:{
 flex:1,
 backgroundColor:'#f2f2f2',
 alignItems: 'center'

 },

 linha:{
   flex:0.3,
   flexDirection: 'row',
   alignItems: 'center',
},

 texto_botao:{
    color:'white',
    fontSize: 15,
},

 botao:{
 backgroundColor: 'black',
 width: 100,
 height: 40,
 alignItems: 'center',
 justifyContent: 'center',
 borderRadius: 10,
 opacity: 1,
},
});

export default styles;