---
trigger: always_on
---

# PRD — YouthArenaEsports Web Platformu
## Bölüm 3/4: Kullanıcı Akışları, Bildirim Akışı ve Marka/Tasarım Sistemi

*(Bölüm 2/4'ün devamıdır — Sayfa Gereksinimleri için Dosya 2'ye bakınız)*

---

## 7. Kullanıcı Akışları (User Flows)

### Akış A — Ziyaretçi (Giriş Yapmadan)
```
Siteye Giriş → Ana Sayfa → Proje Çıktıları / Takımlar / Etkinlikler
(Tüm sayfalar görüntülenebilir, hiçbir işlem için giriş gerekmez)
```

### Akış B — Yeni Takım Başvurusu
```
Takımlar Sayfası → "Takımını Oluştur" → Takım Girişi/Kayıt (hesap yoksa oluştur)
→ Takım Oluşturma Formu Doldur → Gönder
→ Sistem: Durum = "Beklemede" + Admin'e E-posta Bildirimi
→ Admin Paneli → Başvuruyu İncele → Onayla / Reddet
→ (Onaylandıysa) Takım, Takımlar sayfasında görünür olur + Takıma bilgi e-postası
```

### Akış C — Onaylı Takımın Etkinlik Oluşturması
```
Takım Girişi → Takım Paneli (Durum: Onaylandı) → "Etkinlik Oluştur"
→ Formu Doldur → Yayınla → Etkinlik, Etkinlikler sayfasında herkese görünür olur
```

### Akış D — Admin Denetimi
```
Admin Girişi → Admin Paneli
→ Bekleyen Takımlar sekmesi: Onayla/Reddet
→ Etkinlikler sekmesi: Onayla/Kaldır
```

---

## 8. Bildirim / E-posta Akışı

| Tetikleyici | Alıcı | İçerik |
|---|---|---|
| Yeni takım başvurusu gönderildi | Admin | Takım adı, üyeler, açıklama, "İncele" linki |
| Takım onaylandı | Başvuran Takım | "Takımınız onaylandı, artık platformda görünürsünüz" |
| Takım reddedildi | Başvuran Takım | Ret gerekçesi (varsa) |
| Yeni etkinlik oluşturuldu (admin onayı gerekiyorsa) | Admin | Etkinlik detayları, "İncele" linki |

> **Teknik Not:** E-posta gönderimi için Bölüm 0.2'de belirtilen transactional email servisi (Resend / SendGrid / Postmark) kullanılacaktır.

---

## 9. Marka Dili ve Tasarım Sistemi

> **Kritik Kural: Bu bölümde tanımlanan tasarım standartlarının dışına hiçbir sayfada, hiçbir bileşende çıkılmayacaktır. Tüm ekranlar aynı görsel dili, aynı tipografiyi ve aynı renk paletini kullanmalıdır.**

### 9.1. Tema Kimliği
- **Tema:** Espor / Gaming — enerjik, dijital, genç ve dinamik.
- **Ton:** Profesyonel ama coşkulu; bir Erasmus+ eğitim projesinin ciddiyetiyle espor kültürünün enerjisini dengeleyen bir dil.

### 9.2. Renk Paleti (Sabit — Değiştirilemez)

| Rol | Renk | Kullanım |
|---|---|---|
| **Ana Zemin (Background)** | Koyu lacivert / neredeyse siyah (`#0B0E14` – `#12151F` aralığı) | Sayfa arka planları |
| **İkincil Zemin (Surface)** | Koyu gri-lacivert (`#1A1F2B`) | Kartlar, paneller |
| **Ana Vurgu (Primary Accent)** | Elektrik moru/mavi (`#7B5CFF` – `#4E7CFF` aralığı) | Butonlar, linkler, aktif durumlar |
| **İkincil Vurgu (Secondary Accent)** | Neon yeşil veya cyan (`#39FFB0` veya `#2EE6D6`) | Başarı durumları, "Onaylandı" etiketleri, hover efektleri |
| **Uyarı/Hata** | Kırmızı-turuncu (`#FF4D4D`) | Reddedildi durumu, hata mesajları |
| **Beklemede Durumu** | Sarı-turuncu (`#FFB84D`) | "Beklemede" etiketleri |
| **Birincil Metin** | Kırık beyaz (`#F2F3F7`) | Başlıklar, ana metinler |
| **İkincil Metin** | Gri (`#9AA0B0`) | Açıklama metinleri, alt bilgiler |

> Bu palet dışında yeni bir renk **eklenmeyecektir**. Tüm gradient ve vurgu efektleri yukarıdaki ana/ikincil vurgu renklerinin tonlamalarından türetilir.

### 9.3. Tipografi (Sabit — Değiştirilemez)

- **Başlık Fontu:** Geometrik, keskin hatlı, gaming karakterli bir sans-serif (örn. **"Rajdhani"**, **"Orbitron"** veya **"Chakra Petch"** ailesinden biri seçilip proje boyunca sabitlenecek).
- **Gövde Metni Fontu:** Okunabilirliği yüksek, nötr bir sans-serif (örn. **"Inter"** veya **"Sora"**).
- **Font Ağırlıkları:**
  - Başlıklar (H1-H3): Bold / SemiBold, geniş harf aralığı (letter-spacing) ile "espor" hissiyatı
  - Gövde metni: Regular / Medium, yüksek okunabilirlik
- **Hiyerarşi:**
  - H1: Sayfa ana başlıkları (yalnızca sayfa başına 1 adet)
  - H2: Bölüm başlıkları
  - H3: Kart/bileşen başlıkları
  - Body: Açıklama metinleri
  - Caption: Etiketler, tarihler, meta bilgiler

> Bu iki font ailesi dışında herhangi bir font kullanılmayacaktır. Tüm sayfalarda aynı font çifti (başlık + gövde) tutarlı şekilde uygulanır.

### 9.4. Bileşen Dili (UI Component Standartları)

- **Butonlar:** Köşeleri hafif yuvarlatılmış (radius: 6-8px), ana vurgu renginde dolgulu birincil buton, çerçeveli (outline) ikincil buton. Hover'da hafif parlama/glow efekti (espor teması için karakteristik).
- **Kartlar:** İkincil zemin rengi, ince kenarlık (border) veya hafif gölge, köşe yuvarlatma 8-12px.
- **Etiketler (Badge/Status):** Beklemede (sarı), Onaylandı (yeşil/cyan), Reddedildi (kırmızı) — sabit renk kodlaması tüm sitede aynı anlamı taşır.
- **İkonografi:** Çizgisel (line/outline) ikon seti, keskin/geometrik karakterli (gaming ikonografisiyle uyumlu — kupa, kalkan, oyun kolu, kalkan/shield motifleri vb.) — Bölüm 0.1'de belirtilen Lucide Icons ile uyumlu.
- **Grid ve Boşluklar (Spacing):** 8px tabanlı spacing sistemi (8, 16, 24, 32, 48, 64px) tüm bileşenlerde tutarlı kullanılır.
- **Görsel/Video Placeholder Alanları:** Tüm medya alanları, yüklenene kadar tema rengiyle uyumlu (koyu zemin üzerinde ince çerçeveli, ortasında "Görsel/Video Yakında" ikonu ile) placeholder kutular olarak tasarlanır. Placeholder'lar gerçek görsel boyutlarında (aspect-ratio korunarak) hazırlanır ki içerik eklendiğinde sayfa düzeni bozulmasın.

### 9.5. Navbar ve Footer Standartları

**Navbar (Tüm sayfalarda sabit, sticky):**
- Sol: YouthArenaEsports logosu/wordmark (placeholder logo alanı)
- Orta/Sağ: Ana Sayfa, Proje Çıktıları, Takımlar, Etkinlikler linkleri
- Sağ uç: "Takım Girişi" butonu (giriş yapılmamışsa) / Kullanıcı adı + "Panel" (giriş yapılmışsa)
- En sağda küçük, ayrık "Admin" linki (görsel olarak diğer navigasyondan hafif ayrıştırılmış — küçük ikon)

**Footer (Tüm sayfalarda sabit):**
- Proje logosu ve kısa proje açıklaması
- Hızlı linkler (site içi sayfalar)
- Erasmus+ / Proje ortakları logo şeridi (placeholder)
- Sosyal medya ikonları (placeholder)
- Alt satır: "Bu proje Avrupa Birliği Erasmus+ Programı kapsamında finanse edilmektedir" benzeri feragat metni alanı + telif hakkı satırı

*(Devamı için bkz. Dosya 4/4 — Erişilebilirlik, Teknik Kapsam ve Açık Sorular)*