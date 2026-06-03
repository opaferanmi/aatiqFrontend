import { Link } from "react-router-dom";
import { usePage, useSiteSettings } from "@/hooks/useApi";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Seo from "@/components/seo/Seo";

export default function About() {
  const { data: page } = usePage("about");
  const { data: settings } = useSiteSettings();

  return (
    <>
      <Seo
        title="About"
        description="AATIQ is a private dealer in museum-quality antiques, coins and vintage jewelry."
      />

      {/* Master Editorial Grid Layout */}
      <div className="container pt-28 md:pt-40 pb-24">
        
        {/* Navigation Breadcrumbs Row */}
        <div className="mb-8 lg:mb-12">
          <Breadcrumbs items={[{ label: "About" }]} />
        </div>

        {/* 12-Column Responsive Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Panel: Dynamic HTML Core (Handles your admin data cleanly) */}
          <div className="lg:col-span-8 space-y-10">
            
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#C6A96B] mb-[-24px] block">
              Established MMIV
            </p>

            {/* Custom Targeted Prose Container for Dynamic Admin HTML */}
            <article
              className="prose prose-neutral dark:prose-invert max-w-none
              
              /* Targeted Database <h1> Styling to match layout lines */
              [&_h1]:font-display [&_h1]:text-4xl [&_h1]:md:text-6xl [&_h1]:lg:text-7xl [&_h1]:leading-[1.05] [&_h1]:tracking-tight [&_h1]:text-white [&_h1]:mb-10 [&_h1]:mt-0
              
              /* Paragraph text typography styling updates */
              [&_p]:text-sm [&_p]:md:text-base [&_p]:leading-[1.85] [&_p]:text-white/70 [&_p]:font-light [&_p]:mb-6
              
              /* Dynamic Content Subheadings if introduced later */
              [&_h3]:font-display [&_h3]:text-2xl [&_h3]:tracking-wide [&_h3]:mt-12 [&_h3]:mb-4 [&_h3]:text-white"
              dangerouslySetInnerHTML={{ __html: page?.content ?? "" }}
            />
          </div>

          {/* Right Panel: Sticky Exhibition & Location Metadata Sidebar */}
          <aside className="lg:col-span-4 lg:sticky lg:top-32 lg:pl-12 lg:border-l border-[#C6A96B]/15 space-y-10 pt-4 lg:pt-2">
            
            {/* Postal/Location Block */}
            <div className="space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#C6A96B]">
                Visit
              </p>
              {settings ? (
                <address className="not-italic font-light text-sm leading-relaxed text-white/70 space-y-1">
                  <p>{settings.address}</p>
                  <p className="tracking-wide">{settings.city}, {settings.country}</p>
                  <div className="pt-2">
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-[#C6A96B] hover:text-white border-b border-[#C6A96B]/20 hover:border-white transition-all duration-300 text-xs font-mono tracking-wider"
                    >
                      {settings.email}
                    </a>
                  </div>
                </address>
              ) : (
                <p className="text-white/40 font-light text-xs italic">By Private Invitation Only</p>
              )}
            </div>

            {/* Private Scheduling Block */}
            <div className="space-y-3 pt-4 border-t border-[#C6A96B]/10 lg:border-t-0 lg:pt-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#C6A96B]">
                By Appointment
              </p>
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] border border-[#C6A96B]/40 text-[#C6A96B] px-5 py-3 hover:bg-[#C6A96B] hover:text-[#0F0F0F] transition-all duration-400 w-full lg:w-auto justify-center"
              >
                Arrange a Viewing
                <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Link>
            </div>
            
          </aside>

        </div>
      </div>
    </>
  );
}