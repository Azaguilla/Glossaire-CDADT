import {Component, OnInit} from '@angular/core';
import {WordService} from '../../../services/word.service';
import Word from '../../models/word.model';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-single-word',
  templateUrl: './single-word.component.html',
  styleUrls: ['./single-word.component.css']
})
export class SingleWordComponent implements OnInit {

  constructor(private wordService: WordService,
              private route: ActivatedRoute) {
  }

  word: Word;
  ilya: string;
  open: boolean;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.wordService.getWordByTitle(params.title).subscribe((data: Word[]) => {
        this.word = data[0];
        this.ilya = this.wordService.getTimeIlya(this.word.last_edit);
        this.open = false;
      });
    });

  }

  onDisplayKnowMore() {
    if (this.open === true) {
      this.open = false;
    } else {
      this.open = true;
    }
  }
}
