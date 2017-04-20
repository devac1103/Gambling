import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Page } from "ui/page";
import { Color } from "color";
import { View } from "ui/core/view";
import { RouterExtensions } from "nativescript-angular/router";
import { User } from "../../shared/user/user";
import { UserService } from "../../shared/services.module";
import dialogs = require("ui/dialogs");
import * as appSettings from "application-settings";

@Component({
  selector: "my-app",
  templateUrl: "pages/login/login.html",
  styleUrls: ["pages/login/login-common.css", "pages/login/login.css"]
})
export class LoginComponent implements OnInit {
  token: string;

  @ViewChild("container") container: ElementRef;

  constructor(private router: RouterExtensions, private userService: UserService, private page: Page) {
    this.token = appSettings.getString("token");
  }
  login() {
    this.userService.login(this.token)
      .subscribe(
        (res) => {
          if (res.status == 0 ) {
            if (res.needsFirstHorse) {
              this.router.navigate(["/firstHorse", 2, { clearHistory: true }]);
            } else {
              this.router.navigate(["/home"], { clearHistory: true });
            }
          } else {
            this.router.navigate(["/firstHorse"], { clearHistory: true });
          }
      },
        (error) => {
          dialogs.alert({
            title: "Sorry",
            message: "We are experiencing technical difficulties at the moment. Thank you for your patience. \n - The Farm",
            okButtonText: "Retry"
          })
            .then(result => {
              this.login();
            }
          );
        }
      );
  }

  ngOnInit() {
    this.page.actionBarHidden = true;
    if (this.token) {
      this.login();
    } else {
      this.router.navigate(["/firstHorse"], { clearHistory: true });
    }
  }
}
