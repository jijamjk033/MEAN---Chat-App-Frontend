import { Component, ElementRef, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User } from '../../models/responseModel';
import { SocketServiceService } from '../../services/socket.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe, isPlatformBrowser, NgFor, NgIf } from '@angular/common';
import { ChatService } from '../../services/chat.service';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, DatePipe, CommonModule, PickerComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})

export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('chatMessages') chatMessages!: ElementRef;
  user: User | null = null;
  users: User[] = [];
  searchQuery: string = '';
  chatId: string = '';
  chats: any[] = [];
  messages: any[] = [];
  newMessage = '';
  chatRecipientName: string = '';
  chatRecipientPic: string = '';
  userStatusMap: { [key: string]: string } = {};
  showEmojiPicker = false;
  private previousMessageCount = 0;
  isOpenChat = false;

  constructor(@Inject(PLATFORM_ID) private platformId: object,private ngZone: NgZone, private userService: UserService, private router: Router, private socketService: SocketServiceService, private chatService: ChatService) { }

  ngOnInit() {
    this.user = this.userService.getUser();
    this.socketService.connect();
    if (!this.user) {
      this.router.navigate(['/home']);
    }
    this.fetchChats();
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('click', this.onClickOutside.bind(this));
    }
    this.listenForNewMessages();
    this.listenForStatusUpdates();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
    if (isPlatformBrowser(this.platformId)) {
      document.removeEventListener('click', this.onClickOutside.bind(this));
    }
  }

  scrollToBottom() {
    if (this.chatMessages && this.messages.length > this.previousMessageCount) {
      setTimeout(() => {
        const element = this.chatMessages.nativeElement;
        element.scrollTop = element.scrollHeight;
        this.previousMessageCount = this.messages.length;
      }, 100);
    }
  }

  openChat(chat: any) {
    this.chatId = chat.chatId;
    this.isOpenChat = true;
    this.chatRecipientName = chat.recipient.name;
    this.chatRecipientPic = chat.recipient.picture || 'assets/default-avatar.png';
    this.chatService.joinChat(this.chatId);
    this.fetchMessages();
    this.scrollToBottom();
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: EmojiEvent) {
    this.newMessage += event.emoji.native;
  }

  searchUsers() {
    if (this.user) {
      if (this.searchQuery.trim()) {
        this.userService.searchUsers(this.user.email, this.searchQuery).subscribe({
          next: (response) => {
            this.users = response.data;
          },
          error: (err) => console.error('Error searching users:', err)
        });
      } else {
        this.users = [];
      }
    }
  }

  listenForStatusUpdates() {
    this.chatService.onUserStatusUpdate((statusUpdate) => {
      console.log("Received status update:", statusUpdate);
      this.userStatusMap = { ...this.userStatusMap, [statusUpdate.userId]: statusUpdate.status };
    });
  }
  

  getUserStatus(userId: string): string {
    return this.userStatusMap[userId] || 'offline';
  }

  startChat(selectedUser: User) {
    if (!this.user) return;
    this.chatService.initiateChat(this.user.email, selectedUser.email).subscribe({
      next: (response) => {
        console.log('Chat created:', response.data);
        this.chatId = response.data.chatId;
        this.searchQuery = '';
        this.users = [];
      },
      error: (err) => console.error('Error creating chat:', err)
    });
  }

  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.search-container')) {
      this.users = [];
    }
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      const sender = this.user?.googleId;
      console.log('I am sending the message', sender, this.newMessage);
      if (!sender) {
        console.error('Error: No sender ID found in localStorage.');
        return;
      }
      this.chatService.sendMessage(this.chatId, this.newMessage, sender);
      this.newMessage = '';
      this.scrollToBottom();
    }
  }

  listenForNewMessages(): void {
    this.chatService.onNewMessage((message) => {
      let userId = this.user?.googleId;
      console.log(userId, message, 'new message received');

      if (!userId) {
        console.error('Error: No user ID found.');
        return;
      }
      this.messages.push({
        text: message.text,
        sender: message.sender,
        timestamp: new Date(message.timestamp).toLocaleTimeString(),
      });
      this.scrollToBottom();
    });
  }


  fetchChats() {
    if (!this.user) return;
    this.chatService.getChats(this.user.email).subscribe({
      next: (response) => {
        console.log('Chats fetched:', response.data);
        this.chats = response.data.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
      },
      error: (err) => console.error('Error fetching chats:', err)
    });
  }

  fetchMessages() {
    if (!this.chatId) return;
    this.chatService.getMessages(this.chatId).subscribe({
      next: (response) => {
        console.log('Messages fetched:', response.data);
        this.messages = response.data;
      },
      error: (err) => console.error('Error fetching messages:', err)
    });
  }

  logout() {
    this.userService.logout();
    this.ngZone.run(() => {
      this.router.navigate(['/home']);
    });
  }
}
