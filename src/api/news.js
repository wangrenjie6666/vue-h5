//新的
import {get, post } from '@/axios/request.js'

//1.查询新闻分类
export async function getCategoriesList(data){
    return new Promise ((resolve,reject)=>{
        get('/categories/getCategoriesList',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

//2.查询新闻列表
export async function getContentsList(data){
    return new Promise ((resolve,reject)=>{
        get('/contents/getContentsList',data).then(res=>{
            resolve(res);
        }).catch(res=>{
            
        })
    })
}

