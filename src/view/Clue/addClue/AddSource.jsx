import { Flex, Picker, List, Radio } from 'antd-mobile';
import LinkNextStep from './Add_Next_Step';
import * as action from '../../../redux/action/action'
import './addClue.less'


const { connect } = ReactRedux
const RadioItem = Radio.RadioItem
const URL = Base.url.api

class AddSourceCpts extends React.Component {
    constructor(props) {
        super(props)

        /**
         * @avalSourcesPicker: {Array} 渠道来源
         * @label: {String} 课程名称 三字经
         * @value: {String} 课程ID  SANZIJING
         * @linkEnabled {Boolean} 启用下一步按钮
         */
        const {linkManSource} = this.props

        this.state = {
            avalSourcesPicker: [],
            label: linkManSource.label || '请选择渠道',
            value: linkManSource.value || '',
            linkEnabled: false,
            initLabel: linkManSource.label,

            fromPreview: false,
            btnText: '下一步',
            linkUrl: '/add/course'
        }
    }

    componentWillMount() {
        this.getSourcesFetch()
    }

    componentDidMount() {
        const {label, fromPreview} = this.state

        /** 来源预览页 */
        this.props.location.hash === '#alter'
        && this.setState({
            fromPreview: true,
            btnText: '返回',
            linkUrl: '/add/confirm-clue'
        })

        if (label === '口碑推荐' || label === '公益课口碑推荐') {
            const isPublicCourse = label === '口碑推荐' ? 0 : 1
            const linkUrl = `/add/public-std/${isPublicCourse}${fromPreview?'#alter':''}`
            this.setState({
                btnText: '下一步',
                linkUrl
            })
        }
    }

    /** 获取渠道 */
    getSourcesFetch() {
        const params = {
            method: 'POST'
        }

        Base.ajax(`${URL}/selections/avaliable-sources`,params).then((res) => {

            const avalSourcesPicker = res.data.sources.map(({id:value,text:label}) => ({label, value}))
            const {value, label} = this.props.linkManSource

            this.setState({
                label,
                value,
                linkEnabled: !!value,
                avalSourcesPicker
            })
        })
    }

    /** 选择渠道来源change事件 */
    handleChange  (item)  {
        const {label,value} = item

        const {fromPreview} = this.state
        const sourceValue = this.props.linkManSource.value

        let btnText = fromPreview?(value===sourceValue?'返回':'保存'):'下一步'

        const isPublicCourse = label === '口碑推荐' ? 0 : 1
        if (label !== '口碑推荐' && label !== '公益课口碑推荐') {
            const linkUrl = fromPreview ? '/add/confirm-clue' : '/add/course'
            this.setState({
                linkUrl
            })
        } else {
            btnText = '下一步'
            this.setState({
                linkUrl: `/add/public-std/${isPublicCourse}${fromPreview?'#alter':''}`
            })
        }

        this.setState({
            label,
            value,
            linkEnabled: true,

            btnText
        })

    }

    handleClick(item) {
        const {label,value} = item

        const {fromPreview} = this.state
        if (label === '口碑推荐' || label === '公益课口碑推荐') {
            const isPublicCourse = label === '口碑推荐' ? 0 : 1
            this.props.history.push(`/add/public-std/${isPublicCourse}${fromPreview?'#alter':''}`)
            this.props.saveLinkManSourceLinS({label, value})
        }
    }

    /** 下一步 */
    handleLinkClick () {

        const {label, value, initLabel} = this.state
        if (label !== initLabel) {
            this.props.savePraiseStudent('')
        }
        this.props.saveLinkManSource({label, value})

    }

    render() {
        const {value, linkEnabled, avalSourcesPicker, linkUrl, btnText} = this.state
        return (
            <div className="addClue addClue-course">
                <Flex.Item className="page-title" >渠道来源</Flex.Item>
                <List>
                    {avalSourcesPicker.map(i => (
                        <RadioItem key={i.value} checked={value === i.value} onChange={() => this.handleChange(i)} onClick={() => this.handleClick(i)}>
                            {i.label}
                        </RadioItem>
                    ))}
                </List>
                <LinkNextStep to={`${linkUrl}`}
                              ToastInfo={`请录入渠道来源`}
                              linkEnabled={linkEnabled}
                              onClick={this.handleLinkClick.bind(this)} >
                    {btnText}
                </LinkNextStep>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    linkManSource: state.linkManSource
})
const AddSource = connect(
    mapStateToProps,
    action
)(AddSourceCpts)

export default AddSource;