import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Table from './views/nav1/Table.vue'
import user from './views/nav1/user.vue'
import Page6 from './views/nav3/Page6.vue'

let routes = [
  {
    path: '/login',
    component: Login,
    name: '',
    hidden: true
  },
  {
    path: '/404',
    component: NotFound,
    name: '',
    hidden: true
  },
  {
    path: '/',
    component: Home,
    name: '管理员菜单',
    iconCls: 'el-icon-message',
    children: [
      { path: '/sources', component: Table, name: '渠道源管理' }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '渠道源菜单',
    iconCls: 'fa fa-id-card-o',
    children: [
      { path: '/sourcedata', component: user, name: '渠道数据' }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-address-card',
    leaf: true,
    children: [
      { path: '/page6', component: Page6, name: '导航三' }
    ]
  },
  {
    path: '*',
    hidden: true,
    redirect: { path: '/404' }
  }
]
export default routes
