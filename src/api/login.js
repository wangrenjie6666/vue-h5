//新的
import {get, post } from '@/axios/request.js'

//1.短信发送
export async function sendNote(data){
    return new Promise ((resolve,reject)=>{
        post('login/sendSms',data).then(res=>{
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