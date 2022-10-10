import { Component, Input, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Consumable } from '../entities/consumable';
import { Item } from '../entities/item';
import {UntypedFormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Observable, Subject} from 'rxjs';
import {map, startWith, takeUntil} from 'rxjs/operators';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-layer-item-editor',
  templateUrl: './layer-item-editor.component.html',
  styleUrls: ['./layer-item-editor.component.scss']
})
export class LayerItemEditorComponent implements OnInit, OnDestroy {
  $destroyer = new Subject();

  itemControl = new UntypedFormControl();
  filteredOptions!: Observable<Item[]>;
  
  @ViewChild('itemInput') itemInput!: ElementRef<HTMLInputElement>;
  @Output() deleteRequested = new EventEmitter<Consumable>();

  constructor() { }

  ngOnDestroy(): void {
    this.$destroyer.next(null);
    this.$destroyer.complete();
  }
  @Input() ingredient: Consumable = { id:0, item: '', itemId:0, quantity:0, unit: '' };
  @Input() items: Item[] = [];
  ngOnInit() {
    this.itemControl.setValue(this.ingredient.item);
    this.filteredOptions = this.itemControl.valueChanges.pipe(
      startWith(this.ingredient),
      map(i=> typeof(i)==='string' ? i : null),
      map((item: string | null) => (item ? this._filter(item) : this.items.slice())),
      takeUntil(this.$destroyer)
    );
  }
  deleteRequest(){
    this.deleteRequested.emit(this.ingredient);
  }
  firstItem(itemName: any): void {
    const value = itemName.target.value.trim();

    if (value) {
      const filtered = this._filter(value);
      if (filtered.length > 0) {
        this.updateFromItem(filtered[0]);
      }
    }
    this.itemControl.setValue(this.ingredient.item);
  }
  updateFromItem(item: Item){
    this.ingredient.item = item.item;
    this.ingredient.itemId = item.id;
    this.ingredient.unit = item.ingredients[0].unit;
  }
  selected(event: MatAutocompleteSelectedEvent): void {
    this.updateFromItem(event.option.value);
    this.itemInput.nativeElement.value = event.option.value.item;
    this.itemControl.setValue(event.option.value.item);
  }
  private _filter(value: string) {
    const filterValue = value.toLowerCase();
    return this.items.filter(item => item.item.toLowerCase().includes(filterValue));
  }
}
