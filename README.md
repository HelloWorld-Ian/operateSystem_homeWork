# oprate-sys

## 项目介绍
### 内容介绍
   操作系统课设作业，实现了一个抢占式优先权调度算法的进程调度的程序演示，并且实现在可变
分区管理方式下，采用首次适应算法实现主存空间的分配和回收。
   （1）设置PCB管理进程：PCB 内容包括：进程名/PID；要求运行时间（单位时间）；优先权；状态；进
程属性：独立进程、同步进程（前趋、后继）。
   （2）可以随机输入若干进程，可随时添加进程，并按优先权排序；
   （3）从就绪队首选进程运行：优先权-1；要求运行时间-1；要求运行时间为 0 时，
撤销该进程；一个时间片结束后重新排序，进行下轮调度；
   （4）自行假设主存空间大小，预设操作系统所占大小并构造未分分区表。表目内
容：起址、长度、状态（未分/空表目）。对内存空间分配采用首次适应算法。
   （5）进程完成后，回收主存，并与相邻空闲分区合并。
   （6）设置后备队列和挂起状态。若内存空间足够，可自动从后备队列调度一作业
进入。被挂起进程入挂起队列，设置解挂功能用于将制定挂起进程解挂入就绪队列。

### 可视化实现
   程序的可视化实现主要使用了vue3框架，用element-ui设计界面，辅以apexchart实现队列可视化

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
