let save=function(key,array){
      sessionStorage.setItem(key, JSON.stringify(array))
}

let get=function(name,origin){
    let temp=sessionStorage.getItem(name)
    if(temp!=null){
        return JSON.parse(temp)
    }else{
        return origin
    }
}

let pushThread=function(queue_prepare,RAM,queue_backup,map){
    let i=queue_backup.length-1;
    while(i>=0){
        if(isLock(map,queue_backup[i].succeed)){
            i--
            continue
        }
        let index=isContainable(RAM,queue_backup[i])
        if(index!=-1){
                split(RAM,queue_backup[i],index)
                queue_prepare.push(queue_backup[i])
                queue_backup.splice(i,1)
        }
        i--
    }
    sort(queue_prepare)
}



let sort=function(array){
    array.sort(function(x,y){
        return x.pri-y.pri
      })
}

let getExecute=function(queue_prepare,execute,mem_label,mem,RAM,pool,map){
    if(execute[0].name!="空闲状态"){
        let peek=execute.pop()
        if(peek.time>1){
            peek.time-=1
            pool[peek.id-1].time-=1
            if(peek.pri>=1){
                peek.pri-=1
                pool[peek.id-1].priority-=1
            }
            queue_prepare.push(peek)
            sort(queue_prepare)
        }else{
            peek.time-=1
            pool[peek.id-1].time-=1
            if(peek.pri>=1){
                peek.pri-=1
                pool[peek.id-1].priority-=1
            }
            for(let i=0;i<mem.length;i++){
                if(mem_label[i]==peek.name){
                    mem_label.splice(i,1)
                    mem.splice(i,1)
                    mem[0]+=peek.data[0]
                    map[peek.id]=null
                    break
                }
            }
            for(let i=0;i<RAM.length;i++){
                if(RAM[i].name==peek.name){
                    removeAndMerge(RAM,i)
                    break
                }
            }
        }
    }
    if(execute.length==0){
        execute.push({
        name:"空闲状态",
        data:[31],
        color:"rgb(0,180,0)"
    })
}
    if(queue_prepare.length!=0&&execute[0].name=="空闲状态"){
        execute.splice(0,1,queue_prepare.pop())
    }
}

let getColor=function(){
    let red=Math.round(Math.random()*200)
    let green=Math.round(Math.random()*200)
    let blue=Math.round(Math.random()*200)
    return 'rgb('+red+','+green+','+blue+')'
}


let isLock=function(map,ids){
    let lock=false
    ids.forEach(function(item){
        if(map[item]!=null){
           lock=true
        }
    })
    return lock
}

let isContainable=function(RAM,thread){
    let l=RAM.length
    for(let i=0;i<l;i++){
        if(RAM[i].free==true){
            if(RAM[i].data[0]>=thread.data[0]){
                return i
            }
        }
    }
    return -1
}

let split=function(RAM,thread,i){
    let start=RAM[i].start
    RAM.splice(i,0,{
        name:thread.name,
        data:thread.data,
        start:start,
        free:false,
        color:thread.color
    })
    if(RAM[i+1].data[0]-thread.data[0]==0){
        RAM.splice(i+1,1)
    }else{
        RAM[i+1].data[0]-=thread.data[0]
        RAM[i+1].start=RAM[i].start+thread.data[0]
    }
}

let removeAndMerge=function(RAM,i){
    let data=RAM[i].data
    let start=RAM[i].start
    RAM.splice(i,1,{
        name:"空闲分区",
        data:data,
        start:start,
        free:true,
        color:"rgb(0,0,255)"
    })
    if(i+1<RAM.length&&RAM[i+1].free==true){
        RAM[i].data[0]+=RAM[i+1].data[0]
        RAM.splice(i+1,1)
    }
    if(i-1>=0&&RAM[i-1].free==true){
        RAM[i].data[0]+=RAM[i-1].data[0]
        RAM[i].start=RAM[i-1].start
        RAM.splice(i-1,1)
    }
}

let pushUnhangThread=function(hang,RAM,queue_prepare){
    let i=hang.length-1
    while(i>=0){
        if(hang[i].hang==false){
            let index=isContainable(RAM,hang[i])
            if(index!=-1){
                split(RAM,hang[i],index)
                queue_prepare.push(hang[i])
                hang.splice(i,1)
            }
        }
        i--
    }
    sort(queue_prepare)
}

let unhangThread=function(thread,hang){
    let l=hang.length
    thread.hang=false
    for(let i=0;i<l;i++){
        if(thread.name==hang[i].name){
            hang[i].hang=false
            break
        }
    }
}

let hangThread=function(RAM,thread,queue_prepare,hang,excute){
    let l=queue_prepare.length
    if(excute[0].name!="空闲状态"&&excute[0].name==thread.name){
        excute[0].hang=true
        thread.hang=true
        hang.push(JSON.parse(JSON.stringify(excute[0])))
        excute.splice(0,1,{
            name:"空闲状态",
            data:[31],
            color:"rgb(0,180,0)"
        })
    }else{
        for(let i=0;i<l;i++){
            if(queue_prepare[i].name==thread.name){
                queue_prepare[i].hang=true
                thread.hang=true
                hang.push(JSON.parse(JSON.stringify(queue_prepare[i])))
                queue_prepare.splice(i,1)
                break
            }
        }
    }
    for(let i=0;i<RAM.length;i++){
        if(RAM[i].name==thread.name){
            removeAndMerge(RAM,i,hang)
            break
        }
    }
    sort(hang)
}

export {
    save,
    get,
    pushThread,
    sort,
    getExecute,
    getColor,
    hangThread,
    unhangThread,
    pushUnhangThread
}