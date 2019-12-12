import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    apiUrl: string;

    constructor(private authenticationService: AuthenticationService) {}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.apiUrl = environment.apiUrl + '/api/v1/jenkins/jobs';
        const currentUser = this.authenticationService.currentUserValue;
        const url = request.url;
        if ( !(url.endsWith('authenticate') || url.endsWith('signup') || url.endsWith('changePass')
            || url.endsWith('forgotPassword') || url.endsWith('verifyToken'))) {
            request = request.clone({
                url: this.apiUrl +  request.url
            });
            if (currentUser && currentUser.token) {
                request = request.clone({
                    setHeaders: {
                        'x-access-token': currentUser.token
                    }
                });
            }
        } else {
            this.apiUrl = environment.apiUrl + '/np';
            request = request.clone({
                url: this.apiUrl +  request.url
            });
        }
        return next.handle(request);
    }
}

export const JwtInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true,
};
