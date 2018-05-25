import {Button, List, InputItem, Picker, Toast} from 'antd-mobile'
import './Record.less'
import * as action from '../../../redux/action/action'


const {connect} = ReactRedux
const Http = Base
const {api:URL} = Http.url
const ListItem = List.Item
class ListenRecord extends React.Component {
    constructor(props) {
        super(props)
        const lesson = this.props.lesson&&this.props.lesson || ''

        let recordListen = props.recordListen
        if (recordListen) {
            recordListen = Object.assign(props.recordListen, {
                lesson
            })
        }

        this.state = recordListen || {
            courses: [],
            students: [],
            course: '',

            selCourse: '',
            selStudent: '',
            estimatedPrice: '',
            stdPickerenbled: true,

            newStudent: '',

            appointmentId: props.location.hash.slice(1),

            leadStatus: 'VISIT_LISTEN',

            lesson,

            // teachers: [],

            result: JSON.parse(localStorage.getItem(`visitListenResult`)),
        }
    }

    componentWillMount() {

        // this.getTeachersFetch()
        if (this.state.appointmentId !== '' && this.props.visitStudentData.studentId) {
            const data = this.props.visitStudentData
            this.setState({
                stdPickerenbled: false,
                students: [{label: data.studentName, value: data.studentId}],
                selStudent: [data.studentId]
            }, this.getCourse)

        } else if ( !this.props.recordListen) {
            this.getStudentFetch()
        }
    }

    // 获取老师
    // getTeachersFetch() {
    //     const params = {method: 'POST', data: {} }
    //
    //     Http.ajax(`${URL}/selections/teachers`, params).then(res => {
    //         if (res.code !== '0') return;
    //         const teachers = res.data.teachers.map(({id: value, text: label}) => ({value, label}))
    //         this.setState({ teachers })
    //     })
    // }

    // get-students
    getStudentFetch() {
        const params = {data:{leadId:this.props.match.params.id}}

        Http.ajax(`${URL}/lead/get-students`,params).then(res => {
            const students = res.data.students.map(({name:label,id:value}) => ({label,value}))
            if (students.length < 5) {
                students.splice(students.length, 1, {label:'新学员', value:''})
            }
            const selStudent = students[0] && [students[0].value]

            this.setState({ students,selStudent }, this.getCourse)
        })
    }

    // 获取课程
    getCourse() {
        const [studentId] = this.state.selStudent

        if (!studentId) {
            this.getCoursesFetch()
            return;
        }

        const params = {data:{studentId}}
        Http.ajax(`${URL}/lead/get-student-course`,params).then(res => {
            const selCourse = res.data.id
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
    linktosellisttime() {
        if (!this.state.course) {
            Toast.info('请选择课程',1.5,null,false); return;
        }
        this.props.clearRecordListenData('')
        this.props.saveRecordListenState(this.state)
        this.props.history.push(`/selListenTime/${this.props.match.params.id}/${this.state.course[0]}`)
    }

    //
    handleState(v,state) {
        if (state === 'selStudent') {
            this.setState({
                newStudent: ''
            })
        }
        if (state === 'course') {
            this.setState({
                lesson: ''
            }, () => {
                this.props.clearLessonSchedule('')
            })
        }

        if (state === 'newStudent') {
            v = Http.legInputName(v)
        }

        if (state === 'estimatedPrice') {
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

    // 确定
    handleConfirm() {
        const {appointmentId,estimatedPrice,course, newStudent, selStudent, lesson, students} = this.state
        const studentNames = students.map(list => list.label)

        if (!selStudent[0] && !newStudent) {
            Toast.info('请录入试听学员',1.5,null,false); return;
        }
        if (!course) {
            Toast.info('请选择课程',1.5,null,false); return;
        }
        if (!lesson) {
            Toast.info('请选择课堂', 1.5, null, false); return
        }

        if (studentNames.includes(newStudent) && newStudent !== '新学员') {
            Toast.info(`学员 ${newStudent} 已存在，请检查`,1.5,null,false); return;
        }

        const listenList = {
            listenTime: lesson.listenTime,
            estimatedPrice,
            lessonScheduleId: lesson.lessonScheduleList.lessonScheduleId || '',
            studentId: selStudent[0] || null,
            studentName: selStudent[0] ? null : newStudent,

            isListen: lesson.listenTime < new Date().Format('yyyy-MM-dd hh:mm:ss'),
            teacherId: lesson.lessonScheduleList.teacherId || null,
            courseId: course[0] || null
        }

        if (appointmentId !== '') {
            const params = {method:'POST' ,data: {
                leadId: this.props.match.params.id,
                leadStatus: this.state.leadStatus,
                listens: [listenList],
                result: this.state.result,
            }}

            Http.ajax(`${URL}/lead/save-lead-history`,params).then(res => {
                if (res.code === '0') {
                    Toast.info(`添加成功`,1.5,null,false)
                    this.props.clearRecordListenData('')
                    this.props.clearLessonSchedule('')
                    sessionStorage.removeItem('clueListScrollTop')
                    sessionStorage.removeItem('clueListPage')
                    localStorage.removeItem(`visitListenResult`)
                    this.props.history.push(localStorage.getItem('formRouter') || '/clueList')
                }
            })
        } else {
            this.props.changeListenInfo({
                params: listenList,
                time: lesson.listenTime,
            })
            this.props.clearRecordListenData('')
            this.props.clearLessonSchedule('')
            window.history.back()
        }

    }


    render() {
        const {estimatedPrice,students,selStudent,stdPickerenbled, courses, course, newStudent, lesson} = this.state
        const {showTime, lessonScheduleList} = lesson || {}
        const {teacherName} = lessonScheduleList && lessonScheduleList || {}

        return (
            <div id="Record">
                <List>
                    {/* 任务 */}
                    <ListItem className="list icon-xing extra-right" extra={`试听`} >任务</ListItem>
                    {/* 学员 */}
                    <Picker data={[students]}
                            title=""
                            cascade={false}
                            value={selStudent}
                            extra="请选择学员"
                            disabled={!stdPickerenbled}
                            onChange={(v) => this.handleState(v,'selStudent')}>
                        <List.Item className="icon-xing extra-right"
                                   arrow={`${stdPickerenbled?'horizontal':''}`}>
                            试听学员
                        </List.Item>
                    </Picker>
                    {
                        selStudent && selStudent[0] === '' &&
                        <InputItem className="custom-student icon-xing extra-right"
                                   placeholder="请输入新学员姓名"
                                   maxLength={10}
                                   value={newStudent}
                                   onChange={v => this.handleState(v, 'newStudent')}
                                   clear >学员姓名</InputItem>
                    }
                    {/* 课程 */}
                    <Picker data={[courses]}
                            title=""
                            cascade={false}
                            value={course}
                            extra="请选择课程"
                            onChange={(v) => this.handleState(v,'course')}>
                        <List.Item className="icon-xing extra-right"
                                   arrow={`horizontal`} >
                            试听课程
                        </List.Item>
                    </Picker>
                   {/* <List.Item className="icon-xing" extra={selCourse.name}>课程</List.Item>*/}

                    <div onClick={() => this.linktosellisttime()}>
                        <ListItem extra={showTime||''} arrow="horizontal" className="icon-xing label-long extra-right" >
                            试听时间
                        </ListItem>
                    </div>
                    {/* 老师 */}
                    <div>
                        <ListItem extra={teacherName||''}  className="icon-xing label-long extra-right" >
                            老师
                        </ListItem>
                    </div>
                    {/* 可签金额 */}
                    <InputItem placeholder={`请输入可签金额`}
                               value={estimatedPrice}
                               className={`extra-right`}
                               type="phone"
                               maxLength={7}
                               onChange={v => this.handleState(v,'estimatedPrice')}
                               clear >
                        可签金额
                    </InputItem>


                </List>
                {/* 确认 */}
                <Button className="btn" onClick={this.handleConfirm.bind(this)}>确定</Button>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    lesson: state.lessonSchedule,
    visitStudentData: state.visitStudentData,
    recordListen: state.recordListen,
})
const ListenRecordCon = connect(mapStateToProps,action)(ListenRecord)

export default ListenRecordCon;