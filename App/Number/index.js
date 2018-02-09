/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  ToastAndroid,
  Keyboard,
  Dimensions,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from '@remobile/react-native-toast';
var nums = 1;
const WID = Dimensions.get('window').width;
export default class Number extends Component {
  constructor() {
    super();
    this.state = {
        number:1,
        addShow:true,
        minusShow:true

	  };

  }

  componentWillMount(){
    this.setState({
      number:this.props.num || 1,
    })
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
  }

  componentWillUnmount () {
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidHide(){
    this.refs.text.blur();
  }

  onBlur () {

    if(this.state.number >= this.props.max){
      nums = this.props.max;
      this.setState({
        number:this.props.max,
        addShow:false,
        minusShow:true
      })
      this.props.Onclick.bind(this,this.props.max)();
      Toast.showShortCenter('最多只能购买'+this.props.max+this.props.unit+'哦！')
    }else if(this.state.number <= this.props.min){
      nums = this.props.min;
      this.setState({
        number:this.props.min,
        minusShow:false,
        addShow:true
      })
      this.props.Onclick.bind(this,this.props.min)();
    }else{
      this.setState({

        minusShow:true,
        addShow:true
      })
      this.props.Onclick.bind(this,this.state.number)();
    }
  }

  componentWillReceiveProps(nextProps) {
      this.setState({
  		   number: nextProps.num
  	   });
  }

  Trim(x) {
    return x.replace(/[^0-9]/g,'');
  }
  Trims(x) {
    return x.replace(/\s/g,"");
  }

  minus(){
    nums = this.state.number;
    nums--;
    if(this.props.min && nums <= this.props.min){
      this.setState({
        number:this.props.min,
        minusShow:false,
        addShow:true,
      })
      this.props.Onclick.bind(this,this.props.min)();
    }else{
      this.setState({
        number:nums,
        minusShow:true,
        addShow:true,
      })
      this.props.Onclick.bind(this,nums)();
    }
  }

  add(){
    nums = this.state.number;
    nums++;
    if(this.props.max && nums >= this.props.max){
      this.setState({
        number:this.props.max,
        addShow:false,
        minusShow:true
      })
      this.props.Onclick.bind(this,this.props.max)();
    }else{
      this.setState({
        number:nums,
        addShow:true,
        minusShow:true
      })
      this.props.Onclick.bind(this,nums)();
    }

  }

  changs(text){
     this.refs.text.setNativeProps({text: String(this.Trims(this.Trim(text)))});

     this.setState({
       textNum:text,
       number:text,
     })
  }

  render() {
    return (
      <View style={[{width:120,flexDirection:'row',borderWidth:1,borderColor:'#aaa',borderRadius:3,justifyContent:'center',alignItems:'center',height:30},this.props.styles]}>
          {this.state.minusShow ? <TouchableHighlight underlayColor="transparent" onPress={this.minus.bind(this)} style={[{paddingLeft:9,paddingRight:9,justifyContent:'center',alignItems:'center',height:30},this.props.btnstyle]}>
             <View style={{justifyContent:'center',alignItems:'center',paddingTop:2,}}><Icon name="ios-remove" color="#333"size={30}  /></View>
          </TouchableHighlight> : <TouchableHighlight underlayColor="transparent"  style={[{paddingLeft:9,paddingRight:9,justifyContent:'center',alignItems:'center',height:30},this.props.btnstyle]}>
             <View style={{justifyContent:'center',alignItems:'center',paddingTop:2,}}><Icon name="ios-remove" color="#aaa"size={30}  /></View>
          </TouchableHighlight>}
          <View style={{flex:1,borderLeftWidth:1,borderRightWidth:1,borderColor:'#aaa'}}>
            <TextInput
            ref='text'
            defaultValue={String(this.state.number)}
            underlineColorAndroid = 'transparent'
            keyboardType = 'numeric'
            onEndEditing={this.onBlur.bind(this)}
            placeholderTextColor = {'#ccc'}
            onChangeText={(text) => this.changs.bind(this,text)()}
            style={{paddingBottom:3,paddingTop:3,lineHeight:15,color:'#333',textAlign:'center',flex:1,fontSize:WID==320 ? 12 : 14,borderRadius:3}}/>
          </View>
          {this.state.addShow ? <TouchableHighlight onPress={this.add.bind(this)} underlayColor="transparent" style={[{paddingLeft:10,paddingRight:10,justifyContent:'center',alignItems:'center',height:30},this.props.btnstyle]}>
             <View style={{justifyContent:'center',alignItems:'center',paddingTop:2}}><Icon name="ios-add" color="#333"size={30}  /></View>
          </TouchableHighlight> : <TouchableHighlight  underlayColor="transparent" style={[{paddingLeft:10,paddingRight:10,justifyContent:'center',alignItems:'center',height:30},this.props.btnstyle]}>
             <View style={{justifyContent:'center',alignItems:'center',paddingTop:2}}><Icon name="ios-add" color="#aaa"size={30}  /></View>
          </TouchableHighlight>}
        </View>
    );
  }
}

Number.defaultProps = {
    num:1,
    min:1,
    unit:''
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
