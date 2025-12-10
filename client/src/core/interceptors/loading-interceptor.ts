import { HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { delay, finalize, of, tap } from 'rxjs';
import { BusyService } from '../services/busy-service';
import { inject } from '@angular/core';

const cache = new Map<string, HttpEvent<unknown>>();

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);

  busyService.busy();

  if (req.method === 'GET') {
    const cachedResponse = cache.get(req.url);
    if (cachedResponse) {
      // HERE, we short circuit and immediately return what we have.
      busyService.idle();
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
