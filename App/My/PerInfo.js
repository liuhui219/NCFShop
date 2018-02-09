/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Animated,
  KeyboardAvoidingView,
  Dimensions,
  Image,
  ScrollView,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  Platform,
  Linking,
  CameraRoll,
  DeviceEventEmitter,
  ActivityIndicator,
  StyleSheet,
  BackHandler
} from 'react-native';
import Styles from '../Style';
import Netinfo from '../NetInfo';
import Toast from '@remobile/react-native-toast';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import city from '../Register/city.json';
import Picker from 'antd-mobile/lib/picker';
import List from 'antd-mobile/lib/list';
import arrayTreeFilter from 'array-tree-filter';
import ImagePicker from 'react-native-image-picker';
const WID = Dimensions.get('window').width;
const CustomChildren = props => (

    <View style={{width:Dimensions.get('window').width,flexDirection:'row',height:45}}>
      <View style={{width:100,justifyContent:'center',alignItems:'center',}}>
         <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#4D4D4D',fontSize:15,}}>所在地址：</Text>
      </View>
      <TouchableOpacity
        onPress={props.onClick}
        activeOpacity={1}
        style={{ backgroundColor: '#fff',flexDirection:'row',flex:1}}
      >
      <View  style={{ flexDirection:'row',justifyContent:'space-between',alignItems:'center',flex:1,paddingRight:15}}>
        <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#333',fontSize:15}}>{props.extra}</Text></View>
        <View><Image resizeMode={'contain'} style={{ width: 8, height:20, }} source={require('../img/right.png')} /></View>
      </View>
      </TouchableOpacity>
    </View>

);
export default class Setting extends Component {
  constructor() {
    super();
    this._pressButton = this._pressButton.bind(this);
    BackHandler.addEventListener('hardwareBackPress', this._pressButton);
    this.state={
      scrollY: new Animated.Value(0),
      anitop:new Animated.Value(95),
      anibottom:new Animated.Value(-130),
      IsshowBottom:false,
      address:'请选择地址',
      shows:false,
      pickerValue: [],
      data: [],
      company:'',
      addressInfo:'',
      phone:'',
      job:'',
      loaded:false,
      loadeds:true,
      values:'',
      imguri:'',
      avatarSource:'',
      fileImg:'',
      imagesshow:false,
      Islogins:false,
      sumText:'提交',
      companyAddress:'',
      imgS:'',
      reloads:false,
      companyName:'',
      companyPhone:'',
      companyJob:'',
    }
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

   Trims(x) {
     return x.replace(/\s/g,"");
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

   componentWillUnmount() {
     BackHandler.removeEventListener('hardwareBackPress', this._pressButton);
     this.getTime && clearTimeout(this.getTime);
   }

   getData(){
     var that = this;
     fetch('http://139.199.76.191:8889/user/getUserInfo', {
         method: 'POST',
         headers: {
         'Content-Type': 'application/x-www-form-urlencoded',
         },
         body: this.toQueryString({
          'token':data.result
         })
       })
       .then(function (response) {
         return response.json();
       })
       .then(function (result) {
          console.log(result)
          var urls = 'http://139.199.76.191:8889/file/downPrivateImg?token='+ data.result + '&key='+result.result.companyLicenceUrl;
          if(result.code == 0){
             that.setState({
               imagesshow:false,
               companyName:result.result.companyName ? result.result.companyName : '',
               companyPhone:result.result.companyPhone ?result.result.companyPhone : '',
               companyJob:result.result.companyJob ? result.result.companyJob : '',
               companyAddress:result.result.companyAddress ? result.result.companyAddress : '',
               company:result.result.companyName ? result.result.companyName : '',
               addressInfo:result.result.companyAddress ? result.result.companyAddress.split(" ")[1] : '',
               values:result.result.companyAddress ? result.result.companyAddress.split(" ")[0] : '',
               phone:result.result.companyPhone ? result.result.companyPhone : '',
               job:result.result.companyJob ? result.result.companyJob : ''
             })
             console.log(urls)
             if(result.result.companyLicenceUrl && result.result.companyLicenceUrl != ''){
               that.setState({
                 avatarSource:{uri:urls},
                 imagesshow:true,
                 loadeds:false,
               })
             }else{
               that.setState({

                 imagesshow:false,
                 loadeds:false,
               })
             }
             that.setState({
               loadeds:false,
             })
          }else{
            that.setState({
              loadeds:false,
              reloads:true,
            })
            Toast.showShortCenter(result.message)
          }

       })
       .catch((error) => {
         that.setState({
           loadeds:false,
           reloads:true,
         })
          Toast.showShortCenter('您的系统繁忙')
       });
   }



   changs(text){
     this.refs.company.setNativeProps({text: this.Trims(text)});
     this.setState({
       company:this.Trims(text)
     })
   }

   changaddress(text){
     this.refs.addressInfo.setNativeProps({text: this.Trims(text)});
     this.setState({
       addressInfo:this.Trims(text)
     })
   }

   changphone(text){
     this.refs.phone.setNativeProps({text: this.Trims(text)});
     this.setState({
       phone:this.Trims(text)
     })
   }

   changjob(text){
     this.refs.job.setNativeProps({text: this.Trims(text)});
     this.setState({
       job:this.Trims(text)
     })
   }

   _createAreaData() {
         let data = [];
         let len = area.length;
         for(let i=0;i<len;i++){
             let city = [];
             for(let j=0,cityLen=area[i]['city'].length;j<cityLen;j++){
                 let _city = {};
                 _city[area[i]['city'][j]['name']] = area[i]['city'][j]['area'];
                 city.push(_city);
             }

             let _data = {};
             _data[area[i]['name']] = city;
             data.push(_data);
         }
         return data;
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

    getImage(){
      const options = {
        quality: 1.0,
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


      ImagePicker.launchImageLibrary(options, (response) => {

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


    getCamera(){
      const options = {
        quality: 1.0,
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

   Gomain(){
     DeviceEventEmitter.emit('IsLogin','false');
     const { navigator } = this.props;
     if(navigator) {
         //很熟悉吧，入栈出栈~ 把当前的页面pop掉，这里就返回到了上一个页面了
         navigator.popToTop();
         return true;
     }
     return false;
   }

   submit(){
      var that=this;
      let formData = new FormData();
   		if(this.state.imguri == ''){
   			file = '';
   		}else{
         var type = this.state.imguri.split("/")[this.state.imguri.split("/").length-1];
   			file = {uri: this.state.imguri, type: 'multipart/form-data', name: type};
   		}
      console.log(file)

      formData.append("file",file);
      formData.append("token",data.result);
      if(this.state.company.length == 0 && this.state.addressInfo.length == 0 && this.state.phone.length == 0 && this.state.job.length == 0 && this.state.values.length == 0 && this.state.imguri == ''){

        Toast.showShortCenter('您什么都没有填写')
        return false;
      }else if(this.state.imguri != ''){
        that.setState({
          loaded:true,
        })
        fetch('http://139.199.76.191:8889/file/upLoadPrivateImg', {
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
               fetch('http://139.199.76.191:8889/user/updateCompanyInfo', {
           			  method: 'POST',
                  headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  },
                  body: that.toQueryString({
                   'token':data.result,
                   'companyName':that.state.company,
                   'companyAddress':that.state.values + ' ' +that.state.addressInfo,
                   'companyPhone':that.state.phone,
                   'companyJob':that.state.job,
                   'companyLicenceUrl':result.result
                  })
           			})
           			.then(function (response) {
           				return response.json();
           			})
           			.then(function (results) {
                  console.log(results)
                  Toast.showShortCenter('提交成功')
                  that.setState({
                    loaded:false,
                  })
           			})
           			.catch((error) => {
                  that.setState({
                    loaded:false,
                  })
                   Toast.showShortCenter('您的系统繁忙')
           			});
            }else{
              Toast.showShortCenter(result.message)
            }

     			})
     			.catch((error) => {
            that.setState({
              loaded:false,
            })
             Toast.showShortCenter('您的系统繁忙')
     			});
      }
      else{
        that.setState({
          loaded:true,
        })
        fetch('http://139.199.76.191:8889/user/updateCompanyInfo', {
           method: 'POST',
           headers: {
           'Content-Type': 'application/x-www-form-urlencoded',
           },
           body: that.toQueryString({
            'token':data.result,
            'companyName':that.state.company,
            'companyAddress':that.state.values + ' ' +that.state.addressInfo,
            'companyPhone':that.state.phone,
            'companyJob':that.state.job,
            'companyLicenceUrl':''
           })
         })
         .then(function (response) {
           return response.json();
         })
         .then(function (results) {
           Toast.showShortCenter('提交成功')
           that.setState({
             loaded:false,
           })
         })
         .catch((error) => {
             that.setState({
               loaded:false,
             })
            Toast.showShortCenter('您的系统繁忙')
         });
      }
   }

   onOk(values){
     var datas = Array.from(values);
     const treeChildren = arrayTreeFilter(city, (c, level) => c.value === datas[level]);
      this.setState({
        values:treeChildren.map(v => v.label).join(','),
        pickerValue: values
      })
   }

   reload(){
     this.setState({
       reloads:false,
       loadeds:true,
     })
     this.getData();
   }

   componentWillUnmount() {
     BackHandler.removeEventListener('hardwareBackPress', this._pressButton);
   }
  render() {
    const anitop = this.state.scrollY.interpolate({
      inputRange: [-10, 0, ((DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 50 : 120) , ((DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 120 : 130)],
      outputRange: [95, 95,  ((DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 35 : 25) ,((DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 35 : 25)],
    });
    const imageScale = this.state.scrollY.interpolate({
      inputRange: [-10 ,0, ((DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 50 : 120) , ((DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 120 : 130)],
      outputRange: [60, 60,  36 , 36],
    });
    const imageTranslate = this.state.scrollY.interpolate({
      inputRange: [-10 ,0, ((DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 50 : 120) , ((DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 120 : 130)],
      outputRange: [125 ,125,  ((DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 75 : 65) , ((DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 75 : 65)],
    });
    const imageRight = this.state.scrollY.interpolate({
      inputRange: [-10 ,0, ((DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 50 : 120) , ((DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 120 : 130)],
      outputRange: [(Dimensions.get('window').width-60)/2, (Dimensions.get('window').width-60)/2,  10 , 10],
    });
    return (
      <View style={Styles.container}>
          <Animated.Image  style={{ width: Dimensions.get('window').width, height:imageTranslate,backgroundColor:'transparent', }} source={require('../img/setting_bg.png')} />
          <View style={[Styles.card,{backgroundColor:'transparent',position:'absolute',left:0,top:0,right:0}]}>
            <View style={{flex:1,justifyContent:'center'}}>
                 <TouchableOpacity onPress={this._pressButton.bind(this)}>
                    <View style={{justifyContent:'flex-start',flexDirection:'row',alignItems:'center',}}>
                      <Icon name="angle-left" size={WID==320 ? 26 : 30} color="#fff" style={{width: 20,marginLeft:10,}} />
                      <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:WID==320 ? 14 : 16,marginLeft:-5,}}>返回</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:WID==320 ? 16 : 18}}>个人信息</Text>
            </View>
            <View style={{flex:1,justifyContent:'center',alignItems:'flex-end',}}>

            </View>
          </View>
          <Netinfo  {...this.props}/>




           <KeyboardAvoidingView behavior='padding' style={{flex:1,}}>
             <Animated.ScrollView scrollEventThrottle={1} style={{flex:1,}}
               onScroll={Animated.event(
                 [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
                 { useNativeDriver: false }
               )}
               >
                <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',height:60,borderBottomWidth:1,borderColor:'#eee',backgroundColor:'#fff',marginTop:35}}>
                    <View style={{width:150,justifyContent:'center',alignItems:'flex-start',paddingLeft:15}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#444444',fontSize:WID==320 ? 14 : 16,}}>手机</Text></View>
                    <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',alignItems:'center',paddingRight:15}}>
                      <View style={{justifyContent:'center',paddingRight:10}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#777',fontSize:WID==320 ? 14 : 16,}}>{data.phone.substr(0,3)+"****"+data.phone.substr(7)}</Text></View>
                      <View><Image resizeMode={'contain'} style={{ width: WID==320 ? 6 : 8, height:20, }} source={require('../img/right.png')} /></View>
                    </View>
                </View>
                <View style={{padding:10,backgroundColor:'#F0F0F0'}}>
                    <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#AEAEAE',fontSize:14,}}>公司信息</Text>
                </View>
                <View style={{flex:1,flexDirection:'row',paddingTop:10,paddingBottom:10,borderBottomWidth:1,borderColor:'#eee'}}>
                  <View style={{width:100,justifyContent:'center',alignItems:'center',}}>
                     <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#4D4D4D',fontSize:WID==320 ? 14 : 16,}}>公司名称：</Text>
                  </View>
                  <View style={{flex:1,}}>
                      <TextInput
                        ref='company'
                        multiline={false}
                        underlineColorAndroid="transparent"
                        placeholder='请输入公司名称'
                        defaultValue={this.state.companyName}
                        placeholderTextColor='#CAD1DA'
                        style={{height: 45,flex:1,color:'#000',  borderWidth: 1,padding: 0,borderColor:"transparent",fontSize:WID==320 ? 14 : 16}}
                        onChangeText={(company) => this.changs.bind(this,company)()}
                      />
                  </View>
                </View>
                <View style={{flex:1,flexDirection:'row',paddingTop:10,paddingBottom:10,borderBottomWidth:1,borderColor:'#eee'}}>
                  {this.state.companyAddress.length != 0 ? <Picker
                     title="选择地区"
                     extra={this.state.companyAddress.split(" ")[0]}
                     data={city}
                     format={(values) => { return values.join(' '); }}
                     itemStyle={{fontSize:WID==320 ? 12 : 14,lineHeight:25,marginBottom:5}}
                     value={this.state.pickerValue}
                     onChange={v => this.onOk.bind(this,v)()}
                     onOk={v => this.setState({ pickerValue: v })}
                   >
                       <CustomChildren></CustomChildren>
                     </Picker> : <Picker
                        title="选择地区"
                        extra='选择地区'
                        data={city}
                        format={(values) => { return values.join(' '); }}
                        itemStyle={{fontSize:WID==320 ? 12 : 14,lineHeight:25,marginBottom:5}}
                        value={this.state.pickerValue}
                        onChange={v => this.onOk.bind(this,v)()}
                        onOk={v => this.setState({ pickerValue: v })}
                      >
                          <CustomChildren></CustomChildren>
                        </Picker>}
                </View>
                <View style={{flex:1,flexDirection:'row',paddingTop:10,paddingBottom:10,borderBottomWidth:1,borderColor:'#eee'}}>
                  <View style={{width:100,justifyContent:'center',alignItems:'center',}}>
                     <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#4D4D4D',fontSize:WID==320 ? 14 : 16,}}>详细地址：</Text>
                  </View>
                  <View style={{flex:1,}}>
                      {this.state.companyAddress.length != 0 ? <TextInput
                        ref='addressInfo'
                        multiline={false}
                        underlineColorAndroid="transparent"
                        defaultValue={this.state.companyAddress.split(" ")[1]}
                        placeholder='请输入详细地址'
                        placeholderTextColor='#CAD1DA'
                        style={{height: 45,flex:1,color:'#000',  borderWidth: 1,padding: 0,borderColor:"transparent",fontSize:WID==320 ? 14 : 16}}
                        onChangeText={(addressInfo) => this.changaddress.bind(this,addressInfo)()}
                      /> : <TextInput
                        ref='addressInfo'
                        multiline={false}
                        underlineColorAndroid="transparent"
                        placeholder='请输入详细地址'
                        placeholderTextColor='#CAD1DA'
                        style={{height: 45,flex:1,color:'#000',  borderWidth: 1,padding: 0,borderColor:"transparent",fontSize:WID==320 ? 14 : 16}}
                        onChangeText={(addressInfo) => this.changaddress.bind(this,addressInfo)()}
                      />}
                  </View>
                </View>
                <View style={{flex:1,flexDirection:'row',paddingTop:10,paddingBottom:10,borderBottomWidth:1,borderColor:'#eee'}}>
                  <View style={{width:100,justifyContent:'center',alignItems:'center',}}>
                     <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#4D4D4D',fontSize:WID==320 ? 14 : 16,}}>公司电话：</Text>
                  </View>
                  <View style={{flex:1,}}>
                      <TextInput
                        ref='phone'
                        multiline={false}
                        keyboardType={'numeric'}
                        underlineColorAndroid="transparent"
                        defaultValue={this.state.companyPhone}
                        placeholder='请输入公司电话'
                        placeholderTextColor='#CAD1DA'
                        style={{height: 45,flex:1,color:'#000',  borderWidth: 1,padding: 0,borderColor:"transparent",fontSize:WID==320 ? 14 : 16}}
                        onChangeText={(phone) => this.changphone.bind(this,phone)()}
                      />
                  </View>
                </View>
                <View style={{flex:1,flexDirection:'row',paddingTop:10,paddingBottom:10,borderBottomWidth:1,borderColor:'#eee'}}>
                  <View style={{width:100,justifyContent:'center',alignItems:'center',}}>
                     <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#4D4D4D',fontSize:WID==320 ? 14 : 16,}}>您的职位：</Text>
                  </View>
                  <View style={{flex:1,}}>
                      <TextInput
                        ref='job'
                        multiline={false}
                        underlineColorAndroid="transparent"
                        placeholder='请输入您的职位'
                        defaultValue={this.state.companyJob}
                        placeholderTextColor='#CAD1DA'
                        style={{height: 45,flex:1,color:'#000',  borderWidth: 1,padding: 0,borderColor:"transparent",fontSize:15}}
                        onChangeText={(job) => this.changjob.bind(this,job)()}
                      />
                  </View>
                </View>
                <View style={{padding:15}}>
                   <View>
                      <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#4D4D4D',fontSize:WID==320 ? 14 : 16,}}>营业执照</Text>
                   </View>
                   <View style={{borderWidth:1,borderColor:'#eee',height:220,marginTop:15,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                     {!this.state.imagesshow ? <TouchableOpacity activeOpacity={1} onPress={this.selectPhotoTapped.bind(this)} style={{justifyContent:'center',alignItems:'center',flex:1,flexDirection:'column',borderRightWidth:1,borderColor:'#eee',height:220,}}>
                      <View style={{justifyContent:'center',alignItems:'center',flex:1,flexDirection:'column',height:220,}}>
                         <Image style={{ width: 40, height: 40,}} source={require('../img/updata.png')} />
                         <View>
                            <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#1579BC',fontSize:14,marginTop:15}}>点击上传</Text>
                         </View>
                      </View>
                      </TouchableOpacity> : <TouchableOpacity activeOpacity={1} onPress={this.selectPhotoTapped.bind(this)} style={{justifyContent:'center',alignItems:'center',flex:1,flexDirection:'column',borderRightWidth:1,borderColor:'#eee',height:220,}}><View style={{justifyContent:'center',alignItems:'center',flex:1,flexDirection:'column'}}>
                         <Image resizeMode={'contain'} style={{ width: 240, height: 180,}} source={this.state.avatarSource} />
                         <View style={{marginTop:5}}>
                            <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#B2B2B2',fontSize:14,}}>点击重新选择</Text>
                         </View>
                      </View></TouchableOpacity>}
                      <View style={{justifyContent:'center',alignItems:'center',flex:1,flexDirection:'column'}}>
                         <Image resizeMode={'contain'} style={{ width: 240, height: 180,}} source={require('../img/company.jpg')} />
                         <View style={{marginTop:5}}>
                            <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#B2B2B2',fontSize:14,}}>示例</Text>
                         </View>
                      </View>
                   </View>
                </View>
             </Animated.ScrollView>
           </KeyboardAvoidingView>
           <Animated.Image style={{ position:'absolute',top:anitop,zIndex:999999,right:imageRight,width: imageScale, height:imageScale,}} source={require('../img/mine_photo.png')} />
           <TouchableOpacity onPress={this.submit.bind(this)} activeOpacity={1}>
             <View style={{width: Dimensions.get('window').width,height:WID==320 ? 45 : 50,justifyContent:'center',alignItems:'center',backgroundColor:'#046EB8'}}>
                <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:WID==320 ? 18 : 20}}>提交保存</Text>
             </View>
           </TouchableOpacity>
           {this.state.IsshowBottom ? <TouchableOpacity onPress={this.closeBottom.bind(this)} style={{position:'absolute',left:0,top:0,width: Dimensions.get('window').width,height: Dimensions.get('window').height,backgroundColor:'rgba(69, 67, 67, 0.47)',zIndex:9999999}}><View style={{width: Dimensions.get('window').width,height: Dimensions.get('window').height,}}></View></TouchableOpacity> : null}
           <Animated.View style={{position:'absolute',left:0,bottom:this.state.anibottom,width: Dimensions.get('window').width,height:120,backgroundColor:'#fff',zIndex:99999999}}>
              <TouchableOpacity onPress={this.getImage.bind(this)} activeOpacity={1} style={{height:60,justifyContent:'center',alignItems:'center',borderBottomWidth:1,borderColor:'#eee'}}><View style={{height:60,justifyContent:'center',alignItems:'center',}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#000',fontSize:16}}>选择图片</Text></View></TouchableOpacity>
              <TouchableOpacity onPress={this.getCamera.bind(this)} activeOpacity={1} style={{height:60,justifyContent:'center',alignItems:'center',}}><View style={{height:60,justifyContent:'center',alignItems:'center'}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#000',fontSize:16}}>打开相机</Text></View></TouchableOpacity>
           </Animated.View>
           {this.state.loaded ? <View style={{justifyContent: 'center',alignItems: 'center',width:Dimensions.get('window').width,height:Dimensions.get('window').height-((DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 75 : 70),position:'absolute',top:((DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 75 : 70),left:0,}}>
             <View style={styles.loading}>
               <ActivityIndicator color="white"/>
               <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={styles.loadingTitle}>加载中……</Text>
             </View>
          </View> : null}
          {this.state.loadeds ? <View style={{justifyContent: 'center',alignItems: 'center',width:Dimensions.get('window').width,height:Dimensions.get('window').height-((DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 75 : 70),position:'absolute',top:((DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 75 : 70),left:0,backgroundColor:'#fff',zIndex:999999999}}>
            <View style={styles.loading}>
              <ActivityIndicator color="white"/>
              <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={styles.loadingTitle}>加载中……</Text>
            </View>
         </View> : null}
         {this.state.reloads ? <View style={{justifyContent: 'center',alignItems: 'center',width:Dimensions.get('window').width,height:Dimensions.get('window').height-((DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 75 : 70),position:'absolute',top:((DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 75 : 70),left:0,backgroundColor:'#fff',zIndex:999999999}}>
           <TouchableOpacity  activeOpacity={1} onPress={this.reload.bind(this)} >
             <View style={{width:Dimensions.get('window').width,height:Dimensions.get('window').height-((DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 75 : 70),justifyContent: 'center',alignItems: 'center',}}>
               <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#777',fontSize:14}}>加载失败,请点击重试</Text>
             </View>
           </TouchableOpacity>
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
