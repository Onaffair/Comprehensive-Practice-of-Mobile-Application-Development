import {createRouter,createWebHashHistory} from "vue-router";

const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        name:'home',
        component : () => import('../view/home.vue'),
    },
    {
        path: '/login',
        name:'login',
        component : () => import('../view/login.vue'),
    },
    {
        path:'/userInfo',
        name: 'userInfo',
        component: () => import('../view/UserInfo.vue')
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../view/register.vue')
    },
    {
        path: '/settings',
        name:'settings',
        component : () => import('../view/MySettings.vue'),
    },
    {
        path: '/show-comment',
        name:'showComment',
        component : () => import('../view/ShowComment.vue'),
        props(route){
            return route.query
        }
    },
    {
        path:'/postArticle',
        name:'postArticle',
        component: () => import('../view/PostArticle.vue'),
    },
    {
        path:'/showArticle',
        name:'showArticle',
        component: () => import('../view/ShowArticle.vue'),
        props(route){
            return route.query
        }
    },
    {
        path:'/test',
        name:'test',
        component:() => import('../view/test.vue')
    }
]
const router = createRouter({
    history: createWebHashHistory(),
    scrollBehavior(to, from, savedPosition) {
        console.log('router','savedPosition',savedPosition)
        if (savedPosition) {
            return savedPosition
        } else {
            return {top: 0}
        }
    },
    routes,
})
export default router