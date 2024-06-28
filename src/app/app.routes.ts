import { Routes } from '@angular/router';
import { MainComponent } from './features/main/pages/main.component';
import { StartComponent } from './features/start/pages/start.component';
import { SuccessComponent} from './features/success/success.component';

export const routes: Routes = [
    { path: 'main', component: MainComponent },
    { path: 'success', component: SuccessComponent },
    { path: '', component: StartComponent }
];
