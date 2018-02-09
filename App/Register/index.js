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
  Keyboard,
  KeyboardAvoidingView,
  ToastAndroid,
  InteractionManager,
  ActivityIndicator,
  TouchableNativeFeedback,
  ScrollView,
  TouchableHighlight,
  DeviceEventEmitter,
  TouchableOpacity
} from 'react-native';
import Styles from '../Style';
import Netinfo from '../NetInfo';
import Agreement from './Agreement';
import Toast from '@remobile/react-native-toast';
import DeviceInfo from 'react-native-device-info';
import JPushModule from 'jpush-react-native';
import JMessage from 'jmessage-react-plugin';
import CustomerComponents,{Navigator} from 'react-native-deprecated-custom-components';
import Company from './CompanyInfo';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
const WID = Dimensions.get('window').width;
export default class MyComponent extends Component {
  constructor(props) {
        super(props);
        this._pressButton = this._pressButton.bind(this);
        BackHandler.addEventListener('hardwareBackPress', this._pressButton);
       	this.state = {
             IsShowClose:false,
             texts:'',
             IsLook:true,
             IsShowPass:true,
             IsShowPassClose:false,
             PassWord:'',
             getTime:'获取验证码',
             IsOnpress:false,
             textCode:'',
             IsSubmit:false,
             PhoneText:new Animated.Value(12),
             PhoneFont:new Animated.Value(WID==320 ? 14 : 16),
             CodeText:new Animated.Value(12),
             CodeFont:new Animated.Value(WID==320 ? 14 : 16),
             PassText:new Animated.Value(12),
             PassFont:new Animated.Value(WID==320 ? 14 : 16),
             Islogins:false,
             register:'注册'
       	 };
    }
   componentDidMount() {
     JMessage.init({
       appkey: "fdbbb12e83955a2ae9a51dbb",
       isOpenMessageRoaming: false,
       isProduction: true,
     })
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

    agree(){

		var { navigator } = this.props;
        if(navigator) {
			     InteractionManager.runAfterInteractions(() => {
              navigator.push({
                  name: 'Agreement',
                  component: Agreement
              })
			     })
        }
	}



    componentWillUnmount() {
  	  BackHandler.removeEventListener('hardwareBackPress', this._pressButton.bind(this));
      clearInterval(this.Countdown);
  	}

    Close(){
      this.refs.text.clear();
      this.setState({
        IsShowClose:false,
        IsOnpress:false,
        IsSubmit:false,
        texts:''
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

    onCodeFocus(){
      Animated.parallel([
        Animated.timing(
             this.state.CodeText,
             {
               toValue: -15,
               duration: 300,
             },
        ),
        Animated.timing(
             this.state.CodeFont,
             {
               toValue: WID==320 ? 14 : 16,
               duration: 300,
             },
        )
      ]).start();
    }

    onCodeBlur(){
      if(this.state.textCode.length == 0){
        Animated.parallel([
          Animated.timing(
               this.state.CodeText,
               {
                 toValue: 12,
                 duration: 300,
               },
          ),
          Animated.timing(
               this.state.CodeFont,
               {
                 toValue: WID==320 ? 14 : 16,
                 duration: 300,
               },
          )
        ]).start();
      }
    }

    Trim(x) {
      return x.replace(/[^0-9]/g,'');
    }

    Trims(x) {
      return x.replace(/\s/g,"");
    }
    IsNumP(x){
      return x.replace(/[^0-9a-zA-Z]/g,"");
    }

    changs(text){
      var reg = /^1[3|4|5|7|8][0-9]{9}$/;
      this.refs.text.setNativeProps({text: this.Trim(text)});
      if(this.Trim(text).length>0){
        this.setState({
          IsShowClose:true,
          texts:this.Trim(text)
        })
      }else{
        this.setState({
          IsShowClose:false,
          texts:''
        })
      }
      if(this.Trim(text).length == 11){
        if(reg.test(this.Trim(text))){
          if(this.state.IsPass && this.state.IsCode){
            this.setState({
              IsOnpress:true,
              isPhones:true,
              IsSubmit:true
            })
          }else{
            this.setState({
              IsOnpress:true,
              isPhones:true,
              IsSubmit:false
            })
          }

        }else{
          this.setState({
            IsOnpress:false,
            isPhones:false,
            IsSubmit:false
          })
          Toast.showShortCenter('手机号格式错误')
        }
      }else{
        this.setState({
          IsOnpress:false,
          isPhones:false,
          IsSubmit:false
        })
      }
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

    GetCode(){
      this.refs.text.blur();
      var that = this;
      fetch('http://139.199.76.191:8889/user/getLoginCode', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: this.toQueryString({
           'phone': this.state.texts
          })
        })
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {
         if(result.code == 0){
           var Time = 60;
           that.setState({
             IsOnpress:false
           })
           that.Countdown = setInterval(() =>{
             Time = Time-1;
             that.setState({
               getTime:Time+'s后重新获取'
             })
             if(Time < 1){
               clearInterval(that.Countdown);
               that.setState({
                 getTime:'获取验证码',
                 IsOnpress:true
               })
             }
           },1000);
         }else{
           Toast.showShortCenter(result.message)
         }

        })
        .catch((error) => {
         Toast.showShortCenter('您的系统繁忙')
        });



    }

    getData(){

    }

    CheckCode(){
      var reg = /^1[3|4|5|7|8][0-9]{9}$/;
      if(this.Trim(this.state.texts).length == 11){
          if(!reg.test(this.Trim(this.state.texts))){
            Toast.showShortCenter('手机号格式错误')
          }
      }else{
        Toast.showShortCenter('手机号格式错误')
      }
    }

    changCode(textCode){

      this.setState({
        textCode:textCode
      })
      if(this.Trims(textCode).length == 6){
        if(this.state.isPhones && this.state.IsPass){
          this.setState({
            IsSubmit:true,
            IsCode:true,
          })
        }else{
          this.setState({
            IsSubmit:false,
            IsCode:true,
          })
        }
      }else{
        this.setState({
          IsSubmit:false,
          IsCode:false,
        })
      }
    }

    changPass(pass){
      this.refs.Pass.setNativeProps({text: this.Trims(this.IsNumP(pass))});
      if(this.Trims(this.IsNumP(pass)).length>0){
        this.setState({
          IsShowPassClose:true,
          PassWord:this.Trims(this.IsNumP(pass))
        })
      }else{
        this.setState({
          IsShowPassClose:false,
          PassWord:''
        })
      }

      if(this.Trims(pass).length >= 6){
         if(this.state.isPhones && this.state.IsCode){
           this.setState({
             IsSubmit:true,
             IsPass:true,
           })
         }else{
           this.setState({
             IsSubmit:false,
             IsPass:true,
           })
         }
      }else{
        this.setState({
          IsSubmit:false,
          IsPass:false,
        })
      }
    }

    ClosePass(){
      this.refs.Pass.clear();
      this.setState({
        IsShowPassClose:false,
        IsSubmit:false,
        PassWord:''
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

    Submit(){
      var that = this;

      var reg = /^1[3|4|5|7|8][0-9]{9}$/;
      if(this.state.texts.length == 0){
        Toast.showShortCenter('请输入手机号')
        return false;
      }else if(this.state.texts.length < 11){
        Toast.showShortCenter('手机号格式错误')
        return false;
      }else if(this.state.texts.length == 11 && !reg.test(this.Trim(this.state.texts))){
        Toast.showShortCenter('手机号格式错误')
        return false;
      }else if(this.state.textCode.length == 0){
        Toast.showShortCenter('请输入验证码')
        return false;
      }else if(this.state.PassWord.length<6){
        Toast.showShortCenter('密码长度至少六位数')
        return false;
      }else{
        this.setState({
          register:'注册中...',
          Islogins:true,
        });
        fetch('http://139.199.76.191:8889/user/register', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: this.toQueryString({
             'phone': this.state.texts,
             'code':this.state.textCode,
             'password':this.state.PassWord
            })
          })
          .then(function (response) {
            return response.json();
          })
          .then(function (result) {

             if(result.code == 0){
               result.phone = that.state.texts
               global.data=result
               that.getIm(result);
               JPushModule.setAlias(result.result, (success) => {
                   console.log(success)
               })
        			 storage.save({
        				key: 'loginState',
        				rawData: {
        				  data: result,
        				},
        				expires: 1000 * 3600 * 30 * 24 * 12
        			  });
              var { navigator } = that.props;
                  if(navigator) {
          			     InteractionManager.runAfterInteractions(() => {
                        navigator.push({
                            name: 'Company',
                            component: Company,
                            params: {
                    					token: result.result,
                    				}
                        })
          			     })
                  }
              that.setState({
                register:'注册',
                Islogins:false,
              })

             }else{
               Toast.showShortCenter(result.message)
               that.setState({
                 register:'注册',
                 Islogins:false,
               })
             }

          })
          .catch((error) => {
              Toast.showShortCenter('您的系统繁忙')
              that.setState({
                register:'注册',
                Islogins:false,
              })
          });
      }
    }

    getIm(token){
       var that = this;
       fetch('http://139.199.76.191:8889/im/getImKey', {
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
       fetch('http://139.199.76.191:8889/im/registerIM', {
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
           if(result.code == 0){
               console.log(result)
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

  render() {
    return (
      <View style={styles.container}>

          <Netinfo  {...this.props}/>
          <View style={{width:Dimensions.get('window').width,height:Dimensions.get('window').height,position:'absolute',top:0,left:0}}>
              <Image style={{ width: Dimensions.get('window').width,height:Dimensions.get('window').height}} source={require('../img/login_bg.png')} />
          </View>
          <View style={{flexDirection:'row',position:'absolute',top:(DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 45 : 35,right:20,zIndex:999999}}>
              <View>
                 <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#999999',fontSize:WID==320 ? 14 : 16}}>已有账号，去</Text>
              </View>
              <TouchableOpacity onPress={this._pressButton.bind(this)}>
                  <View>
                     <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#0b5986',fontSize:WID==320 ? 14 : 16}}>登录</Text>
                  </View>
              </TouchableOpacity>
          </View>
          <KeyboardAvoidingView behavior='padding' style={{flex:1}}>
              <ScrollView keyboardShouldPersistTaps={'always'}  style={{flex:1,backgroundColor:'transparent'}} keyboardDismissMode={'none'} keyboardShouldPersistTaps={'handled'}>
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
                     <View style={{width:Dimensions.get('window').width-50,borderBottomWidth:1,borderColor:'#d4dce1',flexDirection:'row',alignItems:'center',flexDirection:'row',}}>
                        <View></View>
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
                         fontSize: this.state.CodeFont,
                         position:'absolute',
                         top:this.state.CodeText,
                         left:25,
                         color: '#7c848f'}} >
                         验证码
                     </Animated.Text>
                     <View style={{width:Dimensions.get('window').width-180,borderBottomWidth:1,borderColor:'#d4dce1',flexDirection:'row',alignItems:'center',flexDirection:'row',}}>
                        <TextInput
                          multiline={false}
                          keyboardType={'numeric'}
                          onBlur={this.onCodeBlur.bind(this)}
                          onFocus={this.onCodeFocus.bind(this)}
                          underlineColorAndroid="transparent"
                          placeholder=''
                          maxLength={6}
                          placeholderTextColor='#999'
                          style={{height: 45,flex:1,color:'#000',  borderWidth: 1,padding: 0,borderColor:"transparent",fontSize:16}}
                          onChangeText={(textCode) => this.changCode.bind(this,textCode)()}
                        />
                     </View>
                     {this.state.IsOnpress ? <TouchableHighlight underlayColor="#c5c7c9" style={{borderRadius:30,width:120,height:40,marginLeft:10,}} onPress={this.GetCode.bind(this)}>
                       <View style={{justifyContent:'center',alignItems:'center',width:120,height:WID==320 ? 35 : 40,backgroundColor:'#fff',borderRadius:30,borderColor:'rgba(11, 89, 134, 0.67)',borderWidth:1 }}>
                          <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#0b5986',fontSize:WID==320 ? 12 : 14}}>{this.state.getTime}</Text>
                       </View>
                     </TouchableHighlight> : <TouchableOpacity activeOpacity={1} style={{borderRadius:30,}} onPress={this.CheckCode.bind(this)}>
                       <View style={{justifyContent:'center',alignItems:'center',width:120,height:WID==320 ? 35 : 40,marginLeft:10,backgroundColor:'#fff',borderRadius:30,borderColor:'#ccc',borderWidth:1}}>
                          <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#ccc',fontSize:WID==320 ? 12 : 14}}>{this.state.getTime}</Text>
                       </View>
                     </TouchableOpacity>}

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
                         设置密码
                     </Animated.Text>
                     <View style={{width:Dimensions.get('window').width-50,borderBottomWidth:1,borderColor:'#d4dce1',flexDirection:'row',alignItems:'center',flexDirection:'row',}}>
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
                 {!this.state.IsSubmit ? <TouchableOpacity activeOpacity={1} onPress={this.Submit.bind(this)}  style={{justifyContent:'center',backgroundColor:'#dadada',alignItems:'center',marginTop:50,width:Dimensions.get('window').width-50,marginLeft:25,borderRadius:30}}>
                     <View style={{width:Dimensions.get('window').width-40,justifyContent:'center',alignItems:'center',borderRadius:20,height:WID==320 ? 40 : 50,}}>
                          <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#aaa',fontSize:WID==320 ? 16 : 18}}>注册</Text>
                     </View>
                 </TouchableOpacity> : <TouchableHighlight onPress={this.Submit.bind(this)} underlayColor="#0a689e" style={{justifyContent:'center',backgroundColor:'#0b5986',alignItems:'center',marginTop:50,width:Dimensions.get('window').width-50,marginLeft:25,borderRadius:30}}>
                     <View style={{width:Dimensions.get('window').width-50,justifyContent:'center',alignItems:'center',borderRadius:30,height:WID==320 ? 40 : 50,}}>
                          <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#fff',fontSize:WID==320 ? 16 : 18}}>{this.state.register}</Text>
                          {this.state.Islogins ? <View style={{position:'absolute',top:15,right:20}}><ActivityIndicator color="white"/></View> : null}
                     </View>
                 </TouchableHighlight>}
              </ScrollView>
          </KeyboardAvoidingView>
          <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#fff',paddingBottom:20}}>
              <View style={{justifyContent:'center',alignItems:'center'}}>
                 <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#aaa',fontSize:12}}>点击“注册”按钮，即表示同意</Text>
              </View>
              <TouchableOpacity onPress={this.agree.bind(this)}>
                  <View style={{justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                     <Text>《</Text><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#222',fontSize:12}}>鱼在线用户协议</Text><Text>》</Text>
                  </View>
              </TouchableOpacity>

          </View>
          {this.state.Islogins ? <View style={{width:Dimensions.get('window').width,height:Dimensions.get('window').height,backgroundColor:'transparent',position:'absolute',top:0,left:0}}></View> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#fff'
  },
});
