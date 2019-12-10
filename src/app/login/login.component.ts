import { ToastrService } from "ngx-toastr";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { first } from "rxjs/operators";
import { NgZone } from "@angular/core";
import { AppService } from '../app.service';
import { AuthenticationService } from '../shared/services';
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  model: any = {};
  returnUrl: string;
  errorMessage: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.authenticationService.logout();
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"];
  }

  login() {
    this.authenticationService
      .login(this.model.username, this.model.password)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(["/"], { relativeTo: this.route });
        },
        error => {
          this.errorMessage = "Invalid username or password. Please try again!";
        }
      );
  }
}
