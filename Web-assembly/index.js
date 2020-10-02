fetch('./env.wasm').then(async(resEnv)=>{
  const envMem = new window.WebAssembly.Memory({ initial: 3 }); //initial 的值需要大于 导入模块 memory 
  
  const resKey = await fetch('./key.wasm');
  const keuMem = new window.WebAssembly.Memory({ initial: 3 }); //initial 的值需要大于 导入模块 memory 

  // >instantiateStreaming 直接接收 一个 Promise<Res> 对象 （需要服务器响应 类型为 'application/wasm'）
  // const mod = await window.WebAssembly.instantiateStreaming(res, {
  //   env: {
  //     mem: memory,
  //   },
  // });
  // const view = new DataView(memory);
  // console.log(view)

  // >instantiate 接收一个 原始 ArrayBuffer 类型
  const bufferEnv = await resEnv.arrayBuffer()
  const env  = await window.WebAssembly.instantiate(bufferEnv, {
    // 这个地方的解构对应 wat 文件的 import "env" "mem"
    // 其实 instantiate 的 这个参数 表示 传入 wast文件中的对象， 也可以理解为 wast引入一个Memory对象 (import "env" "mem" (memory 2))
    env: {
      mem: envMem,
    },
  })
  console.log(env.instance)


  const bufferKey = await resKey.arrayBuffer();
  const key  = await window.WebAssembly.instantiate(bufferKey, {
    key: {
      protection: keuMem,
      fun: () =>{
        console.log('我在 wasm 中执行')
      },
    },
  })
  console.log(key.instance)
})

// >通过 XMLHttpRequest 获取

const xhr = new XMLHttpRequest();
xhr.open('GET', './env.wasm', true);
xhr.onreadystatechange = async ({target: {readyState, response}}) => {
  if(readyState == 4){
    const mem = new WebAssembly.Memory({initial: 2});
    // 方法一
    const blob = new Blob([response],{type:'application/wasm'});
    const buffer = await blob.arrayBuffer();
    const blobAssembly = await WebAssembly.instantiate(buffer, {
      env: {
        mem,
      }
    });
    console.log('Blob',blobAssembly);
    // 方法二
    const encoder = new TextEncoder(); // 或者用 Blob 转 // application/wasm
    const uint8 = encoder.encode(response);
    const encoderAssembly = await WebAssembly.instantiate(uint8.buffer, {
      env: {
        mem,
      }
    });
    console.log('TextEncoder', encoderAssembly)
  }
}
xhr.send();