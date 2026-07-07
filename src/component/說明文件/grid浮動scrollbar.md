# 浮動水平 ScrollBar 實作說明

## 一、問題背景

`DataGridApi` 欄位很多時，Grid 會產生水平 overflow。
預設的水平捲軸會被壓在頁面**最底部**，使用者要捲到底才能拖動它，非常不便。

**目標**：讓水平捲軸**固定浮在視窗底部**，不管頁面捲到哪裡，捲軸永遠可見且可用。

---

## 二、核心概念

> 製作一個「假的捲軸 div」，固定在視窗底部，讓它的 scrollLeft 和 Grid 容器保持雙向同步。

```
視窗（viewport）
┌───────────────────────────────────────┐
│  DataGrid（有 overflow-x: auto）      │
│  [col1][col2][col3]...[col15][col16]  │ ← 使用者可以直接拖這個 grid 捲動
│                                        │
│  ...其他頁面內容...                   │
│                                        │
├───────────────────────────────────────┤  ← 視窗底部
│  [═════════ 浮動捲軸 ══════════════]  │  ← 固定在這裡，永遠看得到
└───────────────────────────────────────┘
```

---

## 三、調整了哪些程式碼

### Step 1：新增 Props — `useXBar`

```tsx
// DataGridProps 型別定義
useXBar?: boolean; // 是否使用橫向捲動軸（預設 false）
```

開關設計：只有傳 `useXBar={true}` 時，整個浮動捲軸功能才啟動，不影響現有元件。

---

### Step 2：新增三個 Ref + 兩個 State

```tsx
// Refs — 直接操控 DOM，不觸發 re-render（效能考量）
const scrollContainerRef = useRef<HTMLDivElement>(null);   // 指向 Grid 外層容器
const floatingBarRef     = useRef<HTMLDivElement>(null);   // 指向浮動捲軸 div
const floatingBarInnerRef = useRef<HTMLDivElement>(null);  // 浮動捲軸內的撐寬 div
const isSyncingRef       = useRef(false);                  // 防無限迴圈 flag

// State — 控制捲軸的顯示與位置（變化時觸發 re-render）
const [showFloatingBar, setShowFloatingBar] = useState(false);
const [floatingBarRect, setFloatingBarRect] = useState({ left: 0, width: 0 });
```

**為什麼用 Ref 不用 State 做同步？**
因為 scroll 事件每秒觸發幾十次，用 State 會造成大量 re-render，用 Ref 直接操作 DOM 效能好很多。

---

### Step 3：Grid 容器掛上 `scrollContainerRef`

```tsx
// 原本
<div className={` ${cssUserbar} ...`}>

// 改為
<div ref={scrollContainerRef} className={` ${cssUserbar} ...`}>
```

這樣 `scrollContainerRef.current` 就能拿到 Grid 的 DOM 節點，讀取 `scrollLeft`、`scrollWidth` 等屬性。

---

### Step 4：核心 useEffect — 雙向同步邏輯

```tsx
useEffect(() => {
    if (!useXBar) return;  // ① 沒開啟就直接離開

    const container      = scrollContainerRef.current;
    const floatingBar    = floatingBarRef.current;
    const floatingBarInner = floatingBarInnerRef.current;
    if (!container || !floatingBar || !floatingBarInner) return;  // ② 安全檢查

    // ③ 讓浮動捲軸的「內容寬度」等於 Grid 的總寬度
    //    這樣浮動捲軸才有東西可以捲！
    const updateInnerWidth = () => {
        floatingBarInner.style.width = `${container.scrollWidth}px`;
        // 只有 Grid 實際 overflow 時才顯示浮動捲軸
        setShowFloatingBar(container.scrollWidth > container.clientWidth);
    };

    // ④ 讓浮動捲軸的位置（left/width）對齊 Grid 容器的位置
    const updatePosition = () => {
        const rect = container.getBoundingClientRect();
        setFloatingBarRect({ left: rect.left, width: rect.width });
    };

    updateInnerWidth();
    updatePosition();

    // ⑤ Grid 捲動 → 同步到浮動捲軸
    const handleContainerScroll = () => {
        if (isSyncingRef.current) return;  // 防止互相觸發死迴圈
        isSyncingRef.current = true;
        floatingBar.scrollLeft = container.scrollLeft;
        requestAnimationFrame(() => { isSyncingRef.current = false; });
    };

    // ⑥ 浮動捲軸捲動 → 同步到 Grid
    const handleFloatingScroll = () => {
        if (isSyncingRef.current) return;
        isSyncingRef.current = true;
        container.scrollLeft = floatingBar.scrollLeft;
        requestAnimationFrame(() => { isSyncingRef.current = false; });
    };

    container.addEventListener('scroll', handleContainerScroll);
    floatingBar.addEventListener('scroll', handleFloatingScroll);
    window.addEventListener('resize', updatePosition);   // 視窗縮放時重新定位
    window.addEventListener('scroll', updatePosition);   // 頁面捲動時重新定位

    // ⑦ 監聽 Grid 容器尺寸變化（資料載入完，寬度可能改變）
    const resizeObserver = new ResizeObserver(() => {
        updateInnerWidth();
        updatePosition();
    });
    resizeObserver.observe(container);

    return () => {  // ⑧ 元件卸載時清理，避免記憶體洩漏
        container.removeEventListener('scroll', handleContainerScroll);
        floatingBar.removeEventListener('scroll', handleFloatingScroll);
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition);
        resizeObserver.disconnect();
    };
}, [useXBar, internalData]); // internalData 變化 = 資料載入完成，scrollWidth 可能改變
```

---

### Step 5：JSX 渲染浮動捲軸 div

```tsx
{/* ⚠️ 重要：不能用 showFloatingBar && <div> 做條件渲染！ */}
{/* 因為條件渲染會讓 floatingBarRef.current 初始為 null，  */}
{/* useEffect 就拿不到 ref → 無法掛事件 → showFloatingBar 永遠 false → 循環死結 */}
{/* 解法：永遠渲染這個 div，用 height: 0 來「隱藏」它 */}

{useXBar && (
    <div
        ref={floatingBarRef}
        style={{
            position: 'fixed',          // 固定在視窗，不隨頁面捲動
            bottom: 0,                  // 貼在最底部
            left: floatingBarRect.left, // 對齊 Grid 左邊
            width: floatingBarRect.width, // 同 Grid 寬度
            height: showFloatingBar ? '14px' : '0px',       // 用高度控制顯示/隱藏
            overflowX: showFloatingBar ? 'auto' : 'hidden', // 有 overflow 才可捲
            overflowY: 'hidden',
            zIndex: 1000,
            background: 'rgba(226,232,240,0.97)',
            borderTop: showFloatingBar ? '2px solid #94a3b8' : 'none',
            boxShadow: showFloatingBar ? '0 -3px 10px rgba(0,0,0,0.13)' : 'none',
            transition: 'height 0.15s ease', // 出現/消失有動畫
        }}
    >
        {/* 這個 div 的寬度撐開浮動捲軸，讓它有東西可以捲 */}
        <div ref={floatingBarInnerRef} style={{ height: '1px' }} />
    </div>
)}
```

---

## 四、最重要的 Bug 修復：循環死結

這是實作過程中最關鍵的 Bug：

```
❌ 錯誤寫法（會造成循環死結）：
{showFloatingBar && <div ref={floatingBarRef}>...</div>}

死結過程：
showFloatingBar 初始為 false
→ div 不渲染 → floatingBarRef.current = null
→ useEffect 拿不到 ref → updateInnerWidth 無法執行
→ showFloatingBar 永遠是 false
→ div 永遠不渲染 → 死迴圈 ♾️

✅ 正確寫法：
永遠渲染 div，用 height: '0px' 隱藏

→ div 永遠存在 → floatingBarRef.current 有值
→ useEffect 正常執行 → updateInnerWidth 可以算出寬度
→ setShowFloatingBar(true) → height 變成 '14px' → 出現 ✅
```

---

## 五、`isSyncingRef` 防無限迴圈

```
❌ 沒有保護的情況：
拖動 Grid → handleContainerScroll 觸發 → 設定 floatingBar.scrollLeft
→ floatingBar.scrollLeft 改變 → handleFloatingScroll 觸發 → 設定 container.scrollLeft
→ container.scrollLeft 改變 → handleContainerScroll 又觸發...（無限迴圈）

✅ 用 isSyncingRef 保護：
拖動 Grid → handleContainerScroll 觸發
→ isSyncingRef.current = true（上鎖）
→ 設定 floatingBar.scrollLeft
→ floatingBar 觸發 handleFloatingScroll，但發現 isSyncingRef = true → return（跳過）
→ requestAnimationFrame 後，isSyncingRef.current = false（解鎖）
→ 只執行一次，不會無限迴圈 ✅
```

---

## 六、啟用方式（一行搞定）

```tsx
<DataGridApi
    useXBar={true}   // 加這個就完成了
    columns={...}
    apiUrl={...}
/>
```

**觸發條件（同時滿足才出現）：**
| 條件 | 說明 |
|---|---|
| `useXBar={true}` | props 有傳 |
| `scrollWidth > clientWidth` | Grid 內容確實超出容器寬度 |
