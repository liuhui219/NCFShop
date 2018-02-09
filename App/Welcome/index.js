import React, { Component } from 'react'
import {
  View,
  Image,
  AppRegistry,
  TouchableOpacity,
  TouchableHighlight,
  StatusBar,
  Text,
  Dimensions
} from 'react-native'
import {Navigator} from 'react-native-deprecated-custom-components';
import SplashScreen from 'react-native-splash-screen';
import Swiper from 'react-native-swiper';
import AppMain from '../main';
const { width, height } = Dimensions.get('window')

const styles = {
  wrapper: {
    // backgroundColor: '#f00'
  },

  slide: {
    flex: 1,
    backgroundColor: 'transparent'
  },

  image: {
    width:width,
    height:height,
    flex: 1
  }
}

export default class Welcome extends Component {
componentDidMount() {
  SplashScreen.hide();
}
_Splash() {
  global.data=''
  storage.save({
   key: 'loginState',  // 注意:请不要在key中使用_下划线符号!
   rawData: {
     data: '',
   },
   expires: 1000 * 3600 * 30 * 24 * 12
   });
  var { navigator } = this.props;
   if(navigator) {
       navigator.resetTo({
           name: 'AppMain',
           component: AppMain,
       })
    }
}

  render () {
    return (
      <View style={{flex:1}}>
          <StatusBar
    		    backgroundColor={'#4385f4'}
      			hidden={true}
      			barStyle="light-content"
      			translucent={false}
            style={{height: 25}}
         />
          <Swiper style={styles.wrapper}
            dot={<View style={{backgroundColor: 'rgba(0,0,0,.3)', width: 8, height: 8, borderRadius: 4, marginLeft: 7, marginRight: 7}} />}
            activeDot={<View style={{backgroundColor: '#666', width: 8, height: 8, borderRadius: 4, marginLeft: 7, marginRight: 7}} />}
            paginationStyle={{
              bottom: 35
            }}
            loop={false}>
            <View style={styles.slide}>
              <Image style={styles.image} source={require('../img/1.jpg')} />
            </View>
            <View style={styles.slide}>
              <Image style={styles.image} source={require('../img/2.jpg')} />
            </View>
            <View style={styles.slide}>
              <Image style={styles.image} source={require('../img/3.jpg')} />
              <View style={{position:'absolute', bottom:70,width:Dimensions.get('window').width,justifyContent:'center',alignItems:'center',}}>
              <TouchableHighlight onPress={this._Splash.bind(this)} underlayColor="#1a5fd4" style={{borderRadius:4,}}>
                <View style={{borderWidth:1,borderColor:'#ececec',borderRadius:4,paddingTop:10,paddingBottom:10,paddingLeft:80,paddingRight:80, justifyContent:'center',alignItems:'center',backgroundColor:'#4385f4'}}>
                    <Text style={{fontSize:18, color:'#fff'}}  allowFontScaling={false} adjustsFontSizeToFit={false}>立 即 登 录</Text>
                </View>
              </TouchableHighlight>
              </View>
            </View>
          </Swiper>

      </View>
    )
  }
}
