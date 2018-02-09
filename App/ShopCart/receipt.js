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
import Toast from '@remobile/react-native-toast';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
const WID = Dimensions.get('window').width;
export default class MyComponent extends Component {
  constructor() {
    super();
    this._pressButton = this._pressButton.bind(this);
    BackHandler.addEventListener('hardwareBackPress', this._pressButton);
    this.state={
      checkBox:true,
      checkBoxs:true,
      ticketDetail:1,
      ticketTitleType:1,
      company:'',
      companyTax:'',
      bank:'',
      bankNum:'',
      address:'',
      phone:'',
      ticketType:0,
      tickettitle:'个人',
      ticketcontent:'明细',

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
    this.setState({
      ticketType:this.props.ticketObj.ticketType,
      ticketTitleType:this.props.ticketObj.ticketTitleType,
      ticketDetail:this.props.ticketObj.ticketDetail,
      checkBox:this.props.ticketObj.checkBox,
      checkBoxs:this.props.ticketObj.checkBoxs,
      company:this.props.ticketObj.ticketCompanyName,
      companyTax:this.props.ticketObj.ticketTaxNum,
      bank:this.props.ticketObj.ticketBankName,
      bankNum:this.props.ticketObj.ticketBankNumber,
      address:this.props.ticketObj.ticketCompanyAddress,
      phone:this.props.ticketObj.ticketCompanyPhone,
    })
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._pressButton);
    this.getTime && clearTimeout(this.getTime);
  }
  My(){
    this.setState({
      checkBox:true,
      tickettitle:'个人',
      ticketTitleType:1
    })
  }

  company(){
    this.setState({
      checkBox:false,
      tickettitle:'公司',
      ticketTitleType:2
    })
  }

  MX(){
    this.setState({
      checkBoxs:true,
      ticketcontent:'明细',
      ticketDetail:1
    })
  }

  SCP(){
    this.setState({
      checkBoxs:false,
      ticketcontent:'水产食品',
      ticketDetail:2
    })
  }

  Trims(x) {
    return x.replace(/\s/g,"");
  }

  save(){

    if(this.state.ticketTitleType == 2){
      if(this.Trims(this.state.company).length == 0){
        Toast.showShortCenter('请输入公司名称')
        return false;
      }else if(this.Trims(this.state.companyTax).length == 0){
        Toast.showShortCenter('请输入公司税号')
        return false;
      }else{
        var obj = {
            checkBox:this.state.checkBox,
            checkBoxs:this.state.checkBoxs,
            ticketTitleType:this.state.ticketTitleType,
            ticketCompanyName:this.Trims(this.state.company),
            ticketTaxNum:this.Trims(this.state.companyTax),
            ticketBankName:this.Trims(this.state.bank),
            ticketBankNumber:this.Trims(this.state.bankNum),
            ticketCompanyAddress:this.Trims(this.state.address),
            ticketCompanyPhone:this.Trims(this.state.phone),
            ticketDetail:this.state.ticketDetail,
            ticketType:1,
            tickettitle:this.state.tickettitle,
            ticketcontent:this.state.ticketcontent
          };

          const { navigator } = this.props;
          if(navigator) {
              this.props.getObj(obj)
              navigator.pop();
              return true;
          }
          return false;
      }
    }else{
      var obj = {
          checkBox:this.state.checkBox,
          checkBoxs:this.state.checkBoxs,
          ticketTitleType:this.state.ticketTitleType,
          ticketCompanyName:'',
          ticketTaxNum:'',
          ticketBankName:'',
          ticketBankNumber:'',
          ticketCompanyAddress:'',
          ticketCompanyPhone:'',
          ticketDetail:this.state.ticketDetail,
          ticketType:1,
          tickettitle:this.state.tickettitle,
          ticketcontent:this.state.ticketcontent
        };

        const { navigator } = this.props;
        if(navigator) {
            this.props.getObj(obj)
            navigator.pop();
            return true;
        }
        return false;
    }
  }

  NoTicket(){
    var obj = {
      tickettitle:'不开发票',
      ticketcontent:'',
      ticketType:0,
    }
    const { navigator } = this.props;
    if(navigator) {
        this.props.getObj(obj)
        navigator.pop();
        return true;
    }
    return false;
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
                <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:WID==320 ? 16 : 18}}>发票</Text>
            </View>
            <View style={{flex:1,justifyContent:'center',alignItems:'flex-end',}}>

            </View>
          </View>
          <Netinfo  {...this.props}/>
          <KeyboardAvoidingView behavior='padding' style={{flex:1}}>
          <ScrollView style={{flex:1,backgroundColor:'#eee'}}>
             <View style={{padding:15,backgroundColor:'#fff'}}>
                <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#333',fontSize:WID==320 ? 14 : 16,}}>发票类型</Text></View>
                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',paddingTop:15,}}>
                    <View style={{paddingRight:10}}>
                       <Ionicons name="ios-checkmark-circle" size={WID==320 ? 26 : 30} color="#036EB8" />
                    </View>
                    <View style={{flex:1,flexDirection:'row',alignItems:'center',}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#333',fontSize:WID==320 ? 14 : 16}}>普通发票</Text></View>
                </View>
             </View>

             <View style={{paddingTop:15,backgroundColor:'#fff',marginTop:15}}>
                <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#333',fontSize:WID==320 ? 14 : 16,paddingLeft:15}}>发票抬头</Text></View>
                <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',paddingTop:15,paddingLeft:15,paddingBottom:15}}>
                    <TouchableOpacity onPress={this.My.bind(this)} activeOpacity={1} >
                      <View style={{flexDirection:'row'}}>
                          <View style={{paddingRight:10}}>
                             {this.state.checkBox ? <Ionicons name="ios-checkmark-circle" size={WID==320 ? 26 : 30} color="#036EB8" /> : <Ionicons name="ios-radio-button-off" size={WID==320 ? 26 : 30} color="#999" />}
                          </View>
                          <View style={{flexDirection:'row',alignItems:'center',}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#333',fontSize:WID==320 ? 14 : 16}}>个人</Text></View>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.company.bind(this)} activeOpacity={1} >
                      <View style={{flexDirection:'row',marginLeft:20}}>
                          <View style={{paddingRight:10}}>
                             {!this.state.checkBox ? <Ionicons name="ios-checkmark-circle" size={WID==320 ? 26 : 30} color="#036EB8" /> : <Ionicons name="ios-radio-button-off" size={WID==320 ? 26 : 30} color="#999" />}
                          </View>
                          <View style={{flexDirection:'row',alignItems:'center',}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#333',fontSize:16}}>公司</Text></View>
                      </View>
                    </TouchableOpacity>
                </View>
                {!this.state.checkBox ? <View style={{paddingLeft:15,borderTopWidth:1,borderColor:'#eee'}}>
                    <View style={{flexDirection:'row',flex:1,justifyContent:'center',alignItems:'center',height:60,borderBottomWidth:1,borderColor:'#eee'}}>
                       <View style={{width:75,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                         <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#FE0100',fontSize:WID==320 ? 14 : 16}}>*</Text>
                         <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#333',fontSize:WID==320 ? 14 : 16}}>公司名称</Text>
                       </View>
                       <View style={{flex:1}}>
                         <TextInput
                           ref='company'
                           defaultValue={this.state.company}
                           multiline={false}
                           underlineColorAndroid="transparent"
                           placeholder='请输入公司名称'
                           placeholderTextColor='#aaa'
                           style={{height: 45,flex:1,color:'#000',  borderWidth: 1,padding: 0,paddingLeft:10,borderColor:"transparent",fontSize:WID==320 ? 14 : 16}}
                           onChangeText={(company) => this.setState({company})}
                         />
                       </View>
                    </View>
                    <View style={{flexDirection:'row',flex:1,justifyContent:'center',alignItems:'center',height:60,borderBottomWidth:1,borderColor:'#eee'}}>
                       <View style={{width:75,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                         <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#FE0100',fontSize:WID==320 ? 14 : 16}}>*</Text>
                         <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#333',fontSize:WID==320 ? 14 : 16}}>公司税号</Text>
                       </View>
                       <View style={{flex:1}}>
                         <TextInput
                           ref='companyTax'
                           defaultValue={this.state.companyTax}
                           multiline={false}
                           underlineColorAndroid="transparent"
                           placeholder='请输入公司税号'
                           placeholderTextColor='#aaa'
                           style={{height: 45,flex:1,color:'#000',  borderWidth: 1,padding: 0,paddingLeft:10,borderColor:"transparent",fontSize:WID==320 ? 14 : 16}}
                           onChangeText={(companyTax) => this.setState({companyTax})}
                         />
                       </View>
                    </View>
                    <View style={{flexDirection:'row',flex:1,justifyContent:'center',alignItems:'center',height:60,borderBottomWidth:1,borderColor:'#eee'}}>
                       <View style={{width:75,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                         <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#333',fontSize:WID==320 ? 14 : 16}}>开户银行</Text>
                       </View>
                       <View style={{flex:1}}>
                         <TextInput
                           ref='bank'
                           multiline={false}
                           underlineColorAndroid="transparent"
                           defaultValue={this.state.bank}
                           placeholder='请输入开户银行'
                           placeholderTextColor='#aaa'
                           style={{height: 45,flex:1,color:'#000',  borderWidth: 1,padding: 0,paddingLeft:10,borderColor:"transparent",fontSize:WID==320 ? 14 : 16}}
                           onChangeText={(bank) => this.setState({bank})}
                         />
                       </View>
                    </View>
                    <View style={{flexDirection:'row',flex:1,justifyContent:'center',alignItems:'center',height:60,borderBottomWidth:1,borderColor:'#eee'}}>
                       <View style={{width:75,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                         <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#333',fontSize:WID==320 ? 14 : 16}}>银行账号</Text>
                       </View>
                       <View style={{flex:1}}>
                         <TextInput
                           ref='bankNum'
                           multiline={false}
                           keyboardType={'numeric'}
                           underlineColorAndroid="transparent"
                           defaultValue={this.state.bankNum}
                           placeholder='请输入银行账号'
                           placeholderTextColor='#aaa'
                           style={{height: 45,flex:1,color:'#000',  borderWidth: 1,padding: 0,paddingLeft:10,borderColor:"transparent",fontSize:WID==320 ? 14 : 16}}
                           onChangeText={(bankNum) => this.setState({bankNum})}
                         />
                       </View>
                    </View>
                    <View style={{flexDirection:'row',flex:1,justifyContent:'center',alignItems:'center',height:60,borderBottomWidth:1,borderColor:'#eee'}}>
                       <View style={{width:75,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                         <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#333',fontSize:WID==320 ? 14 : 16}}>公司地址</Text>
                       </View>
                       <View style={{flex:1}}>
                         <TextInput
                           ref='address'
                           multiline={false}
                           underlineColorAndroid="transparent"
                           defaultValue={this.state.address}
                           placeholder='请输入公司地址'
                           placeholderTextColor='#aaa'
                           style={{height: 45,flex:1,color:'#000',  borderWidth: 1,padding: 0,paddingLeft:10,borderColor:"transparent",fontSize:WID==320 ? 14 : 16}}
                           onChangeText={(address) => this.setState({address})}
                         />
                       </View>
                    </View>
                    <View style={{flexDirection:'row',flex:1,justifyContent:'center',alignItems:'center',height:60,}}>
                       <View style={{width:75,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                         <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#333',fontSize:WID==320 ? 14 : 16}}>公司电话</Text>
                       </View>
                       <View style={{flex:1}}>
                         <TextInput
                           ref='phone'
                           multiline={false}
                           keyboardType={'numeric'}
                           defaultValue={this.state.phone}
                           underlineColorAndroid="transparent"
                           placeholder='请输入公司电话'
                           placeholderTextColor='#aaa'
                           style={{height: 45,flex:1,color:'#000',  borderWidth: 1,padding: 0,paddingLeft:10,borderColor:"transparent",fontSize:WID==320 ? 14 : 16}}
                           onChangeText={(phone) => this.setState({phone})}
                         />
                       </View>
                    </View>
                </View> : null}
             </View>


             <View style={{padding:15,backgroundColor:'#fff',marginTop:15}}>
                <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#333',fontSize:WID==320 ? 14 : 16,}}>发票内容</Text></View>
                <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',paddingTop:15,}}>
                    <TouchableOpacity onPress={this.MX.bind(this)} activeOpacity={1}>
                        <View style={{flexDirection:'row'}}>
                            <View style={{paddingRight:10}}>
                               {this.state.checkBoxs ? <Ionicons name="ios-checkmark-circle" size={WID==320 ? 26 : 30} color="#036EB8" /> : <Ionicons name="ios-radio-button-off" size={WID==320 ? 26 : 30} color="#999" />}
                            </View>
                            <View style={{flexDirection:'row',alignItems:'center',}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#333',fontSize:WID==320 ? 14 : 16}}>明细</Text></View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.SCP.bind(this)} activeOpacity={1}>
                        <View style={{flexDirection:'row',marginLeft:20}}>
                            <View style={{paddingRight:10}}>
                               {!this.state.checkBoxs ? <Ionicons name="ios-checkmark-circle" size={WID==320 ? 26 : 30} color="#036EB8" /> : <Ionicons name="ios-radio-button-off" size={WID==320 ? 26 : 30} color="#999" />}
                            </View>
                            <View style={{flexDirection:'row',alignItems:'center',}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#333',fontSize:WID==320 ? 14 : 16}}>水产食品</Text></View>
                        </View>
                    </TouchableOpacity>
                </View>
             </View>
          </ScrollView>
          </KeyboardAvoidingView>
          <View style={{width:Dimensions.get('window').width,height:WID==320 ? 45 : 50,backgroundColor:'#fff',flexDirection:'row',justifyContent:'space-between'}}>
             <TouchableOpacity onPress={this.NoTicket.bind(this)} activeOpacity={1} style={{height:WID==320 ? 45 : 50,flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'#fff',flexDirection:'row',borderTopWidth:1,borderColor:'#eee'}}>
                  <View style={{height:WID==320 ? 45 : 50,flex:1,alignItems:'center',justifyContent:'center',flexDirection:'row'}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 16 : 18,color:'#333',}}>不需要发票</Text></View>
             </TouchableOpacity>
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
