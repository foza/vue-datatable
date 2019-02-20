import Vue from 'vue'
import Router from 'vue-router'
import List from '@/components/List'
import Login from '@/components/Login'
import details from '@/components/History'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect:{
        name: 'login'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/list',
      name: 'List',
      component: List
    },
    {
      path: '/details/:Pid',
      name: 'details',
      component: details
    }
  ]
})