//新的
import {get, post } from '@/axios/request.js'

//1.获取信用卡列表
export async function accountCardEdit(data){
    return new Promise ((resolve,reject)=>{
        post('/account/edit',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

//2.删除信用卡
export async function deleteCardByCid(data){
    return new Promise ((resolve,reject)=>{
        get('/account/delete',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}