import Link from "next/link";
import { ArrowRightIcon, RocketIcon } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { MediaPlaceholder } from "@/components/media-placeholder";
import { StatCounter } from "@/components/stat-counter";
import { TeamCard } from "@/components/team-card";
import { GridBackground } from "@/components/effects/grid-background";
import { FadeIn } from "@/components/effects/fade-in";
import { YoutubeHeroBackground } from "@/components/effects/youtube-hero-background";
import { PixelTrophy, PixelJoystick } from "@/components/effects/pixel-icons";
import { getFeaturedTeams, getHomeStats } from "@/lib/data";

export const dynamic = "force-dynamic";

const HERO_VIDEO_ID = "F7HFWuo_utY";

const galleryItems = [
  { kind: "image" as const, label: "Turnuva Anları", imageUrl: "/gallery/medya-1.jpg" },
  { kind: "image" as const, label: "Açılış Töreni", imageUrl: "/gallery/medya-2.jpg" },
  { kind: "image" as const, label: "Topluluk Buluşması", imageUrl: "/gallery/medya-3.jpg" },
  { kind: "image" as const, label: "Atölye Çalışması", imageUrl: "/gallery/medya-4.jpg" },
  { kind: "image" as const, label: "Takım Röportajı", imageUrl: "/gallery/medya-5.jpg" },
  { kind: "image" as const, label: "Ödül Töreni", imageUrl: "/gallery/medya-6.jpg" },
];

const partnerPlaceholders = Array.from({ length: 6 });

export default async function HomePage() {
  const [featuredTeams, stats] = await Promise.all([
    getFeaturedTeams(4),
    getHomeStats(),
  ]);

  return (
    <div className="flex flex-col">
      {/* 1. Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10">
          <YoutubeHeroBackground
            videoId={HERO_VIDEO_ID}
            className="absolute inset-0 h-full w-full overflow-hidden"
          />
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute inset-x-0 h-24 bg-linear-to-b from-primary/25 to-transparent blur-sm animate-scanline" />
          </div>
          {/* Horizontal fade anchors a readable text panel on the left while keeping the video clear on the right */}
          <div className="absolute inset-0 bg-linear-to-r from-background via-background/75 to-background/10 sm:via-background/60 sm:to-transparent" />
          {/* Bottom fade for a seamless transition into the next section */}
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background" />
        </div>

        <GridBackground />

        <div className="container-app relative flex min-h-130 flex-col items-start justify-end gap-6 py-14 text-left sm:min-h-155 sm:py-20">
          <span className="animate-pulse-glow rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold tracking-wide text-primary">
            Bridges: Anti Discriminatory Language and Esports
          </span>
          <h1 className="text-glow-primary font-heading text-4xl font-bold tracking-wide text-textPrimary sm:text-6xl lg:text-7xl">
            YouthArena<span className="text-primary">Esports</span>
          </h1>
          <p className="max-w-xl text-balance text-lg text-textSecondary">
            Erasmus+ destekli bir gençlik projesi olarak, espor topluluklarında
            saygılı ve kapsayıcı bir dil kültürü inşa etmek için Avrupa
            genelindeki genç takımları bir araya getiriyoruz.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/takimlar" size="lg" className="shadow-glow">
              Takımları Keşfet
              <ArrowRightIcon className="size-4" />
            </ButtonLink>
            <ButtonLink href="/etkinlikler" size="lg" variant="outline">
              Etkinlikleri Gör
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* 2. Proje Hakkında */}
      <section className="border-b border-border">
        <FadeIn className="container-app grid gap-10 py-16 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-3xl font-bold tracking-wide text-textPrimary">
              Proje Hakkında
            </h2>
            <p className="text-textSecondary">
              Bridges: Anti Discriminatory Language and Esports, gençlerin espor
              ortamlarında karşılaştığı ayrımcı dil ve dışlayıcı davranışlarla
              mücadele etmek amacıyla kurulan bir Erasmus+ iş birliği projesidir.
              Proje, farklı ülkelerden gençlik kuruluşlarını ve espor
              topluluklarını bir araya getirerek kapsayıcı iletişim
              becerilerini güçlendirmeyi hedefler.
            </p>
            <p className="text-textSecondary">
              YouthArenaEsports platformu, projeye katılan takımların
              görünürlük kazanmasını, etkinlik düzenlemesini ve proje
              çıktılarına kolayca erişmesini sağlayan resmi katılımcı yönetim
              aracıdır.
            </p>
          </div>
          <div className="hud-corners">
            <MediaPlaceholder
              aspect="video"
              kind="image"
              imageUrl="/gallery/esport.jpg"
              alt="Proje Tanıtım Görseli"
              label="Proje Tanıtım Görseli"
            />
          </div>
        </FadeIn>
      </section>

      {/* 3. Öne Çıkan Takımlar */}
      <section className="border-b border-border">
        <FadeIn className="container-app py-16">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div className="flex items-center gap-3">
              <PixelTrophy className="text-primary" />
              <div>
                <h2 className="font-heading text-3xl font-bold tracking-wide text-textPrimary">
                  Öne Çıkan Takımlar
                </h2>
                <p className="mt-2 text-textSecondary">
                  Projeye katılan onaylı takımlardan bir seçki.
                </p>
              </div>
            </div>
            <Link
              href="/takimlar"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Tüm Takımları Gör →
            </Link>
          </div>

          {featuredTeams.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredTeams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={{
                    id: team.id,
                    name: team.name,
                    tag: team.tag,
                  }}
                />
              ))}
            </div>
          ) : (
            <p className="mt-8 text-textSecondary">
              Henüz onaylı takım bulunmuyor. İlk takımı sen oluştur!
            </p>
          )}
        </FadeIn>
      </section>

      {/* 4. Medya Galerisi */}
      <section className="border-b border-border">
        <div className="container-app py-16">
          <FadeIn className="flex items-center gap-3">
            <PixelJoystick className="text-secondary" />
            <h2 className="font-heading text-3xl font-bold tracking-wide text-textPrimary">
              Medya Galerisi
            </h2>
          </FadeIn>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((item, i) => (
              <FadeIn key={i} delay={i * 80} className="hud-corners group">
                <MediaPlaceholder
                  kind={item.kind}
                  label={item.label}
                  imageUrl={item.imageUrl}
                  alt={item.label}
                  className="transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Proje Ortakları */}
      <section className="overflow-hidden border-b border-border">
        <FadeIn className="container-app py-16">
          <h2 className="font-heading text-3xl font-bold tracking-wide text-textPrimary">
            Proje Ortakları
          </h2>
        </FadeIn>
        <div className="relative mt-2 overflow-hidden pb-16 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-marquee gap-4">
            {[...partnerPlaceholders, ...partnerPlaceholders].map((_, i) => (
              <div
                key={i}
                className="flex h-16 w-32 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-xs text-textSecondary"
              >
                Ortak Logo
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. İstatistik Şeridi */}
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <GridBackground className="opacity-50" />
        <FadeIn className="container-app relative grid grid-cols-2 divide-x divide-border py-16 sm:grid-cols-4">
          <StatCounter value={stats.countries} label="Ülke" />
          <StatCounter value={stats.teams} label="Takım" />
          <StatCounter value={stats.events} label="Etkinlik" />
          <StatCounter value={stats.participants} label="Katılımcı" />
        </FadeIn>
      </section>

      {/* 7. Alt CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/gallery/medya-5.jpg"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-background/55" />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/30 to-transparent" />
        </div>

        <GridBackground className="opacity-30" />
        <FadeIn className="container-app relative flex flex-col items-center gap-6 py-20 text-center">
          <RocketIcon className="animate-pulse-glow size-10 text-primary" aria-hidden="true" />
          <h2 className="font-heading text-3xl font-bold tracking-wide text-textPrimary sm:text-4xl">
            Takımını Oluştur ve Katıl
          </h2>
          <p className="max-w-xl text-balance text-textSecondary">
            YouthArenaEsports topluluğuna katıl, takımını başvur ve Avrupa
            genelindeki genç oyuncularla bağlantı kur.
          </p>
          <ButtonLink href="/takimlar" size="lg" className="shadow-glow">
            Takımını Oluştur
            <ArrowRightIcon className="size-4" />
          </ButtonLink>
        </FadeIn>
      </section>
    </div>
  );
}
