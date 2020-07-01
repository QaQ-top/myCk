
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

const asynchronous = function (callback) { // 异步执行 回调
    switch (true) {
        case Boolean(MutationObserver):
            let counter = 1
            const observer = new MutationObserver(callback); // 生成一个监听DOM节点变化的对象
            const textNode = document.createTextNode(String(counter)) // 生成文本节点
            observer.observe(textNode, { //监听文本节点的 data 改变
                characterData: true
              })
            ++counter;
            textNode.data = String(counter); // 文本节点的 data 改变 异步调用(微任务)执行创建时传入的 callback
            break;
        case window.setImmediate:
            window.setImmediate(callback, 0);
            break;
        default:
            window.setTimeout(callback, 0);
            break;
    }
}


class Member {
    static PENDING = 'pending' // 等待
    static RESOLVE = 'resolve' // 成功
    static REJECTED = 'rejected' //拒绝
    constructor(execute) {
        this.state = Member.PENDING; //状态
        this.value = null; //成功值
        this.reason = null; //失败元素

        // 如果resolve(value) reject(error) 方法是异步调用的，我们应该将then catch finally 的回调储存 
        // 也就是 pending<等待> 状态时 实例就调用了then catch finally方法 我们应该将回调储存 等到状态改变时再去 触发回调
        this.callbacks = []; 

        // 模拟 Promise 内部语法错误也会被 reject<拒绝> 捕获
        try {
            execute(this.resolve.bind(this), this.reject.bind(this));
        } catch (error) {
            this.reject(error)
        }
    }
    isMember(resolve,argument){
        if((argument instanceof Member)){
            argument.then(res=>{ // 如果 argument 是 Member 对象 就捕获 成功或者失败
                resolve(res); //这里的 resolve  是传过来的的 resolve  也就是then catch finally 方法返回的 Member 对象的resolve;
            },err=>{
                resolve(err);
            }) 
        }else{
            resolve(argument);// argument 不是 Member 对象 将回调函数的返回值作为 参数 给抛出的Member 对象
        } 
    }
    resolve(value) {
        if (this.state === Member.PENDING) { // 限制 状态改变 不能改变多次
            this.state = Member.RESOLVE; // 成功
            this.value = value //接收成功值
            if(this.callbacks.length>0){
                this.callbacks.forEach(callback=>{ // 状态是异步改变的 就执行之前收集的回调
                    callback.onFul ? asynchronous(_=>{
                        // 模拟 then 内部语法错误 将会被 错误捕获
                        try {
                            let argument = callback.onFul(this.value);
                            this.isMember(callback.resolve,argument);
                        } catch (error) {
                            let argument = callback.onErr ? callback.onErr(error) : undefined;
                            this.isMember(callback.resolve,argument);
                        }
                    }) : null;
                    callback.onFinally ? asynchronous(_=>{
                        let argument = callback.onFinally(this.value);
                        this.isMember(callback.resolve,argument);
                    }): null;
                })
            }
        }
    }
    reject(reason) {
        if (this.state === Member.PENDING) { // 限制 状态改变 不能改变多次
            this.state = Member.REJECTED; // 拒绝
            this.reason = reason; // 接收拒绝因素
            if(this.callbacks.length>0){
                this.callbacks.forEach(callback=>{ // 状态是异步改变的 就执行之前收集的回调
                    callback.onFinally ? asynchronous(_=>{
                        let argument = callback.onFinally(this.reason);
                        this.isMember(callback.resolve,argument);
                    }): null;
                    callback.onErr ? asynchronous(_=>{
                        let argument = callback.onErr(this.reason);
                        this.isMember(callback.resolve,argument);
                    }): null;
                })
            }
        }
    }
    then(onFul,onErr) {
        return new Member((resolve, reject)=>{
            switch (true) {
                case this.state === Member.RESOLVE: // 成功
                    asynchronous(()=>{
                        // 模拟 then 内部语法错误 将会被 错误捕获
                        try {
                            let argument = onFul ? onFul(this.value) : undefined; // 判断有无成功的回调 有就直接调用 传递 成功值
                            this.isMember(resolve,argument);
                        } catch (error) {
                            let argument = onErr ? onErr(error) : undefined; 
                            this.isMember(resolve,argument);
                        }
                    })
                    break;
                case this.state === Member.REJECTED: // 拒绝
                    asynchronous(()=>{
                        let argument = onErr ? onErr(this.reason) : undefined; // 判断有无失败的回调 有就直接调用 传递 拒绝因素
                        this.isMember(resolve,argument);
                    })
                    break;
                default: // 否则 处于 pending<等待> 储存回调 后续状态改变时调用 并且传入抛出的Promise 的resolve 
                    onFul ? this.callbacks.push({onFul:onFul, onErr:onErr, resolve}) : undefined;
                    break;
            }
        })
    }
    catch(onErr){
        return new Member((resolve,reject) => {
            if(this.state === Member.REJECTED){ // 拒绝
                asynchronous(()=>{
                    let argument = onErr ? onErr(this.reason) : undefined; // 判断有无失败的回调 有就直接调用 传递 拒绝因素
                    this.isMember(resolve,argument);
                })
            }else if(his.state === Member.PENDING){ // 否则如果 处于 pending<等待> 储存回调 后续状态改变时调用 并且传入抛出的Promise 的resolve 
                onErr ? this.callbacks.push({onErr:onErr,  resolve}) : undefined;
            }
        })
    }
    finally(onFinally){
        return new Member((resolve, reject) => {
            if(this.state !== Member.PENDING){ // resolve<成功> 或者 rejected<拒绝> 都会执行
                let final = this.reason ? this.reason : this.value; // 获取信息
                asynchronous(()=>{
                    let argument = onFinally ? onFinally(final) : undefined;
                    this.isMember(resolve,argument);
                })
            }else{ // 否则 处于 pending<等待> 储存回调 后续状态改变时调用 并且传入抛出的Member 的resolve 
                onFinally ? this.callbacks.push({onFinally:onFinally, resolve}) : null;
            }
        });
    }
}






export default Member
