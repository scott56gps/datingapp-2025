import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LikesService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  addLike() {

  }

  removeLike() {

  }

  getLikedUsers() {

  }

  getUsersThatLike() {

  }

  getLikedIds() {

  }
}
