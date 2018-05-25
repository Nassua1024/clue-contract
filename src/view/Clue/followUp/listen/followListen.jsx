import {Flex, Modal, Toast} from 'antd-mobile'
import './followListen.less'
import * as action from '../../../../redux/action/action'

const { connect } = ReactRedux
const Http = Base
const {api:URL} = Base.url
const alert = Modal.alert
const FlexItem = Flex.Item
class followUpMake extends React.Component {

    constructor(props) {
        super(props)

        /**
         *  @isVisit {Number} 是否到访 0/1
         */
        this.state = {
            isVisit: '',
            isListen: '',
            isSignContract:'',

            listens: [],

            listShow: false,

            appointmentId: props.location.hash.slice(1),

            reason: '',
            result: '',
        }
    }

    componentWillMount() {
        const leadId = this.props.match.params.id
        const params = {
            data: {
                leadId
            }
        }

        Http.ajax(`${URL}/lead/listens`,params).then(res => {

            const {listens} = res.data

            this.setState({
                listens
            })
        })
    }

    handleVisit(isVisit) {

        this.setState({
            isVisit,
            isListen: '',
            isSignContract: ''
        })

    }

    handleListen(isListen) {
        this.setState({
            isListen,
            isSignContract: ''
        })
    }

    signContract(isSignContract,result) {
        this.setState({
            isSignContract,
            result
        },() => {
            this.saveListenResult()
            // 其他状态
            if (isSignContract===0)
                this.otherState()
            // 签订合同
            if (isSignContract===1)
                this.props.history.push(`/AudioSheet/${this.props.match.params.id}`)
        })
    }

    // 拉黑/未接通/挂机/关机
    overState(reason) {
        this.setState({
            reason
        }, this.saveListenResult)
        const alertMsg = <div style={{textAlign:'left'}}>您将为此条线索直接生成一条“{reason}”状态的跟进记录。<br />如有其它备注，请取消并选择“其它状态”。</div>
        alert('新的跟进记录', alertMsg, [
            { text: '取消', onPress: () => {} },
            { text: '确认添加', onPress: () => {this.overStateFetch(reason)} },
        ])
    }

    // 拉黑/未接通/挂机/关机 添加请求
    overStateFetch(state) {
        const status = [
            { label: '未接通', value: 'NOT_CONNECT'},
            { label: '关机'  , value: 'POWER_OFF'},
            { label: '挂机'  , value: 'HANG_UP'},
            { label: '拉黑'  , value: 'PULL_THE_BLACK'},
        ]
        const leadId = this.props.match.params.id
        const leadStatus = status.filter(list => list.label == state)[0].value
        const params = {data: {leadId, leadStatus}}

        Http.ajax(`${URL}/lead/auto-update`,params).then(res => {
            if (res.code === '0') {
                Toast.info(`添加成功`, 1.5, null, false)
                sessionStorage.removeItem('clueListScrollTop')
                sessionStorage.removeItem('clueListPage')
                this.props.history.push(localStorage.getItem('formRouter') || '/clueList')

            }
        })
    }

    // 跳转出页面，保存试听结果到redux
    saveListenResult() {
        const {isListen,isVisit,result,reason} = this.state
        localStorage.setItem(`visitListenResult`, JSON.stringify({
            isListen: !!isListen,
            isVisit: !!isVisit,
            result: result || '',
            reason: reason || ''
        }))
    }

    // 其他状态
    otherState(reason) {
        const {id, leadHistoryId} = this.props.match.params
        this.setState({
            reason
        }, () => {
            this.saveListenResult()
            this.props.history.push(`/ClueModify/${id}/${leadHistoryId}#result`)
        })
    }

    // 返回上一页
    backLastPage() {
        window.history.back()
    }

    // 预约下次试听
    nextListenTask(reason) {
        this.setState({
            reason
        }, () => {
            this.saveListenResult()
            this.props.history.push(`/recordListen/${this.props.match.params.id}#${this.state.appointmentId}`)
        })
    }


    // 展开试听单
    unfoldListens() {
        this.setState({
            listShow: !this.state.listShow
        })
    }

    render() {
        const {isVisit, isListen, isSignContract, listens, listShow} = this.state
        const isVisitActive1 = isVisit===1?'active':''
        const isVisitActive0 = isVisit===0?'active':''
        const isListenActive1 = isListen===1?'active':''
        const isListenActive0 = isListen===0?'active':''
        const isSignContractActive1 = isSignContract===1?'active':''
        const isSignContractActive0 = isSignContract===0?'active':''

        const {type} = this.props.match.params
        const showStyle = {
            height: `${3*listens.length}rem`
        }
        const hideStyle = {
            height: listens.length > 0 ? '3rem' : 0
        }
        return (
            <div id="FollowUp">
                <div className="scroll-box">
                    {/* list */}
                    <div className="studentList-box" style={listShow?showStyle:hideStyle}>
                        {listens.map((item, index) => {
                            const time = new Date(item.appointmentTime)
                            const monthDate = time.Format('MM-dd')
                            const week = `周${'日一二三四五六'.charAt(time.getDay())}`
                            const millMS = time.Format('hh:mm')
                            return <div className="studentsList" key={index} >
                                <Flex className="box">
                                    <label>{item.courseName}</label>
                                    <span className="ml30">{item.sourceName}</span>
                                </Flex>
                                <Flex className="box">
                                    <Flex className="left">
                                        <label>学员:</label>
                                        <span>{item.studentName} {!!item.studentAge?item.studentAge+'岁':''}</span>
                                    </Flex>
                                    <Flex className="right">
                                        <label>老师:</label>
                                        <span>{item.teacherName}</span>
                                    </Flex>
                                </Flex>
                                <Flex className="box">
                                    <Flex className="left">
                                        <label>联系人:</label>
                                        <span>{item.contactName} {item.contactMobile}</span>
                                    </Flex>
                                    <Flex className="right">
                                        <label>教室:</label>
                                        <span>{item.classroomName}</span>
                                    </Flex>
                                </Flex>
                                <Flex className="box left">
                                    <label>时间:</label>
                                    <span>{`${monthDate} ${week} ${millMS}`}</span>
                                </Flex>
                            </div>
                        })}

                    </div>
                    {
                        listens.length > 1 &&
                        <div className="unfold" onClick={this.unfoldListens.bind(this)}><i className={listShow?'active':''}></i>更多试听单</div>
                    }




                    <div className="regio">
                        <div className="title">您的学员是否到访</div>
                        <Flex className="btn1s">
                            <FlexItem className={`btn1 ${isVisitActive1}`} onClick={() => this.handleVisit(1)}>到访</FlexItem>
                            <FlexItem className={`btn1 ${isVisitActive0}`} onClick={() => this.handleVisit(0)}>未到访</FlexItem>
                        </Flex>
                    </div>
                    {/* 到访 */}
                    {
                        this.state.isVisit === 1 &&
                        <div className="regio">
                            <div className="title">您的学员是否试听</div>
                            <Flex className="btn1s">
                                <FlexItem className={`btn1 ${isListenActive0}`} onClick={() => this.handleListen(0)}>未试听</FlexItem>
                                <FlexItem className={`btn1 ${isListenActive1}`} onClick={() => this.handleListen(1)}>已试听</FlexItem>
                            </Flex>
                        </div>
                    }

                    {/*未到访*/}
                    {
                        this.state.isVisit === 0 &&
                        <div className="regio">
                            <div className="title">未到访的原因：</div>
                            <Flex className="btn1s">
                                <FlexItem className="btn1" onClick={() => this.nextListenTask('预约下次试听')}>预约下次试听</FlexItem>
                                <FlexItem className="btn1" onClick={() => this.otherState('其他状态')}>其他状态</FlexItem>
                            </Flex>
                            <Flex className="btn1s">
                                <FlexItem className="btn1" onClick={() => this.overState('关机')}>关机</FlexItem>
                                <FlexItem className="btn1" onClick={() => this.overState('挂机')}>挂机</FlexItem>
                            </Flex>
                            <Flex className="btn1s">
                                <FlexItem className="btn1" onClick={() => this.overState('未接通')}>未接通</FlexItem>
                                <FlexItem className="btn1" onClick={() => this.overState('拉黑')}>拉黑</FlexItem>
                            </Flex>
                        </div>
                    }


                    {/* 试听||未试听 */}
                    {
                        (isListen === 0 || isListen === 1) &&
                        <div className="regio">
                            <div className="title">试听结果</div>
                            <Flex className="btn1s">
                                <FlexItem className={`btn1 ${isSignContractActive1}`} onClick={() => this.signContract(1,`签订合同`)}>签订合同</FlexItem>
                                <FlexItem className={`btn1 ${isSignContractActive0}`} onClick={() => this.signContract(0,`其他状态`)}>其他状态</FlexItem>
                            </Flex>
                        </div>
                    }
                </div>

                <div className="back-box">
                    <div className="back btn-main-long" onClick={this.backLastPage.bind(this)}>返回</div>
                </div>

            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    clueConcernLabels: state.clueConcernLabels
})
const followUpMakeConnect = connect(
    mapStateToProps,
    action
)(followUpMake)


export default followUpMakeConnect;