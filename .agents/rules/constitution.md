---
trigger: always_on
---

# PRD — YouthArenaEsports Web Platformu
## Bölüm 1/4: Kullanılacak Teknolojiler, Genel Bakış ve Kapsam

**Proje:** Bridges: Anti Discriminatory Language and Esports (Erasmus+ Projesi)
**Ürün Adı:** YouthArenaEsports
**Doküman Tipi:** Product Requirements Document (PRD)
**Versiyon:** 1.0
**Tarih:** Ağustos 2026
**Durum:** Taslak — Onay Bekliyor

> Bu doküman 4 parça halinde hazırlanmıştır (dosya boyutu limiti nedeniyle):
> **1/4** Teknoloji & Genel Bakış · **2/4** Sayfa Gereksinimleri · **3/4** Akışlar & Tasarım Sistemi · **4/4** Teknik Detaylar & Açık Sorular

---

## 0. Kullanılacak Teknolojiler (Tech Stack)

> Bu bölüm, geliştirme ekibinin projeye başlarken referans alacağı önerilen teknoloji setidir. Amaç: hızlı geliştirme, kolay bakım, düşük maliyet ve tek geliştiricinin/küçük ekibin yönetebileceği sadelik.

### 0.1. Frontend
| Katman | Teknoloji | Not |
|---|---|---|
| Framework | **Next.js (React)** | SEO gerektiren tanıtım sayfaları (Ana Sayfa, Çıktılar) için SSR/SSG avantajı |
| Stil | **Tailwind CSS** | Bölüm 9'daki sabit tasarım sistemini (renk/tipografi/spacing) tutarlı uygulamak için |
| Bileşen Kütüphanesi | **shadcn/ui** (Tailwind tabanlı, özelleştirilebilir) | Form, modal, kart, badge gibi bileşenler için hızlı başlangıç |
| Form Yönetimi | **React Hook Form + Zod** | Takım/Etkinlik formlarında doğrulama (validation) |
| İkonografi | **Lucide Icons** | Çizgisel/geometrik ikon seti, espor temasıyla uyumlu |
| State Yönetimi | React Context / **Zustand** | Giriş durumu, takım/admin oturum bilgisi gibi hafif global state |

### 0.2. Backend
| Katman | Teknoloji | Not |
|---|---|---|
| Runtime | **Node.js** | Next.js API Routes veya ayrı **NestJS/Express** servisi |
| Veritabanı | **PostgreSQL** | İlişkisel yapı (Takım–Üye–Etkinlik ilişkileri) için uygun |
| ORM | **Prisma** | Şema yönetimi, migration ve tip güvenliği |
| Kimlik Doğrulama | **NextAuth.js / Auth.js** (veya özel JWT tabanlı auth) | İki farklı rol (Team, Admin) için ayrı yetkilendirme (role-based access control) |
| Dosya/Medya Yükleme | **Cloudinary** veya **AWS S3** | Takım logosu, etkinlik afişi, galeri görselleri için |
| E-posta Servisi | **Resend** veya **SendGrid / Postmark** | Başvuru, onay, ret bildirim e-postaları (Bölüm 8) için |

### 0.3. Altyapı / Deployment
| Katman | Teknoloji | Not |
|---|---|---|
| Hosting (Frontend+Backend) | **Vercel** | Next.js ile native entegrasyon, otomatik CI/CD |
| Veritabanı Hosting | **Supabase** veya **Neon** (Postgres) | Yönetilen (managed) Postgres, düşük operasyon yükü |
| Ortam Yönetimi | Development / Staging / Production ortamları | Admin onay testleri staging'de yapılmalı |
| Versiyon Kontrolü | **GitHub** | Kod deposu + CI/CD tetikleyici |
| Monitoring/Log | **Vercel Analytics** + basit hata takibi (**Sentry**) | Canlıya çıkış sonrası hata izleme |

### 0.4. Alternatif / Basitleştirilmiş Seçenek
Eğer proje bütçesi/ekip kapasitesi kısıtlıysa, aşağıdaki "no-code / low-code" alternatif de değerlendirilebilir:
- **Frontend + Backend + DB:** Supabase (Auth + Postgres + Storage) tek başına, Next.js frontend ile
- **E-posta:** Supabase Edge Functions + Resend entegrasyonu
- Bu seçenek geliştirme süresini kısaltır ama özel iş akışları (onay durum makinesi gibi) için biraz daha manuel kurulum gerektirir.

### 0.5. Neden Bu Stack?
- **Next.js + Tailwind:** Bölüm 9'daki katı tasarım sistemini (sabit renk/font/spacing) kod tarafında da tutarlı ve tekrar kullanılabilir bileşenler halinde uygulamayı kolaylaştırır.
- **PostgreSQL + Prisma:** Takım → Üye → Etkinlik → Onay Durumu gibi ilişkisel veri yapısı için en uygun model.
- **Vercel + Supabase/Neon:** Küçük-orta ölçekli bir Erasmus+ proje sitesi için düşük maliyetli, hızlı kurulan, bakımı kolay bir kombinasyon.
- Bu seçimler bir öneridir; geliştirme ekibi mevcut know-how'a göre eşdeğer alternatifler (örn. Laravel + MySQL, Django + PostgreSQL) kullanabilir — **önemli olan Bölüm 9'daki tasarım sisteminin ve bu dokümandaki fonksiyonel gereksinimlerin bire bir korunmasıdır.**

---

## 1. Yönetici Özeti

YouthArenaEsports, "Bridges: Anti Discriminatory Language and Esports" Erasmus+ projesinin dijital yüzü ve operasyonel aracı olacak bir web platformudur. Platform iki amaca hizmet eder:

1. **Tanıtım:** Projenin amacını, çıktılarını ve katılımcı gruplarını (herkese açık, giriş gerektirmeyen) şekilde sergilemek.
2. **Operasyon:** Proje süresince gerçek katılımcı takımların kayıt olup onaylanmasını, etkinlik (event) oluşturmasını ve etkinliklere katılım sürecini yönetmesini sağlamak.

Site canlıya alındığında, proje takvimindeki gerçek katılımcılar bu platform üzerinden takım kuracak, admin onayı sonrası görünür olacak, etkinlik oluşturacak ve etkinliklere katılacaktır.

---

## 2. Proje Arka Planı

- **Üst Proje:** Bridges: Anti Discriminatory Language and Esports — Erasmus+ kapsamında yürütülen, espor (e-sports) aracılığıyla ayrımcı olmayan dil ve kapsayıcılığı genç toplulukları arasında yaymayı hedefleyen bir proje.
- **Web Ürünü:** YouthArenaEsports, bu projenin görünür yüzü ve katılımcı yönetim aracıdır.
- **Tema:** Espor (e-sports) temalı, dijital/gaming estetiğine sahip, gençlere hitap eden modern bir tasarım dili.

---

## 3. Hedefler ve Başarı Kriterleri

| Hedef | Başarı Kriteri |
|---|---|
| Projeyi tanıtmak | Ana sayfa proje amacını, ortakları ve görselleri net şekilde sunar |
| Şeffaf çıktı paylaşımı | Proje çıktıları (outputs) sayfası güncel ve erişilebilir olur |
| Takım katılımını kolaylaştırmak | Takımlar formu doldurup admin onayı sonrası platformda görünür olur |
| Etkinlik yönetimini merkezileştirmek | Onaylı takımlar etkinlik oluşturabilir, tüm ziyaretçiler etkinlikleri görebilir |
| Denetim ve moderasyon | Admin, takım ve etkinlik içeriğini onaylama/reddetme yetkisine sahip olur |
| Marka tutarlılığı | Tüm sayfalarda tek bir tasarım sistemi, tipografi ve renk paleti kullanılır |

---

## 4. Kullanıcı Rolleri

| Rol | Giriş Gerekli mi? | Yetkiler |
|---|---|---|
| **Ziyaretçi (Herkes)** | Hayır | Tüm sayfaları görüntüleme (ana sayfa, çıktılar, takımlar, etkinlikler) |
| **Takım (Team)** | Evet — Takım Girişi | Takım başvurusu oluşturma, kendi takım profilini düzenleme, etkinlik oluşturma/düzenleme (kendi etkinlikleri), etkinliklere katılım bildirimi |
| **Admin** | Evet — Admin Girişi | Takım başvurularını onaylama/reddetme, etkinlikleri onaylama/reddetme/kaldırma, tüm içerik yönetimi |

> Not: Takım başvurusu dolduran taraf otomatik olarak "Team" hesabı oluşturur; hesap admin onayından geçene kadar "Beklemede" (Pending) statüsündedir ve Takımlar sayfasında görünmez.

---

## 5. Bilgi Mimarisi / Site Haritası

```
YouthArenaEsports
│
├── Navbar (Tüm sayfalarda sabit)
│   ├── Ana Sayfa
│   ├── Proje Çıktıları
│   ├── Takımlar
│   ├── Etkinlikler
│   ├── Takım Girişi / Takım Paneli (giriş durumuna göre)
│   └── Admin Girişi (küçük, ayrık bir link/ikon olarak)
│
├── 1. Ana Sayfa (Home)
├── 2. Proje Çıktıları (Project Outputs)
├── 3. Takımlar (Teams) — listeleme + Takım Oluştur formu
├── 4. Etkinlikler (Events)
├── 5. Takım Girişi / Kayıt (Team Login & Register)
├── 6. Takım Paneli (Team Dashboard) — giriş sonrası
├── 7. Admin Girişi (Admin Login)
├── 8. Admin Paneli (Admin Dashboard) — takım & etkinlik onayları
│
└── Footer (Tüm sayfalarda sabit)
```

*(Devamı için bkz. Dosya 2/4 — Sayfa Bazlı Gereksinimler)*