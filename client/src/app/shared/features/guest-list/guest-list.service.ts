import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

interface SegmentData {
  name: string;
  value: number;
}

interface ClvData {
  category: string;
  first: number;
  second: number;
}

@Injectable({
  providedIn: 'root'
})
export class GuestListService {
  segmentationDataChanged = new Subject<SegmentData[]>();
  clvClassListDataChanged = new Subject<ClvData[]>();
  constructor(){}
}
