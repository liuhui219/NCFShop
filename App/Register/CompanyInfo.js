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
import city from './city.json';
import Picker from 'antd-mobile/lib/picker';
import List from 'antd-mobile/lib/list';
import arrayTreeFilter from 'array-tree-filter';
import ImagePicker from 'react-native-image-picker';
const WID = Dimensions.get('window').width;
const CustomChildren = props => (

    <View style={{width:Dimensions.get('window').width,flexDirection:'row',height:45}}>
      <View style={{width:100,justifyContent:'center',alignItems:'center',}}>
         <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#4D4D4D',fontSize:WID==320 ? 14 : 15,}}>所在地址：</Text>
      </View>
      <TouchableOpacity
        onPress={props.onClick}
        activeOpacity={1}
        style={{ backgroundColor: '#fff',flexDirection:'row',flex:1}}
      >
      <View  style={{ flexDirection:'row',justifyContent:'space-between',alignItems:'center',flex:1,paddingRight:10}}>
        <View style={{ flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#333',fontSize:14}}>{props.extra}</Text></View>
        <Ionicons name="ios-arrow-forward-outline" color="#666" size={WID==320 ? 20 : 24}  />
      </View>
      </TouchableOpacity>
    </View>

);
export default class MyComponent extends Component {
  constructor() {
    super();
    this._pressButton = this._pressButton.bind(this);
    BackHandler.addEventListener('hardwareBackPress', this._pressButton);
    this.state={
      address:'请选择地址',
      anibottom:new Animated.Value(-130),
      shows:false,
      pickerValue: [],
      data: [],
      company:'',
      addressInfo:'',
      phone:'',
      job:'',
      values:'',
      imguri:'',
      avatarSource:'',
      fileImg:'',
      imagesshow:false,
      Islogins:false,
      sumText:'提交'
    }
  }

  componentDidMount() {

  }

  _pressButton() {

       return true;
   }

   onClick = () => {

  };


  Trims(x) {
    return x.replace(/\s/g,"");
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._pressButton);
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
         sumText:'提交中...',
         Islogins:true,
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
                 that.setState({
                   sumText:'提交',
                   Islogins:false,
                 })
                 DeviceEventEmitter.emit('IsLogin','false');
                 const { navigator } = that.props;
                 if(navigator) {

                     navigator.popToTop();
                     return true;
                 }
                 return false;
               })
               .catch((error) => {
                 that.setState({
                   sumText:'提交',
                   Islogins:false,
                 })
                  Toast.showShortCenter('您的系统繁忙')
               });
           }else{
             that.setState({
               sumText:'提交',
               Islogins:false,
             })
             Toast.showShortCenter(result.message)
           }

         })
         .catch((error) => {
           that.setState({
             sumText:'提交',
             Islogins:false,
           })
            Toast.showShortCenter('您的系统繁忙')
         });
     }
     else{
       that.setState({
         sumText:'提交中...',
         Islogins:true,
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
            sumText:'提交',
            Islogins:false,
          })
          DeviceEventEmitter.emit('IsLogin','false');
          const { navigator } = that.props;
          if(navigator) {

              navigator.popToTop();
              return true;
          }
          return false;
        })
        .catch((error) => {
          that.setState({
            sumText:'提交',
            Islogins:false,
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



  render() {
    return (
      <View style={Styles.container}>
          <View style={Styles.card}>
            <View style={{flex:1,justifyContent:'center'}}>

            </View>
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:WID==320 ? 16 : 18}}>公司信息</Text>
            </View>
            <TouchableOpacity onPress={this.Gomain.bind(this)} style={{flex:1,justifyContent:'center'}}>
              <View style={{flex:1,justifyContent:'center',alignItems:'flex-end',}}>
                 <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:WID==320 ? 14 : 16,paddingRight:10}}>跳过</Text>
              </View>
            </TouchableOpacity>
          </View>
          <Netinfo  {...this.props}/>
          <KeyboardAvoidingView behavior='padding' style={{flex:1}}>
            <ScrollView style={{flex:1}}>
               <View style={{padding:10,backgroundColor:'#FFF9D5'}}>
                   <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#CFA361',fontSize:WID==320 ? 12 : 14,}}>请完善公司信息，以便方便发货和开具发票</Text>
               </View>
               <View style={{flex:1,flexDirection:'row',paddingTop:10,paddingBottom:10,borderBottomWidth:1,borderColor:'#eee'}}>
                 <View style={{width:100,justifyContent:'center',alignItems:'center',}}>
                    <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#4D4D4D',fontSize:WID==320 ? 14 : 15,}}>公司名称：</Text>
                 </View>
                 <View style={{flex:1,}}>
                     <TextInput
                       ref='company'
                       multiline={false}
                       underlineColorAndroid="transparent"
                       placeholder='请输入公司名称'
                       placeholderTextColor='#CAD1DA'
                       style={{height: 45,flex:1,color:'#000',  borderWidth: 1,padding: 0,borderColor:"transparent",fontSize:14}}
                       onChangeText={(company) => this.changs.bind(this,company)()}
                     />
                 </View>
               </View>
               <View style={{flex:1,flexDirection:'row',paddingTop:10,paddingBottom:10,borderBottomWidth:1,borderColor:'#eee'}}>
                 <Picker
                    title="选择地区"
                    extra="选择地区"
                    data={city}
                    format={(values) => { return values.join(' '); }}
                    itemStyle={{fontSize:14,lineHeight:25,textAlign:'center'}}
                    value={this.state.pickerValue}
                    onChange={v => this.onOk.bind(this,v)()}
                    onOk={v => this.setState({ pickerValue: v })}
                  >
                      <CustomChildren></CustomChildren>
                    </Picker>
               </View>
               <View style={{flex:1,flexDirection:'row',paddingTop:10,paddingBottom:10,borderBottomWidth:1,borderColor:'#eee'}}>
                 <View style={{width:100,justifyContent:'center',alignItems:'center',}}>
                    <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#4D4D4D',fontSize:WID==320 ? 14 : 15,}}>详细地址：</Text>
                 </View>
                 <View style={{flex:1,}}>
                     <TextInput
                       ref='addressInfo'
                       multiline={true}
                       numberOfLines={2}
                       underlineColorAndroid="transparent"
                       placeholder='请输入详细地址'
                       placeholderTextColor='#CAD1DA'
                       style={{height: 45,flex:1,color:'#000',  borderWidth: 1,padding: 0,borderColor:"transparent",fontSize:14}}
                       onChangeText={(addressInfo) => this.changaddress.bind(this,addressInfo)()}
                     />
                 </View>
               </View>
               <View style={{flex:1,flexDirection:'row',paddingTop:10,paddingBottom:10,borderBottomWidth:1,borderColor:'#eee'}}>
                 <View style={{width:100,justifyContent:'center',alignItems:'center',}}>
                    <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#4D4D4D',fontSize:15,}}>公司电话：</Text>
                 </View>
                 <View style={{flex:1,}}>
                     <TextInput
                       ref='phone'
                       multiline={false}
                       keyboardType={'numeric'}
                       underlineColorAndroid="transparent"
                       placeholder='请输入公司电话'
                       placeholderTextColor='#CAD1DA'
                       style={{height: 45,flex:1,color:'#000',  borderWidth: 1,padding: 0,borderColor:"transparent",fontSize:14}}
                       onChangeText={(phone) => this.changphone.bind(this,phone)()}
                     />
                 </View>
               </View>
               <View style={{flex:1,flexDirection:'row',paddingTop:10,paddingBottom:10,borderBottomWidth:1,borderColor:'#eee'}}>
                 <View style={{width:100,justifyContent:'center',alignItems:'center',}}>
                    <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#4D4D4D',fontSize:WID==320 ? 14 : 15,}}>您的职位：</Text>
                 </View>
                 <View style={{flex:1,}}>
                     <TextInput
                       ref='job'
                       multiline={false}
                       underlineColorAndroid="transparent"
                       placeholder='请输入您的职位'
                       placeholderTextColor='#CAD1DA'
                       style={{height: 45,flex:1,color:'#000',  borderWidth: 1,padding: 0,borderColor:"transparent",fontSize:14}}
                       onChangeText={(job) => this.changjob.bind(this,job)()}
                     />
                 </View>
               </View>
               <View style={{padding:15}}>
                  <View>
                     <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#4D4D4D',fontSize:15,}}>营业执照</Text>
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
            </ScrollView>
          </KeyboardAvoidingView>
          <TouchableOpacity onPress={this.submit.bind(this)} activeOpacity={1}>
          <View style={{height:WID==320 ? 145 : 50,justifyContent:'center',alignItems:'center',backgroundColor:'#036EB8'}}>
             <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#fff',fontSize:WID==320 ? 16 : 20,}}>{this.state.sumText}</Text>
             {this.state.Islogins ? <View style={{position:'absolute',top:15,right:20}}><ActivityIndicator color="white"/></View> : null}
          </View>
          </TouchableOpacity>
          {this.state.IsshowBottom ? <TouchableOpacity onPress={this.closeBottom.bind(this)} style={{position:'absolute',left:0,top:0,width: Dimensions.get('window').width,height: Dimensions.get('window').height,backgroundColor:'rgba(69, 67, 67, 0.47)',zIndex:9999999}}><View style={{width: Dimensions.get('window').width,height: Dimensions.get('window').height,}}></View></TouchableOpacity> : null}
          <Animated.View style={{position:'absolute',left:0,bottom:this.state.anibottom,width: Dimensions.get('window').width,height:120,backgroundColor:'#fff',zIndex:99999999}}>
             <TouchableOpacity onPress={this.getImage.bind(this)} activeOpacity={1} style={{height:60,justifyContent:'center',alignItems:'center',borderBottomWidth:1,borderColor:'#eee'}}><View style={{height:60,justifyContent:'center',alignItems:'center',}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#000',fontSize:WID==320 ? 14 : 16}}>选择图片</Text></View></TouchableOpacity>
             <TouchableOpacity onPress={this.getCamera.bind(this)} activeOpacity={1} style={{height:60,justifyContent:'center',alignItems:'center',}}><View style={{height:60,justifyContent:'center',alignItems:'center'}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#000',fontSize:WID==320 ? 14 : 16}}>打开相机</Text></View></TouchableOpacity>
          </Animated.View>
          {this.state.shows ? <View style={{width:Dimensions.get('window').width,height:Dimensions.get('window').height,backgroundColor:'rgba(107, 107, 107, 0.43)',position:'absolute',top:0,left:0}}></View> : null}
          {this.state.Islogins ? <View style={{width:Dimensions.get('window').width,height:Dimensions.get('window').height,backgroundColor:'transparent',position:'absolute',top:0,left:0}}></View> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
