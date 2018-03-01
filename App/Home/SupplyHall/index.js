/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  BackHandler,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
  ToastAndroid,
  TouchableHighlight,
  ScrollView,
  ListView,
  TouchableNativeFeedback,
  KeyboardAvoidingView,
  DeviceEventEmitter,
  ActivityIndicator,
  Keyboard,
  PixelRatio,
  RefreshControl,
  Image,
  Animated
} from 'react-native';
import Styles from '../../Style';
import Netinfo from '../../NetInfo';
import Toast from '@remobile/react-native-toast';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Prodetail from './Prodetails';
import Login from '../../Login/Login';
var array = [];
var ImgArray = [];
var arrays = [];
var ImgArrays = [];
var array_color=[];
var array_color1=[];
const WID = Dimensions.get('window').width;
export default class Supply extends Component {
  constructor() {
    super();
    this._pressButton = this._pressButton.bind(this);
    BackHandler.addEventListener('hardwareBackPress', this._pressButton);
    this.state={
      dataSource: new ListView.DataSource({
			  rowHasChanged: (row1, row2) => row1 !== row2,
		  }),
      dataSources: new ListView.DataSource({
			  rowHasChanged: (row3, row4) => row3 !== row4,
		  }),
      IsShow:false,
      IsShowClose:false,
      fadeAnim: new Animated.Value(0),
      heights:new Animated.Value(0),
      heightd:new Animated.Value(0),
      opacitys:new Animated.Value(0),
      IsShowMask:false,
      isRefreshing:false,
      isL:true,
      isR:true,
      Lcolor:'#666',
      Rcolor:'#666',
      ImgArray:[],
      loaded: false,
		  isLoadMore:false,
		  isReach:false,
		  isRefreshing:false,
		  isNull:false,
		  sx:false,
      ImgArrays:[],
      loadeds: false,
		  isLoadMores:false,
		  isReachs:false,
		  isNulls:false,
		  sxs:false,
      Sort:'',
      categoryId:'',
      index:0,
      indexs:0,
      default:true,
      positive:false,
      Reverse:false,
      loadeds:false,
      loadedk:false,
      dataCategorys:[],
      Categorys:[],
      RightData:[],
      color:'#fff',
      allColor:'#F0F0F0',
      ids:'',
    }
  }

  _pressButton() {
      const { navigator } = this.props;
      if(navigator) {
          if(this.props.reloadShop){
            this.props.reloadShop(true);
          }

          navigator.pop();
          return true;
      }
      return false;
  }

  componentDidMount(){
    array = [];
    ImgArray = [];
    arrays = [];
    ImgArrays = [];
    array_color=[];
    this.getTime = setTimeout(() => {
       this.getData();
       this.getCategorys();
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

  getCategorys(){
    var that = this;
     var dataCategorys = [];
     array_color=[];
     array_color1=[];
		 fetch('https://yzx.shixiweiyuan.com/product/categorys')
		  .then((response) => response.json())
		  .then((responseData) => {
					 console.log(responseData)
           responseData.result.forEach((datas,i)=>{
             array_color.push('#fff');
             array_color1.push('#fff');
             datas.lowers.forEach((infosd,j)=>{
               dataCategorys.push(infosd);

             })
           })

           that.setState({
             dataCategorys:dataCategorys,
             RightData:dataCategorys,
             Categorys:responseData.result,
             color:array_color,
           })
		   })
		  .catch((error) => {
         Toast.showShortCenter('您的系统繁忙')
		  });
  }

  getData(){
    var that = this;
    fetch('https://yzx.shixiweiyuan.com/product/products', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: this.toQueryString({
					'categoryId': this.state.categoryId,
					'priceSort': this.state.Sort,
					'index': 0,
				  })
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        console.log(result)
        if(result.code == 0){
          if(result.result.list.length != 0){
            result.result.list.forEach((info,i)=>{
              var IMG =  {uri: info.thumbImgUrl}
						  ImgArray.push(IMG)
              array.push(info);
            })
          }
          if(result.result.list.length <= 10){
             that.setState({
							   isReach:true,
							   isLoadMore:false,
                 index:result.result.index
						 })
          }
          if(result.result.list.length == 0){
						  that.setState({
							   dataSource: that.state.dataSource.cloneWithRows(['暂无数据']),
							   loaded: true,
							   sx:false,
							   isLoadMore:false,
							   isNull:true,
                 index:result.result.index
						   })
					 }else if(array.length > result.result.list.length){
						   that.setState({
							   isReach:true,
							   isLoadMore:false,
							   isNull:false,
                 index:result.result.index
						   })
					 }else{
						   that.setState({
							   ImgArray: ImgArray,
							   dataSource: that.state.dataSource.cloneWithRows(array),
							   loaded: true,
							   sx:false,
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

  Cancel(){
    arrays = [];
    ImgArrays = [];
    Keyboard.dismiss();
    this.refs.text.clear();
    this.timers && clearTimeout(this.timers);
    Animated.timing(
         this.state.fadeAnim,
         {
           toValue: 0,
           duration: 200,
         },
    ).start();
    this.timer = setTimeout(
		  () => {
        this.setState({
          IsShow:false,
          IsShowClose:false,
          dataSources: this.state.dataSources.cloneWithRows([]),
        });
        this.timer && clearTimeout(this.timer);
      },200)
  }
  search(){
    this.setState({
      IsShow:true,
    });
    this.timer && clearTimeout(this.timer);
    this.timers = setTimeout(
     () => {
      Animated.timing(
           this.state.fadeAnim,
           {
             toValue: 1,
             duration: 200,
           },
      ).start();
      this.timers && clearTimeout(this.timers);
   },0)
  }
  Close(){
    this.refs.text.clear();
    this.setState({
      IsShowClose:false,
      texts:''
    })
  }

  Trim(x) {
    return x.replace(/^\s+|\s+$/gm,'');
  }

  changs(text){

    if(this.Trim(text).length>0){
      this.setState({
        IsShowClose:true,
        texts:text
      })
    }else{
      this.setState({
        IsShowClose:false,
        texts:''
      })
    }
  }

  Submit(){
    this.setState({
      loadedk:true
    })
    Keyboard.dismiss();
    var that = this;
    fetch('https://yzx.shixiweiyuan.com/product/search', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: this.toQueryString({
					'word': this.state.texts,
					'index': 0,
				  })
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        console.log(result)
        if(result.code == 0){
          arrays = [];
          ImgArrays = [];
          if(result.result.list.length != 0){
            result.result.list.forEach((info,i)=>{
              var IMG =  {uri: info.thumbImgUrl}
						  ImgArrays.push(IMG)
              arrays.push(info);
            })
          }
          if(result.result.list.length <= 10){
             that.setState({
							   isReachs:true,
							   isLoadMores:false,
                 loadedk:false,
                 indexs:result.result.index
						 })
          }
          if(result.result.list.length == 0){
						  that.setState({
							   dataSources: that.state.dataSources.cloneWithRows(['暂无数据']),
							   sxs:false,
							   isLoadMores:false,
							   isNulls:true,
                 loadedk:false,
                 indexs:result.result.index
						   })
					 }else{
						   that.setState({
							   ImgArrays: ImgArrays,
							   dataSources: that.state.dataSources.cloneWithRows(arrays),
							   sxs:false,
                 isNulls:false,
                 loadedk:false,
                 indexs:result.result.index
						   })
           }
        }else{
          that.setState({
               sxs:true,
               isReachs:true,
               loadedk:false,
               dataSources: that.state.dataSources.cloneWithRows(['加载失败，请重新搜索']),
          })
          Toast.showShortCenter('您的系统繁忙')
        }
      })
      .catch((error) => {
        Toast.showShortCenter('您的系统繁忙')
        that.setState({
             sxs:true,
             isReachs:true,
             loadedk:false,
             dataSources: that.state.dataSources.cloneWithRows(['加载失败，请重新搜索']),
        })
      });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._pressButton);
	  this.timer && clearTimeout(this.timer);
    this.timers && clearTimeout(this.timers);
    this.timerx && clearTimeout(this.timerx);
    this.timera && clearTimeout(this.timera);
    this.getTime && clearTimeout(this.getTime);
    this.waitTime && clearTimeout(this.waitTime);
	}
  AllClass(){

    if(this.state.heights._value == 0){
      this.timerx && clearTimeout(this.timerx);
      this.setState({
        IsShowMask:true,
        isL:false,
        isR:true,
        Lcolor:'#036EB8',
        Rcolor:'#666'
      });
      this.timera = setTimeout(
  		  () => {
      Animated.parallel([
        Animated.timing(
             this.state.heights,
             {
               toValue: 400,
               duration: 300,
             },
        ),
        Animated.timing(
             this.state.opacitys,
             {
               toValue: 1,
               duration: 300,
             },
        ),
        Animated.timing(
             this.state.heightd,
             {
               toValue: 0,
               duration: 300,
             },
        )
      ]).start();
      this.timera && clearTimeout(this.timera);
      },0)
    }else{

      this.timera && clearTimeout(this.timera);
      this.timerx = setTimeout(
  		  () => {
          this.setState({
            IsShowMask:false,
            isL:true,
            isR:true,
            Lcolor:'#666',
            Rcolor:'#666'
          });
          this.timerx && clearTimeout(this.timerx);
        },300)
      Animated.parallel([
        Animated.timing(
             this.state.heights,
             {
               toValue: 0,
               duration: 300,
             },
        ),
        Animated.timing(
             this.state.opacitys,
             {
               toValue: 0,
               duration: 300,
             },
        )
      ]).start();
    }


  }
  CloseAllClass(){
    this.timera && clearTimeout(this.timera);
    this.timerx = setTimeout(
      () => {
        this.setState({
          IsShowMask:false,
          isL:true,
          isR:true,
          Lcolor:'#666',
          Rcolor:'#666'
        });
        this.timerx && clearTimeout(this.timerx);
      },300)
    Animated.parallel([
      Animated.timing(
           this.state.heights,
           {
             toValue: 0,
             duration: 300,
           },
      ),
      Animated.timing(
           this.state.heightd,
           {
             toValue: 0,
             duration: 300,
           },
      ),
      Animated.timing(
           this.state.opacitys,
           {
             toValue: 0,
             duration: 300,
           },
      )
    ]).start();

  }

  sort(){
    if(this.state.heightd._value == 0){
      this.timerx && clearTimeout(this.timerx);
      this.setState({
        IsShowMask:true,
        isL:true,
        isR:false,
        Rcolor:'#036EB8',
        Lcolor:'#666'
      });
      this.timera = setTimeout(
  		  () => {
      Animated.parallel([
        Animated.timing(
             this.state.heightd,
             {
               toValue: 150,
               duration: 300,
             },
        ),
        Animated.timing(
             this.state.opacitys,
             {
               toValue: 1,
               duration: 300,
             },
        ),
        Animated.timing(
             this.state.heights,
             {
               toValue: 0,
               duration: 300,
             },
        )
      ]).start();
      this.timera && clearTimeout(this.timera);
      },0)
    }else{
      this.timera && clearTimeout(this.timera);
      this.timerx = setTimeout(
  		  () => {
          this.setState({
            IsShowMask:false,
            isL:true,
            isR:true,
            Lcolor:'#666',
            Rcolor:'#666'
          });
          this.timerx && clearTimeout(this.timerx);
        },300)
      Animated.parallel([
        Animated.timing(
             this.state.heightd,
             {
               toValue: 0,
               duration: 300,
             },
        ),
        Animated.timing(
             this.state.opacitys,
             {
               toValue: 0,
               duration: 300,
             },
        )
      ]).start();
    }
  }

  _onRefresh(){
    this.setState({
      isRefreshing:true
    })
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

  pushPro(info){

    var that = this;
    fetch('https://yzx.shixiweiyuan.com/shoppingCart/add', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: this.toQueryString({
         'productId': info.id,
         'token':data.result,
         'num':info.stockStatus
        })
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
         console.log(result)
         if(result.code == 0){
          DeviceEventEmitter.emit('reloadShop','false');
          Toast.showShortCenter('加入购物车成功')
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


  renderMovie(data,sectionID: number, rowID: number) {
		if(this.state.sx){
			return(
			    <View style={{justifyContent:'center',alignItems:'center',height:Dimensions.get('window').height-130,}}>

				    <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:16,}}>{data}</Text>
				  </View>
			)
		}else if(this.state.isNull){
			return (
			    <View style={{justifyContent:'center',alignItems:'center',height:Dimensions.get('window').height-130,}}>

				    <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:16,}}>{data}</Text>
				  </View>
			)
		}else{
      if(data.stockStatus == 0){
         return (

               <View style={{flexDirection:'row',flex:1,}}>
                 <TouchableHighlight underlayColor="transparent" onPress={this.Godetail.bind(this,data)} style={{flexDirection:'row',flex:1,}}>
                     <View style={{flexDirection:'row',flex:1,paddingTop:10,paddingBottom:10,borderBottomWidth:1,borderColor:'#eee',}}>
                        <View style={{width:WID==320 ? 100 : 130,height:WID==320 ? 100 : 130,}}>
                            <Image style={{width:WID==320 ? 100 : 130,height:WID==320 ? 100 : 130}} source={{uri:data.thumbImgUrl}} />
                        </View>
                        <View style={{flexDirection:'column',justifyContent:'space-between',paddingLeft:10,paddingTop:5,paddingBottom:5,flex:1}}>
                          <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#333',fontSize:WID==320 ? 14 : 16}}>{data.title}</Text></View>
                          <View style={{flexDirection:'row',}}>
                            <View style={{flexDirection:'row',flex:1,}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#999',fontSize:WID==320 ? 12 : 14}}>规格：</Text><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#999',fontSize:WID==320 ? 12 : 14}}>{data.spec}</Text></View>
                            <View style={{flexDirection:'row',width:100,justifyContent:'center',}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#999',fontSize:WID==320 ? 12 : 14}}>等级：</Text><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#999',fontSize:WID==320 ? 12 : 14}}>{data.level}</Text></View>
                          </View>
                          {data.hasOwnProperty('price') ? <View style={{flexDirection:'row',alignItems:'center'}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#999',fontSize:WID==320 ? 12 : 14}}>参考价：</Text><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 14 : 16, color:'#FF4343'}}>{data.price}元/{data.unit}</Text></View> :
                          <View style={{flexDirection:'row',alignItems:'center'}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#999',fontSize:WID==320 ? 12 : 14}}>参考价：</Text><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 14 : 16, color:'#FF4343'}}>商议</Text></View>}
                        </View>
                      </View>
                  </TouchableHighlight>

               </View>

         )
      }else{
		  return (

              <View style={{flexDirection:'row',flex:1,}}>
                <TouchableHighlight underlayColor="transparent" onPress={this.Godetail.bind(this,data)} style={{flexDirection:'row',flex:1,}}>
                    <View style={{flexDirection:'row',flex:1,paddingTop:10,paddingBottom:10,borderBottomWidth:1,borderColor:'#eee',}}>
                       <View style={{width:WID==320 ? 100 : 130,height:WID==320 ? 100 : 130,}}>
                           <Image style={{width:WID==320 ? 100 : 130,height:WID==320 ? 100 : 130}} source={{uri:data.thumbImgUrl}} />
                       </View>
                       <View style={{flexDirection:'column',justifyContent:'space-between',paddingLeft:10,paddingTop:5,paddingBottom:5,flex:1}}>
                         <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#333',fontSize:WID==320 ? 14 : 16}}>{data.title}</Text></View>
                         <View style={{flexDirection:'row',}}>
                           <View style={{flexDirection:'row',flex:1,}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#999',fontSize:WID==320 ? 12 : 14}}>规格：</Text><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#999',fontSize:WID==320 ? 12 : 14}}>{data.spec}</Text></View>
                           <View style={{flexDirection:'row',width:100,justifyContent:'center',}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#999',fontSize:WID==320 ? 12 : 14}}>等级：</Text><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#999',fontSize:WID==320 ? 12 : 14}}>{data.level}</Text></View>
                         </View>
                         {data.hasOwnProperty('price') ? <View style={{flexDirection:'row',alignItems:'center'}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#999',fontSize:WID==320 ? 12 : 14}}>参考价：</Text><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 14 : 16, color:'#FF4343'}}>{data.price}元/{data.unit}</Text></View> :
                         <View style={{flexDirection:'row',alignItems:'center'}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#999',fontSize:WID==320 ? 12 : 14}}>参考价：</Text><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 14 : 16, color:'#FF4343'}}>商议</Text></View>}
                       </View>
                     </View>
                 </TouchableHighlight>

              </View>

  			)
      }
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

  _onRefresh(ins) {
		 this.setState({
			   isRefreshing:ins,
			   isReach:false,
			   isLoadMore:false,
		  })
		  var that=this
      fetch('https://yzx.shixiweiyuan.com/product/products', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: this.toQueryString({
  					'categoryId': this.state.categoryId,
  					'priceSort': this.state.Sort,
  					'index': 0,
  				})
        })
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {
          console.log(result)
          array=[];
          array.length = 0;
          ImgArray=[];
          ImgArray.length=0;
          if(result.code == 0){
            if(result.result.list.length != 0){
              result.result.list.forEach((info,i)=>{
                var IMG =  {uri: info.thumbImgUrl}
  						  ImgArray.push(IMG)
                array.push(info);
              })
            }
            if(result.result.list.length <= 10){
               that.setState({
  							   isReach:true,
  							   isLoadMore:false,
                   isRefreshing:false,
                   index:result.result.index
  						 })
            }
            if(result.result.list.length == 0){
  						  that.setState({
  							   dataSource: that.state.dataSource.cloneWithRows(['暂无数据']),
  							   loaded: true,
                   loadeds:false,
  							   sx:false,
  							   isLoadMore:false,
  							   isNull:true,
                   isRefreshing:false,
                   index:result.result.index
  						   })
  					 }else if(array.length > result.result.list.length){
  						   that.setState({
  							   isReach:true,
  							   isLoadMore:false,
  							   isNull:false,
                   index:result.result.index
  						   })
  					 }else{
  						   that.setState({
  							   ImgArray: ImgArray,
  							   dataSource: that.state.dataSource.cloneWithRows(array),
  							   loaded: true,
  							   sx:false,
                   isNull:false,
                   loadeds:false,
                   isRefreshing:false,
                   index:result.result.index
  						   })
             }
          }else{
            that.setState({
                 loaded: true,
                 sx:true,
                 isReach:true,
                 loadeds:false,
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
               loadeds:false,
               isRefreshing:false,
               dataSource: that.state.dataSource.cloneWithRows(['加载失败，请下拉刷新']),
          })
        });
  }

  _onEndReach() {
		  if(!this.state.isReach){
  			  this.setState({
  				  isLoadMore:true,
  			  })

          var that=this
          fetch('https://yzx.shixiweiyuan.com/product/products', {
              method: 'POST',
              headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: this.toQueryString({
               'categoryId': this.state.categoryId,
               'priceSort': this.state.Sort,
               'index': this.state.index,
             })
            })
            .then(function (response) {
              return response.json();
            })
            .then(function (result) {
              console.log(result)

              if(result.code == 0){
                if(result.result.list.length != 0){
                  result.result.list.forEach((info,i)=>{
                    var IMG =  {uri: info.thumbImgUrl}
                    ImgArray.push(IMG)
                    array.push(info);
                  })
                }
                if(result.result.list.length <= 10){
                   that.setState({
                      isReach:true,
                      isLoadMore:false,
                      index:result.result.index
                  })
                }
                if(result.result.list.length == 0){
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
                      ImgArray: ImgArray,
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

  default(){
    this.timera && clearTimeout(this.timera);
    this.timerx = setTimeout(
      () => {
        this.setState({
          IsShowMask:false,
          isL:true,
          isR:true,
          Lcolor:'#666',
          Rcolor:'#666'
        });
        this.timerx && clearTimeout(this.timerx);
      },300)
    Animated.parallel([
      Animated.timing(
           this.state.heightd,
           {
             toValue: 0,
             duration: 300,
           },
      ),
      Animated.timing(
           this.state.opacitys,
           {
             toValue: 0,
             duration: 300,
           },
      )
    ]).start();

    if(!this.state.default){
      this.setState({
        default:true,
        positive:false,
        Reverse:false,
        isRefreshing:false,
        Sort:''
      });
      this.waitTime = setTimeout(() => {
        this.setState({
          loadeds:true,
        })
        this._onRefresh(false);
        clearTimeout(this.waitTime);
      },0)
    }
  }

  positive(){
    this.timera && clearTimeout(this.timera);
    this.timerx = setTimeout(
      () => {
        this.setState({
          IsShowMask:false,
          isL:true,
          isR:true,
          Lcolor:'#666',
          Rcolor:'#666'
        });
        this.timerx && clearTimeout(this.timerx);
      },300)
    Animated.parallel([
      Animated.timing(
           this.state.heightd,
           {
             toValue: 0,
             duration: 300,
           },
      ),
      Animated.timing(
           this.state.opacitys,
           {
             toValue: 0,
             duration: 300,
           },
      )
    ]).start();

    if(!this.state.positive){
      this.setState({
        default:false,
        positive:true,
        Reverse:false,
        isRefreshing:false,
        Sort:2
      });
      this.waitTime = setTimeout(() => {
        this.setState({
          loadeds:true,
        })
        this._onRefresh(false);
        clearTimeout(this.waitTime);
      },0)
    }
  }

  Reverse(){
    this.timera && clearTimeout(this.timera);
    this.timerx = setTimeout(
      () => {
        this.setState({
          IsShowMask:false,
          isL:true,
          isR:true,
          Lcolor:'#666',
          Rcolor:'#666'
        });
        this.timerx && clearTimeout(this.timerx);
      },300)
    Animated.parallel([
      Animated.timing(
           this.state.heightd,
           {
             toValue: 0,
             duration: 300,
           },
      ),
      Animated.timing(
           this.state.opacitys,
           {
             toValue: 0,
             duration: 300,
           },
      )
    ]).start();

    if(!this.state.Reverse){
      this.setState({
        default:false,
        positive:false,
        Reverse:true,
        isRefreshing:false,
        Sort:1
      });
      this.waitTime = setTimeout(() => {
        this.setState({
          loadeds:true,
        })
        this._onRefresh(false);
        clearTimeout(this.waitTime);
      },0)
    }
  }





  _onEndReachs() {
		  if(!this.state.isReachs){
  			  this.setState({
  				  isLoadMores:true,
  			  })

          var that=this
          fetch('https://yzx.shixiweiyuan.com/product/search', {
              method: 'POST',
              headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: this.toQueryString({
               'word': this.state.texts,
               'index': this.state.indexs,
             })
            })
            .then(function (response) {
              return response.json();
            })
            .then(function (result) {
              console.log(result)

              if(result.code == 0){
                if(result.result.list.length != 0){
                  result.result.list.forEach((info,i)=>{
                    var IMG =  {uri: info.thumbImgUrl}
                    ImgArrays.push(IMG)
                    arrays.push(info);
                  })
                }
                if(result.result.list.length <= 10){
                   that.setState({
                      isReachs:true,
                      isLoadMores:false,
                      indexs:result.result.index
                  })
                }
                if(result.result.list.length == 0){
                   that.setState({
                      sxs:false,
                      isLoadMores:false,
                      isReachs:true,
                      isNulls:false,
                      indexs:result.result.index
                    })
                }else{
                    that.setState({
                      ImgArrays: ImgArrays,
                      dataSources: that.state.dataSources.cloneWithRows(arrays),
                      sxs:false,
                      indexs:result.result.index,
                      isNulls:false,
                    })
                 }
              }else{
                that.setState({
                     sxs:true,
                     isReachs:true,
                     dataSources: that.state.dataSources.cloneWithRows(['加载失败，请重新搜索']),
                })
                Toast.showShortCenter('您的系统繁忙')
              }
            })
            .catch((error) => {
              Toast.showShortCenter('您的系统繁忙')
              that.setState({
                   sxs:true,
                   isReachs:true,
                   dataSources: that.state.dataSources.cloneWithRows(['加载失败，请重新搜索']),
              })
            });

		  }
	}

  getSub(data,j){
    array_color=[];

    array_color.length=0;
    this.state.Categorys.forEach((info,i)=>{
      array_color.push('#fff');
      colors=array_color
      colors[j]="#F0F0F0"
      if(info.id == data.id){
        this.setState({
          RightData:info.lowers,
          color:colors,
          allColor:'#fff',
          ids:data.id
        })
      }
    })
  }
  getSubs(){
    this.setState({
      RightData:this.state.dataCategorys,
      color:array_color1,
      allColor:'#F0F0F0',
      ids:''
    })
  }

  click(data){
    this.timera && clearTimeout(this.timera);
    this.timerx = setTimeout(
      () => {
        this.setState({
          IsShowMask:false,
          isL:true,
          isR:true,
          Lcolor:'#666',
          Rcolor:'#666'
        });
        this.timerx && clearTimeout(this.timerx);
      },300)
    Animated.parallel([
      Animated.timing(
           this.state.heights,
           {
             toValue: 0,
             duration: 300,
           },
      ),
      Animated.timing(
           this.state.opacitys,
           {
             toValue: 0,
             duration: 300,
           },
      )
    ]).start();
    this.setState({
      categoryId:data.id,
    })

    this.waitTime = setTimeout(() => {
      this.setState({
        loadeds:true,
      })
      this._onRefresh(false);
      clearTimeout(this.waitTime);
    },0)
  }

  click1(){
    this.timera && clearTimeout(this.timera);
    this.timerx = setTimeout(
      () => {
        this.setState({
          IsShowMask:false,
          isL:true,
          isR:true,
          Lcolor:'#666',
          Rcolor:'#666'
        });
        this.timerx && clearTimeout(this.timerx);
      },300)
    Animated.parallel([
      Animated.timing(
           this.state.heights,
           {
             toValue: 0,
             duration: 300,
           },
      ),
      Animated.timing(
           this.state.opacitys,
           {
             toValue: 0,
             duration: 300,
           },
      )
    ]).start();
    this.setState({
      categoryId:this.state.ids,

    })

    this.waitTime = setTimeout(() => {
      this.setState({
        loadeds:true,
      })
      this._onRefresh(false);
      clearTimeout(this.waitTime);
    },0)
  }


  render() {

    return (
      <View style={Styles.container}>
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
                <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:WID==320 ? 16 : 18}}>供应大厅</Text>
            </View>
            <View style={{flex:1,justifyContent:'center',alignItems:'flex-end',}}>
                <TouchableOpacity onPress={this.search.bind(this)} style={{height:40,width:40,justifyContent:'center',alignItems:'center',marginRight:5}}>
                    <View style={{height:30,width:30,justifyContent:'center',alignItems:'center',}}>
                      <Ionicons name="ios-search" color="#fff" size={WID==320 ? 20 : 24}  />
                    </View>
                </TouchableOpacity>
            </View>
          </View>
          <Netinfo  {...this.props}/>
          <View style={{flex:1,flexDirection:'column'}}>
            <View style={{flexDirection:'row',height:50,justifyContent:'center',alignItems:'center',borderBottomWidth:1,borderColor:'#eee'}}>
                <TouchableHighlight underlayColor="transparent" onPress={this.AllClass.bind(this)} underlayColor="transparent" style={{flex:1,height:50}}>
                    <View style={{flex:1,alignItems:'center',justifyContent:'center',height:50,flexDirection:'row'}}>
                       <View style={{paddingRight:5}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:this.state.Lcolor,fontSize:14}}>全部分类</Text></View>
                       {this.state.isL ? <Ionicons name="md-arrow-dropdown" color="#666" size={16}  /> : <Ionicons name="md-arrow-dropup" color="#036EB8" size={16}  />}
                    </View>
                </TouchableHighlight>

                <TouchableHighlight underlayColor="transparent" onPress={this.sort.bind(this)} style={{flex:1,height:50}}>
                    <View style={{flex:1,alignItems:'center',justifyContent:'center',height:50,flexDirection:'row'}}>
                       <View style={{paddingRight:5}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:this.state.Rcolor,fontSize:14}}>价格排序</Text></View>
                       {this.state.isR ? <Ionicons name="md-arrow-dropdown" color="#666" size={16}  /> : <Ionicons name="md-arrow-dropup" color="#036EB8" size={16}  />}
                    </View>
                </TouchableHighlight>
            </View>
            <View style={{flex:1}}>
            <ListView
              dataSource={this.state.dataSource}
              renderRow={this.renderMovie.bind(this)}
              onEndReached={this._onEndReach.bind(this) }
              onEndReachedThreshold={2}
              renderFooter={this._renderFooter.bind(this)}
              refreshControl={
                      <RefreshControl
                        refreshing={this.state.isRefreshing}
                        onRefresh={this._onRefresh.bind(this,true) }
                        colors={['#036EB8', '#00ff00', '#0000ff','#036EB8']}
                        progressBackgroundColor="#ffffff"
                        />
                    }
              />
            </View>

            <Animated.View style={{opacity:this.state.opacitys,position:'absolute',top:50,left:0,width:Dimensions.get('window').width,backgroundColor:'rgba(119, 116, 116, 0.63)'}}>
               {this.state.IsShowMask ? <TouchableOpacity onPress={this.CloseAllClass.bind(this)} style={{width:Dimensions.get('window').width,height:Dimensions.get('window').height-100}}></TouchableOpacity> : null}
            </Animated.View>
            <Animated.View style={{position:'absolute',top:50,left:0,width:Dimensions.get('window').width,height:this.state.heightd,backgroundColor:'#fff',overflow:'hidden'}}>
                <View style={{height:150,width:Dimensions.get('window').width,}}>
                    <TouchableHighlight underlayColor="transparent" onPress={this.default.bind(this)}>
                        <View style={{height:50,justifyContent:'center',paddingLeft:15,borderBottomWidth:1,borderColor:'#eee',flexDirection:'row',alignItems:'center'}}>
                           <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#000',fontSize:14}}>默认排序</Text></View>
                           {this.state.default ? <View style={{paddingRight:15}}><Ionicons name="ios-checkmark-outline" color="#000" size={30}  /></View> : null}
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor="transparent" onPress={this.positive.bind(this)}>
                        <View style={{height:50,justifyContent:'center',paddingLeft:15,borderBottomWidth:1,borderColor:'#eee',flexDirection:'row',alignItems:'center'}}>
                           <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#000',fontSize:14}}>价格从高到底</Text></View>
                           {this.state.positive ? <View style={{paddingRight:15}}><Ionicons name="ios-checkmark-outline" color="#000" size={30}  /></View> : null}
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor="transparent" onPress={this.Reverse.bind(this)}>
                        <View style={{height:50,justifyContent:'center',paddingLeft:15,borderBottomWidth:1,borderColor:'#eee',flexDirection:'row',alignItems:'center'}}>
                           <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#000',fontSize:14}}>价格从低到高</Text></View>
                           {this.state.Reverse ? <View style={{paddingRight:15}}><Ionicons name="ios-checkmark-outline" color="#000" size={30}  /></View> : null}
                        </View>
                    </TouchableHighlight>
                </View>
            </Animated.View>
            <Animated.View style={{position:'absolute',top:50,left:0,width:Dimensions.get('window').width,height:this.state.heights,backgroundColor:'#fff',overflow:'hidden'}}>
                {this.state.Categorys.length > 0 ? <View style={{width:Dimensions.get('window').width,height:400,flexDirection:'row'}}>
                    <View style={{width:100,height:400,overflow:'hidden'}}>
                        <ScrollView showsVerticalScrollIndicator={false} style={{width:100,height:400,overflow:'hidden'}}>
                          <TouchableHighlight underlayColor="transparent" onPress={this.getSubs.bind(this,data)}>
                            <View style={{width:100,justifyContent:'center',alignItems:'center',height:50,borderBottomWidth:1,borderColor:'#eee',backgroundColor:this.state.allColor}}>
                                <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#000',fontSize:14}}>全部分类</Text>
                            </View>
                          </TouchableHighlight>
                          {this.state.Categorys.map((data,i)=>{
                             return <TouchableHighlight underlayColor="transparent" key={i} onPress={this.getSub.bind(this,data,i)}>
                                       <View style={{width:100,justifyContent:'center',alignItems:'center',height:50,borderBottomWidth:1,borderColor:'#eee',backgroundColor:this.state.color[i]}}>
                                           <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#000',fontSize:14}}>{data.name}</Text>
                                       </View>
                                    </TouchableHighlight>
                          })}
                        </ScrollView>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} style={{flex:1,height:400,backgroundColor:'#F0F0F0'}}>
                      <TouchableHighlight underlayColor="transparent" onPress={this.click1.bind(this,data)}><View style={{flex:1,height:35,borderWidth:1,borderColor:'#ccc',borderRadius:3,marginRight:10,marginLeft:10,marginTop:10,justifyContent:'center',alignItems:'center',backgroundColor:'#fff'}}>
                         <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#666',fontSize:14}}>全部</Text>
                      </View></TouchableHighlight>
                      <View style={{padding:10,flexDirection:'row',flexWrap:'wrap',}}>
                         {this.state.RightData.map((data,i)=>{
                           return <TouchableHighlight underlayColor="transparent" onPress={this.click.bind(this,data)}><View key={i} style={{width:(Dimensions.get('window').width-126)/3,height:40,borderWidth:1,borderColor:'#ccc',borderRadius:3,marginBottom:10,marginRight:2,backgroundColor:'#fff',justifyContent:'center',alignItems:'center'}}>
                                     <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#666',fontSize:12}}>{data.name}</Text>
                                  </View></TouchableHighlight>
                         })}
                      </View>
                    </ScrollView>
                </View> : <View style={{justifyContent: 'center',alignItems: 'center',width:Dimensions.get('window').width,height:400,}}>
         					<View>

         						<Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#777'}}>暂无数据</Text>
         					</View>
       				 </View>}
            </Animated.View>
          </View>

          {this.state.IsShow ? <Animated.View style={{opacity: this.state.fadeAnim,position:'absolute',top:0,left:0,width:Dimensions.get('window').width,height:Dimensions.get('window').height,backgroundColor:'#fff'}}>
            <View style={Styles.card}>
              <View style={{flex:1,backgroundColor:'rgba(255, 255, 255, 1)',borderRadius:15,flexDirection:'row',marginLeft:10}}>
                    <View style={{height:30,width:30,justifyContent:'center',alignItems:'center',marginLeft:10}}>
                      <Ionicons name="ios-search" color="#999" size={20}  />
                    </View>
                    <TextInput
                      ref='text'
                      multiline={false}
                      returnKeyLabel='搜索'
                      returnKeyType='search'
                      onSubmitEditing={this.Submit.bind(this)}
                      underlineColorAndroid="transparent"
                      onChangeText={(texts) => this.changs.bind(this,texts)()}
                      placeholderTextColor={'#999'}
                      style={{height: 30,flex:1,color:'#999',  borderWidth: 1,padding: 0,borderColor:"transparent",fontSize:14}}
                      placeholder='搜索你想要的货品'
                    />
                    {this.state.IsShowClose ? <TouchableOpacity onPress={this.Close.bind(this)} activeOpacity={1} style={{height:30,width:40,justifyContent:'center',alignItems:'center',}}>
                      <View style={{height:30,width:40,justifyContent:'center',alignItems:'center',marginLeft:10}}>
                        <Ionicons name="md-close-circle" color="#ccc" size={20}  />
                      </View>
                    </TouchableOpacity> : null}
               </View>
               <TouchableOpacity onPress={this.Cancel.bind(this)} style={{width:50,justifyContent:'center',alignItems:'center'}}>
                 <View style={{width:50,justifyContent:'center',alignItems:'center'}}>
                     <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:16,color:'#fff'}}>取消</Text>
                 </View>
               </TouchableOpacity>
            </View>
            <View style={{flex:1}}>
                <ListView
                  keyboardDismissMode={'on-drag'}
                  dataSource={this.state.dataSources}
                  renderRow={this.renderMovies.bind(this)}
                  onEndReached={this._onEndReachs.bind(this) }
                  onEndReachedThreshold={2}
                  renderFooter={this._renderFooters.bind(this)}
                  />
            </View>
            {this.state.loadedk ? <View style={{justifyContent: 'center',alignItems: 'center',width:Dimensions.get('window').width,height:Dimensions.get('window').height-75,position:'absolute',top:75,left:0,}}>
              <View style={styles.loading}>
                <ActivityIndicator color="white"/>
                <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={styles.loadingTitle}>加载中……</Text>
              </View>
           </View> : null}
          </Animated.View> : null}
          {!this.state.loaded ? <View style={{justifyContent: 'center',alignItems: 'center',width:Dimensions.get('window').width,height:Dimensions.get('window').height-75,position:'absolute',top:75,left:0,backgroundColor:'#fff'}}>
   					<View style={styles.loading}>
   						<ActivityIndicator color="white"/>
   						<Text allowFontScaling={false} adjustsFontSizeToFit={false} style={styles.loadingTitle}>加载中……</Text>
   					</View>
 				 </View> : null}
         {this.state.loadeds ? <View style={{justifyContent: 'center',alignItems: 'center',width:Dimensions.get('window').width,height:Dimensions.get('window').height-75,position:'absolute',top:75,left:0,}}>
           <View style={styles.loading}>
             <ActivityIndicator color="white"/>
             <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={styles.loadingTitle}>加载中……</Text>
           </View>
        </View> : null}
      </View>
    );
  }


  renderMovies(data,sectionID: number, rowID: number) {

    if(this.state.sxs){

      return(
          <View style={{justifyContent:'center',alignItems:'center',height:Dimensions.get('window').height-170,}}>

            <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#777'}}>{data}</Text>
          </View>
      )
    }else if(this.state.isNulls){

      return (
          <View style={{justifyContent:'center',alignItems:'center',height:Dimensions.get('window').height-170,}}>

            <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#777'}}>{data}</Text>
          </View>
      )
    }else{

      if(data.stockStatus == 0){
         return (

               <View style={{flexDirection:'row',flex:1,}}>
                 <TouchableHighlight underlayColor="transparent" onPress={this.Godetail.bind(this,data)} style={{flexDirection:'row',flex:1,}}>
                     <View style={{flexDirection:'row',flex:1,paddingTop:10,paddingBottom:10,borderBottomWidth:1,borderColor:'#eee',}}>
                        <View style={{width:WID==320 ? 100 : 130,height:WID==320 ? 100 : 130,}}>
                            <Image style={{width:WID==320 ? 100 : 130,height:WID==320 ? 100 : 130}} source={{uri:data.thumbImgUrl}} />
                        </View>
                        <View style={{flexDirection:'column',justifyContent:'space-between',paddingLeft:10,paddingTop:5,paddingBottom:5,flex:1}}>
                          <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#333',fontSize:WID==320 ? 14 : 16}}>{data.title}</Text></View>
                          <View style={{flexDirection:'row',}}>
                            <View style={{flexDirection:'row',flex:1,}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#999',fontSize:WID==320 ? 12 : 14}}>规格：</Text><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#999',fontSize:WID==320 ? 12 : 14}}>{data.spec}</Text></View>
                            <View style={{flexDirection:'row',width:100,justifyContent:'center',}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#999',fontSize:WID==320 ? 12 : 14}}>等级：</Text><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#999',fontSize:WID==320 ? 12 : 14}}>{data.level}</Text></View>
                          </View>
                          {data.hasOwnProperty('price') ? <View style={{flexDirection:'row',alignItems:'center'}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#999',fontSize:WID==320 ? 12 : 14}}>参考价：</Text><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 14 : 16, color:'#FF4343'}}>{data.price}元/{data.unit}</Text></View> :
                          <View style={{flexDirection:'row',alignItems:'center'}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#999',fontSize:WID==320 ? 12 : 14}}>参考价：</Text><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 14 : 16, color:'#FF4343'}}>商议</Text></View>}
                        </View>
                      </View>
                  </TouchableHighlight>

               </View>

         )
      }else{
		  return (

              <View style={{flexDirection:'row',flex:1,}}>
                <TouchableHighlight underlayColor="transparent" onPress={this.Godetail.bind(this,data)} style={{flexDirection:'row',flex:1,}}>
                    <View style={{flexDirection:'row',flex:1,paddingTop:10,paddingBottom:10,borderBottomWidth:1,borderColor:'#eee',}}>
                       <View style={{width:WID==320 ? 100 : 130,height:WID==320 ? 100 : 130,}}>
                           <Image style={{width:WID==320 ? 100 : 130,height:WID==320 ? 100 : 130}} source={{uri:data.thumbImgUrl}} />
                       </View>
                       <View style={{flexDirection:'column',justifyContent:'space-between',paddingLeft:10,paddingTop:5,paddingBottom:5,flex:1}}>
                         <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#333',fontSize:WID==320 ? 14 : 16}}>{data.title}</Text></View>
                         <View style={{flexDirection:'row',}}>
                           <View style={{flexDirection:'row',flex:1,}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#999',fontSize:WID==320 ? 12 : 14}}>规格：</Text><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#999',fontSize:WID==320 ? 12 : 14}}>{data.spec}</Text></View>
                           <View style={{flexDirection:'row',width:100,justifyContent:'center',}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#999',fontSize:WID==320 ? 12 : 14}}>等级：</Text><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#999',fontSize:WID==320 ? 12 : 14}}>{data.level}</Text></View>
                         </View>
                         {data.hasOwnProperty('price') ? <View style={{flexDirection:'row',alignItems:'center'}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#999',fontSize:WID==320 ? 12 : 14}}>参考价：</Text><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 14 : 16, color:'#FF4343'}}>{data.price}元/{data.unit}</Text></View> :
                         <View style={{flexDirection:'row',alignItems:'center'}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#999',fontSize:WID==320 ? 12 : 14}}>参考价：</Text><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 14 : 16, color:'#FF4343'}}>商议</Text></View>}
                       </View>
                     </View>
                 </TouchableHighlight>

              </View>

  			)
      }
    }
  }

  _renderFooters() {
     if(this.state.isLoadMores){
       return (
        <View style={styles.footer}>
          <ActivityIndicator color="#4385f4"/>
          <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={styles.footerTitle}>正在加载更多……</Text>
        </View>
      )
     }
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
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
    },

    footerTitle: {
        marginLeft: 10,
        fontSize: 15,
        color: 'gray'
    },
});
