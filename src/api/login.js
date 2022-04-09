//新的
import {get, post } from '@/axios/request.js'

//1.短信发送
export async function sendNote(data){
    return new Promise ((resolve,reject)=>{
        post('/login/sendSms',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

//2.短信登录
export async function codeLogin(data){
    return new Promise ((resolve,reject)=>{
        post('login/codeLogin',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

//3.密码登录
export async function pwdLogin(data){
    return new Promise ((resolve,reject)=>{
        post('login/pwLogin',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

//4.退出登录
export async function loginOut(data){
    return new Promise ((resolve,reject)=>{
        get('user/loginOut',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

// 游客登录
export async function loginForVisitor(data){
    return new Promise ((resolve,reject)=>{
        post('/login/loginForVisitor',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

// 找回密码
export async function forgetPwdBySmsCode(data){
    return new Promise ((resolve,reject)=>{
        post('/user/forgetPwdBySmsCode',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

// 登录过后设置密码
export async function changePwdBySmsCode(data){
    return new Promise ((resolve,reject)=>{
        post('/user/changePwdBySmsCode',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

// 合并游客数据
export async function mergeVisitorData(data){
    return new Promise ((resolve,reject)=>{
        post('/login/mergeVisitorData',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

// 删除游客数据
export async function deleteVisitorData(data){
    return new Promise ((resolve,reject)=>{
        post('/login/deleteVisitorData',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}