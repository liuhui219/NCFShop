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
import moment from 'moment';
import Toast from '@remobile/react-native-toast';
import DeviceInfo from 'react-native-device-info';
import HTML from 'react-native-render-html';
import { IGNORED_TAGS ,PERC_SUPPORTED_STYLES } from 'react-native-render-html/src/HTMLUtils';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
const WID = Dimensions.get('window').width;
export default class MyComponent extends Component {
  constructor() {
    super();
    this._pressButton = this._pressButton.bind(this);
    BackHandler.addEventListener('hardwareBackPress', this._pressButton);
    this.state={
      data:{},
      loaded:false,
      reload:false,
    }
  }

  componentDidMount(){
    this.getTime = setTimeout(() => {
       this.getData();
    },800);
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
    fetch('https://yzx.shixiweiyuan.com/app/article/showDetail', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: this.toQueryString({
        'id':this.props.id
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
             loaded:true,
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
                 <TouchableOpacity onPress={this._pressButton.bind(this)}>
                    <View style={{justifyContent:'flex-start',flexDirection:'row',alignItems:'center',}}>
                      <Icon name="angle-left" size={WID==320 ? 26 : 30} color="#fff" style={{width: 20,marginLeft:10,}} />
                      <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:WID==320 ? 14 : 16,marginLeft:-5,}}>返回</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:WID==320 ? 16 : 18}}>资讯详情</Text>
            </View>
            <View style={{flex:1,justifyContent:'center',alignItems:'flex-end',}}>

            </View>
          </View>
          <Netinfo  {...this.props}/>
          <ScrollView style={{flex:1,backgroundColor:'#fff'}}>
              <View style={{padding:15}}>
                 <Text allowFontScaling={false} adjustsFontSizeToFit={false} numberOfLines={2} style={{color:'#000',fontSize:18,lineHeight:24}}>{this.state.data.title}</Text>
              </View>
              <View style={{flexDirection:'row',padding:15,paddingTop:0}}>
                <View style={{}}>
                   <Text allowFontScaling={false} adjustsFontSizeToFit={false} numberOfLines={2} style={{color:'#777',fontSize:14,}}>{this.state.data.source}</Text>
                </View>
                <View style={{paddingLeft:10,paddingRight:10}}>
                   <Text allowFontScaling={false} adjustsFontSizeToFit={false} numberOfLines={2} style={{color:'#999',fontSize:14,}}>|</Text>
                </View>
                <View style={{}}>
                   <Text allowFontScaling={false} adjustsFontSizeToFit={false} numberOfLines={2} style={{color:'#777',fontSize:14,}}>{moment(this.state.data.createTime).format("YYYY-MM-DD HH:mm:ss")}</Text>
                </View>
              </View>
              <View style={{padding:15,paddingTop:0}}>

                 <HTML html={this.state.data.content} ignoredStyles={[ ...PERC_SUPPORTED_STYLES,'fontFamily']} tagsStyles={{  p: {fontSize:14,lineHeight:23},span: {fontSize:14,lineHeight:23}}}   imagesMaxWidth={Dimensions.get('window').width-30} />

              </View>
          </ScrollView>
          {!this.state.loaded ? <View style={{justifyContent: 'center',alignItems: 'center',width:Dimensions.get('window').width,height:Dimensions.get('window').height-((DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 75 : 65),position:'absolute',top:((DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 75 : 65),left:0,backgroundColor:'#fff'}}>
            <View style={styles.loading}>
              <ActivityIndicator color="white"/>
              <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={styles.loadingTitle}>加载中……</Text>
            </View>
         </View> : null}
         {this.state.reload ? <TouchableOpacity activeOpacity={1} onPress={this.reloads.bind(this)}  style={{justifyContent: 'center',alignItems: 'center',width:Dimensions.get('window').width,height:Dimensions.get('window').height-((DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 75 : 65),position:'absolute',top:((DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 75 : 65),left:0,backgroundColor:'#fff'}}>
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
