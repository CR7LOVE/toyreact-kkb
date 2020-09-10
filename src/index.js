// import React, {Component} from 'react';
// import ReactDOM from 'react-dom';

import React, { Component } from './kreact';
import ReactDOM from './kreact-dom';
import './index.css';

// 测试 class 组件
class ClassComponent extends Component {
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
    return <div className="border">{name}</div>
}

ReactDOM.render(
    <div id="a">
        <p>a</p>

        <p>b</p>

        init

        <ClassComponent name="class component" />

        <FunctionComponent name="function component" />

        <>
            <p>fragment1</p>
            <p>fragment2</p>
        </>
    </div>,
    document.getElementById('root')
);

