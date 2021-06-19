import {createStore} from 'vuex'
 
const state={
    pool:[],
    mem:[100],
    mem_name:['未使用存储'],
    queue_prepare:[],
    queue_backup:[],
    queue_hang:[],
    execute:[{
        name:"空闲状态",
        data:[31],
        color:"rgb(0,180,0)"
    }],
    RAM:[{
        name:"空闲分区",
        data:[30],
        start:0,
        free:true,
        color:"rgb(0,0,255)"
    }],
    queue_backup_map:{}
}

const vuex=createStore({
    state:state
})

export default vuex