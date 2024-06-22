import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-announcement-bar',
  templateUrl: './announcement-bar.component.html',
  styleUrls: ['./announcement-bar.component.css']
})
export class AnnouncementBarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Start the animation
    this.startAnimation();
  }

  startAnimation(): void {
    const announcementText = document.querySelector('.announcement-text');
    if (announcementText) {
      const announcementWidth = announcementText.clientWidth;
      const animationDuration = announcementWidth / 50; // Adjust speed based on announcement width

      announcementText.animate([
        { transform: `translateX(0)` },
        { transform: `translateX(-${announcementWidth}px)` }
      ], {
        duration: animationDuration * 1000, // Convert seconds to milliseconds
        iterations: Infinity // Loop indefinitely
      });
    }
  }

}
