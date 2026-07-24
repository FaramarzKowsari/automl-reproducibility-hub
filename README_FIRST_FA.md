# راهنمای قرار دادن پروژه در GitHub Desktop

نام پیشنهادی مخزن:

```text
automl-reproducibility-hub
```

1. فایل ZIP را Extract کنید.
2. GitHub Desktop را باز کنید.
3. از `File → Add local repository` پوشه استخراج‌شده را انتخاب کنید. اگر هنوز Git repository نیست، گزینه Create a repository را بزنید.
4. Repository name باید `automl-reproducibility-hub` باشد.
5. Summary:

```text
Initial release: browser-first AutoML reproducibility laboratory
```

6. `Commit to main` و سپس `Publish repository` را بزنید.
7. حتماً گزینه `Keep this code private` را خاموش کنید تا مخزن Public باشد.
8. در GitHub وارد `Settings → Pages` شوید و Source را روی `GitHub Actions` قرار دهید.
9. Push اولیه باید دو Workflow را اجرا کند: `CI` و `Deploy GitHub Pages`.
10. پس از سبزشدن Deploy، آدرس برنامه:

```text
https://faramarzkowsari.github.io/automl-reproducibility-hub/
```

## نکته اجرای محلی

```bash
npm install
npm run dev
```

در اجرای Full برای نخستین بار، مرورگر بسته‌های Pyodide و scikit-learn را دانلود می‌کند. Static Mode بدون این دانلودها باز می‌شود.
