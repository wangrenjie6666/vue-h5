import {get, post } from '@/axios/request.js'

//1.获取信用卡列表
export async function getCardListByUid(data){
    return new Promise ((resolve,reject)=>{
        get('/account/getCardListByUid',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

//2.获取信用卡诊断历史
export async function getHistory5(data){
    return new Promise ((resolve,reject)=>{
        get('/diag/history',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

//3.获取信用卡详情
export async function getCardInfo(data){
    return new Promise ((resolve,reject)=>{
        get('/account/info',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}


//4.诊断
export async function diagByCid(data){
    return new Promise ((resolve,reject)=>{
        post('/diag/diagByCid',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

//5.获取诊断报告
export async function reportInfo(data){
    return new Promise ((resolve,reject)=>{
        get('/diag/reportInfo',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}