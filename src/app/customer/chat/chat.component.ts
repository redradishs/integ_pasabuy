
/**
 * Note
 * How chat works: user will chat the vendor by navigating to product component and clicking the button "Chat with {vendor}".
 * The vendor will then have to reply first before the vendor will appear on the contact list of the user. Even if the vendor does not appear on the contact list yet,
 * the user will still have the access on the message they sent to the vendor by navigating to the "Chat" in the navbar or by navigating to the product component
 * again and click "Chat with {vendor}"
 *
 */

import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { WebsocketService } from '../../service/websocket.service';
import { AuthService } from '../../service/auth.service';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../service/shared.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

interface Vendor {
  vendor_id: string;
  vendor_name: string;
}

interface Contact {
  _id: string;
  vendor_name: string;
  vendor_email: string;
  lastMessage?: {
    message: string;
    created_at: string;
  };
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule, MatIconModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  showContacts = false;
  isLargeScreen = false;
  contacts: Contact[] = [];
  selectedContact: Vendor | null = null;
  messages: { senderType: string; content: string; timestamp: string }[] = [];
  newMessage = '';

  constructor(
    private websocketService: WebsocketService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private sharedService: SharedService
  ) {
    this.checkScreenSize();
  }

  /**
   * Lifecycle hook to initialize the component.
   * Establishes a WebSocket connection if a token is available.
   */
  ngOnInit(): void {
    const token = this.authService.getToken();
    const senderType = 'user';

    if (token) {
      this.initializeWebSocket(token, senderType);

      const vendor = this.sharedService.getVendor();
      if (vendor) {
        this.selectedContact = vendor;

        setTimeout(() => {
          if (this.websocketService.isConnected()) {
            this.selectContact(vendor);
          } else {
            console.error(
              'WebSocket connection not ready for fetching messages.'
            );
          }
        }, 500);
      }
    } else {
      console.error('Unable to connect: No token found.');
    }
  }

  /**
   * Lifecycle hook to handle actions after the view has been checked.
   * Scrolls the chat container to the bottom if a contact is selected.
   */
  ngAfterViewChecked(): void {
    if (this.selectedContact) {
      this.scrollToBottom();
    }
  }

  /**
   * Initializes the WebSocket connection and subscribes to incoming messages.
   * @param token - The authentication token for the WebSocket connection.
   * @param senderType - The type of the sender (e.g., 'user').
   */
  private initializeWebSocket(token: string, senderType: string): void {
    this.websocketService.connect(token, senderType);
    this.websocketService.messages$.subscribe((data) =>
      this.handleWebSocketData(data)
    );
  }

  /**
   * Handles incoming WebSocket data, including contacts, message history, and real-time messages.
   * @param data - The data received from the WebSocket server.
   */
  private handleWebSocketData(data: any): void {
    if (data.contacts) {
      this.updateContacts(data.contacts);
    } else if (data.messages && this.selectedContact) {
      this.updateMessageHistory(data.messages);
      console.log('Updating message history:', data.messages);
    } else if (data.message) {
      this.processRealTimeMessage(data.message);
    }
  }

  /**
   * Updates the list of contacts.
   * @param contacts - The contacts received from the WebSocket server.
   */
  private updateContacts(contacts: Contact[]): void {
    console.log('Raw contacts data:', contacts);
    this.contacts = contacts;
  }


  /**
   * Updates the message history for the selected contact.
   * @param messages - The messages received from the WebSocket server.
   */
  private updateMessageHistory(messages: any[]): void {
    this.messages = messages.map((msg) => ({
      senderType: msg.sender.type,
      content: msg.message,
      timestamp: new Date(msg.created_at).toLocaleString(),
    }));
    this.scrollToBottom();
  }

  /**
   * Processes a real-time message received from the WebSocket server.
   * @param message - The real-time message object.
   */
  private processRealTimeMessage(message: any): void {
    const newMessage = {
      senderType: message.sender.type,
      content: message.message,
      timestamp: new Date(message.created_at).toLocaleString(),
    };

    // Check if this message is already in the current chat
    const isDuplicate = this.messages.some(
      msg => msg.content === newMessage.content &&
        msg.timestamp === newMessage.timestamp
    );

    if (!isDuplicate &&
      this.selectedContact &&
      (message.sender.id === this.selectedContact.vendor_id ||
        message.recipient.id === this.selectedContact.vendor_id)) {
      this.messages = [...this.messages, newMessage];
      setTimeout(() => this.scrollToBottom(), 0);
    }
  }

  /**
   * Checks if a message is relevant to the currently selected contact.
   * @param message - The message object to check.
   * @returns True if the message is relevant, false otherwise.
   */
  private isMessageRelevantToSelectedContact(message: any): boolean {
    if (!this.selectedContact) {
      return false;
    }
    
    return (
      message.recipient_vendor_id === this.selectedContact.vendor_id ||
      message.sender_vendor_id === this.selectedContact.vendor_id
    );
  }

  /**
   * Sends a new message to the selected contact through the WebSocket service.
   */
  sendMessage(): void {
    if (this.newMessage.trim() && this.selectedContact) {
      this.websocketService.sendMessage({
        recipientId: this.selectedContact.vendor_id.toString(),
        recipientType: 'vendor',
        message: this.newMessage,
      });

      this.addLocalMessage(this.newMessage);
      this.newMessage = '';
    } else {
      console.error('No message or contact selected.');
    }
  }

  /**
   * Adds a new message to the local chat messages list.
   * @param content - The content of the message to add.
   */
  private addLocalMessage(content: string): void {
    this.messages.push({
      senderType: 'user',
      content,
      timestamp: new Date().toLocaleString(),
    });
  }

  /**
   * Toggles the visibility of the contacts list.
   */
  toggleContacts(): void {
    this.showContacts = !this.showContacts;
  }

  /**
   * Selects a contact and fetches the chat history for the selected contact.
   * @param contact - The contact to select.
   */
  selectContact(contact: Contact | Vendor): void {
    // Convert Contact to Vendor format if needed
    this.selectedContact = {
      vendor_id: 'vendor_id' in contact ? contact.vendor_id : contact._id,
      vendor_name: contact.vendor_name
    };

    if (this.websocketService.isConnected()) {
      this.websocketService.getMessages(this.selectedContact.vendor_id);
    } else {
      console.error('WebSocket connection not established yet.');
    }

    setTimeout(() => this.scrollToBottom(), 0);
  }


  /**
   * Checks the screen size and adjusts the visibility of the contacts list accordingly.
   */
  @HostListener('window:resize', [])
  checkScreenSize(): void {
    this.isLargeScreen = window.innerWidth >= 1024;
    this.showContacts = this.isLargeScreen;
  }

  /**
   * Scrolls the messages container to the bottom.
   */
  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  /**
   * Extracts the initials from a given name.
   * @param vendor_name - The full name to extract initials from.
   * @returns A string containing the initials.
   */
  getInitials(vendor_name: string): string {
    if (!vendor_name) return '';
    const words = vendor_name.split(' ');
    return words
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 1);
  }
}