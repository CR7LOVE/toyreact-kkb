import { Component } from "./Component";
import {TEXT} from "../shared/const";

// 创建 text 类型的 vdom，注意把 textContent 写到了 nodeValue 上，这样是为了代码方便，也可以不这样做
// 初始化节点时 textContent 设置的是空，这样做以后，扫描属性时，就巧妙的修改了 textContent
function createText(textContent) {
    return {
        type: TEXT,
        props: {
            nodeValue: textContent,
            children: []
        }
    }
}

function createElement (tagName, attributes, ...children) {
    let clonedAttributes = {
        ...attributes
    };
    delete clonedAttributes.__self;
    delete clonedAttributes.__source;
    const res =  {
        type: tagName,
        props: {
            ...clonedAttributes,
            children: children.map(child => typeof child === 'object' ? child : createText(child))
        }
    };

    // 类组件 defaultProps 的情况
    if(tagName && tagName.defaultProps) {
        let props = tagName.defaultProps;
        for(let prop in props) {
            if(Object.prototype.hasOwnProperty.call(props, prop)) {
                if(res.props[prop] === undefined) {
                    res.props[prop] = props[prop]
                }
            }
        }
    }

    // console.log('res', res);
    return res;
}

export default {
    createElement
};

export {
    Component
}