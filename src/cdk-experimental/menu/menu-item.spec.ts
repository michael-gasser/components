import {Component, Type, ElementRef} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {CdkMenuModule} from './menu-module';
import {CdkMenuItem} from './menu-item';
import {CDK_MENU} from './menu-interface';
import {CdkMenu} from './menu';
import {MENU_STACK, MenuStack} from '@angular/cdk-experimental/menu/menu-stack';

describe('MenuItem', () => {
  describe('with no complex inner elements', () => {
    let fixture: ComponentFixture<SingleMenuItem>;
    let menuItem: CdkMenuItem;
    let nativeButton: HTMLButtonElement;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [CdkMenuModule],
        declarations: [SingleMenuItem],
        providers: [
          {provide: CDK_MENU, useClass: CdkMenu},
          {provide: MENU_STACK, useClass: MenuStack},
          // View engine can't figure out the ElementRef to inject so we need to provide a fake
          {provide: ElementRef, useValue: new ElementRef<null>(null)},
        ],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(SingleMenuItem);
      fixture.detectChanges();

      menuItem = fixture.debugElement.query(By.directive(CdkMenuItem)).injector.get(CdkMenuItem);
      nativeButton = fixture.debugElement.query(By.directive(CdkMenuItem)).nativeElement;
    });

    it('should have the menuitem role', () => {
      expect(nativeButton.getAttribute('role')).toBe('menuitem');
    });

    it('should coerce the disabled property', () => {
      (menuItem as any).disabled = '';
      expect(menuItem.disabled).toBeTrue();
    });

    it('should toggle the aria disabled attribute', () => {
      expect(nativeButton.hasAttribute('aria-disabled')).toBeFalse();

      menuItem.disabled = true;
      fixture.detectChanges();

      expect(nativeButton.getAttribute('aria-disabled')).toBe('true');

      menuItem.disabled = false;
      fixture.detectChanges();

      expect(nativeButton.hasAttribute('aria-disabled')).toBeFalse();
    });

    it('should not have a menu', () => {
      expect(menuItem.hasMenu()).toBeFalse();
    });
  });

  describe('with complex inner elements', () => {
    let menuItem: CdkMenuItem;

    /**
     * Build a component for testing and render it.
     * @param componentClass the component to create
     */
    function createComponent<T>(componentClass: Type<T>) {
      let fixture: ComponentFixture<T>;

      TestBed.configureTestingModule({
        imports: [CdkMenuModule],
        declarations: [componentClass, MatIcon],
        providers: [
          {provide: CDK_MENU, useClass: CdkMenu},
          {provide: MENU_STACK, useClass: MenuStack},
          // View engine can't figure out the ElementRef to inject so we need to provide a fake
          {provide: ElementRef, useValue: new ElementRef<null>(null)},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(componentClass);
      fixture.detectChanges();

      menuItem = fixture.debugElement.query(By.directive(CdkMenuItem)).injector.get(CdkMenuItem);
      return fixture;
    }

    it('should get the text for a simple menu item with no nested or wrapped elements', () => {
      createComponent(SingleMenuItem);
      expect(menuItem.getLabel()).toEqual('Click me!');
    });

    it('should get the text for menu item with a single nested mat icon component', () => {
      const fixture = createComponent(MenuItemWithIcon);
      expect(menuItem.getLabel()).toEqual('unicorn Click me!');
      fixture.componentInstance.typeahead = 'Click me!';
      fixture.detectChanges();
      expect(menuItem.getLabel()).toEqual('Click me!');
    });

    it(
      'should get the text for menu item with single nested component with the material ' +
        'icon class',
      () => {
        const fixture = createComponent(MenuItemWithIconClass);
        expect(menuItem.getLabel()).toEqual('unicorn Click me!');
        fixture.componentInstance.typeahead = 'Click me!';
        fixture.detectChanges();
        expect(menuItem.getLabel()).toEqual('Click me!');
      },
    );

    it('should get the text for a menu item with bold marked text', () => {
      createComponent(MenuItemWithBoldElement);
      expect(menuItem.getLabel()).toEqual('Click me!');
    });

    it(
      'should get the text for a menu item with nested icon, nested icon class and nested ' +
        'wrapping elements',
      () => {
        const fixture = createComponent(MenuItemWithMultipleNestings);
        expect(menuItem.getLabel()).toEqual('unicorn Click menume!');
        fixture.componentInstance.typeahead = 'Click me!';
        fixture.detectChanges();
        expect(menuItem.getLabel()).toEqual('Click me!');
      },
    );
  });
});

@Component({
  template: `<button cdkMenuItem>Click me!</button>`,
})
class SingleMenuItem {}

@Component({
  template: `
    <button cdkMenuItem [typeahead]="typeahead">
      <mat-icon>unicorn</mat-icon>
      Click me!
    </button>
  `,
})
class MenuItemWithIcon {
  typeahead: string;
}

@Component({
  template: `
    <button cdkMenuItem [typeahead]="typeahead">
      <div class="material-icons">unicorn</div>
      Click me!
    </button>
  `,
})
class MenuItemWithIconClass {
  typeahead: string;
}

@Component({
  template: ` <button cdkMenuItem><b>Click</b> me!</button> `,
})
class MenuItemWithBoldElement {}

@Component({
  template: `
    <button cdkMenuItem [typeahead]="typeahead">
      <div>
        <div class="material-icons">unicorn</div>
        <div>
          Click
        </div>
        <mat-icon>menu</mat-icon>
        <div>me<b>!</b></div>
      </div>
    </button>
  `,
})
class MenuItemWithMultipleNestings {
  typeahead: string;
}

@Component({
  selector: 'mat-icon',
  template: '<ng-content></ng-content>',
})
class MatIcon {}
