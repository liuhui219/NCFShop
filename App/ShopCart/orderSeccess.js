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
  Linking,
  ActivityIndicator,
  StyleSheet,
  BackHandler
} from 'react-native';
import Styles from '../Style';
import Netinfo from '../NetInfo';
import Toast from '@remobile/react-native-toast';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/FontAwesome';
import Order from '../My/Order';
import Ionicons from 'react-native-vector-icons/Ionicons';
const WID = Dimensions.get('window').width;
export default class MyComponent extends Component {
  constructor() {
    super();
    this._pressButton = this._pressButton.bind(this);
    BackHandler.addEventListener('hardwareBackPress', this._pressButton);
    this.state={
      lengthS:0,
    }
  }
  _pressButton() {
      const { navigator } = this.props;
      DeviceEventEmitter.emit('reloadShop','false');
      if(navigator) {
          navigator.pop();
          return true;
      }
      return false;
  }
  Order(){
    var { navigator } = this.props;
     if(navigator) {
         navigator.push({
             name: 'Order',
             component: Order,
         })
     }
  }

  componentDidMount(){
    var shopList = [];
    var totalPrice = [];
    var sunTotal = 0;
    flog = true;
       this.props.TatalData.forEach((info,i)=>{
           this.setState({
             lengthS:info.list.length,
           })
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
                <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:WID==320 ? 16 : 18}}>订单提交成功</Text>
            </View>
            <View style={{flex:1,justifyContent:'center',alignItems:'flex-end',}}>

            </View>
          </View>
          <Netinfo  {...this.props}/>
          <ScrollView style={{flex:1,backgroundColor:'#fff'}}>
             <View style={{backgroundColor:'#fff',}}>
                 <View style={{flexDirection:'row',width:Dimensions.get('window').width,justifyContent:'flex-start',}}>
                    <Image resizeMode={'contain'} style={{width:Dimensions.get('window').width,height:Dimensions.get('window').width/1.8}} source={require('../img/orderSeccess.png')} />
                 </View>
             </View>

             <View style={{marginTop:15}}>
                 {this.props.TatalData.map((info,i)=>{
                   return <View key={i} style={{width:Dimensions.get('window').width,backgroundColor:'#fff',marginBottom:15,padding:15,paddingTop:0}}>
                      <View style={{flex:1,flexDirection:'row',alignItems:'center',height:55,}}>
                         <View style={{flex:1,height:55,flexDirection:'row',alignItems:'center',}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#333',fontSize:16}}>{info.businessName}</Text></View>
                      </View>
                      {info.list.map((data,j)=>{
                        if(data.hasOwnProperty('price')){
                          return <View key={j} style={{flex:1,flexDirection:'row',alignItems:'center',paddingTop:15,paddingBottom:15,}}>
                             <View style={{flex:1,flexDirection:'row'}}>
                               <View style={{width:100, height: 100,overflow:'hidden'}}><Image style={{width:100, height: 100,borderRadius:3,borderWidth:1,borderColor:'#ccc',}} source={{uri:data.thumbImgUrl}} /></View>
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
                                          <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 14 : 16,color:'#FF3E3F',}}>{data.price}</Text>
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
                                    <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 12 : 13,color:'#777',}}>规格：</Text></View>
                                    <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} numberOfLines={1} style={{fontSize:WID==320 ? 12 : 13,color:'#777',}}>{data.spec}</Text></View>
                                  </View>
                                  <View style={{flexDirection:'row'}}>
                                    <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 12 : 13,color:'#777',}}>等级：</Text>
                                    <Text allowFontScaling={false} adjustsFontSizeToFit={false} numberOfLines={1} style={{fontSize:WID==320 ? 12 : 13,color:'#777',}}>{data.level}</Text>
                                  </View>
                                  <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                      <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                          <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 14 : 16,color:'#FF3E3F',}}>商议</Text>
                                      </View>
                                      <View style={{flexDirection:'row',}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} numberOfLines={2} style={{fontSize:14,color:'#777',}}>× {data.num}</Text></View>
                                  </View>
                               </View>
                             </View>
                          </View>
                        }

                      })}

                      <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',alignItems:'center',marginRight:15,marginTop:15}}>
                         <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 14 : 16,color:'#777',}}>{this.state.lengthS}种货品  总金额(含运费)：</Text></View>
                         <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 14 : 16,color:'#FF3E3F',}}>{this.props.sunTotal}</Text></View>
                         {this.props.yuan ? <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 14 : 16,color:'#FF3E3F',}}>元</Text></View> : null}
                      </View>
                   </View>
                 })}
             </View>
          </ScrollView>
          <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginBottom:15}}>
                <TouchableOpacity activeOpacity={1} onPress={this.Order.bind(this)} style={{flex:1,height:50,}}>
                   <View style={{flex:1,justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:'#ccc',marginLeft:15,marginRight:7,height:50,borderRadius:5}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#000',fontSize:WID==320 ? 14 : 16,}}>查看订单</Text></View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5}
                       onPress={()=>Linking.canOpenURL('tel:'+this.props.TatalData[0].businessPhone).then(supported => {
                        if (supported) {
                            Linking.openURL('tel:'+this.props.TatalData[0].businessPhone);
                        } else {

                        }
                       })}
                       underlayColor={'#dedede'}
                       style={{flex:1,height:50,}}

                >
                    <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:'#ccc',marginLeft:7,marginRight:15,height:50,borderRadius:5}}>
                        <View style={{width:15,height:15,marginRight:5}}>
                           <Image resizeMode={'contain'} style={{width:15,height:15}} source={require('../img/submitorder_phone.png')} />
                        </View>
                       <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#000',fontSize:WID==320 ? 14 : 16,}}>联系商家</Text></View>
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
