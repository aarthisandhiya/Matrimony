import { NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService, Profile } from './service/http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = "App";
  profiles: Profile[] = [];
  navigated: boolean = false;
  currentIndex: number = 0;

  constructor(private httpService: HttpService, private router: Router) {}

  ngOnInit(): void {
    this.httpService.getProfiles().subscribe((data: Profile[]) => {
      this.profiles = data;
    });
  }

  navigate(id: number) {
    this.navigated = true;
    console.log("on click called", id);
    this.router.navigate(['/profile', id]);
  }
  previousProfile() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.profiles.length - 1;
    }
    this.navigate(this.profiles[this.currentIndex].id);
  }
  nextProfile() {
    if (this.currentIndex < this.profiles.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
    this.navigate(this.profiles[this.currentIndex].id);
  }
}
