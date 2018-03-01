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
  StatusBar,
  Keyboard,
  RefreshControl,
  KeyboardAvoidingView,
  ToastAndroid,
  InteractionManager,
  ScrollView,
  Linking,
  TouchableHighlight,
  TouchableOpacity,
  DeviceEventEmitter
} from 'react-native';
import Styles from '../Style';
import Netinfo from '../NetInfo';
import setting from './setting';
import PerInfo from './PerInfo';
import Address from './Address';
import Order from './Order';
import Help from './Help';
import Toast from '@remobile/react-native-toast';
import JPushModule from 'jpush-react-native';
import DeviceInfo from 'react-native-device-info';
import CustomerComponents,{Navigator} from 'react-native-deprecated-custom-components';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
const WID = Dimensions.get('window').width;
export default class MyComponent extends Component {
  constructor() {
    super();
    this.state={
      DataCount:{'waitConfirm':0,'waitPay':0,'waitReceive':0,'waitSend':0},
      isRefreshing:false,
    }

  }

  componentWillMount(){

  }
  componentDidMount(){
    this.getData();
    DeviceEventEmitter.addListener('reloadShop',(datas) =>{
       this.getData();
    })
    JPushModule.addReceiveNotificationListener((map)=>{
      this.getData();
    });
  }

  componentWillUnmount() {
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

  getData(){
    var that = this;
    fetch('https://yzx.shixiweiyuan.com/order/countOrder', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: this.toQueryString({
         'token':data.result
        })
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
          if(result.code == 0){
            that.setState({
              DataCount:result.result,
              isRefreshing:false,
            })
          }else{
            if(result.code == 10010){
              storage.clearMap();
          		storage.remove({
          			key: 'loginState'
          		});
              global.data='';
              DeviceEventEmitter.emit('IsLoginout','true');
              Toast.showShortCenter(result.message)
            }else{
              Toast.showShortCenter(result.message)
            }

            that.setState({
              isRefreshing:false,
            })
          }
      })
      .catch((error) => {
         Toast.showShortCenter('您的系统繁忙')
         that.setState({
           isRefreshing:false,
         })
      });
  }

  setting(){
    var { navigator } = this.props;
     if(navigator) {
         navigator.push({
             name: 'setting',
             component: setting
         })
     }
  }

  PerInfo(){
    var { navigator } = this.props;
     if(navigator) {
         navigator.push({
             name: 'PerInfo',
             component: PerInfo
         })
     }
  }

  Push(obj){
    var { navigator } = this.props;
     if(navigator) {
         navigator.push({
             name: 'obj',
             component: obj
         })
     }
  }

  Push1(obj,i){
    var that = this;
    var { navigator } = this.props;
     if(navigator) {
         navigator.push({
             name: 'obj',
             component: obj,
             params:{
               index:i,
               Allreload:function(){
                 that.getTime = setTimeout(() => {
                    that.getData();
                 },800);
               }
             }
         })
     }
  }

  _onRefresh(){
    this.setState({
      isRefreshing:true,
    })
    this.getData();
  }

  render() {
    return (
      <View style={Styles.container}>
          <StatusBar
            backgroundColor={'#000'}
            animated = {true}
            barStyle='light-content'
            translucent={true}
           />
          <Image style={{ width: Dimensions.get('window').width, height:175,position:'absolute',left:0,top:0,right:0 }} source={require('../img/My_bg.png')} />
          <View style={[Styles.card,{backgroundColor:'transparent'}]}>
            <View style={{flex:1,justifyContent:'center'}}>

            </View>
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:WID==320 ? 16 : 18}}>我的</Text>
            </View>
            <View style={{flex:1,justifyContent:'center',alignItems:'flex-end',}}>
              <TouchableOpacity activeOpacity={1} onPress={this.setting.bind(this)}>
               <View style={{paddingRight:15}}><Image resizeMode={'contain'} style={{ width: 22, height:22, }} source={require('../img/mine_settment.png')} /></View>
              </TouchableOpacity>
            </View>
          </View>
          <Netinfo  {...this.props}/>
          <View style={{width: Dimensions.get('window').width,}}>
             <View style={{width: Dimensions.get('window').width,height:100,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                 <View style={{width:90,flexDirection:'row',justifyContent:'center',alignItems:'center',}}>
                    <View style={{width:90,justifyContent:'center',alignItems:'center'}}><Image style={{ width: WID==320 ? 50 : 60, height:WID==320 ? 50 : 60, }} source={require('../img/mine_photo.png')} /></View>
                 </View>
                 <TouchableOpacity activeOpacity={1} style={{flex:1,flexDirection:'row',alignItems:'center',paddingRight:20,height:100,backgroundColor:'transparent'}} onPress={this.PerInfo.bind(this)}>
                   <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center',}}>
                     <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:WID==320 ? 14 : 16}}>{data.phone.substr(0,3)+"****"+data.phone.substr(7)}</Text></View>
                     <View><Image resizeMode={'contain'} style={{ width: WID==320 ? 6 : 8, height:20, }} source={require('../img/mine_arrow_right.png')} /></View>
                   </View>
                 </TouchableOpacity>
             </View>
          </View>

          <ScrollView style={{flex:1,backgroundColor:'#F4F3F9',}}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isRefreshing}
                  onRefresh={this._onRefresh.bind(this)}

                  colors={['#036EB8', '#00ff00', '#0000ff','#036EB8']}
                  progressBackgroundColor="#ffffff"
                />
              }
          >
           <View style={{padding:15}}>
            <View style={{flex:1,backgroundColor:'#fff',borderRadius:5,}}>
              <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#fff',paddingLeft:15,paddingRight:15,borderRadius:5}}>
                <View style={{flex:1,flexDirection:'row',borderBottomWidth:1,borderColor:'#eee',paddingTop:15,paddingBottom:15}}>
                  <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#777',fontSize:14}}>我的订单</Text></View>
                  <TouchableOpacity onPress={this.Push1.bind(this,Order,0)} activeOpacity={1} style={{flex:1}}>
                  <View style={{flex:1,justifyContent:'flex-end',flexDirection:'row',alignItems:'center'}}>
                    <View style={{marginRight:5}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#777',fontSize:14}}>全部订单</Text></View>
                    <View><Image resizeMode={'contain'} style={{ width: WID==320 ? 6 : 8, height:20, }} source={require('../img/right.png')} /></View>
                  </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{flexDirection:'row',flex:1,justifyContent:'center',alignItems:'center',}}>
                 <TouchableOpacity activeOpacity={1} onPress={this.Push1.bind(this,Order,1)} style={{flex:1,justifyContent:'center',alignItems:'center',paddingTop:30,paddingBottom:30}}>
                   <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                     <View style={{width:40,height:30,justifyContent:'center',alignItems:'center'}}>
                       <Image resizeMode={'contain'} style={{ width: 30, height:30, }} source={require('../img/mine_confirm.png')} />
                       {this.state.DataCount.waitConfirm != 0 ? <View style={{position:'absolute',top:-10,left:26,borderWidth:1,borderColor:'#f94444',borderRadius:10,paddingLeft:5,paddingRight:5,backgroundColor:'#f94444',zIndex:99999999}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#fff',fontSize:12,padding:0}}>{this.state.DataCount.waitConfirm}</Text></View> : null}
                     </View>
                     <View style={{marginTop:8}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#777',fontSize:12}}>待确定</Text></View>
                   </View>
                 </TouchableOpacity>
                 <TouchableOpacity activeOpacity={1} onPress={this.Push1.bind(this,Order,2)} style={{flex:1,justifyContent:'center',alignItems:'center',paddingTop:30,paddingBottom:30}}>
                   <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                     <View style={{width:40,height:30,justifyContent:'center',alignItems:'center'}}>
                       <Image resizeMode={'contain'} style={{ width: 30, height:30, }} source={require('../img/mine_pay.png')} />
                       {this.state.DataCount.waitPay != 0 ? <View style={{position:'absolute',top:-10,left:26,borderWidth:1,borderColor:'#f94444',borderRadius:10,paddingLeft:5,paddingRight:5,backgroundColor:'#f94444',}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#fff',fontSize:12,padding:0}}>{this.state.DataCount.waitPay}</Text></View> : null}
                     </View>
                     <View style={{marginTop:8}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#777',fontSize:12}}>待付款</Text></View>
                   </View>
                 </TouchableOpacity>
                 <TouchableOpacity activeOpacity={1} onPress={this.Push1.bind(this,Order,3)} style={{flex:1,justifyContent:'center',alignItems:'center',paddingTop:30,paddingBottom:30}}>
                   <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                     <View style={{width:40,height:30,justifyContent:'center',alignItems:'center'}}>
                       <Image resizeMode={'contain'} style={{ width: 30, height:30, }} source={require('../img/mine_deliver.png')} />
                       {this.state.DataCount.waitSend != 0 ? <View style={{position:'absolute',top:-10,left:26,borderWidth:1,borderColor:'#f94444',borderRadius:10,paddingLeft:5,paddingRight:5,backgroundColor:'#f94444',}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#fff',fontSize:12,padding:0}}>{this.state.DataCount.waitSend}</Text></View> : null}
                     </View>
                     <View style={{marginTop:8}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#777',fontSize:12}}>待发货</Text></View>
                   </View>
                 </TouchableOpacity>
                 <TouchableOpacity activeOpacity={1} onPress={this.Push1.bind(this,Order,4)} style={{flex:1,justifyContent:'center',alignItems:'center',paddingTop:30,paddingBottom:30}}>
                   <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                     <View style={{width:40,height:30,justifyContent:'center',alignItems:'center'}}>
                       <Image resizeMode={'contain'} style={{ width: 30, height:30, }} source={require('../img/mine_receive.png')} />
                       {this.state.DataCount.waitReceive != 0 ? <View style={{position:'absolute',top:-10,left:26,borderWidth:1,borderColor:'#f94444',borderRadius:10,paddingLeft:5,paddingRight:5,backgroundColor:'#f94444',}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#fff',fontSize:12,padding:0}}>{this.state.DataCount.waitReceive}</Text></View> : null}
                     </View>
                     <View style={{marginTop:8}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#777',fontSize:12}}>待收货</Text></View>
                   </View>
                 </TouchableOpacity>
              </View>
            </View>

            <View style={{flex:1,backgroundColor:'#fff',borderRadius:5,marginTop:15}}>

              <View style={{flexDirection:'row',flex:1,justifyContent:'center',alignItems:'center',paddingTop:30,paddingBottom:30}}>
                 <TouchableOpacity activeOpacity={1} onPress={this.Push.bind(this,Address)} style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                   <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                     <View style={{}}>
                       <Image resizeMode={'contain'} style={{ width: 30, height:30, }} source={require('../img/mine_place.png')} />
                     </View>
                     <View style={{marginTop:8}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#777',fontSize:12}}>收货地址</Text></View>
                   </View>
                 </TouchableOpacity>
                 <TouchableOpacity activeOpacity={1} onPress={this.Push.bind(this,Help)} style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                   <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                     <View style={{}}>
                       <Image resizeMode={'contain'} style={{ width: 30, height:30, }} source={require('../img/mine_help.png')} />
                     </View>
                     <View style={{marginTop:8}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#777',fontSize:12}}>帮助中心</Text></View>
                   </View>
                 </TouchableOpacity>
                 <TouchableOpacity activeOpacity={1} style={{flex:1,justifyContent:'center',alignItems:'center'}}
                        onPress={()=>Linking.canOpenURL('tel:'+'0755-26919052').then(supported => {
                         if (supported) {
                             Linking.openURL('tel:'+'0755-26919052');
                         } else {

                         }
                        })}
                        underlayColor={'#dedede'}

                 >
                     <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                       <View style={{}}>
                         <Image resizeMode={'contain'} style={{ width: 30, height:30, }} source={require('../img/mine_phone.png')} />
                       </View>
                       <View style={{marginTop:8}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#777',fontSize:12}}>热线电话</Text></View>
                     </View>
                 </TouchableOpacity>
                 <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                   <View style={{}}>

                   </View>
                   <View style={{marginTop:5}}></View>
                 </View>
              </View>
            </View>
            </View>
          </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom:(DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 20 : 0,
  },
});
