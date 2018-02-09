/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  DeviceEventEmitter,
  ScrollView,
  BackHandler
} from 'react-native';
import Styles from '../Style';
import Netinfo from '../NetInfo';
import ChangePass from './ChangePass';
import customer from './customer';
import Cache from './Cache';
import About from './About';
import Toast from '@remobile/react-native-toast';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ChangePhone from './ChangePhone';
const WID = Dimensions.get('window').width;
export default class Setting extends Component {
  constructor() {
    super();
    this._pressButton = this._pressButton.bind(this);
    BackHandler.addEventListener('hardwareBackPress', this._pressButton);
  }

  _pressButton() {
       const { navigator } = this.props;
       if(navigator) {
           //很熟悉吧，入栈出栈~ 把当前的页面pop掉，这里就返回到了上一个页面了
           navigator.pop();
           return true;
       }
       return false;
   }
   loginout(){
      storage.clearMap();
  		storage.remove({
  			key: 'loginState'
  		});
      global.data='';
      DeviceEventEmitter.emit('IsLoginout','true');
      const { navigator } = this.props;
      if(navigator) {
          navigator.pop();
          return true;
      }
      return false;
   }

   componentWillUnmount() {
     BackHandler.removeEventListener('hardwareBackPress', this._pressButton);
   }

   change(obj){
     var { navigator } = this.props;
      if(navigator) {
          navigator.push({
              name: 'obj',
              component: obj,
          })
      }
   }


  render() {
    return (
      <View style={Styles.container}>
          <Image  style={{ width: Dimensions.get('window').width, height:125, }} source={require('../img/setting_bg.png')} />
          <View style={[Styles.card,{backgroundColor:'transparent',position:'absolute',left:0,top:0,right:0}]}>
            <View style={{flex:1,justifyContent:'center'}}>
                 <TouchableOpacity onPress={this._pressButton.bind(this)}>
                    <View style={{justifyContent:'flex-start',flexDirection:'row',alignItems:'center',}}>
                      <Icon name="angle-left" size={WID==320 ? 26 : 30} color="#fff" style={{width: 20,marginLeft:10,}} />
                      <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:WID==320 ? 14 : 16,marginLeft:-5,}}>返回</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:WID==320 ? 16 : 18}}>设置</Text>
            </View>
            <View style={{flex:1,justifyContent:'center',alignItems:'flex-end',}}>

            </View>
          </View>
          <Netinfo  {...this.props}/>
           <View style={{width: Dimensions.get('window').width,height:60,position:'absolute',top:95,justifyContent:'center',alignItems:'center',zIndex:99999}}>
              <Image style={{ width: 60, height:60, }} source={require('../img/mine_photo.png')} />
           </View>
           <View style={{width: Dimensions.get('window').width,height:35,backgroundColor:'#fff'}}></View>
           <ScrollView style={{flex:1,backgroundColor:'#F0F0F0'}}>
              <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',height:60,borderBottomWidth:1,borderColor:'#eee',backgroundColor:'#fff'}}>
                 <View style={{width:150,justifyContent:'center',alignItems:'flex-start',paddingLeft:15}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#444444',fontSize:WID==320 ? 14 : 16,}}>修改手机</Text></View>
                 <TouchableOpacity activeOpacity={1} style={{flex:1}} onPress={this.change.bind(this,ChangePhone)}>
                   <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',alignItems:'center',paddingRight:15}}>
                     <View style={{justifyContent:'center',paddingRight:10}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#777',fontSize:WID==320 ? 14 : 16,}}>{data.phone.substr(0,3)+"****"+data.phone.substr(7)}</Text></View>
                     <View><Image resizeMode={'contain'} style={{ width: WID==320 ? 6 : 8, height:20, }} source={require('../img/right.png')} /></View>
                   </View>
                 </TouchableOpacity>
              </View>
              <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',height:60,borderBottomWidth:1,borderColor:'#eee',backgroundColor:'#fff'}}>
                 <View style={{width:150,justifyContent:'center',alignItems:'flex-start',paddingLeft:15}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#444444',fontSize:WID==320 ? 14 : 16,}}>修改登录密码</Text></View>
                 <TouchableOpacity activeOpacity={1} style={{flex:1}} onPress={this.change.bind(this,ChangePass)}>
                   <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',alignItems:'center',paddingRight:15}}>
                     <View><Image resizeMode={'contain'} style={{ width: WID==320 ? 6 : 8, height:20, }} source={require('../img/right.png')} /></View>
                   </View>
                 </TouchableOpacity>
              </View>
              <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',height:60,borderBottomWidth:1,borderColor:'#eee',backgroundColor:'#fff'}}>
                 <View style={{width:150,justifyContent:'center',alignItems:'flex-start',paddingLeft:15}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#444444',fontSize:WID==320 ? 14 : 16,}}>售后政策</Text></View>
                 <TouchableOpacity activeOpacity={1} style={{flex:1}} onPress={this.change.bind(this,customer)}>
                   <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',alignItems:'center',paddingRight:15}}>
                     <View><Image resizeMode={'contain'} style={{ width: WID==320 ? 6 : 8, height:20, }} source={require('../img/right.png')} /></View>
                   </View>
                 </TouchableOpacity>
              </View>
              <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',height:60,borderBottomWidth:1,borderColor:'#eee',backgroundColor:'#fff'}}>
                 <View style={{width:150,justifyContent:'center',alignItems:'flex-start',paddingLeft:15}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#444444',fontSize:WID==320 ? 14 : 16,}}>关于我们</Text></View>
                 <TouchableOpacity activeOpacity={1} style={{flex:1}} onPress={this.change.bind(this,About)}>
                   <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',alignItems:'center',paddingRight:15}}>
                     <View><Image resizeMode={'contain'} style={{ width: WID==320 ? 6 : 8, height:20, }} source={require('../img/right.png')} /></View>
                   </View>
                 </TouchableOpacity>
              </View>
              <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',height:60,borderBottomWidth:1,borderColor:'#eee',backgroundColor:'#fff'}}>
                 <View style={{width:150,justifyContent:'center',alignItems:'flex-start',paddingLeft:15}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#444444',fontSize:WID==320 ? 14 : 16,}}>清除缓存</Text></View>
                 <TouchableOpacity activeOpacity={1} style={{flex:1}} onPress={this.change.bind(this,Cache)}>
                   <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',alignItems:'center',paddingRight:15}}>
                     <View><Image resizeMode={'contain'} style={{ width: WID==320 ? 6 : 8, height:20, }} source={require('../img/right.png')} /></View>
                   </View>
                 </TouchableOpacity>
              </View>
              <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',height:60,borderBottomWidth:1,borderColor:'#eee',backgroundColor:'#fff'}}>
                 <View style={{width:150,justifyContent:'center',alignItems:'flex-start',paddingLeft:15}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#444444',fontSize:WID==320 ? 14 : 16,}}>新版本检测</Text></View>
                 <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',alignItems:'center',paddingRight:15}}>
                   <View><Image resizeMode={'contain'} style={{ width: WID==320 ? 6 : 8, height:20, }} source={require('../img/right.png')} /></View>
                 </View>
              </View>
           </ScrollView>
           <TouchableOpacity onPress={this.loginout.bind(this)} activeOpacity={1}>
             <View style={{width: Dimensions.get('window').width,height:WID==320 ? 45 : 50,justifyContent:'center',alignItems:'center',backgroundColor:'#046EB8'}}>
                <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:WID==320 ? 18 : 20}}>退出登录</Text>
             </View>
           </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
