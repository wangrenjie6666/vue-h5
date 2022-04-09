//新的
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

//2.获取账单列表
export async function manageCardList(data){
    return new Promise ((resolve,reject)=>{
        get('/account/manageCardList',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}


//生活1.查询账单详情
export async function infoById(data){
    return new Promise ((resolve,reject)=>{
        get('/dailyBill/infoById',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}
//生活2.删除账单
export async function lifeDelete(data){
    return new Promise ((resolve,reject)=>{
        get('/dailyBill/delete',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

//生活3.查询外列表 根据年
export async function lifeList(data){
    return new Promise ((resolve,reject)=>{
        get('/dailyBill/list',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

//生活4.查询内列表 根据月
export async function listByMonth(data){
    return new Promise ((resolve,reject)=>{
        get('/dailyBill/listByMonth',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}