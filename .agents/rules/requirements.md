---
trigger: always_on
---

# PRD — YouthArenaEsports Web Platformu
## Bölüm 2/4: Sayfa Bazlı Gereksinimler

*(Bölüm 1/4'ün devamıdır — Teknoloji, Genel Bakış, Roller ve Site Haritası için Dosya 1'e bakınız)*

---

## 6. Sayfa Bazlı Gereksinimler

### 6.1. Ana Sayfa (Home)

**Amaç:** Projeyi ilk kez gören ziyaretçiye net, çarpıcı ve bilgilendirici bir giriş sunmak.

**İçerik Blokları (yukarıdan aşağıya sırayla):**

1. **Hero Bölümü**
   - Büyük başlık: "YouthArenaEsports"
   - Alt başlık: Proje adı — "Bridges: Anti Discriminatory Language and Esports"
   - Kısa tanıtım cümlesi (1-2 cümle)
   - CTA butonları: "Takımları Keşfet", "Etkinlikleri Gör"
   - Arka plan: Video/görsel yeri (placeholder) — espor temalı hero görseli veya loop video alanı

2. **Proje Hakkında Bölümü**
   - Erasmus+ projesinin amacı, hedef kitlesi, ayrımcı olmayan dil vurgusu
   - 2-3 paragraflık açıklama metni alanı
   - Yanında görsel/ikon placeholder alanı

3. **Öne Çıkan Takımlar Bölümü**
   - Onaylı takımlardan seçilmiş 3-4 takım kartı (logo placeholder, takım adı, ülke/bölge)
   - "Tüm Takımları Gör" linki → Takımlar sayfasına yönlendirme

4. **Medya Galerisi Bölümü**
   - Görsel/video grid alanı (placeholder kartlar — sonradan doldurulacak)
   - En az 6 medya kutusu (2x3 veya 3x2 grid)

5. **Proje Ortakları / Partnerler Bölümü**
   - Ortak kurum logoları için placeholder grid (yatay şerit / logo bulutu)

6. **İstatistik Şeridi (Sayaç Bölümü)**
   - Örnek: "X Ülke", "X Takım", "X Etkinlik", "X Katılımcı" — büyük rakam + küçük etiket formatında

7. **Alt CTA Bölümü**
   - "Takımını Oluştur ve Katıl" büyük çağrı butonu → Takım Girişi/Kayıt sayfasına yönlendirme

---

### 6.2. Proje Çıktıları (Project Outputs)

**Amaç:** Projenin somut çıktılarını (dokümanlar, araçlar, eğitim materyalleri vb.) şeffaf biçimde sunmak.

**İçerik Blokları:**

1. **Sayfa Başlığı ve Kısa Açıklama**
   - "Proje Çıktıları" başlığı + Erasmus+ çıktı mantığına dair kısa açıklama

2. **Çıktı Kartları Listesi (Grid Layout)**
   Her kart şunları içerir:
   - Çıktı görseli/ikonu (placeholder)
   - Çıktı başlığı (örn. "IO1 - Araştırma Raporu")
   - Kısa açıklama (2-3 cümle)
   - Doküman/İndirme linki (placeholder — PDF, video veya harici link alanı)
   - Yayın tarihi

3. **Zaman Çizelgesi (Timeline) Görünümü (opsiyonel ama önerilir)**
   - Çıktıların proje takvimine göre sıralı gösterimi (dikey veya yatay timeline bileşeni)

4. **İndirme/Kaynaklar Bölümü**
   - Genel proje dokümanlarına (broşür, sunum vb.) toplu erişim alanı

---

### 6.3. Takımlar (Teams)

**Amaç:** Onaylanmış aktif takımları listelemek ve yeni takım başvurusu almak.

**İçerik Blokları:**

1. **Sayfa Başlığı + Filtre/Arama Alanı**
   - Ülke, oyun türü veya duruma göre filtreleme (opsiyonel v1.1, v1'de arama kutusu yeterli)

2. **Takım Kartları Grid'i (Sadece Onaylı Takımlar Görünür)**
   Her kart:
   - Takım logosu (placeholder)
   - Takım adı
   - Ülke / Kurum bilgisi
   - Üye sayısı
   - Katıldığı oyun/branş (opsiyonel etiket)
   - "Detay Gör" butonu → Takım detay modalı/sayfası (üyeler, kısa tanıtım, aldığı etkinlikler)

3. **Takım Oluşturma Bölümü / CTA**
   - "Takımını Oluştur" büyük buton
   - Tıklanınca: Kullanıcı giriş yapmamışsa **önce Takım Girişi/Kayıt sayfasına** yönlendirilir
   - Giriş yapmışsa doğrudan **Takım Oluşturma Formu** açılır

4. **Takım Oluşturma Formu Alanları**
   - Takım adı
   - Ülke / Temsil edilen kurum
   - Takım açıklaması / motivasyon metni
   - Üye listesi (ad, soyad, e-posta — dinamik ekle/çıkar alanı)
   - Takım logosu yükleme (placeholder alan)
   - İletişim e-postası (admin onay maili bu adrese/adminin mailine gidecek)
   - Gönder butonu → Form gönderildiğinde:
     - Takım durumu **"Beklemede" (Pending)** olarak kaydedilir
     - **Admin'e otomatik e-posta bildirimi** gider (yeni başvuru bilgileriyle)
     - Kullanıcıya "Başvurunuz alındı, admin onayı bekleniyor" bilgilendirme ekranı gösterilir

---

### 6.4. Etkinlikler (Events)

**Amaç:** Onaylı takımların oluşturduğu etkinlikleri (turnuva, buluşma, online maç vb.) herkese açık şekilde listelemek.

**İçerik Blokları:**

1. **Sayfa Başlığı + Görünüm Seçenekleri**
   - Liste görünümü / Takvim görünümü (opsiyonel, v1'de liste görünümü zorunlu)
   - Filtre: Yaklaşan / Geçmiş etkinlikler, tarih aralığı

2. **Etkinlik Kartları**
   Her kart:
   - Etkinlik görseli (placeholder)
   - Etkinlik adı
   - Düzenleyen takım adı (link ile takım sayfasına)
   - Tarih / saat
   - Konum (fiziksel veya online — placeholder link alanı)
   - Kısa açıklama
   - Katılımcı sayısı / kontenjan bilgisi
   - "Detay Gör" / "Katıl" butonu

3. **Etkinlik Detay Sayfası/Modalı**
   - Uzun açıklama, kurallar, gereksinimler
   - Medya galerisi placeholder (afiş, video)
   - Katılım formu veya "İlgileniyorum" butonu (giriş yapan takım üyeleri için)

4. **Etkinlik Oluşturma (Sadece Onaylı Takım Girişi Yapmış Kullanıcılar İçin)**
   - "Etkinlik Oluştur" butonu, yalnızca onaylı takım hesabı girişliyken görünür/aktif
   - Form alanları: Etkinlik adı, tarih/saat, konum, açıklama, görsel yükleme, kontenjan
   - Gönderilen etkinlik doğrudan yayınlanır veya admin onayına düşer (bkz. Dosya 4/4 — Açık Sorular, karar admin ile netleştirilecek)

---

### 6.5. Takım Girişi / Kayıt (Team Login & Register)

**İçerik:**
- Giriş formu: E-posta + Şifre
- Kayıt formu: Takım Oluşturma Formu ile entegre (bkz. 6.3) veya öncesinde temel hesap bilgisi (e-posta, şifre) oluşturma adımı
- "Şifremi Unuttum" akışı
- Giriş sonrası yönlendirme: **Takım Paneli (Dashboard)**

### 6.6. Takım Paneli (Team Dashboard) — Giriş Sonrası

- Takım durumu göstergesi: **Beklemede / Onaylandı / Reddedildi**
- Takım profili düzenleme
- (Onaylıysa) Etkinlik oluşturma ve mevcut etkinliklerini yönetme
- Bildirimler alanı (onay durumu, admin geri bildirimi)

### 6.7. Admin Girişi (Admin Login)

- Sade, ayrı bir giriş ekranı (navbar'da göze çarpmayan, küçük bir link/ikon — örn. footer'da veya navbar'ın en sağında küçük "Admin" linki)
- E-posta + Şifre ile giriş

### 6.8. Admin Paneli (Admin Dashboard)

**Bölümler:**

1. **Bekleyen Takım Başvuruları**
   - Liste halinde: Takım adı, başvuru tarihi, üyeler, açıklama
   - "Onayla" / "Reddet" butonları (reddetmede opsiyonel not/gerekçe alanı)
   - Onaylanınca: Takım Takımlar sayfasında görünür hale gelir + takıma bilgilendirme maili gider

2. **Onaylı Takımlar Yönetimi**
   - Tüm onaylı takımların listesi, düzenleme/pasife alma yetkisi

3. **Etkinlik Yönetimi**
   - Tüm etkinliklerin listesi (onay bekleyen / yayında)
   - Onaylama/kaldırma yetkisi

4. **Bildirim Günlüğü (Log)**
   - Gönderilen e-posta bildirimlerinin kaydı (opsiyonel v1.1)

*(Devamı için bkz. Dosya 3/4 — Kullanıcı Akışları & Tasarım Sistemi)*