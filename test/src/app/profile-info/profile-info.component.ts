import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService, Profile } from '../service/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css']
})
export class ProfileInfoComponent implements OnInit {
  profileInfo: Profile[];
  masterProfile: Profile[];
  shortlisted: any = [];
  notInterested: any = [];
  interested: any = [];
  currentIndex = 0;  
  cardsToShow = 1;  
  visibleProfiles: Profile[] = [];

  constructor(private route: ActivatedRoute, private http: HttpService, private snackBar: MatSnackBar) {
    this.route.paramMap.subscribe(params => {
      const selectedId = params.get('id'); 
      console.log(" from indooo ", selectedId)
      if (selectedId) {
        this.http.getProfiles().subscribe((profiles: Profile[]) => {
          this.masterProfile = profiles;
          const selectedProfileIndex = this.masterProfile.findIndex((profile:any) => profile.id == selectedId);
          const selectedProfile = this.masterProfile[selectedProfileIndex];
          this.masterProfile.splice(selectedProfileIndex, 1);
          this.profileInfo = [selectedProfile, ...this.masterProfile.slice(selectedProfileIndex), ...this.masterProfile.slice(0, selectedProfileIndex)];
          this.currentIndex = 0;
          this.updateVisibleProfiles();
        });
      }
    });
  }

  ngOnInit(): void {
    if (this.masterProfile) {
      this.updateVisibleProfiles();
    }
  }

  updateVisibleProfiles(): void {
    this.visibleProfiles = this.profileInfo.slice(this.currentIndex, this.currentIndex + this.cardsToShow);
  }

  previousCard(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateVisibleProfiles();
    } else {
      this.currentIndex = this.profileInfo.length - 1;
      this.updateVisibleProfiles();
    }
  }

  nextCard(): void {
    if (this.currentIndex + this.cardsToShow < this.profileInfo.length - 1) {
      this.currentIndex++;
      this.updateVisibleProfiles();
    } else {
      this.currentIndex = 0; 
      this.updateVisibleProfiles();
    }
  }

  onShortlist(profileId: any): void {
    const exists = this.shortlisted.some((item:any) => item.id === profileId);
    if (!exists) {
      const profile = this.profileInfo.find(p => p.id === profileId);
      this.shortlisted.push(profile);
      this.showNotification('Shortlisted');
      this.goToNextProfile(); 
    }
  }

  onNo(profileId: any): void {
    const exists = this.notInterested.some((item:any )=> item.id === profileId);
    if (!exists) {
      const profile = this.profileInfo.find(p => p.id === profileId);
      this.notInterested.push(profile);
      this.showNotification('Not Interested');
      this.goToNextProfile();
    }
  }

  onYes(profileId: any): void {
    const exists = this.interested.some((item:any) => item.id === profileId);
    if (!exists) {
      const profile = this.profileInfo.find(p => p.id === profileId);
      this.interested.push(profile);
      this.showNotification('Interested');
      this.goToNextProfile(); 
    }
  }

  showNotification(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 2000 });
  }

  goToNextProfile(): void {
    this.currentIndex++;
    
    if (this.currentIndex >= this.profileInfo.length) {
      if (
        this.interested.length + 
        this.notInterested.length + 
        this.shortlisted.length === 
        this.profileInfo.length
      ) {
        this.showNotification('No profiles pending');
      } else {
        this.currentIndex = 0;
      }
    }
    
    this.updateVisibleProfiles();
  }
}
