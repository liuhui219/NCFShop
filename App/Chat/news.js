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
import moment from 'moment';
import Chat from './chat';
import Newlist from './newlist';
import orderList from '../My/Order/orderList';
import JMessage from 'jmessage-react-plugin';
import JPushModule from 'jpush-react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
const WID = Dimensions.get('window').width;
export default class News extends Component {
  constructor() {
    super();
    this.state={
      dataSource: new ListView.DataSource({
			  rowHasChanged: (row1, row2) => row1 !== row2,
		  }),
      isNull:false,
      data:{},
      status:false,
      name:'',
    }
  }

  componentDidMount(){

    JPushModule.addReceiveNotificationListener((map)=>{
      if(map.hasOwnProperty('orderNum')){
        this.setState({
          data:map
        })
      }
      console.log(map);


    });



    DeviceEventEmitter.addListener('IsChat',(datas) =>{
      JMessage.getConversations((result) => {
        console.log(result)
        if(result.length == 0){
          this.setState({
              isNull:true,
              dataSource:this.state.dataSource.cloneWithRows([''])
          });
        }else{
          this.setState({
              isNull:false,
              dataSource:this.state.dataSource.cloneWithRows(result)
          });
        }

      }, (error) => {
        this.setState({
            dataSource:this.state.dataSource.cloneWithRows(['']),
            isNull:true,
        });
        var code = error.code
        var desc = error.description
      });
    })




    JMessage.addReceiveMessageListener((message) => {
        JMessage.getConversations((result) => {
          console.log(result)
          if(result.length == 0){
            this.setState({
                isNull:true,
                dataSource:this.state.dataSource.cloneWithRows([''])
            });
          }else{
            this.setState({
                isNull:false,
                dataSource:this.state.dataSource.cloneWithRows(result)
            });
          }

        }, (error) => {
          this.setState({
              dataSource:this.state.dataSource.cloneWithRows(['']),
              isNull:true,
          });
          var code = error.code
          var desc = error.description
        });
      },(error) => {
        var code = error.code
        var desc = error.description
      })



  }

  componentWillMount() {

    storage.load({
        key: 'News',
        autoSync: true,
        syncInBackground: true
      }).then(ret => {
        console.log(ret)
        this.setState({
          data:ret.datas
        })
      }).catch(err => {

      });




      JMessage.getConversations((result) => {
        console.log(result)
        if(result.length == 0){
          this.setState({
              isNull:true,
              dataSource:this.state.dataSource.cloneWithRows([''])
          });
        }else{
          this.setState({
              isNull:false,
              dataSource:this.state.dataSource.cloneWithRows(result)
          });
        }

      }, (error) => {
        this.setState({
            dataSource:this.state.dataSource.cloneWithRows(['']),
            isNull:true,
        });
        var code = error.code
        var desc = error.description
      });


  }

  chat(name,username){
    var that = this;
    JMessage.resetUnreadMessageCount({ type: 'single', username: name, appKey: 'fdbbb12e83955a2ae9a51dbb' },
      (conversation) => {
        JMessage.getConversations((result) => {
          console.log(result)
          if(result.length == 0){
            that.setState({
                isNull:true,
                dataSource:this.state.dataSource.cloneWithRows([''])
            });
          }else{
            that.setState({
                isNull:false,
                dataSource:this.state.dataSource.cloneWithRows(result)
            });
          }

        }, (error) => {
          that.setState({
              dataSource:this.state.dataSource.cloneWithRows(['']),
              isNull:true,
          });
          var code = error.code
          var desc = error.description
        });
      }, (error) => {
        var code = error.code
        var desc = error.description
     });

     var { navigator } = that.props;
      if(navigator) {
          navigator.push({
              name: 'Chat',
              component: Chat,
              params:{
                name:name,
                username:username,
                getNews:function(){
                  that.componentWillMount();
                }
              }
          })
      }
  }


  getTime(time){
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

  delete(name){
    this.setState({
      status:true,
      name:name
    })
  }

  cancel(){
    this.setState({
      status:false
    })
  }

  yes(){
    this.setState({
      status:false
    })
    JMessage.deleteConversation({ type: 'single', username: this.state.name, appKey: 'fdbbb12e83955a2ae9a51dbb' },
      (conversation) => {
        JMessage.getConversations((result) => {
          console.log(result)
          if(result.length == 0){
            this.setState({
                isNull:true,
                dataSource:this.state.dataSource.cloneWithRows([''])
            });
          }else{
            this.setState({
                isNull:false,
                dataSource:this.state.dataSource.cloneWithRows(result)
            });
          }

        }, (error) => {
          this.setState({
              dataSource:this.state.dataSource.cloneWithRows(['']),
              isNull:true,
          });
          var code = error.code
          var desc = error.description
        });

      }, (error) => {
        var code = error.code
        var desc = error.description
     })
  }




  renderMovie(data){
        if(this.state.isNull){
          return (
    			    <View style={{justifyContent:'center',alignItems:'center',height:Dimensions.get('window').height-250,width:Dimensions.get('window').width,backgroundColor:'#fff'}}>
    				    <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:16,color:'#777'}}>{data}</Text>
    				  </View>
    			)
        }else{
          if(data.hasOwnProperty('latestMessage')){
            return (
              <View style={{borderBottomWidth:1,borderColor:'#eee',}}>
                <TouchableHighlight underlayColor='#ccc' onPress={this.chat.bind(this,data.target.username,data.title)} onLongPress={this.delete.bind(this,data.target.username)}>
                    <View style={[styles.row,styles.last]}>
                        <View style={{width:60,height:60,justifyContent:'center',alignItems:'center'}}>
                          {data.target.avatarThumbPath != '' ? <Image resizeMode={'contain'} style={{ width: 45,height:45}} source={{uri:'file://'+data.target.avatarThumbPath}} /> :
                          <Image resizeMode={'contain'} style={{ width: 45,height:45}} source={require('../img/mine_photo.png')} />}
                        </View>
                        <View style={styles.content}>
                            <View style={[styles.crow]}>
                                <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={styles.title} numberOfLines={1}>{data.title}</Text>

                                {data.latestMessage != null ? <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={styles.time}>{this.getTime(data.latestMessage.createTime)}</Text> : null}
                            </View>
                            {data.latestMessage != null ? <View style={[styles.crow,{marginTop:10}]}>
                                {data.latestMessage.type === 'text' ? <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={styles.desc} numberOfLines={1}>
                                    {(data.unreadCount > 0 ?'['+data.unreadCount+'条]' : '')+data.latestMessage.text}
                                </Text> : null}
                                {data.latestMessage.type === 'image' ? <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={styles.desc} numberOfLines={1}>
                                    [图片]
                                </Text> : null}
                                {data.latestMessage.type === 'voice' ? <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={styles.desc} numberOfLines={1}>
                                    [语音]
                                </Text> : null}
                            </View> : <View style={[styles.crow,{marginTop:10}]}>
                              <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={styles.desc} numberOfLines={1}>
                                    {data.title}
                                </Text>
                            </View>}
                        </View>

                    </View>
                </TouchableHighlight>
            </View>
            )
          }else{
            return null
          }

        }

    }

    list(){
      var that = this;
      var { navigator } = that.props;
       if(navigator) {
           navigator.push({
               name: 'Newlist',
               component: Newlist
           })
       }
    }

  render() {
    return (
      <View style={{flex:1,backgroundColor:'#fff'}}>
      <ScrollView style={{flex:1}}>
              <View style={{borderBottomWidth:1,borderColor:'#eee'}}>
                <TouchableHighlight underlayColor='#ccc' onPress={this.list.bind(this)}>
                    <View style={[styles.row,styles.last]}>
                        <View style={{width:60,height:60,justifyContent:'center',alignItems:'center'}}><Image resizeMode={'contain'} style={{ width: 45,height:45}} source={require('../img/jiaoyi.png')} /></View>
                        <View style={styles.content}>
                            <View style={[styles.crow]}>
                                <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={styles.title} numberOfLines={1}>交易提醒</Text>
                            </View>
                            <View style={[styles.crow,{marginTop:10}]}>
                                {JSON.stringify(this.state.data) != '{}' ? <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={styles.desc} numberOfLines={1}>
                                    {this.state.data.body}
                                </Text> : <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={styles.desc} numberOfLines={1}>
                                    查看更多
                                </Text>}
                            </View>
                        </View>

                    </View>
                </TouchableHighlight>
            </View>
           <ListView
              dataSource={this.state.dataSource}
              renderRow={this.renderMovie.bind(this)}
            />
      </ScrollView>
      {this.state.status ? <View style={{backgroundColor:'rgba(119, 119, 119, 0.51)',position:'absolute',width:(Dimensions.get('window').width),height:(Dimensions.get('window').height),top:0,left:0}}><View style={{position:'absolute',backgroundColor:'#fff',width:260,height:120,top:(Dimensions.get('window').height-320)/2,left:(Dimensions.get('window').width-260)/2,borderRadius:5,overflow:'hidden'}}>

       <View style={{flex:1,justifyContent:'center',alignItems:'center',borderBottomWidth:1,borderColor:'#ececec'}}>
         <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 14 : 16,}}>删除该聊天？</Text>
       </View>
       <View style={{flexDirection:'row',justifyContent:'space-between',height:50,backgroundColor:'#ececec',borderBottomLeftRadius:5,borderBottomRightRadius:5}}>
        <TouchableOpacity onPress={this.cancel.bind(this)} style={{flex:1,alignItems:'center',justifyContent:'center',borderBottomLeftRadius:5,backgroundColor:'#fff'}}>
         <View ><Text  allowFontScaling={false} adjustsFontSizeToFit={false}style={{color:'#666',fontSize:WID==320 ? 14 : 16,}}>取消</Text></View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.yes.bind(this)} style={{flex:1, alignItems:'center',justifyContent:'center', borderBottomRightRadius:5,marginLeft:1,backgroundColor:'#fff'}}>
         <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#666',fontSize:WID==320 ? 14 : 16,}}>确认</Text></View>
        </TouchableOpacity>
       </View>
   </View></View> : null}
      </View>
    );
  }
}
const width= Dimensions.get('window').width;
const px = 10;
const borderWidth = StyleSheet.hairlineWidth;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list:{

        borderTopWidth:borderWidth,
        borderTopColor:'#fafafa',
        borderBottomWidth:borderWidth,
        borderBottomColor:'#fafafa',
    },
    row:{

        paddingVertical:px,
        borderBottomWidth:borderWidth,
        borderBottomColor:'#c9c9c9',
        flexDirection:'row',
        alignItems:'center',
        paddingRight:1,
        backgroundColor:'#fff',

    },
    last:{
        borderBottomWidth:0,
    },

    logo:{
        width:50,
        height:50,
        marginRight:px,
        borderRadius:8
    },
    content:{
        flexDirection:"column",
        justifyContent:'center',
        height:45,
        marginRight:3,
        flex:1
    },
    crow:{
        flexDirection:'row',
        justifyContent:'space-between',
        flex:1,

        alignItems:'center'
    },
    title:{
        fontSize:WID==320 ? 14 : 16,
        lineHeight:19,
        overflow:'hidden',
        color:'#555'
    },
    time:{
        fontSize:12,
        color:"#9d9d9e",
        marginRight:10
    },
    desc:{
       fontSize:WID==320 ? 12 : 13,
       color:'#9d9d9e',
       overflow:'hidden'
    },
    rowBack:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-end'
    },
    line:{
        height:borderWidth,
        width:width-8,
        backgroundColor:'#c9c9c9',
        marginLeft:8
    },
    deleteBtn:{
        height:67,
        width:75,
        backgroundColor:'#d82617',
        alignItems:'center',
        justifyContent:'center'
    },
    tabIcon:{
        width:26,
        height:26
    },
    badge:{
        width:10,
        height:10,
        borderRadius:5,
        backgroundColor:'red',
        position:'absolute',
        left:55,
        top:7
    }

});
