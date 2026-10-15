import { usePackageCache } from "../store/packageCache.js";

function CacheStatus() {
  const cachedCount = usePackageCache((state) => Object.keys(state.entries).length);
  const hits = usePackageCache((state) => state.hits);
  const misses = usePackageCache((state) => state.misses);
  const clearCache = usePackageCache((state) => state.clearCache);

  return (
    <div className="cache-status">
      <span>
        Cache: {cachedCount} item(s) stored, {hits} hit(s), {misses} miss(es)
      </span>
      <button className="secondary" onClick={clearCache}>Clear Cache</button>
    </div>
  );
}

export default CacheStatus;
