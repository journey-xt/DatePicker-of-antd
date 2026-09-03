# datepicker-of-antd@1.0.6 Bug 修复报告

> 提交给库作者参考。仓库: `xutao/datepicker-of-antd`(GitHub), npm: `datepicker-of-antd@1.0.6`
> 报告人验证环境: React 16 / antd 3.26 / moment 2.x / webpack(pnpm),组件用于受控表单场景。

---

## 1. 现象(Bug 描述)

`SingleDatePicker` 在 **受控模式**(有 `onChange`,例如放在 antd v3 `Form` 的 `getFieldDecorator` 里)下,使用带 `HH:mm` 的格式时:

**依次选择多个时间单元(如:先选"小时",再选"分钟"),后一次选择会把前一次选择"还原/覆盖"成打开面板时的默认时间。**

### 复现步骤

```tsx
getFieldDecorator('time', {
  rules: [{ required: true }],
})(
  <SingleDatePicker
    format="YYYY-MM-DD HH:mm" // 时间部分会走到 TimePicker
    selectMode={SelectMode.TODYANDAFTER}
  />
)
```

1. 打开时间面板(此时默认时刻 = 当前时间,例如 `16:57:12`;不选日期也可以复现);
2. 点"小时"标签选 `1` → 此时表单值 `01:57:12`,正确;
3. 再点"分钟"标签选 `55` → 表单值变成 **`16:55:12`**,小时被还原成默认的 `16` 点。**不符合预期(应得到 `01:55:12`)。**

先选"分钟"再选"小时"同样会还原(方向无关,只要连续选两个以上单元)。

---

## 2. 根因分析

### 2.1 关键代码(`dist` 中 `TimePicker` 组件,源码对应仓库 `src` 同名组件)

```js
// 内部时间
var _d = useState(moment(value)), time = _d[0], setTime = _d[1];

// 时间变化回调 —— 问题所在
var timeChange = useCallback(function (value, type) {
    var changeMoment = moment(time).set(type, value);   // ← 基准取自闭包捕获的 time
    if (onChange) {
        onChange(changeMoment);
    }
    else {
        setTime(changeMoment);                          // ← 仅非受控分支推进内部 time
    }
}, [time, onChange, setTime]);
```

`TimePicker` 渲染方式:每种时间单元(时/分/秒)对应一个 `TimeInPut`,每个 `TimeInPut` 内部是一个 **懒加载的 antd `Popover`**,标签(`CheckableTag`)点击最终调用 `TimePicker.timeChange`。

### 2.2 为什么会"还原"

`timeChange` 通过 `useCallback` 把 `time` 快照进闭包。第一次选择(例如小时)后,内部 `time` 确实推进到了 `01:57:12`,组件也以新闭包重渲染了。**但"分钟"那个 Popover 里的标签回调,仍可能指向第一次选择之前生成的旧闭包**(antd Popover 懒挂载/内容不随每次渲染重建导致回调陈旧)。于是第二次选择:

- 执行的是**旧闭包**里的 `timeChange`;
- 旧闭包捕获的 `time` 仍是打开面板时的默认时刻 `16:57:12`;
- `moment(16:57:12).set('minute', 55)` → `16:55:12`,等于把"小时=1"覆盖还原。

### 2.3 日志证据(修复前,逐行实录)

组件内埋点打印内部 `time` 与 `timeChange` 的基准:

```
[dbg:TP#1 render] time=16:57:12 value=16:57:12        ← 打开面板,默认时刻
[dbg:timeChange] type=hour  pick=1  base=16:57:12 next=01:57:12   ← 选小时,正确
[dbg:TP#1 render] time=01:57:12 value=16:57:12        ← 内部 time 已推进(渲染日志)
[dbg:syncDate]    01:57:12 -> 01:57:12                ← 表单回灌
[dbg:TP#1 render] time=01:57:12 value=01:57:12        ← 同一实例,time=01:57:12
[dbg:syncTime]    01:57:12 -> 01:57:12
[dbg:TP#1 render] time=01:57:12 value=01:57:12
[dbg:timeChange] type=minute pick=55 base=16:57:12 next=16:55:12  ← 选分钟,基准竟是旧默认!
```

注意:**同一个 `TP#1` 实例最后一次渲染时内部 `time` 已是 `01:57:12`,但点分钟时执行的 `timeChange` 里 `base` 却是 `16:57:12`** —— 证明触发分钟的是过期闭包。

---

## 3. 修复方案

核心思路:**`timeChange` 的计算基准必须在"调用时刻"实时读取最新值,而不是从 `useCallback` 闭包捕获;并且受控分支也要推进内部 `time`。**

### 3.1 改动一(核心):基准改用 ref 实时读取 + 受控分支也推进内部 time

在 `TimePicker` 组件内:

```tsx
// 1) 新增一个始终指向"最新内部 time"的 ref
const timeRef = useRef(time);
timeRef.current = time; // 每次渲染同步(组件体内直接赋值即可,成本极低)

// 2) timeChange 改为:
const timeChange = useCallback((value, type) => {
    const changeMoment = moment(timeRef.current).set(type, value); // 实时读取,不再用旧闭包里的 time
    setTime(changeMoment);          // 受控(onChange 存在)分支也推进内部 time
    if (onChange) {
        onChange(changeMoment);
    }
}, [onChange, setTime]);            // 依赖里去掉 time,避免依赖旧快照
```

要点:
- `moment(timeRef.current)` 会 clone,不会污染 ref 内的 moment;之后 `.set()` 是原地修改,不影响读取到的基准。
- 由于每次渲染都执行 `timeRef.current = time`,即使触发的是**旧渲染创建的闭包**,读取的也是**最新已提交的内部 time**,叠加结果正确。
- 替代等价写法:用 `props.value` 的 ref 做基准亦可(二者在表单回灌后一致);关键是**调用时实时读取**。

### 3.2 改动二(建议,同一区域):`timeGroup` 只对时间片段做 split

`TimePicker` 内部:

```tsx
// 原:
const timeGroup = useMemo(() => format.split(splitSymbol), [splitSymbol]);

// 建议:只对 format 中真正的时间段(如 "HH:mm")做拆分,
// 避免组合格式(如 "YYYY-MM-DD HH:mm")被整体切开后,第一段不是纯小时 token,
// formatBackTimeType 返回 undefined → 点击小时标签变成静默 no-op。
const timeGroup = useMemo(() => {
  const match = matchTimeFormat(format);
  const timePart = match && Array.isArray(match) && match[0];
  return (timePart || format).split(splitSymbol);
}, [format, splitSymbol]);
```

### 3.3 改动三(建议):受控分支推进内部 time(已被改动一包含)

原代码只有 `else`(非受控)分支才 `setTime`,受控分支完全依赖父级把 `value` 回灌后 `useEffect([value])` 再同步内部 time——存在一帧延迟。改动一里统一改为"先推进、再回调"后此问题一并解决。

---

## 4. 修正案例(修复前 vs 修复后,同一操作序列)

> 面板默认时刻取真实日志中的 `2026-09-03 16:57:12`;操作:选小时 `1` → 选分钟 `55`。

| 步骤 | 修复前(1.0.6) | 修复后 |
|---|---|---|
| ① 打开面板 | 默认 `16:57:12` | 默认 `16:57:12` |
| ② 点小时 `1` | 内部 time → `01:57:12`;表单 `01:57:12` ✅ | 内部 time → `01:57:12`;表单 `01:57:12` ✅ |
| ③ 点分钟 `55` | **基准(旧闭包)`16:57:12` → `16:55:12`**;表单 `16:55:12` ❌ 小时被还原 | **基准(实时 ref)`01:57:12` → `01:55:12`**;表单 `01:55:12` ✅ 小时保留 |

修复后实测结果:连续选择小时、分钟可正确叠加,最终提交 `01:55:12`。反向顺序(先分后时)同样正常。

---

## 5. 回归建议

1. 需要**同时**重新生成/同步发布 `dist/index.js`(main)与 `dist/index.es.js`(module)——两者都可能被引用(本案例 webpack 即命中其一,建议两处一致)。
2. 建议加一个受控模式回归用例:给 `TimePicker`(或 `SingleDatePicker`)传默认 `value`,依次触发两个不同时间单元(时→分、分→时),断言第二次选择后第一次选择仍保留。
3. `moment(locale)` / React 16 / antd v3 环境即可复现,不依赖业务。

---

## 6. 附带:可直接提交的英文 Issue 草稿

```
Title: [Bug] Picking hour then minute reverts the hour to default (controlled mode)

Package: datepicker-of-antd@1.0.6
Env: React 16, antd 3.26, moment, webpack/pnpm
Usage: SingleDatePicker with format "YYYY-MM-DD HH:mm", controlled (inside antd v3 Form/rc-form).

Steps:
1. Open the time panel (default = now, e.g. 16:57:12).
2. Pick hour = 1  -> value becomes 01:57:12 (ok).
3. Pick minute = 55 -> value becomes 16:55:12, hour is REVERTED to the default. Expected 01:55:12.

Root cause:
TimePicker.timeChange builds changeMoment from the internal `time` captured in a
useCallback([time,...]) closure. The hour/minute tags live in lazily-mounted antd
Popovers; after the first pick advances internal time and re-renders, the *other*
unit's tag handler can still invoke a stale closure whose `time` is the panel-open
default. So the second pick is computed relative to the default and overwrites the
first. In controlled mode the internal time is also never advanced locally (only
the else/onChange-absent branch calls setTime), making it worse.

Suggested fix (see report):
1. Keep a ref always pointing to the latest internal time and read it at call time:
     const timeRef = useRef(time); timeRef.current = time;
     const changeMoment = moment(timeRef.current).set(type, value);
2. Always setTime(changeMoment) before calling onChange (controlled branch too).
3. (Defensive) timeGroup should split only the matched time segment of `format`,
   not the whole format.

Verified: after the change, hour then minute yields 01:55:12; reverse order also works.
```

---

*本报告附带的修复建议已在本仓库真实业务场景中通过运行验证;node_modules 中用于验证的临时改动已按发布原版还原,未留任何调试代码。*
