import { useEffect, useState } from 'react';
import {
  fetchProductById,
  fetchProducts,
  type Product,
  type ProductFilter,
  type ProductsResponse,
} from '../api/products.api';

export const useProducts = (filter: ProductFilter = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<ProductsResponse['meta']>({
    totalCount: 0,
    currentPage: 1,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetchProducts(filter);
        if (active) {
          setProducts(result.data);
          setMeta(result.meta);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load products');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      active = false;
    };
  }, [JSON.stringify(filter), reloadKey]);

  return {
    products,
    meta,
    isLoading,
    error,
    refetch: () => setReloadKey((current) => current + 1),
  };
};

export const useProduct = useProducts;

export const useProductById = (id?: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setProduct(null);
      setIsLoading(false);
      return;
    }

    let active = true;

    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetchProductById(id);
        if (active) {
          setProduct(result);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load product');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      active = false;
    };
  }, [id]);

  return { product, isLoading, error };
};
