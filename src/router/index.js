import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store';
Vue.use(Router)

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true,
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true,
  },
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../views/dashboard/index'),
    meta: { requiresAuth: true, },
    children: [
      {
        path: '/redirect/course',
        name: 'course',
        component: () => import('../views/other/CourseManagementView.vue'),
        meta: { requiresAuth: true, role: 'teacher' },
      },
      {
        path: '/redirect/bill',
        name: 'bill',
        component: () => import('../views/other/BillManagementView.vue'),
        meta: { requiresAuth: true, role: 'teacher' },
      },
      {
        path: '/redirect/studentCourse',
        name: 'studentCourse',
        component: () => import('../views/other/StudentCourseView.vue'),
        meta: { requiresAuth: true, role: 'student' },
      },
      {
        path: '/redirect/studentBill',
        name: 'studentBill',
        component: () => import('../views/other/StudentBillView.vue'),
        meta: { requiresAuth: true, role: 'student' },
      },
    ]
  },
]

const createRouter = () =>
  new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  })


const router = createRouter()


router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.token; // 根据实际情况判断用户是否已经登录
  const userRole = store.getters.tokenType; // 假设当前用户的角色为admin
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.meta.role && to.meta.role !== userRole) {
    next('/401');
  } else if (to.matched.length === 0) {
    next('/404');
  } else {
    next();
  }
});
export default router
