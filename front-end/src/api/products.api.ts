import { requestJson } from './http';

export interface Product {
  _id: string;
  image: string;
  stock: number;
  price: number;
  discount: number;
  rating?: number;
  name: string;
  category: string;
  features: string[];
  brand: string;
  condition: string;
  description: string;
}

export interface ProductMetadata {
  categories: string[];
  brands: string[];
  conditions: string[];
  features: string[];
}

export interface ProductsResponse {
  data: Product[];
  meta: {
    totalCount: number;
    currentPage: number;
    totalPages: number;
  };
}

export interface ProductFilter {
  category?: string | string[];
  search?: string;
  brand?: string;
  condition?: string;
  features?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  hasDiscount?: boolean;
  limit?: number;
  page?: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthSession {
  user: {
    sub: string;
    name: string;
    email: string;
    role: 'admin';
  };
  accessToken: string;
  refreshToken: string;
}

export interface ProductInput {
  name: string;
  price: number;
  image: string;
  description?: string;
  category: string;
  stock: number;
  brand: string;
  features: string[];
  condition: string;
  discount: number;
  rating?: number;
}

export const fetchProducts = async (
  filter: ProductFilter = {},
): Promise<ProductsResponse> => {
  const params = new URLSearchParams();

  if (filter.category) {
    if (Array.isArray(filter.category)) {
      filter.category.forEach((category) =>
        params.append('category', category),
      );
    } else {
      params.append('category', filter.category);
    }
  }

  if (filter.search) params.append('search', filter.search);
  if (filter.brand) params.append('brand', filter.brand);
  if (filter.condition) params.append('condition', filter.condition);
  if (filter.features?.length) {
    filter.features.forEach((feature) => params.append('features', feature));
  }
  if (filter.minPrice !== undefined) params.append('minPrice', String(filter.minPrice));
  if (filter.maxPrice !== undefined) params.append('maxPrice', String(filter.maxPrice));
  if (filter.minRating !== undefined) params.append('minRating', String(filter.minRating));
  if (filter.limit) params.append('limit', String(filter.limit));
  if (filter.page) params.append('page', String(filter.page));
  if (filter.hasDiscount) params.append('hasDiscount', 'true');

  return requestJson<ProductsResponse>(`/product?${params.toString()}`);
};

export const fetchProductById = async (id: string): Promise<Product> => {
  return requestJson<Product>(`/product/${id}`);
};

export const fetchMetadata = async (): Promise<ProductMetadata> => {
  return requestJson<ProductMetadata>('/metadata');
};

export const loginAdmin = async (
  payload: LoginPayload,
): Promise<AuthSession> => {
  return requestJson<AuthSession>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const refreshSession = async (
  refreshToken: string,
): Promise<AuthSession> => {
  return requestJson<AuthSession>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
};

export const createProduct = async (
  token: string,
  payload: ProductInput,
): Promise<Product> => {
  return requestJson<Product>('/product', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
};

export const updateProduct = async (
  token: string,
  id: string,
  payload: Partial<ProductInput>,
): Promise<Product> => {
  return requestJson<Product>(`/product/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
};

export const deleteProduct = async (token: string, id: string): Promise<void> => {
  await requestJson(`/product/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
