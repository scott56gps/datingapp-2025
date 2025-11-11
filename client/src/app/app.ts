/* This is the main application component.  As detailed in main.ts, this is the first component used and loaded. */
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Nav } from '../layout/nav/nav';
import { AccountService } from '../core/services/account-service';
import { Home } from '../features/home/home';
import { User } from '../types/user';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [Nav, Home],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private accountService = inject(AccountService);
  // 1. Declare properties for the compenent.
  private http = inject(HttpClient);

  // Protected properties are accessible from the template (app.html).
  protected title = 'Dating App';
  protected members = signal<User[]>([]);

  async ngOnInit() {
    // The first thing we want to do is load the members from the API.
    //  Think of any component as "needing" data in order to display properly.
    this.members.set(await this.getMembers());
    this.setCurrentUser();
  }

  setCurrentUser() {
    // Check to see if we already have a user stored for this session
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user = JSON.parse(userString);
    this.accountService.currentUser.set(user);
  }

  async getMembers() {
    try {
      return lastValueFrom(
        this.http.get<User[]>('https://localhost:5001/api/members')
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
