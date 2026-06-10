# Cardápio Digital

Sistema white-label de cardápio digital com gestão de pedidos via WhatsApp e painel administrativo.

## Arquitetura

- **Laravel 13** com **Inertia.js** + **React** (TSX)
- **PostgreSQL** para dados, **Redis** para cache e sessão
- **FrankenPHP / Octane** para servir a aplicação
- **White-label**: cada restaurante é uma instância independente com seu próprio ambiente

## Funcionalidades

### Para o cliente (frontend público)
- Cardápio digital com navegação por categorias
- Busca de produtos em tempo real
- Carrinho de compras com Zustand
- Checkout via link do WhatsApp
- Modo "apenas cardápio" (desativa carrinho)
- Tema escuro/claro
- PWA (instalável como app)

### Para o administrador (painel admin)
- CRUD de categorias com ordenação e ativação
- CRUD de produtos com upload de imagens, preços e promoções
- Gestão de pedidos com aceitação/recusa e histórico
- Dashboard com métricas de categorias, produtos e pedidos

## Screenshots

| Cardápio Público | Painel Administrativo | Carrinho de Compras |
|:---:|:---:|:---:|
| ![Cardápio Público](./screenshots/public-menu.png) | ![Painel Admin](./screenshots/admin-dashboard.png) | ![Carrinho](./screenshots/cart-drawer.png) |

| Gestão de Produtos | Detalhes do Pedido | Fluxo de Checkout |
|:---:|:---:|:---:|
| ![Produtos](./screenshots/admin-products.png) | ![Pedido](./screenshots/admin-order-detail.png) | ![Checkout](./screenshots/checkout-flow.png) |

## Requisitos

- PHP 8.3+
- PostgreSQL 15+
- Redis 7+
- Composer 2+
- Node.js 22+

## Criando uma nova instância

1. Clone o repositório:

   ```bash
   git clone <repo-url> /var/www/meu-restaurante
   cd /var/www/meu-restaurante
   ```

2. Use o comando de bootstrap:

   ```bash
   php artisan instance:bootstrap meu-restaurante \
       --domain=meu-restaurante.ddns.net \
       --whatsapp=5511999999999
   ```

   Esse comando cria o `.env`, gera a chave, roda migrações e seeds, e configura as variáveis da instância.

3. Configure o banco de dados PostgreSQL no `.env`:

   ```bash
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=meu_restaurante
   DB_USERNAME=meu_restaurante
   DB_PASSWORD=senha_segura
   ```

4. Crie os assets de marca:

   ```bash
   # Coloque os logos em public/logos/meu-restaurante/
   # O favicon padrão é copiado automaticamente pelo bootstrap
   ```

5. Configure o servidor web (nginx/Caddy) para apontar para a pasta `public/`.

> Ou, se preferir fazer manualmente: copie `.env.example` para `.env`, edite as variáveis (`APP_INSTANCE`, `APP_NAME`, `APP_URL`, `APP_LOGO_PATH`, `APP_WHATSAPP`, `DB_DATABASE`), rode `php artisan key:generate`, `php artisan migrate --force` e `php artisan db:seed --force`.

## Deploy

```bash
git pull
composer install --no-dev
php artisan migrate --force
npm ci && npm run build
sudo supervisorctl restart programa:programa_00
```

## Admin

- **Rota**: `/admin`
- **Credenciais padrão**: `admin@cardapio.com` / `admin123`
- **Funcionalidades**: CRUD de produtos, categorias e fotos; gerenciamento de pedidos; personalização de aparência

## Licença

Distribuído sob a licença MIT.
