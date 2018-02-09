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
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from '@remobile/react-native-toast';
import DeviceInfo from 'react-native-device-info';
import ScrollableTabView, { DefaultTabBar,  } from 'react-native-scrollable-tab-view';
import NewsList from './NewsList';
import News from './News';
const WID = Dimensions.get('window').width;
export default class MyComponent extends Component {
  constructor() {
    super();
    this.state={
      loaded:false,
      reload:false,
      data:[],
      isshows:true
    }
  }
  componentDidMount(){
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
    fetch('http://139.199.76.191:8889/app/article/showCategory', {
        method: 'get',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        console.log(result)
        if(result.code == 0){
           that.setState({
             data:result.result,
             loaded:true,
             isshows:false,
             data:result.result
           })
        }else{
          that.setState({
            loaded:true,

            reload:true
          })
          Toast.showShortCenter('您的系统繁忙')
        }
      })
      .catch((error) => {
          that.setState({
            loaded:true,

            reload:true
          })
          Toast.showShortCenter('您的系统繁忙')
      });
  }

  reloads(){
    this.setState({
      reload:false,
      loaded:false,
    })
    this.getData();
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={Styles.card}>
          <View style={{flex:1,justifyContent:'center'}}>

          </View>
          <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
              <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:WID==320 ? 16 : 18}}>资讯</Text>
          </View>
          <View style={{flex:1,justifyContent:'center',alignItems:'flex-end',}}>

          </View>
        </View>
        <ScrollableTabView
            style={{flex:1,flexDirection:'column',backgroundColor:'#fff',}}
            tabBarPosition='overlayTop'
            initialPage={0}
            tabBarUnderlineStyle={{backgroundColor: '#036EB8',height:2}}
            tabBarInactiveTextColor ='#777'
            tabBarActiveTextColor ='#036EB8'
            tabBarTextStyle={{fontSize:WID==320 ? 14 : 16,}}
         >
         {this.state.data.map((info,i)=>{
           return  <View key={i} style={{marginTop:50,flex:1,}} tabLabel={info.title}>
                  <NewsList id={info.id} {...this.props}/>
            </View>
         })}
         {this.state.isshows ? <View  style={{marginTop:50,flex:1,}} tabLabel='新闻专题'>

         </View> : null}

        </ScrollableTabView>

        {!this.state.loaded ? <View style={{justifyContent: 'center',alignItems: 'center',width:Dimensions.get('window').width,height:Dimensions.get('window').height-((DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 75 : 65),position:'absolute',top:(DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 75 : 65,left:0,backgroundColor:'#fff'}}>
          <View style={styles.loading}>
            <ActivityIndicator color="white"/>
            <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={styles.loadingTitle}>加载中……</Text>
          </View>
       </View> : null}
       {this.state.reload ? <TouchableOpacity activeOpacity={1} onPress={this.reloads.bind(this)}  style={{justifyContent: 'center',alignItems: 'center',width:Dimensions.get('window').width,height:Dimensions.get('window').height-((DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 75 : 65),position:'absolute',top:(DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 75 : 65,left:0,backgroundColor:'#fff'}}>
         <View style={{justifyContent:'center',alignItems:'center',}}>

           <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#777'}}>点击屏幕，重新加载</Text>
         </View>
       </TouchableOpacity> : null}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom:(DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 20 : 0,
  },
  loading: {
        backgroundColor: 'gray',
        height: 80,
        width: 100,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',

    },
    contentParagraph:{
      fontSize:12,
      color:'blue'
    },

    loadingTitle: {
        marginTop: 10,
        fontSize: 14,
        color: 'white'
    },
});
