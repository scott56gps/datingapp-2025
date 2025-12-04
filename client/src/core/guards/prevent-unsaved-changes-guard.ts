import { CanDeactivateFn } from '@angular/router';
import { MemberProfile } from '../../features/members/member-profile/member-profile';

export const preventUnsavedChangesGuard: CanDeactivateFn<MemberProfile> = (component) => {
  if (component.editForm?.dirty) {
    return confirm(
      'Are you sure you want to do that?  The temple idol will initiate a destructive force'
    );
  } else {
    return true;
  }
};
