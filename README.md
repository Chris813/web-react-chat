# web-react-chat

一个前后端分离的网页端即时通讯平台

技术栈：vite+ts+react+express+prisma+mongodb

# 前端

路由：

编程式导航

将 useContext 提供身份认证上下文，封装成 useAuth 钩子。导航守卫使用其中的 user 判断用户是否登录，若为登录可提供受保护视图，否则转到登录页面

状态管理：

因为需要共享的状态不是很多也不复杂，状态主要是通过 useContext 实现。将 useContext 封装成 use 钩子可以全局使用

提供了三个 use 钩子：

- useAuth：身份认证
  - 记录 user 变量，代表登录用户
  - 封装登录注册相关方法
  - useMount 每次刷新后从 localstorage 获取 token 向服务器获取用户信息
- useConv：聊天信息，用于在聊天界面和边栏预览，以及实时推送
  - 记录 conversation
  - 提供 conversation 和 setconversation 方法
- useSocket：实时收发消息
  - 注册 socket 客户端
  - 提供接收的信息

页面：

- 登录页
- 头像页
- ⭐ 聊天页

socket 实时：

- 客户端和服务端建立一条全双工的 websocket 连接
- 用户之间互相发送的消息全部发往服务端，再由服务端推送到接收用户或群组
- 客户端接收到的消息会更新 conversation 状态中对应 id 的聊天中，在其它需要显示新消息的组件中都能接收

# 鉴权

前端：

前端封装登录/注册 api，成功后后端返回 jsw，存储到 loacalstorage，设置全局的 user 变量

后端：

- 注册

  - 验证注册信息
  - bcrypt 库加密密码存入数据库
  - 根据用户 id 生成 jwt 发送给前端，

- 登录

  - 验证登录信息
  - 数据库查找
  - 对比密码
  - 生成 jwt 并发送

- 保护
  - 从授权头中获取 jwt
  - 解码 jwt 后，得到 userid，到数据库查找有没有该用户

# 后端

## 数据库

采用 Mongodb：

MongoDB 是一个非关系型数据库，而且提供了面向文档的存储方式。由键值对组成的 BSON 文档，类似 JSON 对象

Prisma：ORM 对象关系映射。借助 ORM 可以通过示例对象的语法完成关系型数据库的操作。ORM 封装了数据库操作，可以不写 sql 语言，使用面向对象编程，与数据对象直接交互，不用关心底层数据库。

优点：

使用 Prisma Schema Language，轻松定义数据模型；

自动生成数据库访问客户端，借助它提供的 api 操作数据库

数据库设计：User；Account；Conversation；Message

# 其它

跨域：使用 cors 中间件，配置 origin
