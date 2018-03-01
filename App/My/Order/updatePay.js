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
import Order from './index';
import Toast from '@remobile/react-native-toast';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
  //import ImagePicker from 'react-native-image-picker';
  const WID = Dimensions.get('window').width;

var arrImg = [];
var keyArray = [];
export default class MyComponent extends Component {
  constructor() {
    super();
    this._pressButton = this._pressButton.bind(this);
    BackHandler.addEventListener('hardwareBackPress', this._pressButton);
    this.state={
      anibottom:new Animated.Value(-130),
      IsshowBottom:false,
      avatarSource: '',
      loaded:false,
      imguri:'',
      imgArray:[],
		  imagesshow:false,
      keys:[],
    }
  }
  _pressButton() {
      const { navigator } = this.props;
      if(this.props.getIMG){
        this.props.getIMG();
      }
      if(navigator) {
          //很熟悉吧，入栈出栈~ 把当前的页面pop掉，这里就返回到了上一个页面了
          navigator.pop();
          return true;
      }
      return false;
  }

  selectPhotoTapped() {

    Animated.timing(
         this.state.anibottom,
         {
           toValue: 0,
           duration: 200,
         },
    ).start();

    this.setState({
      IsshowBottom:true
    })

 }

 componentDidMount(){
    arrImg = [];
    keyArray = [];
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

 getImage(){
   var that = this;

   const options = {
     quality: 0.3,
     maxWidth: 500,
     maxHeight: 500,
     storageOptions: {
       skipBackup: true
     }
   };

   Animated.timing(
        this.state.anibottom,
        {
          toValue: -130,
          duration: 200,
        },
   ).start();

   this.setState({
     IsshowBottom:false
   })
   ImagePicker.openPicker({
      mediaType: "photo",
      compressImageQuality:0.5,
      multiple: true
    }).then(images => {
      console.log(images);
      this.setState({
        loaded:true,
      })

      images.map((imgs,i)=>{
        arrImg.push(imgs);
        this.setState({
          imgArray:arrImg,
        })
        let formData = new FormData();
        var type = imgs.path.split("/")[imgs.path.split("/").length-1];
        file = {uri:imgs.path, type: 'multipart/form-data', name: type};
        formData.append("file",file);
        formData.append("token",data.result);
        fetch('https://yzx.shixiweiyuan.com/file/upLoadPrivateImg', {
            method: 'POST',
            headers: {
            'Content-Type':'multipart/form-data',
            },
            body: formData
          })
          .then(function (response) {
            return response.json();
          })
          .then(function (result) {

           if(result.code == 0){
             keyArray.push(result.result);
             console.log(keyArray)
             that.setState({
               keys:keyArray,
             })
              if(images.length-1 == i){
                  that.setState({
                    loaded:false,
                  })
              }
           }else if(result.code != 0){
             Toast.showShortCenter(esult.message)
             arrImg.splice(i, 1);
             that.setState({
               loaded:false,
               imgArray:arrImg,
             })
           }

          })
          .catch((error) => {
           Toast.showShortCenter('您的系统繁忙')
           that.setState({
             loaded:false,
           })
          });

      })
    });

 }


 getCamera(){
   const options = {
     quality: 0.5,
     maxWidth: 500,
     maxHeight: 500,
     storageOptions: {
       skipBackup: true
     }
   };

   Animated.timing(
        this.state.anibottom,
        {
          toValue: -130,
          duration: 200,
        },
   ).start();

   this.setState({
     IsshowBottom:false
   })


   ImagePicker.launchCamera(options, (response) => {

     if (response.didCancel) {

     }
     else if (response.error) {

     }
     else if (response.customButton) {

     }
     else {
       var source;

       if (Platform.OS === 'android') {
         source = {uri: response.uri, isStatic: true};
       } else {
         source = {uri: response.uri.replace('file://', ''), isStatic: true};
       }

       this.setState({
          imguri:response.uri,
          avatarSource: source,
          fileImg:response,
          imagesshow:true,
       });
     }
   });
 }

 closeBottom(){
   Animated.timing(
        this.state.anibottom,
        {
          toValue: -130,
          duration: 200,
        },
   ).start();

   this.setState({
     IsshowBottom:false
   })
 }

 delete(i){
   var imgArray = this.state.imgArray;
   imgArray.splice(i, 1);
   keyArray.splice(i, 1);
   this.setState({
      imgArray:imgArray,
      keys:keyArray,
   });
   console.log(imgArray)
   console.log(keyArray);
 }

 submit(){
   var that = this;
   if(this.state.imgArray.length == 0){
     Toast.showShortCenter('请上传付款凭证')
     return false;
   }else{
     that.setState({
       loaded:true
     })
     fetch('https://yzx.shixiweiyuan.com/order/updateResourceKey', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: that.toQueryString({
         'token':data.result,
         'orderNumber':that.props.num,
         'resourceKey':that.state.keys.join(',')
        })
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (results) {
        console.log(results)
        Toast.showShortCenter('上传成功')
        that.setState({
          loaded:false,
        });

        if(that.props.payList){
          that.props.payList();
          const { navigator } = that.props;
          navigator.pop();
          return false;
        }

        if(that.props.getIMG){
          const routes = that.props.navigator.state.routeStack;
           let destinationRoute = '';
           for (let i = routes.length - 1; i >= 0; i--) {
                   if(routes[i].name === 'obj'){
                     destinationRoute = that.props.navigator.getCurrentRoutes()[i];
                     that.props.navigator.popToRoute(destinationRoute);
                   }
           }
           DeviceEventEmitter.emit('Payreload','false');
        }
      })
      .catch((error) => {
        that.setState({
          loaded:false,
        })
         Toast.showShortCenter('您的系统繁忙')
      });

   }
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
                            <Text style={{color:'white',fontSize:WID==320 ? 16 : 18}} allowFontScaling={false} adjustsFontSizeToFit={false}>上传付款凭证</Text>
                      </View>
                   </View>
                   <View style={{flex:1,justifyContent:'center'}}>

                   </View>
            </View>
            <Netinfo  {...this.props}/>
            <ScrollView style={{flex:1,backgroundColor:'#eee'}}>
               <View style={{padding:15,backgroundColor:'#fff'}}>
                   <Text style={{color:'#333',fontSize:WID==320 ? 14 : 16}} allowFontScaling={false} adjustsFontSizeToFit={false}>上传凭证</Text>
               </View>
               <View style={{padding:15,flexDirection:'row',backgroundColor:'#fff',width: Dimensions.get('window').width,flexWrap:'wrap',}}>
                   {this.state.imgArray.length>0 ? this.state.imgArray.map((imgs,i)=>{
                     return <View key={i} style={{ width: Dimensions.get('window').width/3-20, height:100,marginRight:10,marginTop:10}}>
                        <Image style={{ width: Dimensions.get('window').width/3-20, height:100, }} source={{uri:imgs.path}} />
                        <TouchableOpacity activeOpacity={1} onPress={this.delete.bind(this,i)} style={{position:'absolute',top:-10,right:-10}}>
                           <View style={{ width: 20, height:20, }}><Image resizeMode={'contain'} style={{ width: 20, height:20, }} source={require('../../img/close.png')} /></View>
                        </TouchableOpacity>
                     </View>
                   }) : null}
                   <TouchableOpacity activeOpacity={1} onPress={this.getImage.bind(this)}>
                       <View style={{ width: Dimensions.get('window').width/3-20, height:100,marginTop:10,}}>
                          <Image resizeMode={'contain'} style={{ width: Dimensions.get('window').width/3-20, height:100, }} source={require('../../img/upload.png')} />
                       </View>
                   </TouchableOpacity>
               </View>
            </ScrollView>
            {this.state.IsshowBottom ? <TouchableOpacity onPress={this.closeBottom.bind(this)} style={{position:'absolute',left:0,top:0,width: Dimensions.get('window').width,height: Dimensions.get('window').height,backgroundColor:'rgba(69, 67, 67, 0.47)',zIndex:9999999}}><View style={{width: Dimensions.get('window').width,height: Dimensions.get('window').height,}}></View></TouchableOpacity> : null}
            <Animated.View style={{position:'absolute',left:0,bottom:this.state.anibottom,width: Dimensions.get('window').width,height:120,backgroundColor:'#fff',zIndex:99999999}}>
               <TouchableOpacity onPress={this.getImage.bind(this)} activeOpacity={1} style={{height:60,justifyContent:'center',alignItems:'center',borderBottomWidth:1,borderColor:'#eee'}}><View style={{height:60,justifyContent:'center',alignItems:'center',}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#000',fontSize:16}}>选择图片</Text></View></TouchableOpacity>
               <TouchableOpacity onPress={this.getCamera.bind(this)} activeOpacity={1} style={{height:60,justifyContent:'center',alignItems:'center',}}><View style={{height:60,justifyContent:'center',alignItems:'center'}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#000',fontSize:16}}>打开相机</Text></View></TouchableOpacity>
            </Animated.View>
            <TouchableOpacity onPress={this.submit.bind(this)} activeOpacity={1}>
              <View style={{width: Dimensions.get('window').width,height:WID==320 ? 45 : 50,justifyContent:'center',alignItems:'center',backgroundColor:'#046EB8'}}>
                 <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:WID==320 ? 18 : 20}}>上传</Text>
              </View>
            </TouchableOpacity>
            {this.state.loaded ? <View style={{justifyContent: 'center',alignItems: 'center',width:Dimensions.get('window').width,height:Dimensions.get('window').height-70,position:'absolute',top:70,left:0,}}>
              <View style={styles.loading}>
                <ActivityIndicator color="white"/>
                <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={styles.loadingTitle}>加载中……</Text>
              </View>
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
