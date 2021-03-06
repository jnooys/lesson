/**
 * Copyrightⓒ2020 by Moon Hanju (github.com/it-crafts)
 * All rights reserved. 무단전재 및 재배포 금지.
 * All contents cannot be copied without permission.
 */
(async () => {

    const common = (() => {
        const IMG_PATH = 'https://it-crafts.github.io/lesson/img';
        const fetchApiData = async (url, page = 'info') => {
            const res = await fetch(url + page);
            const data = await res.json();
            return data.data;
        }
        
        // myFilter 추가
        Array.prototype.myFilter = function(func) {
            let result = [];
            for(let i = 0; i < this.length; i++) {
                let condition = func(this[i]);
                if(condition) {
                    result.push(this[i]);
                }
            }
            return result;
        }
    
        // mySort 추가
        Array.prototype.mySort = function(func) {
            const sortArray = (start, end) => {
                if(start>= end) return;
                let i = start;
                let j = end;
                const center = Math.floor((i+j) / 2);
                const pivot = this[center];
    
                while (i <= j){
                    while (func(this[i], pivot)) i++;
                    while (func(pivot, this[j])) j--;
                    if(i <= j) {
                        let temp = this[i];
                        this[i] = this[j];
                        this[j] = temp;
                        i++;
                        j--;
                    }
                }
                sortArray(start, i-1);
                sortArray(i, end);
            };
            sortArray(0, this.length - 1);

            return this;
        }
    
        return { IMG_PATH, fetchApiData }
    })();
    
    const root = (() => {
        let $el;
    
        const create = () => {
            $el = document.querySelector('main');
        }
    
        create();
        return { $el }
    })();
    
    const timeline = await (async($parent) => {
        let $el;
        const url = 'https://my-json-server.typicode.com/it-crafts/lesson/timeline/';
        const infoData = await common.fetchApiData(url);
        const totalPage = infoData.totalPage * 1;
        const profileData = infoData.profile;
    
        const create = () => {
            render();
            $el = $parent.firstElementChild;
        }
    
        const render = () => {
            $parent.innerHTML = `
                <div class="v9tJq">
                    <div class="fx7hk">
                        <a class="_9VEo1 T-jvg" href="javascript:;" data-type="grid"><span aria-label="게시물" class="glyphsSpritePhoto_grid__outline__24__grey_5 u-__7"></span></a>
                        <a class="_9VEo1" href="javascript:;" data-type="feed"><span aria-label="피드" class="glyphsSpritePhoto_list__outline__24__grey_5 u-__7"></span></a>
                        <a class="_9VEo1" href="javascript:;" data-type=""><span aria-label="태그됨" class="glyphsSpriteTag_up__outline__24__blue_5 u-__7"></span></a>
                    </div>
                </div>
            `;
        }
    
        create();
        return { $el, totalPage, profileData, url }
    })(root.$el);
    
    const timelineProfile = (($parent, profileData) => {
        let $el;
    
        const create = () => {
            render(profileData);
            $el = $parent.firstElementChild;
        }
    
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
    
        const render = (data) => {
            $parent.insertAdjacentHTML('afterbegin', `
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
                </div>
            `);
        }
    
        create();
        return { $el }
    })(timeline.$el, timeline.profileData);
    
    const timelineContent = (($parent) => {
        let $el;
    
        const create = () => {
            render();
            $el = $parent.lastElementChild;
        }
    
        const render = () => {
            $parent.insertAdjacentHTML('beforeend', `
                <div class="_2z6nI">
                    <div style="flex-direction: column;">
                    </div>
                </div>
            `);
        }
    
        create();
        return { $el }
    })(timeline.$el);
    
    // COMMENT 정렬+검색 복합적으로 잘 동작하네요. 잘 하셨어요.
    const grid = await (async ($parent, url) => {
        let $el;
    
        let page = 1;
        let keyword = ''; // 검색 input value 값
        const ITEM_PER_ROW = 3;
        const timelineList = await common.fetchApiData(url, page++);
    
        // 정렬& 검색된 리스트를 담을 변수 추가
        /* TODO const로 바꾸고, 이후 걸리는 로직들도 함께 수정해주면 좋을 것 같습니다
        현재는 list 변수에 undefined 같은 게 들어오는 게 방지가 안 되는 구조입니다 (물론 잘 짜서 그럴일이 절대 없으면 문제 없겠지만) */
    
        const create = () => {
            render();
            $el = $parent.lastElementChild;
            addEvent();
        }

        /* FIXME 이벤트 바인딩을 컴포넌트와 무관하게 하면, 컴포넌트가 컴포넌트가 아니게 됩니다
        grid의 내부, 또는 grid와 유관한 곳에서 이벤트 바인딩 하도록 리팩토링하면 좋을 것 같습니다 */

        // 이벤트 바인딩
        const addEvent = () => {
            const $buttonParent = $el.firstElementChild;
            const $input = $el.querySelector('input');

            $input.addEventListener('keyup', (e) => {
                keyword = e.target.value;
                filter(timelineList);
            });

            // XXX 버튼 부모 엘리먼트에 이벤트 위임, 버튼의 data-type을 파라미터로 전달
            $buttonParent.addEventListener('click', (e) => {
                const type = e.target.dataset.type;
                type && sort(type); // 버튼 외의 것을 클릭하면 type이 없으므로 && 연산자 추가
            });
        }
    
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
        const listList = divide(timelineList, ITEM_PER_ROW);
    
        // TODO 함수형 비즈니스 로직은 메소드 밖으로 분리도 가능할 것 같습니다 (수정완료)
        // 검색 함수
        const filterList = (value) => (list) => {
            const strings = list.name + list.text;
            return strings.match(value);
        };
        const filter = (list) => {
            $el.lastElementChild.firstElementChild.innerHTML = '';

            // 검색 결과 담기
            const filteredList = keyword ? list.myFilter(filterList(keyword)) : [...list];
            if(filteredList.length < 1) {
                filteredList.push(...list);
            }

            gridItem.create(divide(filteredList, ITEM_PER_ROW));
        }
    
        // TODO 적절한 패턴 적용하여, 조금 더 견고하게 리팩토링 했습니다 (수정완료)
        // 정렬 방법에 따른 함수
        const sortType = {
            new: (a, b) => new Date(a.timestamp) > new Date(b.timestamp),
            hot: (a, b) => (Number(a.clipCount) + Number(a.commentCount) * 2) > (Number(b.clipCount) + Number(b.commentCount) * 2),
        };
        const sort = (type) => {
            $el.lastElementChild.firstElementChild.innerHTML = '';
    
            // 정렬된 timelineList 저장
            timelineList.mySort(sortType[type]);
    
            // 검색 값에 따라 렌더링
            filter(timelineList);
        }
    
        const render = () => {
            $parent.insertAdjacentHTML('beforeend', `
                <article class="FyNDV">
                    <div class="Igw0E rBNOH YBx95 ybXk5 _4EzTm soMvl JI_ht bkEs3 DhRcB">
                        <button class="sqdOP L3NKy y3zKF JI_ht" type="button" data-type="new">최신순</button>
                        <button class="sqdOP L3NKy y3zKF JI_ht" type="button" data-type="hot">인기순</button>
                        <h1 class="K3Sf1">
                            <div class="Igw0E rBNOH eGOV_ ybXk5 _4EzTm">
                                <div class="Igw0E IwRSH eGOV_ vwCYk">
                                    <div class="Igw0E IwRSH eGOV_ ybXk5 _4EzTm">
                                        <div class="Igw0E IwRSH eGOV_ vwCYk">
                                            <label class="NcCcD">
                                                <input autocapitalize="none" autocomplete="off" class="j_2Hd iwQA6 RO68f M5V28" placeholder="검색" spellcheck="true" type="search" value="" />
                                                <div class="DWAFP">
                                                    <div class="Igw0E IwRSH eGOV_ _4EzTm">
                                                        <span aria-label="검색" class="glyphsSpriteSearch u-__7"></span>
                                                    </div>
                                                    <span class="rwQu7">검색</span>
                                                </div>
                                                <div class="Igw0E rBNOH YBx95 _4EzTm ItkAi O1flK fm1AK TxciK yiMZG"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </h1>
                    </div>
                    <div>
                        <div style="flex-direction: column; padding-bottom: 0px; padding-top: 0px;">
                        </div>
                    </div>
                </article>
            `);
        }
    
        create();
        return { $el, listList, filter, sort }
    })(timelineContent.$el.firstElementChild, timeline.url);
    
    // listList.forEach 재사용을 위해 gridItem 함수로 묶어줌
    const gridItem = (($parent, listList) => {
        let $el;
    
        const create = (listList) => {
            render(listList);
        }
    
        const render = (listList) => {
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
                
                $parent.insertAdjacentHTML('beforeend', `
                    <div class="Nnq7C weEfm">
                        ${html}
                    </div>
                `);
    
            })
        }
    
        create(listList);
        return { create };
    })(grid.$el.lastElementChild.firstElementChild, grid.listList);
})();