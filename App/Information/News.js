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
  TouchableNativeFeedback,
  ActivityIndicator,
  ScrollView,
  ListView,
  RefreshControl,
  TouchableHighlight,
  TouchableOpacity,
  DeviceEventEmitter
} from 'react-native';
import Styles from '../Style';
import moment from 'moment';
import newsInfo from './newsInfo';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
var array = [];
export default class MyComponent extends Component {
  constructor() {
    super();
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

  getData(){
    var that = this;
    fetch('https://yzx.shixiweiyuan.com/app/article/showMove', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: this.toQueryString({
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
							   dataSource: that.state.dataSource.cloneWithRows(['暂无相关资讯']),
							   loaded: true,
							   sx:false,
							   isLoadMore:false,
                 isRefreshing:false,
							   isNull:true,
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

  renderMovie(data,sectionID: number, rowID: number) {
		if(this.state.sx){
			return(
			    <View style={{justifyContent:'center',alignItems:'center',height:Dimensions.get('window').height-170,width:Dimensions.get('window').width,backgroundColor:'#fff'}}>

				    <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:16,}}>{data}</Text>
				  </View>
			)
		}else if(this.state.isNull){
			return (
			    <View style={{justifyContent:'center',alignItems:'center',height:Dimensions.get('window').height-170,width:Dimensions.get('window').width,backgroundColor:'#fff'}}>

				    <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:16,}}>{data}</Text>
				  </View>
			)
		}else{
      if(data.listWay == 1){
        return (
              <TouchableHighlight underlayColor="transparent" onPress={this.newsInfo.bind(this,data.id)}>
                <View style={{padding:15,borderBottomWidth:1,borderColor:'#eee'}}>
                   <View>
                      <Text allowFontScaling={false} adjustsFontSizeToFit={false} numberOfLines={2} style={{fontSize:14,color:'#000'}}>{data.title}</Text>
                   </View>
                   <View style={{flexDirection:'row',marginTop:10}}>
                      {data.imagesUrl.split(",").map((info,i)=>{
                        if(i == 0){
                          return <View key={i} style={{flex:1,}}>
                             <Image style={{width:Dimensions.get('window').width/3-15,height:80}} source={{uri:info}} />
                          </View>
                        }if(i == 1){
                          return <View  key={i} style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                             <Image style={{width:Dimensions.get('window').width/3-15,height:80}} source={{uri:info}} />
                          </View>
                        }else{
                          return <View key={i} style={{flex:1,alignItems:'flex-end'}}>
                             <Image style={{width:Dimensions.get('window').width/3-15,height:80}} source={{uri:info}} />
                          </View>
                        }
                      })}

                   </View>
                   <View style={{marginTop:10,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                      <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:12,}}>{data.source}</Text></View>
                      <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:12,}}>{moment(data.createTime).format("YYYY-MM-DD")}</Text></View>
                   </View>
                </View>
              </TouchableHighlight>
    			)
      }else{
        return (
              <TouchableHighlight underlayColor="transparent" onPress={this.newsInfo.bind(this,data.id)}>
                  <View style={{padding:15,borderBottomWidth:1,borderColor:'#eee'}}>
                      <View style={{flexDirection:'row'}}>
                        <View style={{width:Dimensions.get('window').width/3,}}>
                           <Image style={{width:Dimensions.get('window').width/3-15,height:80}} source={{uri:data.imagesUrl}} />
                        </View>
                        <View style={{flex:1,justifyContent:'space-between'}}>
                           <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} numberOfLines={2} style={{fontSize:14,color:'#000'}}>{data.title}</Text></View>
                           <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                              <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:12,}}>{data.source}</Text></View>
                              <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:12,}}>{moment(data.createTime).format("YYYY-MM-DD")}</Text></View>
                           </View>
                        </View>
                      </View>
                  </View>
              </TouchableHighlight>
    			)
      }


		}
	}

  newsInfo(id){
    var that = this;
     var { navigator } = this.props;
     if(navigator) {
         navigator.push({
             name: 'newsInfo',
             component: newsInfo,
             params:{
               id:id,
             }
         })
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
        fetch('https://yzx.shixiweiyuan.com/app/article/showMove', {
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
      <View style={{flex:1}}>
          <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderMovie.bind(this)}
          onEndReachedThreshold={2}
          onEndReached={this._onEndReach.bind(this) }
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
