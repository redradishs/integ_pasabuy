import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiUrl = "http://localhost/unimart_pasabuy/api"

  constructor(private http: HttpClient) { }



  //ENPOINTS FOR PROFILE PAGE
  getProfile(id: number){
    return this.http.get(`${this.apiUrl}/userDetails/${id}`);  
  }
}
