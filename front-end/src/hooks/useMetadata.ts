import { useEffect, useState } from 'react';
import { fetchMetadata, type ProductMetadata } from '../api/products.api';

export const useMetadata = () => {
  const [metadata, setMetadata] = useState<ProductMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadMetadata = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetchMetadata();
        if (active) {
          setMetadata(result);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error ? loadError.message : 'Failed to load metadata',
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadMetadata();

    return () => {
      active = false;
    };
  }, []);

  return { metadata, isLoading, error };
};
