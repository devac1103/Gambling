import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { TextField } from "ui/text-field";
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { UserService } from "../../shared/services.module";
import { User } from "../../shared/user/user";
import { WebView } from "ui/web-view";
import * as socialShareModule from "nativescript-social-share";

@Component({
  selector: "raceViewer",
  templateUrl: "pages/raceViewer/raceViewer.html",
  styleUrls: ["pages/raceViewer/raceViewer-common.css"],
})
export class RaceViewerComponent {
  raceID: number = 0;
  cacheBuster: number;
  isLoading = false;
  private sub: any;
  @ViewChild("webview") webview: ElementRef;

  constructor(private router: Router, private route: ActivatedRoute) {}

  loadFinished(event: Object) {
    this.isLoading = false;
  }

  shareText() {
    let text = "";
    if (this.raceID) {
      text = "Check out this race! http://offandpacing.com/viewRace.html?" + this.raceID + "\n #offandpacing";
    } else {
      text = "Watching live! http://offandpacing.com/viewRace.html \n #offandpacing";
    }

    socialShareModule.shareText(text, "How would you like to share?");
  }

  ngOnInit() {
    this.isLoading = true;
    this.sub = this.route.params.subscribe(params => {
       if (!isNaN(this.raceID)) {
         this.raceID = +params['id'];
       }
    });
    this.cacheBuster = ((Math.random() * 1e6) | 0);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
