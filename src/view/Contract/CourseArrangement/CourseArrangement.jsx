import { Flex, Button, Modal, Picker, List, InputItem, DatePicker, Toast } from 'antd-mobile';

import './CourseArrangement.less';
const alert=Modal.alert;
const Http = Base;
const api = Base.url.Api;
const weekdays = {"MONDAY" : '周一',"TUESDAY":'周二',"WEDNESDAY":'周三',"THURSDAY": '周四',"FRIDAY": '周五',"SATURDAY" : '周六',"SUNDAY" :'周日'};
class CourseArrangement extends React.Component {
	constructor(props){
		super(props);
		this.state={
			StuId:props.match.params.contractStudentId==''?'':props.match.params.contractStudentId,
			studentName:'',
			isPublic:'',
			courseIdClass:[[]],
			Classnum:'',
			courseIdState:[[]],
			courseId:'',
			oldClassTimeState:[],
			ClassTimeState:[[]],
			ClassTime:'',
			ClssRoomState:[[]],
			classrooms:[],
			ClssRoom:'',
			ClassTeaState:[[]],
			ClassTea:'',
			capacity:'',
			studentCount:'',
			teacherName:'',
			cardId:'',
		}
	}
	componentWillMount(){
		//获取学员姓名
		if(this.state.StuId==''){
			Toast.info('请选择学员信息',1);
			return false;
		}
        const paramscou = {
	  		method:'get',
	  		formData:true,
	  		data:{
	  			contractStudentId:this.state.StuId
	  		}
	  	};
	  	Http.ajax(`${api}/v_1_0/student-lesson/changgui/get-student`,paramscou).then(res => {
	  		if(res.code ==0){
		  		this.setState({
		  			studentName:res.data.studentName,
		  			isPublic:res.data.isPublic
		  		},() => this.getClass());
		  		
	  		}
	  	});
    }
    getClass(){
		//获取年级
        const paramscou = {
	  		method:'get',
	  		formData:true,
	  		data:{
	  			isPublic:this.state.isPublic
	  		}
	  	};
	  	Http.ajax(`${api}/v_1_0/student-lesson/changgui/query-grades`,paramscou).then(res => {
	  		if(res.code ==0){                    
		  		if(res.data.grades.length>0){
	  			   const newArray=res.data.grades.map(({id:value , name:label})=>({value,label}));
	  			   console.log(newArray.length)
	  			   let val=newArray.length<=1?[newArray[0].value]:'';
	  			   console.log(val)
			                   this.setState({
			                       courseIdClass:[newArray],
			                       Classnum:val
			                   },()=>this.getonCourse());	
		  		}
	  		}
	  	});
    }
    onClassId(v){
    	const { Classnum} =this.state;
        this.setState({
            Classnum:v,
            courseIdState:[[]],
			courseId:'',
			oldClassTimeState:[],
			ClassTimeState:[[]],
			ClassTime:'',
			ClssRoomState:[[]],
			classrooms:[],
			ClssRoom:'',
			ClassTeaState:[[]],
			ClassTea:'',
			capacity:'',
			studentCount:'',
			teacherName:'',
        },()=>this.getonCourse());
    }
    getonCourse(){
    	//获取课程的字段
    	if(this.state.Classnum!=''){
	        const paramscou = {
		  		method:'get',
		  		formData:true,
		  		data:{
		  			gradeId:this.state.Classnum[0]
		  		}
		  	};
		  	Http.ajax(`${api}/v_1_0/student-lesson/changgui/query-courses`,paramscou).then(res => {
		  		if(res.code ==0){                    
			  		if(res.data.courses.length>0){
		  			       const newArray=res.data.courses.map(({id:value , name:label})=>({value,label})); 
		  			       const val=newArray[0].value; 
				                   this.setState({
				                       courseIdState:[newArray],
				                   });
			  			
			  		}
			  		
		  		}
		  	});
	  	}
    }
   onCoursrId(v){
        const { courseId} =this.state;
        this.setState({
	        courseId:v,
	        oldClassTimeState:[],
			ClassTimeState:[[]],
			ClassTime:'',
			ClssRoomState:[[]],
			classrooms:[],
			ClssRoom:'',
			ClassTeaState:[[]],
			ClassTea:'',
			capacity:'',
			studentCount:'',
			teacherName:'',
        },()=>this.getClssRoomState());	
    }
    // getClassTimeState(){
    //     const paramscou = {
	  	// 	method:'get',
	  	// 	formData:true,
	  	// 	data:{
	  	// 		courseId:this.state.courseId[0]
	  	// 	}
	  	// };
	  	// Http.ajax(`${api}/v_1_0/student-lesson/changgui/query-avalible-time-quantum`,paramscou).then(res => {
	  	// 	if(res.code ==0){
  		// 		if(res.data.timeQuantums.length>0){
  		// 			var getdatatime=[]
  		// 			var Timeslots=[]
  		// 			res.data.timeQuantums.map(function(i,v) {
  		// 				console.log()
  		// 				let day=weekdays[i.weekday]
  		// 				let startTime=new Date(i.startTime).Format('hh:mm');
  		// 				let startTimemm=new Date(i.startTime).Format('hh:mm:ss');
  		// 				let endTime=new Date(i.endTime).Format('hh:mm');;
  		// 				let endTimemm=new Date(i.endTime).Format('hh:mm:ss');;
  		// 				let newTime=day+' '+startTime+'~'+endTime;
  		// 				let arrays={
  		// 					label:newTime,
  		// 					value:v
  		// 				}
  		// 				let Timeslot={
  		// 					startTime:startTimemm,
  		// 					endTime:endTimemm,
  		// 					weekday:i.weekday
  		// 				}
  		// 				getdatatime.push(arrays)
  		// 				Timeslots.push(Timeslot)
  		// 			})
  		// 			let val=getdatatime[0].value;

  		// 			if(getdatatime.length<=1){
  		// 				this.setState({
  		// 					oldClassTimeState:Timeslots,
  		// 				   	ClassTimeState:[getdatatime],
  		// 					ClassTime:[val]
  		// 				},()=>this.getClssRoomState());
  		// 			}else{
  		// 				this.setState({
  		// 					oldClassTimeState:Timeslots,
  		// 			    	ClassTimeState:[getdatatime],
  		// 			    	ClassTime:''
  		// 				});
  		// 			}
  					
  		// 		}
	  			
	  	// 	}
	  	// });
    // }
   //  onSetTime(v){
   //      const { ClassTime} =this.state;
   //      this.setState({
   //          ClassTime:v,
   //          ClssRoomState:[[]],
			// classrooms:[],
			// ClssRoom:'',
			// ClassTeaState:[[]],
			// ClassTea:'',
			// capacity:'',
			// studentCount:'',
			// teacherName:'',
   //      },()=>this.getClssRoomState());
   //  }
    getClssRoomState(){
    	//获取上课教室
    	let {oldClassTimeState,ClassTime}=this.state;
    	let newArray=oldClassTimeState[ClassTime[0]]
        const paramscou = {
	  		method:'get',
	  		formData:true,
	  		data:{
	  			courseId:this.state.courseId[0],
	  			// startTime:newArray.startTime,
	  			// endTime:newArray.endTime,
	  			// weekday:newArray.weekday,
	  		}
	  	};
	  	// Http.ajax(`${api}/v_1_0/student-lesson/changgui/query-avalible-clazzes`,paramscou).then(res => {
	  	Http.ajax(`${api}/v_1_0/student-lesson/changgui/query-avalible-newclazzes`,paramscou).then(res => {
	  		if(res.code ==0){
  				if(res.data.clazzes.length>0){
  				  	// const newArray=res.data.classrooms.map(({clazzId:value , name:label})=>({value,label}));  
  				    	// const val=newArray[0].value; 
  					// console.log(newArray.length)
  				
	  			        	this.setState({
		  			        	classrooms:res.data.clazzes,
		  			            // ClssRoom:[val],
  					})
  				}
	  			
	  		}
	  	});
    }
    // onClassRoomId(v){
    // 	const { ClssRoom} =this.state;
    // 	this.setState({
    // 	    ClssRoom:v,
    // 	},()=>this.getonTeaches());
    // }
    // getonTeaches(){
    // 	let {classrooms,ClssRoomState,ClssRoom,capacity,studentCount}=this.state;
    // 	let _this=this;
    // 	classrooms.map(function(i,v){
    // 		if(i.clazzId==ClssRoom[0]){
    // 			const newArray=(i.teachers).map(({teacherId:value , teacherName:label})=>({value,label})); 
    // 			if(i.studentCount==0){
    // 				_this.setState({
    // 					capacity:i.capacity,
    // 					studentCount:i.studentCount,
    // 					ClassTeaState:[newArray],
    // 					ClassTea:'',
    // 				})
    // 			}else if(i.studentCount>0){
	   //  			_this.setState({
	   //  				capacity:i.capacity,
	   //  				studentCount:i.studentCount,
	   //  				ClassTeaState:[newArray],
	   //  				ClassTea:[i.teachers[0].teacherId],
	   //  				teacherName:[i.teachers[0].teacherName]
	   //  			})
    // 			}
    // 		}
    // 	})
    // }
    onChooseTea(v){
    	const { ClassTea} =this.state;
    	this.setState({
    	    ClassTea:v,
    	});
    }
    getData(v,data){
    	 if(this.state[v][0].length<1){
    	 	Toast.info('数据为空！',1);
		return false;
    	 }
    }
    onChooseCard(v){
    	this.setState({
    		cardId:v
    	})
    }
    OnSubmitData(v){
    	let _this=this;
    	let {courseId,cardId,ClassTime,Classnum,ClssRoom,StuId,teacherId,ClassTea}=this.state;
    	if(StuId==''){
			Toast.info('请选择学员信息',1);
			return false;
		}else if(Classnum==''){
			Toast.info('请选择上课年级',1);
			return false;
		}else if(courseId==''){
			Toast.info('请选择上课课程',1);
			return false;
		}else if(cardId==''){
			Toast.info('请选择上课信息',1);
			return false;	
		}
		// else if(ClassTime==''){
		// 	Toast.info('请选择上课时间',1);
		// 	return false;
		// }else if(ClssRoom==''){
		// 	Toast.info('请选择上课教室',1);
		// 	return false;
		// }else if(ClassTea==''){
		// 	Toast.info('请选择授课教师',1);
		// 	return false;
		// }
   	 	const paramscou = {
	  		method:'post',
	  		data:{
	  			clazzId:cardId,
	  			contractStudentId:StuId,
	  		}
	  	};
	  	Http.ajax(`${api}/v_1_0/student-lesson/add`,paramscou).then(res => {
	  		console.log(res)
	  		if(res.code ==0){
	  			let id=res.data.contractId;
	  			_this.props.history.push(`/ArrayCourse/${id}`)
	  		}
	  	});
    }
	render(){
		const _this=this;
		const {classrooms,cardId,courseIdState,capacity,teacherName,studentCount,courseId,courseIdClass,Classnum,ClassTimeState,ClassTime,ClssRoomState,ClssRoom,ClassTeaState,ClassTea,studentName}=this.state;
		return(
			<div className="CourseArrangement">
				<div className="PcIdearbox">
					 <div  className="groupBox">							
				 		<ul className="PcList">
					 		<li>
					 			<div className="pad30">学员姓名：</div>
					 			<div>{studentName}</div>
					 		</li>
					 		<li>
					 			<div className="pad30">上课年级：</div>
					 			<div className={Classnum==''?'CaPicker':'CaPicker color333'} >
					 				<Picker
					 				    data={ courseIdClass }
					 				    title={'上课年级' }
					 				    cascade={ false }
					 				    extra={'请选择上课年级' }
					 				    value={Classnum}
					 				    onChange={ (v) => this.onClassId(v)}
					 				    disabled={courseIdClass==''?true:false}
					 				    >
					 				    <List.Item onClick={this.getData.bind(this,'courseIdClass')} />
					 				</Picker>
					 				<i className="CaRightIcon"></i>
					 			</div>
					 		</li>
					 		<li>
					 			<div className="pad30">上课课程：</div>
					 			<div className={courseId==''?'CaPicker':'CaPicker color333'}>
					 				<Picker
					 				    data={ courseIdState }
					 				    title={'上课课程' }
					 				    cascade={ false }
					 				    extra={'请选择上课课程' }
					 				    value={courseId}
					 				    disabled={courseIdState==''?true:false}
					 				    onChange={ (v) => this.onCoursrId(v)}
					 				    >
					 				    <List.Item  onClick={this.getData.bind(this,'courseIdState')} />
					 				</Picker>
					 				<i className="CaRightIcon"></i>
					 			</div>
					 		</li>
					 		{/*<li>
					 			<div className="pad30">上课时间：</div>
					 			<div className={ClassTime==''?'CaPicker':'CaPicker color333'} >
					 				<Picker
					 				    data={ ClassTimeState }
					 				    title={'上课时间' }
					 				    cascade={ false }
					 				    extra={'请选择上课时间' }
					 				    value={ClassTime}
					 				    disabled={ClassTimeState==''?true:false}
					 				    onChange={ (v) => this.onSetTime(v)}
					 				    >
					 				    <List.Item  onClick={this.getData.bind(this,'ClassTimeState')} />
					 				</Picker>
					 				<i className="CaRightIcon"></i>
					 			</div>
					 		</li>
					 		<li>
					 			<div className="pad30">上课教室：</div>
					 			<div className={ClssRoom==''?'CaPicker':'CaPicker color333'} >
					 				<Picker
					 				    data={ ClssRoomState }
					 				    title={'上课教室' }
					 				    cascade={ false }
					 				    extra={'请选择上课教室' }
					 				    value={ClssRoom}
					 				    disabled={ClssRoomState==''?true:false}
					 				    onChange={ (v) => this.onClassRoomId(v)}
					 				    >
					 				    <List.Item  onClick={this.getData.bind(this,'ClssRoomState')} />
					 				</Picker>
					 				<i className="CaRightIcon"></i>
					 			</div>
					 		</li>	
					 		<li className="studentnum" style={{'display': capacity==''?'none':'block'}}>
					 			<p>该教师最大容纳学员数：<span>{capacity}</span></p>
					 			<p>当前报名学员数：<span>{studentCount}</span></p>
					 		</li>	
					 		<li>
					 			<div className="pad30">授课教师：</div>
					 			<div className={ClassTea==''?'CaPicker':'CaPicker color333'} >
					 			{studentCount>0 ? teacherName:	
					 				<Picker
					 				    data={ ClassTeaState }
					 				    title={'授课教师' }
					 				    cascade={ false }
					 				    extra={'请选择授课教师' }
					 				    value={ClassTea}
					 				    disabled={ClassTeaState==''?true:false}
					 				    onChange={ (v) => this.onChooseTea(v)}
					 				    >
					 				    <List.Item onClick={this.getData.bind(this,'ClassTeaState')}  />
					 				</Picker>
					 			}
					 			{studentCount>0?'' : <i className="CaRightIcon"></i>}
					 			</div>
					 		</li>	*/}
				 		</ul>
				 		
					 </div>
					
				 </div> <div className="showCardGroup">  
				    {
				 	classrooms.map(function(item,index){           
					   return(
					 		<div className="showCard" key={index}  onClick={_this.onChooseCard.bind(_this,item.id)} style={{'border': item.id==cardId? '1px solid #717caa':'1px solid #fff' }}>             
								 <div className="showCard_header">                 
					 				<h6>{item.courseName}</h6>
								 </div>
								 {
								 	item.newClassScheduleResponses.map(function(items,indexs){
								 		return (
				 				 			<div className="showCard_body" key={indexs}>
				 						 		<Flex>
				 						 			<Flex.Item><span>老师：</span>{items.teacherName}</Flex.Item>
				 							 		<Flex.Item><span>&nbsp;&nbsp;&nbsp;&nbsp;地点：</span>{items.classroomName}</Flex.Item>
				 						 		</Flex>
				 						 		<Flex>
				 							 		<Flex.Item><span>时间：</span>周{items.weekday}{new Date(items.startTime).Format('hh:mm')} - {new Date(items.endTime).Format('hh:mm')}</Flex.Item>
				 						 		</Flex>
				 				 			</div>
								 				 		
								 			)
								 	})
								 }
					 			
					 		</div>

						)
				 	})
				 		
				 }
				 </div>
				 <div className="BtnGroup">
				 	<span  className="PcConfirm" onClick={this.OnSubmitData.bind(this)}> 确 认 </span>
				 </div>
			</div>
		);
	}
}
export default CourseArrangement
