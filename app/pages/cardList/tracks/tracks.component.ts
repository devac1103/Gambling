import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ListView } from "ui/list-view";
import { Router } from '@angular/router';
import { TrackService } from "../../../shared/services.module";

@Component({
  moduleId: module.id,
  selector: "tracks",
  templateUrl: "./tracks.html",
  styleUrls: ["../cardList-common.css", "../cardList.css"],
})
export class TracksComponent {
  isLoading = false;
  tracks: Array<any> = [];

  @ViewChild("tracksListView") tracksListView: ElementRef;

  constructor(private router: Router, private trackService: TrackService) {}

  fetchFromServer() {
    this.trackService.getTracks()
      .subscribe(
        (res) => {
          this.tracks = res;
          this.isLoading = false;
      },
        (error) => {
          this.isLoading = false;
      }
      );
  }

  ngOnInit() {
    this.isLoading = true;
    if (!this.trackService.tracks) {
      this.fetchFromServer();
    } else {
      this.tracks = this.trackService.tracks;
      this.isLoading = false;
    }
  }
  goToTrack(id: number) {
    this.router.navigate(["/track/"+id]);
  }
}
