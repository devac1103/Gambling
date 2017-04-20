import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { Config } from "../config";

@Injectable()
export class NewsService {
  constructor(private http: Http) {}

  getNews(date: Date) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.post(
      Config.apiUrl + "getNews",
      JSON.stringify({
        date: date
      }),
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {
      return data.news;
    })
    .catch(this.handleErrors);
  }
  submit(type: string, news: string) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.post(
      Config.apiUrl + "addNewsItem",
      JSON.stringify({
        type: type,
        news: news
      }),
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {
      return data;
    })
    .catch(this.handleErrors);
  }

  handleErrors(error: Response) {
    return Observable.throw(error);
  }
}
