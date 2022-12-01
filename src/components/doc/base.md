
这里只做简要的说明指引，具体内容自己结合代码理解

## WidgetBase

对应的代码路径为/components/Base/widget.ts

是所有widget的父类，里面有一些通用的函数

## App.vue

app.vue是整个项目的入口文件，可以首先看这里，在appvue中主要是写主页面的逻辑

添加删除widget，布局，包括一些数据传递等等，app可以理解为main程序

## WindowsApp.vue

对应的就是edit窗口，edit窗口的具体用法已经在各个widget中介绍过了

## app和windows如何交互

重点关注EditData，base下面有一个EditData的interface，每一个Widget都有一个自己的EditData

edit窗口需要什么数据，显示什么，主要就是根据EidtData来的

## 实现一个简单的Widget

1. 首先在components文件夹下面新建一个widget文件夹
2. 创建vue文件，`继承widget基类`，编写html，在html的最外层要有一个这样的div
````
<div  class="container" id="RightClick">
````
class是app会用到，id则对应右键菜单栏，要绑定在最外层

3.html中还需要添加右键菜单的component

````
<rightClickMenu ref="rightClickMenu" @del="del" @openWindows="openWindows"></rightClickMenu>
````

4.参照LabelStatus，label应该是最基础的功能，基本功能widget都实现了，可以看到label里面非常感觉，基本上没有需要复写的函数

5.配置自己需要的EditData，其中props里面配置的变量会作为输入框显示在edit窗口里面
