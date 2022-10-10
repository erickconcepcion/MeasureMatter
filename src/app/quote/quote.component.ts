import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { products } from '../entities/products.data';
import { Quote } from '../entities/quote';
import { Item } from '../entities/item';
import { items } from '../entities/items.data';
import { Ingredient } from '../entities/ingredient';
import { Consumable } from '../entities/consumable';
import { QuoteItem } from '../entities/quote-item';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {UntypedFormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Product } from '../entities/product';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.scss']
})
export class QuoteComponent implements OnInit {

  
  constructor() { }
  quote!: Quote;
  selectItems!: Map<number, Ingredient[]>;
  //complete order
  quoteItems: QuoteItem[] = [];
  total: number = 0;

  //chips
  separatorKeysCodes: number[] = [ENTER, COMMA];
  productCtrl = new UntypedFormControl();
  filteredProducts!: Observable<Product[]>;

  @ViewChild('productInput') productInput!: ElementRef<HTMLInputElement>;

  ngOnInit() {
    this.quote = {products: []};
    this.setQuoteState()
    //chips
    this.filteredProducts = this.productCtrl.valueChanges.pipe(
      startWith(null),
      map(p=> typeof(p)==='string' ? p : null),
      map((product: string | null) => (product ? this._filter(product) : products.slice())),
    );
  }
  setQuoteState(){
    //all products unique ingredients
    if (this.quote.products.length > 0) {
      const allConsumables = this.quote.products.flatMap(p => p.layers.flatMap(l => l.consumables));
      const list = [...new Set(allConsumables.map(c => c.itemId))];
      this.selectItems = new Map(items.filter(i => list.includes(i.id)).map(key => [key.id, key.ingredients]));
      this.quoteItems =  [...this.groupItem(new Map(), allConsumables).values()];
      this.setQuoteTotal();
    }
    else{
      this.quoteItems = []
      this.total = 0;
    }
  }
  groupItem(val: Map<number, QuoteItem>, consumables: Consumable[]){
    for (const actual of consumables) {
      if (val.has(actual.itemId)) {
        const value = val.get(actual.itemId);
        value!.quantityTotal+= actual.quantity;
        value!.totalPrice = this.getTotal(value!.selectedIngredient.completePrice, value!.selectedIngredient.quantityUnit, value!.quantityTotal ?? 0)
      }
      else {
        const item = this.selectItems.get(actual.itemId) ?? [];
        val.set(actual.itemId, {
          itemId: actual.id,
          item: actual.item,
          unit: actual.unit,
          quantityTotal: actual.quantity,
          ingredients: item,
          selectedIngredient: item[0],
          totalPrice: this.getTotal(item[0].completePrice, item[0].quantityUnit, actual.quantity)
        });
      }
    }
    return val;
  }
  getTotalPrice(quoteItem: QuoteItem) {
    return this.getTotal(quoteItem.selectedIngredient.completePrice,
      quoteItem.selectedIngredient.quantityUnit, quoteItem.quantityTotal);
  }
  getTotal(completePrice: number, baseQty: number, totalQty: number){
    return (completePrice / 
      baseQty) * totalQty;
  }
  setQuoteTotal(){
    this.total = this.quoteItems.map(qi=> qi.totalPrice).reduce((acc, curr )=> acc+curr);
  }
  getTotalCost(qi: QuoteItem){
    return Math.ceil(qi.quantityTotal/qi.selectedIngredient.quantityUnit)* qi.selectedIngredient.completePrice;
  }
  selectDisable(quoteItem: QuoteItem){
    return quoteItem.ingredients.length <= 1
  }
  changeItem(quoteItem: QuoteItem, back: boolean = false){
    let ind = quoteItem.ingredients.findIndex(i => i===quoteItem.selectedIngredient);
    ind = back ? ind-1 : ind +1;
    ind = ind >= quoteItem.ingredients.length ? 0 : ind < 0 ? quoteItem.ingredients.length - 1 : ind
    quoteItem.selectedIngredient = quoteItem.ingredients[ind]
    quoteItem.totalPrice = this.getTotalPrice(quoteItem);
    this.setQuoteTotal();
  }

  //chips
  addProduct(product: Product){
    this.quote.products.push(product);
    this.setQuoteState();
  }
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      const filtered = this._filter(value);
      if (filtered.length > 0) {
        this.addProduct(filtered[0]);
      }
    }

    // Clear the input value
    event.chipInput!.clear();

    this.productCtrl.setValue(null);
  }

  remove(product: Product): void {
    const index = this.quote.products.indexOf(product);
    this.setQuoteState();

    if (index >= 0) {
      this.quote.products.splice(index, 1);
      this.setQuoteState();
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.addProduct(event.option.value);
    this.productInput.nativeElement.value = '';
    this.productCtrl.setValue(null);
  }

  private _filter(value: string) {
    const filterValue = value.toLowerCase();
    return products.filter(prod => prod.product.toLowerCase().includes(filterValue));
  }
}
