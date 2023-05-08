import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    
    const accessToken = localStorage.getItem("token");
    
    const authReq = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${accessToken}`)
    });
    
    return next.handle(authReq);
  }
  constructor() { }
}
