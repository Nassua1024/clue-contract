import { Flex, Button, Modal, Picker, List, InputItem, DatePicker, Toast } from 'antd-mobile';
import moment from 'moment';
import 'moment/locale/zh-cn';


import './PublicContract.less';


const alert=Modal.alert;
const Http = Base;
const api = Base.url.Api;
const zhNow = moment().locale('zh-cn').utcOffset(8);
const minDate = moment(`${new Date(1900,0).Format('yyyy-MM-dd')} +0800`, 'YYYY-MM-DD Z').utcOffset(8);
class PublicContract extends React.Component {
	constructor(props){
		super(props);
		this.state={
			StuId:props.match.params.leadStudentId=="newStudent"?'':props.match.params.leadStudentId,
			LeadId:props.match.params.stuId,
			SexData:[
				[
				    { label: '男', value: 'MALE' },
				    { label: '女', value: 'FEMALE' },
				]
  			],
			Sex:'',
			gender:'',
			StuName:"",
			StuBrth:"",
			OldBrth:"",
			StuPhone:"",
			StuPerson:"",
			ContrasctNo:'',
			ClassName:'公益课',
			CourseList:[],
			OldList:[],
			CourseNo:'',
			CourseName:'',
			CourseNum:'',
			CourseData:'',
			CoursePrice:0,
			DynamicPrice:0,
			cashPrice:0,
			posPrice:0,
			wxPrice:0,
			zfbPrice:0,
			otherPrice:0,
			contractDate:zhNow,
		}
	}
	componentWillMount() {
		let { LeadId,CourseList } = this.state;
     	 const params = {
     	  	method:'post',
     	  	formData:true,
     	  	data:{
     	  		contractType: 'NEW_SIGN'
     	  	}
     	};
     	if(this.state.StuId!=''){
     	  	params.data.leadStudentId=this.state.StuId;
     	}else{
     	 	params.data.leadId=this.state.LeadId;
     	}
     	Http.ajax(`${api}/contracts/prepare-create`,params).then(res => {
     	  	if(res.code ==0){
     	  		let data=res.data.contractPrepareResponse;

     	  		const reg = /^(\d{3})(\d{4})(\d{4})$/;
				if(data.contractMobile!=''){	
					const matches = reg.exec(data.contractMobile);
					data.contractMobile = matches[1] + ' ' + matches[2] + ' ' + matches[3];
				}
				// console.log(res.data.contractPrepareResponse)
	 	  	   	this.setState({
	 	  	   		StuName:data.studentName,
					StuBrth:data.birthDay,
					OldBrth:data.birthDay,
					StuPhone:data.contractMobile,
					StuPerson:data.contractName,
					gender:data.gender,
					Sex:data.gender=='MALE'?'男' : data.gender=='FEMALE'?'女':''
	 	  	   	});
     	  	}
     	});

        const paramscou = {
	  		method:'post',
	  		formData:true,
	  	};
	  	Http.ajax(`${api}/selections/get-public-courses`,paramscou).then(res => {
	  		if(res.code ==0){
		  		const courses = res.data.response;
		  		courses.map((item,index) => {
		  			if(this.props.ClassNo == item.id){
		  				this.props.isTtto(item.isTtto);
		  			}
		  		})
		  		CourseList.push(courses.map(({id:value,text:label,isTtto}) => ({label,value,isTtto})));
		  		this.setState({
		  			CourseList,
		  			OldList:courses
		  		});
	  		}
	  	});
    }
    handleChange(e){
    	let OldValue=e.target.value
    	let value=OldValue.replace(/[^A-Za-z0-9\s]+$/,'')
    	this.setState({
    		ContrasctNo:value
    	})
    }
    handleChangePrice(val,e){
    	let OldValue=e.target.value
    	let value=OldValue.replace(/[^0-9\s]+$/,'')
    	if(val=='cashPrice'){    		
    		this.setState({
    			cashPrice:value,
    		})
    	}else if(val=='posPrice'){
    		this.setState({
    			posPrice:value,
    		})
    	}else if(val=='wxPrice'){
    		this.setState({
    			wxPrice:value,
    		})
    	}else if(val=='zfbPrice'){
    		this.setState({
    			zfbPrice:value,
    		})
    	}else if(val=='otherPrice'){
    		this.setState({
    			otherPrice:value,
    		})
    	}
    }
    PayBlur(val,e){
    	let {cashPrice,posPrice,wxPrice,zfbPrice,otherPrice,DynamicPrice,CoursePrice}=this.state;
    	let newprice=0;
    	if(e.target.value!=NaN && e.target.value!=''){
    		if(val=='cashPrice'){
    			newprice=CoursePrice-parseInt(e.target.value)-posPrice-wxPrice-zfbPrice-otherPrice;
    			this.setState({
    				cashPrice:e.target.value,
    				DynamicPrice:newprice
    			})
    		}else if(val=='posPrice'){
    			newprice=CoursePrice-parseInt(e.target.value)-wxPrice-zfbPrice-otherPrice-cashPrice;
    			this.setState({
    				posPrice:e.target.value,
    				DynamicPrice:newprice
    			})
    		}else if(val=='wxPrice'){
    			newprice=CoursePrice-parseInt(e.target.value)-posPrice-zfbPrice-otherPrice-cashPrice;
    			this.setState({
    				wxPrice:e.target.value,
    				DynamicPrice:newprice
    			})
    		}else if(val=='zfbPrice'){
    			newprice=CoursePrice-parseInt(e.target.value)-posPrice-wxPrice-otherPrice-cashPrice;
    			this.setState({
    				zfbPrice:e.target.value,
    				DynamicPrice:newprice
    			})
    		}else if(val=='otherPrice'){
    			newprice=CoursePrice-parseInt(e.target.value)-posPrice-wxPrice-zfbPrice-cashPrice;
    			this.setState({
    				otherPrice:e.target.value,
    				DynamicPrice:newprice
    			})
    		}
    	}else{
			newprice=CoursePrice-cashPrice-posPrice-wxPrice-zfbPrice-otherPrice;
			this.setState({
				DynamicPrice:newprice
			})
    	}
    }
    pickerGender(v){
    	let {gender}=this.state;
    	this.setState({
    		gender:v
    	})
    }
    pickerSignDate(v){
		if(v.format && v.format('YYYY-MM-DD') > new Date().Format('yyyy-MM-dd')){
			Toast.info('请选择合适的学员生日',1);
			return false;
		}
		this.setState({
			StuBrth:v
		});
	}
	pickercontractDate(v){
		if(v.format && v.format('YYYY-MM-DD') > new Date().Format('yyyy-MM-dd')){
			Toast.info('请选择合适的创建日期',1);
			return false;
		}
		// console.log(v)
		this.setState({
			contractDate:v
		});
	}
	
    onChooseClass(v){
    	let {ClassList,ClassNo,ClassName,CourseList}=this.state;
    	ClassList[0].map(function(i,x) {
    		if(i.value==v){
				ClassName=i.label
    		}
    	})
    	this.setState({
			ClassNo:v,
			ClassName
    	})
		const params = {
		  	method:'post',
		  	formData:true,
		  	data:{
     	  	    subjectType:'LITERATURE', 
       			gradeId:v
    	    }
		  };
		  Http.ajax(`${api}/selections/get-public-courses`,params).then(res => {
		  	if(res.code ==0){
		  		const courses = res.data.response;
 	  			courses.map((item,index) => {
 	  				if(this.props.ClassNo == item.id){
 	  					this.props.isTtto(item.isTtto);
 	  				}
 	  			})
 	  			CourseList.push(courses.map(({id:value,text:label,isTtto}) => ({label,value,isTtto})));
 	  			this.setState({
 	  				CourseList,
 	  			},);


		  	}
		  });
    }
    onChooseCourse(v){
    	let {OldList,CourseName,CourseNo,CourseNum,CourseData,CoursePrice,DynamicPrice}=this.state;
    	console.log(OldList)
    	OldList.map(function(i,x) {
    		if(i.id==v[0]){
    			CourseData=i.validDate
				CourseName=i.text
				CourseNum=i.lessonHour
				CoursePrice=i.courseFee
				CourseNo=i.id
    		}
    	})
    	this.setState({
    		CourseData,
    		CourseName,
			CourseNum,
			CoursePrice,
			CourseNo,
    	})
    	
    }
    changName(e){
    	this.setState({
    	    StuName:Http.legInputName(e.target.value)
    	})
    }
    getPhone(e){
    	let data=e.target.value;
    	    data = data.replace(/\s*/g, "");
    	let result = [];
    	for(let i = 0; i < data.length; i++)
    	{
    	    if (i==3||i==7)
    	    {
    	        result.push(" " + data.charAt(i));
    	    }
    	    else
    	    {
    	        result.push(data.charAt(i));
    	    }
    	}
    	this.setState({
    	    StuPhone:result.join("")
    	})

    }
    OnSubmitData(){
    	const _this=this
    	setTimeout(function(){
    		const {StuId,contractDate,LeadId,ContrasctNo,CourseNo,CoursePrice,cashPrice,posPrice,wxPrice,zfbPrice,otherPrice,DynamicPrice,StuName,StuBrth,gender}=_this.state;
    		let StuBrthok=new Date(StuBrth).Format('yyyy-MM-dd')
    		// console.log(StuBrth)
    		// console.log(StuBrthok)
    		if(StuName==''){
	            Toast.info('请输入学员姓名',1);
	            return false;
	        }else if(gender==null){
	            Toast.info('请选择学员性别',1);
	            return false;
	        }else if(StuBrth==''){
	            Toast.info('请选择学员生日',1);
	            return false;
	        }
	        // else if(ContrasctNo==''){
	        //     Toast.info('请输入合同单号',1);
	        //     return false;
	        // }
	        else if(CourseNo==''){
	            Toast.info('请选择购买课时',1);
	            return false;
	        }else if(DynamicPrice==CoursePrice){
	        	Toast.info('请输入支付金额',1);
	            return false;
	        }else if(DynamicPrice!=0){
	    		Toast.info('支付费用与总金额不等！',1);
	    	    return false;
	        }
	    	const params = {
	     	  	method:'post',
	     	  	formData:true,
	     	  	data:{
	  	    	    courseId: 	   CourseNo,
	  	    	    // contractNo:    ContrasctNo,
	  	    	    totalPrice:    CoursePrice,
	  	    	    otherPrice:    otherPrice,
	  	    	    cashPrice:     cashPrice,
	  	    	    posPrice:      posPrice,
	  	    	    zfbPrice:      zfbPrice,
	  	    	    wechatPrice:   wxPrice,
	  	    	    contractType:  'NEW_SIGN',
	  	    	    contractCategory: 'PUBLIC',
	  	    	    studentName:StuName,
	  	    	    gender:gender,
	  	    	    birthDay:StuBrthok,
	     	  	}	
	     	  };
	     	  if(StuId!=''){
	     	    params.data.leadStudentId=StuId;
	     	  }else{
	     	   	params.data.leadId=LeadId;
	     	   	let StuCreate=new Date(contractDate).Format('yyyy-MM-dd')
	     	   	params.data.contractDate=StuCreate;
	     	  }
	     	  Http.ajax(`${api}/contracts/create`,params).then(res => {
	     	  	if(res.code ==0){
	     	  	   let id = res.data.contractId
	     	  	   _this.props.history.push(`/ArrayCourse/${id}`)
	     	  	}
	     	  });
    	},100)
    }
    OnCancel(){
      // const IdData=this.state.StuId
      // this.props.history.push(`/signContractEn/${IdData}`)
		window.history.back()
    }
	render(){

			let {StuId,contractDate,signDate,OldBrth,Sex,gender,SexData,CourseList,StuName,StuBrth,StuPhone,ClassName,DynamicPrice,CourseName,StuPerson,ContrasctNo,ClassNo,CourseNo,CourseNum,CourseData,CoursePrice,cashPrice,posPrice,wxPrice,zfbPrice,otherPrice}=this.state;
			return(
				<div className="PublicContract">
					<div className="PcIdearbox">
						 <div className=" boxBag">
							<h5>学员信息</h5>
						 	<ul className="PcList">
						 		<li>
						 			<div>
						 				学员姓名：
						 			</div>
						 			<div className={StuId==""?"inpuText":""}>
						 				{StuId!=""?StuName:<input type="text" value={StuName} className="pcBboder" maxLength="10" placeholder="请输入学员姓名" onChange={this.changName.bind(this)} />}
						 			
						 			</div>
						 		</li>
						 		<li>
						 			<div>
						 				学员性别：
						 			</div>
						 			<div className={Sex==""?"inpuText":""}>
						 				{Sex!=""?Sex:<Picker
						         					data={SexData}
										          	title="学员性别"
										         	extra='请选择学员性别'
										         	cascade={ false }
										          	onChange={ v => this.pickerGender(v) }
										          	value={ this.state['gender'] }
										          	>
        											<List.Item className={ gender == null? "date-picker gray" : "date-picker" } />
        											</Picker>
        								}
						 			</div>
						 		</li>
						 		<li>
						 			<div>
						 				学员生日：
						 			</div>
						 			<div className={OldBrth==""?"inpuText":""}>
						 				{OldBrth!=""?StuBrth:<DatePicker
						         					mode="date"
										          	title="学员生日"
										         	extra="请选择学员生日"
										          	value={ StuBrth }
										          	onChange={ v => this.pickerSignDate(v) }
							          				minDate={ minDate }>
        											<List.Item className={ StuBrth == "" ? "date-picker gray" : "date-picker" } />
        											</DatePicker>
        								}
						 			</div>
						 		</li>
						 		<li>
						 			<div>
						 				联系电话：
						 			</div>
						 			<div>
						 				{StuPhone}
						 			</div>
						 		</li>
						 		<li>
						 			<div>
						 				联系人：
						 			</div>
						 			<div>
						 				{StuPerson}
						 			</div>
						 		</li>
						 		{StuId!=""?'':<li>
						 			<div>
						 				创建日期：
						 			</div>
						 			<div className="inpuText">
						 				<DatePicker
			         					mode="date"
							          	title="创建日期"
							         	extra="请选择创建日期"
							          	value={contractDate}
							          	onChange={ v => this.pickercontractDate(v) }
				          				minDate={ minDate }>
										<List.Item className={ contractDate == "" ? "date-picker gray" : "date-picker" } />
										</DatePicker>
						 			</div>
						 		</li>
						 		
						 		}
						 	</ul>
						 </div>
						 <div  className="groupBox groupBoxC">
							<h5>合同信息</h5>
						 	<ul className="PcList">
						 		{/*<li>
						 			<div>
						 				合同编号：
						 			</div>
						 			<div className="inpuText">
						 				<input type="text" className="pcBboder" maxLength="20" onChange={this.handleChange.bind(this)} value={ContrasctNo}  placeholder="请输入合同编号"  />
						 			</div>
						 		</li>*/}
						 		<li>
						 			<div>
						 				年级
						 			</div>
						 			<div className="PcChild" style={{'color': "#333"}}>
						 				{ClassName!=""?ClassName:"请选择年级"}
						 			</div>
						 			
						 		</li>
						 		<li>
						 			<div>
						 				购买课程
						 			</div>
						 			<div>
						 			</div>
						 			<div className="PcChild" style={{'color': CourseName==""?"#ccc":"#333"}}>
						 			{CourseName!=""?CourseName:"请选择课程"}
						 			</div>
						 			<div  className="PcChild">
	 										<Picker
	 									        data={CourseList}
	 									        title="请选择课程"
	 									        cascade={ false }
	 									        extra="选择"
	 									        onChange={ v => this.onChooseCourse(v) }
	 									    >
	 									    	<List.Item className="date-picker" />
	 				       			    	</Picker>
						 				{/*<button className="PcCHoose" onClick={this.onChooseCourse}>选择</button>*/}
						 			</div>
						 		</li>
						 		<li>
						 			<div>
						 				购买课时
						 			</div>
						 			<div>
						 				{CourseNum==''?'':CourseNum+'课时'}
						 			</div>
						 		</li>
						 	</ul>
						 </div>
						 <div className="groupBox PcBorder boxBag">
						 	<ul className="PcList">
						 		<li>
						 			<div>
						 				合同有效期：
						 			</div>
						 			<div>
						 				{CourseData==''?'':CourseData}
						 			</div>
						 		</li>
						 		<li>
						 			<div>
						 				总计金额：
						 			</div>
						 			<div className="PcPrice">
						 				{CoursePrice==''?'':CoursePrice+'元'}
						 			</div>
						 		</li>	
					 		</ul>
						 </div>
						 <div  className="groupBox PayIdear">
							<h5>支付信息</h5>
							<ul className="PcList PcPriceBox">
							{DynamicPrice==CoursePrice||DynamicPrice==0?'':
						 		<li>
						 			<div>
						 				<i className="tip"></i>{DynamicPrice>0?"支付金额比合同金额少":"支付金额比合同金额多"}
						 			</div>
						 			<div className="PcPrice">
						 				{DynamicPrice>0?DynamicPrice:Math.abs(DynamicPrice)} 元
						 			</div>
						 		</li>
						 	}
					 		</ul>
					 		<ul className="PcList borbottom">
						 		<li>
						 			<div>
						 				<i className="cash"></i>现金：
						 			</div>
						 			<div>
						 				<input type="phone" className="pcBboder" maxLength="6" placeholder="请输入现金金额" value={cashPrice==0?"":cashPrice} onBlur={this.PayBlur.bind(this,'cashPrice')} onChange={this.handleChangePrice.bind(this,'cashPrice')} />
						 			</div>
						 		</li>
						 		<li>
						 			<div>
						 				<i className="pos"></i>POS机：
						 			</div>
						 			<div>
						 				<input type="phone" className="pcBboder" maxLength="6" placeholder="请输入POS机金额" value={posPrice==0?"":posPrice} onBlur={this.PayBlur.bind(this,'posPrice' )} onChange={this.handleChangePrice.bind(this,'posPrice')} />
						 			</div>
						 		</li>
						 		<li>
						 			<div>
						 				<i className="wx"></i>微信支付：
						 			</div>
						 			<div>
						 				<input type="phone" className="pcBboder" maxLength="6" placeholder="请输入微信支付金额" value={wxPrice==0?"":wxPrice} onBlur={this.PayBlur.bind(this,'wxPrice')} onChange={this.handleChangePrice.bind(this,'wxPrice')}  />
						 			</div>
						 		</li>
						 		<li>
						 			<div>
						 				<i className="zfb"></i>支付宝：
						 			</div>
						 			<div>
						 				<input type="phone" className="pcBboder" maxLength="6" placeholder="请输入支付宝金额" value={zfbPrice==0?"":zfbPrice} onBlur={this.PayBlur.bind(this,'zfbPrice')} onChange={this.handleChangePrice.bind(this,'zfbPrice')}  />
						 			</div>
						 		</li>
						 		<li>
						 			<div>
						 				<i className="other"></i>其他：
						 			</div>
						 			<div>
						 				<input type="phone" className="pcBboder" maxLength="6" placeholder="请输入其他金额" value={otherPrice==0?"":otherPrice}  onBlur={this.PayBlur.bind(this,'otherPrice')} onChange={this.handleChangePrice.bind(this,'otherPrice')}  />
						 			</div>
						 		</li>	
					 		</ul>
						 </div>
					 </div>
					 <div className="BtnGroup">
					 	<button className="PcCancel" onClick={this.OnCancel.bind(this)}>取消</button>
					 	<button  className="PcConfirm" onClick={this.OnSubmitData.bind(this)}>确认</button>
					 </div>
				</div>
		);
	}
}
export default PublicContract
