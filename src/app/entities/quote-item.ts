import { Ingredient } from "./ingredient";

export interface QuoteItem {
    itemId: number;
    item: string;
    quantityTotal: number;
    unit: string;
    ingredients: Ingredient[];
    selectedIngredient: Ingredient;
    totalPrice: number;
}
