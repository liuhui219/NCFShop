/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  Image,
  TextInput,
  Dimensions,
  Animated,
  StatusBar,
  Keyboard,
  KeyboardAvoidingView,
  ToastAndroid,
  InteractionManager,
  ActivityIndicator,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  DeviceEventEmitter
} from 'react-native';
import Styles from '../../Style';
import Netinfo from '../../NetInfo';
import Toast from '@remobile/react-native-toast';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
const WID = Dimensions.get('window').width;
export default class MyComponent extends Component {
  constructor() {
    super();
    this._pressButton = this._pressButton.bind(this);
    BackHandler.addEventListener('hardwareBackPress', this._pressButton);
  }
  _pressButton() {
      if(this.props.getIMG){
        this.props.getIMG();
      }
      const { navigator } = this.props;
      if(navigator) {
          //很熟悉吧，入栈出栈~ 把当前的页面pop掉，这里就返回到了上一个页面了
          navigator.pop();
          return true;
      }
      return false;
  }
  render() {
    return (
      <View style={Styles.container}>
          <View style={Styles.card}>
                 <View style={{flex:1,justifyContent:'center'}}>
                      <TouchableOpacity onPress={this._pressButton.bind(this)}>
                         <View style={{justifyContent:'flex-start',flexDirection:'row',alignItems:'center',}}>
                           <Icon name="angle-left" size={WID==320 ? 26 : 30} color="#fff" style={{width: 20,marginLeft:10,}} />
                           <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:WID==320 ? 14 : 16,marginLeft:-5,}}>返回</Text>
                         </View>
                     </TouchableOpacity>
                 </View>
                 <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                    <View style={{justifyContent:'center',flexDirection:'row',alignItems:'center'}}>
                          <Text style={{color:'white',fontSize:WID==320 ? 16 : 18}} allowFontScaling={false} adjustsFontSizeToFit={false}>支付说明</Text>
                    </View>
                 </View>
                 <View style={{flex:1,justifyContent:'center'}}>

                 </View>
          </View>
          <Netinfo  {...this.props}/>
          <View style={{flex:1,backgroundColor:'#fff'}}>
             <View style={{ width:Dimensions.get('window').width,justifyContent:'center',alignItems:'center',height:150}}>
                <Image resizeMode={'contain'} style={{ width:Dimensions.get('window').width-60, height:WID==320 ? 50 : 70, }} source={require('../../img/pay_card.png')} />
             </View>
             <View style={{backgroundColor:'#fff',}}>
                <View style={{padding:15,}}>
                   <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#E39438',fontSize:WID==320 ? 14 : 16,}}>请将货款汇入以下账户</Text>
                </View>
             </View>
             <View style={{backgroundColor:'#fff'}}>
                <View style={{flexDirection:'row',padding:10,paddingLeft:15}}>
                   <View style={{width:70}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#000',fontSize:WID==320 ? 14 : 16,}}>户名</Text></View>
                   <View style={{marginLeft:30}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#000',fontSize:WID==320 ? 14 : 16,}}>{this.props.businessInfo.businessAccountName}</Text></View>
                </View>
                <View style={{flexDirection:'row',padding:10,paddingLeft:15}}>
                   <View style={{width:70}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#000',fontSize:WID==320 ? 14 : 16,}}>账户</Text></View>
                   <View style={{marginLeft:30}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#000',fontSize:WID==320 ? 14 : 16,}}>{this.props.businessInfo.businessBankNumber}</Text></View>
                </View>
                <View style={{flexDirection:'row',padding:10,paddingLeft:15}}>
                   <View style={{width:70}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#000',fontSize:WID==320 ? 14 : 16,}}>开户行</Text></View>
                   <View style={{marginLeft:30}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#000',fontSize:WID==320 ? 14 : 16,}}>{this.props.businessInfo.businessBankName}</Text></View>
                </View>

                <View style={{flexDirection:'row',padding:10,paddingLeft:15}}>
                   <View style={{width:70}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#000',fontSize:WID==320 ? 14 : 16,}}>订单编号</Text></View>
                   <View style={{marginLeft:30}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#000',fontSize:WID==320 ? 14 : 16,}}>{this.props.num}</Text></View>
                </View>
             </View>
             <View style={{padding:10,marginTop:20}}>
                <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#999',fontSize:WID==320 ? 12 : 14,lineHeight:WID==320 ? 18 : 25}}>付款后如超过一个工作日，订单仍是“待付款”状态，请提供订单号及汇款底单邮件至yuzaixian@encifang.com</Text>
             </View>
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
