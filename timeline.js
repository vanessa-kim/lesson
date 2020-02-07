/**
 * Copyrightⓒ2020 by Moon Hanju (github.com/it-crafts)
 * All rights reserved. 무단전재 및 재배포 금지.
 * All contents cannot be copied without permission.
 */
(async () => {
const IMG_PATH = 'https://it-crafts.github.io/lesson/img';
const fetchApiData = async function(url, page = 'info') {
    const res = await fetch(url + page);
    /* COMMENT 네트워크 레벨로 깊게 들어가면 끝도없고, 브라우저 엔진마다 동작이 조금씩 다를 수 있습니다
    일단은 fetch() 프로미스가 resolve한 res 객체는 HTTP 리스폰스 그 자체를 바라보고 있는 API라고 보시면 되고 (아직 JS로 데이터는 리드되지 않은 상태)
    res.json() 시점에 데이터를 실제로 긁어오기 시작해서, 로드+컨버팅이 동시에 일어난다고 보시면 됩니다
    통신전문을 다 받은 시점에 로드를 시작하는 게 아니라, 전문이 들어옴과 동시에 리드를 시작합니다 (그래서 res.json()도 비동기)
    이미지나 동영상 스트리밍 같은 경우에 유용하고, 일반 JSON API 통신에서는 큰 신경은 안 써도 됩니다 */
    // [개념 확인 부탁] 
    // 제가 라이브러리 사용하지 않고 순수 바닐라js로 http 통신을 한게 처음인데요.
    // fetch()의 response로 새 promise객체를 반환하고, 그상태로는 데이터를 쓸 수 없어서
    // json()함수를 실행해줘서 데이터를 사용할 수 있도록 변환한거라고 이해가되는데 맞는지 확인 부탁드립니다!(개념이 헷갈리네요..^^;;)
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
// [질문 1] 왜 빈 div를 생성해서 노드를 선택해주고 밀어넣는 방식으로 하는지 궁금합니다.
/* COMMENT 어느 부분을 말씀하시는 지 모르겠습니다. 라인이나 메소드명을 명시해주세요. */
// [질문 2] 그리고 children[0] 이렇게 인덱스 번호로 선택하게 되면 나중에 중간에 예기치 못한
// 태그가 추가되었을 경우 인덱스번호를 바꿔줘야할 것 같은데 인덱스 번호로 선택하신 이유가 궁금합니다!
/* COMMENT 룩업에도 자원이 소요되기 때문에 각 컴포넌트의 배치순서는 하드코딩으로 잡았고, 조금 더 정확히 간다면 별도의 룩업작업을 하는 게 맞습니다
후반주차에는 만들고 룩업을 해서 DOM객체를 잡는 게 아닌, 각 DOM객체를 만들어서 잡고 부모에 밀어넣는 형태로 리팩토링 됩니다 */
let grid = article.children[0].firstElementChild;
let loading = article.children[1].firstElementChild;
let more = article.children[2].firstElementChild;
let p = 1;

// 전체적으로 반복되는 구간이고, await를 포함하는 함수이기 때문에 async 함수로 묶어줌
async function setPage(){
    try{
        /**
        * 버튼 중복 클릭은 에러를 유발하기 때문에, 중복 클릭 방지를 위해 버튼 바로 숨김 처리
        * -> fetch 로직 아래에 버튼을 숨김처리하면, fetch를 진행하는사이 클릭 여러번 가능하므로 사전에 막음
        */
        more.parentElement.style.display = 'none';
        loading.parentElement.style.display = '';
        
        const timelineList = await fetchApiData(url, p++);

        const divide = function(list, size) {
            // [질문 3] Array.prototype.slice()를 통해 얕은 복사를 실행하게 되면
            // console.log()에 찍었을 때 배열안의 객체를 확인할 수가 없더라구요!
            // console.log(JSON.strigify(copy)); 이렇게 찍어서 확인해봤는데..
            // 멘토님은 얕은복사한 객체의 내용 확인하고 싶으시면 어떻게 하시나요??
            /* COMMENT 얕은복사 여부와 관계없이, 애초에 console.log로는 배열 안의 객체는 확인할 수 없습니다 (펼쳐야 볼 수 있습니다)
            참조형 변수나 배열 등의 엘리먼트는, 담고있는 참조형이 원본인지 얕은복사본인지 알지 못합니다. (동일하게 동작합니다)
            참고로, 로그 찍어서 디버깅 하는 것 자체가 잘못된 개발습관입니다. 디버깅은 디버거로 하는 게 바람직하고, 개발속도도 월등히 빠릅니다. */
            const copy = list.slice();
            const cnt = Math.floor(copy.length / size);

            const listList = [];
            for(let i = 0; i < cnt; i++) {
                listList.push(copy.splice(0, size));
            }
            return listList;
        };
        
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
    }catch(e){
        console.error(e);
    }finally{            
        more.parentElement.style.display = '';
        loading.parentElement.style.display = 'none';
    };
};
setPage();

const clickMore = function(e) {
    /**
     * fetch 로직을 실행 할 때 마다 p를 증가 연산하고 있기 때문에 
     * 클릭할때는 p의 번호가 늘 현재페이지 +1 이 된 상태이므로
     * 현재 페이지를 가리 키기 위해 p-1일 때 이벤트 제거
     *  */ 
    if(totalPage == p - 1){
        more.removeEventListener('click', clickMore);
        return;
    };
    
    setPage();
}
more.addEventListener('click', clickMore);

})();