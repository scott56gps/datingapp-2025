import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../../types/user';

@Injectable({
  providedIn: 'root',
})
export class LikesService {
  private http = inject(HttpClient);
  currentUser = signal<User | null>(null);
  likedIds = signal<string[]>([]);
  private baseUrl = environment.apiUrl;
  private likesUrl = this.baseUrl + 'likes/';

  /**
   * Indicates that the currently logged in user likes the user indicated by the
   * targetMemberId.
   */
  addLike(targetMemberId: string) {
    return this.http.post<User>(this.likesUrl + targetMemberId, {})
  }

  /**
   * Removes a like relationship from the currently logged in user to the user
   * indicated by the targetMemberId.  If no relationship exists, no state is
   * changed.
   */
  removeLike(targetMemberId: string) {
    return this.http.delete(this.likesUrl + targetMemberId)
  }

  /**
   * Retrieves a list of users that the currently logged in user likes.
   */
  getLikedUsers() {
    return this.http.get(this.likesUrl + "?predicate=liked")
  }

  /**
   * Retrieves a list of users that like the currently logged in user.
   */
  getUsersThatLike() {
    return this.http.get(this.likesUrl + "?predicate=likedBy")
  }

  /**
   * Retrieves a list of users that this user likes AND that like this user.
   */
  getMutuallyLikedUsers() {
    return this.http.get(this.likesUrl + "?predicate=mutual")
  }

  /**
   * Retrieves a list of ids of users that the currently logged in user likes.
   */
  getLikedIds() {
    return this.http.get<string[]>(this.likesUrl + "like-ids").subscribe({
      next: ids => this.likedIds.set(ids)
    })
  }

  /**
   * Used to reset the like ids when a user logs out.
   */
  clearLikedIds() {
    this.likedIds.set([])
  }
}
