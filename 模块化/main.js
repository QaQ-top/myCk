
/*
 *                        .::::.
 *                      .::::::::.
 *                     :::::::::::
 *                  ..:::::::::::'
 *               '::::::::::::'
 *                 .::::::::::
 *            '::::::::::::::..
 *                 ..::::::::::::.
 *               ``::::::::::::::::
 *                ::::``:::::::::'        .:::.
 *               ::::'   ':::::'       .::::::::.
 *             .::::'      ::::     .:::::::'::::.
 *            .:::'       :::::  .:::::::::' ':::::.
 *           .::'        :::::.:::::::::'      ':::::.
 *          .::'         ::::::::::::::'         ``::::.
 *      ...:::           ::::::::::::'              ``::.
 *     ````':.          ':::::::::'                  ::::..
 *                        '.:::::'                    ':'````..
 */



function isType (params) {
    let type = Object.prototype.toString.call(params)
    let reg = /(?<=\[object )[\w]+(?=\])/
    type = type.match(reg)[0]
    return type
}

function DeepCopy(params) {
    let copy = null;
    switch (true) {
        case isType(params) === 'Object':
            copy = {}
            iter(params);
            return copy;
        case isType(params) === 'Array':
            copy = []
            iter(params)
            return copy;
        default:
            copy = params;
            return copy;
    }
    function iter(params) {
        for (const [key, value] of Object.entries(params)) {
            copy[key] = DeepCopy(value)
        }
    }
}


let a = {
    obj:{
        cart:'ffat'
    },
    arr:[1,null,3,4,5,3]
}
console.time('DeepCopy')
let b = DeepCopy(a)
console.timeEnd('DeepCopy')
b.obj.cart = 'a'
b.arr[1] = 'f'
console.group('深拷贝')
console.log(a,b)
console.groupEnd()

