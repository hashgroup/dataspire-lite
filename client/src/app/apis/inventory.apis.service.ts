import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {TokenService} from '../services/token.service';


@Injectable({
  providedIn: 'root'
})
export class InventoryApisService {

  constructor(private http: HttpClient,
              private tokenService: TokenService) {
  }


  inventories(): Observable<any[]> {
    return this.http.get(`${environment.apaleoAPI}/inventory/v1/properties`,
      {
        headers: {
          Authorization: `${this.tokenService.getTokenType()} ${this.tokenService.getAccessToken()}`
        }
      }).pipe(map((x: any) => x?.properties));
  }

}
