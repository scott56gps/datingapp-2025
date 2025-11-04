/* This is the main application component.  As detailed in main.ts, this is the first component used and loaded. */
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  // 1. Declare properties for the compenent.
  private http = inject(HttpClient);

  // Protected properties are accessible from the template (app.html).
  protected title = 'Dating App';
  protected members = signal<any>([]);

  ngOnInit(): void {
    // The first thing we want to do is load the members from the API.
    //  Think of any component as "needing" data in order to display properly.
    this.http.get('https://localhost:5001/api/members').subscribe({
      next: members => {
        console.log(members);
        this.members.set(members);
      },
      error: err => {
        console.error('Failed to load members', err);
      },
      complete: () => {
        console.log('Completed loading members');
      }
    });
  }
}
