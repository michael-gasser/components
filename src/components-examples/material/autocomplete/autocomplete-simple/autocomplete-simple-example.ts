import {Component} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';

/**
 * @title Simple autocomplete
 */
@Component({
  selector: 'autocomplete-simple-example',
  templateUrl: 'autocomplete-simple-example.html',
  styleUrls: ['autocomplete-simple-example.css'],
})
export class AutocompleteSimpleExample {
  myControl = new UntypedFormControl();
  options: string[] = ['One', 'Two', 'Three'];
}
