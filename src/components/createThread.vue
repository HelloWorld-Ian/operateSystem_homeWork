<template>
<el-card style="float:left;margin-right:20px;margin-top:-10px">
<el-form ref="form" :model="form" label-width="auto">
  <el-form-item label="进程ID" >
    <el-input v-model="form.ID" readonly="true" style="width:300px"></el-input>
  </el-form-item>
  <el-form-item label="运行时间" >
    <el-select v-model="form.time" placeholder="请选择运行时间" >
      <el-option label="1" value='1'></el-option>
      <el-option label="2" value='2'></el-option>
      <el-option label="3" value='3'></el-option>
      <el-option label="4" value='4'></el-option>
      <el-option label="5" value='5'></el-option>
      <el-option label="6" value='6'></el-option>
      <el-option label="7" value='7'></el-option>
      <el-option label="8" value='8'></el-option>
      <el-option label="9" value='9'></el-option>
      <el-option label="10" value='10'></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="进程优先级" >
    <el-select v-model="form.priority" placeholder="请选择优先级">
      <el-option label="1" value='1'></el-option>
      <el-option label="2" value='2'></el-option>
      <el-option label="3" value='3'></el-option>
      <el-option label="4" value='4'></el-option>
      <el-option label="5" value='5'></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="进程大小"  >
    <el-input v-model="form.mem" style="width:300px"></el-input>
  </el-form-item>
  <el-form-item label="前驱进程">
    <el-checkbox-group v-model="checkboxGroup1">
      <el-checkbox v-for="(thread,i) in $store.state.pool" :label="thread.id" :key="i">{{thread.name}}</el-checkbox>
    </el-checkbox-group>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmit" style="margin-right:30px">立即创建</el-button>
    <el-button type="success" @click="refreshAll">重置</el-button>
  </el-form-item>
</el-form>
</el-card>
<el-card style="height:415px;margin-top:-10px">
<h2 style="margin-top:0px;color: dodgerblue">存储上限</h2>
<router-view/>
</el-card>
</template>

<script>
  import {getColor,save,get} from "./service.js"
  export default {
    created(){
       this.$store.state.queue_backup=get("queue_backup",this.$store.state.queue_backup)
       this.$store.state.queue_backup_map=get("queue_backup_map",this.$store.state.queue_backup_map)
       this.$store.state.RAM=get("RAM",this.$store.state.RAM)
       this.$store.state.queue_prepare=get("queue_prepare",this.$store.state.queue_prepare)
       this.$store.state.execute=get("execute",this.$store.state.execute)
       this.$store.state.mem=get("mem",this.$store.state.mem)
       this.$store.state.mem_name=get("mem_name",this.$store.state.mem_name)
       this.$store.state.queue_hang=get("hang",this.$store.state.queue_hang)
       this.$store.state.pool=get("pool",this.$store.state.pool)
       this.form.ID=this.$store.state.pool.length+1;
       let mem=sessionStorage.getItem("mem")
       let mem_name=sessionStorage.getItem("mem_name")
       let queue_backup=sessionStorage.getItem("queue_backup")
      if(mem!=null){
        this.$store.state.mem=JSON.parse(mem)
      }
      if(mem_name!=null){
        this.$store.state.mem_name=JSON.parse(mem_name)
      }
      if(queue_backup!=null){
        this.$store.state.queue_backup=JSON.parse(queue_backup)
      }
    },
    data() {
      return {
        form: {
          ID: '',
          time:'',
          mem:'',
          priority:'',
        },
        checkboxGroup1: []
      }
    },
    methods: {
      refreshAll(){
        sessionStorage.clear()
        this.$router.go(0)
      },
      onSubmit() {
        if(parseInt(this.form.mem)>30){
          alert("所占空间太大！！")
          return
        }
        if(isNaN(parseInt(this.form.mem))||isNaN(parseInt(this.form.time))||isNaN(parseInt(this.form.priority))){
          alert("进程属性不能为空！！")
          return
        }
        let thread={
          id:this.form.ID,
          name:"进程"+this.form.ID,
          time:this.form.time,
          mem:this.form.mem,
          priority:this.form.priority,
          succeed:this.checkboxGroup1.length==0?"无":this.checkboxGroup1,
        }
        alert('创建成功')
        this.$store.state.pool.push(thread)
        let mem_num=parseInt(this.form.mem)
        this.$store.state.mem.push(mem_num)
        this.$store.state.mem[0]-=mem_num
        this.$store.state.mem_name.push('进程'+this.form.ID)
        this.$store.state.queue_backup.push({
          id:this.form.ID,
          pri:parseInt(this.form.priority),
          time:parseInt(this.form.time),
          name:"进程"+this.form.ID,
          data:[mem_num],
          color:getColor(),
          succeed:this.checkboxGroup1,
          hang:false
        })
        this.$store.state.queue_backup.sort(function(x,y){
          return x.pri-y.pri
        })
        this.$store.state.queue_backup_map[this.form.ID]=this.form.ID
        sessionStorage.setItem("pool", JSON.stringify(this.$store.state.pool))
        sessionStorage.setItem("mem", JSON.stringify(this.$store.state.mem))
        sessionStorage.setItem("mem_name", JSON.stringify(this.$store.state.mem_name))
        save("queue_backup",this.$store.state.queue_backup)
        save("queue_backup_map",this.$store.state.queue_backup_map)
        save("pool",this.$store.state.pool)
        save("RAM",this.$store.state.RAM)
        save("queue_prepare",this.$store.state.queue_prepare)
        save("execute",this.$store.state.execute)
        save("mem",this.$store.state.mem)
        save("mem_name",this.$store.state.mem_name)
        save("hang",this.$store.state.queue_hang)
        this.$router.go(0)
      }
    },
    watch:{
      "form.type":function(val){
        if(val=='dependent'){
          this.form.dependent=''
        }
      }
    }
  }
</script>

<style scoped>
.el-card{
  width: 500px;
}
</style>