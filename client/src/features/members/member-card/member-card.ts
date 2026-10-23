import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Member } from '../../../types/member';
import { AgePipe } from '../../../core/pipes/age-pipe';
import { LikesService } from '../../../core/services/likes-service';

@Component({
  selector: 'app-member-card',
  imports: [RouterLink, AgePipe],
  templateUrl: './member-card.html',
  styleUrl: './member-card.css',
})
export class MemberCard {
  private likesService = inject(LikesService);
  member = input.required<Member>();
  protected isLiked = computed(() =>
    this.likesService.likedIds().includes(this.member().id))

  toggleLike(event: Event) {
    event.stopPropagation()
    if (this.isLiked()) {
      this.likesService.removeLike(this.member().id).subscribe({
        next: () => {
          this.likesService.likedIds.update(
            (ids) => ids.filter(id => id !== this.member().id)
          )
        }
      })
    } else {
      this.likesService.addLike(this.member().id).subscribe({
        next: () => {
          this.likesService.likedIds.update(
            (ids) => [...ids, this.member().id]
          )
        }
      })
    }

  }
}
