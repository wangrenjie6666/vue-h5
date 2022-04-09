//新的
import {get, post } from '@/axios/request.js'

//1.获取账户列表
export async function listByUid(data){
    return new Promise ((resolve,reject)=>{
        get('/account/listByUid',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

//2.编辑账户 -> 获取 图标 
export async function infoById(data){
    return new Promise ((resolve,reject)=>{
        get('/cardBillDetail/infoById',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

//3.编辑账户 -> 新增
export async function add(data){
    return new Promise ((resolve,reject)=>{
        post('/cardBillDetail/add',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}


//4.编辑账户(生活) -> 获取 图标 
export async function dailyTypList(data){
    return new Promise ((resolve,reject)=>{
        get('/dailyType/list',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}
//5.编辑账户(生活) -> 新增
export async function lifeAdd(data){
    return new Promise ((resolve,reject)=>{
        post('/dailyBill/add',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}
//6.编辑账户(生活) -> 编辑
export async function lifeEdit(data){
    return new Promise ((resolve,reject)=>{
        post('/dailyBill/edit',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

//7.编辑账户(信用卡) -> 查询
export async function cardInfoById(data){
    return new Promise ((resolve,reject)=>{
        get('/cardBillDetail/getBillDetailByDid',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

//8.编辑账户(信用卡) -> 编辑
export async function cardEdit(data){
    return new Promise ((resolve,reject)=>{
        post('/cardBillDetail/edit',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

//9.获取信用卡记账开始时间和结束时间
export async function getBookkeepingTime(data){
    return new Promise ((resolve,reject)=>{
        get('/proplan/getBookkeepingTime',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

//10.删除信用卡账单
export async function cardBillDelete(data){
    return new Promise ((resolve,reject)=>{
        get('/cardBillDetail/delete',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}