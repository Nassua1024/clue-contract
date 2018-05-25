
import { Flex, Picker, List, TextareaItem, Button, Toast, Modal, InputItem } from 'antd-mobile';
import './Fendan.less';
const FlexItem = Flex.Item;
const ListItem = List.Item;
const Http = Base
const {Api:URL} = Http.url
const alert = Modal.alert

class DefinePicker extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			extra:this.props.extra,
		    data:this.props.data, //pick下拉数据
			indexRow:this.props.indexRow, //行
			indexCol:this.props.indexCol, //列
			type:this.props.type
		};
	}
	componentWillReceiveProps(props){
		this.setState({
			extra:this.props.extra,
		  	data:this.props.data, //pick下拉数据
			indexRow:this.props.indexRow, //行
			indexCol:this.props.indexCol, //列
			type:this.props.type
		})
	}
	onPickerChange(v) {
		let { indexRow, indexCol, data, type } = this.state;

	    return	this.props.onSelect(indexRow, indexCol,v,type);
	}
	clkPicker(){
		let { indexRow, indexCol, data } = this.state;
		if(this.props.vals.disabled){
			if(indexCol==1){
				Toast.info('请先选择分馆',2)
			}else{
				Toast.info('请先选择姓名',2)
			}
		}
	}
	render(){
		const { extra, data,indexCol} = this.state;
		var s = this.props.vals.val == '' ? '' : [this.props.vals.val];
 		return(
 			<div onClick={()=> this.clkPicker()}>
				<Picker
		          	data={ this.props.data }
		          	title={ extra }
		          	cascade={ false }
		          	extra={ extra }
		          	value={ s }
		          	disabled={ this.props.vals.disabled }
		          	onChange={ (v) => this.onPickerChange(v) }
		        >
					<ListItem />
				</Picker>
 			</div>
		);
	}
}

class PickerWrap extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			indexRow:this.props.indexRow,
			data:this.props.data,
			showDelete:this.props.showDelete,
			type:this.props.type,
			vals:this.props.vals
		};
	}

	componentWillReceiveProps(props){
		this.setState({
			data:this.props.data,
			indexRow:this.props.indexRow,
			showDelete:props.showDelete,
			type:this.props.type,
			vals:this.props.vals
		});
	}
	onSelect(indexRow, indexCol,v,type){
		return this.props.onSelect(indexRow, indexCol,v,type);
	}
	handleChange(indexRow, indexCol, e, type) {

		const v = e.target.value;
		const reg = /^([0-9]{0,9})+(.[0-9]{0,2})?$/; 

		if(!reg.test(v) && v !== '') return false;

		return this.props.onSelect(indexRow, indexCol, v, type);
	}

	onBlur(e, type) {

		if(e.target.value === '') return false;

		const { indexRow } = this.state;
		let value = Number(e.target.value).toFixed(2);
		
		if(type == 'cc') {
			this.props.fendanParams.ccSubmenus[indexRow].score = value;
			this.setState(() => {
				return this.props.fendanParams.ccSubmenus[indexRow].score;
			})
		}
		else {
			this.props.fendanParams.storeSubmenus[indexRow].score = value;
			this.setState(() => {
				return this.props.fendanParams.storeSubmenus[indexRow].score;
			})
		}
	}

	removePicker(){
		const { indexRow,type } = this.state;
		this.props.remove(indexRow,type);
	}
	render(){
		const { indexRow,data, showDelete, vals, type } = this.state;
		return(
			<div className="pick-wrap">
			{
				this.props.type == 'cc' &&
				<ul>
					<li>
						<DefinePicker 
							extra='分馆' 
							data={ this.props.data[0] } 
							indexCol={ 0 } 
							vals={ this.props.vals[0] } 
							indexRow={ indexRow } 
							type={this.props.type} 
							onSelect={ this.onSelect.bind(this) } 
						/>
					</li>
					<li>
						<DefinePicker 
							extra='姓名' 
							data={ this.props.data[1] } 
							indexCol={ 1 } 
							vals={ this.props.vals[1] } 
							indexRow={ indexRow } 
							type={this.props.type} 
							onSelect={ this.onSelect.bind(this) } 
						/>
					</li>
					<li>
						<input 
							className="money" 
							type="tel" 
							onChange={ (e) => this.handleChange(indexRow, 2, e, this.props.type) } 
							onBlur={ (e) => this.onBlur(e, 'cc') }
							value={ this.props.fendanParams.ccSubmenus[indexRow].score }
							placeholder="金额"
						/>
					</li>
					<li onClick={ () => this.removePicker() } className={ showDelete }></li>
				</ul>
			}
			{
				this.props.type == 'store' &&
				<ul>
					<li>
						<DefinePicker 
							extra='分馆' 
							data={ this.props.data[0] } 
							indexCol={ 0 } 
							vals={ this.props.vals[0] } 
							indexRow={ indexRow } 
							type={this.props.type} 
							onSelect={ this.onSelect.bind(this) } 
						/>
					</li>
					<li>
						<input 
							className="money store-money" 
							type="tel"  
							onChange={ (e) => this.handleChange(indexRow, 1, e, this.props.type) } 
							onBlur={ (e) => this.onBlur(e, 'store') }
							value={ this.props.fendanParams.storeSubmenus[indexRow].score }
							placeholder="金额"
						/>
					</li>
					<li onClick={ () => this.removePicker() } className={ showDelete }></li>
				</ul>
			}
			</div>
		);
	}
}

class FendanModule extends React.Component {
	constructor(props){
		super(props);
		this.state={
			showDelete:['delete','delete'], //删除按钮显示状态
			deleteBtnText:['删除','删除'], //删除按钮显示文字
			addText:['添加CC','添加分馆'],
			defaultStore:'',//默认的分馆数据
			data:           //Picker数据初始
			[
				[
					[

					],
					[

					],
					[
						[{label:'10%',value:'0.1000'},
						{label:'20%',value:'0.2000'},
						{label:'30%',value:'0.3000'},
						{label:'40%',value:'0.4000'},
						{label:'50%',value:'0.5000'},
						{label:'60%',value:'0.6000'},
						{label:'70%',value:'0.7000'},
						{label:'80%',value:'0.8000'},
						{label:'90%',value:'0.9000'},
						{label:'100%',value:'1.0000'}]
					]
				]
			],
			dataStore:
			[
				[
					[],
					[
						[{label:'10%',value:'0.1000'},
						{label:'20%',value:'0.2000'},
						{label:'30%',value:'0.3000'},
						{label:'40%',value:'0.4000'},
						{label:'50%',value:'0.5000'},
						{label:'60%',value:'0.6000'},
						{label:'70%',value:'0.7000'},
						{label:'80%',value:'0.8000'},
						{label:'90%',value:'0.9000'},
						{label:'100%',value:'1.0000'}]
					]
				]
			],
			contractId:this.props.match.params.contractId,
			fendanParams:{        //提交参数
				reason:'',
				contractId:this.props.match.params.contractId,
				ccSubmenus:[{storeId:'',staffId:'',score:''}],/*ccSubmenus*/
				model:'',
				storeSubmenus:[{storeId:'',score:''}]
			},
			vals:[[{val:'',disabled:false},{val:'',disabled:true},{val:'',disabled:true}]], //实时改变picker值
			valStore:[[{val:'',disabled:false},{val:'',disabled:true}]],
			firstData:'',//原始分单比例，用以判断是否修改过分担比例
			firstStoreData:'',
			model:'', 

			contractPrice: 0, // 合同价格
			ccList: [], //cc业绩
		    storeList: [], //分馆业绩
		};
	}
	newDefaultData(){
		const { defaultStore } = this.state;
		var defaultData =
			[
				[ defaultStore ],
				[],
				[
					[
						{label:'10%',value:'0.1000'}, 
						{label:'20%',value:'0.2000'}, 
						{label:'30%',value:'0.3000'}, 
						{label:'40%',value:'0.4000'}, 
						{label:'50%',value:'0.5000'}, 
						{label:'60%',value:'0.6000'}, 
						{label:'70%',value:'0.7000'}, 
						{label:'80%',value:'0.8000'}, 
						{label:'90%',value:'0.9000'},
						{label:'100%',value:'1.0000'}
					]
				]
			]; //默认数据
			return defaultData
	}
	componentWillMount(){
		this.menuLIst();
		let { data,dataStore, defaultStore,vals,fendanParams, firstData,contractId,model } = this.state;
		const params = {
			method: 'POST',
			formData:true,
		}
        Http.ajax(`${URL}/changgui/selections/guowen-stores`, params).then((res) => {
            //解构赋值Toast.info('该馆没有CC',1)
            if(res.code==0){
	            const newArray = res.data.mappers.map(({id:value,text:label}) => ({label:label.toString(), value:value.toString()}))
	            defaultStore = newArray
	            data[0][0][0] = newArray;
	            dataStore[0][0][0] = newArray;
	            this.setState({
	            	data,
	            	defaultStore
	            },function(){
					var params1 = {
						method:"POST",
						formData:true,
						data:{
							contractId:contractId
						}
					}
					Http.ajax(`${URL}/changgui/contracts/contract-submenu-list`, params1).then((res) => {
					    if(res.code==0){
							
							const result = res.data.ccSubmenus;  //cc分单业绩
							const resultStore = res.data.storeSubmenus;  //馆业绩
							let contractPrice = res.data.needSubmenuScore;

					    	if(result){
					    		if(result!=0){
					    			this.defaultItem(result,0)
					    			this.setState({
					    				firstData:result
					    			})
					    		}
							}
							
					    	fendanParams.model = res.data.model
							
							if(resultStore && resultStore.length!=0){
					    		this.defaultItemStore(resultStore)
							}
							
					    	this.setState({
					    		fendanParams,
								firstStoreData:resultStore,
								contractPrice
					    	})

					    }else{
					    	Toast.info(res.message, 2);
					    }
					})
	            })
            }else{
            	Toast.info(res.message, 2);
            }
        })
	}
	// cc 分馆业绩列表
	menuLIst() {
		var params = {
			method:"POST",
			formData:true,
			data:{
				contractId:this.state.contractId
			}
		};

		Http.ajax(`${URL}/changgui/contracts/contract-confirm-submenu-list `, params).then((res) => {
			if(res && res.code == 0) {
				let ccList = res.data.ccSubmenus;
				let storeList = res.data.storeSubmenus;
				this.setState({ ccList, storeList });
			}
		})
	}
	addPicker(typeIndex){
		let { data, dataStore,  fendanParams, vals, valStore,addText } = this.state;
		if(typeIndex == 0){
			if(vals.length<=4){
				addText[typeIndex] += '<span class="ripple"></span>'
				fendanParams.ccSubmenus.push({storeId:'',staffId:'',score:''});
				vals.push([{val:'',disabled:false},{val:'',disabled:true},{val:'',disabled:true}]);
				data.push( this.newDefaultData() );
				this.setState({
					fendanParams,
					data,
					vals,
					addText
				});
			}else{
				Toast.info('最多5个', 1);
			}			
		}else if(typeIndex == 1){
			if(valStore.length<=4){
				addText[typeIndex] += '<span class="ripple"></span>'
				fendanParams.storeSubmenus.push({storeId:'',score:''})
				valStore.push([{val:'',disabled:false},{val:'',disabled:true}])
				var newDefaultStoreData = this.newDefaultData()
				newDefaultStoreData.splice(1,1)
				dataStore.push(newDefaultStoreData)
				this.setState({
					fendanParams,
					dataStore,
					valStore,
					addText
				})
			}else{
				Toast.info('最多5个', 1);
			}
		}
	}
	removePicker(indexRow,type){
		let { data, dataStore, fendanParams, vals, valStore } = this.state;
		if(type=='cc' && data.length>1){
			fendanParams.ccSubmenus.splice(indexRow,1);
			data.splice(indexRow,1);
			vals.splice(indexRow,1);
			this.setState({
				fendanParams,
				data,
				vals
			});
		}else if(type=='store' && dataStore.length>1){
			fendanParams.storeSubmenus.splice(indexRow,1);
			dataStore.splice(indexRow,1);
			valStore.splice(indexRow,1);
			this.setState({
				fendanParams,
				dataStore,
				valStore
			})
		}
	}
	deletePicker(typeIndex){
		const { deleteBtnText,showDelete } = this.state;
		if(deleteBtnText[typeIndex].match('删除') != null){
			showDelete[typeIndex] = 'delete show';
			deleteBtnText[typeIndex] = '取消<span class="ripple"></span>'
			this.setState({
				showDelete,
				deleteBtnText
			});
		}else{
			showDelete[typeIndex] = 'delete';
			deleteBtnText[typeIndex] = '删除<span class="ripple"></span>'

			this.setState({
				showDelete,
				deleteBtnText
			});
		}
	}
	defaultItemStore(resultStore){
		let { dataStore,fendanParams,valStore,defaultStore} = this.state;
		var _this =this;
		resultStore.map((item,index)=>{
			if(index==0){
				valStore[index][0].val = item.storeId ;
				valStore[index][1].val = item.score ;
				valStore[index][1].disabled = false ;
				dataStore[index][0][0] = defaultStore;
				fendanParams.storeSubmenus[index].storeId = item.storeId ;
				fendanParams.storeSubmenus[index].score = item.score ;
			}else{
				valStore.push([{val:item.storeId,disabled:false},{val:item.score,disabled:false}]);
				var newDefaultStoreData = _this.newDefaultData()
				newDefaultStoreData.splice(1,1)
				dataStore.push(newDefaultStoreData);
				fendanParams.storeSubmenus.push({storeId:item.storeId,score:item.score});
			}
		})
		this.setState({
			valStore,
			dataStore,
			fendanParams
		})
	}

	//初始化数据    CC
	defaultItem(result,index){
		let { data, fendanParams,vals,defaultStore } = this.state;
		if(index== result.length) return;
		let newArray;
		const params={
			method:'post',
			formData:true,
			data:{
				storeId:result[index].storeId
			}
		}

        Http.ajax(`${URL}/changgui/selections/store-ccs`, params).then((res) => {
			if(res.data.mappers!=null){
				if( res.data.mappers.length>0){
					newArray = res.data.mappers.map(({id:value,text:label}) => ({label:label.toString(), value:value.toString()}))
					var isDefect = newArray.filter((item)=>item.value==result[index].staffId)
					if(isDefect.length==0){
						newArray.push({label:result[index].ccName,value:result[index].staffId.toString()})
					}
					if(index==0){
						vals[index][1].disabled = false;
						vals[index][2].disabled = false;
						data[index][0][0]=defaultStore
						data[index][1][0]=newArray;
						vals[index][0].val=result[index].storeId.toString();
						vals[index][1].val=result[index].staffId.toString();
						vals[index][2].val=result[index].score.toString();
						fendanParams.ccSubmenus[index].storeId=result[index].storeId;
						fendanParams.ccSubmenus[index].staffId=result[index].staffId;
						fendanParams.ccSubmenus[index].score=result[index].score;
					}else{
						fendanParams.ccSubmenus.push({storeId:result[index].storeId,staffId:result[index].staffId,score:result[index].score});
						vals.push([{val:result[index].storeId.toString(),disabled:false},{val:result[index].staffId.toString(),disabled:true},{val:result[index].score.toString(),disabled:true}]);
						data.push( this.newDefaultData() );
						data[index][1][0]=newArray;
						vals[index][1].disabled = false;
						vals[index][2].disabled = false;
					}
					this.setState({
						vals,
						data,
						fendanParams
					},function(){
						var nextIndex = index+1;
						this.defaultItem(result,nextIndex)
					})
				}
			}
		})
	}
	//获取cc数据
	getName(row,col,v){
		let { data, fendanParams,vals,defaultStore } = this.state;

		let newArray;
		vals[row][col+1].disabled = false;
		const params={
			method:'post',
			formData:true,
			data:{
				storeId:v
			}
		}

		Http.ajax(`${URL}/changgui/selections/store-ccs`, params).then((res) => {

			if( res.data.mappers!=null){
				if( res.data.mappers.length>0){
					newArray = res.data.mappers.map(({id:value,text:label}) => ({label:label.toString(), value:value.toString()}))
					data[row][col+1][0]=newArray;
					vals[row][col].val=v;
					vals[row][col+1].val='';
					vals[row][col+2].val='';
					fendanParams.ccSubmenus[row].storeId=v;
					fendanParams.ccSubmenus[row].staffId='';
					fendanParams.ccSubmenus[row].score='';
					vals[row][col+2].disabled = true;
					this.setState({
						data,
						fendanParams,
						vals
					})
				}else{

					Toast.info('该馆没有CC',1)
				}
			}else{
				Toast.info('该馆没有CC',1)
			}
		})
	}
	onSelect(row,col,v,type){
		let { data, fendanParams,vals, valStore, contractPrice } = this.state;
		if(type=='cc'){
			if(col == 0){ //获取分馆store:'',name:'',rate:''
				if(vals[row][col].val != v[0]){
					this.getName(row,col,v[0])
				}
			}else if(col==1){ //获取cc
				fendanParams.ccSubmenus[row].staffId=v[0].toString();
				vals[row][col].val=fendanParams.ccSubmenus[row].staffId.toString();
				vals[row][col+1].disabled = false;
				this.setState({
					fendanParams,
					vals
				})
			}else if(col==2){//分单率
				var totalScore = 0;
				// fendanParams.ccSubmenus[row].score=v[0];
				fendanParams.ccSubmenus[row].score = v;
				fendanParams.ccSubmenus.map((item,index)=>{
					totalScore+=Number(item.score);
				})
				//判断是否超出合同金额
				if(totalScore > contractPrice){
					Toast.info(`CC业绩分单金额不可超过${contractPrice}元`,2)
					fendanParams.ccSubmenus[row].score=vals[row][col].val;
					return
				}else{
					vals[row][col].val=fendanParams.ccSubmenus[row].score.toString()
					this.setState({
						fendanParams,
						vals
				 	})
				}
			}		
		}else if(type=='store'){
			if(col == 0){
				fendanParams.storeSubmenus[row].storeId = v[0].toString();
				valStore[row][col].val = fendanParams.storeSubmenus[row].storeId;
				valStore[row][col+1].disabled = false;
				this.setState({
					fendanParams,
					valStore
				})
			}else if(col == 1){
				var totalScore = 0;
				// fendanParams.storeSubmenus[row].score=v[0];
				fendanParams.storeSubmenus[row].score = v;
				fendanParams.ccSubmenus.map((item,index)=>{
					totalScore+=Number(item.score);
				})
				//判断是否超出百分百
				if(totalScore > contractPrice){
					Toast.info(`分馆业绩分单金额不可超过${contractPrice}元`,2)
					fendanParams.storeSubmenus[row].score=valStore[row][col].val;
					return
				}else{
					valStore[row][col].val=fendanParams.storeSubmenus[row].score.toString()
					this.setState({
						fendanParams,
						valStore
				 	})
				}
			}
		}
	}
	writeText(v){
		let { fendanParams } = this.state
		fendanParams.reason = v.substring(0,50);
		this.setState({
			fendanParams
		})
	}
	//提交按钮
	commit(){
		const { fendanParams, firstData, firstStoreData, contractPrice } = this.state
		var totalScore = 0;
		var count = 0;
		var totalStoreScore = 0;
		var storeCount = 0;
		var canCommit = true;
		var counts = 0;
		var totalPrice = 0;
		/*if(fendanParams.ccSubmenus.length==firstData.length && fendanParams.storeSubmenus.length == firstStoreData.length && firstStoreData.length!=0){
			var len = 0
			fendanParams.ccSubmenus.filter((item1,index2)=>{
				var s =firstData.filter((item2,index2)=> item1.storeId == item2.storeId && item1.staffId == item2.staffId && item1.score==item2.score)

				if(s.length==1){
					len++
				}
			})
			if(fendanParams.ccSubmenus.length == len ){
				Toast.info('不需重复提交',1);
				canCommit = false
			}else{
				canCommit = true
			}

		}else{
			canCommit = true;
		}*/
		if(fendanParams.model=='MUSEUM_CC'){  //馆内cc分单规则
			if(fendanParams.storeSubmenus.length!=1){
				Toast.info('馆内CC分单分馆业绩只允许一个馆分单',2);
				canCommit = false;
				return
			}else{
				fendanParams.ccSubmenus.filter((item,index)=>{
					console.log(fendanParams.ccSubmenus)
					if(item.storeId == '') {
						Toast.info('请添加分馆', 2);
						canCommit = false;
						return false;
					}
					if(fendanParams.ccSubmenus[0].storeId != item.storeId){
						Toast.info('馆内CC分单不允许CC跨馆分单',2)
						canCommit = false;
						return
					}
					if(fendanParams.storeSubmenus[0].storeId!=item.storeId){
						Toast.info('馆内CC分单不允许馆不一致',2)
						canCommit = false;
						return
					}
					if(item.staffId == '') {
						Toast.info('请添加姓名', 2);
						canCommit = false;
						return false;
					}
					if(item.score == '') {
						Toast.info('请输入金额', 2);
						canCommit = false;
						return false;
					}
				})
			}
		}
		if(fendanParams.model == 'CROSS_CC'){//跨馆仅cc分单
			if(fendanParams.storeSubmenus.length!=1){
				Toast.info('跨馆仅CC分单分馆业绩只允许一个馆分单',2);
				canCommit = false;
				return
			}if(fendanParams.ccSubmenus.length<2){
				Toast.info('跨馆仅CC分单至少要两个CC',2);
				canCommit = false;
				return
			}else{
				// var count = 0 ;
				fendanParams.ccSubmenus.filter((item1,index1)=>{
					var s =fendanParams.ccSubmenus.filter((item2,index2) => item1.storeId!=item2.storeId);
					if(s.length!=0){
						counts++
					}
					// if(s.length!=0){
					// 	Toast.info('跨馆仅cc分单不允许同馆cc分单');
					// 	canCommit = false;
					// 	return
					// }
				})
				if(counts==0){
					Toast.info('跨馆仅CC分单至少需两个不同馆的CC参与分单',2);
					canCommit = false;
					return
				}
			}
		}
		if(fendanParams.model == 'CROSS_STORE'){//跨馆仅馆分单
			if(fendanParams.ccSubmenus.length!=1){
				Toast.info('跨馆仅馆分单只允许一个CC',2);
				canCommit = false;
				return
			}else{
				if(fendanParams.storeSubmenus.length<2){
					Toast.info('跨馆仅馆分单至少需两个馆参与分单',2);
					canCommit = false;
					return
				}else{
					fendanParams.storeSubmenus.filter((item1,index1)=>{
						var s = fendanParams.storeSubmenus.filter((item2,index2) => item1.storeId == item2.storeId && index1!=index2 );
						if(s.length!=0){
							Toast.info('跨馆仅馆分单不允许同馆分单',2);
							canCommit = false;
							return
						}
					})
					
				}
			}
		}
		if(fendanParams.model == 'CROSS_STORE_CC'){//跨馆，馆和cc都分单
			if(fendanParams.ccSubmenus.length<2){
				Toast.info('跨馆,馆和CC都分单至少要两个CC参与分单',2);
				canCommit = false;
				return
			}else if(fendanParams.storeSubmenus.length<2){
				Toast.info('跨馆,馆和CC都分单至少要两个馆参与分单',2);
				canCommit = false;
				return
			}else{
				fendanParams.storeSubmenus.filter((item1,index1)=>{
					var s = fendanParams.storeSubmenus.filter((item2,index2)=> item1.storeId==item2.storeId&&index1!=index2)
					if(s.length!=0){
						Toast.info('跨馆,馆和CC都分单不允许相同馆分单',2);
						canCommit = false;
						return
					}
				})
			}
		}
		if(canCommit){
			fendanParams.ccSubmenus.filter(( item1,index1 )=> {
				var isRep = fendanParams.ccSubmenus.filter((item2,index2)=> index1!=index2 && item1.storeId == item2.storeId && item1.staffId == item2.staffId && item1.storeId !='' && item2.storeId !='' &&  item1.staffId!=='' &&  item2.staffId!='')
				if(isRep.length!=0){
					Toast.info('CC信息重复',2)
					canCommit = false;
					return
				}
				// if(isRep.length==0){
				// 	canCommit = true;
				// }else{
				// 	Toast.info('cc信息重复',1)
				// 	canCommit = false;
				// 	return
				// }
			})
			fendanParams.storeSubmenus.filter(( item1,index1 )=> {
				var isRep = fendanParams.storeSubmenus.filter((item2,index2)=> index1!=index2 && item1.storeId == item2.storeId && item1.storeId !='' && item2.storeId !='')
				// console.log(isRep)
				if(isRep.length!=0){
					Toast.info('分馆信息重复',2)
					canCommit = false;
					return
				}
				// if(isRep.length==0){
				// 	canCommit = true;
				// }else{
				// 	Toast.info('分馆信息重复',2)
				// 	canCommit = false;
				// 	return
				// }
			})
		}
		if(canCommit){
			fendanParams.ccSubmenus.map((item,index)=>{
				if(item.weight==''){
					Toast.info('请把CC业绩分单信息填写完整',2)
					return
				}else{
					count++;
				}
				totalScore+=Number(item.score);
			})
			fendanParams.storeSubmenus.map((item,index)=>{
				if(item.weight==''){
					Toast.info('请把分馆业绩分单信息填写完整',2);
					return
				}else{
					storeCount++;
				}
				totalStoreScore+=Number(item.score);
			})
		}
		if(count == fendanParams.ccSubmenus.length && storeCount == fendanParams.storeSubmenus.length){
			if(totalScore != contractPrice){
				Toast.info('CC业绩分单金额有误',2)
				return
			}else if(totalStoreScore != contractPrice){
				Toast.info('分馆业绩分单金额有误',2)
				return
			}else if(fendanParams.reason == ''){
				Toast.info('请填写分单理由',2)
				return
			}else{
				const params = {
	        		method: 'POST',
	        		data:fendanParams
				}
				
				Http.ajax(`${URL}/contracts/create-contract-submenu`, params).then((res) => {
	        		if(res.code==0){
	        			alert('','分单申请成功，请等待审核', [
				      		{ text: '查看合同', onPress: () =>this.props.history.push(`/ContractDetail/${fendanParams.contractId}`) }
				    	])
	        		}else{
	        			alert(res.message)
	        		}
	      		})
			}
		}
	}
	changModel(model){
		let { fendanParams } = this.state
		fendanParams.model = model
		this.setState({
			fendanParams
		})
	}
	render(){
		const { data,dataStore, deleteBtnText, addText, showDelete, fendanParams, vals, valStore, model, contractPrice, storeList, ccList }= this.state;
		return(
			<div className="fendan base-css">
				{
					ccList.length > 0 &&
					<div className="title"><i></i><h3>CC业绩</h3></div>
				}
				{
					ccList.length > 0 &&
					<div className="cc-list">
						{ 
							ccList.map((item, index) => (
								<ul key={ index }>
									<li className="time">创建于{ item.createTime }</li>
									<li><span>{ item.ccName }：</span><span>{ item.score }元</span></li>
								</ul>
							))
						}
					</div>
				}
				{
					storeList.length > 0 &&
					<div className="title"><i></i><h3>分馆业绩</h3></div>
				}
				{
					storeList.length > 0 && 
					<div className="cc-list store-list">
						{ 
							storeList.map((item, index) => (
								<ul key={ index }>
									<li className="time">创建于{ item.createTime }</li>
									<li><span>{ item.storeName }：</span><span>{ item.score }元</span></li>
								</ul>
							))
						}
					</div>
				}
				<div className="title"><i></i><h3>合同价格</h3></div>
				<div className="contract-money"><span>合同价格：</span><span>{ contractPrice }元</span></div>
				<div className="title type-tit"><i></i><h3>分单类型</h3></div>
				<Flex className='fendan-type'>
					<Flex.Item onClick={this.changModel.bind(this,'MUSEUM_CC')}>
						<img src={fendanParams.model=='MUSEUM_CC' ? require('../../../../img/fendan_radio_on.png') : require('../../../../img/fendan_radio.png')} />
						<span>馆内CC分单</span>
					</Flex.Item>
					<Flex.Item onClick={this.changModel.bind(this,'CROSS_CC')}>
						<img  src={fendanParams.model=='CROSS_CC' ? require('../../../../img/fendan_radio_on.png') : require('../../../../img/fendan_radio.png')} />
						<span>跨馆仅CC分单</span>
					</Flex.Item>
				</Flex>
				<Flex className='fendan-type'>
					<Flex.Item onClick={this.changModel.bind(this,'CROSS_STORE')} >
						<img  src={fendanParams.model=='CROSS_STORE' ? require('../../../../img/fendan_radio_on.png') : require('../../../../img/fendan_radio.png')} />
						<span>跨馆仅馆分单</span>
					</Flex.Item>
					<Flex.Item onClick={this.changModel.bind(this,'CROSS_STORE_CC')}>
						<img  src={fendanParams.model=='CROSS_STORE_CC' ? require('../../../../img/fendan_radio_on.png') : require('../../../../img/fendan_radio.png')} />
						<span>跨馆,馆和CC都分单</span>
					</Flex.Item>
				</Flex>
				<div className="boxgroup">
				<div>
					<div className="title"><i></i><h3>CC业绩分单</h3>
					</div>
					{
						data.map((item,index) => (
							<PickerWrap 
								key={ index } 
								indexRow={ index } 
								vals={ vals[index] }  
								data = { item }  
								showDelete={ showDelete[0] } 
								type={"cc"} 
								onSelect={ this.onSelect.bind(this) } 
								remove={ this.removePicker.bind(this) } 
								fendanParams = { fendanParams }
							/>
						))
					}
					<Flex className="btn-wrap">
						<Flex.Item onClick={ () => this.addPicker(0) }  dangerouslySetInnerHTML={{__html:addText[0]}}></Flex.Item>
						<Flex.Item onClick={ () => this.deletePicker(0) } dangerouslySetInnerHTML={{__html:deleteBtnText[0]}}></Flex.Item>
					</Flex>
				</div>
				<div className='store-wrap'>
					<div className="title store-tit"><i></i><h3>分馆业绩分单</h3>
					</div>
					{
						dataStore.map((item,index) => (
							<PickerWrap 
								key={ index } 
								indexRow={ index } 
								vals={ valStore[index] }  
								data = { item }  
								showDelete={ showDelete[1] } 
								type={"store"} 
								onSelect={ this.onSelect.bind(this) } 
								remove={ this.removePicker.bind(this) } 
								fendanParams = { fendanParams }
							/>
						))
					}
					<Flex className="btn-wrap">
						<Flex.Item onClick={ () => this.addPicker(1) } dangerouslySetInnerHTML={{__html:addText[1]}}></Flex.Item>
						<Flex.Item onClick={ () => this.deletePicker(1) } dangerouslySetInnerHTML={{__html:deleteBtnText[1]}}></Flex.Item>
					</Flex>
				</div>
					<List>
						<TextareaItem
		            		title=""
				            placeholder="请填写分单理由"
				            data-seed="logId"
				            autoFocus
				            autoHeight
				            value={fendanParams.reason}
				            onChange={(v)=>this.writeText(v)}
				        />
			        </List>
		        </div>
		        <Button className="btn-css" onClick={()=> this.commit()}>提交分单</Button>
			</div>
		);
	}
}

export default FendanModule;