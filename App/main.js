/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ListView,
  Animated,
  AppState,
  ToastAndroid,
  TouchableHighlight,
  TouchableNativeFeedback,
  ActivityIndicator,
  DeviceEventEmitter,
  Keyboard,
  Image,
  View
} from 'react-native';
import Styles from './Style';
import Home from './Home';
import My from './My';
import Chats from './Chat/chat';
import Chat from './Chat';
import Login from './Login';
import Register from './Register';
import ShopCart from './ShopCart';
import Toast from '@remobile/react-native-toast';
import orderList from './My/Order/orderList';
import Information from './Information';
import JMessage from 'jmessage-react-plugin';
import JPushModule from 'jpush-react-native';
import DeviceInfo from 'react-native-device-info';
import Prodetail from './Home/SupplyHall/Prodetails';
import SplashScreen from 'react-native-splash-screen';
import TabNavigator from 'react-native-tab-navigator';
import Icon from 'react-native-vector-icons/Ionicons';
var arrays = [];
var ImgArrays = [];
const WID = Dimensions.get('window').width;
export default class NCFShop extends Component {

  constructor(props) {
     super(props);
 		 this.state = {
         dataSources: new ListView.DataSource({
          rowHasChanged: (row3, row4) => row3 !== row4,
         }),
         selectedTab:'Home',
         IsShow:false,
         fadeAnim: new Animated.Value(0),
         IsShowClose:false,
         texts:'',
         IsShowLogin:true,
         appState:AppState.currentState,
         barStyle:"light-content",
         ImgArrays:[],
         loadeds: false,
         isLoadMores:false,
         isReachs:false,
         isNulls:false,
         sxs:false,
         index:0,
         loadedk:false,
 	   };
  }

  componentWillMount(){
    JPushModule.setBadge(0, success => {})
    AppState.addEventListener('change', this._handleAppStateChange.bind(this));
    JMessage.init({
      appkey: "fdbbb12e83955a2ae9a51dbb",
      isOpenMessageRoaming: false,
      isProduction: true,
    })
    if(data != ''){
      this.setState({
        IsShowLogin:false,
      })
      JMessage.login({
        username: data.IM,
        password: "123456789"
      },(success) => {

      }, (error) => {
      })
    }else{
      this.setState({
        IsShowLogin:true,
      })
      JPushModule.setAlias('1', (success) => {
          console.log(success)
      })
    }

    JMessage.addReceiveMessageListener((message) => {
        DeviceEventEmitter.emit('IsChat','false');
      },(error) => {
        var code = error.code
        var desc = error.description
      })



    JPushModule.addReceiveNotificationListener((map)=>{
      console.log(map);
      if(map.hasOwnProperty('orderNum')){
        storage.save({
          key: 'News',  // 注意:请不要在key中使用_下划线符号!
          rawData: {
            datas: map,
          },
          expires: null
        });
      }
    });
    JPushModule.addReceiveOpenNotificationListener((map)=>{
      console.log(map)
      var { navigator } = this.props;
      if(map.hasOwnProperty('orderNum')){
       if(navigator) {
           navigator.push({
               name: 'orderList',
               component: orderList,
               params:{
                 num:map.orderNum
               }
           })
       }
     }else{

     }
    });
  }

  _handleAppStateChange(appState){
	  	this.setState({appState});
	  	if(this.state.appState == 'active'){ 
        JPushModule.setBadge(0, success => {})
	  	}else{

      }
	  }

 	componentDidMount() {
     SplashScreen.hide();
     arrays = [];
     ImgArrays = [];
     storage.save({
       key: 'welcome',  // 注意:请不要在key中使用_下划线符号!
       rawData: {
         datas: '1234',
       },
       expires: null
     });
     this.Login=DeviceEventEmitter.addListener('IsLogin',(datas) =>{

        this.setState({
          IsShowLogin:false,
          barStyle:"light-content"
        })
     })
     this.Loginout=DeviceEventEmitter.addListener('IsLoginout',(datas) =>{

        this.setState({
          IsShowLogin:datas,
          barStyle:"dark-content"
        })
     })
     this.subscription=DeviceEventEmitter.addListener('_Searchs',(datas) =>{
       this.setState({
         IsShow:true,
         barStyle:"dark-content"
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
    });

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
          loadedk:false,
          dataSources: this.state.dataSources.cloneWithRows([]),
        });
        this.timer && clearTimeout(this.timer);
      },200)
  }

  componentWillUnmount() {
	  this.timer && clearTimeout(this.timer);
    this.timers && clearTimeout(this.timers);
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
    if(this.Trim(this.state.texts) == ''){
      Toast.showShortCenter('请输入搜索内容')
      return false;
    }else{
      this.setState({
        loadedk:true
      })
      var that = this;
      fetch('http://139.199.76.191:8889/product/search', {
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

  }

  _onEndReachs() {
		  if(!this.state.isReachs){
  			  this.setState({
  				  isLoadMores:true,
  			  })

          var that=this
          fetch('http://139.199.76.191:8889/product/search', {
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



  render() {
    return (
      <View style={Styles.container}>
        <StatusBar
          backgroundColor={'#000'}
          animated = {true}
          barStyle={this.state.barStyle}
          translucent={true}
         />

       <TabNavigator tabBarStyle={{ height:(DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 70 : 50,paddingBottom:(DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 25 : 3,}} sceneStyle={{backgroundColor:'#fff',}}>
              <TabNavigator.Item
                 selected={this.state.selectedTab === 'Home'}
                 title="首页"
                 renderIcon={() => <Image resizeMode={'contain'} source={require('./img/home_home.png')} style={{width:24,height:24}}/>}
                 renderSelectedIcon={() => <Image resizeMode={'contain'} source={require('./img/home_home_click.png')} style={{width:24,height:24}}/>}
                 selectedTitleStyle={{color:'#036EB8'}}
                 titleStyle={{color:'#aaa'}}
                 allowFontScaling={false}
                 onPress={() => {this.setState({ selectedTab: 'Home',barStyle:'light-content' });StatusBar.setBarStyle('light-content', true);}}>
                 <Home {...this.props}/>
              </TabNavigator.Item>
              <TabNavigator.Item
                 selected={this.state.selectedTab === 'Information'}
                 title="资讯"
                 renderIcon={() => <Image resizeMode={'contain'} source={require('./img/home_new.png')} style={{width:24,height:24}} />}
                 renderSelectedIcon={() => <Image resizeMode={'contain'} source={require('./img/home_new_click.png')} style={{width:24,height:24}} />}
                 selectedTitleStyle={{color:'#036EB8'}}
                 titleStyle={{color:'#aaa'}}
                 allowFontScaling={false}
                 onPress={() => {this.setState({ selectedTab: 'Information',});StatusBar.setBarStyle('light-content', true);}}>
                 <Information {...this.props}/>
              </TabNavigator.Item>

              <TabNavigator.Item
                selected={this.state.selectedTab === 'Chat'}
                title="消息"
                renderIcon={() => <Image resizeMode={'contain'} source={require('./img/home_news.png')} style={{width:26,height:26}} />}
                renderSelectedIcon={() => <Image resizeMode={'contain'} source={require('./img/home_news_click.png')} style={{width:26,height:26}}/>}
                selectedTitleStyle={{color:'#036EB8'}}
                titleStyle={{color:'#aaa'}}
                allowFontScaling={false}
                onPress={() => {this.setState({ selectedTab: 'Chat' });if(this.state.IsShowLogin){StatusBar.setBarStyle('default', true);}}}>
                {this.state.IsShowLogin ? <Login  {...this.props}/> : <Chat  {...this.props}/>}
              </TabNavigator.Item>

              <TabNavigator.Item
                selected={this.state.selectedTab === 'ShopCart'}
                title="进货单"
                renderIcon={() => <Image resizeMode={'contain'} source={require('./img/home_list.png')} style={{width:26,height:26}} />}
                renderSelectedIcon={() => <Image resizeMode={'contain'} source={require('./img/home_list_click.png')} style={{width:26,height:26}}/>}
                selectedTitleStyle={{color:'#036EB8'}}
                titleStyle={{color:'#aaa'}}
                allowFontScaling={false}
                onPress={() => {this.setState({ selectedTab: 'ShopCart' });if(this.state.IsShowLogin){StatusBar.setBarStyle('default', true);}}}>
                {this.state.IsShowLogin ? <Login  {...this.props}/> : <ShopCart  {...this.props}/>}
              </TabNavigator.Item>
              <TabNavigator.Item
                selected={this.state.selectedTab === 'Login'}
                title="我的"
                renderIcon={() => <Image resizeMode={'contain'} source={require('./img/home_mine.png')} style={{width:26,height:26}}/>}
                renderSelectedIcon={() => <Image resizeMode={'contain'} source={require('./img/home_mine_click.png')} style={{width:26,height:26}} />}
                selectedTitleStyle={{color:'#036EB8'}}
                titleStyle={{color:'#aaa'}}
                allowFontScaling={false}
                onPress={() => {this.setState({ selectedTab: 'Login',});if(this.state.IsShowLogin){StatusBar.setBarStyle('default', true);}}}>
                {this.state.IsShowLogin ? <Login  {...this.props}/> : <My  {...this.props}/>}
              </TabNavigator.Item>
          </TabNavigator>

          {this.state.IsShow ? <Animated.View style={{opacity: this.state.fadeAnim,position:'absolute',top:0,left:0,width:Dimensions.get('window').width,height:Dimensions.get('window').height,backgroundColor:'#fff'}}>
            <View style={[Styles.card]}>
              <View style={{flex:1,backgroundColor:'#fff',borderRadius:15,flexDirection:'row',marginLeft:10}}>
                    <View style={{height:30,width:30,justifyContent:'center',alignItems:'center',marginLeft:10}}>
                      <Icon name="ios-search" color="#999" size={20}  />
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
                      style={{height: 30,flex:1,color:'#111',  borderWidth: 1,padding: 0,borderColor:"transparent",fontSize:14}}
                      placeholder='搜索你想要的货品'
                    />
                    {this.state.IsShowClose ? <TouchableOpacity onPress={this.Close.bind(this)} activeOpacity={1} style={{height:30,width:40,justifyContent:'center',alignItems:'center',}}>
                      <View style={{height:30,width:40,justifyContent:'center',alignItems:'center',marginLeft:10}}>
                        <Icon name="md-close-circle" color="#ccc" size={20}  />
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
                  dataSource={this.state.dataSources}
                  renderRow={this.renderMovies.bind(this)}
                  onEndReached={this._onEndReachs.bind(this) }
                  onEndReachedThreshold={2}
                  renderFooter={this._renderFooters.bind(this)}
                  />
            </View>
            {this.state.loadedk ? <View style={{justifyContent: 'center',alignItems: 'center',width:Dimensions.get('window').width,height:Dimensions.get('window').height-70,position:'absolute',top:70,left:0,}}>
              <View style={styles.loading}>
                <ActivityIndicator color="white"/>
                <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={styles.loadingTitle}>加载中……</Text>
              </View>
           </View> : null}
          </Animated.View> : null}
      </View>
    );
  }

  renderMovies(data,sectionID: number, rowID: number) {

    if(this.state.sxs){

      return(
          <View style={{justifyContent:'center',alignItems:'center',height:Dimensions.get('window').height-130,}}>

            <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:16,}}>{data}</Text>
          </View>
      )
    }else if(this.state.isNulls){

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
    fetch('http://139.199.76.191:8889/shoppingCart/add', {
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
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
