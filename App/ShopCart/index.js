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
import Supply from '../Home/SupplyHall';
import Number from '../Number';
import Order from './Order';
import Toast from '@remobile/react-native-toast';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
var checkAlls = [];
var AllData = [];
var Main = [];
const WID = Dimensions.get('window').width;
export default class MyComponent extends Component {
  constructor() {
    super();
    this._pressButton = this._pressButton.bind(this);
    BackHandler.addEventListener('hardwareBackPress', this._pressButton);
    this.state={
      loaded:true,
      reload:false,
      dataMain:[],
      isRefreshing:false,
      IsEdit:true,
      datas:[],
      checkAlls:[],
      check:false,
      isDefault:false,
      AllData:[],
      loadedx:false,
      Main:[]
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

  CG(obj){
     var { navigator } = this.props;
     var that = this;
     if(navigator) {
         navigator.push({
             name: 'Supply',
             component: Supply,
             params:{
               reloadShop:function(obj){
                 that.getData();
               }
             }
         })
     }
  }

  componentDidMount(){
    checkAlls = [];
    AllData = [];
    Main = [];
    var that = this;
    DeviceEventEmitter.addListener('reloadShop',(datas) =>{
       that.getData();
    })
  }

  componentWillMount(){
       checkAlls = [];
       AllData = [];
       this.getData();

  }

  componentWillUnmount() {
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
    fetch('https://yzx.shixiweiyuan.com/shoppingCart/list', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: this.toQueryString({
         'token':data.result
        })
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
         checkAlls = [];
         AllData = [];
         Main = [];
         console.log(result)
         if(result.code == 0){
           result.result.groups.map((data,i)=>{
             var checks = [];
             var check = [];
             checks.push(false);
             data.list.map((info,j)=>{
               check.push(false);
             })
             checks.push(check)
             checkAlls.push(checks)
           })

           console.log(checkAlls)
            that.setState({
              loaded:false,
              IsEdit:true,
              reload:false,
              isRefreshing:false,
              checkAlls:checkAlls,
              AllData:AllData,
              isDefault:false,
              loadedx:false,
              Main:Main,
              datas:result.result.groups,
              dataMain:result.result.groups
            })

         }else{
           if(result.code == 10010){
             storage.clearMap();
             storage.remove({
               key: 'loginState'
             });
             global.data='';
             DeviceEventEmitter.emit('IsLoginout','true');
             Toast.showShortCenter(result.message)
           }else{
             Toast.showShortCenter(result.message)
           }
           that.setState({
             loaded:false,
             reload:true,
             IsEdit:true,
             isDefault:false,
             loadedx:false,
             isRefreshing:false,
           })

         }

      })
      .catch((error) => {
        that.setState({
          loaded:false,
          reload:true,
          loadedx:false,
          isRefreshing:false,
          isDefault:false
        })
         Toast.showShortCenter('您的系统繁忙')
      });
  }

  getDatas(){
    var that = this;
    fetch('https://yzx.shixiweiyuan.com/shoppingCart/list', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: this.toQueryString({
         'token':data.result
        })
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
         checkAlls = [];

         console.log(result)
         if(result.code == 0){
           result.result.groups.map((data,i)=>{
             var checks = [];
             var check = [];
             checks.push(false);
             data.list.map((info,j)=>{

               if(that.state.AllData.includes(info.id)){
                 check.push(true);
               }else{
                 check.push(false);
               }

               if(check.includes(false)){
                 checks[0] = false;
               }else{
                 checks[0] = true;
               }

             })
             checks.push(check)
             checkAlls.push(checks)
           })

           console.log(checkAlls)
            that.setState({
              loaded:false,
              IsEdit:true,
              reload:false,
              isRefreshing:false,
              checkAlls:checkAlls,

              isDefault:false,
              loadedx:false,

              datas:result.result.groups,
              dataMain:result.result.groups
            })

         }else{
           if(result.code == 10010){
             storage.clearMap();
             storage.remove({
               key: 'loginState'
             });
             global.data='';
             DeviceEventEmitter.emit('IsLoginout','true');
             Toast.showShortCenter(result.message)
           }else{
             Toast.showShortCenter(result.message)
           }
           that.setState({
             loaded:false,
             reload:true,
             IsEdit:true,
             isDefault:false,
             loadedx:false,
             isRefreshing:false,
           })

         }

      })
      .catch((error) => {
        that.setState({
          loaded:false,
          reload:true,
          loadedx:false,
          isRefreshing:false,
          isDefault:false
        })
         Toast.showShortCenter('您的系统繁忙')
      });
  }



  reloads(){
    this.getData();
    this.setState({
      loaded:true,
      reload:false,
    })
  }

  _onRefresh(){
    this.setState({
      isRefreshing:true,
    })
    this.getDatas();
  }

  click1(datad,num){
    var that = this;
    this.setState({
      loadedx:true,
    })
    fetch('https://yzx.shixiweiyuan.com/shoppingCart/update', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: this.toQueryString({
         'id': datad.id,
         'num':num,
         'token':data.result
        })
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {

         if(result.code == 0){

           that.state.Main.map((infos,i)=>{
             infos.list.map((info,j)=>{
               if(datad.id == info.id){
                 info.num = num;
               }
             })
           })
           console.log(that.state.Main)
           that.getDatas();
           that.setState({
             loadedx:false,
           })
         }else{
           that.setState({
             loadedx:false,
           })
           Toast.showShortCenter(result.message)
         }

      })
      .catch((error) => {
         that.setState({
          loadedx:false,
         })
         Toast.showShortCenter('您的系统繁忙')
      });
  }

  edit(){
    checkAlls = [];
    AllData = [];
    this.state.dataMain.map((data,i)=>{
      var checks = [];
      var check = [];
      checks.push(false);
      data.list.map((info,j)=>{
        check.push(false);
        checks.push(check)
      })
      checkAlls.push(checks)
    })
    this.setState({
      checkAlls:checkAlls,
      IsEdit:false,
      AllData:AllData,
      Main:[],
      isDefault:false,
    })

  }
  over(){

    checkAlls = [];
    AllData = [];
    this.state.dataMain.map((data,i)=>{
      var checks = [];
      var check = [];
      checks.push(false);
      data.list.map((info,j)=>{
        check.push(false);
        checks.push(check)
      })
      checkAlls.push(checks)
    })
    this.setState({
      checkAlls:checkAlls,
      IsEdit:true,
      AllData:AllData,
      Main:[],
      isDefault:false,
    })

  }

  checkbox(data,i,j,Mdata){
    var changes = this.state.checkAlls;
    var mains = this.state.Main;
    var isDefaults = false;
    var objs = {businessName:Mdata.businessName,businessPhone:Mdata.businessPhone,businessId:Mdata.businessId,list:[]}
    var array = [];
    var arrays = [];
    changes[i][1][j] = !this.state.checkAlls[i][1][j];
    if(changes[i][1].includes(false)){
      changes[i][0] = false;
    }else{
      changes[i][0] = true;
    }

   if(mains.length != 0){
     mains.forEach((infox,x)=>{
       if(infox.businessId == Mdata.businessId){
         infox.list.forEach((infos,y)=>{
           arrays.push(infos.id)
           if(infos.id == data.id){
             infox.list.splice(y, 1);
             if(infox.list.length == 0){
               mains.splice(x, 1);
             }
           }
           if(infox.list.length-1 == y && !arrays.includes(data.id)){
             infox.list.push(data)
           }
         })
       }else{
         objs.list.push(data);
         mains.push(objs)
       }
     })
   }else{
     objs.list.push(data);
     mains.push(objs)
   }
  console.log(mains)

    if(!AllData.includes(data.id)){

      AllData.push(data.id);

    }else{
      AllData.find(function(value, index, arr) {
        if(value == data.id){
          AllData.splice(index, 1);
        }
      })
    }

    changes.forEach((info,k)=>{
      array.push(info[0])
      if(array.includes(false)){
        isDefaults = false;
      }else{
        isDefaults = true;
      }
    })


    this.setState({
      checkAlls:changes,
      isDefault:isDefaults,
      AllData:AllData,
      Main:mains,
    })
  }

  checkboxAll(data,i){
    var changesAll = this.state.checkAlls;
    var mains = this.state.Main;
    var isDefaults = false;
    var array = [];
    changesAll[i][0] = !this.state.checkAlls[i][0];

    changesAll[i][1].forEach((info,index)=>{
      changesAll[i][1][index] = changesAll[i][0];
    })
    if(changesAll[i][0] == false){
      data.list.forEach((info,index)=>{
        AllData.find(function(value, index, arr) {
          if(value == info.id){
            AllData.splice(index, 1);
          }
        })
      })

      mains.forEach((info,x)=>{
        if(info.businessId == data.businessId){
          mains.splice(x, 1);
        }
      })

    }else{
      data.list.forEach((info,index)=>{
        if(!AllData.includes(info.id)){
          AllData.push(info.id);
        }
      })

      if(mains.length != 0){
        mains.forEach((info,x)=>{
          if(info.businessId == data.businessId){
            mains.splice(x, 1);
            mains.push(JSON.parse(JSON.stringify(data)))
          }
        })
      }else{
        mains.push(JSON.parse(JSON.stringify(data)))
      }
    }

    console.log(mains)


    changesAll.forEach((info,k)=>{
      array.push(info[0])
      if(array.includes(false)){
        isDefaults = false;
      }else{
        isDefaults = true;
      }
    })

    this.setState({
      AllData:AllData,
      checkAlls:changesAll,
      isDefault:isDefaults,
      Main:mains,
    })
  }

  AllSelect(){
    checkAlls = [];
    AllData = [];
    var mains = [];
    if(this.state.isDefault == false){
      this.state.dataMain.map((data,i)=>{
        var checks = [];
        var check = [];
        checks.push(true);
        mains.push(JSON.parse(JSON.stringify(data)))
        data.list.map((info,j)=>{
          AllData.push(info.id);
          check.push(true);
          checks.push(check)
        })
        checkAlls.push(checks)
      })

      this.setState({
        AllData:AllData,
        checkAlls:checkAlls,
        Main:mains,
        isDefault:true
      })
    }else{
      AllData = [];
      mains = [];
      AllData.length = 0;
      this.state.dataMain.map((data,i)=>{
        var checks = [];
        var check = [];
        checks.push(false);
        data.list.map((info,j)=>{
          check.push(false);
          checks.push(check)
        })
        checkAlls.push(checks)
      })
      this.setState({
        AllData:AllData,
        checkAlls:checkAlls,
        Main:[],
        isDefault:false
      })
    }
    console.log(mains)
  }

  delete(){
    var that = this;
    AllData = [];
    if(this.state.AllData.length == 0){
      Toast.showShortCenter('请选择要删除的商品')
      return false;
    }else{
      this.setState({
        loadedx:true,
      })
      fetch('https://yzx.shixiweiyuan.com/shoppingCart/del', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: this.toQueryString({
           'ids': this.state.AllData.join(','),
           'token':data.result
          })
        })
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {

           if(result.code == 0){
             that.getData();
             that.setState({
               AllData:AllData,
               loadedx:false,
             })
           }else{
             that.setState({
               AllData:AllData,
               loadedx:false,
             })
             Toast.showShortCenter(result.message)
           }

        })
        .catch((error) => {
           that.setState({
            AllData:AllData,
            loadedx:false,
           })
           Toast.showShortCenter('您的系统繁忙')
        });
    }
  }

  XJ(){
    if(this.state.Main.length == 0){
      Toast.showShortCenter('请选择商品')
      return false
    }else{
      var { navigator } = this.props;
      if(navigator) {
          navigator.push({
              name: 'Order',
              component: Order,
              params:{
                TatalData:this.state.Main
              }
          })
      }
    }

  }

  proLength(){
    var arr = 0;
    this.state.dataMain.map((info,i)=>{
      arr += info.list.length;

    })

    return arr;
  }

  render() {
    return (
      <View style={styles.container}>
          <View style={Styles.card}>
            <View style={{flex:1,justifyContent:'center'}}>
                 {this.props.isShowsback && this.props.isShowsback == 'back' ? <TouchableOpacity onPress={this._pressButton.bind(this)}>
                    <View style={{justifyContent:'flex-start',flexDirection:'row',alignItems:'center',}}>
                      <Icon name="angle-left" size={WID==320 ? 26 : 30} color="#fff" style={{width: 20,marginLeft:10,}} />
                      <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:WID==320 ? 14 : 16,marginLeft:-5,}}>返回</Text>
                    </View>
                </TouchableOpacity> : null}
            </View>
            <View style={{flex:1,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:WID==320 ? 16 : 18}}>进货单</Text>
                {this.state.dataMain.length != 0 ? <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:WID==320 ? 16 : 18}}>({this.proLength()})</Text> : null}
            </View>
            <View style={{flex:1,justifyContent:'center',alignItems:'flex-end',}}>
              {this.state.dataMain.length != 0 ? <View>
                {this.state.IsEdit ? <TouchableOpacity onPress={this.edit.bind(this)} activeOpacity={1}>
                  <View style={{paddingRight:10}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:WID==320 ? 14 : 16}}>编辑</Text></View>
                </TouchableOpacity> : <TouchableOpacity onPress={this.over.bind(this)} activeOpacity={1}>
                  <View style={{paddingRight:10}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'white',fontSize:WID==320 ? 14 : 16}}>完成</Text></View>
                </TouchableOpacity>}
              </View> : null}
            </View>
          </View>
          <Netinfo  {...this.props}/>

             {this.state.dataMain.length == 0 ? <ScrollView
               refreshControl={
                 <RefreshControl
                   refreshing={this.state.isRefreshing}
                   onRefresh={this._onRefresh.bind(this)}

                   colors={['#036EB8', '#00ff00', '#0000ff','#036EB8']}
                   progressBackgroundColor="#ffffff"
                 />
               }
               style={{flex:1,zIndex:9999,}}
                >
                 <View style={{justifyContent:'center',alignItems:'center',width:Dimensions.get('window').width,height:Dimensions.get('window').height-120,backgroundColor:'#fff'}}>
                 <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#A5A5A5',fontSize:WID==320 ? 14 : 16}}>暂时没有添加商品</Text></View>
                 <TouchableOpacity activeOpacity={1} onPress={this.CG.bind(this)}><View style={{marginTop:25,width:100,height:WID==320 ? 35 : 40,justifyContent:'center',alignItems:'center',backgroundColor:'#036EB8',borderRadius:20}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#fff',fontSize:WID==320 ? 14 : 16}}>去采购</Text></View></TouchableOpacity>
             </View></ScrollView> : null}
              {this.state.dataMain.length != 0 ? <View style={{flex:1,height:Dimensions.get('window').height}}>
                <ScrollView style={{flex:1,}}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.isRefreshing}
                    onRefresh={this._onRefresh.bind(this)}

                    colors={['#036EB8', '#00ff00', '#0000ff','#036EB8']}
                    progressBackgroundColor="#ffffff"
                  />
                }
                >
                     {this.state.dataMain.map((info,i)=>{
                       return <View key={i} style={{width:Dimensions.get('window').width,backgroundColor:'#fff',marginBottom:15}}>
                          <View style={{flex:1,flexDirection:'row',alignItems:'center',height:55,}}>
                             <TouchableOpacity onPress={this.checkboxAll.bind(this,info,i)} activeOpacity={1}>
                               <View style={{paddingLeft:10,paddingRight:10}}>
                                 {this.state.checkAlls[i][0] ? <Ionicons name="ios-checkmark-circle" size={WID==320 ? 24 : 30} color="#036EB8" /> : <Ionicons name="ios-radio-button-off" size={WID==320 ? 24 : 30} color="#999" />}
                               </View>
                             </TouchableOpacity>
                             <View style={{flex:1,height:55,borderBottomWidth:1,borderColor:'#eee',flexDirection:'row',alignItems:'center',}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#333',fontSize:WID==320 ? 14 : 16}}>{info.businessName}</Text></View>
                          </View>
                          {info.list.map((data,j)=>{
                            if(data.hasOwnProperty('price')){
                              return <View key={j} style={{flex:1,flexDirection:'row',alignItems:'center',paddingTop:15,paddingBottom:15,borderBottomWidth:1,borderColor:'#eee',}}>
                                 <TouchableOpacity onPress={this.checkbox.bind(this,data,i,j,info)} activeOpacity={1}>
                                     <View style={{paddingLeft:10,paddingRight:10}}>
                                       {this.state.checkAlls[i][1][j] ? <Ionicons name="ios-checkmark-circle" size={WID==320 ? 24 : 30 } color="#036EB8" /> : <Ionicons name="ios-radio-button-off" size={WID==320 ? 24 : 30} color="#999" />}
                                     </View>
                                 </TouchableOpacity>
                                 <View style={{flex:1,flexDirection:'row'}}>
                                   <View style={{width:WID==320 ? 80 : 100, height: WID==320 ? 80 : 100,overflow:'hidden'}}><Image style={{width:WID==320 ? 80 : 100, height: WID==320 ? 80 : 100,borderRadius:3,borderWidth:1,borderColor:'#ccc',}} source={{uri:data.thumbImgUrl}} /></View>
                                   <View style={{flex:1,paddingLeft:10,paddingRight:10,justifyContent:'space-between',}}>
                                      <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} numberOfLines={2} style={{fontSize:14,color:'#333',lineHeight:20}}>{data.title}</Text></View>

                                        <View style={{flexDirection:'row',}}>
                                          <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 12 : 13,color:'#777',}}>规格：</Text></View>
                                          <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} numberOfLines={1} style={{fontSize:WID==320 ? 12 : 13,color:'#777',}}>{data.spec}</Text></View>
                                        </View>
                                        <View style={{flexDirection:'row',}}>
                                          <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 12 : 13,color:'#777',}}>等级：</Text>
                                          <Text allowFontScaling={false} adjustsFontSizeToFit={false} numberOfLines={1} style={{fontSize:WID==320 ? 12 : 13,color:'#777',}}>{data.level}</Text>
                                        </View>

                                      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                          <View style={{flexDirection:'row',justifyContent:'center',alignItems:'flex-end'}}>
                                              <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:16,color:'#FF3E3F',}}>{data.price}</Text>
                                              <Text allowFontScaling={false} adjustsFontSizeToFit={false} numberOfLines={2} style={{fontSize:WID==320 ? 12 : 13,color:'#FF3E3F',}}>元/{data.unit}</Text>
                                          </View>
                                          <View style={{flexDirection:'row',}}><Number Onclick={this.click1.bind(this,data)} styles={{width:WID==320 ? 85 : 95,height:26}} btnstyle={{paddingLeft:5,paddingRight:5}} max={data.stock} min={data.batchNum} unit={data.unit} num={data.num} /></View>
                                      </View>
                                   </View>
                                 </View>
                              </View>
                            }else{
                              return <View key={j} style={{flex:1,flexDirection:'row',alignItems:'center',paddingTop:15,paddingBottom:15,borderBottomWidth:1,borderColor:'#eee',}}>
                                 <TouchableOpacity onPress={this.checkbox.bind(this,data,i,j,info)} activeOpacity={1}>
                                     <View style={{paddingLeft:10,paddingRight:10}}>
                                       {this.state.checkAlls[i][1][j] ? <Ionicons name="ios-checkmark-circle" size={30} color="#036EB8" /> : <Ionicons name="ios-radio-button-off" size={30} color="#999" />}
                                     </View>
                                 </TouchableOpacity>
                                 <View style={{flex:1,flexDirection:'row'}}>
                                   <View style={{width:100, height: 100,overflow:'hidden'}}><Image style={{width:100, height: 100,borderRadius:3,borderWidth:1,borderColor:'#ccc',}} source={{uri:data.thumbImgUrl}} /></View>
                                   <View style={{flex:1,paddingLeft:10,paddingRight:10,justifyContent:'space-between',}}>
                                      <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} numberOfLines={2} style={{fontSize:14,color:'#333',lineHeight:20}}>{data.title}</Text></View>
                                      <View style={{flexDirection:'row',}}>
                                        <View><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:13,color:'#777',}}>规格：</Text></View>
                                        <View style={{flex:1}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} numberOfLines={1} style={{fontSize:13,color:'#777',}}>{data.spec}</Text></View>
                                      </View>
                                      <View style={{flexDirection:'row'}}>
                                        <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:13,color:'#777',}}>等级：</Text>
                                        <Text allowFontScaling={false} adjustsFontSizeToFit={false} numberOfLines={1} style={{fontSize:13,color:'#777',}}>{data.level}</Text>
                                      </View>
                                      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                          <View style={{flexDirection:'row',justifyContent:'center',alignItems:'flex-end'}}>
                                              <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:16,color:'#FF3E3F',}}>商议</Text>
                                          </View>
                                          <View style={{flexDirection:'row',}}><Number Onclick={this.click1.bind(this,data)} styles={{width:95,height:26}} btnstyle={{paddingLeft:5,paddingRight:5}} max={data.stock} min={data.batchNum} unit={data.unit} num={data.num} /></View>
                                      </View>
                                   </View>
                                 </View>
                              </View>
                            }

                          })}

                       </View>
                     })}

                </ScrollView>
                {this.state.IsEdit ? <View style={{width:Dimensions.get('window').width,height:WID==320 ? 45 : 55,backgroundColor:'#fff',flexDirection:'row',justifyContent:'space-between'}}>
                   <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',height:WID==320 ? 45 : 55,borderTopWidth:1,borderColor:'#ddd'}}>

                       {this.state.AllData.length != 0 ? <View style={{flex:1,justifyContent:'center',alignItems:'center',marginRight:15}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 14 : 16,color:'#333',}}>共{this.state.AllData.length}种货品</Text></View> : null}
                   </View>
                   <TouchableOpacity onPress={this.XJ.bind(this)} activeOpacity={1} style={{height:WID==320 ? 45 : 55,width:120,alignItems:'center',justifyContent:'center',backgroundColor:'#FF3D3D',flexDirection:'row'}}>
                       <View style={{height:WID==320 ? 45 : 55,width:120,alignItems:'center',justifyContent:'center',backgroundColor:'#FF3D3D',flexDirection:'row'}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 16 : 18,color:'#fff',}}>询价</Text></View>
                   </TouchableOpacity>
                </View> : <View style={{width:Dimensions.get('window').width,height:WID==320 ? 45 : 55,backgroundColor:'#fff',flexDirection:'row',justifyContent:'space-between'}}>
                   <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',height:WID==320 ? 45 : 55,borderTopWidth:1,borderColor:'#ddd'}}>
                      <TouchableOpacity activeOpacity={1} onPress={this.AllSelect.bind(this)}>
                       <View style={{flexDirection:'row',height:WID==320 ? 45 : 55,alignItems:'center',paddingLeft:15,}}>
                          <View>{this.state.isDefault ? <Ionicons name="ios-checkmark-circle" size={WID==320 ? 24 : 30} color="#036EB8" /> : <Ionicons name="ios-radio-button-off" size={WID==320 ? 24 : 30} color="#999" />}</View>
                          <View style={{paddingLeft:5}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 14 : 16,color:'#333',}}>全部</Text></View>
                       </View>
                      </TouchableOpacity>
                   </View>
                   <TouchableOpacity onPress={this.delete.bind(this)} activeOpacity={1} style={{height:WID==320 ? 45 : 55,width:120,alignItems:'center',justifyContent:'center',backgroundColor:'#FF3D3D',flexDirection:'row'}}>
                      <View style={{height:WID==320 ? 45 : 55,width:120,alignItems:'center',justifyContent:'center',flexDirection:'row'}}><Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 16 : 18,color:'#fff',}}>删除</Text></View>
                   </TouchableOpacity>
                </View>}
             </View> : null}

          {this.state.loaded ? <View style={{justifyContent: 'center',alignItems: 'center',width:Dimensions.get('window').width,height:Dimensions.get('window').height-70,position:'absolute',top:70,left:0,backgroundColor:'#fff',zIndex:9999999}}>
   					<View style={styles.loading}>
   						<ActivityIndicator color="white"/>
   						<Text allowFontScaling={false} adjustsFontSizeToFit={false} style={styles.loadingTitle}>加载中……</Text>
   					</View>
 				 </View> : null}
          {this.state.reload ? <TouchableOpacity activeOpacity={1} onPress={this.reloads.bind(this)}  style={{justifyContent: 'center',alignItems: 'center',width:Dimensions.get('window').width,height:Dimensions.get('window').height-70,position:'absolute',top:70,left:0,backgroundColor:'#fff'}}>
            <View style={{justifyContent:'center',alignItems:'center',}}>

              <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:14,color:'#777'}}>点击屏幕，重新加载</Text>
            </View>
          </TouchableOpacity> : null}

          {this.state.loadedx ? <View style={{justifyContent: 'center',alignItems: 'center',width:Dimensions.get('window').width,height:Dimensions.get('window').height-70,position:'absolute',top:70,left:0,}}>
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
    backgroundColor:'#fff',
    paddingBottom:(DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'Simulator') ? 20 : 0,
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
});
