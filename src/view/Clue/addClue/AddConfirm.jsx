import { Flex, List, Toast } from 'antd-mobile';
import * as action from '../../../redux/action/action'
import './addClue.less'
const Http = Base
const localMobile = Http.mobile
const {Link} = ReactRouterDOM
const { connect } = ReactRedux
const {api:URL} = Http.url
const FlexItem = Flex.Item;
const ListItem = List.Item;

let canAdd = true

const ListHasLink = (props) => {
    const i = props.data
    if (props.hasLink) {
        return (
            <Link to={`${i.link}#alter`} >
                <List className={`list ${props.className}`}>
                    <ListItem arrow={props.arrow} extra={i.label}>{i.title}</ListItem>
                </List>
            </Link>
        )
    } else {
        return (
            <List className={`list ${props.className}`}>
                <ListItem arrow={props.arrow} extra={i.label}>{i.title}</ListItem>
            </List>
        )
    }
}
class AddConfirm extends React.Component {
    constructor(props) {
        super(props)

        const { linkManName, linkManGrade, linkManTel, linkManCourse, studentType, studentGender, linkManSource, studentName, praiseStudent } = props.state

        this.state = {
            data: [{
                    title: '姓名',
                    label: linkManName,
                    link : '/add/name'
                }, {
                    title: '性别',
                    label: linkManGrade.label,
                    link : '/add/gender'
                }, {
                    title: '学员姓名',
                    label: studentName,
                    link : '/add/student-name'
                }, {
                    title: '学员性别',
                    label: studentGender.label,
                    link : '/add/student-gender'
                }, {
                    title: '学员类别',
                    label: studentType.label,
                    link : '/add/student-type'
                }, {
                    title: '手机号',
                    label: linkManTel.label && linkManTel.label.replace(/\s/g, '-'),
                    link : '/add/tel'
                }, {
                    title: '课程',
                    label: linkManCourse.label,
                    link : '/add/course'
                }, {
                    title: '渠道来源',
                    label: linkManSource.label,
                    link : '/add/source'
                }
            ],
            params: {
                adult: studentType.value,  // 是否成人学员，否-儿童学员
                courseId: [].concat(linkManCourse.value)[0] >> 0 || '',      	// 课程id
                gender: linkManGrade.value || '',
                mobile: linkManTel.value || '',
                name: linkManName || '',
                sourceId: [].concat(linkManSource.value)[0] >> 0 || '',
                studentName: studentName,
                storeId: '',
                referLeadId: praiseStudent.id >> 0 || '',
                studentGender: studentGender.value || ''
            },
            absolu: true
        }
    }

    componentWillMount() {

        const params = {}

        Http.ajax(`${URL}/lead/current-store`, params).then((res) => {

            this.setState((prevState) => {
                prevState.params.storeId = res.data.storeId

                return {
                    params: prevState.params,
                }
            })
        })
    }

    handleLinkClick () {
        if (!canAdd) return
        canAdd = false
        setTimeout(() => { canAdd = true }, 500)


        const data = this.state.params
        if (!data.name) {
            Toast.info(`请录入姓名`,1.5,null,false);     return
        } else if (!data.gender) {
            Toast.info(`请录入性别`,1.5,null,false);     return
        } else if (!data.studentName) {
            Toast.info(`请录入学员姓名`,1.5,null,false);  return
        } else if (data.adult === undefined) {
            Toast.info(`请录入学员类型`,1.5,null,false);  return
        } else if (!data.studentGender) {
            Toast.info(`请录入学员性别`,1.5,null,false);  return
        } else if (!data.mobile ) {
            Toast.info(`请录入手机号`,1.5,null,false);    return
        } else if (!data.courseId ) {
            Toast.info(`请录入课程`,1.5,null,false);     return
        } else if (!data.sourceId ) {
            Toast.info(`请录入渠道来源`,1.5,null,false);  return
        }

        const params = {
            method: 'POST',
            data
        }

        Http.ajax(`${URL}/lead/add`,params).then((res) => {
            this.props.history.push(`/addClueResult/${res.data.leadId}`)
            this.props.saveLinkManName({name:''})
            this.props.saveLinkManTel({label: '', value: ''})
            this.props.saveLinkManGrade({label: '', value: ''})
            this.props.saveStudentName({name:''})
            this.props.saveStudentType({label: '', value: ''})
            this.props.saveLinkManTel({label: '', value: ''})
            this.props.saveLinkManCourse({label: '', value: ''})
            this.props.saveLinkManSource({label: '', value: ''})
            this.props.savePraiseStudent({label: '', value: ''})
            this.props.saveStudentGender({label: '', value: ''})
        })
    }
    componentDidMount() {
        const contentHeight = this.refs.addClueConfirm.offsetHeight
        const emptyBox = document.documentElement.offsetHeight - this.refs.addClueConfirmBtn.offsetHeight
        if (emptyBox + 50 < contentHeight ) {
            this.setState({
                absolu: false
            })
        }
    }


    render() {
        const {praiseStudent} = this.props.state
        return (
            <div className="addClue addClue-confirm" ref="addClueConfirm">
                <FlexItem className="page-tip">请先保存一下信息后再继续录入更多资料</FlexItem>
                <FlexItem className="page-title">联系人信息</FlexItem>

                <div className="mar-top-40" >
                    {this.state.data.map((i, index) => (
                        <ListHasLink hasLink={i.link!==null}
                                     className={i.disabled?'':'alter'}
                                     arrow={i.disabled?'':'horizontal'}
                                     data={i}
                                     key={index} >
                        </ListHasLink>
                    ))}
                    {
                        praiseStudent.id&&<Link to={`/add/public-std/${praiseStudent.isPublic}#alter`} >
                            <List className={`list alter`}>
                                <ListItem arrow={`horizontal`} extra={`${praiseStudent.name||''}　${localMobile(praiseStudent.mobile)||''}`}>口碑推荐</ListItem>
                            </List>
                        </Link>
                    }
                </div>

                <div ref="addClueConfirmBtn" className={`page-confirm-btn btn-main-long ${!this.state.absolu?'static':''}`} onClick={this.handleLinkClick.bind(this)} >保存</div>
            </div>
        )
    }
}

const mapStateTpProps = (state) => ({
    state
})
const AddBC = connect(
    mapStateTpProps,
    action
)(AddConfirm)


export default AddBC;