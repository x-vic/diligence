1. useObservableCallback 从事件中得到原始流

```ts
// handleTouchMove 绑定到事件当中去
const [handleTouchMove, move$] = useObservableCallback((e$) => e$)
```

2. useObservable 得到一个不受闭包影响的流

```ts
const y$ = useObservable(() => interval(1000))
```

3. useSubscription 监听流，修改值

```ts
const [y, setY] = useState(0)
useSubscription(y$, setY)
```

4. useObservableState 从事件中直接得到值

```ts
const [y, handleTouchStart] = useObservableState((start$) => {
  return start$.pipe(
    map(({ touches: [{ pageY }] }) => {
      // 拿到原来的值
      const attr = ulRef.current.style.transform as string
      const transformY = +attr.slice(11, attr.length - 3)
      return pageY - transformY
    }),
    switchMap((top: number) => {
      return move$.pipe(
        takeUntil(end$),
        // 计算偏移量
        map(({ touches: [{ pageY }] }) => {
          return pageY - top
        }),
        // 处理边界
        map((y) => {
          const min = -40 * (configs.length - 6)
          const max = 40 * 5
          if (y > max) return max
          if (y < min) return min
          return y
        })
      )
    })
  )
}, null)
```
