import { HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BusyService } from '../services/busy-service';
import { delay, finalize, of, tap } from 'rxjs';

const cache = new Map<string, HttpEvent<unknown>>();

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);

  // Create arbitrary time to represent a network request
  busyService.busy();

  if (req.method === 'GET') {
    const cachedResponse = cache.get(req.url);
    if (cachedResponse) {
      // HERE, we short circuit and immediately return what we have.
      return of(cachedResponse);
    }
  }

  return next(req).pipe(
    delay(500),
    tap((response) => {
      // Shove whatever we get into our cache
      cache.set(req.url, response);
    }),
    finalize(() => {
      busyService.idle();
    })
  );
};
