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
  DeviceEventEmitter,
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
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DatePicker from 'antd-mobile/lib/date-picker';
import List from 'antd-mobile/lib/list';
import Orientation from 'react-native-orientation';
const nowTimeStamp = Date.now();
const WID = Dimensions.get('window').width;
const now = new Date(nowTimeStamp);
// GMT is not currently observed in the UK. So use UTC now.
const utcNow = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
const CustomChildren = props => (

    <View style={{width:Dimensions.get('window').width,flexDirection:'row',height:50,backgroundColor:'#036EB8'}}>
      <TouchableOpacity
        onPress={props.onClick}
        activeOpacity={1}
        style={{ backgroundColor: '#036EB8',flexDirection:'row',flex:1}}
      >
        <View  style={{ flexDirection:'row',justifyContent:'center',alignItems:'center',flex:1,}}>
          <View style={{marginRight:5}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#fff',fontSize:16}}>{props.extra}</Text></View>
          <Ionicons name="md-arrow-dropdown" color="#fff" size={22}  />
        </View>
      </TouchableOpacity>
    </View>

);
export default class MyComponent extends Component {
  constructor() {
    super();
    this._pressButton = this._pressButton.bind(this);
    BackHandler.addEventListener('hardwareBackPress', this._pressButton);
    this.state = {
       date: now,
       time: now,
       utcDate: utcNow,
       dpValue: null,
       customChildValue: null,
       visible: false,
       loaded:false,
       isShow:false,
       data:[],
       dataT:'',
       times:'',
       isshows:true,
       main:{},
		};

  }

  _pressButton() {
      const { navigator } = this.props;
      if(navigator) {
          //很熟悉吧，入栈出栈~ 把当前的页面pop掉，这里就返回到了上一个页面了
          navigator.pop();
          Orientation.lockToPortrait();
          return true;
      }
      return false;
  }

  componentDidMount(){
    this.setState({
      times:new Date().getFullYear()+'-'+ this.Gdate(Number(new Date().getMonth()) + Number(1)) +'-'+ this.Gdate(Number(new Date().getDate()))
    })
    this.getTime = setTimeout(() => {
       this.getData(new Date().getFullYear()+'-'+ this.Gdate(Number(new Date().getMonth()) + Number(1)) +'-'+ this.Gdate(Number(new Date().getDate())));
    },800);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._pressButton);
    this.getTime && clearTimeout(this.getTime);
	}

  Gdate(n){
      if(n<10){
         return '0'+n;
      }
       else{
           return ''+n;
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

  getData(time){
    var that = this;
    fetch('http://139.199.76.191:8889/app/marketprice/show', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: this.toQueryString({
         'date':time
        })
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
         if(result.code == 0){
            that.setState({
              loaded:true,
              main:result.result ? result.result : {},
              data:result.result ? result.result.marketPriceItemList : [],
            })
            console.log(result)
         }else{
           console.log(result)
           that.setState({
             loaded:true,
             main:result.result ? result.result : {},
             data:result.result ? result.result.marketPriceItemList : [],
             isShow:false
           })
           Toast.showShortCenter(result.message)
         }

      })
      .catch((error) => {
        that.setState({
          loaded:true,
          isShow:false
        })
         Toast.showShortCenter('您的系统繁忙')
      });
  }

  componentWillUnmount() {
    Orientation.lockToPortrait();
    BackHandler.removeEventListener('hardwareBackPress', this._pressButton);
	}

  repeat(){
			if(Dimensions.get('window').width < Dimensions.get('window').height){
				Orientation.lockToLandscapeRight();
        this.setState({
          isshows:false
        })
			}else{
				Orientation.lockToPortrait();
        this.setState({
          isshows:true
        })
			}

	}

  onOk(date){
     const pad = n => n < 10 ? `0${n}` : n;
     const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
     this.setState({
       loaded:false,
       times:dateStr
     })
     this.getData(dateStr);
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
                <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:WID==320 ? 16 : 18}}>价格行情</Text>
            </View>
            <View style={{flex:1,justifyContent:'center',alignItems:'flex-end',}}>

            </View>
          </View>
          <Netinfo  {...this.props}/>
          <View style={{flex:1}}>

             <View style={{flexDirection:'column',paddingLeft:10,marginTop:10}}>
                <View style={{flexDirection:'row',}}>
                   <View style={{paddingRight:5}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#666',fontSize:WID==320 ? 14 : 16}}>{this.state.times}</Text></View>
                   {JSON.stringify(this.state.main) != '{}' ? <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#9A9A9A',fontSize:WID==320 ? 14 : 16}}>{this.state.main.title}</Text></View> : null}
                </View>
                <View style={{flexDirection:'row',marginTop:15,alignItems:'center'}}>
                   <View style={{paddingRight:5}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#9A9A9A',fontSize:WID==320 ? 14 : 16}}>来源：</Text></View>
                   {JSON.stringify(this.state.main) != '{}' ? <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#9A9A9A',fontSize:WID==320 ? 14 : 16}}>{this.state.main.source}</Text></View> : <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#9A9A9A',fontSize:16}}>暂无</Text></View>}
                </View>
             </View>
             <View style={{height:50,justifyContent:'center',alignItems:'center',marginTop:15,marginBottom:15}}>
                 <DatePicker
                   mode="date"
                   title="选择时间"
                   extra="Optional"
                   maxDate={now}
                   value={this.state.date}
                   onOk={(date) => this.onOk.bind(this,date)()}
                   onChange={date => this.setState({ date })}
                 >
                   <CustomChildren></CustomChildren>
                 </DatePicker>
             </View>
             {this.state.data.length > 0 ? <ScrollView style={{flexDirection:'column',flex:1}}>
                 <View style={{flexDirection:'row',borderTopWidth:1,borderColor:'#eee',}}>
                    <View style={[styles.list]}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#9A9A9A',fontSize:WID==320 ? 12 : 14}}>品类</Text></View>
                    <View style={[styles.list]}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#9A9A9A',fontSize:WID==320 ? 12 : 14}}>等级</Text></View>
                    <View style={[styles.list]}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#9A9A9A',fontSize:WID==320 ? 12 : 14}}>规格</Text></View>
                    <View style={[styles.list]}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#9A9A9A',fontSize:WID==320 ? 12 : 14}}>冷冻方式</Text></View>
                    <View style={[styles.list]}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#9A9A9A',fontSize:WID==320 ? 12 : 14}}>单价</Text></View>
                    <View style={[styles.list]}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#9A9A9A',fontSize:WID==320 ? 12 : 14}}>箱重(kg)</Text></View>
                    <View style={[styles.list]}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#9A9A9A',fontSize:WID==320 ? 12 : 14}}>装箱方式</Text></View>
                 </View>
                 {this.state.data.length > 0 ? this.state.data.map((info,i)=>{

                   return <View key={i} style={{flexDirection:'row',}}>
                      <View style={[styles.list]}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#666',fontSize:WID==320 ? 12 : 14}}>{info.name}</Text></View>
                      <View style={[styles.list]}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#666',fontSize:WID==320 ? 12 : 14}}>{info.level}</Text></View>
                      <View style={[styles.list]}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#666',fontSize:WID==320 ? 12 : 14}}>{info.spec}</Text></View>
                      <View style={[styles.list]}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#666',fontSize:WID==320 ? 12 : 14}}>{info.storeWay}</Text></View>
                      <View style={[styles.list]}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#666',fontSize:WID==320 ? 12 : 14}}>{info.price}元</Text></View>
                      <View style={[styles.list]}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#666',fontSize:WID==320 ? 12 : 14}}>{info.boxWeigth}</Text></View>
                      <View style={[styles.list]}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#666',fontSize:WID==320 ? 12 : 14}}>{info.packWay}</Text></View>
                   </View>
                 }) : null}

             </ScrollView> : <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 12 : 14,color:'#777'}}>暂无数据</Text></View>}
          </View>
          {!this.state.loaded ? <View style={{justifyContent: 'center',alignItems: 'center',width:Dimensions.get('window').width,height:Dimensions.get('window').height-70,position:'absolute',top:70,left:0,}}>
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
  dateTitle: {
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'space-around',
    height:35,
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
    list:{
      flex:1,
      paddingTop:5,
      paddingBottom:5,
      borderBottomWidth:1,
      borderLeftWidth:1,
      borderColor:'#eee',
      justifyContent:'center',
      alignItems:'center',
    }
});
