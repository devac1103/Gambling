import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { Config } from "../config";

@Injectable()
export class FaqService {
  constructor(private http: Http) {}

  getFAQ() {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.get(
      Config.apiUrl + "getFAQ",
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {
      return data.FAQ;
    })
    .catch(this.handleErrors);
  }

  submit(feedback: string) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.post(
      Config.apiUrl + "submitFeedback",
      JSON.stringify({
        feedback: feedback,
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
