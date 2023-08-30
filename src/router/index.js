import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/Login'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/Home.vue'),
    redirect: '/home/welcome',
    children: [
      {
        path: 'welcome',
        name: 'welcome',
        component: () => import('@/components/welcome.vue')
      },
      {
        path: 'reports',
        name: 'reports',
        component: () => import('@/components/reports/reports.vue')
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('@/components/users/users.vue')
      },
      {
        path: 'orders',
        name: 'orders',
        component: () => import('@/components/orders/orders.vue')
      },
      {
        path: 'goods',
        name: 'goods',
        component: () => import('@/components/goods/goods.vue')
      },
      {
        path: 'categories',
        name: 'categories',
        component: () => import('@/components/goods/categories.vue')
      },
      {
        path: 'params',
        name: 'params',
        component: () => import('@/components/goods/params.vue')
      },
      {
        path: 'rights',
        name: 'rights',
        component: () => import('@/components/rights/rights.vue')
      },
      {
        path: 'roles',
        name: 'roles',
        component: () => import('@/components/rights/roles.vue')
      },

    ],
    beforEnter: (to, from, next) => {
      let token = sessionStorage.getItem('token')
      if (token) {
        next()
      } else {
        next('/Login')
      }
    }
  },
  {
    path: '/Login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
