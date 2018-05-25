import {Tabs, Flex, List, InputItem, DatePicker, Picker, TextareaItem, Toast, Modal, Popup} from 'antd-mobile'
import * as action from '../../../redux/action/action'
import './resultContainer.less'
import InterestLabel from '../addLabel/interestLabel'
import moment from 'moment'

const {alert} = Modal
const Http = Base
const localMobile = Http.mobile
const {api:URL} = Http.url
const {Link} = ReactRouterDOM
const {connect} = ReactRedux
const {Item} = List
const studentTypeArr = [
    [
        {
            label: '儿童学员',
            value: false,
        },
        {
            label: '成人学员',
            value: true,
        },
    ]
];
const genders = [
    {value : 'MALE', label : '男'},
    {value : 'FEMALE' , label : '女'}
]
const relationshipType = [[
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
]]
let maskProps;
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
if (isIPhone) {
    maskProps = {
        onTouchStart: e => e.preventDefault(),
    };
}
const minDate = moment(`${new Date(1900,0).Format('yyyy-MM-dd')} +0800`, 'YYYY-MM-DD Z').utcOffset(8);

class ResultContainer extends React.Component {

    constructor(props) {
        super(props)

        const {from} = props

        this.state = props.state.supplement ? props.state.supplement : {
            scrollBoxHeight: 0,


            avaSources: [],
            currentTab: 'info',
            sourceName: '',
            courseList: [], // 课程列表
            gradesList: [], // 年级列表
            storeName: '',
            mainCourse: '',         // 默认课程
            interests: '',          // 感兴趣的-中文
            params: {
                address: '',            // 联系人地址
                adult: [],              // 是否成人学员
                sourceId: [],           // 渠道来源
                age: '',                // 年龄
                birthday: '',           // 生日
                courseIds: [],          // 课程lists
                note: '',  // 备注
                customerType: [''],       // 客户类型
                email: '',              // 邮箱
                estimatedPrice: '',     // 预估金额
                gender: '',             // 性别
                mobile: '',             // 手机号
                name: '',               // 姓名
                otherTrainingCourse: '',           // 其他培训课程
                leadId: from?props.leadId:props.match.params.id,     // 线索ID
                disabled:false,
                linkManVisib: false,
                customerLabels: []
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
                    disabled:false,
                    gender: ''
                }
            ],

            labelIds: [],
            customerTypePicker : [[
                {
                    label: '普通客户',
                    value: 'COMMON'
                },{
                    label: '重要客户',
                    value: 'IMPORTANT'
                },{
                    label: '暂不分类',
                    value: ''
                }
            ]]

        }

    }

    componentWillMount() {

        const {from} = this.props
        const leadId = from?this.props.leadId:this.props.match.params.id

        this.getGradesFetch()       // 年级
        this.getChiCoursesFetch()   //课程

        if (!this.props.state.supplement) {
            this.getStoreFetch()
            this.getavaSourcesFetch()
        }

        if (this.props.state.labels && this.props.state.labels.id===leadId) {
            this.getLabelsFetch()       // 标签
        }
    }

    // 获取课程
    getChiCoursesFetch() {
        const params = {
            method: 'post'
        }
        Http.ajax(`${URL}/selections/chinese-courses`,params).then(res => {
            if(res.code==0){
                const courseList = res.data.courses.map(({id:value,text:label}) => ({label,value}))
                this.setState({
                    courseList
                })

            }
        })
    }

    // 获取分馆数据
    getStoreFetch() {
        const params = {}

        Http.ajax(`${URL}/lead/current-store`, params).then((res) => {
            if(res.code == 0){
                const {storeName} = res.data
                this.setState({
                    storeName
                })

            }
        })
    }

    // 获取年级
    getGradesFetch() {
        const params = {
            method: 'POST'
        }

        Http.ajax(`${URL}/selections/grades`,params).then(res => {
            if(res.code == 0){
                const gradesList = res.data.grades.map(({id:value,text:label}) => ({label,value}))

                this.setState({gradesList})

            }
        })
    }

    // 获取线索信息
    getLeadDetailFetch() {
        const leadId = this.props.from?this.props.leadId:this.props.match.params.id>>0
        const params = {data: {leadId}}

        Http.ajax(`${URL}/lead/detail`,params).then(res => {
            if(res.code==0){
                if (res.data.detailInfo.students.length <= 0) {
                    // this.postSaveStudentFetch() // 保存学员
                } else {
                    const students = res.data.detailInfo.students.concat()
                    students.forEach(list => {
                        list.btnIsDelete = true
                        list.linkManVisib = false
                        list.gradeId = list.gradeId?[list.gradeId]:''
                        list.birthday = list.birthday?moment(`${new Date(list.birthday).Format('yyyy-MM-dd')} +0800`, 'YYYY-MM-DD Z').utcOffset(8):''
                        list.relationshipType = list.relationshipType ? [list.relationshipType] : null
                        list.gender = list.gender? [genders.filter(item => item.value===list.gender)[0].value] : ''
                    })
                    this.setState({
                        students
                    })
                }

                const {gender,sourceId,address,adult,age,birthday,mobile,name,courses,customerType,customerLabels,email,note,estimatedPrice, otherTrainingCourse} = res.data.detailInfo


                const params = {
                    address,
                    adult: [adult],
                    gender: [gender],
                    age,
                    sourceId: [sourceId],
                    birthday: birthday?moment(`${new Date(birthday).Format('yyyy-MM-dd')} +0800`, 'YYYY-MM-DD Z').utcOffset(8):'',
                    courseIds: courses.map(({courseId}) => courseId),
                    note: note,
                    customerType: customerType ? [customerType] : [''],
                    email,
                    estimatedPrice: estimatedPrice || '',
                    mobile: mobile.replace(/\s/g, '').replace(/(^\d{3}|\d{4}\B)/g,"$1 "),
                    name,
                    customerLabels,
                    otherTrainingCourse,
                    leadId: this.props.from?this.props.leadId:this.props.match.params.id,

                    linkManVisib: false
                }

                this.setState({
                    params
                })
            }
        })
    }

    // 初始保存一个学员
    postSaveStudentFetch() {

        return;
        const {studentName} = this.props.state
        const params = {
            method: 'POST',
            data: {
                leadId: this.props.from?this.props.leadId:this.props.match.params.id,
                studentName,
                relationshipType: 'QITA'
            }
        }

        // Http.ajax(`${URL}/lead/save-student`,params).then(res => {
        // })

    }

    // 修改学员-删除学员
    // editStudentFetch(index) {
    //     const {saveStudent} = this.refs
    //     const students = this.state.students.concat()
    //     const student = Object.assign({},students[index])
    //     const {studentId} = student
    //
    //     if (saveStudent.props.children === '保存学员') {
    //         if (student.studentName === '') {
    //             Toast.info(`请录入学员姓名!`, 2, null, false)
    //             return;
    //         }
    //         // 修改学员
    //         if (studentId) {
    //             const params = {method:'POST',data:student}
    //             params.data.gradeId = params.data.gradeId[0] || ''
    //             params.data.relationshipType = params.data.relationshipType[0]
    //             params.data.birthday = params.data.birthday&&params.data.birthday.format('YYYY-MM-DD')
    //             params.data.gender = params.data.gender&&params.data.gender[0] || null
    //             Http.ajax(`${URL}/students/edit`,params).then(res => {
    //                 if(res.code==0){
    //                     Toast.info('保存成功',1,null,false)
    //                     this.btnIsConfirm(index,true)
    //                     // 如果只有一个带有studentId学员
    //                     this.setState(prev => {
    //                         const relaStudents = prev.students.filter(list => !!list.studentId)
    //                         const realStudentLength = relaStudents.length
    //                         if (realStudentLength === 1) {
    //                             relaStudents[0].btnIsDelete = false
    //                         }
    //                         return prev.students
    //                     })
    //                 }
    //
    //
    //             })
    //         }
    //         // 保存学员
    //         else {
    //             const params = {method: 'POST', data: student}
    //             params.data.leadId = this.props.from?this.props.leadId:this.props.match.params.id>>0
    //             params.data.gradeId = params.data.gradeId[0] || ''
    //             params.data.relationshipType = params.data.relationshipType[0]
    //             params.data.birthday = params.data.birthday === '' ? '' :new Date(params.data.birthday).Format('yyyy-MM-dd')
    //             Http.ajax(`${URL}/lead/save-student`,params).then(res => {
    //                 if(res.code==0){
    //                   Toast.info('保存成功',1,null,false)
    //                     this.btnIsConfirm(index,true)
    //                     this.setState(prev => {
    //                         prev.students[index].studentId = res.data.studentId
    //                         return prev.students
    //                     })
    //                 }
    //
    //             })
    //         }
    //
    //     } else if (saveStudent.props.children === '删除学员') {
    //         // 删除学员
    //         const delStudent = () => {
    //             students.splice(index,1)
    //             this.setState({
    //                 students,
    //                 currentTab: `student${students.length-1}`
    //             })
    //         }
    //         if (studentId) {
    //             const params = {data: {studentId}}
    //             Http.ajax(`${URL}/students/delete`,params).then(res => {
    //                 if(res.code==0){
    //                     Toast.info('删除成功',1,null,false)
    //                     delStudent()
    //
    //                 }
    //             })
    //         } else {
    //             delStudent()
    //         }
    //     }
    // }

    // 删除学员按钮
    delStudentItem(index) {
        // item.btnIsDelete&&students.length>1)
        const students = this.state.students.concat()
        const student = Object.assign({},students[index])
        if (!(student.btnIsDelete && students.length>1)) return;

        const {studentId} = student
        const delStudent = () => {
            students.splice(index,1)
            this.setState({
                students,
                currentTab: `student${students.length-1}`
            }, () => {
                Toast.info(`已删除${student.studentName?' 学员':''}${student.studentName}`, 2, null, false)
            })
        }
        if (studentId) {
            const params = {data: {studentId}}
            Http.ajax(`${URL}/students/delete`,params).then(res => {
                if(res.code==0){
                    Toast.info('删除成功',1,null,false)
                    delStudent()
                }
            })
        } else {
            delStudent()
        }
    }

    customerTypeSpect(){
        const { customerTypePicker } = this.state
        customerTypePicker[0][2].label ='暂不分类'
        this.setState({
            customerTypePicker
        })
    }

    customerTypeSpectmiss(){
        const { customerTypePicker } = this.state
        customerTypePicker[0][2].label = ''
        this.setState({
            customerTypePicker
        })
    }

    // 保存输入
    handleInputChange(value,state,index) {

        if (state === 'age' || state === 'estimatedPrice') {
            value = value.replace(/\s/g, '')
        }

        const { customerTypePicker } = this.state;
        if (index === undefined) {
            if(state == 'customerType' && value[0] == ''){
                customerTypePicker[0][2].label = ''
            }
            this.setState(prev => {
                prev.params[state] = value
                prev.customerTypePicker = customerTypePicker
                return prev.params
            })
        } else {
            this.setState(prevState => {
                prevState.students[index][state] = value
                return prevState.students
            })
            this.btnIsConfirm(index)
        }
    }

    /* 切换tab */
    handleTab(currentTab) {
        this.setState({
            currentTab
        })
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
                const {courseIds} = prev.params
                const [first] = mainCourse
                if (courseIds.indexOf(first) < 0)
                    courseIds.splice(0,1,first)
                else
                    courseIds.unshift(courseIds.splice(courseIds.indexOf(first),1)[0])
            })
        } else {
            this.setState(prev => {
                const {courseIds} = prev.students[index]
                const [first] = mainCourse
                if (courseIds.indexOf(first) < 0)
                    courseIds.splice(0,1,first)
                else
                    courseIds.unshift(courseIds.splice(courseIds.indexOf(first),1)[0])
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
            value = this.state.students[index].courseIds.concat()

        Popup.show(<InterestLabel visible={true}
                                  data={this.state.courseList.concat()}
                                  value={value}
                                  onConfirm={v => this.cancelSource(v, index)}
                                  onClose={v => this.cancelSource(v, index)} />,
            {
                animationType: 'slide-up',
                maskProps,
            }
        )

        if (index === undefined)
            this.setState(prev => {
                prev.params.linkManVisib = true
                return prev.params
            })
        else {
            this.setState(prev => {
                prev.students[index].linkManVisib = true
                return prev.params
            })
            this.btnIsConfirm(index)
        }
    }

    // 获取兴趣标签
    getLabelsFetch() {
        const params = {}
        Http.ajax(`${URL}/labels`,params).then(res => {
            if(res.code==0){
                const {ECONOMIC_POWER,FAMILY_BACKGROUND,OTHER,STUDY_SITUATION} = res.data.labels
                const {econoLabels,familyLabels,otherLabels,studyLabels} = this.props.state.labels
                const allLabel = [...ECONOMIC_POWER,...FAMILY_BACKGROUND,...OTHER,...STUDY_SITUATION]
                const selLabel = [...econoLabels,...familyLabels,...otherLabels,...studyLabels]
                const customerLabels = selLabel.map(item => allLabel.filter(list => item === list.id)[0])


                this.setState({
                    labelIds: selLabel
                })
                this.setState(prev => {
                    prev.params.customerLabels = customerLabels
                    return prev.params
                })

            }
        })
    }

    /* 出生日期 */
    handlebirthDate(birth,index) {
        if (birth.format && birth.format('YYYY-MM-DD') > new Date().Format('yyyy-MM-dd')) {
            alert(`提示`, `请选择有效出生日期`)
            return false;
        }

        const ny = new Date().getYear(),
              nm = new Date().Format('MMdd'),
              my = new Date(birth).getYear(),
              mm = new Date(birth).Format('MMdd')

        const age = ny-my+(mm>nm?-1:0)
        if (index === undefined) {
            this.setState((prev) => {
                prev.params.birthday = birth
                prev.params.age = age
                prev.params.disabled = true
                return prev.params
            })
        } else {
            this.setState(prevState => {
                prevState.students[index]['birthday'] = birth
                prevState.students[index]['age'] = age
                prevState.students[index]['disabled'] = true
                return prevState.students
            })
            this.btnIsConfirm(index)
        }
    }

    cancelSource(v,index) {
        Popup.hide()
        this.setState(prev => {
            if (index === undefined) {
                prev.params.linkManVisib = false
                if (v !== undefined)
                    prev.params.courseIds = v
            } else {
                prev.students[index].linkManVisib = false
                if (v !== undefined)
                    prev.students[index].courseIds = v
            }

            return prev.params
        })
    }

    // 跳转至标签
    linkToClientLabel() {
        const {customerLabels} = this.state.params
        const filterLabel = (type) => (customerLabels.filter(list => list.labelType===type).map(list => list.id))
        const familyLabels = filterLabel('FAMILY_BACKGROUND'),
            econoLabels = filterLabel('ECONOMIC_POWER'),
            studyLabels = filterLabel('STUDY_SITUATION'),
            otherLabels = filterLabel('OTHER'),
            id = this.props.from?this.props.leadId:this.props.match.params.id
        this.props.history.push(`/client-label/addClueResult/${id}`)
        this.props.saveLeadSupplement(this.state)
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
        // if (this.state.students[index].btnIsDelete!==bool) {
        //     this.setState(prev => {
        //         prev.students[index].btnIsDelete = !!bool
        //         return prev.students
        //     })
        // }
    }

    // 添加学员按钮
    handleAddStudent() {
        const {students} = this.state
        if (students.length >= 5) {
            Toast.info(`添加学员已达上限~`,1,null,false)
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
                disabled:false
            }
            prev.students.push(data)
            return prev.students
        }, () => {
            const relaStudents = this.state.students.filter(list => !!list.studentId)
            const realStudentLength = relaStudents.length
            if (realStudentLength === 1) {
                relaStudents[0].btnIsDelete = false
            }
            this.setState({
                currentTab: `student${this.state.students.length-1}`
            })
        })
    }

    // 保存联系人
    saveLinkManDetail() {
        const stateParams = Object.assign({}, this.state.params)
        const stateStudents = [...this.state.students.concat()].map(item => Object.assign({}, item))
        const studentsNames = stateStudents.map(list => list.studentName)

        // 检测学员姓名是否录入
        let studentIsPass = ''
        // 学员性别是否录入
        let studentGender = ''
        stateStudents.forEach((item, index) => {
            if (!item.studentName && !studentIsPass) {
                studentIsPass = `学员${index+1}`
            }
            if (!item.gender && !studentGender) {
                studentGender = `学员${index+1}`
            }
        })
        if (!stateParams.name) {
            Toast.info(`请录入联系人姓名`, 1.5, null, false); return
        } else if (!stateParams.gender) {
            Toast.info(`请录入性别`, 1.5, null, false); return
        } else if (!stateParams.mobile) {
            Toast.info(`请录入联系人手机号`, 1.5, null, false); return
        } else if (!stateParams.courseIds.length) {
            Toast.info(`请录入课程`, 1.5, null, false); return
        } else if (!stateParams.gender) {
            Toast.info(`请录入联系人性别`, 1.5, null, false); return
        } else if (studentIsPass) {
            Toast.info(`请录入${studentIsPass}姓名`, 1.5, null, false); return
        } else if (studentGender) {
            Toast.info(`请录入${studentGender}性别`, 1.5, null, false); return
        }
        if (!( /^1\d{10}$/.test(stateParams.mobile.replace(/\s/g, '')) ) ) {
            Toast.info(`联系人手机号格式有误`, 1.5, null, false); return
        }
        let hasRepeat = false
        studentsNames.forEach((item, index) => {
            const customNames = studentsNames.concat()
            customNames.splice(index, 1)
            if (customNames.includes(item)) {
                hasRepeat = true
                Toast.info(`学员 ${item} 重复，请检查`, 1.5, null, false)
                return
            }
        })

        if (hasRepeat) return;

        stateParams.leadId = stateParams.leadId >> 0
        stateParams.adult = stateParams.adult[0]
        stateParams.customerType = stateParams.customerType[0] || null
        stateParams.birthday = stateParams.birthday?new Date(stateParams.birthday).Format('yyyy-MM-dd'):null
        stateParams.mobile = stateParams.mobile.replace(/\s/g,'')
        stateParams.age = stateParams.age>>0 || null
        stateParams.gender = stateParams.gender&&stateParams.gender[0] || null
        stateParams.sourceId = stateParams.sourceId&&stateParams.sourceId[0] || null

        stateStudents.forEach(item => {
            item.gradeId = item.gradeId[0] || ''
            item.relationshipType = item.relationshipType&&item.relationshipType[0] || null
            item.birthday = item.birthday&& item.birthday.format &&item.birthday.format('YYYY-MM-DD') || null
            item.gender = item.gender&&item.gender[0] || null
            item.age = item.age>>0 || null
        })


        let params = { method: 'post', data:{} }
        params.data = Object.assign({}, stateParams)
        params.data.students = stateStudents.slice()

        Http.ajax(`${URL}/lead/supplement-all`,params).then(res => {
            if(res.code == 0 ){
                this.getSaveLabelToLeadFetch()
                Toast.info('保存成功',1,null,false)
                this.props.history.push(localStorage.getItem('formRouter') || '/clueList')
            }
        })
    }

    // 保存联系人时候保存标签
    getSaveLabelToLeadFetch() {
        const params = {
            data: {
                leadId: this.props.from?this.props.leadId:this.props.match.params.id>>0,
                labelId: this.state.labelIds
            }
        }
        Http.ajax(`${URL}/lead/save-label`,params).then(res => {
             if(res.code == 0 ){
                Toast.info(`保存成功`,1,null,false)
             }
        })
    }

    // 获取渠道来源
    getavaSourcesFetch() {
        const params = { method:'POST', data:{} }
        Http.ajax(`${URL}/selections/avaliable-sources`, params).then(res => {
            if (res.code === '0') {
                const avaSources = res.data.sources.map(({id:value,text:label}) => ({label, value}))
                this.setState({
                    avaSources
                }, this.getLeadDetailFetch)
            }
        })
    }

    componentDidMount() {
        setTimeout(() => {
            const totalHei = document.documentElement.offsetHeight,
                headHei =   this.refs.ClueResultHead.offsetHeight,
                footHei = this.refs.ClueResultFoot.offsetHeight
            this.setState({
                scrollBoxHeight: totalHei - headHei - footHei
            })
        }, 0)

    }
    // componentWillUnmount() {
    //     window.removeEventListener('resize', this.onWindowResize.bind(this))
    // }


    // 唤起输入键盘时auto滚动区域的高度
    pageOnFocus() {

    }

    render() {
        const {avaSources,params, currentTab, students, storeName,courseList,gradesList,sourceName,customerTypePicker, scrollBoxHeight} = this.state
        const {gender,name,mobile,birthday,age,adult,otherTrainingCourse,customerType,estimatedPrice,note,customerLabels,disabled,address,email,sourceId} = params
        const tabBoxStyle = {
            width: `${4.38+students.length*1.6}rem`
        }
        // 其他感兴趣的-文字
        const coursesText = (index) => {
            let DATA = []

            if (index===undefined) {
                DATA = params
            } else {
                DATA = students[index]
            }

            return DATA.courseIds.map(ids => {

                const texts = courseList.map(({label,value}) => {
                    if (ids === value) return label;
                })


                const doms = texts.filter(list => list !== undefined).map(list => (
                        <span className="interest">{list}</span>
                    ))
                return doms
            })
        }
        // 客户标签
        const labelsText = () => (customerLabels.map(({labelType,name},index) => <span key={index} className={`label ${labelType}`}>{name}</span>))

        return (
            <div id="resultContainer" className="result-home" >

                <div className="scrollBox" ref={`ClueResultHead`} >
                    <div className="tab-box" style={tabBoxStyle}>
                        <div className={`tab info ${currentTab==='info'?'active':''}`} onClick={() => this.handleTab('info')}>联系人</div>
                        {
                            students.map((item,index) => {
                                const isActive = `student${index}`
                                return (
                                    <div className={`tab student ${currentTab===isActive?'active':''}`}
                                         key={index}
                                         onClick={() => this.handleTab(isActive)} >

                                        学员{index+1}
                                    </div>
                                )
                            })
                        }
                        <div className="tab add" onClick={this.handleAddStudent.bind(this)}>+ 添加学员</div>
                    </div>
                </div>
                <div className="content" ref={`ClueResultContent`} style={{height: scrollBoxHeight}}>
                    {
                        currentTab === 'info' &&
                        <List>
                            <div className='regio'>
                                {/* 分馆 */}
                                <Item extra={storeName} className={`extra-right`} >
                                    分馆
                                </Item>
                            </div>
                            <div className='regio'>
                                {/* 姓名 */}
                                <InputItem className="icon-xing extra-right"
                                           clear
                                           maxLength={10}
                                           placeholder={`请输入姓名`}
                                           value={name}
                                           onChange={(v) => this.handleName(v)} >
                                    姓名
                                </InputItem>
                                {/* 性别 */}
                                <Picker data={[genders].concat()}
                                        title=""
                                        cascade={false}
                                        value={gender || ''}
                                        extra="请选择性别"
                                        onChange={v => this.handleInputChange(v,'gender')}>
                                    <List.Item arrow={`${true?'horizontal':''}`}
                                               className={!gender?'emptyPicker extra-right icon-xing':'extra-right icon-xing'}>
                                        性别
                                    </List.Item>
                                </Picker>
                                {/* 手机号 */}
                                <InputItem className="icon-xing extra-right"
                                           clear
                                           type="phone"
                                           onChange={(v) => this.handleTel(v)}
                                           placeholder={`请输入手机号`}
                                           value={mobile.replace(/\s/g, '-')} >
                                    手机号
                                </InputItem>
                                {/* 学员类别 */}
                                <Picker data={[].concat(studentTypeArr)}
                                        title=""
                                        cascade={false}
                                        value={adult}
                                        extra="请选择学员类别"
                                        onChange={v => this.handleInputChange(v,'adult')}>
                                    <List.Item className={'extra-right ' + (adult[0] === ''?'emptyPicker icon-xing':'icon-xing')}
                                               arrow="horizontal">
                                        学员类别
                                    </List.Item>
                                </Picker>
                                {/* 渠道来源 */}
                                <Picker data={[avaSources]}
                                        title=""
                                        cascade={false}
                                        value={sourceId}
                                        extra="请选择渠道来源"
                                        onChange={v => this.handleInputChange(v,'sourceId')}>
                                    <List.Item className={'extra-right ' + (sourceId[0] === ''?'emptyPicker icon-xing':'icon-xing')}
                                               arrow="horizontal">
                                        渠道来源
                                    </List.Item>
                                </Picker>
                                {/* 课程 */}
                                <Picker data={[courseList]}
                                        title=""
                                        cascade={false}
                                        value={params.courseIds[0]?[params.courseIds[0]]:null}
                                        extra="请选择课程"
                                        onChange={(v) => this.handleCourse(v)}>
                                    <List.Item arrow="horizontal" className={(!(params.courseIds[0]?[params.courseIds[0]]:null)?'emptyPicker icon-xing':' icon-xing') + ' extra-right'}>
                                        课程
                                    </List.Item>
                                </Picker>

                                {/* 其他感兴趣的 */}
                                <div className="label-longer coursesCu" onClick={() => this.handleInterest()}>
                                    <Item extra={coursesText()} arrow="horizontal" className="label-long extra-right" >
                                        其他感兴趣的
                                    </Item>
                                </div>
                            </div>
                            <div className='regio'>
                                {/* 出生日期 */}
                                <DatePicker mode="date"
                                            extra="请选择日期"
                                            onChange={v => this.handlebirthDate(v)}
                                            value={birthday}
                                            minDate={minDate}
                                >
                                    <List.Item arrow="horizontal" className={(!birthday?'emptyPicker':'' ) + ' extra-right'}>出生日期</List.Item>
                                </DatePicker>
                                {/* 年龄 */}
                                <InputItem placeholder={!this.state.params.birthday?`请输入年龄`:``}
                                           clear
                                           value={age||''}
                                           maxLength={4}
                                           onChange={v => this.handleInputChange(v,'age')}
                                           type="phone"
                                           className={`extra-right`}
                                           disabled={!!this.state.params.birthday} >
                                    年龄
                                </InputItem>
                                {/* 其他培训课程 */}
                                <TextareaItem className="label-long extra-right"
                                              title="其他培训课程"
                                              placeholder="请输入其他培训课程"
                                              clear
                                              value={otherTrainingCourse}
                                              onChange={v => this.handleInputChange(v,'otherTrainingCourse')}
                                              autoHeight
                                />
                                {/* 可签金额 */}
                                <InputItem placeholder={`请输入可签金额`}
                                           value={estimatedPrice}
                                           type="phone"
                                           className={`extra-right`}
                                           maxLength={7}
                                           onChange={v => this.handleInputChange(v,'estimatedPrice')}
                                           clear >
                                    可签金额
                                </InputItem>
                                {/* 客户类型 */}
                                <Picker data={customerTypePicker}
                                        title=""
                                        onChange={v => this.handleInputChange(v,'customerType')}
                                        onDismiss={ ()=>this.customerTypeSpectmiss() }
                                        value={customerType}
                                        extra=""
                                        cascade={false}
                                         >
                                    <List.Item arrow="horizontal" className={(!customerType?'emptyPicker':'') + ' extra-right'} onClick={ this.customerTypeSpect.bind(this)}>
                                        客户类型
                                    </List.Item>
                                </Picker>
                                {/* 客户标签 */}
                                <div onClick={this.linkToClientLabel.bind(this)} className="clientLabels-box">
                                    <Item extra={labelsText()} arrow="horizontal" className={`extra-right`} >客户标签</Item>
                                </div>
                                {/* 备注 */}
                                <TextareaItem className="client-introduce extra-right"
                                              title="备注"
                                              placeholder="请输入备注"
                                              value={note}
                                              onChange={v => this.handleInputChange(v,'note')}
                                              autoHeight
                                />
                            </div>
                            <div className="regio label-longer">
                                {/* 联系人邮箱 */}
                                <InputItem className="label-long extra-right"
                                           clear
                                           placeholder={`请输入联系人邮箱`}
                                           onChange={v => this.handleInputChange(v,'email')}
                                           value={email} >
                                    联系人邮箱
                                </InputItem>
                                {/* 联系人地址 */}
                                <TextareaItem className="label-long extra-right"
                                              clear
                                              title="联系人地址"
                                              autoHeight
                                              placeholder={`请输入联系人地址`}
                                              onChange={v => this.handleInputChange(v,'address')}
                                              onFocus={() => this.pageOnFocus.bind(this)}
                                              value={address} >

                                </TextareaItem>
                            </div>
                            {/*<Flex className="btn-main-long baocun" onClick={this.saveLinkManDetail.bind(this)}>保存</Flex>*/}
                            {/*<InterestLabel visible={linkManVisib}
                                           data={courseList}
                                           value={this.state.params.courseIds}
                                           onConfirm={v => this.cancelSource(v)}
                                           onClose={v => this.cancelSource(v)} />*/}
                        </List>
                    }

                    {students.map((item, index) => (

                        currentTab === `student${index}` &&
                        <List key={index} >
                            {/* 姓名 */}
                            <InputItem className="icon-xing extra-right"
                                       clear
                                       placeholder={`请输入姓名`}
                                       maxLength={10}
                                       value={item.studentName}
                                       onChange={v => this.handleInputChange(v,'studentName',index)} >
                                姓名
                            </InputItem>

                            {/* 性别 */}
                            <Picker data={[genders]}
                                    title=""
                                    cascade={false}
                                    value={item.gender || ''}
                                    extra="请选择性别"
                                    onChange={v => this.handleInputChange(v,'gender', index)}>
                                <List.Item arrow="horizontal" className={(!(item.gender)?'emptyPicker':'') + ' extra-right icon-xing'}>
                                    性别
                                </List.Item>
                            </Picker>

                            {/* 年级 */}
                            <Picker data={[gradesList]}
                                    title=""
                                    cascade={false}
                                    value={item.gradeId}
                                    extra="请选择年级"
                                    onChange={v => this.handleInputChange(v,'gradeId',index)}>
                                <List.Item arrow="horizontal" className={(!(item.gradeId)?'emptyPicker':'') + ' extra-right'}>
                                    年级
                                </List.Item>
                            </Picker>

                            {/* 出生日期 */}
                            <DatePicker mode="date"
                                        extra="请选择日期"
                                        onChange={(v) => this.handlebirthDate(v,index)}
                                        value={item.birthday}
                                        minDate={minDate}
                            >
                                <List.Item arrow="horizontal" className={(!(item.birthday)?'emptyPicker':'') + ' extra-right'}>出生日期</List.Item>
                            </DatePicker>

                            {/* 年龄 */}
                            <InputItem placeholder={!item.birthday?`请输入年龄`:``}
                                       clear
                                       maxLength={4}
                                       className={`extra-right`}
                                       value={item.age||''}
                                       onChange={v => this.handleInputChange(v,'age',index)}
                                       type="phone"
                                       disabled={ item.disabled } >
                                年龄
                            </InputItem>

                            {/* 课程 */}
                            <Picker data={[courseList]}
                                    title=""
                                    cascade={false}
                                    value={item.courseIds[0]?[item.courseIds[0]]:null}
                                    extra="请选择课程"
                                    onChange={v => this.handleCourse(v,index)}>
                                <List.Item arrow="horizontal" className={(!(item.courseIds[0]?[item.courseIds[0]]:null)?'emptyPicker':'' )+ ' extra-right'}>
                                    课程
                                </List.Item>
                            </Picker>

                            {/* 其他感兴趣的 */}
                            <div className="label-longer coursesCu" onClick={() => this.handleInterest(index)}>
                                <Item extra={coursesText(index)} arrow="horizontal" className="label-long extra-right" >
                                    其他感兴趣的
                                </Item>
                            </div>

                            {/* 学校 */}
                            <InputItem clear
                                       placeholder={`请输入学校`}
                                       value={item.school}
                                       className={`extra-right`}
                                       onChange={v => this.handleInputChange(v,'school',index)} >
                                学校
                            </InputItem>

                            {/* 与联系人关系 */}
                            <Picker data={relationshipType}
                                    title=""
                                    cascade={false}
                                    value={item.relationshipType}
                                    extra="请选择与联系人关系"
                                    onChange={v => this.handleInputChange(v,'relationshipType',index)}>
                                <List.Item className={!(item.relationshipType)?'emptyPicker label-long extra-right':'label-long extra-right'}
                                           arrow="horizontal">
                                    与联系人关系
                                </List.Item>
                            </Picker>

                            {/* 学员介绍 */}
                            <TextareaItem className="client-introduce extra-right border-botm1"
                                          title="学员介绍"
                                          clear
                                          placeholder="请输入学员介绍"
                                          autoHeight
                                          value={item.introduce}
                                          onChange={v => this.handleInputChange(v,'introduce',index)}
                            />
                            {/*<Flex className="btn-main-long baocun" ref="saveStudent" onClick={() => this.editStudentFetch(index)}>{item.btnIsDelete&&students.length>1?'删除学员':'保存学员'}</Flex>*/}
                            {/*<Flex className={`btn-del-student `} >删除学员</Flex>*/}
                            {/*<InterestLabel visible={item.linkManVisib}
                                           data={courseList}
                                           value={item.courseIds}
                                           onConfirm={v => this.cancelSource(v,index)}
                                           onClose={v => this.cancelSource(v,index)} />*/}
                        </List>
                    ))}
                </div>
                <div className="footer" ref={`ClueResultFoot`}>
                    {
                        currentTab.indexOf('student') === -1 ?
                            <Flex className="btn" onClick={() => this.saveLinkManDetail()}>保存联系人和学员</Flex> :
                            <Flex>
                                <Flex className={`sm-btn ${students[currentTab.slice(7)].btnIsDelete&&students.length>1?'':'disabled'}`}
                                      onClick={() => this.delStudentItem(currentTab.slice(7))} >
                                    删除学员
                                </Flex>
                                <Flex className="sm-btn"
                                      onClick={() => this.saveLinkManDetail()}>
                                    保存联系人和学员
                                </Flex>
                            </Flex>
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    state: state
})

const ResultContainerconnect = connect(
    mapStateToProps,
    action
)(ResultContainer)

export default ResultContainerconnect;
