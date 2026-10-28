import { HttpEvent, HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { delay, finalize, of, tap } from 'rxjs';
import { BusyService } from '../services/busy-service';
import { inject } from '@angular/core';
import { INVALIDATE_CACHE } from './cache-context';

const cache = new Map<string, HttpEvent<unknown>>();

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);

  const generateCacheKey = (url: string, params: HttpParams): string => {
    const paramString = params.keys().map(key => `${key}=${params.get(key)}`).join('&');
    return paramString ? `${url}?${paramString}` : url;
  }

  const invalidateCache = (urlPattern: string) => {
    for (const key of cache.keys()) {
      if (key.includes(urlPattern)) {
        cache.delete(key)
        console.log(`Cache invalidated for: ${key}`)
      }
    }
  }

  const cacheKey = generateCacheKey(req.url, req.params);

  req.context.get(INVALIDATE_CACHE).forEach(invalidateCache);

  if (req.method === 'GET') {
    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse) {
      // HERE, we short circuit and immediately return what we have.
      busyService.idle();
      return of(cachedResponse);
    }
  }

  busyService.busy();

  return next(req).pipe(
    delay(500),
    tap((response) => {
      // Shove whatever we get into our cache
      cache.set(cacheKey, response);
    }),
    finalize(() => {
      busyService.idle();
    })
  );
};
