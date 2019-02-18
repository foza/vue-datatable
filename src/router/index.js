import Vue from 'vue'
import Router from 'vue-router'
import List from '@/components/List'
import details from '@/components/History'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
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