import { Component, Output, EventEmitter, inject, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { animate, state, style, transition, trigger } from "@angular/animations";
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  imports: [CommonModule],
  animations: [
    trigger('spawn', [
      state('notSpawned', style({ opacity: 0 })),
      state('spawned', style({ opacity: 1 })),
      transition('notSpawned => spawned', [animate('0.7s ease-in')])
    ]),
  ]
})
export class CategoryComponent implements OnInit, OnDestroy, AfterViewInit {
  service = inject(CategoryService);
  categoriesSubscription!: Subscription;
  selectedCategory: string | null = null;
  menuState: 'notSpawned' | 'spawned' = 'notSpawned';
  categoriess: any[] = [];

  @Output() categorySelected = new EventEmitter<any>();

  constructor() {
    this.categoriess = [];
  }

  async ngOnInit() {
    this.updateCategories();
    this.categoriess =  await this.service.getcategoriess();
 
  }

  async updateCategories(){
    this.service.supabase.channel('custom-all-channel')
      .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'categories' },
      async (payload)  => {
        console.log('Change received!', payload)
        this.categoriess = await this.service.getcategoriess();
        if(!this.findCategory(this.selectedCategory)) this.categorySelected.emit(null);
     }
    )
    .subscribe()
  }


  ngOnDestroy() {
    if (this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.menuState = 'spawned';
  }

  getCategoryClick(clickedCategory: any): void {
    this.selectedCategory = clickedCategory.name;
    this.categorySelected.emit(clickedCategory);
  }

  findCategory(name :any){
    for(let c of this.categoriess){
      if(c.name == name)
        return true;
    }
    return false;
  }
  
  popular(){
    this.selectedCategory = null;
    this.categorySelected.emit(null);
  }
  getCategoryFromName(name :any){
    for(let c of this.categoriess){
      if(c.name == name)
        return c;
    }
    return null;
  }
}

bootstrapApplication(CategoryComponent, {
  providers: [
    provideAnimations()
  ]
});
