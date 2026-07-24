# نصب فایل کامل index.html و اصلاح نهایی Build

این بسته چهار فایل را اصلاح می‌کند:

```text
index.html
src/App.tsx
src/components/About.tsx
tsconfig.node.json
```

## چرا چهار فایل؟

فایل `index.html` به‌طور کامل برای SEO، Guidebook، Open Graph، Twitter Card،
Google Scholar citation metadata، Schema.org و GitHub Pages بازسازی شده است.

سه فایل دیگر خطاهای Build فعلی را رفع می‌کنند:

```text
Module "lucide-react" has no exported member 'Github'
Module "lucide-react" has no exported member 'Linkedin'
TS5096: allowImportingTsExtensions requires noEmit
```

DOI در این مرحله عمداً وارد نشده است. بعد از سبزشدن CI، انتشار Release نسخه
`v1.0.0` و صدور DOI رسمی Zenodo انجام می‌شود.

## نصب

1. ZIP را Extract کنید.
2. تمام محتویات پوشه استخراج‌شده را در ریشه مخزن محلی قرار دهید:

```text
Documents\GitHub\automl-reproducibility-hub
```

3. هنگام سؤال ویندوز، گزینه زیر را بزنید:

```text
Replace the files in the destination
```

## Commit

Summary:

```text
Complete project metadata and fix final TypeScript build errors
```

Description:

```text
Replace index.html with complete SEO, guidebook, citation, Open Graph, Twitter Card, and Schema.org metadata; replace unsupported lucide-react GitHub and LinkedIn icon exports; add the guidebook footer link; and enable noEmit for the TypeScript Node configuration.
```

سپس:

```text
Commit to main
Push origin
```

اجراهای قرمز قبلی را Re-run نکنید. Push جدید Workflowهای تازه می‌سازد.

## کنترل

هر دو مورد باید سبز شوند:

```text
CI
Deploy GitHub Pages
```

پس از سبزشدن:

```text
https://faramarzkowsari.github.io/automl-reproducibility-hub/
https://faramarzkowsari.github.io/automl-reproducibility-hub/guidebook/
```

سپس Release نسخه `v1.0.0` ساخته می‌شود تا Zenodo DOI رسمی صادر کند.
