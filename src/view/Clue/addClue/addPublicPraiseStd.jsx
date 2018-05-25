import {SearchBar,Flex,Button,Toast} from 'antd-mobile'
import './addPublicPraiseStd.less'
import * as action from '../../../redux/action/action'

const Http = Base
const localMobile = Http.mobile
const {api:URL} = Http.url
const { connect } = ReactRedux

class addPublicPraiseStd extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            search: '',
            isPublicCourse: props.match.params.isPublic==='0'?false:true,
            leads: [],

            linkUrl: '/add/course'
        }
    }

    componentWillMount() {
        // this.getFefreStudentFetch()
        /* 来源预览页 */
        this.props.location.hash === '#alter'
        && this.setState({
            linkUrl: '/add/confirm-clue'
        })
    }

    componentDidMount() {
        this.refs.publicPraiseSearch.refs.searchInput.focus();
    }


    // 搜索口碑学员（线索）
    getFefreStudentFetch() {
        const {isPublicCourse,search} = this.state

        if (search === '') {
            Toast.info(`搜索内容不能为空`,2,null,false)
            return;
        }
        const params = {data: {isPublicCourse, search}}
        Http.ajax(`${URL}/lead/search-refer-student`,params).then(res => {
            let leads = []
            if (res.code == 0)
                leads = res.data.leads

            this.setState({
                leads
            })
        })
    }

    handleChange(search) {
        this.setState({
            search
        })
    }

    // 搜索
    handleSearch() {
        this.getFefreStudentFetch()
    }

    // 取消搜索
    handleCancelSearch() {
        this.setState({
            search:''
        })
    }

    // 添加口碑
    addPraise(item) {
        const {linkUrl} = this.state

        item.isPublic = this.props.match.params.isPublic
        this.props.savePraiseStudent(item)
        this.props.saveLinkManSource(this.props.linslinkManSource)
        this.props.history.push(`${linkUrl}`)
    }

    render() {
        const {search,leads} = this.state
        return (
            <div id="PublicPraiseStd">
                <SearchBar value={search}
                           showCancelButton={true}
                           autoFocus
                           ref={`publicPraiseSearch`}
                           cancelText={`搜索`}
                           onChange={this.handleChange.bind(this)}
                           onSubmit={this.handleSearch.bind(this)}
                           onCancel={this.handleSearch.bind(this)} />

                <div className="lists">
                    {leads&&leads.map(item => (
                        <div key={item.id} className="list">
                            <div className="state">{`${item.leadStatusDesc}`}</div>
                            <span className="appointment-time">{`${item.appointmentTime&&new Date(item.appointmentTime).Format('yyyy-MM-dd') || ''}`}</span>
                            <i className="icon-badge"></i>

                            <div className="box">
                                <Flex className="mb24">
                                    <span className="time">
                                        {`${Http.getDateDiff(item.lastUpdateTime).default}`}
                                    </span>
                                    <span className="cc-name">
                                        {`${item.ccName}`}
                                    </span>
                                </Flex>
                                <Flex className="mb24">
                                    <span className="source">
                                        {`${item.course}`}
                                    </span>
                                    <span className="laiy">{`${item.sourceName}`}</span>
                                </Flex>
                                {item.students.map(({age,studentName}, index) => (
                                    <Flex className="students-box" key={index}>
                                        <label>学　员： </label>
                                        <div className="students">
                                        <span className="value mb14">{studentName.length>10?studentName.slice(0,8)+'...':studentName}　{!!age&&`${age}岁`}</span>
                                        </div>
                                    </Flex>
                                ))}

                                <Flex className="mb14">
                                    <label>联系人： </label>
                                    <span className="value">
                                        {item.name.length>10?item.name.slice(0,8)+'...':item.name}
                                        <a className="tel" href={`tel://${`${item.mobile}`}`} >{localMobile(item.mobile)}</a>
                                        {/*<i className="icon-tel"></i>*/}
                                    </span>
                                </Flex>
                            </div>
                            <Button className="btn" onClick={() => this.addPraise(item)}>确定添加口碑</Button>
                        </div>
                    ))}
                    {
                        !leads &&
                        <Flex className="no-data">未找到线索</Flex>
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    praiseStudent: state.praiseStudent,
    linslinkManSource: state.linslinkManSource
})

const addPublicPraiseStdCon = connect(
    mapStateToProps,
    action
)(addPublicPraiseStd)

export default addPublicPraiseStdCon;