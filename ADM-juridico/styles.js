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
 backgroundColor: '#0e76a8',
 width: 100,
 height: 40,
 alignItems: 'center',
 justifyContent: 'center',
 borderRadius: 10,
 opacity: 1,
},

container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
},

title: {
  fontSize: 22,
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: 20,
},

formBox: {
  backgroundColor: '#fff',
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 10,
  padding: 20,
},

input: {
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 6,
  padding: 10,
  marginBottom: 15,
},

button: {
  backgroundColor: '#333',
  padding: 12,
  borderRadius: 6,
  marginTop: 10,
},

buttonText: {
  color: '#fff',
  textAlign: 'center',
},

});

export default styles;