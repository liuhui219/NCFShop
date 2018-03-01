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
import Styles from '../Style';
import Netinfo from '../NetInfo';
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
    this.state={
      IsShowClose:false,
      texts:'',
      IsLook:true,
      IsLookNew:true,
      IsShowPass:true,
      IsShowPassClose:false,
      IsShowNewPass:true,
      IsShowNewPassClose:false,
      PassWord:'',
      NewPassWord:'',
      getTime:'获取验证码',
      IsOnpress:false,
      textCode:'',
      PassText:new Animated.Value(12),
      PassFont:new Animated.Value(WID==320 ? 14 : 16),
      newPassText:new Animated.Value(12),
      newPassFont:new Animated.Value(WID==320 ? 14 : 16),
      Islogins:false,
      register:'注册'
    }
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

  Trim(x) {
    return x.replace(/[^0-9]/g,'');
  }

  Trims(x) {
    return x.replace(/\s/g,"");
  }
  IsNumP(x){
    return x.replace(/[^0-9a-zA-Z]/g,"");
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
  }

  changNewPass(pass){
    this.refs.NewPass.setNativeProps({text: this.Trims(this.IsNumP(pass))});
    if(this.Trims(this.IsNumP(pass)).length>0){
      this.setState({
        IsShowNewPassClose:true,
        NewPassWord:this.Trims(this.IsNumP(pass))
      })
    }else{
      this.setState({
        IsShowNewPassClose:false,
        NewPassWord:''
      })
    }
  }

  ClosePass(){
    this.refs.Pass.clear();
    this.setState({
      IsShowNewPassClose:false,
      NewPassWord:''
    })
  }

  CloseNewPass(){
    this.refs.NewPass.clear();
    this.setState({
      IsShowNewPassClose:false,
      NewPassWord:''
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


  onBlurNewPass(){
    this.setState({
      IsShowNewPassClose:false
    })
    if(this.state.NewPassWord.length == 0){
      Animated.parallel([
        Animated.timing(
             this.state.newPassText,
             {
               toValue: 12,
               duration: 300,
             },
        ),
        Animated.timing(
             this.state.newPassFont,
             {
               toValue: WID==320 ? 14 : 16,
               duration: 300,
             },
        )
      ]).start();
    }
  }

  onFocusNewPass(){
    Animated.parallel([
      Animated.timing(
           this.state.newPassText,
           {
             toValue: -15,
             duration: 300,
           },
      ),
      Animated.timing(
           this.state.newPassFont,
           {
             toValue: WID==320 ? 14 : 16,
             duration: 300,
           },
      )
    ]).start();
    if(this.state.NewPassWord.length>0){
      this.setState({
        IsShowNewPassClose:true
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

  ShowNewPass(){
    this.setState({
      IsShowNewPass:true,
      IsLookNew:true
    })
  }

  HideNewPass(){
    this.setState({
      IsShowNewPass:false,
      IsLookNew:false
    })
  }

  submit(){
    var that = this;
    if(this.state.NewPassWord.length<6){
      Toast.showShortCenter('新密码长度至少六位数')
      return false;
    }else{
      fetch('https://yzx.shixiweiyuan.com/user/updatePassword', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: this.toQueryString({
           'oldPassword': this.state.PassWord,
           'newPassword':this.state.NewPassWord,
           'token':data.result
          })
        })
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {

           if(result.code == 0){
             const { navigator } = that.props;
             if(navigator) {
                 navigator.pop();
                 return true;
             }
             return false;
           }else{

             Toast.showShortCenter(result.message)
           }

        })
        .catch((error) => {

           Toast.showShortCenter('您的系统繁忙')
        });
    }

  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._pressButton);
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
                <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:WID==320 ? 16 : 18}}>修改登录密码</Text>
            </View>
            <View style={{flex:1,justifyContent:'center',alignItems:'flex-end',}}>

            </View>
          </View>
          <Netinfo  {...this.props}/>
          <ScrollView style={{flex:1,}} keyboardDismissMode={'none'} keyboardShouldPersistTaps={'handled'}>
              <View style={{justifyContent:'center',alignItems:'center',flexDirection:'row',marginTop:30,}}>
                  <Animated.Text
                    allowFontScaling={false} adjustsFontSizeToFit={false}
                    style={{
                      fontSize: this.state.PassFont,
                      position:'absolute',
                      top:this.state.PassText,
                      left:25,
                      color: '#7c848f'}} >
                      原密码
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

              <View style={{justifyContent:'center',alignItems:'center',flexDirection:'row',marginTop:30,}}>
                  <Animated.Text
                    allowFontScaling={false} adjustsFontSizeToFit={false}
                    style={{
                      fontSize: this.state.newPassFont,
                      position:'absolute',
                      top:this.state.newPassText,
                      left:25,
                      color: '#7c848f'}} >
                      新密码
                  </Animated.Text>
                  <View style={{width:Dimensions.get('window').width-50,borderBottomWidth:1,borderColor:'#d4dce1',flexDirection:'row',alignItems:'center',flexDirection:'row',}}>
                     <TextInput
                       ref='NewPass'
                       multiline={false}
                       underlineColorAndroid="transparent"
                       onBlur={this.onBlurNewPass.bind(this)}
                       onFocus={this.onFocusNewPass.bind(this)}
                       placeholder=''
                       maxLength={20}
                       placeholderTextColor='#999'
                       secureTextEntry={this.state.IsLookNew}
                       style={{height: 45,flex:1,color:'#000',  borderWidth: 1,padding: 0,borderColor:"transparent",fontSize:16}}
                       onChangeText={(NewPassWord) => this.changNewPass.bind(this,NewPassWord)()}
                     />

                       {this.state.IsShowNewPassClose ? <View style={{position:'absolute',right:35,top:8}}>{this.state.IsShowNewPass ? <TouchableOpacity onPress={this.HideNewPass.bind(this)} activeOpacity={1} style={{height:30,width:35,justifyContent:'center',alignItems:'center',}}>
                       <View style={{height:30,width:35,justifyContent:'center',alignItems:'center',marginLeft:10}}>
                         <Ionicons name="md-eye-off" color="#ccc" size={22}  />
                       </View>
                     </TouchableOpacity> : <TouchableOpacity onPress={this.ShowNewPass.bind(this)} activeOpacity={1} style={{height:30,width:35,justifyContent:'center',alignItems:'center',}}>
                       <View style={{height:30,width:35,justifyContent:'center',alignItems:'center',marginLeft:10}}>
                         <Ionicons name="md-eye" color="#666" size={22}  />
                       </View>
                     </TouchableOpacity>}</View> : null}
                     {this.state.IsShowNewPassClose ? <TouchableOpacity onPress={this.CloseNewPass.bind(this)} activeOpacity={1} style={{height:30,width:35,justifyContent:'center',alignItems:'center',}}>
                       <View style={{height:30,width:35,justifyContent:'center',alignItems:'center',marginLeft:10}}>
                         <Ionicons name="md-close-circle" color="#ccc" size={20}  />
                       </View>
                     </TouchableOpacity> : null}
                  </View>
              </View>
          </ScrollView>
          <TouchableOpacity onPress={this.submit.bind(this)} activeOpacity={1}>
            <View style={{width: Dimensions.get('window').width,height:WID==320 ? 45 : 50,justifyContent:'center',alignItems:'center',backgroundColor:'#046EB8'}}>
               <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:WID==320 ? 18 : 20}}>提交</Text>
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
