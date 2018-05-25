import * as action from '../../../redux/action/action'

import {Flex, InputItem, Toast, Modal} from 'antd-mobile';
import LinkNextStep from './Add_Next_Step'
import './addClue.less'

const alert = Modal.alert
const Http = Base
const localMobile = Http.mobile
const {api:URL} = Http.url
const { connect } = ReactRedux
const alertMsg = (msg) => (
    <div className="alert-msg">
        <Flex>该手机号在线索库中已存在，请确认！</Flex>
        <Flex className="info"><label>{msg.name}</label><span>{msg.mobile}</span></Flex>
        <Flex><label>分馆:</label><span>{msg.storeName}</span></Flex>
        <Flex><label>cc:</label><span>{msg.ccName}</span></Flex>
        <Flex><label>线索状态:</label><span>{msg.leadStatus}</span></Flex>
    </div>
)
class AddTelCpts extends React.Component {

    constructor(props) {
        super(props)

        const { label, value } = props.linkManTel

        /**
         * @label: {String} 手机号 188 8888 8888
         * @value: {String} 手机号 18888888888
         * @hasError: {Boolean} 验证手机号
         */

        this.state = {
            label: label || '',
            value: value || '',
            hasError: false,
            focused: true,

            fromPreview: false,
            btnText: '下一步',
            linkUrl: '/add/name'
        }
    }

    componentDidMount() {

        /** 来源预览页 */
        this.props.location.hash === '#alter'
        && this.setState({
            fromPreview: true,
            btnText: '返回',
            linkUrl: '/add/confirm-clue'
        })

        this.refs.addClueMobile.focus()
    }

    /** 输入手机号change事件 */
    handleChange (value) {
        const valueLength = value.replace(/\s/g, '').length
        const matchRole = /^1\d{10}$/.test(value.replace(/\s/g, ''))
        const hasError = !matchRole && valueLength > 0
        
        this.setState({
            label: value.replace(/\s/g, '-'),
            value: value.replace(/\s/g, ''),
            hasError
        }, () => {
            if (!this.state.hasError) {
                const {fromPreview} = this.state
                const tel = this.props.linkManTel
                let btnText = fromPreview?(value===tel?'返回':'保存'):'下一步'

                this.setState({
                    btnText
                })
            }
        })
    }

    /** 验证失败 */
    onErrorClick () {
        const { hasError } = this.state
        if (hasError)
            Toast.info('格式有误~', 1,null,false)
    }

    /** 下一步 */
    handleLinkClick () {
        const {value:mobile, linkUrl} = this.state
        const params = {data: {mobile}}

        Http.ajax(`${URL}/lead/check-mobile-usage`,params).then(res => {
            if (res.code === '0') {
                const {lead} = res.data
                if (lead !== null) {
                    alert('注意', alertMsg(lead), [
                        {
                            text: '确认',
                            onPress: () => {
                                this.setState({
                                    label: '', value: ''
                                })
                                this.props.saveLinkManName({name:''})
                                this.props.saveLinkManTel({label: '', value: ''})
                                this.props.saveLinkManGrade({label: '', value: ''})
                                this.props.saveStudentName({name:''})
                                this.props.saveStudentType({label: '', value: ''})
                                this.props.saveLinkManTel({label: '', value: ''})
                                this.props.saveLinkManCourse({label: '', value: ''})
                                this.props.saveLinkManSource({label: '', value: ''})
                                this.props.savePraiseStudent({label: '', value: ''})
                            }
                        }
                    ])
                } else {
                    this.props.history.push(linkUrl)
                }
            }
        })

        /** save to redux */
        this.props.saveLinkManTel({
            label: this.state.label,
            value: this.state.value
        })
    }

    /** 点击前检测格式 规则 */
    beforeClick() {

        const {value,hasError} = this.state
        if (value === '') {
            Toast.info(`请录入手机号码`,2,null,false)
            return false;
        } else if (hasError) {
            Toast.info(`手机号码格式不正确`,2,null,false)
            return false;
        }
    }

    render() {
        const {hasError, value,btnText,linkUrl,label,fromPreview} = this.state
        const linkEnabled = value === '' ? false : !hasError
        
        return (
            <div className="addClue addClue-tel" >
                {!fromPreview && <Flex.Item className='page-tip'>请开始录入线索</Flex.Item> }
                <Flex.Item className="page-title">联系人电话</Flex.Item>
                <InputItem
                    className="mar-top-40"
                    type="phone"
                    clear
                    ref={`addClueMobile`}
                    autoFocus
                    placeholder="请填写联系人电话"
                    value={label}
                    onErrorClick={this.onErrorClick.bind(this)}
                    onChange={this.handleChange.bind(this)} >

                </InputItem>
                <LinkNextStep beforeClick={this.beforeClick.bind(this)} to={`${linkUrl}`} linkEnabled={linkEnabled} disabled onClick={this.handleLinkClick.bind(this)} >{btnText}</LinkNextStep>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    linkManTel: state.linkManTel
})

const AddTel = connect(
    mapStateToProps,
    action
)(AddTelCpts)

export default AddTel;