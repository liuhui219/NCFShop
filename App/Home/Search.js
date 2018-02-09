
import React, { Component } from 'react';
import {
  View,
  Text,
  BackHandler,
  TouchableOpacity,
  TextInput,
  StyleSheet
} from 'react-native';
import Styles from '../Style';
import Toast from '@remobile/react-native-toast';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/Ionicons';
export default class Search extends Component {
  constructor(props) {
        super(props);
		    this._pressButton = this._pressButton.bind(this);
        BackHandler.addEventListener('hardwareBackPress', this._pressButton);
    }

    _pressButton() {
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
			      return true;
        }
		    return false;
    }
  render() {
    return (
      <View style={Styles.container}>
        <View style={Styles.card}>
          <View style={{flex:1,backgroundColor:'rgba(255, 255, 255, 1)',borderRadius:5,flexDirection:'row',marginLeft:10}}>
                <View style={{height:30,width:30,justifyContent:'center',alignItems:'center',marginLeft:10}}>
                  <Icon name="ios-search" color="#999" size={20}  />
                </View>
                <TextInput
                  ref='text'
                  multiline={false}
                  underlineColorAndroid="transparent"
                  onChangeText={(texts) => this.changs.bind(this,texts)()}
                  placeholderTextColor={'#999'}
                  style={{height: 30,flex:1,color:'#999',  borderWidth: 1,padding: 0,borderColor:"transparent",fontSize:14}}
                  placeholder='搜索你想要的供求'
                />
           </View>
           <TouchableOpacity onPress={this._pressButton.bind(this)} style={{width:50,justifyContent:'center',alignItems:'center'}}>
             <View style={{width:50,justifyContent:'center',alignItems:'center'}}>
                 <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:16,color:'#fff'}}>取消</Text>
             </View>
           </TouchableOpacity>
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
