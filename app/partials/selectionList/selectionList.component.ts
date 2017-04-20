import { Component } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { HorseService } from "../../shared/services.module";
import { ModalDialogParams} from "nativescript-angular/modal-dialog";

@Component({
  moduleId: module.id,
  selector: "selectionList",
  templateUrl: "selectionList.html",
  styleUrls: ["selectionList-common.css", "selectionList.css"]
})
export class SelectionListComponent {
  title: string;
  list: Array<any> = [];

  constructor(private horseService: HorseService, private params: ModalDialogParams, private router: RouterExtensions) {
    this.title = params.context.items;
    this.list = params.context.list;
  }

  public close(result) {
    this.params.closeCallback(result);
  }
}
