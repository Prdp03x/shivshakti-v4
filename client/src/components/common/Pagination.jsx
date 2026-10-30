import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useState } from "react";

const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const num = (n) => Number(n).toLocaleString("en-IN");

// Always returns at most 7 slots so the bar keeps a steady width:
// [1] [2] [3] [4] [5] … [15]  |  [1] … [6] [7] [8] … [15]  |  [1] … [11] [12] [13] [14] [15]
export function pageItems(page, totalPages) {
  if (totalPages <= 7) return range(1, totalPages);
  if (page <= 4) return [...range(1, 5), "gap-next", totalPages];
  if (page >= totalPages - 3) return [1, "gap-prev", ...range(totalPages - 4, totalPages)];
  return [1, "gap-prev", page - 1, page, page + 1, "gap-next", totalPages];
}

export default function Pagination({
  page, totalPages, total, pageSize, onChange,
  disabled = false, showSummary = true, label = "bills", className = "",
}) {
  const [jump, setJump] = useState("");
  if (!total) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const go = (n) => {
    const target = Math.min(totalPages, Math.max(1, n));
    if (!disabled && target !== page) onChange(target);
  };
  const submitJump = (e) => {
    e.preventDefault();
    const n = parseInt(jump, 10);
    if (Number.isFinite(n)) go(n);
    setJump("");
  };

  return (
    <nav className={`pagination ${className}`.trim()} aria-label="Pagination">
      {showSummary && (
        <p className="pager-summary">
          Showing <strong>{num(from)}–{num(to)}</strong> of <strong>{num(total)}</strong> {label}
        </p>
      )}
      {totalPages > 1 && (
        <div className="pager-controls">
          <button className="pager-btn" onClick={() => go(1)} disabled={disabled || page === 1} aria-label="First page" title="First page"><ChevronsLeft size={16} /></button>
          <button className="pager-btn" onClick={() => go(page - 1)} disabled={disabled || page === 1} aria-label="Previous page" title="Previous page"><ChevronLeft size={16} /></button>

          <div className="pager-pages">
            {pageItems(page, totalPages).map((item) =>
              typeof item === "number" ? (
                <button
                  key={item}
                  className={`pager-btn pager-num${item === page ? " is-active" : ""}`}
                  onClick={() => go(item)}
                  disabled={disabled}
                  aria-current={item === page ? "page" : undefined}
                  aria-label={`Page ${item}`}
                >{num(item)}</button>
              ) : (
                <button
                  key={item}
                  className="pager-btn pager-gap"
                  onClick={() => go(item === "gap-next" ? page + 5 : page - 5)}
                  disabled={disabled}
                  aria-label={item === "gap-next" ? "Forward 5 pages" : "Back 5 pages"}
                  title={item === "gap-next" ? "Forward 5 pages" : "Back 5 pages"}
                >…</button>
              )
            )}
          </div>
          <span className="pager-mobile">Page {num(page)} / {num(totalPages)}</span>

          <button className="pager-btn" onClick={() => go(page + 1)} disabled={disabled || page === totalPages} aria-label="Next page" title="Next page"><ChevronRight size={16} /></button>
          <button className="pager-btn" onClick={() => go(totalPages)} disabled={disabled || page === totalPages} aria-label="Last page" title="Last page"><ChevronsRight size={16} /></button>

          {totalPages > 5 && (
            <form className="pager-jump" onSubmit={submitJump}>
              <span>Go to</span>
              <input
                inputMode="numeric"
                value={jump}
                onChange={(e) => setJump(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder={`1-${totalPages}`}
                aria-label="Go to page number"
                disabled={disabled}
              />
            </form>
          )}
        </div>
      )}
    </nav>
  );
}
