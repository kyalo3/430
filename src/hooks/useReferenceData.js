import { useCallback, useEffect, useState } from 'react';
import api from '../lib/api';

const FALLBACK_CATEGORIES = [
  { id: 'produce', label: 'Fresh produce' },
  { id: 'bakery', label: 'Bakery' },
  { id: 'dairy', label: 'Dairy' },
  { id: 'pantry', label: 'Pantry / dry goods' },
  { id: 'prepared', label: 'Prepared meals' },
  { id: 'protein', label: 'Protein / cooked meats' },
  { id: 'non_food', label: 'Non-food usable goods' },
  { id: 'general', label: 'General surplus' },
];

/**
 * Shared reference data for all dashboards.
 * Counties + categories are operational (matching).
 * SDG context is partner/admin context only — never an impact counter.
 */
export function useReferenceData({ includeSdg = false } = {}) {
  const [areas, setAreas] = useState([]);
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [catalog, setCatalog] = useState([]);
  const [sdg, setSdg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const requests = [
          api.get('/platform/reference/service-areas').catch(() => ({ data: { items: [] } })),
          api.get('/platform/reference/food-categories').catch(() => ({ data: { items: [] } })),
          api.get('/platform/reference/catalog').catch(() => ({ data: { datasets: [] } })),
        ];
        if (includeSdg) {
          requests.push(api.get('/platform/reference/sdg-context').catch(() => ({ data: { available: false } })));
        }
        const [areasRes, catsRes, catalogRes, sdgRes] = await Promise.all(requests);
        if (cancelled) return;
        setAreas(areasRes.data?.items || []);
        if (catsRes.data?.items?.length) setCategories(catsRes.data.items);
        setCatalog(catalogRes.data?.datasets || []);
        if (includeSdg) setSdg(sdgRes?.data || { available: false });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [includeSdg]);

  const categoryLabel = useCallback(
    (id) => categories.find((c) => c.id === id)?.label || id || '—',
    [categories],
  );

  const refreshSdg = useCallback(async () => {
    if (!includeSdg) return null;
    const res = await api.get('/platform/reference/sdg-context');
    setSdg(res.data);
    return res.data;
  }, [includeSdg]);

  return { areas, categories, catalog, sdg, loading, categoryLabel, refreshSdg };
}
