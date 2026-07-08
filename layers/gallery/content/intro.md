---
title: 影像的詩學實作
---

::u-card{variant=soft}

#header
:h2[影像的詩學]{class='my-2 overflow-hidden'}

:span[一個參考[Pexels](https://www.pexels.com/zh-tw/){target=\_blank}和[Unsplash](https://unsplash.com/){target=\_blank}網頁設計的簡易實作]

#default

:h2[主要技術]{class='mt-0 mb-2 overflow-hidden'}

- [狀態管理(VueQuery)](https://github.com/signupagain/projects/blob/master/layers/gallery/app/composables/usePhotos.ts#L23){target=\_blank}: 定期更新資料，且搭配 onServerPrefetch 在伺服器預先請求資料，優化首屏渲染
- [API契約(oRPC/zod)](https://github.com/signupagain/projects/tree/master/layers/gallery/shared/utils){target=\_blank}: 使用 zod 對 Pexels API 進行定義，並基於它完成 API 契約，強化型別補全、類型安全
- [虛擬滾動](https://github.com/signupagain/projects/blob/master/layers/gallery/app/components/gallery/list.vue#L139){target=\_blank}: 使用 UScrollArea 的 virtualize，搭配響應式多欄瀑布流，只渲染可視範圍內的項目，降低大量照片的 DOM 開銷
- [事件委派](https://github.com/signupagain/projects/blob/master/layers/gallery/app/components/gallery/list.vue#L155){target=\_blank}: 在列表容器上以單一 click 處理導航，大幅減少事件註冊數量
- [漸進式載入](https://github.com/signupagain/projects/blob/master/layers/gallery/app/composables/usePhotos.ts#L33){target=\_blank}: 先揭示部分已快取資料，再分批載入後續項目，避免一次渲染過多節點
- [圖片漸進式載入](https://github.com/signupagain/projects/blob/master/layers/gallery/app/components/gallery/Image.vue#L51){target=\_blank}: 先顯示縮圖模糊占位，大圖就緒後再替換，改善感知速度
- [紀錄順序管理](https://github.com/signupagain/projects/blob/master/layers/gallery/app/composables/useSearchRecords.ts){target=\_blank}: 利用 LRU 的概念做一個簡單的搜尋紀錄管理

::
