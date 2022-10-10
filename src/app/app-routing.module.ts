import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { OrderComponent } from './order/order.component';
import { ProductComponent } from './product/product.component';
import { QuoteComponent } from './quote/quote.component';

const routes: Routes = [
  {
    path: 'quote',
    component: QuoteComponent
  },
  {
    path: 'product',
    component: ProductComponent
  },
  {
    path: 'order',
    component: OrderComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
