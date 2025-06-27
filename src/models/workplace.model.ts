export interface Workplace {
  id: string
  name: string
  color: string
  editable?: number
}

export interface WorkplaceForSetting extends Workplace {
  enabled?: boolean
}
