import React, {Component} from 'react';
import {
  Dimensions,
  Image,
  InteractionManager,
  View,
  Text,
  StatusBar,
  AsyncStorage,
} from 'react-native';
import Storage from 'react-native-storage';
import AppMain from './main';
import Login from './Login/index';
import welcome from './Welcome/index';
import JPushModule from 'jpush-react-native';
import SplashScreen from 'react-native-splash-screen'
var {height, width} = Dimensions.get('window');
var storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  defaultExpires: null,
  enableCache: true
});

global.storage = storage;
class Splash extends Component {
  constructor(props) {
    super(props);

  }
  componentWillMount() {

  }
  componentDidMount() { 
      JPushModule.crashLogON();
	    var {navigator} = this.props;
      storage.load({
          key: 'loginState',
          autoSync: true,
          syncInBackground: true
          }).then(ret => {
              global.data=ret.data
              InteractionManager.runAfterInteractions(() => {
                 navigator.resetTo({
                   component: AppMain,
                   name: 'AppMain'
                 });
              });
          }).catch(err => {
           if(err.message.ret==undefined){
             global.data='';
             InteractionManager.runAfterInteractions(() => {
                navigator.resetTo({
                  component: AppMain,
                  name: 'AppMain'
                });
             });
           }
          })

  }
  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  render() {
    return (
      <View style={{flex:1}}>
        <StatusBar
         backgroundColor={'#4385f4'}
         animated = {true}
         barStyle="light-content"
         translucent={true}
        />

      </View>
    );
  }
}
export default Splash;
