import {Flex, Modal, Toast} from 'antd-mobile'
import './followUpReContact.less'

const Http = Base
const {api:URL} = Http.url
const alert = Modal.alert
const states = [
    {
        name: '下一步状态',
        id: 'a'
    },
    {
        name: '未接通',
        id: 'NOT_CONNECT'
    },
    {
        name: '关机',
        id: 'POWER_OFF'
    },
    {
        name: '挂机',
        id: 'HANG_UP'
    },
    {
        name: '拉黑',
        id: 'PULL_THE_BLACK'
    }
]
class updateFollowState extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            state: ''
        }
    }

    handleState(item) {
        const {id:state} = item
        this.setState({
            state
        }, () => {
            const alertModal = ['NOT_CONNECT','POWER_OFF','HANG_UP','PULL_THE_BLACK']
            const index = alertModal.indexOf(state)
            const style = {
                textAlign: 'left',
                fontSize: '.28rem',
                padding: '0 .2rem'
            }
            const alertMsg = <div style={style}>您将为此条线索直接生成一条“{item.name}”状态的跟进记录。<br />如有其它备注，请取消并选择“下一步状态”。</div>
            if (index > -1) {
                alert(`新的跟进记录`,alertMsg,[
                    { text: '取消', onPress: () => {} },
                    { text: '确认添加', onPress: () => {this.getLeadAutoUpdateFetch(alertModal[index])} },
                ])
            }
        })

        // 下一步状态
        if (item.name === '下一步状态') {
            const {id:leadId, leadHistoryId} = this.props.match.params
            this.props.history.push(`/ClueModify/${leadId}/${leadHistoryId}`)
        }
    }

    // 关机，拉黑等
    getLeadAutoUpdateFetch(state) {
        const leadStatus = states.filter(list => list.id === state)[0].id
        const params = {
            data: { leadStatus, leadId: this.props.match.params.id}
        }
        Http.ajax(`${URL}/lead/auto-update`,params).then(res => {
            if (res.code == 0) {
                Toast.info(`添加成功`, 1.5, null, false)
                sessionStorage.removeItem('clueListScrollTop')
                sessionStorage.removeItem('clueListPage')
                window.history.back()
            } else {
                Toast.info(res.message || '请求失败')
            }
        })
    }

    // 返回
    handleCancel() {
        window.history.back()
    }

    render() {
        const {state} = this.state
        return (
            <div id="UpdateFollowState">
                {states.map(item => (
                    <Flex key={item.id} className={`btn ${state===item.id?'active':''}`} onClick={() => this.handleState(item)}>{item.name}</Flex>
                ))}

                <Flex className="btn-ctrl btn-main-long" onClick={this.handleCancel.bind(this)}>取消</Flex>
            </div>
        )
    }
}

export default updateFollowState;