import { rangeFor } from './utils';
import {
  ViewContainerRef,
  QueryList,
  IterableChangeRecord,
  IterableChanges,
  ViewChild,
  ContentChildren,
  Component,
  ElementRef,
  Output,
  EventEmitter,
  Input,
  OnInit,
  AfterViewInit,
  AfterContentInit
} from '@angular/core';
import { NguCarouselOutletContext } from './interface';
import {
  NguCarouselDefDirective,
  NguCarouselOutlet,
  NguCarouselOutletLeft,
  NguCarouselOutletRight
} from './carousel.directive';
import { NguCarousel } from './carousel';
import { Observable } from 'rxjs';
import { slider } from './animation';
import { transformAll } from '@angular/compiler/src/render3/r3_ast';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngu-carousel-item',
  templateUrl: 'items.html',
  animations: [slider]
})
// tslint:disable-next-line:component-class-suffix
export class CarouselItems<T> implements AfterViewInit, AfterContentInit {
  @ContentChildren(NguCarouselDefDirective)
  private _defDirec: QueryList<NguCarouselDefDirective<T>>;

  private _defaultNodeDef: NguCarouselDefDirective<T> | null;

  @ViewChild(NguCarouselOutlet)
  private _nodeOutlet: NguCarouselOutlet;

  @ViewChild(NguCarouselOutletLeft)
  private _nodeOutletLeft: NguCarouselOutlet;

  @ViewChild(NguCarouselOutletRight)
  private _nodeOutletRight: NguCarouselOutlet;

  @Output() animationCompleted = new EventEmitter();

  @Input() items: Observable<T[]>;

  isVertical: boolean;

  constructor(private el: ElementRef<HTMLDivElement>, private carousel: NguCarousel) {
    this.isVertical = this.carousel.vertical.enabled;
    this.carousel.nguItemsContainer = this.el;
  }

  ngAfterContentInit() {
    this.items.subscribe(item => {
      // console.log('rendere', item);
      this.renderNodeChanges(item);
    });
  }

  ngAfterViewInit() {}

  renderNodeChanges(
    data: T[],
    changes = this.carousel._arrayChanges,
    viewContainer: ViewContainerRef = this._nodeOutlet.viewContainer
  ) {
    if (!changes) return;

    changes.forEachOperation(
      (item: IterableChangeRecord<T>, adjustedPreviousIndex: number, currentIndex: number) => {
        if (item.previousIndex == null) {
          console.log(data, viewContainer, currentIndex);
          this._createNodeItem(data, viewContainer, currentIndex);
        } else if (currentIndex == null) {
          viewContainer.remove(adjustedPreviousIndex);
        } else {
          const view = viewContainer.get(adjustedPreviousIndex);
          viewContainer.move(view, currentIndex);
        }
      }
    );
    this._updateItemIndexContext();
    this.extraItemsContainer(data);
  }

  extraItemsContainer(data: T[]) {
    // this._extraLoopItemsWidth = 0;
    if (this.carousel.loop) {
      const leftContainer = this._nodeOutletLeft.viewContainer;
      const rightContainer = this._nodeOutletRight.viewContainer;
      const { offset } = this.carousel.inputs.grid;
      leftContainer.clear();
      rightContainer.clear();
      const slideItems = this.carousel.maxSlideItems;
      const rightItems = offset ? slideItems + 1 : slideItems;

      rangeFor(0, rightItems, i => {
        this._createNodeItem(data, rightContainer, i, true);
      });

      const leftItems = offset ? slideItems + 1 : slideItems;
      const lenght = data.length;

      rangeFor(lenght - leftItems, lenght, (val, i) => {
        this._createNodeItem(data, leftContainer, val, false, i);
      });

      this.carousel.calculateExtraItem();

      if (this.carousel.points.activePoint === 0) {
        // this.setTransform(this._transformString(0));
      }
    }
    // this._carouselPoint();
  }

  private _updateItemIndexContext(viewContainer = this._nodeOutlet.viewContainer) {
    const count = viewContainer.length;
    rangeFor(0, count, renderIndex => {
      const viewRef = viewContainer.get(renderIndex) as any;
      const context = viewRef.context as any;
      context.count = count;
      context.first = renderIndex === 0;
      context.last = renderIndex === count - 1;
      context.even = renderIndex % 2 === 0;
      context.odd = !context.even;
      context.index = renderIndex;
    });
  }

  private _createNodeItem(
    data: T[],
    viewContainer: ViewContainerRef,
    currentIndex: number,
    tempItem = false,
    insertIndex?: number
  ) {
    console.log(data);
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
    console.log('asdfdsf');
    if (this._defDirec.length === 1) {
      return this._defDirec.first;
    }

    const nodeDef =
      this._defDirec.find(def => def.when && def.when(i, data)) || this._defaultNodeDef;

    return nodeDef;
  }

  setTransform(transform: string, transition = '') {
    this.el.nativeElement.style.transition = transition;
    this.el.nativeElement.style.transform = transform;
  }
}

function transformSplit(transform: string) {
  const value = transform.replace(/.*\(|\)| /g, '').split(',')[0];
  const x = +value.replace(/px|%/, '');
  const y = +value.replace(/px|%/, '');
  const z = +value.replace(/px|%/, '');
  return { x, y, z };
}
