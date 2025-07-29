import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  const modifiedReq = req.clone({
    withCredentials: true // ✅ always send cookies
  });

  return next(modifiedReq); // optionally add catchError for global error handling
};
