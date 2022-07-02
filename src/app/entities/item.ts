import { Ingredient } from './ingredient';

export interface Item {
    id: number;
    item: string;
    ingredients: Ingredient[];
}
