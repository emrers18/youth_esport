import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, RocketIcon } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { MediaPlaceholder } from "@/components/media-placeholder";
import { StatCounter } from "@/components/stat-counter";
import { TeamCard } from "@/components/team-card";
import { GridBackground } from "@/components/effects/grid-background";
import { FadeIn } from "@/components/effects/fade-in";
import { VideoBackground } from "@/components/effects/video-background";
import { PixelTrophy, PixelJoystick } from "@/components/effects/pixel-icons";
import { getFeaturedTeams, getHomeStats } from "@/lib/data";
import { partners } from "@/lib/partners";

export const dynamic = "force-dynamic";

const galleryItems = [
  { kind: "image" as const, label: "Tournament Moments", imageUrl: "/gallery/medya-1.jpg" },
  { kind: "image" as const, label: "Opening Ceremony", imageUrl: "/gallery/medya-2.jpg" },
  { kind: "image" as const, label: "Community Meetup", imageUrl: "/gallery/medya-3.jpg" },
  { kind: "image" as const, label: "Workshop Session", imageUrl: "/gallery/medya-4.jpg" },
  { kind: "image" as const, label: "Team Interview", imageUrl: "/gallery/medya-5.jpg" },
  { kind: "image" as const, label: "Award Ceremony", imageUrl: "/gallery/medya-6.jpg" },
];

// Repeated enough times that a single half of the marquee track is always
// wider than the viewport, so the looping animation never reveals a gap.
const marqueeLoop = Array.from({ length: 10 }, () => partners).flat();
const marqueePartners = [...marqueeLoop, ...marqueeLoop];

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
          <VideoBackground
            src="/gallery/video_logo.mp4"
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
          <h1 className="font-valorant text-4xl font-bold uppercase tracking-wide text-textPrimary sm:text-5xl lg:text-6xl">
            Youth<span className="text-primary">Esports</span>Arena
          </h1>
          <p className="max-w-xl text-balance font-valorant text-xl tracking-wide text-textSecondary">
            As an Erasmus+ funded youth project, we bring together young teams
            from across Europe to build a respectful and inclusive language
            culture in esports communities.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/teams" size="lg" className="shadow-glow font-valorant uppercase tracking-widest">
              Explore Teams
              <ArrowRightIcon className="size-4" />
            </ButtonLink>
            <ButtonLink href="/events" size="lg" variant="outline" className="font-valorant uppercase tracking-widest">
              View Events
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* 2. About the Project */}
      <section className="border-b border-border">
        <FadeIn className="container-app grid gap-10 py-16 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-3xl font-bold tracking-wide text-textPrimary">
              About the Project
            </h2>
            <p className="text-textSecondary">
              The Digital Youth: Building Bridges Between Youth and Esports (BRIDGE) is an Erasmus+ Youth Exchange project that explores the potential of e-sports as a new space for youth participation, social connection and community building. While traditional youth spaces such as youth centres provide valuable opportunities for young people to meet, interact and take part in activities, not every young person feels connected to these environments. Many instead build friendships, communities and a sense of belonging through gaming and e-sports. BRIDGE aims to meet young people where they already are by bringing the values and opportunities of youth work into the digital spaces they naturally engage with. At the same time, the project encourages participants to explore both the opportunities and challenges of e-sports, including teamwork and belonging as well as issues such as toxic behaviour, discrimination and exclusion.
            </p>
            <p className="text-textSecondary">
              The project brings together 34 participants from Sweden, Türkiye, Denmark, Romania and Spain for an international Youth Exchange in Örkelljunga, Sweden. Through teamwork, discussions, simulations, role-play, creative activities and intercultural exchange, participants will explore how e-sports communities can become safer, more inclusive and welcoming spaces. Beyond participating in the exchange, young people are encouraged to take an active role: working together, developing ideas, taking initiative and gaining the confidence to create activities for other young people. A central result of this process will be the Inclusive Esports Activity Blueprint, developed together by the participants. After the exchange, each national group will put their ideas into practice by organising a Local Inclusive LAN Event in their own community, giving participants the opportunity to move from being members of gaming communities to becoming active organisers and young leaders.
            </p>
            <p className="text-textSecondary">
              BRIDGE is built on cooperation between five organisations that bring together different experiences in youth work, inclusion, e-sports, sports, digital engagement and community activities. The project is coordinated by INTEGRATION FOR ALLA (IFALL) from Sweden, together with FAAL DERNEGI from Türkiye, BeginGlobal from Denmark, Euro Education Federation from Romania and Asociación USIT from Spain.  By connecting young people across five countries and supporting them to create their own local activities, BRIDGE aims to build communities around e-sports that are not only enjoyable and social, but also inclusive, responsible and youth-led. Through the local LAN events, the shared project platform and continued cooperation between participants and partner organisations, the project seeks to create an impact that continues well beyond the international exchange.            </p>
          </div>
          <div className="hud-corners">
            <MediaPlaceholder
              aspect="video"
              kind="image"
              imageUrl="/gallery/esport.jpg"
              alt="Project Introduction Image"
              label="Project Introduction Image"
            />
          </div>
        </FadeIn>
      </section>

      {/* 3. Featured Teams */}
      <section className="border-b border-border">
        <FadeIn className="container-app py-16">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div className="flex items-center gap-3">
              <PixelTrophy className="text-glow-gold text-gold" />
              <div>
                <h2 className="font-heading text-3xl font-bold tracking-wide text-textPrimary">
                  Featured Teams
                </h2>
                <p className="mt-2 text-textSecondary">
                  A selection of approved teams taking part in the project.
                </p>
              </div>
            </div>
            <Link
              href="/teams"
              className="text-sm font-semibold text-primary hover:underline"
            >
              View All Teams →
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
                    logoUrl: team.logo_url,
                  }}
                />
              ))}
            </div>
          ) : (
            <p className="mt-8 text-textSecondary">
              There are no approved teams yet. Create the first one!
            </p>
          )}
        </FadeIn>
      </section>

      {/* 4. Media Gallery */}
      <section className="border-b border-border">
        <div className="container-app py-16">
          <FadeIn className="flex items-center gap-3">
            <PixelJoystick className="text-secondary" />
            <h2 className="font-heading text-3xl font-bold tracking-wide text-textPrimary">
              Media Gallery
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

      {/* 5. Project Partners */}
      <section className="overflow-hidden border-b border-border">
        <FadeIn className="container-app py-16">
          <h2 className="font-heading text-3xl font-bold tracking-wide text-textPrimary">
            Project Partners
          </h2>
        </FadeIn>
        <div className="group relative mt-2 overflow-hidden pb-16 mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-marquee gap-4 group-hover:paused">
            {marqueePartners.map((partner, i) => (
              <div
                key={`${partner.name}-${i}`}
                className="flex h-24 w-44 shrink-0 items-center justify-center rounded-md border border-border bg-surface p-4"
              >
                <Image
                  src={partner.src}
                  alt={`${partner.name} logo`}
                  width={partner.width}
                  height={partner.height}
                  className="h-full w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Stats Strip */}
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <GridBackground className="opacity-50" />
        <FadeIn className="container-app relative grid grid-cols-2 divide-x divide-border py-16 sm:grid-cols-4">
          <StatCounter value={stats.countries} label="Countries" />
          <StatCounter value={stats.teams} label="Teams" />
          <StatCounter value={stats.events} label="Events" />
          <StatCounter value={stats.participants} label="Participants" />
        </FadeIn>
      </section>

      {/* 7. Bottom CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/gallery/medya-5.jpg"
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-background/55" />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/30 to-transparent" />
        </div>

        <GridBackground className="opacity-30" />
        <FadeIn className="container-app relative flex flex-col items-center gap-6 py-20 text-center">
          <RocketIcon className="animate-pulse-glow size-10 text-primary" aria-hidden="true" />
          <h2 className="font-heading text-3xl font-bold tracking-wide text-textPrimary sm:text-4xl">
            Create Your Team and Join
          </h2>
          <p className="max-w-xl text-balance text-textSecondary">
            Join the YouthEsportsArena community, apply with your team, and
            connect with young players from across Europe.
          </p>
          <ButtonLink href="/teams" size="lg" variant="gold">
            Create Your Team
            <ArrowRightIcon className="size-4" />
          </ButtonLink>
        </FadeIn>
      </section>
    </div>
  );
}
