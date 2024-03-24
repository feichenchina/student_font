import request from '@/utils/request'
// 获取所有学生列表
export function getStudentList(params) {
    return request({
        url: '/api/teacher/student_list',
        method: 'get',
        params,
    })
}
// 获取已选修指定课程的学生列表
export function getCoursestudentList(params) {
    return request({
        url: '/api/teacher/get_course_student_list',
        method: 'get',
        params,
    })
}

// 获取还未选修指定课程的学生列表
export function getNotCoursestudentList(params) {
    return request({
        url: '/api/teacher/get_not_course_student_list',
        method: 'get',
        params,
    })
}

// 获取当前登录人
export function getCourseList(params) {
    return request({
        url: '/api/student/course_list',
        method: 'get',
        params,
    })
}

// 支付账单
export function Payments(data) {
    return request({
        url: '/api/student/pay_ment',
        method: 'post',
        data,
    })
}

