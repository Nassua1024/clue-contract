
// 添加线索名字
export const ADD_LINKMAN_NAME   = 'ADD_LINKMAN_NAME'
// 添加线索性别
export const ADD_LINKMAN_GRADE  = 'ADD_LINKMAN_GRADE'
// 学员姓名
export const ADD_STUDENT_NAME = 'ADD_STUDENT_NAME'
export const ADD_STUDENT_GENDER = 'ADD_STUDENT_GENDER'
// 添加线索学员类型
export const ADD_STUDENT_TYPE   = 'ADD_STUDENT_TYPE'
// 添加线索电话号码
export const ADD_LINKMAN_TEL    = 'ADD_LINKMAN_TEL'
// 添加线索渠道
export const ADD_LINKMAN_SOURCE = 'ADD_LINKMAN_SOURCE'
export const LINS_LINKMAN_SOURCE = 'LINS_LINKMAN_SOURCE'
// 添加线索课程
export const ADD_LINKMAN_COURSE = 'ADD_LINKMAN_COURSE'
// 口碑学员
export const ADD_PRAISE_STUDENT = 'ADD_PRAISE_STUDENT'

export const RESULT_ADD_STUDENT = 'RESULT_ADD_STUDENT'
export const RESULT_DEL_STUDENT = 'RESULT_DEL_STUDENT'
// 线索列表搜索
export const CLUELIST_SEARCH = 'CLUELIST_SEARCH'
export const CLEAR_CLUELIST_SEARCH = 'CLEAR_CLUELIST_SEARCH'
// 客户标签
export const CUSTOMER_LABELS = 'CUSTOMER_LABELS'

// 保存线索ID --- 关联添加客户标签页关系
export const SAVE_LEAD_TOLABELS = 'SAVE_LEAD_TOLABELS'

// 保存线索标签 ---
export const SAVE_LABELS = 'SAVE_LABELS'
// 合同Id ---
export const SAVE_Contract = 'SAVE_Contract'

// 保存编辑线索页面全部数据，当点击保存按钮的时候
export const SAVE_LEAD_SUPPLEMENT = 'SAVE_LEAD_SUPPLEMENT'
export const CLEAR_LEAD_SUPPLEMENT = 'CLEAR_LEAD_SUPPLEMENT'

/*新建合同*/
export const NEW_CONTRACT = 'NEW_CONTRACT'

// 诺到访信息
export const SAVE_VISIT_INFO = 'SAVE_VISIT_INFO'
// 预约试听
export const SAVE_LISTEN_INFO = 'SAVE_LISTEN_INFO'

// clear
export const CLEAR_VISIT_LISTEN_TASK = 'CLEAR_VISIT_LISTEN_TASK'
export const CLEAR_LESSON_SCHEDULE = 'CLEAR_LESSON_SCHEDULE'

// 添加试听单页面state
export const ADD_ADUITION_STATE = 'ADD_ADUITION_STATE'
export const CLEAR_ADUITION_STATE = 'CLEAR_ADUITION_STATE'
// 保存跟进记录all-state
export const SAVE_CLUEMODIFY_INFO = 'SAVE_CLUEMODIFY_INFO'

// 保存课堂信息
export const LESSON_SCHEDULE = 'LESSON_SCHEDULE'

// 保存线索详情页面数据
export const DETAILPAGE_DATA = 'DETAILPAGE_DATA'

// 清除线索详情
export const CLEAR_CLUE_DETAIL = 'CLEAR_CLUE_DETAIL'

// 预约下次到访/试听 保存学员数据
export const VISIT_STUDENT_DATA = 'VISIT_STUDENT_DATA'

// 清除到访/试听 学员数据
export const CLEAR_VISIT_STUDENT_DATA = 'CLEAR_VISIT_STUDENT_DATA'


// 线索姓名
export const saveLinkManName = (value) => ({
    type: ADD_LINKMAN_NAME,
    value
})

// 保存录入试听数据
export const RECORD_LISTEN_STATE = 'RECORD_LISTEN_STATE'
export const CLEAR_RECORD_LISTEN_STATE = 'CLEAR_RECORD_LISTEN_STATE'

// 添加试听单页面state
export const addAduitionState = (value) => ({
    type: ADD_ADUITION_STATE,
    value
})
export const clearAduitionState = (value) => ({
    type: CLEAR_ADUITION_STATE,
    value
})


// 线索性别
export const saveLinkManGrade = (value) => ({
    type: ADD_LINKMAN_GRADE,
    value
})
// 学员姓名
export const saveStudentName = (value) => ({
    type: ADD_STUDENT_NAME,
    value
})
// 学员性别
export const saveStudentGender = (value) => ({
    type: ADD_STUDENT_GENDER,
    value
})
// 线索学员类型
export const saveStudentType = (value) => ({
    type: ADD_STUDENT_TYPE,
    value
})
// 线索电话
export const saveLinkManTel = (value) => ({
    type: ADD_LINKMAN_TEL,
    value
})
// 线索课程
export const saveLinkManCourse = (value) => ({
    type: ADD_LINKMAN_COURSE,
    value
})
// 线索渠道
export const saveLinkManSource = (value) => ({
    type: ADD_LINKMAN_SOURCE,
    value
})
// 暂存线索渠道
export const saveLinkManSourceLinS = (value) => ({
    type: LINS_LINKMAN_SOURCE,
    value
})



// 口碑学员
export const savePraiseStudent = (value) => ({
    type: ADD_PRAISE_STUDENT,
    value
})

export const resultAddStudent = (count) => ({
    type: RESULT_ADD_STUDENT,
    count
})
export const resultDelStudent = (count) => ({
    type: RESULT_DEL_STUDENT,
    count
})
// 线索列表搜索
export const clueListSearchValue = (value) => ({
    type: CLUELIST_SEARCH,
    value
})

export const clearReduxSearch = (value) => ({
    type: CLEAR_CLUELIST_SEARCH,
    value
})
// 保存客户标签
export const saveCustomerLabels = (value) => ({
    type: CUSTOMER_LABELS,
    value
})

// 保存线索和客户标签的关系
export const saveClueConcernLabels = (value) => ({
    type: SAVE_LEAD_TOLABELS,
    value
})
//保存线索标签
export const saveLabels = (value) => ({
    type: SAVE_LABELS,
    value
})

// 录入联系人保存信息-保存整个信息
export const saveLeadSupplement = (value) => ({
    type: SAVE_LEAD_SUPPLEMENT,
    value
})
export const clearLeadSupplement = (value) => ({
    type: CLEAR_LEAD_SUPPLEMENT,
    value
})

//保存合同信息
export const saveContract=(value)=>({
    type:SAVE_Contract,
    value
})

/*新建预览*/
export const newContract=(value)=>({
    type:NEW_CONTRACT,
    value
})

// 诺到访信息
export const changeVisitInfo = (value) => ({
    type: SAVE_VISIT_INFO,
    value
})

// 预约试听信息
export const changeListenInfo = (value) => ({
    type: SAVE_LISTEN_INFO,
    value
})

export const clearVisitListenTask = (value) => ({
    type: CLEAR_VISIT_LISTEN_TASK,
    value
})

export const clearLessonSchedule = (value) => ({
    type: CLEAR_LESSON_SCHEDULE,
    value
})

// 保存跟进记录all-state
export const saveClueModify = (value) => ({
    type: SAVE_CLUEMODIFY_INFO,
    value
})

// 选择课堂保存课堂id
export const saveLessonScheduleId = (value) => ({
    type: LESSON_SCHEDULE,
    value
})

// 保存线索详情页面数据
export const saveClueDetailState = (value) => ({
    type: DETAILPAGE_DATA,
    value
})

// 清除线索详情
export const clearClueDetail = (value) => ({
    type: CLEAR_CLUE_DETAIL,
    value
})

// 预约下次到访/试听 保存学员数据
export const saveVisitStudentData  = (value) => ({
    type: VISIT_STUDENT_DATA,
    value
})
export const clearVisitStudentData = (value) => ({
    type: CLEAR_VISIT_STUDENT_DATA,
    value
})

// 保存录入试听单数据
export const saveRecordListenState = value => ({
    type: RECORD_LISTEN_STATE,
    value
})

// 清除
export const clearRecordListenData = value => ({
    type: CLEAR_RECORD_LISTEN_STATE,
    value
})