(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/core'), require('rxjs'), require('rxjs/operators')) :
    typeof define === 'function' && define.amd ? define('@ngu/carousel', ['exports', '@angular/common', '@angular/core', 'rxjs', 'rxjs/operators'], factory) :
    (global = global || self, factory((global.ngu = global.ngu || {}, global.ngu.carousel = {}), global.ng.common, global.ng.core, global.rxjs, global.rxjs.operators));
}(this, function (exports, common, core, rxjs, operators) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var NguCarouselStore = /** @class */ (function () {
        function NguCarouselStore(touch, vertical, interval, transform, button, visibleItems, deviceType, type, token, items, load, deviceWidth, carouselWidth, itemWidth, slideItems, itemWidthPer, itemLength, currentSlide, easing, speed, loop, dexVal, touchTransform, isEnd, isFirst, isLast, RTL, point, velocity) {
            if (touch === void 0) { touch = new Touch(); }
            if (vertical === void 0) { vertical = new Vertical(); }
            if (transform === void 0) { transform = new Transfrom(); }
            if (type === void 0) { type = 'fixed'; }
            if (token === void 0) { token = ''; }
            if (items === void 0) { items = 0; }
            if (load === void 0) { load = 0; }
            if (deviceWidth === void 0) { deviceWidth = 0; }
            if (carouselWidth === void 0) { carouselWidth = 0; }
            if (itemWidth === void 0) { itemWidth = 0; }
            if (slideItems === void 0) { slideItems = 0; }
            if (itemWidthPer === void 0) { itemWidthPer = 0; }
            if (itemLength === void 0) { itemLength = 0; }
            if (currentSlide === void 0) { currentSlide = 0; }
            if (easing === void 0) { easing = 'cubic-bezier(0, 0, 0.2, 1)'; }
            if (speed === void 0) { speed = 200; }
            if (loop === void 0) { loop = false; }
            if (dexVal === void 0) { dexVal = 0; }
            if (touchTransform === void 0) { touchTransform = 0; }
            if (isEnd === void 0) { isEnd = false; }
            if (isFirst === void 0) { isFirst = true; }
            if (isLast === void 0) { isLast = false; }
            if (RTL === void 0) { RTL = false; }
            if (point === void 0) { point = true; }
            if (velocity === void 0) { velocity = 1; }
            this.touch = touch;
            this.vertical = vertical;
            this.interval = interval;
            this.transform = transform;
            this.button = button;
            this.visibleItems = visibleItems;
            this.deviceType = deviceType;
            this.type = type;
            this.token = token;
            this.items = items;
            this.load = load;
            this.deviceWidth = deviceWidth;
            this.carouselWidth = carouselWidth;
            this.itemWidth = itemWidth;
            this.slideItems = slideItems;
            this.itemWidthPer = itemWidthPer;
            this.itemLength = itemLength;
            this.currentSlide = currentSlide;
            this.easing = easing;
            this.speed = speed;
            this.loop = loop;
            this.dexVal = dexVal;
            this.touchTransform = touchTransform;
            this.isEnd = isEnd;
            this.isFirst = isFirst;
            this.isLast = isLast;
            this.RTL = RTL;
            this.point = point;
            this.velocity = velocity;
        }
        return NguCarouselStore;
    }());
    var ItemsControl = /** @class */ (function () {
        function ItemsControl() {
        }
        return ItemsControl;
    }());
    var Vertical = /** @class */ (function () {
        function Vertical() {
        }
        return Vertical;
    }());
    var NguButton = /** @class */ (function () {
        function NguButton() {
        }
        return NguButton;
    }());
    var Touch = /** @class */ (function () {
        function Touch() {
        }
        return Touch;
    }());
    var Transfrom = /** @class */ (function () {
        function Transfrom(xs, sm, md, lg, all) {
            if (xs === void 0) { xs = 0; }
            if (sm === void 0) { sm = 0; }
            if (md === void 0) { md = 0; }
            if (lg === void 0) { lg = 0; }
            if (all === void 0) { all = 0; }
            this.xs = xs;
            this.sm = sm;
            this.md = md;
            this.lg = lg;
            this.all = all;
        }
        return Transfrom;
    }());
    var NguCarouselConfig = /** @class */ (function () {
        function NguCarouselConfig() {
        }
        return NguCarouselConfig;
    }());
    /**
     * @template T
     */
    var /**
     * @template T
     */
    NguCarouselOutletContext = /** @class */ (function () {
        function NguCarouselOutletContext(data) {
            this.$implicit = data;
        }
        return NguCarouselOutletContext;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var NguCarouselItemDirective = /** @class */ (function () {
        function NguCarouselItemDirective() {
        }
        NguCarouselItemDirective.decorators = [
            { type: core.Directive, args: [{
                        // tslint:disable-next-line:directive-selector
                        selector: '[NguCarouselItem]'
                    },] }
        ];
        return NguCarouselItemDirective;
    }());
    var NguCarouselNextDirective = /** @class */ (function () {
        function NguCarouselNextDirective() {
        }
        NguCarouselNextDirective.decorators = [
            { type: core.Directive, args: [{
                        // tslint:disable-next-line:directive-selector
                        selector: '[NguCarouselNext]'
                    },] }
        ];
        return NguCarouselNextDirective;
    }());
    var NguCarouselPrevDirective = /** @class */ (function () {
        function NguCarouselPrevDirective() {
        }
        NguCarouselPrevDirective.decorators = [
            { type: core.Directive, args: [{
                        // tslint:disable-next-line:directive-selector
                        selector: '[NguCarouselPrev]'
                    },] }
        ];
        return NguCarouselPrevDirective;
    }());
    var NguCarouselPointDirective = /** @class */ (function () {
        function NguCarouselPointDirective() {
        }
        NguCarouselPointDirective.decorators = [
            { type: core.Directive, args: [{
                        // tslint:disable-next-line:directive-selector
                        selector: '[NguCarouselPoint]'
                    },] }
        ];
        return NguCarouselPointDirective;
    }());
    /**
     * @template T
     */
    var NguCarouselDefDirective = /** @class */ (function () {
        function NguCarouselDefDirective(template) {
            this.template = template;
        }
        NguCarouselDefDirective.decorators = [
            { type: core.Directive, args: [{
                        // tslint:disable-next-line:directive-selector
                        selector: '[nguCarouselDef]'
                    },] }
        ];
        /** @nocollapse */
        NguCarouselDefDirective.ctorParameters = function () { return [
            { type: core.TemplateRef }
        ]; };
        return NguCarouselDefDirective;
    }());
    var NguCarouselOutlet = /** @class */ (function () {
        function NguCarouselOutlet(viewContainer) {
            this.viewContainer = viewContainer;
        }
        NguCarouselOutlet.decorators = [
            { type: core.Directive, args: [{
                        // tslint:disable-next-line:directive-selector
                        selector: '[nguCarouselOutlet]'
                    },] }
        ];
        /** @nocollapse */
        NguCarouselOutlet.ctorParameters = function () { return [
            { type: core.ViewContainerRef }
        ]; };
        return NguCarouselOutlet;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * @template T
     */
    var NguCarousel = /** @class */ (function (_super) {
        __extends(NguCarousel, _super);
        function NguCarousel(_el, _renderer, _differs, platformId, cdr) {
            var _this = _super.call(this) || this;
            _this._el = _el;
            _this._renderer = _renderer;
            _this._differs = _differs;
            _this.platformId = platformId;
            _this.cdr = cdr;
            _this.withAnim = true;
            _this.isHovered = false;
            _this.carouselLoad = new core.EventEmitter();
            // tslint:disable-next-line:no-output-on-prefix
            _this.onMove = new core.EventEmitter();
            _this._intervalController$ = new rxjs.Subject();
            _this.pointNumbers = [];
            return _this;
        }
        Object.defineProperty(NguCarousel.prototype, "dataSource", {
            get: /**
             * @return {?}
             */
            function () {
                return this._dataSource;
            },
            set: /**
             * @param {?} data
             * @return {?}
             */
            function (data) {
                if (data) {
                    // console.log(data, this.dataSource);
                    // this.isFirstss++;
                    this._switchDataSource(data);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NguCarousel.prototype, "nextBtn", {
            /** The setter is used to catch the button if the button has ngIf
             * issue id #91
             */
            set: /**
             * The setter is used to catch the button if the button has ngIf
             * issue id #91
             * @param {?} btn
             * @return {?}
             */
            function (btn) {
                var _this = this;
                this.listener2 && this.listener2();
                if (btn) {
                    this.listener2 = this._renderer.listen(btn.nativeElement, 'click', (/**
                     * @return {?}
                     */
                    function () {
                        return _this._carouselScrollOne(1);
                    }));
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NguCarousel.prototype, "prevBtn", {
            /** The setter is used to catch the button if the button has ngIf
             * issue id #91
             */
            set: /**
             * The setter is used to catch the button if the button has ngIf
             * issue id #91
             * @param {?} btn
             * @return {?}
             */
            function (btn) {
                var _this = this;
                this.listener1 && this.listener1();
                if (btn) {
                    this.listener1 = this._renderer.listen(btn.nativeElement, 'click', (/**
                     * @return {?}
                     */
                    function () {
                        return _this._carouselScrollOne(0);
                    }));
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NguCarousel.prototype, "trackBy", {
            /**
             * Tracking function that will be used to check the differences in data changes. Used similarly
             * to `ngFor` `trackBy` function. Optimize Items operations by identifying a Items based on its data
             * relative to the function to know if a Items should be added/removed/moved.
             * Accepts a function that takes two parameters, `index` and `item`.
             */
            get: /**
             * Tracking function that will be used to check the differences in data changes. Used similarly
             * to `ngFor` `trackBy` function. Optimize Items operations by identifying a Items based on its data
             * relative to the function to know if a Items should be added/removed/moved.
             * Accepts a function that takes two parameters, `index` and `item`.
             * @return {?}
             */
            function () {
                return this._trackByFn;
            },
            set: /**
             * @param {?} fn
             * @return {?}
             */
            function (fn) {
                if (core.isDevMode() &&
                    fn != null &&
                    typeof fn !== 'function' &&
                    (/** @type {?} */ (console)) &&
                    (/** @type {?} */ (console.warn))) {
                    console.warn("trackBy must be a function, but received " + JSON.stringify(fn) + ".");
                }
                this._trackByFn = fn;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        NguCarousel.prototype.ngOnInit = /**
         * @return {?}
         */
        function () {
            var _this = this;
            this._dataDiffer = this._differs
                .find([])
                .create((/**
             * @param {?} _i
             * @param {?} item
             * @return {?}
             */
            function (_i, item) {
                return _this.trackBy ? _this.trackBy(item.dataIndex, item.data) : item;
            }));
        };
        /**
         * @return {?}
         */
        NguCarousel.prototype.ngDoCheck = /**
         * @return {?}
         */
        function () {
            this.arrayChanges = this._dataDiffer.diff(this.dataSource);
            if (this.arrayChanges && this._defDirec) {
                // console.log('Changes detected!');
                this._observeRenderChanges();
            }
        };
        /**
         * @private
         * @param {?} dataSource
         * @return {?}
         */
        NguCarousel.prototype._switchDataSource = /**
         * @private
         * @param {?} dataSource
         * @return {?}
         */
        function (dataSource) {
            this._dataSource = dataSource;
            if (this._defDirec) {
                this._observeRenderChanges();
            }
        };
        /**
         * @private
         * @return {?}
         */
        NguCarousel.prototype._observeRenderChanges = /**
         * @private
         * @return {?}
         */
        function () {
            var _this = this;
            /** @type {?} */
            var dataStream;
            if (this._dataSource instanceof rxjs.Observable) {
                dataStream = this._dataSource;
            }
            else if (Array.isArray(this._dataSource)) {
                dataStream = rxjs.of(this._dataSource);
            }
            if (dataStream) {
                this._dataSubscription = dataStream
                    .pipe(operators.takeUntil(this._intervalController$))
                    .subscribe((/**
                 * @param {?} data
                 * @return {?}
                 */
                function (data) {
                    _this.renderNodeChanges(data);
                    _this.isLast = false;
                }));
            }
        };
        /**
         * @private
         * @param {?} data
         * @param {?=} viewContainer
         * @return {?}
         */
        NguCarousel.prototype.renderNodeChanges = /**
         * @private
         * @param {?} data
         * @param {?=} viewContainer
         * @return {?}
         */
        function (data, viewContainer) {
            var _this = this;
            if (viewContainer === void 0) { viewContainer = this._nodeOutlet.viewContainer; }
            if (!this.arrayChanges)
                return;
            this.arrayChanges.forEachOperation((/**
             * @param {?} item
             * @param {?} adjustedPreviousIndex
             * @param {?} currentIndex
             * @return {?}
             */
            function (item, adjustedPreviousIndex, currentIndex) {
                // const node = this._defDirec.find(items => item.item);
                /** @type {?} */
                var node = _this._getNodeDef(data[currentIndex], currentIndex);
                if (item.previousIndex == null) {
                    /** @type {?} */
                    var context = new NguCarouselOutletContext(data[currentIndex]);
                    context.index = currentIndex;
                    viewContainer.createEmbeddedView(node.template, context, currentIndex);
                }
                else if (currentIndex == null) {
                    viewContainer.remove(adjustedPreviousIndex);
                }
                else {
                    /** @type {?} */
                    var view = viewContainer.get(adjustedPreviousIndex);
                    viewContainer.move(view, currentIndex);
                }
            }));
            this._updateItemIndexContext();
            if (this.carousel) {
                this._storeCarouselData();
            }
            // console.log(this.dataSource);
        };
        /**
         * Updates the index-related context for each row to reflect any changes in the index of the rows,
         * e.g. first/last/even/odd.
         */
        /**
         * Updates the index-related context for each row to reflect any changes in the index of the rows,
         * e.g. first/last/even/odd.
         * @private
         * @return {?}
         */
        NguCarousel.prototype._updateItemIndexContext = /**
         * Updates the index-related context for each row to reflect any changes in the index of the rows,
         * e.g. first/last/even/odd.
         * @private
         * @return {?}
         */
        function () {
            /** @type {?} */
            var viewContainer = this._nodeOutlet.viewContainer;
            for (var renderIndex = 0, count = viewContainer.length; renderIndex < count; renderIndex++) {
                /** @type {?} */
                var viewRef = (/** @type {?} */ (viewContainer.get(renderIndex)));
                /** @type {?} */
                var context = (/** @type {?} */ (viewRef.context));
                context.count = count;
                context.first = renderIndex === 0;
                context.last = renderIndex === count - 1;
                context.even = renderIndex % 2 === 0;
                context.odd = !context.even;
                context.index = renderIndex;
            }
        };
        /**
         * @private
         * @param {?} data
         * @param {?} i
         * @return {?}
         */
        NguCarousel.prototype._getNodeDef = /**
         * @private
         * @param {?} data
         * @param {?} i
         * @return {?}
         */
        function (data, i) {
            // console.log(this._defDirec);
            if (this._defDirec.length === 1) {
                return this._defDirec.first;
            }
            /** @type {?} */
            var nodeDef = this._defDirec.find((/**
             * @param {?} def
             * @return {?}
             */
            function (def) { return def.when && def.when(i, data); })) ||
                this._defaultNodeDef;
            return nodeDef;
        };
        /**
         * @return {?}
         */
        NguCarousel.prototype.ngAfterViewInit = /**
         * @return {?}
         */
        function () {
            var _this = this;
            this.carousel = this._el.nativeElement;
            this._inputValidation();
            this.carouselCssNode = this._createStyleElem();
            // this._buttonControl();
            if (common.isPlatformBrowser(this.platformId)) {
                this._carouselInterval();
                if (!this.vertical.enabled) {
                    this._touch();
                }
                this.listener3 = this._renderer.listen('window', 'resize', (/**
                 * @param {?} event
                 * @return {?}
                 */
                function (event) {
                    _this._onResizing(event);
                }));
                this._onWindowScrolling();
            }
        };
        /**
         * @return {?}
         */
        NguCarousel.prototype.ngAfterContentInit = /**
         * @return {?}
         */
        function () {
            this._observeRenderChanges();
            this.cdr.markForCheck();
        };
        /**
         * @private
         * @return {?}
         */
        NguCarousel.prototype._inputValidation = /**
         * @private
         * @return {?}
         */
        function () {
            this.type = this.inputs.grid.all !== 0 ? 'fixed' : 'responsive';
            this.loop = this.inputs.loop || false;
            this.inputs.easing = this.inputs.easing || 'cubic-bezier(0, 0, 0.2, 1)';
            this.touch.active = this.inputs.touch || false;
            this.RTL = this.inputs.RTL ? true : false;
            this.interval = this.inputs.interval || null;
            this.velocity =
                typeof this.inputs.velocity === 'number'
                    ? this.inputs.velocity
                    : this.velocity;
            if (this.inputs.vertical && this.inputs.vertical.enabled) {
                this.vertical.enabled = this.inputs.vertical.enabled;
                this.vertical.height = this.inputs.vertical.height;
            }
            this.directionSym = this.RTL ? '' : '-';
            this.point =
                this.inputs.point && typeof this.inputs.point.visible !== 'undefined'
                    ? this.inputs.point.visible
                    : true;
            this._carouselSize();
        };
        /**
         * @return {?}
         */
        NguCarousel.prototype.ngOnDestroy = /**
         * @return {?}
         */
        function () {
            // clearInterval(this.carouselInt);
            this.carouselInt && this.carouselInt.unsubscribe();
            this._intervalController$.unsubscribe();
            this.carouselLoad.complete();
            this.onMove.complete();
            /** remove listeners */
            for (var i = 1; i <= 4; i++) {
                /** @type {?} */
                var str = "listener" + i;
                this[str] && this[str]();
            }
        };
        /**
         * @private
         * @param {?} event
         * @return {?}
         */
        NguCarousel.prototype._onResizing = /**
         * @private
         * @param {?} event
         * @return {?}
         */
        function (event) {
            var _this = this;
            clearTimeout(this.onResize);
            this.onResize = setTimeout((/**
             * @return {?}
             */
            function () {
                if (_this.deviceWidth !== event.target.outerWidth) {
                    _this._setStyle(_this.nguItemsContainer.nativeElement, 'transition', "");
                    _this._storeCarouselData();
                }
            }), 500);
        };
        /** Get Touch input */
        /**
         * Get Touch input
         * @private
         * @return {?}
         */
        NguCarousel.prototype._touch = /**
         * Get Touch input
         * @private
         * @return {?}
         */
        function () {
            var _this = this;
            if (this.inputs.touch) {
                /** @type {?} */
                var hammertime = new Hammer(this.touchContainer.nativeElement);
                hammertime.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });
                hammertime.on('panstart', (/**
                 * @param {?} ev
                 * @return {?}
                 */
                function (ev) {
                    _this.carouselWidth = _this.nguItemsContainer.nativeElement.offsetWidth;
                    _this.touchTransform = _this.transform[_this.deviceType];
                    _this.dexVal = 0;
                    _this._setStyle(_this.nguItemsContainer.nativeElement, 'transition', '');
                }));
                if (this.vertical.enabled) {
                    hammertime.on('panup', (/**
                     * @param {?} ev
                     * @return {?}
                     */
                    function (ev) {
                        _this._touchHandling('panleft', ev);
                    }));
                    hammertime.on('pandown', (/**
                     * @param {?} ev
                     * @return {?}
                     */
                    function (ev) {
                        _this._touchHandling('panright', ev);
                    }));
                }
                else {
                    hammertime.on('panleft', (/**
                     * @param {?} ev
                     * @return {?}
                     */
                    function (ev) {
                        _this._touchHandling('panleft', ev);
                    }));
                    hammertime.on('panright', (/**
                     * @param {?} ev
                     * @return {?}
                     */
                    function (ev) {
                        _this._touchHandling('panright', ev);
                    }));
                }
                hammertime.on('panend', (/**
                 * @param {?} ev
                 * @return {?}
                 */
                function (ev) {
                    if (Math.abs(ev.velocity) >= _this.velocity) {
                        _this.touch.velocity = ev.velocity;
                        /** @type {?} */
                        var direc = 0;
                        if (!_this.RTL) {
                            direc = _this.touch.swipe === 'panright' ? 0 : 1;
                        }
                        else {
                            direc = _this.touch.swipe === 'panright' ? 1 : 0;
                        }
                        _this._carouselScrollOne(direc);
                    }
                    else {
                        _this.dexVal = 0;
                        _this._setStyle(_this.nguItemsContainer.nativeElement, 'transition', 'transform 324ms cubic-bezier(0, 0, 0.2, 1)');
                        _this._setStyle(_this.nguItemsContainer.nativeElement, 'transform', '');
                    }
                }));
                hammertime.on('hammer.input', (/**
                 * @param {?} ev
                 * @return {?}
                 */
                function (ev) {
                    // allow nested touch events to no propagate, this may have other side affects but works for now.
                    // TODO: It is probably better to check the source element of the event and only apply the handle to the correct carousel
                    ev.srcEvent.stopPropagation();
                }));
            }
        };
        /** handle touch input */
        /**
         * handle touch input
         * @private
         * @param {?} e
         * @param {?} ev
         * @return {?}
         */
        NguCarousel.prototype._touchHandling = /**
         * handle touch input
         * @private
         * @param {?} e
         * @param {?} ev
         * @return {?}
         */
        function (e, ev) {
            // vertical touch events seem to cause to panstart event with an odd delta
            // and a center of {x:0,y:0} so this will ignore them
            if (ev.center.x === 0) {
                return;
            }
            ev = Math.abs(this.vertical.enabled ? ev.deltaY : ev.deltaX);
            /** @type {?} */
            var valt = ev - this.dexVal;
            valt =
                this.type === 'responsive'
                    ? (Math.abs(ev - this.dexVal) /
                        (this.vertical.enabled
                            ? this.vertical.height
                            : this.carouselWidth)) *
                        100
                    : valt;
            this.dexVal = ev;
            this.touch.swipe = e;
            this._setTouchTransfrom(e, valt);
            this._setTransformFromTouch();
        };
        /**
         * @private
         * @param {?} e
         * @param {?} valt
         * @return {?}
         */
        NguCarousel.prototype._setTouchTransfrom = /**
         * @private
         * @param {?} e
         * @param {?} valt
         * @return {?}
         */
        function (e, valt) {
            /** @type {?} */
            var condition = this.RTL ? 'panright' : 'panleft';
            this.touchTransform =
                e === condition ? valt + this.touchTransform : this.touchTransform - valt;
        };
        /**
         * @private
         * @return {?}
         */
        NguCarousel.prototype._setTransformFromTouch = /**
         * @private
         * @return {?}
         */
        function () {
            if (this.touchTransform < 0) {
                this.touchTransform = 0;
            }
            /** @type {?} */
            var type = this.type === 'responsive' ? '%' : 'px';
            this._setStyle(this.nguItemsContainer.nativeElement, 'transform', this.vertical.enabled
                ? "translate3d(0, " + this.directionSym + this.touchTransform + type + ", 0)"
                : "translate3d(" + this.directionSym + this.touchTransform + type + ", 0, 0)");
        };
        /** this fn used to disable the interval when it is not on the viewport */
        /**
         * this fn used to disable the interval when it is not on the viewport
         * @private
         * @return {?}
         */
        NguCarousel.prototype._onWindowScrolling = /**
         * this fn used to disable the interval when it is not on the viewport
         * @private
         * @return {?}
         */
        function () {
            /** @type {?} */
            var top = this.carousel.offsetTop;
            /** @type {?} */
            var scrollY = window.scrollY;
            /** @type {?} */
            var heightt = window.innerHeight;
            /** @type {?} */
            var carouselHeight = this.carousel.offsetHeight;
            /** @type {?} */
            var isCarouselOnScreen = top <= scrollY + heightt - carouselHeight / 4 &&
                top + carouselHeight / 2 >= scrollY;
            if (isCarouselOnScreen) {
                this._intervalController$.next(1);
            }
            else {
                this._intervalController$.next(0);
            }
        };
        /** store data based on width of the screen for the carousel */
        /**
         * store data based on width of the screen for the carousel
         * @private
         * @return {?}
         */
        NguCarousel.prototype._storeCarouselData = /**
         * store data based on width of the screen for the carousel
         * @private
         * @return {?}
         */
        function () {
            this.deviceWidth = common.isPlatformBrowser(this.platformId)
                ? window.innerWidth
                : 1200;
            this.carouselWidth = this.carouselMain1.nativeElement.offsetWidth;
            if (this.type === 'responsive') {
                this.deviceType =
                    this.deviceWidth >= 1200
                        ? 'lg'
                        : this.deviceWidth >= 992
                            ? 'md'
                            : this.deviceWidth >= 768
                                ? 'sm'
                                : 'xs';
                this.items = this.inputs.grid[this.deviceType];
                this.itemWidth = this.carouselWidth / this.items;
            }
            else {
                this.items = Math.trunc(this.carouselWidth / this.inputs.grid.all);
                this.itemWidth = this.inputs.grid.all;
                this.deviceType = 'all';
            }
            this.slideItems = +(this.inputs.slide < this.items
                ? this.inputs.slide
                : this.items);
            this.load =
                this.inputs.load >= this.slideItems ? this.inputs.load : this.slideItems;
            this.speed =
                this.inputs.speed && this.inputs.speed > -1 ? this.inputs.speed : 400;
            this._carouselPoint();
        };
        /** Used to reset the carousel */
        /**
         * Used to reset the carousel
         * @param {?=} withOutAnimation
         * @return {?}
         */
        NguCarousel.prototype.reset = /**
         * Used to reset the carousel
         * @param {?=} withOutAnimation
         * @return {?}
         */
        function (withOutAnimation) {
            withOutAnimation && (this.withAnim = false);
            this.carouselCssNode.innerHTML = '';
            this.moveTo(0);
            this._carouselPoint();
        };
        /** Init carousel point */
        /**
         * Init carousel point
         * @private
         * @return {?}
         */
        NguCarousel.prototype._carouselPoint = /**
         * Init carousel point
         * @private
         * @return {?}
         */
        function () {
            // debugger;
            // if (this.userData.point.visible === true) {
            /** @type {?} */
            var Nos = this.dataSource.length - (this.items - this.slideItems);
            this.pointIndex = Math.ceil(Nos / this.slideItems);
            /** @type {?} */
            var pointers = [];
            if (this.pointIndex > 1 || !this.inputs.point.hideOnSingleSlide) {
                for (var i = 0; i < this.pointIndex; i++) {
                    pointers.push(i);
                }
            }
            this.pointNumbers = pointers;
            // console.log(this.pointNumbers);
            this._carouselPointActiver();
            if (this.pointIndex <= 1) {
                this._btnBoolean(1, 1);
            }
            else {
                if (this.currentSlide === 0 && !this.loop) {
                    this._btnBoolean(1, 0);
                }
                else {
                    this._btnBoolean(0, 0);
                }
            }
            // }
        };
        /** change the active point in carousel */
        /**
         * change the active point in carousel
         * @private
         * @return {?}
         */
        NguCarousel.prototype._carouselPointActiver = /**
         * change the active point in carousel
         * @private
         * @return {?}
         */
        function () {
            /** @type {?} */
            var i = Math.ceil(this.currentSlide / this.slideItems);
            this.activePoint = i;
            // console.log(this.data);
            this.cdr.markForCheck();
        };
        /** this function is used to scoll the carousel when point is clicked */
        /**
         * this function is used to scoll the carousel when point is clicked
         * @param {?} slide
         * @param {?=} withOutAnimation
         * @return {?}
         */
        NguCarousel.prototype.moveTo = /**
         * this function is used to scoll the carousel when point is clicked
         * @param {?} slide
         * @param {?=} withOutAnimation
         * @return {?}
         */
        function (slide, withOutAnimation) {
            // slide = slide - 1;
            withOutAnimation && (this.withAnim = false);
            if (this.activePoint !== slide && slide < this.pointIndex) {
                /** @type {?} */
                var slideremains = void 0;
                /** @type {?} */
                var btns = this.currentSlide < slide ? 1 : 0;
                switch (slide) {
                    case 0:
                        this._btnBoolean(1, 0);
                        slideremains = slide * this.slideItems;
                        break;
                    case this.pointIndex - 1:
                        this._btnBoolean(0, 1);
                        slideremains = this.dataSource.length - this.items;
                        break;
                    default:
                        this._btnBoolean(0, 0);
                        slideremains = slide * this.slideItems;
                }
                this._carouselScrollTwo(btns, slideremains, this.speed);
            }
        };
        /** set the style of the carousel based the inputs data */
        /**
         * set the style of the carousel based the inputs data
         * @private
         * @return {?}
         */
        NguCarousel.prototype._carouselSize = /**
         * set the style of the carousel based the inputs data
         * @private
         * @return {?}
         */
        function () {
            this.token = this._generateID();
            /** @type {?} */
            var dism = '';
            this.styleid = "." + this.token + " > .ngucarousel > .ngu-touch-container > .ngucarousel-items";
            if (this.inputs.custom === 'banner') {
                this._renderer.addClass(this.carousel, 'banner');
            }
            if (this.inputs.animation === 'lazy') {
                dism += this.styleid + " > .item {transition: transform .6s ease;}";
            }
            /** @type {?} */
            var itemStyle = '';
            if (this.vertical.enabled) {
                /** @type {?} */
                var itemWidth_xs = this.styleid + " > .item {height: " + this.vertical
                    .height / +this.inputs.grid.xs + "px}";
                /** @type {?} */
                var itemWidth_sm = this.styleid + " > .item {height: " + this.vertical
                    .height / +this.inputs.grid.sm + "px}";
                /** @type {?} */
                var itemWidth_md = this.styleid + " > .item {height: " + this.vertical
                    .height / +this.inputs.grid.md + "px}";
                /** @type {?} */
                var itemWidth_lg = this.styleid + " > .item {height: " + this.vertical
                    .height / +this.inputs.grid.lg + "px}";
                itemStyle = "@media (max-width:767px){" + itemWidth_xs + "}\n                    @media (min-width:768px){" + itemWidth_sm + "}\n                    @media (min-width:992px){" + itemWidth_md + "}\n                    @media (min-width:1200px){" + itemWidth_lg + "}";
            }
            else if (this.type === 'responsive') {
                /** @type {?} */
                var itemWidth_xs = this.inputs.type === 'mobile'
                    ? this.styleid + " .item {flex: 0 0 " + 95 /
                        +this.inputs.grid.xs + "%; width: " + 95 / +this.inputs.grid.xs + "%;}"
                    : this.styleid + " .item {flex: 0 0 " + 100 /
                        +this.inputs.grid.xs + "%; width: " + 100 / +this.inputs.grid.xs + "%;}";
                /** @type {?} */
                var itemWidth_sm = this.styleid + " > .item {flex: 0 0 " + 100 /
                    +this.inputs.grid.sm + "%; width: " + 100 / +this.inputs.grid.sm + "%}";
                /** @type {?} */
                var itemWidth_md = this.styleid + " > .item {flex: 0 0 " + 100 /
                    +this.inputs.grid.md + "%; width: " + 100 / +this.inputs.grid.md + "%}";
                /** @type {?} */
                var itemWidth_lg = this.styleid + " > .item {flex: 0 0 " + 100 /
                    +this.inputs.grid.lg + "%; width: " + 100 / +this.inputs.grid.lg + "%}";
                itemStyle = "@media (max-width:767px){" + itemWidth_xs + "}\n                    @media (min-width:768px){" + itemWidth_sm + "}\n                    @media (min-width:992px){" + itemWidth_md + "}\n                    @media (min-width:1200px){" + itemWidth_lg + "}";
            }
            else {
                itemStyle = this.styleid + " .item {flex: 0 0 " + this.inputs.grid.all + "px; width: " + this.inputs.grid.all + "px;}";
            }
            this._renderer.addClass(this.carousel, this.token);
            if (this.vertical.enabled) {
                this._renderer.addClass(this.nguItemsContainer.nativeElement, 'nguvertical');
                this._renderer.setStyle(this.carouselMain1.nativeElement, 'height', this.vertical.height + "px");
            }
            // tslint:disable-next-line:no-unused-expression
            this.RTL &&
                !this.vertical.enabled &&
                this._renderer.addClass(this.carousel, 'ngurtl');
            this._createStyleElem(dism + " " + itemStyle);
            this._storeCarouselData();
        };
        /** logic to scroll the carousel step 1 */
        /**
         * logic to scroll the carousel step 1
         * @private
         * @param {?} Btn
         * @return {?}
         */
        NguCarousel.prototype._carouselScrollOne = /**
         * logic to scroll the carousel step 1
         * @private
         * @param {?} Btn
         * @return {?}
         */
        function (Btn) {
            /** @type {?} */
            var itemSpeed = this.speed;
            /** @type {?} */
            var translateXval;
            /** @type {?} */
            var currentSlide = 0;
            /** @type {?} */
            var touchMove = Math.ceil(this.dexVal / this.itemWidth);
            this._setStyle(this.nguItemsContainer.nativeElement, 'transform', '');
            if (this.pointIndex === 1) {
                return;
            }
            else if (Btn === 0 && ((!this.loop && !this.isFirst) || this.loop)) {
                /** @type {?} */
                var slide = this.slideItems * this.pointIndex;
                /** @type {?} */
                var currentSlideD = this.currentSlide - this.slideItems;
                /** @type {?} */
                var MoveSlide = currentSlideD + this.slideItems;
                this._btnBoolean(0, 1);
                if (this.currentSlide === 0) {
                    currentSlide = this.dataSource.length - this.items;
                    itemSpeed = 400;
                    this._btnBoolean(0, 1);
                }
                else if (this.slideItems >= MoveSlide) {
                    currentSlide = translateXval = 0;
                    this._btnBoolean(1, 0);
                }
                else {
                    this._btnBoolean(0, 0);
                    if (touchMove > this.slideItems) {
                        currentSlide = this.currentSlide - touchMove;
                        itemSpeed = 200;
                    }
                    else {
                        currentSlide = this.currentSlide - this.slideItems;
                    }
                }
                this._carouselScrollTwo(Btn, currentSlide, itemSpeed);
            }
            else if (Btn === 1 && ((!this.loop && !this.isLast) || this.loop)) {
                if (this.dataSource.length <=
                    this.currentSlide + this.items + this.slideItems &&
                    !this.isLast) {
                    currentSlide = this.dataSource.length - this.items;
                    this._btnBoolean(0, 1);
                }
                else if (this.isLast) {
                    currentSlide = translateXval = 0;
                    itemSpeed = 400;
                    this._btnBoolean(1, 0);
                }
                else {
                    this._btnBoolean(0, 0);
                    if (touchMove > this.slideItems) {
                        currentSlide =
                            this.currentSlide + this.slideItems + (touchMove - this.slideItems);
                        itemSpeed = 200;
                    }
                    else {
                        currentSlide = this.currentSlide + this.slideItems;
                    }
                }
                this._carouselScrollTwo(Btn, currentSlide, itemSpeed);
            }
            // cubic-bezier(0.15, 1.04, 0.54, 1.13)
        };
        /** logic to scroll the carousel step 2 */
        /**
         * logic to scroll the carousel step 2
         * @private
         * @param {?} Btn
         * @param {?} currentSlide
         * @param {?} itemSpeed
         * @return {?}
         */
        NguCarousel.prototype._carouselScrollTwo = /**
         * logic to scroll the carousel step 2
         * @private
         * @param {?} Btn
         * @param {?} currentSlide
         * @param {?} itemSpeed
         * @return {?}
         */
        function (Btn, currentSlide, itemSpeed) {
            // tslint:disable-next-line:no-unused-expression
            if (this.dexVal !== 0) {
                /** @type {?} */
                var val = Math.abs(this.touch.velocity);
                /** @type {?} */
                var somt = Math.floor((this.dexVal / val / this.dexVal) * (this.deviceWidth - this.dexVal));
                somt = somt > itemSpeed ? itemSpeed : somt;
                itemSpeed = somt < 200 ? 200 : somt;
                this.dexVal = 0;
            }
            if (this.withAnim) {
                this._setStyle(this.nguItemsContainer.nativeElement, 'transition', "transform " + itemSpeed + "ms " + this.inputs.easing);
                this.inputs.animation &&
                    this._carouselAnimator(Btn, currentSlide + 1, currentSlide + this.items, itemSpeed, Math.abs(this.currentSlide - currentSlide));
            }
            else {
                this._setStyle(this.nguItemsContainer.nativeElement, 'transition', "");
            }
            // console.log(this.dataSource);
            this.itemLength = this.dataSource.length;
            this._transformStyle(currentSlide);
            this.currentSlide = currentSlide;
            this.onMove.emit(this);
            this._carouselPointActiver();
            this._carouselLoadTrigger();
            this.withAnim = true;
            // if (currentSlide === 12) {
            //   this._switchDataSource(this.dataSource);
            // }
        };
        /** boolean function for making isFirst and isLast */
        /**
         * boolean function for making isFirst and isLast
         * @private
         * @param {?} first
         * @param {?} last
         * @return {?}
         */
        NguCarousel.prototype._btnBoolean = /**
         * boolean function for making isFirst and isLast
         * @private
         * @param {?} first
         * @param {?} last
         * @return {?}
         */
        function (first, last) {
            this.isFirst = !!first;
            this.isLast = !!last;
        };
        /**
         * @private
         * @param {?} grid
         * @param {?} slide
         * @return {?}
         */
        NguCarousel.prototype._transformString = /**
         * @private
         * @param {?} grid
         * @param {?} slide
         * @return {?}
         */
        function (grid, slide) {
            /** @type {?} */
            var collect = '';
            collect += this.styleid + " { transform: translate3d(";
            if (this.vertical.enabled) {
                this.transform[grid] =
                    (this.vertical.height / this.inputs.grid[grid]) * slide;
                collect += "0, -" + this.transform[grid] + "px, 0";
            }
            else {
                this.transform[grid] = (100 / this.inputs.grid[grid]) * slide;
                collect += "" + this.directionSym + this.transform[grid] + "%, 0, 0";
            }
            collect += "); }";
            return collect;
        };
        /** set the transform style to scroll the carousel  */
        /**
         * set the transform style to scroll the carousel
         * @private
         * @param {?} slide
         * @return {?}
         */
        NguCarousel.prototype._transformStyle = /**
         * set the transform style to scroll the carousel
         * @private
         * @param {?} slide
         * @return {?}
         */
        function (slide) {
            /** @type {?} */
            var slideCss = '';
            if (this.type === 'responsive') {
                slideCss = "@media (max-width: 767px) {" + this._transformString('xs', slide) + "}\n      @media (min-width: 768px) {" + this._transformString('sm', slide) + " }\n      @media (min-width: 992px) {" + this._transformString('md', slide) + " }\n      @media (min-width: 1200px) {" + this._transformString('lg', slide) + " }";
            }
            else {
                this.transform.all = this.inputs.grid.all * slide;
                slideCss = this.styleid + " { transform: translate3d(" + this.directionSym + this.transform.all + "px, 0, 0);";
            }
            this.carouselCssNode.innerHTML = slideCss;
        };
        /** this will trigger the carousel to load the items */
        /**
         * this will trigger the carousel to load the items
         * @private
         * @return {?}
         */
        NguCarousel.prototype._carouselLoadTrigger = /**
         * this will trigger the carousel to load the items
         * @private
         * @return {?}
         */
        function () {
            if (typeof this.inputs.load === 'number') {
                this.dataSource.length - this.load <= this.currentSlide + this.items &&
                    this.carouselLoad.emit(this.currentSlide);
            }
        };
        /** generate Class for each carousel to set specific style */
        /**
         * generate Class for each carousel to set specific style
         * @private
         * @return {?}
         */
        NguCarousel.prototype._generateID = /**
         * generate Class for each carousel to set specific style
         * @private
         * @return {?}
         */
        function () {
            /** @type {?} */
            var text = '';
            /** @type {?} */
            var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for (var i = 0; i < 6; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return "ngucarousel" + text;
        };
        /** handle the auto slide */
        /**
         * handle the auto slide
         * @private
         * @return {?}
         */
        NguCarousel.prototype._carouselInterval = /**
         * handle the auto slide
         * @private
         * @return {?}
         */
        function () {
            var _this = this;
            /** @type {?} */
            var container = this.carouselMain1.nativeElement;
            if (this.interval && this.loop) {
                this.listener4 = this._renderer.listen('window', 'scroll', (/**
                 * @return {?}
                 */
                function () {
                    clearTimeout(_this.onScrolling);
                    _this.onScrolling = setTimeout((/**
                     * @return {?}
                     */
                    function () {
                        _this._onWindowScrolling();
                    }), 600);
                }));
                /** @type {?} */
                var play$_1 = rxjs.fromEvent(container, 'mouseleave').pipe(operators.mapTo(1));
                /** @type {?} */
                var pause$_1 = rxjs.fromEvent(container, 'mouseenter').pipe(operators.mapTo(0));
                /** @type {?} */
                var touchPlay$_1 = rxjs.fromEvent(container, 'touchstart').pipe(operators.mapTo(1));
                /** @type {?} */
                var touchPause$_1 = rxjs.fromEvent(container, 'touchend').pipe(operators.mapTo(0));
                /** @type {?} */
                var interval$_1 = rxjs.interval(this.inputs.interval.timing).pipe(operators.mapTo(1));
                setTimeout((/**
                 * @return {?}
                 */
                function () {
                    _this.carouselInt = rxjs.merge(play$_1, touchPlay$_1, pause$_1, touchPause$_1, _this._intervalController$)
                        .pipe(operators.startWith(1), operators.switchMap((/**
                     * @param {?} val
                     * @return {?}
                     */
                    function (val) {
                        _this.isHovered = !val;
                        _this.cdr.markForCheck();
                        return val ? interval$_1 : rxjs.empty();
                    })))
                        .subscribe((/**
                     * @param {?} res
                     * @return {?}
                     */
                    function (res) {
                        _this._carouselScrollOne(1);
                    }));
                }), this.interval.initialDelay);
            }
        };
        /**
         * @private
         * @return {?}
         */
        NguCarousel.prototype._updateItemIndexContextAni = /**
         * @private
         * @return {?}
         */
        function () {
            /** @type {?} */
            var viewContainer = this._nodeOutlet.viewContainer;
            for (var renderIndex = 0, count = viewContainer.length; renderIndex < count; renderIndex++) {
                /** @type {?} */
                var viewRef = (/** @type {?} */ (viewContainer.get(renderIndex)));
                /** @type {?} */
                var context = (/** @type {?} */ (viewRef.context));
                context.count = count;
                context.first = renderIndex === 0;
                context.last = renderIndex === count - 1;
                context.even = renderIndex % 2 === 0;
                context.odd = !context.even;
                context.index = renderIndex;
            }
        };
        /** animate the carousel items */
        /**
         * animate the carousel items
         * @private
         * @param {?} direction
         * @param {?} start
         * @param {?} end
         * @param {?} speed
         * @param {?} length
         * @param {?=} viewContainer
         * @return {?}
         */
        NguCarousel.prototype._carouselAnimator = /**
         * animate the carousel items
         * @private
         * @param {?} direction
         * @param {?} start
         * @param {?} end
         * @param {?} speed
         * @param {?} length
         * @param {?=} viewContainer
         * @return {?}
         */
        function (direction, start, end, speed, length, viewContainer) {
            var _this = this;
            if (viewContainer === void 0) { viewContainer = this._nodeOutlet.viewContainer; }
            /** @type {?} */
            var val = length < 5 ? length : 5;
            val = val === 1 ? 3 : val;
            /** @type {?} */
            var collectIndex = [];
            if (direction === 1) {
                for (var i = start - 1; i < end; i++) {
                    collectIndex.push(i);
                    val = val * 2;
                    /** @type {?} */
                    var viewRef = (/** @type {?} */ (viewContainer.get(i)));
                    /** @type {?} */
                    var context = (/** @type {?} */ (viewRef.context));
                    context.animate = { value: true, params: { distance: val } };
                }
            }
            else {
                for (var i = end - 1; i >= start - 1; i--) {
                    collectIndex.push(i);
                    val = val * 2;
                    /** @type {?} */
                    var viewRef = (/** @type {?} */ (viewContainer.get(i)));
                    /** @type {?} */
                    var context = (/** @type {?} */ (viewRef.context));
                    context.animate = { value: true, params: { distance: -val } };
                }
            }
            this.cdr.markForCheck();
            setTimeout((/**
             * @return {?}
             */
            function () {
                _this._removeAnimations(collectIndex);
            }), speed * 0.7);
        };
        /**
         * @private
         * @param {?} indexs
         * @return {?}
         */
        NguCarousel.prototype._removeAnimations = /**
         * @private
         * @param {?} indexs
         * @return {?}
         */
        function (indexs) {
            /** @type {?} */
            var viewContainer = this._nodeOutlet.viewContainer;
            indexs.forEach((/**
             * @param {?} i
             * @return {?}
             */
            function (i) {
                /** @type {?} */
                var viewRef = (/** @type {?} */ (viewContainer.get(i)));
                /** @type {?} */
                var context = (/** @type {?} */ (viewRef.context));
                context.animate = { value: false, params: { distance: 0 } };
            }));
            this.cdr.markForCheck();
        };
        /** Short form for setElementStyle */
        /**
         * Short form for setElementStyle
         * @private
         * @param {?} el
         * @param {?} prop
         * @param {?} val
         * @return {?}
         */
        NguCarousel.prototype._setStyle = /**
         * Short form for setElementStyle
         * @private
         * @param {?} el
         * @param {?} prop
         * @param {?} val
         * @return {?}
         */
        function (el, prop, val) {
            this._renderer.setStyle(el, prop, val);
        };
        /** For generating style tag */
        /**
         * For generating style tag
         * @private
         * @param {?=} datas
         * @return {?}
         */
        NguCarousel.prototype._createStyleElem = /**
         * For generating style tag
         * @private
         * @param {?=} datas
         * @return {?}
         */
        function (datas) {
            /** @type {?} */
            var styleItem = this._renderer.createElement('style');
            if (datas) {
                /** @type {?} */
                var styleText = this._renderer.createText(datas);
                this._renderer.appendChild(styleItem, styleText);
            }
            this._renderer.appendChild(this.carousel, styleItem);
            return styleItem;
        };
        NguCarousel.decorators = [
            { type: core.Component, args: [{
                        // tslint:disable-next-line:component-selector
                        selector: 'ngu-carousel',
                        template: "<div #ngucarousel class=\"ngucarousel\">\r\n  <div #touchContainer class=\"ngu-touch-container\">\r\n    <div #nguItemsContainer class=\"ngucarousel-items\">\r\n      <ng-container nguCarouselOutlet></ng-container>\r\n    </div>\r\n  </div>\r\n  <div class=\"nguclearFix\"></div>\r\n  <ng-content select=\"[NguCarouselPrev]\"></ng-content>\r\n  <ng-content select=\"[NguCarouselNext]\"></ng-content>\r\n</div>\r\n<ng-content select=\"[NguCarouselPoint]\"></ng-content>\r\n",
                        changeDetection: core.ChangeDetectionStrategy.OnPush,
                        styles: [":host{display:block;position:relative}:host.ngurtl{direction:rtl}.ngucarousel{position:relative;overflow:hidden;height:100%}.ngucarousel .ngucarousel-items{position:relative;display:-webkit-box;display:flex;height:100%}.nguvertical{-webkit-box-orient:vertical;-webkit-box-direction:normal;flex-direction:column}.banner .ngucarouselPointDefault .ngucarouselPoint{position:absolute;width:100%;bottom:20px}.banner .ngucarouselPointDefault .ngucarouselPoint li{background:rgba(255,255,255,.55)}.banner .ngucarouselPointDefault .ngucarouselPoint li.active{background:#fff}.banner .ngucarouselPointDefault .ngucarouselPoint li:hover{cursor:pointer}.ngucarouselPointDefault .ngucarouselPoint{list-style-type:none;text-align:center;padding:12px;margin:0;white-space:nowrap;overflow:auto;box-sizing:border-box}.ngucarouselPointDefault .ngucarouselPoint li{display:inline-block;border-radius:50%;background:rgba(0,0,0,.55);padding:4px;margin:0 4px;-webkit-transition:.4s;transition:.4s}.ngucarouselPointDefault .ngucarouselPoint li.active{background:#6b6b6b;-webkit-transform:scale(1.8);transform:scale(1.8)}.ngucarouselPointDefault .ngucarouselPoint li:hover{cursor:pointer}.nguclearFix{clear:both}"]
                    }] }
        ];
        /** @nocollapse */
        NguCarousel.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: core.Renderer2 },
            { type: core.IterableDiffers },
            { type: Object, decorators: [{ type: core.Inject, args: [core.PLATFORM_ID,] }] },
            { type: core.ChangeDetectorRef }
        ]; };
        NguCarousel.propDecorators = {
            inputs: [{ type: core.Input, args: ['inputs',] }],
            carouselLoad: [{ type: core.Output, args: ['carouselLoad',] }],
            onMove: [{ type: core.Output, args: ['onMove',] }],
            dataSource: [{ type: core.Input, args: ['dataSource',] }],
            _defDirec: [{ type: core.ContentChildren, args: [NguCarouselDefDirective,] }],
            _nodeOutlet: [{ type: core.ViewChild, args: [NguCarouselOutlet, { static: true },] }],
            nextBtn: [{ type: core.ContentChild, args: [NguCarouselNextDirective, { read: core.ElementRef, static: true },] }],
            prevBtn: [{ type: core.ContentChild, args: [NguCarouselPrevDirective, { read: core.ElementRef, static: true },] }],
            carouselMain1: [{ type: core.ViewChild, args: ['ngucarousel', { read: core.ElementRef, static: true },] }],
            nguItemsContainer: [{ type: core.ViewChild, args: ['nguItemsContainer', { read: core.ElementRef, static: true },] }],
            touchContainer: [{ type: core.ViewChild, args: ['touchContainer', { read: core.ElementRef, static: true },] }],
            trackBy: [{ type: core.Input }]
        };
        return NguCarousel;
    }(NguCarouselStore));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var NguItemComponent = /** @class */ (function () {
        function NguItemComponent() {
            this.classes = true;
        }
        NguItemComponent.decorators = [
            { type: core.Component, args: [{
                        // tslint:disable-next-line:component-selector
                        selector: 'ngu-item',
                        template: "<ng-content></ng-content>\r\n",
                        styles: [""]
                    }] }
        ];
        NguItemComponent.propDecorators = {
            classes: [{ type: core.HostBinding, args: ['class.item',] }]
        };
        return NguItemComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var NguTileComponent = /** @class */ (function () {
        function NguTileComponent() {
            this.classes = true;
        }
        NguTileComponent.decorators = [
            { type: core.Component, args: [{
                        // tslint:disable-next-line:component-selector
                        selector: 'ngu-tile',
                        template: "<div class=\"tile\">\r\n  <ng-content></ng-content>\r\n</div>\r\n",
                        styles: [":host{padding:10px;box-sizing:border-box}.tile{box-shadow:0 2px 5px 0 rgba(0,0,0,.16),0 2px 10px 0 rgba(0,0,0,.12)}"]
                    }] }
        ];
        NguTileComponent.propDecorators = {
            classes: [{ type: core.HostBinding, args: ['class.item',] }]
        };
        return NguTileComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var NguCarouselModule = /** @class */ (function () {
        function NguCarouselModule() {
        }
        NguCarouselModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [common.CommonModule],
                        exports: [
                            NguCarousel,
                            NguItemComponent,
                            NguTileComponent,
                            NguCarouselPointDirective,
                            NguCarouselItemDirective,
                            NguCarouselNextDirective,
                            NguCarouselPrevDirective,
                            NguCarouselDefDirective,
                            NguCarouselOutlet
                        ],
                        declarations: [
                            NguCarousel,
                            NguItemComponent,
                            NguTileComponent,
                            NguCarouselPointDirective,
                            NguCarouselItemDirective,
                            NguCarouselNextDirective,
                            NguCarouselPrevDirective,
                            NguCarouselDefDirective,
                            NguCarouselOutlet
                        ]
                    },] }
        ];
        return NguCarouselModule;
    }());

    exports.NguCarousel = NguCarousel;
    exports.NguCarouselConfig = NguCarouselConfig;
    exports.NguCarouselModule = NguCarouselModule;
    exports.NguCarouselStore = NguCarouselStore;
    exports.ɵa = ItemsControl;
    exports.ɵb = NguButton;
    exports.ɵc = NguCarouselItemDirective;
    exports.ɵd = NguCarouselNextDirective;
    exports.ɵe = NguCarouselPrevDirective;
    exports.ɵf = NguCarouselPointDirective;
    exports.ɵg = NguCarouselDefDirective;
    exports.ɵh = NguCarouselOutlet;
    exports.ɵi = NguItemComponent;
    exports.ɵj = NguTileComponent;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ngu-carousel.umd.js.map
