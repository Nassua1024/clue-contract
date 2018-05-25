
import { Flex, Button, Modal, Picker, List, InputItem, DatePicker, Toast } from 'antd-mobile';

import moment from 'moment';

import './../NewContract/NewContract.less';

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
			contractNo:'', //合同订单号
			signDate:this.props.signDate, //签订日期
			dpValue:'', //选择签订日期
			reg:/^[A-Za-z0-9]+$/,
		};
	}

	// 输入合同订单号
	inputContractNo(v){
		if(this.state.reg.test(v) || v == ''){
			this.setState({
				contractNo:v
			},() => this.props.inputContractNo(v) )
		}
	}

	/*验证合同单号*/
	validContract(v){
		const params = {
			data:{
				contractNo:v
			}
		};
		Http.ajax(`${api}/changgui/selections/check-contractno`,params).then(res => {
			
		});
	}

	/*选择合同签订日期*/
	pickerSignDate(v){
		this.setState({
			dpValue:v
		},() => this.props.pickerSignDate(v.format && v.format('YYYY-MM-DD')) );
	}

	render(){
		const { contractNo, signDate, dpValue } = this.state;
		return(
			<div className="contract-sign base-line">
				<div className="title"><h3>合同信息</h3></div>
				<ul>
					<li>
						<label>合同单号：</label>
						<InputItem 
							className="i-put" 
							value={ contractNo } 
							onChange={ v => this.inputContractNo(v) } 
							onBlur={ v => this.validContract(v) }
							placeholder="请输入合同单号" 
						/>
					</li>
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
			sex:'', //性别
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
		};
	}

	// 选择年级对应数据
	componentWillMount(){

		const params = {};
		let { gradeData } = this.state;
		
		Http.ajax(`${api}/changgui/selections/select-grades`,params).then(res => {
			if(res.code == 0){
				gradeData.push(res.data.grades.map(({id:value,name:label}) => ({label,value})));
				this.setState({
					gradeData,
				});
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
		},() => this.props.pickerBirthDay(v.format && v.format('YYYY-MM-DD')) );
	}

	/*年级*/
	pickerClass(v){
		let { gradeData, gradeName } = this.state;
		gradeName=gradeData[0].filter((item) => item.value == v)[0].label;
		this.setState({
			gradeName
		},() => this.props.selectClass(v[0],gradeName));
	}

	render(){
		const { gradeData, gradeName, studentName, sex, brithDay, dpValue, sexData } = this.state;
		return(
			<div className="student-info base-line">
				<div className="title"><h3>学员信息</h3></div>
				<ul>
					<li>
						<div className="name">
							<label>学员姓名：</label>
							<InputItem 
								className="i-put" 
								value={ studentName }
								placeholder="请输入"
								maxLength="11" 
								onChange={ v => this.changeName(v) } 
							/>
						</div>
						<div className="sex">
							<label>学员性别：</label>
							<Picker
						        data={ sexData }
						        title="性别"
						        cascade={ false }
						        extra='请选择'
						        value={ sex }
						        onChange={ v => this.changeSex(v) }
						    >
						    	<List.Item className={ sex == '' ? 'date-picker gray' : 'date-picker'} />
	       			    	</Picker>
						</div>
					</li>
					<li className="birth">
						<label>出生日期：</label>
						<DatePicker
         					mode="date"
				          	title="选择日期"
				         	extra='请选择'
				          	value={ dpValue }
				          	onChange={v => this.pickerBirthDay(v) }
				          	minDate={ minDate }
        				>
        					<List.Item className={ dpValue == '' ? 'date-picker gray' : 'date-picker'} />
        				</DatePicker>
					</li>
					<li className="class">
						<label>年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;级：</label>
						<p>{ gradeName }</p>
						<Picker
					        data={ gradeData }
					        title="年级"
					        cascade={ false }
					        extra="选择"
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

/*合同详情*/
class ContractDetail extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			totalHours:'', //总课时数
			restHour:'', //剩余课时数
			originalPrice:'', //原价
			relPrice:'', //实际支付金额
		}
	}

	componentWillMount(){
		const params = {
            data:{
               contractId:this.props.contractId
            }
        };

        Http.ajax(`${api}/changgui/contracts/detail`,params).then(res => {
            if(res.code == 0){
                const contractDetail = res.data.contractDetail;
                this.setState({
                    contractDetail,
                    totalHours:contractDetail.totalHours,
                    restHour:contractDetail.restHour,
                    originalPrice:contractDetail.totalPrice,
                    relPrice:contractDetail.actualPrice,
                });
            }
        });
	}

	render(){
		const { totalHours, restHour, originalPrice, relPrice } = this.state;
		return(
			<div className="base-line">
				<div className="title"><h3>合同详情</h3></div>
				<div className="c-type">
					<label>合同类型：</label>
					<span className="contract-type">转让合同</span>
				</div>
				<ul className="contract-msg">
	                <li>
	                    <label>原课时数：</label>
	                    <span>{ totalHours }课时</span>
	                </li>
	                <li>
	                    <label>剩余课时：</label>
	                    <span>{ restHour }课时</span>
	                </li>
	                <li>
	                    <label>原价：</label>
	                    <span>{ originalPrice }元</span>
	                </li>
	                <li>
	                    <label>实付金额：</label>
	                    <strong>{ relPrice }元</strong>
	                </li>
	            </ul>
			</div>
		);
	}
}

/*联系人*/
class AddLinkMan extends React.Component {
	constructor(props) {
    	super(props);
    	this.state = {
    		contactName:'', //联系人姓名
      		linkModal: false, //添加联系人弹框状态
      		modalTitle:'', // 添加，修改联系人弹框标题
    		emergencyInfo:new Array, //紧急联系人信息
    		relation:'', //关系
    		name:'', //姓名
    		mobile:'', //手机号
    		iNow:-1, //修改联系人的下标
    		reg:/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/ //手机号正则
    	};
  	}

  	/*联系人姓名*/
  	contactName(v){
  		this.setState({
  			contactName:v
  		},this.props.contactName(v));
  	}

  	/*显示添加、修改联系人弹框*/
  	showModal(index,_relat,_name,_tel){

  		let { modalTitle, iNow, relation, name, mobile } = this.state; 

  		if(index != undefined){
  			modalTitle = '修改紧急联系人';
  			iNow = index,
  			relation = _relat;
  			name = _name;
  			mobile = _tel
  		}else{
  			modalTitle = '添加紧急联系人';
  			relation = '';
  			name = '';
  			mobile = ''
  		}

  		this.setState({
  			linkModal:true,
  			modalTitle,
  			iNow,
  			relation, 
  			name, 
  			mobile
  		},()=>{
  			var autofocusIpt = document.getElementsByClassName('autofocus-transfer')[0];
            autofocusIpt.focus();
  		});
  	}

	/*添加、修改紧急联系人*/
	addLinkman(){

		const { modalTitle, emergencyInfo, linkModal, relation, name, mobile, reg, iNow } = this.state;
		let linkInfo = new Object();

		if(relation === ''){
			Toast.info('请输入关系',1);
			return false;
		}
		if(name === ''){
			Toast.info('请输入姓名',1);
			return false;
		}
		if(mobile === ''){
			Toast.info('请输入手机号',1);
			return false;
		}
		
		if(!reg.test(mobile.replace(/\s/g, ''))){
			Toast.info('请输入正确的手机号',1);
			return false;
		}

		/*添加联系人*/
		if(modalTitle == '添加紧急联系人'){
			linkInfo.relation = relation;
			linkInfo.name = name;
			linkInfo.mobile = mobile.replace(/\s/g, '');
			emergencyInfo.push(linkInfo);
		}

		/*修改联系人*/
		if(modalTitle == '修改紧急联系人'){
			emergencyInfo[iNow].relation = relation;
			emergencyInfo[iNow].name = name;
			emergencyInfo[iNow].mobile = mobile.replace(/\s/g, '');
		}
		
		this.setState({
			linkModal:false,
			emergencyInfo,
			relation, 
  			name, 
  			mobile
		},() => this.props.emergencyInfo(emergencyInfo) );
	}  	

	/*删除紧急联系人*/
	deleteLinkman(v){

		const { emergencyInfo } = this.state;
		
		emergencyInfo.splice(v,1);
		
		this.setState({
			emergencyInfo
		});
	}

	render(){
		let { linkModal, modalTitle, emergencyInfo, relation, name, mobile, contactId, contactName } = this.state;
		return(
			<div className="linkman-wrap">
				<div className="title"><h3>联系人信息</h3></div>

				{/*联系人*/}
				<div className="link-man relat-msg">
					<ul>
						<li className="name">
							<label>联系人：</label>
							<InputItem 
								className="i-put input-name" 
								value={ contactName }
								placeholder="请输入" 
								onChange={ v => this.contactName(v) } 
							/>
						</li>
						<li className="tel">
							<label>联系电话：</label>
							<span>{ this.props.contactPhone.replace(/(^\d{3}|\d{4}\B)/g,"$1-") }</span>
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
										<Button onClick={() => this.showModal(index,item.relation,item.name,item.mobile) }>修改</Button>
										<Button onClick={() => alert('', `确定删除${item.name}吗？`, [
									      	{ text: '取消' },
									      	{ text: '确定', onPress: () => this.deleteLinkman(index) },
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
					transparent
					style={{ width:'auto' }}
				>
					<ul className="link-info">
						<li className="relat">
							<label>关系：</label>
							<span className="relat-name">{ this.props.studentName }</span><span>的</span>
							{/*<InputItem 
								placeholder="请输入关系" 
								value={ relation } 
								maxLength="10" 
								onChange={ v => this.setState({ relation:v }) } 
								className='autofocus-transfer'
							/>*/}
							<input 
								placeholder="请输入关系" 
								value={ relation } 
								maxLength="10" 
								onChange={ v => this.setState({ relation:v.target.value }) } 
								className='autofocus-transfer modal-relationship'
							/>
						</li>
						<li>
							<label>姓名：</label>
							<InputItem 
								placeholder="请输入姓名" 
								value={ name } 
								maxLength="16" 
								onChange={ v => this.setState({ name:v }) } 
							/>
						</li>
						<li>
							<label>联系电话：</label>
							<InputItem 
								placeholder="请输入电话" 
								value={ mobile.replace(/\s/g, '-') } 
								type='phone'
								onChange={ v => this.setState({ mobile:v }) } 
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

/*页面模块*/
class TransferDetail extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			contractId:this.props.match.params.contractId,
			originContractId:'',
			reason:'',
			contractNo:'', //合同订单号
			signDate:new Date().Format('yyyy-MM-dd'), // 签订日期
			staffName:'', //签订人
			contactName:'', // 联系人
			contactPhone:'', // 联系人电话
			studentName:'学员', //姓名
			sex:'', //性别
			gender:'', //性别id
			brithDay:'', //出生日期
			gradeName:'', //年级
			gradeId:'', //年级Id
			contractType:'', //合同类型
			validMonth:'', //合同有效期
			contacts:new Array(), //联系人列表
			externalPrice:'', //原价
			totalPrice:'', //总价
		};
	}

	componentWillMount(){
		const transfer = JSON.parse(localStorage.getItem('transfer'));
		this.getStaffInfo();
		this.setState({
			originContractId:transfer.contractId,
			contactPhone:transfer.mobile.replace(/\s/g, ''),
			reason:transfer.reason
		});
	}

	/*获取cc个人信息*/
	getStaffInfo(){

		const params = {
			data:{}
		};

		Http.ajax(`${api}/changgui/staffs/self-info`,params).then(res => {
			if(res.code == 0){
				this.setState({
					staffName:res.data.selfInfo.name
				});
			}
		});
	}

	/*输入合同订单号*/
	inputContractNo(v){
		this.setState({
			contractNo:v
		});
	}

	/*选择合同签订日期*/
	pickerSignDate(v){
		this.setState({
			signDate:v
		});
	}

	/*学员姓名*/
	changeName(v){
		this.setState({
			studentName:v
		});
	}

	/*性别*/
	changeSex(v){

		let { sex, gender } = this.state;
		
		if(v == 'MALE'){
			sex="男"
		}else{
			sex="女"
		} 

		this.setState({
			gender:v,
			sex,
		});
	}

	/*出生日期*/
	pickerBirthDay(v){
		this.setState({
			brithDay:v
		});
	}

	/*选择年级*/
	selectClass(v,gradeName){
		this.setState({
			gradeId:v,
			gradeName:gradeName
		});
	}

	/*联系人姓名*/
	contactName(v){
		this.setState({
			contactName:v
		});
	}

	/*紧急联系人列表*/
	emergencyInfo(v){
		this.setState({
			contacts:v
		});
	}


	/*创建合同*/
	handleClick(){

		const { contractId, originContractId, contractNo, signDate, studentName, contactPhone, sex, gender, 
			brithDay, gradeId, contactName, contacts, reason } = this.state;

		if(contractNo == ''){
			Toast.info('请输入合同单号',1);
			return false;
		}

		if(studentName == '' || studentName == '学员'){
			Toast.info('请输入学员姓名',1);
			return false;
		}

		if(sex == ''){
			Toast.info('请选择学员性别',1);
			return false;
		}

		if(brithDay == ''){
			Toast.info('请选择出生日期',1);
			return false;
		}

		if(gradeId == ''){
			Toast.info('请选择年级',1);
			return false;
		}

		if(contactName == ''){
			Toast.info('请填写联系人姓名',1);
			return false;
		}

		if(contacts.length == 0){
			Toast.info('请添加紧急联系人',1);
			return false;
		}

		alert('', `确定转让给${contactPhone.replace(/(^\d{3}|\d{4}\B)/g,"$1-")}用户吗？`, [
			{ text: '取消' },
			{ text: '确定', onPress: () => this.commit() },
		]);
	}

	commit(){

		const { originContractId, contractNo, signDate, studentName, contactPhone, sex, gender, 
			brithDay, gradeId, contactName, contacts, reg, reason } = this.state;

		const params = {
			method:'post',
			data:{
				originContractId,
				reason,
				contractNo, 
				signDate,
				contactName, 
				contactPhone,
				studentName,
				birthDate:brithDay,
				gender,
				gradeId, 
				contacts,
			}
		}
		Http.ajax(`${api}/changgui/contracts/transfer`,params).then(res => {
			if(res.code == 0){
				this.props.history.push(`/ContractDetail/${res.data.contractId}`);
			}
		});
	}

	render(){
		
		const { contractId, originContractId, staffName, sex, gradeName, studentName, brithDay, contractNo, 
			signDate, contactPhone, totalPrice, } = this.state;

		return(
			<div className="new-contract base-css">
				<Contract 
					contractNo = { contractNo } 
					signDate = { signDate } 
					staffName = { staffName }
					inputContractNo = { (v) => this.inputContractNo(v) } 
					pickerSignDate = { (v) => this.pickerSignDate(v) } 
				/>
				<StudentInfo 
					studentName={ studentName } 
					sex={ sex } 
					brithDay={ brithDay }
					gradeName={ gradeName }
					changeName={ v => this.changeName(v) }
					changeSex={ v => this.changeSex(v) } 
					pickerBirthDay={ v => this.pickerBirthDay(v) }
					selectClass={ (v,gradeName) => this.selectClass(v,gradeName) } 
				/>
				<ContractDetail contractId={contractId} />
				<AddLinkMan 
					studentName={ studentName }
					emergencyInfo={ (v) => this.emergencyInfo(v) }
					contactName={ v => this.contactName(v) }
					contactPhone={ contactPhone }
				/>
			    <Button className="preview" onClick={() => this.handleClick() }>确定</Button>
			</div>
		)
	}
}

export default TransferDetail;