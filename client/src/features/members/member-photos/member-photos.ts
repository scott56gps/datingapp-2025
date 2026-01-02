import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MemberService } from '../../../core/services/member-service';
import { Photo } from '../../../types/photo';
import { ImageUpload } from '../../../shared/image-upload/image-upload';
import { AccountService } from '../../../core/services/account-service';
import { User } from '../../../types/user';
import { Member } from '../../../types/member';
import { FavoriteButton } from '../../../shared/favorite-button/favorite-button';
import { DeleteButton } from '../../../shared/delete-button/delete-button';

@Component({
  selector: 'app-member-photos',
  imports: [ImageUpload, FavoriteButton, DeleteButton],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css',
})
export class MemberPhotos implements OnInit {
  protected memberService = inject(MemberService);
  protected accountService = inject(AccountService);
  private route = inject(ActivatedRoute);
  protected photos = signal<Photo[]>([]);
  protected loading = signal(false);

  ngOnInit(): void {
    const memberId = this.route.parent?.snapshot.paramMap.get('id');
    if (memberId) {
      this.memberService.getMemberPhotos(memberId).subscribe({
        next: (photos) => this.photos.set(photos),
      });
    }
  }

  onUploadImage(photo: File) {
    this.loading.set(true);
    this.memberService.uploadPhoto(photo).subscribe({
      next: (photo) => {
        this.memberService.editMode.set(false);
        this.loading.set(false);
        this.photos.update((photos) => [...photos, photo]);

        // Only update the main photo if the member doesn't have one yet
        if (!this.memberService.member()?.imageUrl) {
          this.setMainLocalPhoto(photo);
        }
      },
      error: (error) => {
        console.log('Error uploading image: ', error);
        this.loading.set(false);
      },
    });
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo).subscribe({
      next: () => {
        this.setMainLocalPhoto(photo);
      },
    });
  }

  deletePhoto(photo: Photo) {
    this.memberService.deletePhoto(photo.id).subscribe({
      next: () => {
        this.photos.update((photos) => photos.filter((x) => x.id !== photo.id));
      },
    });
  }

  /**
   * Update the current user's local photo.
   * SIDE EFFECT: updates both the user and member signals.
   *
   * @param photo The photo to update the member with
   */
  private setMainLocalPhoto(photo: Photo) {
    const currentUser = this.accountService.currentUser();
    if (currentUser) {
      currentUser.imageUrl = photo.url;
      this.accountService.setCurrentUser(currentUser);
    }

    this.memberService.member.update(
      (member) =>
        ({
          ...member,
          imageUrl: photo.url,
        } as Member)
    );
  }
}
