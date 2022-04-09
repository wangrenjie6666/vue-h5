// 手机号码验证
export function regphone(data) {
    let myreg = /^1(3|4|5|7|8)\d{9}$/
    return myreg.test(data)
}
// 手机号码中间4位****
export function changephone(data) {
    let reg = /^(\d{3})\d*(\d{4})$/;
    let str = String(data);
    let str2 = str.replace(reg, '$1****$2')
    return str2
}
// 银行卡中间四位
export function bankcard(data) {
    if (data && data.length > 8) {
        // let len = data.length;
        return data.slice(0, 4) + " " + "****" + " " + "****" + " " + data.slice(-4);
        // return `${data.substring(0, 4)} ${"*".repeat(data.length - 8).replace(/(.{4})/g, `
        // $1 `)}${data.length % 4 ? " " : ""}${data.slice(-4)}`;
    } else {
        return "****" + " " + "****" + " " + "****" + " " + data.slice(-4);
    }


    // let reg = /^(\d{4})\d+(\d{4})$/

    // return data.replace(reg, "$1 **** **** $2")
    // return data.replace(/\s/g, '').replace(/(\d{4})\d+(\d{4})$/, "$1 **** **** $2")
}
/*jsw*/
export function regNumber(data) {
    let myreg = /[^0-9]/g;
    return myreg.test(data) ? myreg : false;
}
export function validateMoney(vm, val, num = 2) {
    let str = vm[val];
    const dReg = /[^0-9|.]/g;
    const oneDot = /(\.[0-9]*)\.+/g;
    const zeroHead = /^0+([0-9]+)/;
    const floorEnd = new RegExp(`(\\d*\\.\\d{${num}})\\d+`);
    const floorStart = /^\./;
    dReg.test(str) && (str = str.replace(dReg, ''));
    oneDot.test(str) && (str = str.replace(oneDot, '$1'));
    zeroHead.test(str) && (str = str.replace(zeroHead, '$1'));
    floorEnd.test(str) && (str = str.replace(floorEnd, '$1'));
    floorStart.test(str) && (str = 0 + str);
    vm[val] = str;
}
export function formatDate(date = +new Date(), fmt = 'y-M-d') {
    date = date.toString();
    date = date.length === 10 ? parseInt(`${date}000`, 0) : parseInt(date, 0);
    const newDate = new Date(date);
    const obj = {
        y: newDate.getFullYear(),
        M: newDate.getMonth() + 1,
        d: newDate.getDate(),
        h: newDate.getHours(),
        m: newDate.getMinutes(),
        s: newDate.getSeconds()
    };

    Object.keys(obj).forEach(key => {
        fmt = fmt.replace(key, obj[key] > 9 ? obj[key] : '0' + obj[key]);
    });
    return fmt;
}
/*jsw*/

// 带T的日期
export function getTdata(data) {
    if (!(data === null)) {
        return (new Date(data * 1000)).toLocaleDateString().match(/((?!\D).)+/g).join('-')
            // let retdata = data.split('T')
            // return retdata[0]
    }
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}
/**
 * paranem formatTime(time, 'Y-M-D') formatTime(1545903266795, 'Y年M月D日 h:m:s')  或者formatTime(1545903266795, 'Y-M-D h:m:s')
 */
export function formatTime(number, format) {
    let time = number.length == 13 ? new Date(parseInt(number)) : new Date(number * 1000)
    let newArr = []
    let formatArr = ['Y', 'M', 'D', 'h', 'm', 's']
    newArr.push(time.getFullYear())
    newArr.push(formatNumber(time.getMonth() + 1))
    newArr.push(formatNumber(time.getDate()))

    newArr.push(formatNumber(time.getHours()))
    newArr.push(formatNumber(time.getMinutes()))
    newArr.push(formatNumber(time.getSeconds()))

    for (let i in newArr) {
        format = format.replace(formatArr[i], newArr[i])
    }
    return format
}
// 获取页面url参数
export function _getLocationQuery() {
    let url = window.location.href;
    let urlArr = url.split('?')[1] ? url.split('?')[1].split('&') : [];
    let queryObj = {};
    urlArr.forEach(ele => {
        queryObj[ele.split('=')[0]] = ele.split('=')[1]
    });
    return queryObj;
}

export var isWeiXin = (function() {
    let ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
})();

export var isAndroid = (function() {
    let ua = window.navigator.userAgent;
    return ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1;
})();

export var isIOS = (function() {
    let ua = window.navigator.userAgent;
    return !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
})();

export function returnFloat(item) {
    let value = Math.round(parseFloat(item) * 100) / 100;
    let xsd = value.toString().split(".");
    if (xsd.length == 1) {
        value = value.toString() + ".00";
        return value;
    }
    if (xsd.length > 1) {
        if (xsd[1].length < 2) {
            value = value.toString() + "0";
        }
        return value;
    }
    return value;
}
// 正式环境  实际正式地址：http://h5.qiwangguanjia.cn/      这个地址是之前动态域名测试使用http://h5.pre.qiwangguanjia.cn
// export var oldBaseUrl = "http://h5.qiwangguanjia.cn/"
// export var oldBaseUrl = "http://h5.pre.qiwangguanjia.cn";

// 测试环境
export var oldBaseUrl = "http://h5.25.test.qiwangguanjia.cn:41080";


//陈敏那边地址测试环境 动态域名
// export var oldBaseUrl = "http://qw2h5.lookfs.com:18081";



export function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}