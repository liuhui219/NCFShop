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
  TouchableNativeFeedback,
  ActivityIndicator,
  ScrollView,
  ListView,
  Linking,
  RefreshControl,
  TouchableHighlight,
  TouchableOpacity,
  DeviceEventEmitter
} from 'react-native';
import Chat from './chat';
import Icon from 'react-native-vector-icons/FontAwesome';
import DeviceInfo from 'react-native-device-info';
import Ionicons from 'react-native-vector-icons/Ionicons';
const WID = Dimensions.get('window').width;
export default class MyComponent extends Component {
  constructor() {
    super();
    this.state={
      dataSource: new ListView.DataSource({
			  rowHasChanged: (row1, row2) => row1 !== row2,
		  }),
      IsShowMask:false,
      isRefreshing:false,
      ImgArray:[],
		  isLoadMore:false,
		  isReach:false,
		  isRefreshing:false,
		  isNull:false,
		  sx:false,
      data:[],
      loaded:true,
      reloads:false,
      isRefreshing:false,
      index:0
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

  componentDidMount(){
    array = [];
    this.getTime = setTimeout(() => {
       this.getData();
    },800);
  }

  componentWillUnmount() {

    this.getTime && clearTimeout(this.getTime);
  }


  getData(){
    var that = this;

    fetch('http://139.199.76.191:8889/im/contactList', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: this.toQueryString({
        'token': data.result
				})
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {

        console.log(result)
        if(result.code == 0){
          that.setState({
            data:result.result,
            loaded:false,
            isRefreshing:false,
            reloads:false,
          })
        }else{
          if(result.code == 10010){
            storage.clearMap();
            storage.remove({
              key: 'loginState'
            });
            global.data='';
            DeviceEventEmitter.emit('IsLoginout','true');

          }
          that.setState({
               loaded: false,
               isRefreshing:false,
               reloads:true,
          })
          ToastAndroid.showWithGravity(result.message, ToastAndroid.LONG,ToastAndroid.CENTER)
        }
      })
      .catch((error) => {
        ToastAndroid.showWithGravity('您的系统繁忙', ToastAndroid.LONG,ToastAndroid.CENTER)
        that.setState({
             loaded: false,
             isRefreshing:false,
             reloads:true,
        })
      });
  }

  reload(){
    this.setState({
      loaded: true,
      reloads:false,
    })
    this.getData();
  }

  chat(info){
    var { navigator } = this.props;
     if(navigator) {
         navigator.push({
             name: 'Chat',
             component: Chat,
             params:{
               name:info.username,
               username:info.nickname
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
      <ScrollView style={{flex:1}}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh.bind(this)}
              colors={['#036EB8', '#00ff00', '#0000ff','#036EB8']}
              progressBackgroundColor="#ffffff"
            />
          }
      >
        {this.state.data.map((info,i)=>{
          return <View key={i} style={{flexDirection:'row',alignItems:'center',borderBottomWidth:1,borderColor:'#eee',padding:5}}>
               <View style={{width:60,height:60,justifyContent:'center',alignItems:'center'}}>
                  {i==0 ? <Image resizeMode={'contain'} style={{ width: 50,}} source={require('../img/hai.png')} /> : <Image resizeMode={'contain'} style={{ width: 50,}} source={require('../img/yukefu.png')} />}
               </View>
               <View style={{flex:1,justifyContent:'space-between',flexDirection:'row',alignItems:'center',paddingLeft:5}}>
                 <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 12 : 14,}}>{info.nickname}</Text></View>
                 <View style={{justifyContent:'space-between',flexDirection:'row',alignItems:'center'}}>
                    <TouchableOpacity activeOpacity={1} onPress={this.chat.bind(this,info)}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                       <View><Image resizeMode={'contain'} style={{ width: 20,}} source={require('../img/kefu.png')} /></View>
                       <View style={{marginLeft:5}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 12 : 14,}}>消息</Text></View>
                    </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1}
                           onPress={()=>Linking.canOpenURL('tel:'+info.phoneNumber).then(supported => {
                            if (supported) {
                                Linking.openURL('tel:'+info.phoneNumber);
                            } else {

                            }
                           })}
                           underlayColor={'#dedede'}

                    >
                    <View style={{flexDirection:'row',alignItems:'center',marginLeft:15}}>
                       <View><Image resizeMode={'contain'} style={{ width:24,}} source={require('../img/call.png')} /></View>
                       <View  style={{marginLeft:5}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 12 : 14,}}>电话</Text></View>
                    </View>
                    </TouchableOpacity>
                 </View>
               </View>
          </View>
        })}

        {this.state.loaded ? <View style={{justifyContent: 'center',alignItems: 'center',width:Dimensions.get('window').width,height:Dimensions.get('window').height-170,position:'absolute',top:0,left:0,backgroundColor:'#fff'}}>
          <View style={styles.loading}>
            <ActivityIndicator color="white"/>
            <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={styles.loadingTitle}>加载中……</Text>
          </View>
       </View> : null}

       {this.state.reloads ? <View style={{justifyContent: 'center',alignItems: 'center',width:Dimensions.get('window').width,height:Dimensions.get('window').height-170,position:'absolute',top:0,left:0,backgroundColor:'#fff',zIndex:999999999}}>
         <TouchableOpacity  activeOpacity={1} onPress={this.reload.bind(this)} >
           <View style={{width:Dimensions.get('window').width,height:Dimensions.get('window').height-((DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 75 : 65),justifyContent: 'center',alignItems: 'center',}}>
             <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#777',fontSize:WID==320 ? 12 : 14}}>加载失败,请点击重试</Text>
           </View>
         </TouchableOpacity>
      </View> : null}
      </ScrollView>
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
