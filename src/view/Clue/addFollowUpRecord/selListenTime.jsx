import { Flex, Toast, Modal, List, Picker } from 'antd-mobile'
import './selListenTime.less'
import DateSwitch from '../visitTable/DateSwitch'
import * as action from '../../../redux/action/action'

const alert = Modal.alert
const Http = Base
const { api: URL } = Http.url
const { Link } = ReactRouterDOM
const { connect } = ReactRedux
const timeTable = (() => ([
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
    '18:30', '19:00', '19:30'
]))()

const minDate = new Date().Format('yyyy-MM-dd')
const maxDate = new Date().Format('yyyy-MM-dd')

class selListenTime extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            currentCardId: '',
            lessonSchedules: [],
            titleDate: [],

            lessons: [],
            hasLessonCardsData: [],
            oneToOneListens: [],

            currentIndex: '',  // 已有课堂-随堂试听
            customCardId: '',  // 添加课堂-一对一试听

            titleTimeList: [],

            teachers: [],
            currentTeacher: ''
        }
    }

    componentWillMount() {
        this.getStore()
        this.getTeacherFetch()
    }

    // 获取老师
    getTeacherFetch() {
        const params = { method: 'post' }
        Http.ajax(`${URL}/selections/teachers`, params).then(res => {
            if (res.code === '0') {
                const teachers = res.data.teachers.map(({ id: value, text: label }) => ({ label, value }))
                this.setState({ teachers })
            }
        })
    }

    // 切换老师
    changeTeaState(v) {
        const { oneToOneListens } = this.state
        const customCardId = oneToOneListens.findIndex(list => list.teacherId === v[ 0 ])


        this.setState({
            currentTeacher: v,
            customCardId,
            currentCardId: ''
        })
    }

    // 获取馆
    getStore() {
        const params = {}
        Http.ajax(`${URL}/lead/current-store`, params).then(res => {
            this.setState({
                storeId: res.data.storeId,
                storeName: res.data.storeName
            }, this.getAvaliableLessons)
        })
    }

    // 获取课堂
    getAvaliableLessons() {
        //this.props.match.params.courseId
        if (!this.state.storeId) return;

        this.setState({
            currentClickTime: '',
            currentCardId: ''
        })

        const [ startDate, , , , endDate ] = this.state.titleTimeList
        const params = {
            data: {
                courseId: this.props.match.params.courseId,
                endDate,
                startDate,
                storeId: this.state.storeId
            }
        }

        Http.ajax(`${URL}/listens/query-avaliable-lesson`, params).then(res => {
            const { lessonSchedules, courseName } = res.data || []
            this.setState({ lessonSchedules, courseName }, this.pushToPage)
        })
    }

    handleCardClick(currentCardId) {
        this.setState({
            currentCardId,
            customCardId: '',
            currentTeacher: ''
        })
    }

    handleCustomCardClick(item, customCardId) {
        const currentTeacher = [ item.teacherId ]
        this.setState({
            customCardId,
            currentCardId: '', // clean
            currentTeacher
        })
    }

    handleDateSwitch(time, titleDate, titleTimeList) {
        this.setState({
            titleDate,
            titleTimeList,
            exsitAppointmentCount: 0,
            emptyCourse: false
        }, this.getAvaliableLessons)
    }

    // 单选课程::: 随堂试听
    handleCourseSele(list) {
        const currentDate = new Date(list.time).Format('yyyy-MM-dd')

        if (currentDate < minDate) {
            Toast.info(`试听时间不能早于当天`, 1.5, null, false)
            return
        }

        // if (!list.data) return;
        if (list.time === this.state.currentClickTime) {
            return;
        }

        this.setState({
            currentClickTime: list.time,
            hasLessonCardsData: list.data || '',
            currentCardId: list.data ? 0 : '',
            customCardId: '',
            exsitAppointmentCount: list.data && list.data.exsitAppointmentCount || '',
            emptyCourse: !list.data,
            currentTeacher: '',  //清老师
            customCardId: '', // 清选中的课程
        }, () => {
            if (list.data) {
                this.scrollToBottom()
            }
        })

        this.emptyCourseSele(list)

    }

    // 一对一试听
    emptyCourseSele(list) {

        const appointmentTime = new Date(list.time).Format('yyyy-MM-dd hh:mm:ss')
        const courseId = this.props.match.params.courseId

        const params = {
            data: {
                appointmentTime,
                courseId
            }
        }
        //
        Http.ajax(`${URL}/get-one-to-one-listens`, params).then(res => {
            if (res.code !== '0') return;

            const { oneToOneListens } = res.data
            this.setState({
                oneToOneListens
            }, () => this.scrollToBottom(true))
        })
    }

    // 确认试听选择
    handleConfirm() {
        const { hasLessonCardsData, currentCardId, emptyCourse, currentClickTime, teachers, currentTeacher } = this.state

        let selLesson;


        /** 是否选择已有课堂 */
        if (currentCardId === '') {

            /** 没有选择要一对一试听的老师 */
            if (!currentTeacher) {
                Toast.info('请选择试听班级/老师', 2, null, false)
                return;
            }

            const { label: teacherName } = teachers.filter(list => list.value === currentTeacher[ 0 ])[ 0 ]
            selLesson = {
                lessonScheduleList: {
                    lessonScheduleId: '',
                    teacherName,
                    teacherId: currentTeacher[ 0 ]
                },
                listenStartTime: currentClickTime
            }

        } else {
            selLesson = Object.assign({}, hasLessonCardsData.listenLists[ currentCardId ])
        }

        const weeks = '日一二三四五六'
        const date = new Date(selLesson.listenStartTime)
        const monthYear = date.Format('MM-dd')
        const week = `周${weeks[ date.getDay() ]}`
        const millMS = date.Format('hh:mm')

        selLesson.showTime = `${monthYear} ${week} ${millMS}`
        selLesson.listenTime = new Date(date).Format('yyyy-MM-dd hh:mm:00')

        // 过去时间:: -- 添加随堂试听
        if (selLesson.listenTime < new Date().Format('yyyy-MM-dd hh:mm:00')) {
            alert(`提示`, `您添加的试听单为过去时间，请确认该学员已到访试听。`, [
                { text: '取消', onPress: () => { } },
                {
                    text: '确定添加', onPress: () => {
                    this.props.saveLessonScheduleId(selLesson)
                    window.history.back()
                }
                }
            ])
            return;
        }
        this.props.saveLessonScheduleId(selLesson)
        window.history.back()
    }

    // 格式化成时间戳 yyyy-MM-dd hh:mm
    tomillTime(date) {
        const millTime = date.replace(/[\-\:]/g, ' ').split(' ')
        millTime.splice(1, 1, millTime[ 1 ] - 1)

        return new Date(...millTime).getTime()
    }

    // 遍历
    pushToPage() {
        const { lessonSchedules, titleDate } = this.state
        let lessonChiTime = []

        const lessons = [ ...Array(timeTable.length * 5).keys() ].map((empty, listsIndex) => {

            const time_date = titleDate[ listsIndex % 5 ].date
            const time_hourMill = timeTable[ (listsIndex / 5) >> 0 ]
            let item = null
            let time = this.tomillTime(time_date + ' ' + time_hourMill)
            /* 处理成时间戳格式 */


            for (let list of lessonSchedules) {
                if (time === list.listenStartDate) {
                    item = list
                    break;
                }
            }

            return {
                data: item,
                time: time
            }
        })


        this.setState({
            lessons,
            lessonChiTime
        })
    }

    // 页面滚动到底部
    scrollToBottom(ontoone) {
        // const { offsetHeight: totalHeight } = this.refs.listenTimeBox
        // const bodyClientHeight = document.body.clientHeight
        //
        // let _scrollTop = totalHeight - bodyClientHeight
        // if (ontoone) {
        //     _scrollTop = this.refs.aloneListen.offsetTop
        // }
        // this.refs.SelListenTime.scrollTop = _scrollTop
    }

    render() {
        const {
            currentCardId, lessons, hasLessonCardsData, currentClickTime, courseName, exsitAppointmentCount,
            emptyCourse, currentTeacher, teachers, oneToOneListens, customCardId
        } = this.state

        const localClickTime = (argtime) => {
            const time = new Date(argtime)
            const week = '周' + '日一二三四五六'[ time.getDay() ]
            const date = time.Format('MM-dd')
            const MSTime = time.Format('hh:mm')

            return `${date} ${week} ${MSTime}`
        }

        const hasLessonLists = hasLessonCardsData.listenLists || []
        /** 当前选中日期有课的老师id */
        const hasLessonTeacherIds = hasLessonLists.map(item => item.lessonScheduleList.teacherId)
        const oneTooneTeachers = teachers.filter(item => !hasLessonTeacherIds.includes(item.value))

        return (
            <div id="SelListenTime" ref="SelListenTime">
                <div className="listeTimeBox" ref="listenTimeBox">
                    <DateSwitch
                        minDate={ minDate }  // 不要在这里改 go to line 17
                        className="calendar"
                        order
                        onClick={ this.handleDateSwitch.bind(this) }
                    />
                    <div className="time-table">
                        <ul className="left">
                            { timeTable.map((item, index) => (
                                <li key={ index }>{ item }</li>
                            )) }
                        </ul>
                        <ul className="right">
                            { lessons.map((list, index) => {
                                const currentDate = new Date(list.time).Format('yyyy-MM-dd')
                                const disabled = currentDate < minDate ? 'disabled' : ''

                                return (
                                    <li key={ index }
                                        className={ `${list.data ? 'hasData' : ''} ${disabled} ${list.time === currentClickTime ? 'active' : '' }` }
                                        onClick={ () => this.handleCourseSele(list, index) }>

                                        { list.data && !!list.data.totalListenerCount && list.data.totalListenerCount + '人试听' }
                                    </li>
                                )
                            }) }
                        </ul>
                    </div>

                    { /* CC试听人员提醒 */ }
                    { exsitAppointmentCount > 0 && <div className="tip">
                        提醒：此时间段您有{ exsitAppointmentCount }位家长要接待哦
                        <Link to={ `/Home#${new Date(hasLessonCardsData.listenStartDate).Format('yyyy-MM-dd')}` }>查看试听安排</Link>
                    </div> }

                    { /* 可选的已有试听课堂 */ }
                    <div className="cards">
                        { (hasLessonCardsData.listenLists || []).map((item, index) => {

                            const weeks = '日一二三四五六'
                            const date = new Date(item.listenStartTime)
                            const monthYear = date.Format('MM-dd')
                            const week = `周${weeks[ date.getDay() ]}`
                            const millMS = date.Format('hh:mm')

                            return <Flex
                                key={ index }
                                className={ `card ${currentCardId === index ? 'active' : ''}` }
                                onClick={ () => this.handleCardClick(index) }>

                                <Flex.Item className="list line-one">
                                    <label>分馆：</label><span>{ item.lessonScheduleList.storeName }</span>
                                </Flex.Item>
                                <Flex.Item className="list line-one">
                                    <label>老师：</label><span>{ item.lessonScheduleList.teacherName }</span>
                                </Flex.Item>
                                <Flex.Item className="list line-one">
                                    <label>课程：</label><span>{ courseName }</span>
                                </Flex.Item>
                                <Flex.Item className="list line-one">
                                    <label>学员：</label><span>{ item.lessonScheduleList.studentCount }</span>
                                </Flex.Item>
                                <Flex.Item className="list line-one">
                                    <label>时间：</label><span>{ monthYear } { week } { millMS }</span>
                                </Flex.Item>
                                <Flex.Item className="list line-one">
                                    <label>试听：</label><span>{ item.listenerCount }</span>
                                </Flex.Item>
                                <Flex.Item className="list line-one">
                                    <label>教室：</label><span>{ item.lessonScheduleList.classroomName }</span>
                                </Flex.Item>
                            </Flex>
                        }) }
                    </div>

                    { /* 添加一对一试听 */ }
                    { /*emptyCourse &&*/ }
                    { !!currentClickTime && <div className={ `aloneListen` } ref={ `aloneListen` }>
                        <div className="sel-info">
                            <Flex className="title">添加一对一试听</Flex>
                            <List.Item className="extra-right" extra={ courseName }>课程</List.Item>
                            <List.Item className="extra-right" extra={ localClickTime(currentClickTime) }>时间</List.Item>
                            <Picker data={ [ oneTooneTeachers ] }
                                    title=""
                                    cascade={ false }
                                    onChange={ v => this.changeTeaState(v) }
                                    value={ currentTeacher }
                                    extra="请选择授课老师">
                                <List.Item className={ currentTeacher ? 'extra-right' : 'empty extra-right' } arrow="horizontal">
                                    老师
                                </List.Item>
                            </Picker>
                        </div>
                        {
                            oneToOneListens.length > 0 &&
                            <div className="tips">
                                <Flex>当前时间段已预约的一对一试听</Flex>
                                <Flex>(如果试听课程相同，您可以选中下方试听单，直接添加试听学员)</Flex>
                            </div>
                        }
                        <div className="cards">
                            { oneToOneListens.map((item, index) => {
                                const date = localClickTime(item.appointmentTime)

                                return <Flex
                                    key={ index }
                                    className={ `card ${customCardId === index ? 'active' : ''}` }
                                    onClick={ () => this.handleCustomCardClick(item, index) }>

                                    <Flex.Item className="list line-one">
                                        <label>CC：</label><span>{ item.ccName }</span>
                                    </Flex.Item>
                                    <Flex.Item className="list line-one">
                                        <label>老师：</label><span>{ item.teacherName }</span>
                                    </Flex.Item>
                                    <Flex.Item className="list line-one">
                                        <label>学员：</label><span>{ item.studentName }</span>
                                    </Flex.Item>
                                    <Flex.Item className="list line-one">
                                        <label>课程：</label><span>{ item.courseName }</span>
                                    </Flex.Item>
                                    <Flex.Item className="list line-one">
                                        <label>时间：</label><span>{ date }</span>
                                    </Flex.Item>
                                </Flex>
                            }) }
                        </div>

                    </div> }

                    <Flex className="btn-main-long btn" onClick={ this.handleConfirm.bind(this) }>确定试听选择</Flex>
                </div>
            </div>
        )
    }
}

const selListenTimeConnect = connect(null, action)(selListenTime)

export default selListenTimeConnect;