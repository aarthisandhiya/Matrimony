import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class HttpService {

  constructor(private http: HttpClient) { 
  }
  getProfiles():Observable<Profile[]>{
    return this.http.get<Profile[]>('assets/profiles.json')
  }

}
export interface Profile {
  id: number;
  name: string;
  age: number;
  height: string;
  caste: string;
  designation: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  };
  bio: string;
  image: string;
  language:string;
}