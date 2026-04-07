# KiotViet MCP Server

MCP (Model Context Protocol) Server cho KiotViet Public API — Kết nối AI assistant với hệ thống quản lý bán hàng KiotViet.

## Tính năng

- **36 tools** bao phủ đầy đủ KiotViet Public API
- **Auto token refresh** — Token 1 giờ được tự động làm mới trước khi hết hạn
- **Middleware chain** — Error handler, validation, rate limit, pagination
- **2 transport mode** — stdio (Claude Desktop) và HTTP/SSE (multi-session)
- **5 preset** — Chọn nhóm tool phù hợp với nhu cầu
- **Docker ready** — Build và deploy với Docker Compose

---

## Yêu cầu

- Node.js >= 18
- Tài khoản KiotViet với quyền truy cập Public API
- `Client ID`, `Client Secret`, `Retailer name` từ **Thiết lập cửa hàng → Thiết lập kết nối API**

---

## Cài đặt

```bash
# Clone và cài dependencies
git clone <repo-url>
cd kiotviet-mcp
npm install
npm run build
```

---

## Cấu hình

Tạo file `.env` từ template:

```bash
cp .env.example .env
```

Điền thông tin:

```env
KIOTVIET_CLIENT_ID=your_client_id
KIOTVIET_CLIENT_SECRET=your_client_secret
KIOTVIET_RETAILER=your_retailer_name
```

---

## Sử dụng

### Claude Desktop (stdio)

Thêm vào `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "kiotviet": {
      "command": "node",
      "args": ["/path/to/kiotviet-mcp/dist/cli.js", "mcp"],
      "env": {
        "KIOTVIET_CLIENT_ID": "your_client_id",
        "KIOTVIET_CLIENT_SECRET": "your_client_secret",
        "KIOTVIET_RETAILER": "your_retailer_name"
      }
    }
  }
}
```

### Chạy thủ công

```bash
# stdio mode
node dist/cli.js mcp --client-id X --client-secret Y --retailer Z

# HTTP mode
node dist/cli.js mcp --client-id X --client-secret Y --retailer Z --mode http --port 3000
```

### Docker

```bash
cd docker
cp .env.example .env
# Điền credentials vào .env
docker compose up -d
```

Endpoints:
- Health check: `http://localhost:4567/health`
- SSE endpoint: `http://localhost:4567/sse`

---

## Tools

### Xem danh sách tools

```bash
# Tất cả tools
node dist/cli.js tools

# Theo project
node dist/cli.js tools --project products

# Xem presets
node dist/cli.js tools --presets
```

### Danh sách tools theo nhóm

| Nhóm | Tools |
|------|-------|
| **categories** | `kiotviet_categories_list` |
| **products** | `list`, `get_by_id`, `get_by_code`, `create`, `update`, `delete` |
| **customers** | `list`, `get_by_id`, `get_by_code`, `create`, `update` |
| **customers** | `kiotviet_customer_groups_list` |
| **orders** | `list`, `get`, `create`, `update`, `cancel` |
| **invoices** | `list`, `get_by_id`, `get_by_code`, `create`, `update`, `cancel` |
| **purchase-orders** | `list`, `get`, `create` |
| **branches** | `kiotviet_branches_list` |
| **users** | `kiotviet_users_list` |
| **suppliers** | `kiotviet_suppliers_list` |
| **bank-accounts** | `kiotviet_bank_accounts_list` |
| **cashbook** | `kiotviet_cashbook_list` |
| **webhooks** | `list`, `create`, `update`, `delete` |

---

## Presets

| Preset | Mô tả | Số tools |
|--------|-------|---------|
| `preset.default` | Tất cả tools | 36 |
| `preset.readonly` | Chỉ GET — an toàn cho môi trường read-only | 21 |
| `preset.products` | Hàng hóa + nhóm hàng | 7 |
| `preset.sales` | Đơn hàng + hóa đơn + khách hàng | 17 |
| `preset.inventory` | Hàng hóa + nhập kho + nhà cung cấp | 11 |

Kích hoạt preset qua CLI:

```bash
node dist/cli.js mcp --tools "preset.readonly" ...
```

---

## F&B Mode

Dùng cho nhà hàng, quán cà phê (API F&B):

```env
KIOTVIET_BASE_URL=https://publicfnb.kiotapi.com
```

---

## Xác thực

KiotViet dùng **OAuth 2.0 Client Credentials**. Token có hiệu lực 1 giờ và được **tự động làm mới** trước khi hết hạn (buffer 5 phút).

Token endpoint: `https://id.kiotviet.vn/connect/token`

---

## Cấu trúc dự án

```
src/
├── auth/
│   └── token-manager.ts        # Client Credentials + auto-refresh
├── mcp-server/
│   ├── init.ts                 # Khởi tạo server, đăng ký tools
│   └── transport/
│       ├── stdio.ts            # stdio transport
│       └── sse.ts              # HTTP/SSE transport
├── mcp-tool/
│   ├── types.ts                # McpTool, MiddlewareContext...
│   ├── handler.ts              # KiotViet API handler
│   ├── registry.ts             # Đăng ký tất cả tools + presets
│   ├── presets.ts              # Resolver preset/filter
│   ├── middleware/
│   │   ├── chain.ts
│   │   ├── error-handler.ts
│   │   ├── rate-limiter.ts
│   │   ├── pagination.ts
│   │   └── validation.ts
│   └── tools/                  # 13 modules tool definitions
└── utils/
    ├── config.ts
    ├── http-client.ts
    └── logger.ts
docker/
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

---

## Scripts

```bash
npm run build        # Build TypeScript → dist/
npm run dev          # Chạy trực tiếp với ts-node
npm run format       # Format code với Prettier
npm test             # Chạy tests
npm run test:coverage
```

---

## Giới hạn API

| Thông số | Giá trị |
|----------|---------|
| pageSize tối đa | 100 bản ghi/request |
| Token TTL | 3600 giây (1 giờ) |
| Webhook timeout | 5 giây |
| Base URL Retail | `https://public.kiotapi.com` |
| Base URL F&B | `https://publicfnb.kiotapi.com` |

---

## License

MIT
