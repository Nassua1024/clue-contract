import { Flex, Tabs, Button, Modal, WhiteSpace, InputItem, List, Toast, Picker, DatePicker, TextareaItem, Popup, Carousel } from 'antd-mobile'
import { Link } from 'react-router-dom'
import './clueDetail.less'
import * as action from '../../../redux/action/action'
import InterestLabel from '../addLabel/interestLabel'
import moment from 'moment'

const minDate = moment(`${new Date(1900, 0).Format('yyyy-MM-dd')} +0800`, 'YYYY-MM-DD Z').utcOffset(8)
const studentTypeArr = [
    [
        {
            label: '儿童学员',
            value: false
        },
        {
            label: '成人学员',
            value: true
        }
    ]
]
const customerTypePicker = [ [
    {
        label: '普通客户',
        value: 'COMMON'
    }, {
        label: '重要客户',
        value: 'IMPORTANT'
    }, {
        label: '暂不分类',
        value: ''
    }
] ]
const relationshipType = [ [
    {
        label: '本人',
        value: 'BENREN'
    }, {
        label: '父子',
        value: 'FUZI'
    }, {
        label: '母子',
        value: 'MUZI'
    }, {
        label: '祖孙',
        value: 'ZUSUN'
    }, {
        label: '外孙',
        value: 'WAISUN'
    }, {
        label: '叔侄舅甥',
        value: 'SHUZHI'
    }, {
        label: '兄弟姐妹',
        value: 'XIONGDIJIEMEI'
    }, {
        label: '表亲',
        value: 'BIAOQIN'
    }, {
        label: '其他',
        value: 'QITA'
    }
] ]
const Http = Base
const { api: URL } = Http.url
const localMobile = Http.mobile
const { connect } = ReactRedux
const Item = List.Item
const TabPane = Tabs.TabPane
const alert = Modal.alert
const genders = [
    { value: 'MALE', label: '男' },
    { value: 'FEMALE', label: '女' }
]
let maskProps;
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
if (isIPhone) {
    maskProps = {
        onTouchStart: e => e.preventDefault()
    };
}


class CarouselCustomxxxx extends React.Component {
    constructor(props) {
        super(props)
        props.onShow(this.onShow.bind(this))
        // props.onHide(this.onHide.bind(this))
        this.state = {
            visible: false,
            setHeight: true,
            bodyOffsetHeight: document.documentElement.offsetHeight
        }
    }

    componentWillMount() {
    }

    onShow() {
        this.setState({
            visible: true
        })
        setTimeout(() => {
            this.refs.Carousel.parentNode.parentNode.style.height = this.refs.Carousel.parentNode.style.height = this.state.bodyOffsetHeight + 'px'
            this.refs.Carousel.parentNode.parentNode.style.lineHeight = this.refs.Carousel.parentNode.style.lineHeight = this.state.bodyOffsetHeight + 'px'
        }, 0)
    }

    onHide() {
        this.setState({
            visible: false
        })
    }

    render() {
        const hProp = this.state.initialHeight ? { height: this.state.initialHeight } : {};
        return (
            <div>
                {this.state.visible && <div id="detail-carousel" onClick={() => this.onHide()}>
                    <Carousel

                        className="my-carousel" autoplay={false} infinite swipeSpeed={35}>
                        {this.props.data.map((ii, index) => (
                            <div ref="Carousel" key={index}>
                                <img src={ii} alt="icon" onLoad={() => {
                                }} />
                            </div>
                        ))}
                    </Carousel>
                </div>}
            </div>
        )
    }
}

/*跟进记录*/
class FollowUp extends React.Component {
    constructor(props) {
        super(props)
        /**
         * @
         */
        this.state = {

            followUpInfor: props.data,//跟进记录

            followIndex: ''
        }
    }

    // 点击显示图片
    onImageClick(followIndex) {
        this.setState({
            followIndex
        }, () => {
            this.props.getFollowUpUrls(this.props.data[ followIndex ].pictureUrls)
            this.props.onImagesShow()
        })
    }

    /* 跳转至试听单附件 */
    linkToSTFuJian(item) {
        this.props.ParentStateToRedux()  // 保存父组件state(保存当前tab状态)
        this.props.auditionLinkToDetail(item)
    }

    /* 跳转合同详情 */
    linkToHTFuJian() {
        this.props.ParentStateToRedux()  // 保存父组件state(保存当前tab状态)
    }

    render() {
        const { data, followIndex } = this.props
        const carouselData = data[ followIndex ] ? data[ followIndex ].pictureUrls : []
        return (
            <div>
                {
                    data &&
                    data.map((item, index) => {
                        const pickerLen = item.pictureUrls.length
                        const createTimeFmt = Http.getDateDiff(item.createTime).hasMills
                        const [ yearMonth = '', day = '', time = '' ] = createTimeFmt
                            .split('').reverse().join('')
                            .replace(/-/, ' ').split('').reverse().join('').split(' ')
                        return <div className="list" key={ index }>
                            <div className="time">
                                {
                                    createTimeFmt.indexOf('天') > -1
                                        ? createTimeFmt
                                        : <div className="tt">
                                            <div className="t">{ yearMonth.slice(2) }-{ day }</div>
                                            <div className="b">{ time }</div>
                                        </div>
                                }
                            </div>
                            <i className="icon"></i>
                            <Flex className="tit">
                                <div className="state">{item.statusDesc}</div>
                                <div className="creater">{item.operator}创建</div>
                            </Flex>
                            {item.appointmentTime && <Flex className={`text`}>{new Date(item.appointmentTime).Format('yyyy-MM-dd hh:mm')}</Flex>}
                            <Flex className={`note-imgs-box ${data.length === 1 ? 'oneXianS' : ''}`}>
                                {pickerLen > 0 &&
                                <div className="imgs" onClick={() => this.onImageClick(index)}>
                                    {item.pictureUrls.map((list, index) => (
                                        <div key={index}
                                             className={`count${pickerLen > 4 ? 4 : pickerLen}-${index + 1}`}
                                             style={{ display: index >= 4 ? 'none' : 'flex' }}>
                                            <img src={list} alt="" />
                                        </div>
                                    ))}
                                    <div className="img-count">共{pickerLen}张</div>
                                </div>
                                }
                                <p className={`note`}>{item.note}</p>
                            </Flex>
                            {/* 试听单附件 */}
                            {item.listen && <Flex className="enclosure" onClick={() => this.linkToSTFuJian(item.listen)}>
                                <i className="icon-fujian"></i>
                                <span>{item.listen.studentName}_{item.listen.courseName}_{new Date(item.listen.appointmentTime).Format('yyyy-MM-dd')}_{item.listen.listen ? '已' : '未'}试听</span>
                            </Flex>}
                            {/* 合同附件 */}
                            {item.contract && <Link to={`/ContractDetail/${item.contract.contractId}`}><Flex className="enclosure"
                                                                                                             onClick={() => this.linkToHTFuJian()}>
                                <i className="icon-fujian"></i>
                                <span>{item.contract.studentName}_{new Date(item.contract.contractDate).Format('yyyy-MM-dd')}_{item.contract.contractStatusDesc}</span>
                            </Flex></Link>}
                        </div>
                    })
                }
            </div>
        )
    }
}

/* 联系人 */
class LinkMan extends React.Component {
    constructor(props) {
        super(props)
        /**
         * @
         */
        this.state = {

            contactInfo: [],  //跟进记录
            linkmanInfo: {
                name: '',
                mobile: '',
                relation: '',
                leadId: props.leadId

            },
            delBtnShow: false,

            modal: false,
            contactId: '',

            editModal: false,
            editData: { name: '', mobile: '', relation: '' },
            editModalData: { name: '', mobile: '', relation: '' }
        }

        props.viewShowModal(this.handleModal.bind(this));
        props.toggleBtnshow(this.toggleDelBtn.bind(this))
    }

    componentWillMount() {
        this.getLinkmanFetch()
    }

    // 获取联系人信息
    getLinkmanFetch() {
        const params = { data: { leadId: this.state.linkmanInfo.leadId } }
        Http.ajax(`${URL}/lead/contact`, params).then(res => {
            const contactInfo = res.data.contacts
            this.setState({ contactInfo })
        })
    }

    // 信息
    handleChangeInfo(v, state) {
        if (state === 'name' || state === 'relation') {
            v = Http.legInputName(v)
        }

        this.setState(prev => {
            prev.linkmanInfo[ state ] = v
            return prev.linkmanInfo
        })
    }

    // modal
    handleModal() {
        const linkmanInfo = Object.assign({}, this.state.linkmanInfo)
        linkmanInfo.name = linkmanInfo.mobile = linkmanInfo.relation = ''
        this.setState({
            modal: !this.state.modal,
            linkmanInfo
        }, () => {
            var autofocusIpt = document.getElementsByClassName('ht-add-name')[ 0 ].children[ 1 ].children[ 0 ];
            autofocusIpt.focus();
        })
    }

    // 添加联系人
    addLinkman() {
        const data = Object.assign({}, this.state.linkmanInfo)

        if (!data.name) {
            Toast.info(`请录入联系人姓名`, 1.5, null, false);
            return;
        } else if (!( /^1\d{10}$/.test(data.mobile.replace(/\s/g, '')) )) {
            Toast.info(`联系人手机格式不正确`, 1.5, null, false);
            return
        }

        data.mobile = data.mobile.replace(/\s/g, '')
        const params = { method: 'post', data }

        Http.ajax(`${URL}/contact/add`, params).then(res => {
            if (res.code === '0') {
                Toast.info('添加成功', 2, null, false)
                this.handleModal()
                this.getLinkmanFetch()
                this.props.getBaseInfo()
            }
        })
    }

    // 删除联系人
    deleteLinkMan(item, e) {
        e.stopPropagation()

        const delLinkman = () => {
            const params = { method: 'post', formData: true, data: { contactId: item.id } }
            Http.ajax(`${URL}/contact/delete`, params).then(res => {
                if (res.code == 0) {
                    Toast.info(`删除成功`, 1.5, null, false)
                    this.getLinkmanFetch()
                    this.props.getBaseInfo()
                }
            })
        }
        alert(`提示`, `确认删除联系人 ${item.name} ？`, [
            { text: '取消', onPress: () => { } },
            { text: '确认', onPress: () => { delLinkman() } }
        ])

    }

    // 切换删除按钮显示隐藏
    toggleDelBtn() {
        this.setState({
            delBtnShow: !this.state.delBtnShow
        }, () => {
            this.props.addLinkmanForSuccess(this.state.delBtnShow)
        })
    }

    // 编辑联系人modal显示
    changeLinkManModalShow(item) {
        if (!this.state.delBtnShow) return;
        const editModalData = Object.assign({}, item);
        const editData = Object.assign({}, item);

        editModalData.mobile = editModalData.mobile.replace(/(^\d{3}|\d{4}\B)/g, "$1 ")
        this.setState({
            editData,
            editModalData,
            editModal: true
        }, () => {
            var autofocusIpt = document.getElementsByClassName('ht-edit-name')[ 0 ].children[ 1 ].children[ 0 ];
            autofocusIpt.focus();
        })
    }

    // 编辑联系人
    changeLinkManInfo() {

        const { editModalData } = this.state
        editModalData.mobile = editModalData.mobile.replace(/\s/g, '')
        editModalData.contactId = editModalData.id
        const params = { method: 'post', data: editModalData }
        if (!editModalData.name) {
            Toast.info(`请录入联系人姓名`, 1.5, null, false);
            return;
        } else if (!( /^1\d{10}$/.test(editModalData.mobile.replace(/\s/g, '')) )) {
            Toast.info(`联系人手机格式不正确`, 1.5, null, false);
            return;
        }

        this.setState({ editModal: false })
        Http.ajax(`${URL}/contact/edit`, params).then(res => {
            if (res.code == 0) {
                Toast.info(`修改成功`, 1.5, null, false)
                this.getLinkmanFetch()
            }
        })
    }

    //
    handleChangeModal(v, state) {
        if (state === 'name' || state === 'relation') {
            v = Http.legInputName(v)
        }

        this.setState(prev => {
            prev.editModalData[ state ] = v
            return prev.editModalData
        })
    }

    render() {

        const { linkmanInfo, modal, contactInfo, delBtnShow, editModal, editModalData, editData } = this.state
        const { name, mobile, relation } = linkmanInfo
        return (
            <div>
                {contactInfo.map((item, index) => (
                    <Flex className="list isEmPerson" key={index} onClick={() => {this.changeLinkManModalShow(item, index)}}>
                        <span className="name line-one">{item.name}</span>
                        <span className="tel" href={`tel://${item.mobile}`}>{localMobile(item.mobile)}</span>
                        <span className="em-person line-one">{item.relation}</span>
                        {delBtnShow && <Button className="del" onClick={(e) => this.deleteLinkMan(item, e)}>删除</Button>}
                    </Flex>
                ))}

                <Modal title="添加联系人"
                       transparent
                       className="linkman-modal"
                       maskClosable={false}
                       visible={modal}
                       platform="ios"
                       onClose={() => this.handleModal()}
                       footer={[
                           { text: '取消', onPress: () => { this.handleModal() } },
                           { text: '确定', onPress: () => { this.addLinkman() } }
                       ]}>
                    <InputItem clear
                               value={name}
                               maxLength={10}
                               onChange={(v) => this.handleChangeInfo(v, 'name')}
                               placeholder="请输入联系人"
                               className='ht-add-name'

                    >联系人</InputItem>
                    <InputItem clear
                               value={mobile.replace(/\s/g, '-')}
                               onChange={(v) => this.handleChangeInfo(v, 'mobile')}
                               type="phone"
                               placeholder="请输入电话"

                    >电话</InputItem>
                    <InputItem clear value={relation} maxLength={10} onChange={(v) => this.handleChangeInfo(v, 'relation')} placeholder="请输入关系"

                    >关系</InputItem>
                </Modal>

                <Modal className="linkman-modal" title={`编辑紧急联系人`} visible={editModal} transparent platform="ios" footer={[
                    { text: '取消', onPress: () => this.setState({ editModal: false }) },
                    { text: '确定', onPress: () => this.changeLinkManInfo() }
                ]}>
                    <InputItem clear
                               value={editModalData.name}
                               maxLength={10}
                               onChange={(v) => this.handleChangeModal(v, 'name')}
                               placeholder="请输入联系人"
                               className='ht-edit-name'

                    >联系人</InputItem>
                    <InputItem clear
                               value={editModalData.mobile.replace(/\s/g, '-')}
                               onChange={(v) => this.handleChangeModal(v, 'mobile')}
                               type="phone"
                               placeholder="请输入电话"

                    >电话</InputItem>
                    <InputItem clear
                               value={editModalData.relation}
                               maxLength={10}
                               onChange={(v) => this.handleChangeModal(v, 'relation')}
                               placeholder="请输入关系"

                    >关系</InputItem>
                    {/*<Button onClick={ () => this.changeLinkManInfo() }>确认提交</Button>*/}
                    {/*                    <i className="close" onClick={ () => this.setState({editModal:false}) }></i>
*/}                </Modal>
            </div>
        )
    }
}

/* 合同 */
class Contract extends React.Component {
    constructor(props) {
        super(props)
        /**
         * @
         */
        this.state = {

            contractInfo: [],  //跟进记录
            specialContract: [] //特批合同
        }
    }

    componentWillMount() {
        this.getContractInfo();
        this.specialContract();
    }

    //获取合同信息
    getContractInfo() {
        const { leadId } = this.props
        const param = {
            data: {
                leadId //暂时使用
            }
        }
        Http.ajax(`${URL}/lead/contracts`, param).then((res) => {
            this.setState({
                contractInfo: res.data.contracts
            })
        })
    }

    /*特批合同列表*/
    specialContract() {
        const { leadId } = this.props;
        const param = {
            data: {
                leadId,
                limitUnused: true
            }
        };
        Http.ajax(`${URL}/changgui/get-specials`, param).then((res) => {
            if (res.code == 0) {

                const specialContract = res.data.contractSpecials;

                this.setState({
                    specialContract
                });
            }
        });
    }

    // linkToContractDetail
    linkToContractDetail(item) {
        this.props.ParentStateToRedux()
        this.props.contractLinkToDetail(item)
    }

    linkToAddSpecial(v) {
        this.props.linkToAddSpecial(v);
    }

    render() {
        const { contractInfo, specialContract } = this.state
        return (
            <div>
                {contractInfo.map((item, index) => {
                    return <Flex className="list" key={index} onClick={() => {this.linkToContractDetail(item)}}>
                        <div>{item.studentName}</div>
                        <div>{new Date(item.contractDate).Format('yyyy-MM-dd')}</div>
                        <div>{item.internalPrice}</div>
                        <div>{item.contractStatusDes}</div>
                    </Flex>
                })}
                {
                    specialContract.map((item, index) => (
                        <Flex className="list-special" key={index} onClick={() => {this.linkToAddSpecial(item.contractSpecialId)}}>
                            <div>{new Date(item.createTime).Format('yyyy-MM-dd')}</div>
                            {
                                item.auditStatus != 'NO' &&
                                <div>{item.auditStatus == 'AUDITING' ? '特批申请中' : '特批已通过'}</div>
                            }
                            {
                                item.auditStatus == 'NO' &&
                                <div>特批未通过</div>
                            }
                        </Flex>
                    ))
                }
            </div>
        )
    }
}

/* 试听单 */
class AuditionList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            listens: []
        }
    }

    componentWillMount() {
        this.getAllListensFetch()
    }

    /* 获取试听单 */
    getAllListensFetch() {
        const params = {
            data: {
                leadId: this.props.leadId
            }
        }

        Http.ajax(`${URL}/lead/all-listens`, params).then(res => {
            if (res.code === '0') {
                const { listens } = res.data
                this.setState({
                    listens
                })
            }
        })
    }

    /* 跳转试听单详情 */
    gotoAuditionDetail(item) {
        this.props.ParentStateToRedux()  // 保存父组件state(保存当前tab状态)
        this.props.auditionLinkToDetail(item)
    }

    /*  */

    render() {
        const { listens } = this.state
        return (
            <div>
                {listens.map((list, index) => (
                    <Flex className={`list`} key={index} onClick={() => this.gotoAuditionDetail(list)}>
                        <span style={{ WebkitBoxOrient: 'vertical' }}>{list.studentName}</span>
                        <span>{list.courseName}</span>
                        <span>{list.appointmentTime ? new Date(list.appointmentTime).Format('yyyy-MM-dd') : ''}</span>
                        <span>{list.teacherName}</span>
                        <span>{list.listen ? '已试听' : '未试听'}</span>
                    </Flex>
                ))}
            </div>
        )
    }
}

/* 详细资料 */
class DetailBase extends React.Component {
    constructor(props) {
        super(props)
        props.studentBtnClick(this.editStudentFetch.bind(this))
        props.inputEditor(this.changeinputDisabled.bind(this))

        this.state = props.state.supplement ? props.state.supplement : {
            storeName: '',
            inputDisabled: false,
            sourceName: '',
            avaSources: [],

            courseList: [], // 课程列表
            gradesList: [], // 年级列表
            storeName: '',
            mainCourse: '',         // 默认课程
            interests: '',          // 感兴趣的-中文
            
            params: {
                address: '',            // 联系人地址
                adult: [],              // 是否成人学员
                sourceId: [],              // 课程id
                age: '',                // 年龄
                birthday: '',           // 生日
                courseIds: [],          // 课程lists
                note: '',  // 备注
                customerType: [ '' ],       // 客户类型
                email: '',              // 邮箱
                estimatedPrice: '',     // 预估金额
                gender: '',             // 性别
                mobile: '',             // 手机号
                name: '',               // 姓名
                otherTrainingCourse: '',           // 其他培训课程
                leadId: props.leadId,     // 线索ID

                linkManVisib: false,
                customerLabels: [],

                gradeId: null,
                courseId: null,
                disabled: true
            },

            students: [
                {
                    age: '',        // 年龄
                    birthday: '',   // 生日
                    courseIds: [],  // 课程ids
                    gradeId: '',    // 年级
                    introduce: '',  // 学员介绍
                    leadId: '',     // 线索id
                    relationshipType: null,   // 关系
                    school: '',         // 学校名
                    studentName: '',         // 学员姓名
                    btnIsDelete: false,
                    gender: '',
                    disabled: false
                }
            ],

            labelIds: [],
            currentTab: 'baseInfo',

            grades: [], // new 年级
            courses: [] // new 课程
        }
    }

    componentWillMount() {
        // this.getLeadDetailFetch()

        this.getGradesFetch()       // 年级
        this.getChiCoursesFetch()   //课程
        
        if (!this.props.state.supplement) {
            this.getStoreFetch()        // 馆
        }

        if (this.props.state.labels && this.props.state.labels.id === this.props.leadId) {
            this.getLabelsFetch()       // 标签
        }

        this.props.onTabChange(this.state.currentTab)
    }

    // 获取渠道来源
    getavaSourcesFetch(setStateData = {}) {
        const params = { method: 'POST', data: {} }
        Http.ajax(`${URL}/selections/avaliable-sources`, params).then(res => {
            if (res.code === '0') {
                const avaSources = res.data.sources.map(({ id: value, text: label }) => ({ label, value }))

                const hasSource = avaSources.filter(({ value }) => (setStateData.params.sourceId || '')[ 0 ] === value).length > 0
                if (!hasSource) {
                    avaSources.push({ label: setStateData.sourceName, value: (setStateData.params.sourceId || '')[ 0 ] })
                }

                setStateData = Object.assign(setStateData, { avaSources })
                this.setState(setStateData, () => this.initGrade() )
            }
        })
    }

    // tab
    changeTabState(currentTab) {
        let stdBtnisDelete
        const currStudent = this.state.students[ currentTab.slice(currentTab.length - 1) >> 0 ]
        if (currentTab.indexOf('student') > -1) {
            stdBtnisDelete = currStudent.btnIsDelete && this.state.students.length > 1
            this.props.getStudentDisabled(currStudent.disabled)
        }

        this.setState({ currentTab })
        this.props.onTabChange(currentTab, stdBtnisDelete)
    }

    // 获取课程
    getChiCoursesFetch() {
        const params = {
            method: 'post'
        }
        Http.ajax(`${URL}/selections/chinese-courses`, params).then(res => {
            const courseList = res.data.courses.map(({ id: value, text: label }) => ({ label, value }))
            this.setState({
                courseList
            }, () => {
                if (!this.props.state.supplement)
                    this.getLeadDetailFetch()   // 详情
            })
        })
    }

    // 获取分馆数据
    getStoreFetch() {
        const params = {}

        Http.ajax(`${URL}/lead/current-store`, params).then((res) => {
            const { storeName } = res.data
            this.setState({
                storeName
            })
        })
    }

    // 获取年级
    getGradesFetch() {
        const params = {
            method: 'POST'
        }

        Http.ajax(`${URL}/selections/grades`, params).then(res => {

            const gradesList = res.data.grades.map(({ id: value, text: label }) => ({ label, value }))

            this.setState({ gradesList })
        })
    }

    // 获取线索信息
    getLeadDetailFetch() {
        const leadId = this.props.leadId
        const params = { data: { leadId } }
        Http.ajax(`${URL}/lead/detail`, params).then(res => {
            // if (res.data.detailInfo.students.length <= 0) {
            //     this.postSaveStudentFetch() // 保存学员
            // }
            if (res.data.detailInfo.students.length > 0) {
                const students = res.data.detailInfo.students.concat()
                students.forEach(list => {
                    list.btnIsDelete = true
                    list.linkManVisib = false
                    list.gradeId = list.gradeId ? [ list.gradeId ] : ''
                    list.birthday = list.birthday ? moment(`${new Date(list.birthday).Format('yyyy-MM-dd')} +0800`, 'YYYY-MM-DD Z').utcOffset(8) : ''
                    list.relationshipType = list.relationshipType ? [ list.relationshipType ] : ''
                    list.gender = list.gender ? [ genders.filter(item => item.value === list.gender)[ 0 ].value ] : ''
                    list.disabled = false
                })
                this.setState({ students })
            }
            const { gender, sourceId, address, adult, age, note, birthday, mobile, name, courses, customerType, sourceName, customerLabels, email, customerIntroduce, estimatedPrice, otherTrainingCourse } = res.data.detailInfo
            const { gradeId, courseId } = res.data.detailInfo;
            const { leadSystem } = res.data.detailInfo;
            const courseList = this.state.courseList.concat()
            courses.forEach(list => {
                const hasList = this.state.courseList.some(item => list.courseId === item.value)
                if (!hasList) courseList.push({
                    label: list.name,
                    value: list.courseId
                })
            })
            const params = {
                address,
                adult: [ adult ],
                sourceId: [ sourceId ],
                gender: gender ? [ genders.filter(item => item.value === gender)[ 0 ].value ] : '',
                age,
                birthday: birthday ? moment(`${new Date(birthday).Format('yyyy-MM-dd')} +0800`, 'YYYY-MM-DD Z').utcOffset(8) : '',
                courseIds: courses.map(({ courseId }) => courseId),
                note: note,
                customerType: customerType ? [ customerType ] : [ '' ],
                email,
                estimatedPrice: estimatedPrice || '',
                mobile: mobile.replace(/\s/g, '').replace(/(^\d{3}|\d{4}\B)/g, "$1 "),
                name,
                customerLabels,
                otherTrainingCourse,
                leadId: this.props.leadId,

                linkManVisib: false,

                gradeId: [gradeId],
                courseId: [courseId],
                disabled: gradeId == 0 ? true : false
            }
            if (leadSystem !== 'TMKANDMARKET') {
                this.getavaSourcesFetch({
                    params,
                    courseList,
                    sourceName,
                    leadSystem
                })
                return;
            }
            this.setState({
                params,
                courseList,
                sourceName,
                leadSystem
            }, () => this.initGrade() )
        })
    }

    // 修改学员-删除学员
    editStudentFetch(index, text) {

        const students = this.state.students.concat()
        const student = Object.assign({}, students[ index ])
        const studentNames = students.map(list => list.studentName)
        studentNames.splice(index, 1)
        if (!student.disabled && text === '保存学员') {
            this.setState(prev => {
                prev.students[ index ].disabled = true
                return prev.students
            }, () => {
                this.props.getStudentDisabled(true)
            })
            return
        }
        const { studentId } = student
        if (text === '保存学员') {
            if (student.studentName === '') {
                Toast.info(`请录入学员姓名!`, 1.2, null, false)
                return;
            }
            if (!student.gender) {
                Toast.info(`请录入学员性别!`, 1.2, null, false)
                return;
            }

            if (studentNames.includes(student.studentName)) {
                Toast.info(<span>学员 {student.studentName} 已存在，<br />请检查</span>, 1.2, null, false)
                return;
            }
            // 修改学员
            if (studentId) {
                const params = { method: 'POST', data: student }
                params.data.gradeId = params.data.gradeId[ 0 ] || null
                params.data.relationshipType = (params.data.relationshipType || '')[ 0 ] || null
                params.data.birthday = params.data.birthday && params.data.birthday.format && params.data.birthday.format('YYYY-MM-DD') || null
                params.data.gender = params.data.gender && params.data.gender[ 0 ] || null
                Http.ajax(`${URL}/students/edit`, params).then(res => {
                    if (res.code === '0') {
                        Toast.info('保存成功', 1, null, false)
                        this.btnIsConfirm(index, true)
                        this.props.getBaseInfo()
                        // 如果只有一个带有studentId学员
                        this.setState(prev => {
                            const relaStudents = prev.students.filter(list => !!list.studentId)
                            const realStudentLength = relaStudents.length
                            if (realStudentLength === 1) {
                                relaStudents[ 0 ].btnIsDelete = false
                            }
                            prev.students[ index ].disabled = false
                            return prev.students
                        }, () => {
                            this.props.getStudentDisabled(false)
                        })
                    }
                })
            }
            // 保存学员
            else {
                const params = { method: 'POST', data: student }
                params.data.leadId = this.props.leadId >> 0
                params.data.gradeId = params.data.gradeId[ 0 ] || null
                params.data.relationshipType = (params.data.relationshipType || '')[ 0 ] || null
                params.data.birthday = params.data.birthday === '' ? null : new Date(params.data.birthday).Format('yyyy-MM-dd')
                params.data.gender = params.data.gender && params.data.gender[ 0 ] || null
                Http.ajax(`${URL}/lead/save-student`, params).then(res => {
                    if (res.code === '0') {
                        Toast.info('保存成功', 1, null, false)
                        this.props.getBaseInfo()
                        this.btnIsConfirm(index, true)
                        this.setState(prev => {
                            prev.students[ index ].studentId = res.data.studentId
                            prev.students[ index ].disabled = false
                            const studentLength = prev.students.filter(list => list.studentId != undefined).length
                            if (studentLength > 1) {
                                prev.students.forEach(item => {
                                    item.btnIsDelete = true
                                })
                            }
                            return prev.students
                        }, () => {
                            this.props.getStudentDisabled(false)
                        })
                    }
                })
            }

        } else if (text === '删除学员') {
            // 删除学员
            const delStudent = () => {
                students.splice(index, 1)
                this.setState({
                    students,
                    currentTab: `student${students.length - 1}`
                }, () => {
                    Toast.info(`已删除${student.studentName ? '学员: ' : ''}${student.studentName}`, 1.5, null, false)

                    let stdBtnisDelete
                    if (this.state.currentTab.indexOf('student') > -1)
                        stdBtnisDelete = this.state.students[ students.length - 1 >> 0 ].btnIsDelete && this.state.students.length > 1

                    this.props.onTabChange(this.state.currentTab, stdBtnisDelete)
                })
            }
            const delStudentFetch = () => {
                const params = { data: { studentId } }
                Http.ajax(`${URL}/students/delete`, params).then(res => {
                    if (res.code === '0') {
                        Toast.info('删除成功', 1.5, null, false)
                        this.props.getBaseInfo()
                        delStudent()
                    }
                })
            }
            if (studentId) {
                alert(`删除`, `是否删除学员 ${student.studentName} ？`, [
                    { text: '取消', onPress: () => {} },
                    { text: '确定', onPress: () => delStudentFetch() }
                ])

            } else {
                delStudent()
            }
        }

    }

    // 保存输入
    handleInputChange(value, state, index) {

        if (state === 'age' || state === 'estimatedPrice') {
            value = value.replace(/\s/g, '')
        }

        if (state === 'studentName') {
            value = Http.legInputName(value)
        }

        if (index === undefined) {
            this.setState(prev => {
                prev.params[ state ] = value
                return prev.params
            })
        } else {
            this.setState(prevState => {
                prevState.students[ index ][ state ] = value
                return prevState.students
            })
            this.btnIsConfirm(index)
        }
    }

    /* 姓名 */
    handleName(name) {

        name = Http.legInputName(name)

        this.setState((prev) => {
            prev.params.name = name

            return prev.params
        })
    }

    /* 手机号 */
    handleTel(tel) {
        this.setState((prev) => {
            prev.params.mobile = tel

            return prev.params
        })
    }

    /* 选择课程 */
    handleCourse(mainCourse, index) {
        if (index === undefined) {
            this.setState(prev => {
                const { courseIds } = prev.params
                const [ first ] = mainCourse
                if (courseIds.indexOf(first) < 0)
                    courseIds.splice(0, 1, first)
                else
                    courseIds.unshift(courseIds.splice(courseIds.indexOf(first), 1)[ 0 ])
            })
        } else {
            this.setState(prev => {
                const { courseIds } = prev.students[ index ]
                const [ first ] = mainCourse
                if (courseIds.indexOf(first) < 0)
                    courseIds.splice(0, 1, first)
                else
                    courseIds.unshift(courseIds.splice(courseIds.indexOf(first), 1)[ 0 ])
            })
            this.btnIsConfirm(index)
        }
    }

    // 其他感兴趣的
    handleInterest(index) {
        let value = ''
        if (index === undefined)
            value = this.state.params.courseIds.concat()
        else
            value = this.state.students[ index ].courseIds.concat()

        Popup.show(<InterestLabel visible={true}
                                  data={this.state.courseList.concat()}
                                  value={value}
                                  onConfirm={v => this.cancelSource(v, index)}
                                  onClose={v => this.cancelSource(v, index)} />,
            {
                animationType: 'slide-up',
                maskProps
            }
        )

        if (index === undefined)
            this.setState(prev => {
                prev.params.linkManVisib = true
                return prev.params
            })
        else {
            this.setState(prev => {
                prev.students[ index ].linkManVisib = true
                return prev.params
            })
            this.btnIsConfirm(index)
        }
    }

    // 获取兴趣标签
    getLabelsFetch() {
        const params = {}
        Http.ajax(`${URL}/labels`, params).then(res => {
            const { ECONOMIC_POWER, FAMILY_BACKGROUND, OTHER, STUDY_SITUATION } = res.data.labels
            const { econoLabels, familyLabels, otherLabels, studyLabels } = this.props.state.labels
            const allLabel = [ ...ECONOMIC_POWER, ...FAMILY_BACKGROUND, ...OTHER, ...STUDY_SITUATION ]
            const selLabel = [ ...econoLabels, ...familyLabels, ...otherLabels, ...studyLabels ]
            const customerLabels = selLabel.map(item => allLabel.filter(list => item === list.id)[ 0 ])


            this.setState({
                labelIds: selLabel
            })
            this.setState(prev => {
                prev.params.customerLabels = customerLabels
                return prev.params
            })
        })
    }

    /* 出生日期 */
    handlebirthDate(birth, index) {
        if (birth.format && birth.format('YYYY-MM-DD') > new Date().Format('yyyy-MM-dd')) {
            alert(`提示`, `请选择有效出生日期`)
            return false;
        }

        const ny = new Date().getYear(),
            nm = new Date().Format('MMdd'),
            my = new Date(birth).getYear(),
            mm = new Date(birth).Format('MMdd')

        const age = ny - my + (mm > nm ? -1 : 0)
        if (index === undefined) {
            this.setState((prev) => {
                prev.params.birthday = birth
                prev.params.age = age
                return prev.params
            })
        } else {
            this.setState(prevState => {
                prevState.students[ index ][ 'birthday' ] = birth
                prevState.students[ index ][ 'age' ] = age
                return prevState.students
            })
            this.btnIsConfirm(index)
        }
    }

    cancelSource(v, index) {
        Popup.hide()
        this.setState(prev => {
            if (index === undefined) {
                prev.params.linkManVisib = false
                if (v !== undefined)
                    prev.params.courseIds = v
            } else {
                prev.students[ index ].linkManVisib = false
                if (v !== undefined)
                    prev.students[ index ].courseIds = v
            }

            return prev.params
        })
    }

    // 跳转至标签
    linkToClientLabel() {
        const { customerLabels } = this.state.params
        const filterLabel = (type) => (customerLabels.filter(list => list.labelType === type).map(list => list.id))
        const familyLabels = filterLabel('FAMILY_BACKGROUND'),
            econoLabels = filterLabel('ECONOMIC_POWER'),
            studyLabels = filterLabel('STUDY_SITUATION'),
            otherLabels = filterLabel('OTHER'),
            id = this.props.leadId
        this.props.saveLeadSupplement(this.state)
        this.props.ParentStateToRedux()
        this.props.saveLabels({
            familyLabels,
            econoLabels,
            studyLabels,
            otherLabels,
            id
        })
    }

    // 删除学员按钮
    btnIsConfirm(index, bool) {
        /*if (this.state.students[index].btnIsDelete!==bool) {
            this.setState(prev => {
                prev.students[index].btnIsDelete = !!bool
                return prev.students
            }, () => {
                let stdBtnisDelete
                const {currentTab} = this.state

                if (currentTab.indexOf('student') > -1)
                    stdBtnisDelete = this.state.students[currentTab.slice(currentTab.length-1)>>0].btnIsDelete && this.state.students.length > 1

                this.props.onTabChange(currentTab, stdBtnisDelete)
            })
        }*/
    }

    // 添加学员按钮
    handleAddStudent() {
        const { students } = this.state
        if (students.length >= 5) {
            Toast.info(`添加学员已达上限~`, 1, null, false)
            return;
        }

        this.setState(prev => {
            const data = {
                age: '',        // 年龄
                birthday: '',   // 生日
                courseIds: [],  // 课程ids
                gradeId: '',    // 年级
                introduce: '',  // 学员介绍
                leadId: '',     // 线索id
                relationshipType: null,   // 关系
                school: '',         // 学校名
                studentName: '',         // 学员姓名
                btnIsDelete: true,
                disabled: false
            }
            prev.students.push(data)
            return prev.students
        }, () => {
            const relaStudents = this.state.students.filter(list => !!list.studentId)
            const realStudentLength = relaStudents.length
            if (realStudentLength === 1) {
                relaStudents[ 0 ].btnIsDelete = false
            }
            this.setState({
                currentTab: `student${this.state.students.length - 1}`
            }, () => {

                let stdBtnisDelete
                if (this.state.currentTab.indexOf('student') > -1)
                    stdBtnisDelete = this.state.students[ students.length - 1 >> 0 ].btnIsDelete && this.state.students.length > 1

                this.props.onTabChange(this.state.currentTab, stdBtnisDelete)
            })
        })
    }

    // 保存联系人
    saveLinkManDetail() {

        let params = { method: 'post', data: {} }
        params.data = Object.assign({}, this.state.params)
        params.data.leadId = params.data.leadId >> 0
        params.data.adult = params.data.adult[ 0 ]
        params.data.sourceId = params.data.sourceId[ 0 ]
        params.data.customerType = params.data.customerType[ 0 ] || null
        params.data.gender = params.data.gender && params.data.gender[ 0 ] || null
        params.data.birthday = params.data.birthday ? new Date(params.data.birthday).Format('yyyy-MM-dd') : null
        params.data.mobile = params.data.mobile.replace(/\s/g, '')
        params.data.gradeId = params.data.gradeId[0] || null;
        params.data.courseId = params.data.courseId[0] || null;

        Http.ajax(`${URL}/lead/supplement`, params).then(res => {
            if (res.code === '0') {
                this.getSaveLabelToLeadFetch()
            }
        })
    }

    // 保存联系人时候保存标签
    getSaveLabelToLeadFetch() {
        const params = {
            data: {
                leadId: this.props.leadId,
                labelId: this.state.labelIds
            }
        }
        Http.ajax(`${URL}/lead/save-label`, params).then(res => {
            if (res.code === '0') {
                Toast.info(`保存成功`, 1, null, false)
                this.props.getBaseInfo()
            }
        })
    }

    // 可以编辑
    changeinputDisabled() {
        const stateParams = this.state.params
        if (!this.state.inputDisabled) {
            this.setState({
                inputDisabled: true
            })
            this.props.getLinkmanDisabled(true)
            return;
        }
        if (!stateParams.name && this.state.inputDisabled) {
            Toast.info(`请录入姓名`, 1.5, null, false);
            return
        } else if (!stateParams.gender && this.state.inputDisabled) {
            Toast.info(`请录入性别`, 1.5, null, false);
            return
        } else if (!stateParams.mobile && this.state.inputDisabled) {
            Toast.info(`请录入手机号`, 1.5, null, false);
            return
        } else if (!stateParams.courseId.length && this.state.inputDisabled) {
            Toast.info(`请录入课程`, 1.5, null, false);
            return
        }
        if (!( /^1\d{10}$/.test(stateParams.mobile.replace(/\s/g, '')) ) && this.state.inputDisabled) {
            Toast.info(`手机号格式有误`, 1.5, null, false);
            return
        } else {
            this.setState({
                inputDisabled: !this.state.inputDisabled
            }, () => { 
                this.saveLinkManDetail()
                this.props.getLinkmanDisabled(false)
            })
        }
    }

    /* 初始化年级 */
    initGrade() {
        Http.ajax(`${URL}/changgui/selections/grades`, {}).then(res => {
            if (res && res.code == 0) {
                const grades = res.data.grades.map(({ id: value, name: label }) => ({ label, value }))
                this.setState({ grades }, () => this.initCourse() );
            }
        });
    }

    /* 初始化课程 */
    initCourse() {

        const gradeId = this.state.params.gradeId;
        const params = { data: { gradeId } };

        if (gradeId == 0) return;

        Http.ajax(`${URL}/changgui/selections/courses`, params).then(res => {
            if (res && res.code == 0) {
                const courses = res.data.courses.map(({ id: value, name: label }) => ({ label, value }))
                this.setState({ courses });
            }
        });
    }

    /* 选择年级 */
    handlePickGrade(v) {
        this.setState(prev => {
            prev.params.gradeId = v;
            prev.params.courseId = 0;
            prev.params.disabled = false;
            return prev.params;
        }, () => this.initCourse() )
    }

    /* 选择课程 */
    handleClickCourse(v) {
        if (v == 0) Toast.info('请先选择课程', 1);
    }

    handlePickCourse(v) {
        this.setState(prev => {
            prev.params.courseId = v;
            return prev.params;
        })
    }

    render() {
        const { avaSources, params, currentTab, students, storeName, courseList, gradesList, sourceName, leadSystem } = this.state
        const { gender, sourceId, name, mobile, birthday, age, adult, otherTrainingCourse, customerType, estimatedPrice, note, customerLabels, address, email } = params
        const { basicInfo } = this.props
        const inputDisabled = !this.state.inputDisabled
        const { gradeId, courseId, disabled } = params;
        const { grades, courses } = this.state;

        const coursesText = (index) => {
            let DATA = []
            if (index === undefined) {
                DATA = params
            } else {
                DATA = students[ index ]
            }
            return DATA.courseIds.map(ids => {
                const texts = courseList.map(({ label, value }) => {
                    if (ids === value) return label;
                })

                const doms = texts.filter(list => list !== undefined).map(list => (
                    <span className="interest">{list}</span>
                ))

                return doms
            })
        }
        // 客户标签
        const labelsText = () => (customerLabels.map(({ labelType, name }, index) => <span key={index}
                                                                                           className={`label ${labelType}`}>{name}</span>))
        const tabStyle = {
            width: `${7.4 + students.length * 2.06}rem`
        }

        return (
            <div id="ClueDetail-detail">
                <div className="tabs-box">
                    <Flex className="tabs" style={tabStyle}>
                        <div className={`list ${'baseInfo' === currentTab ? 'active' : ''}`} onClick={() => this.changeTabState('baseInfo')}>基本信息
                        </div>
                        <div className={`list ${'info' === currentTab ? 'active' : ''}`} onClick={() => this.changeTabState('info')}>联系人信息</div>
                        {students.map((item, index) => {
                            const isActive = `student${index}`
                            return (
                                <div className={`list ${currentTab === isActive ? 'active' : ''}`}
                                     key={index}
                                     onClick={() => this.changeTabState(isActive)}>

                                    学员{index + 1}号 </div>
                            )
                        })}
                        {/*<div className={`list ${'student1'===currentTab?'active':''}`} onClick={() => this.changeTabState('student1') }>学员1</div>*/}
                        <div className={`list ${students.length >= 5 ? 'add-list' : ''}`} onClick={() => this.handleAddStudent()}>添加学员</div>
                    </Flex>
                </div>
                {/* 基本信息 */}
                {
                    currentTab === 'baseInfo' &&
                    <List className="content12">
                        <Item className={`extra-right`} extra={basicInfo.createTime ? new Date(basicInfo.createTime).Format('yyyy-MM-dd' +
                            ' hh:mm') : ''}>创建时间</Item>
                        <Item className={`extra-right`} extra={basicInfo.ccName}>CC</Item>
                        <Item className={`extra-right`} extra={`${basicInfo.leadHistoryCount || ''}条`}>跟进记录</Item>
                        <Item className={`extra-right`} extra={`${basicInfo.contractCount}个`}>合同数量</Item>
                        <Item className={`extra-right`} extra={basicInfo.lastUpdateTime ? new Date(basicInfo.lastUpdateTime).Format('yyyy-MM-dd' +
                            ' hh:mm') : ''}>最新跟进时间</Item>
                    </List>
                }
                {/* 联系人详情 */}
                {
                    currentTab === 'info' &&
                    <List>
                        {!this.state.inputDisabled && <div className="trans-bg"></div>}
                        <div className='regio'>
                            {/* 分馆 */}
                            <Item extra={storeName} className={`extra-right`}>分馆</Item>
                        </div>
                        <div className='regio'>
                            {/* 姓名 */}
                            <InputItem className="icon-xing extra-right"
                                       clear
                                       placeholder={`请输入姓名`}
                                       maxLength={10}
                                       value={name}
                                       onChange={(v) => this.handleName(v)}>
                                姓名
                            </InputItem>
                            {/* 性别 */}
                            <Picker data={[ genders ].concat()}
                                    title=""
                                    cascade={false}
                                    value={gender || ''}
                                    extra="请选择性别"
                                    onChange={v => this.handleInputChange(v, 'gender')}>
                                <List.Item arrow={`${!inputDisabled ? 'horizontal' : ''}`}
                                           className={!gender ? 'emptyPicker extra-right icon-xing' : 'extra-right icon-xing'}>
                                    性别
                                </List.Item>
                            </Picker>
                            {/* 手机号 */}
                            <InputItem className="icon-xing extra-right"
                                       clear
                                       type="phone"
                                       onChange={(v) => this.handleTel(v)}
                                       placeholder={`请输入手机号`}
                                       value={mobile.replace(/\s/g, '-')}>
                                手机号
                            </InputItem>
                            {/* 学员类别 */}
                            <Picker data={[].concat(studentTypeArr)}
                                    title=""
                                    cascade={false}
                                    value={adult}
                                    extra="请选择学员类别"
                                    onChange={v => this.handleInputChange(v, 'adult')}>
                                <List.Item className={!adult ? 'emptyPicker icon-xing extra-right' : 'icon-xing extra-right'}
                                           arrow={`${!inputDisabled ? 'horizontal' : ''}`}>
                                    学员类别
                                </List.Item>
                            </Picker>
                            {/* 渠道来源 */}
                            {
                                leadSystem === 'TMKANDMARKET'
                                    ? <Item className="icon-xing extra-right" extra={sourceName}>

                                        渠道来源
                                    </Item>
                                    : <Picker data={[ avaSources ]}
                                              title=""
                                              cascade={false}
                                              value={sourceId}
                                              extra="请选择渠道来源"
                                              onChange={v => this.handleInputChange(v, 'sourceId')}>
                                        <List.Item className={sourceId && !sourceId[ 0 ] ? 'emptyPicker icon-xing extra-right' : 'icon-xing extra-right'}
                                                   arrow={`${!inputDisabled ? 'horizontal' : ''}`}>
                                            渠道来源
                                        </List.Item>
                                    </Picker>
                            }

                            {/* 年级 */}
                            <Picker 
                                data={ [grades] }
                                cascade={false}
                                extra={ (gradeId[0] == 0  && inputDisabled )? '' : '请选择年级' }
                                value={ gradeId[0] == 0 ? null :  gradeId }
                                onChange={(v) => this.handlePickGrade(v)}
                            >
                                <List.Item 
                                    arrow={`${!inputDisabled ? 'horizontal' : ''}`}
                                    className={!(gradeId[ 0 ] ? [ gradeId[ 0 ] ] : null) ? 'emptyPicker extra-right icon-xing' : 'extra-right icon-xing'}
                                >
                                    年级
                                </List.Item>
                            </Picker>

                            {/* 课程 */}
                            <Picker 
                                data={ [courses] }
                                cascade={false}
                                extra={ (courseId[0] == 0 && inputDisabled) ? '' : '请选择课程' }
                                value={ courseId[0] == 0 ? null :  courseId }
                                disabled={ disabled }
                                onChange={(v) => this.handlePickCourse(v)}
                            >
                                <List.Item 
                                    arrow={`${!inputDisabled ? 'horizontal' : ''}`}
                                    className={!(courseId[ 0 ] ? [ courseId[ 0 ] ] : null) ? 'emptyPicker extra-right icon-xing' : 'extra-right icon-xing'}
                                    onClick={ () => this.handleClickCourse(gradeId[0]) }
                                >
                                    课程
                                </List.Item>
                            </Picker>

                            {/* 课程 */}
                            {/* <Picker data={[ courseList ]}
                                    title=""
                                    cascade={false}
                                    value={params.courseIds[ 0 ] ? [ params.courseIds[ 0 ] ] : null}
                                    extra="请选择课程"
                                    onChange={(v) => this.handleCourse(v)}>
                                <List.Item arrow={`${!inputDisabled ? 'horizontal' : ''}`}
                                           className={!(params.courseIds[ 0 ] ? [ params.courseIds[ 0 ] ] : null) ? 'emptyPicker extra-right icon-xing' : 'extra-right icon-xing'}>
                                    课程
                                </List.Item>
                            </Picker> */}

                            {/* 其他感兴趣的 */}
                            {/* <div className="label-longer coursesCu" onClick={() => this.handleInterest()}>
                                <Item extra={coursesText()} arrow={`${!inputDisabled ? 'horizontal' : ''}`} className="label-long extra-right">
                                    其他感兴趣的
                                </Item>
                            </div> */}
                        </div>
                        <div className='regio'>
                            {/* 出生日期 */}
                            <DatePicker mode="date" extra="请选择日期" onChange={(v) => this.handlebirthDate(v)} value={birthday} minDate={minDate}>
                                <List.Item arrow={`${!inputDisabled ? 'horizontal' : ''}`}
                                           className={!(birthday) ? 'emptyPicker extra-right' : 'extra-right'}>出生日期</List.Item>
                            </DatePicker>
                            {/* 年龄 */}
                            <InputItem placeholder={!this.state.params.birthday ? `请输入年龄` : ``}
                                       clear
                                       value={age || ''}
                                       className={`extra-right`}
                                       maxLength={4}
                                       disabled={!birthday ? false : true}
                                       onChange={v => this.handleInputChange(v, 'age')}
                                       type="phone">
                                年龄
                            </InputItem>
                            {/* 其他培训课程 */}
                            <TextareaItem className="label-long extra-right"
                                          title="其他培训课程"
                                          placeholder="请输入其他培训课程"
                                          clear
                                          value={otherTrainingCourse}
                                          onChange={v => this.handleInputChange(v, 'otherTrainingCourse')}
                                          autoHeight />
                            {/* 可签金额 */}
                            <InputItem placeholder={`请输入可签金额`}
                                       value={estimatedPrice}
                                       type="phone"
                                       className={`extra-right`}
                                       maxLength={7}
                                       onChange={v => this.handleInputChange(v, 'estimatedPrice')}
                                       clear>
                                可签金额
                            </InputItem>
                            {/* 客户类型 */}
                            <Picker data={customerTypePicker}
                                    title=""
                                    onChange={v => this.handleInputChange(v, 'customerType')}
                                    value={customerType}
                                    cascade={false}
                                    extra="客户类型">
                                <List.Item arrow={`${!inputDisabled ? 'horizontal' : ''}`}
                                           className={!(customerType) ? 'emptyPicker extra-right' : 'extra-right'}>
                                    客户类型
                                </List.Item>
                            </Picker>
                            {/* 客户标签 */}
                            <Link to={`/client-label/clueDetail/${this.props.leadId}#${this.props.leadHistoryId}`}
                                  onClick={this.linkToClientLabel.bind(this)}
                                  className="clientLabels-box">
                                <Item extra={labelsText()} arrow={`${!inputDisabled ? 'horizontal' : ''}`} className={`extra-right`}>客户标签</Item>
                            </Link>
                            {/* 备注 */}
                            <TextareaItem className="client-introduce extra-right ipt-top"
                                          title="备注"
                                          placeholder="请输入备注"
                                          value={note}
                                          onChange={v => this.handleInputChange(v, 'note')}
                                          autoHeight />
                        </div>
                        <div className="regio label-longer">
                            {/* 联系人邮箱 */}
                            <InputItem className="label-long extra-right ipt-top"
                                       clear
                                       placeholder={`请输入联系人邮箱`}
                                       onChange={(v) => this.handleInputChange(v, 'email')}
                                       value={email}>
                                联系人邮箱
                            </InputItem>
                            {/* 联系人地址 */}
                            <TextareaItem className="label-long extra-right ipt-top"
                                          clear
                                          title="联系人地址"
                                          autoHeight
                                          placeholder={`请输入联系人地址`}
                                          onChange={v => this.handleInputChange(v, 'address')}
                                          value={address}>
                                联系人地址
                            </TextareaItem>
                        </div>
                        {/*<Flex className="btn-main-long baocun" onClick={this.saveLinkManDetail.bind(this)}>保存</Flex>*/}
                    </List>
                }
                {/* 学员 */}
                {students.map((item, index) => (

                    currentTab === `student${index}` &&
                    <List key={index} className={`student-wrap`}>
                        {!item.disabled && <div className="disabled-model"></div>}
                        {/* 姓名 */}
                        <InputItem className="icon-xing extra-right"
                                   clear
                                   placeholder={`请输入姓名`}
                                   maxLength={10}
                                   value={item.studentName}
                                   onChange={v => this.handleInputChange(v, 'studentName', index)}>
                            姓名
                        </InputItem>
                        {/* 性别 */}
                        <Picker data={[ genders ].concat()}
                                title=""
                                cascade={false}
                                value={item.gender || ''}
                                extra="请选择性别"
                                onChange={v => this.handleInputChange(v, 'gender', index)}>
                            <List.Item arrow={item.disabled ? 'horizontal' : ''}
                                       className={!item.gender ? 'emptyPicker extra-right icon-xing' : 'extra-right icon-xing'}>
                                性别
                            </List.Item>
                        </Picker>

                        {/* 年级 */}
                        <Picker data={[ gradesList ]}
                                title=""
                                cascade={false}
                                value={item.gradeId}
                                extra="请选择年级"
                                onChange={v => this.handleInputChange(v, 'gradeId', index)}>
                            <List.Item arrow={item.disabled ? 'horizontal' : ''}
                                       className={!item.gradeId ? 'emptyPicker extra-right' : 'extra-right'}>
                                年级
                            </List.Item>
                        </Picker>

                        {/* 出生日期 */}
                        <DatePicker mode="date"
                                    extra="请选择日期"
                                    onChange={(v) => this.handlebirthDate(v, index)}
                                    value={item.birthday}
                                    minDate={minDate}>
                            <List.Item arrow={item.disabled ? 'horizontal' : ''}
                                       className={!item.birthday ? 'emptyPicker extra-right' : 'extra-right'}>出生日期</List.Item>
                        </DatePicker>

                        {/* 年龄 */}
                        <InputItem placeholder={`请输入年龄`}
                                   className={`extra-right`}
                                   clear
                                   value={item.age || ''}
                                   disabled={!item.birthday ? false : true}
                                   onChange={v => this.handleInputChange(v, 'age', index)}
                                   type="phone">
                            年龄
                        </InputItem>

                        {/* 课程 */}
                        <Picker data={[ courseList ]}
                                title=""
                                cascade={false}
                                value={item.courseIds[ 0 ] ? [ item.courseIds[ 0 ] ] : null}
                                extra="请选择课程"
                                onChange={v => this.handleCourse(v, index)}>
                            <List.Item arrow={item.disabled ? 'horizontal' : ''}
                                       className={!(item.courseIds[ 0 ] ? [ item.courseIds[ 0 ] ] : null) ? 'emptyPicker extra-right' : 'extra-right'}>
                                课程
                            </List.Item>
                        </Picker>

                        {/* 其他感兴趣的 */}
                        <div className="label-longer coursesCu" onClick={() => this.handleInterest(index)}>
                            <Item extra={coursesText(index)} arrow={item.disabled ? 'horizontal' : ''} className="label-long extra-right">
                                其他感兴趣的
                            </Item>
                        </div>

                        {/* 学校 */}
                        <InputItem clear
                                   placeholder={`请输入学校`}
                                   className={`extra-right`}
                                   value={item.school}
                                   onChange={v => this.handleInputChange(v, 'school', index)}>
                            学校
                        </InputItem>
                        {/* 与联系人关系 */}
                        <Picker data={relationshipType}
                                title=""
                                cascade={false}
                                value={item.relationshipType}
                                extra="请选择与联系人关系"
                                onChange={v => this.handleInputChange(v, 'relationshipType', index)}>
                            <List.Item className={!(item.relationshipType) ? 'emptyPicker label-long extra-right' : 'label-long extra-right'}
                                       arrow={item.disabled ? 'horizontal' : ''}>
                                与联系人关系
                            </List.Item>
                        </Picker>

                        {/* 学员介绍 */}
                        <TextareaItem className="client-introduce extra-right"
                                      title="学员介绍"
                                      clear
                                      placeholder="请输入学员介绍"
                                      autoHeight
                                      value={item.introduce}
                                      onChange={v => this.handleInputChange(v, 'introduce', index)} />
                    </List>
                ))}
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    state: state
})
const Detail = connect(
    mapStateToProps,
    action
)(DetailBase)


class clueDetail extends React.Component {

    constructor(props) {
        super(props)
        /**
         * @
         */
        const tabIsContract = sessionStorage.getItem('specialContract')
        sessionStorage.removeItem('specialContract')
        const curTabs = tabIsContract === '1' ? 'contract' : 'follow-up'
        if (props.state && tabIsContract === '1') {
            props.state.curTabs = curTabs
        }
        this.state = props.state ? props.state : {
            detailEditor: false,
            curTabs,
            fixed: false,
            leadId: props.match.params.id, //线索ID
            basicInfo: '', //基本信息
            followUpInfo: '',//跟进记录
            contactInfo: '',//联系人信息
            contractInfo: '',//合同信息

            detailBaseInfo: {},  // 详细资料内基本信息

            urls: [],

            linkmanDelStatus: false,

            bodyOffsetHeight: document.documentElement.offsetHeight,

            tabsCount: {
                leadHistoryCount: '', listenCount: '', contractCount: '', contactCount: ''
            }
        }
    }

    componentWillMount() {
        this.getBasciInfo();
        this.getFollowUp();
        this.setState({
            fixed: false
        })
    }

    componentDidMount() {
        setTimeout(() => {
            const { detailTab, curTabs } = this.state
            if (this.refs.detailScrollBox) {
                if (detailTab === 'baseInfo' && curTabs === 'detail') {
                    this.refs.detailScrollBox.style.height = this.state.bodyOffsetHeight + 'px'
                } else {
                    this.refs.detailScrollBox.style.height = this.state.bodyOffsetHeight - this.refs.detailBtns.offsetHeight + 'px'
                }
            }
        }, 0)
    }

    //获取基本信息
    getBasciInfo() {
        const { leadId } = this.state
        const param = {
            data: {
                leadId //暂时使用
            }
        }
        Http.ajax(`${URL}/lead/base-info`, param).then(res => {
            if (res.code === '0') {
                const { baseInfo, leadHistoryCount, listenCount, contractCount, contactCount } = res.data
                const tabsCount = { leadHistoryCount, listenCount, contractCount, contactCount }
                baseInfo.listenCount = listenCount
                this.setState(prev => {
                    prev.basicInfo = baseInfo
                    prev.leadHistoryId = baseInfo.leadHistoryId
                    prev.tabsCount = tabsCount
                })
            }
        })
    }

    //获取跟进记录
    getFollowUp() {
        const { leadId } = this.state
        const param = {
            data: {
                leadId
            }
        }
        Http.ajax(`${URL}/lead/list-histories`, param).then(res => {

            if (res.code === '0') {
                this.setState({
                    followUpInfo: res.data.histories,
                    appointmentId: res.data.appointmentId || 'empty'
                })
            }
        })
    }

    handleTabsChange(tabsKey) {
        sessionStorage.removeItem('specialContract')


        const { curTabs } = this.state
        if (curTabs != tabsKey) {
            this.setState({
                curTabs: tabsKey
            })
        }
        if (this.state.detailTab === 'baseInfo' && tabsKey === 'detail') {
            this.refs.detailScrollBox.style.height = this.state.bodyOffsetHeight + 'px'
        } else {
            this.refs.detailScrollBox.style.height = this.state.bodyOffsetHeight - this.refs.detailBtns.offsetHeight + 'px'
        }
    }

    handleScroll() {
        const { fixed } = this.state
        let selfST = this.refs.ClueDetail.scrollTop
        let tabBoxCT = this.refs.TabContainer.offsetTop

        if (selfST >= tabBoxCT) {
            if (fixed) return;
            this.setState({
                fixed: true
            })
        } else {
            if (!fixed) return;
            this.setState({
                fixed: false
            })
        }
    }

    //
    handleModal() {
        this.viewShowModal()
    }

    // tab改变
    onDetailTabChange(detailTab, stdBtnIsDelete) {

        if (this.refs.detailScrollBox) {
            if (detailTab === 'baseInfo' && this.state.curTabs === 'detail') {
                this.refs.detailScrollBox.style.height = this.state.bodyOffsetHeight + 'px'
            } else {
                this.refs.detailScrollBox.style.height = this.state.bodyOffsetHeight - this.refs.detailBtns.offsetHeight + 'px'
            }
        }

        this.setState({ detailTab, stdBtnIsDelete })
    }

    // 保存state到redux
    stateToRedux() {
        this.props.saveClueDetailState(this.state)
    }

    // editStudent
    editStudent(text) {
        this.stdBtnisDelete(
            this.state.detailTab.slice(this.state.detailTab.length - 1) >> 0,
            text
        )
    }

    // 添加跟进记录
    addFollowUp() {
        const leadHistoryId = this.state.leadHistoryId
        const { leadId } = this.state
        this.stateToRedux()
        switch (this.state.basicInfo.leadStatus) {
            case 'VISIT_LISTEN':
                this.props.history.push(`/followup/listen/${leadId}/${leadHistoryId}#${this.state.appointmentId}`)
                break
            case 'PERMISSION_VISIT':
                this.props.history.push(`/followup/visit/${leadId}/${leadHistoryId}#${this.state.appointmentId}`)
                break
            default :
                this.props.history.push(`/followup/recontact/${leadId}/${leadHistoryId}`)
        }
    }

    // 联系人详情-改变可编辑状态
    onInputEditor() {
        this.inputEditor()
    }

    // 改变联系人详情可编辑状态
    getLinkmanDisabled(disabled) {

        this.setState({
            detailEditor: disabled
        })
    }

    // 获取跟进记录urls
    getFollowUpUrls(urls) {
        this.setState({
            urls
        })
    }

    // 衔接查看大图
    onImagesShow() {
        this.onImageShow()
    }

    // 编辑联系人按钮操作
    onChangeLinkMan() {
        this.toggleBtnshow()
        /*this.setState({
            linkmanDelStatus: !this.state.linkmanDelStatus
        })*/
    }

    // 获取学员的可编辑状态 false/true
    getStudentDisabled(disabled) {
        this.setState({
            studentEditDisabled: disabled
        })
    }

    // 添加联系人成功时候-触发
    addLinkmanForSuccess(xx) {
        this.setState({
            linkmanDelStatus: xx
        })
    }

    // 跳转至合同详情
    contractLinkToDetail(item) {
        this.props.history.push(`/ContractDetail/${item.contractId}`)
    }

    /*跳转至特批合同*/
    linkToAddSpecial(v) {
        this.props.history.push(`/AddSpecial/${v}`);
    }

    // 添加特批合同   
    ApplySpecial() {
        const matchParams = this.props.match.params;
        this.props.history.push(`/ApplySpecial/${matchParams.id}`);
    }

    // 合同tab-添加合同按钮
    addContractPage() {
        const matchParams = this.props.match.params
        const leadHistoryId = this.state.leadHistoryId
        const { leadId } = this.state
        this.stateToRedux()

        switch (this.state.basicInfo.leadStatus) {
            case 'VISIT_LISTEN':
                this.props.history.push(`/followup/listen/${leadId}/${leadHistoryId}#${this.state.appointmentId}`)
                break
            case 'PERMISSION_VISIT':
                this.props.history.push(`/followup/visit/${leadId}/${leadHistoryId}#${this.state.appointmentId}`)
                break
            default :
                this.props.history.push(`/AudioSheet/${matchParams.id}`)
        }
    }

    // 试听单Tab-添加试听单
    addauditionPage() {
        this.stateToRedux()
        this.props.history.push(`/addAudition/${this.state.leadId}`)
    }

    // 试听单跳转至详情
    auditionLinkToDetail(item) {
        this.stateToRedux()
        this.props.history.push(`/listenDetail/${item.id}`)
    }

    // 分享
    share() {
        const { leadId } = this.state;
        this.props.history.push(`/share/${leadId}`);
    }

    render() {

        const leadHistoryId = this.state.leadHistoryId
        const { curTabs, fixed, basicInfo, followUpInfo, leadId, detailTab, detailEditor, stdBtnIsDelete, urls, studentEditDisabled } = this.state
        const { leadHistoryCount, contractCount, contactCount } = this.state.tabsCount
        const fixedCls = fixed ? 'fixed' : ''
        const { linkmanDelStatus } = this.state
        let listenCount = basicInfo.listenCount > 99 ? 99 : basicInfo.listenCount === 0 ? 0 : (basicInfo.listenCount || '　 　 　 　 ')

        const currentStudentIndex = detailTab && ((detailTab.slice(detailTab.length - 1) >> 0) + 1)
        return (
            <div id="ClueDetail" ref="ClueDetail" onScroll={this.handleScroll.bind(this)}>
                <div className="detail-scroll-box" ref='detailScrollBox'>
                    {/* 头部 */}
                    <header className="header">
                        {/* 基础信息 */}
                        <Flex className="title">
                            <div>
                                <span className="name">{basicInfo.name && basicInfo.name.length > 6 ? basicInfo.name.slice(0, 6) + '...' : basicInfo.name}</span>
                                <a href={`tel://${basicInfo.mobile}`} className="tel">{localMobile(basicInfo.mobile)}</a>
                            </div>
                            <div><span className={`r20`}>{basicInfo.genderDesc}</span>{basicInfo.age && <span>{basicInfo.age}岁</span> || ''}</div>
                            {/* <div><span className="num">95<span>%</span></span>签单率</div>*/}
                        </Flex>
                        <Flex className="other">
                            <Flex>
                                <label>课程</label>
                                <span>{basicInfo.courseName}</span>
                            </Flex>
                            <Flex>
                                <label>渠道</label>
                                <span>{basicInfo.source}</span>
                            </Flex>
                            {(basicInfo.students || []).map((list, index) => (
                                <Flex key={index}>
                                    <label>学员{index + 1}</label>
                                    <span>
                                        <span>{list.name.length > 8 ? list.name.slice(0, 8) + '...' : list.name}</span>
                                        {!!list.age && <span>{list.age + '岁'}</span>}
                                        <span>{list.genderDesc}</span>
                                        <span>{list.courseName}</span>
                                    </span>
                                    {/*  list.name.length>4?list.name.slice(0,4)+'...':  */}
                                </Flex>
                            ))}
                            <Flex>
                                <label>创建日期</label>
                                <span>{basicInfo.createTime ? new Date(basicInfo.createTime).Format('yyyy-MM-dd') : ''}</span>
                            </Flex>
                            {!!basicInfo.estimatedPrice && <Flex>
                                <label>可签金额</label>
                                <span>{basicInfo.estimatedPrice}</span>
                            </Flex>}

                        </Flex>
                        {basicInfo.note && <Flex className={`note`}>
                            <label>备注</label>
                            <pre>{basicInfo.note}</pre>
                        </Flex>}
                        <Button className="share" onClick={ () => this.share() }>分享</Button>
                    </header>

                    {/* 客户标签 */}
                    <div className={`client-label ${basicInfo.customerLabels && basicInfo.customerLabels.length > 0 ? '' : 'not-label'}`}>
                        <div className="title">客户标签</div>
                        {
                            basicInfo.customerLabels &&
                            <ul className="label-box">
                                {basicInfo.customerLabels.map((item, index) => (
                                    <li key={index} className={item.labelType}>{item.name}</li>
                                ))}
                            </ul>
                        }

                    </div>

                    <WhiteSpace size="md" />

                    {/* container */}
                    <div ref="TabContainer">
                        <Tabs pageSize={4}
                              defaultActiveKey={curTabs}
                              className={`container ${fixedCls}`}
                              swipeable={false}
                              onChange={this.handleTabsChange.bind(this)}>
                            {/*curTabs*/}
                            {/* 跟进记录 */}
                            <TabPane tab={`跟进记录(${leadHistoryCount > 99 ? 99 : leadHistoryCount})`} key="follow-up" className='follow-up'>
                                <FollowUp data={followUpInfo}
                                          getFollowUpUrls={this.getFollowUpUrls.bind(this)}
                                          ParentStateToRedux={this.stateToRedux.bind(this)}
                                          auditionLinkToDetail={(item) => this.auditionLinkToDetail(item)}
                                          onImagesShow={this.onImagesShow.bind(this)} />
                            </TabPane>

                            {/* 详细资料 */}
                            <TabPane tab={`详细资料`} key="detail" className="detail">
                                <Detail leadId={leadId}
                                        basicInfo={basicInfo}
                                        leadHistoryId={leadHistoryId}
                                        onTabChange={(tab, stdBtnisDelete) => this.onDetailTabChange(tab, stdBtnisDelete)}
                                        ParentStateToRedux={this.stateToRedux.bind(this)}
                                        studentBtnClick={fn => { this.stdBtnisDelete = fn }}
                                        getStudentDisabled={(disabled) => this.getStudentDisabled(disabled)}
                                        getLinkmanDisabled={disabled => this.getLinkmanDisabled(disabled)}
                                        getBaseInfo={() => this.getBasciInfo()}
                                        inputEditor={fn => { this.inputEditor = fn}} />
                            </TabPane>

                            {/* 紧急联系人 */}
                            <TabPane tab={`紧急联系人(${contactCount > 99 ? 99 : contactCount})`} key="link-man" className="link-man">
                                <LinkMan leadId={leadId}
                                         addLinkmanForSuccess={(x) => this.addLinkmanForSuccess(x)}
                                         getBaseInfo={() => this.getBasciInfo()}
                                         viewShowModal={fn => { this.viewShowModal = fn }}
                                         toggleBtnshow={fn => { this.toggleBtnshow = fn }} />
                            </TabPane>

                            {/* 合同 */}
                            <TabPane tab={`合同(${contractCount > 99 ? 99 : contractCount})`} key="contract" className="contract">
                                <Contract leadId={leadId}
                                          ParentStateToRedux={this.stateToRedux.bind(this)}
                                          linkToAddSpecial={(v) => this.linkToAddSpecial(v)}
                                          contractLinkToDetail={(item) => this.contractLinkToDetail(item)} />
                            </TabPane>
                            {/* 试听单 */}
                            <TabPane tab={`试听单(${listenCount})`} key="audition" className="audition">
                                <AuditionList leadId={leadId}
                                              auditionLinkToDetail={(item) => this.auditionLinkToDetail(item)}
                                              ParentStateToRedux={this.stateToRedux.bind(this)} />

                            </TabPane>
                        </Tabs>
                    </div>

                    <CarouselCustomxxxx data={urls} onShow={fn => { this.onImageShow = fn }} />
                    <div id='soft-mask' style={{ 'height': '200px', display: 'none' }}></div>
                </div>
                <div className="btn" ref='detailBtns'>
                    {/* 添加跟进记录按钮 */}
                    {
                        curTabs === 'follow-up' &&
                        <Flex onClick={() => this.addFollowUp()}><Button className="btn-main-long lm-btn">添加跟进记录</Button></Flex>
                    }
                    {/* 详细资料  ClueModify */}
                    {
                        curTabs === 'detail' && detailTab === 'info' &&
                        <Button className="btn-main-long lm-btn" onClick={this.onInputEditor.bind(this)}>{!detailEditor ? '编辑联系人信息' : '保存'}</Button>
                    }
                    {/* 学员 */}
                    {
                        curTabs === 'detail' && detailTab && detailTab.indexOf('student') > -1 &&
                        <Flex className="link-man-btn">
                            {/*{stdBtnIsDelete?'删除学员':'保存学员'}*/}
                            <Button className={`btn-main-long baocun ${!stdBtnIsDelete ? 'disabled' : ''}`}
                                    onClick={this.editStudent.bind(this, `${!stdBtnIsDelete ? '' : '删除学员'}`)}>删除学员</Button>
                            <Button className="btn-main-long baocun"
                                    onClick={this.editStudent.bind(this, '保存学员')}>{studentEditDisabled ? '保存' : `编辑学员${currentStudentIndex}号`}</Button>
                        </Flex>
                    }
                    {/* onClick={() => this.editStudentFetch(index)} */}
                    {/* 联系人按钮 */}
                    {
                        curTabs === 'link-man' &&
                        <Flex className="link-man-btn">
                            <Button className='btn-main-short baocun'
                                    onClick={this.onChangeLinkMan.bind(this)}>{linkmanDelStatus ? '保存联系人' : '编辑联系人'}</Button>
                            <Button className='btn-main-short baocun' onClick={this.handleModal.bind(this)}>添加联系人</Button>
                        </Flex>
                    }
                    {/* 合同 */}
                    {
                        curTabs === 'contract' &&
                        /*<Flex onClick={this.addContractPage.bind(this)}><Button className="btn-main-long lm-btn" >添加合同</Button></Flex>*/
                        <Flex className="link-man-btn">
                            <Button className='btn-main-short baocun' onClick={this.ApplySpecial.bind(this)}>申请特批</Button>
                            <Button className='btn-main-short baocun' onClick={this.addContractPage.bind(this)}>添加合同</Button>
                        </Flex>
                    }
                    {/* 试听单 */}
                    {
                        curTabs === 'audition' &&
                        <Flex onClick={this.addauditionPage.bind(this)}><Button className="btn-main-long lm-btn">添加试听单</Button></Flex>
                    }
                </div>
            </div>
        )
    }
}

const StateTodetailProps = (state) => ({
    state: state.detailPageState
})

const clueDetailConnect = connect(StateTodetailProps, action)(clueDetail)
export default clueDetailConnect;