import { Consumable } from './consumable'

export interface Layer {
    id: number,
    layer: string,
    consumables: Consumable[]
}
