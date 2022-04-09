
//1手机号数字11位正则
const phoneRegular = (pone)=>{
    let myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(pone)) {
      return false;
    } else {
      return true;
    }
}

//2数字整数正则
const numRegular=(num)=>{
    let myreg = /^(-|\+)?\d+(\.\d+)?$/;
    if (!myreg.test(num)) {
      return false;
    } else {
      return true;
    }
}

export {
    phoneRegular,
    numRegular
}
