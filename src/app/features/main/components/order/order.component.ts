import { Component, ElementRef, inject, ViewChild, OnInit } from '@angular/core';
import { ProductComponent } from "../product/product.component";
import { FlagService } from '../../../../flag.service';
import { modService } from '../../../../modalita.service';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LanguageMenuComponent } from '../language-menu/language-menu.component';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-order',
  standalone: true,
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  imports: [ProductComponent, LanguageMenuComponent, CommonModule, RouterLink],
  providers: [],
})

export class OrderComponent implements OnInit{
  flagService = inject(FlagService);
  modService = inject(modService);
  ordina: {product: any, quantity: number, state: string}[] = [];
  selectedProduct: any = 1;
  total = 0;
  valBottomSheet :number = 100;
  overlay :string = "none";
  class = "elementoCarello";
  [key: string]: any;
  removedAndDeactivated : any [] = [];  
  displayRemovedAndDeactivated: string = "none";
  
  displaySummary: string = "none";
  @ViewChild("ordered") ordered!: ElementRef;


  productService = inject(ProductService);
  products : any [] = [];

  async ngOnInit(){
    this.loadProducts();
    this.updateProducts();
    
  }
  getFormattedPrice(): string {
    return this.total.toLocaleString('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  async updateProducts(){
    this.productService.supabase.channel('products_channel')
    .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'products' },
    async (payload)  => {
      console.log('Change received!', payload)

     this.loadProducts();

      // for(let i = 0; i < this.ordina.length; i++){
      //   if(this.findProduct(this.ordina[i].product.item) == null || this.ordina[i].product.isActive == false){
      //    // this.elimina(i);
      //   }else{
      //     this.ordina[i].product = this.findProduct(this.ordina[i].product.item);
      //    // if(!this.ordina[i].product.isActive)
      //      // this.elimina(i);
      //   }
      // }
   }
  )
  .subscribe()
  }
  

  async loadProducts(){
    this.products = await this.productService.getProducts();
  }



  getFormattedPriceProduct(newprice: number): string {
    return newprice.toLocaleString('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  getFormattedPriceSelectedProduct(): string {
    return this.selectedProduct.price.toLocaleString('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  onProductSelect(clickedProduct: any) {
    this.selectedProduct = clickedProduct;
    let presente = false;
    for (let o of this.ordina) {
      if (o.product.item == clickedProduct.item) {
        presente = true;
      }
    }

    if (!presente) {
      this.ordina.unshift({product: clickedProduct, quantity: 0, state:"elementoCarrello"});
    } else {
      if (clickedProduct) {
        let n: number = 0;
        for (let i = 0; i < this.ordina.length; i++) {
          if (this.ordina[i].product.item === clickedProduct.item){
            n = this.ordina[i].quantity;
            this.ordina = this.ordina.slice(0, i).concat(this.ordina.slice(i + 1));
          }
        }
        this.ordina.unshift({product: clickedProduct, quantity: n, state: "elementoCarrelloPresente"});
      }
    }
    this.updateTotal();
  }

  addCarrello(clickedProduct: any) {
    let trovato = false;
    for(let o of this.ordina){
      if(o.product === clickedProduct){
        trovato = true;
        o.quantity += 1;
      }
    }
    this.updateTotal();
  }

  addCarrelloFromBottomSheet() {
    this.quantAnt += 1;
    this.updateTotal();
  }

  done() {
    if (this.selectedProduct && this.quantAnt != 0) {
      this.onProductSelect(this.selectedProduct);

      for(let o of this.ordina){
        if(o.product === this.selectedProduct){
          o.quantity += this.quantAnt;
        }
      }
    }
    this.ordered.nativeElement.scrollTop = 0;
    this.updateTotal();
    this.closeBottomSheet();
  }

  removeCarrello(clickedProduct: any) {
    let trovato = false;
    for(let o of this.ordina){
      if(o.product === clickedProduct){
        trovato = true;
        if(o.quantity > 1)
          o.quantity -= 1;
        else{
          for (let i = 0; i < this.ordina.length; i++) {   
            if (this.ordina[i].product == clickedProduct){
              this.ordina[i].state = "elementoCarrelloRimosso";
              setTimeout(() => {
                this.ordina = this.ordina.slice(0, i).concat(this.ordina.slice(i + 1)); 
                this.updateTotal();
              }, 600);
            }
          }
        }
      }
    }
    this.updateTotal();
  }

  removeCarrelloFromBottomSheet() {
    if (this.quantAnt > 1)
      this.quantAnt -= 1;
    else
      this.quantAnt = 1;
    this.updateTotal();
  }

  updateTotal() {
    this.total = 0;
    for (let elem of this.ordina) {
      this.total += elem.product.price * elem.quantity;
    }
    this.total = Number((Math.round(this.total * 100) / 100).toFixed(2));
  }

  quantAnt: number = 1;

  openBottomSheet(p: any): void {
    this.overlay = "block";
    this.selectedProduct = p;
    this.quantAnt = 1;
    this.valBottomSheet = 100;
    let x = setInterval(() => { this.valBottomSheet -= 1; if(this.valBottomSheet <= 30) clearInterval(x);
    }, 1);    
  }

  closeBottomSheet(): void {
    this.valBottomSheet = 30;
    let x = setInterval(() => {this.valBottomSheet += 1; if(this.valBottomSheet >= 100) clearInterval(x);}, 1);
    this.overlay = "none";
  }

  ordinazione(){
   this.removedAndDeactivated = [];
    for(let i = 0; i < this.ordina.length; i++){
      if(this.findProduct(this.ordina[i].product.item) == null ||  this.findProduct(this.ordina[i].product.item).isActive == false){
        this.removedAndDeactivated.push(this.ordina[i]);
        this.elimina(i);
      }
    } 
    console.log(this.removedAndDeactivated);
    if(this.removedAndDeactivated.length > 0)  this.toggleRemovedAndDeactivated();
    else if(this.ordina.length > 0) this.toggleSummary();
    this.updateTotal();

  }

  confirm(){
    if(this.ordina.length > 0) this.toggleSummary();
    this.updateTotal();
  }
  toggleRemovedAndDeactivated(): void {
    this.displayRemovedAndDeactivated = this.displayRemovedAndDeactivated === 'none' ? 'block' : 'none';
    this.updateTotal();
  }

  toggleSummary(): void {
    this.displaySummary = this.displaySummary === 'none' ? 'block' : 'none';
    this.updateTotal();
  }
  elimina(i:number){
      this.ordina = this.ordina.slice(0, i).concat(this.ordina.slice(i + 1));
      this.updateTotal();
  }
  
  findProduct(name :any){
    console.log(this.products);
  for(let p of this.products){
    if(p.item == name) return p;
  }
  return null;
}
}

bootstrapApplication(OrderComponent, {
  providers: [
    provideAnimationsAsync()
  ]
});