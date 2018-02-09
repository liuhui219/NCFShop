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
  ListView,
  RefreshControl,
  TouchableNativeFeedback,
  TouchableHighlight,
  TouchableOpacity,
  DeviceEventEmitter
} from 'react-native';
import Styles from '../../Style';
import Netinfo from '../../NetInfo';
import Toast from '@remobile/react-native-toast';
import DeviceInfo from 'react-native-device-info';
import orderList from './orderList';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PayInfo from './PayInfo';
import closeOrder from './closeOrder';
import waitSent from './waitSent';
var array = [];
const WID = Dimensions.get('window').width;
export default class MyComponent extends Component {
  constructor() {
    super();
    this._pressButton = this._pressButton.bind(this);
    BackHandler.addEventListener('hardwareBackPress', this._pressButton);
    this.state={
      dataSource: new ListView.DataSource({
			  rowHasChanged: (row1, row2) => row1 !== row2,
		  }),
      IsShowMask:false,
      isRefreshing:false,
      ImgArray:[],
      loaded: false,
		  isLoadMore:false,
		  isReach:false,
		  isRefreshing:false,
		  isNull:false,
		  sx:false,
      index:0
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
    array = [];
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
    fetch('http://139.199.76.191:8889/order/list', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: this.toQueryString({
        'token': data.result,
        'status':3,
        'index':0
				})
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        array = [];
        console.log(result)
        if(result.code == 0){
          if(result.result.object.length != 0){
            result.result.object.forEach((info,i)=>{
              array.push(info);
              console.log(array)
            })
          }
          if(result.result.object.length <= 9){
             that.setState({
							   isReach:true,
							   isLoadMore:false,
                 isRefreshing:false,
                 index:result.result.index
						 })
          }
          if(result.result.object.length == 0){
						  that.setState({
							   dataSource: that.state.dataSource.cloneWithRows(['暂时没有相关订单']),
							   loaded: true,
							   sx:false,
							   isLoadMore:false,
                 isRefreshing:false,
							   isNull:true,
                 index:result.result.index
						   })
					 }else if(array.length > result.result.object.length){
						   that.setState({
							   isReach:true,
							   isLoadMore:false,
							   isNull:false,
                 isRefreshing:false,
                 index:result.result.index
						   })
					 }else{
						   that.setState({
							   dataSource: that.state.dataSource.cloneWithRows(array),
							   loaded: true,
							   sx:false,
                 isRefreshing:false,
                 isNull:false,
                 index:result.result.index
						   })
           }
        }else{
          that.setState({
               loaded: true,
               sx:true,
               isReach:true,
               isRefreshing:false,
               dataSource: that.state.dataSource.cloneWithRows(['加载失败，请下拉刷新']),
          })
          Toast.showShortCenter('您的系统繁忙')
        }
      })
      .catch((error) => {
        Toast.showShortCenter('您的系统繁忙')
        that.setState({
             loaded: true,
             sx:true,
             isReach:true,
             isRefreshing:false,
             dataSource: that.state.dataSource.cloneWithRows(['加载失败，请下拉刷新']),
        })
      });
  }

  proinfo(num){
    var that = this;
    var { navigator } = this.props;
     if(navigator) {
         navigator.push({
             name: 'orderList',
             component: orderList,
             params:{
               num:num,
               getReload:function(){
                 that.getTime = setTimeout(() => {
                    that.getData();
                    that.setState({
                      isReach:false,
                    })
                 },800);
               }
             }
         })
     }
  }


  Total(datas){
    var sumPrice = [];
    var sunTotal = 0;
    var flog = true;
    datas.orderItemList.forEach((info,i)=>{
      if(info.hasOwnProperty('price') && flog == true){
        var price = info.price * info.amount;
        sumPrice.push(price.toFixed(2));
        if(datas.orderItemList.length-1 == i){
          sumPrice.forEach((num)=>{
            sunTotal += Number(num);
          })
          sunTotal=sunTotal.toFixed(2);

        }

      }else{
        sunTotal='商议',flog = false;
      }
    })
    return sunTotal
  }


  renderMovie(data,sectionID: number, rowID: number) {
		if(this.state.sx){
			return(
			    <View style={{justifyContent:'center',alignItems:'center',height:Dimensions.get('window').height-120,width:Dimensions.get('window').width,backgroundColor:'#fff'}}>

				    <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#777'}}>{data}</Text>
				  </View>
			)
		}else if(this.state.isNull){
			return (
			    <View style={{justifyContent:'center',alignItems:'center',height:Dimensions.get('window').height-120,width:Dimensions.get('window').width,backgroundColor:'#fff'}}>

				    <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#777'}}>{data}</Text>
				  </View>
			)
		}else{

		  return (
           <View style={{width:Dimensions.get('window').width,backgroundColor:'#fff',marginBottom:15,padding:15,paddingTop:0}}>
               <View style={{flex:1,flexDirection:'row',alignItems:'center',height:55,borderBottomWidth:1,borderColor:'#eee'}}>
                  <View style={{flex:1,height:55,flexDirection:'row',alignItems:'center',}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#333',fontSize:WID==320 ? 14 : 16}}>{data.businessInfo.businessName}</Text></View>
               </View>
               <TouchableHighlight underlayColor="transparent" onPress={this.proinfo.bind(this,data.order.orderNumber)} style={{flex:1}}>
               <View style={{flex:1,}}>
               {data.orderItemList.map((infos,k)=>{
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
               </TouchableHighlight>
               <View style={{flexDirection:'row',flex:1,justifyContent:'flex-end',height:50,alignItems:'center',borderTopWidth:1,borderColor:'#eee',paddingRight:10}}>
                   <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#777',}}>{data.orderItemList.length}种货品</Text></View>
                   <View style={{marginLeft:15,flexDirection:'row'}}>
                      <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#777',}}>总金额(含运费)：</Text>
                      <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:16,color:'#FF3E3F',}}>{data.order.totalPrice}元</Text>
                   </View>
               </View>
           </View>
  			)

		}
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
                 that.getData();
               }
             }
         })
     }
  }

  _renderFooter() {
		 if(this.state.isLoadMore){
			 return (
				<View style={styles.footer}>
					<ActivityIndicator color="#4385f4"/>
					<Text allowFontScaling={false} adjustsFontSizeToFit={false} style={styles.footerTitle}>正在加载更多……</Text>
				</View>
		  )
		 }
	}

  _onRefresh(){
    this.setState({
        isRefreshing:true,
        isReach:false,
        isLoadMore:false,
     })
     this.getData();
  }

  _onEndReach(){
    if(!this.state.isReach){
        this.setState({
          isLoadMore:true,
        })

        var that=this
        fetch('http://139.199.76.191:8889/order/list', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: this.toQueryString({
             'token': data.result,
             'status':3,
             'index': this.state.index
           })
          })
          .then(function (response) {
            return response.json();
          })
          .then(function (result) {
            console.log(result)

            if(result.code == 0){
              if(result.result.object.length != 0){
                result.result.object.forEach((info,i)=>{
                  array.push(info);
                })
              }
              if(result.result.object.length <= 9){
                 that.setState({
                    isReach:true,
                    isLoadMore:false,
                    index:result.result.index
                })
              }
              if(result.result.object.length == 0){
                 that.setState({
                    loaded: true,
                    sx:false,
                    isLoadMore:false,
                    isReach:true,
                    isNull:false,
                    index:result.result.index
                  })
              }else{
                  that.setState({
                    dataSource: that.state.dataSource.cloneWithRows(array),
                    loaded: true,
                    sx:false,
                    index:result.result.index,
                    isNull:false,
                  })
               }
            }else{
              that.setState({
                   loaded: true,
                   sx:true,
                   isReach:true,
                   dataSource: that.state.dataSource.cloneWithRows(['加载失败，请下拉刷新']),
              })
              Toast.showShortCenter('您的系统繁忙')
            }
          })
          .catch((error) => {
            Toast.showShortCenter('您的系统繁忙')
            that.setState({
                 loaded: true,
                 sx:true,
                 isReach:true,
                 isRefreshing:false,
                 dataSource: that.state.dataSource.cloneWithRows(['加载失败，请下拉刷新']),
            })
          });

    }
  }


  render() {
    return (
      <View style={[Styles.container,{backgroundColor:'#eee'}]}>
          <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderMovie.bind(this)}
          onEndReached={this._onEndReach.bind(this) }
          onEndReachedThreshold={2}
          renderFooter={this._renderFooter.bind(this)}
            refreshControl={
                    <RefreshControl
                      refreshing={this.state.isRefreshing}
                      onRefresh={this._onRefresh.bind(this) }
                      colors={['#036EB8', '#00ff00', '#0000ff','#036EB8']}
                      progressBackgroundColor="#ffffff"
                      />
                  }
            />
            {!this.state.loaded ? <View style={{justifyContent: 'center',alignItems: 'center',width:Dimensions.get('window').width,height:Dimensions.get('window').height-120,position:'absolute',top:0,left:0,backgroundColor:'#fff'}}>
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
	footer: {
        width:Dimensions.get('window').width,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex:-1

    },

    footerTitle: {
        marginLeft: 10,
        fontSize: 15,
        color: 'gray'
    },
});
