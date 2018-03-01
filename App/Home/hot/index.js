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
  ActivityIndicator,
  Keyboard,
  RefreshControl,
  Image,
  Animated
} from 'react-native';
import Styles from '../../Style';
import Netinfo from '../../NetInfo';
import Toast from '@remobile/react-native-toast';
import DeviceInfo from 'react-native-device-info';
import Prodetail from '../SupplyHall/Prodetails';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
var array = [];
var ImgArray = [];
const WID = Dimensions.get('window').width;
export default class MyComponent extends Component {
  constructor() {
    super();
    this._pressButton = this._pressButton.bind(this);
    BackHandler.addEventListener('hardwareBackPress', this._pressButton);
    this.state={
      dataSource: new ListView.DataSource({
			  rowHasChanged: (row5, row6) => row5 !== row6,
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

  componentDidMount(){
    array = [];
    ImgArray = [];
    this.getTime = setTimeout(() => {
       this.getData();
    },800);

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


  getData(){
    var that = this;
    fetch('https://yzx.shixiweiyuan.com/product/hot', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: this.toQueryString({
					'index': 0
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
              console.log(array)
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

  renderMovie(data,sectionID: number, rowID: number) {
		if(this.state.sx){
			return(
			    <View style={{justifyContent:'center',alignItems:'center',height:Dimensions.get('window').height-120,width:Dimensions.get('window').width,}}>

				    <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:16,}}>{data}</Text>
				  </View>
			)
		}else if(this.state.isNull){
			return (
			    <View style={{justifyContent:'center',alignItems:'center',height:Dimensions.get('window').height-120,width:Dimensions.get('window').width,}}>

				    <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:16,}}>{data}</Text>
				  </View>
			)
		}else{

		  return (
        <TouchableOpacity activeOpacity={1}  onPress={this.Godetail.bind(this,data)} style={{width:Dimensions.get('window').width/2-2,}}>
                <View style={{width:Dimensions.get('window').width/2-2,justifyContent:'space-between',alignItems:'center',marginRight:2,marginBottom:4,flexDirection:'column',backgroundColor:'#fff'}}>
                    <Image style={{width:Dimensions.get('window').width/2-2, height: Dimensions.get('window').width/2-2,}} source={{uri:data.recommendImgUrl}} />
                    <View style={{flex:1,justifyContent:'space-between',height:80,alignItems:'flex-start',overflow:'hidden'}}>
                      <View style={{width:Dimensions.get('window').width/2-2,justifyContent:'flex-start',alignItems:'flex-start',paddingLeft:5,paddingTop:5}}>
                          <Text style={{fontSize:WID==320 ? 12 : 14, color:'#222222',lineHeight:WID==320 ? 18 : 22}} numberOfLines={2}  allowFontScaling={false} adjustsFontSizeToFit={false}>{data.title}</Text>
                      </View>
                      {data.hasOwnProperty('price') ? <View style={{width:Dimensions.get('window').width/2-2,justifyContent:'flex-start',alignItems:'center',padding:5,paddingTop:0,flexDirection:'row'}}>
                          <Text style={{fontSize:WID==320 ? 12 : 14, color:'#999999'}}  allowFontScaling={false} adjustsFontSizeToFit={false}>参考价：</Text>
                          <Text style={{fontSize:WID==320 ? 14 : 16, color:'#FF4343'}}  allowFontScaling={false} adjustsFontSizeToFit={false}>{data.price}</Text>
                          <Text style={{fontSize:WID==320 ? 12 : 14, color:'#FF4343'}}  allowFontScaling={false} adjustsFontSizeToFit={false}>元/{data.unit}</Text>
                      </View> : <View style={{width:Dimensions.get('window').width/2-2,justifyContent:'flex-start',alignItems:'center',padding:5,paddingTop:0,flexDirection:'row'}}>
                          <Text style={{fontSize:WID==320 ? 12 : 14, color:'#999999'}}  allowFontScaling={false} adjustsFontSizeToFit={false}>参考价：</Text>
                          <Text style={{fontSize:WID==320 ? 14 : 16, color:'#FF4343'}}  allowFontScaling={false} adjustsFontSizeToFit={false}>商议</Text>
                      </View>}
                    </View>
                 </View>
          </TouchableOpacity>
  			)

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

  _onRefresh() {
		 this.setState({
			   isRefreshing:true,
			   isReach:false,
			   isLoadMore:false,
		  })
		  var that=this
      fetch('https://yzx.shixiweiyuan.com/product/hot', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: this.toQueryString({
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
                   isRefreshing:false,
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
          fetch('https://yzx.shixiweiyuan.com/product/hot', {
              method: 'POST',
              headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: this.toQueryString({
               'index': this.state.index
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
                <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:WID==320 ? 16 : 18}}>热销商品</Text>
            </View>
            <View style={{flex:1,justifyContent:'center',alignItems:'flex-end',}}>

            </View>
          </View>
          <Netinfo  {...this.props}/>
          <View style={{flex:1,backgroundColor:'#eee'}}>
                  <ListView
                    contentContainerStyle={{width:Dimensions.get('window').width,flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',}}
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
          {!this.state.loaded ? <View style={{justifyContent: 'center',alignItems: 'center',width:Dimensions.get('window').width,height:Dimensions.get('window').height-((DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 70 : 65),position:'absolute',top:((DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 70 : 65),left:0,backgroundColor:'#fff'}}>
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
