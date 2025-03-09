declare var google: any;
import { AfterViewInit, Component, NgZone, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, AfterViewInit {

  constructor(private userService: UserService, private router: Router, private toastr: ToastrService, private ngZone: NgZone) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.loadGoogleSignIn();
  }

  loadGoogleSignIn() {
    const interval = setInterval(() => {
      if (typeof google !== 'undefined' && google.accounts) {
        clearInterval(interval);
        google.accounts.id.initialize({
          client_id: import.meta.env.NG_APP_GOOGLE_CLIENT_ID,
          callback: (response: object) => {
            this.handleCredentialResponse(response);
          },
        });
        google.accounts.id.renderButton(document.getElementById('googleLoginButtonContainer'), {
          theme: "outline",
          size: "large",
          width: "520",
          text: "signin_with",
          shape: "pill",
          logo_alignment: "center",
        });
        const buttonContainer = document.getElementById('googleLoginButtonContainer');
        if (buttonContainer) {
          buttonContainer.style.display = "flex";
          buttonContainer.style.justifyContent = "center";
          buttonContainer.style.transform = "scale(1.0)";
        }
      }
    }, 500);
  }

  private decodeToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }

  handleCredentialResponse(response: any) {
    const decodedToken = this.decodeToken(response.credential);
    const userPayload = {
      googleId: decodedToken.sub,
      name: decodedToken.name,
      email: decodedToken.email,
      picture: decodedToken.picture,
    };
    this.userService.googleLogin(userPayload).subscribe({
      next: (res) => {
        this.ngZone.run(() => { 
          sessionStorage.setItem('LoggedUser', JSON.stringify(res.data));
          console.log('Login response:', res.data);
          this.userService.setUser(res.data.user);
          this.toastr.success('Login successful!', 'Success');
          setTimeout(() => {
            console.log("Navigating to chat...");
            this.router.navigate(['/chat']);
          }, 500);
        });
      },
      error: (err) => {
        console.error('Login error:', err);
        this.toastr.error('Login failed. Please try again.', 'Error');
      }
    });
  }
}
