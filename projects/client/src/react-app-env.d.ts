declare interface SvgrComponent
  extends React.PureComponent<React.SVGAttributes<SVGElement>> {}
declare module '*.svg' {
  const content: SvgrComponent
  export default content
}
