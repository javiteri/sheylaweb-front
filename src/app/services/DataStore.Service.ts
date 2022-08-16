import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { DataStoreGlobalModel } from "../interfaces/DataStoreGlobalModel";


@Injectable({providedIn: 'root'})
export class DataStoreService{

  // Make _globalStateSource private so it's not accessible from the outside,
  // expose it as globalModel$ observable (read-only) instead.
  // Write to _puppiesSource only through specified store methods below.
  private readonly _globalStateSource = new BehaviorSubject<DataStoreGlobalModel>(new DataStoreGlobalModel);

  // Exposed observable (read-only).
  readonly globalModel$ = this._globalStateSource.asObservable();

  constructor(){}


  private _setGlobalState(globalState: DataStoreGlobalModel): void{
    this._globalStateSource.next(globalState);
  }

  setGlobalState(globalStateModel: DataStoreGlobalModel): void{
    this._setGlobalState(globalStateModel);
  }

}
