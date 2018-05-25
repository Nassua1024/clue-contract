
import { Picker, List, Toast, Flex, Button } from 'antd-mobile';
import * as action from '../../../../redux/action/action'
import './AddStu.less'; 

const { Link } = ReactRouterDOM;
const { connect } = ReactRedux
const Http = Base
const {Api:URL} = Http.url

const grade = [
    [
        {label: '一年级',value: '1',},
        {label: '二年级',value: '2',},
        {label: '三年级',value: '3',},
        {label: '四年级',value: '4',}
    ]
];

class AddStu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stuName:['张三','李四','王五'], //学员
            stuId:'', //选中的学员
            grade:grade, //年级下拉数据
            gradeId:'', //选中的年级
            inputHours:'', //输入的课时数
            canUseHours:40, //可分配的课时数
            contractId:props.match.params.contractId,
            reg:/^\+?[1-9]\d*$/, //数字正则
        };
    }
    componentWillMount(){
        //获取年级接口
        const params={
            method:'post',
            formData:true
        }
        Http.ajax(`${URL}/selections/grades`,params).then(res=>{
            const newArray=res.data.grades.map(({id:value,text:label})=>({label,value}))
            this.setState({
                grade:[newArray]
            })    
        });

        //获取学员
        const paramsstu={
            method:'post',
            formData:true,
            data:{
                contractId:this.state.contractId,
            }
        }

        Http.ajax(`${URL}/changgui/selections/contract-other-students`,paramsstu).then(res=>{
            this.setState({
                 stuName:res.data.mappers
            });
        });
    }

    commit(){
        let { stuId, canUseHours, inputHours, reg, gradeId,contractId } = this.state;
        if(stuId === ''){
            Toast.info('请选择学员',1);
            return false;
        }
        if(gradeId === ''){
            Toast.info('请选择年级',1);
            return false;
        }
        if(contractId==null){
            Toast.info('无效合同',1);
            return false;
        }
        //提交数据
        const param={
            method:'post',
            formData:true,
            data:{
               studentId :stuId,
               gradeId:gradeId,
               contractId:contractId
            }
        }
        Http.ajax(`${URL}/contracts/add-student`,param).then(res => {
            if(res.code==0){
                this.props.history.push(`/ContractDetail/${contractId}`)
                this.props.saveContract(null)
            }
        })
    }
    render(){
        const { grade, canUseHours, inputHours, stuName, stuId } = this.state;
        return(  
            <div id="add-stu" className="base-css">
                <div className="title"><i></i><h3>添加学员</h3></div>

                {/*选择学员*/}
                <div className="add-stu">
                    <p className="type">学员</p>
                    <Flex wrap="wrap" className="single-select">
                        {
                            stuName.map((item,index) => {
                                var active = stuId === item.id ? 'active' : '';
                                return(
                                    <div key={ index } onClick={ ()=> this.setState({ stuId:item.id }) } className={ active }>{ item.text }</div>
                                );
                            })
                        }
                    </Flex>
                </div>

                {/*选择年级*/}
                <div className="select-class">
                    <p className="type margin-t">年级</p>
                    <Picker
                        data={ grade }
                        title="年级"
                        cascade={false}
                        extra="请选择年级"
                        value={this.state.gradeId}
                        onChange={v => this.setState({ gradeId: v })}
                    >
                        <List.Item />
                    </Picker>
                </div>

                {/*输入课时
                <div className="input-hour">
                    <p className="type course">课时</p>
                    <div className="iput">
                        <input type="text" placeholder="请输入分配课时" onChange={ (e) => this.setState({ inputHours:e.target.value }) } />
                    </div>
                    <span className="tip">可分配 {canUseHours} 课时</span>
                </div>*/}
                
                <Button className="btn-css" onClick={ () => this.commit() }>确认</Button>
           </div>    
        )
    }
}


const mapStateToProps = (state) => ({
    ConcernLabels: state.ConcernLabels
});

const ADDStu = connect(
    mapStateToProps,
    action
)(AddStu);

module.exports = ADDStu;