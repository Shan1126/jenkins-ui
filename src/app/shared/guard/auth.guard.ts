import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import {ActivatedRoute, Router} from '@angular/router';
import { User } from '../../_models/model';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthenticationService} from '../../shared/services/index';
@Injectable()
export class AuthGuard implements CanActivate {
    currentUser: User;
    currentUserSubscription: Subscription;
    returnUrl: string;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService) {
                this.currentUserSubscription = this.authenticationService.currentUser.subscribe(
                user => {
                    this.currentUser = user;
                }
            );
        }

        canActivate() {
            if (this.currentUser) {
                return true;
            }
            this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/login';
            this.router.navigate([this.returnUrl]);
            return false;
        }
}
