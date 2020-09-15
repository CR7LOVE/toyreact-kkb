import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {useState} from "react";

// import React, { Component } from './kreact';
// import ReactDOM from './kreact-dom';

import './index.css';

// 测试 class 组件
class ClassComponent extends Component {
    static defaultProps = {
        color: 'pink'
    };

    render() {
        return (
            <div className="border">
                {this.props.name}
                <p className={this.props.color}>color omg</p>
            </div>
        );
    }
}

// 测试 function 组件
function FunctionComponent({name}) {
    const [count, setCount] = useState(0);

    return (
    <div className="border">
        {name}
        <button onClick={() => setCount(count + 1)}>{count}</button>
    </div>)
}

ReactDOM.render(
    <div id="a">
        <p>a</p>

        <p>b</p>

        init

        <ClassComponent name="class component" />

        <FunctionComponent name="function component" />
    </div>,
    document.getElementById('root')
);

