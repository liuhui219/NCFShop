/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Dimensions,
  Image,
  ScrollView,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  Platform,
  DeviceEventEmitter,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  BackHandler
} from 'react-native';
import Styles from '../Style';
import Netinfo from '../NetInfo';
import receipt from './receipt';
import express from './express';
import orderSeccess from './orderSeccess';
import ProAddress from './ProAddress';
import EditAddress from './add';
import Toast from '@remobile/react-native-toast';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
var flog = true;
const WID = Dimensions.get('window').width;
export default class MyComponent extends Component {
  constructor() {
    super();
    this._pressButton = this._pressButton.bind(this);
    BackHandler.addEventListener('hardwareBackPress', this._pressButton);
    this.state={
      IsShowClose:false,
      ticketObj:{ticketTitleType:'',
      ticketCompanyName:'',
      ticketTaxNum:'',
      ticketBankName:'',
      ticketBankNumber:'',
      ticketCompanyAddress:'',
      ticketCompanyPhone:'',
      ticketDetail:'',
      checkBox:true,
      checkBoxs:true,
      ticketType:0,
      tickettitle:'不开发票',
      ticketcontent:''},
      expressObj:{expresstitle:'上门自提',
      sendDate:'',
      checkBoxs:true,
      sendCarNum:'',
      sendWay:1,
      sendPhoneNumber:''},
      sunTotal:0,
      yuan:true,
      loadedx:true,
      Selectaddress:{},
      buyerWords:'',
      shopList:[],
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

  Gdate(n){
      if(n<10){
         return '0'+n;
      }
       else{
           return ''+n;
      }
    }

  componentDidMount(){
    var shopList = [];
    var totalPrice = [];
    var sunTotal = 0;
    flog = true;
    console.log(this.props.TatalData)
    this.getTime = setTimeout(() => {
       this.getAddressData();
       this.setState({
         expressObj:{expresstitle:'请选择',
         sendDate:new Date().getFullYear()+'-'+ this.Gdate(Number(new Date().getMonth()) + Number(1)) +'-'+ this.Gdate(Number(new Date().getDate())),
         sendCarNum:'',
         checkBoxs:true,
         sendWay:1,
         sendPhoneNumber:''},
       })
    },800);
       this.props.TatalData.forEach((info,i)=>{
           info.list.forEach((infos,j)=>{
             var Objects = {'amount':infos.num,'id':infos.id,'productId':infos.productId};
             shopList.push(Objects);
             if(infos.hasOwnProperty('price') && flog == true){
               var price = infos.price * infos.num;
               totalPrice.push(price.toFixed(2));
               if(this.props.TatalData.length-1 == i && info.list.length-1 == j){
                 totalPrice.forEach((num)=>{
                   sunTotal += Number(num);
                 })
                 this.setState({
                   sunTotal:sunTotal.toFixed(2),
                   shopList:shopList,
                   yuan:true
                 })
               }
             }else{

               this.setState({
                 sunTotal:'商议',
                 shopList:shopList,
                 yuan:false
               })
               return flog = false;
             }

           })

       })



  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._pressButton);
    this.getTime && clearTimeout(this.getTime);
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

  getAddressData(){
    var that = this;
    fetch('http://139.199.76.191:8889/user/address/list', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: that.toQueryString({
         'token': data.result
        })
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        console.log(result)
       var array = [];
       if(result.code == 0){
          result.result.forEach((info,i)=>{
             array.push(info.isDefault);
             if(result.result.length-1 == i){
               if(array.includes(1)){
                 array.forEach((infos,j)=>{
                   if(infos == 1){
                     that.setState({
                       Selectaddress:result.result[j],
                     })
                   }
                 })
               }else{
                 that.setState({
                   Selectaddress:result.result[0],
                 })
               }
             }

          })
          that.setState({
            addressData:result.result,
            loaded:false,
            loadedx:false,
          })
       }else{
         Toast.showShortCenter(result.message)
         that.setState({
           loaded:false,
           reload:true,
           Selectaddress:{},
         })
       }

      })
      .catch((error) => {
       Toast.showShortCenter('您的系统繁忙')
       that.setState({
         loaded:false,
         loadedx:false,
         Selectaddress:{},
         reload:true
       })
      });
  }

  closeText(){
    this.refs.buyerWords.clear();
  }
  receipt(){
    var that = this;
    var { navigator } = this.props;
    if(navigator) {
        navigator.push({
            name: 'receipt',
            component: receipt,
            params:{
              ticketObj:that.state.ticketObj,
              getObj: function(obj) {
                console.log(obj)
                that.setState({
                  ticketObj:obj
                })
              }
            }
        })
    }
  }

  Address(){
    var that = this;
    var { navigator } = this.props;
    if(navigator) {
        navigator.push({
            name: 'EditAddress',
            component: EditAddress,
            params:{
              getAddres:function(obj){
                that.setState({
                  Selectaddress:obj
                })
              }
            }
        })
    }
  }

  express(){
    var that = this;
    var { navigator } = this.props;
    if(navigator) {
        navigator.push({
            name: 'express',
            component: express,
            params:{
              expressObj:that.state.expressObj,
              getExpress: function(obj) {
                that.setState({
                  expressObj:obj
                })
              }
            }
        })
    }
  }

  selectAddress(){
    var that = this;
    var { navigator } = this.props;
    if(navigator) {
        navigator.push({
            name: 'ProAddress',
            component: ProAddress,
            params:{
              getAddres:function(obj){
                that.setState({
                  Selectaddress:obj
                })
              }
            }
        })
    }
  }

  submit(){
    var that = this;

    if(JSON.stringify(this.state.Selectaddress) == '{}'){
      Toast.showShortCenter('请选择收货地址')
      return false;
    }else if(this.state.expressObj.sendWay == 1 && this.state.expressObj.sendCarNum == ''){
      Toast.showShortCenter('请选择支付配送')
      return false;
    }else if(this.state.expressObj.sendWay == 1 && this.state.expressObj.sendPhoneNumber == ''){
      Toast.showShortCenter('请选择支付配送')
      return false;
    }else{
      that.setState({
        loadedx:true,
      })
      var that = this;
      var objs = {
        shopList:this.state.shopList,
        businessId:this.props.TatalData[0].businessId,
        buyerWords:this.state.buyerWords,
        receiver:this.state.Selectaddress.receiver,
        address:this.state.Selectaddress.address,
        phoneNumber:this.state.Selectaddress.phoneNumber,
        payWay:1,
        sendWay:this.state.expressObj.sendWay,
        sendDate:this.state.expressObj.sendDate,
        sendCarNum:this.state.expressObj.sendCarNum,
        sendPhoneNumber:this.state.expressObj.sendPhoneNumber,
        ticketBankName:this.state.ticketObj.ticketBankName,
        ticketBankNumber:this.state.ticketObj.ticketBankNumber,
        ticketCompanyAddress:this.state.ticketObj.ticketCompanyAddress,
        ticketCompanyName:this.state.ticketObj.ticketCompanyName,
        ticketCompanyPhone:this.state.ticketObj.ticketCompanyPhone,
        ticketDetail:this.state.ticketObj.ticketDetail,
        ticketTaxNum:this.state.ticketObj.ticketTaxNum,
        ticketType:this.state.ticketObj.ticketType,
        ticketTitleType:this.state.ticketObj.ticketTitleType
      }
      fetch('http://139.199.76.191:8889/order/confirmOrder?token=' + data.result + '', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: that.toQueryString({body:JSON.stringify(objs)})
        })
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {
          console.log(result)
         if(result.code == 0){
           var { navigator } = that.props;
           DeviceEventEmitter.emit('reloadShop','false');
           if(navigator) {
               navigator.replace({
                   name: 'orderSeccess',
                   component: orderSeccess,
                   params:{
                     TatalData:that.props.TatalData,
                     sunTotal:that.state.sunTotal,
                     yuan:that.state.yuan
                   }
               })
           }
           that.setState({
             loadedx:false,
           })
         }else{
           Toast.showShortCenter(result.message)
           that.setState({
             loadedx:false,
           })
         }

        })
        .catch((error) => {
         Toast.showShortCenter('您的系统繁忙')
         that.setState({
           loadedx:false,
         })
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
                <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:WID==320 ? 16 : 18}}>确认订单</Text>
            </View>
            <View style={{flex:1,justifyContent:'center',alignItems:'flex-end',}}>

            </View>
          </View>
          <Netinfo  {...this.props}/>
          <KeyboardAvoidingView behavior='padding' style={{flex:1}}>
          <ScrollView style={{flex:1,backgroundColor:'#eaeaea'}}>
          {JSON.stringify(this.state.Selectaddress) != '{}' ? <TouchableOpacity activeOpacity={1} onPress={this.selectAddress.bind(this)}>
            <View style={{backgroundColor:'#fff'}}>
              <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                <View style={{flex:1}}>
                  <View style={{flexDirection:'row',alignItems:'center',height:50}}>
                     <View style={{paddingLeft:30,paddingRight:30,justifyContent:'center',alignItems:'center'}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#000',fontSize:WID==320 ? 14 : 16,}}>{this.state.Selectaddress.receiver}</Text></View>
                     <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#000',fontSize:WID==320 ? 14 : 16,}}>{this.state.Selectaddress.phoneNumber.substr(0,3)+"****"+this.state.Selectaddress.phoneNumber.substr(7)}</Text></View>
                  </View>
                  <View style={{flexDirection:'row',justifyContent:'center',flex:1,borderBottomWidth:1,borderColor:'#eee',paddingBottom:20}}>
                      <View style={{width:30,alignItems:'center',}}><Image resizeMode={'contain'} style={{ width: WID==320 ? 14 : 16,height:WID==320 ? 16 : 20}} source={require('../img/shipping_adress_place.png')} /></View>
                      <View style={{flex:1,alignItems:'flex-start',flexDirection:'row',}}><Text allowFontScaling={false} numberOfLines={1} adjustsFontSizeToFit={false} style={{color:'#777',fontSize:WID==320 ? 12 : 14,}}>{this.state.Selectaddress.address}</Text></View>
                  </View>
                </View>
                <View style={{paddingRight:15,justifyContent:'center',alignItems:'center'}}><Image resizeMode={'contain'} style={{width:WID==320 ? 10 : 13,height:WID==320 ? 10 : 13}} source={require('../img/right.png')} /></View>
              </View>
            </View>
          </TouchableOpacity> : <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',height:90,backgroundColor:'#fff'}}>
              <TouchableOpacity activeOpacity={1} onPress={this.Address.bind(this)}>
                  <View style={{paddingLeft:25,paddingRight:25,paddingTop:10,paddingBottom:10,backgroundColor:'#036EB8',borderRadius:5}}>
                     <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#fff',fontSize:WID==320 ? 14 : 16,}}>选择收货地址</Text>
                  </View>
              </TouchableOpacity>
          </View>}
          <View style={{marginBottom:15,}}><Image style={{width:Dimensions.get('window').width,height:2}} source={require('../img/orderform_place1.png')} /></View>
          {this.props.TatalData.map((info,i)=>{
            return <View key={i} style={{width:Dimensions.get('window').width,backgroundColor:'#fff',marginBottom:15,padding:15,paddingTop:0}}>
               <View style={{flex:1,flexDirection:'row',alignItems:'center',height:55,}}>
                  <View style={{flex:1,height:55,flexDirection:'row',alignItems:'center',}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#333',fontSize:WID==320 ? 14 : 16}}>{info.businessName}</Text></View>
               </View>
               {info.list.map((data,j)=>{
                 if(data.hasOwnProperty('price')){
                   return <View key={j} style={{flex:1,flexDirection:'row',alignItems:'center',paddingTop:10,paddingBottom:10,}}>
                      <View style={{flex:1,flexDirection:'row'}}>
                        <View style={{width:WID==320 ? 80 : 100, height: WID==320 ? 80 : 100,overflow:'hidden'}}><Image style={{width:WID==320 ? 80 : 100, height: WID==320 ? 80 : 100,borderRadius:3,borderWidth:1,borderColor:'#ccc',}} source={{uri:data.thumbImgUrl}} /></View>
                        <View style={{flex:1,paddingLeft:10,paddingRight:10,justifyContent:'space-between',}}>
                           <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} numberOfLines={2} style={{fontSize:14,color:'#333',lineHeight:20}}>{data.title}</Text></View>

                             <View style={{flexDirection:'row',}}>
                               <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 12 : 13,color:'#777',}}>规格：</Text></View>
                               <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} numberOfLines={1} style={{fontSize:WID==320 ? 12 : 13,color:'#777',}}>{data.spec}</Text></View>
                             </View>
                             <View style={{flexDirection:'row',}}>
                               <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 12 : 13,color:'#777',}}>等级：</Text>
                               <Text allowFontScaling={false} adjustsFontSizeToFit={false} numberOfLines={1} style={{fontSize:WID==320 ? 12 : 13,color:'#777',}}>{data.level}</Text>
                             </View>

                           <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                               <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                   <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:16,color:'#FF3E3F',}}>{data.price}</Text>
                                   <Text allowFontScaling={false} adjustsFontSizeToFit={false} numberOfLines={2} style={{fontSize:WID==320 ? 12 : 13,color:'#FF3E3F',}}>元/{data.unit}</Text>
                               </View>
                               <View style={{flexDirection:'row',}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} numberOfLines={2} style={{fontSize:14,color:'#777',}}>× {data.num}</Text></View>
                           </View>
                        </View>
                      </View>
                   </View>
                 }else{
                   return <View key={j} style={{flex:1,flexDirection:'row',alignItems:'center',paddingTop:15,paddingBottom:15,}}>
                      <View style={{flex:1,flexDirection:'row'}}>
                        <View style={{width:100, height: 100,overflow:'hidden'}}><Image style={{width:100, height: 100,borderRadius:3,borderWidth:1,borderColor:'#ccc',}} source={{uri:data.thumbImgUrl}} /></View>
                        <View style={{flex:1,paddingLeft:10,paddingRight:10,justifyContent:'space-between',}}>
                           <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} numberOfLines={2} style={{fontSize:14,color:'#333',lineHeight:20}}>{data.title}</Text></View>
                           <View style={{flexDirection:'row',}}>
                             <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:13,color:'#777',}}>规格：</Text></View>
                             <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} numberOfLines={1} style={{fontSize:13,color:'#777',}}>{data.spec}</Text></View>
                           </View>
                           <View style={{flexDirection:'row'}}>
                             <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:13,color:'#777',}}>等级：</Text>
                             <Text allowFontScaling={false} adjustsFontSizeToFit={false} numberOfLines={1} style={{fontSize:13,color:'#777',}}>{data.level}</Text>
                           </View>
                           <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                               <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                   <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:16,color:'#FF3E3F',}}>商议</Text>
                               </View>
                               <View style={{flexDirection:'row',}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} numberOfLines={2} style={{fontSize:14,color:'#777',}}>× {data.num}</Text></View>
                           </View>
                        </View>
                      </View>
                   </View>
                 }

               })}

            </View>
          })}
          <View style={{backgroundColor:'#fff'}}>
              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingLeft:15,paddingRight:15,borderBottomWidth:1,borderColor:'#eee',height:50}}>
                 <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 12 : 14,color:'#333333',}}>支付配送</Text></View>
                 <TouchableOpacity activeOpacity={1} onPress={this.express.bind(this)} style={{flex:1,flexDirection:'row',justifyContent:'flex-end'}}>
                 <View style={{flexDirection:'row'}}>
                    <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 12 : 14,color:'#333333',}}>{this.state.expressObj.expresstitle}</Text></View>
                    <View style={{justifyContent:'center',alignItems:'center',paddingLeft:10}}><Image resizeMode={'contain'} style={{width:WID==320 ? 10 : 13,height:WID==320 ? 10 : 13}} source={require('../img/right.png')} /></View>
                 </View>
                 </TouchableOpacity>
              </View>
              <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingLeft:15,paddingRight:15,borderBottomWidth:1,borderColor:'#eee',height:50}}>
                 <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 12 : 14,color:'#333333',}}>留言：</Text></View>
                 <View style={{flexDirection:'row',flex:1,alignItems:'center'}}>
                    <TextInput
                      ref='buyerWords'
                      multiline={false}
                      underlineColorAndroid="transparent"
                      placeholder='告诉卖家你的需求'
                      placeholderTextColor='#aaa'
                      style={{height: 45,flex:1,color:'#000',  borderWidth: 1,padding: 0,paddingLeft:10,borderColor:"transparent",fontSize:WID==320 ? 12 : 14}}
                      onChangeText={(buyerWords) => this.setState({buyerWords})}
                    />
                    {!this.state.IsShowClose ? <TouchableOpacity onPress={this.closeText.bind(this)} activeOpacity={1} style={{height:30,width:30,justifyContent:'center',alignItems:'center',}}>
                      <View style={{height:30,width:30,justifyContent:'center',alignItems:'center',marginLeft:10}}>
                        <Ionicons name="md-close-circle" color="#ccc" size={20}  />
                      </View>
                    </TouchableOpacity> : null}
                 </View>
              </View>
              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingLeft:15,paddingRight:15,borderBottomWidth:1,borderColor:'#eee',height:50}}>
                 <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 12 : 14,color:'#333333',}}>发票</Text></View>
                 <TouchableOpacity activeOpacity={1} onPress={this.receipt.bind(this)} style={{flex:1,flexDirection:'row',justifyContent:'flex-end'}}>
                   <View style={{flexDirection:'row'}}>
                      <View style={{flexDirection:'row'}}>
                        <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 12 : 14,color:'#333333',}}>{this.state.ticketObj.tickettitle}</Text>
                        {this.state.ticketObj.ticketcontent ? <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 12 : 14,color:'#333333',}}> - {this.state.ticketObj.ticketcontent}</Text> : null}
                      </View>
                      <View style={{justifyContent:'center',alignItems:'center',paddingLeft:10}}><Image resizeMode={'contain'} style={{width:WID==320 ? 10 : 13,height:WID==320 ? 10 : 13}} source={require('../img/right.png')} /></View>
                   </View>
                 </TouchableOpacity>
              </View>
              <View style={{flexDirection:'column',justifyContent:'center',padding:15,borderBottomWidth:1,borderColor:'#eee',}}>
                 <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center',}}>
                     <View style={{flexDirection:'row',alignItems:'center'}}>
                        <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 12 : 14,color:'#333333',}}>商品总额</Text></View>
                        <View style={{paddingLeft:5}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:12,color:'#aaa',}}>(参考价)</Text></View>
                     </View>

                     <View style={{flexDirection:'row'}}>
                        <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 14 : 16,color:'#FF3E3F',}}>{this.state.sunTotal}</Text></View>
                        {this.state.yuan ? <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#FF3E3F',}}>元</Text></View> : null}
                     </View>
                 </View>
                 <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:5}}>
                     <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 12 : 14,color:'#333333',}}>运费</Text></View>
                     <View style={{flexDirection:'row'}}>
                        <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#FF3E3F',}}>+ 0元</Text></View>
                     </View>
                 </View>

              </View>
          </View>


          </ScrollView>
          </KeyboardAvoidingView>
          <View style={{width:Dimensions.get('window').width,height:WID==320 ? 45 : 55,backgroundColor:'#fff',flexDirection:'row',justifyContent:'space-between'}}>
             <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center',height:WID==320 ? 45 : 55,borderTopWidth:1,borderColor:'#ddd',paddingRight:15}}>
               <View style={{flexDirection:'row',alignItems:'center',paddingLeft:15}}>
                  <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 14 : 16,color:'#333333',}}>实付款</Text></View>
                  <View style={{paddingLeft:5}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:12,color:'#aaa',}}>(参考价)</Text></View>
               </View>
               <View style={{flexDirection:'row',alignItems:'center'}}>
                  <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 16 : 18,color:'#FF3E3F',}}>{this.state.sunTotal}</Text></View>
                  {this.state.yuan ? <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#FF3E3F',}}>元</Text></View> : null}
               </View>
             </View>
             <TouchableOpacity onPress={this.submit.bind(this)} activeOpacity={1} style={{height:WID==320 ? 45 : 55,width:WID==320 ? 100 : 120,alignItems:'center',justifyContent:'center',backgroundColor:'#FF3D3D',flexDirection:'row'}}>
                 <View style={{height:WID==320 ? 45 : 55,width:WID==320 ? 100 : 120,alignItems:'center',justifyContent:'center',backgroundColor:'#FF3D3D',flexDirection:'row'}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 16 : 18,color:'#fff',}}>提交订单</Text></View>
             </TouchableOpacity>
          </View>
          {this.state.loadedx ? <View style={{justifyContent: 'center',alignItems: 'center',width:Dimensions.get('window').width,height:Dimensions.get('window').height-70,position:'absolute',top:70,left:0,}}>
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
