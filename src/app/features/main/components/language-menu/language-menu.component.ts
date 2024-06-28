import { NgModule,Component, inject, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FlagService } from '../../../../flag.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-language-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-menu.component.html',
  styleUrl: './language-menu.component.scss'
})
export class LanguageMenuComponent {
  flagService = inject(FlagService);
  selectedLanguage: string = this.flagService.getFlag();
  flagPath: string = "assets/img/" + this.selectedLanguage + ".png"; // default
  flag: string[] = ["en", "it", "de", "es"]; // default
  displayMenu: string = "none";


  
  toggleLanguageMenu(): void {
    this.displayMenu = this.displayMenu === 'none' ? 'block' : 'none';
  }

  async onFlagClick(selectedFlagPath: string, id: string): Promise<void> {
    this.flagService.setFlag(id);
    this.flagPath = selectedFlagPath;
    this.selectedLanguage = id;
    this.toggleLanguageMenu();
  }

}
