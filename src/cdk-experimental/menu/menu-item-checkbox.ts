/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Directive} from '@angular/core';
import {CdkMenuItemSelectable} from './menu-item-selectable';
import {CdkMenuItem} from './menu-item';

/**
 * A directive providing behavior for the "menuitemcheckbox" ARIA role, which behaves similarly to a
 * conventional checkbox.
 */
@Directive({
  selector: '[cdkMenuItemCheckbox]',
  exportAs: 'cdkMenuItemCheckbox',
  host: {
    'role': 'menuitemcheckbox',
  },
  providers: [
    {provide: CdkMenuItemSelectable, useExisting: CdkMenuItemCheckbox},
    {provide: CdkMenuItem, useExisting: CdkMenuItemSelectable},
  ],
})
export class CdkMenuItemCheckbox extends CdkMenuItemSelectable {
  /** Toggle the checked state of the checkbox. */
  override trigger(options?: {keepOpen: boolean}) {
    super.trigger(options);

    if (!this.disabled) {
      this.checked = !this.checked;
    }
  }
}
