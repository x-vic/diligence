1. 什么时机去修改 context？
   事件里面定义 action 数组、状态节点中定义 entry、exit 钩子数组  
   actions 是具体写业务的地方、其他地方都是在构建流程图

```js
// 场景一：事件中
on: {
  TRIGGER: {
    target: 'active',
    // 转换 actions
    actions: ['activate', 'sendTelemetry']
  }
}

// 场景二：状态节点中
active: {
  // 进入 actions
  entry: ['notifyActive', 'sendTelemetry'],
  // 退出 actions
  exit: ['notifyInactive', 'sendTelemetry'],
  on: {
    STOP: { target: 'inactive' }
  }
}
```

2. 同一个事件、不同的条件下如何转换到不同的节点？
   一个事件，两个目标，通过守卫来控制具体转移到哪个状态

```js
answer: {
  on: {
    // 一个事件，两个目标，通过守卫来控制具体转移到哪个状态
    next: [
      {
        target: 'question',
        cond: (ctx) => ctx.tasks.length > ctx.currentIndex + 1,
      },
      // 由自状态转换到父状态
      { target: '#task.completed' },
    ],
  },
}
```

3. 子状态如何转移到父状态？
   通过 **#root.parentState**

```js
answer: {
  on: {
    next: [
      // 由子状态转换到父状态
      { target: '#task.completed' },
    ],
  },
}
```
