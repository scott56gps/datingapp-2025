import { Routes } from '@angular/router';
import { Home } from '../features/home/home';
import { MemberList } from '../features/members/member-list/member-list';
import { MemberDetailed } from '../features/members/member-detailed/member-detailed';
import { Lists } from '../features/lists/lists';
import { Messages } from '../features/messages/messages';
import { authGuard } from '../core/guards/auth-guard';
import { TestErrors } from '../features/test-errors/test-errors';
import { NotFound } from '../shared/errors/not-found/not-found';
import { ServerError } from '../shared/errors/server-error/server-error';
import { Notes } from '../features/notes/notes';
import { MemberProfile } from '../features/members/member-profile/member-profile';
import { MemberPhotos } from '../features/members/member-photos/member-photos';
import { MemberMessages } from '../features/members/member-messages/member-messages';
import { memberResolver } from '../features/members/member-resolver';

export const routes: Routes = [
  { path: '', component: Home },
  // Dummy route to group all the ones we want to guard
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      { path: 'members', component: MemberList },
      {
        path: 'members/:id',
        resolve: { member: memberResolver },
        runGuardsAndResolvers: 'always',
        component: MemberDetailed,
        children: [
          { path: '', redirectTo: 'profile', pathMatch: 'full' }, // This allows us to stay on the page when we click on things on the MemberDetailed component
          { path: 'profile', component: MemberProfile, title: 'Profile' },
          { path: 'photos', component: MemberPhotos, title: 'Photos' },
          { path: 'messages', component: MemberMessages, title: 'Messages' }
        ]
      },
      { path: 'members/:id', component: MemberDetailed },
      { path: 'lists', component: Lists },
      { path: 'messages', component: Messages },
      { path: 'notes', component: Notes },
    ],
  },
  // We can provide *multiple* guards
  // This is a wildcard.  If a user manually goes to a route that is not defined, they go back home
  { path: 'errors', component: TestErrors },
  { path: 'server-error', component: ServerError },
  { path: '**', component: NotFound },
];
