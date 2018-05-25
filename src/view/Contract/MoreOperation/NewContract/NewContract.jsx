
import { Flex, Button, Modal, Picker, List, InputItem, DatePicker, Toast, TextareaItem } from 'antd-mobile';
import ContractPreview from '../../ContractPreview/ContractPreview';
import SpecialDetail from '../ApplySpecial/SpecialDetail';
import PlanHour from '../../PlanHour/PlanHour';
import './NewContract.less';
import moment from 'moment';

const { connect } = ReactRedux;
const { Link } = ReactRouterDOM;
const prompt = Modal.prompt;
const alert = Modal.alert;
const minDate = moment(`${new Date(1900,0).Format('yyyy-MM-dd')} +0800`, 'YYYY-MM-DD Z').utcOffset(8);
const Http = Base;
const api = Base.url.Api; 

/*合同信息*/
class Contract extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			signDate: this.props.signDate, //签订日期
			dpValue: '', //选择签订日期
		};
	}

	/*选择合同签订日期*/
	pickerSignDate(v){
		
		if(v.format('YYYY-MM-DD') > new Date().Format('yyyy-MM-dd')){
			Toast.info('请选择有效的签订日期',1);
			return false;
		}
		
		this.setState({
			dpValue:v
		}, () => this.props.pickerSignDate(v.format('YYYY-MM-DD')) );
	}

	render(){
		const { signDate, dpValue } = this.state;
		return(
			<div className="contract-sign base-line">
				<div className="title"><h3>合同信息</h3></div>
				<ul>
					<li className="sign-date">
						<label>签订日期：</label>
						<DatePicker
         					mode="date"
				          	title="选择日期"
				         	extra={ signDate }
				          	value={ dpValue }
				          	onChange={ v => this.pickerSignDate(v) }
				          	minDate={ minDate }
        				>
        					<List.Item className="date-picker" />
        				</DatePicker>
        			</li>
					<li>
						<label>签&nbsp;&nbsp;订&nbsp;&nbsp;人：</label>
						<p>{ this.props.staffName }</p>
					</li>
				</ul>
			</div>
		);
	}
}

/*学员信息*/
class StudentInfo extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			studentName:'', //姓名
			brithDay:'', //出生日期
			dpValue:'', //选择出生日期
			gradeData:new Array(), //年级下拉列表数据
			gradeName:'', //年级名称
			sexData:[
				[
				    { label: '男', value: 'MALE' },
				    { label: '女', value: 'FEMALE' },
				]
  			],
			sex:'', //选择性别
			sexExtra:''
		};
	}

	componentWillReceiveProps(props) {
		this.setState({
			studentName: props.studentName,
			brithDay: props.brithDay,
			gradeName: props.gradeName,
			sexExtra: props.sex
		});
	}

	/*选择年级对应数据*/
	componentDidMount(){

		let { gradeData, gradeId } = this.state;
		const params = {};

		Http.ajax(`${api}/changgui/selections/select-grades`,params).then(res => {
			if(res.code == 0){

				const grades = res.data.grades;

				grades.map((item,index) => {
					if(this.props.gradeId == item.id){
						this.props.isTtto(item.isTtto);
					}
				})

				gradeData.push(grades.map(({id:value,name:label,isTtto}) => ({label,value,isTtto})));
				this.setState({
					gradeData,
				},);
			}
		});
	}

	/*姓名*/
	changeName(e){
		this.setState({
			studentName:Http.legInputName(e)
		},() => this.props.changeName(this.state.studentName));
	}

	/*性别*/
	changeSex(e){
		this.setState({
			sex:e
		},() => this.props.changeSex(e[0]));
	}

	/*出生日期*/
	pickerBirthDay(v){
		if(v.format && v.format('YYYY-MM-DD') > new Date().Format('yyyy-MM-dd')){
			Toast.info('请选择有效的出生日期',1);
			return false;
		}
		this.setState({
			dpValue:v
		},() => this.props.pickerBirthDay(v.format('YYYY-MM-DD')) );
	}

	/*年级*/
	pickerClass(v){

		let { gradeData, gradeName } = this.state;
		let isTtto = gradeData[0].filter((item) => item.value == v)[0].isTtto;
		gradeName = gradeData[0].filter((item) => item.value == v)[0].label;

		this.setState({
			gradeName
		},() => this.props.selectClass(v[0],gradeName,isTtto));
	}

	render(){
		
		const { gradeData, gradeName, studentName, sex, brithDay, dpValue, sexData, sexExtra } = this.state;

		return(
			<div className="student-info base-line">
				<div className="title"><h3>学员信息</h3></div>
				<ul>
					<li>
						<div className="name">
							<label>学员姓名：</label>
							<InputItem 
								className="i-put" 
								placeholder="请输入" 
								value={ studentName } 
								onChange={ v => this.changeName(v) } 
							/>
						</div>
						<div className="sex">
							<label>学员性别：</label>
							<Picker
						        data={ sexData }
						        title="性别"
						        cascade={ false }
						        extra={ sexExtra || '请选择' }
						        value={ sex }
						        onChange={ v => this.changeSex(v) }
						    >
						    	<List.Item className={ sexExtra == '' ? 'date-picker gray' : 'date-picker'} />
	       			    	</Picker>
						</div>
					</li>
					<li className="birth">
						<label>出生日期：</label>
						<DatePicker
         					mode="date"
				          	title="选择日期"
				         	extra={ brithDay }
				          	value={ dpValue }
				          	onChange={v => this.pickerBirthDay(v) }
				          	minDate={ minDate }
        				>
        					<List.Item className={ brithDay == '请选择' ? 'date-picker gray' : 'date-picker'} />
        				</DatePicker>
					</li>
					<li className="class">
						<label>年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;级：</label>
						<p>{ gradeName }</p>
						<Picker
					        data={ gradeData }
					        title="年级"
					        cascade={ false }
					        extra="修改"
					        onChange={ v => this.pickerClass(v) }
					    >
					    	<List.Item className="date-picker" />
       			    	</Picker>
       			    </li>
				</ul>
			</div>
		);
	}
}

/*赠送课时弹框*/
class PresentClassHour extends React.Component {
	constructor(props) {
    	super(props);
	    this.state = {
	    	presentHourModal:'',
	      	giftHour:'', // 选择赠送的课时数
	    };
	}

	componentWillReceiveProps(props){
		this.setState({
			presentHourModal:props.presentHourModal,
		});
	}

	/*确认赠送课时*/
	presentClassHour(){
		const { giftHour } = this.state;
		this.setState({
			presentHourModal:false,
			giftHour,
			iNow:-1
		},() => this.props.close(this.state.presentHourModal,this.state.giftHour,this.props.giftName) );
	}

	/*隐藏赠送课时弹框 x */
	close(){
		this.setState({
			presentHourModal:false,
			iNow:-1
		},() => this.props.close(this.state.presentHourModal) );
	}

	render(){
		let { presentHourModal, giftHour, iNow, title } = this.state;
		return(
			<div>
				<Modal 
					className="present-modal ht-hours-modal"
					title={ this.props.modalTit }
					visible={ presentHourModal } 
					transparent="true"
				>
					<div className="discount">
						<Flex className="list" wrap="wrap">
				      		{
				      			this.props.giftArray.map((item,index) =>{
				      				var activeName = iNow === index ? 'active' :'';
				      				return <div key={ index } onClick={ () => this.setState({ giftHour:item, iNow:index }) } className={ activeName }>{ item }</div>
				      			})
				      		}
				    	</Flex>
				    	<Button onClick={ () => this.presentClassHour() }>{ this.props.btnText }</Button>
				    	<i className="close" onClick={ () => this.close() }></i>
					</div>
	     		</Modal>
			</div>
		);
	}
}

/*合同详情*/
class ContractInfo extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			specialId:'', //特批申请Id 
			calcPrice:'',
			modalTit:'',
			btnText:'',
			contDetailState:false, //合同详情显示状态
			classData:new Array, //课时数据
			classId:'', //购买课时对应的id
			discountPrice:'', //打折优惠价格
			externalPrice:'', //原价支付价格
			validMonth:'', //合同有效期
			donateState:false, //赠送课时显示状态
			
			presentHourModal:false, //赠送课时弹框状态
			activityData:new Array(), //优惠活动下拉数据 

			activeState:false, //优惠活动显示状态
			activeName:'', //优惠活动名称
			activeContent: '', //优惠活动内容
			activeDisPrice:'', //优惠活动减免价格
			activeDisHour:'', //优惠活动赠送课时

			xyPrice:'', //续约赠送价格

			totalPrice:'', //总价
			
			packageHour:'', //选择的课时数

			giftName:'',
			giftArray:new Array(),

			crossDiscountArray:new Array(),
			crossDiscountPrice:'', //跨馆推荐优惠

			recommendArray:new Array(),
			recommendDiscountPrice:'', //口碑优惠

			presentHour:new Array(), //新签赠送课时列表
			newSignBonusHours:'', //新签赠送的课时数

			resignArray:new Array(),//续费合同赠送课时列表
			resignBonusHours:'', //续费合同赠送课时
		
			tttoArray:new Array(),//年级对应赠送课时列表
			tttoBonusHours:'', //年级对应赠送课时 isTtto
		
			publicArray:new Array(),//公益课赠送课时列表
			publicTransferHours:'', // 公益课赠送课时

			applyInfo:new Object(), 
			actualMoney:'', //实付金额
			note:'', //备注
			monDis: '',
			iputSpecialMon: '',
		};
		props.initClassHour(this.initClassHour.bind(this));
	}

	componentWillReceiveProps(props) {
		this.setState({
			monDis: props.monDis,
		});
	}

	/*初始化课时数*/
	initClassHour(){

		let { classData } = this.state;
		let isResign = '';
		
		if (this.props.history.location.search != '' && this.props.history.location.search.indexOf(':') < 0)
			isResign = true;
		else
			isResign = false;

		const params = {
			data:{
				leadId:this.props.leadId,
				isResign:isResign,
				leadStudentId:this.props.stuId == 'newStudent' ? '' : (this.props.stuId == 0 ? '' : this.props.stuId),
				storeId:this.props.storeId
			}	
		};
		
		Http.ajax(`${api}/changgui/selections/select-hour-packages`,params).then(res => {
			if(res.code == 0){
				this.setState({
					classData:res.data.hourPackages
				});
			}
		});
	}

	/*优惠活动列表*/
	initActiveity(gradeId,classId){

		let { activityData, activeState, monDis, totalPrice, actualMoney, iputSpecialMon } = this.state;
		
		activityData = new Array(); 
		actualMoney = (totalPrice - iputSpecialMon) * monDis;

		setTimeout(() => {
			this.setState({
				actualMoney
			},this.props.actualMoney(actualMoney,iputSpecialMon));
		},0)
		
		const params = {
			data:{
				gradeId:gradeId, 
				hourPackageId:classId,
				leadId:this.props.leadId
			}
		};

		Http.ajax(`${api}/changgui/selections/select-new-contract-activities`,params).then(res => {
			if(res.code == 0){

				const actitvities = res.data.actitvities;

				if(actitvities != ''){

					activityData.push(actitvities.map(({id:value,name:label,discountPrice,lessonGiftCnt}) => ({label,value,discountPrice,lessonGiftCnt})));
					
					this.setState({
						activityData,
						activeState:true,
					});

				}else{
					this.setState({
						activityData:new Array(),
						activeState:false,
					});
				}
			}
		});
	}

	/*选择课时显示对应的套餐数据*/
	selectClassHour(id){

		let { classId, packageHour, giftHour, resignBonusHours, validMonth, totalPrice, recommendDiscountPrice, activeDisPrice, calcPrice } = this.state;
		let { tttoBonusHours, publicTransferHours, newSignBonusHours, applyInfo, actualMoney, monDis, iputSpecialMon, crossDiscountPrice } = this.state;
		let crossDiscountArray = new Array();
		let recommendArray = new Array();
		let presentHour = new Array();
		let resignArray = new Array();
		let tttoArray = new Array();
		let publicArray = new Array();
		let isResign = '';

		this.setState({
			newSignBonusHours: 0,
			resignBonusHours: 0,
			tttoBonusHours: 0,
			publicTransferHours: 0
		});

		if (this.props.history.location.search != '' && this.props.history.location.search.indexOf(':') < 0) isResign = true;
		else isResign = false;
			
		if(classId == id) return false;

		if(this.props.gradeId != 0) this.initActiveity(this.props.gradeId,id);
			
		this.deleteAcivity();

		const params = {
			data:{
				leadId:this.props.leadId,
				isResign:isResign,
				leadStudentId:this.props.stuId == 'newStudent' ? '' : (this.props.stuId == 0 ? '' : this.props.stuId),
				storeId: this.props.storeId
			}	
		};

		Http.ajax(`${api}/changgui/selections/select-hour-packages`,params).then(res => {
			if(res.code == 0){

				res.data.hourPackages.map((item,i) => {
					if(item.id == id){

						/*新签*/
						if(item.bonusHours > 0){
							for(var i=0; i<=item.bonusHours; i+=2){
								presentHour.push(i);
							}
						}else{
							newSignBonusHours = 0;
							presentHour = new Array();
						}

						/*续费*/
						if(item.resignBonusHours > 0){
							for(var i=0; i<=item.resignBonusHours ; i+=2){
								resignArray.push(i);
							}
						}else{
							resignBonusHours = 0;
							resignArray = new Array();
						}

						/*3321赠送*/
						if(item.tttoBonusHours > 0){
							for(var i=0; i<=item.tttoBonusHours; i+=2){
								tttoArray.push(i);
							}
						}else{
							tttoBonusHours = 0;
							tttoArray = new Array();
						}

						/*公益课*/
						if(item.publicTransferHours > 0){
							for(var i=0; i<=item.publicTransferHours; i+=2){
								publicArray.push(i);
							}
						}else{
							publicTransferHours = 0;
							publicArray = new Array();
						}

						/*口碑优惠*/
						if(item.recommendDiscountPrice > 0){
							recommendArray = [0,300];
						}else{
							recommendDiscountPrice = '';
							recommendArray = new Array();
						}

						/*跨馆推荐*/
						if(item.crossDiscountPrice > 0){
							crossDiscountArray = [0,item.crossDiscountPrice];
						}else{
							crossDiscountPrice = '';
							crossDiscountArray = new Array();
						}

						validMonth = item.validMonth;
						totalPrice = item.externalPrice - item.discountPrice;
						calcPrice = totalPrice;

						actualMoney = Math.round((totalPrice - iputSpecialMon) * monDis);

						this.setState({
							contDetailState: true,
							classId: id,
							packageHour: item.hour,
							validMonth,

							totalPrice,
							calcPrice,
							externalPrice: item.externalPrice,
							discountPrice: item.discountPrice,

							crossDiscountArray,
							crossDiscountPrice,
							presentHour,
							tttoArray,
							recommendArray,
							publicArray,
							resignArray,
							actualMoney,
							reSignBonusHours: '', 
							tttoBonusHours: '',
							publicTransferHours: '', 
							recommendDiscountPrice: '',
							monDis,
						}, ()=> this.props.hourPackage(id,item.hour,item.externalPrice,item.discountPrice,actualMoney,validMonth,item.gradeId) ) ;
					}
				})
			}
		});
	}

	/*添加赠送课时*/
	addClassHour(v,Name){

		let { modalTit, btnText } = this.state;

		if(Name == 'recommendDiscountPrice') {
			modalTit = '口碑优惠';
			btnText = '确认口碑优惠';
		} else if(Name == 'crossDiscountPrice') {
			modalTit = '跨馆推荐优惠';
			btnText = '确认跨馆推荐优惠';
		}else{
			modalTit = '课时赠送';
			btnText = '确认课时赠送';
		}
		
		this.setState({
			presentHourModal:true,
			giftArray:v,
			giftName:Name,
			modalTit,
			btnText
		});
	}

	/*优惠活动下拉列表*/
	pickerActivity(v){

		let { activityData, activeName, activeContent, externalPrice, discountPrice, actualMoney, activeDisPrice, activeDisHour, calcPrice, xyPrice, totalPrice } = this.state;

		activeDisPrice = activityData[0].filter((item) => item.value == v)[0].discountPrice;
		activeDisHour = activityData[0].filter((item) => item.value == v)[0].lessonGiftCnt;
		activeName = activityData[0].filter((item) => item.value == v)[0].label;
		activeContent = (activeDisPrice != 0 ? ('减免' + activeDisPrice + '元 ') : '') + (activeDisHour != 0 ? ('赠送' + activeDisHour + '课时') : '');
		totalPrice = (calcPrice - xyPrice - activeDisPrice) > 0 ? (calcPrice - xyPrice - activeDisPrice) : 0;
		actualMoney = (totalPrice * this.props.monDis) > 0 ? (totalPrice * this.props.monDis) : 0;
		
		this.setState({
			activeName,
			activeContent,
			actualMoney,
			activeDisPrice,
			totalPrice,
			activeDisHour
		},() => this.props.activityPackage(v[0],actualMoney,activityData[0].filter((item) => item.value == v)[0].label,activeDisPrice,activeDisHour) ); //v[0]表示优惠活动id
	}

	close(e,giftHour,giftName){

		let { actualMoney, calcPrice, activeDisPrice, totalPrice } = this.state;

		if(giftHour != undefined){
			if(giftName == 'recommendDiscountPrice' || giftName == 'crossDiscountPrice'){

				totalPrice = calcPrice - giftHour - activeDisPrice;
				actualMoney = totalPrice * this.props.monDis;
				
				this.setState({
					presentHourModal:e,
					[giftName]: giftHour,
					xyPrice: giftHour,
					actualMoney,
					totalPrice
				}, () => this.props.giftHour(giftHour,giftName,actualMoney) );
			
			}else{
				this.setState({
					presentHourModal:e,
					[giftName]:giftHour,
				}, () => this.props.giftHour(giftHour,giftName) );
			}
		}else{
			this.setState({ presentHourModal: e });
		}
	}

	/*取消优惠活动*/
	deleteAcivity(){

		let { monDis, activeName, actualMoney, activeDisPrice, calcPrice, xyPrice, totalPrice, activeDisHour } = this.state;
		
		activeDisPrice = 0;
		activeDisHour = 0;
		totalPrice = calcPrice - activeDisPrice - xyPrice;
		actualMoney = calcPrice - activeDisPrice - xyPrice;

		this.setState({
			activeName:'',
			actualMoney,
			activeDisPrice,
			activeDisHour,
			monDis,
			totalPrice
		},() => this.props.delTotalPrice(actualMoney) );
	}

	/*特批额外减免金额*/
	actualMoney(v){

		let { totalPrice, actualMoney } = this.state;
		actualMoney = v !== '-' ? totalPrice - v : totalPrice;
				
		this.setState({
			iputSpecialMon: v,
			actualMoney
		}, () => this.props.actualMoney(actualMoney, v));
	}

	/*备注*/
	note(v){
		this.setState({
			note:v
		},() => this.props.note(v));
	}

	render(){

		const { contDetailState, presentHourModal, classData, classId, discountPrice, externalPrice, giftArray, recommendArray, modalTit, btnText } = this.state;
		const { validMonth, presentHour, activeState, activityData, activeName, totalPrice, resignArray, giftName, recommendDiscountPrice } = this.state;
		const { packageHour, newSignBonusHours, reSignBonusHours, tttoBonusHours, tttoArray, publicTransferHours, publicArray, applyInfo, applyType, actualMoney } = this.state;
		const { applyText, specialId, note, iputSpecialMon,activeContent, crossDiscountPrice, crossDiscountArray } = this.state;
			
		return(
			<div className="contract-info base-line">
				<div className="title"><h3>合同详情</h3></div>
				<div className="type">
					<label>合同类型：</label>
					<span className="contract-type">{ this.props.contractType }</span>
				</div>
				<div>
					<p className="type">购买课时：</p>
					<Flex wrap="wrap" className="single-select">
			      		{	
			      			classData.map((item,index) => {
								var objStyle = classId === item.id ? 'active inline' : 'inline';
								return (
									<div key = { index } onClick = { () => this.selectClassHour(item.id) } className = { objStyle }>{ item.hour }课时</div>
								);
							})
						}
			    	</Flex>
			    </div>
			    {
			    	contDetailState &&
			    	<ul className="detail-info">
						<li>
							<label>合同有效期：</label>
							<span>{ validMonth }个月</span>
						</li>
						<li>
							<label>原价：</label>
							<span>{ externalPrice }元</span>
						</li>
						{
							discountPrice != '' && 
							<li className="discount">
								<label>优惠：</label>
								<span>{ -discountPrice }元</span>
							</li>
						}

						{ /*口碑优惠*/ }
						{
							recommendArray.length > 0 &&
							<li>
								<label>口碑优惠：</label>
								{
									recommendDiscountPrice != '' && 
									<span>{ `-${recommendDiscountPrice}元` }</span>
								}
								
							</li>
						}
						{
							recommendArray.length > 0 &&
							<li>
								<label className="add">请添加口碑优惠：</label>
								<a href="javascript:void(0)" onClick={ () => this.addClassHour(recommendArray,'recommendDiscountPrice') } >添加</a>
							</li>
						}

						{ /*跨馆推荐优惠*/ }
						{
							crossDiscountArray.length > 0 &&
							<li>
								<label>跨馆推荐优惠</label>
								{
									crossDiscountPrice != '' && 
									<span>{ `-${crossDiscountPrice}元` }</span>
								}
								
							</li>
						}
						{
							crossDiscountArray.length > 0 &&
							<li>
								<label className="add">请添加跨馆推荐优惠：</label>
								<a href="javascript:void(0)" onClick={ () => this.addClassHour(crossDiscountArray,'crossDiscountPrice') } >添加</a>
							</li>
						}

						{ /*新签赠送*/ }
						{
							presentHour.length > 0 &&
							<li>
								<label>新签赠送：</label>
								{
									newSignBonusHours != '' &&
									<span>{ `${newSignBonusHours}课时` }</span>
								}
							</li>
							
 						}
 						{
 							presentHour.length > 0 &&
 							<li>
								<label className="add">请添加新签赠送：</label>
								<a href="javascript:void(0)" onClick={ () => this.addClassHour(presentHour,'newSignBonusHours') } >添加</a>
							</li>
 						}

 						{ /*续费赠送*/ }
 						{
 							resignArray.length > 0 &&
 							<li>
								<label className="add">续费赠送：</label>
								{
									reSignBonusHours != '0课时' &&
									<span>{ `${reSignBonusHours}课时` }</span>
								}
							</li>
 						}
 						{	
 							resignArray.length > 0 &&
 							<li>
								<label>请添加续费赠送：</label>
								<a href="javascript:void(0)" onClick={ () => this.addClassHour(resignArray,'reSignBonusHours') } >添加</a>
							</li>
 						}
 						
 						{ /*公益课转化赠送*/ }
 						{
 							publicArray.length > 0 &&
 							<li>
 								<label>公益课转化赠送：</label>
 								{
 									publicTransferHours != '' &&
 									<span>{ `${publicTransferHours}课时` }</span>
 								}
							</li>
						}
						{
							publicArray.length > 0 &&
 							<li>
								<label className="add">请添加公益课转化赠送：</label>
								<a href="javascript:void(0)" onClick={ () => this.addClassHour(publicArray,'publicTransferHours') } >添加</a>
							</li>
						}
						
						{ /*3321赠送*/ }
 						{
 							tttoArray.length > 0 && this.props.isTtto &&
 							<li>
 								<label>3321赠送：</label>
 								{
 									tttoBonusHours != '' &&
 									<span>{ `${tttoBonusHours}课时` }</span>
 								}
							</li>
						}
						{
							tttoArray.length > 0 && this.props.isTtto &&
 							<li>
								<label className="add">请添加3321赠送：</label>
								<a href="javascript:void(0)" onClick={ () => this.addClassHour(tttoArray,'tttoBonusHours') } >添加</a>
							</li>
						}

						{ /*优惠活动*/ }
 						{
 							activeState && this.props.gradeId != 0 &&
 							<li className="preferential">
								<label className="add">请选择优惠活动：</label>
								<Picker
							        data={ activityData }
							        title="优惠活动"
							        cascade={ false }
							        extra="选择"
							        onChange={ v => this.pickerActivity(v) }
							    >
							    	<List.Item className="picker-active" />
		       			    	</Picker>
							</li> 
 						}
 						{
 							activeName != '' &&
 							<li className='activity'>
								<label>{ activeName }</label>
								<Button onClick={() => alert('优惠活动', `确定删除优惠活动吗？`, [
							      		{ text: '取消' },
							      		{ text: '确定', onPress: () => this.deleteAcivity() },
							    	])}
							    >删除
							    </Button>
							</li>
 						}
 						{
 							activeName != '' &&
 							<li className='activity'>
 								<label>{ activeContent }</label>
 							</li>
 						}
						<li>
							<label>总计金额：</label>
							<span>{ totalPrice }元</span>
						</li>
						{
							this.props.applyType == 'DISCOUNT_SPECIAL' && 
							<li className="special" onClick={ () => this.props.goAddSpecial(this.props.specialId) }>
 								<label>金额特批：</label>
								<span>{ this.props.monDis*10 + '折' }</span>
 							</li>
						}
 						{
 							this.props.applyType == 'HOUR_SPECIAL' && 
	 						<li className="special" onClick={ () => this.props.goAddSpecial(this.props.specialId) }>
	 							<label>课时特批：</label>
								<span>{ this.props.HourGive + '课时' }</span>
	 						</li>
 						}
 						{	
 							this.props.applyType == 'OTHER_SPECIAL' && 
 							<li className="special">
 								<label>特批赠送课时：</label>
 								<input 
 									type="text" 
 									placeholder="请输入额外赠送课时" 
 									onChange={ v => this.props.specialHours(v.target.value) }
 								/>
 							</li>
 						}
 						{	
 							this.props.applyType == 'OTHER_SPECIAL' && 
 							<li className="special">
 								<label>特批减免金额：</label>
	 							<input 
	 								type="text" 
	 								placeholder="请输入额外减免金额"  
	 								value={ iputSpecialMon }
	 								onChange={ v => this.actualMoney(v.target.value) }
	 							/>
 							</li>
 						}
 						{
 							(this.props.applyType == 'OTHER_SPECIAL') && 
 							<li className="special">
								<label>{ this.props.applyText }</label>
								<a href="javascript:void(0)" onClick={ () => this.props.goAddSpecial(this.props.specialId) } >详情</a>
							</li>
 						}
 						<li className="total">
							<label>实付金额：</label>
							<strong>{ actualMoney }元</strong>
						</li>
					</ul>
			    }

			    {/*备注*/}
			    {
			    	contDetailState && 
			    	<div className="note">
			    		<label>合同备注：</label>
	    				<List>
							<TextareaItem
	            				placeholder="请输入合同备注"
			            		data-seed="logId"
			            		autoFocus
			            		autoHeight
			            		value={note}
			            		count="120"
			            		onChange={ (v) => this.note(v) }
			        		/>
			        	</List>
			    	</div>
			    }
			   
				<PresentClassHour 
					close={ (e,packageHour,giftName) => this.close(e,packageHour,giftName) } 
					modalTit={ modalTit }
					btnText={ btnText }
					giftName={ giftName } 
					giftArray={ giftArray } 
					presentHourModal={ presentHourModal } 
				/>
			</div>
		);
	}
}

/*联系人*/
class AddLinkMan extends React.Component {
	constructor(props) {
    	super(props);
    	this.state = {
      		linkModal: false, //添加联系人弹框状态
      		modalTitle:'', // 添加，修改联系人弹框标题
    		emergencyInfo:new Array, //紧急联系人信息
    		relat:'', //关系
    		name:'', //姓名
    		tel:'', //手机号
    		contactId:'', //修改联系人对应的Id
    		reg:/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/ //手机号正则
    	};
  	}

  	componentWillMount(){
		this.linkManList();		
  	}

  	/*联系人列表*/
  	linkManList(){

  		const params = { 
  			data:{
  				leadId:this.props.leadId
  			}
  		};

  		let { emergencyInfo } = this.state;

  		Http.ajax(`${api}/changgui/contacts`,params).then(res => {
  			if(res.code == 0){
  				res.data.contacts.map((item,i) => {
  					emergencyInfo.push(item)
				});
				this.setState({
					emergencyInfo
				},() => this.props.emergencyInfo(emergencyInfo) );
  			}
  		});
  	}
  	
  	/*显示添加、修改联系人弹框*/
  	showModal(_id,_relat,_name,_tel){
  		let { modalTitle, contactId, relat, name, tel } = this.state; 
  		if(_id){
  			modalTitle = '修改紧急联系人';
  			contactId = _id;
  			relat = _relat;
  			name = _name;
  			tel = _tel
  		}else{
  			modalTitle = '添加紧急联系人';
  			relat = '';
  			name = '';
  			tel = ''
  		}

  		this.setState({
  			linkModal:true,
  			modalTitle,
  			contactId, 
  			relat, 
  			name, 
  			tel
  		},() => {
  			this.refs.autofocusIpt.focus()
  		});
  	}

	/*添加、修改紧急联系人*/
	addLinkman(){

		const { modalTitle, emergencyInfo, linkModal, relat, name, tel, reg, contactId } = this.state;

		if(relat === ''){
			Toast.info('请输入关系',1);
			return false;
		}
		if(name === ''){
			Toast.info('请输入姓名',1);
			return false;
		}
		if(tel === ''){
			Toast.info('请输入手机号',1);
			return false;
		}
		if(!reg.test(tel.replace(/\s/g, ''))){
			Toast.info('请输入正确的手机号',1);
			return false;
		}

		let params = {
			method:'POST',
			formData:true, // form 表单
           	data:{
           		leadId:this.props.leadId,
           		emergency:true,
               	relation:relat,
               	name:name,
               	mobile:tel.replace(/\s/g, '')
			}
		};

		if(modalTitle == '添加紧急联系人'){
			Http.ajax(`${api}/changgui/contacts/add`,params).then( res => {
				if(res.code == 0){
					this.successCallBack();
				}
			});
		}

		if(modalTitle == '修改紧急联系人'){
			params.data.contactId = contactId
			Http.ajax(`${api}/changgui/contacts/edit`,params).then( res => {
				if(res.code == 0){
					this.successCallBack();
				}
			});
		}
	}  	

	/*删除紧急联系人*/
	deleteLinkman(contactId){

		const params = {
			method:'POST',
			formData:true, // form 表单
			data:{
				contactId:contactId
			}
		};

		Http.ajax(`${api}/changgui/contacts/delete`,params).then(res => {
			if(res.code == 0){
				this.successCallBack();
			}
		});
	}

	successCallBack(){
		this.setState({
			linkModal:false,
			relat:'',
			name:'',
			tel:'',
			emergencyInfo:new Array,
		}, () => this.linkManList() );
	}

	render(){
		let { linkModal, modalTitle, emergencyInfo, relat, name, tel, contactId } = this.state;
		
		return(
			<div className="linkman-wrap base-line">
				<div className="title"><h3>联系人信息</h3></div>

				{/*联系人*/}
				<div className="link-man">
					<ul>
						<li className="name">
							<label>联系人：</label>
							<span>{ this.props.linkName }</span>
						</li>
						<li className="tel">
							<label>联系电话：</label>
							<span>{ this.props.linkTel && this.props.linkTel.replace(/(^\d{3}|\d{4}\B)/g,"$1-") }</span>
						</li>
					</ul>
					<div className="add-linkman">
						<label>紧急联系人信息：</label>
						<a href="javascript:void(0)" onClick={ () => this.showModal() }>添加</a>
					</div>
				</div>

				{/*紧急联系人*/}
				{
					emergencyInfo.length !==0 &&
					<ul className="relat-wrap">
						{
							emergencyInfo.map((item,index) => {
								return (
									<li key={ index }>
										<p>{ item.relation }</p>
										<p>{ item.name }</p>
										<p>{ item.mobile.replace(/(^\d{3}|\d{4}\B)/g,"$1-") }</p>
										<Button onClick={() => this.showModal(emergencyInfo[index].id,item.relation,item.name,item.mobile) }>修改</Button>
										<Button onClick={() => alert('', `确定删除${item.name}吗？`, [
									      	{ text: '取消' },
									      	{ text: '确定', onPress: () => this.deleteLinkman(emergencyInfo[index].id) },
									    	])}
									    >删除
									    </Button>
									</li>
								);
							})
						}
					</ul>
				}

				{/*添加紧急、修改联系人弹框*/}
				<Modal 
					className="link-modal" 
					title={ modalTitle } 
					visible={ linkModal } 
					transparent={true}
					maskClosable ={true}
					transparent={true}
				>
					<ul className="link-info">
						<li className="relat">
							<label>关系：</label><span className="relat-name">{ this.props.studentName }</span><span>的</span>
							<input 
								className='modal-relationship'
								type='text'
								placeholder="请输入关系" 
								value={ relat } 
								maxLength='10' 
								ref='autofocusIpt'
								onChange={ v => this.setState({ relat:v.target.value.substring(0,10) }) } 
							/>
						</li>
						<li>
							<label>姓名：</label>
							<InputItem 
								className='modal-name'
								placeholder="请输入姓名" 
								value={ name } 
								maxLength='16' 
								onChange={ v => this.setState({ name:v }) } 
							/>
						</li>
						<li>
							<label>联系电话：</label>
							<InputItem
								className='modal-phone' 
								type="phone"
								placeholder="请输入电话" 
								value={ tel.replace(/\s/g, '-') }
								maxLength="13"
								onChange={ v => this.setState({ tel:v }) }
							/>
						</li>
					</ul>
					<Button className='close-btn' onClick={ () => this.setState({ linkModal:false })  }>取消</Button>
					<Button onClick={ () => this.addLinkman() }>确认提交</Button>
	      		</Modal>
			</div>
		);
	}
}

/*支付*/
class Pay extends React.Component {
    constructor(props){
        super(props);
        this.state = {
			totalPrice: '',
            cash: '',
            pos: '',
            aliPay: '',
            wechatPay: '',
            otherPay: '',
            inputVal: '', //输入的金额总和
            diffPrice: '', //支付金额和实际支付金额的差价
            tipState: false, //tip提示显示状态
        }
    }

    handleChange(val, inputType){
        this.setState({
        	[inputType]: val
        }, () => this.calcPay() )
    }

    calcPay(){

    	let { cash, pos, aliPay, wechatPay, otherPay, inputVal, diffPrice, tipState, totalPrice } = this.state;

    	inputVal = Number(cash) + Number(pos) + Number(aliPay) + Number(wechatPay) + Number(otherPay);
    	diffPrice = (this.props.totalPrice - inputVal).toFixed(2);

    	inputVal != 0 &&
    	this.setState({
			tipState,
			diffPrice
		}, () => this.props.calcPay(cash, pos, aliPay, wechatPay, otherPay) );
    }

    render(){
        const { tipState, diffPrice, tipText ,danwei } = this.state;
        return(
            <div className="pay-wrap">
                <div className="title up"><h3>支付</h3></div>
                {
                	diffPrice > 0 &&
                	<div className="tip">
                		<label>支付金额比合同金额少</label>
                		<span>元</span>
                		<span className="cash">{ diffPrice }</span>
                	</div>
                }
                {
                	diffPrice < 0 &&
                	<div className="tip">
                		<label>支付金额比合同金额多</label>
                		<span>元</span>
                		<span className="cash">{ -diffPrice }</span>
                	</div>
                }
                <List className="iput-wrap">
                    <InputItem 
                        className="cash" 
                        placeholder="请输入现金数额" 
                        onBlur={ (e) => this.handleChange(e,'cash') }
                    >
                        现金
                    </InputItem>
                    <InputItem 
                        className="pos" 
                        placeholder="请输入POS机数额" 
                        onBlur={ (e) => this.handleChange(e,'pos') }
                    >
                        POS机
                    </InputItem>
                    <InputItem 
                        className="wx" 
                        placeholder="请输入微信支付数额" 
                        onBlur={ (e) => this.handleChange(e,'wechatPay') }
                    >
                        微信支付
                    </InputItem>
                    <InputItem 
                        className="zfb" 
                        placeholder="请输入支付宝数额" 
                        onBlur={ (e) => this.handleChange(e,'aliPay') }
                    >
                        支付宝
                    </InputItem>
                    <InputItem 
                        className="other" 
                        placeholder="请输入其它付款方式数额" 
                        onBlur={ (e) => this.handleChange(e,'otherPay') }
                    >
                        其他
                    </InputItem>
                </List>
                
            </div>
        );
    }    
}

/*页面模块*/
class NewContract extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			isResign: false, //是否续费
			pageNew:'new-contract base-css', 
			redirctToPlan: 'plan-wrap hidden',
			redirctToPreview: false,
			showSpecial:false,

			originContractId:'', //合同Id 是否为续费合同
			leadId:'', //线索Id
			leadStuId:'', //学员Id

			staffName:'', //签订人
			storeId:'', //分馆Id
			signDate:new Date().Format('yyyy-MM-dd'), // 签订日期

			studentName:'', //姓名
			sex:'', //性别
			gender:'', //性别id
			brithDay:'请选择', //出生日期
			gradeName:'', //年级
			gradeId:'', //年级Id

			contractType:'新签合同', //合同类型
			validMonth:'', //合同有效期
			hourPackageId:'', //购买课时Id
			hourPackage:'', // 购买课时
			discountPrice:'', //优惠价格
			activityId:'', //优惠活动Id
			activeName:'', //优惠活动名称
			activeDisPrice:'', //优惠活动优惠价格
			activeDisHour: '', //优惠活动赠送课时
			isTtto:false, //是否赠送课时
			totalBonusHours:0, //总课时
			newSignBonusHours:0, //新签赠送课时
			reSignBonusHours:0, //续费赠送课时
			tttoBonusHours:0, //3321赠送课时
			publicTransferHours:0, //公益课转化赠送课时
			recommendDiscountPrice:0, //口碑优惠价格
			crossDiscountPrice: 0, //跨馆推荐优惠
			selectId: '',

			linkName:'', //联系人
			emergencyInfo:'', //紧急联系人列表
			linkTel:'', //联系电话

			externalPrice:'', //原价
			totalPrice:'', //总价
			cash:'', //现金
			pos:'', //pos
			aliPay:'', //支付宝
			wechatPay:'', //微信
			otherPay:'', //其他

			specialMon:0,
			monDis:1,
   			applyText:'',
   			applyType:'',
   			specialId:'',
   			HourGive:0,
			note:'', //备注

			totalHour: 0,
			contractCourseAllocations: [], // 规划课时
			originPublicContractId: null
		};
	}

	componentWillMount(){
		Http.keyCodeBack()
		this.getStaffInfo();
		this.initStuInfo();
		this.getSpecialInfo();
		
		this.setState({
			leadId:this.props.match.params.leadId,
			stuId:this.props.match.params.stuId == 'newStudent' ? '' : this.props.match.params.stuId
		});
	}

	/*获取线索下的学员信息*/
	initStuInfo(){
		
		let { stuId, originContractId, contractType, brithDay, isResign } = this.state;

		originContractId = this.props.history.location.hash || this.props.history.location.search.substring(1,this.props.history.location.search.length);

		stuId = this.props.match.params.stuId;

		const params = {
			data:{
				leadId:this.props.match.params.leadId
			}
		};

		// this.props.history.location.search.slice(-2) == ':0' 特批合同
		if(this.props.history.location.search != '' && this.props.history.location.search.slice(-2) != ':0') {
			isResign = true;
			contractType = '续费合同';
		}else{
			isResign = false;
			contractType = '新建合同';
			const hashName = this.props.history.location.hash;
			if (hashName.includes('#')) {
				this.setState({ originPublicContractId: hashName.slice(1) });
			}
		}
		
		Http.ajax(`${api}/changgui/leads/list-lead-students`,params).then(res => {
			if(res.code == 0){
				
				const leadInfo = res.data.leadInfo;
				
				this.setState({
					isResign,
					originContractId,
					contractType,
					linkName:leadInfo.contactName, //联系人姓名
					linkTel:leadInfo.contactPhone, //联系电话
					leadStuId:'newStudent'
				});

				if(stuId != 'newStudent') {

					const leadStudents = res.data.leadStudents;

					leadStudents.map((item,index) => {
						if( item.leadStudentId == stuId ){

							brithDay = (item.birthday != undefined && item.birthday != '') ? new Date(item.birthday).Format('yyyy-MM-dd') : '请选择';
							item.gradeName == '公益课' ? '' : item.gradeName;
							this.setState({
								leadStuId: item.leadStudentId,
								sex:item. genderName, //性别 页面显示
								gender: item.gender || '', //性别 数据传送
								gradeName: item.gradeName, //年级 
								gradeId: item.gradeId, //年级Id
								studentName: item.studentName, //学生姓名
								brithDay
							});
						}
					});	
				}				
			}
		});
	}

	/*获取cc个人信息*/
	getStaffInfo(){

		Http.ajax(`${api}/changgui/staffs/self-info`,{}).then(res => {
			if(res.code == 0){
				this.setState({
					staffName:res.data.selfInfo.name,
					storeId:res.data.selfInfo.storeId
				},() => this.initClassHour() );
			}
		});
	}

	/*特批合同信息*/
	getSpecialInfo() {

		if(this.props.history.location.search.slice(-2) != ':0')
			return false;

		const contractSpecialId = this.props.history.location.search.substring(1,this.props.history.location.search.length-2);
		let { monDis, HourGive, applyText, applyType } = this.state; 

        const param = {
            data: {
                leadId: this.props.match.params.leadId,
                limitUnused: true
            }    
        };

        Http.ajax(`${api}/changgui/get-specials`,param).then((res) => {
           	if(res.code == 0) {
           		if(res.data.contractSpecials.length > 0) {
	           		res.data.contractSpecials.map((item,index) => {

	           			if(item.contractSpecialId == contractSpecialId) {
	           				
	           				const data = res.data.contractSpecials[index];

	           				if(data.specialType == 'DISCOUNT_SPECIAL') {
	           					applyText = '';
	           					monDis = data.specialDiscount/100;
	           					HourGive =  0;
	           				}

	           				if(data.specialType == 'HOUR_SPECIAL') {
			           			applyText = '';
			           			monDis = 1;
			           			HourGive = data.specialGiftHour;
			           		}

			           		if(data.specialType == 'OTHER_SPECIAL') {
			           			applyText = '其它特批';
			           			monDis = 1;
			           			HourGive = 0;
			           		}

			           		this.setState({
			           			monDis,
			           			HourGive,
			           			applyText,
			           			applyType: data.specialType,
			           			specialId: data.contractSpecialId
			           		})
	           			}
	           		});
           		}
           	}
        });
	}

	/*选择合同签订日期*/
	pickerSignDate(v) {
		this.setState({ signDate: v });
	}

	/*姓名*/
	changeName(v){
		this.setState({ studentName: v });
	}

	/*性别*/
	changeSex(v){

		let { sex, gender } = this.state;
		
		if(v == 'MALE') sex="男";
		else sex="女";

		this.setState({
			gender:v,
			sex,
		});
	}

	/*出生日期*/
	pickerBirthDay(v){
		this.setState({ brithDay: v });
	}

	/*选择年级*/
	selectClass(v,gradeName,isTtto){
		this.setState({
			gradeId:v,
			gradeName,
			isTtto,
		},() => this.initActiveity(v) );
	}

	/*3321*/
	isTtto(isTtto){
		this.setState({ isTtto });
	}

	initActiveity(v){
		if(this.state.hourPackageId != 0) 
			this.refs.contractInfo.initActiveity(v,this.state.hourPackageId);

		this.refs.contractInfo.deleteAcivity(); 
	}

	/*选择课时*/
	hourPackage(classId,hourPackage,externalPrice,discountPrice,totalPrice,validMonth,selectId) {
		this.setState({
			hourPackageId:classId,
			hourPackage,
			externalPrice,
			discountPrice,
			totalPrice,
			validMonth,
			selectId: selectId,
			newSignBonusHours:0, 
			reSignBonusHours:0, 
			tttoBonusHours:0,
			publicTransferHours:0, 
			recommendDiscountPrice:0,
			crossDiscountArray: 0
		}, () => this.refs.iput.handleChange() );
	}

	/*赠送课时*/
	giftHour(giftHour,giftName,totalPrice){
		if(giftName == 'recommendDiscountPrice' || giftName == 'crossDiscountPrice')
			this.setState({
				totalPrice,
				[giftName]: giftHour
			}, () => this.refs.iput.handleChange() );
		else
			this.setState({ [giftName]: giftHour });
	}

	/*选择优惠活动*/
	activityPackage(v,totalPrice,activeName,activeDisPrice,activeDisHour){
		this.setState({
			activityId:v,
			totalPrice,
			activeName,
			activeDisPrice,
			activeDisHour
		}, () => this.refs.iput.handleChange() );
	}

	/*取消优惠活动*/
	delTotalPrice(v){
		this.setState({
			totalPrice: v,
			activityId: '',
			activeName: '',
			activeDisPrice: '',
			activeDisHour: 0
		}, () => this.refs.iput.handleChange() );
	}

	/*紧急联系人列表*/
	emergencyInfo(v){
		this.setState({ emergencyInfo: v });
	}

	/*其它特批赠送课时*/
	specialHours(v) {
		this.setState({ HourGive: v });
	}

	/*其它特批实际金额*/
	actualMoney(totalPrice, specialMon) {
		this.setState({
			totalPrice,
			specialMon
		}, () => this.refs.iput.handleChange() );
	}

	/*支付金额*/
	calcPay(cash, pos, aliPay, wechatPay, otherPay) {
		this.setState({
			cash,
			pos,
			aliPay,
			wechatPay,
			otherPay
		});
	}

	/*备注*/
	note(v) {
		this.setState({ note: v });
	}

	// 确认课时规划到预览
	redirctTo(data) {
		this.setState({
			redirctToPlan: 'hidden',
			redirctToPreview: true,
			contractCourseAllocations: data
		})
	}

	/*修改*/
	modify(){
		this.setState({
			pageNew:'new-contract base-css', 
			redirctToPreview: false
		});
	}

	/*合同详情*/
	linkTo(v){
        Http.keyCodeBack(true);
        this.props.history.push(`/ContractDetail/${v}`);
	}

	/*口碑合同*/
	praiseContract(v) {
        Http.keyCodeBack(true);
		this.props.history.push(`/PraiseContract/${v}`);
	}

	/*其它特批详情*/
	goAddSpecial(v) {
		this.setState({
			pageNew: 'new-contract base-css hidden',
			showSpecial: true,
			specialId: v
		});
	}

	/*特批合同详情返回*/
	back() {
		this.setState({
			pageNew:'new-contract base-css',
			showSpecial:false
		});
	}

	/*创建合同*/
	commit(){

		const { studentName, sex, brithDay, hourPackageId, gradeId, cash, pos, aliPay, wechatPay, otherPay, totalPrice, reg, note, specialMon, selectId } = this.state;
		const { reSignBonusHours, publicTransferHours, tttoBonusHours, newSignBonusHours, HourGive, activeDisHour, hourPackage } = this.state;
		const REGNUMBER = /^(\-|\+)?\d+(\.\d+)?$/;
		const REGMONEY = /^(-?[1-9][0-9]*)+(.[0-9]{0,2})?$/;

		if(studentName == ''){
			Toast.info('请输入学员姓名', 1);
			return false;
		}

		if(sex == ''){
			Toast.info('请选择性别', 1);
			return false;
		}

		if(brithDay == '请选择'){
			Toast.info('请选择出生日期', 1);
			return false;
		}

		if(gradeId == ''){
			Toast.info('请选择年级', 1);
			return false;
		}

		if(hourPackageId == ''){
			Toast.info('请选择课时', 1);
			return false;
		}

		if(selectId != null && gradeId !== selectId) {
			Toast.info('该年级不能选此课时套餐', 1);
			return false;
		}

		if (!REGNUMBER.test(Number(HourGive))) {
			Toast.info('请输入正确的特批课时', 1);
			return;
		}

		if (specialMon !== '' && !REGMONEY.test(specialMon)) {
			Toast.info('请输入正确的特批金额', 1);
			return;
		}

		if(cash === '' && pos === '' && aliPay === '' && wechatPay === '' && otherPay === '') {
			Toast.info('请输入支付金额', 1);
			return false;
		}

		const totalMoney = (Number(cash) + Number(pos) + Number(aliPay) + Number(wechatPay) + Number(otherPay)).toFixed(2);

		if (!REGMONEY.test(totalMoney)) {
			Toast.info('请输入正确的支付金额', 1);
			return;
		}

		if(totalMoney!= totalPrice){
			var str = '合同金额为' + totalPrice + '元';
			Toast.info(str,1);
			return false;
		}

		let totalHour = reSignBonusHours + publicTransferHours + tttoBonusHours + newSignBonusHours + Number(HourGive) + activeDisHour + hourPackage;

		this.setState({
			pageNew:'new-contract base-css hidden',
			redirctToPlan: 'plan-wrap show',
			totalHour
		});
	}

	render(){
		
		const { showSpecial, pageNew, redirctToPreview, redirctToPlan, staffName, contractType, leadId, leadStuId, sex, gradeName, studentName, stuId,
			brithDay, signDate, imgArr, gradeId, hourPackageId, discountPrice, activityId, totalPrice, cash, pos, totalHour,
			aliPay, wechatPay, otherPay, linkName, linkTel, isTtto, totalBonusHours, newSignBonusHours, reSignBonusHours, tttoBonusHours,
			publicTransferHours, recommendDiscountPrice, specialId, monDis, applyText, applyType, HourGive, storeId } = this.state;

		return(
			<div className="page-wrap">
				<div className={ pageNew }>
					<Contract 
						signDate = { signDate } 
						staffName = { staffName }
						pickerSignDate = { (v) => this.pickerSignDate(v) }
					/>
					<StudentInfo 
						studentName={ studentName } 
						sex={ sex } 
						brithDay={ brithDay }
						gradeId={ gradeId }
						gradeName={ gradeName }
						changeName={ v => this.changeName(v) }
						changeSex={ v => this.changeSex(v) } 
						pickerBirthDay={ v => this.pickerBirthDay(v) }
						selectClass={ (v,gradeName,isTtto) => this.selectClass(v,gradeName,isTtto) } 
						isTtto={ isTtto }
						isTtto={ v => this.isTtto(v) }
						actualMoney={ (v,d) => this.actualMoney(v,d) }
					/>
					<ContractInfo
						initClassHour={ (fn) => { this.initClassHour = fn } }
						{...this.props}
						leadId={ leadId }
						stuId = { stuId } 
						contractType={ contractType }
						hourPackageId={ hourPackageId }
						activityId={ activityId }
						totalPrice={ totalPrice }
						hourPackage={ (classId,hourPackage,externalPrice,discountPrice,totalPrice,validMonth,selectId) => this.hourPackage(classId,hourPackage,externalPrice,discountPrice,totalPrice,validMonth,selectId) }
						activityPackage={ (v,totalPrice,activeName,activeDisPrice,activeDisHour) => this.activityPackage(v,totalPrice,activeName,activeDisPrice,activeDisHour) }
						giftHour={ (num,name,totalPrice) => this.giftHour(num,name,totalPrice) }
						delTotalPrice={ v => this.delTotalPrice(v) }
						isTtto={ isTtto }
						totalBonusHours={ totalBonusHours }
						newSignBonusHours={ newSignBonusHours }
						reSignBonusHours={ reSignBonusHours }
						tttoBonusHours={ tttoBonusHours }
						publicTransferHours={ publicTransferHours }
						recommendDiscountPrice={ recommendDiscountPrice }
						gradeId={ gradeId }
						note={ (v) => this.note(v) }
						goAddSpecial={ (v) => this.goAddSpecial(v) }
						monDis={ monDis }
						HourGive={ HourGive }
						actualMoney={ (v,d) => this.actualMoney(v,d) }
						specialHours={ (v) => this.specialHours(v) }
	           			applyText={ applyText }
	           			applyType={ applyType }
	           			specialId={ specialId }
	           			storeId={ storeId }
						ref="contractInfo"
					/>
					<AddLinkMan 
						leadId={ leadId }
						linkName={ linkName }
						studentName={ studentName }
						linkTel={ linkTel }
						emergencyInfo={ (v) => this.emergencyInfo(v) }
					/>
					<Pay 
						cash={ cash }
						pos={ pos }
						aliPay={ aliPay }
						wechatPay={ wechatPay }
						otherPay={ otherPay }
						totalPrice={ totalPrice }
						calcPay={ (cash, pos, aliPay, wechatPay, otherPay) => this.calcPay(cash, pos, aliPay, wechatPay, otherPay) }
						ref="iput"
					/>
					<Button className="preview" onClick={ () => this.commit() }>下一步</Button>
				</div>
				<PlanHour 
					totalHour={ totalHour }
					className={ redirctToPlan }
					view={ JSON.stringify(this.state) }
					redirctTo={ (data) => this.redirctTo(data) } 
				/>
				{
					redirctToPreview && 
					<ContractPreview 
						view={ JSON.stringify(this.state) } 
						modify={ () => this.modify() } 
						linkTo={ (v)=> this.linkTo(v) } 
						praiseContract={ (v) => this.praiseContract(v) }
						leadStuId = { leadStuId }  
					/>
				}
				{
					showSpecial &&
					<SpecialDetail 
						specialId={ specialId }
						back={ () => this.back() }
					/>
				}
			</div>
		)
	}
}

export default NewContract;