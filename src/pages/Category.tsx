import { useEffect, useRef, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { useCategory } from "@/hooks/useApi";
import { useInfiniteProducts } from "@/hooks/useApi";
import { useFilterStore } from "@/store/filterStore";
import ProductCard from "@/components/products/ProductCard";
import { ProductGridSkeleton } from "@/components/products/ProductSkeleton";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Seo from "@/components/seo/Seo";
import { ArrowDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { create } from "zustand";

// ─── Local store for grid column preference ───────────────────────────────────
// Isolated so it doesn't pollute the global filter store
type GridCols = 2 | 4 | 6;

interface GridStore {
  cols: GridCols;
  setCols: (c: GridCols) => void;
}

const useCategoryGridStore = create<GridStore>((set) => ({
  cols: 4,
  setCols: (cols) => set({ cols }),
}));

// ─── Hero config ──────────────────────────────────────────────────────────────
const HERO_CONFIG: Record<
  string,
  { eyebrow: string; tagline: string }
> = {
  antiques: {
    eyebrow: "Islamic · Mughal · Persian",
    tagline: "Where history\nbecomes presence.",
  },
  jewelry: {
    eyebrow: "Ancient & Medieval Adornment",
    tagline: "Worn by hands\nlong turned to dust.",
  },
  coins: {
    eyebrow: "Umayyad · Abbasid · Mughal",
    tagline: "Currency of\nvanished empires.",
  },
};

// ─── Sentinel component for infinite scroll ───────────────────────────────────
interface SentinelProps {
  onVisible: () => void;
  isFetching: boolean;
  hasNextPage: boolean;
  totalLoaded: number;
  total: number;
  onLoadMore: () => void;
}

function ScrollSentinel({
  onVisible,
  isFetching,
  hasNextPage,
  totalLoaded,
  total,
  onLoadMore,
}: SentinelProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetching) {
          onVisible();
        }
      },
      { rootMargin: "300px" }, // trigger 300px before element is visible
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetching, onVisible]);

  if (!hasNextPage && totalLoaded > 0) {
    return (
      <div className="mt-16 flex flex-col items-center gap-3">
        <div className="hairline w-24" />
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {totalLoaded} of {total} pieces
        </p>
      </div>
    );
  }

  return (
    <div ref={ref} className="mt-16 flex flex-col items-center gap-4">
      {isFetching && (
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
          <span className="font-mono text-[10px] uppercase tracking-widest">
            Loading more pieces
          </span>
        </div>
      )}
      {!isFetching && hasNextPage && (
        <button
          onClick={onLoadMore}
          className="font-mono text-[11px] uppercase tracking-widest border border-foreground/40 px-6 py-3 hover:border-foreground hover:bg-foreground hover:text-background transition-all duration-300"
        >
          Load more pieces
        </button>
      )}
    </div>
  );
}

// ─── Grid toggle button ───────────────────────────────────────────────────────
function GridToggle({
  cols,
  onChange,
}: {
  cols: GridCols;
  onChange: (c: GridCols) => void;
}) {
  const options: { value: GridCols; label: string; title: string }[] = [
    { value: 2, label: "⊞⊞", title: "2-column view" },
    { value: 4, label: "⊞⊞⊞⊞", title: "4-column view" },
    { value: 6, label: "⊞⊞⊞⊞⊞⊞", title: "6-column view" },
  ];

  return (
    <div className="hidden lg:flex items-center border border-hairline">
      {options.map((opt, i) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          title={opt.title}
          className={cn(
            "px-3 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors duration-300",
            i < options.length - 1 && "border-r border-hairline",
            cols === opt.value
              ? "bg-gold/10 text-gold border-gold"
              : "text-foreground/60 hover:text-gold",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Category() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading: catLoading } = useCategory(slug);
  const { sort } = useFilterStore();
  const set = useFilterStore((s) => s.set);
  const { cols, setCols } = useCategoryGridStore();

  // Set category filter in store (for breadcrumbs / other pages that read it)
  useEffect(() => {
    if (data?.category._id) {
      set("categoryId", data.category._id);
    }
    return () => set("categoryId", undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.category._id]);

  const {
    data: infiniteData,
    isLoading: pLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteProducts({
    categoryId: data?.category._id,
    sort,
    limit: 40, // initial + per-batch
  });

  // Flatten all pages into one array
  const allProducts =
    infiniteData?.pages.flatMap((p) => p.products) ?? [];
  const pagination = infiniteData?.pages[infiniteData.pages.length - 1]?.pagination;
  const total = pagination?.total ?? 0;

  const heroConf = HERO_CONFIG[slug ?? ""] ?? {
    eyebrow: "The Collection",
    tagline: "Pieces from another era.",
  };

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (catLoading || !data) {
    return (
      <div className="min-h-screen">
        <div className="h-[70vh] bg-muted/30 animate-pulse" />
        <div className="container pt-16">
          <ProductGridSkeleton />
        </div>
      </div>
    );
  }

  const { category, subcategories } = data;

  return (
    <>
      <Seo
        title={category.name}
        description={category.description}
        image={category.image}
      />

      {/* 
          CINEMATIC HERO
       */}
      <section className="relative h-fit min-h-[540px] md:h-screen max-h-[900px] mt-20 md:mt-10 overflow-hidden">
        {category.image ? (
          <img
            src={category.image}
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover ken-burns"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-muted via-background to-muted/50" />
        )}

        <div className="absolute inset-0 flex flex-col justify-end container pb-14 md:pb-20">
          <div className="mb-8 inline-flex">
            <div className="bg-black/40 backdrop-blur-sm rounded-sm px-4 py-2.5 border border-white/20">
              <Breadcrumbs
                items={[
                  { label: "Collections", to: "/categories" },
                  { label: category.name },
                ]}
                textColor="text-white/90"
                hoverColor="text-gold"
              />
            </div>
          </div>

          <div className="mt-6 max-w-2xl">
            <p className="text-gold/95 mb-4 animate-fade-in font-mono text-[11px] uppercase tracking-widest">
              {heroConf.eyebrow}
            </p>
            <h1
              className="font-display text-[clamp(3rem,7vw,5.5rem)] text-white leading-[0.92] line-clamp-3 tracking-tight whitespace-pre-line animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              {heroConf.tagline}
            </h1>
            <p
              className="mt-6 text-base md:text-lg text-white max-w-lg leading-relaxed animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              {category.description}
            </p>
          </div>

          <div
            className="mt-8 flex items-center gap-6 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex flex-col">
              <span className="font-display text-2xl text-white">
                {category.productCount ?? 0}
              </span>
              <span className="eyebrow text-white/80">Pieces</span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="flex flex-col">
              <span className="font-display text-2xl text-white">
                {subcategories?.length ?? 0}
              </span>
              <span className="eyebrow text-white/80">Sub-collections</span>
            </div>
            <div className="ml-auto hidden md:flex flex-col items-center gap-1.5 text-white/50">
              <span className="font-mono text-[9px] uppercase tracking-widest">
                Scroll
              </span>
              <ArrowDown
                className="h-3.5 w-3.5 animate-bounce"
                strokeWidth={1.5}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 
          SUBCATEGORY FILTERS
       */}
      {subcategories && subcategories.length > 0 && (
        <section className="container pt-12 pb-0">
          <div className="flex items-center gap-3 mb-6">
            <span className="eyebrow">Filter by sub-collection</span>
            <div className="hairline flex-1" />
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="font-mono text-[11px] uppercase tracking-widest border border-gold bg-gold/10 text-gold px-4 py-2.5 transition-colors hover:bg-gold/20">
              All{" "}
              <span className="opacity-60 ml-1">
                {String(category.productCount ?? 0).padStart(2, "0")}
              </span>
            </button>
            {subcategories.map((s) => (
              <Link
                key={s._id}
                to={`/categories/${category.slug}/${s.slug}`}
                className="font-mono text-[11px] uppercase tracking-widest border border-hairline px-4 py-2.5 hover:border-gold hover:text-gold transition-colors"
              >
                {s.name}{" "}
                <span className="opacity-40 ml-1">
                  {String(s.productCount ?? 0).padStart(2, "0")}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 
          PRODUCTS GRID
       */}
      <section className="container py-12 md:py-16">
        {/* Section header with grid toggle */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="eyebrow-gold mb-1.5">{category.name}</p>
            <h2 className="font-display text-3xl md:text-4xl">
              The Collection
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {total > 0 && (
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground hidden md:block">
                {total} pieces
              </p>
            )}
            {/* Desktop grid toggle */}
            <GridToggle cols={cols} onChange={setCols} />
          </div>
        </div>

        <div className="hairline mb-10" />

        {/* Loading skeleton — first load only */}
        {pLoading && <ProductGridSkeleton />}

        {/* Empty state */}
        {!pLoading && allProducts.length === 0 && (
          <div className="py-24 text-center">
            <p className="font-display italic text-3xl text-muted-foreground/50">
              No pieces currently in this collection.
            </p>
            <p className="eyebrow mt-4">
              New acquisitions are added regularly.
            </p>
            <Link
              to="/enquiry"
              className="inline-flex mt-8 font-mono text-[11px] uppercase tracking-widest border border-foreground/60 px-5 py-3 hover:bg-foreground hover:text-background transition-colors"
            >
              Submit an enquiry
            </Link>
          </div>
        )}

        {/* Product grid */}
        {!pLoading && allProducts.length > 0 && (
          <>
            {/* Desktop: col toggle controlled, Tablet: 3 cols, Mobile: 2 cols */}
            <div
              className={cn(
                "grid gap-x-5 gap-y-10",
                // Mobile always 2 cols
                "grid-cols-2",
                // Tablet: 3 cols
                "md:grid-cols-3",
                // Desktop: driven by toggle
                cols === 2 && "lg:grid-cols-2",
                cols === 4 && "lg:grid-cols-4",
                cols === 6 && "lg:grid-cols-6",
              )}
            >
              {allProducts.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>

            {/* Infinite scroll sentinel + load more fallback */}
            <ScrollSentinel
              onVisible={handleLoadMore}
              isFetching={isFetchingNextPage}
              hasNextPage={!!hasNextPage}
              totalLoaded={allProducts.length}
              total={total}
              onLoadMore={handleLoadMore}
            />
          </>
        )}
      </section>

      {/* 
          BOTTOM CTA STRIP
       */}
      <section className="border-t border-hairline">
        <div className="container py-16 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="eyebrow-gold mb-3">Looking for something specific?</p>
            <h3 className="font-display text-3xl md:text-4xl leading-tight">
              We source privately.
              <br />
              Tell us what you seek.
            </h3>
          </div>
          <div className="md:text-right">
            <Link
              to="/enquiry"
              className="inline-flex items-center font-mono text-[11px] uppercase tracking-widest border border-foreground/80 px-6 py-3.5 hover:bg-foreground hover:text-background transition-colors"
            >
              Submit an enquiry →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}