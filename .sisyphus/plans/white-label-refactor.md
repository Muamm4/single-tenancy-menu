# White-label Refactor — Cardápio Digital

## TL;DR

> **Quick Summary**: Transform the current Gameleira-specific Laravel cardápio digital into a reusable white-label codebase that can serve multiple restaurant instances, each with their own domain, database, branding, and PWA.

> **Deliverables**:
> - Single white-label repo with zero hardcoded restaurant references
> - Dynamic `manifest.json` and `sw.js` per instance
> - Instance-aware seeders (`database/seeders/{Instance}/`)
> - Logo assets in `public/logos/{instance}/` per restaurant
> - `.env.example` with all instance variables documented
> - Gameleira running in production with zero downtime during transition

> **Estimated Effort**: Medium
> **Parallel Execution**: YES — 4 waves
> **Critical Path**: Config setup → Manifest/SW → Instance seeders → Deploy Gameleira

---

## Context

### Original Request
Transformar o repositório atual (específico da Gameleira) em um white-label. O usuário quer:
- Um repositório base genérico no GitHub
- Cada restaurante = clone + `.env` + banco + domínio próprio
- Poder criar novos restaurantes (começando pela Hamburgueria)
- Compartilhar novas features entre todos

### Interview Summary
**Key Decisions**:
- **Hybrid approach**: Single repo, multiple `git clone` instances on the server
- **Logos**: In-repo at `public/logos/{instance}/` (Opção A)
- **manifest.json**: Dynamic route, not static file
- **sw.js**: Dynamic with instance-specific cache name
- **Seeders**: Per-instance structure (`database/seeders/{Instance}/`)
- **No multi-tenancy**: Separate databases per restaurant
- **No tests in this plan**
- `.env.example` to be fully updated

### Research Findings
**Hardcoded references found** (27 locations in 15 files):
- `public/manifest.json`: "Gameleira Cardápio", "Gameleira" hardcoded
- `database/seeders/SettingsSeeder.php`: Gameleira-specific colors and restaurant name
- `database/migrations/..._settings_table.php`: Same defaults in migration
- `resources/js/components/app-logo.tsx`: Fallback "Gameleira Esfiharia"
- `public/sw.js`: Cache name "cardapio-cache-v5"
- `public/favicon.svg`: Gameleira brand colors embedded
- `.env`: `CACHE_PREFIX=gameleira_`

**Bug crítico encontrado**:
- `OrderController.php:79` — WhatsApp link gera para o telefone do **cliente**, não do restaurante
- `ADMIN_WHATSAPP` não existe em lugar nenhum do código (só no README)

### Metis Review
**Issues addressed in plan**:
- ✅ WhatsApp bug fix (must fix during migration)
- ✅ Migration file hardcoded defaults (new migration to clean)
- ✅ Cache key collision risk (add instance discriminator)
- ✅ SW legacy cache cleanup strategy
- ✅ Instance bootstrap workflow documented
- ✅ PWA icon paths made dynamic

---

## Work Objectives

### Core Objective
Transform the codebase into a true white-label where zero files reference "Gameleira" or any specific restaurant, and each deployment instance adapts via `.env` + config.

### Concrete Deliverables
- `config/instance.php` — instance configuration
- `routes/web.php` — dynamic `manifest.json` route
- `resources/views/sw.blade.php` — dynamic service worker
- `app/Http/Controllers/ManifestController.php` — manifest controller
- `database/migrations/2026_06_xx_add_instance_config.php` — new migration
- `database/seeders/Gameleira/RestauranteSeeder.php` — moved
- `database/seeders/Hamburgueria/RestauranteSeeder.php` — new (template)
- `public/logos/gameleira/` — logos moved
- Updated `.env.example`, `README.md`

### Definition of Done
- [ ] `grep -ri "gameleira" app/ database/seeders/ resources/ public/ config/ routes/` returns 0 matches except in `Gameleira/` seeder folder and `public/logos/gameleira/`
- [ ] Fresh `cp .env.example .env && php artisan key:generate && php artisan migrate --seed` completes without errors
- [ ] `curl /manifest.json` returns JSON with values from `.env`, not hardcoded
- [ ] Gameleira production keeps running after deploy (no data loss)

### Must Have
- `manifest.json` served dynamically from config/env values
- `sw.js` cache name uses instance identifier
- Seeders per instance in `database/seeders/{Instance}/`
- Logos in `public/logos/{instance}/`
- WhatsApp bug fixed (restaurant number in settings)
- Cache key includes instance discriminator
- `.env.example` with ALL instance variables

### Must NOT Have (Guardrails)
- **NO** multi-tenancy packages or libraries
- **NO** changes to existing migrations (already ran in production)
- **NO** restructuring of admin panel or public menu components
- **NO** payment/gateway integrations
- **NO** tests (explicitly requested)
- **NO** wiping Gameleira production data (additive changes only)

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed via shell commands and HTTP requests.

### Test Decision
- **Infrastructure exists**: NO (no test framework configured)
- **Automated tests**: None
- **Verification**: Agent-executed QA scenarios (Bash/curl only)

### QA Policy
Every task includes agent-executed verification scenarios. Evidence is inline in task descriptions — all verifiable via:
- **Bash**: grep for patterns, file existence checks
- **curl**: HTTP status codes, response body validation
- **php artisan**: tinker commands for config values
- **LSP**: diagnostic checks on PHP/TS files

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Foundation — start immediately):
├── Task 1: Create config/instance.php with all instance variables
├── Task 2: Create dynamic manifest.json route + controller
├── Task 3: Create dynamic sw.js route/blade
└── Task 4: Add cache key discriminator to HandleInertiaRequests

Wave 2 (Core refactor — after Wave 1):
├── Task 5: Fix WhatsApp bug — add restaurant_whatsapp to settings + use in OrderController
├── Task 6: Clean hardcoded fallbacks in app-logo.tsx
├── Task 7: Make logo/favicon paths dynamic in app.blade.php
└── Task 8: Create migration to clean hardcoded defaults from settings table

Wave 3 (Instance structure — after Wave 2):
├── Task 9: Create public/logos/gameleira/ and move icons/favicon
├── Task 10: Restructure seeders — create Gameleira/ seeders with existing data
├── Task 11: Create instance-aware DatabaseSeeder
├── Task 12: Create Hamburgueria seeder template (empty structure)
└── Task 13: Create new instance bootstrap command

Wave 4 (Documentation + Deploy — after Wave 3):
├── Task 14: Update .env.example with all instance variables
├── Task 15: Rewrite README.md for white-label usage
└── Task 16: Deploy Gameleira instance to production

Final Verification:
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real QA — test fresh install + Gameleira deploy
└── Task F4: Scope fidelity check (deep)
```

### Dependency Matrix
- **1-4**: None (Wave 1, parallel)
- **5-8**: Depends on 1 (needs instance config)
- **9**: Depends on 7 (needs dynamic path config)
- **10-13**: Depends on 8 (needs migration done)
- **14-15**: Depends on 10-13 (needs final state)
- **16**: Depends on all above

---

## TODOs

- [x] 1. Criar `config/instance.php` com variáveis por instância

  **What to do**:
  - Criar `config/instance.php` que retorna um array com:
    - `'instance' => env('APP_INSTANCE', 'default')`
    - `'short_name' => env('APP_SHORT_NAME', 'Cardápio')`
    - `'logo_path' => env('APP_LOGO_PATH', 'logos/default')`
    - `'theme_color' => env('APP_THEME_COLOR', '#3B82F6')`
    - `'whatsapp' => env('APP_WHATSAPP', '')`
    - `'cache_prefix' => env('CACHE_PREFIX', 'cardapio_')`
  - Adicionar no `config/app.php` um merge: `'instance' => config('instance.instance')`, `'logo_path' => config('instance.logo_path')`, `'short_name' => config('instance.short_name')`, `'theme_color' => config('instance.theme_color')`, `'whatsapp' => config('instance.whatsapp')`

  **Must NOT do**:
  - Não modificar variáveis existentes do `config/app.php` (APP_NAME, etc)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3, 4)
  - **Blocks**: Tasks 5, 6, 7, 8
  - **Blocked By**: None

  **Acceptance Criteria**:
  - [ ] `config/instance.php` exists and returns array with all keys
  - [ ] `php artisan tinker --execute="echo config('app.instance');"` returns value from `.env`
  - [ ] `php artisan tinker --execute="echo config('app.logo_path');"` returns value from `.env`

  **QA Scenarios**:
  ```
  Scenario: Config values load from environment
    Tool: Bash
    Preconditions: .env has APP_INSTANCE=test_instance
    Steps:
      1. Run: php artisan tinker --execute="echo config('app.instance');"
    Expected Result: Output is "test_instance"
    Evidence: .sisyphus/evidence/task-1-config-instance.txt

  Scenario: Default values work when env is missing
    Tool: Bash
    Preconditions: Temporarily unset APP_INSTANCE
    Steps:
      1. Run: php -d variables_order=E -r "echo require 'config/instance.php';"
    Expected Result: Default values present for all keys
    Evidence: .sisyphus/evidence/task-1-config-defaults.txt
  ```

  **Commit**: YES
  - Message: `feat(config): add per-instance configuration`
  - Files: `config/instance.php`, `config/app.php`

- [x] 2. Criar rota dinâmica para `manifest.json`

  **What to do**:
  - Criar `app/Http/Controllers/ManifestController.php` com método `__invoke()` que retorna JSON do manifest dinâmico
  - Manifest deve usar: `config('app.name')`, `config('app.short_name')`, `config('app.instance')`, `config('app.logo_path')`, `config('app.theme_color')`
  - Ícones: `config('app.logo_path') . '/icon-128x128.png'`, etc
  - Adicionar rota: `Route::get('/manifest.json', ManifestController::class)->name('manifest');`
  - Remover arquivo estático `public/manifest.json` do versionamento (git rm) e criar um .gitkeep se necessário
  - Atualizar `resources/views/app.blade.php` para usar `route('manifest')` em vez de URL estática

  **Must NOT do**:
  - Não quebrar o link rel="manifest" na Blade (testar)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3, 4)
  - **Blocks**: None directly
  - **Blocked By**: Task 1 (precisa de config/instance.php)

  **References**:
  - `app/Http/Controllers/Auth/AuthenticatedSessionController.php` — Controller pattern to follow
  - `routes/web.php:1-17` — Where to add the route
  - `config/app.php` — Where name/short_name configs are defined

  **Acceptance Criteria**:
  - [ ] `curl /manifest.json | jq '.name'` returns the APP_NAME from `.env`
  - [ ] `curl /manifest.json | jq '.short_name'` returns the APP_SHORT_NAME
  - [ ] `curl /manifest.json | jq '.theme_color'` returns the APP_THEME_COLOR
  - [ ] Old `public/manifest.json` no longer exists in git tracking

  **QA Scenarios**:
  ```
  Scenario: Manifest returns dynamic values
    Tool: Bash (curl)
    Preconditions: APP_NAME=TestRestaurant in .env, server running
    Steps:
      1. curl -s http://localhost:8000/manifest.json | python3 -c "import sys,json; print(json.load(sys.stdin)['name'])"
    Expected Result: "TestRestaurant"
    Evidence: .sisyphus/evidence/task-2-manifest-name.txt

  Scenario: Manifest includes correct icon paths
    Tool: Bash (curl)
    Steps:
      1. curl -s http://localhost:8000/manifest.json | python3 -c "import sys,json; [print(i['src']) for i in json.load(sys.stdin)['icons']]"
    Expected Result: Paths start with config('app.logo_path')
    Evidence: .sisyphus/evidence/task-2-manifest-icons.txt
  ```

  **Commit**: YES (with task 3)
  - Message: `feat(pwa): serve manifest.json and sw.js dynamically`
  - Files: `app/Http/Controllers/ManifestController.php`, `routes/web.php`, `resources/views/app.blade.php`

- [x] 3. Criar service worker dinâmico (`sw.js`)

  **What to do**:
  - Criar `resources/views/sw.blade.php` que gera o JS do service worker
  - Cache name deve incluir instância: `'cardapio-cache-' + config('app.instance') + '-v1'`
  - Incluir cleanup de caches legados: `'cardapio-cache-v5', 'cardapio-cache-v4'`
  - Rota: `Route::get('/sw.js', function() { return response()->view('sw')->header('Content-Type', 'application/javascript'); })->name('sw');`
  - Atualizar `resources/views/app.blade.php` para registrar via `route('sw')`
  - Remover `public/sw.js` estático do git

  **Must NOT do**:
  - Não mudar a lógica de cache do SW (só tornar dinâmico)
  - Garantir que caches legados sejam limpos

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 4)
  - **Blocks**: None
  - **Blocked By**: Task 1

  **Acceptance Criteria**:
  - [ ] `curl -s /sw.js | grep 'CACHE_NAME'` mostra cache name com o instance
  - [ ] `curl -s /sw.js | grep -i 'cardapio-cache-v5'` — legacy cleanup presente
  - [ ] SW registra corretamente na página

  **QA Scenarios**:
  ```
  Scenario: SW cache name is instance-specific
    Tool: Bash (curl)
    Preconditions: APP_INSTANCE=test in .env
    Steps:
      1. curl -s http://localhost:8000/sw.js | grep "CACHE_NAME"
    Expected Result: Contains "test" in the cache name
    Evidence: .sisyphus/evidence/task-3-sw-cache-name.txt

  Scenario: SW cleans legacy caches
    Tool: Bash (curl)
    Steps:
      1. curl -s http://localhost:8000/sw.js | grep -o "cardapio-cache-v5"
    Expected Result: "cardapio-cache-v5" is present (legacy cleanup list)
    Evidence: .sisyphus/evidence/task-3-sw-legacy.txt
  ```

  **Commit**: YES (with task 2)

- [x] 4. Adicionar discriminador de instância no cache key

  **What to do**:
  - Em `app/Http/Middleware/HandleInertiaRequests.php`, modificar a linha do cache:
    ```php
    Cache::remember('appearance_settings_' . config('app.instance'), 86400, fn () => Setting::getGroup('appearance'))
    ```
  - Verificar se há outros `Cache::remember()` ou `Cache::get()` no código que precisam do mesmo tratamento

  **Must NOT do**:
  - Não quebrar o cache existente (a nova chave vai gerar cache frio por 1 dia, mas é seguro)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3)
  - **Blocks**: None
  - **Blocked By**: Task 1

  **References**:
  - `app/Http/Middleware/HandleInertiaRequests.php:39` — Line to modify
  - `config/cache.php` — Cache prefix config

  **Acceptance Criteria**:
  - [ ] grep mostra que `appearance_settings` agora é `appearance_settings_' . config('app.instance')`
  - [ ] php artisan tinker confirma que a chave é única por instância

  **QA Scenarios**:
  ```
  Scenario: Cache key includes instance
    Tool: Bash (grep)
    Steps:
      1. grep "appearance_settings" app/Http/Middleware/HandleInertiaRequests.php
    Expected Result: Contains "config('app.instance')" or "appearance_settings_"
    Evidence: .sisyphus/evidence/task-4-cache-key.txt
  ```

  **Commit**: YES
  - Message: `fix(config): add instance discriminator to cache keys`
  - Files: `app/Http/Middleware/HandleInertiaRequests.php`

---

- [x] 5. Corrigir bug do WhatsApp — adicionar telefone do restaurante nas configurações

  **What to do**:
  - Adicionar `restaurant_whatsapp` ao array de settings do grupo `appearance` (SettingsSeeder)
  - Modificar `app/Http/Controllers/OrderController.php:store()`:
    ```php
    // Buscar WhatsApp do restaurante das configurações
    $restaurantWhatsapp = Setting::getValue('restaurant_whatsapp', config('app.whatsapp'));
    // Usar o telefone do restaurante, NÃO o do cliente
    $whatsappLink = 'https://wa.me/'.preg_replace('/\D/', '', $restaurantWhatsapp).'?text='.urlencode($whatsappMessage);
    ```
  - Adicionar `APP_WHATSAPP` no `config/instance.php`
  - Adicionar campo de "WhatsApp do restaurante" na página de configurações de aparência do admin

  **Must NOT do**:
  - Não remover o `customer_phone` do pedido (continua sendo coletado)
  - Não quebrar o frontend (o link gerado ainda é `wa.me/...?text=...`)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2
  - **Blocks**: None
  - **Blocked By**: Task 1

  **References**:
  - `app/Http/Controllers/OrderController.php:79` — Line to fix
  - `database/seeders/SettingsSeeder.php` — Add restaurant_whatsapp here
  - `config/instance.php` — Add APP_WHATSAPP

  **Acceptance Criteria**:
  - [ ] OrderController gera link WhatsApp com número do RESTAURANTE (não do cliente)
  - [ ] `php artisan tinker --execute="echo App\Models\Setting::getValue('restaurant_whatsapp');"` retorna o valor configurado
  - [ ] POST /orders com test data retorna whatsapp_link com o número do restaurante

  **QA Scenarios**:
  ```
  Scenario: Order WhatsApp link uses restaurant phone
    Tool: Bash (curl + php)
    Preconditions: restaurant_whatsapp = "5511988887777" in settings
    Steps:
      1. POST /orders with customer data
      2. Extract whatsapp_link from response
      3. Check that link starts with https://wa.me/5511988887777
    Expected Result: wa.me link points to restaurant, not customer
    Evidence: .sisyphus/evidence/task-5-whatsapp-fix.txt
  ```

  **Commit**: YES
  - Message: `fix(orders): send WhatsApp order to restaurant number, not customer`
  - Files: `app/Http/Controllers/OrderController.php`, `database/seeders/SettingsSeeder.php`

- [x] 6. Limpar hardcoded fallback "Gameleira Esfiharia" no `app-logo.tsx`

  **What to do**:
  - Em `resources/js/components/app-logo.tsx`, alterar linha 6:
    ```tsx
    // Antes:
    const title = appColors?.restaurant_name || 'Gameleira Esfiharia';
    // Depois:
    const title = appColors?.restaurant_name || 'Meu Restaurante';
    ```

  **Must NOT do**:
  - Não quebrar a lógica de fallback (restaurant_name do settings ainda tem prioridade)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 7, 8)
  - **Blocks**: None
  - **Blocked By**: None

  **Acceptance Criteria**:
  - [ ] grep "Gameleira Esfiharia" resources/js/components/app-logo.tsx → 0 matches
  - [ ] Componente ainda renderiza restaurant_name do settings, fallback é "Meu Restaurante"

  **QA Scenarios**:
  ```
  Scenario: Fallback text is generic
    Tool: Bash (grep)
    Steps:
      1. grep "Gameleira Esfiharia" resources/js/components/app-logo.tsx
    Expected Result: No output (string removed)
    Evidence: .sisyphus/evidence/task-6-fallback-clean.txt
  ```

  **Commit**: YES
  - Message: `fix(ui): remove hardcoded restaurant name fallback`
  - Files: `resources/js/components/app-logo.tsx`

- [x] 7. Tornar caminho do logo/favicon dinâmico no `app.blade.php`

  **What to do**:
  - Em `resources/views/app.blade.php`, substituir caminhos estáticos:
    ```blade
    {{-- Antes --}}
    <link rel="manifest" href="/manifest.json">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=...">
    <link rel="apple-touch-icon" href="/icons/icon-512x512.png">

    {{-- Depois --}}
    <link rel="manifest" href="{{ route('manifest') }}">
    <link rel="icon" type="image/svg+xml" href="{{ asset(config('app.logo_path') . '/favicon.svg') }}">
    <link rel="apple-touch-icon" href="{{ asset(config('app.logo_path') . '/icon-512x512.png') }}">
    ```
  - Atualizar o service worker registration para usar `route('sw')`

  **Must NOT do**:
  - Não quebrar o `filemtime()` cache busting (pode manter a lógica)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 5, 6, 8)
  - **Blocks**: Task 9
  - **Blocked By**: Tasks 1, 2

  **Acceptance Criteria**:
  - [ ] Blade não tem mais referências estáticas para `/favicon.svg` ou `/icons/icon-512x512.png`
  - [ ] `config('app.logo_path')` aparece nos caminhos de assets

  **QA Scenarios**:
  ```
  Scenario: Logo path is dynamic in Blade
    Tool: Bash (grep)
    Steps:
      1. grep "favicon.svg" resources/views/app.blade.php
    Expected Result: Contains "config('app.logo_path')" not hardcoded "/favicon.svg"
    Evidence: .sisyphus/evidence/task-7-dynamic-logo.txt
  ```

  **Commit**: YES (with task 2)
  - Files: `resources/views/app.blade.php`

- [x] 8. Criar migration para suportar configurações por instância

  **What to do**:
  - Criar nova migration (não modificar a existente!): `2026_06_xx_add_instance_config_to_settings.php`
  - Esta migration deve:
    - Adicionar índice único composto `(key, instance_id)` se for usar instance_id
    - OU manter a estrutura atual (simples) e apenas documentar que cada instância tem seu próprio banco
    - Na verdade, como cada instância tem banco separado, não precisa de mudança na estrutura
    - Mas precisa garantir que o `CACHE_PREFIX` no `.env` é único por instância
  - O mais importante: garantir que a migration NÃO mexe em dados existentes

  **Must NOT do**:
  - NÃO modificar a migration existente `2026_06_04_000001_create_settings_table.php`
  - NÃO deletar dados existentes da Gameleira

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2
  - **Blocks**: Tasks 10, 11, 12
  - **Blocked By**: Task 1

  **References**:
  - `database/migrations/2026_06_04_000001_create_settings_table.php` — Existing migration (DO NOT MODIFY)
  - `app/Models/Setting.php` — Model to check

  **Acceptance Criteria**:
  - [ ] `php artisan migrate` roda sem erros
  - [ ] Dados existentes da Gameleira na settings table intactos (não foram resetados)

  **QA Scenarios**:
  ```
  Scenario: Migration runs cleanly
    Tool: Bash
    Preconditions: Fresh test database
    Steps:
      1. php artisan migrate --force
    Expected Result: All migrations run, exit code 0
    Evidence: .sisyphus/evidence/task-8-migration-run.txt
  ```

  **Commit**: YES
  - Message: `feat(config): add instance_config migration`
  - Files: `database/migrations/2026_06_xx_add_instance_config_to_settings.php`

---

- [x] 9. Criar `public/logos/gameleira/` e mover assets da Gameleira

  **What to do**:
  - Criar diretório `public/logos/gameleira/`
  - Mover `public/favicon.svg` → `public/logos/gameleira/favicon.svg`
  - Mover `public/favicon.ico` → `public/logos/gameleira/favicon.ico`
  - Mover `public/icons/` → `public/logos/gameleira/icons/` (ícones PWA)
  - Criar `public/logos/default/` com um favicon placeholder genérico (fork/knife SVG sem cores específicas, usando `currentColor`)
  - Atualizar `.gitignore` se necessário
  - O `public/manifest.json` e `public/sw.js` NÃO entram aqui — foram substituídos por rotas

  **Must NOT do**:
  - Não deletar os arquivos originais até confirmar que as rotas dinâmicas estão funcionando
  - Manter o caminho antigo funcionando como fallback durante a transição

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3
  - **Blocks**: None
  - **Blocked By**: Task 7

  **Acceptance Criteria**:
  - [ ] `ls public/logos/gameleira/favicon.svg` — arquivo existe
  - [ ] `ls public/logos/gameleira/icons/icon-512x512.png` — ícone existe
  - [ ] `ls public/logos/default/favicon.svg` — placeholder existe

  **QA Scenarios**:
  ```
  Scenario: Gameleira logos in correct directory
    Tool: Bash
    Steps:
      1. ls -la public/logos/gameleira/
    Expected Result: favicon.svg, icons/ directory present
    Evidence: .sisyphus/evidence/task-9-logos-dir.txt
  ```

  **Commit**: YES
  - Message: `feat(assets): consolidate per-instance logos`
  - Files: `public/logos/gameleira/*`, `public/logos/default/*`

- [x] 10. Restruturar seeders — criar `database/seeders/Gameleira/` com dados existentes

  **What to do**:
  - Criar diretório `database/seeders/Gameleira/`
  - Mover o conteúdo de `database/seeders/RestauranteSeeder.php` para `database/seeders/Gameleira/RestauranteSeeder.php`
  - Manter o `RestauranteSeeder.php` original como está (não quebrar nada ainda)
  - Verificar se `SettingsSeeder.php` precisa de ajustes (adicionar restaurant_whatsapp, manter cores da Gameleira como padrão para instância gameleira)
  - O seeder da Gameleira deve manter EXATAMENTE os mesmos dados atuais (produtos, categorias)

  **Must NOT do**:
  - Não modificar os dados do seeder original (mesmos produtos, mesmas categorias)
  - Não alterar `AdminUserSeeder.php` (admin@cardapio.com é genérico o suficiente)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 9, 11, 12)
  - **Blocks**: None
  - **Blocked By**: Task 8

  **Acceptance Criteria**:
  - [ ] `database/seeders/Gameleira/RestauranteSeeder.php` existe
  - [ ] Contém os mesmos dados do RestauranteSeeder original
  - [ ] `database/seeders/RestauranteSeeder.php` ainda existe (não removido)

  **QA Scenarios**:
  ```
  Scenario: Gameleira seeder exists with correct data
    Tool: Bash (grep)
    Steps:
      1. grep "Esfirra" database/seeders/Gameleira/RestauranteSeeder.php
    Expected Result: File contains the product data
    Evidence: .sisyphus/evidence/task-10-seeder-exists.txt
  ```

  **Commit**: YES (with tasks 11)
  - Message: `feat(seeders): restructure seeders per instance`
  - Files: `database/seeders/Gameleira/RestauranteSeeder.php`

- [x] 11. Criar `DatabaseSeeder` aware de instância

  **What to do**:
  - Modificar `database/seeders/DatabaseSeeder.php` para:
    ```php
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            SettingsSeeder::class,
        ]);

        // Rodar seeders específicos da instância
        $instance = config('app.instance');
        match ($instance) {
            'gameleira' => $this->call(Gameleira\RestauranteSeeder::class),
            'hamburgueria' => $this->call(Hamburgueria\RestauranteSeeder::class),
            default => null, // fresh install without specific data
        };
    }
    ```

  **Must NOT do**:
  - Não chamar seeders antigos que vão ser removidos (evitar duplicação)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 9, 10, 12)
  - **Blocks**: None
  - **Blocked By**: Tasks 8, 10

  **Acceptance Criteria**:
  - [ ] `php artisan db:seed --force` roda sem erros
  - [ ] Com `APP_INSTANCE=gameleira`, seeders da Gameleira são chamados
  - [ ] Com `APP_INSTANCE=hamburgueria`, seeders da Hamburgueria são chamados

  **QA Scenarios**:
  ```
  Scenario: DatabaseSeeder dispatches correct instance seeders
    Tool: Bash
    Preconditions: APP_INSTANCE=gameleira
    Steps:
      1. php artisan db:seed --force 2>&1
    Expected Result: No errors, exit code 0
    Evidence: .sisyphus/evidence/task-11-seeder-run.txt
  ```

  **Commit**: YES (with task 10)

- [x] 12. Criar Hamburgueria seeder template (estrutura vazia)

  **What to do**:
  - Criar diretório `database/seeders/Hamburgueria/`
  - Criar `database/seeders/Hamburgueria/RestauranteSeeder.php` com:
    ```php
    class RestauranteSeeder extends Seeder
    {
        public function run(): void
        {
            // Hamburgueria data - TO BE IMPLEMENTED
            $this->command->info('Hamburgueria seeder: no data yet');
        }
    }
    ```

  **Must NOT do**:
  - Não colocar dados fictícios (só estrutura)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 9, 10, 11)
  - **Blocks**: None
  - **Blocked By**: Task 8

  **Acceptance Criteria**:
  - [ ] `database/seeders/Hamburgueria/RestauranteSeeder.php` existe
  - [ ] PHP syntax check: `php -l database/seeders/Hamburgueria/RestauranteSeeder.php`

  **QA Scenarios**:
  ```
  Scenario: Hamburgueria seeder structure exists
    Tool: Bash
    Steps:
      1. php -l database/seeders/Hamburgueria/RestauranteSeeder.php
    Expected Result: "No syntax errors detected"
    Evidence: .sisyphus/evidence/task-12-hamburgueria-seeder.txt
  ```

  **Commit**: YES (with task 10)

- [x] 13. Criar comando artisan para bootstrap de nova instância

  **What to do**:
  - Criar `app/Console/Commands/InstanceBootstrap.php`:
    ```php
    class InstanceBootstrap extends Command
    {
        protected $signature = 'instance:bootstrap {name} {--domain=} {--whatsapp=}';
        
        public function handle()
        {
            // 1. Criar .env a partir do .env.example
            // 2. Rodar key:generate
            // 3. Rodar migrate
            // 4. Rodar db:seed com a instância correta
            // 5. Criar diretório public/logos/{instance}/
            // 6. Gerar placeholder favicon/icons
            // 7. Exibir instruções para configurar nginx + supervisor
        }
    }
    ```
  - Registrar o comando em `app/Console/Kernel.php`

  **Must NOT do**:
  - Não automatizar deploy (só bootstrap local)
  - Não substituir .env existente sem confirmação

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3
  - **Blocks**: None
  - **Blocked By**: Tasks 1, 8

  **Acceptance Criteria**:
  - [ ] `php artisan list | grep instance:bootstrap` mostra o comando
  - [ ] Comando roda sem erros (dry-run)

  **QA Scenarios**:
  ```
  Scenario: Instance bootstrap command exists
    Tool: Bash
    Steps:
      1. php artisan list --format=json | python3 -c "import sys,json; cmds=json.load(sys.stdin); print([c['name'] for c in cmds['commands'] if 'instance' in c['name']])"
    Expected Result: Lists "instance:bootstrap"
    Evidence: .sisyphus/evidence/task-13-command.txt
  ```

  **Commit**: YES
  - Message: `feat(cli): add instance:bootstrap command`
  - Files: `app/Console/Commands/InstanceBootstrap.php`, `app/Console/Kernel.php`

---

- [x] 14. Atualizar `.env.example` com todas variáveis de instância

  **What to do**:
  - Garantir que `.env.example` contém TODAS as variáveis que o white-label precisa:
    ```env
    # Instance Configuration
    APP_INSTANCE=default
    APP_SHORT_NAME=Cardapio
    APP_LOGO_PATH=logos/default
    APP_THEME_COLOR=#3B82F6
    APP_WHATSAPP=
    CACHE_PREFIX=cardapio_

    # Existing variables (mantidas)
    APP_NAME=Cardapio
    APP_URL=http://localhost
    ```
  - Adicionar comentários explicativos para cada variável
  - Incluir instruções sobre como criar uma nova instância

  **Must NOT do**:
  - Não remover variáveis existentes que são necessárias

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Task 15)
  - **Blocks**: None
  - **Blocked By**: Tasks 10-13

  **Acceptance Criteria**:
  - [ ] `grep "APP_INSTANCE" .env.example` → found
  - [ ] `grep "APP_WHATSAPP" .env.example` → found
  - [ ] `grep "APP_LOGO_PATH" .env.example` → found
  - [ ] `grep "CACHE_PREFIX" .env.example` → found

  **QA Scenarios**:
  ```
  Scenario: All instance vars in .env.example
    Tool: Bash (grep)
    Steps:
      1. grep -E "APP_INSTANCE|APP_WHATSAPP|APP_LOGO_PATH|CACHE_PREFIX" .env.example
    Expected Result: All four variables present
    Evidence: .sisyphus/evidence/task-14-env-example.txt
  ```

  **Commit**: YES
  - Message: `docs(env): update .env.example with instance variables`
  - Files: `.env.example`

- [x] 15. Reescrever README.md para uso white-label

  **What to do**:
  - Substituir instruções específicas da Gameleira por instruções genéricas
  - Adicionar seção "Criando uma nova instância" com passo a passo
  - Adicionar seção "Arquitetura" explicando o modelo white-label
  - Remover screenshots específicas (ou substituir por placeholders)
  - Atualizar informações de tecnologia (PostgreSQL, não SQLite)
  - Remover referência a `ADMIN_WHATSAPP` (que não existe)
  - Adicionar seção de deploy para produção

  **Must NOT do**:
  - Não remover informações úteis de instalação

  **Recommended Agent Profile**:
  - **Category**: `writing`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Task 14)
  - **Blocks**: None
  - **Blocked By**: Tasks 10-13

  **Acceptance Criteria**:
  - [ ] README menciona PostgreSQL como banco principal
  - [ ] README tem seção "Criando uma nova instância"
  - [ ] README não menciona "Gameleira" como parte do projeto

  **QA Scenarios**:
  ```
  Scenario: README is white-label ready
    Tool: Bash (grep)
    Steps:
      1. grep "ADMIN_WHATSAPP" README.md
    Expected Result: No output (removed)
    Evidence: .sisyphus/evidence/task-15-readme-clean.txt
  ```

  **Commit**: YES
  - Message: `docs: rewrite README for white-label usage`
  - Files: `README.md`

- [ ] 16. Deploy da Gameleira em produção (manual — não automatizado)

  **What to do**:
  - Fazer deploy do código white-label no servidor da Gameleira
  - Verificar se `.env` da Gameleira tem as novas variáveis: `APP_INSTANCE=gameleira`, `APP_LOGO_PATH=logos/gameleira`, `APP_WHATSAPP=...`
  - Rodar `php artisan migrate --force` para nova migration
  - Rodar `php artisan config:cache`
  - Rodar `php artisan route:cache`
  - Reiniciar supervisor: `sudo supervisorctl restart gameleira-octane:gameleira-octane_00`
  - Testar: GET /manifest.json retorna dados corretos
  - Testar: Login funciona
  - Testar: Link WhatsApp do pedido tem número do restaurante

  **Must NOT do**:
  - Não rodar `db:seed` (produção já tem dados)
  - Não modificar `.env` sem backup

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4 (sequential)
  - **Blocks**: None
  - **Blocked By**: All previous tasks

  **Acceptance Criteria**:
  - [ ] `curl -s https://gameleira-menu.ddns.net/manifest.json | jq '.name'` mostra "Gameleira Cardápio"
  - [ ] Login funciona com credenciais admin
  - [ ] Pedidos geram link WhatsApp com número correto

  **QA Scenarios**:
  ```
  Scenario: Production manifest returns Gameleira name
    Tool: Bash (curl)
    Steps:
      1. curl -s https://gameleira-menu.ddns.net/manifest.json | jq '.name'
    Expected Result: "Gameleira Cardápio" (from APP_NAME in .env)
    Evidence: .sisyphus/evidence/task-16-prod-manifest.txt

  Scenario: Production login works
    Tool: Bash (curl)
    Steps:
      1. curl -c /tmp/test-cookies -s -D- https://gameleira-menu.ddns.net/login
      2. Submit login POST with admin credentials
      3. Follow redirect
    Expected Result: HTTP 200, session maintained
    Evidence: .sisyphus/evidence/task-16-prod-login.txt
  ```

  **Commit**: NO (env-specific, deploy diretamente no servidor)

---

- [x] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, curl endpoint, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [x] F2. **Code Quality Review** — `unspecified-high`
  Run `php artisan migrate --force` + linter. Review all changed files for: no hardcoded restaurant names, no as any/@ts-ignore, empty catches, console.log in prod, commented-out code. Check AI slop.
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [x] F3. **Real Manual QA** — `unspecified-high`
  Start from clean state. Execute QA scenarios from EVERY task — follow exact steps, capture evidence. Test cross-task integration (features working together). Test edge cases: fresh install, existing Gameleira upgrade, missing logos.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [x] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff (git log/diff). Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | VERDICT`

---

## Commit Strategy

| Tasks | Message | Scope |
|-------|---------|-------|
| 1 | `feat(config): add per-instance configuration` | config/ |
| 2, 3, 7 | `feat(pwa): serve manifest.json and sw.js dynamically` | routes, controllers, views |
| 4 | `fix(config): add instance discriminator to cache keys` | middleware |
| 5 | `fix(orders): send WhatsApp order to restaurant number` | orders, settings |
| 6 | `fix(ui): remove hardcoded restaurant name fallback` | components |
| 8 | `feat(config): add instance_config migration` | migrations |
| 9 | `feat(assets): consolidate per-instance logos` | public/ |
| 10, 11, 12 | `feat(seeders): restructure seeders per instance` | seeders |
| 13 | `feat(cli): add instance:bootstrap command` | console |
| 14 | `docs(env): update .env.example with instance variables` | .env.example |
| 15 | `docs: rewrite README for white-label usage` | README.md |
| 16 | N/A (deploy diretamente no servidor) | — |

---

## Success Criteria

### Verification Commands
```bash
# 1. Zero hardcoded Gameleira refs (except intentional)
grep -ri "gameleira" app/ database/seeders/ resources/ public/ routes/ config/ --include="*.php" --include="*.ts" --include="*.tsx" --include="*.json" --include="*.blade.php" 2>/dev/null | grep -v "Gameleira/" | grep -v "logos/gameleira" | grep -v "gameleira_" | grep -v "logo_path" 

# Expected: No output (all refs are intentional)

# 2. Fresh install works
cp .env.example .env && php artisan key:generate && php artisan migrate --seed --force

# Expected: Exit code 0, no errors

# 3. Manifest is dynamic
php artisan tinker --execute="echo app()->make(Illuminate\Contracts\Routing\UrlGenerator::class)->to('/manifest.json');"

# 4. Instance detection works
php artisan tinker --execute="echo config('app.instance');"

# Expected: Value from APP_INSTANCE env
```

### Final Checklist
- [ ] All "Must Have" present (manifest, sw, seeders, logos, whatsapp fix, cache discriminator)
- [ ] All "Must NOT Have" absent (no multitenancy package, no gameleira in core code, no data loss)
- [ ] Gameleira production running after deploy with zero downtime
