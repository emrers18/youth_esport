---
trigger: always_on
---

# PRD — YouthArenaEsports Web Platformu
## Bölüm 4/4: Erişilebilirlik, Teknik Kapsam, Riskler, Açık Sorular ve Onay

*(Bölüm 3/4'ün devamıdır — Akışlar ve Tasarım Sistemi için Dosya 3'e bakınız)*

---

## 10. Erişilebilirlik ve Responsive Tasarım

- Site **mobil öncelikli (mobile-first)** yaklaşımla tasarlanmalı; katılımcılar etkinliklere telefondan da erişebilmeli.
- Kırılım noktaları: Mobil (≤480px), Tablet (481–1024px), Masaüstü (1025px+)
- Renk kontrast oranları WCAG AA standardına uygun olmalı (koyu tema olduğu için özellikle metin/zemin kontrastına dikkat edilmeli).
- Tüm formlar klavye ile tam erişilebilir olmalı.

---

## 11. Teknik Gereksinimler (Fonksiyonel Kapsam)

| Gereksinim | Açıklama |
|---|---|
| Kimlik doğrulama | İki ayrı rol: Team ve Admin, farklı giriş ekranları ve yetki seviyeleri |
| Takım başvuru durumu yönetimi | Pending / Approved / Rejected durum makinesi |
| Etkinlik yönetimi | CRUD (oluştur/oku/güncelle/sil) — yalnızca sahibi takım veya admin |
| E-posta bildirimleri | Başvuru, onay, ret durumlarında otomatik tetiklenen e-postalar |
| Medya yükleme altyapısı | Görsel/video yükleme (v1'de placeholder, ileride gerçek upload) |
| Arama/filtreleme | Takımlar ve etkinlikler sayfalarında temel filtreleme |
| Rol bazlı erişim kontrolü | Ziyaretçi / Team / Admin için farklı yetki seviyeleri |

> Kullanılacak teknoloji seti için Dosya 1/4 — Bölüm 0'a bakınız (Next.js, PostgreSQL, Prisma, NextAuth.js, Vercel vb.).

---

## 12. Kapsam Dışı (Out of Scope) — v1.0

- Canlı sohbet / mesajlaşma sistemi
- Puanlama/lider tablosu (leaderboard) sistemi
- Ödeme/bilet sistemi
- Çoklu dil desteği (v1'de tek dil; ileride TR/EN opsiyonu değerlendirilebilir)
- Gelişmiş takvim entegrasyonu (Google Calendar sync vb.)

---

## 13. Riskler ve Varsayımlar

| Risk/Varsayım | Not |
|---|---|
| Admin onay süresi | Takımların onay bekleme süresi net değil; SLA belirlenmeli (örn. 48 saat içinde inceleme hedefi) |
| Medya içerik gecikmesi | Görsel/videolar sonradan eklenecek; placeholder tasarımı bu yüzden kritik önemde |
| Tek admin hesabı mı, çoklu admin mi? | Netleştirilmesi gereken açık soru |
| Etkinlik onay akışı | Etkinlikler otomatik yayınlanır mı yoksa admin onayından mı geçer? Netleştirilmesi gereken açık soru |

---

## 14. Açık Sorular (Onay Öncesi Netleştirilmeli)

1. Etkinlik oluşturma admin onayı gerektirecek mi, yoksa onaylı takım doğrudan yayınlayabilecek mi?
2. Takım başvuru formunda üye sayısı için bir alt/üst sınır var mı?
3. Admin hesabı tek mi olacak, yoksa birden fazla admin kullanıcısı mı tanımlanacak?
4. Proje bittikten sonra site nasıl arşivlenecek/kapatılacak?
5. Başlık fontu için "Rajdhani / Orbitron / Chakra Petch" seçeneklerinden hangisi tercih edilecek? (Marka dilinin kesinleşmesi için tek seçim yapılmalı)

---

## 15. Onay

| Rol | İsim | Onay Tarihi |
|---|---|---|
| Proje Sahibi | | |
| Tasarım Sorumlusu | | |
| Geliştirme Sorumlusu | | |

---

*Bu doküman (4 dosya halinde), YouthArenaEsports platformunun v1.0 geliştirme kapsamını tanımlar. Tasarım sisteminde (Dosya 3/4 — Bölüm 9) tanımlanan renk, tipografi ve bileşen standartları proje boyunca sabit kalacak ve herhangi bir sayfa veya bileşen bu standartların dışına çıkmayacaktır.*

**Dosya Yapısı:**
1. `constitution.md` — Teknoloji stack, özet, hedefler, roller, site haritası
2. `requirements.md` — Tüm sayfaların detaylı içerik gereksinimleri
3. `design.md` — Kullanıcı akışları, bildirim akışı, marka/tasarım sistemi
4. `tech-scope.md` — Erişilebilirlik, teknik kapsam, riskler, açık sorular