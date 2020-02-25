/**
 * Copyrightⓒ2020 by Moon Hanju (github.com/it-crafts)
 * All rights reserved. 무단전재 및 재배포 금지.
 * All contents cannot be copied without permission.
 */
const common = (() => {
    const IMG_PATH = 'https://it-crafts.github.io/lesson/img';
    const fetchApiData = async function(url, page = 'info') {
        const res = await fetch(url + page);
        const data = await res.json();
        return data.data;
    }

    return { IMG_PATH, fetchApiData};
})();

const Root = (() => {
    const Root = function(selector){
        this.$el = document.querySelector(selector);
        this._page;
    }

    const proto = Root.prototype;

    proto.create = function(){
        this._page = new Timeline(this.$el);
        this._page.create();
    }

    proto.destory = function(){
        this._page && this._page.destroy();
    }

    return Root;
})();

const Timeline = (() => {
    const URL = 'https://my-json-server.typicode.com/it-crafts/lesson/timeline/';

    const Timeline = function($parent){
        this.$parent = $parent; // main
        this.render();
        this.$el = $parent.firstElementChild;
    } 

    const proto = Timeline.prototype;

    proto.create = async function(){
        const [ totalPage, profileData ] = await this.fetch();
        this._profile = new TimelineProfile(this.$el, profileData);
        this._profile.create();
        this._content = new TimelineContent(this.$el, URL, totalPage);
        this._content.create();
    }

    proto.destroy = function(){
        this._profile && this._profile.destory();
        this._content && this._content.destory();
    }

    proto.render = function(){
        this.$parent.insertAdjacentHTML('afterbegin', `
            <div class="v9tJq">
            </div>
        `);
    }

    proto.fetch = async function(){
        const infoData = await common.fetchApiData(URL);
        const totalPage = infoData.totalPage * 1;
        const profileData = infoData.profile;
        return [ totalPage, profileData ];
    }

    return Timeline;
})();

const TimelineProfile = (() => {
    const scaleDown = numstring => {
        const num = numstring.replace(/,/g, '');
        if(num >= 1000000) {
            return Math.floor(num / 100000) / 10 + '백만'
        }
        if(num >= 1000) {
            return Math.floor(num / 100) / 10 + '천'
        }
        return num;
    };

    const TimelineProfile = function($parent, profileData){
        this.$parent = $parent; // div.v9tJq
        this.profileData = profileData;
    }
    
    const proto = TimelineProfile.prototype;


    proto.create = function(){
        this.render(this.profileData);
        this.$el = this.$parent.firstElementChild;
    }

    proto.destory = function(){
        this.$parent.removeChild(this.$el);

    }

    proto.render = function(data){
        this.$parent.insertAdjacentHTML('afterbegin', `
            <div>
                <header class="HVbuG">
                    <div class="XjzKX">
                        <div class="RR-M- h5uC0" role="button" tabindex="0">
                            <canvas class="CfWVH" height="91" width="91" style="position: absolute; top: -7px; left: -7px; width: 91px; height: 91px;"></canvas>
                            <span class="_2dbep" role="link" tabindex="0" style="width: 77px; height: 77px;"><img alt="${data.name}님의 프로필 사진" class="_6q-tv" src="${common.IMG_PATH}${data.img}"></span>
                        </div>
                    </div>
                    <section class="zwlfE">
                        <div class="nZSzR">
                            <h1 class="_7UhW9 fKFbl yUEEX KV-D4 fDxYl">${data.name}</h1>
                            <span class="mrEK_ Szr5J coreSpriteVerifiedBadge" title="인증됨">인증됨</span>
                            <div class="AFWDX"><button class="dCJp8 afkep"><span aria-label="옵션" class="glyphsSpriteMore_horizontal__outline__24__grey_9 u-__7"></span></button></div>
                        </div>
                        <div class="Y2E37">
                            <div class="Igw0E IwRSH eGOV_ vwCYk">
                                <span class="ffKix bqE32">
                                    <span class="vBF20 _1OSdk"><button class="_5f5mN jIbKX _6VtSN yZn4P">팔로우</button></span>
                                    <span class="mLCHD _1OSdk"><button class="_5f5mN jIbKX KUBKM yZn4P"><div class="OfoBO"><div class="_5fEvj coreSpriteDropdownArrowWhite"></div></div></button></span>
                                </span>
                            </div>
                        </div>
                    </section>
                </header>
                <div class="-vDIg">
                    <h1 class="rhpdm">${data.title}</h1><br><span>${data.text}</span>
                </div>
                <ul class="_3dEHb">
                    <li class="LH36I"><span class="_81NM2">게시물 <span class="g47SY lOXF2">${data.post}</span></span></li>
                    <li class="LH36I"><a class="_81NM2" href="javascript:;">팔로워 <span class="g47SY lOXF2" title="${data.follower}">${scaleDown(data.follower)}</span></a></li>
                    <li class="LH36I"><a class="_81NM2" href="javascript:;">팔로우 <span class="g47SY lOXF2">${data.follow}</span></a></li>
                </ul>
                <div class="fx7hk">
                    <a class="_9VEo1 T-jvg" href="javascript:;" data-type="grid"><span aria-label="게시물" class="glyphsSpritePhoto_grid__outline__24__blue_5 u-__7"></span></a>
                    <a class="_9VEo1" href="javascript:;" data-type="feed"><span aria-label="피드" class="glyphsSpritePhoto_list__outline__24__grey_5 u-__7"></span></a>
                    <a class="_9VEo1" href="javascript:;" data-type=""><span aria-label="태그됨" class="glyphsSpriteTag_up__outline__24__grey_5 u-__7"></span></a>
                </div>
            </div>
        `);
    }

    return TimelineProfile;
})();

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


const TimelineContent = (() => {
    const TimelineContent = function($parent, URL, totalPage){
        this.$parent = $parent;
        this.url = URL;
        this.totalPage = totalPage;
        this.page = 0;
        this.dataList = [];
    }

    const proto = TimelineContent.prototype;

    proto.create = function(){
        this.render();
        this.$el = this.$parent.lastElementChild;
        this.$loading = this.$el.querySelector('.js-loading');
        this.$more = this.$el.querySelector('.js-more');
        this._grid = new Grid(this.$el.querySelector('article'), this.url, this.totalPage); 
        this._grid.create();
        this._pageTurner = new PageTurner(this.$loading, this.$more);
        this._pageTurner.more(async () => {
            const { hasNext } = await this._grid.addItem();
            return hasNext;
        });
        this.addEvent();
    }

    proto.destroy = function(){
        this._grid && this._grid.destroy();
        this.$parent.removeChild(this.$el);
        this.removeEvent();
    }

    proto.click = function(e) {
        const listener = e.target.dataset.listener;
        if(listener === 'infinite') {
            Object.setPrototypeOf(this._pageTurner, AutoPageTurner.prototype);
        }
        this._pageTurner.more(async () => {
            const { hasNext } = await this._grid.addItem();
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

    proto.render = function(){
        this.$parent.insertAdjacentHTML('beforeend', `
            <div class="_2z6nI">
                <div style="flex-direction: column;">
                    <article class="FyNDV">
                        <div style="display: none;" class="js-loading _4emnV">
                            <div class="Igw0E IwRSH YBx95 _4EzTm _9qQ0O ZUqME" style="height: 32px; width: 32px;"><svg aria-label="읽어들이는 중..." class="By4nA" viewBox="0 0 100 100"><rect fill="#555555" height="6" opacity="0" rx="3" ry="3" transform="rotate(-90 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.08333333333333333" rx="3" ry="3" transform="rotate(-60 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.16666666666666666" rx="3" ry="3" transform="rotate(-30 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.25" rx="3" ry="3" transform="rotate(0 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.3333333333333333" rx="3" ry="3" transform="rotate(30 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.4166666666666667" rx="3" ry="3" transform="rotate(60 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.5" rx="3" ry="3" transform="rotate(90 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.5833333333333334" rx="3" ry="3" transform="rotate(120 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.6666666666666666" rx="3" ry="3" transform="rotate(150 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.75" rx="3" ry="3" transform="rotate(180 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.8333333333333334" rx="3" ry="3" transform="rotate(210 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.9166666666666666" rx="3" ry="3" transform="rotate(240 50 50)" width="25" x="72" y="47"></rect></svg></div>
                        </div>
                        <div class="js-more Igw0E rBNOH YBx95 ybXk5 _4EzTm soMvl" style="margin-right: 8px; display: none;">
                            <button data-listener="more" class="sqdOP L3NKy y3zKF _4pI4F" type="button" style="margin: 16px 8px">더보기</button>
                            <button data-listener="infinite" class="sqdOP L3NKy y3zKF _4pI4F" type="button" style="margin: 16px 8px">전체보기</button>
                        </div>
                    </article>
                </div>
            </div>
        `);
    }

    return TimelineContent;
})();

const Grid = (() => {
    const Grid = function($parent, url, totalPage){
        this.$parent = $parent;
        this.url = url;
        this.totalPage = totalPage;
        this.page = 0;
        this.dataList = [];
    }

    const proto = Grid.prototype;

    proto.create = function(){
        this.render();
        this.$el = this.$parent.firstElementChild;
        this._gridItem = new GridItem(this.$el.firstElementChild);
    }

    proto.destroy = function(){
        this._gridItem && this._gridItem.destory();
        this.$parent.removeChild(this.$el);
    }

    proto.addItem = async function(){
        const ITEM_PER_ROW = 3;
        const divide = (list, size) => {
            const copy = [...list];
            const cnt = Math.ceil(copy.length / size);
        
            const listList = [];
            for(let i = 0; i < cnt; i++) {
                listList.push(copy.splice(0, size));
            }
    
            const lastlist = listList[listList.length - 1];
            for(let i = lastlist.length; i < size; i++) {
                lastlist[i] = {};
            }
            
            return listList;
        };
        const timelineList = await this.fetch();
        this._gridItem.addImg(divide(timelineList, ITEM_PER_ROW));
        return ({hasNext: this.page < this.totalPage});
    }

    proto.fetch = async function(){
        const timelineList = await common.fetchApiData(this.url, ++this.page);
        this.dataList.push(timelineList);
        return timelineList;
    }

    proto.render = function(){
        this.$parent.insertAdjacentHTML('afterbegin', `
            <div>
                <div style="flex-direction: column; padding-bottom: 0px; padding-top: 0px;">
                </div>
            </div>
        `);
    }

    return Grid;

})();

const GridItem = (() => {
    const GridItem = function($parent){
        this.$parent = $parent;
        this.$elList = [];
    }
    const proto = GridItem.prototype;

    proto.create = function(){
    }

    proto.destory = function(){
        this.$elList.forEach($el => {
            $el.forEach($img => {
                $el.removeChild($img);
            })
            this.$parent.removeChild($el);
        })
    }

    proto.addImg = function(listList){
        this.render(listList);
        const firstIndex = this.$elList.length;
        this.$elList.push(...[].slice.call(this.$parent.children, firstIndex));
    }

    proto.render = function(listList) {
        listList.forEach(list => {
            const html = list.reduce((html, data) => {
                const img = (data.img || '') && `
                    <a href="javascript:;">
                        <div class="eLAPa">
                            <div class="KL4Bh">
                                <img class="FFVAD" decoding="auto" src="${common.IMG_PATH}${data.img}" style="object-fit: cover;">
                            </div>
                        </div>
                    </a>
                `;
                html += `
                    <div class="v1Nh3 kIKUG _bz0w">${img}</div>
                `;
                return html;
            }, '');
            
            this.$parent.insertAdjacentHTML('beforeend', `
                <div class="Nnq7C weEfm">
                    ${html}
                </div>
            `);

        })
    }

    return GridItem;
})();

const root = new Root('main');
root.create();