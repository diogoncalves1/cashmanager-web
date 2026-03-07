import Image from "next/image";
import Link from "next/link";

const linkGroups = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Dashboard", href: "#dashboard" },
      { label: "Security", href: "#trust" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg">
                <Image
                  src="/images/logo/logo-transparent.png"
                  alt="Logo"
                  width={200}
                  height={100}
                />
              </div>
              <span className="text-lg font-semibold tracking-tight text-foreground">
                Cash Manager
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Take full control of your financial life with powerful tools for tracking, managing,
              and collaborating on your finances.
            </p>
            {/* Social icons */}
            <div className="mt-6 flex gap-4">
              {["X", "GH", "LI"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="flex size-8 items-center justify-center rounded-lg border border-border/50 text-xs font-medium text-muted-foreground transition-colors hover:border-accent/30 hover:text-foreground"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {linkGroups.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-semibold text-foreground">{group.title}</p>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border/40 pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            {new Date().getFullYear() + " Cash Manager. All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  );
}
