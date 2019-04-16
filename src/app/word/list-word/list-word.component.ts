import { Component, OnInit } from '@angular/core';
import {WordService} from '../../../services/word.service';
import {ActivatedRoute} from '@angular/router';
import Word from '../../models/word.model';

@Component({
  selector: 'app-list-word',
  templateUrl: './list-word.component.html',
  styleUrls: ['./list-word.component.css']
})
export class ListWordComponent implements OnInit {

  words: Word[];
  thmTitle: string;

  constructor(private wordService: WordService,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.thmTitle = params.title;
      this.wordService.getWordsByThmTitle(params.title).subscribe((data: Word[]) => {
        this.words = data;
      });
    });
  }

  onOpenDef(id) {
    console.log(id);
    const elem = document.getElementById(id);
    if (elem.className === 'list-word-def-content d-block') {
      elem.className = 'list-word-def-content d-none';
    } else {
      elem.className = 'list-word-def-content d-block';
    }
  }
}
