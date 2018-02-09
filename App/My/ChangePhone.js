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
      getTime:'获取验证码',
      IsOnpress:false,
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

  Close(){
    this.refs.text.clear();
    this.setState({
      IsShowClose:false,
      texts:'',
      IsOnpress:false,
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

          this.setState({
            IsShowSubmit:true,
            IsPhone:true,
            IsOnpress:true,
          })


      }else{
          this.setState({
            IsShowSubmit:false,
            IsPhone:false,
            IsOnpress:false,
          })
          Toast.showShortCenter('手机号格式错误')
      }
    }else{
      this.setState({
        IsShowSubmit:false,
        IsPhone:false,
        IsOnpress:false,
      })
    }
  }

  Trim(x) {
    return x.replace(/[^0-9]/g,'');
  }

  Trims(x) {
    return x.replace(/\s/g,"");
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

  }


  submit(){
    var that = this;
    fetch('http://139.199.76.191:8889/user/updatePhone', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: this.toQueryString({
         'phone': this.state.texts,
         'code':this.state.PassWord,
         'token':data.result
        })
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
         result.phone = that.state.texts;
         result.result = data.result;
         if(result.code == 0){
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
                <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:WID==320 ? 16 : 18}}>修改手机号</Text>
            </View>
            <View style={{flex:1,justifyContent:'center',alignItems:'flex-end',}}>

            </View>
          </View>
          <Netinfo  {...this.props}/>
          <ScrollView style={{flex:1,paddingTop:30}} keyboardDismissMode={'none'} keyboardShouldPersistTaps={'handled'}>
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
                    短信验证码
                </Animated.Text>
                <View style={{width:Dimensions.get('window').width-50,flexDirection:'row',alignItems:'center',flexDirection:'row',borderBottomWidth:1,borderColor:'#d4dce1'}}>
                   <TextInput
                     ref='Pass'
                     multiline={false}
                     underlineColorAndroid="transparent"
                     onBlur={this.onBlurPass.bind(this)}
                     onFocus={this.onFocusPass.bind(this)}
                     placeholder=''
                     keyboardType={'numeric'}
                     maxLength={20}
                     placeholderTextColor='#999'
                     style={{height: 45,width:250,color:'#000',  borderWidth: 1,padding: 0,borderColor:"transparent",fontSize:16}}
                     onChangeText={(PassWord) => this.changPass.bind(this,PassWord)()}
                   />
                </View>
                {this.state.IsOnpress ? <TouchableOpacity onPress={this.GetCode.bind(this)} activeOpacity={1} style={{position:'absolute',top:12,right:25}}><View ><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#036EB8',fontSize:WID==320 ? 14 : 16}}>{this.state.getTime}</Text></View></TouchableOpacity> : <TouchableOpacity onPress={this.CheckCode.bind(this)} activeOpacity={1} style={{position:'absolute',top:12,right:25}}><View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#ccc',fontSize:WID==320 ? 14 : 16}}>{this.state.getTime}</Text></View></TouchableOpacity>}
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
