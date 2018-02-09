/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Styles from './Style'; 
export default class Huihui extends Component {
  constructor() {
    super();

  }

  render() {
    return (
      <View style={styles.container}>
        <View style={Styles.card}>
          <View style={{flex:1,justifyContent:'center'}}>

          </View>
          <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
              <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:18}}>资讯</Text>
          </View>
          <View style={{flex:1,}}>

          </View>
        </View>
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
           <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#777',fontSize:14}}>正在创作中，请耐心等候</Text>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
