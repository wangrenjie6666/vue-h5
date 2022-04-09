//整数
const IntegerRegex = /(^-?[1-9]\d*)|(0{1})$/

//正整数
const IntegerPlusRegex = /^[1-9]\d*|0$/

//小数
const decimalRegex = /^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/

//正小数
const decimalPlusRegex = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/

//百分比校验（最多两位小数,不能超过100，不带百分号）
const percentageRegex = /^(((\d|[1-9]\d)(\.\d{1,2})?)|100|100.0|100.00)$/

//邮箱
const emailRegex = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

//手机
const mobileRegex = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/

//电话号码
const telephoneRegex = /^((\d{3,4}-)|\d{3.4}-)?\d{7,8}$/

//金额校验（不能超过两位小数）
const moneyRegex = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/

//金额校验，支持负数
const moneyNegativeRegex = /^((-?[1-9]{1}\d*)|(-?0{1}))(\.\d{1,2})?$/

// 银行卡
const cardNum = /^([1-9]{1})(\d{14}|\d{18})$/
//模块导出
export default {
    //正则
    IntegerRegex,
    IntegerPlusRegex,
    decimalRegex,
    decimalPlusRegex,
    percentageRegex,
    emailRegex,
    mobileRegex,
    telephoneRegex,
    moneyRegex,
    moneyNegativeRegex,
    cardNum,
}