import { useLocation } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import { metaForPath } from '../constants/pageMeta';

export default function RouteMeta() {
  const { pathname } = useLocation();
  usePageMeta(metaForPath(pathname));
  return null;
}
