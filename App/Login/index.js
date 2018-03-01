/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

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
import Styles from '../Style';
import Netinfo from '../NetInfo';
import Storage from 'react-native-storage';
import Main from '../main';
import JPushModule from 'jpush-react-native';
import JMessage from 'jmessage-react-plugin';
import Register from '../Register';
import Forget from '../ForgetPassWord';
import Toast from '@remobile/react-native-toast';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
const WID = Dimensions.get('window').width;
export default class NCFShop extends Component {

  constructor(props) {
     super(props);
 		 this.state = {
         IsShowClose:false,
         texts:'',
         IsShowPass:true,
         IsShowPassClose:false,
         PassWord:'',
         IsLook:true,
         IsPhone:false,
         IsShowSubmit:false,
         IsPass:false,
         PhoneText:new Animated.Value(12),
         PhoneFont:new Animated.Value(WID==320 ? 14 : 16),
         PassText:new Animated.Value(12),
         PassFont:new Animated.Value(WID==320 ? 14 : 16),
         logins:'登录',
         Islogins:false,
 	     };
     }

 	componentDidMount() {
     StatusBar.setBarStyle('default', true);
     JMessage.init({
       appkey: "0a86dd7a0756f0bafd2b7247",
       isOpenMessageRoaming: false,
       isProduction: true,
     })
  }

  toQueryString(obj) {
    return obj ? Object.keys(obj).sort().map(function (key) {
      var val = obj[key];
      if (Array.isArray(val)) {
        return val.sort().map(function (val2) {
          return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
        }).join('&');
      }

      return encodeURIComponent(key) + '=' + encodeURIComponent(val);
    }).join('&') : '';
  }

  _Splash() {
    var that = this;
    this.setState({
      logins:'登录中...',
      Islogins:true
    })
    fetch('https://yzx.shixiweiyuan.com/user/login', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: this.toQueryString({
         'phone': this.state.texts,
         'password':this.state.PassWord
        })
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
         result.phone = that.state.texts
         if(result.code == 0){
           that.getIm(result);
           JPushModule.setAlias(result.result, (success) => {
               console.log(success)
           })
           that.setState({
             logins:'登录',
             Islogins:false
           })
           global.data=result
           storage.save({
            key: 'loginState',  // 注意:请不要在key中使用_下划线符号!
            rawData: {
              data: result,
            },
            expires: 1000 * 3600 * 30 * 24 * 12
            });
           DeviceEventEmitter.emit('IsLogin','false');
           const { navigator } = that.props;
           if(navigator) {
               navigator.pop();
               return true;
           }
           return false;
         }else{
           that.setState({
             logins:'登录',
             Islogins:false
           })
           Toast.showShortCenter(result.message)
         }

      })
      .catch((error) => {
        that.setState({
          logins:'登录',
          Islogins:false
         })
         Toast.showShortCenter('您的系统繁忙')
      });

     }


    getIm(token){
       var that = this;
       fetch('https://yzx.shixiweiyuan.com/im/getImKey', {
           method: 'POST',
           headers: {
           'Content-Type': 'application/x-www-form-urlencoded',
           },
           body: this.toQueryString({
            'token': token.result
           })
         })
         .then(function (response) {
           return response.json();
         })
         .then(function (result) {
           if(result.code == 0){
             console.log(result)
             if(result.hasOwnProperty('result')){
               token.IM = result.result;
               global.data=token;
               storage.save({
                key: 'loginState',  // 注意:请不要在key中使用_下划线符号!
                rawData: {
                  data: token,
                },
                expires: 1000 * 3600 * 30 * 24 * 12
                });
               JMessage.login({
                 username: result.result,
                 password: "123456789"
               },(success) => {
                  DeviceEventEmitter.emit('IsChat','false');
               }, (error) => {

               })
             }else{
               that.registerIM(token,that);
             }
           }else{

           }
         })
         .catch((error) => {
            Toast.showShortCenter('您的系统繁忙')
         });
     }

     registerIM(token,that){
       fetch('https://yzx.shixiweiyuan.com/im/registerIM', {
           method: 'POST',
           headers: {
           'Content-Type': 'application/x-www-form-urlencoded',
           },
           body: that.toQueryString({
            'token': token.result
           })
         })
         .then(function (response) {
           return response.json();
         })
         .then(function (result) {
           console.log(result)
           if(result.code == 0){

               token.IM = result.result;
               global.data=token;
               storage.save({
                key: 'loginState',  // 注意:请不要在key中使用_下划线符号!
                rawData: {
                  data: token,
                },
                expires: 1000 * 3600 * 30 * 24 * 12
                });
               JMessage.login({
                 username: result.result,
                 password: "123456789"
               },(success) => {
                 console.log(success)
                 DeviceEventEmitter.emit('IsChat','false');
               }, (error) => {

               })

           }else{

           }
         })
         .catch((error) => {
            Toast.showShortCenter('您的系统繁忙')
         });
     }


     changPass(pass){
       this.refs.Pass.setNativeProps({text: this.Trims(pass)});
       if(this.Trims(pass).length>0){
         this.setState({
           IsShowPassClose:true,
           PassWord:this.Trims(pass)
         })
       }else{
         this.setState({
           IsShowPassClose:false,
           PassWord:''
         })
       }
       if(this.Trims(pass).length >= 6){
          if(this.state.IsPhone){
            this.setState({
              IsShowSubmit:true,
              IsPass:true,
            })
          }else{
            this.setState({
              IsShowSubmit:false,
              IsPass:true,
            })
          }
       }else{
         this.setState({
           IsShowSubmit:false,
           IsPass:false,
         })
       }
     }

     Close(){
       this.refs.text.clear();
       this.setState({
         IsShowClose:false,
         texts:'',
         IsShowSubmit:false,
         IsPhone:false,
       })
     }

     onBlur(){
       this.setState({
         IsShowClose:false
       })
       if(this.state.texts.length == 0){
         Animated.parallel([
           Animated.timing(
                this.state.PhoneText,
                {
                  toValue: 12,
                  duration: 300,
                },
           ),
           Animated.timing(
                this.state.PhoneFont,
                {
                  toValue: WID==320 ? 14 : 16,
                  duration: 300,
                },
           )
         ]).start();
       }
     }

     onFocus(){
       Animated.parallel([
         Animated.timing(
              this.state.PhoneText,
              {
                toValue: -15,
                duration: 300,
              },
         ),
         Animated.timing(
              this.state.PhoneFont,
              {
                toValue: WID==320 ? 14 : 16,
                duration: 300,
              },
         )
       ]).start();
       if(this.state.texts.length>0){
         this.setState({
           IsShowClose:true
         })
       }
     }

     changs(text){
       var reg = /^1[3|4|5|7|8][0-9]{9}$/;
       this.refs.text.setNativeProps({text: this.Trim(text)});
       if(this.Trim(text).length>0){
         this.setState({
           IsShowClose:true,
           texts:text
         })
       }else{
         this.setState({
           IsShowClose:false,
           texts:''
         })
       }
       if(this.Trim(text).length == 11){
         if(reg.test(this.Trim(text))){
           if(this.state.IsPass){
             this.setState({
               IsShowSubmit:true,
               IsPhone:true,
             })
           }else{
             this.setState({
               IsShowSubmit:false,
               IsPhone:true,
             })
           }

         }else{
             this.setState({
               IsShowSubmit:false,
               IsPhone:false,
             })
             Toast.showShortCenter('手机号格式错误')
         }
       }else{
         this.setState({
           IsShowSubmit:false,
           IsPhone:false,
         })
       }
     }

     Trim(x) {
       return x.replace(/[^0-9]/g,'');
     }

     Trims(x) {
       return x.replace(/\s/g,"");
     }

     ClosePass(){
       this.refs.Pass.clear();
       this.setState({
         IsShowPassClose:false,
         PassWord:'',
         IsShowSubmit:false,
         IsPass:false,
       })
     }

     onBlurPass(){
       this.setState({
         IsShowPassClose:false
       })
       if(this.state.PassWord.length == 0){
         Animated.parallel([
           Animated.timing(
                this.state.PassText,
                {
                  toValue: 12,
                  duration: 300,
                },
           ),
           Animated.timing(
                this.state.PassFont,
                {
                  toValue: WID==320 ? 14 : 16,
                  duration: 300,
                },
           )
         ]).start();
       }
     }

     onFocusPass(){
       Animated.parallel([
         Animated.timing(
              this.state.PassText,
              {
                toValue: -15,
                duration: 300,
              },
         ),
         Animated.timing(
              this.state.PassFont,
              {
                toValue: WID==320 ? 14 : 16,
                duration: 300,
              },
         )
       ]).start();
       if(this.state.PassWord.length>0){
         this.setState({
           IsShowPassClose:true
         })
       }
     }

     ShowPass(){
       this.setState({
         IsShowPass:true,
         IsLook:true
       })
     }

     HidePass(){
       this.setState({
         IsShowPass:false,
         IsLook:false
       })
     }

     GoReg(){
       var { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'Register',
                component: Register,
            })
        }
     }

     GoForget(){
       var { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'Forget',
                component: Forget,
            })
        }
     }

  render() {
    return (
      <View style={Styles.container}>
      <StatusBar
        backgroundColor={'#000'}
        animated = {true}
        barStyle='dark-content'
        translucent={true}
       />
        <Netinfo  {...this.props}/>
        <View style={{width:Dimensions.get('window').width,height:Dimensions.get('window').height,position:'absolute',top:0,left:0}}>
            <Image style={{ width: Dimensions.get('window').width,height:Dimensions.get('window').height}} source={require('../img/login_bg.png')} />
        </View>
        <KeyboardAvoidingView behavior='padding' style={{flex:1}}>
        <ScrollView style={{flex:1,backgroundColor:'transparent'}} keyboardDismissMode={'none'} keyboardShouldPersistTaps={'handled'}>
          <View style={{ width: Dimensions.get('window').width,justifyContent:'center',alignItems:'center',height:WID==320 ? 160 : 220,}}>
             <Image resizeMode={'contain'} style={{ width: WID==320 ? 70 : 100,}} source={require('../img/login_Logo.png')} />
          </View>

          <View style={{justifyContent:'center',alignItems:'center',flexDirection:'row',}}>
              <Animated.Text
                allowFontScaling={false} adjustsFontSizeToFit={false}
                style={{
                  fontSize: this.state.PhoneFont,
                  position:'absolute',
                  top:this.state.PhoneText,
                  left:25,
                  color: '#7c848f'}} >
                  手机号
              </Animated.Text>
              <View style={{width:Dimensions.get('window').width-50,flexDirection:'row',alignItems:'center',flexDirection:'row',borderBottomWidth:1,borderColor:'#d4dce1'}}>
                  <TextInput
                    ref='text'
                    multiline={false}
                    keyboardType={'numeric'}
                    maxLength={11}
                    onBlur={this.onBlur.bind(this)}
                    onFocus={this.onFocus.bind(this)}
                    underlineColorAndroid="transparent"
                    placeholder=''
                    placeholderTextColor='#999'
                    style={{height: 45,flex:1,color:'#000',  borderWidth: 1,padding: 0,borderColor:"transparent",fontSize:16}}
                    onChangeText={(texts) => this.changs.bind(this,texts)()}
                  />
                  {this.state.IsShowClose ? <TouchableOpacity onPress={this.Close.bind(this)} activeOpacity={1} style={{height:30,width:45,justifyContent:'center',alignItems:'center',}}>
                    <View style={{height:30,width:40,justifyContent:'center',alignItems:'center',marginLeft:10}}>
                      <Ionicons name="md-close-circle" color="#ccc" size={20}  />
                    </View>
                  </TouchableOpacity> : null}
              </View>

          </View>
          <View style={{justifyContent:'center',alignItems:'center',flexDirection:'row',marginTop:30,}}>
              <Animated.Text
                allowFontScaling={false} adjustsFontSizeToFit={false}
                style={{
                  fontSize: this.state.PassFont,
                  position:'absolute',
                  top:this.state.PassText,
                  left:25,
                  color: '#7c848f'}} >
                  密码
              </Animated.Text>
              <View style={{width:Dimensions.get('window').width-50,flexDirection:'row',alignItems:'center',flexDirection:'row',borderBottomWidth:1,borderColor:'#d4dce1'}}>
                 <TextInput
                   ref='Pass'
                   multiline={false}
                   underlineColorAndroid="transparent"
                   onBlur={this.onBlurPass.bind(this)}
                   onFocus={this.onFocusPass.bind(this)}
                   placeholder=''
                   maxLength={20}
                   placeholderTextColor='#999'
                   secureTextEntry={this.state.IsLook}
                   style={{height: 45,flex:1,color:'#000',  borderWidth: 1,padding: 0,borderColor:"transparent",fontSize:16}}
                   onChangeText={(PassWord) => this.changPass.bind(this,PassWord)()}
                 />

                 {this.state.IsShowPassClose ? <View style={{position:'absolute',right:35,top:8}}>{this.state.IsShowPass ? <TouchableOpacity onPress={this.HidePass.bind(this)} activeOpacity={1} style={{height:30,width:35,justifyContent:'center',alignItems:'center',}}>
                   <View style={{height:30,width:35,justifyContent:'center',alignItems:'center',marginLeft:10}}>
                     <Ionicons name="md-eye-off" color="#ccc" size={22}  />
                   </View>
                 </TouchableOpacity> : <TouchableOpacity onPress={this.ShowPass.bind(this)} activeOpacity={1} style={{height:30,width:35,justifyContent:'center',alignItems:'center',}}>
                   <View style={{height:30,width:35,justifyContent:'center',alignItems:'center',marginLeft:10}}>
                     <Ionicons name="md-eye" color="#666" size={22}  />
                   </View>
                 </TouchableOpacity>}</View> : null}
                 {this.state.IsShowPassClose ? <TouchableOpacity onPress={this.ClosePass.bind(this)} activeOpacity={1} style={{height:30,width:35,justifyContent:'center',alignItems:'center',}}>
                   <View style={{height:30,width:35,justifyContent:'center',alignItems:'center',marginLeft:10}}>
                     <Ionicons name="md-close-circle" color="#ccc" size={20}  />
                   </View>
                 </TouchableOpacity> : null}
              </View>

          </View>
          {!this.state.IsShowSubmit ? <TouchableHighlight  style={{justifyContent:'center',backgroundColor:'#dadada',alignItems:'center',marginTop:30,width:Dimensions.get('window').width-50,marginLeft:25,borderRadius:30}}>
              <View style={{width:Dimensions.get('window').width-40,justifyContent:'center',alignItems:'center',borderRadius:20,height:WID==320 ? 40 : 50,}}>
                   <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#aaa',fontSize:WID==320 ? 16 : 18}}>登录</Text>
              </View>
          </TouchableHighlight> : <TouchableHighlight onPress={this._Splash.bind(this)} underlayColor="#0b4f77" style={{justifyContent:'center',borderRadius:2,backgroundColor:'#0b5986',alignItems:'center',marginTop:30,width:Dimensions.get('window').width-50,marginLeft:25,borderRadius:30}}>
              <View style={{width:Dimensions.get('window').width-40,justifyContent:'center',alignItems:'center',borderRadius:20,height:WID==320 ? 40 : 50,}}>
                   <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#fff',fontSize:WID==320 ? 16 : 18}}>{this.state.logins}</Text>
                   {this.state.Islogins ? <View style={{position:'absolute',top:15,right:20}}><ActivityIndicator color="white"/></View> : null}
              </View>

          </TouchableHighlight>}

          <TouchableHighlight onPress={this.GoReg.bind(this)} underlayColor="rgba(231, 224, 224, 0.9)" style={{justifyContent:'center',borderRadius:2,alignItems:'center',marginTop:30,width:Dimensions.get('window').width-50,marginLeft:25,borderRadius:30,borderWidth:1,borderColor:'#d4dce1'}}>
              <View style={{width:Dimensions.get('window').width-40,justifyContent:'center',alignItems:'center',borderRadius:20,height:WID==320 ? 40 : 50,}}>
                   <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#758692',fontSize:WID==320 ? 16 : 18}}>新用户注册</Text>
              </View>
          </TouchableHighlight>

          <View style={{width:Dimensions.get('window').width-40,marginLeft:20,flexDirection:'row',alignItems:'center',justifyContent:'center',flex:1,marginTop:30,marginBottom:30}}>
              <TouchableOpacity onPress={this.GoForget.bind(this)} style={{justifyContent:'center',alignItems:'center',}}>
                <View style={{justifyContent:'center',alignItems:'center',}}>
                   <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#758692',fontSize:WID==320 ? 12 : 14}}>忘记密码?</Text>
                </View>
              </TouchableOpacity>
          </View>

        </ScrollView>
        </KeyboardAvoidingView>
        {this.state.Islogins ? <View style={{width:Dimensions.get('window').width,height:Dimensions.get('window').height,backgroundColor:'transparent',position:'absolute',top:0,left:0}}></View> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
