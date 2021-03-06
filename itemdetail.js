/**
 * Copyrightⓒ2020 by Moon Hanju (github.com/it-crafts)
 * All rights reserved. 무단전재 및 재배포 금지.
 * All contents cannot be copied without permission.
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
    AutoPageTurner.prototype = Object.create(PageTurner.prototype);
    AutoPageTurner.prototype.constructor = AutoPageTurner;
    const proto = AutoPageTurner.prototype;

    // PageTurner의 more 메소드가 오버라이드 됨
    proto.more = function(ajaxMore) {
        this.beforeMore();
        const io = new IntersectionObserver((entryList, observer) => {
            entryList.forEach(async entry => {
                if(!entry.isIntersecting) {
                    return;
                }
                const hasNext = await ajaxMore();
                if(!hasNext) {
                    observer.unobserve(entry.target);
                    this.afterMore(hasNext);
                }
            });
        }, { rootMargin: innerHeight + 'px' });
        io.observe(this.$loading);
    }

    return AutoPageTurner;
})();

// 중앙의 컨트롤러 같은 객체
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
            // this._pageTurner을 prototype이 AutoPageTurner.prototype로 변경
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
        this.$more.addEventListener('click', this.$click);
    }
    proto.removeEvent = function() {
        this.$more.removeEventListener('click', this.$click);
    }

    proto.fetch = async function() {
        const detailData = await common.fetchApiData(URL, 1);
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

/* 아이템 움직여주는 객체 
resize, click 모두 공통으로 $slider를 translate 해야하므로
1) translate 메소드
2) $left/$right button 노출 여부 메소드
3) $pagebar on 값 변경해야 하는 메소드
이렇게 3개로 분리해서 resize에서는 1)만, click에서는 1), 2), 3) 모두 호출하도록 해봤습니다.
- 이렇게 구조를 짜는게 맞는지...
- 클릭할 때는 1), 2), 3)을 모두 한 함수에서 호출하도록 묶어주는 게 좋을지...   
구조 짜는게 제일 어렵네요 ㅠㅠ
*/
/* TODO 우선 메소드 분리는 잘 되어 있는 것 같아요. 코드를 조금 수정했는데, 별다른 이슈가 없었습니다
아쉬운 점은, 현재는 슬라이더가 단순히 변수와 함수를 모아놓은 네임스페이스? 정도로 쓰이고 있는 것 같습니다
그리고 슬라이드 로직이 Item과 Slider에 분산되어 있어서 로직을 빠르게 파악하기가 어렵습니다
기존 설계상 $slider, $left, $right, $pagebar 엘리먼트를 모두 받았으니 큰 변화 없는 선에서 조정해보면
우선 버튼클릭 이벤트와 리사이즈 이벤트는 슬라이드 관련 로직이니, 슬라이더 안으로 끌어와주시고
그렇게되면 this.innerWidth, this.index의 상태관리 주체는 슬라이더가 되니, 함께 끌어오면 좋을 것 같습니다
setButton, setPagebar 최초실행도 Slider의 생성자 (혹은 create 메소드) 안에서 해줄 수 있을 것 같습니다
슬라이드 관련로직을 Slider로 전부 격리시키는 방향으로 리팩토링 해보시고 (이름을 잘 지어야 설계가 쉬워요)
이후에 어떻게 더 구조를 고도화할 수 있을 지 고민 해보세요~! */
const Slider = (() => {
    const Slider = function($slider, $left, $right, $pagebar){
        this.$slider = $slider;
        this.$left = $left;
        this.$right = $right;
        this.$pagebar = $pagebar;
    }
    const proto = Slider.prototype;

    proto.translate = function(index, innerWidth, duration = 0){
        this.$slider.style.transitionDuration = `${duration}ms`;
        const coordX = index * innerWidth * -1;
        this.$slider.style.transform = `translateX(${coordX}px)`;
    }

    // COMMENT 버튼 노출/숨김 로직 조금만 수정했습니다
    proto.setButton = function(index, length){
        this.$left.style.display = '';
        this.$right.style.display = '';
        if(index <= 0) {
            this.$left.style.display = 'none';
        }
        if(index >= length - 1) {
            this.$right.style.display = 'none';
        }
    }

    proto.setPagebar = function(index, onClass){
        const $prevPagebar = this.$pagebar.getElementsByClassName(onClass)[0];
        const $nextPagebar = this.$pagebar.children[index];
        $prevPagebar && $prevPagebar.classList.remove(onClass);
        $nextPagebar && $nextPagebar.classList.add(onClass);
    }

    return Slider;
})();

const Item = (() => {
    const Item = function($parent, detailData = {}, imgDataList = [], profileData = {}) {
        this.$parent = $parent;
        this._dataList = imgDataList;
        this.onClass = 'XCodT';
        this.render(detailData, profileData);
        this.$el = this.$parent.firstElementChild;
        this.$slider = this.$el.querySelector('.js-slider');
        this.$sliderList = this.$slider.querySelector('ul');
        this.$left = this.$el.querySelector('.js-left');
        this.$right = this.$el.querySelector('.js-right');
        this.$pagebar = this.$el.querySelector('.js-pagebar');
        // COMMENT 사이즈 캐싱을 통한 성능튜닝인거죠? 잘 하셨어요
        this.innerWidth = innerWidth;
        this.index = 0;
        /* TODO _dataList의 내용이 변경될 경우, 함께 챙겨줘야 해서 버그유발 가능성이 있습니다
        특별히 값변동이 없고, 성능차이가 미미하므로 속성에서 제거하는 것도 고려 해보세요~! */
        // this.length = this._dataList.length;
        // this._throttling = null;
        this._slider = new Slider(this.$slider, this.$left, this.$right, this.$pagebar);
        /* COMMENT buttun의 init은 객체에서 하고, pagebar의 init은 마크업에서 하는 게 이상해서
        init 로직은 전부 슬라이더에서 수행하도록 수정 했습니다 */
        this._slider.setButton(this.index, this._dataList.length);
        this._slider.setPagebar(this.index, this.onClass);
        this.addEvent();
    }
    const proto = Item.prototype;

    proto.create = function() {
    }
    proto.destroy = function() {
        /* BUG destroy 시에 this.$resize 이벤트리스너가 제거되지 않아 메모리 누수가 쌓이고 있습니다
        root.destroy() 후 리사이즈 이벤트 발생시켜 보시면, 전부 살아있는 것 확인하실 수 있습니다
        컴포넌트에서 추가되는 모든 추가로직은 대응되는 제거로직을 작성 해주시고,
        destroy에서는 추가된 모든 것들을 제거하는 로직을 붙여주세요
        지금은 여기서 this.removeEvent(); 부르면 될 것 같습니다~! */
        this.$parent.removeChild(this.$el);
    }

    // COMMENT 로직을 합치는 게 조금 더 나을 것 같아서, 합치고 분기처리로 변경했습니다
    proto.click = function(e) {
        if(this.$left === e.currentTarget) {
            this.index--;
        }
        /* COMMENT else if로 연결하면 상위 if문 조건이 계속 아래로 상속이 되어서 (유지보수성이 떨어져서)
        저는 꼭 필요할 때만 else if로 달고, 아니면 성능손해를 조금 보더라도 별도의 if로 분기하는 편입니다
        정답은 아니니 참고만 하세요~! */
        if(this.$right === e.currentTarget) {
            this.index++;
        }
        this._slider.translate(this.index, this.innerWidth, 250);
        this._slider.setButton(this.index, this._dataList.length);
        this._slider.setPagebar(this.index, this.onClass);
    }

    proto.resize = function() {
        if(this._throttling) {
            return;
        }
        this._throttling = setTimeout(() => {
            this._throttling = null;
            this.innerWidth = innerWidth;
            // HACK 현재 데이터바인딩을 지원하지 않으므로, 리스트 모든 엘리먼트 지우고 새로 렌더링
            while(this.$sliderList.firstChild) {
                this.$sliderList.removeChild(this.$sliderList.firstChild);
            }
            this.$sliderList.insertAdjacentHTML('beforeend', `
                ${this.htmlSliderImgs(this._dataList, this.innerWidth)}
            `);
            // COMMENT 리사이즈도 슬라이더로 처리하신 건 꽤 괜찮은 방법인 것 같아요
            this._slider.translate(this.index, this.innerWidth);
        }, 100);
    }

    proto.addEvent = function() {
        this.$click = this.click.bind(this);
        this.$resize = this.resize.bind(this);

        this.$left.addEventListener('click', this.$click);
        this.$right.addEventListener('click', this.$click);
        window.addEventListener('resize', this.$resize);
    }

    proto.removeEvent = function() {
        this.$left.removeEventListener('click', this.$click);
        this.$right.removeEventListener('click', this.$click);
        window.removeEventListener('resize', this.$resize);
    }

    proto.htmlSliderImgs = function(imgDataList, innerWidth) {
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
        const navs = this._dataList.reduce(html => {
            html += `<div class="Yi5aA"></div>`;
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
                                                    ${this.htmlSliderImgs(this._dataList, innerWidth)}
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
        return new Promise(resolve => {
            const detailData = this._dataListTemp.shift();
            if(!detailData) {
                resolve({ hasNext: false });
            }

            this.render(detailData);
            const $el = this.$parent.lastElementChild;
            this.$elList.push($el);
            this._dataList.push(detailData);

            $el.querySelector('img').onload = (e) => {
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