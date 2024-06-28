import { Component, ViewChild, ElementRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FlagService } from '../../../flag.service';
import { modService } from '../../../modalita.service';
import { LanguageMenuComponent } from '../../main/components/language-menu/language-menu.component';
@Component({
  selector: 'app-start',
  standalone: true,
  imports: [RouterLink, LanguageMenuComponent],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss'
})
export class StartComponent {
  modService = inject (modService);
}
