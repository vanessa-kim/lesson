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
    let $el,
        $popularSortBtn,
        $latestSortBtn,
        $searchInp;

    let page = 1;
    const ITEM_PER_ROW = 3;
    const timelineList = await common.fetchApiData(url, page++);

    const create = () => {
        render();
        $el = $parent.lastElementChild;

        // dom 엘리먼트 변수명 선언
        /* TODO 동일한 성격의 엘리먼트에 유사한 로직이 리스너로 붙을 경우,
        로직을 공통화하고, 부모 엘리먼트에 이벤트를 위임 해주는 것이 성능/구조 측면에서 모두 좋습니다 */
        $latestSortBtn = $parent.querySelector('article').firstElementChild.children[0];
        $popularSortBtn = $parent.querySelector('article').firstElementChild.children[1];
        $searchInp = $parent.querySelector('article').firstElementChild.children[2].querySelector('input');

        /* BUG 이벤트리스너는 화살표함수가 아닌, 일반함수로 사용하셔야 합니다
        이 글 내용 참조 해보세요 https://mengkkoit.tistory.com/23 */
        /* FIXME 컴포넌트 프로그래밍에서는, 모든 '추가' 동작은 '제거' 가능해야 합니다
        리스너를 별도의 함수로 분리하고 (또는 리스너 객체를 만들어서, 그 하위 메소드로 몰아도 좋구요)
        해당 리스너를 add/reomve 할 수 있도록 리팩토링 해주세요 */
        /* FIXME 상태값을 DOM에 넣었다 뺐다 하는 건 바람직하지 않습니다 (넣더라도 data속성으로..)
        가능하면 상태 자체가 없는 게 좋은데, 일단 클로저 기반으로 리팩토링까지만 했습니다 */
        // sort 클릭이벤트 매핑
        // 클래스명을 toggle로 주고, 클래스명 여부에 따라 함수에 적합한 파라미터 전달
        $latestSortBtn.addEventListener('click', (() => {
            let isLatest = true;

            return (e) => {
                if(isLatest) {
                    sort('oldest');
                } else {
                    sort('latest');
                }
                isLatest = !isLatest;
            }
        })());

        // BUG 이벤트리스너 교체
        // FIXME 리스너 제거 가능하도록 분리
        $popularSortBtn.addEventListener('click', (() => {
            let isPopular = false;

            return (e) => {
                if(isPopular) {
                    sort('unpopular');
                } else {
                    sort('popular');
                }
                isPopular = !isPopular;
            }
        })());

        // BUG 이벤트리스너 교체
        // FIXME 리스너 제거 가능하도록 분리
        // keyup 이벤트 발생시 filter 함수 실행. 인풋의 값을 파라미터로 전달
        $searchInp.addEventListener('keyup', (e) => {
            filter(e.currentTarget.value);
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
        if(!lastlist) return;
        for(let i = lastlist.length; i < size; i++) {
            lastlist[i] = {};
        }
        
        return listList;
    };
    // 201라인의 listList 변수를 filter나 sort에서 고친 값으로 엎어치기 위해 const대신 let으로 변경
    let listList = divide(timelineList, ITEM_PER_ROW);

    // filterList: filter에서 걸러진 값을 담을 변수
    /* TODO 고려해야 할 리스트는, 원본리스트/템프리스트 두 개면 충분할 것 같습니다 */
    let resultList = timelineList;

    /* TODO 필터결과 판단하는 기존로직이 복잡해서, 간단하게 로직 리팩토링 했습니다
    특정한 데이터를 캐싱(여기서는 filterList를 캐싱)하는 로직은
    가공 전의 데이터를 기준으로 해주세요(divide함수 들어간 후에서, 전으로 변경)*/
    const filter = (keyword) => {
        $el.lastElementChild.firstElementChild.innerHTML = '';
        
        resultList = timelineList.filter(i => (i.text + i.name).includes(keyword));
        renderRows(divide(resultList, ITEM_PER_ROW));

        return { resultList };
    }

    /* TODO 정렬기준 판단하는 기존로직이 복잡해서, 적절한 패턴 활용해서 리팩토링 했습니다
    기존에 짜신 게 잘못된 것이 아니니 절대 실망하시면 안 돼요! 기존로직도 잘 짜셨습니다
    더 견고하고 읽기 쉽고 확장하기 쉽게 바꿀 수도 있다는 점만 참고 해보세요~ */
    const comparator = (() => {
        const computePopularity = data => Number.parseInt(data.clipCount) + Number.parseInt(data.commentCount) * 2;
        const parseTimeValue = data => new Date(data.timestamp).getTime();

        return {
            popular: (a, b) => computePopularity(b) - computePopularity(a),
            unpopular: (a, b) => computePopularity(a) - computePopularity(b),
            latest: (a, b) => parseTimeValue(b) - parseTimeValue(a),
            oldest: (a, b) => parseTimeValue(a) - parseTimeValue(b),
        }
    })();
    const sort = (sortKind) => {
        /* FIXME 소트로직에서 $searchInp.value에 직접 접근하는 것은 바람직하지 않습니다
        정렬여부에 따라 바라보고 있는 모수 리스트 자체를 바꾸도록 리팩토링 했습니다 */
        $el.lastElementChild.firstElementChild.innerHTML = '';

        timelineList.sort(comparator[sortKind]);
        resultList.sort(comparator[sortKind]);
        renderRows(divide(resultList, ITEM_PER_ROW));

        return { resultList };
    }
    
    /* FIXME 함수가 함수 외부의 뮤터블한 값에 접근하는 것은 지양 해주세요 (페이지 같은 경우를 제외하고)
    아마 개발하실 때도 오래 걸리셨을 거고, 추후 유지보수 시에도 오래 걸립니다
    영향범위를 한정하여 견고하게 동작할 수 있도록, 되도록 주요한 데이터는 파라미터로 직접 받아주세요
    (refresh 함수 자체를 없애서, 최종코드 기준으로 주석처리 했습니다) */
    // function refresh(resultList){
    //     renderRows(resultList);
    // }

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
    
    return { $el, listList }
})(timelineContent.$el.firstElementChild, timeline.url);

// TODO setRow는 비동기 함수가 아닌 것 같아서, async 뺐습니다 (수정완료)
/* FIXME setRow의 디폴트로 grid.listList가 오기 보다는
호출시에 넘겨주는 게 재사용 측면에서 더 바람직할 것 같습니다
디폴트는 빈배열로 교체 했습니다 (수정완료) */
// list 그려주는 setRow 함수
function renderRows(listList = []) {
    listList.forEach(list => {
        const gridItem = (($parent, list) => {
            let $el;
    
            const create = () => {
                render(list);
                $el = $parent.lastElementChild;
            }
    
            const render = (list) => {
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
            }
        
            create();
            return { $el }
        })(grid.$el.lastElementChild.firstElementChild, list);
    });
};
renderRows(grid.listList);
    

})();