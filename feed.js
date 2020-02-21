/**
 * Copyrightⓒ2020 by Moon Hanju (github.com/it-crafts)
 * All rights reserved. 무단전재 및 재배포 금지.
 * All contents cannot be copied without permission.
 */
// COMMENT 왜 모듈형태에서 생성자로 변환한 것인지? 의도+장점이 궁금합니다.
//         생성자로 만드는건 재사용성 때문이라고 알고 있었는데, 이 경우 모듈형태보다 나은점이나 이렇게 했을때의 장점이 잘 이해 되지 않습니다.
const common = (() => {
    const IMG_PATH = 'https://it-crafts.github.io/lesson/img';
    const fetchApiData = async (url, page = 'info') => {
        const res = await fetch(url + page);
        const data = await res.json();
        return data.data;
    }

    return { IMG_PATH, fetchApiData }
})();

const Root = (selector) => {
    let $el;
    let $page;

    const create = () => {
        $el = document.querySelector(selector);
        $page = Timeline($el);
        $page.create();
    }

    const destroy = () => {
        $page && $page.destroy();
    }

    return { $el, create, destroy }
};

const Timeline = ($parent) => {
    const URL = 'https://my-json-server.typicode.com/it-crafts/lesson/timeline/';
    let $el;
    let $profile;
    let $content;

    const create = async () => {
        render();
        $el = $parent.firstElementChild;
        const [ totalPage, profileData ] = await fetch();
        $profile = TimelineProfile($el, profileData);
        $profile.create();
        $content = TimelineContent($el, URL, profileData, totalPage);
        $content.create();
    }

    const destroy = () => {
        $profile && $profile.destroy();
        $content && $content.destroy();
        $parent.removeChild($el);
    }

    const fetch = async () => {
        const infoData = await common.fetchApiData(URL);
        const totalPage = infoData.totalPage * 1;
        const profileData = infoData.profile;
        return [ totalPage, profileData ];
    }

    const render = () => {
        $parent.innerHTML = `
            <div class="v9tJq">
                <div class="fx7hk">
                    <a class="_9VEo1 T-jvg" href="javascript:;" data-type="grid"><span aria-label="게시물" class="glyphsSpritePhoto_grid__outline__24__grey_5 u-__7"></span></a>
                    <a class="_9VEo1" href="javascript:;" data-type="feed"><span aria-label="피드" class="glyphsSpritePhoto_list__outline__24__blue_5 u-__7"></span></a>
                    <a class="_9VEo1" href="javascript:;" data-type=""><span aria-label="태그됨" class="glyphsSpriteTag_up__outline__24__grey_5 u-__7"></span></a>
                </div>
            </div>
        `;
    }

    return { $el, create, destroy }
};

const TimelineProfile = ($parent, profileData = {}) => {
    let $el;

    const create = () => {
        render(profileData);
        $el = $parent.firstElementChild;
    }

    const destroy = () => {
        $parent.removeChild($el);
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

    return { $el, create, destroy }
};

const TimelineContent = ($parent, url = '', profileData = {}, totalPage = 1) => {
    let $el;
    let $feed;

    let page = 0;
    const dataList = [];

    const create = async () => {
        render();
        $el = $parent.lastElementChild;
        const pageDataList = await fetch();
        $feed = Feed($el.firstElementChild, profileData, pageDataList);
        $feed.create();
        initInfiniteScroll();
    }

    const destroy = () => {
        $feed && $feed.destroy();
        $parent.removeChild($el);
    }

    const fetch = async () => {
        const pageDataList = await common.fetchApiData(url, ++page);
        dataList.push(pageDataList);
        return pageDataList;
    }

    const initInfiniteScroll = () => {
        const $loading = $el.lastElementChild;
        const io = new IntersectionObserver((entryList, observer) => {
            entryList.forEach(async entry => {
                if(!entry.isIntersecting) { return; }
                await ajaxMore();
                
                if(page >= totalPage) {
                    observer.unobserve(entry.target);
                    $loading.style.display = 'none';
                }
            });

        }, {rootMargin: innerHeight + 'px' });
        io.observe($loading);
    }

    const ajaxMore = async () => {
        const pageDataList = await fetch();
        $feed && $feed.addFeedItems(profileData, pageDataList);
    }

    const render = () => {
        $parent.insertAdjacentHTML('beforeend', `
            <div class="_2z6nI">
                <div style="flex-direction: column;">
                </div>
                <div class="_4emnV">
                    <div class="Igw0E IwRSH YBx95 _4EzTm _9qQ0O ZUqME" style="height: 32px; width: 32px;"><svg aria-label="읽어들이는 중..." class="By4nA" viewBox="0 0 100 100"><rect fill="#555555" height="6" opacity="0" rx="3" ry="3" transform="rotate(-90 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.08333333333333333" rx="3" ry="3" transform="rotate(-60 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.16666666666666666" rx="3" ry="3" transform="rotate(-30 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.25" rx="3" ry="3" transform="rotate(0 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.3333333333333333" rx="3" ry="3" transform="rotate(30 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.4166666666666667" rx="3" ry="3" transform="rotate(60 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.5" rx="3" ry="3" transform="rotate(90 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.5833333333333334" rx="3" ry="3" transform="rotate(120 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.6666666666666666" rx="3" ry="3" transform="rotate(150 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.75" rx="3" ry="3" transform="rotate(180 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.8333333333333334" rx="3" ry="3" transform="rotate(210 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.9166666666666666" rx="3" ry="3" transform="rotate(240 50 50)" width="25" x="72" y="47"></rect></svg></div>
                </div>
            </div>
        `);
    }

    return { $el, create, destroy }
};

// TODO 뷰 역할인 Feed 컴포넌트에 이미지 레이지로드 기능 추가 - initInfiniteScroll 히스토리 참고
const Feed = ($parent, profileData = {}, pageDataList = []) => {
    const $elList = [];

    const create = () => {
        addFeedItems(profileData, pageDataList);
    }

    const destroy = () => {
        $elList.forEach($el => $parent.removeChild($el));
    }

    const addFeedItems = (profileData = {}, pageDataList = []) => {
        const firstIndex = $parent.children.length;
        render(profileData, pageDataList);
        // [].slice.call(args, 0) 이부분이 잘 이해가 안갑니다.
        //     https://stackoverflow.com/questions/2125714/explanation-of-slice-call-in-javascript
        //     스택오버플로우에서 설명을 찾았는데 이해가 될듯 말듯 잘 되지 않네요. ES6의 Array.from()과 같은 역할을 한다고 이해하면 되는 걸까요?
        // COMMENT 얕은복사가 목적인 것은 맞습니다, 다만 여기선 전체가 아닌 일부만 잘라서 복사하는 거라 완전히 같지는 않습니다 (firstIndex가 항상 0이 아닙니다)
        const $elListAdded = [].slice.call($parent.children, firstIndex);
        $elList.push(...$elListAdded);
        /* BUG 매 번 전체 $elList 대상의 이미지 엘리먼트를 긁고 있기 때문에,
        2페이지, 3페이지, ... addFeedItems 호출 시에 이전페이지 이미지들이 다시 옵저버에 등록됩니다
        겸사겸사 delete lazyLoadImgs.dataset.src; 추가했으니, 내렸다가 다시 올려보세요
        해법은 추가한 엘리먼트 대상으로 룩업을 하는 방법이 있을 것 같고 (push 하기 전에 미리 뽑아두고?)
        아니면 data-src 속성을 기준으로 뽑을 수도 있을 것 같습니다 */
        lazyLoad($elListAdded);
    }

    /**
     * lazyLoad: feed의 img src와 data-src 속성을 교차해 화질을 바꿔주는 함수
     * @param elList addFeedItems에서 추가한 노드 리스트
     * */
    // TimelineContent 생성자의 ajaxMore를 실행하고 난 뒤에, 11번째와 12번째의 노드의 img src와 data-src가 바뀌어버리는데
    //     왜 그런지 모르겠어요. 23번째와 24번째 노드도 마찬가지입니다! 
    //     fetch할 때 문제인지, 아님 lazyLoad 내부에 imgAdress를 초기화 해주지 않아서 그런건지 잘 모르겠습니다..ㅠ 못잡겠네요..!
    /* COMMENT $elListAdded 추가와 observer.unobserve, delete img.dataset.src를 통해 자연히 해결 되었습니다 */
    const lazyLoad = (elList = []) => {
        elList.forEach( item => {
            /* COMMENT 현재 로직에 가장 심플하고 정확한 선택자입니다 (잘 하셨어요)
            img[data-src]로 하면 조금 더 견고해질 것 같아요! */
            const img = item.querySelector('img[data-src]');
            // const imgAdress = [];
            // imgAdress[0] = img.dataset.src;
            // imgAdress[1] = img.src;

            /* FIXME 현재는 이미지수 만큼 어마어마하게 io객체가 생성되고 있습니다
            로직상 Feed는 List를 담는 컴포넌트이기 때문에, 사실 io는 하나만 있으면 충분합니다
            io 생성은 컴포넌트 레벨로 올리고, observe하는 로직만 반복되면 성능이 개선될 수 있을 것 같습니다 */
            const io = new IntersectionObserver((entryList, observer) => {
                    entryList.forEach( entry => {
                        if(!entry.isIntersecting) {
                            /* TODO 혹시 하드웨어 가속 성능개선을 염두에 둔 설계인가요?
                            일단 렌더링이 된 이상, 저화질이미지로 롤백해서 얻는 이점이 크진 않을 것 같습니다 */
                            //대상 안보일 때: 흐린 그림 교체
                            // img.dataset.src = imgAdress[0];
                            // img.src = imgAdress[1];
                            return;
                        }

                        //대상 보일 때: 선명한 그림 교체
                        // img.dataset.src = imgAdress[1];
                        img.src = img.dataset.src;
                        delete img.dataset.src;

                        // TODO 마찬가지로, 교체 이후엔 가시성체크를 해제해주면 좋을 것 같습니다
                        observer.unobserve(entry.target);
                    });
                });
            io.observe(img);
        });
    }

    const render = (profileData, pageDataList) => {
        const html = pageDataList.reduce((html, data) => {
            html += `
                <article id="feed" class="M9sTE h0YNM SgTZ1">
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
                    <div class="_97aPb">
                        <div role="button" tabindex="0" class="ZyFrc">
                            <div class="eLAPa kPFhm">
                                <div class="KL4Bh" style="padding-bottom: 100%;"><img class="FFVAD" alt="${data.name}" src="${common.IMG_PATH}/lazy${data.img}" data-src="${common.IMG_PATH}${data.img}" style="object-fit: cover;"></div>
                                <div class="_9AhH0"></div>
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
            `;
            return html;
        }, '');
        $parent.insertAdjacentHTML('beforeend', html);
    }

    return { $elList, create, destroy, addFeedItems }
};

const root = Root('main');
root.create();
// root.destroy();
// root.create();