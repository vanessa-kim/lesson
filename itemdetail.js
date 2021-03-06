/**
 * Copyrightⓒ2020 by Moon Hanju (github.com/it-crafts)
 * All rights reserved. 무단전재 및 재배포 금지.
 * All contents cannot be copied without permission.
 */

/**
 * 프로토 타입 사용 이유
 * 프로토타입을 이용하면 객체와 객체를 연결하고 한쪽 방향으로 상속을 받는 형태를 만들 수가 있다. 
 * 자바스크립트에서 객체와 객체를 연결해서 상속 받는다는 것은 다른 말로 객체와 객체를 연결해 
 * 멤버 함수나 멤버 변수를 공유 한다는 뜻이다. 
 * 이런 점을 이용해 자바스크립트에서는 상속과 비슷한 효과를 얻는 것이다.
 * https://meetup.toast.com/posts/104
 */
const common = (function() {
    const IMG_PATH = 'https://it-crafts.github.io/lesson/img';
    const fetchApiData = async (url, page = 'info') => {
        const res = await fetch(url + page);
        const data = await res.json();
        return data.data;
    }

    return { IMG_PATH, fetchApiData }
})();

const Root = (() => {
    const Root = function(selector) {
        this.$el = document.querySelector(selector);
        this._page;
    };
    const proto = Root.prototype;

    proto.create = function() {
        this._page = new ItemDetail(this.$el);
        this._page.create();
    }
    proto.destroy = function() {
        this._page && this._page.destroy();
    }

    return Root;
})();

// 이제부터 PageTurner는 이제 추상클래스가 아니라, 원본 컴포넌트의 역할을 보조해주는 독립적인 객체이다
const PageTurner = (() => {
    const PageTurner = function($loading, $more) {
        this.$loading = $loading;
        this.$more = $more;
    }
    const proto = PageTurner.prototype;

    // 콜백함수 좋은 예제: API 통신 외에도, 생성 함수에서 시간이 걸린다면 async await 사용
    // 간단한 show/hide 기능도 세분화된 함수로 나누어 구현 -> 직관적 함수명 -> 코드 이해력 증가, 유지보수 용이
    proto.more = async function(ajaxMore) {
        this.beforeMore();
        const hasNext = await ajaxMore();
        this.afterMore(hasNext);
    }
    proto.beforeMore = function() {
        this.$more.style.display = 'none';
        this.$loading.style.display = '';
    }
    proto.afterMore = function(hasNext) {
        this.$loading.style.display = 'none';
        if(hasNext) {
            this.$more.style.display = '';
        }
    }

    return PageTurner;
})();

const AutoPageTurner = (() => {
    const AutoPageTurner = function($loading, $more) {
        PageTurner.call(this, $loading, $more);
    }
    // __proto__를 이용해서 프로토타입 체인을 형성하는 것은 안티패턴 -> 개발자가 직접 __proto__에 접근해서는 안된다
    // Object.create() api를 사용해서 __proto__가 PageTurner를 참조하는 새로운 빈 객체를 리턴한다.
    // AutoPageTurner는 PageTurner가 가진 prototype을 사용할 수도 있고, 본인이 가진 새로운 메서드도 덧붙여 사용할 수 있다.

    AutoPageTurner.prototype = Object.create(PageTurner.prototype);
    AutoPageTurner.prototype.constructor = AutoPageTurner;
    const proto = AutoPageTurner.prototype;

    // PageTurner의 more 메소드가 오버라이드 됨
    proto.more = function(ajaxMore) {
        this.beforeMore();
        // Intersection Observer API 의 IntersectionObserver 인터페이스
        // 대상 요소와 그 상위 요소 혹은 최상위 도큐먼트인 viewport와의 교차 영역에 대한 변화를 비동기적으로 감지할 수 있도록 도와준다.
        const io = new IntersectionObserver((entryList, observer) => {
            entryList.forEach(async entry => {
                if(!entry.isIntersecting) {
                    return;
                }
                const hasNext = await ajaxMore();
                if(!hasNext) {
                    // Observer.unobserve() 실행하게되면 대상 감시를 중지한다.
                    observer.unobserve(entry.target);
                    this.afterMore(hasNext);
                }
            });
        }, { rootMargin: innerHeight + 'px' });
        io.observe(this.$loading);
    }

    return AutoPageTurner;
})();

const ItemDetail = (() => {
    const URL = 'https://my-json-server.typicode.com/it-crafts/lesson/detail/';

    const ItemDetail = function($parent) {
        this.$parent = $parent;
        this.render();
        this.$el = $parent.firstElementChild;
        this.$loading = this.$el.querySelector('.js-loading');
        this.$more = this.$el.querySelector('.js-more');

        this._item;
        this._detail;
        this._pageTurner;

        this._data = {};

        this.$click;
    }
    const proto = ItemDetail.prototype;

    proto.create = async function() {
        const detailData = await this.fetch();
        this._item = new Item(this.$el.firstElementChild, detailData, detailData.imgList, detailData.profile);
        this._item.create();
        this._detail = new Detail(this.$el.firstElementChild, detailData.detailList);
        this._detail.create();
        // ItemDetail이 PageTurner를 상속하는 게 아닌, 내부에 부하로 생성하고 일을 대신 시키기만 한다 (악보랑 악보대를 알려준다)
        this._pageTurner = new PageTurner(this.$loading, this.$more);
        this.addEvent();
    }
    proto.destroy = function() {
        this._item && this._item.destroy();
        this._detail && this._detail.destroy();
        this.removeEvent();
        this.$parent.removeChild(this.$el);
    }

    proto.click = function(e) {
        const listener = e.target.dataset.listener;
        if(listener === 'infinite') {
            // 런타임 부모 강제변경 - 이런 행위는 JS에서만 가능하며, 바람직하진 않으나 강력하다
            /**
             * Object.setPrototypeOf(arg1, arg2) : 주어진 객체의 Prototype을 변경할 수 있게하는 ES6 메서드
             * @param arg1 : Prototype이 변경되어야하는 객체
             * @param arg2 : 첫 번째 파라미터의 Prototype이 되는 대상 객체
             */
            Object.setPrototypeOf(this._pageTurner, AutoPageTurner.prototype);
        }

        // 부하인 PageTurner 객체에게 "이거해" 라고 콜백을 넘겨준다 - 그럼 콜백 앞뒤의 일은 PageTurner가 알아서 한다
        this._pageTurner.more(async () => {
            const { hasNext } = await this._detail.addImg();
            return hasNext;
        });
    }

    proto.addEvent = function() {
        this.$click = this.click.bind(this);
        this.$more.addEventListener('click', this.$click.bind(this));
    }
    proto.removeEvent = function() {
        this.$more.removeEventListener('click', this.$click);
    }

    proto.fetch = async function() {
        const detailData = await common.fetchApiData(URL, 1);
        /**
         * Object.assign() 메소드: 대상 객체에 다른 객체의 속성을 복사할 때 사용한다. 대상 객체를 반환한다. 
         * 주로 얕은 복사를 할 때 사용한다. 객체안의 객체인 경우 겉 껍데기만 복사하고 내용물은 공유되기에 깊은 복사에는 적합하지 않다.
         * 깊은 복사를 원한다면 const copy = JSON.parse(JSON.stringify(obj)); 
         */
        Object.assign(this._data, detailData);
        return detailData;
    }

    proto.render = function() {
        this.$parent.innerHTML = `
            <div class="_2z6nI">
                <div style="flex-direction: column;">
                </div>
                <div class="js-more Igw0E rBNOH YBx95 ybXk5 _4EzTm soMvl" style="margin-right: 8px;">
                    <button data-listener="more" class="sqdOP L3NKy y3zKF _4pI4F" type="button" style="margin: 16px 8px">더보기</button>
                    <button data-listener="infinite" class="sqdOP L3NKy y3zKF _4pI4F" type="button" style="margin: 16px 8px">전체보기</button>
                </div>
                <div class="js-loading _4emnV" style="display: none;">
                    <div class="Igw0E IwRSH YBx95 _4EzTm _9qQ0O ZUqME" style="height: 32px; width: 32px;"><svg aria-label="읽어들이는 중..." class="By4nA" viewBox="0 0 100 100"><rect fill="#555555" height="6" opacity="0" rx="3" ry="3" transform="rotate(-90 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.08333333333333333" rx="3" ry="3" transform="rotate(-60 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.16666666666666666" rx="3" ry="3" transform="rotate(-30 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.25" rx="3" ry="3" transform="rotate(0 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.3333333333333333" rx="3" ry="3" transform="rotate(30 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.4166666666666667" rx="3" ry="3" transform="rotate(60 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.5" rx="3" ry="3" transform="rotate(90 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.5833333333333334" rx="3" ry="3" transform="rotate(120 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.6666666666666666" rx="3" ry="3" transform="rotate(150 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.75" rx="3" ry="3" transform="rotate(180 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.8333333333333334" rx="3" ry="3" transform="rotate(210 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.9166666666666666" rx="3" ry="3" transform="rotate(240 50 50)" width="25" x="72" y="47"></rect></svg></div>
                </div>
            </div>
        `;
    }

    return ItemDetail;
})();

const Item = (() => {
    const Item = function($parent, detailData = {}, imgDataList = [], profileData = {}) {
        this.$parent = $parent;
        this._dataList = imgDataList;
        this.render(detailData, profileData);
        this.$el = this.$parent.firstElementChild;
        this.$slider = this.$el.querySelector('.js-slider');
        this.$sliderList = this.$slider.querySelector('ul');
        this.$left = this.$el.querySelector('.js-left');
        this.$right = this.$el.querySelector('.js-right');
        this.$pagebar = this.$el.querySelector('.js-pagebar');
        
       
        // slide와 pagination에 필요한 값들 (캐싱)
        this.screenWidth = window.innerWidth;
        this.originWidth = -window.innerWidth;
        this.containerWidth;
        this.listIndex = 1;

        // resize 이벤트 구현을 위해 필요한 값들 (캐싱)
        this.resizeScreenWidth;
        this.resizeTimer;
        
        this.showBtns();
        this.addEvent();
    }
    const proto = Item.prototype;

    proto.create = function() {
        // pagination 클릭 가능하도록 ui/ux 개선
        this.$pagebar.style.zIndex = 1;
        this.$pagebar.style.cursor = 'pointer';

        // pagination 버튼에 index 추가
        for(let i = 0; i < this.$pagebar.children.length; i++){
            this.$pagebar.children[i].index = i;
        }
    }
    proto.destroy = function() {
        this.$parent.removeChild(this.$el);
    }
    proto.addEvent = function(){
        this.$el.addEventListener('click', this.click.bind(this));

        // resize 이벤트를 호출할 때, 성능 개선을 위한 쓰로틀링 적용
        window.addEventListener('resize', (e) => {
            if(!this.resizeTimer){
                this.resizeTimer = setTimeout(()=>{
                    this.resizeTimer = null;
                    this.resizeScreenWidth = window.innerWidth;
                    this.resize();
                }, 300);
            }
        }, false);
    }
    
    proto.click = function(e) {
        // 클릭 이벤트가 일어났을 때만 함수 내부에서 쓰이는 분류 함수 (click 함수에 종속되어 있음)
        const comparator = (() => {
            const previousAction = () => {
                if(this.listIndex == 1) return;
                
                this.containerWidth = this.containerWidth + -this.originWidth;
                this.listIndex--;
                this.$slider.style.transform = `translateX(${this.containerWidth}px)`;
            }
            const nextAction = () => {
                if(this.listIndex >= this.$sliderList.children.length) return;

                this.containerWidth = this.originWidth * this.listIndex++;
                this.$slider.style.transform = `translateX(${this.containerWidth}px)`;
            }
            const movement = () => {
                this.containerWidth = this.originWidth * e.target.index;
                this.listIndex = e.target.index + 1;
                this.$slider.style.transform = `translateX(${this.containerWidth}px)`
            }

            return {
                prev: previousAction,
                next: nextAction,
                move: movement,
            }
        })();
        
        // 클릭된 타겟이 left/right 버튼일 때 실행되는 로직
        if(e.target.parentNode == this.$left || e.target.parentNode == this.$right) {
            const selectedTarget = e.target.parentNode;
            const moveLocation = (selectedTarget == this.$left ? 'prev' : 'next');
            
            comparator[moveLocation]();
            this.showBtns();
            return;
        }

        // 클릭된 타겟이 pagination 버튼일 때 실행되는 로직
        if(e.target.parentNode == this.$pagebar){
            comparator['move']();
            this.addClass(e);
            this.showBtns();
            return;
        }
    }

    // $pagebar 이미지에 대응되는 엘리먼트로 pagination에 on 처리 (XCodT 클래스 추가)
    proto.addClass = function(e) {
        for(let i = 0; i < e.target.parentNode.children.length; i++) {
            e.target.parentNode.children[i].classList.remove('XCodT');
        }
        e.target.classList.add('XCodT');
    }

    // 화살표 버튼 숨김/표시
    proto.showBtns = function() {
        (this.listIndex != 1 ? this.$left.style.display = 'block': this.$left.style.display = 'none');
        (this.listIndex != this.$sliderList.children.length ? this.$right.style.display = 'block': this.$right.style.display = 'none');
    }
    
    proto.resize = function() {
        // HACK 현재 데이터바인딩을 지원하지 않으므로, 리스트 모든 엘리먼트 지우고 새로 렌더링
        while(this.$sliderList.firstChild) {
            this.$sliderList.removeChild(this.$sliderList.firstChild);
        }
        this.$sliderList.insertAdjacentHTML('beforeend', `
            ${this.htmlSliderImgs(this._dataList)}
        `);
        // TODO 리프레시 전 슬라이드 이미지 다시 노출 (좌표보정) 
        //      -> 의미를 이해 못함 (이미 구현해놓으신 코드가 지우고 다시 그리는 것 아닌가요? 뭘 다시 노출하는건지 잘 모르겠어요!)
    }

    proto.htmlSliderImgs = function(imgDataList) {
        const imgs = imgDataList.reduce((html, img) => {
            html += `
                <li class="_-1_m6" style="opacity: 1; width: ${innerWidth}px;">
                    <div class="bsGjF" style="margin-left: 0px; width: ${innerWidth}px;">
                        <div class="Igw0E IwRSH eGOV_ _4EzTm" style="width: ${innerWidth}px;">
                            <div role="button" tabindex="0" class="ZyFrc">
                                <div class="eLAPa RzuR0">
                                    <div class="KL4Bh" style="padding-bottom: 100%;">
                                        <img class="FFVAD" decoding="auto" src="${common.IMG_PATH}${img}" style="object-fit: cover;">
                                    </div>
                                    <div class="_9AhH0"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            `;
            return html;
        }, '');
        return imgs;
    }
    proto.render = function(data, profileData) {
        const navs = this._dataList.reduce((html, img, index) => {
            const on = index === 0 ? 'XCodT' : '';
            html += `
                <div class="Yi5aA ${on}"></div>
            `;
            return html;
        }, '');
        this.$parent.insertAdjacentHTML('afterbegin', `
            <article class="QBXjJ M9sTE h0YNM SgTZ1 Tgarh">
                <header class="Ppjfr UE9AK wdOqh">
                    <div class="RR-M- h5uC0 mrq0Z" role="button" tabindex="0">
                        <canvas class="CfWVH" height="126" width="126" style="position: absolute; top: -5px; left: -5px; width: 42px; height: 42px;"></canvas>
                        <span class="_2dbep" role="link" tabindex="0" style="width: 32px; height: 32px;"><img alt="${profileData.name}님의 프로필 사진" class="_6q-tv" src="${common.IMG_PATH}${profileData.img}"></span>
                    </div>
                    <div class="o-MQd">
                        <div class="e1e1d">
                            <h2 class="BrX75"><a class="FPmhX notranslate nJAzx" title="${profileData.name}" href="javascript:;">${profileData.name}</a></h2>
                        </div>
                    </div>
                </header>
                <div class="_97aPb wKWK0">
                    <div class="rQDP3">
                        <div class="pR7Pc">
                            <div class="tR2pe" style="padding-bottom: 100%;"></div>
                            <div class="Igw0E IwRSH eGOV_ _4EzTm O1flK D8xaz fm1AK TxciK yiMZG">
                                <div class="tN4sQ zRsZI">
                                    <div class="NgKI_">
                                        <div class="js-slider MreMs" tabindex="0" style="transition-duration: 0.25s; transform: translateX(0px);">
                                            <div class="qqm6D">
                                                <ul class="YlNGR" style="padding-left: 0px; padding-right: 0px;">
                                                    ${this.htmlSliderImgs(this._dataList)}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <button class="js-left POSa_" tabindex="-1">
                                        <div class="coreSpriteLeftChevron"></div>
                                    </button>
                                    <button class="js-right _6CZji" tabindex="-1">
                                        <div class="coreSpriteRightChevron"></div>
                                    </button>
                                </div>
                            </div>
                            <div class="js-pagebar ijCUd _3eoV- IjCL9 _19dxx">
                                ${navs}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="eo2As">
                    <section class="ltpMr Slqrh">
                        <span class="fr66n"><button class="dCJp8 afkep"><span aria-label="좋아요" class="glyphsSpriteHeart__outline__24__grey_9 u-__7"></span></button></span>
                        <span class="_15y0l"><button class="dCJp8 afkep"><span aria-label="댓글 달기" class="glyphsSpriteComment__outline__24__grey_9 u-__7"></span></button></span>
                        <span class="_5e4p"><button class="dCJp8 afkep"><span aria-label="게시물 공유" class="glyphsSpriteDirect__outline__24__grey_9 u-__7"></span></button></span>
                        <span class="wmtNn"><button class="dCJp8 afkep"><span aria-label="저장" class="glyphsSpriteSave__outline__24__grey_9 u-__7"></span></button></span>
                    </section>
                    <section class="EDfFK ygqzn">
                        <div class=" Igw0E IwRSH eGOV_ ybXk5 vwCYk">
                            <div class="Nm9Fw"><a class="zV_Nj" href="javascript:;">좋아요 <span>${data.clipCount}</span>개</a></div>
                        </div>
                    </section>
                    <div class="KlCQn EtaWk">
                        <ul class="k59kT">
                            <div role="button" class="ZyFrc">
                                <li class="gElp9" role="menuitem">
                                    <div class="P9YgZ">
                                        <div class="C7I1f X7jCj">
                                            <div class="C4VMK">
                                                <h2 class="_6lAjh"><a class="FPmhX notranslate TlrDj" title="${profileData.name}" href="javascript:;">${profileData.name}</a></h2>
                                                <span>${data.text}</span>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </div>
                            <li class="lnrre">
                                <button class="Z4IfV sqdOP yWX7d y3zKF" type="button">댓글 <span>${data.commentCount}</span>개 모두 보기</button>
                            </li>
                        </ul>
                    </div>
                    <section class="sH9wk _JgwE eJg28">
                        <div class="RxpZH"></div>
                    </section>
                </div>
                <div class="MEAGs">
                    <button class="dCJp8 afkep"><span aria-label="옵션 더 보기" class="glyphsSpriteMore_horizontal__outline__24__grey_9 u-__7"></span></button>
                </div>
            </article>
        `);
    }

    return Item;
})();

const Detail = (() => {
    const Detail = function($parent, detailDataList = []) {
        this.$parent = $parent;
        this._dataListTemp = detailDataList;
        this.$elList = [];
        this._dataList = [];
    };
    const proto = Detail.prototype;

    proto.create = function() {
    }
    proto.destroy = function() {
        this.$elList.forEach($el => this.$parent.removeChild($el));
    }

    proto.addImg = function() {
        // ** Promise 생성 참고할 것 ** 
        return new Promise(resolve => {
            // shift() 메서드는 배열에서 첫 번째 요소를 제거하고, 제거된 요소를 반환한다. 이 메서드는 배열의 길이를 변하게 한다.
            const detailData = this._dataListTemp.shift();
            if(!detailData) {
                resolve({ hasNext: false });
            }

            this.render(detailData);
            const $el = this.$parent.lastElementChild;
            this.$elList.push($el);
            this._dataList.push(detailData);

            $el.querySelector('img').onload = (e) => {
                // Vue의 $nextTick과 비슷한 동작
                resolve({ hasNext: this._dataListTemp.length > 0 });
            }
        });
    }

    proto.render = function(img) {
        this.$parent.insertAdjacentHTML('beforeend', `
            <article class="M9sTE h0YNM SgTZ1">
                <img style="width: 100%; height: auto;" src="${common.IMG_PATH}${img}">
            </article>
        `);
    }

    return Detail;
})();

const root = new Root('main');
root.create();