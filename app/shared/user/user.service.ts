import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";

import { User } from "./user";
import { Config } from "../config";
import * as appSettings from "application-settings";

@Injectable()
export class UserService {
  user: User;
  week: number;
  season: number;

  constructor(private http: Http) {}

  commaSeparateNumber(val:number) {
    let newVal: string = val.toString();

  	if (newVal){
  	  while (/(\d+)(\d{3})/.test(newVal)) {
  	    newVal = newVal.replace(/(\d+)(\d{3})/, '$1'+','+'$2');
  	  }
  	}
    return newVal;
  }
  getBalance() {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.get(
      Config.apiUrl + "getBalance",
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {
      this.user.coinBalance = data.balance;
      return data.balance;
    })
    .catch(this.handleErrors);
  }
  getTransactions() {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.get(
      Config.transApiUrl + "getTransactions",
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {
      return data.transactions;
    })
    .catch(this.handleErrors);
  }
  enableBreeding() {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.get(
      Config.apiUrl + "enableBreeding",
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {
      this.user.breedingEnabled = 1;
      return data;
    })
    .catch(this.handleErrors);
  }
  getID() {
    return this.user.id;
  }
  getUsername() {
    return this.user.username;
  }
  getUserCoinBalance() {
    return this.commaSeparateNumber(this.user.coinBalance);
  }
  getWeek() {
    return this.week;
  }
  getSeason() {
    return this.season;
  }

  login(token: string) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.post(
      Config.apiUrl + "loginWithToken",
      JSON.stringify({
        token: token,
      }),
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {
      this.user = new User(data.userID, data.username, data.coinBalance, data.breedingEnabled);
      this.week = data.week;
      this.season = data.season;
      return data;
    })
    .catch(this.handleErrors);
  }
  getNewToken(username: string) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.post(
      Config.apiUrl + "getNewToken",
      JSON.stringify({
        username: username,
      }),
      { headers: headers }
    )
    .map(response => {
      return response.json();
    })
    .map(data => {
      this.user = new User(data.userID, data.username, data.coinBalance, data.breedEnabled);
      appSettings.setString("token", data.token);
      this.week = data.week;
      this.season = data.season;
    })
    .catch(this.handleErrors);
  }

  handleErrors(error: Response) {
    return Observable.throw(error);
  }
}
