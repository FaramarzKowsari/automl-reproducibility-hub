# راهنمای رفع خطای TypeScript Build

تورفتگی YAML اکنون درست شده است و GitHub Actions وارد مرحله واقعی Build می‌شود.

خطای فعلی از `tsconfig.node.json` است:

```text
TS5096: Option 'allowImportingTsExtensions' can only be used when either
'noEmit' or 'emitDeclarationOnly' is set.
```

در این بسته، گزینه زیر به `compilerOptions` اضافه شده است:

```json
"noEmit": true
```

## نصب

1. ZIP را Extract کنید.
2. فایل `tsconfig.node.json` را در ریشه مخزن محلی کپی کنید.
3. هنگام سؤال ویندوز، گزینه زیر را بزنید:

```text
Replace the files in the destination
```

## Commit

Summary:

```text
Fix TypeScript node configuration for production build
```

Description:

```text
Enable noEmit in tsconfig.node.json so allowImportingTsExtensions is valid and the Vite configuration project can pass TypeScript build mode.
```

سپس:

```text
Commit to main
Push origin
```

Push جدید دو Workflow تازه ایجاد می‌کند. اجراهای قرمز قبلی را Re-run نکنید.
