import React, { Component } from 'react';
import {
  StyleSheet
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
const Styles = StyleSheet.create({
  card: {
     height:(DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 75 : 65,
     paddingTop:(DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 30 : 20,
     backgroundColor:'#036EB8',
     flexDirection:'row',
     alignItems:'center',
     justifyContent:'center'
  },
  container:{
    flex:1,
    backgroundColor:'#ffffff'
  }
})

module.exports = Styles
