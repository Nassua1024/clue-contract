import * as action from '../../../redux/action/action'

import { List, Radio, Flex } from 'antd-mobile'
import LinkNextStep from './Add_Next_Step'
import './addClue.less'

const { connect } = ReactRedux
const RadioItem = Radio.RadioItem
const data = [
    {value : false, label : '儿童学员'},
    {value : true , label : '成人学员'}
]

class AddStdTypeCpts extends React.Component {
    constructor(props) {
        super(props)

        const { value, label } = props.studentType

        /**
         * @label: {String} 成员类别 儿童成员
         * @value: {Boolean} 成员类别 TYPE_CHILDREN
         * @linkEnabled: 禁/启用下一步跳转
         */
        this.state = {
            label: label || '儿童学员',
            value: value || false,
            linkEnabled: !!value || true,

            fromPreview: false,
            btnText: '下一步',
            linkUrl: '/add/source'
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleLinkClick = this.handleLinkClick.bind(this)
    }

    componentDidMount() {

        /* 来源预览页 */
        this.props.location.hash === '#alter'
        && this.setState({
            fromPreview: true,
            btnText: '返回',
            linkUrl: '/add/confirm-clue'
        })
    }

    // 选择类别change事件
    handleChange (i) {
        const {value, label} = i;
        const {fromPreview} = this.state
        const studentTypeValue = this.props.studentType.value

        let btnText = fromPreview?(value===studentTypeValue?'返回':'保存'):'下一步'

        this.setState({
            label,
            value,
            linkEnabled: true,

            btnText
        })
    }

    // 下一步
    handleLinkClick  ()  {
        this.props.saveStudentType({
            label: this.state.label,
            value: this.state.value
        })
    }

    render() {
        const {value, linkEnabled, linkUrl, btnText} = this.state;

        const linLInkEnabled = linkEnabled === '' ? false : true
        return (
            <div className="addClue addClue-grade">
                <Flex.Item className="page-title" >学员类别</Flex.Item>
                <div className='male-wrap gender-wrap'>
                    <img src={ value==false ? require('../../../img/etxy_on.png') : require('../../../img/etxy.png')} onClick={() => this.handleChange(data[0])}/>
                    <p>儿童学员</p>
                </div>
                <div className='female-wrap gender-wrap'>
                    <img src={ value==true ? require('../../../img/crxy_on.png') : require('../../../img/crxy.png')} onClick={() => this.handleChange(data[1])}/>
                    <p>成人学员</p>
                </div>
{/*
                <List>
                    {data.map((i, index) => {
                        return <RadioItem
                            key={index}
                            checked={value === i.value}
                            onChange={() => this.handleChange(i)} >

                            {i.label}
                        </RadioItem>
                    })}
                </List>
*/}
                <LinkNextStep to={`${linkUrl}`} ToastInfo={`请录入学员类别`} linkEnabled={linLInkEnabled} onClick={this.handleLinkClick} >{btnText}</LinkNextStep>
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    studentType: state.studentType
})

const AddStdType = connect(
    mapStateToProps,
    action
)(AddStdTypeCpts)

export default AddStdType;