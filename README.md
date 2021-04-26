
## monorepo 项目demo

### 文档

[多项目逻辑复用与monorepo](https://www.shymean.com/article/多项目逻辑复用与monorepo)

### 预览步骤
```
# 安装依赖
yarn

# 启动react-app1
yarn workspace react-app start
```

### 创建步骤
初始化package.json
```
yarn init -y
```

修改package.json，配置`workspaces`字段
```json
{
  "name": "monorepo-demo",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "private": true,
  "workspaces": [
    "packages/*"
  ]
}
```

初始化 lerna
```
lerna init
```

创建第一个公共模块mod1

```
# 创建的默认版本是0.0.0
lerna create mod1 -y
```

修改一下mod1的源码`packages/mod1/lib/mod1.js`
```js
module.exports = mod1;

function mod1() {
    console.log('mod1 ')
}
```
然后再创建一个应用模块，这里使用`create-react-app`创建

```
# 等他安装一会
cd packages && create-react-app react-app

# 启动项目
yarn workspace react-app start
```

为react-app项目模块安装刚才创建的mod1模块

```
yarn workspace react-app add mod1@0.0.0
```

修改代码试试，`packages/react-app/index.js`

```js
import mod1 from 'mod1'
mod1()
```

大工告成，我们创建了第一个可用的模块

接下来创建一个react组件模块`u-button`
```
lerna create u-button -y
```
这次我们导出一个button组件，`packages/u-button/lub/u-button.jsx`(记得修改u-button模块package.json的main入口字段)
```jsx
import React from 'react'
const Button = ()=>{
    const text = 'hello'
    return (<button>{text}</button>)
}
export default Button
```
如法炮制，向react-app添加u-button的依赖，

```
yarn workspace react-app add u-button@0.0.0
```
然后引入，
```jsx
import UButton from 'u-button'
const node = <UButton />
```

不出意外，会看见下面的错误

```
File was processed with these loaders:
 * ../../node_modules/@pmmmwh/react-refresh-webpack-plugin/loader/index.js
You may need an additional loader to handle the result of these loaders.
| const Button = ()=>{
|     const text = 'hello'
>     return (<button>{text}</button>)
| }
|
```

这是因为`create-react-app`默认的babel配置排除了node_modules,，我们需要放开其限制

```
yarn workspace react-app add customize-cra react-app-rewired -D
```
关于`customize-cra`和`react-app-rewired`的具体使用这里不详细展开，大致步骤
* 在`react-app`项目目录下创建`config-overrides.js`
```js
const {babelInclude} = require('customize-cra')
const path = require('path')
module.exports = (config, env) => {
    // 各个workspace直接输出原始代码，因此需要加入babel
    babelInclude([
        path.resolve('../../packages'),
    ])(config)
    return config
}
```
* 使用`react-app-rewired`替换`react-app`的package.json下的相关指令
```json
"scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
}
```

然后重新启动项目即可
```
yarn workspace react-app start
```

![](http://img.shymean.com/oPic/1619452346670_901.png)

修改`u-button`模块中的内容，也能体验到热更新的开发体验，完美


我们再创建一个新的react项目，取名为`react-app2`，

react-app与react-app2都可以使用刚才的公共模块mod1、u-button，甚至是`customize-cra`覆盖的开发环境
```
yarn workspace react-app2 add mod1@0.0.0
```

愉快地编码吧~




