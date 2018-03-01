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
  Linking,
  ActivityIndicator,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  DeviceEventEmitter
} from 'react-native';
import Styles from '../../Style';
import Netinfo from '../../NetInfo';
import PayInfo from './PayInfo';
import closeOrder from './closeOrder';
import Login from '../../Login/Login';
import moment from 'moment';
import photos from './photos';
import ImageViewer from 'react-native-image-zoom-viewer';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
var IMG = [];
export default class MyComponent extends Component {
  constructor() {
    super();
    this._pressButton = this._pressButton.bind(this);
    BackHandler.addEventListener('hardwareBackPress', this._pressButton);
    this.state={
      loaded:true,
      dataMain:{},
      businessInfo:{},
      orderItemList:[],
      order:{},
      orderInfo:{},
      isclose:true,
      reloads:false,
      imgS:'',
      keysArr:[],
      index:0,
      IMG:[''],
      visible:false,
    }
  }

  _pressButton() {
      const { navigator } = this.props;
      if(this.props.getReload()){
        this.props.getReload();
      }
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

  componentDidMount(){
    IMG = [];
    this.getTime = setTimeout(() => {
       this.getData();
    },800);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._pressButton);
    this.getTime && clearTimeout(this.getTime);
  }
  getData(){
    var that = this;
    fetch('https://yzx.shixiweiyuan.com/order/show', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: that.toQueryString({
         'token': data.result,
         'orderNumber':this.props.num
        })
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        console.log(result)
       if(result.code == 0){
          var urls = 'https://yzx.shixiweiyuan.com/file/downPrivateImg?token='+ data.result + '&key='+result.result.order.resourceKey;
          that.setState({
            loaded:false,
            dataMain:result.result,
            businessInfo:result.result.businessInfo,
            orderItemList:result.result.orderItemList,
            order:result.result.order,
            imgS:{uri:urls},
            orderInfo:result.result.orderInfo
          })

          if(result.result.order.hasOwnProperty('resourceKey')){
            var keysArr = [];
            IMG=[];
            result.result.order.resourceKey.split(",").forEach((imgs,i)=>{
              var urls = 'https://yzx.shixiweiyuan.com/file/downPrivateImg?token='+ data.result + '&key='+imgs;
              var imgS = {uri:urls};
              var obj = {url:urls};
              keysArr.push(imgS);
              IMG.push(obj);
            })
            that.setState({
              keysArr:keysArr,
              imgShow:true,
              IMG:IMG,
            })
          }

       }else{
         if(result.code == 10010){
           var { navigator } = that.props;
            if(navigator) {
                navigator.push({
                    name: 'Login',
                    component: Login,
                })
            }
         }
         ToastAndroid.showWithGravity(result.message, ToastAndroid.LONG,ToastAndroid.CENTER)
         that.setState({
           loaded:false,
           reloads:true
         })
       }

      })
      .catch((error) => {
       ToastAndroid.showWithGravity('您的系统繁忙', ToastAndroid.LONG,ToastAndroid.CENTER)
       that.setState({
         loaded:false,
         reloads:true
       })
      });
  }

  photo(ims,imgarr){
    var that = this;
    var { navigator } = this.props;
     if(navigator) {
         navigator.push({
             name: 'photos',
             component: photos,
             params:{
               ims:ims,
               imgarr:imgarr
             }
         })
     }
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

  loading(){
    return (
      <View style={styles.loading}>
        <ActivityIndicator size={'large'} color="white"/>
      </View>
    )
  }

  reload(){
    this.setState({
      reloads:false,
      loaded:true,
    })
    this.getData();
  }

  pay(businessInfo,num){
    var { navigator } = this.props;
     if(navigator) {
         navigator.push({
             name: 'PayInfo',
             component: PayInfo,
             params:{
               businessInfo:businessInfo,
               num:num
             }
         })
     }
  }
  close(num){
    var that = this;
    var { navigator } = this.props;
     if(navigator) {
         navigator.push({
             name: 'closeOrder',
             component: closeOrder,
             params:{
               num:num,
               getReload:function(){
                  that.setState({
                    isclose:false,
                  })
               }
             }
         })
     }
  }
  render() {
    return (
      <View style={styles.container}>
           <View style={Styles.card}>
                  <View style={{flex:1,justifyContent:'center'}}>
                       <TouchableOpacity onPress={this._pressButton.bind(this)}>
                          <View style={{justifyContent:'flex-start',flexDirection:'row',alignItems:'center',}}>
                            <Icon name="angle-left" size={30} color="#fff" style={{width: 20,marginLeft:10,}} />
                            <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:16,marginLeft:-5,}}>返回</Text>
                          </View>
                      </TouchableOpacity>
                  </View>
                  <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                     <View style={{justifyContent:'center',flexDirection:'row',alignItems:'center'}}>
                           <Text style={{color:'white',fontSize:18}} allowFontScaling={false} adjustsFontSizeToFit={false}>订单详情</Text>
                     </View>
                  </View>
                  <View style={{flex:1,justifyContent:'center'}}>

                  </View>
           </View>
           <Netinfo  {...this.props}/>
           <ScrollView style={{flex:1,backgroundColor:'#eaeaea'}}>
                <View style={{flexDirection:'row',backgroundColor:'#D5FFE2',padding:15,alignItems:'center'}}>
                    <View style={{marginRight:5}}><Image resizeMode={'contain'} style={{ width: 20, height:20, }} source={require('../../img/succeed.png')} /></View>
                    <View><Text style={{color:'#19BC11',fontSize:16}} allowFontScaling={false} adjustsFontSizeToFit={false}>交易成功</Text></View>
                </View>
                <TouchableOpacity activeOpacity={1} >
                  <View style={{backgroundColor:'#fff'}}>
                    <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                      <View style={{flex:1}}>
                        <View style={{flexDirection:'row',alignItems:'center',height:50}}>
                           <View style={{paddingLeft:30,paddingRight:30,justifyContent:'center',alignItems:'center'}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#666',fontSize:16,}}>{this.state.order.receiver}</Text></View>
                           <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#666',fontSize:16,}}>{this.state.order.phoneNumber}</Text></View>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'center',flex:1,borderBottomWidth:1,borderColor:'#eee',paddingBottom:20}}>
                            <View style={{width:30,alignItems:'center',}}><Image resizeMode={'contain'} style={{ width: 16,height:20}} source={require('../../img/shipping_adress_place.png')} /></View>
                            <View style={{flex:1,alignItems:'flex-start',flexDirection:'row',}}><Text allowFontScaling={false} numberOfLines={1} adjustsFontSizeToFit={false} style={{color:'#777',fontSize:14,}}>{this.state.order.address}</Text></View>
                        </View>
                      </View>
                      <View style={{paddingRight:15,justifyContent:'center',alignItems:'center'}}><Image resizeMode={'contain'} style={{width:13,height:13}} source={require('../../img/right.png')} /></View>
                    </View>
                  </View>
                </TouchableOpacity>
                <View style={{marginBottom:15,}}><Image style={{width:Dimensions.get('window').width,height:2}} source={require('../../img/orderform_place1.png')} /></View>
                <View style={{width:Dimensions.get('window').width,backgroundColor:'#fff',marginBottom:15,padding:15,paddingTop:0}}>
                    <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center',height:55,borderBottomWidth:1,borderColor:'#eee'}}>
                       <View style={{flex:1,height:55,flexDirection:'row',alignItems:'center',}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#333',fontSize:16}}>{this.state.businessInfo.businessName}</Text></View>
                       <TouchableOpacity activeOpacity={0.5}
                              onPress={()=>Linking.canOpenURL('tel:'+this.state.businessInfo.businessPhone).then(supported => {
                               if (supported) {
                                   Linking.openURL('tel:'+this.state.businessInfo.businessPhone);
                               } else {

                               }
                              })}
                              underlayColor={'#dedede'}

                       >
                           <View style={{flex:1,height:55,flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                                <View style={{height:55,justifyContent:'center',marginRight:5}}><Image style={{width:20,height:20}} source={require('../../img/call.png')} /></View>
                                <View style={{height:55,flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#036EB8',fontSize:16}}>拨打客服热线</Text></View>
                           </View>
                       </TouchableOpacity>
                    </View>
                    <View style={{flex:1,}}>
                    {this.state.orderItemList.map((infos,k)=>{
                      if(infos.hasOwnProperty('price')){
                        return <View key={k} style={{flex:1,flexDirection:'row',alignItems:'center',paddingTop:15,paddingBottom:15,}}>
                           <View style={{flex:1,flexDirection:'row'}}>
                             <View style={{width:100, height: 100,overflow:'hidden'}}><Image style={{width:100, height: 100,borderRadius:3,borderWidth:1,borderColor:'#ccc',}} source={{uri:infos.productImgUrl}} /></View>
                             <View style={{flex:1,paddingLeft:10,paddingRight:10,justifyContent:'space-between',}}>
                                <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} numberOfLines={2} style={{fontSize:14,color:'#333',lineHeight:20}}>{infos.productTitle}</Text></View>

                                  <View style={{flexDirection:'row',}}>
                                    <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:13,color:'#777',}}>规格：</Text></View>
                                    <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} numberOfLines={1} style={{fontSize:13,color:'#777',}}>{infos.spec}</Text></View>
                                  </View>
                                  <View style={{flexDirection:'row',}}>
                                    <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:13,color:'#777',}}>等级：</Text>
                                    <Text allowFontScaling={false} adjustsFontSizeToFit={false} numberOfLines={1} style={{fontSize:13,color:'#777',}}>{infos.level}</Text>
                                  </View>

                                  <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                       <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                           <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:16,color:'#FF3E3F',}}>{infos.realPrice}</Text>
                                           <Text allowFontScaling={false} adjustsFontSizeToFit={false} numberOfLines={2} style={{fontSize:13,color:'#FF3E3F',}}>元/{infos.unit}</Text>
                                       </View>
                                       <View style={{flexDirection:'row',}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} numberOfLines={2} style={{fontSize:14,color:'#777',}}>× {infos.realAmount}</Text></View>
                                   </View>

                             </View>
                           </View>
                        </View>
                      }else{
                        return <View key={k} style={{flex:1,flexDirection:'row',alignItems:'center',paddingTop:15,paddingBottom:15,}}>
                           <View style={{flex:1,flexDirection:'row'}}>
                             <View style={{width:100, height: 100,overflow:'hidden'}}><Image style={{width:100, height: 100,borderRadius:3,borderWidth:1,borderColor:'#ccc',}} source={{uri:infos.productImgUrl}} /></View>
                             <View style={{flex:1,paddingLeft:10,paddingRight:10,justifyContent:'space-between',}}>
                                <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} numberOfLines={2} style={{fontSize:14,color:'#333',lineHeight:20}}>{infos.productTitle}</Text></View>
                                <View style={{flexDirection:'row',}}>
                                  <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:13,color:'#777',}}>规格：</Text></View>
                                  <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} numberOfLines={1} style={{fontSize:13,color:'#777',}}>{infos.spec}</Text></View>
                                </View>
                                <View style={{flexDirection:'row'}}>
                                  <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:13,color:'#777',}}>等级：</Text>
                                  <Text allowFontScaling={false} adjustsFontSizeToFit={false} numberOfLines={1} style={{fontSize:13,color:'#777',}}>{infos.level}</Text>
                                </View>
                                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                    <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                        <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:16,color:'#FF3E3F',}}>{infos.realPrice}</Text>
                                        <Text allowFontScaling={false} adjustsFontSizeToFit={false} numberOfLines={2} style={{fontSize:13,color:'#FF3E3F',}}>元/{infos.unit}</Text>
                                    </View>
                                    <View style={{flexDirection:'row',}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} numberOfLines={2} style={{fontSize:14,color:'#777',}}>× {infos.realAmount}</Text></View>
                                </View>
                             </View>
                           </View>
                        </View>
                      }

                    })}
                    </View>
                    <View style={{borderTopWidth:1,borderColor:'#eee',paddingTop:15,paddingBottom:15}}>
                       <View style={{flexDirection:'row',justifyContent:'space-between',height:30,alignItems:'center'}}>
                          <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#333',}}>货品总价</Text></View>
                          {this.state.order.hasOwnProperty('totalPrice') ? <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#FF3E3F',}}>{Number(Number(this.state.order.totalPrice)-Number(this.state.order.fare)).toFixed(2)}元</Text></View> :
                          <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#FF3E3F',}}>待确认</Text></View>}
                       </View>
                       <View style={{flexDirection:'row',justifyContent:'space-between',height:30,alignItems:'center'}}>
                          <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#333',}}>运费</Text></View>
                          <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#FF3E3F',}}>{Number(this.state.order.fare).toFixed(2)}元</Text></View>
                       </View>
                       <View style={{flexDirection:'row',justifyContent:'space-between',height:30,alignItems:'center'}}>
                          <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#333',}}>实付款(含运费)</Text></View>
                          {this.state.order.hasOwnProperty('totalPrice') ? <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#FF3E3F',}}>{Number(this.state.order.totalPrice).toFixed(2)}元</Text></View> :
                          <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#FF3E3F',}}>待确认</Text></View>}
                       </View>
                    </View>
                    <View style={{borderTopWidth:1,borderColor:'#eee',paddingTop:15,paddingBottom:15}}>
                        <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start'}}>
                           <View style={{width:70}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#333',}}>留言：</Text></View>

                           <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} numberOfLines={3} style={{fontSize:14,color:'#777',}}>{this.state.orderInfo.buyerWords}</Text></View>
                        </View>
                    </View>
                    <View style={{borderTopWidth:1,borderColor:'#eee',paddingTop:15,paddingBottom:15}}>
                        <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                           <View style={{width:70}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#333',}}>下单号：</Text></View>
                           <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false}  style={{fontSize:14,color:'#777',}}>{this.state.order.orderNumber}</Text></View>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',marginTop:15}}>
                           <View style={{width:70}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#333',}}>下单时间：</Text></View>
                           <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false}  style={{fontSize:14,color:'#777',}}>{moment(this.state.order.orderTime).format("YYYY-MM-DD HH:mm:ss")}</Text></View>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',marginTop:15}}>
                           <View style={{width:70}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#333',}}>确认时间：</Text></View>
                           <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false}  style={{fontSize:14,color:'#777',}}>{moment(this.state.order.confirmTime).format("YYYY-MM-DD HH:mm:ss")}</Text></View>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',marginTop:15}}>
                           <View style={{width:70}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#333',}}>付款时间：</Text></View>
                           <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false}  style={{fontSize:14,color:'#777',}}>{moment(this.state.order.payTime).format("YYYY-MM-DD HH:mm:ss")}</Text></View>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',marginTop:15}}>
                           <View style={{width:70}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#333',}}>发货时间：</Text></View>
                           <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false}  style={{fontSize:14,color:'#777',}}>{moment(this.state.order.sendTime).format("YYYY-MM-DD HH:mm:ss")}</Text></View>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',marginTop:15}}>
                           <View style={{width:70}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#333',}}>收货时间：</Text></View>
                           <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false}  style={{fontSize:14,color:'#777',}}>{moment(this.state.order.receiveTime).format("YYYY-MM-DD HH:mm:ss")}</Text></View>
                        </View>
                    </View>
                    <View style={{borderTopWidth:1,borderColor:'#eee',paddingTop:15,paddingBottom:15,}}>
                      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                          <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',flex:1}}>
                             <View style={{width:70}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#333',}}>支付说明：</Text></View>
                             <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false}  style={{fontSize:14,color:'#777',}}>银行转账</Text></View>
                          </View>
                          {this.state.keysArr.length>3 ? <TouchableOpacity onPress={this.photo.bind(this,this.state.keysArr,this.state.IMG)} activeOpacity={1}><View>
                             <Text allowFontScaling={false} adjustsFontSizeToFit={false}  style={{fontSize:14,color:'#036EB8',}}>查看更多</Text>
                          </View></TouchableOpacity> : null}
                      </View>
                      <View style={{flexDirection:'row',}}>
                      {this.state.keysArr.length>0 ? this.state.keysArr.map((img ,i)=>{
                        if(i > 2){
                          return false;
                        }
                        return <TouchableOpacity key={i} onPress={this.ShowModal.bind(this,i)} activeOpacity={1}><View style={{ width: Dimensions.get('window').width/3-20, height:80,marginTop:15,marginRight:15}}>
                           <Image style={{ width: Dimensions.get('window').width/3-20, height:80, }} source={img} />
                        </View></TouchableOpacity>
                      }) : null}

                      </View>

                    </View>
                    <View style={{borderTopWidth:1,borderColor:'#eee',paddingTop:15,paddingBottom:15}}>
                        <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                           <View style={{width:70}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#333',}}>配送方式：</Text></View>
                           {this.state.orderInfo.sendWay == 1 ? <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false}  style={{fontSize:14,color:'#777',}}>自提</Text></View> :
                           <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false}  style={{fontSize:14,color:'#777',}}>商家配送</Text></View>}
                        </View>
                        {this.state.orderInfo.sendCarNum != "" ? <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',marginTop:15}}>
                           <View style={{width:70}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#333',}}>车辆号码：</Text></View>
                           <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false}  style={{fontSize:14,color:'#777',}}>{this.state.orderInfo.sendCarNum}</Text></View>
                        </View> : null}
                        {this.state.orderInfo.sendPhoneNumber != "" ? <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',marginTop:15}}>
                           <View style={{width:70}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#333',}}>联系方式：</Text></View>
                           <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false}  style={{fontSize:14,color:'#777',}}>{this.state.orderInfo.sendPhoneNumber}</Text></View>
                        </View> : null}
                        <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',marginTop:15}}>
                           {this.state.orderInfo.sendWay == 1 ? <View style={{width:70}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#333',}}>自提日期：</Text></View> :
                           <View style={{width:70}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#333',}}>配送日期：</Text></View>}
                           <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false}  style={{fontSize:14,color:'#777',}}>{this.state.orderInfo.sendDate}</Text></View>
                        </View>
                    </View>
                    {this.state.orderInfo.ticketType == 1 ? <View style={{borderTopWidth:1,borderColor:'#eee',paddingTop:15,paddingBottom:15}}>
                        <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                           <View style={{width:70}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#333',}}>发票类型：</Text></View>
                           <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false}  style={{fontSize:14,color:'#777',}}>普通发票</Text></View>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',marginTop:15}}>
                           <View style={{width:70}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#333',}}>发票抬头：</Text></View>
                           {this.state.orderInfo.ticketTitleType == 1 ? <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false}  style={{fontSize:14,color:'#777',}}>个人</Text></View> :
                           <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false}  style={{fontSize:14,color:'#777',}}>公司</Text></View>}
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',marginTop:15}}>
                           <View style={{width:70}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#333',}}>发票明细：</Text></View>
                           {this.state.orderInfo.ticketDetail ==1 ? <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false}  style={{fontSize:14,color:'#777',}}>明细</Text></View> :
                           <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false}  style={{fontSize:14,color:'#777',}}>水产食品</Text></View>}
                        </View>
                        {this.state.orderInfo.ticketTitleType == 2 ? <View>
                        <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',marginTop:15}}>
                           <View style={{width:70}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#333',}}>公司名称：</Text></View>
                           <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false}  style={{fontSize:14,color:'#777',}}>{this.state.orderInfo.ticketCompanyName}</Text></View>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',marginTop:15}}>
                           <View style={{width:70}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#333',}}>公司税号：</Text></View>
                           <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false}  style={{fontSize:14,color:'#777',}}>{this.state.orderInfo.ticketTaxNum}</Text></View>
                        </View>
                        {this.state.orderInfo.ticketBankName != '' ? <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',marginTop:15}}>
                           <View style={{width:70}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#333',}}>开户银行：</Text></View>
                           <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false}  style={{fontSize:14,color:'#777',}}>{this.state.orderInfo.ticketBankName}</Text></View>
                        </View> : null}
                        {this.state.orderInfo.ticketBankNumber != '' ? <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',marginTop:15}}>
                           <View style={{width:70}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#333',}}>银行账号：</Text></View>
                           <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false}  style={{fontSize:14,color:'#777',}}>{this.state.orderInfo.ticketBankNumber}</Text></View>
                        </View> : null}
                        </View> : null}
                    </View> : <View style={{borderTopWidth:1,borderColor:'#eee',paddingTop:15,paddingBottom:15}}>
                        <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                           <View style={{width:70}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#333',}}>发票类型：</Text></View>
                           <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false}  style={{fontSize:14,color:'#777',}}>不开发票</Text></View>
                        </View>
                    </View>}

                    <View style={{borderTopWidth:1,borderColor:'#eee',paddingTop:15,paddingBottom:15}}>
                        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                           <View ><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#333',}}>应付款(含运费)</Text></View>
                           {this.state.order.hasOwnProperty('totalPrice') ? <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:18,color:'#FF3E3F',}}>{Number(this.state.order.totalPrice).toFixed(2)}元</Text></View> :
                           <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:18,color:'#FF3E3F',}}>待确认</Text></View>}
                        </View>
                    </View>

                </View>
           </ScrollView>
           {this.state.loaded ? <View style={{justifyContent: 'center',alignItems: 'center',width:Dimensions.get('window').width,height:Dimensions.get('window').height-70,position:'absolute',top:70,left:0,backgroundColor:'#fff'}}>
             <View style={styles.loading}>
               <ActivityIndicator color="white"/>
               <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={styles.loadingTitle}>加载中……</Text>
             </View>
          </View> : null}
          {this.state.reloads ? <View style={{justifyContent: 'center',alignItems: 'center',width:Dimensions.get('window').width,height:Dimensions.get('window').height-70,position:'absolute',top:70,left:0,backgroundColor:'#fff',zIndex:999999999}}>
            <TouchableOpacity  activeOpacity={1} onPress={this.reload.bind(this)} >
              <View style={{width:Dimensions.get('window').width,height:Dimensions.get('window').height-70,justifyContent: 'center',alignItems: 'center',}}>
                <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#777',fontSize:14}}>加载失败,请点击重试</Text>
              </View>
            </TouchableOpacity>
         </View> : null}
         {this.state.visible ? <View style={{position:'absolute',top:0,left:0,width:Dimensions.get('window').width,height:Dimensions.get('window').height,zIndex:999999999}}>
            <ImageViewer  index={this.state.index} loadingRender={this.loading.bind(this)} saveToLocalByLongPress={false} onClick={this.closest.bind(this)}  imageUrls={this.state.IMG}/>
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
