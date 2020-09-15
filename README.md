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


### 第 2 天总结
#### 一句话总结课堂内容
在初次渲染的过程中（今天仍然没有更新过程），在 requestIdleCallback 回调中，利用 vdom 生成 fiber 架构，然后将生成的 fiber 架构关系转换到真实的节点中并展示到页面上。

#### 过程细分
1. 回顾第 1 天内容  
第 1 天的内容中，vdom 已经形成。  
一个细节是，如果在 ReactDOM.render() 之前打印一段 jsx，虽然会得到 vdom，但是，  
假设这个 jsx 中存在自定义元素叫 A，那么，打印的内容中，会有 A 的 vdom，但是不会有 A 的 render 函数的 vdom。  
A 的 render 函数的 vdom 在 ReactDOM.render() 执行之后才有。  
因为 ReactDOM.render() 执行时会将 vdom 转为真实 dom，此过程中，会判断 vdom 类型。  
如果是自定义组件，并且是 class 组件，会 new Class 并且执行 render() 拿到 vdom，然后再去生成真实 dom 并挂载。  
如果是自定义组件，并且是 function 组件，执行此函数拿到 vdom，然后再去生成真实 dom 并挂载。  
所以，自定义元素的 vdom 是在 ReactDOM.render() ，即挂载时才去解析成 vdom -> dom -> 挂载。

2. 利用 requestIdleCallback api，在 requestIdleCallback 回调中，利用 vdom 生成 fiber，并根据 fiber 结构生成建立真正的 dom 结构并添加到页面上。   

3. 第一阶段，利用 vdom 生成 fiber 阶段：  
    31. day 1 中 ReactDOM.render 的函数体中很明显：将 vnode -> node；将 node 插入到元素中。  
    而今天，函数体中变成了初始化首个 fiber (wipRoot) 与 下一个 fiber (nextUnitOfWork)。  
    初始的 fiber 是 ReactDOM.render() 的参数。
    32. fiber 架构的形成是个循环的过程，从 src/index 中挂载的根元素开始。  
    过程中会对 元素类型 进行判断，不同的类型都去 reconcileChildren 以形成链表。  
    类型分 3 种，原生标签, class 组件和 function 组件。  
    原生标签还会建立真正的 dom 元素以便后期使用。 
    33. fiber 是个链表结构，是加强版的 vdom，仍然是个对象，但是有了几个指向。具体结构类型在代码注释中有。      
    34. fiber 中 children 与 child 属性都有。children 属性从 vdom 衍生而来，用于生成 child 和 sibling。之后就没啥用了。生成 dom 并不需要 children。      
    35. fiber 结构中 "自定义元素自己的内容" 是放在自己 fiber 的 child 下的。而在第 1 节课中，vdom 结构并没有体现出自定义元素自己的内容，因为 vdom 自定义元素的解析是在 ReactDOM.render() 执行时才判断元素类型，如果是自定义元素，那么会将其返回的 vdom 生成真实 dom，插入到父元素下。  
所以，vdom 中体现不出来完整的结构。但 fiber 体现出来了。
    36. 最后，可以在 workLoop() 中的第二步打印一下形成的 fiber 架构，看是否正确。
    
4. 第二阶段，根据 fiber 结构建立真正的 dom 结构添加到页面上：  
其实，根据 fiber 结构建立 dom 结构与根据 vdom 建立 dom 结构，我觉得两者非常相似，都可以总结为，  
有了一个结构，然后根据这个结构生成 dom。只不过 vdom 是树，而 fiber 是链表，所以细节上不一样而已。


#### 写代码思路：
1. react-dom/index.js 中添加 requestIdleCallback() 并写 requestIdleCallback 的回调

2. 回调中做两个事情：
    21. 形成 fiber 架构，即从 nextUnitOfWork（下一个 fiber） 这个 fiber 开始，一直循环，最终形成 fiber 架构。在循环中，performUnitOfWork 函数做两件事：  
        211. 更新当前 fiber 架构  
        更新当前 fiber 架构时，要区分原生标签还是自定义元素（ function 组件/ class 组件）。  
        如果是 function 组件，利用函数返回的 vdom 作为 children 执行 reconcileChildren，即为父元素添加 child ，为 child 添加 sibling... 以形成fiber 架构  
        如果是 class 组件，利用 render() 返回的 vdom 作为 children 执行 reconcileChildren  
        如果是 原生标签，直接调用  reconcileChildren() 生成 fiber 架构。小细节是，先生成一下真实 node，node 是 fiber 架构的一部分。前两个都不可能有 node。  
        212. 返回下一个要更新的 fiber，以保证循环持续进行。  
        优先返回 fiber.child，没有的话返回 fiber.sibling，再没有的话，找 fiber 的父元素。  
        找到后，父元素必然已经形成了 fiber，父元素的 child 必然已经形成了 fiber，所以应该返回父元素的 sibling。 
        213. 在 workLoop() 中的第二步打印一下形成的 fiber 架构，看下是否正确，ok 的话再去执行下一步。    
    22. 将 fiber 架构的关系应用到真实 dom 中。因为 fiber 是链表，所以，具体过程是一个递归，将"当前 fiber"，"当前 fiber 的 child"，"当前 fiber 的 sibling" 追加到相应的父元素下，
        一直循环递归。
        
### 第 3 天总结
更新过程，没有写老的 setState，而是写的 useState 这个 hook 的源码。  
先用 useState 写一个简单的 demo，包括 setState，ok 的话，再注释掉官方的 useState，写自己的 useState。

#### 一句话总结课堂内容


#### 过程细分
1. 先写 useState demo，包含点击时的 setState，确保 ok 后，换成自己的 useState。
2. setState() 执行时，怎样触发界面更新？
3. 因为初始化 fiber 时用的是 requestIdleCallback()，所以，首先在 workLoop 中仍然添加上 requestIdleCallback() ，否则更新阶段就无法更新了。
4. 在 useState 的 setState 函数中，想办法让 nextUnitOfWork 有值，这样才能继续工作。以前初始化完以后，此变量已经成 falsy 值了。
5. 其实就是让 nextUnitOfWork 再次接收初始 wipRoot，但是 wipRoot 被清除了，所以，用另一个变量做 wipRoot 的备份，  
    赋值给 nextUnitOfWork 以便 workLoop 中的 while 循环能成立以执行。
6. setState 重新触发了 workLoop() 中的 while() 中的 performUnitOfWork，在此函数中，会形成或更新 fiber 架构。  
    其中会根据元素类型分别形成架构，所以有 updateFunctionComponent()。
    在此函数中，会执行函数，执行函数时 useState 函数必然会执行。所以，updateFunctionComponent() 这里很关键。
    应该在这里添加关于 hook 的东西，毕竟 hook 是要纪录和更新值的。  
7. 添加之前，先添加 wipFiber 全局变量，用来表示当前正在工作的 fiber，然后在 updateFunctionComponent 中初始化它，  
    添加 hooks 和 hooksIndex 变量。  
8. wipFiber.hooks 和 wipFiber.hooksIndex 变量已经有了，它俩的值必然是 useState 中的东西。
    hooks 会 push 某个 hook，hook 是个对象，包含了 state(当前状态值) 和 queue(要更新的值)。
9. reconcileChildren() 中添加 base 和 diff
10. 在 addAttributesToDOM() 中添加 on 事件 
11. fiber 更新架构已经形成，可以重构 commitWorker 了，添加 UPDATE 逻辑。注意 updateNode() 多了一个参数是旧的 props
12. 以上已经能展示并且更新 button 了，接下来添加删除逻辑


#### 写代码思路：
1. 先写 useState demo，包含点击时的 setState，确保 ok 后，换成自己的 useState。
2. workLoop 中添加 requestIdleCallback()
3. useState 的 setState中，让 nextUnitOfWork = wipRoot 以重启 workLoop(), 而 wipRoot 因为被清，  
    所以，添加全局 currentRoot 变量，实质是 wipRoot 的备份。
4. 添加 wipFiber 全局变量，在 updateFunctionComponent() 中初始化 wipFiber。
5. useState 中写 hook 对象，添加到上一步 wipFiber 下。顺便把 oldHook 逻辑和 newHook 都写上。
6. reconcileChildren() 中添加 base 和 diff
7. 在 addAttributesToDOM() 中添加 on 事件
8. commitWorker 中添加 UPDATE 逻辑，重构 updateNode()，添加旧 props 参数
9. 展示和更新已经 ok。添加删除逻辑。
