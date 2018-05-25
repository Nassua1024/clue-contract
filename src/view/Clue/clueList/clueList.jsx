import RecentUpdate from './RecentUpdate/RecentUpdate'
import SelAge from './RecentUpdate/SelAge'
import {Flex, Button, List, Picker, Popup, ActivityIndicator,Toast } from 'antd-mobile';
import './clueList.less';
import * as action from '../../../redux/action/action'
import moment from 'moment'

const {connect} = ReactRedux
const {Link} = ReactRouterDOM
const URL = Base.url.api
const ListItem = List.Item
const localMobile = Base.mobile
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let maskProps;
if (isIPhone) {maskProps = {onTouchStart: e => e.preventDefault()};}
class clueList extends React.Component {
    constructor(props) {
        super(props);

        const ScreeingCondition = localStorage.getItem('ScreeingCondition') && JSON.parse(localStorage.getItem('ScreeingCondition'))
        const isHasTop = sessionStorage.getItem('clueListScrollTop')

        const search = props.searchValue

        if (ScreeingCondition) {
            ScreeingCondition.search = search
            ScreeingCondition.scrollHasData = true

            if (!isHasTop) {
                ScreeingCondition.containerScrollTop = 0
                ScreeingCondition.leadsContainer = []
                ScreeingCondition.page = 1
                ScreeingCondition.per_page = 20
            }
        }

        this.state = ScreeingCondition || {
            containerScrollTop: 0,
            clueCount: 0,

            customerTypePicker: [
                {
                    label: '所有客户',
                    value: ''
                },{
                    label: '普通客户',
                    value: 'COMMON'
                },{
                    label: '重要客户',
                    value: 'IMPORTANT'
                }
            ],

            // @leadStatusPicker: [Array] 线索状态数据
            leadStatusPicker: [],

            // @avalSourcesPicker: [Array] 渠道来源数据
            avalSourcesPicker: [],

            gradePicker: [], // 年级数据

            // @coursesPicker: [Array] 课程数据
            coursesPicker: [],


            // 线索列表
            leads: [],

            // 线索列表容器
            leadsContainer: [],

            // 搜索
            search: search,

            // 加载中
            loading: false,
            scrollHasData: true,

            /**
             * @courseId: {Number} 课程id
             * @customerType: {String} 客户类型
             * @leadStatus: {String} 线索状态
             * @sourceId: {Number} 	渠道ID
             * @page: {Number} 	第几屏
             * @per_page: {Number} 	每屏几条
             */

            gradeId: '',
            courseId: '',
            customerType:'',
            leadStatus: '',
            sourceId: '',
            page: 1,
            per_page: 20,
            startDate: '',
            endDate: '',
            minAge: 0,
            maxAge: '',
            
            disabled: true
        }

    }

    componentDidMount() {

        const scrollTop = sessionStorage.getItem('clueListScrollTop')
        const sessionPage = sessionStorage.getItem('clueListPage')

        const {search,leadStatusPicker} = this.state
        const per_page = 20 * (sessionPage || 1)

        if (search !== '' ) {
            this.getSourcesFetch()
            this.getGrade();
            // this.getChineseCourseFetch()
            this.setState({
                courseId: '',
                customerType: '',
                leadStatus: '',
                sourceId: '',
                page: 1,
                startDate: '',
                endDate: '',
                minAge: 0,
                per_page,
                maxAge: '',
                scrollHasData: true
            }, () => {
                this.getLeadSearchFetch(sessionPage>>0)
                if (leadStatusPicker.length === 0)
                    this.getLeadStatusFetch(true)
            })
        }
        else {
            if (!localStorage.getItem('ScreeingCondition')) {
                this.getLeadListFetch(null,'NEW_ASSIGN')
                this.getSourcesFetch()
                this.getGrade();
                // this.getChineseCourseFetch()
                this.getLeadStatusFetch()
            } else if (scrollTop) {

                this.setState({
                    per_page
                }, () => this.getLeadListFetch(null,null,sessionPage>>0))

            } else {
                this.getLeadListFetch()
            }
        }

        localStorage.removeItem('ScreeingCondition')
    }

    // 搜索线索列表
    getLeadSearchFetch(sessionPage) {
        const scrollTop = sessionStorage.getItem('clueListScrollTop')
        const {search,page,per_page} = this.state

        const params = {
            data: {
                search,
                page,
                per_page
            },
            hideLoading: sessionPage ? false : true
        }

        this.setState({
            loading: true,
            clueCount: 0,
        })

        Base.ajax(`${URL}/lead/search`,params).then((res) => {

            let {scrollHasData} = this.state
            const {leadsContainer} = this.state
            const {leads, count} = res.data
            if (leads.length < 20 ) {
                scrollHasData = false
            }

            leadsContainer.push(...leads)

            if (sessionPage) {
                this.setState({
                    page: sessionPage,
                    per_page: 20
                })

                this.refs.clueListScrollBox.scrollTop = ( scrollTop >> 0 ) - 33
                sessionStorage.removeItem('clueListScrollTop')
                sessionStorage.removeItem('clueListPage')
            }
            this.setState({
                loading: false,
                scrollHasData,
                clueCount: count,
            }, () => {
                if (leads.length === 0 ) {
                    this.refs.clueList.scrollTop = this.refs.clueListScrollBox.offsetHeight - this.refs.clueList.offsetHeight
                }
            })
        })
    }

    // 获取线索列表
    getLeadListFetch(clearLeads, initLeadStatus, sessionPage) {
        const scrollTop = sessionStorage.getItem('clueListScrollTop')
        let {scrollHasData} = this.state
        let {leadsContainer} = this.state

        this.setState({
            loading: true,
            clueCount: 0,
        })

        const {courseId,customerType,leadStatus,sourceId,page,per_page,endDate,startDate,minAge,maxAge,gradeId} = this.state

        const params = {
            data: {
                gradeId,
                courseId,
                customerType,
                leadStatus,
                sourceId,
                page,
                per_page,
                endDate,
                startDate,
                minAge,
                maxAge
            },
            hideLoading: sessionPage ? false : true
        }

        if (initLeadStatus) {
            params.data.leadStatus = initLeadStatus
        }

        Base.ajax(`${URL}/lead/list`,params).then((res) => {

            const {leads, count} = res.data
            if (clearLeads === true) leadsContainer = []
            leadsContainer.push(...leads)

            if (leads.length < 20 ) {
                scrollHasData = false
            }

            if (sessionPage) {
                this.setState({
                    page: sessionPage>>0,
                    per_page: 20
                })

                this.refs.clueListScrollBox.scrollTop = ( scrollTop >> 0 ) - 33
                sessionStorage.removeItem('clueListScrollTop')
                sessionStorage.removeItem('clueListPage')
            }

            this.setState({
                clueCount: count,
                leadsContainer,
                scrollHasData,
                loading: false
            }, () => {

                if (leads.length === 0 ) {
                    this.refs.clueList.scrollTop = this.refs.clueListScrollBox.offsetHeight - this.refs.clueList.offsetHeight
                }

            })
        })
    }

    // 将筛选条件储存至 localStorage
    saveScreeingCondition() {

        const thisStatae = Object.assign({}, this.state)
        thisStatae.page = 1
        thisStatae.leadsContainer = []
        let ScreeingCondition = JSON.stringify(thisStatae)
        localStorage.setItem('ScreeingCondition', ScreeingCondition)
    }

    // 获取线索状态
    getLeadStatusFetch(bool) {
        const params = {
            method: 'POST'
        }

        Base.ajax(`${URL}/selections/lead-status-for-cc`,params).then((res) => {

           if (res.code === '0') {
               const leadStatusPicker = res.data.statusMappers.map(({id:value,text:label}) => ({label, value}))
               leadStatusPicker.unshift({label: '所有状态', value: ''})

               let leadStatus = this.state.leadStatus
               if (!localStorage.getItem('ScreeingCondition'))
                   leadStatus = [leadStatusPicker.filter((item => item.value === 'NEW_ASSIGN'))[0].value]

               if (bool) {
                   leadStatus = ''
               }

               this.setState({
                   leadStatusPicker,
                   leadStatus
               })
           }
        })
    }

    // 获取渠道
    getSourcesFetch() {
        const params = {
            method: 'POST'
        }
        Base.ajax(`${URL}/selections/avaliable-all-sources`,params).then((res) => {

            const avalSourcesPicker = res.data.sources.map(({id:value,text:label}) => ({label, value}))
            avalSourcesPicker.unshift({label: '所有渠道', value: ''})

            this.setState({
                avalSourcesPicker
            })
        })
    }

    // 获取年级数据
    getGrade() {

        Base.ajax(`${URL}/changgui/selections/grades`, {}).then(res => {
            if (res && res.code == 0) {
                const gradePicker = res.data.grades.map(({ id: value, name: label}) => ({ value, label }));
                this.setState({ gradePicker });
            }
        })
    }

    // 获取国文常规课课程
    getChineseCourseFetch() {
        
        const params = { data: { gradeId: this.state.gradeId } };

        Base.ajax(`${URL}/changgui/selections/courses`, params).then(res => {
            if (res && res.code == 0) {
                const coursesPicker = res.data.courses.map(({id:value, name:label}) => ({label, value}))
                this.setState({ coursesPicker })
            }
        })
    }

    // 线索详情
    handleToDetail(item) {
        localStorage.setItem('formRouter',`/clueList`)
        sessionStorage.setItem('clueListScrollTop', this.state.containerScrollTop)
        sessionStorage.setItem('clueListPage', this.state.page)
        this.saveScreeingCondition()
        this.props.clearClueDetail('')
        this.props.clearAduitionState('')
        this.props.clearLessonSchedule('')
        this.props.history.push(`/clueDetail/${item.id}`)
    }

    onPickerChange(v, stateId) {
        this.clearSearch()
        this.setState({
            [stateId] : v,
            leadsContainer: [],
            page: 1,
            scrollHasData: true,
        }, () => {
            if (stateId == 'gradeId') {
                this.getChineseCourseFetch();
                this.setState({ disabled: false, courseId: ''}, () => this.getLeadListFetch(true));
            } else {
                this.getLeadListFetch(true)
            }
        })
    }

    // 选择课程前，判断是否选择科目
    handleClickCourse(id) {
        id == '' && Toast.info('请先选择科目', 1);
    }

    // 拨打电话
    call(e) {
        e.stopPropagation()
    }

    // 清除search
    clearSearch() {
        this.props.clearReduxSearch()
        if (this.state.search === '') return;
        this.setState({
            search: ''
        })
    }

    // 点击签订合同按钮
    handleSignContract(item) {
        this.saveScreeingCondition()
        localStorage.setItem('formRouter',`/clueList`)
        switch (item.leadStatus) {
            case 'VISIT_LISTEN':
                this.props.history.push(`/followup/listen/${item.id}/${item.leadHistoryId}#${item.appointmentId}`)
                break
            case 'PERMISSION_VISIT':
                this.props.history.push(`/followup/visit/${item.id}/${item.leadHistoryId}#${item.appointmentId}`)
                break
            default : this.props.history.push(`/AudioSheet/${item.id}`)
        }
    }

    // 选择最新跟进时间
    handleSelRecentDate(e) {
        e.preventDefault()

        Popup.show(
            <RecentUpdate startTime={this.state.startDate}
                          endTime={this.state.endDate}
                          onCancel={() => Popup.hide() }
                          // onClear={(startDate,endDate) => this.setSelTime(startDate,endDate) }
                          onOk={(startDate,endDate) => this.setSelTime(startDate,endDate)} />
        )
    }

    // 选择年龄
    handleSelAge(e) {
        e.preventDefault()
        Popup.show(
            <SelAge minAge={this.state.minAge}
                    maxAge={this.state.maxAge}
                    onCancel={() => Popup.hide() }
                    // onClear={(minAge,maxAge) => this.setSelAge(minAge,maxAge)}
                    onOk={(minAge,maxAge) => this.setSelAge(minAge,maxAge)} />
        )
    }

    // 最新跟进时间、
    setSelTime(startDate,endDate) {
        Popup.hide()
        this.setState({ startDate, endDate, page: 1, scrollHasData: true, leadsContainer: [], }, () => {
            this.getLeadListFetch(true)
        })
    }

    // 年龄
    setSelAge(minAge,maxAge) {
        Popup.hide()
        this.setState({ minAge, maxAge, page: 1, scrollHasData: true, leadsContainer: [], }, () => {
            this.getLeadListFetch(true)
        })
    }

    // 滚动无限加载
    handleScroll() {

        const {offsetHeight:outerHeight} = this.refs.clueList
        const {offsetHeight, scrollTop: containerST} = this.refs.clueListScrollBox
        const {offsetHeight:containerHei } = this.refs.clueListScrollContainer

        const marT = parseInt(getComputedStyle(this.refs.clueListScrollContainer,null).marginTop)

        this.setState({
            containerScrollTop: containerST
        })

        if (this.state.loading || containerHei - containerST + marT > offsetHeight + 3 || !this.state.scrollHasData) {
            return;
        }

        this.setState({
            page: this.state.page+1
        }, () => {
            if (this.state.search === '')
                this.getLeadListFetch()
            else
                this.getLeadSearchFetch()
        })
    }

    // 清除search
    clearReduxSearch() {
        this.props.clearReduxSearch('')
    }

    render() {
        const {leadsContainer,customerTypePicker,leadStatusPicker,avalSourcesPicker,coursesPicker, scrollHasData, clueCount} = this.state
        const {customerType, leadStatus, sourceId, courseId, gradePicker, gradeId, disabled } = this.state

        return (
            <div id="clueList" ref={`clueList`} onScroll={this.handleScroll.bind(this)}>
                <div >
                    <div className="tab-bar">
                        <ul className='tab'>
                            {/* 客户类型 */}
                            <li>
                                <Picker
                                    data={[customerTypePicker]}
                                    title=""
                                    cascade={false}
                                    extra={`客户类型`}
                                    value={customerType}
                                    onChange={(v) => this.onPickerChange(v,`customerType`)}
                                >
                                    <ListItem arrow="horizontal" />
                                </Picker>
                            </li>
                            {/* 线索状态 */}
                            <li>
                                <Picker
                                    data={[leadStatusPicker]}
                                    title=""
                                    cascade={false}
                                    extra={`线索状态`}
                                    value={leadStatus}
                                    onChange={(v) => this.onPickerChange(v,`leadStatus`)}
                                >
                                    <ListItem arrow="horizontal" />
                                </Picker>
                            </li>
                            {/* 跟进时间 */}
                            <li className="custom-pupop" onClick={e => this.handleSelRecentDate(e)}>跟进时间</li>
                            {/* 渠道 */}
                            <li>
                                <Picker
                                    data={[avalSourcesPicker]}
                                    title=""
                                    cascade={false}
                                    extra={`渠道`}
                                    value={sourceId}
                                    onChange={(v) => this.onPickerChange(v,`sourceId`)}
                                >
                                    <ListItem arrow="horizontal" />
                                </Picker>
                            </li>
                            {/* 年级 */}
                            <li>
                                <Picker
                                    data={[gradePicker]}
                                    title=""
                                    cascade={false}
                                    extra={`课程`}
                                    value={gradeId}
                                    onChange={v => this.onPickerChange(v,`gradeId`)}
                                >
                                    <ListItem arrow="horizontal" />
                                </Picker>
                            </li>
                            {/* 课程 */}
                            <li>
                                <Picker
                                    data={[coursesPicker]}
                                    title=""
                                    cascade={false}
                                    extra={`课程`}
                                    value={courseId}
                                    disabled={ disabled }
                                    onChange={v => this.onPickerChange(v,`courseId`)}
                                >
                                    <ListItem onClick={ () => this.handleClickCourse(gradeId) } arrow="horizontal" />
                                </Picker>
                            </li>
                            {/* 年龄 */}
                            <li className="custom-pupop" onClick={e => this.handleSelAge(e)}>年龄</li>
                        </ul>
                    </div>
                    <div className="lists-scroll-box" ref={`clueListScrollBox`}>
                        <div className="lists" ref="clueListScrollContainer">
                            {!!clueCount&&<Flex className={`clue-count`}>共筛选出{clueCount}条线索</Flex>}
                            {leadsContainer.map((item, index) => (
                                <div className="list" key={index}>
                                    <div className="state">{item.leadStatusDesc}</div>
                                    <span className="appointment-time">{item.appointmentTime!==null&&new Date(item.appointmentTime).Format('yyyy-MM-dd hh:mm')}</span>
                                    <i className="icon-badge"></i>

                                    <div className="box" onClick={() => this.handleToDetail(item)}>
                                        <Flex className="mb24">
                                    <span className="time">
                                        {Base.getDateDiff(item.lastUpdateTime).default}
                                    </span>
                                            <span className="cc-name">
                                        {item.ccName}
                                    </span>
                                        </Flex>
                                        <Flex className="mb24">
                                    <span className="source">
                                        {item.course}
                                    </span>
                                            <span className="laiy">{item.sourceName}</span>
                                        </Flex>
                                        {item.students.map(({age,studentName}, index) => (
                                            <Flex className="students-box mb14" key={index} >
                                                <label>学　员： </label>
                                                <Flex className="students">
                                                    <span className="value name ">{studentName}</span>
                                                    {!!age&&<span className="value ">{age}岁</span>}
                                                </Flex>
                                            </Flex>
                                        ))}

                                        <Flex className="mb14">
                                            <label>联系人： </label>
                                            <span className="value name">{item.name}</span>
                                            <span className="value">{localMobile(item.mobile)}</span>
                                            <span className="value">
                                                <a className="tel" href={`tel://${item.mobile}`} onClick={(e) => this.call(e)}></a>
                                            </span>
                                        </Flex>
                                    </div>
                                    <Button className="btn" onClick={() => this.handleSignContract(item)}>签订合同</Button>
                                </div>
                            ))}
                            {
                                (leadsContainer.length > 0 && scrollHasData) &&
                                <ActivityIndicator className="no-data" text={`正在加载`}/>
                            }
                            {
                                (leadsContainer.length<=0 || !scrollHasData) &&
                                <Flex className="no-data">暂无更多数据...</Flex>
                            }
                        </div>
                    </div>
                </div>
                <div className="fix-btns">
                    <Link to='/clueList-search' className="btn" onClick={this.clearReduxSearch.bind(this)}></Link>
                    <Link to='/add/tel' className="btn add-clue"></Link>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    searchValue: state.searchValue
})
const CLUELIST = connect(
    mapStateToProps,
    action
)(clueList)

export default CLUELIST;