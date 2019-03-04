import {
  Directive,
  ElementRef,
  ViewContainerRef,
  Component,
  ContentChildren,
  QueryList,
  ViewChild,
  ContentChild
} from '@angular/core';
import { NguCarouselOutletContext } from './ngu-carousel';
import {
  NguCarouselDefDirective,
  NguCarouselOutlet,
  NguCarouselOutletLeft,
  NguCarouselOutletRight
} from './ngu-carousel.directive';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[nguCarouselItemContainer]',
  template: `
    <ng-content></ng-content>
  `,
  host: {
    '[class.nguvertical]': 'isVertical'
  }
})
export class NguCarouselItemContainerComponent<T> {
  isVertical = false;
  private _defaultNodeDef: NguCarouselDefDirective<T> | null;

  @ContentChildren(NguCarouselDefDirective)
  private _defDirec: QueryList<NguCarouselDefDirective<T>>;

  @ContentChild(NguCarouselOutlet)
  private _nodeOutlet: NguCarouselOutlet;

  @ViewChild(NguCarouselOutletLeft)
  private _nodeOutletLeft: NguCarouselOutlet;

  @ViewChild(NguCarouselOutletRight)
  private _nodeOutletRight: NguCarouselOutlet;

  constructor(public el: ElementRef) {}

  private _createNodeItem(
    data: T[],
    viewContainer: ViewContainerRef,
    currentIndex: number,
    tempItem = false,
    insertIndex?: number
  ) {
    const node = this._getNodeDef(data[currentIndex], currentIndex);
    const context = new NguCarouselOutletContext<T>(data[currentIndex]);
    context.index = currentIndex;
    const indexx =
      !tempItem && typeof insertIndex !== 'number'
        ? currentIndex
        : typeof insertIndex === 'number'
        ? insertIndex
        : null;
    return viewContainer.createEmbeddedView(node.template, context, indexx);
  }

  private _getNodeDef(data: T, i: number): NguCarouselDefDirective<T> {
    if (this._defDirec.length === 1) {
      return this._defDirec.first;
    }

    const nodeDef =
      this._defDirec.find(def => def.when && def.when(i, data)) || this._defaultNodeDef;

    return nodeDef;
  }

  /**
   * Updates the index-related context for each row to reflect any changes in the index of the rows,
   * e.g. first/last/even/odd.
   */
  private _updateItemIndexContext() {
    const viewContainer = this._nodeOutlet.viewContainer;
    for (let renderIndex = 0, count = viewContainer.length; renderIndex < count; renderIndex++) {
      const viewRef = viewContainer.get(renderIndex) as any;
      const context = viewRef.context as any;
      context.count = count;
      context.first = renderIndex === 0;
      context.last = renderIndex === count - 1;
      context.even = renderIndex % 2 === 0;
      context.odd = !context.even;
      context.index = renderIndex;
    }
  }
}
