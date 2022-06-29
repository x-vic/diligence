export interface IGroupSequence {
  name: string
  sequence: Array<IGroup>
}

export interface IGroup {
  name: string
  progress: Progress
}

export enum Progress {
  idle,
  underway,
  fulfill,
}

export class groupSequence {
  public name = 'diligence'
  public sequence = []
}
