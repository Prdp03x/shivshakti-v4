import { createContext, useContext, useEffect, useMemo, useState } from "react";

const RouterContext = createContext(null);

function normalize(path) {
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

export function Router({ children }) {
  const [pathname, setPathname] = useState(() => normalize(window.location.pathname));

  useEffect(() => {
    const onPop = () => setPathname(normalize(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = (to) => {
    if (to === pathname) return;
    window.history.pushState({}, "", to);
    setPathname(normalize(to));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const value = useMemo(() => ({ pathname, navigate }), [pathname]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() { return useContext(RouterContext); }
export function useNavigate() { return useRouter().navigate; }
export function useLocation() { return { pathname: useRouter().pathname }; }

export function useParams() {
  const pathname = useRouter().pathname;
  const match = pathname.match(/^\/bills\/([^/]+)$/);
  return { id: match?.[1] || "" };
}

export function Link({ to, className, children, onClick, ...props }) {
  const navigate = useNavigate();
  return <a href={to} className={className} {...props}
    onClick={(e) => {
      e.preventDefault();
      onClick?.(e);
      navigate(to);
    }}>{children}</a>;
}
