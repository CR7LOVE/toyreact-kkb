class Component {
    static isReactComponent = {}; // 源码中没有写成 boolen，就跟着源码了
    constructor(props) {
        this.props = props;
    }
}

export {
    Component
}