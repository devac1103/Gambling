import { Component, OnInit } from "@angular/core";
import { Location } from '@angular/common';
import { Router } from "@angular/router";
import *  as purchase from "nativescript-purchase";
import { Product } from "nativescript-purchase/product";
import { Transaction, TransactionState } from "nativescript-purchase/transaction";
import * as applicationSettings from "application-settings";

var utilityModule = require("utils/utils");

@Component({
  moduleId: module.id,
  selector: "purchase",
  templateUrl: "./purchase.html",
  styleUrls: ["../nav-common.css", "../nav.css"]
})
export class PurchaseComponent {

  constructor(private location: Location, private router: Router) {
  }

  ngOnInit() {
    console.log("Purchases: ", JSON.stringify(purchase));
    purchase.getProducts().then((products: Array<Product>) => {
        console.log("I'm in: ", JSON.stringify(products));
        products.forEach((product: Product) => {
            console.log(product.productIdentifier);
            console.log(product.localizedTitle);
            console.log(product.priceFormatted);
        });
    });

    purchase.on(purchase.transactionUpdatedEvent, (transaction: Transaction) => {
    if (transaction.transactionState === TransactionState.Purchased) {
        alert(`Congratulations you just bought ${transaction.productIdentifier}!`);
        console.log(transaction.transactionDate);
        console.log(transaction.transactionIdentifier);
        applicationSettings.setBoolean(transaction.productIdentifier, true);
    }
    else if (transaction.transactionState === TransactionState.Restored) {
        console.log(`Purchase of ${transaction.productIdentifier} restored.`);
        console.log(transaction.transactionDate);
        console.log(transaction.transactionIdentifier);
        console.log(transaction.originalTransaction.transactionDate);
        applicationSettings.setBoolean(transaction.productIdentifier, true);
    }
    else if (transaction.transactionState === TransactionState.Failed) {
        alert(`Purchase of ${transaction.productIdentifier} failed!`);
    }
});
  }

}
