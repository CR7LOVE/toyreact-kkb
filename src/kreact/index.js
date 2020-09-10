import {TEXT} from "../shared/const";

// TODO: createText 这个结构还有 content 没有完全想好，下一步做的时候再来改这里
function createText(text) {
    return {
        type: TEXT,
        content: text
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
            children: children.map(child => typeof child === 'string' ? createText(child) : child)
        }
    };
    console.log('res', res);
    return res;
}

export default {
    createElement
};