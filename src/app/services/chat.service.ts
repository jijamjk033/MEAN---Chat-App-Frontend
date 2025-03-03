import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModel } from '../models/responseModel';
import { chatResponse, ChatRoomsResponse } from '../models/chatResponse';
import { Observable } from 'rxjs';
import { SocketServiceService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiKey = 'http://localhost:3030/api/chat';
  constructor(private http: HttpClient, private socketService: SocketServiceService) { }

  initiateChat(userId: string, selectedUser: string): Observable<ResponseModel<chatResponse>> {
    return this.http.post<ResponseModel<chatResponse>>(`${this.apiKey}/initiate`, { userId, selectedUser });
  }

  getChats(userId: string): Observable<ResponseModel<ChatRoomsResponse[]>> {
    return this.http.get<ResponseModel<ChatRoomsResponse[]>>(`${this.apiKey}/getChats/${userId}`);
  }

  getMessages(chatId: string): Observable<ResponseModel<chatResponse[]>> {
    return this.http.get<ResponseModel<chatResponse[]>>(`${this.apiKey}/${chatId}/chatRoomMessages`);
  }

  //Socket.io methods

  registerUser(userId: string): void {
    this.socketService.socket?.emit('register', userId);
  }

  onUserStatusUpdate(callback: (statusUpdate: { userId: string, status: string }) => void): void {
    this.socketService.socket?.on('userStatusChange', callback);
  }
  
  joinChat(chatId: string): void {
    this.socketService.socket?.emit('joinChat', chatId);
  }

  sendMessage(chatId: string, message: string, sender: string): void {
    this.socketService.socket?.emit('sendMessage', { chatId, message, sender });
  }

  onNewMessage(callback: (message: any) => void): void {
    this.socketService.socket?.on('newMessage', callback);
  }
}
