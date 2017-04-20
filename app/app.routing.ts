import { LoginComponent } from "./pages/login/login.component";
import { HomeComponent } from "./pages/nav/home/home.component";
import { FirstHorseComponent } from "./pages/firstHorse/firstHorse.component";
import { RacesNavComponent } from "./pages/nav/racesNav/racesNav.component";
import { StandingsComponent } from "./pages/nav/standings/standings.component";
import { FaqComponent } from "./pages/faq/faq.component";
import { NewsComponent } from "./pages/news/news.component";
import { RaceViewerComponent } from "./pages/raceViewer/raceViewer.component";
import { UpcomingComponent } from "./pages/cardList/upcoming/upcoming.component";
import { ResultsComponent } from "./pages/cardList/results/results.component";
import { OwnerComponent } from "./pages/profiles/owner/owner.component";
import { DriverComponent } from "./pages/profiles/driver/driver.component";
import { HorseComponent } from "./pages/profiles/horse/horse.component";
import { MyHorsesComponent } from "./pages/myHorses/myHorses.component";
import { BreedingComponent } from "./pages/breeding/breeding.component";
import { AuctionComponent } from "./pages/auction/auction.component";
import { PurchaseComponent } from "./pages/nav/purchase/purchase.component";
import { StakesComponent } from "./pages/standings/stakes/stakes.component";
import { TopHorsesComponent } from "./pages/standings/topHorses/topHorses.component";
import { TopOwnersComponent } from "./pages/standings/topOwners/topOwners.component";
import { TopDriversComponent } from "./pages/standings/topDrivers/topDrivers.component";
import { ProgramComponent } from "./pages/program/program.component";
import { BuyHorseComponent } from "./pages/buyhorse/buyhorse.component";
import { TracksComponent } from "./pages/cardList/tracks/tracks.component";
import { TrackComponent } from "./pages/profiles/track/track.component";
import { StakeComponent } from "./pages/profiles/stake/stake.component";
import { TransactionsComponent } from "./pages/transactions/transactions.component";

export const routes = [
  { path: "", component: LoginComponent },
  { path: "home", component: HomeComponent },
  { path: "firstHorse", component: FirstHorseComponent },
  { path: "firstHorse/:step", component: FirstHorseComponent },
  { path: "faq", component: FaqComponent },
  { path: "news", component: NewsComponent },
  { path: "racesNav", component: RacesNavComponent },
  { path: "standings", component: StandingsComponent },
  { path: "raceViewer", component: RaceViewerComponent },
  { path: "raceViewer/:id", component: RaceViewerComponent },
  { path: "upcoming", component: UpcomingComponent },
  { path: "results", component: ResultsComponent },
  { path: "owner/:id", component: OwnerComponent },
  { path: "driver/:id", component: DriverComponent },
  { path: "horse/:id", component: HorseComponent },
  { path: "stake/:id", component: StakeComponent },
  { path: "purchase", component: PurchaseComponent },
  { path: "stakes", component: StakesComponent },
  { path: "topHorses", component: TopHorsesComponent },
  { path: "topDrivers", component: TopDriversComponent },
  { path: "topOwners", component: TopOwnersComponent },
  { path: "myHorses", component: MyHorsesComponent },
  { path: "myHorses/:reload", component: MyHorsesComponent },
  { path: "auction", component: AuctionComponent },
  { path: "program", component: ProgramComponent },
  { path: "breeding", component: BreedingComponent },
  { path: "buyhorse", component: BuyHorseComponent },
  { path: "tracks", component: TracksComponent },
  { path: "track/:id", component: TrackComponent },
  { path: "transactions", component: TransactionsComponent },
];

export const navigatableComponents = [
  LoginComponent,
  HomeComponent,
  FaqComponent,
  NewsComponent,
  RacesNavComponent,
  StandingsComponent,
  FirstHorseComponent,
  RaceViewerComponent,
  UpcomingComponent,
  ResultsComponent,
  OwnerComponent,
  DriverComponent,
  HorseComponent,
  PurchaseComponent,
  StakesComponent,
  TopHorsesComponent,
  TopOwnersComponent,
  TopDriversComponent,
  MyHorsesComponent,
  AuctionComponent,
  ProgramComponent,
  BuyHorseComponent,
  BreedingComponent,
  TracksComponent,
  TrackComponent,
  StakeComponent,
  TransactionsComponent
];
