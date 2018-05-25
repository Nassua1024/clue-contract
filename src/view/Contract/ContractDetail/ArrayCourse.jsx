 import {Flex,Modal,InputItem,Toast} from 'antd-mobile'

import './ArrayCourse.less'; 

const { Link } = ReactRouterDOM;

const Http = Base
const {api:URL} = Http.url
const alert = Modal.alert


class ArrayCourse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           contractId:this.props.match.params.contractId,
           data:'',
           curmodifyHours:'',
           curlessonNotFinishedCount:'',
           curmaxIncreaseHours:'',
           curclassStudentId:'',
           isShowModal:false
        };
    }
    componentWillMount(){
        this.getData();
    }
    stopEvent(e){
        e.preventDefault();
    }
    //获取页面基本data，需重复使用
    getData(){
        const params = {
            data:{
               contractId:this.state.contractId
            }


        };
        Http.ajax(`${URL}/v_1_0/student-lesson/changgui/query-lesson-schedules`,params).then(res => {
            if(res.code == 0){
                console.log(res)
                this.setState({
                    data:res.data
                })
                
            }
        });
        
    }
    //渲染基本学员
    getWaitArray(){
        const { students } = this.state.data

        return students.length!=0 ? students.map((item,index)=>{
                    return  <div className='wait-array list-wrap' key={index}>
                                <div className='tit-stu'>{item.studentName}</div>
                                <div className="store" onClick={() => this.gotopk(item.contractStudentId)}>去排课</div>          
                                <span className='status'>未排课</span>
                            </div>
                }):''
                
            
              
    }
    gotopk(contractStudentId){
         this.props.history.push(`/CourseArrangement/${contractStudentId}`)
    }
    //渲染已排课学员信息
    getOtherArray(){
        const { studentClazzes,curmodifyHours} = this.state.data
        if(studentClazzes && studentClazzes.length!=0){
            return studentClazzes.map((item,index)=>{
                    return <div className='other-array list-wrap' key={ index }>
                            <div className='tit-stu'>{item.studentName}</div>
                            <div className='flex-div'>
                                <p className='flex-left'><span>年级 :</span>{item.gradeName}</p>
                                <p className='flex-right'><span>开课日期 :</span>{item.startDate ?new Date(item.startDate).Format('yyyy-MM-dd') :'----'}</p>
                            </div>
                            <div  className='flex-div'>
                                <p className='flex-left'><span>课程 :</span>{item.courseName}</p>
                                <p className='flex-right'><span>待上课时 :</span>{item.lessonNotFinishedCount}课时</p>
                            </div>

                            {
                                item.classSchedules.map((itemd,indexs)=>{
                                    return (
                                                <div key={indexs} className="newCourseCard">
                                                        <div  className='flex-div'>
                                                            <p className='flex-left'>排课{indexs+1}</p>
                                                        </div>
                                                        <div  className='flex-div'>
                                                            <p className='flex-left'><span>老师 :</span>{itemd.teacherName}</p>
                                                            <p className='flex-right'><span>地点 :</span>{itemd.classroomName}</p>
                                                        </div>
                                                        <div  className='flex-div'>
                                                            <p className='flex-left'><span>时间 :</span>周{itemd.weekday} {new Date(itemd.startTime).Format('hh:mm')} - {new Date(itemd.endTime).Format('hh:mm')}</p>
                                                        </div>
                                                       
                                                </div>
                                        )
                                })
                            }
                            {/*<div className='flex-div'>
                                <p className='flex-left'><span>任课老师 :</span>{item.teacherName}</p>
                                <p className='flex-right'><span>上课地点 :</span>{item.classroomName}</p>
                            </div>
                            <div className='noflex start-data'><span>上课时间 :</span>
                            {
                                item.timeQuantums.map((itemd,index)=>{
                                    return <div key={index}>{Http.formatWeek(itemd.weekday)}    {new Date(itemd.startTime).Format('hh:mm')} - {new Date(itemd.endTime).Format('hh:mm')}</div>
                                })
                            }
                            
                            </div>
                            <div className='noflex'><span>待上课时 :</span>{item.lessonNotFinishedCount}课时</div>*/}

                            <div className='btn-wrap'>
                                <div className='del' onClick = { () => this.delArray(item. classStudentId)}>删除</div>
                                <div className='replay' onClick = { () => this.modifyArray(item.classStudentId,item.lessonNotFinishedCount)}>修改课时</div>
                            </div>


                            <span className='status'>{item.statusDesc}</span>
                            </div>
                })
        }
    }
    //删除
    delArray( classStudentId){
        alert('删除','确定删除排课吗',[
            { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
            { text: '确定', onPress: () =>{
                var params = {
                    method:'POST',
                    formData:true,
                    data: {
                        classStudentId: classStudentId
                        // classStudentId: 4
                    }
                }
                Http.ajax(`${URL}/v_1_0/student-lesson/changgui/delete-student-clazz`,params).then(res => {
                    if(res.code == 0){
                        // console.log(res)
                       this.getData();
                    }
                });

            } },
        ])
    }
    iptHours(v){
        if (/^[0-9]\d*$/.test(v) || v=='') {
          this.setState({
            curmodifyHours:v
          })       
        }
    }
    //修改课时
    modifyArray(curclassStudentId,curlessonNotFinishedCount){
        const { maxIncreaseHours,lessonNotFinishedCount } = this.state;
        var params={
            method:"get",
            data:{
                classStudentId:curclassStudentId
                // classStudentId:4
            }
        }
        //最大可增加的调课时数
        Http.ajax(`${URL}/v_1_0/student-lesson/changgui/get-max-increase-hours`,params).then(res => {
            if(res.code == 0){
                this.setState({
                    curmaxIncreaseHours:res.data.maxIncreaseHours,
                    curlessonNotFinishedCount:curlessonNotFinishedCount,
                    curclassStudentId:curclassStudentId,
                    isShowModal:true
                },()=>{
                    var autofocusIpt = document.getElementsByClassName('autofocusIpt')[0].children[1].children[0]
                    autofocusIpt.focus()

                })
               
            }
        });
    }


    render(){
        const { data,curmodifyHours,curlessonNotFinishedCount,curmaxIncreaseHours,curclassStudentId,isShowModal } = this.state;
        // console.log(data)
        return(  
            <div id="array-course" className="base-css">
                <div className='course-hours'>
                    <div className='used'>已上课时: <span>{ data.lessonFinishedCount }课时</span></div>
                    <div className='array-wrap'><p className='arrayed'>已排课时: <span>{ data.lessonArrangedCount }课时</span></p><p className='unarray'>未排课时: <span>{ data.lessonNotArrangedCount }课时</span></p></div>
                </div>
                {/*渲染学员*/}
                {
                    data.lessonNotArrangedCount>0 &&
                    this.getWaitArray()
                }
                {/*渲染其他状态*/}
                {
                    this.getOtherArray()
                }
                <Modal
                    className='commen-modal'
                    title ='修改课时'
                    visible={isShowModal}
                    transparent
                    ref='modal'
                    footer = {[
                        { text: '取消', onPress: () => this.setState({isShowModal:false}) },
                        { text: '确定', onPress: () =>{
                            var params = {
                                method:'POST',
                                formData:true,
                                data: {
                                    classStudentId: curclassStudentId,
                                    newPendingFinishHours:curmodifyHours
                                    // classStudentId: 4
                                }
                            }
                            if(curmodifyHours.trim()!=''){
                                if(curmodifyHours<=curmaxIncreaseHours){
                                    Http.ajax(`${URL}/v_1_0/student-lesson/changgui/modify-lesson-hours`,params).then(res => {
                                        if(res.code == 0){
                                           this.setState({
                                            isShowModal:false
                                           },function(){
                                            this.getData();
                                           })
                                        }
                                    });
                                }else{
                                    Toast.info('不可超过可修改剩余课时最大值',1)
                                }

                            }else{
                                Toast.info('待上课时不可为空',1)
                            }


                        } },
                    ]}
                >
                <div className='body-wrap'>
                    <InputItem type={'number'} className='autofocusIpt' value={curmodifyHours} onChange={  this.iptHours.bind(this) } >修改待上课时</InputItem>
                    <p className='des'><span>当前剩余课时 :</span>{curlessonNotFinishedCount}课时</p>
                    <p className='des'><span>可修改剩余课时最大值 :{ curmaxIncreaseHours }</span></p>
                </div>

                </Modal>

            </div>    
        )
    }
}




module.exports = ArrayCourse;