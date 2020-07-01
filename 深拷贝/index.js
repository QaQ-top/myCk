/*
 * @Author: your name
 * @Date: 2020-05-29 12:29:01
 * @LastEditTime: 2020-06-06 12:33:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \JavaScript\深拷贝\index.js
 */
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

function isType(params) { // 返回数据类型
    let type = Object.prototype.toString.call(params);
    let reg = /(?<=\[object )[\w]+(?=\])/;
    type = type.match(reg)[0];
    return type;
}
function DeepCopy(params) {
    let copy = null;
    switch (true) {
        case isType(params) === 'Object':
            copy = {};
            iter(params);
            return copy;
        case isType(params) === 'Array':
            copy = [];
            iter(params);
            return copy;
        default:
            return params;
    }
    function iter(params) { // 拷贝传递的参数;
        for (const [key, value] of Object.entries(params)) {
            copy[key] = DeepCopy(value) //递归返回 拷贝后的 value;
        }
    }
}

let a = {
    obj: {
        cart: 'ffat'
    },
    arr: [1, null, 3, 4, 5, 3]
}

let b = DeepCopy(a);
b.obj.cart = 'a';
b.arr[1] = 'f';
console.log(a, b);






