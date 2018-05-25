import {List} from 'antd-mobile'
import * as action from '../../../../redux/action/action'
import './listenDetail.less'

const Http = Base
const {api:URL} = Http.url
const { connect } = ReactRedux
const ListItem = List.Item

class ListenDetail extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            listenDetail: {}
        }
    }
    componentWillMount() {
        this.getListenDetailFetch()
    }

    /* 获取listenDetail */
    getListenDetailFetch() {
        const {id: appointmentId} = this.props.match.params
        const params = { data: {
            appointmentId
        } }
        Http.ajax(`${URL}/lead/get-listen-detail`, params).then(res => {
            if (res.code === '0') {

                const listenDetail = res.data.listens
                this.setState({
                    listenDetail
                })
            }
        })
    }

    render() {
        const {listenDetail} = this.state
        let appointmentTime = ''

        if (listenDetail.appointmentTime) {
            const time = new Date(listenDetail.appointmentTime).Format('yyyy-MM-dd　hh:mm-')
            const endTime = new Date(listenDetail.appointmentTime+5400000).Format('hh:mm')
            appointmentTime = time + endTime
        }

        /** 渲染数据列表  按顺序渲染 */
        const listenDetailList = [
            { label: '课程', value: listenDetail.courseName },
            { label: '学员', value: listenDetail.studentName },
            { label: '时间', value: appointmentTime },
            { label: '教室', value: listenDetail.classroomName },
            { label: '老师', value: listenDetail.teacherName },
            { label: '金额', value: listenDetail.estimatedPrice || '' }
        ]

        /** 需要过滤不显示的列表字段 */
        const ignoreList = ['时间', '教室']

        return (
            <div id="ListenDetail">
                {listenDetailList.map((list, index) => (
                    (ignoreList.indexOf(list.label) > -1) && !list.value ? '' :
                    <ListItem extra={list.value} key={index}>{list.label}</ListItem>
                ))}
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    // listenDetail: state.listenDetail
})
const ListenDetailConnect = connect(
    mapStateToProps,
    action
)(ListenDetail)

export default ListenDetailConnect