import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ChatComponent } from './components/chat/chat.component';

export const routes: Routes = [
    { path: '', component: HomePageComponent },
    { path: 'chat', component: ChatComponent },
    { path: '**', redirectTo: '' }

];
