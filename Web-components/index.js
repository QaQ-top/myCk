const regexp = /{{[\w.\[\]]+}}/g // 提取变量模板的正则
document.setComponents = []
window.promiseElement = new Map()

/**
 * @description 创建模板
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @date 2020-07-13
 * @param {String} varTemplate 变量模板
 * @returns 固定模板后的函数，用了随时通过固定模板获取value 
 */
function createVarTemplate(varTemplate) {
    let keysTemplate = varTemplate.replace(/[{{}}]+/g, '')
    return function (data) {
        let keys = keysTemplate.split(/[\[\].]/g)
        let value = null;
        keys.reduce((p, key) => {
            if (key) {
                key = (+key >= 0) ? +key : key
                // value = p?.[key]  // 解决 null[0] undefined[0] 方法一 链式调用
                value = p ? p[key] : p
            }
            return value
        }, data)
        return value
    }
}

/**
 * @description 更新文本节点内容
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @date 2020-07-13
 * @param {HTMLTextAreaElement} textNode 文本节点
 * @param {String} textDate 文本节点内容
 */
function compile(textNode, textDate, $data) {
    let arr = [...textDate.matchAll(regexp)] //获取变量模板get
    arr.forEach(i => {
        let varTemplate = i[0]
        let getValue = createVarTemplate(varTemplate)
        window.target = new Observer(textNode,i,getValue) // 依赖存储在全局 依赖收集了节点，正则数据，固定好模板后的getValue
        let value = getValue($data) // 传入监听后的$data,getValue会读取$data, 通过getter拦截 收集window.target上的Observer
        let information = i.input.replace(varTemplate, `${value}`) 
        textNode.data = information
        window.target = null
    })
}

/**
 * @description 判断节点是否是元素节点
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @date 2020-07-13
 * @param {HTMLElement} node DOM节点
 * @returns {boolean}
 */
function isElement(node) {
    return node.nodeType === 1
}

/**
 * @description 判断节点是否有子节点
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @date 2020-07-13
 * @param {HTMLElement} node DOM节点
 * @returns {boolean}
 */
function isNodes(node) {
    node = [...node.childNodes]
    return node.length > 0
}

/**
 * @description 遍历DOM节点 初始文本节点
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @date 2020-07-13
 * @param {HTMLElement} nodes DOM节点
 */
function parsing(nodes, $data) {
    nodes = [...nodes.childNodes]
    for (let i = 0; i < nodes.length; i++) {
        let child = nodes[i]
        let is_element = isElement(child)
        let is_nodes = isNodes(child)
        if (is_nodes && is_element) {
            this.parsing(child, $data)
        }else {
            let textData = child.data ? child.data.replace(/\s+/, '') : ''
            if(textData){
                compile(child, textData, $data)
            }
            
        } 
    }
}

function proxy(data) {
    const sub = []
    return new Proxy(data,{
        get(target, key, receiver){
            let value = Reflect.get(target, key, receiver)
            if(window.target&&!sub.includes(window.target)){ // 过滤掉已经收集的 和 window.target === null
                sub.push(window.target)
            }
            return value ?? ''
        },
        set(target, key, value, receiver) {
            let has = Reflect.set(target, key, value, receiver)
            sub.forEach(i=>{
                i.update(target) // 加更新后的数据 传入 update, 再次重复getValue 获取固定变量模板 的最新值，并且更新到dom
            })
            return has
        }
    })
}

class Observer {
    constructor(dom,template,getValue) {
        this.textDOM = dom,
        this.textTemplate = template
        this.getValue = getValue
    }
    update(data) {
        let value = this.getValue(data)
        let varTemplate = this.textTemplate[0]
        let information = this.textTemplate.input.replace(varTemplate, `${value}`)
        this.textDOM.data = information
    }
}

function createComponent(options) {
    if(document.setComponents.includes(options.name)) throw `${options.name}已经创建过了`
    class  CreateOneselfComponent extends HTMLElement {  // 继承于HTMLElement
        constructor() {
            super()
            this.name = options.name
            this.$data =  proxy(options.data)  // 将监听后的的data 挂载在dom实例上
            this.template = null;
            this.render()
        }
        render() {
            let template = document.querySelector(options.template) // 获取HTML模板
            template = template.content
            template = template.cloneNode(true) // 克隆模板 保证组件复用 不会发生冲突
            this.template = template
            let shadowDOM = this.attachShadow({ //>可将克隆并且处理后的模板 直接放入元素内 或者 放入Shadow DOM内
                mode:"closed"
            })
            shadowDOM.appendChild(template)
            parsing(shadowDOM,this.$data)  // 编译 并且进行双向数据绑定
            // this.appendChild(template)
            if(!window.promiseElement.get(this.name)) {
                window.promiseElement.set(this.name, new Map())
            }
        }
        connectedCallback() {
            // 元素被添加到文档后，浏览器会调用这个方法
            if(options.connectedCallback){
                options.connectedCallback.call(this)
            }
            window.promiseElement.get(this.name)
                .set(this.id, new Promise((resolve, reject) => {
                    resolve(this)
                }))

        }
        disconnectedCallback() {
            // 元素从文档移除后，浏览器触发这个方法
            if(options.disconnectedCallback){
                options.disconnectedCallback.call(this)
            }
        }
        static get observedAttributes() {
            // 属性数组，这些属性的变化会被监视,也就是对某个属性变化实行监听
            return options.observedAttributes instanceof Array ? [...options.observedAttributes] : []
        }
        attributeChangedCallback(key, oldValue, newValue) {  // 如果HTML部分定义了被监听的属性,页面渲染时会默认在connectedCallback前触发一次  oldValue === null
            // 当上面数组里面的属性发生变化后，会触发这个方法
            if(options.attributeChangedCallback){
                options.attributeChangedCallback.call(this)
            }
        }
        adoptedCallback() {
            // 元素被移动到新的文档的时，会触发这个方法
            if(options.adoptedCallback){
                options.adoptedCallback.call(this)
            }
        }
        reinstall(data) {
            Object.assign(this.$data,data)
        }
    }

    // 创建组建
    window.customElements.define(options.name, CreateOneselfComponent) // 组件创建后，每次在页面上添加一个标签， 他就会 实例化一个 CreateOneselfComponent
    
    document.setComponents.push(options.name)
}


