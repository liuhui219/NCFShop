import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  StatusBar,
  View
} from 'react-native';
import Styles from './Style';
import CustomerComponents,{Navigator} from 'react-native-deprecated-custom-components';
import Welcome from './Welcome/index';
import Splash from './Splash';
class App extends Component {
    constructor(props) {
       super(props);
       this.renderScene = this.renderScene.bind(this);
  	   this.state = {
  	  	translucent:true,
  		  backgroundColor:'rgba(255, 255, 255, 0)'
  	   };
   }
  componentDidMount() {
        this.setState({ translucent: false,backgroundColor:'#4385f4' });
  }
  componentWillUnmount() {
  }

  renderScene(route, navigator) {
    let Component = route.component;
    _navigator = navigator;
    return (
      <Component navigator={navigator} {...route.params} route={route} />
    );
  }

  configureScene(route){
      if (route.sceneConfig) {
        return route.sceneConfig;
      }
      var conf = Navigator.SceneConfigs.PushFromRight; 
      return conf;
    }

  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar
    			animated = {true}
    			barStyle="light-content"
    			translucent={true}
       />
        <Navigator
          ref='navigator'
          style={styles.navigator}
          configureScene={this.configureScene}
          renderScene={this.renderScene}
          initialRoute={{
            component: Splash,
            name: 'Splash'
          }}
        />
      </View>
    );
  }
}
let styles = StyleSheet.create({
  navigator: {
    flex: 1
  }
});

export default App;
