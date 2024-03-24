import request from '@/utils/request'

export function addCourse(data) {
    return request({
        url: '/api/teacher/course_add',
        method: 'post',
        data,
    })
}

export function CourseList(params) {
    return request({
        url: '/api/teacher/course_list',
        method: 'get',
        params,
    })
}
// 获取还未创建账单的课程列表
export function NotBillCourseList(params) {
    return request({
        url: '/api/teacher/not_bill_course_list',
        method: 'get',
        params,
    })
}
// 初始化选修该课程的学生
export function InitCoursestudent(data) {
    return request({
        url: '/api/teacher/init_course_student',
        method: 'post',
        data,
    })
}
// 新增选修该课程的学生
export function AddCoursestudent(data) {
    console.log("请求的数据:", data)
    return request({
        url: '/api/teacher/add_course_student',
        method: 'post',
        data,
    })
}