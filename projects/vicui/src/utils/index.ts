type ClassNames = Array<string | Record<string, boolean>>

export const cn = (classNames: ClassNames) => {
  let res = ''
  for (const className of classNames) {
    if (typeof className === 'string') {
      res += ' ' + className
    } else {
      for (const key in className) {
        if (className[key]) res += ' ' + key
      }
    }
  }
  return res
}
