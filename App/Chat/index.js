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
import News from './news';
import List from './list';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DeviceInfo from 'react-native-device-info';
import ScrollableTabView, { DefaultTabBar,  } from 'react-native-scrollable-tab-view';
const WID = Dimensions.get('window').width;
export default class MyComponent extends Component {
  constructor() {
    super();
    this.state={
      loaded:false,
      reload:false,
      data:[],
      isshows:true,
      reText:'点击屏幕，重新加载'
    }
  }
  componentDidMount(){
    this.getTime = setTimeout(() => {

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






  render() {
    return (
      <View style={styles.container}>
        <View style={Styles.card}>
          <View style={{flex:1,justifyContent:'center'}}>

          </View>
          <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
              <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:18}}>消息</Text>
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
         <View  style={{marginTop:50,flex:1,}} tabLabel='消息'>
             <News {...this.props}/>
         </View>
         <View  style={{marginTop:50,flex:1,}} tabLabel='联系人'>
             <List {...this.props}/>
         </View>
        </ScrollableTabView>



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
