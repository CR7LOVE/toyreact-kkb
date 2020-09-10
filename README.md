#如何学习 react 源码
1. 听课，听完听懂。
2. 看课件，回顾课程内容。
3. 理老师的代码思路。
4. 写出课程内容及细分内容或者实现思路并做笔记，写到这里。每一步都提交，方便回溯。
5. 具体看源码过程中：整体优先，即以老师讲解的优先，细节忽略。
6. 心态：保持平和，即便不能全部掌握，重要的掌握即可，慢慢再补细节。


## 第 1 天总结
#### 一句话总结课堂内容
写一段 jsx ，在页面上渲染出结果。即创建/初始化过程。
#### 过程细分
1. 用 react 官网的 create-react-app 创建一个项目，正常运行后，打开 src，把没啥用的先删除掉，最终只保留 index.js 和 index.css 就行了，保证运行正常。
2. index.js 中 import 了 React 和 ReactDOM。
    21. 实现 ReactDOM.render 方法：接收 JSX 和元素，把 JSX 转为 DOM，追加到元素上。
    ReactDOM.render(<div>init</div>, document.getElementById('root'))  
    说明 ReactDOM 提供了 render 方法用来把 JSX 挂载到某个元素上。
    22. 实现 React.createElement 方法：接收元素，attributes 对象，children，返回 vdom，即一个 js 对象  
    JSX 被编译成 React.createElement()
3. JSX 是原生标签/函数式组件/class 组件 3 种情况时
    31. 原生标签无需特别处理
    32. 函数式组件无需要特别处理
    33. class 组件：需要写 Component 基类  
    创建时区分不同情况即可，其它情况其实还有文本节点，fragment。  
    函数式组件的返回值，class 组件 render() 的返回值都是 JSX。
    
综上，共需要实现三部分：ReactDOM.render，React.createElement 和 Component。 
#### 写代码思路：
1. 实现 React.createElement，完成后在 createElement 中能打印出返回的 vdom 结构
2. 实现 ReactDOM.render, render(jsx, element), 所以有两步
    21. 将 jsx 返回的 vdom 转为 dom
    22. element.appendChild(dom)
    这步完成后，页面就显示出来了。
3. 完成自定义标签（包括函数式组件和 class 组件）和空标签（fragment）。class 组件需要写一个基类 Component