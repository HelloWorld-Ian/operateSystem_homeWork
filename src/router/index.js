import { createRouter, createWebHashHistory } from 'vue-router'
import chart from '../components/chart.vue'
import create from '../components/createThread.vue'
import display from '../components/display.vue'
const routes=[
    {
        path:'/',
        component:create,
        children:[
            {
                path:'/',
                component:chart
            }
        ]
    },
    {
        path:'/display',
        component:display
    }
]

const router=createRouter({
    history:createWebHashHistory(),
    routes
})

export default router

