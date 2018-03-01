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
import address from './address';
import EditAddress from './EditAddress';
import Toast from '@remobile/react-native-toast';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
var isDefault=[];
const WID = Dimensions.get('window').width;
export default class MyComponent extends Component {
  constructor() {
    super();
    this._pressButton = this._pressButton.bind(this);
    BackHandler.addEventListener('hardwareBackPress', this._pressButton);
    this.state={
      addressData:[],
      loaded:true,
      isDefault:[],
      status:false,
      reload:false,
      ID:'',
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
  componentDidMount(){
    isDefault=[];
    this.getTime = setTimeout(() => {
       this.getData();
    },800);
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

  getData(){
    var that = this;
    fetch('https://yzx.shixiweiyuan.com/user/address/list', {
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

       if(result.code == 0){
          isDefault=[];
          result.result.forEach((infos,i)=>{
            isDefault.push(infos.isDefault)
          })
          that.setState({
            addressData:result.result,
            loaded:false,
            reload:false,
            isDefault:isDefault,
          })
       }else{
         Toast.showShortCenter(result.message)
         that.setState({
           loaded:false,
           reload:true
         })
       }

      })
      .catch((error) => {
       Toast.showShortCenter('您的系统繁忙')
       that.setState({
         loaded:false,
         reload:true
       })
      });
  }

  add(){
    var that = this;
     var { navigator } = this.props;
     if(navigator) {
         navigator.push({
             name: 'address',
             component: address,
             params: {
                   getUser: function(user) {
            						 if(user == true){
            							 that.getData();
            						 }

                     }
             }
         })
     }
  }


  delete(info,i){
      this.setState({
        status:true,
        ID:info.id
      })
  }

  cancel(){
    this.setState({
      status:false
    })
  }

  OK(){
    var that = this;
    this.setState({
      status:false
    })
    fetch('https://yzx.shixiweiyuan.com/user/address/delete', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: that.toQueryString({
         'id':this.state.ID,
         'token': data.result
        })
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        console.log(result)

       if(result.code == 0){
          that.getData();
          that.setState({
            loaded:false,
            status:false
          })
       }else{
         Toast.showShortCenter(result.message)
         that.setState({
           loaded:false,
           status:false
         })
       }

      })
      .catch((error) => {
       Toast.showShortCenter('您的系统繁忙')
       that.setState({
         loaded:false,
         status:false
       })
      });
  }

  SetDefault(info){
    var that = this;
    fetch('https://yzx.shixiweiyuan.com/user/address/update', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: that.toQueryString({
         'id':info.id,
         'receiver': info.receiver,
         'phoneNumber': info.phoneNumber,
         'address': info.address,
         'isDefault': 1,
         'token': data.result
        })
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
       if(result.code == 0){
         that.getData();
       }else{
         Toast.showShortCenter(result.message)
       }

      })
      .catch((error) => {
       Toast.showShortCenter('您的系统繁忙')
      });
  }

  edit(info){
    var that = this;
     var { navigator } = this.props;
     if(navigator) {
         navigator.push({
             name: 'EditAddress',
             component: EditAddress,
             params:{
               infos:info,
               getUser: function(user) {
                     if(user == true){
                       that.getData();
                     }

                 }
             }
         })
     }
  }

  reloads(){
    this.setState({
      loaded:true,
      reload:false,
    })
    this.getData();
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
                <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:WID==320 ? 16 : 18}}>管理收货地址</Text>
            </View>
            <View style={{flex:1,justifyContent:'center',alignItems:'flex-end',}}>

            </View>
          </View>
          <Netinfo  {...this.props}/>
          <View style={{flex:1,backgroundColor:'#fff'}}>
             {this.state.addressData.length == 0 ? <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                 <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#A5A5A5',fontSize:WID==320 ? 14 : 16}}>暂时没有收货地址</Text></View>
                 <TouchableOpacity activeOpacity={1} onPress={this.add.bind(this)} ><View style={{marginTop:25,width:100,height:40,justifyContent:'center',alignItems:'center',backgroundColor:'#036EB8',borderRadius:20}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#fff',fontSize:WID==320 ? 14 : 16}}>去添加</Text></View></TouchableOpacity>
             </View> : <View style={{flex:1}}><ScrollView style={{flex:1,backgroundColor:'#efefef'}}>
                 {this.state.addressData.map((info,i)=>{
                   return <View key={i} style={{marginBottom:15,backgroundColor:'#fff'}}>
                      <View style={{flexDirection:'row',alignItems:'center',height:50}}>
                         <View style={{paddingLeft:30,paddingRight:30,justifyContent:'center',alignItems:'center'}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#000',fontSize:WID==320 ? 14 : 16,}}>{info.receiver}</Text></View>
                         <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#000',fontSize:WID==320 ? 14 : 16,}}>{info.phoneNumber.substr(0,3)+"****"+info.phoneNumber.substr(7)}</Text></View>
                      </View>
                      <View style={{flexDirection:'row',justifyContent:'center',flex:1,borderBottomWidth:1,borderColor:'#eee',paddingBottom:20}}>
                          <View style={{width:30,alignItems:'center',}}><Image resizeMode={'contain'} style={{ width: WID==320 ? 14 : 16,height:WID==320 ? 16 : 20}} source={require('../../img/shipping_adress_place.png')} /></View>
                          <View style={{flex:1,alignItems:'flex-start',flexDirection:'row',}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#777',fontSize:WID==320 ? 12 : 14,}}>{info.address}</Text></View>
                      </View>
                      <View style={{flex:1,flexDirection:'row',paddingTop:10,paddingBottom:10}}>
                          <TouchableOpacity activeOpacity={1} onPress={this.SetDefault.bind(this,info)}>
                              <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                                <View style={{width:40,justifyContent:'center',alignItems:'center'}}>
                                   {this.state.isDefault[i] ? <Ionicons name="ios-checkmark-circle" size={WID==320 ? 26 : 30} color="#036EB8" /> : <Ionicons name="ios-radio-button-off" size={WID==320 ? 26 : 30} color="#999" />}
                                </View>
                                <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#4D4D4D',fontSize:WID==320 ? 14 : 16,}}>设为默认地址</Text></View>
                              </View>
                          </TouchableOpacity>
                          <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',paddingRight:10}}>
                              <TouchableOpacity activeOpacity={1} onPress={this.edit.bind(this,info)} style={{flexDirection:'row',alignItems:'center'}}>
                              <View style={{flexDirection:'row',alignItems:'center'}}>
                                 <View><Image resizeMode={'contain'} style={{ width: WID==320 ? 14 : 16,height:WID==320 ? 16 : 20}} source={require('../../img/shipping_adress_edit.png')} /></View>
                                 <View style={{paddingLeft:5}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#000',fontSize:WID==320 ? 14 : 16,}}>编辑</Text></View>
                              </View>
                              </TouchableOpacity>
                              <TouchableOpacity activeOpacity={1} onPress={this.delete.bind(this,info,i)} style={{flexDirection:'row',alignItems:'center',}}>
                              <View style={{flexDirection:'row',alignItems:'center',marginLeft:20}}>
                                 <View><Image resizeMode={'contain'} style={{ width: WID==320 ? 14 : 16,height:WID==320 ? 16 : 20}} source={require('../../img/shipping_adress_delete.png')} /></View>
                                 <View style={{paddingLeft:5}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#000',fontSize:WID==320 ? 14 : 16,}}>删除</Text></View>
                              </View>
                              </TouchableOpacity>
                          </View>
                      </View>
                   </View>
                 })}

             </ScrollView>
             <TouchableOpacity onPress={this.add.bind(this)} activeOpacity={1}>
               <View style={{width: Dimensions.get('window').width,height:WID==320 ? 45 : 50,justifyContent:'center',alignItems:'center',backgroundColor:'#046EB8'}}>
                  <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:WID==320 ? 16 : 20}}>新增收货地址</Text>
               </View>
             </TouchableOpacity>
           </View>}
          </View>

          {this.state.status ? <View style={{backgroundColor:'rgba(119, 119, 119, 0.51)',position:'absolute',width:(Dimensions.get('window').width),height:(Dimensions.get('window').height),top:0,left:0}}><View style={{position:'absolute',backgroundColor:'#fff',width:260,height:200,top:(Dimensions.get('window').height-230)/2,left:(Dimensions.get('window').width-260)/2,borderRadius:5,overflow:'hidden'}}>
					 <View  style={{height:80,alignItems:'center',justifyContent:'center',flexDirection:'row',marginTop:20 }}>
					   <Image resizeMode={'contain'} style={{ width: 80,height:80}} source={require('../../img/pop_deleteshipping.png')} />
					 </View>
					 <View style={{flex:1,justifyContent:'center',alignItems:'center',borderBottomWidth:1,borderColor:'#ececec'}}>
						 <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:16,}}>是否确定删除收货地址？</Text>
					 </View>
					 <View style={{flexDirection:'row',justifyContent:'space-between',height:50,backgroundColor:'#ececec',borderBottomLeftRadius:5,borderBottomRightRadius:5}}>
						<TouchableOpacity onPress={this.cancel.bind(this)} style={{flex:1,alignItems:'center',justifyContent:'center',borderBottomLeftRadius:5,backgroundColor:'#fff'}}>
						 <View ><Text  allowFontScaling={false} adjustsFontSizeToFit={false}style={{color:'#666',fontSize:16}}>取消</Text></View>
						</TouchableOpacity>
						<TouchableOpacity onPress={this.OK.bind(this)} style={{flex:1, alignItems:'center',justifyContent:'center', borderBottomRightRadius:5,marginLeft:1,backgroundColor:'#fff'}}>
						 <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#666',fontSize:16}}>确定</Text></View>
						</TouchableOpacity>
					 </View>
			 </View></View> : null}
          {this.state.loaded ? <View style={{justifyContent: 'center',alignItems: 'center',width:Dimensions.get('window').width,height:Dimensions.get('window').height-((DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 75 : 65),position:'absolute',top:((DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 75 : 65),left:0,backgroundColor:'#fff'}}>
   					<View style={styles.loading}>
   						<ActivityIndicator color="white"/>
   						<Text allowFontScaling={false} adjustsFontSizeToFit={false} style={styles.loadingTitle}>加载中……</Text>
   					</View>
 				 </View> : null}
          {this.state.reload ? <TouchableOpacity activeOpacity={1} onPress={this.reloads.bind(this)}  style={{justifyContent: 'center',alignItems: 'center',width:Dimensions.get('window').width,height:Dimensions.get('window').height-((DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 75 : 65),position:'absolute',top:((DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 75 : 65),left:0,backgroundColor:'#fff'}}>
          <View style={{justifyContent:'center',alignItems:'center',}}>
            <Ionicons name="ios-refresh-outline" color="#ccc"size={60}  />
            <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:16,color:'#ccc'}}>点击屏幕，重新加载</Text>
          </View>
          </TouchableOpacity> : null}

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
