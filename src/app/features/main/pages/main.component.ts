import { Component } from '@angular/core';
import { ProductComponent } from '../components/product/product.component';
import { CategoryComponent } from '../components/category/category.component';
import { OrderComponent } from '../components/order/order.component';
import { Product } from  "../../../core/models/product";
@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  imports:[ProductComponent, CategoryComponent, OrderComponent]
})
export class MainComponent {
  message: string = "";
  ordered: Product[] = [];
  products: Product[] = [];
  selectedProduct: Product | null = null; 
  
  receiveMessage(x: string) {
    this.message = x;
  }

  selectedCategoryName: string | null = null;
}
