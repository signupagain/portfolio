---
title: 影像的詩學實作
---

::u-card{variant=soft}

#header
:h2[影像的詩學]{class='my-2 overflow-hidden'}

:span[一個參考[Pexels](https://www.pexels.com/zh-tw/){target=\_blank}和[Unsplash](https://unsplash.com/){target=\_blank}網頁設計的簡易實作]

#default

:h2[主要技術]{class='mt-0 mb-2 overflow-hidden'}

- [狀態管理(VueQuery)](https://github.com/signupagain/projects/blob/master/layers/gallery/app/composables/usePhotos.ts#L23){target=\_blank}: 定期更新資料，且搭配$fetch在伺服器預先請求資料，優化畫面渲染
- [API契約(oRPC/zod)](https://github.com/signupagain/projects/tree/master/layers/gallery/shared/utils){target=\_blank}: 使用zod對Pexels API進行定義，並基於它完成API契約，強化型別補全、類型安全
- 性能優化: 使用[事件冒泡機制，大幅減少事件註冊](https://github.com/signupagain/projects/blob/master/layers/gallery/app/components/gallery/Engine.vue){target=\_blank}，增進性能。
- [紀錄順序管理](https://github.com/signupagain/projects/blob/master/layers/gallery/app/composables/useSearchRecords.ts){target=\_blank}: 利用LRU的概念做一個簡單的搜尋紀錄管理

::
