import { Building2, Mail, ArrowUpRight } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

interface FooterLink {
  label: string;
  href: string;
}

interface SocialLink extends FooterLink {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

/**
 * Lucide removed brand/logo icons (GitHub, X/Twitter, LinkedIn) in v1.0 —
 * see https://github.com/lucide-icons/lucide/issues/2792
 * These are small inline substitutes so no extra package is needed.
 * Swap for @icons-pack/react-simple-icons if you'd rather use a maintained set.
 */
function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.33.95.1-.74.4-1.25.72-1.53-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.08.78 2.18 0 1.58-.01 2.85-.01 3.24 0 .3.21.66.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.9 2H22l-7.2 8.2L23 22h-6.8l-5.3-6.9L4.6 22H1.5l7.7-8.8L1 2h6.9l4.8 6.3L18.9 2Zm-2.4 18h1.9L8.6 4H6.6l9.9 16Z" />
    </svg>
  );
}

function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5ZM3 9.98h4V21H3V9.98Zm7 0h3.83v1.51h.05c.53-1 1.84-2.06 3.78-2.06 4.05 0 4.8 2.67 4.8 6.14V21h-4v-4.94c0-1.18-.02-2.7-1.65-2.7-1.65 0-1.9 1.29-1.9 2.62V21h-4V9.98Z" />
    </svg>
  );
}

const PRODUCT_LINKS: FooterLink[] = [
  { label: "Attendance", href: "#features" },
  { label: "Leave management", href: "#features" },
  { label: "Payroll", href: "#features" },
  { label: "Projects & tasks", href: "#features" },
  { label: "Announcements", href: "#features" },
];

const COMPANY_LINKS: FooterLink[] = [
  { label: "About", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Contact", href: "#" },
  { label: "Blog", href: "#" },
];

const LEGAL_LINKS: FooterLink[] = [
  { label: "Privacy policy", href: "#" },
  { label: "Terms of service", href: "#" },
  { label: "Security", href: "#" },
];

const SOCIALS: SocialLink[] = [
  { icon: GithubIcon, href: "#", label: "GitHub" },
  { icon: XIcon, href: "#", label: "Twitter" },
  { icon: LinkedinIcon, href: "#", label: "LinkedIn" },
  { icon: Mail, href: "mailto:hello@som.app", label: "Email" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div className="space-y-5 max-w-sm">

            
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Building2 className="h-4 w-4" />
              </div>
              <span className="font-bold text-foreground tracking-tight">SOM</span>
            </div>


            <p className="text-sm leading-relaxed text-muted-foreground">
              Smart Office Management brings attendance, leave, payroll, and
              project tracking into one operational dashboard — so teams spend
              less time on admin and more time on work that matters.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <FooterColumn title="Product" links={PRODUCT_LINKS} />
          <FooterColumn title="Company" links={COMPANY_LINKS} />
          <FooterColumn title="Legal" links={LEGAL_LINKS} />
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} SOM — Smart Office Management. All rights reserved.</p>
          <a
            href="#"
            className="inline-flex items-center gap-1 font-medium text-foreground transition-colors hover:text-primary"
          >
            Status: all systems operational
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-sm text-foreground/80 transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}