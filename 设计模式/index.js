require('./模式/observer');

/**
◆ 打车时，可以打专车或者快车。任何车都有车牌号和名称。
◆ 不同车价格不同,快车每公里1元，专车每公里2元。
◆ 行程开始时,显示车辆信息。
◆ 行程结束时,显示打车金额(假定行程就5公里)。
 */
/**
 * @class Car 车
 * @param {String} name 车名
 * @param {String} number 车牌号
 */



class Car {
    constructor(name, number) {
        this.name = name;
        this.number = number;
    }
}

/**
 * @class FastCar 快车
 * @extends {Car} 车
 * @param {String} name 车名
 * @param {String} number 车牌号
 */
class FastCar extends Car {
    constructor(name, number) {
        super(name, number);
        this.price = 1;
    }
}
/**
 * @class MajorCar 快车
 * @extends {Car} 车
 * @param {String} name 车名
 * @param {String} number 车牌号
 */
class MajorCar extends Car {
    constructor(name, number) {
        super(name, number);
        this.price = 2;
    }
}
/**
 * @class Journey 行程
 * @param car {Object} 车辆实例
 */
class Journey {
    constructor(car) {
        this.car = car
    }
    start() {
        console.log(`行程开始：\n 车名-${this.car.name}\n 车牌号-${this.car.number}`)
    }
    end() {
        console.log(`行程结束：\n 价格-${this.car.price * 5}元`)
    }
}
let car = new FastCar('雪佛兰', '浙A:025478');
let jour = new Journey(car);
jour.start();
jour.end();

/**
    某停车场,分3层，每层100车位
    每个车位都能监控到车辆的驶入和离开
    车辆进入前,显示每层的空余车位数量
    车辆进入时,摄像头可识别车牌号和时间
    车辆出来时,出口显示器显示车牌号和停车时长
 */

/**
 * @class Camera 摄像头
 * @param {object} car 车辆
 */
class Camera {
    shot(car) {
        return {
            number: car.number,
            date: Date.now()
        }
    }
}

/**
 * @class Screen 摄像头
 * @param {object} car 车辆
 * @param {object} date 出停车场事件
 */
class Screen {
    show(car, date) {
        console.log(`车牌号：${car.number} 已离开停车场\n停车时间：${(Date.now() - date)}`)
    }
}

/**
 * @class Park 停车场
 * @param {object} floors key楼层号 value停车位数量
 */
class Park {
    constructor(floors) {
        this.floors = []; // 楼层
        this.camera = new Camera()
        this.screen = new Screen()
        this.carList = {} //存储摄像头拍摄信息
        this.init(floors);
    }
    init(floors) {
        for (const key in floors) {
            if (floors.hasOwnProperty(key)) {
                let places = [];
                for (let i = 0; i < floors[key]; i++) {
                    places.push(new Place()) //根据车位数量实例化每一个车位并且放入数组
                }
                this.floors.push(new Floor(key, places, floors[key])) //创建每层的实例，并且加入Park中
            }
        }
    }
    in(car) {
        let info = this.camera.shot(car); //创建一个摄像头捕获信息的对象
        let i = parseInt(Math.random() * 100); //生成随机数
        let stop = false;
        this.floors.forEach(floor => {
            if (floor.places.length <= floor.size && !stop) { //判断是否停车或者是该层是否停满车了
                let place = floor.places[i];
                place.in();// 车辆进入停车位
                info.place = place; //将车位信息于车辆信息关联
                stop = true;
                this.carList[car.number] = info; //将车辆信息记录入停车场
            }
        })

    }
    out(car) {
        let info = this.carList[car.number]; //通过车牌 查找到车辆信息
        let place = info.place;  //查找到该车停车位信息
        place.out(); // 车辆出停车位
        this.screen.show(car, info.date); //查看停车场时长
        delete this.carList[car.number]; // 删除该车辆在停车场的信息
    }
    emptyNum() {
        return this.floors.map((item) => {
            return `第${item.tier}层:剩余车位 ${item.emptyPlaceNum()}`
        }).join('\n')
    }
    stallDetails() {
        let det = []
        this.floors.map(item => {
            let tier = item.tier;
            item.places.map((item, index) => {
                if (!item.empty) {
                    det.push(`第${tier}层:${index + 1}号车位已有车辆停入`)
                }
            })
        });
        return det.join(`\n`);
    }
}

/**
 * @class Floor 摄像头
 * @param {number|string} index 楼层号
 * @param {Array} places 车位对象的数组
 * @param {number|string} size 出停车场事件
 */
class Floor {
    constructor(index, places, size) {
        this.tier = index; //楼层号
        this.size = size; //车位数量
        this.places = places || [] //每个车位的详情（车位实例）
    }
    emptyPlaceNum() {
        let num = 0;
        this.places.forEach(item => {
            if (item.empty) ++num;
        });
        return num;
    }
}


/**
 * @class Place 车位
 */
class Place {
    constructor() {
        this.empty = true; //空
    }
    in() {
        this.empty = false;
    }
    out() {
        this.empty = true;
    }
}

let park = new Park({
    1: 100,
    2: 100,
    3: 100
})
park.in(new Car('雪佛兰', '浙A:1584546'))
console.log(park.stallDetails())
park.out(new Car('雪佛兰', '浙A:1584546'))



/**
 * 工厂模式
 * 例如jQuery的$('div') 和 new jQuery('div')
 */
class Produce {
    constructor(name) {
        this.name = name
    }
    init() {

    }
    show() {
        console.log(this.name)
    }
}

class Creator {
    produce(name) {
        return new Produce(name)
    }
}
let creator = new Creator();
let produce = creator.produce('李');
produce.show()

/**
 * jQuery
 */
class jQuery {
    constructor(selector) {
        let slice = Array.prototype.slice
        let dom = slice.call(document.querySelectorAll(selector))
        let len = dom ? dom.length : 0
        for (let i = 0; i < len; i++) {
            this[i] = dom[i]
        }
        this.length = Len
        this.selector = selector || '';
    }
    append(node) {

    }
    addClass(name) {

    }
    html(data) {

    }
    // 此处省略若干 API

}
window.$ = function (select) {
    return new jQuery(select)
}

/**
 * 单例模式
 * 一个类只有一个实例
 * 系统中唯一被使用
 */
class Single {
    constructor() {

    }
    login() {
        console.log('login...')
    }
}
Single.getInstance = (function () {
    let instance = null;
    return function () {
        if (!instance) {
            instance = new Single();
        }
        return instance;
    }
})();

let obj1 = Single.getInstance();
let obj2 = Single.getInstance();
let obj3 = new Single()
console.log(obj1 === obj2, obj1 === obj3)

/**
 * 适配器模式
 */
class Adaptee {
    constructor(name) {
        this.name = name;
        this.type = '三孔';
    }
    specificRequest() {
        return '220v'
    }
}
class Target extends Adaptee {
    constructor(name) {
        super(name);
        this.type = '二孔'; //覆盖之前不能用的
    }
    specificRequest() { //覆盖之前不能用的
        return `${super.specificRequest()} -> 转换器 -> 12v`;
    }
}
let target = new Target('客厅')
console.log(target)

/**
 * 装饰器模式
 * 为对象添加新功能
 * 不改变原有功能和结构
 */

/**
 * @class By
 */
@decorate //装饰器
class By {
    constructor() {

    }
}
/**
 * @name decorate 装饰器函数
 * @param {*} target 要装饰的类
 */
function decorate(target) {
    target.type = '装饰器'
}
console.log(By.type);

@goBack('return')
class Returns {
    constructor() {

    }
}
function goBack(params) {
    return function (target) {
        target.goBack = params
    }
}
console.log(Returns.goBack);

/**
 * 混入
 */
function mixin(...params) {
    return function (target) {
        Object.assign(target.prototype, ...params)
    }
}
let Foo = {
    foo() {
        console.log('foo')
    }
}
@mixin(Foo)
class myClass {
    static prop = 1;
    constructor() {

    }
}
let mi = new myClass()
mi.foo();

/**
 * 给方法添加修饰
 */
/**
 * @param {*} target 目标类
 * @param {*} name 方法名称
 * @param {*} descriptor Object.defineProperties
 * @returns
 */
function log(target, name, descriptor) {
    let oldValue = descriptor.value; //保存原来的add
    descriptor.value = function () {
        console.log(`${name} - ${[...arguments]}`);
        return oldValue.apply(this, arguments); //运行原来的add
    }
    return descriptor; //返回更改的add
}

class Maths {
    @log
    add(a, b) {
        return a + b;
    }
}
let math = new Maths;
console.log(math.add(1, 3))
/**
 * 第三方 修饰器库 core-decorators
 * github.com/jayphelps/core-decorators
 * npm install core-decorators
 */
// console.info('一般信息')  
// console.warn('警告信息')  
// console.error('错误信息')  

/**
 * 不能直接使用父方法，只能继承父方法后才能使用
 */
class Cart {
    constructor() {
        this.name = new.target.name;
        this.type = this.show();
        this.init();
    }
    init() {
        if (this.type) Object.freeze(this)
    }
    f() {
        if (this.type) throw '不能直接使用这个类，请继承后使用';

    }
    show() {
        return this.name === 'Cart'
    }
}

class Proxys extends Cart {
    constructor() {
        super();
    }
}

let obj = new Cart()
obj.name = 'fff'
console.log(obj)

/**
 * 代理模式
 */

let stat = {
    name: '李xx',
    age: 25,
    open: 13254
}

let broker = new Proxy(stat, {
    get(target, key, receiver) {
        if (key === 'open') {
            return 11111
        } else {
            return Reflect.get(target, key, receiver)
        }
    }
})
console.log(broker.name)
console.log(broker.age)
console.log(broker.open)

/**
 * 外观模式
 */
function far(elem,type,select,fn) {
    if(fn===null){
        fn = select;
        select = null;
    }
}

far('a','b','c',function () {

});

far('a','b',function () {
    
})

/**
 * 观察者模式
 */

 class Observer {
     constructor(params) {
         const _this = this;
         this.state = new Proxy(params,{
             
             set(target,key,value,receiver) {
                let type = Reflect.set(target,key,value,receiver);
                _this.publish(key)
                return type;
             }
         }),
         this.watchers = {};
     }
     init(){
         Object.keys(this.watchers).forEach(key=>{
            console.log(key)
            this.watchers[key].forEach(watch=>{
                console.log(watch)
                watch.update()
            })
         })
     }
     setState(key, value){
        this.state[key] = value;
     }
     publish(key){
        this.watchers[key].forEach(watch=>{
            watch.update();
            console.log(key+'更新了',watch.target)
        })
     }
     addWatch(obj) {
         for(let key in obj){
             let test = /^\{\{[\w]+\}\}$/
             if(test.test(obj[key])){
                 let params = obj[key].replace(/^\{\{|\}\}$/g,'')
                 if(!this.watchers[params]){
                    this.watchers[params] = [];
                 }
                 this.watchers[params].push(new Watcher(obj,key,this.state,params))
             }
         }
         this.init();
         console.log('初始化obj',object)
     }
 }

 class Watcher {
     constructor(target, key, BindingData, BindingKey) {
        this.target = target;
        this.key = key;
        this.BindingData = BindingData;
        this.BindingKey = BindingKey;
     }
     update() {
        this.target[this.key] = this.BindingData[this.BindingKey]
     }
 }

 let object = {
     a:'{{msg}}',
     b:'1',
     c:'{{arr}}'
 }

 let observer = new Observer({
     msg : 1,
     arr:[1,2,3]
 })
 observer.addWatch(object)
 observer.setState('msg', 2)
 

 /**
  * 迭代器模式
  * 循序访问一个集合
  * 使用者无需知道集合的类部结构
  */


class Iterator {
    constructor(params) {
        this.iterator = params.list;
        this.index = 0;
    }
    next() {
        if(this.hasNext()){
            return this.iterator[this.index++]
        }
        return null;
    }
    hasNext() {
        if(this.index<this.iterator.length){
            return true;
        }
        return false;
    }
    forEach(fn){
        while(this.hasNext()){
            let item = this.next();
            let index = this.index-1;
            fn.apply(item,[item,index])
        }
    }
}

class Container {
    constructor(list) {
        this.list = list
    }
    setIterator() {
        return new Iterator(this)
    }
}

let container = new Container(document.querySelectorAll('p'))
let iter = container.setIterator();
iter.forEach(function(i,n){
    console.log(this,i,n)
});

/**
 * 当箭头函数作为参数时 this 为空对象
 */
// function arr(fn){
//     console.log(this)
//     fn()
// }
// arr(()=>{
//     console.log(this)
// })

// function name() {
//     console.log(...arguments)
// }
// name(4,5,6);



let arr = [1,2,3,4,5,6];

function lian(arr,k) {
    let newArr = [...arr];
    if(k===1) return newArr;
    arr.forEach((i,n)=>{
        if(!((n+1)%k)){
            let targetIndex = n-k+1;
            let targetValue = newArr[targetIndex];
            newArr[targetIndex] = i;
            newArr[n] = targetValue;
        }
    })
    return newArr;
	// return arr
}
console.log(lian(arr,2))


function A(arg) {
    this.arg = arg;
}
A.prototype.x = 20;
function B(x) {
    this.x = x;
}
B.prototype = new A(40);

let a = new A('xxx');
let b = new B(30);
console.log(a instanceof Object); //true
console.log(a instanceof A); //true
console.log(b instanceof Object); //true
console.log(b instanceof A); //true

a.x = 30 
console.log(a.x) // 30  自身属性
delete a.x;
console.log(a.x) // 20 隐式原型

console.log(b.x) // 30 自身属性
delete b.x
console.log(b.x) // 20 隐式原型上 class A实例 的隐式原型上的 x

function style(ele) {
    ele.style.cssText = 'font-weight = bold; text-decoration = none; color = #000'
}


