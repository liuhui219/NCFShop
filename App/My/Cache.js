import React, { Component } from 'react';
import {
    View,
	StyleSheet,
    Navigator,
	TouchableOpacity,
	TouchableHighlight,
	Text,
	BackHandler,
	Image,
	Dimensions,
} from 'react-native';
import * as httpCache from 'react-native-http-cache';
import Styles from '../Style';
import Netinfo from '../NetInfo';
import Toast from '@remobile/react-native-toast';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
const WID = Dimensions.get('window').width;
export default class MyComponent extends Component {

    constructor(props) {
        super(props);
		    this._pressButton = this._pressButton.bind(this);
        BackHandler.addEventListener('hardwareBackPress', this._pressButton);
        this.state = {size:'0M',caches:false,info:'不需要清理'};
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
    componentDidMount() {
         httpCache.getCacheSize().then((value)=> {
			size=Math.round((value / 1024 / 1024) * 100) / 100 + 'M';
			if(value == 0){
				this.setState({size:'0M',caches:false,});
			}else{
				this.setState({size:size,caches:true,});
			}

		});
    }

	clear(){
		httpCache.clearCache().then((value)=> {
			this.setState({caches:false,info:'正在清理中'});
            this.timer = setTimeout(() => {

				this.setState({size:'0M',caches:false,info:'不需要清理'});

			},1000);
		});
	}

	componentWillUnmount() {
	  BackHandler.removeEventListener('hardwareBackPress', this._pressButton);
	  this.timer && clearTimeout(this.timer);
	}

    render() {
    return (
	   <View style={{flex:1,flexDirection:'column',}}>
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
  							<View style={{justifyContent:'center',flexDirection:'row',alignItems:'center'}}>
  										<Text style={{color:'white',fontSize:WID==320 ? 16 : 18}} allowFontScaling={false} adjustsFontSizeToFit={false}>清除缓存</Text>
  							</View>
  				   </View>
  				   <View style={{flex:1,justifyContent:'center'}}>

  				   </View>
			</View>
      <Netinfo  {...this.props}/>
			<View style={{flex:1,flexDirection:'column',backgroundColor:'#fff',}}>
				  <View style={{justifyContent:'center',alignItems:'center',width:Dimensions.get('window').width,marginTop:50}}>
				       <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#666',fontSize:WID==320 ? 16 : 18}}>可清理空间</Text>
				  </View>

				  <View style={{justifyContent:'center',alignItems:'center',width:Dimensions.get('window').width,marginTop:30}}>
				       <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{color:'#036EB8',fontSize:WID==320 ? 32 : 34}}>{this.state.size}</Text>
				  </View>

				  <View style={{paddingLeft:10,paddingRight:10,marginTop:20,}}>
				       <Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 12 : 14,color:'#aaa'}}>
					       缓存的图片，数据文件等将被清理，节省手机的存储空间。
					   </Text>
				  </View>

				  <View style={{marginTop:50,}}>
					  {this.state.caches ? <TouchableHighlight onPress={this.clear.bind(this)}   style={{borderRadius:4,marginLeft:30,marginRight:30,}}>
							<View style={{borderWidth:1,borderColor:'#ececec',borderRadius:4,paddingTop:10,paddingBottom:10,paddingLeft:80,paddingRight:80, justifyContent:'center',alignItems:'center',backgroundColor:'#036EB8'}}>
								<Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 16 : 18, color:'#fff'}} allowFontScaling={false}>一键清理</Text>
							</View>
					   </TouchableHighlight> : <View style={{borderWidth:1,borderColor:'#ececec',borderRadius:4,paddingTop:10,paddingBottom:10,paddingLeft:80,paddingRight:80,marginLeft:30,marginRight:30, justifyContent:'center',alignItems:'center',backgroundColor:'rgba(3, 110, 184, 0.57)'}}>
								<Text allowFontScaling={false} adjustsFontSizeToFit={false} style={{fontSize:WID==320 ? 16 : 18, color:'#fff'}} allowFontScaling={false}>{this.state.info}</Text>
	                      </View>}
				  </View>
			</View>
	  </View>
    );
    }
}
const styles = StyleSheet.create({
  tabView: {
    flex: 1,
    flexDirection: 'column',
	backgroundColor:'#fafafa',
  },
  card: {
    height:70,
    paddingTop:25,
	backgroundColor:'#4385f4',
	flexDirection:'row'
  },
  default: {
    height: 37,
    borderWidth: 0,
    borderColor: 'rgba(0,0,0,0.55)',
    flex: 1,
    fontSize: 13,

  },
});
