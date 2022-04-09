//新的
import {get, post } from '@/axios/request.js'

//1.查询首页信用卡账单和列表
export async function manageCardHome(data){
    return new Promise ((resolve,reject)=>{
        get('/account/manageCardHome',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

//2.设为已还清
export async function alreadyRepaid(data){
    return new Promise ((resolve,reject)=>{
        get('/account/alreadyRepaid',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

//3.提额 - 查询用户信用卡列表
export async function getCardListByUid(data){
    return new Promise ((resolve,reject)=>{
        get('/account/getCardListByUid',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

//4.提额 - 获取还款/消费计划列表
export async function getAllPlan4Index(data){
    return new Promise ((resolve,reject)=>{
        get('/proplan/getAllPlan4Index',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

//5.提额 - 开启提额计划
export async function open(data){
    return new Promise ((resolve,reject)=>{
        get('/proplan/open',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}
//6.提额 - 关闭提额计划
export async function over(data){
    return new Promise ((resolve,reject)=>{
        get('/proplan/over',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

//7.提额 - 标记金额
export async function signPlan(data){
    return new Promise ((resolve,reject)=>{
        post('/proplan/signPlan',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

//8.提额 - 查看历史提额计划
export async function getHistory(data){
    return new Promise ((resolve,reject)=>{
        get('/proplan/getHistory',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

//9.提额 - 查看历史提额列表
export async function getQuotaHistory(data){
    return new Promise ((resolve,reject)=>{
        get('/proplan/getQuotaHistory',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}


//生活-1.首页 - 列表
export async function dailyBillIndex(data){
    return new Promise ((resolve,reject)=>{
        get('/dailyBill/index',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

//生活-2.首页 - 图表 年月日参数
export async function getWmy(data){
    return new Promise ((resolve,reject)=>{
        get('/dailyBill/getWmy',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

//生活-3.首页 - 图表
export async function listForChart(data){
    return new Promise ((resolve,reject)=>{
        get('/dailyBill/listForChart',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}


// 取消已完成还款
export async function unSignPlan(data){
    return new Promise ((resolve,reject)=>{
        post('/proplan/unSignPlan',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}