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
import Toast from '@remobile/react-native-toast';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/FontAwesome';
import JMessage from 'jmessage-react-plugin';
import JPushModule from 'jpush-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScrollableTabView, { DefaultTabBar,  } from 'react-native-scrollable-tab-view';
import List from './List';
import ListA from './ListA';
import ListB from './ListB';
import ListC from './ListC';
import ListD from './ListD';
const WID = Dimensions.get('window').width;
export default class MyComponent extends Component {
  constructor() {
    super();
    this._pressButton = this._pressButton.bind(this);
    BackHandler.addEventListener('hardwareBackPress', this._pressButton);

  }

  _pressButton() {
      const { navigator } = this.props;
      if(this.props.Allreload){
        this.props.Allreload();
      }
      if(navigator) {
          //很熟悉吧，入栈出栈~ 把当前的页面pop掉，这里就返回到了上一个页面了
          navigator.pop();
          return true;
      }
      return false;
  }

  componentDidMount(){
    JMessage.addLoginStateChangedListener((event)=>{
      console.log(event)
      if(event.type == "user_kicked"){
        const { navigator } = this.props;
        if(navigator) {
            //很熟悉吧，入栈出栈~ 把当前的页面pop掉，这里就返回到了上一个页面了
            navigator.pop();
            return true;
        }
        return false;
      }
    })
  }

  componentWillUnmount() {
    JMessage.removeMessageRetractListener()
    this.getTime && clearTimeout(this.getTime);
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
                    <View style={{justifyContent:'center',flexDirection:'row',alignItems:'center'}}>
                          <Text style={{color:'white',fontSize:WID==320 ? 16 : 18}} allowFontScaling={false} adjustsFontSizeToFit={false}>我的订单</Text>
                    </View>
                 </View>
                 <View style={{flex:1,justifyContent:'center'}}>

                 </View>
          </View>
          <Netinfo  {...this.props}/>
          <ScrollableTabView
  				    style={{flex:1,flexDirection:'column',backgroundColor:'#fff',}}
    				  renderTabBar={()=><DefaultTabBar backgroundColor='rgba(255, 255, 255, 0.7)' />}
    				  tabBarPosition='overlayTop'
              initialPage={this.props.index}
    				  tabBarUnderlineStyle={{backgroundColor: '#036EB8',height:2}}
    				  tabBarInactiveTextColor ='#777'
    				  tabBarActiveTextColor ='#036EB8'
    				  tabBarTextStyle={{fontSize:WID==320 ? 14 : 16}}
  				 >
    				  <View  style={{marginTop:50,flex:1,}} tabLabel='全部'>
                <List {...this.props}/>
    				  </View>
    				  <View style={{marginTop:50,flex:1,}} tabLabel='待确认'>
                 <ListA {...this.props}/>
    				  </View>
              <View style={{marginTop:50,flex:1,}} tabLabel='待付款'>
                 <ListB {...this.props}/>
    				  </View>
              <View style={{marginTop:50,flex:1,}} tabLabel='待发货'>
                 <ListC {...this.props}/>
    				  </View>
              <View style={{marginTop:50,flex:1,}} tabLabel='待收货'>
                 <ListD {...this.props}/>
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
});
