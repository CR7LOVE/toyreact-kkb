// import React, {Component} from 'react';
// import ReactDOM from 'react-dom';

import React, { Component } from './kreact';
import ReactDOM from './kreact-dom';
import './index.css';

// 测试 class 组件
class ClassComponent extends Component {
    render() {
        return <p>这是 ClassComponent</p>
    }
}

// 测试 function 组件
// function FunctionComponent() {
//     return <p>这是 FunctionComponent</p>
// }

// <FunctionComponent/>
//
// <>
// <p>fragment1</p>
// <p>fragment2</p>
// </>

ReactDOM.render(
    <div id="a">
        <p>a</p>
        <p>b</p>
        init
        <ClassComponent/>

    </div>,
    document.getElementById('root')
);

