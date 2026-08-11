# YouthArenaEsports

"Bridges: Anti Discriminatory Language and Esports" adlı Erasmus+ projesinin resmi web
sitesi ve katılımcı yönetim aracı.

## Teknoloji Yığını

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (`tailwind.config.ts` ile custom tema)
- shadcn/ui (Base UI primitives üzerine kurulu)
- React Hook Form + Zod
- Prisma ORM + PostgreSQL
- Auth.js (NextAuth v5) — `TEAM` ve `ADMIN` rolleri
- Resend (transactional email — API anahtarı yoksa console'a mock basar)

## Kurulum

### 1. Bağımlılıkları yükleyin

```bash
npm install
```

### 2. Ortam değişkenlerini ayarlayın

`.env.example` dosyasını `.env` olarak kopyalayıp değerleri doldurun:

```bash
cp .env.example .env
```

| Değişken | Açıklama |
|---|---|
| `DATABASE_URL` | PostgreSQL bağlantı adresi |
| `AUTH_SECRET` | NextAuth için rastgele bir gizli anahtar (`openssl rand -base64 32`) |
| `AUTH_URL` | Uygulamanın çalıştığı adres (geliştirmede `http://localhost:3000`) |
| `RESEND_API_KEY` | Boş bırakılırsa e-postalar geliştirme ortamında console'a yazdırılır |
| `EMAIL_FROM` | Giden e-postalarda kullanılacak gönderen adresi |
| `ADMIN_NOTIFICATION_EMAIL` | Yeni takım başvurularının bildirileceği admin e-postası |

Yerel bir PostgreSQL örneğiniz yoksa Docker ile hızlıca ayağa kaldırabilirsiniz:

```bash
docker run --name youtharena-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=youtharena -p 5432:5432 -d postgres:16
```

### 3. Veritabanı şemasını uygulayın

```bash
npm run db:migrate
```

### 4. Örnek verilerle doldurun (seed)

```bash
npm run db:seed
```

Seed sonrası giriş bilgileri terminalde yazdırılır:

- **Admin:** `admin@youtharenaesports.eu` / `admin123`
- **Takım hesapları:** seed script'inde tanımlı takımların iletişim e-postaları / `password123`
  (örn. `contact@aurorawolves.gg`, `info@lisbonlynxes.pt` — durumu `PENDING` olan takım —
  ve `contact@rhineravens.de` — durumu `REJECTED` olan takım)

### 5. Geliştirme sunucusunu başlatın

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) adresini ziyaret edin.

## Diğer komutlar

| Komut | Açıklama |
|---|---|
| `npm run build` | Prodüksiyon derlemesi |
| `npm run lint` | ESLint kontrolü |
| `npm run db:studio` | Prisma Studio ile veritabanını görsel olarak incele |
| `npm run db:generate` | Prisma Client'ı yeniden üret (şema değişince otomatik gerekir) |

## Uçtan Uca Akışlar

1. **Takım başvurusu:** `/kayit` üzerinden hesap oluştur → `/takimlar/yeni` üzerinden
   başvuru gönder → başvuru `PENDING` durumunda oluşturulur ve admin'e mock e-posta gider →
   `/admin` panelinde admin başvuruyu onaylar/reddeder → onaylanan takım `/takimlar`
   sayfasında herkese açık olarak görünür ve etkinlik oluşturabilir hale gelir.
2. **Etkinlik oluşturma:** Yalnızca `APPROVED` durumundaki takımlar `/etkinlikler/yeni`
   üzerinden etkinlik oluşturabilir. Etkinlikler varsayılan olarak `PUBLISHED` durumunda
   yayınlanır.
3. **Admin girişi:** `/admin/giris` üzerinden, yalnızca `role = ADMIN` olan hesaplarla
   giriş yapılabilir; navbar'daki ayrık "Admin" linki buraya yönlendirir.

## Proje Yapısı

```
app/                  Next.js App Router route'ları (sayfalar + server actions çağıran formlar)
components/           Paylaşılan UI bileşenleri (shadcn/ui + proje bileşenleri)
components/ui/        shadcn/ui bileşenleri (Base UI tabanlı)
lib/actions/          Server actions (takım, etkinlik, auth)
lib/validation/       Zod şemaları
lib/email/            Mock/gerçek e-posta servisi ve Resend config'i
lib/auth.ts           Auth.js (NextAuth v5) yapılandırması
lib/data.ts           Sayfalar için Prisma sorgu yardımcıları
prisma/schema.prisma  Veritabanı şeması
prisma/seed.ts        Örnek veri seed script'i
middleware.ts         /panel ve /admin route korumaları
```

## Notlar

- Dosya/medya yükleme şu an için `MediaPlaceholder` bileşeni ile temsil ediliyor
  (`imageUrl` / `videoUrl` prop'ları hazır — gerçek upload entegrasyonu sonraki fazda
  eklenebilir).
- E-posta gönderimi `RESEND_API_KEY` tanımlı değilse otomatik olarak console mock'una
  düşer; `lib/email/index.ts` içindeki `sendTeamApplicationEmail`, `sendApprovalEmail`,
  `sendRejectionEmail` fonksiyonları gerçek Resend entegrasyonu için hazırdır.
- Next.js 16, `middleware.ts` dosya kuralını "deprecated" olarak işaretleyip yerine
  `proxy.ts` kullanılmasını öneriyor; bu proje geriye dönük uyumlu `middleware.ts`
  kullanıyor ve build sırasında yalnızca bir uyarı verir, işlevsellik etkilenmez.
