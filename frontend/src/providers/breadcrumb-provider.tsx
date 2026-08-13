"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Labels = Record<string, string>;

interface BreadcrumbContextValue {
  labels: Labels;
  set: (key: string, label: string | null | undefined) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextValue | null>(null);

const DEFAULT_LABELS: Labels = {
  "/dashboard": "Dashboard",
  "/hosted-zones": "Hosted zones",
  "/hosted-zones/create": "Create hosted zone",
  "/health-checks": "Health checks",
  "/profiles": "Profiles",
  "/global-resolvers": "Global resolvers",
  "/shared-dns-views": "Shared DNS views",
  "/resolver/vpcs": "VPCs",
  "/resolver/inbound-endpoints": "Inbound endpoints",
  "/resolver/outbound-endpoints": "Outbound endpoints",
  "/resolver/rules": "Rules",
  "/resolver/query-logging": "Query logging",
  "/resolver/outposts": "Outposts",
  "/domains/registered": "Registered domains",
  "/domains/requests": "Requests",
  "/cidr-collections": "CIDR collections",
  "/traffic-policies": "Traffic policies",
  "/policy-records": "Policy records",
};

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [labels, setLabels] = useState<Labels>(DEFAULT_LABELS);

  const set = (key: string, label: string | null | undefined) => {
    setLabels((prev) => {
      if (label == null) {
        if (!(key in prev)) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      }
      if (prev[key] === label) return prev;
      return { ...prev, [key]: label };
    });
  };

  return (
    <BreadcrumbContext.Provider value={{ labels, set }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumbLabels(): Labels {
  return useContext(BreadcrumbContext)?.labels ?? {};
}

export function useRegisterBreadcrumb(
  key: string,
  label: string | null | undefined,
): void {
  const ctx = useContext(BreadcrumbContext);
  useEffect(() => {
    if (!ctx) return;
    ctx.set(key, label);
    return () => ctx.set(key, null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, label]);
}
