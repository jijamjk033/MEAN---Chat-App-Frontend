import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  title = 'ChatApp';
  constructor(private userService: UserService, private router: Router) { }
  ngOnInit() {
    this.userService.user$.subscribe(user => {
      if (user) {
        this.router.navigate(['/chat']);
      } else {
        this.router.navigate(['/']);
      }
    });
  }
}
