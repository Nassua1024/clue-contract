import { List, Radio, Flex } from 'antd-mobile'
import LinkNextStep from './Add_Next_Step'
import './addClue.less'
import * as action from '../../../redux/action/action'


const { connect } = ReactRedux
const RadioItem = Radio.RadioItem
const data = [
    {value : 'MALE', label : '男'},
    {value : 'FEMALE' , label : '女'}
]

class AddgradeCpts extends React.Component {
    constructor(props) {
        super(props)

        const { value, label } = props.studentGender

        // if (!linkManGrade)
        //     props.history.push('name')
        /**
         * @value: radio
         * @linkEnabled: 禁/启用下一步跳转
         */
        this.state = {
            label: label || '男',
            value: value || 'MALE',
            linkEnabled: !!value || true,

            fromPreview: false,
            btnText: '下一步',
            linkUrl: '/add/student-type'
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

    handleChange  (i)  {
        const {value, label} = i;

        const {fromPreview} = this.state
        const gender = this.props.studentGender

        let btnText = fromPreview?(value===gender.value?'返回':'保存'):'下一步'

        this.setState({
            label,
            value,
            linkEnabled: true,

            btnText
        })
    }

    handleLinkClick  ()  {

        this.props.saveStudentGender({
            label: this.state.label,
            value: this.state.value
        })
    }

    render() {
        const {value, linkEnabled,linkUrl,btnText} = this.state;
        return (
            <div className="addClue addClue-grade">
                <Flex.Item className="page-title" >学员性别</Flex.Item>
                <div className='male-wrap gender-wrap'>
                    <img src={ value=='MALE' ? require('../../../img/male_on.png') : require('../../../img/male.png')} onClick={() => this.handleChange(data[0])}/>
                    <p>男</p>
                </div>
                <div className='female-wrap gender-wrap'>
                    <img src={ value=='FEMALE' ? require('../../../img/female_on.png') : require('../../../img/female.png')} onClick={() => this.handleChange(data[1])}/>
                    <p>女</p>
                </div>
                {/*                <List>
                    {data.map((i, index) => (
                        <RadioItem
                            key={index}
                            checked={value === i.value}
                            onChange={() => this.handleChange(i)} >

                            {i.label}
                        </RadioItem>
                    ))}
                </List>
*/}                <LinkNextStep to={`${linkUrl}`} ToastInfo={`请录入学员性别`} linkEnabled={linkEnabled} onClick={this.handleLinkClick} >{btnText}</LinkNextStep>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    studentGender: state.studentGender
})

const addGrade = connect(
    mapStateToProps,
    action
)(AddgradeCpts)


export default addGrade;