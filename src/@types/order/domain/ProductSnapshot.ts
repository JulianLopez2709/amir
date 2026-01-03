export interface ProductSnapshot {
  id: number
  name: string
  price: number
  optionsSelected: SelectedVariant[]
}


export interface SelectedVariant {
  options: Option[]
  variantName: string
}


interface Option {
  name: string
  optionId: number
  extraPrice?: number
}