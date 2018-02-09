/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  StatusBar,
  ToastAndroid,
  TouchableOpacity,
  DeviceEventEmitter,
  TouchableHighlight,
  TouchableNativeFeedback,
  Image,
  RefreshControl,
  View,
  Dimensions
} from 'react-native';
import Styles from '../Style';
import Netinfo from '../NetInfo';
import Supply from './SupplyHall';
import Icon from 'react-native-vector-icons/Ionicons';
import ScrollVertical from './Slide';
import Search from './Search';
import PriceQuo from './PriceQuo';
import hot from './hot';
import Order from '../My/Order';
import Login from '../Login/Login';
import newsInfo from '../Information/newsInfo';
import Prodetail from './SupplyHall/Prodetails';
import Carousel from 'react-native-banner-carousel';
import Toast from '@remobile/react-native-toast';
import DeviceInfo from 'react-native-device-info';
const WID = Dimensions.get('window').width;
const BannerWidth = Dimensions.get('window').width;
const BannerHeight = 230;


export default class Home extends Component {

  constructor(props) {
        super(props);
       	this.state = {
       		  scrollY: new Animated.Value(0),
       		  fadeAnim: new Animated.Value(0),
            isRefreshing:false,
            IsshowImage:[true,true,true,true,true,true,true,true],
            headLineList:[],
            dongpinList:[],
            guantouList:[],
            loadAll:true,
            imgS:[]
       	 };
    }
   componentWillMount() {
      this.getData()
   }

   getData(){
     var imgs = [];
     var that = this;
     fetch('http://139.199.76.191:8889/home/home')
		  .then((response) => response.json())
		  .then((responseData) => {

					 console.log(responseData)
           that.setState({
             loadAll:false,
             isRefreshing:false,
             imgS:responseData.result.circleImgList,
             headLineList:responseData.result.headLineList,
             dongpinList:responseData.result.dongpinList,
             guantouList:responseData.result.guantouList,
           })

		   })
		  .catch((error) => {
        that.setState({
          isRefreshing:false,
          loadAll:false,
        })
        Toast.showShortCenter('您的系统繁忙,请下拉刷新')
		  });
   }

   _Search(){
      DeviceEventEmitter.emit('_Searchs','true');
   }

   _onRefresh(){
     this.setState({
       isRefreshing:true
     })
     this.getData();
   }

   onLoad(index){

     this.state.IsshowImage[index] = false;
     this.setState({
       IsshowImage:this.state.IsshowImage,
     })

   }

   NavAll(obj){
     var { navigator } = this.props;
      if(navigator) {
          navigator.push({
              name: 'obj',
              component: obj,
          })
      }
   }

   Order(){
     var { navigator } = this.props;
      if(navigator) {
        if(data != ''){
          navigator.push({
              name: 'Order',
              component: Order,
          })
        }else{
          navigator.push({
              name: 'Login',
              component: Login,
          })
        }

      }
   }

   renderPage(image, index) {
         return (
             <View key={index} style={{position:'relative',width: BannerWidth, height: BannerHeight,}}>
                 <TouchableOpacity onPress={this.Godetail.bind(this,image)} activeOpacity={1}><Image onLoad={this.onLoad.bind(this,index)}  style={{width: BannerWidth, height: BannerHeight,}} source={{ uri: image.imgUrl }} /></TouchableOpacity>
                 {this.state.IsshowImage[index] && <Image style={{ width: BannerWidth, height: BannerHeight,position:'absolute',left:0,top:0,right:0 }} source={require('../img/1.jpg')} /> }

             </View>
         );
     }

  onClick(datas){
    var that = this;
     var { navigator } = this.props;
     if(navigator) {
         navigator.push({
             name: 'newsInfo',
             component: newsInfo,
             params:{
               id:datas,
             }
         })
     }
  }

  Godetail(info){
    var { navigator } = this.props;
     if(navigator) {
         navigator.push({
             name: 'Prodetail',
             component: Prodetail,
             params:{
               infos:info
             }
         })
     }
  }


  render() {
    const titleOpacity = this.state.scrollY.interpolate({
      inputRange: [0, 200, 250],
      outputRange: [0,  1, 1],
    });

    return (
      <View style={{flex:1,backgroundColor:'#999',paddingBottom:(DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 20 : 0,}}>
         <Netinfo  {...this.props}/>

         <Animated.ScrollView
            scrollEventThrottle={16}
            style={styles.fill}
            scrollEventThrottle={1}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this._onRefresh.bind(this)}
                progressViewOffset={60}
                tintColor="#000"
                titleColor="#00ff00"
                colors={['#036EB8']}
              />
            }
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
              { useNativeDriver: true }
            )}
          >
             <Carousel
                  autoplay
                  autoplayTimeout={5000}
                  loop
                  index={0}
                  pageSize={BannerWidth}
              >
                  {this.state.imgS.length > 0 ? this.state.imgS.map((image, index) =>{
                    return (
                        <View key={index} style={{position:'relative',width: BannerWidth, height: (Dimensions.get('window').width)/15*8,}}>
                            <TouchableOpacity  activeOpacity={1}><Image onLoad={this.onLoad.bind(this,index)}  style={{width: BannerWidth, height: (Dimensions.get('window').width)/15*8,}} source={{ uri: image.imgUrl }} /></TouchableOpacity>
                            {this.state.IsshowImage[index] && <Image  style={{ width: BannerWidth, height: BannerHeight,position:'absolute',left:0,top:0,right:0 }} source={require('../img/1.jpg')} /> }
                        </View>
                    );
                  }) : <View style={{position:'relative',width: BannerWidth, height: (Dimensions.get('window').width)/15*8,}}>
                       <Image  style={{ width: BannerWidth, height: (Dimensions.get('window').width)/15*8,}} source={require('../img/1.jpg')} />
                  </View>}
              </Carousel>
            <View style={{flex:1,flexDirection:'row'}}>
               <TouchableHighlight underlayColor="transparent" onPress={this.NavAll.bind(this,Supply)} style={{width:Dimensions.get('window').width/4,backgroundColor:'#ccc',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                   <View style={{width:Dimensions.get('window').width/4,backgroundColor:'#fff',justifyContent:'center',alignItems:'center',flexDirection:'column',}}>
                      <View style={{flexDirection:'column',width:Dimensions.get('window').width/4,height:Dimensions.get('window').width/4+10,justifyContent:'center',alignItems:'center',borderRadius:Dimensions.get('window').width/8}}>
                        <Image style={{ width:(WID==320 ? 40 : 50), height:(WID==320 ? 40 : 50),}} source={require('../img/home_apply.png')} />
                        <View style={{width:Dimensions.get('window').width/4,justifyContent:'center',alignItems:'center',paddingTop:WID==320 ? 8 : 5,}}>
                            <Text style={{fontSize:WID==320 ? 11 : 13, color:'#666666'}}  allowFontScaling={false} adjustsFontSizeToFit={false}>供应大厅</Text>
                        </View>
                      </View>
                   </View>
               </TouchableHighlight>
               <TouchableHighlight underlayColor="transparent" onPress={this.NavAll.bind(this,PriceQuo)} style={{width:Dimensions.get('window').width/4,backgroundColor:'#ccc',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                   <View style={{width:Dimensions.get('window').width/4,backgroundColor:'#fff',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                       <View style={{flexDirection:'column',width:Dimensions.get('window').width/4,height:Dimensions.get('window').width/4+10,justifyContent:'center',alignItems:'center',borderRadius:Dimensions.get('window').width/8}}>
                         <Image style={{ width: WID==320 ? 40 : 50, height: WID==320 ? 40 : 50,}} source={require('../img/home_price.png')} />
                         <View style={{width:Dimensions.get('window').width/4,justifyContent:'center',alignItems:'center',paddingTop:WID==320 ? 8 : 5,}}>
                             <Text style={{fontSize:WID==320 ? 11 : 13, color:'#666666'}}  allowFontScaling={false} adjustsFontSizeToFit={false}>行情价格</Text>
                         </View>
                       </View>

                   </View>
               </TouchableHighlight>
               <TouchableHighlight underlayColor="transparent" onPress={this.NavAll.bind(this,hot)} style={{width:Dimensions.get('window').width/4,backgroundColor:'#ccc',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                   <View style={{width:Dimensions.get('window').width/4,backgroundColor:'#fff',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                       <View style={{flexDirection:'column',width:Dimensions.get('window').width/4,height:Dimensions.get('window').width/4+10,justifyContent:'center',alignItems:'center',borderRadius:Dimensions.get('window').width/8}}>
                         <Image style={{ width: WID==320 ? 40 : 50, height: WID==320 ? 40 : 50,}} source={require('../img/home_hot.png')} />
                         <View style={{width:Dimensions.get('window').width/4,justifyContent:'center',alignItems:'center',paddingTop:WID==320 ? 8 : 5,}}>
                             <Text style={{fontSize:WID==320 ? 11 : 13, color:'#666666'}}  allowFontScaling={false} adjustsFontSizeToFit={false}>热销商品</Text>
                         </View>
                       </View>
                   </View>
               </TouchableHighlight>
               <TouchableHighlight underlayColor="transparent" onPress={this.Order.bind(this)} style={{width:Dimensions.get('window').width/4,backgroundColor:'#ccc',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                 <View style={{width:Dimensions.get('window').width/4,backgroundColor:'#fff',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                     <View style={{flexDirection:'column',width:Dimensions.get('window').width/4,height:Dimensions.get('window').width/4+10,justifyContent:'center',alignItems:'center',borderRadius:Dimensions.get('window').width/8}}>
                       <Image style={{ width: WID==320 ? 40 : 50, height: WID==320 ? 40 : 50,}} source={require('../img/home_mylist.png')} />
                       <View style={{width:Dimensions.get('window').width/4,justifyContent:'center',alignItems:'center',paddingTop:WID==320 ? 8 : 5,}}>
                           <Text style={{fontSize:WID==320 ? 11 : 13, color:'#666666'}}  allowFontScaling={false} adjustsFontSizeToFit={false}>我的订单</Text>
                       </View>
                     </View>

                 </View>
               </TouchableHighlight>
            </View>
            <View style={{width:Dimensions.get('window').width,height:5,backgroundColor:'#eee'}}></View>
             <View><View style={{flex:1,backgroundColor:'#fff',height:50,flexDirection:'row',alignItems:'center',}}>
              <View style={{paddingLeft:15,paddingRight:15}}><Image resizeMode={'contain'} style={{ width: WID==320 ? 30 : 35, height: WID==320 ? 20 : 25,}} source={require('../img/home_toutiao.png')} /></View>
              <ScrollVertical
                onChange={(index => {
                  this.index = index;
                })}
                enableAnimation={true}
                data={this.state.headLineList}
                onClick={this.onClick.bind(this)}
                delay={2500}
                duration={1500}
                scrollHeight={50}
                textStyle={{fontSize:WID==320 ? 12 : 14,}}
                scrollStyle={{ alignItems: 'flex-start' }}  />
           </View>
           <View style={{width:Dimensions.get('window').width,height:5,backgroundColor:'#eee'}}></View>

               <View style={{flex:1,flexDirection:'column',backgroundColor:'#eee'}}>
                    <View style={{flex:1,justifyContent:'center',alignItems:'flex-start',height:40,backgroundColor:'#fff',paddingLeft:15}}>
                       <Text style={{fontSize:WID==320 ? 14 : 16, color:'#000',fontWeight:'400'}}  allowFontScaling={false} adjustsFontSizeToFit={false}>冻品推荐</Text>
                    </View>
                    <View style={{width:Dimensions.get('window').width,flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'}}>

                        {this.state.dongpinList.length > 0 ? this.state.dongpinList.map((info,i)=>{
                          return <TouchableOpacity activeOpacity={1}  key={i} onPress={this.Godetail.bind(this,info)} style={{width:Dimensions.get('window').width/2-2,}}>
                                  <View style={{width:Dimensions.get('window').width/2-2,justifyContent:'center',alignItems:'center',marginRight:2,marginBottom:4,flexDirection:'column',backgroundColor:'#fff'}}>
                                      <Image style={{width:Dimensions.get('window').width/2-2, height: Dimensions.get('window').width/2-2,}} source={{uri:info.recommendImgUrl}} />
                                      <View style={{flex:1,justifyContent:'space-between',height:80,alignItems:'flex-start',overflow:'hidden'}}>
                                        <View style={{width:Dimensions.get('window').width/2-2,justifyContent:'flex-start',alignItems:'flex-start',paddingLeft:5,paddingTop:5}}>
                                            <Text style={{fontSize:WID==320 ? 12 : 14, color:'#222222',lineHeight:WID==320 ? 18 : 22}} numberOfLines={2}  allowFontScaling={false} adjustsFontSizeToFit={false}>{info.title}</Text>
                                        </View>
                                        {info.hasOwnProperty('price') ? <View style={{width:Dimensions.get('window').width/2-2,justifyContent:'flex-start',alignItems:'center',padding:5,paddingTop:0,flexDirection:'row'}}>
                                            <Text style={{fontSize:WID==320 ? 12 : 14, color:'#999999'}}  allowFontScaling={false} adjustsFontSizeToFit={false}>参考价：</Text>
                                            <Text style={{fontSize:WID==320 ? 14 : 16, color:'#FF4343'}}  allowFontScaling={false} adjustsFontSizeToFit={false}>{info.price}</Text>
                                            <Text style={{fontSize:WID==320 ? 12 : 14, color:'#FF4343'}}  allowFontScaling={false} adjustsFontSizeToFit={false}>元/{info.unit}</Text>
                                        </View> : <View style={{width:Dimensions.get('window').width/2-2,justifyContent:'flex-start',alignItems:'center',padding:5,paddingTop:0,flexDirection:'row'}}>
                                            <Text style={{fontSize:WID==320 ? 12 : 14, color:'#999999'}}  allowFontScaling={false} adjustsFontSizeToFit={false}>参考价：</Text>
                                            <Text style={{fontSize:WID==320 ? 14 : 16, color:'#FF4343'}}  allowFontScaling={false} adjustsFontSizeToFit={false}>商议</Text>
                                        </View>}
                                      </View>
                                   </View>
                                 </TouchableOpacity>
                        }) : null}


                    </View>
               </View>
               <View style={{width:Dimensions.get('window').width,height:5,backgroundColor:'#eee'}}></View>
               <View style={{flex:1,flexDirection:'column',backgroundColor:'#eee'}}>
                    <View style={{flex:1,justifyContent:'center',alignItems:'flex-start',height:40,backgroundColor:'#fff',paddingLeft:15}}>
                       <Text style={{fontSize:WID==320 ? 14 : 16, color:'#000',fontWeight:'400'}}  allowFontScaling={false} adjustsFontSizeToFit={false}>罐头推荐</Text>
                    </View>
                    <View style={{width:Dimensions.get('window').width,flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'}}>
                        {this.state.guantouList.length > 0 ? this.state.guantouList.map((info,i)=>{
                          return <TouchableOpacity activeOpacity={1}  key={i} onPress={this.Godetail.bind(this,info)} style={{width:Dimensions.get('window').width/2-2,}}>
                                  <View style={{width:Dimensions.get('window').width/2-2,justifyContent:'center',alignItems:'center',marginRight:2,marginBottom:4,flexDirection:'column',backgroundColor:'#fff'}}>
                                      <Image style={{width:Dimensions.get('window').width/2-2, height: Dimensions.get('window').width/2-2,}} source={{uri:info.recommendImgUrl}} />
                                      <View style={{flex:1,justifyContent:'space-between',height:80,alignItems:'flex-start',overflow:'hidden'}}>
                                        <View style={{width:Dimensions.get('window').width/2-2,justifyContent:'flex-start',alignItems:'flex-start',paddingLeft:5,paddingTop:5}}>
                                            <Text style={{fontSize:WID==320 ? 12 : 14, color:'#222222',lineHeight:WID==320 ? 18 : 22}} numberOfLines={2}  allowFontScaling={false} adjustsFontSizeToFit={false}>{info.title}</Text>
                                        </View>
                                        {info.hasOwnProperty('price') ? <View style={{width:Dimensions.get('window').width/2-2,justifyContent:'flex-start',alignItems:'center',padding:5,paddingTop:0,flexDirection:'row'}}>
                                            <Text style={{fontSize:WID==320 ? 12 : 14, color:'#999999'}}  allowFontScaling={false} adjustsFontSizeToFit={false}>参考价：</Text>
                                            <Text style={{fontSize:WID==320 ? 14 : 16, color:'#FF4343'}}  allowFontScaling={false} adjustsFontSizeToFit={false}>{info.price}</Text>
                                            <Text style={{fontSize:WID==320 ? 12 : 14, color:'#FF4343'}}  allowFontScaling={false} adjustsFontSizeToFit={false}>元/{info.unit}</Text>
                                        </View> : <View style={{width:Dimensions.get('window').width/2-2,justifyContent:'flex-start',alignItems:'center',padding:5,paddingTop:0,flexDirection:'row'}}>
                                            <Text style={{fontSize:WID==320 ? 12 : 14, color:'#999999'}}  allowFontScaling={false} adjustsFontSizeToFit={false}>参考价：</Text>
                                            <Text style={{fontSize:WID==320 ? 14 : 16, color:'#FF4343'}}  allowFontScaling={false} adjustsFontSizeToFit={false}>商议</Text>
                                        </View>}
                                      </View>
                                   </View>
                                 </TouchableOpacity>
                        }) : null}

                    </View>
               </View>
           </View>

          </Animated.ScrollView>

          <Animated.View pointerEvents="none" style={[styles.Searchbg,{opacity: titleOpacity,}]}>

          </Animated.View>

          <View style={styles.Search}>
            <TouchableOpacity activeOpacity={1} onPress={this._Search.bind(this)} style={{width:Dimensions.get('window').width-40,justifyContent:'center',alignItems:'center',overflow:'hidden',zIndex:99999999999}}>
             <View style={{backgroundColor:'rgba(255, 255, 255, 0.7)',borderRadius:15,flexDirection:'row',width:Dimensions.get('window').width-40,}}>
               <View style={{height:30,width:30,justifyContent:'center',alignItems:'center',marginLeft:10}}>
                 <Icon name="ios-search" color="#666" size={20}  />
               </View>
               <View style={{flex:1,justifyContent:'center'}}>
               <Text style={{fontSize:14,color:'#777'}} allowFontScaling={false} adjustsFontSizeToFit={false}>搜索你想要的货品</Text>
             </View>
             </View>
            </TouchableOpacity>
          </View>

          {this.state.loadAll ? <View style={{backgroundColor:'#fff',position:'absolute',top:0,left:0,width: Dimensions.get('window').width,zIndex:99999999}}>
             <Image resizeMode={'contain'} style={{ width: Dimensions.get('window').width,height:Dimensions.get('window').height}} source={require('../img/waiting.png')} />
          </View> : null}

       </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  fill: {
   flex: 1,
   backgroundColor: '#fff',
   marginTop:(DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? -45 : -20,

  },
  Searchbg:{
    width:Dimensions.get('window').width,
    height:(DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 75 : 65,
    paddingTop:(DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 30 : 20,
    backgroundColor:'#036EB8',
    position:'absolute',
    top:0,
    left:0,
    overflow:'hidden',
    zIndex:99999
  },
  slide: {
   flex: 1,
   justifyContent: 'center',
   backgroundColor: 'transparent'
 },

 slide1: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   backgroundColor: '#9DD6EB'
 },

 slide2: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   backgroundColor: '#97CAE5'
 },

 slide3: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   backgroundColor: '#92BBD9'
 },

 text: {
   color: '#fff',
   fontSize: 30,
   fontWeight: 'bold'
 },
  Search:{
    justifyContent:'center',
    alignItems:'center',
    width:Dimensions.get('window').width,
    height:(DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 75 : 65,
    paddingTop:(DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 30 : 20,
    position:'absolute',
    top:0,
    left:0,
    overflow:'hidden',
    zIndex:999999
  }

});
