import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User } from '../../models/responseModel';
import { SocketServiceService } from '../../services/socket.service';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule,NgIf, NgFor],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})

export class ChatComponent implements OnInit, OnDestroy{
  user: User | null = null;
  users: User[] = [];
  searchQuery: string = '';

  constructor(private userService: UserService, private router: Router,private socketService: SocketServiceService) { }

  ngOnInit() {
    this.user = this.userService.getUser();
    this.socketService.connect();
    if (!this.user) {
      this.router.navigate(['/home']);
    }
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }

  searchUsers() {
    if (this.searchQuery.trim()) {
      this.userService.searchUsers(this.searchQuery).subscribe({
        next: (response) => {
          this.users = response.data;
        },
        error: (err) => console.error('Error searching users:', err)
      });
    } else {
      this.users = [];
    }
  }

  startChat(user: User) {

  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/home']);
  }
}
