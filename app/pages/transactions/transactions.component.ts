import { Component, OnInit } from "@angular/core";
import { ListView } from "ui/list-view";
import { Router } from "@angular/router";
import { UserService } from "../../shared/services.module";

@Component({
  moduleId: module.id,
  selector: "transactions",
  templateUrl: "./transactions.html",
  styleUrls: ["./transactions-common.css", "./transactions.css"],
})
export class TransactionsComponent {
  isLoading = false;
  transactions: Array<any>;

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    this.isLoading = true;
    this.userService.getTransactions()
      .subscribe(
        (res) => {
          this.transactions = res;
          this.isLoading = false;
      },
        (error) => {
            this.isLoading = false;
      }
      );
  }
}
