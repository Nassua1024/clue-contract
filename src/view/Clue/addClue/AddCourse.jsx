import { Flex, Picker, List } from 'antd-mobile';
import LinkNextStep from './Add_Next_Step';
import * as action from '../../../redux/action/action'
import './addClue.less'

const { connect } = ReactRedux
const URL = Base.url.api

class AddCourseCpts extends React.Component {
    constructor(props) {
        super(props)



        this.state = {
            coursesPicker: [],
            label: '请选择课程',
            value: '',
            linkEnabled: false
        }
    }

    componentWillMount() {

        this.getChineseCourseFetch()
    }

    /** 获取国文常规课课程 */
    getChineseCourseFetch() {
        const params = {
            method: 'POST'
        }

        Base.ajax(`${URL}/selections/chinese-courses`,params).then((res) => {

            const coursesPicker = res.data.courses.map(({id:value,text:label}) => ({label, value}))
            const {value, label} = this.props.linkManCourse

            this.setState({
                label,
                value,
                linkEnabled: !!value,
                coursesPicker
            })
        })
    }

    handleChange  (value)  {

        const {coursesPicker} = this.state
        const {label} = [].concat(...coursesPicker).filter((item) => item.value === value[0])[0]

        this.setState({
            label,
            value,
            linkEnabled: true
        })
    }

    handleLinkClick  ()  {

        const {label, value} = this.state
        this.props.saveLinkManCourse({
            label,
            value
        })
    }

    render() {
        const {label,value, linkEnabled, coursesPicker} = this.state
        return (
            <div className="addClue addClue-course">
                <Flex.Item className="page-title" >课程</Flex.Item>
                <Picker
                    data={[coursesPicker]}
                    extra={label}
                    cascade={false}
                    value={value}
                    onChange={this.handleChange.bind(this)} >

                    <List.Item className="page-name-action">选择课程</List.Item>
                </Picker>
                <LinkNextStep to="/add/confirm-clue" ToastInfo={`请录入课程`} linkEnabled={linkEnabled} onClick={this.handleLinkClick.bind(this)} >下一步</LinkNextStep>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    linkManCourse: state.linkManCourse
})
const AddCourse = connect(
    mapStateToProps,
    action
)(AddCourseCpts)

export default AddCourse;