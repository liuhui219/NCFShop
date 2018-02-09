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
  Platform,
  TouchableHighlight,
  TouchableOpacity,
  DeviceEventEmitter
} from 'react-native';
import Styles from '../../Style';
import Netinfo from '../../NetInfo';
import ImageViewer from 'react-native-image-zoom-viewer';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
var IMG = [];
const WID = Dimensions.get('window').width;
export default class MyComponent extends Component {
  constructor() {
    super();
    this._pressButton = this._pressButton.bind(this);
    BackHandler.addEventListener('hardwareBackPress', this._pressButton);
    this.state={
      index:0,
      visible:false,
    }
  }
  _pressButton() {
      const { navigator } = this.props;

      if(this.state.visible == true){
        this.setState({
          visible:false,
        })
        return true;
      }else{
        if(navigator) {
            //很熟悉吧，入栈出栈~ 把当前的页面pop掉，这里就返回到了上一个页面了
            navigator.pop();
            return true;
        }
        return false;
      }
  }
  componentDidMount(){
     IMG = [];
     console.log(this.props.ims)
  }

  closest(){
    this.setState({
      visible:false,
    })
  }

  ShowModal(index){
    this.setState({
      visible:true,
      index:index
    })
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._pressButton);
    this.getTime && clearTimeout(this.getTime);
  }

  loading(){
    return (
      <View style={{width:Dimensions.get('window').width,height:Dimensions.get('window').height,justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size={'large'} color="white"/>
      </View>
    )
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
                    <View style={{justifyContent:'center',flexDirection:'row',alignItems:'center'}}>
                          <Text style={{color:'white',fontSize:WID==320 ? 16 : 18}} allowFontScaling={false} adjustsFontSizeToFit={false}>付款凭证</Text>
                    </View>
                 </View>
                 <View style={{flex:1,justifyContent:'center'}}>

                 </View>
          </View>
          <Netinfo  {...this.props}/>
          <ScrollView style={{flex:1,backgroundColor:"#fff"}}>
             <View style={{flexDirection:'row',flex:1,paddingLeft:15,flexWrap:'wrap'}}>
                 {this.props.ims.map((img ,i)=>{

                   return <TouchableOpacity key={i} onPress={this.ShowModal.bind(this,i)} activeOpacity={1}><View style={{ width: Dimensions.get('window').width/3-20, height:80,marginTop:15,marginRight:15}}>
                      <Image style={{ width: Dimensions.get('window').width/3-20, height:80, }} source={img} />
                   </View></TouchableOpacity>
                 })}


             </View>

          </ScrollView>

          {this.state.visible ? <View style={{position:'absolute',top:0,left:0,width:Dimensions.get('window').width,height:Dimensions.get('window').height,zIndex:999999999}}>
             <ImageViewer  index={this.state.index} loadingRender={this.loading.bind(this)} saveToLocalByLongPress={false} onClick={this.closest.bind(this)}  imageUrls={this.props.imgarr}/>
          </View> : null}
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
