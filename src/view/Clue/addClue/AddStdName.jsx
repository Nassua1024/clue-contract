import { Flex, InputItem } from 'antd-mobile';
import LinkNextStep from './Add_Next_Step'
import * as action from '../../../redux/action/action'
import './addClue.less'

const { connect } = ReactRedux
class AddStdName extends React.Component {
    constructor(props) {
        super(props)

        const name = props.studentName

        /**
         * @value: input-value
         * @linkEnabled: 是否禁用路由跳转
         */
        this.state = {
            name: name || '',
            linkEnabled: !!name || false,

            fromPreview: false,
            btnText: '下一步',
            linkUrl: '/add/student-gender'
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

        this.refs.addClueStudentName.focus()
    }

    handleChange(value) {
        value = Base.legInputName(value)

        const {fromPreview} = this.state
        const name = this.props.studentName

        let btnText = fromPreview?(value===name?'返回':'保存'):'下一步'

        this.setState({
            name: value,
            linkEnabled: !(value === ''),
            btnText
        })
    }

    handleLinkClick  ()  {
        const {name} = this.state
        this.props.saveStudentName({
            name
        })
    }

    render() {
        const {linkEnabled,btnText,linkUrl, name} = this.state;
        return (
            <div className="addClue addClue-name">
                <Flex.Item className="page-title" >学员姓名</Flex.Item>
                <InputItem
                    clear
                    ref={`addClueStudentName`}
                    maxLength={10}
                    className="page-name-action"
                    placeholder={'请输入学员姓名'}
                    onChange={this.handleChange.bind(this)}
                    value={name} />
                <LinkNextStep to={linkUrl}
                              ToastInfo={`请录入学员姓名`}
                              linkEnabled={linkEnabled} onClick={(e) => this.handleLinkClick(e)} >{btnText}</LinkNextStep>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    studentName: state.studentName
})

const AddStdNameCon = connect(
    mapStateToProps,
    action
)(AddStdName)

export default AddStdNameCon;

