import {TEXT} from "../shared/const";

function createDOMAccordingToType(tagName) {
    let result;
    if (tagName === TEXT) { // 文本
        result = document.createTextNode('');
    } else if (typeof tagName === 'string') { // div, p, span 这些原生标签
        result = document.createElement(tagName);
    } else if(typeof tagName === 'function') {
        result = createNode(new tagName().render()) // class 组件
    }
    return result;
}

function addAttributesToDOM(props, result) {
    for(const prop in props) {
        if(Object.prototype.hasOwnProperty.call(props, prop)) {
            if(prop !== 'children') {
                result[prop] = props[prop];
                // 不能使用 result.setAttribute(prop, props[prop])，因为 text 类型没有 setAttribute，element 类型有。
                // 统一一下使用了上述方法。
            }
        }
    }
}

function addChildrenToDOM(props, result) {
    if(props && props.children) {
        for(let child of props.children) {
            render(child, result);
            // 也可以也成下面这两步。最初没反应过来时，我就写了两步，其实一样的。render 就是对下面两步的封装。
            // child = createNode(child);
            // result.appendChild(child)
        }
    }
}

// 将 vnode 转为 真实 dom
function createNode(vnode) {
    let result; // 即 node
    const { type, props } = vnode;

    // 1. 根据不同的 type 生成对应的 dom
    result = createDOMAccordingToType(type);

    // 2. 遍历属性，把属性添加到元素上
    addAttributesToDOM(props, result);


    // 3. 遍历 children，
    addChildrenToDOM(props,result);

    return result;
}

function render (vnode, element) {
    const node = createNode(vnode);
    element.appendChild(node);
}

export default {
    render
};