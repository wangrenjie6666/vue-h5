import {get, post, upload } from '@/axios/request.js'

// 获取3.0银行卡数据
export async function getCardInfo(data){
    return new Promise ((resolve,reject)=>{
        get('/account/getCardInfo',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

// 获取银行卡列表
export async function bankList(data){
    return new Promise ((resolve,reject)=>{
        get('/bank/list',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

// 获取卡片类型列表
export async function cardTypeList(data){
    return new Promise ((resolve,reject)=>{
        get('/cardType/list',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

// 新增信用卡
export async function accountAdd(data){
    return new Promise ((resolve,reject)=>{
        post('/account/add',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

// 切换账本
export async function changeAccount(data){
    return new Promise ((resolve,reject)=>{
        get('/user/changeAccount',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

// 获取用户信息
export async function getUserInfo(data){
    return new Promise ((resolve,reject)=>{
        get('/user/getUserInfo',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

// 修改用户信息
export async function editUserInfo(data){
    return new Promise ((resolve,reject)=>{
        post('/user/editUserInfo',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

// 修改用户头像
export async function modifyHead(data){
    return new Promise ((resolve,reject)=>{
        upload('/user/modifyHead',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

// 注销
export async function logoff(data){
    return new Promise ((resolve,reject)=>{
        get('/user/logOut',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}
