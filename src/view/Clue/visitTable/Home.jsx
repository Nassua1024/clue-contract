import {Flex, Button} from 'antd-mobile'

import DateSwitchWrap from './DateSwitch'
import './Home.less'
import * as action from '../../../redux/action/action'

const Http = Base
const { connect } = ReactRedux
const {api:URL} = Http.url
class Home extends React.Component {
    constructor(props) {
        super(props)
        let appointmentDate = new Date().Format('yyyy-MM-dd')
        if (props.location.hash) {
            const hash = props.location.hash.slice(1)
            appointmentDate = hash
        }
        this.state = {
            appointmentDate,
            appointments: [],
            nextTaskIndex: ''
        }
    }

    // 请求数据
    getAppointmentsFetch() {
        const {appointmentDate} = this.state


        /**
         * @appointmentDate: {String} 任务日期 yyyy-MM-dd格式
         *
         */
        const params = {
            data: {
                appointmentDate
            }
        }

        Http.ajax(`${URL}/appointments`,params).then((res) => {

            const appointments = res.data.appointments || []
            const {appointmentDate} = this.state
            const nowDateString = new Date().Format('yyyy-MM-dd')
            const nowDateTime = new Date().getTime()
            let nextTaskIndex = ''

            if (appointmentDate === nowDateString) {

                const undoneTasks = appointments.map(({appointmentTime}, index) => ({
                    appointmentTime,
                    index
                })).filter(({appointmentTime}) => appointmentTime >= nowDateTime - 60000)
                nextTaskIndex = undoneTasks[0] && undoneTasks[0].index
            }

            this.setState({
                appointments,
                nextTaskIndex
            })
        })
    }


    componentWillMount() {

        this.getAppointmentsFetch()
    }

    handleDateSwitch(appointmentDate) {

        this.setState({
            appointmentDate
        }, this.getAppointmentsFetch)

    }

    // 签订合同按钮 --
    updateStatus(item) {

        // 保存线索关联的标签
        // this.props.saveCustomerLabels(item.customerLabels)
        // 保存线索关联标签的ID
        // this.props.saveClueConcernLabels(item.id)

        this.props.clearVisitStudentData('')
        if (!this.props.location.hash)
            localStorage.setItem('formRouter',`/Home`)
        switch (item.leadStatus) {
            case 'VISIT_LISTEN':
                this.props.saveVisitStudentData(item)
                this.props.history.push(`/followup/listen/${item.leadId}/${item.leadHistortId}#${item.id}`)
                break
            case 'PERMISSION_VISIT':
                this.props.saveVisitStudentData(item)
                this.props.history.push(`/followup/visit/${item.leadId}/${item.leadHistortId}#${item.id}`)
                break
            default : this.props.history.push(`/AudioSheet/${item.leadId}`)
        }
    }

    // 拨打电话
    call(e) {
        e.stopPropagation()
    }

    // 跳转线索详情
    toClueDetail(item, e) {
        if (!this.props.location.hash)
            localStorage.setItem('formRouter',`/Home`)
        this.props.clearClueDetail('')
        this.props.history.push(`/clueDetail/${item.leadId}`)
        this.props.saveClueConcernLabels(item.leadId)
    }

    render() {
        const {nextTaskIndex, appointmentDate} = this.state
        const appointments = this.state.appointments || []

        return (
            <div id="VisitTable">
                <DateSwitchWrap appointmentDate={appointmentDate} headChange onClick={this.handleDateSwitch.bind(this)} />

                {/* 约访表卡片 */}
                <ul className="cards">
                    {appointments.map((item, index) => (
                        <li className={`card ${index===nextTaskIndex?'next-task':''}`} key={index} >
                            <div className="state">{item.taskTypeDescription}</div>
                            <i className="icon-badge"></i>
                            <div className="box" onClick={(e) => this.toClueDetail(item,e)}>
                                <Flex className="mb24">
                                    <span className="time">
                                        {new Date(item.appointmentTime).Format('hh:mm')}
                                    </span>
                                </Flex>
                                <Flex className="mb24">
                                    <span className="source">
                                        {item.courseName}
                                    </span>
                                    <span className="laiy">{item.sourceName}</span>
                                </Flex>
                                <Flex className="mb14">
                                    <label>学　员： </label>
                                    <span className="value">{item.studentName}　{!!item.studentAge && item.studentAge+'岁'}</span>
                                </Flex>
                                <Flex className="mb14">
                                    <label>联系人： </label>
                                    <span className="value">
                                        {item.contactName}
                                        <a className="tel" onClick={e => this.call(e)} href={`tel://${item.contactMobile}`}>{item.contactMobile}</a>
                                        <i className="icon-tel"></i>
                                    </span>
                                </Flex>
                                <Flex className="mb14">
                                    <label>老　师： </label><span className="value">{item.teacherName}</span>
                                </Flex>
                            </div>
                            <Button className="btn" onClick={() => this.updateStatus(item)}>签订合同</Button>
                        </li>
                    ))}
                </ul>

                {/* 没有数据 */}
                {
                    appointments.length <= 0 &&
                    <Flex className="no-data">暂无数据~</Flex>
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    // customerLabels: state.customerLabels
})
const visitTable = connect(
    mapStateToProps,
    action
)(Home)

export default visitTable;