import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { OwnerService, UserService } from "../../../shared/services.module";

@Component({
  moduleId: module.id,
  selector: "top-owners",
  templateUrl: "./topOwners.html",
  styleUrls: ["../standings-common.css", "../standings.css"]
})
export class TopOwnersComponent {
  isLoading = false;
  range: string;
  type: string;
  owners: any;

  constructor(private ownerService: OwnerService, private router: Router, private userService: UserService) {
    this.range = "all";
    this.type = "purses";
  }
  setRange(r: string) {
    this.range = r;
    this.ngOnInit();
  }
  setType(t: string) {
    this.type = t;
    this.ngOnInit();
  }
  ngOnInit() {
    this.isLoading = true;
    this.ownerService.getTopOwners(this.range, this.type)
    .subscribe(
      (res) => {
        this.owners = res;
        this.isLoading = false;
    },
      (error) => {
        this.isLoading = false;
    }
    );
  }

  goToOwner(id) {
    this.router.navigate(["/owner/"+id]);
  }
}
