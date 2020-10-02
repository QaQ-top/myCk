console.group("Store");

const Store = new Proxy(
  {},
  {
    get: (target, key, receiver) => {
      return JSON.parse(localStorage.getItem(key));
    },
    set: (target, key, value, receiver) => {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    },
    deleteProperty: (target, key, receiver) => {
      localStorage.removeItem(key);
      return true;
    },
  }
);

// const key = Symbol.for('ck')
// console.log(Store[key] = 999)

// Class API #

class Name {
  #c = 1;
  #ts = "ts";
  constructor() {
    console.log("this.#c", this.#c);
  }
}
console.log(new Name());






/**
 *> ArrayBuffer 二进制数据
 * ArrayBuffer 不是某种东西的数组
 * 让我们先澄清一个可能的误区。ArrayBuffer 与 Array 没有任何共同之处：
 * 它的长度是固定的，我们无法增加或减少它的长度。
 * 它正好占用了内存中的那么多空间。
 * 要访问单个字节，需要另一个“视图”对象，而不是 buffer[index]。
 */

const buffer = new ArrayBuffer(16);
console.log(buffer);
buffer.byteLength; // 创建一个长度为 16 的 buffer
//!buffer对象无法读取和设置

/**
 * > 通过一下 类型化 达到 可以观察、设置 ArrayBuffer (其实你观察、设置的是 类型化后的 的buffer);
 *
 * Uint8Array 8 位无符号整数  将 ArrayBuffer 中每个字节视为 0 到 255 之间的单个数字
 *  如果 new Uint8Array(buffer) 那么它的 length 为 16;
 *
 * Uint16Array 16 位无符号整数  将 ArrayBuffer 中每 2 个字节视为一个 0 到 65535 之间的整数
 *  如果 new Uint16Array(buffer) 那么它的 length 为 8;
 *
 * Uint32Array 32 位无符号整数  将 ArrayBuffer 中每 4 个字节视为一个 0 到 4294967295 之间的整数
 *  如果 new Uint32Array(buffer) 那么它的 length 为 4;
 *
 * Float64Array 将 ArrayBuffer 中每 8 个字节视为一个 5.0x10^-324 到 1.8x10^308 之间的浮点数
 *  如果 new Uint64Array(buffer) 那么它的 length 为 2;
 * > Uint8 表示 存储 二进制 的长度 为 8
 * > 256 的二进制格式是 100000000 (9位) 但是 Uint8 只能截取 8位，所以这里 将是 0
 * > 257 的二进制格式是 100000001 (9位) 所以这里 将是 1
 * ! 这里是从后外前截取的，因为二进制是从后外前进位的
 * > number.toString(2) 将十进制转二进制
 */

/**
 * buffer 中一位一位整数占一个字节 刚刚创建的 是一个 16 字节的 buffer 所以 length 为 12;
 * Uint32Array 将 buffer 每4位(每4个字节)视为一个整数
 * uint32.BYTES_PER_ELEMENT 可以理解为 uint32 每一项 占多少字节;
 * buffer 是 16 字节
 * 所以 uint32.length 为 16(buffer字节大小) / 4(uint32.BYTES_PER_ELEMENT) = 4;
 *
 * 所以 uint8.BYTES_PER_ELEMENT == 1, uint8.length == 16
 * 所以 uint16.BYTES_PER_ELEMENT == 2, uint8.length == 8
 * 所以 float64.BYTES_PER_ELEMENT == 8, uint8.length == 2
 */
const uint32 = new Uint32Array(buffer);
uint32.BYTES_PER_ELEMENT; // 每个整数 所占用的字节 ( 这里是 4 );
uint32.length; // 表示存储的数据长度 ( 这里是 4 );
uint32.byteLength; // 整体字节大小 (4 x 4) 16

// uint32 只能设置 0 - 4294967295 之间的整数 如果不符合要求, 就不会被赋值
uint32[0] = 4294967295;
console.log(uint32);

// '视图之间的转换'

const uint8 = new Uint8Array(uint32); // uint32 相当于 [4294967295, 0, 0, 0] 所以 uint8 是 [255, 0, 0, 0]
// const uint8 = new Uint8Array(uint32.buffer); // uint32.buffer 是原始 ArrayBuffer 所以是 [255, 255, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
uint8.buffer; // 表示最底层的 ArrayBuffer
console.log(uint8); //  [255, 0, 0, 0]
/**
 * uint36的 4294967295 二进制为 11111111111111111111111111111111;
 * 截取 8 位 11111111
 */
console.log(parseInt("11111111", 2)); // 255

const uint36 = new Uint16Array([0, 1, 2, 3]);
// 这里虽然不是同过 ArrayBuffer 类型创建的
// 但是 JavaScript 的底层会自动 将其转换为 ArrayBuffer 类型

/**
 *>下面是类型化数组的列表：
 * Uint8Array，Uint16Array，Uint32Array —— 用于 8、16 和 32 位的整数。
 *
 * Uint8ClampedArray —— 用于 8 位整数，在赋值时便“固定“其值。
 *
 * Int8Array，Int16Array，Int32Array —— 用于有符号整数（可以为负数）。
 *
 * Float32Array，Float64Array —— 用于 32 位和 64 位的有符号浮点数。
 */











{
  /**
   * > DataView
   *
   */
  const buffer = new ArrayBuffer(16);
  const uint8 = new Uint8Array(buffer);
  uint8[0] = 255; // 对于 uint8 255 表最大值 二进制 11111111
  uint8[1] = 255; // 对于 uint8 255 表最大值 二进制 11111111
  const dataView = new DataView(uint8.buffer);
  console.log(dataView.getUint16(0)); // 对于 uint16 65280 表最大值 二进制 1111111111111111
  console.log(dataView.getUint32(1)); // 对于 uint16 4278190080 表最大值 二进制 11111111111111111111111111111111
  // dataView 还可以转化成其他 类型化 数据
}










//>TextDecoder 和 TextEncoder
/**
 * > new TextDecoder([label], [options]) Uint8Array 转码 utf-8、big5、windows-1251
 * label —— 编码格式，默认为 utf-8，但同时也支持 big5，windows-1251 等许多其他编码格式。
 * options —— 可选对象：
 *    fatal —— 布尔值，如果为 true 则为无效（不可解码）字符抛出异常，否则（默认）用字符 \uFFFD(也就是 �) 替换无效字符。
 *    ignoreBOM —— 布尔值，如果为 true 则 BOM（可选的字节顺序 unicode 标记），很少需要使用。
 *
 * decoder.decode([input], [options]);
 * input —— 要被解码的 BufferSource。
 * options —— 可选对象：
 *    stream —— 对于解码流，为 true，则将传入的数据块（chunk）作为参数重复调用 decoder。
 *    在这种情况下，多字节的字符可能偶尔会在块与块之间被分割。这个选项告诉 TextDecoder 记住“未完成”的字符
 *    并在下一个数据块来的时候进行解码。
 */
decodeURIComponent('\uFFFD')
encodeURIComponent('�')
const decoder = new TextDecoder("utf-8", { 
  fatal: false, // 无效字符 替换 成 \uFFFD(�)
  ignoreBOM: true 
});
// ArrayBuffer 类型都可以转成中文
console.log(decoder.decode(new Uint8Array([72, 101, 108, 108, 111]))); // hello
console.log(decoder.decode(new Uint8Array([228, 189, 160, 229, 165, 189]))); // 你好

/**
 * > new TextEncoder() 字符串 转 Uint8Array
 */
const encoder = new TextEncoder();
console.log(encoder.encode("Hello")); // [72, 101, 108, 108, 111]















/**
 * > Blob
 * > new Blob(blobParts, options);
 * blobParts 是 Blob/BufferSource/String 类型的值的数组。 blobParts必须是数组
 * options 可选对象：
 *    type —— Blob 类型，通常是 MIME 类型，例如 image/png、text/html……，
 *    endings —— 是否转换换行符，使 Blob 对应于当前操作系统的换行符(\r\n 或 \n)。默认为 "transparent"(啥也不做)，不过也可以是 "native"(转换)。
 * blob实例 属性是只读的
 */
const blob = new Blob(["<span>Array</span>"], {
  type: "text/html;charset=utf-8",
});
/**
 * > blob.slice 方法用于创建一个包含源 Blob的指定字节范围内的数据的新 Blob 对象。
 * blob.slice([byteStart], [byteEnd], [contentType]);
 * byteStart —— 起始字节，默认为 0。
 * byteEnd —— 最后一个字节（专有，默认为最后）。
 * contentType —— 新 Blob的 MIME 类型，默认为空字符串，默认与源 blob 相同。
 */
console.log(blob.slice(1, 3, "text/html;charset=utf-8"));

// Blob 转 ArrayBuffer
// 方法一
const fileReader = new FileReader();
/**
 * > FileReader 对象
 * readAsArrayBuffer(blob);  Blob 转 ArrayBuffer
 * readAsArrayBuffer(blob) —— 将数据读取为二进制格式的 ArrayBuffer。
 * readAsText(blob, [encoding]) —— 将数据读取为给定编码（默认为 utf-8 编码）的文本字符串。
 * readAsDataURL(blob) —— 读取二进制数据，并将其编码为 base64 的 data url。
 * abort() —— 取消操作。
 * 
 * 事件
 * loadstart —— 开始加载。
 * progress —— 在读取过程中出现。
 * load —— 读取完成，没有 error。
 * abort —— 调用了 abort()。
 * error —— 出现 error。
 * loadend —— 读取完成，无论成功还是失败。
 */

fileReader.readAsArrayBuffer(blob);
fileReader.onload = function (event) {
  // event.target.result == fileReader.result
  // arrayBuffer 转 中文
  console.log(decoder.decode(fileReader.result));
};
// 方法二
blob.arrayBuffer().then(arrayBuffer=>{
  console.log(arrayBuffer, decoder.decode(arrayBuffer))
});

// blob 转 string
blob.text().then(res=>{
  console.log(res)
});






//>Image 转换为 blob
// 获取任何图像
let img = document.createElement("img");
img.src = '/blob.png';

// 生成同尺寸的 <canvas>
let canvas = document.createElement('canvas');
canvas.width = img.clientWidth;
canvas.height = img.clientHeight;

let context = canvas.getContext('2d');

// 向其中复制图像（此方法允许剪裁图像）
context.drawImage(img, 0, 0);
// 我们 context.rotate()，并在 canvas 上做很多其他事情

// toBlob 是异步操作，结束后会调用 callback
canvas.toBlob(function(blob) {
  // blob 创建完成，下载它
  let link = document.createElement('a');
  link.download = 'example.png';
  if(blob instanceof Blob) {
    link.href = URL.createObjectURL(blob);
    link.click();
    // 删除内部 blob 引用，这样浏览器可以从内存中将其清除
    URL.revokeObjectURL(link.href);
  }
}, 'image/png');





/**、
 * > File 是继承自 Blob
 * new File(fileParts, fileName, [options])
 * fileParts —— Blob/BufferSource/String 类型值的数组。
 * fileName —— 文件名字符串。
 * options —— 可选对象：
 *    lastModified —— 最后一次修改的时间戳（整数日期）。
 *    第二种，更常见的是，我们从 <input type="file"> 或拖放或其他浏览器接口来获取文件。在这种情况下，file 将从操作系统（OS）获得 this 信息。
 */
const file = new File(
  [ '你好', new ArrayBuffer(16), new Blob(['00'],{type:'text/plain;charset=utf-8'}) ],
  'FileName', // File 独有
  {
    lastModified: new Date(), // File 独有
    type: 'application/x-www-form-urlencoded;charset=utf-8'
  }  
)
console.log(file)































console.groupEnd("Store");
