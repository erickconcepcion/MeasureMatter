import { Component, OnInit, ViewChild } from '@angular/core';
import { Layer } from '../entities/layer';
import { Product } from '../entities/product';
import { products } from '../entities/products.data';
import {MatAccordion} from '@angular/material/expansion';
import {MatDialog} from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { filter, map, tap, take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { items } from '../entities/items.data';
import { Consumable } from '../entities/consumable';

interface LayerEdit{
  layer: Layer;
  edit: boolean;
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  
  constructor(public dialog: MatDialog) {}
  
  product: Product = products[1];
  layers: LayerEdit[] = [];
  allItems = items;
  $destroyer = new Subject();

  toggleEditLayer(layer: LayerEdit){
    layer.edit = !layer.edit;
  }
  ngOnInit() {
    this.layers = this.product.layers.map(l => {
      return {layer: l, edit: false} as LayerEdit
    })

  }

  deleteLayer(layer: LayerEdit){
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '50%',
      data: {
        title: `Seguro que desea eliminar la capa ${layer.layer.layer}?`,
        subTitle: "Todo el trabajo realizado sobre esta capa se perdera de forma permanente. Clickee \"Si\" si esta completamente seguro."
      },
    });

    dialogRef.afterClosed()
    .pipe(
      map(result => result as boolean),
      filter(r=>r),
      tap(r => this.layers.splice(this.layers.findIndex(l=> l===layer), 1)),
      take(1)
    )
    .subscribe();
    
  }
  addLayer(){
    this.layers.unshift({ 
      edit: true,
      layer: {
        id:0,
        layer: 'Nueva Capa',
        consumables:[]
      }
    })
  }
  addConsumable(layer: LayerEdit){
    layer.layer.consumables.push({ 
      id: 0,
      item: '',
      itemId: 0,
      quantity: 0,
      unit: ''
    })
  }
  deleteConsumable(consumable: Consumable, layer: LayerEdit){
    const index = layer.layer.consumables.findIndex(c => c===consumable);
    layer.layer.consumables.splice(index, 1);
  }
}
