import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { NewsService } from "../../shared/services.module";
import { Router } from '@angular/router';
import { ListView } from "ui/list-view";
import { registerElement } from "nativescript-angular/element-registry";
import { PullToRefresh } from "nativescript-pulltorefresh";

registerElement("pullToRefresh",() => require("nativescript-pulltorefresh").PullToRefresh);

@Component({
  selector: "news",
  templateUrl: "pages/news/news.html",
  styleUrls: ["pages/news/news-common.css", "pages/news/news.css"],
})
export class NewsComponent {
  isLoading = false;
  fetchDate: Date;
  currentTab = 1;
  balance: boolean = false;
  news: any = [];
  @ViewChild("newsList") newsList: ElementRef;

  refreshMe(args: any) {
      this.fetchDate = new Date();
      setTimeout(() => {
        this.newsService.getNews(this.fetchDate)
        .subscribe(
          (res) => {
            let items = res;
            this.news = items.concat(this.news);
        },
          (error) => {}
        );
        (<PullToRefresh>args.object).refreshing = false;
      }, 2000);
  }

  constructor(private newsService: NewsService, public router: Router) {
    this.currentTab = 1;
  }

  public templateSelector = (item: any, index: number, items: any) => {
    if (this.currentTab == item.global) {
      return "story";
    } else {
      return "empty";
    }
  }
  showTab(tab: number) {
    if (this.currentTab != 2) {
      let newsList = <ListView>this.newsList.nativeElement;
      newsList.refresh();
    }
    this.currentTab = tab;
  }

  ngOnInit() {
    this.isLoading = true;
    this.fetchDate = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
    this.newsService.getNews(this.fetchDate)
    .subscribe(
      (res) => {
        this.news = res;
        this.isLoading = false;
    },
      (error) => {
        this.isLoading = false;
    }
    );
  }
}
