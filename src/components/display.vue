<template>
<div style="float:left">
 <div id="chart">
        <apexchart type="bar" ref="backup" height="110" width="600" :options="chartOptions_1" :series="backup"></apexchart>
      </div>
<div id="chart">
        <apexchart ref="hang" type="bar" height="110" width="600" :options="chartOptions_2" :series="hang"></apexchart>
      </div>
<div id="chart">
        <apexchart ref="prepare" type="bar" height="110" width="600" :options="chartOptions_3" :series="prepare"></apexchart>
      </div>
      <el-button type="primary" style="margin-left:100px;margin-top:30px;float:left" @click="next" >继续执行</el-button>
      <el-button type="warning" style="margin-left:50px;margin-top:30px" @click="dialogVisible2=true" >查看进程</el-button>
      <el-button type="success" style="margin-left:50px;margin-top:30px" @click="dialogVisible1=true" >查看内存</el-button>
</div>
<div style="float:right;margin-top:50px;margin-left:40px">
<div id="chart">
        <apexchart ref="execute" type="bar" height="200" width="170" style="float:left;margin-top:110px" :options="chartOptions_4" :series="execute"></apexchart>
        <apexchart ref="RAM" type="bar" height="310" width="170" style="float:left" :options="chartOptions_5" :series="RAM"></apexchart>
      </div>
</div>  

<el-dialog
  title="内存列表"
  v-model="dialogVisible1"
  width="35%"
  :before-close="handleClose">
 <el-table
    :data="RAM"
    style="width: 100%;margin-left:20px;margin-top:-10px"
    max-height="450">
    <el-table-column
      prop="start"
      label="起始地址"
      width="150">
    </el-table-column>
    <el-table-column
      prop="data[0]"
      label="长度"
      width="120">
    </el-table-column>
    <el-table-column
      prop="free"
      label="是否空闲"
      width="120">
    </el-table-column>
  </el-table>
</el-dialog>

<el-dialog
  title="内存列表"
  v-model="dialogVisible2"
  width="65%"
  top="15px"
  :before-close="handleClose">
 <el-table
    :data="tableData"
    style="width: 100%;margin-left:20px;margin-top:-10px"
    max-height="450">
    <el-table-column
      prop="id"
      label="进程ID"
      width="150">
    </el-table-column>
    <el-table-column
      prop="priority"
      label="进程优先级"
      width="120">
    </el-table-column>
    <el-table-column
      prop="mem"
      label="进程大小"
      width="120">
    </el-table-column>
    <el-table-column
      prop="time"
      label="运行时间"
      width="120">
    </el-table-column>
    <el-table-column
      prop="succeed"
      label="前驱进程"
      width="180">
    </el-table-column>
     <el-table-column label="操作">
      <template #default="scope">
        <el-button
          size="mini"
          type="warning"
          @click="hangThread($store.state.RAM,scope.row,$store.state.queue_prepare,
          $store.state.queue_hang,$store.state.execute)"
           v-if="scope.row.time!=0&&!scope.row.hang">挂起</el-button>
        <el-button
          size="mini"
          type="success"
          @click="unhangThread(scope.row,this.$store.state.queue_hang)"
           v-if="scope.row.time!=0&&scope.row.hang">解挂</el-button>
          <el-button
          size="mini"
          type="danger"
           v-if="scope.row.time==0" disabled>已完成</el-button>
      </template>
    </el-table-column>
  </el-table>
</el-dialog>
</template>

<script>
import {save,pushThread,get,getExecute,hangThread,unhangThread,pushUnhangThread} from './service.js'
export default {
  Created(){
        this.$store.state.pool=get("pool",this.$store.state.pool)
        this.$store.state.queue_backup=get("queue_backup",this.$store.state.queue_backup)
        this.$store.state.queue_backup_map=get("queue_backup_map",this.$store.state.queue_backup_map)
        this.$store.state.RAM=get("RAM",this.$store.state.RAM)
        this.$store.state.queue_prepare=get("queue_prepare",this.$store.state.queue_prepare)
        this.$store.state.execute=get("execute",this.$store.state.execute)
        this.$store.state.mem=get("mem",this.$store.state.mem)
        this.$store.state.mem_name=get("mem_name",this.$store.state.mem_name)
        this.$store.state.queue_hang=get("hang",this.$store.state.queue_hang)
  },
  methods:{
    next(){
      pushUnhangThread(this.$store.state.queue_hang,this.$store.state.RAM
      ,this.$store.state.queue_prepare)
      pushThread(this.$store.state.queue_prepare,this.$store.state.RAM,
      this.$store.state.queue_backup,this.$store.state.queue_backup_map)
      getExecute(this.$store.state.queue_prepare,this.$store.state.execute
      ,this.$store.state.mem_name,this.$store.state.mem,this.$store.state.RAM,
      this.$store.state.pool,this.$store.state.queue_backup_map)
      save("pool",this.$store.state.pool)
      save("mem",this.$store.state.mem)
      save("mem_name",this.$store.state.mem_name)
      save("queue_backup_map",this.$store.state.queue_backup_map,true)
    },
    hangThread(RAM,thread,queue_prepare,hang,excute){
      hangThread(RAM,thread,queue_prepare,hang,excute)
      save("pool",this.$store.state.pool)
    },
    unhangThread(thread,hang){
      unhangThread(thread,hang)
    }
  },
  watch:{
    "execute":{
      handler:function(){
        save("execute",this.$store.state.execute)
      },
      deep:true
    },
    "prepare":{
      handler:function(){
        save("queue_prepare",this.$store.state.queue_prepare)
      },
      deep:true
    },
    "backup":{
      handler:function(){
         save("queue_backup",this.$store.state.queue_backup)
      },
      deep:true
    },
    "RAM":{
      handler:function(){
        save("RAM",this.$store.state.RAM)
      },
      deep:true
    },
    "hang":{
      handler:function(){
        save("hang",this.$store.state.queue_hang)
      },
      deep:true
    }
  },
  data: function() {
    return {
          tableData:this.$store.state.pool,
          dialogVisible1:false,
          dialogVisible2:false,
          backup:this.$store.state.queue_backup,
          hang:this.$store.state.queue_hang,
          prepare:this.$store.state.queue_prepare,
          RAM:this.$store.state.RAM,
          execute:this.$store.state.execute,
          chartOptions_1: {
            chart: {
              type: 'bar',
              height: 350,
              stacked: true,
              toolbar: {
             show: false
             }
            },
            plotOptions: {
              bar: {
                horizontal: true,
              }
            },
            dataLabels: {
               enabled: true,
               formatter: function(value, { seriesIndex, w }) {
                 return w.config.series[seriesIndex].name
              }
            },
            stroke: {
              width: 1,
              colors: ['#fff']
            },
            title: {
            
            },
            xaxis: {
              categories: ['后备队列(外存)'],
            },
            fill: {
              opacity: 1
            
            },
            legend:{
              show:false
            }
          },

        chartOptions_2: {
            chart: {
              type: 'bar',
              height: 350,
              stacked: true,
              toolbar: {
             show: false
             }
            },
            dataLabels: {
               enabled: true,
               formatter: function(value, { seriesIndex, w }) {
                 return w.config.series[seriesIndex].name
              }
            },
            plotOptions: {
              bar: {
                horizontal: true,
              }
            },
            stroke: {
              width: 1,
              colors: ['#fff']
            },
            title: {
            
            },
            xaxis: {
              categories: ['挂起队列(外存)'],
            },
            fill: {
              opacity: 1
            
            },
            legend:{
              show:false
            }
          },

          chartOptions_3: {
            chart: {
              type: 'bar',
              height: 350,
              stacked: true,
              toolbar: {
             show: false
             }
            },
            dataLabels: {
               enabled: true,
               formatter: function(value, { seriesIndex, w }) {
                 return w.config.series[seriesIndex].name
              }
            },
            plotOptions: {
              bar: {
                horizontal: true,
              }
            },
            stroke: {
              width: 1,
              colors: ['#fff']
            },
            title: {
            
            },
            xaxis: {
              categories: ['就绪队列(内存)'],
            },
            fill: {
              opacity: 1
            
            },
            legend:{
              show:false
            }
          },

          chartOptions_4: {
             tooltip: {
              y: {
                formatter: function (val) {
                  if(val<=30){
                    return val
                  }else{
                    return ""
                  }
                }
              }
            },
            chart: {
              type: 'bar',
              height: 350,
              stacked: true,
              toolbar: {
             show: false
             },
              stackType: '100%'
            },
            plotOptions: {
              bar: {
                horizontal: false,
              }
            },
            stroke: {
              width: 1,
              colors: ['#fff']
            },
            xaxis: {
              categories: ['CPU'],
            },
            yaxis:{
              show:false
            },
            dataLabels: {
               enabled: true,
               formatter: function(value, { seriesIndex, w }) {
               return w.config.series[seriesIndex].name
              }
            },
            grid:{
              yaxis: {
                lines: {
                  show: false
                  }
                },
            },
            fill: {
              opacity: 1
            
            },
            legend:{
              show:false
            }
          },

          chartOptions_5: {
            chart: {
              type: 'bar',
              height: 350,
              stacked: true,
              toolbar: {
             show: false
             },
            },
            plotOptions: {
              bar: {
                horizontal: false,
              }
            },
            stroke: {
              width: 1,
              colors: ['#fff']
            },
            xaxis: {
              categories: ['主存'],
            },
            yaxis:{
              show:false
            },
            dataLabels: {
               enabled: true,
               formatter: function(value, { seriesIndex, w }) {
                 return w.config.series[seriesIndex].name
              }
            },
            grid:{
              yaxis: {
                lines: {
                  show: false
                  }
                },
            },
            fill: {
              opacity: 1
            
            },
            legend:{
              show:false
            }
          }
          
    }
  },
};
</script>