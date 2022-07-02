import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Ingredient } from '../entities/ingredient';
import { Item } from '../entities/item';
import { units } from '../entities/unit.data';

export interface ItemCreate {
  created: Item;
  firstIngredient: Ingredient;
}

@Component({
  selector: 'app-item-create-dialog',
  templateUrl: './item-create-dialog.component.html',
  styleUrls: ['./item-create-dialog.component.scss']
})
export class ItemCreateDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ItemCreateDialogComponent>) { }
  itemControl = new FormControl('', [Validators.required]);
  ingredientControl = new FormControl('', [Validators.required]);
  qtyControl = new FormControl(0, [Validators.min(0)]);
  priceControl = new FormControl(0.0, Validators.min(0));
  units = units;
  ingredientForm = new FormGroup({
    item: this.itemControl,
    ingredient: this.ingredientControl,
    quantityUnit: this.qtyControl,
    unit: new FormControl(units[0], [Validators.required]),
    completePrice: this.priceControl,
  });
  ngOnInit() {
  }
  onCancel() {
    this.dialogRef.close();
  }
  onCreate(){
    //const item: Item = {}
    this.dialogRef.close();
  }


}
