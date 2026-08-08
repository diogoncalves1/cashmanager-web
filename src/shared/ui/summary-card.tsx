import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { cn } from "@/shared/utils";

interface SummaryCardStat {
  label: string;
  value: string;
  valueClassName?: string;
}

interface SummaryCardProps {
  href: string;
  /** Ícone pequeno num "chip" colorido, ao lado do título */
  icon?: ReactNode;
  iconClassName?: string;
  /** Título + badge de estado, etc. */
  header: ReactNode;
  progress: number;
  progressColorClassName?: string;
  /** Conteúdo acima da barra de progresso (ex: label + percentagem) */
  progressTop?: ReactNode;
  /** Conteúdo abaixo da barra de progresso (opcional) */
  progressBottom?: ReactNode;
  /** Estatísticas separadas por divisores (ex: Total / Pago / Em falta) */
  stats?: SummaryCardStat[];
  /** Conteúdo fixo no fundo do card */
  footer?: ReactNode;
  className?: string;
}

export function SummaryCard({
  href,
  icon,
  iconClassName,
  header,
  progress,
  progressColorClassName = "bg-accent",
  progressTop,
  progressBottom,
  stats,
  footer,
  className,
}: SummaryCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-md bg-card p-5",
        "shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:border-accent/30",
        className
      )}
    >
      {/* Barra de destaque no topo, cor ligada ao estado */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1 opacity-80 transition-opacity duration-300 group-hover:opacity-100",
          progressColorClassName
        )}
      />

      <div className="mb-4 mt-1 flex items-start gap-3">
        {icon && (
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-xl",
              iconClassName ?? "bg-accent/10 text-accent"
            )}
          >
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1">{header}</div>
      </div>

      <div className="mb-5 space-y-2.5">
        {progressTop}
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-700 ease-out",
              progressColorClassName
            )}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        {progressBottom}
      </div>

      {stats && stats.length > 0 && (
        <div className="flex items-stretch justify-between pt-4 border-t border-border/70">
          {stats.map((stat, i) => (
            <Fragment key={stat.label}>
              <div className="flex-1 text-center">
                <div className="mb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  {stat.label}
                </div>
                <div
                  className={cn(
                    "text-sm font-semibold tabular-nums",
                    stat.valueClassName ?? "text-foreground"
                  )}
                >
                  {stat.value}
                </div>
              </div>
              {i < stats.length - 1 && <div className="mx-2 w-px bg-border" />}
            </Fragment>
          ))}
        </div>
      )}

      {footer && (
        <div className="mt-auto pt-4 border-t border-border/70 text-xs text-muted-foreground">
          {footer}
        </div>
      )}
    </Link>
  );
}
