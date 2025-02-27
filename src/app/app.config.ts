import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http';
import { provideToastr, ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideClientHydration(),
    importProvidersFrom(
      HttpClientModule, 
      ToastrModule.forRoot({
        positionClass: 'toast-top-right', 
        preventDuplicates: true, 
        timeOut: 2000, 
        progressAnimation: 'decreasing', 
        toastClass: 'ngx-toastr custom-toaster', 
      }), 
      BrowserAnimationsModule,
    ),
    provideToastr({
      tapToDismiss: true,
      newestOnTop: true,
      easing: 'ease-in',
      toastClass: 'ngx-toastr custom-toaster', 
      positionClass: 'toast-top-right', 
      preventDuplicates: true, 
      timeOut: 2000, 
      progressAnimation: 'decreasing',
    }), 
  ]
};
