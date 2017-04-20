import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Page } from "ui/page";
import { View } from "ui/core/view";
import { ListView } from "ui/list-view";
import { TextView } from "ui/text-view";
import { FaqService } from "../../shared/services.module";
import { Router } from "@angular/router";
import { User } from "../../shared/user/user";
import dialogs = require("ui/dialogs");

@Component({
  selector: "faq",
  templateUrl: "pages/faq/faq.html",
  styleUrls: ["pages/faq/faq-common.css", "pages/faq/faq.css"],
})
export class FaqComponent {
  isLoading = false;
  buttonEnabled: boolean;
  visibleID: number;
  questions: Array<any>;
  fbText: string;
  @ViewChild("qListView") qListView: ElementRef;

  constructor(private faqService: FaqService, private router: Router, private page: Page) {
    this.visibleID = -1;
    this.buttonEnabled = true;
    this.fbText = "";
  }
  toggleAnswer(id: number) {
    let qListView = <ListView>this.qListView.nativeElement;
    if (this.visibleID == id) {
      this.visibleID = -1;
    } else {
      this.visibleID = id;
    }
    qListView.refresh();
  }

  submit() {
    this.buttonEnabled = false;
    if (this.fbText.length != 0) {
      this.faqService.submit(this.fbText)
      .subscribe(
        (res) => {
          dialogs.alert({
            title: "Thank you",
            message: "We appreciate your feedback.\n - The Farm",
            okButtonText: "Okay"
          }).then(()=> {
            this.toggleAnswer(-2);
          });
          this.buttonEnabled = true;
      },
        (error) => {}
      );
    }
  }

  ngOnInit() {
    this.isLoading = true;
    this.questions = [];
    let feedback: any = {};
    feedback.id = -2;
    feedback.question = "How can I provide feedback or ask a question?";
    feedback.answer = "Fill out the form below.";
    feedback.form = true;
    this.questions.push(feedback);

    this.faqService.getFAQ()
      .subscribe(
        (res) => {
          res.forEach((q) => {
            this.questions.push(q);
          });
          this.isLoading = false;
      },
        (error) => {
            this.isLoading = false;
      }
      );
  }
}
