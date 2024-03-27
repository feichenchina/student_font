import request from '@/utils/request'
// 创建账单
export function addBill(data) {
    return request({
        url: '/api/teacher/add_bill',
        method: 'post',
        data,
    })
}
// 获取所有账单列表
export function listBill(params) {
    return request({
        url: '/api/teacher/list_bill',
        method: 'get',
        params,
    })
}
// 发送账单
export function sendBill(params) {
    return request({
        url: '/api/teacher/send_bill',
        method: 'get',
        params,
    })
}

// 获取学生的账单列表
export function getStudentBill(params) {
    return request({
        url: '/api/student/get_student_bill',
        method: 'get',
        params,
    })
}

// 获取指定账单学生的支付情况列表
export function getStudentBillStatusList(params) {
    return request({
        url: '/api/teacher/get_student_bill_status_list',
        method: 'get',
        params,
    })
}
