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
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  DeviceEventEmitter
} from 'react-native';
import Styles from '../Style';
import Netinfo from '../NetInfo';
import moment from 'moment';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import orderList from '../My/Order/orderList';
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
    fetch('https://yzx.shixiweiyuan.com/app/pushMsg/showList', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: this.toQueryString({
        'token': data.result,
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
          that.setState({
               loaded: true,
               sx:true,
               isReach:true,
               isRefreshing:false,
               dataSource: that.state.dataSource.cloneWithRows(['加载失败，请下拉刷新']),
          })
          ToastAndroid.showWithGravity(result.message, ToastAndroid.LONG,ToastAndroid.CENTER)
        }
      })
      .catch((error) => {
        ToastAndroid.showWithGravity('您的系统繁忙', ToastAndroid.LONG,ToastAndroid.CENTER)
        that.setState({
             loaded: true,
             sx:true,
             isReach:true,
             isRefreshing:false,
             dataSource: that.state.dataSource.cloneWithRows(['加载失败，请下拉刷新']),
        })
      });
  }

  order(num){
    var that = this;
    var { navigator } = this.props;
     if(navigator) {
         navigator.push({
             name: 'orderList',
             component: orderList,
             params:{
               num:num
             }
         })
     }
  }

  getTimes(time){
    var str = ''
    var date = (new Date());
    var isBetween = moment(moment(time).format("YYYY-MM-DD HH:mm:ss")).isBetween(moment(moment(new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()).subtract(1, 'days')).format("YYYY-MM-DD HH:mm:ss"), moment(new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()).format("YYYY-MM-DD HH:mm:ss"));
    var isToday = moment(moment(time).format("YYYY-MM-DD HH:mm:ss")).isBetween(moment(new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()).format("YYYY-MM-DD HH:mm:ss"), moment(new Date()).format("YYYY-MM-DD HH:mm:ss"));
    if(isBetween){
      str = '昨天';
      return str;
    }else if(isToday){
      str = moment(time).format("HH:mm");
      return str;
    }else{
      str = moment(time).format("MM-DD HH:mm");
      return str;
    }
  }

  renderMovie(data) {
		if(this.state.sx){
			return(
			    <View style={{justifyContent:'center',alignItems:'center',height:Dimensions.get('window').height-((DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 75 : 65),width:Dimensions.get('window').width,backgroundColor:'#fff'}}>

				    <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 14 : 16,}}>{data}</Text>
				  </View>
			)
		}else if(this.state.isNull){
			return (
			    <View style={{justifyContent:'center',alignItems:'center',height:Dimensions.get('window').height-((DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 75 : 65),width:Dimensions.get('window').width,backgroundColor:'#fff'}}>

				    <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 14 : 16,}}>{data}</Text>
				  </View>
			)
		}else{

		  return (
           <View style={{width:Dimensions.get('window').width-30,marginBottom:15,marginLeft:15,marginRight:15,paddingTop:0,marginTop:15}}>
              <View style={{justifyContent:'center',alignItems:'center',marginBottom:10}}>
                 <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 12 : 14,color:'#777'}}>{this.getTimes(data.createTime)}</Text>
              </View>
              <TouchableHighlight underlayColor='#333' style={{flex:1,backgroundColor:'#fff',borderRadius:5}} onPress={this.order.bind(this,data.orderNumber)}>
                <View style={{flex:1,backgroundColor:'#fff',padding:15,borderRadius:5}}>
                   <View>
                      <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 14 : 16,color:'#333'}}>{data.title}</Text>
                   </View>
                   <View style={{flexDirection:'row',marginTop:10,justifyContent:'space-between'}}>
                      <View style={{flex:1,justifyContent:'space-between',marginRight:5}}>
                        <View>
                          <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 12 : 14,lineHeight:18,color:'#777'}} numberOfLines={2}>{data.content}</Text>
                        </View>
                        <View>
                          <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 12 : 14,}} numberOfLines={1}>订单号：{data.orderNumber}</Text>
                        </View>
                      </View>
                      <View style={{width:80,height:80,borderRadius:5,overflow:'hidden'}}>
                        <Image style={{ width: 80,height:80,borderRadius:5,}} source={{uri:data.thumbImgUrl}} />
                      </View>
                   </View>
                </View>
              </TouchableHighlight>
           </View>
  			)

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
        fetch('https://yzx.shixiweiyuan.com/app/pushMsg/showList', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: this.toQueryString({
             'token': data.result,
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
                   isRefreshing:false,
                   dataSource: that.state.dataSource.cloneWithRows(['加载失败，请下拉刷新']),
              })
              ToastAndroid.showWithGravity('您的系统繁忙', ToastAndroid.LONG,ToastAndroid.CENTER)
            }
          })
          .catch((error) => {
            ToastAndroid.showWithGravity('您的系统繁忙', ToastAndroid.LONG,ToastAndroid.CENTER)
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
                          <Text style={{color:'white',fontSize:18}} allowFontScaling={false} adjustsFontSizeToFit={false}>交易消息</Text>
                    </View>
                 </View>
                 <View style={{flex:1,justifyContent:'center'}}>

                 </View>
          </View>
          <Netinfo  {...this.props}/>
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
          {!this.state.loaded ? <View style={{justifyContent: 'center',alignItems: 'center',width:Dimensions.get('window').width,height:Dimensions.get('window').height-((DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 75 : 65),position:'absolute',top:((DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 75 : 65),left:0,backgroundColor:'#fff'}}>
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
