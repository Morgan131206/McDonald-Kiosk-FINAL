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
export class CategoryService {
 // categories: Category [] = [];


//   async getcategoriess(): Promise<Category[]> {
//     await this.loadData();
//     console.log(this.categories)
//     return this.categories as Category[];
//   }

//   private async fetchcategoriess(): Promise<Category[]> {
//     const path = "assets/data/categories.json";
//     return await fetch(path).then(res => res.json());
//   }

//   async loadData(): Promise<void> {
//     this.categories = [];
//     try {
//       const [categoriess] = await Promise.all([this.fetchcategoriess()]);
//       for (let i = 0; i<12; i++) {
//         if (categoriess[i]) {
//           this.categories.push(categoriess[i]);
//         }
//         else console.log("errore 2");
//       }
//     }
//     catch (error:any) {
//       console.log("errore");
//     }
//   }
// }

supabase: SupabaseClient;

constructor() {
  this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
}

async getcategoriess(): Promise<any[]> {
  const { data, error } = await this.supabase.from('categories').select('*, products(*)');
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return data || [];
}


getInterval(): Observable<number> {
  return interval(500); // Emette un valore ogni 500ms
}
}