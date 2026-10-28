import { HttpContext, HttpContextToken } from "@angular/common/http";

export type CacheScope = '/likes' | '/members';

export const INVALIDATE_CACHE = new HttpContextToken<readonly CacheScope[]>(() => []);

export const SKIP_CACHE = new HttpContextToken<boolean>(() => false)

export const invalidatesCacheFor = (...scopes: CacheScope[]) =>
  new HttpContext().set(INVALIDATE_CACHE, scopes);
