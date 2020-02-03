/**
 * Copyrightⓒ2020 by Moon Hanju (github.com/it-crafts)
 * All rights reserved. 무단전재 및 재배포 금지.
 * All contents cannot be copied without permission.
 */
(async () => {
const IMG_PATH = 'https://it-crafts.github.io/lesson/img';
const fetchApiData = async function(url, page = 'info') {
    const res = await fetch(url + page);
    const data = await res.json();
    return data.data;
}

const main = document.querySelector('main');

main.innerHTML = `
    <div class="v9tJq">
    </div>
`;
let page = main.firstElementChild;
const url = 'https://my-json-server.typicode.com/it-crafts/lesson/timeline/';

const infoData = await fetchApiData(url);
const totalPage = infoData.totalPage * 1;
const profileData = infoData.profile;
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
page.insertAdjacentHTML('afterbegin', `
    <header class="HVbuG">
        <div class="XjzKX">
            <div class="RR-M- h5uC0" role="button" tabindex="0">
                <canvas class="CfWVH" height="91" width="91" style="position: absolute; top: -7px; left: -7px; width: 91px; height: 91px;"></canvas>
                <span class="_2dbep" role="link" tabindex="0" style="width: 77px; height: 77px;"><img alt="${profileData.name}님의 프로필 사진" class="_6q-tv" src="${IMG_PATH}${profileData.img}"></span>
            </div>
        </div>
        <section class="zwlfE">
            <div class="nZSzR">
                <h1 class="_7UhW9 fKFbl yUEEX KV-D4 fDxYl">${profileData.name}</h1>
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
        <h1 class="rhpdm">${profileData.title}</h1><br><span>${profileData.text}</span>
    </div>
    <ul class="_3dEHb">
        <li class="LH36I"><span class="_81NM2">게시물 <span class="g47SY lOXF2">${profileData.post}</span></span></li>
        <li class="LH36I"><a class="_81NM2" href="javascript:;">팔로워 <span class="g47SY lOXF2" title="${profileData.follower}">${scaleDown(profileData.follower)}</span></a></li>
        <li class="LH36I"><a class="_81NM2" href="javascript:;">팔로우 <span class="g47SY lOXF2">${profileData.follow}</span></a></li>
    </ul>
    <div class="fx7hk">
        <a class="_9VEo1 T-jvg" href="javascript:;" data-type="grid"><span aria-label="게시물" class="glyphsSpritePhoto_grid__outline__24__blue_5 u-__7"></span></a>
        <a class="_9VEo1" href="javascript:;" data-type="feed"><span aria-label="피드" class="glyphsSpritePhoto_list__outline__24__grey_5 u-__7"></span></a>
        <a class="_9VEo1" href="javascript:;" data-type=""><span aria-label="태그됨" class="glyphsSpriteTag_up__outline__24__grey_5 u-__7"></span></a>
    </div>
`);
page.insertAdjacentHTML('beforeend', `
    <div class="_2z6nI">
        <div style="flex-direction: column;">
            <article class="FyNDV">
                <div>
                    <div style="flex-direction: column; padding-bottom: 0px; padding-top: 0px;">
                    </div>
                </div>
                <div style="display: none;" class="_4emnV">
                    <div class="Igw0E IwRSH YBx95 _4EzTm _9qQ0O ZUqME" style="height: 32px; width: 32px;"><svg aria-label="읽어들이는 중..." class="By4nA" viewBox="0 0 100 100"><rect fill="#555555" height="6" opacity="0" rx="3" ry="3" transform="rotate(-90 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.08333333333333333" rx="3" ry="3" transform="rotate(-60 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.16666666666666666" rx="3" ry="3" transform="rotate(-30 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.25" rx="3" ry="3" transform="rotate(0 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.3333333333333333" rx="3" ry="3" transform="rotate(30 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.4166666666666667" rx="3" ry="3" transform="rotate(60 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.5" rx="3" ry="3" transform="rotate(90 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.5833333333333334" rx="3" ry="3" transform="rotate(120 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.6666666666666666" rx="3" ry="3" transform="rotate(150 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.75" rx="3" ry="3" transform="rotate(180 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.8333333333333334" rx="3" ry="3" transform="rotate(210 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.9166666666666666" rx="3" ry="3" transform="rotate(240 50 50)" width="25" x="72" y="47"></rect></svg></div>
                </div>
                <div class="Igw0E rBNOH YBx95 ybXk5 _4EzTm soMvl" style="margin-right: 8px; display: none;">
                    <button class="sqdOP L3NKy y3zKF _4pI4F" type="button" style="margin: 16px 8px">더보기</button>
                    <button class="sqdOP L3NKy y3zKF _4pI4F" type="button" style="margin: 16px 8px">전체보기</button>
                </div>
            </article>
        </div>
    </div>
`);
// article태그 DOM트리 탐색이 반복되므로, article 변수에 담아 객체 캐싱
const article = page.querySelector('article');
let grid = article.children[0].firstElementChild;
let loading = article.children[1].firstElementChild;
let more = article.children[2].firstElementChild;
let p = 1;
const divide = function(list, size) {
    const copy = list.slice();
    const cnt = Math.floor(copy.length / size);

    const listList = [];
    for(let i = 0; i < cnt; i++) {
        listList.push(copy.splice(0, size));
    }
    return listList;
};

/* XXX 기존에 선생님께서 작성하신 조회 API 요청/렌더링을 하나의 함수로 묶어서 최초 렌더링할 때, 더보기 버튼 클릭 할 때마다 호출하는 방식으로 바꾸었습니다. 이렇게 해도 괜찮을까요...
await은 async 함수 바로 안에서만 쓰여야 해서 async 함수를 썼는데, 이렇게 async 함수가 중첩되어도 되는 건지도 궁금합니다. */
const renderPage = async () => {
    // 더보기 버튼 숨김
    more.style.display = 'none';

    // 1페이지 호출 후 p가 2로 늘어남 (1만큼) - 증가연산은 값 평가 이후 수행됨
    const timelineList = await fetchApiData(url, p++);

    const listList = divide(timelineList, 3);

    listList.forEach(list => {
        grid.insertAdjacentHTML('beforeend', `
            <div class="Nnq7C weEfm">
            </div>
        `);
        let row = grid.lastElementChild;
    
        list.forEach(data => {
            row.insertAdjacentHTML('beforeend', `
                <div class="v1Nh3 kIKUG _bz0w">
                    <a href="javascript:;">
                        <div class="eLAPa">
                            <div class="KL4Bh"><img class="FFVAD" decoding="auto" src="${IMG_PATH}${data.img}" style="object-fit: cover;"></div>
                        </div>
                    </a>
                </div>
            `);
        });
    });
    
    // 로딩바 숨김
    loading.parentElement.style.display = 'none';

    if(p <= totalPage) { 
        // 다음 페이지가 있을 경우, 더보기 버튼 표시
        more.style.display = '';
    } else { 
        // 다음 페이지가 없을 경우, clickMore 이벤트 리스너 제거
        more.removeEventListener('click', clickMore);
    }
};

/* XXX 강의노트에서 '1페이지 렌더링 후 totalPage 취득 -> (고도화) 1페이지 렌더링과 totalPage 취득 페럴럴하게 프로세싱' 적혀있는 이 부분이 잘 이해되지 않습니다. 
지금 구조는 처음 infoData를 가지고 올 때 totalPage를 취득한 후 1페이지를 렌더링하였는데 이 순서를 바꾸어야 하는 건가요? */

// 1페이지 렌더링
renderPage();

// 필요한 시점에 로딩바(의 부모 래퍼div), 더보기버튼(의 부모 래퍼div) display: none; 제거
more.parentElement.style.display = '';
// more.parentElement.style.display = 'none';
// loading.parentElement.style.display = '';
// loading.parentElement.style.display = 'none';

console.log('>> p: ', p);
console.log('>> totalPage: ', totalPage);
const clickMore = function(e) {
    // 로딩바 표시
    loading.parentElement.style.display = 'block';
    // 각 페이지 호출 및 렌더링
    renderPage();
}
// 필요한 시점에 추가한 이벤트리스너 제거
more.addEventListener('click', clickMore);
// more.removeEventListener('click', clickMore);
})();
