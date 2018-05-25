import {Flex,Picker,List,DatePicker,Toast, InputItem, Button} from 'antd-mobile'
import '../../followUp/auditionSheet/auditionSheet.less'
import moment from 'moment'
import * as action from '../../../../redux/action/action'

const { connect } = ReactRedux
const Http = Base
const {api:URL} = Http.url
class AddAudition extends React.Component {
    constructor(props) {
        super(props)

        const lesson = this.props.lesson || {}
        if (props.auditionState) {
            props.auditionState.lesson = lesson
        }

        this.state = props.auditionState || {
            students:[],
            courses:[],
            teachers:[],
            currentTeacher: '',
            student:'',
            course:'',
            coursecc:'',
            time: moment(`${new Date().Format('yyyy-MM-dd hh:mm')} +0800`, 'YYYY-MM-DD HH:mm Z').utcOffset(8),

            newStudent: '',

            lesson: lesson
        }
    }

    componentWillMount() {
        if (this.props.auditionState) return;
        this.getStudents()
        this.getTeacherFetch()
    }

    // 获取老师
    getTeacherFetch() {
        const params = {method:'post'}
        Http.ajax(`${URL}/selections/teachers`,params).then(res => {
            const teachers = res.data.teachers.map(({id:value,text:label}) => ({label,value}))
            this.setState({teachers})
        })
    }

    // 获取课程
    getCourse() {
        const studentId = this.state.student && this.state.student[0] || ''

        if (!studentId) {
            this.getCoursesFetch()
            return;
        }

        const params = {data:{studentId}}
        Http.ajax(`${URL}/lead/get-student-course`,params).then(res => {
            if (res.code === '0') {
                const coursecc = res.data.id || ''
                this.setState({coursecc}, this.getCoursesFetch)
            }
        })
    }

    // getStudents
    getStudents() {
        const params = {data:{leadId:this.props.match.params.id}}
        Http.ajax(`${URL}/lead/get-students`,params).then(res => {
            if (res.code == 0) {
                const students = res.data.students.map(({name:label,id:value}) => ({label,value}))
                if (students.length < 5) {
                    students.splice(students.length, 1, {label:'新学员', value:''})
                }
                const student = students[0] && [students[0].value]
                this.setState({
                    students,student
                },this.getCourse)
            }
        })
    }


    //
    changeTeaState(v) {
        this.setState({
            currentTeacher: v
        })
    }

    // 获取课程
    getCoursesFetch() {
        const params = {method: 'post'}
        Http.ajax(`${URL}/selections/chinese-courses`,params).then(res => {
            const courses = res.data.courses.map(({id:value,text:label}) => ({label,value}))
            let course = ''
            course = courses.filter(list => list.value === this.state.coursecc)
            course = course[0] && [course[0].value]
            this.setState({ courses, course })
        })
    }

    // 添加单
    addListenResult() {
        const {leadHistoryId, id:leadId} = this.props.match.params    // 线索跟进Id
        const courseId = this.state.course && this.state.course[0]              // 课堂id
        const _studentId = this.state.student && this.state.student[0]             // 学员id
        const {teacherId} = Object.keys(this.state.lesson).length && this.state.lesson.lessonScheduleList      // 老师id
        const listenTime = Object.keys(this.state.lesson).length && this.state.lesson.listenTime
        const { students } = this.state
        const studentNames = students.map(list => list.label)

        let studentId = _studentId,
            studentName = '';

        if (!_studentId) {
            studentId = ''
            studentName = this.state.newStudent
        }

        if (!studentId && !studentName) {
            Toast.info('请录入学员', 1.5, null, false); return;
        }
        if (!courseId) {
            Toast.info('请选择课程', 1.5, null, false); return;
        }
        if (!listenTime) {
            Toast.info('请选择时间', 1.5, null, false); return;
        }
        if (studentNames.includes(studentName) && studentName !== '新学员') {
            Toast.info(`学员 ${studentName} 已存在，请检查`,1.5,null,false); return;
        }

        const params = {data: {
            leadId, courseId, listenTime,teacherId, studentName,studentId,
            isListen: listenTime < new Date().Format('yyyy-MM-dd hh:mm'),
            lessonScheduleId: this.state.lesson.lessonScheduleList.lessonScheduleId || ''
        }}

        Http.ajax(`${URL}/make-up-listen`,params).then(res => {
            if (res.code == 0) {
                Toast.info('添加成功', 1.5, null, false)
                this.props.clearAduitionState('')
                this.props.clearLessonSchedule('')
                window.history.back()
                // this.props.history.push(`/signContractEn/${this.props.match.params.id}`)
            }
        })
    }

    // 取消
    handleExit() {
        this.props.clearAduitionState('')
        this.props.clearLessonSchedule('')
        // this.props.history.push(`/signContractEn/${this.props.match.params.id}`)
        window.history.back()
    }

    // changeStudent
    changeState(v, state) {

        if (state === 'newStudent') {
            v = Http.legInputName(v)
        }

        if (state === 'course') {
            this.setState({
                lesson: ''
            })
            this.props.clearLessonSchedule('')
        }

        if (state === 'student') {
            this.setState({
                newStudent: ''
            })
        }

        this.setState({
            [state]: v
        })
    }

    // 跳转选择课堂
    linkToSelLesson() {
        this.props.addAduitionState(this.state)
        this.props.history.push(`/selListenTime/${this.props.match.params.id}/${this.state.course[0]}`)
    }

    render() {
        const {students,student,course,lesson,teachers,currentTeacher,courses, newStudent} = this.state
        return (
            <div id="AddAudition">
                {/* 学员 */}
                <Picker data={[students]}
                        title=""
                        cascade={false}
                        onChange={v => this.changeState(v, 'student')}
                        value={student}
                        extra="" >
                    <List.Item className="icon-xing extra-right" arrow="horizontal" >
                        学员
                    </List.Item>
                </Picker>
                {
                    student&&student[0] === '' &&
                    <InputItem className="custom-student icon-xing extra-right"
                               placeholder="请输入新学员姓名"
                               value={newStudent}
                               maxLength={10}
                               onChange={v => this.changeState(v, 'newStudent')}
                               clear >学员姓名</InputItem>
                }
                {/* 课程 */}
                {/*<List.Item className="icon-xing" arrow="" extra={course.name} >*/}
                {/*课程*/}
                {/*</List.Item>*/}
                <Picker data={[courses]}
                        title=""
                        cascade={false}
                        onChange={v => this.changeState(v, 'course')}
                        value={course}
                        extra="" >
                    <List.Item className="icon-xing extra-right" arrow="horizontal">
                        课程
                    </List.Item>
                </Picker>
                {/*时间 */}
                {/*<DatePicker mode="datetime"*/}
                            {/*extra="请选择日期"*/}
                            {/*onChange={(v) => this.changeState(v, 'time')}*/}
                            {/*value={time}*/}
                {/*>*/}
                    {/*<List.Item className="icon-xing extra-right" arrow="horizontal">时间</List.Item>*/}
                {/*</DatePicker>*/}
                <List.Item extra={lesson.showTime} className="icon-xing extra-right" arrow="horizontal" onClick={this.linkToSelLesson.bind(this)}>时间</List.Item>
                {/* 老师 */}
                {/*<Picker data={[teachers]}*/}
                        {/*title=""*/}
                        {/*cascade={false}*/}
                        {/*onChange={v => this.changeTeaState(v)}*/}
                        {/*value={currentTeacher}*/}
                        {/*extra="" >*/}
                    {/*<List.Item className="icon-xing extra-right" arrow="horizontal" >*/}
                        {/*老师*/}
                    {/*</List.Item>.lessonScheduleList*/}
                {/*</Picker>*/}
                <List.Item extra={lesson.lessonScheduleList&&lesson.lessonScheduleList.teacherName} className="icon-xing extra-right" >
                    老师
                </List.Item>
                <Flex className="btns">
                    <Button className="next" onClick={this.handleExit.bind(this)}>取消</Button>
                    <Button className="ok" onClick={this.addListenResult.bind(this)}>确定添加</Button>
                </Flex>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    auditionState: state.auditionState,
    lesson: state.lessonSchedule,
})
const AddAuditionConnect = connect(
    mapStateToProps,
    action
)(AddAudition)

export default AddAuditionConnect;