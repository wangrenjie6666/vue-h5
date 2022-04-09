
export function parse_decimal_2(num) {
    let v = num;
    v = v.split('.');
    console.log('v',v)
    if(v[1] && v[1].length >= 2){
        v[1] = v[1].slice(0,2)
        v = v.join('.')
        // console.log('v',v)
        return v
    }
    if (!v[1]) {
        v[1] = '00';
    } else if (v[1].length <= 1) {
        v[1] += '0';
    }
    v = v.join('.')
    return v
}

export function format_decimal_2(num) {
    let v = num;
    v = v.split('.');
    console.log(v[1][v.length-1],v[1][v.length-2])
    if(v[1][v.length-1] == 0 && v[1][v.length-2] != 0){
        v[1] = v[1].slice(0,1)
        v = v.join('.')
    }else if(v[1][v.length-1] == 0 && v[1][v.length-2] == 0){
        v = v[0]
    }else{
        v = v.join('.')
    }
    return v
}

export function keep_decimal_2(num) {
    let v = num;
    v = v.split('.');
    console.log('v',v)
    if(v[0] && v[0].length > 8){
        v[0] = v[0].slice(0,8)
    }
    if(v[1] && v[1].length >= 2){
        v[1] = v[1].slice(0,2)
    }
    v = v.join('.')
    console.log('v',v)
    return v
}
