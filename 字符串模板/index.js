 'use strict';
 let arr = Array.apply(null,{length:20}).map((i,n)=>{
     return ++n;
 })
 let str = strUp`a${
    arr.map(i=>{
        return `${i}`
    }).join(' -> ')
}b`
 console.log()
 function strUp(strList,...params) {
     console.log(strList)   //${} 外面面的字符串
     console.log(params) //${} 里面的变量
     return strList.map((i,n)=>{
        return params[n] ?
        `${i}${params[0].split('->').join('')}`
        : i
     }).join('')
     
 }
 console.log('str:',str)