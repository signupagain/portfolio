---
title: '檔案瀏覽器實作'
---

::u-card{variant=soft}

#header
:h2[檔案瀏覽器]{class='my-2 overflow-hidden'}

:span[一個參考[File Browser](https://codepen.io/jkantner/pen/PwzaqxR){target=\_blank}網頁設計的實作，將其由 React 轉換為 Vue 且進行優化。]

#default

:h2[功能介紹]{class='mt-0 mb-2 overflow-hidden'}

- 支援檔案和資料夾的瀏覽、選取和右鍵刪除操作
- 可用 Shift / Ctrl 鍵進行多選，提升使用效率

:h2[主要技術]{class='mt-0 mb-2 overflow-hidden'}

- [狀態管理(Pinia)](https://github.com/signupagain/projects/tree/master/layers/fileBrowser/app/stores){target=\_blank}: 使用Pinia管理檔案資料和UI狀態，確保資料的一致性和可維護性
- 性能優化: 使用虛擬滾動技術和響應式技巧，優化大量檔案的渲染性能，提升使用者體驗
- [本地模組應用](https://github.com/signupagain/projects/tree/master/layers/fileBrowser/modules/data-seed){target=\_blank}: 使用 Nuxt 的本地模組功能，實現模擬檔案自動生成，增強功能的靈活性和可擴展性

::
