import {PLACEMENT, TEXT} from "../shared/const";

function createDOMAccordingToType(tagName, props) {
    let result;
    if (tagName === TEXT) { // 文本
        result = document.createTextNode('');
    } else if (typeof tagName === 'string') { // div, p, span 这些原生标签
        result = document.createElement(tagName);
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

// 将 vnode 转为 真实 dom
function createNode(vnode) {
    let result; // 即 node
    const { type, props } = vnode;

    // 1. 根据不同的 type 生成对应的 dom
    result = createDOMAccordingToType(type, props);

    // 2. 遍历属性，把属性添加到元素上
    addAttributesToDOM(props, result);

    // day1 这里有遍历 children，现在没有了，因为有了 fiber 架构，最后会根据 fiber 架构逐个添加

    return result;
}

let wipRoot = null; // work in progress fiber
let nextUnitOfWork = null; // fiber for loop

// fiber 结构：
// type: 类型
// props:
// key

// child: 第一个孩子
// sibling: 兄弟
// return：父元素

// node: 真实 dom 节点
// base: 当前元素，本次没用到

function render (vnode, element) {
    // 初始化第一个 fiber 和用于循环的 fiber
    wipRoot = {
        props: {
            children: [vnode]
        },
        node: element,
        base: null
    };

    nextUnitOfWork = wipRoot;
}

// 遍历 children，为当前节点形成 fiber 架构
function reconcileChildren(fiber, children) {
    let prevSibling = null;
    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        let newFiber = {
            type: child.type,
            props: child.props,
            node: null,
            base: null,
            return: fiber,
            effectTag: PLACEMENT, // 注意有个 effectTag，整个对象要注意一下
        };
        if (i === 0 ) {
            fiber.child = newFiber;
        } else {
            prevSibling.sibling = newFiber;
        }
        prevSibling = newFiber;
    }
}

function updateClassComponent(fiber) {
    const { type, props } = fiber;
    const children = [(new type(props)).render()];
    reconcileChildren(fiber, children);
}

function updateFunctionComponent(fiber) {
    const { type, props } = fiber;
    const children = [type(props)];
    reconcileChildren(fiber, children);
}

function updateHostComponent(fiber) {
    // 细节：fiber.node
    if (!fiber.node) {
        fiber.node = createNode(fiber); // 注意这里使用了 createNode
    }
    const { children } = fiber.props;
    reconcileChildren(fiber, children)
}

function performUnitOfWork(fiber) {
    // 1. 为当前 fiber 形成结构，或者说更新当前 fiber
    const { type } = fiber;
    if (typeof type === 'function') {
        type.isReactComponent ? updateClassComponent(fiber) : updateFunctionComponent(fiber);
    } else {
        // 原生标签
        updateHostComponent(fiber);
    }

    // 2. 返回下一个 fiber 用于执行
    if (fiber.child) {
        return fiber.child;
    }

    let nextFiber = fiber;
    while(nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling;
        }
        nextFiber = nextFiber.return;
    }
}

function commitWorker(fiber) {
    if (!fiber) { // 不写会死循环
        return;
    }

    let parentNodeFiber = fiber.return;
    while(!parentNodeFiber.node) {
        parentNodeFiber = parentNodeFiber.return;
    }
    const parentNode = parentNodeFiber.node;
    if (fiber.effectTag === PLACEMENT && fiber.node !== null) { // 不写会报错
        parentNode.appendChild(fiber.node);
    }

    commitWorker(fiber.child);
    commitWorker(fiber.sibling);
}

function commitRoot() {
    console.log('fiber 架构', wipRoot);
    commitWorker(wipRoot.child);
    wipRoot = null;
}

function workLoop(idleDeadline) {
    // 1. 形成 fiber 架构，注意这里有循环
    while (nextUnitOfWork && idleDeadline.timeRemaining() > 0) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }

    // 2. 根据 fiber 架构形成 dom 关系，渲染到页面上
    // 解释一下 !nextUnitOfWork：
    // 假设最后一个子节点有文本节点，那么，在 performUnitOfWork 中，想返回要一个节点时，
    // 找 child ，没有
    // 找 sibing，没有，再找父元素
    // 父元素中找 sibing，没有，再找父元素....
    // 最后找到 container，container 的父元素是 undefined，所以 while 循环终止，至此也没返回任何值，即返回值是 undefine
    if (!nextUnitOfWork && wipRoot) {
        commitRoot();
    }

    // 初始化阶段写不写这个没关系，但是，如果点一个按钮要更新界面的话，还是要写这个的。
    // 否则的话，此函数执行完，就不会再被触发了。
    window.requestIdleCallback(workLoop);
}

window.requestIdleCallback(workLoop);

export function useState(init) {
    const setState = action => {

    };
    return [init, setState]
}

export default {
    render
};