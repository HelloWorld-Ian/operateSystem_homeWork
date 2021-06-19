<template>
   <el-aside width="300px" style="position:fixed;left:20px;top:70px;">
       <el-col :span="25">
    <h1 style="margin-left:30px">导航</h1>
    <el-menu class="el-menu-vertical-demo">
      <el-menu-item index="1"  >
        <span class="text" @click="Push('/')" style="margin-left:10px">创建进程</span>
      </el-menu-item>
        <el-menu-item index="2">
        <span class="text" @click="Push('/display')"  style="margin-left:10px">运行演示</span>
      </el-menu-item>
    </el-menu>
  </el-col>
  </el-aside>
</template>

<script>
export default {
    methods:{
        Push(path){
            this.$router.push(path)
        }
    }
}
</script>
<style>
.el-tag:hover{
    cursor: pointer;
}

.el-aside{
   font-family: Avenir, Helvetica, Arial, sans-serif;
   border-radius: 8px;
}
.el-col h1{
    color: dodgerblue;
    margin: 30px;
    font-size: 30px;
}
.text{
    font-size: 15px;
}
ul,p,a{
margin: 0;
padding: 0;
}

  .item {
    padding: 18px 0;
  }

  .box-card {
    height:254px;
    width:300px;
    position:fixed;
    margin-left:260px;
    margin-top:50px
  }

  .card {
    height:150px;
    width:300px;
    position:fixed;
    margin-left:260px;
    margin-top:330px
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

   .clearfix:after {
    clear: both
  }
</style>