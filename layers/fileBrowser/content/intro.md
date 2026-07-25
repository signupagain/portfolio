---
title: '檔案瀏覽器實作'
---

::u-card{variant=soft}

#header
:h2[檔案瀏覽器]{class='my-2 overflow-hidden'}

:span[一個參考[File Browser](https://codepen.io/jkantner/pen/PwzaqxR){target=blank}網頁設計的實作，將其由 React 轉換為 Vue 且進行優化。]

#default

:h2[功能介紹]{class='mt-0 mb-2 overflow-hidden'}

- 瀏覽、選取、右鍵選取後刪除；顯示資料夾／檔案／已選數量；依副檔名顯示圖示與顏色
- 資料夾：單擊選取、雙擊進入；檔案：單擊選取並顯示詳情（桌面側欄／行動裝置彈窗）
- 多選：Shift 範圍選取、Ctrl 切換、拖曳框選（虛擬滾動網格）；Ctrl+A 全選、Delete 刪除
- 搜尋、排序（名稱／大小／類型／日期）與升／降序；Grid / List 切換；麵包屑與回上一層

:h2[主要技術]{class='mt-0 mb-2 overflow-hidden'}

- [狀態管理(Pinia)](https://github.com/signupagain/projects/tree/master/layers/fileBrowser/app/stores){target=blank}: 管理檔案樹、選取／作用中項目與 UI 狀態；以不可變更新驅動畫面
- [互動拆分](https://github.com/signupagain/projects/tree/master/layers/fileBrowser/app/composables){target=blank}: `useItemInteraction`（選取／開啟／右鍵）、`useItemPointerEvents`（項目 pointer）、`useAreaSelection`（框選幾何）各司其職，降低耦合
- 性能優化: 虛擬滾動、shallowRef、debounce、框選幾何配合虛擬網格、資料夾大小懶累計、Lazy hydration 與 Skeleton 占位
- [本地模組應用](https://github.com/signupagain/projects/tree/master/layers/fileBrowser/modules/data-seed){target=blank}: Nuxt 本地模組自動生成約 2000 筆模擬檔案與副檔名類型定義

::
