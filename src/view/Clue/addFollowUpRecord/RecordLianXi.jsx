import {List, InputItem, Picker,DatePicker,Toast, Button} from 'antd-mobile'
import './Record.less'
import * as action from '../../../redux/action/action'
import moment from 'moment'

const {connect} = ReactRedux
const Http = Base
const {api:URL} = Http.url
const ListItem = List.Item
class ListenLianxi extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            courses: [],
            course : '',
            students: [],

            selCourse: '',
            selStudent: '',
            selDate: '',
            money: '',

            minDate: moment(`${new Date().Format('yyyy-MM-dd hh:mm')} +0800`, 'YYYY-MM-DD HH:mm Z').utcOffset(8)
        }
    }

    componentWillMount() {

        //
        // this.getLeadDetailFetch()
        this.getStudentFetch()
    }

    // get-students
    getStudentFetch() {
        const params = {data:{leadId:this.props.match.params.id}}

        Http.ajax(`${URL}/lead/get-students`,params).then(res => {
            const students = res.data.students.map(({name:label,id:value}) => ({label,value}))
            const selStudent = students.length > 0 && [students[0].value]

            this.setState({ students,selStudent }, () => {
                if (!!selStudent) {
                    this.getCourse()
                } else
                    this.getCoursesFetch()
            })
        })
    }

    // 获取课程
    getCourse() {
        const [studentId] = this.state.selStudent

        const params = {data:{studentId}}
        Http.ajax(`${URL}/lead/get-student-course`,params).then(res => {
            const selCourse = res.data && res.data.id || ''
            this.setState({selCourse}, this.getCoursesFetch)
        })

    }

    // 获取所有课程
    getCoursesFetch() {
        const params = {method: 'post'}
        Http.ajax(`${URL}/selections/chinese-courses`,params).then(res => {
            const courses = res.data.courses.map(({id:value,text:label}) => ({label,value}))
            let course = ''
            course = courses.filter(list => list.value === this.state.selCourse)
            course = course[0] && [course[0].value]
            this.setState({ courses, course })
        })
    }

    //
    handleState(v,state) {

        if (state === 'money') {
            v = v.replace(/\s/g, '')
        }

        this.setState({
            [state]: v
        }, () => {
            if (state === 'selStudent') {
                this.getCourse()
            }
        })
    }

    //
    backToModify() {
        const time = this.state.selDate
        if (!this.state.course) {
            Toast.info('请选择课程',1.5,null,false); return;
        }
        if (!time) {
            Toast.info(`请选择时间`,1,null,false); return;
        }
        this.props.changeVisitInfo({
            time: time.format && time.format('YYYY-MM-DD HH:mm:00'),
            studentId: this.state.selStudent[0]>>0,
            money: this.state.money,
            courseId: this.state.course && +this.state.course[0] || null
        })
        window.history.back()
    }

    //
    handleMinDate() {
        const minDate = moment(`${new Date().Format('yyyy-MM-dd hh:mm')} +0800`, 'YYYY-MM-DD HH:mm Z').utcOffset(8)
        this.setState({ minDate })
    }

    render() {
        const {money,students,selStudent,selDate, courses, course, minDate} = this.state
        return (
            <div id="Record">
                <List>
                    {/* 任务 */}
                    <ListItem className="list icon-xing extra-right" extra={`再联系`} >任务</ListItem>
                    {/* 学员 */}
                   {/* <Picker data={[students]}
                            title=""
                            cascade={false}
                            value={selStudent}
                            extra="请选择学员"
                            onChange={v => this.handleState(v,'selStudent')}>
                        <List.Item className="icon-xing"
                                   arrow="horizontal">
                            学员
                        </List.Item>
                    </Picker>*/}
                    {/* 课程 */}
                    <Picker data={[courses]}
                            title=""
                            cascade={false}
                            value={course}
                            extra="请选择课程"
                            onChange={v => this.handleState(v,'course')}>
                        <List.Item className="icon-xing extra-right"
                                   arrow="horizontal">
                            课程
                        </List.Item>
                    </Picker>
                    {/*<List.Item className="icon-xing" extra={selCourse.name}>课程</List.Item>*/}
                    {/* 再联系时间 */}
                    <DatePicker mode="datetime"
                                extra="请选择时间"
                                onChange={v => this.handleState(v, 'selDate')}
                                value={selDate}
                                minDate={minDate}
                    >
                        <List.Item className="icon-xing extra-right" arrow="horizontal" onClick={this.handleMinDate.bind(this)}>时间</List.Item>
                    </DatePicker>

                    {/* 可签金额 */}
                    <InputItem placeholder={`请输入可签金额`}
                               value={money}
                               className={`extra-right`}
                               type="phone"
                               maxLength={7}
                               onChange={v => this.handleState(v,'money')}
                               clear >
                        可签金额
                    </InputItem>


                </List>
                {/* 确认 */}
                <Button className="btn" onClick={this.backToModify.bind(this)}>确定</Button>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    visitInfo: state.visitInfo
})

const ListenLianxiInfo = connect(mapStateToProps,action)(ListenLianxi)

export default ListenLianxiInfo;