import {Flex, Modal,Toast} from 'antd-mobile'
import '../listen/followListen.less'
import * as action from '../../../../redux/action/action'

const Http = Base
const {api:URL} = Http.url
const {connect} = ReactRedux
const alert = Modal.alert
const FlexItem = Flex.Item
class followUpVisit extends React.Component {
    constructor(props) {
        super(props)

        /**
         *  @isVisit {Number} 是否到访 0/1
         */
        this.state = {
            isVisit: '',
            isSignContract:'',
            reason: '',
            result: '',

            appointmentId: props.location.hash.slice(1)
        }
    }

    handleVisit(isVisit) {

        this.setState({
            isVisit,
            isSignContract: '',
            reason: '',
            result: ''
        })

    }
    signContract(isSignContract, result) {
        this.setState({
            isSignContract,
            result,
        }, () => {
            this.saveVisitResult()
            // 其他状态
            if (isSignContract===0)
                this.otherState()
            // 签订合同
            if (isSignContract===1) {
                this.props.history.push(`/AudioSheet/${this.props.match.params.id}`)
            }
        })


    }

    // 拉黑/未接通/挂机/关机
    overState(state) {
        this.setState({
            reason: state
        }, this.saveVisitResult)
        const alertMsg = <div style={{textAlign:'left'}}>您将为此条线索直接生成一条“{state}”状态的跟进记录。<br />如有其它备注，请取消并选择“其它状态”。</div>
        alert('新的跟进记录', alertMsg, [
            { text: '取消', onPress: () => {} },
            { text: '确认添加', onPress: () => {this.overStateFetch(state)} },
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
    saveVisitResult() {
        const {isVisit,result, reason} = this.state
        const visitListenResult = JSON.stringify({
            isVisit: !!isVisit,
            result: result || '',
            reason: reason || ''
        })
        localStorage.setItem('visitListenResult', visitListenResult)
    }

    // 其他状态
    otherState(reason) {
        const {id, leadHistoryId} = this.props.match.params
        this.setState({
            reason
        }, () => {
            this.saveVisitResult()
            this.props.history.push(`/ClueModify/${id}/${leadHistoryId}#result`)
        })
    }

    // 返回上一页
    backLastPage() {
        window.history.back()
    }

    // 预约下次到访
    handleNextVisit(reason) {
        this.setState({
            reason
        }, () => {
            this.saveVisitResult()
            this.props.history.push(`/recordVisit/${this.props.match.params.id}#${this.state.appointmentId}`)
        })

    }

    render() {
        const {isVisit, isSignContract} = this.state
        const isVisitActive1 = isVisit===1?'active':''
        const isVisitActive0 = isVisit===0?'active':''
        const isSignContractActive1 = isSignContract===1?'active':''
        const isSignContractActive0 = isSignContract===0?'active':''

        const {type} = this.props.match.params
        return (
            <div id="FollowUp" className="visit">
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
                        <div className="title">到访结果</div>
                        <Flex className="btn1s">
                            <FlexItem className={`btn1 ${isSignContractActive1}`} onClick={() => this.signContract(1, '签订合同')}>签订合同</FlexItem>
                            <FlexItem className={`btn1 ${isSignContractActive0}`} onClick={() => this.signContract(0, '其他状态')}>其他状态</FlexItem>
                        </Flex>
                    </div>
                }

                {/*未到访*/}
                {
                    this.state.isVisit === 0 &&
                    <div className="regio">
                        <div className="title">未到访的原因：</div>
                        <Flex className="btn1s">
                            <FlexItem className="btn1" onClick={() => this.handleNextVisit('预约下次到访')}>预约下次到访</FlexItem>
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

                <div className="back-box">
                    <div className="back btn-main-long" onClick={this.backLastPage.bind(this)}>返回</div>
                </div>
            </div>
        )
    }
}


const mapStateTpProps = (state) => ({
    state
})

const FollowUpVisitConnect = connect(mapStateTpProps, action)(followUpVisit)

export default FollowUpVisitConnect;