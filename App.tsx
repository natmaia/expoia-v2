import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as tensorflow from '@tensorflow/tfjs'
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as FileSystem from 'expo-file-system';
import {decodeJpeg} from '@tensorflow/tfjs-react-native';

import { styles } from './styles';
import { useState } from 'react';

import Button from './components/Button';

export default function App() {
  const [selectedImageUri, setSelectedImageUri] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSelectImage(){
    setIsLoading(true);
  
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true, // permite a edição
        //aspect: [4, 3],
        //quality: 1,
      });

      if (!result.canceled) {
        const {uri} = result.assets[0];
        setSelectedImageUri(uri);
        await imageClassification(uri);
      }

    } catch (error){
      console.log('error');
    }finally{
      setIsLoading(false);
    }
  }

  async function imageClassification (imageUri: string){
    await tensorflow.ready();
    const model = await  mobilenet.load();   

    const imageBase64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64
    });
    const imgBuffer = tensorflow.util.encodeString(imageBase64, 'base64').buffer;
    const raw = new Uint8Array(imgBuffer);
    const imagetensor = decodeJpeg(raw);

    const imageClassificationResult = await model.classify(imagetensor);
    console.log(imageClassificationResult);

  }
  
  return (
    <View style={styles.container}>
      <StatusBar style="inverted" backgroundColor='#505050' translucent />

      <Image
        source ={{ uri: selectedImageUri ? selectedImageUri: 'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM='}}
        style={styles.image}
      />


      <View style={styles.results}>
      </View>
      {
        isLoading 
        ? <ActivityIndicator color="#ec96d6" /> 
        : <Button title="Selecionar image" onPress={handleSelectImage}/>
      }


    </View>
  );
}


