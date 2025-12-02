import { ResolveFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { MemberService } from '../../core/services/member-service';
import { Member } from '../../types/member';
import { EMPTY } from 'rxjs';

export const memberResolver: ResolveFn<Member> = (route, state) => {
  const memberService = inject(MemberService);
  const router = inject(Router);
  const memberId = route.paramMap.get('id');

  if (!memberId) {
    // If a user puts a memberId that does not exist, they are redirected to the not-found page
    router.navigateByUrl('/not-found');
    return EMPTY;
  }

  return memberService.getMember(memberId);
};
