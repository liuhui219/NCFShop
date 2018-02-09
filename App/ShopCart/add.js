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
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import city from '../Register/city.json';
import Toast from '@remobile/react-native-toast';
import Picker from 'antd-mobile/lib/picker';
import List from 'antd-mobile/lib/list';
import arrayTreeFilter from 'array-tree-filter';
const WID = Dimensions.get('window').width;
const CustomChildren = props => (

    <View style={{width:Dimensions.get('window').width,flexDirection:'row',height:45}}>
      <View style={{width:100,justifyContent:'center',alignItems:'center',}}>
         <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#4D4D4D',fontSize:WID==320 ? 14 : 15,}}>所在地区：</Text>
      </View>
      <TouchableOpacity
        onPress={props.onClick}
        activeOpacity={1}
        style={{ backgroundColor: '#fff',flexDirection:'row',flex:1}}
      >
      <View  style={{ flexDirection:'row',justifyContent:'space-between',alignItems:'center',flex:1,paddingRight:10}}>
        <View style={{ flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#333',fontSize:14}}>{props.extra}</Text></View>
        <Ionicons name="ios-arrow-forward-outline" color="#666" size={WID==320 ? 20 : 24}  />
      </View>
      </TouchableOpacity>
    </View>

);
export default class MyComponent extends Component {
  constructor() {
    super();
    this._pressButton = this._pressButton.bind(this);
    BackHandler.addEventListener('hardwareBackPress', this._pressButton);
    this.state={
      pickerValue: [],
      data: [],
      ischeck:true,
      isDefault:1,
      name:'',
      phone:'',
      addressInfo:'',
      values:'',
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

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._pressButton);
    this.getTime && clearTimeout(this.getTime);
  }

  onOk(values){
    var datas = Array.from(values);
    const treeChildren = arrayTreeFilter(city, (c, level) => c.value === datas[level]);
     this.setState({
       values:treeChildren.map(v => v.label).join(','),
       pickerValue: values
     })
  }

  Trims(x) {
    return x.replace(/\s/g,"");
  }

  Trim(x) {
    return x.replace(/[^0-9]/g,'');
  }

  CheckBox(){
    if(this.state.ischeck){
      this.setState({
        ischeck:false,
        isDefault:0
      })
    }else{
      this.setState({
        ischeck:true,
        isDefault:1
      })
    }
  }

  changs(text){
    this.refs.name.setNativeProps({text: text});
    this.setState({
      name:text
    })
  }

  changPhone(text){
    this.refs.phone.setNativeProps({text: this.Trims(this.Trim(text))});
    this.setState({
      phone:this.Trims(this.Trim(text))
    })

  }

  changaddress(text){
    this.refs.addressInfo.setNativeProps({text: text});
    this.setState({
      addressInfo:text
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

  submit(){
    var that = this;
    if(this.Trims(this.state.name).length == 0){
      Toast.showShortCenter('请输入收货人姓名')
      return false;
    }else if(this.Trims(this.state.phone).length == 0){
      Toast.showShortCenter('请输入联系方式')
      return false;
    }else if(this.state.values.length == 0){
      Toast.showShortCenter('请选择地区')
      return false;
    }else if(this.Trims(this.state.addressInfo).length == 0){
      Toast.showShortCenter('请输入详细地址')
      return false;
    }else{

      fetch('http://139.199.76.191:8889/user/address/add', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: that.toQueryString({
           'receiver': that.state.name,
           'phoneNumber': that.state.phone,
           'address': that.state.values+' '+that.state.addressInfo,
           'isDefault': that.state.isDefault,
           'token': data.result
          })
        })
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {
         if(result.code == 0){
           Toast.showShortCenter('新增成功')
           const { navigator } = that.props;
           var info = {
             'receiver': that.state.name,
             'phoneNumber': that.state.phone,
             'address': that.state.values+' '+that.state.addressInfo,
             'isDefault': that.state.isDefault,
           }
           if(navigator) {
               that.props.getAddres(info);
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
                <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:WID==320 ? 16 : 18}}>新建收货地址</Text>
            </View>
            <View style={{flex:1,justifyContent:'center',alignItems:'flex-end',}}>

            </View>
          </View>
          <Netinfo  {...this.props}/>
          <KeyboardAvoidingView behavior='padding' style={{flex:1}}>
            <ScrollView style={{flex:1}}>
              <View style={{flex:1,flexDirection:'row',paddingTop:10,paddingBottom:10,borderBottomWidth:1,borderColor:'#eee'}}>
                <View style={{width:100,justifyContent:'center',alignItems:'flex-start',paddingLeft:15}}>
                   <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#4D4D4D',fontSize:WID==320 ? 14 : 15,}}>收货人：</Text>
                </View>
                <View style={{flex:1,}}>
                    <TextInput
                      ref='name'
                      multiline={false}
                      underlineColorAndroid="transparent"
                      placeholder='请输入收货人姓名'
                      placeholderTextColor='#CAD1DA'
                      style={{height: 45,flex:1,color:'#000',  borderWidth: 1,padding: 0,borderColor:"transparent",fontSize:WID==320 ? 14 : 15}}
                      onChangeText={(name) => this.changs.bind(this,name)()}
                    />
                </View>
              </View>
              <View style={{flex:1,flexDirection:'row',paddingTop:10,paddingBottom:10,borderBottomWidth:1,borderColor:'#eee'}}>
                <View style={{width:100,justifyContent:'center',alignItems:'center',}}>
                   <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#4D4D4D',fontSize:WID==320 ? 14 : 15,}}>联系电话：</Text>
                </View>
                <View style={{flex:1,}}>
                    <TextInput
                      ref='phone'
                      multiline={false}
                      keyboardType={'numeric'}
                      underlineColorAndroid="transparent"
                      placeholder='请输入联系方式'
                      placeholderTextColor='#CAD1DA'
                      style={{height: 45,flex:1,color:'#000',  borderWidth: 1,padding: 0,borderColor:"transparent",fontSize:WID==320 ? 14 : 15}}
                      onChangeText={(phone) => this.changPhone.bind(this,phone)()}
                    />
                </View>
              </View>
              <View style={{flex:1,flexDirection:'row',paddingTop:10,paddingBottom:10,borderBottomWidth:1,borderColor:'#eee'}}>
                <Picker
                   title="选择地区"
                   extra="选择地区"
                   data={city}
                   format={(values) => { return values.join(' '); }}
                   itemStyle={{fontSize:14,lineHeight:25,textAlign:'center'}}
                   value={this.state.pickerValue}
                   onChange={v => this.onOk.bind(this,v)()}
                   onOk={v => this.setState({ pickerValue: v })}
                 >
                     <CustomChildren></CustomChildren>
                   </Picker>
              </View>
              <View style={{flex:1,flexDirection:'row',paddingTop:10,paddingBottom:10,borderBottomWidth:1,borderColor:'#eee',height:45}}>
                <View style={{width:100,justifyContent:'center',alignItems:'center',}}>
                   <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#4D4D4D',fontSize:WID==320 ? 14 : 15,}}>详细地址：</Text>
                </View>
                <View style={{flex:1,}}>
                    <TextInput
                      ref='addressInfo'
                      multiline={true}
                      numberOfLines={2}
                      underlineColorAndroid="transparent"
                      placeholder='请输入详细地址'
                      placeholderTextColor='#CAD1DA'
                      style={{height: 40,flex:1,color:'#000',  borderWidth: 1,padding: 0,borderColor:"transparent",fontSize:14}}
                      onChangeText={(addressInfo) => this.changaddress.bind(this,addressInfo)()}
                    />
                </View>
              </View>
              <View style={{flex:1,flexDirection:'column',paddingTop:10,paddingBottom:10,borderBottomWidth:1,borderColor:'#eee'}}>
                  <TouchableOpacity activeOpacity={1} onPress={this.CheckBox.bind(this)}>
                      <View style={{flexDirection:'row',alignItems:'center'}}>
                         <View style={{width:50,justifyContent:'center',alignItems:'center'}}>
                            {this.state.ischeck ? <Ionicons name="ios-checkmark-circle" size={WID==320 ? 26 : 30} color="#036EB8" /> : <Ionicons name="ios-radio-button-off" size={WID==320 ? 26 : 30} color="#999" />}
                         </View>
                         <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#4D4D4D',fontSize:WID==320 ? 14 : 15,}}>设为默认地址</Text></View>
                      </View>
                  </TouchableOpacity>
                  <View style={{paddingLeft:50}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#999',fontSize:13,}}>注：每次下单会默认使用该地址</Text></View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
          <TouchableOpacity onPress={this.submit.bind(this)} activeOpacity={1}>
            <View style={{width: Dimensions.get('window').width,height:WID==320 ? 45 : 50,justifyContent:'center',alignItems:'center',backgroundColor:'#046EB8'}}>
               <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:WID==320 ? 16 : 20}}>保存</Text>
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
