import { Layer } from './layer';

export interface Product {
    id: number,
    product: string,
    layers: Layer[]
}
