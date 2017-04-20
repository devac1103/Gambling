import { NgModule } from "@angular/core";
import { FaqService } from "../shared/faq/faq.service";
import { NewsService } from "../shared/news/news.service";
import { DriverService } from "../shared/driver/driver.service";
import { HorseService } from "../shared/horse/horse.service";
import { OwnerService } from "../shared/owner/owner.service";
import { RaceService } from "../shared/race/race.service";
import { TrackService } from "../shared/track/track.service";
import { UserService } from "../shared/user/user.service";

@NgModule({})
export class ServicesModule {
  static forRoot() {
    return {
      ngModule: ServicesModule,
      providers: [DriverService, FaqService, HorseService, NewsService, OwnerService, RaceService, TrackService, UserService]
    }
  }
}
export {
  DriverService,
  FaqService,
  HorseService,
  NewsService,
  OwnerService,
  RaceService,
  TrackService,
  UserService
}
