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
import Picker from 'antd-mobile/lib/picker';
import List from 'antd-mobile/lib/list';
import arrayTreeFilter from 'array-tree-filter';
import Toast from '@remobile/react-native-toast';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
const WID = Dimensions.get('window').width;
const CustomChildrent = props => (

    <View style={{width:Dimensions.get('window').width,flexDirection:'row',height:45}}>
      <View style={{width:120,justifyContent:'center',alignItems:'center',}}>
         <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#4D4D4D',fontSize:WID==320 ? 14 : 16,}}>请选择关闭原因</Text>
      </View>
      <TouchableOpacity
        onPress={props.onClick}
        activeOpacity={1}
        style={{ backgroundColor: '#fff',flexDirection:'row',flex:1}}
      >
      <View  style={{ flexDirection:'row',justifyContent:'space-between',alignItems:'center',flex:1,paddingRight:15}}>
        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',marginRight:15}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#333',fontSize:WID==320 ? 14 : 16}}>{props.extra}</Text></View>
        <View><Image resizeMode={'contain'} style={{ width: WID==320 ? 6 : 8, height:20, }} source={require('../../img/right.png')} /></View>
      </View>
      </TouchableOpacity>
    </View>

);
const seasons = [

  [
    {
      label: '买家取消订单',
      value: '买家取消订单',
    },
    {
      label: '卖家库存不足',
      value: '卖家库存不足',
    },
    {
      label: '其他',
      value: '其他',
    }
  ]
];
export default class MyComponent extends Component {
  constructor() {
    super();
    this._pressButton = this._pressButton.bind(this);
    BackHandler.addEventListener('hardwareBackPress', this._pressButton);
    this.state={
      sValue: ['买家取消订单'],
      textaera:'',
      loaded:false,
    }
  }
  _pressButton() {

      const { navigator } = this.props;
      if(navigator) {
        if(this.props.getIMG){
          this.props.getIMG();
        }
          //很熟悉吧，入栈出栈~ 把当前的页面pop掉，这里就返回到了上一个页面了
          navigator.pop();
          return true;
      }
      return false;
  }

  componentDidMount(){
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
    this.setState({
      loaded:true,
    });
    fetch('http://139.199.76.191:8889/order/closeOrder', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: this.toQueryString({
         'orderNumber': this.props.num,
         'buyerRemark':this.state.textaera,
         'closeReson':this.state.sValue,
         'token':data.result
        })
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {

         if(result.code == 0){
           that.setState({
             loaded:false,
           })

           Toast.showShortCenter('关闭交易成功')
           const { navigator } = that.props;
           if(navigator) {

                 that.props.getReload();


               navigator.pop();
               return true;
           }
           return false;
         }else{
           that.setState({
             loaded:false,
           })
           Toast.showShortCenter(result.message)
         }

      })
      .catch((error) => {
        that.setState({
          loaded:false,
        })
         Toast.showShortCenter('您的系统繁忙')
      });
  }


  render() {
    return (
      <View style={styles.container}>
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
                        <Text style={{color:'white',fontSize:WID==320 ? 16 : 18}} allowFontScaling={false} adjustsFontSizeToFit={false}>关闭交易</Text>
                  </View>
               </View>
               <View style={{flex:1,justifyContent:'center'}}>

               </View>
        </View>
        <Netinfo  {...this.props}/>
        <ScrollView style={{flex:1,backgroundColor:'#eee'}}>
            <View style={{flexDirection:'row',height:55,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',borderBottomWidth:1,borderColor:'#dcdcdc',paddingLeft:10,}}>
                <Picker
                  data={seasons}
                  title="关闭原因"
                  cascade={false}
                  extra="请选择(可选)"
                  itemStyle={{fontSize:WID==320 ? 14 : 16,lineHeight:25,marginBottom:5,color:'#555'}}
                  value={this.state.sValue}
                  onChange={v => this.setState({ sValue: v })}
                  onOk={v => this.setState({ sValue: v })}
                >
                   <CustomChildrent></CustomChildrent>
                 </Picker>
            </View>
            <View style={{flexDirection:'row',backgroundColor:'#fff',alignItems:'flex-start',justifyContent:'center',borderTopWidth:1,borderBottomWidth:1,borderColor:'#dcdcdc',marginTop:15,paddingLeft:10,}}>
                   <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 14 : 16,color:'#333', paddingTop:7,}}>备注</Text>
                   <View style={{flex:1,marginLeft:15,height:150}}>
                     <TextInput
                       onChangeText={(textaera) => this.setState({textaera})}
                       multiline={true}
                       numberOfLines={7}
                       placeholderTextColor={'#ccc'}
                       style={{ color:'#333',fontSize:WID==320 ? 14 : 16,textAlignVertical:'top',paddingTop:7,}}
                       placeholder='请输入备注'
                       underlineColorAndroid={'transparent'}
                     />
                   </View>
               </View>
        </ScrollView>
        <TouchableOpacity onPress={this.submit.bind(this)} activeOpacity={1}>
          <View style={{width: Dimensions.get('window').width,height:WID==320 ? 45 : 50,justifyContent:'center',alignItems:'center',backgroundColor:'#046EB8'}}>
             <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:WID==320 ? 18 : 20}}>确定</Text>
          </View>
        </TouchableOpacity>
        {this.state.loaded ? <View style={{justifyContent: 'center',alignItems: 'center',width:Dimensions.get('window').width,height:Dimensions.get('window').height-((DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 75 : 70),position:'absolute',top:((DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 75 : 70),left:0,}}>
          <View style={styles.loading}>
            <ActivityIndicator color="white"/>
            <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={styles.loadingTitle}>加载中……</Text>
          </View>
       </View> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
        backgroundColor: 'gray',
        height: 80,
        width: 100,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',

    },

    loadingTitle: {
        marginTop: 10,
        fontSize: 14,
        color: 'white'
    },
});
