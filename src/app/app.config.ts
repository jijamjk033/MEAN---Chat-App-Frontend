import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient, withFetch} from '@angular/common/http';
import { provideToastr, ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideClientHydration(),
    provideHttpClient(withFetch()),
    importProvidersFrom(PickerModule),
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
