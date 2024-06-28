import { Injectable } from '@angular/core';
import {
  createClient,
  SupabaseClient,
} from '@supabase/supabase-js'
import { environment } from '../../../environments/environment.development';
import { Observable, interval } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // prodotti: Product [] = [];

  // async getProducts(): Promise<Product[]> {
  //   await this.loadData();
  //   return this.prodotti as Product[];
  // }

  // private async fetchProducts(): Promise<Product[]> {
  //   const path = "assets/data/products.json";
  //   return await fetch(path).then(res => res.json());
  // }

  // async loadData(): Promise<void> {
  //   this.prodotti = [];
  //   try {
  //     const [products] = await Promise.all([this.fetchProducts()]);
  //     console.log(products.length);
  //     for (let i = 0; i<products.length; i++) {
  //       if (products[i]) {
  //         this.prodotti.push(products[i]);
  //       }
  //       else console.log("errore 2");
  //     }
  //     console.log(products.length);
  //   }
  //   catch (error:any) {
  //     console.log("errore");
  //   }
    
  // }

  supabase: SupabaseClient;

constructor() {
  this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
}
async getProducts(): Promise<any[]> {
  const { data, error } = await this.supabase.from('products').select('*, categories(*)');
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data || [];
}

getInterval(): Observable<number> {
  return interval(500); // Emette un valore ogni 500ms
}



}
