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
  NativeAppEventEmitter,
  NativeModules,
  Keyboard,
  Clipboard,
  KeyboardAvoidingView,
  ToastAndroid,
  Linking,
  InteractionManager,
  ActivityIndicator,
  ScrollView,
  TouchableHighlight,
  PermissionsAndroid,
  TouchableOpacity,
  DeviceEventEmitter
} from 'react-native';
import Styles from '../Style';
import Netinfo from '../NetInfo';
import Svgs from './Svg';
import moment from 'moment';
import Toast from '@remobile/react-native-toast';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
const ContainerHeightMax = 800;
const ContainerHeightMin = 800;
const ChatInputHeightMax = 300;
const ChatInputHeightMin = 56;
const ChatInputHeightBg = '#ffffff';
const AuroraIController = NativeModules.AuroraIMUIModule;
import IMUI from 'react-native-imui'
import JMessage from 'jmessage-react-plugin';
import JPushModule from 'jpush-react-native';
const AnimatedImplementation = require('react-native/Libraries/Animated/src/AnimatedImplementation');
const InputView = AnimatedImplementation.createAnimatedComponent(IMUI.ChatInput);
const MessageListView = AnimatedImplementation.createAnimatedComponent(IMUI.MessageList)
const {width, height} = Dimensions.get('window');
const sWidth = width-55*4;
const window = Dimensions.get('window');
var arrMsg = [];
export default class Chat extends React.Component {
    static navigatorStyle = {
        tabBarHidden: true,
        navBarButtonColor:"#fff",
        navBarTextColor:"#fff"
    };
    constructor(props) {
        super(props);
        this.state = {
            isInitialized:false,
            inputViewHeight: new Animated.Value(50),
            inputViewWidth: 0,
            showType: 0,
            menuViewH:220,
            viewY:50,
            index:10,
            initList:[]
        };
        this._isAutoScroll = true;
        this._isListenKeyBoard = true;
        this._loadMoreContentAsync = this._loadMoreContentAsync.bind(this);



    }

    _pressButton() {
      const { navigator } = this.props;
      DeviceEventEmitter.emit('IsChat','false');
      if(this.props.getNews){
        this.props.getNews();
      }
      if(navigator) {
          //很熟悉吧，入栈出栈~ 把当前的页面pop掉，这里就返回到了上一个页面了
          navigator.pop();
          return true;
      }
      return false;
  }

    componentWillMount() {
       JMessage.addLoginStateChangedListener((event)=>{
        console.log(event)
        if(event.type == "user_kicked"){
          storage.clearMap();
          storage.remove({
            key: 'loginState'
          });
          global.data='';
          DeviceEventEmitter.emit('IsLoginout','true');
          const { navigator } = this.props;
          if(navigator) {
              //很熟悉吧，入栈出栈~ 把当前的页面pop掉，这里就返回到了上一个页面了
              navigator.pop();
              return true;
          }
          return false;
        }
      })
    }
    _onNavigatorEvent(event){

    }
    componentDidMount() {
       var that = this;

       this.getTime = setTimeout(() => {
          this.newList();
       },500);
       JMessage.addReceiveMessageListener((info)=>{
         console.log(info)
         var data = [];
         if(info.from.username == that.props.name){
                 if(info.type == 'text'){
                   var obj = {
                             'msgId': info.id,
                             'status': "send_succeed",
                             'attachStatus':info.id,
                             'msgType': "text",
                             'isRemoteRead':'0',
                             'isOutgoing': false,
                             'sessionId':info.from.username,
                             'sessionType':info.id,
                             'timeString':String(moment(info.createTime).unix()),
                             'text': info.text,
                             'fromUser': {
                               '_id': info.from.username,
                               'name': this.props.username,
                               'avatar': info.from.avatarThumbPath
                             }
                         }
                 }else if(info.type == 'voice'){
                   var obj = {
                             'msgId': info.id,
                             'status': "send_succeed",
                             'attachStatus':'2',
                             'msgType': "voice",
                             'isRemoteRead':'0',
                             'isOutgoing': false,
                             'sessionId':info.from.username,
                             'sessionType':3,
                             'mediaPath':info.path,
                             'timeString':String(moment(info.createTime).unix()),
                             extend:{
                               duration:String(parseInt(info.duration)),
                               thumbPath:info.path,
                               path:info.path,
                               url:""
                             },
                             'fromUser': {
                               '_id': info.from.username,
                               'name': this.props.username,
                               'avatar': info.from.avatarThumbPath
                             }
                         }
                 }else if(info.type == 'image'){
                   var obj = {
                             'msgId': info.id,
                             'status': "send_succeed",
                             'attachStatus':info.id,
                             'msgType': "image",
                             'isRemoteRead':'0',
                             'isOutgoing': false,
                             'sessionId':info.from.username,
                             'sessionType':info.id,
                             'timeString':String(moment(info.createTime).unix()),
                             'text': '',
                             'mediaPath':info.thumbPath,
                             extend:{
                               displayName:"123",
                               imageHeight:"100",
                               imageWidth:"100",
                               thumbPath:info.thumbPath,
                               path:info.thumbPath,
                               url:info.thumbPath,
                               mediaPath:info.thumbPath
                             },
                             'fromUser': {
                               '_id': info.from.username,
                               'name': this.props.username,
                               'avatar': info.from.avatarThumbPath
                             }
                         }
                 }

                 data.push(obj)
                 AuroraIController.appendMessages(data)
                 AuroraIController.scrollToBottom(true)
               }
       })
    }
    componentWillUnmount() {
      this.getTime && clearTimeout(this.getTime);
    }

    newList(){
      var that = this;
      arrMsg = [];
      JMessage.getHistoryMessages({ type: 'single', username: that.props.name,
       appKey: '0a86dd7a0756f0bafd2b7247', from: 0, limit: 10 },
       (msgArr) => {
          console.log(msgArr)
          msgArr.map((info,i)=>{

              if(info && info.type == 'text'){
                if(info.from.username == this.props.name){
                  var obj = {
                            'msgId': info.id,
                            'status': "send_succeed",
                            'attachStatus':info.id,
                            'msgType': "text",
                            'isRemoteRead':'0',
                            'isOutgoing': false,
                            'sessionId':info.from.username,
                            'sessionType':info.id,
                            'timeString':String(moment(info.createTime).unix()),
                            'text': info.text,
                            'fromUser': {
                              '_id': info.from.username,
                              'name': this.props.username,
                              'avatar': info.from.avatarThumbPath
                            }
                        }
                }else{
                  var obj = {
                            'msgId': info.id,
                            'status': "send_succeed",
                            'attachStatus':info.id,
                            'msgType': "text",
                            'isRemoteRead':'0',
                            'isOutgoing': true,
                            'sessionId':info.from.username,
                            'sessionType':info.id,
                            'timeString':String(moment(info.createTime).unix()),
                            'text': info.text,
                            'fromUser': {
                              '_id': info.from.username,
                              'name': this.props.username,
                              'avatar': info.from.avatarThumbPath
                            }
                        }
                }

               arrMsg.push(obj);
             }else if(info && info.type == 'image'){
               if(info.from.username == this.props.name){
                 var obj = {
                           'msgId': info.id,
                           'status': "send_succeed",
                           'attachStatus':info.id,
                           'msgType': "image",
                           'isRemoteRead':'0',
                           'isOutgoing': false,
                           'sessionId':info.from.username,
                           'sessionType':info.id,
                           'timeString':String(moment(info.createTime).unix()),
                           'text': '',
                           'mediaPath':info.thumbPath,
                           extend:{
                             displayName:"123",
                             imageHeight:"100",
                             imageWidth:"100",
                             thumbPath:info.thumbPath,
                             path:info.thumbPath,
                             url:info.thumbPath,
                             mediaPath:info.thumbPath,
                           },
                           'fromUser': {
                             '_id': info.from.username,
                             'name': this.props.username,
                             'avatar': info.from.avatarThumbPath
                           }
                       }
               }else{
                 var obj = {
                           'msgId': info.id,
                           'status': "send_succeed",
                           'attachStatus':info.id,
                           'msgType': "image",
                           'isRemoteRead':'0',
                           'isOutgoing': true,
                           'sessionId':info.from.username,
                           'sessionType':info.id,
                           'timeString':String(moment(info.createTime).unix()),
                           'text': '',
                           'mediaPath':info.thumbPath,
                           extend:{
                             displayName:"123",
                             imageHeight:"100",
                             imageWidth:"100",
                             thumbPath:info.thumbPath,
                             path:info.thumbPath,
                             url:info.thumbPath,
                             mediaPath:info.thumbPath,
                           },
                           'fromUser': {
                             '_id': info.from.username,
                             'name': this.props.username,
                             'avatar': info.from.avatarThumbPath
                           }
                       }
               }

                arrMsg.push(obj);
             }else if(info && info.type == 'voice'){
               if(info.from.username == this.props.name){
                 var obj = {
                           'msgId': info.id,
                           'status': "send_succeed",
                           'attachStatus':'2',
                           'msgType': "voice",
                           'isRemoteRead':'0',
                           'isOutgoing': false,
                           'sessionId':info.from.username,
                           'sessionType':3,
                           'mediaPath':info.path,
                           'timeString':String(moment(info.createTime).unix()),
                           extend:{
                             duration:String(parseInt(info.duration)),
                             thumbPath:info.path,
                             path:info.path,
                             url:""
                           },
                           'fromUser': {
                             '_id': info.from.username,
                             'name': this.props.username,
                             'avatar': info.from.avatarThumbPath
                           }
                       }
               }else{
                 var obj = {
                           'msgId': info.id,
                           'status': "send_succeed",
                           'attachStatus':'2',
                           'msgType': "voice",
                           'isRemoteRead':'0',
                           'isOutgoing': true,
                           'sessionId':info.from.username,
                           'sessionType':3,
                           'mediaPath':info.path,
                           'timeString':String(moment(info.createTime).unix()),
                           extend:{
                             duration:String(parseInt(info.duration)),
                             thumbPath:info.path,
                             path:info.path,
                             url:""
                           },
                           'fromUser': {
                             '_id': info.from.username,
                             'name': this.props.username,
                             'avatar': info.from.avatarThumbPath
                           }
                       }
               }

                arrMsg.push(obj);
             }
          })
          that.setState({
            initList:arrMsg.reverse()
          })
          console.log(arrMsg)
       }, (error) => {
         var code = error.code
         var desc = error.description
       })
    }

    onFeatureView = (inputHeight,showType) => {
        Animated.timing(this.state.inputViewHeight,{
            toValue:inputHeight,
            duration:310
        }).start();
        this.setState({
            showType: showType,
        })
    }
    onShowKeyboard = (inputHeight,showType) => {
        if(this._isListenKeyBoard){
            Animated.timing(this.state.inputViewHeight,{
                toValue:inputHeight,
                duration:310
            }).start();
            this.setState({
                showType: showType,
            })
        }
    }
    onChangeBarHeight = (inputHeight,marginTop) => {
        Animated.timing(this.state.inputViewHeight,{
            toValue:inputHeight,
            duration:310
        }).start();
        this.setState({
            viewY: marginTop,
        })
    }
    onSendTextMessage = (text,IDArr) =>{
       var data = [];
      var that = this;
      if (!text || !text.trim()) {
           Toast.showShortCenter('请输入聊天内容')
           return;
       }
       text = text.trim();
       var message = {type: 'single', username: this.props.name, appKey: '0a86dd7a0756f0bafd2b7247', messageType: 'text',text:text}
       JMessage.createSendMessage(message, (msg) => {
          console.log(msg)
          var datas = [];
          var obj = {
                    'msgId': msg.id,
                    'status': "send_succeed",
                    'attachStatus':msg.id,
                    'msgType': "text",
                    'isRemoteRead':'0',
                    'isOutgoing': true,
                    'sessionId':msg.id,
                    'sessionType':msg.id,
                    'timeString':String(moment(msg.createTime).unix()),
                    'text': msg.text,
                    'fromUser': {
                      '_id': msg.from.username,
                      'name': that.props.username,
                      'avatar': msg.from.avatarThumbPath
                    }
                }
          datas.push(obj)
          console.log(AuroraIController)
          AuroraIController.appendMessages(datas)
          AuroraIController.scrollToBottom(true)
          JMessage.sendMessage({id:msg.id, type: 'single', username: that.props.name,appKey: '0a86dd7a0756f0bafd2b7247'}, (info) => {

            this.newList();
          }, (error) => {
            console.log(error)
            this.newList();
          })
        })
    }
    onSendRecordMessage = (path) =>{
          var data = [];

          JMessage.sendVoiceMessage({ type: 'single', username: this.props.name, appKey:'0a86dd7a0756f0bafd2b7247',
            path: path, extras: {}},
            (info) => {
                console.log(info)
                var obj = {
                          'msgId': info.id,
                          'status': "send_succeed",
                          'attachStatus':'2',
                          'msgType': "voice",
                          'isRemoteRead':'0',
                          'isOutgoing': true,
                          'sessionId':info.from.username,
                          'sessionType':0,
                          'timeString':String(moment(info.createTime).unix()),
                          'mediaPath':info.path,
                          extend:{
                            duration:String(parseInt(info.duration)),
                            thumbPath:null,
                            path:info.path.slice(0,-5),
                            url:""
                          },
                          'fromUser': {
                            '_id': info.from.username,
                            'name': this.props.username,
                            'avatar': info.from.avatarThumbPath
                          }
                      }
                      data.push(obj)
                      AuroraIController.appendMessages(data);
                      AuroraIController.scrollToBottom(true)
                      this.newList();
            }, (error) => {
              this.newList();
              var code = error.code
              var desc = error.description
            })
            console.log(path)
    }
    onClickMention = ()=>{

    }

    _renderActions() {
        const {session} = this.props;
        return (
            <View style={styles.iconRow}>

                <View style={styles.actionCol}>
                    <TouchableOpacity style={styles.iconTouch} onPress={this.handleCameraPicker.bind(this)}>
                        {Svgs.iconCamera}
                    </TouchableOpacity>
                    <Text style={{marginTop:6, fontSize:12}}>拍照</Text>
                </View>
                <View style={styles.actionCol}>
                    <TouchableOpacity style={styles.iconTouch} onPress={this.handleImagePicker.bind(this)}>
                        {Svgs.iconImage}
                    </TouchableOpacity>
                    <Text style={{marginTop:6, fontSize:12}} >相册</Text>
                </View>


            </View>
        );
    }

    renderCustomContent(){
        if(this.state.showType === 0){//不显示
            return null;
        }else if(this.state.showType === 1){//显示菜单
            return (
                <View style={{height:this.state.menuViewH,width:window.width,
                    marginTop:this.state.viewY,flexGrow:1,backgroundColor:"white"}}>
                    <View style={{ height:1, backgroundColor:"#EAEAEA"}}/>
                    {this._renderActions()}
                </View>
            );
        }
    }
    onMsgClick = (message) => {
      console.log(message)
        const {navigator} = this.props;

        console.log(AuroraIController)

        if (message.msgType === 'voice'  &&  message.extend){
            AuroraIController.tapVoiceBubbleView(message.msgId)
        }
        if (message.msgType === 'image' && message.extend) {
            AuroraIController.hidenFeatureView(true)
        }



    }
    onDealWithMenuClick = (message,strMenu) => {
        if (strMenu === '复制'){
            Clipboard.setString(message.text);
        }else if(strMenu === '删除'){
            AuroraIController.deleteMessage([message])
        }else  if(strMenu === '撤回'){

                AuroraIController.deleteMessage([message])

        }
    }
    onStatusViewClick = (message) => {
        console.log('onStatusViewClick:',message)
    }
    onBeginDragMessageList = () => {
        AuroraIController.hidenFeatureView(true)
    }
    sendLocationImage(longitude, latitude, address) {
        NimSession.sendLocationMessage(longitude,latitude,address);
    }
    handleImagePicker() {
        var that = this;
        var message = {type: 'single', username: this.props.name, appKey: '0a86dd7a0756f0bafd2b7247', messageType: 'image',text:''}
        ImagePicker.openPicker({
            mediaType:'photo',
            multiple: true
        }).then(image => {
            console.log(image)
         image.map((img,i)=>{
           var data = [];
           var datas = [];

             JMessage.sendImageMessage({ type: 'single', username: that.props.name, appKey: '0a86dd7a0756f0bafd2b7247',
                 path: img.path},
                 (info) => {
                   console.log(info)
                   var obj = {
                             'msgId': info.id,
                             'status': "send_succeed",
                             'attachStatus':'',
                             'msgType': "image",
                             'isRemoteRead':'0',
                             'isOutgoing': true,
                             'sessionId':'',
                             'sessionType':'',
                             'timeString':'',
                             'text': '',
                             'mediaPath':img.path,
                             extend:{
                               displayName:"123",
                               imageHeight:"100",
                               imageWidth:"100",
                               thumbPath:img.path,
                               path:img.path,
                               url:"",
                               mediaPath:img.path
                             },
                             'fromUser': {
                               '_id': '',
                               'name': that.props.username,
                               'avatar': img.path
                             }
                         }
                   data.push(obj)
                   AuroraIController.appendMessages(data);
                   AuroraIController.scrollToBottom(true);
                   that.newList();
                 }, (error) => {
                   that.newList();
                   var code = error.code
                   var desc = error.description
                 })

         })
        });
    }
    handleCameraPicker() {
        var that = this;
      var message = {type: 'single', username: this.props.name, appKey: '0a86dd7a0756f0bafd2b7247', messageType: 'image',text:''}
      ImagePicker.openCamera({
           mediaType: 'photo',
           loadingLabelText: '请稍候...'
       }).then(image => {
         var data = [];


           JMessage.sendImageMessage({ type: 'single', username: that.props.name, appKey: '0a86dd7a0756f0bafd2b7247',
               path: image.path},
               (info) => {
                 console.log(info)
                 var obj = {
                           'msgId': info.id,
                           'status': "send_succeed",
                           'attachStatus':'',
                           'msgType': "image",
                           'isRemoteRead':'0',
                           'isOutgoing': true,
                           'sessionId':'',
                           'sessionType':'',
                           'timeString':'',
                           'text': '',
                           'mediaPath':image.path,
                           extend:{
                             displayName:"123",
                             imageHeight:"100",
                             imageWidth:"100",
                             thumbPath:image.path,
                             path:image.path,
                             url:"",
                             mediaPath:image.path
                           },
                           'fromUser': {
                             '_id': '',
                             'name': that.props.username,
                             'avatar': image.path
                           }
                       }
                 data.push(obj)
                 AuroraIController.appendMessages(data);
                 AuroraIController.scrollToBottom(true);
                 that.newList();
               }, (error) => {
                 that.newList();
                 var code = error.code
                 var desc = error.description
               })
       });
    }
    onLocation(coordinate) {
        this.sendLocationImage(coordinate.latitude,coordinate.longitude,coordinate.address);
    }
    handleLocationClick() {
        this.props.navigator.showModal({
            screen:"ImDemo.LocationPicker",
            title:'位置信息',
            backButtonTitle:'返回',
            passProps:{
                onLocation:this.onLocation.bind(this)
            }
        });
    }
    handleTransferClick(){
        const {navigator,session} = this.props;
        Toast.show('需要自行实现');
    }
    handlePacketClick(){
        const {session} = this.props;
        Toast.show('需要自行实现');
    }
    onMsgOpenUrlClick=(url)=>{
        Toast.show('打开链接');
    }

    onPacketPress(message){
        const {navigator} = this.props;
        Toast.show('需要自行实现');
    }
    onAvatarPress = (v) =>{
        console.log(v)
    }
    onClickChangeAutoScroll=(isAutoScroll)=>{
        this._isAutoScroll = isAutoScroll;
    }
    _loadMoreContentAsync = async () => {
      var that = this;
      var data = [];
      JMessage.getHistoryMessages({ type: 'single', username: that.props.name,
       appKey: '0a86dd7a0756f0bafd2b7247', from: this.state.index, limit: 10 },
       (msgArr) => {
          console.log(msgArr)
          if(msgArr.length != 0){
          msgArr.map((info,i)=>{

              if(info && info.type == 'text'){
                if(info.from.username == this.props.name){
                  var obj = {
                            'msgId': info.id,
                            'status': "send_succeed",
                            'attachStatus':info.id,
                            'msgType': "text",
                            'isRemoteRead':'0',
                            'isOutgoing': false,
                            'sessionId':info.from.username,
                            'sessionType':info.id,
                            'timeString':String(moment(info.createTime).unix()),
                            'text': info.text,
                            'fromUser': {
                              '_id': info.from.username,
                              'name': this.props.username,
                              'avatar': info.from.avatarThumbPath
                            }
                        }
                }else{
                  var obj = {
                            'msgId': info.id,
                            'status': "send_succeed",
                            'attachStatus':info.id,
                            'msgType': "text",
                            'isRemoteRead':'0',
                            'isOutgoing': true,
                            'sessionId':info.from.username,
                            'sessionType':info.id,
                            'timeString':String(moment(info.createTime).unix()),
                            'text': info.text,
                            'fromUser': {
                              '_id': info.from.username,
                              'name': this.props.username,
                              'avatar': info.from.avatarThumbPath
                            }
                        }
                }

               data.push(obj);
             }else if(info && info.type == 'image'){
               if(info.from.username == this.props.name){
                 var obj = {
                           'msgId': info.id,
                           'status': "send_succeed",
                           'attachStatus':info.id,
                           'msgType': "image",
                           'isRemoteRead':'0',
                           'isOutgoing': false,
                           'sessionId':info.from.username,
                           'sessionType':info.id,
                           'timeString':String(moment(info.createTime).unix()),
                           'text': '',
                           'mediaPath':info.thumbPath,
                           extend:{
                             displayName:"123",
                             imageHeight:"100",
                             imageWidth:"100",
                             thumbPath:info.thumbPath,
                             path:info.thumbPath,
                             url:info.thumbPath,
                             mediaPath:info.thumbPath,
                           },
                           'fromUser': {
                             '_id': info.from.username,
                             'name': this.props.username,
                             'avatar': info.from.avatarThumbPath
                           }
                       }
               }else{
                 var obj = {
                           'msgId': info.id,
                           'status': "send_succeed",
                           'attachStatus':info.id,
                           'msgType': "image",
                           'isRemoteRead':'0',
                           'isOutgoing': true,
                           'sessionId':info.from.username,
                           'sessionType':info.id,
                           'timeString':String(moment(info.createTime).unix()),
                           'text': '',
                           'mediaPath':info.thumbPath,
                           extend:{
                             displayName:"123",
                             imageHeight:"100",
                             imageWidth:"100",
                             thumbPath:info.thumbPath,
                             path:info.thumbPath,
                             url:info.thumbPath,
                             mediaPath:info.thumbPath,
                           },
                           'fromUser': {
                             '_id': info.from.username,
                             'name': this.props.username,
                             'avatar': info.from.avatarThumbPath
                           }
                       }
               }

                data.push(obj);
             }else if(info && info.type == 'voice'){
               if(info.from.username == this.props.name){
                 var obj = {
                           'msgId': info.id,
                           'status': "send_succeed",
                           'attachStatus':'2',
                           'msgType': "voice",
                           'isRemoteRead':'0',
                           'isOutgoing': false,
                           'sessionId':info.from.username,
                           'sessionType':3,
                           'mediaPath':info.path,
                           'timeString':String(moment(info.createTime).unix()),
                           extend:{
                             duration:String(parseInt(info.duration)),
                             thumbPath:info.path,
                             path:info.path,
                             url:""
                           },
                           'fromUser': {
                             '_id': info.from.username,
                             'name': this.props.username,
                             'avatar': info.from.avatarThumbPath
                           }
                       }
               }else{
                 var obj = {
                           'msgId': info.id,
                           'status': "send_succeed",
                           'attachStatus':'2',
                           'msgType': "voice",
                           'isRemoteRead':'0',
                           'isOutgoing': true,
                           'sessionId':info.from.username,
                           'sessionType':3,
                           'mediaPath':info.path,
                           'timeString':String(moment(info.createTime).unix()),
                           extend:{
                             duration:String(parseInt(info.duration)),
                             thumbPath:info.path,
                             path:info.path,
                             url:""
                           },
                           'fromUser': {
                             '_id': info.from.username,
                             'name': this.props.username,
                             'avatar': info.from.avatarThumbPath
                           }
                       }
               }

                data.push(obj);
             }
          })
          that.setState({
            index:Number(that.state.index)+10
          })
          AuroraIController.insertMessagesToTop(data.reverse());
        }else{
          AuroraIController.insertMessagesToTop(data);
        }
       }, (error) => {
         var code = error.code
         var desc = error.description
       })
    }
    render() {
        let onViewLayout = (e) => {
            const layout = e.nativeEvent.layout;
            if (layout.height === 0) {
                return;
            }
            this.setState({
                isInitialized: true,
                inputViewHeight:new Animated.Value(50),
                inputViewWidth:window.width,
            });
        };
        if(this.state.isInitialized){
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
                          <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:18}}>{this.props.username}</Text>
                      </View>
                      <View style={{flex:1,justifyContent:'center',alignItems:'flex-end',}}>
                          <TouchableOpacity
                  onPress={()=>Linking.canOpenURL('tel:'+this.props.phone).then(supported => {
                   if (supported) {
                       Linking.openURL('tel:'+this.props.phone);
                   } else {

                   }
                  })}
                 style={{height:40,width:40,justifyContent:'center',alignItems:'center',marginRight:5}}>
                    <View style={{height:30,width:30,justifyContent:'center',alignItems:'center',}}>
                      <Ionicons name="ios-call" color="#fff" size={24}  />
                    </View>
                </TouchableOpacity>
                      </View>
                    </View>
                    <Netinfo  {...this.props}/>
                    <MessageListView style={[styles.messageList]}
                                     ref="MessageList"
                                     initalData={this.state.initList}
                                     onAvatarClick={this.onAvatarPress}
                                     onMsgClick={this.onMsgClick}
                                     onMsgOpenUrlClick={this.onMsgOpenUrlClick}
                                     onDealWithMenuClick={this.onDealWithMenuClick}
                                     onStatusViewClick={this.onStatusViewClick}
                                     onTapMessageCell={this.onTapMessageCell}
                                     onClickChangeAutoScroll={this.onClickChangeAutoScroll}
                                     onBeginDragMessageList={this.onBeginDragMessageList}
                                     onClickLoadMessages={this._loadMoreContentAsync}
                                     avatarSize={{width:40,height:40}}
                                     isShowOutgoingDisplayName={false}
                                     isShowIncommingDisplayName={false}
                                     sendBubbleTextSize={18}
                                     sendBubbleTextColor={"000000"}

                    />
                    <InputView style={{width:this.state.inputViewWidth,height:this.state.inputViewHeight}} menuViewH={this.state.menuViewH}
                               defaultToolHeight={50}
                               onFeatureView={this.onFeatureView}
                               onShowKeyboard={this.onShowKeyboard}
                               onChangeBarHeight = {this.onChangeBarHeight}
                               onSendTextMessage = {this.onSendTextMessage}
                               onSendRecordMessage = {this.onSendRecordMessage}
                               onClickMention = {this.onClickMention}
                    >
                        {this.renderCustomContent()}
                    </InputView>
                </View>
            );
        }
        return (
            <View style={styles.container} onLayout={onViewLayout} >
            </View>
        )

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    messageList: {
        // backgroundColor: 'red',
        flex: 1,
        marginTop: 0,
        width: window.width,
        margin:0,
    },
    inputView: {
        backgroundColor: 'green',
        width: window.width,
        height:100,

    },
    btnStyle: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#3e83d7',
        borderRadius: 8,
        backgroundColor: '#3e83d7'
    },
    iconRow: {
        flexDirection: 'row',
        paddingHorizontal:sWidth/5-1,
        flexWrap:'wrap',
        paddingVertical:30
    },
    actionCol:{
        alignItems:"center",
        marginRight:sWidth/5,
        height:95
    },
    iconTouch: {
        justifyContent:'center',
        alignItems:'center',
    },
});
