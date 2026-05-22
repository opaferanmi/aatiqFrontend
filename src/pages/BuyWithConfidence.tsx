import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Shield,
  RotateCcw,
  Award,
  Package,
  Lock,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Seo from "@/components/seo/Seo";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

// Types
type TabId = "guarantee" | "coins" | "jewellery" | "antiques";

interface Tab {
  id: TabId;
  label: string;
  shortLabel?: string;
}

// Tab config
const TABS: Tab[] = [
  { id: "guarantee", label: "125% Guarantee", shortLabel: "Guarantee" },
  { id: "coins", label: "Coin Acquisition", shortLabel: "Coins" },
  { id: "jewellery", label: "Jewellery Acquisition", shortLabel: "Jewellery" },
  { id: "antiques", label: "Antique Acquisition", shortLabel: "Antiques" },
];

// Shared card component
function PolicyCard({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ElementType;
  title: string;
  body: string;
}) {
  return (
    <div className="group border border-[#C6A96B]/15 p-8 hover:border-[#C6A96B]/40 hover:bg-[#C6A96B]/[0.02] transition-all duration-500 space-y-4">
      <div className="w-10 h-10 border border-[#C6A96B]/20 flex items-center justify-center group-hover:border-[#C6A96B]/60 transition-colors duration-300">
        <Icon
          className="h-4 w-4 text-[#C6A96B]/80 group-hover:text-[#C6A96B] transition-colors"
          strokeWidth={1}
        />
      </div>
      <h3 className="font-display text-xl tracking-wide">{title}</h3>
      <p className="font-light text-sm leading-relaxed text-white/60 group-hover:text-white/80 transition-colors">
        {body}
      </p>
    </div>
  );
}

// Acquisition step component
function AcquisitionStep({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-6 md:gap-10 group border-b border-[#C6A96B]/10 pb-8 pt-2 last:border-0">
      <div className="shrink-0 pt-1">
        <span className="font-mono text-[12px] tracking-widest text-[#C6A96B]/60 group-hover:text-[#C6A96B] transition-colors duration-300">
          {number} //
        </span>
      </div>
      <div className="space-y-2">
        <h4 className="font-display text-lg md:text-xl tracking-wide group-hover:text-[#C6A96B] transition-colors duration-300">
          {title}
        </h4>
        <p className="font-light text-sm leading-relaxed text-white/60">
          {body}
        </p>
      </div>
    </div>
  );
}

// Shared Acquisition Tab Layout──
function AcquisitionTab({
  eyebrow,
  headline,
  heroSubtitle,
  heroBg,
  intro,
  steps,
  qualities,
  cta,
}: {
  eyebrow: string;
  headline: string;
  heroSubtitle: string;
  heroBg: string;
  intro: string;
  steps: { title: string; body: string }[];
  qualities: { label: string; value: string }[];
  cta: { label: string; to: string };
}) {
  return (
    <div className="animate-fade-in">
      {/* ── Editorial Asymmetric Hero */}
      <div className="relative min-h-[50vh] flex items-center border-b border-[#C6A96B]/10 overflow-hidden bg-[#0A0A0A]">
        <div className="absolute inset-0 md:w-1/2 md:left-1/2">
          <img
            src={heroBg}
            alt={headline}
            className="h-full w-full object-cover brightness-[1] saturate-[1]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent hidden md:block" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/80 via-transparent to-[#0A0A0A] md:hidden" />
        </div>

        <div className="relative container mx-auto px-6 md:px-12 py-16 md:py-24 grid grid-cols-1 md:grid-cols-12 w-full">
          <div className="md:col-span-6 lg:col-span-5 space-y-5">
            <p className="font-mono text-[12px] uppercase tracking-[0.4em] text-[#C6A96B]">
              — {eyebrow}
            </p>
            <h2 className="font-display text-3xl md:text-5xl tracking-tight text-white leading-[1.05]">
              {headline}
            </h2>
            <p className="font-light text-sm md:text-base text-white/60 leading-relaxed max-w-md">
              {heroSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* ── Balanced Split Section: Intro Prose & Attributes Table */}
      <div className="container mx-auto px-6 md:px-12 py-20 border-b border-[#C6A96B]/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          <div className="lg:col-span-6 space-y-4">
            <p className="font-mono text-[12px] uppercase tracking-[0.3em] text-[#C6A96B]">
              — Our Approach
            </p>
            <p className="font-light text-base md:text-lg leading-relaxed text-white/80">
              {intro}
            </p>
          </div>

          <div className="lg:col-span-6 w-full">
            <div className="border border-[#C6A96B]/15 bg-[#C6A96B]/[0.01] divide-y divide-[#C6A96B]/10">
              {qualities.map((q) => (
                <div
                  key={q.label}
                  className="px-6 py-4 grid grid-cols-3 items-baseline gap-4"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40 col-span-1">
                    {q.label}
                  </span>
                  <span className="font-light text-sm text-white/80 col-span-2 text-right lg:text-left">
                    {q.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Rearranged Process Grid (Side-by-Side Balance) */}
      <div className="container mx-auto px-6 md:px-12 py-20 border-b border-[#C6A96B]/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit space-y-4">
            <p className="font-mono text-[12px] uppercase tracking-[0.3em] text-[#C6A96B]">
              — The Process
            </p>
            <h3 className="font-display text-3xl md:text-4xl tracking-tight leading-none">
              From Source <br className="hidden lg:block" /> to Collection
            </h3>
          </div>

          <div className="lg:col-span-8 space-y-6">
            {steps.map((step, i) => (
              <AcquisitionStep
                key={step.title}
                number={String(i + 1).padStart(2, "0")}
                title={step.title}
                body={step.body}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Refined Embedded Section Call-to-Action */}
      <div className="container mx-auto px-6 md:px-12 py-16">
        <div className="border border-[#C6A96B]/20 p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 bg-[#0B0B0B] relative overflow-hidden">
          <div className="space-y-2 relative z-10">
            <p className="font-mono text-[12px] uppercase tracking-[0.3em] text-[#C6A96B]">
              — Enquire
            </p>
            <h4 className="font-display text-2xl text-white tracking-wide">
              Interested in a specific piece?
            </h4>
          </div>
          <div className="flex flex-wrap gap-4 relative z-10 w-full md:w-auto">
            <Link
              to={cta.to}
              className="inline-flex items-center justify-center gap-2 font-mono text-[12px] uppercase tracking-[0.2em] border border-[#C6A96B]/40 text-[#C6A96B] px-6 py-3.5 hover:bg-[#C6A96B] hover:text-[#0F0F0F] transition-all duration-300 w-full sm:w-auto"
            >
              {cta.label}
              <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
            </Link>
            <Link
              to="/enquiry"
              className="inline-flex items-center justify-center gap-2 font-mono text-[12px] uppercase tracking-[0.2em] border border-white/10 text-white/60 px-6 py-3.5 hover:border-white/30 hover:text-white transition-all duration-300 w-full sm:w-auto"
            >
              Private Enquiry
              <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tab: 125% Guarantee──
function GuaranteeTab() {
  return (
    <div>
      {/* Hero statement */}
      <div className="bg-[#0A0A0A] py-16 md:py-24 relative overflow-hidden border-b border-[#C6A96B]/10">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(198,169,107,0.5) 39px, rgba(198,169,107,0.5) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(198,169,107,0.5) 39px, rgba(198,169,107,0.5) 40px)",
          }}
        />
        <div className="relative container mx-auto px-6 md:px-12 text-center max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#C6A96B] mb-5">
            — Our Commitment to You
          </p>
          <h2
            className="font-display leading-[0.92] tracking-tight text-white mb-8"
            style={{ fontSize: "clamp(2.8rem, 6vw, 5.5rem)" }}
          >
            125% Guarantee
          </h2>
          <p className="font-light text-white/70 leading-[1.85] text-base md:text-lg">
            Purchase with complete confidence. Return any acquisition in its
            original condition for full credit on comparable items from our
            gallery — plus 5% appreciation annually for up to five years
            following purchase. That is a guaranteed 25% appreciation in value.
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="container mx-auto px-6 md:px-12 py-20 border-b border-[#C6A96B]/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {[
            {
              step: "01",
              title: "Full Credit Return",
              body: "Return any piece in its original condition and receive full store credit toward a comparable or greater acquisition from our curated collection.",
            },
            {
              step: "02",
              title: "5% Annual Appreciation",
              body: "Your credit accrues a 5% appreciation each year for up to five years — rewarding your patience and dedication to building a lasting collection.",
            },
            {
              step: "03",
              title: "Guaranteed 25% Value Growth",
              body: "Held to full term, your guarantee translates into a confirmed 25% appreciation in value — a promise unmatched in the antiquities market.",
            },
            {
              step: "04",
              title: "No Risk, Total Trust",
              body: "Every piece we offer is authenticated and documented. Our guarantee is not a policy — it is the foundation of every relationship we build.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="border border-[#C6A96B]/15 p-8 hover:border-[#C6A96B]/40 transition-all duration-400 group bg-[#0A0A0A]"
            >
              <p className="font-mono text-[12px] uppercase tracking-[0.3em] text-[#C6A96B]/60 mb-4">
                {item.step}
              </p>
              <h4 className="font-display text-2xl leading-snug mb-3 group-hover:text-[#C6A96B] transition-colors duration-300">
                {item.title}
              </h4>
              <p className="font-light text-sm leading-[1.85] text-white/70">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Services grid */}
      <div className="container mx-auto px-6 md:px-12 py-20">
        <div className="mb-12 border-b border-[#C6A96B]/20 pb-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#C6A96B] mb-3">
            — Additional Assurances
          </p>
          <h3 className="font-display text-2xl md:text-4xl tracking-tight">
            Every Purchase, Protected
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <PolicyCard
            icon={Award}
            title="Authenticity Warranty"
            body="Every piece is guaranteed authentic and covered by our comprehensive provenance warranty. If authenticity is ever questioned, we stand fully behind our documentation."
          />
          <PolicyCard
            icon={RotateCcw}
            title="Returns & Exchanges"
            body="Return any item in original condition for full store credit, with shipping costs excluded. No questions, no complications — your satisfaction is paramount."
          />
          <PolicyCard
            icon={Package}
            title="Professional Packing & Shipping"
            body="All items are professionally packed and fully insured for secure worldwide delivery by our trusted carrier network. White-glove handling from our gallery to your door."
          />
          <PolicyCard
            icon={Shield}
            title="Security & Privacy"
            body="Your privacy and security are protected through advanced encryption and strict confidentiality practices. Your collection is your business alone."
          />
          <PolicyCard
            icon={CreditCard}
            title="Payment Options"
            body="We accept all major credit cards, bank transfers, and bespoke payment arrangements for significant acquisitions. Discreet and flexible for your convenience."
          />
          <PolicyCard
            icon={Lock}
            title="On Approval Policy"
            body="Items can be shipped for in-person examination before committing to a purchase — allowing you to experience the piece before it becomes part of your collection."
          />
        </div>
      </div>
    </div>
  );
}

// Tab: Coin Acquisition
function CoinsTab() {
  return (
    <AcquisitionTab
      eyebrow="Numismatic Excellence"
      headline="Coin Acquisition"
      heroSubtitle="From ancient empires to forgotten dynasties — our numismatic acquisitions are sourced with uncompromising rigour and authenticated by specialists."
      heroBg="http://res.cloudinary.com/dtcbirvxc/image/upload/v1776990622/categories/iir8kf1fnnlrqiyytmod.jpg"
      intro={`Our numismatic collection spans millennia of monetary history — from pre-Islamic Sassanid dirhams to Mughal gold mohurs, Ottoman sultani, and the silver of the Umayyad caliphate. Each coin is assessed for strike quality, die alignment, metal composition, and provenance chain before being offered.`}
      steps={[
        {
          title: "Source & Authentication",
          body: "Every coin is traced to its origin through die studies, metallurgical analysis, and cross-referencing with established numismatic catalogues. We work with specialists in Islamic, Byzantine, and ancient coinage.",
        },
        {
          title: "Grading & Condition Report",
          body: "Each piece receives a detailed condition report covering strike, surface preservation, lustre, and any tooling or cleaning. We never overgrade — our assessments are conservative and honest.",
        },
        {
          title: "Provenance Documentation",
          body: "We compile full acquisition histories where available, referencing auction records, prior collections, and scholarly literature. Coins with distinguished provenance are noted in detail.",
        },
        {
          title: "Presentation & Delivery",
          body: "Every coin is housed in archival-quality holders with full documentation, photography, and a certificate of authenticity signed by our senior numismatist.",
        },
      ]}
      qualities={[
        { label: "Period Coverage", value: "Pre-Islamic to 19th Century" },
        {
          label: "Geographic Scope",
          value: "Islamic World, Persia, Central Asia, India",
        },
        { label: "Minimum Standard", value: "Fine condition or higher" },
        { label: "Authentication", value: "Specialist-reviewed, documented" },
      ]}
      cta={{ label: "Browse Coins", to: "/categories/coins" }}
    />
  );
}

// Tab: Jewellery Acquisition
function JewelleryTab() {
  return (
    <AcquisitionTab
      eyebrow="Adornment Through the Ages"
      headline="Jewellery Acquisition"
      heroSubtitle="Mughal kundan, Persian enamel, and Ottoman gold — each piece a testament to the goldsmiths who shaped the aesthetic identity of entire civilizations."
      heroBg="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&q=95&auto=format&fit=crop"
      intro={`Our jewellery acquisitions focus on the highest expressions of Islamic and South Asian craftsmanship — pieces that were made not merely to adorn, but to declare power, devotion, and beauty. We prioritize original condition, intact settings, and strong provenance.`}
      steps={[
        {
          title: "Gemological Assessment",
          body: "Every gemstone is assessed for origin, treatment status, and quality. We work with independent gemologists to provide accurate characterisations — no embellishment, no guesswork.",
        },
        {
          title: "Metalwork & Technique Analysis",
          body: "We document the goldsmithing technique — whether kundan, meenakari, filigree, or repoussé — and cross-reference with period-appropriate comparanda to confirm age and origin.",
        },
        {
          title: "Condition & Integrity",
          body: "Pieces are assessed for completeness, structural integrity, and the authenticity of any later additions or repairs. Alterations are disclosed fully and factored into presentation.",
        },
        {
          title: "Archive & Certificate",
          body: "Each piece is photographed in archival resolution, measured, weighed, and issued a full certificate of authentication with comparative references from museum collections.",
        },
      ]}
      qualities={[
        { label: "Traditions", value: "Mughal, Ottoman, Persian, Deccan" },
        { label: "Materials", value: "Gold, silver, enamel, precious stones" },
        { label: "Era Focus", value: "16th – early 20th Century" },
        {
          label: "Documentation",
          value: "Full gemological & provenance report",
        },
      ]}
      cta={{ label: "Browse Jewellery", to: "/categories/jewellery" }}
    />
  );
}

// Tab: Antique Acquisition──
function AntiquesTab() {
  return (
    <AcquisitionTab
      eyebrow="Objects of Historic Significance"
      headline="Antique Acquisition"
      heroSubtitle="Ceramics, metalwork, textiles, manuscripts, and arms — the full material culture of the Islamic world, sourced from collectors and institutions across four continents."
      heroBg="http://res.cloudinary.com/dtcbirvxc/image/upload/v1776990412/categories/pidg7bvb90ddyhba8mvj.webp"
      intro={`Our antique acquisitions span the breadth of Islamic material culture — from Iznik faience and Safavid lacquerwork to pre-Islamic bronzes, Khorasan metalwork, and Mamluk inlaid brasses. Each object is acquired with deliberate selectivity, favouring rarity, condition, and scholarly significance.`}
      steps={[
        {
          title: "Object Identification & Dating",
          body: "We consult specialist literature, auction archives, and museum collection databases to precisely attribute objects by period, region, and workshop where possible.",
        },
        {
          title: "Condition Survey",
          body: "A full condition report is prepared noting any restoration, repainting, or structural intervention. We employ UV examination and X-ray analysis where necessary.",
        },
        {
          title: "Provenance Research",
          body: "We trace ownership history as completely as records allow, referencing prior sale catalogues, estate inventories, and institutional deaccessions to build a transparent history.",
        },
        {
          title: "Scholarly Documentation",
          body: "Significant pieces are accompanied by detailed catalogue entries referencing comparative examples in major collections — providing the scholarly context that underpins long-term value.",
        },
      ]}
      qualities={[
        {
          label: "Categories",
          value: "Ceramics, Metalwork, Textiles, Arms, Manuscripts",
        },
        {
          label: "Cultures",
          value: "Islamic, Persian, Mughal, Pre-Islamic Near East",
        },
        {
          label: "Source Standards",
          value: "Established collections, documented export",
        },
        {
          label: "Analysis",
          value: "UV, X-ray, thermoluminescence where applicable",
        },
      ]}
      cta={{ label: "Browse Antiques", to: "/categories/antiques" }}
    />
  );
}

// Main Page──
export default function BuyWithConfidence() {
  const [activeTab, setActiveTab] = useState<TabId>("guarantee");

  return (
    <div className="bg-[#0F0F0F] text-white min-h-screen font-sans selection:bg-[#C6A96B]/30 selection:text-white">
      <Seo
        title="Buy with Confidence"
        description="Our 125% guarantee, acquisition standards for coins, jewellery, and antiques — every purchase backed by decades of expertise and authentic provenance."
      />

      {/* ── Page Hero */}
      <section className="relative h-[90vh] min-h-[350px] w-full flex items-end border-b border-[#C6A96B]/10">
        <div className="absolute inset-0">
          <img
            src="http://res.cloudinary.com/dtcbirvxc/image/upload/v1776990412/categories/pidg7bvb90ddyhba8mvj.webp"
            alt="Buy with Confidence"
            className="absolute inset-0 h-full w-full object-cover scale-[1.02] brightness-[0.8] contrast-[1.1] saturate-[1.2]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] to-transparent" />
        </div>

        <div className="relative container flex flex-col gap-10 align-top justify-start mx-auto px-6 md:px-12 pb-12 md:pb-16 md:mb-20 mb-6">
           <Breadcrumbs items={[{ label: "Buy with Confidence" }]} />
          {/* <p className="font-mono text-[12px] uppercase tracking-[0.4em] text-[#C6A96B] mb-3">
            — Trust &amp; Assurance
          </p> */}
          <h1 className="font-display  text-4xl md:text-6xl lg:text-7xl tracking-tight text-white leading-none">
            Buy with Confidence
          </h1>
            <p className="font-light text-base md:text-lg leading-relaxed  text-white/80 mx-auto">
              We are committed to building a long and rewarding relationship
              with each of our clients. Whether you are acquiring an important
              antique, a rare coin, or an exceptional jewel — you can do so with
              complete confidence, backed by our incomparable guarantee and the
              exemplary standards that have defined our gallery for decades.
            </p>
        </div>
      </section>

      {/* ── Tab Bar Navigation */}
      <div className="sticky top-0 z-40 bg-[#0F0F0F]/90 backdrop-blur-md border-b border-[#C6A96B]/10">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex overflow-x-auto scrollbar-none gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "shrink-0 font-mono text-[12px] md:text-xs uppercase tracking-[0.25em] py-5 px-4 md:px-6 border-b transition-all duration-300 whitespace-nowrap",
                  activeTab === tab.id
                    ? "border-[#C6A96B] text-[#C6A96B]"
                    : "border-transparent text-white/40 hover:text-white/80",
                )}
              >
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel ?? tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Content Container Area */}
      <main className="bg-[#0A0A0A]">
        {activeTab === "guarantee" && <GuaranteeTab />}
        {activeTab === "coins" && <CoinsTab />}
        {activeTab === "jewellery" && <JewelleryTab />}
        {activeTab === "antiques" && <AntiquesTab />}
      </main>

      {/* ── Global Bottom Dialogue/Footer */}
      <section className="py-24 border-t border-[#C6A96B]/10 bg-[#0F0F0F] text-center">
        <div className="container mx-auto px-6 max-w-xl space-y-6">
          <p className="font-mono text-[12px] uppercase tracking-[0.3em] text-[#C6A96B]">
            — Dialogue
          </p>
          <h2 className="font-display text-3xl md:text-5xl tracking-tight text-white leading-none">
            We Are Here for You
          </h2>
          <p className="font-light text-white/60 text-sm md:text-base leading-relaxed">
            Every enquiry is handled with discretion, care, and the full weight
            of our expertise. Reach out and we will respond personally.
          </p>
          <Link
            to="/enquiry"
            className="group inline-flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.2em] border border-[#C6A96B]/40 text-[#C6A96B] px-8 py-4 hover:bg-[#C6A96B] hover:text-[#0F0F0F] transition-all duration-300"
          >
            Send an Enquiry
            <ArrowRight
              className="h-3 w-3 group-hover:translate-x-1 transition-transform"
              strokeWidth={1.5}
            />
          </Link>
        </div>
      </section>

      <style>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
