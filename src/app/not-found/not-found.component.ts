import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  constructor(    private titleService: Title //used to update pages window titles
) { }

  ngOnInit(): void {
    this.titleService.setTitle("Tuniscape Prod - PAGE NOT FOUND");
  }

}
