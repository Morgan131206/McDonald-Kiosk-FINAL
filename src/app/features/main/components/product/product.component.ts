import { Component, inject, OnInit, OnDestroy, Output, EventEmitter, AfterViewInit} from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CategoryComponent } from '../category/category.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { animate, state, style, transition, trigger } from "@angular/animations";
import { provideAnimations } from '@angular/platform-browser/animations';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CategoryComponent, CommonModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  animations: [
    trigger('spawn', [
      state('notSpawned', style({ opacity: 0 })),
      state('spawned', style({ opacity: 1 })),
      transition('notSpawned <=> spawned', [animate('0.8s ease-in')])
    ]),
  ]
})
export class ProductComponent implements OnInit, OnDestroy, AfterViewInit {
  service = inject(ProductService);
  products: any[] = [];
  productsSubscription!: Subscription;
  populars: any[] = [];
  selectedItem: any;  
  selectedCategory: any; 
  productInCategory :any; 
  
  menuState: 'notSpawned' | 'spawned' = 'notSpawned';

  @Output() orderSelect = new EventEmitter<any>();

  constructor() {
    this.products = [];
  }

  async ngOnInit() {
    await this.loadProducts();
    this.populars = this.getRandomProducts(this.products, 6);
    this.updateCategoryProducts();
    this.updateProducts();
    
  }

  async updateCategoryProducts(){
    this.service.supabase.channel('custom-all-channel')
    .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'category_products' },
    async (payload)  => {
      console.log('Change received!', payload)
      this.loadProducts();

   }
  )
  .subscribe()
  }

  async loadProducts(){
    this.products =  await this.service.getProducts();
    this.ordinaArray(this.products);
  }
  ordinaArray(array: any): any {
    let a = array [0];
    let b = array [array.length]
    array.sort((a: { id: number; }, b: { id: number; }) => a.id - b.id);
  }

  async updateProducts(){
    this.service.supabase.channel('products2_channel')
    .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'products' },
    async (payload)  => {
      console.log('Change received!', payload)
      await this.loadProducts();
      this.updatePopulars();
   }
  )
  .subscribe()
  }

  updatePopulars(){
    for(let i = 0; i < this.populars.length; i++){
        if(this.findProduct(this.populars[i].item) == null)
          this.populars = this.populars.slice(0, i).concat(this.populars.slice(i + 1));
        else
          this.populars[i] = this.findProduct(this.populars[i].item);
      }
  }
  findProduct(name :any){
    for(let p of this.products){
      if(p.item == name)
        return p;
    }
    return null;
  }

  ngOnDestroy() {
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
  }

  // Fisher-Yates 
  getRandomProducts(products: any[], count: number): any[] {
    let popularProducts = products.slice(0, products.length);

    for (let i = popularProducts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [popularProducts[i], popularProducts[j]] = [popularProducts[j], popularProducts[i]];
    }

    return popularProducts.slice(0, count);
  }

  addOrder(x: any) {
    this.orderSelect.emit(x);
  }

  onCategorySelected(category: any) {
    // this.menuState = 'notSpawned';
    // this.menuState = 'spawned';
    
    this.selectedCategory = category; 
    this.productInCategory = this.selectedCategory.products;
  }

  ngAfterViewInit() {
    
  }
  getFormattedPriceProduct(newprice: number): string {
    return newprice.toLocaleString('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
  
}

bootstrapApplication(ProductComponent, {
  providers: [
    provideAnimations()
  ]
});
