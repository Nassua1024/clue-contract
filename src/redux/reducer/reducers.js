import {
    ADD_ADUITION_STATE, CLEAR_ADUITION_STATE,

    ADD_LINKMAN_NAME,
    ADD_LINKMAN_GRADE,
    ADD_STUDENT_TYPE,
    ADD_LINKMAN_TEL,
    ADD_LINKMAN_COURSE,
    ADD_LINKMAN_SOURCE,
    ADD_PRAISE_STUDENT,
    ADD_STUDENT_GENDER,
    LINS_LINKMAN_SOURCE,

    RECORD_LISTEN_STATE,
    CLEAR_RECORD_LISTEN_STATE,

    CLEAR_LESSON_SCHEDULE,
    CLEAR_LEAD_SUPPLEMENT,

    RESULT_ADD_STUDENT,
    RESULT_DEL_STUDENT,

    CLUELIST_SEARCH,

    CUSTOMER_LABELS,


    SAVE_LEAD_TOLABELS,

    SAVE_LABELS,
    SAVE_Contract,
    ADD_STUDENT_NAME,

    NEW_CONTRACT,

    SAVE_LEAD_SUPPLEMENT,

    SAVE_VISIT_INFO,
    SAVE_LISTEN_INFO,

    SAVE_CLUEMODIFY_INFO,

    LESSON_SCHEDULE,

    CLEAR_VISIT_LISTEN_TASK,
    CLEAR_CLUELIST_SEARCH,

    DETAILPAGE_DATA,
    CLEAR_CLUE_DETAIL,

    CLEAR_VISIT_STUDENT_DATA, VISIT_STUDENT_DATA
} from '../action/action'






// 联系人姓名
export const linkManName = (state='', action={}) => {
    switch (action.type) {
        case ADD_LINKMAN_NAME:
            return action.value.name;
        default: return state;
    }
}
// 联系人性别 gender
export const linkManGrade = (state={}, action={}) => {

    switch (action.type) {
        case ADD_LINKMAN_GRADE:
            return action.value;
        default: return state;
    }
}
// 学员类型
export const studentType = (state={}, action={}) => {

    switch (action.type) {
        case ADD_STUDENT_TYPE:
            return action.value;
        default: return state;
    }
}
// 学员性别
export const studentGender = (state={}, action={}) => {

    switch (action.type) {
        case ADD_STUDENT_GENDER:
            return action.value;
        default: return state;
    }
}
// 学员姓名
export const studentName = (state='', action={}) => {

    switch (action.type) {
        case ADD_STUDENT_NAME:
            return action.value.name;
        default:
            return state;
    }
}
// 联系人电话
export const linkManTel = (state={}, action={}) => {
    switch (action.type) {
        case ADD_LINKMAN_TEL:
            return action.value;
        default: return state;
    }
}
// 课程
export const linkManCourse = (state={}, action={}) => {
    switch (action.type) {
        case ADD_LINKMAN_COURSE:
            return action.value;
        default: return state;
    }
}
// 渠道
export const linkManSource = (state={}, action={}) => {
    switch (action.type) {
        case ADD_LINKMAN_SOURCE:
            return action.value;
        default: return state;
    }
}

// 暂存渠道
export const linslinkManSource = (state={}, action={}) => {
    switch (action.type) {
        case LINS_LINKMAN_SOURCE:
            return action.value;
        default: return state;
    }
}

// 口碑学员
export const praiseStudent = (state={}, action={}) => {
    switch (action.type) {
        case ADD_PRAISE_STUDENT:
            return action.value;
        default: return state;
    }
}
// 学员数量？
export const changeStudentCount = (state=1, action={}) => {

    switch (action.type) {
        case RESULT_ADD_STUDENT:
            return action.count+1
        case RESULT_DEL_STUDENT:
            return action.count-1
        default : return state;
    }
}

// 线索列表搜索
export const searchValue = (state='', action={}) => {

    switch (action.type) {
        case CLUELIST_SEARCH:
            return action.value
        case CLEAR_CLUELIST_SEARCH:
            return ''
        default : return state;
    }
}

// 客户标签
export const customerLabels = (state=[], action={}) => {

    switch (action.type) {
        case CUSTOMER_LABELS:
            return action.value
        default : return state;
    }
}

// 保存线索和客户标签关系
export const clueConcernLabels = (state=null, action={}) => {

    switch (action.type) {
        case SAVE_LEAD_TOLABELS:
            return action.value
        default : return state;
    }
}

//保存线索标签
export const labels = (state=null, action={}) => {

    switch (action.type) {
        case SAVE_LABELS:
            return action.value
        default : return state;
    }
}

export const supplement = (state='', action={}) => {

    switch (action.type) {
        case SAVE_LEAD_SUPPLEMENT:
            return action.value
        case CLEAR_CLUE_DETAIL:
            return ''
        case CLEAR_LEAD_SUPPLEMENT:
            return ''
        default : return state;
    }
}

//保存合同id
export const ConcernLabels = (state=null, action={}) => {

    switch (action.type) {
        case SAVE_Contract:
            return action.value
        default : return state;
    }
}


/*合同预览*/
export const previewContact = (state=null, action={}) => {

    switch (action.type) {
        case NEW_CONTRACT:
            return action.value
        default : return state;
    }
}

// 到访信息
export const visitInfo = (state=null, action={}) => {

    switch (action.type) {
        case SAVE_VISIT_INFO:
            return action.value
        case CLEAR_VISIT_LISTEN_TASK:
            return ''
        default : return state;
    }
}

// 试听信息
export const listenInfo = (state=null, action={}) => {

    switch (action.type) {
        case SAVE_LISTEN_INFO:
            return action.value
        case CLEAR_VISIT_LISTEN_TASK:
            return ''
        default : return state;
    }
}

// modify all-state
export const modifyState = (state=null, action={}) => {

    switch (action.type) {
        case SAVE_CLUEMODIFY_INFO:
            return action.value
        default : return state;
    }
}

// 保存课堂信息
export const lessonSchedule = (state='', action={}) => {
    switch (action.type) {
        case LESSON_SCHEDULE:
            return action.value
        case CLEAR_VISIT_LISTEN_TASK:
            return ''
        case CLEAR_LESSON_SCHEDULE:
            return ''
        default : return state;
    }
}

// 添加试听单页面state保存
export const auditionState = (state='', action={}) => {
    switch (action.type) {
        case ADD_ADUITION_STATE:
            return action.value
        case CLEAR_ADUITION_STATE:
            return ''
        default : return state;
    }
}

// 保存线索详情页面数据  // 清除线索详情页面数据
export const detailPageState = (state='', action={}) => {

    switch (action.type) {
        case DETAILPAGE_DATA:
            return action.value
        case CLEAR_CLUE_DETAIL:
            return ''
        default : return state;
    }
}

// 学员 信息 - 保存-清除
export const visitStudentData = (state={}, action={}) => {
    switch (action.type) {
        case VISIT_STUDENT_DATA:
            return action.value
        case CLEAR_VISIT_STUDENT_DATA:
            return {}
        default : return state;
    }
}

// 保存试听数据
export const recordListen = (state=null, action={}) => {
    switch (action.type) {
        case RECORD_LISTEN_STATE:
            return action.value
        case CLEAR_RECORD_LISTEN_STATE:
            return ''
        default : return state;
    }
}