import {Flex, Button} from 'antd-mobile'
import './signContractEn.less'


const Http = Base
const {api:URL} = Http.url
const FlexItem = Flex.Item
class signContractEn extends React.Component {
    constructor(props) {
        super(props)


        this.state = {
            students: [],
            contractType: [
                {
                    id: 0,
                    name: '常规课合同'
                },
                {
                    id: 1,
                    name: '公益课合同'
                }
            ],
            currentStdId: null,   // 学员id
            currentConId: 0,   // 合同id
        }
    }

    componentWillMount() {

        this.getStudents()
    }

    getStudents() {
        const params = {data:{leadId:this.props.match.params.leadId}}

        Http.ajax(`${URL}/lead/get-students`,params).then(res => {
           if (res.code === '0') {
               const students = res.data.students.map(({name,leadStudentId}) => ({leadStudentId,name}))
               if (students.length < 5) {
                   students.splice(students.length, 1, {name: '新学员', leadStudentId: 'newStudent'})
               }
               const currentStdId = students[0].leadStudentId
               this.setState({students,currentStdId})
           }
        })
    }

    handleSelStd(currentStdId) {
        this.setState({
            currentStdId
        })
    }
    handleSelCon(currentConId) {
        const {students} = this.state

        // if (currentConId === 1) {
        //     if (students.length > 0 && students[students.length-1].leadStudentId === 'newStudent') {
        //         this.setState(prev => {
        //             prev.students.splice(prev.students.length-1, 1)
        //             prev.currentStdId = prev.students.length > 0 && prev.students[0].leadStudentId || null
        //             return prev.students
        //         })
        //     }
        // }
        // else {
        //     this.setState(prev => {
        //         if (students.length < 5) {
        //             prev.students.splice(students.length, 1, {name: '新学员', leadStudentId: 'newStudent'})
        //         }
        //         return prev.students
        //     })
        // }
        this.setState({
            currentConId
        })
    }
    cancelContract() {
        window.history.back()
    }
    addContract() {
        /* currentStdId */


        const {leadId} = this.props.match.params
        const {currentStdId, currentConId} = this.state

        if (currentStdId === null) {
            Toast.info(`请选择学员`, 2, null, false)
            return;
        }

        if (currentConId === 0){
            if(this.props.history.location.search != '')
                this.props.history.push(`/NewContract/${leadId}/${currentStdId}${this.props.history.location.search+':0'}`);
            else
                this.props.history.push(`/NewContract/${leadId}/${currentStdId}`);
        }
            
        else if (currentConId === 1)
            this.props.history.push(`/PublicContract/${currentStdId}/${leadId}`)
            // window.location.href = `./OldProject/html/PublicContract.html?leadStudentId=${currentStdId}`
    }

    render() {
        const {currentStdId, currentConId,students} = this.state
        return (
            <div id="signContractEn">
                <div className="sc-box">
                    <div className="regio students">
                        <div className="title">学员</div>
                        <Flex className="list-box">
                            {students.map(({name, leadStudentId}) => (
                                <div key={leadStudentId} className={`list ${currentStdId===leadStudentId?'active':''}`} onClick={() => this.handleSelStd(leadStudentId)}>{name}</div>
                            ))}
                        </Flex>
                    </div>
                    <div className="regio contracts">
                        <div className="title">合同</div>
                        <Flex className="list-box">
                            {this.state.contractType.map(({id, name}) => (
                                <div key={id} className={`list ${currentConId===id?'active':''} `} onClick={() => this.handleSelCon(id)}>{name}</div>
                            ))}
                        </Flex>
                    </div>
                </div>
                <Flex className="btns">
                    <Button className="btn" onClick={this.cancelContract.bind(this)}>取消</Button>
                    <Button className="btn" onClick={this.addContract.bind(this)}>添加</Button>
                </Flex>
            </div>
        )
    }
}

export default signContractEn;