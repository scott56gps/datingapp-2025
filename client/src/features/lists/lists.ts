import { Component, inject, signal } from '@angular/core';
import { LikesService } from '../../core/services/likes-service';
import { MemberCard } from '../members/member-card/member-card';
import { rxResource } from '@angular/core/rxjs-interop';

enum FilterPredicate {
  liked = 'liked',
  likedBy = 'likedBy',
  mutual = 'mutual'
};

@Component({
  selector: 'app-lists',
  imports: [MemberCard],
  templateUrl: './lists.html',
  styleUrl: './lists.css',
})
export class Lists {
  private likesService = inject(LikesService);
  protected filterPredicate = signal(FilterPredicate.liked);
  protected tabs = [
    { label: 'I Like', value: FilterPredicate.liked },
    { label: 'Like Me', value: FilterPredicate.likedBy },
    { label: 'Mutual', value: FilterPredicate.mutual }
  ];

  // Members is a resource that is reactive in its definition
  protected members = rxResource({
    params: () => this.filterPredicate(),
    stream: ({ params: predicate }) => {
      switch (predicate) {
        case FilterPredicate.liked: return this.likesService.getLikedUsers();
        case FilterPredicate.likedBy: return this.likesService.getUsersThatLike();
        case FilterPredicate.mutual: return this.likesService.getMutuallyLikedUsers();
      }
    }
  });
}
