/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
  Dimensions,
  ToastAndroid,
  DeviceEventEmitter,
  KeyboardAvoidingView,
  Linking,
  TouchableHighlight,
  Animated,
  BackHandler
} from 'react-native';
import Styles from '../../Style';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Carousel from 'react-native-banner-carousel';
import ImageViewer from 'react-native-image-zoom-viewer';
import Toast from '@remobile/react-native-toast';
import DeviceInfo from 'react-native-device-info';
import HTML from 'react-native-render-html';
import Number from '../../Number';
import Login from '../../Login/Login';
import Order from '../../ShopCart/Order';
import ShopCart from '../../ShopCart';
import Chat from '../../Chat/chat';
const BannerWidth = Dimensions.get('window').width;

const WID = Dimensions.get('window').width;
const BannerHeight = 240;
var IMG = [];
export default class MyComponent extends Component {
  constructor() {
    super();
    this._pressButton = this._pressButton.bind(this);
    BackHandler.addEventListener('hardwareBackPress', this._pressButton);
    this.state = {
        IsshowImage:[true,true,true],
        visible:false,
        scrollY: new Animated.Value(0),
        index:0,
        data:{},
        IMG:[''],
        loaded:true,
        reload:false,
        nums:0,
        main:[],
        loadeds:false,
     };
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

  componentDidMount(){
     IMG = [];
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

  getData(){
    var that = this;
    fetch('http://139.199.76.191:8889/product/detail', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: this.toQueryString({
         'id': this.props.infos.id
        })
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
         console.log(result)
         if(result.code == 0){
            IMG = [];

            result.result.imgsUrl.forEach((img,i)=>{
              var obj = {url:img};
              IMG.push(obj);
            })
            that.setState({
              data:result.result,
              IMG:IMG,
              nums:result.result.batchNum,
              loaded:false,
              reload:false,
            })
         }else{
           that.setState({
             loaded:false,
             reload:true,
           })
           Toast.showShortCenter(result.message)
         }

      })
      .catch((error) => {
          that.setState({
            loaded:false,
            reload:true,
          })
         Toast.showShortCenter('您的系统繁忙')
      });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._pressButton);
    this.getTime && clearTimeout(this.getTime);
	}

  ShowModal(index){
    this.setState({
      visible:true,
      index:index
    })
  }

  renderPage(image, index) {
        return (
            <View key={index} style={{position:'relative'}}>
                <TouchableOpacity onPress={this.ShowModal.bind(this,index)} activeOpacity={1}><Image onLoad={this.onLoad.bind(this,index)}  style={{width: BannerWidth, height: BannerHeight,}} source={{ uri: image.url }} /></TouchableOpacity>
                {this.state.IsshowImage[index] && <Image style={{ width: BannerWidth, height: BannerHeight,position:'absolute',left:0,top:0,right:0 }} source={require('../../img/1.jpg')} /> }
            </View>
        );
    }
    onLoad(index){
      this.state.IsshowImage[index] = false;
      this.setState({
        IsshowImage:this.state.IsshowImage,
      })

    }

    closest(){
			this.setState({
				visible:false,
			})
	  }

    loading(){
      return (
        <View style={{width:Dimensions.get('window').width,height:Dimensions.get('window').height,justifyContent:'center',alignItems:'center'}}>
					<ActivityIndicator size={'large'} color="white"/>
				</View>
      )
    }

    click1(data){
      this.setState({
        nums:data
      })
    }

    reloads(){
      this.setState({
        loaded:true,
        reload:false
      })
      this.getData();
    }

    pushPro(){

      var that = this;
      fetch('http://139.199.76.191:8889/shoppingCart/add', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: this.toQueryString({
           'productId': this.state.data.id,
           'token':data.result,
           'num':this.state.nums
          })
        })
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {
           console.log(result)
           if(result.code == 0){
            DeviceEventEmitter.emit('reloadShop','false');
            Toast.showShortCenter('加进货单成功')
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
             Toast.showShortCenter(result.message)
           }

        })
        .catch((error) => {

           Toast.showShortCenter('您的系统繁忙')
        });
    }

  Chat(){
    var that = this;
    this.setState({loadeds:true,})
    fetch('http://139.199.76.191:8889/im/getBusinessIM', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: this.toQueryString({
         'token': data.result,
         'businessId':this.state.data.businessId
        })
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        console.log(result)
        if(result.code == 0){
          that.setState({
            loadeds:false,
          })
          var { navigator } = that.props;
           if(navigator) {
               navigator.push({
                   name: 'Chat',
                   component: Chat,
                   params:{
                     name:result.result.username,
                     username:result.result.nickname
                   }
               })
           }
        }else{
          if(result.code == 10010){
            storage.clearMap();
            storage.remove({
              key: 'loginState'
            });
            global.data='';
            DeviceEventEmitter.emit('IsLoginout','true');
            var { navigator } = that.props;
             if(navigator) {
                 navigator.push({
                     name: 'Login',
                     component: Login,
                 })
             }
          }
        }
      })
      .catch((error) => {
        that.setState({
          loadeds:false,
        })
         ToastAndroid.showWithGravity('您的系统繁忙', ToastAndroid.LONG,ToastAndroid.CENTER)
      });

  }

  buy(){
    var that = this;
    this.setState({loadeds:true,})
    fetch('http://139.199.76.191:8889/shoppingCart/add', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: this.toQueryString({
         'productId': that.state.data.id,
         'token':data.result,
         'num':this.state.nums
        })
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
         console.log(result)
         if(result.code == 0){
          DeviceEventEmitter.emit('reloadShop','false');
          fetch('http://139.199.76.191:8889/shoppingCart/list', {
              method: 'POST',
              headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: that.toQueryString({
               'token':data.result,
              })
            })
            .then(function (response) {
              return response.json();
            })
            .then(function (result) {
               console.log(result)
               if(result.code == 0){
                 that.setState({
                   loadeds:false,
                 })
                  var objs = [
                     {
                       businessName:that.state.data.businessName,
                       businessId:that.state.data.businessId,
                       list:[]
                     }
                  ]
                  result.result.groups.forEach((info,i)=>{
                     if(that.state.data.businessId == info.businessId){
                       info.list.forEach((infos,k)=>{
                         if(infos.productId == that.state.data.id){
                           infos.num = that.state.nums
                           objs[0].list.push(infos);
                         }
                       })
                     }
                  })
                  var { navigator } = that.props;
                  if(navigator) {
                      navigator.push({
                          name: 'Order',
                          component: Order,
                          params:{
                            TatalData:objs
                          }
                      })
                  }
               }else{
                 that.setState({
                   loadeds:false,
                 })
                 Toast.showShortCenter(result.message)
               }

            })
            .catch((error) => {
              that.setState({
                loadeds:false,
              })
               Toast.showShortCenter('您的系统繁忙')
            });
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
           that.setState({
             loadeds:false,
           })
           Toast.showShortCenter(result.message)
         }

      })
      .catch((error) => {
          that.setState({
            loadeds:false,
          })
         Toast.showShortCenter('您的系统繁忙')
      });

  }

  ShopCart(){
    var { navigator } = this.props;
     if(navigator) {
         navigator.push({
             name: 'ShopCart',
             component: ShopCart,
             params:{
               isShowsback:'back',
             }
         })
     }
  }


  render() {
    const titleOpacitys = this.state.scrollY.interpolate({
      inputRange: [0, 200, 300],
      outputRange: [0,  1, 1],
    });
    return (
      <View style={Styles.container}>
          <KeyboardAvoidingView behavior='padding' style={{flex:1}}>
            <Animated.ScrollView scrollEventThrottle={1} style={{flex:1,marginTop:(DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? -45 : -20,}}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }]
                )}
            >
                <Carousel
                     autoplay={false}
                     autoplayTimeout={5000}
                     loop
                     index={0}
                     pageSize={BannerWidth}
                 >
                     {this.state.IMG.map((image, index) => this.renderPage(image, index))}
                 </Carousel>
                 <View style={{padding:10,}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#000',fontSize:16,}}>{this.state.data.title}</Text></View>
                 {this.state.data.hasOwnProperty('price') ? <View style={{padding:10,flexDirection:'row',alignItems:'center'}}>
                     <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#777',fontSize:WID==320 ? 12 : 14,}}>参考价：</Text>
                     <View style={{flexDirection:'row'}}>
                         <View style={{flexDirection:'row',alignItems:'center'}}>
                            <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#FF4241',fontSize:WID==320 ? 16 : 18,}}>{this.state.data.price}</Text></View>
                            <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#FF4241',fontSize:WID==320 ? 12 : 14,}}>元/{this.state.data.unit}</Text></View>
                         </View>
                         <View style={{flexDirection:'row',alignItems:'center'}}>
                            <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#FF4241',fontSize:WID==320 ? 12 : 14,}}> ({this.state.data.packageSpec})</Text></View>
                         </View>
                     </View>
                 </View> : <View style={{padding:10,flexDirection:'row',}}>
                     <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#777',fontSize:WID==320 ? 12 : 14,}}>参考价：</Text>
                     <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#FF4241',fontSize:WID==320 ? 14 : 16,}}>商议</Text>
                 </View>}
                 <View style={{padding:10,flexDirection:'row',}}>
                    <View style={{flexDirection:'row',flex:1}}>
                       <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#777',fontSize:WID==320 ? 12 : 14,}}>等级：</Text>
                       <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#777',fontSize:WID==320 ? 12 : 14,}}>{this.state.data.level}</Text>
                    </View>
                    <View style={{flexDirection:'row',flex:1,paddingLeft:10}}>
                       <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#777',fontSize:WID==320 ? 12 : 14,}}>规格：</Text>
                       <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#777',fontSize:WID==320 ? 12 : 14,}}>{this.state.data.spec}</Text>
                    </View>
                 </View>
                 <View style={{padding:10,flexDirection:'row',}}>
                    <View style={{flexDirection:'row',flex:1}}>
                       <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#777',fontSize:WID==320 ? 12 : 14,}}>起批量：</Text>
                       <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#777',fontSize:WID==320 ? 12 : 14,}}>{this.state.data.batchNum}{this.state.data.unit}</Text>
                    </View>
                    <View style={{flexDirection:'row',flex:1,paddingLeft:10}}>
                       <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#777',fontSize:WID==320 ? 12 : 14,}}>交易地点：</Text></View>
                       <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#777',fontSize:WID==320 ? 12 : 14,}}>{this.state.data.tradePlace}</Text></View>
                    </View>
                 </View>
                 <View style={{padding:10,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                     <View style={{flexDirection:'row',flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#777',fontSize:WID==320 ? 12 : 14,}}>数量</Text></View>
                     <View style={{flexDirection:'row',flex:1,paddingLeft:10}}><Number Onclick={this.click1.bind(this)} max={this.state.data.stock} min={this.state.data.batchNum} unit={this.state.data.unit} num={this.state.nums}/></View>
                 </View>
                 <View style={{flexDirection:'row',marginTop:10,justifyContent:'center',alignItems:'center',padding:10,backgroundColor:'#eee',}}>

                   <View style={{justifyContent:'center',alignItems:'center',}}>
                      <Image resizeMode={'contain'} style={{ width: 25,height:25,}} source={require('../../img/goods_detail_pic.png')} />
                   </View>
                   <View style={{justifyContent:'center',alignItems:'center',marginLeft:10}}>
                      <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#666',fontSize:WID==320 ? 12 : 14,}}>图文详情</Text>
                   </View>
                 </View>


                 <View style={{flex:1,padding:10,paddingTop:0,marginBottom:15,marginTop:10}}>
                    <HTML html={this.state.data.content} tagsStyles={{  p: {fontSize:14,lineHeight:23},span: {fontSize:14,lineHeight:23}}}   imagesMaxWidth={Dimensions.get('window').width-20} />
                 </View>

            </Animated.ScrollView>
          </KeyboardAvoidingView>
          <View style={{height:WID==320 ? 45 : 50,justifyContent:'center',alignItems:'center',flexDirection:'row',backgroundColor:'#fff'}}>
            <View style={{flexDirection:'row',borderTopWidth:1,borderColor:'#ddd',height:WID==320 ? 45 : 50,}}>
               <TouchableOpacity onPress={this.Chat.bind(this)} activeOpacity={1}>
                    <View style={{justifyContent:'center',alignItems:'center',paddingLeft:10,paddingRight:10}}>
                       <Image resizeMode={'contain'} style={{ width: 24,height:25,marginTop:3}} source={require('../../img/kf.png')} />
                       <View style={{marginTop:5}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#777',fontSize:10,}}>客服</Text></View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1}
                       onPress={()=>Linking.canOpenURL('tel:'+this.state.data.businessPhone).then(supported => {
                        if (supported) {
                            Linking.openURL('tel:'+this.state.data.businessPhone);
                        } else {

                        }
                       })}
                       underlayColor={'#dedede'}

                >
                   <View style={{justifyContent:'center',alignItems:'center',paddingLeft:15,paddingRight:10}}>
                      <Image resizeMode={'contain'} style={{ width:WID==320 ? 22 : 25,height:WID==320 ? 22 : 25,marginTop:3}} source={require('../../img/call.png')} />
                      <View style={{marginTop:5}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#777',fontSize:10,}}>联系</Text></View>
                   </View>
               </TouchableOpacity>
               <TouchableOpacity onPress={this.ShopCart.bind(this)} activeOpacity={1}>
                   <View style={{justifyContent:'center',alignItems:'center',paddingLeft:10,paddingRight:15}}>
                      <Image resizeMode={'contain'} style={{ width: WID==320 ? 22 : 25,height:WID==320 ? 22 : 25,marginTop:3}} source={require('../../img/home_list_click.png')} />
                      <View style={{marginTop:5}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#777',fontSize:10,}}>进货单</Text></View>
                   </View>
               </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row',flex:1}}>
               <TouchableHighlight onPress={this.pushPro.bind(this)} underlayColor="#1a7dc1" style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#026EB7',height:WID==320 ? 45 : 50}}>
                   <View style={{flex:1,justifyContent:'center',alignItems:'center',height:WID==320 ? 45 : 50}}>
                      <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#fff',fontSize:WID==320 ? 14 : 16,}}>加进货单</Text>
                   </View>
               </TouchableHighlight>
               <TouchableHighlight onPress={this.buy.bind(this)} underlayColor="#FF3D3D" style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#FF3D3D',height:WID==320 ? 45 : 50}}>
                   <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#FF3D3D',height:WID==320 ? 45 : 50}}>
                      <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#fff',fontSize:WID==320 ? 14 : 16,}}>立即购买</Text>
                   </View>
               </TouchableHighlight>
            </View>
          </View>
          <Animated.View style={[Styles.card,{position:'absolute',opacity:titleOpacitys,top:0,left:0,zIndex:99999,width:Dimensions.get('window').width}]}>
            <View style={{flex:1,justifyContent:'center'}}>

            </View>
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:18}}>详情</Text>
            </View>
            <View style={{flex:1,justifyContent:'center',alignItems:'flex-end',}}>

            </View>
          </Animated.View>

          {this.state.visible ? <View style={{position:'absolute',top:0,left:0,width:Dimensions.get('window').width,height:Dimensions.get('window').height,zIndex:999999999,}}>
             <ImageViewer  index={this.state.index} loadingRender={this.loading.bind(this)} saveToLocalByLongPress={false} onClick={this.closest.bind(this)}  imageUrls={this.state.IMG}/>
          </View> : null}



          <View style={{flex:1,justifyContent:'center',position:'absolute',top:(DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 38 : 28,left:0,zIndex:999999}}>
               <TouchableOpacity onPress={this._pressButton.bind(this)} style={{backgroundColor:"transparent"}}>
                  <View style={{justifyContent:'flex-start',flexDirection:'row',alignItems:'center',}}>
                    <Icon name="angle-left" size={WID==320 ? 26 : 30} color="#fff" style={{width: 20,marginLeft:10,}} />
                    <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:WID==320 ? 14 : 16,marginLeft:-5,}}>返回</Text>
                  </View>
              </TouchableOpacity>
          </View>

          {this.state.loaded ? <View style={{justifyContent: 'center',alignItems: 'center',width:Dimensions.get('window').width,height:Dimensions.get('window').height,position:'absolute',top:0,left:0,backgroundColor:'#fff',zIndex:99999999}}>
   					<View style={styles.loading}>
   						<ActivityIndicator color="white"/>
   						<Text allowFontScaling={false} adjustsFontSizeToFit={false} style={styles.loadingTitle}>加载中……</Text>
   					</View>
            <View style={{flex:1,justifyContent:'center',position:'absolute',top:(DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 38 : 28,left:0,zIndex:999999999,}}>
                 <TouchableOpacity onPress={this._pressButton.bind(this)} style={{backgroundColor:"transparent"}}>
                    <View style={{justifyContent:'flex-start',flexDirection:'row',alignItems:'center',}}>
                      <Icon name="angle-left" size={WID==320 ? 26 : 30} color="#777" style={{width: 20,marginLeft:10,}} />
                      <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#777',fontSize:WID==320 ? 14 : 16,marginLeft:-5,}}>返回</Text>
                    </View>
                </TouchableOpacity>
            </View>
 				  </View> : null}
          {this.state.loadeds ? <View style={{justifyContent: 'center',alignItems: 'center',width:Dimensions.get('window').width,height:Dimensions.get('window').height,position:'absolute',top:0,left:0,zIndex:99999999}}>
   					<View style={styles.loading}>
   						<ActivityIndicator color="white"/>
   						<Text allowFontScaling={false} adjustsFontSizeToFit={false} style={styles.loadingTitle}>加载中……</Text>
   					</View>
            <View style={{flex:1,justifyContent:'center',position:'absolute',top:(DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 38 : 28,left:0,zIndex:999999999,}}>
                 <TouchableOpacity onPress={this._pressButton.bind(this)} style={{backgroundColor:"transparent"}}>
                    <View style={{justifyContent:'flex-start',flexDirection:'row',alignItems:'center',}}>
                      <Icon name="angle-left" size={WID==320 ? 26 : 30} color="#777" style={{width: 20,marginLeft:10,}} />
                      <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#777',fontSize:WID==320 ? 14 : 16,marginLeft:-5,}}>返回</Text>
                    </View>
                </TouchableOpacity>
            </View>
 				  </View> : null}
          {this.state.reload ? <TouchableOpacity activeOpacity={1} onPress={this.reloads.bind(this)}  style={{justifyContent: 'center',alignItems: 'center',width:Dimensions.get('window').width,height:Dimensions.get('window').height,position:'absolute',top:0,left:0,backgroundColor:'#fff',zIndex:99999999}}>
          <View style={{justifyContent:'center',alignItems:'center',}}>

            <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 14 : 16,color:'#777'}}>点击屏幕，重新加载</Text>
          </View>
          <View style={{flex:1,justifyContent:'center',position:'absolute',top:(DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 38 : 28,left:0,zIndex:999999999,}}>
               <TouchableOpacity onPress={this._pressButton.bind(this)}>
                  <View style={{justifyContent:'flex-start',flexDirection:'row',alignItems:'center',}}>
                    <Icon name="angle-left" size={WID==320 ? 26 : 30} color="#777" style={{width: 20,marginLeft:10,}} />
                    <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#777',fontSize:WID==320 ? 14 : 16,marginLeft:-5,}}>返回</Text>
                  </View>
              </TouchableOpacity>
          </View>
          </TouchableOpacity> : null}
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
