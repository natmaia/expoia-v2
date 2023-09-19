import { View, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native'
import React from 'react'
import { styles } from './styles';

type Props = TouchableOpacityProps & {
    title: string;
}

export default function Button({title, ...rest}: Props) {
  return (
    <TouchableOpacity style={styles.container} {...rest}>
        <Text style={styles.title}>
            {title}
        </Text>
    </TouchableOpacity>
  )
}