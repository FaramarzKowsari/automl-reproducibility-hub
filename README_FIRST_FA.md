# راهنمای رفع خطای GitHub Actions

خطا از تورفتگی اشتباه YAML در هر دو Workflow است.

در فایل `ci.yml` فرمان نصب وابستگی‌ها به‌اشتباه زیر بخش `with` قرار گرفته بود.
در فایل `deploy-pages.yml` نیز همان خطا وجود داشت.

## نصب

1. ZIP را Extract کنید.
2. پوشه `.github` داخل بسته را در ریشه مخزن محلی کپی کنید.
3. هنگام سؤال ویندوز، بزنید:

```text
Replace the files in the destination
```

## فایل‌های اصلاح‌شده

```text
.github/workflows/ci.yml
.github/workflows/deploy-pages.yml
```

## Commit

Summary:

```text
Fix GitHub Actions workflow YAML syntax
```

Description:

```text
Correct invalid indentation in the CI and GitHub Pages workflows so dependency installation, tests, production build, artifact upload, and deployment can run successfully.
```

سپس:

```text
Commit to main
Push origin
```

پس از Push، دو اجرای جدید ساخته می‌شوند:

```text
CI
Deploy GitHub Pages
```

اجراهای قرمز قدیمی را Re-run نکنید؛ Push جدید Workflowهای تازه ایجاد می‌کند.
