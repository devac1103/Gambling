import { NgModule } from "@angular/core";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { ServicesModule } from "./shared/services.module";
import { AppComponent } from "./app.component";
import { DashboardComponent } from "./partials/dashboard/dashboard.component";
import { SelectionListComponent } from "./partials/selectionList/selectionList.component";
import { UpcomingRacesComponent } from "./partials/upcomingRaces/upcomingRaces.component";
import { PastRacesComponent } from "./partials/pastRaces/pastRaces.component";
import { ProgramRaceComponent } from "./partials/program/race/race.component";
import { routes, navigatableComponents } from "./app.routing";

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    NativeScriptHttpModule,
    NativeScriptRouterModule,
    NativeScriptRouterModule.forRoot(routes),
    ServicesModule.forRoot()
  ],
  entryComponents: [SelectionListComponent],
  declarations: [
    AppComponent,
    DashboardComponent,
    SelectionListComponent,
    UpcomingRacesComponent,
    PastRacesComponent,
    ProgramRaceComponent,
    ...navigatableComponents
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
