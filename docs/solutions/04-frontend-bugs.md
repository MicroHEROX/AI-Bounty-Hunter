# 04 · Frontend Bugs: Shadowing & i18n Dictionary
# 前端 Bug：变量遮蔽与 i18n 词典

## 4.1 Parameter name shadows the translation function

**Phenomenon · 现象**

```js
function taskCard(t) {                      // `t` is the task object…
  return `… ${t('meta.deadline')} …`;       // …but `t()` was the i18n function
}
```

The page throws `TypeError: t is not a function` and the board never renders.

**Root cause · 原因**

The i18n helper is named `t`, and a template function reuses `t` as its
parameter name — JavaScript local scope wins over the module-level function.

**Solution · 解决**

Never shadow global helpers. Rename the parameter (`tsk` / `task`) and update
all references:

```js
function taskCard(tsk) {
  return `… ${t('meta.deadline')} ${fmtDate(tsk.deadline)} …`;
}
```

**Guard · 预防**

- Keep i18n lookups inside a dedicated `t()` and grep for
  `function \w+\((t)\b` before merging.
- Consider naming the helper `translate()` to reduce collision odds.

## 4.2 Language toggle updates the header but not the content

**Phenomenon · 现象**

Clicking 中文/English switches the logo and `<title>`, but nav links, board
headings and the footer stay in the old language until a full reload.

**Root cause · 原因**

```js
const T = I18N[lang];      // captured ONCE at module load
function t(key) { return T[key]; }   // keeps returning the stale dictionary
```

The dictionary reference was bound when the script first ran; mutating `lang`
never changed `T`.

**Solution · 解决**

Resolve the dictionary **per call**:

```js
let lang = localStorage.getItem('bh_lang') || 'en';
function t(key) {
  return (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
}
```

Re-render the current view on toggle (the router already re-renders on
`hashchange`, so the toggle simply calls the same `render()`).

**Guard · 预防**

- Never cache the active dictionary in a module-level `const`.
- Keep the toggle state in `localStorage` so the choice survives reloads.

**Related · 相关**

- [docs/glossary.md](../glossary.md) — "session" / i18n vocabulary.
- [docs/solutions.md](../solutions.md) — methodology: test each language path
  after every UI change.
