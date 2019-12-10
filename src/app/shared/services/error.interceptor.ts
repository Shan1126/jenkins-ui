import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router} from '@angular/router';

import { AuthenticationService } from './authentication.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService,
        private router: Router) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.authenticationService.logout();
                location.reload(true);
            }
            /*if (err.status === 500) {
                // this.router.navigate(['/error']);
                // auto logout if 401 response returned from api
                // this.authenticationService.logout();
                // location.reload(true);
            }*/
            const error = err.error.message || err.statusText;
            // this.router.navigate(['/error']);
            return throwError(error);
        }));
    }
}
