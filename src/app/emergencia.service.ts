import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmergenciaService {

  constructor(private http: HttpClient) { }

  //WEBSERVICE EMERGENCIA
  getEmergencia(movil):Observable<any>{
    return this.http.get('https://frozen-escarpment-13524.herokuapp.com/emergencia_ambulancia/'+movil).pipe(map(res=>res));
  }
}
