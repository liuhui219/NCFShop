/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Dimensions,
  Image,
  ScrollView,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  Platform,
  DeviceEventEmitter,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  BackHandler
} from 'react-native';
import Styles from '../Style';
import Netinfo from '../NetInfo';
import DatePicker from 'antd-mobile/lib/date-picker';
import List from 'antd-mobile/lib/list';
import Toast from '@remobile/react-native-toast';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
const WID = Dimensions.get('window').width;
const nowTimeStamps='';
const nows='';
const utcNows='';
const CustomChildrens = ({ extra, onClick, children }) => (

    <View style={{width:Dimensions.get('window').width,flexDirection:'row',height:45,}}>
      <TouchableOpacity
        onPress={onClick}
        activeOpacity={1}
        style={{flexDirection:'row',flex:1}}
      >
        <View  style={{ flexDirection:'row',alignItems:'center',flex:1,paddingLeft:10}}>
          <View style={{marginRight:5}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#333',fontSize:WID==320 ? 14 : 16}}>{extra}</Text></View>

        </View>
      </TouchableOpacity>
    </View>

);
export default class MyComponent extends Component {
  constructor() {
    super();
    this._pressButton = this._pressButton.bind(this);
    BackHandler.addEventListener('hardwareBackPress', this._pressButton);
    this.state={
      checkBoxs:true,
      sendWay:1,
      title:'上门自提',
      date: new Date(Date.now()),
      time: new Date(Date.now()),
      utcDate: new Date(new Date(Date.now()).getTime() + (new Date(Date.now()).getTimezoneOffset() * 60000)),
      dpValue: null,
      customChildValue: null,
      visible: false,
      dataT:'',
      psPhone:'',
      cpnum:'',
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

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._pressButton);
    this.getTime && clearTimeout(this.getTime);
  }
  componentDidMount(){
    nowTimeStamps = Date.now();
    nows = new Date(nowTimeStamps);
    utcNows = new Date(nows.getTime() + (nows.getTimezoneOffset() * 60000));
    this.setState({
      dataT:new Date().getFullYear()+'-'+ this.Gdate(Number(new Date().getMonth()) + Number(1)) +'-'+ this.Gdate(Number(new Date().getDate())),
      psPhone:this.props.expressObj.sendPhoneNumber,
      cpnum:this.props.expressObj.sendCarNum,
      sendWay:this.props.expressObj.sendWay,
      checkBoxs:this.props.expressObj.checkBoxs
    })
  }

  Gdate(n){
      if(n<10){
         return '0'+n;
      }
       else{
           return ''+n;
      }
    }
  ZT(){
    this.setState({
      checkBoxs:true,
      sendWay:1,
      title:'上门自提'
    })

  }
  WT(){
    this.setState({
      checkBoxs:false,
      sendWay:2,
      title:'委托发货'
    })
  }
  Trims(x) {
    return x.replace(/\s/g,"");
  }
  save(){
    if(this.state.sendWay == 1){
      if(this.Trims(this.state.cpnum).length == 0){
        Toast.showShortCenter('请输入自提车牌号')
        return false;
      }else if(this.Trims(this.state.psPhone).length == 0){
        Toast.showShortCenter('请输入联系方式')
        return false;
      }else{
        var obj = {
          expresstitle:this.state.title,
          sendDate:this.state.dataT,
          sendCarNum:this.state.cpnum,
          sendWay:this.state.sendWay,
          checkBoxs:this.state.checkBoxs,
          sendPhoneNumber:this.state.psPhone
        }
        const { navigator } = this.props;
        if(navigator) {
            this.props.getExpress(obj)
            navigator.pop();
            return true;
        }
        return false;
      }

    }else{
      var obj = {
        expresstitle:this.state.title,
        sendDate:this.state.dataT,
        sendCarNum:'',
        checkBoxs:this.state.checkBoxs,
        sendWay:this.state.sendWay,
        sendPhoneNumber:''
      }
      const { navigator } = this.props;
      if(navigator) {
          this.props.getExpress(obj)
          navigator.pop();
          return true;
      }
      return false;
    }

  }

  onOk(date){
     const pad = n => n < 10 ? `0${n}` : n;
     const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
     this.setState({
       dataT:dateStr
     })
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
                <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:WID==320 ? 16 : 18}}>选择配送方式</Text>
            </View>
            <View style={{flex:1,justifyContent:'center',alignItems:'flex-end',}}>

            </View>
          </View>
          <Netinfo  {...this.props}/>
          <KeyboardAvoidingView behavior='padding' style={{flex:1}}>
          <ScrollView style={{flex:1,backgroundColor:'#eee'}}>
             <View style={{padding:15,backgroundColor:'#fff'}}>
                <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#333',fontSize:WID==320 ? 14 : 16,}}>支付方式</Text></View>
                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',paddingTop:15,}}>
                    <View style={{paddingRight:10}}>
                       <Ionicons name="ios-checkmark-circle" size={WID==320 ? 26 : 30} color="#036EB8" />
                    </View>
                    <View style={{flex:1,flexDirection:'row',alignItems:'center',}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#333',fontSize:WID==320 ? 14 : 16}}>银行转账</Text></View>
                </View>
             </View>

             <View style={{paddingTop:15,backgroundColor:'#fff',marginTop:15,flex:1}}>
                <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#333',fontSize:WID==320 ? 14 : 16,paddingLeft:15}}>配送方式</Text></View>
                <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',paddingTop:15,paddingLeft:15,paddingBottom:15}}>
                    <TouchableOpacity onPress={this.ZT.bind(this)} activeOpacity={1}>
                        <View style={{flexDirection:'row'}}>
                            <View style={{paddingRight:10}}>
                               {this.state.checkBoxs ? <Ionicons name="ios-checkmark-circle" size={WID==320 ? 26 : 30} color="#036EB8" /> : <Ionicons name="ios-radio-button-off" size={WID==320 ? 26 : 30} color="#999" />}
                            </View>
                            <View style={{flexDirection:'row',alignItems:'center',}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#333',fontSize:WID==320 ? 14 : 16}}>上门自提</Text></View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.WT.bind(this)} activeOpacity={1}>
                        <View style={{flexDirection:'row',marginLeft:20}}>
                            <View style={{paddingRight:10}}>
                               {!this.state.checkBoxs ? <Ionicons name="ios-checkmark-circle" size={WID==320 ? 26 : 30} color="#036EB8" /> : <Ionicons name="ios-radio-button-off" size={WID==320 ? 26 : 30} color="#999" />}
                            </View>
                            <View style={{flexDirection:'row',alignItems:'center',}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#333',fontSize:WID==320 ? 14 : 16}}>委托发货</Text></View>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{padding:15,borderTopWidth:1,borderColor:'#eee'}}>
                    {!this.state.checkBoxs ? <View style={{flexDirection:'row',flex:1,justifyContent:'center',alignItems:'center',height:50,backgroundColor:'#F0F0F0',paddingLeft:10,paddingRight:10,}}>
                        <View style={{width:70,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                          <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#FE0100',fontSize:WID==320 ? 14 : 16}}>*</Text>
                          <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#333',fontSize:WID==320 ? 14 : 16}}>发货日期</Text>
                        </View>
                        <View style={{flex:1}}>
                            <DatePicker
                              mode="date"
                              title="选择时间"
                              extra="选择发货日期"
                              minDate={nows}
                              onOk={(date) => this.onOk.bind(this,date)()}
                              value={this.state.date}
                              onChange={date => this.setState({ date })}
                            >
                              <CustomChildrens></CustomChildrens>
                            </DatePicker>
                        </View>
                    </View> : null}
                   {this.state.checkBoxs ? <View style={{flexDirection:'row',flex:1,justifyContent:'center',alignItems:'center',height:50,backgroundColor:'#F0F0F0',paddingLeft:10,paddingRight:10,}}>
                       <View style={{width:70,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>

                         <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#333',fontSize:WID==320 ? 14 : 16}}>自提车辆</Text>
                       </View>
                       <View style={{flex:1}}>
                         <TextInput
                           ref='cpnum'
                           multiline={false}
                           defaultValue={this.state.cpnum}
                           underlineColorAndroid="transparent"
                           placeholder='请输入自提车牌号'
                           placeholderTextColor='#aaa'
                           style={{height: 45,flex:1,color:'#000',  borderWidth: 1,padding: 0,paddingLeft:10,borderColor:"transparent",fontSize:WID==320 ? 14 : 16}}
                           onChangeText={(cpnum) => this.setState({cpnum})}
                         />
                       </View>
                   </View> : null}
                   {this.state.checkBoxs ? <View style={{flexDirection:'row',flex:1,justifyContent:'center',alignItems:'center',height:50,backgroundColor:'#F0F0F0',paddingLeft:10,paddingRight:10,marginTop:15}}>
                       <View style={{width:70,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>

                         <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#333',fontSize:WID==320 ? 14 : 16}}>联系方式</Text>
                       </View>
                       <View style={{flex:1}}>
                         <TextInput
                           ref='psPhone'
                           multiline={false}
                           underlineColorAndroid="transparent"
                           defaultValue={this.state.psPhone}
                           placeholder='请输入联系方式'
                           placeholderTextColor='#aaa'
                           style={{height: 45,flex:1,color:'#000',  borderWidth: 1,padding: 0,paddingLeft:10,borderColor:"transparent",fontSize:WID==320 ? 14 : 16}}
                           onChangeText={(psPhone) => this.setState({psPhone})}
                         />
                       </View>
                   </View> : null}

                   {this.state.checkBoxs ? <View style={{flexDirection:'row',flex:1,justifyContent:'center',alignItems:'center',height:50,backgroundColor:'#F0F0F0',paddingLeft:10,paddingRight:10,marginTop:15}}>
                       <View style={{width:70,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                         <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#333',fontSize:WID==320 ? 14 : 16}}>自提日期</Text>
                       </View>
                       <View style={{flex:1}}>
                           <DatePicker
                             mode="date"
                             title="选择时间"
                             extra="选择自提日期"
                             minDate={nows}
                             onOk={(date) => this.onOk.bind(this,date)()}
                             value={this.state.date}
                             onChange={date => this.setState({ date })}
                           >
                             <CustomChildrens></CustomChildrens>
                           </DatePicker>
                       </View>
                   </View> : null}

                </View>
             </View>
          </ScrollView>
          </KeyboardAvoidingView>
          <View style={{width:Dimensions.get('window').width,height:WID==320 ? 45 : 50,backgroundColor:'#fff',flexDirection:'row',justifyContent:'space-between'}}>

             <TouchableOpacity onPress={this.save.bind(this)} activeOpacity={1} style={{height:WID==320 ? 45 : 50,flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'#036EB8',flexDirection:'row'}}>
                  <View style={{height:WID==320 ? 45 : 50,flex:1,alignItems:'center',justifyContent:'center',flexDirection:'row'}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 16 : 18,color:'#fff',}}>保存</Text></View>
             </TouchableOpacity>
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
