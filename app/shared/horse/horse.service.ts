import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { RaceEntry } from "../race/raceEntry";
import { RaceResult } from "../race/raceResult";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";

import { Config } from "../config";
import { Horse } from "./horse";
import * as appSettings from "application-settings";

@Injectable()
export class HorseService {

  myHorses: Array<Horse> = null;
  breedingHorses: Array<Horse> = null;
  auctionHorses: Array<Horse> = null;
  horseBadge: number = null;

  constructor(private http: Http) {}

  getHorse(id: number) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.post(
      Config.apiUrl + "getHorseDetails",
      JSON.stringify({
        id: id
      }),
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {
      return data.horseDetails;
    })
    .catch(this.handleErrors);
  }
  withdraw(entryID: number) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.post(
      Config.apiUrl + "withdrawEntry",
      JSON.stringify({
        id: entryID
      }),
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {
      return true;
    })
    .catch(this.handleErrors);
  }
  firstHorse(name: string, gender: number) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.post(
      Config.apiUrl + "buyHorse",
      JSON.stringify({
        name: name,
        sex: gender
      }),
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {
      let h = data.horse;
      return (new Horse(h.id,h.name,h.dateBorn,h.age,h.sex,h.ownerID,h.ownerName,h.color,h.retired,h.gate,[],h.stats,[],h.salePrice));
    })
    .catch(this.handleErrors);
  }
  getHorsesBadge() {
    if (!this.myHorses) {
      this.getMyHorses()
        .subscribe(
          (res) => {},
          (error) => {}
      );
    } else {
      this.countBadge();
    }
  }
  countBadge() {
    this.horseBadge = 0;
    this.myHorses.forEach((h) => {
      if (h.retired == 0 && h.upcomingRaces.length == 0 && !h.salePrice) {
        this.horseBadge++;
      }
    });
  }
  buyHorse(name: string, gender: number, price: number) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.post(
      Config.apiUrl + "buyHorse",
      JSON.stringify({
        name: name,
        sex: gender,
        price: price
      }),
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {
      return data;
    })
    .catch(this.handleErrors);
  }
  sell(id, price) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.post(
      Config.apiUrl + "postHorseForSale",
      JSON.stringify({
        id: id,
        price: price
      }),
      { headers: headers }
    )
    .map(response => {
      return response.json();
    })
    .map(data => {
      return data;
    })
    .catch(this.handleErrors);
  }
  retire(id) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.post(
      Config.apiUrl + "retireHorse",
      JSON.stringify({
        horse: id,
      }),
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {
      if (data.status == 0) {
        return data;
      }
      return false;
    })
    .catch(this.handleErrors);
  }
  stakes(id) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.post(
      Config.apiUrl + "enableHorseStakes",
      JSON.stringify({
        horse: id,
      }),
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {
      if (data.status == 0) {
        return data;
      }
      return false;
    })
    .catch(this.handleErrors);
  }
  register(id) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.post(
      Config.apiUrl + "register",
      JSON.stringify({
        horse: id,
      }),
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {
      if (data.status == 0) {
        return data;
      }
      return false;
    })
    .catch(this.handleErrors);
  }
  buy(id: number) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.post(
      Config.apiUrl + "buyHorseForSale",
      JSON.stringify({
        id: id,
      }),
      { headers: headers }
    )
    .map(response => {
      return response.json();
    })
    .map(data => {
      return data;
    })
    .catch(this.handleErrors);
  }
  bid(id: number, bid: number) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.post(
      Config.apiUrl + "placeBid",
      JSON.stringify({
        id: id,
        bid: bid
      }),
      { headers: headers }
    )
    .map(response => {
      return response.json();
    })
    .map(data => {
      return data;
    })
    .catch(this.handleErrors);
  }
  changeFee(id, newFee) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.post(
      Config.apiUrl + "setStudFee",
      JSON.stringify({
        id: id,
        fee: newFee
      }),
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {
      return data;
    })
    .catch(this.handleErrors);
  }
  changeName(id: number, newName: string) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.post(
      Config.apiUrl + "changeName",
      JSON.stringify({
        id: id,
        name: newName
      }),
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {
      return data;
    })
    .catch(this.handleErrors);
  }
  enterRace(horse: number, race: number, driver: number) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.post(
      Config.apiUrl + "enterRace",
      JSON.stringify({
        horse: horse,
        raceID: race,
        driver: driver
      }),
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {
      if (data.status == 0) {
        return data;
      }
      return false;
    })
    .catch(this.handleErrors);
  }
  breed(sire: number, mare: number) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this.http.post(
      Config.apiUrl + "breed",
      JSON.stringify({
        sire: sire,
        mare: mare
      }),
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {
      if (data.status == 0) {
        return data;
      }
      return false;
    })
    .catch(this.handleErrors);
  }

  getEligibleRaces(horse: number) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.post(
      Config.apiUrl + "getEligableRaces",
      JSON.stringify({
        horse: horse
      }),
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {
      return data.races;
    })
    .catch(this.handleErrors);
  }
  getMyHorses() {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.get(
      Config.apiUrl + "getMyHorses",
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {
      let horseList = [];
      data.horses.forEach((h) => {
        let raceList = [];
        h.upcomingRaces.forEach((r) => {
          raceList.push(new RaceEntry(r.id, r.driverChosen, r.driverConfirmed, r.enteredDate, r.horseID, r.postDrawn, r.purse, r.raceDate, r.raceID, r.description, r.track));
        });
        let pastRaceList = [];
        h.pastRaces.forEach((r) => {
          pastRaceList.push(new RaceResult(r.id, r.finishLengths, r.finishPosition, r.finishTime, r.halfLengths, r.halfPosition, r.halfTime, r.horseID, r.horseName, r.post, r.purse, r.quarterLengths, r.quarterPosition, r.quarterTime, r.raceDate, r.raceID, r.description, r.threeQuarterLengths, r.threeQuarterPosition, r.threeQuarterTime, r.track, r.driverName));
        });

        let storedFilter = appSettings.getString("filter"+h.id);
        let filter = {};
        if (!storedFilter) {
          filter = {  showReg: true,
                      showStakes: true,
                      showClaiming: true
                    };
        } else {
          filter = JSON.parse(storedFilter);
        }
        let stats = "( " +h.starts+ "-" +h.wins+ "-" +h.places+ "-" +h.shows+ " " +h.average+ " )";
        horseList.push(new Horse(h.id,h.name,h.dateBorn,h.age,h.sex,h.ownerID,h.ownerName,h.color,h.retired,h.gate,pastRaceList,stats,raceList, h.salePrice, filter, null, null, h.studFee, h.stakes, h.topSpeed, h.gateSpeed, h.stamina, h.heart));
      });

      // add empty horse card to show at the end of the listview
      horseList.push(<Horse>{ name: "Buy Horse Card" });

      this.myHorses = horseList;
      this.countBadge();
      return horseList;
    })
    .catch(this.handleErrors);
  }
  getBreedingHorses() {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.get(
      Config.apiUrl + "getBreedingHorses",
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {
      let horseList = [];
      data.horses.forEach((h) => {
        let stats = "( " +h.starts+ "-" +h.wins+ "-" +h.places+ "-" +h.shows+ " " +h.average+ " )";
        horseList.push(new Horse(h.id,h.name,h.dateBorn,h.age,h.sex,h.ownerID,h.ownerName,h.color,h.retired,h.gate,[],stats,[], h.salePrice, {}, null, null, h.studFee, h.stakes, h.topSpeed, h.gateSpeed, h.stamina, h.heart, h.registered, h.breedAvailable));
      });
      this.breedingHorses = horseList;
      // this.countBadge();
      return horseList;
    })
    .catch(this.handleErrors);
  }
  getAuctionHorses() {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.get(
      Config.apiUrl + "getHorsesForAuction",
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {
      let horseList = [];
      data.horses.forEach((h) => {
        horseList.push(new Horse(h.id,h.name,h.dateBorn,h.age,h.sex,h.ownerID,h.ownerName,h.color,h.retired,h.gate,[],"",[], h.salePrice, {}, h.timeLeft, h.bidder));
      });
      this.auctionHorses = horseList;
      return horseList;
    })
    .catch(this.handleErrors);
  }
  getSires() {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.get(
      Config.apiUrl + "getSireList",
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {

      let sires = [];
      data.horses.forEach((h) => {
        sires.push({id: h.id, name: h.name, fee: this.commaSeparateNumber(h.studFee)});
      });
      return sires;
    })
    .catch(this.handleErrors);
  }

  getTopHorses(range: string, type:string) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.post(
      Config.apiUrl + "getTopHorses",
      JSON.stringify({
        range: range,
        type: type
      }),
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {
      return data.horses;
    })
    .catch(this.handleErrors);
  }
  getConditionString(cond: string){
  	if (!cond) {
  		return null;
  	}
    let c: any = JSON.parse(cond.replace(/([a-z][^:]*)(?=\s*:)/g, '"$1"'));
    var s = "";
    if (c.fm) {
      s += "FM ";
    }
    if (c.nwr) {
  		if (c.nwr == 1) {
  			s += "Maiden";
  		} else {
  			s += "NW "+c.nwr+" Races";
  		}

      if (c.nwm) {
        s += " OR "+c.nwm+"Lifetime";
      }
    } else if (c.nwm) {
      s += "NW "+c.nwm+"Lifetime";
    } else if (c.c) {
  		s += "Claiming " + c.c;
  	}
    return s;
  }
  commaSeparateNumber(val:number) {
    let newVal: string = val.toString();

    if (newVal){
      while (/(\d+)(\d{3})/.test(newVal)) {
        newVal = newVal.replace(/(\d+)(\d{3})/, '$1'+','+'$2');
      }
    }
    return newVal;
  }
  handleErrors(error: Response) {
    return Observable.throw(error);
  }
}
