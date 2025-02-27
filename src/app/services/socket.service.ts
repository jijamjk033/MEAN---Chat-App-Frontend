import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { UserService } from './user.service';
import { User } from '../models/responseModel';

@Injectable({
  providedIn: 'root'
})
export class SocketServiceService {
  user: User | null = null;
  socket: Socket | null = null;
  private port = 'http://localhost:3030';

  constructor(private userService:UserService) { }

  connect() {
    if (!this.socket) {
      this.socket = io(this.port);
      this.setupListeners();
    }
  }

  private setupListeners() {
    if (this.socket) {
      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket?.id);
        if (typeof window !== 'undefined' && window.sessionStorage) {
          const user = this.userService.getUser();
          const idToRegister = user?.googleId;
          if (idToRegister) {
            this.socket?.emit('register', idToRegister);
            console.log(`Registered with ID: ${idToRegister}`);
          } else {
            console.warn('User ID not found in sessionStorage.');
          }
        } else {
          console.error('Window or sessionStorage is not available.');
        }
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });
    }
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}
