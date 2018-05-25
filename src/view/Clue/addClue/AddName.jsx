
import { Flex, InputItem } from 'antd-mobile';
import LinkNextStep from './Add_Next_Step'

import * as action from '../../../redux/action/action'
import './addClue.less'

const { connect } = ReactRedux
class AddClueCpts extends React.Component {
    constructor(props) {
        super(props)

        const name = props.linkManName

        /**
         * @value: input-value
         * @linkEnabled: 是否禁用路由跳转
         */
        this.state = {
            name: name || '',
            linkEnabled: !!name || false,

            fromPreview: false,
            btnText: '下一步',
            linkUrl: '/add/gender'
        }
    }

    componentDidMount() {

        /* 来源预览页 */
        this.props.location.hash === '#alter'
        && this.setState({
            fromPreview: true,
            btnText: '返回',
            linkUrl: '/add/confirm-clue'
        })


        /* autoFocus */
        this.refs.addClueName.focus()
    }

    handleChange(value) {
        value = Base.legInputName(value)

        const {fromPreview} = this.state
        const name = this.props.linkManName

        let btnText = fromPreview?(value===name?'返回':'保存'):'下一步'

        this.setState({
            name: value,
            linkEnabled: !(value === ''),
            btnText
        })
    }

    /** 下一步|返回|保存 click */
    handleLinkClick  ()  {
        const {name} = this.state

        this.props.saveLinkManName({
            name
        })
    }

    render() {
        const {linkEnabled,btnText,linkUrl, fromPreview, name} = this.state;
        return (
            <div className="addClue addClue-name">
                <Flex.Item className="page-title" >联系人姓名</Flex.Item>
                <InputItem
                    clear
                    ref={`addClueName`}
                    maxLength="10"
                    className="page-name-action"
                    placeholder={'请输入联系人姓名'}
                    onChange={this.handleChange.bind(this)}
                    value={name} />
                <LinkNextStep to={linkUrl}
                              linkEnabled={linkEnabled}
                              ToastInfo={`请录入联系人姓名`}
                              onClick={(e) => this.handleLinkClick(e)} >
                    {btnText}
                </LinkNextStep>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    linkManName: state.linkManName
})

const AddClue = connect(
    mapStateToProps,
    action
)(AddClueCpts)

export default AddClue;
