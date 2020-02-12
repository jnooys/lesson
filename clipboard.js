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
                const pivot = Math.floor((i+j) / 2);
    
                while (i < j){
                    while (func(this[i], this[pivot])) i++;
                    while (func(this[pivot], this[j])) j--;
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
    
    const grid = await (async ($parent, url) => {
        let $el;
    
        let page = 1;
        const ITEM_PER_ROW = 3;
        const timelineList = await common.fetchApiData(url, page++);
    
        // 정렬& 검색된 리스트를 담을 변수 추가
        let sortedList = [...timelineList];
        let filteredList = [...timelineList];
    
        const create = () => {
            render();
            $el = $parent.lastElementChild;
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
    
        const filter = (value) => {
            // 검색 함수
            const filterValue = ((value) => {
                return (list) => {
                    const strings = list.name + list.text;
                    return strings.match(value);
                }
            })(value);
    
            // TODO 검색창 input에 key이벤트 발생시 검색로직 수행
            $el.lastElementChild.firstElementChild.innerHTML = '';
            // 검색 결과 담기
            filteredList = sortedList.myFilter(filterValue);
    
            // 검색 결과가 없을 경우 or 검색 인풋이 비었을 경우에는 검색 전 정렬된 상태를 담기
            if(filteredList.length < 1 ) {
                filteredList = [...sortedList];
            }
    
            return divide(filteredList, ITEM_PER_ROW);
            //    .forEach(list => {/* TODO */});
        }
    
        const sort = (type) => {
            // 정렬 방법에 따른 함수 return 
            const sortType = ((type) => {
                switch (type) {
                    case 'new' : 
                        return (a, b) => new Date(a.timestamp) > new Date(b.timestamp);
                    case 'hot' :
                        return (a, b) => (Number(a.clipCount) + Number(a.commentCount) * 2) > (Number(b.clipCount) + Number(b.commentCount) * 2);
                    default : 
                        return;
                }
            })(type);
    
            // TODO 최신순/인기순 클릭시 해당 정렬로직 수행
            $el.lastElementChild.firstElementChild.innerHTML = '';
    
            // 정렬된 timelineList 저장
            sortedList.mySort(sortType);
    
            // 검색된 상태에서 정렬된 리스트 return
            return divide(filteredList.mySort(sortType), ITEM_PER_ROW);
            //    .forEach(list => {/* TODO */});
        }
    
        const render = () => {
            $parent.insertAdjacentHTML('beforeend', `
                <article class="FyNDV">
                    <div class="Igw0E rBNOH YBx95 ybXk5 _4EzTm soMvl JI_ht bkEs3 DhRcB">
                        <button class="sqdOP L3NKy y3zKF JI_ht" type="button">최신순</button>
                        <button class="sqdOP L3NKy y3zKF JI_ht" type="button">인기순</button>
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
    
    // 이벤트 함수
    const event = (() => {
    
        // 최신순 버튼
        const $btnNew = grid.$el.firstElementChild.getElementsByTagName('button')[0];
        // 인기순 버튼
        const $btnHot = grid.$el.firstElementChild.getElementsByTagName('button')[1];
        // 검색 인풋
        const $iptSearch = grid.$el.firstElementChild.getElementsByTagName('input')[0];
    
        // 정렬 버튼 공통 함수
        const sortItem = (type) => {
            listList = grid.sort(type);
            gridItem.create(listList);
        }
    
        // 검색 인풋 함수
        const searchItem = (value) => {
            listList = grid.filter(value);
            gridItem.create(listList);
        }
    
        // 인기순 버튼 이벤트 핸들러
        const clickBtnHot = () => {
            sortItem('hot');
        }
    
        // 최신순 버튼 이벤트 핸들러
        const clickBtnNew = () => {
            sortItem('new');
        }
    
        // 검색 인풋 이벤트 핸들러
        const changeSearch = (e) => {
            let value = e.target.value;
            searchItem(value);
        }
    
        // 이벤트 리스너 추가
        const addEvent = () => {
            $btnNew.addEventListener('click', clickBtnNew);
            $btnHot.addEventListener('click', clickBtnHot);
            $iptSearch.addEventListener('keyup', changeSearch);
        }
    
        // 이벤트 리스너 제거
        const removeEvent = () => {
            $btnNew.removeEventListener('click', clickBtnNew);
            $btnHot.removeEventListener('click', clickBtnHot);
            $iptSearch.removeEventListener('keyup', changeSearch);
        }
    
        
        addEvent(); 
        return { addEvent, removeEvent };
    })();
    })();