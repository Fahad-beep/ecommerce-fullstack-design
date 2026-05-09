import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import {
  LuBadgePercent,
  LuChevronLeft,
  LuChevronRight,
  LuImage,
  LuLogOut,
  LuPackage,
  LuPencil,
  LuPlus,
  LuRefreshCw,
  LuSearch,
  LuTrash2,
  LuCloudUpload,
} from 'react-icons/lu';
import {
  deleteProduct,
  createProduct,
  updateProduct,
  type Product,
  type ProductInput,
} from '../api/products.api';
import { Button } from '../components/UI/Button';
import { useAuth } from '../context/AuthContext';
import { useMetadata } from '../hooks/useMetadata';
import { useProducts } from '../hooks/useProducts';
import { formatPrice } from '../data/storefront';
import { cn } from '../utils/cn';

const fallbackCategories = ['Mobile accessory', 'Electronics', 'Smartphones', 'Modern tech'];
const fallbackBrands = ['Samsung', 'Apple', 'Huawei', 'Lenovo', 'Canon'];
const fallbackConditions = ['Brand new', 'Refurbished', 'Old items'];
const fallbackFeatures = ['Metallic', 'Plastic cover', '8GB Ram', 'Super power', 'Large Memory'];
const pageSizes = [10, 20, 50];

const blankForm: ProductInput = {
  name: '',
  price: 1,
  image: '',
  description: '',
  category: '',
  stock: 0,
  brand: '',
  features: [],
  condition: 'Brand new',
  discount: 0,
  rating: 4.5,
};

const unique = (items: Array<string | undefined>) =>
  Array.from(new Set(items.filter(Boolean) as string[]));

const clamp = (value: number, min: number, max?: number) => {
  if (Number.isNaN(value)) return min;
  const withMin = Math.max(min, value);
  return max === undefined ? withMin : Math.min(max, withMin);
};

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Image upload failed'));
    reader.readAsDataURL(file);
  });

const uploadProductImage = async (file: File) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

  if (!cloudName || !uploadPreset) {
    return readFileAsDataUrl(file);
  }

  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', uploadPreset);
  data.append('folder', 'ecommerce-products');

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: data,
  });
  const result = await response.json();

  if (!response.ok || !result.secure_url) {
    throw new Error(result.error?.message ?? 'Image upload failed');
  }

  return result.secure_url as string;
};

const AdminPage = () => {
  const { accessToken, refreshSession, logout } = useAuth();
  const { metadata } = useMetadata();
  const [form, setForm] = useState<ProductInput>(blankForm);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadMessage, setImageUploadMessage] = useState<string | null>(null);
  const [discountEnabled, setDiscountEnabled] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { products, meta, isLoading, error, refetch } = useProducts({
    category: categoryFilter === 'all' ? undefined : categoryFilter,
    search: search || undefined,
    page,
    limit: pageSize,
  });

  const categories = useMemo(
    () => unique([...fallbackCategories, ...(metadata?.categories ?? []), form.category]),
    [form.category, metadata?.categories],
  );
  const brands = useMemo(
    () => unique([...fallbackBrands, ...(metadata?.brands ?? []), form.brand]),
    [form.brand, metadata?.brands],
  );
  const conditions = useMemo(
    () => unique([...fallbackConditions, ...(metadata?.conditions ?? []), form.condition]),
    [form.condition, metadata?.conditions],
  );
  const featureOptions = useMemo(
    () => unique([...fallbackFeatures, ...(metadata?.features ?? []), ...form.features]),
    [form.features, metadata?.features],
  );

  const totalPages = Math.max(meta.totalPages || 1, 1);
  const activeTypeLabel = categoryFilter === 'all' ? 'All types' : categoryFilter;

  useEffect(() => {
    setPage(1);
  }, [categoryFilter, pageSize, search]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const updateField = <K extends keyof ProductInput>(field: K, value: ProductInput[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const fillForm = (product: Product) => {
    setSelectedId(product._id);
    setDiscountEnabled((product.discount ?? 0) > 0);
    setForm({
      name: product.name,
      price: clamp(Number(product.price), 1),
      image: product.image,
      description: product.description ?? '',
      category: product.category,
      stock: clamp(Number(product.stock), 0),
      brand: product.brand,
      features: product.features ?? [],
      condition: product.condition || 'Brand new',
      discount: clamp(Number(product.discount ?? 0), 0, 100),
      rating: clamp(Number(product.rating ?? 4.5), 0, 5),
    });
  };

  const resetForm = () => {
    setForm(blankForm);
    setDiscountEnabled(false);
    setSelectedId(null);
  };

  const toggleFeature = (feature: string) => {
    updateField(
      'features',
      form.features.includes(feature)
        ? form.features.filter((item) => item !== feature)
        : [...form.features, feature],
    );
  };

  const runAuthorized = async <T,>(action: (token: string) => Promise<T>) => {
    if (!accessToken) throw new Error('Please sign in again.');

    try {
      return await action(accessToken);
    } catch (actionError) {
      const text = actionError instanceof Error ? actionError.message.toLowerCase() : '';
      if (!text.includes('token') && !text.includes('unauthorized')) throw actionError;

      const refreshed = await refreshSession();
      if (!refreshed?.accessToken) throw actionError;
      return action(refreshed.accessToken);
    }
  };

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const payload: ProductInput = {
      ...form,
      price: clamp(Number(form.price), 1),
      stock: clamp(Number(form.stock), 0),
      discount: discountEnabled ? clamp(Number(form.discount), 0, 100) : 0,
      rating: clamp(Number(form.rating ?? 0), 0, 5),
      features: form.features,
    };

    try {
      if (selectedId) {
        await runAuthorized((token) => updateProduct(token, selectedId, payload));
        setMessage('Product updated.');
      } else {
        await runAuthorized((token) => createProduct(token, payload));
        setMessage('Product created.');
      }
      resetForm();
      refetch();
    } catch (submitError) {
      setMessage(submitError instanceof Error ? submitError.message : 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (productId: string) => {
    setIsDeleting(productId);
    setMessage(null);

    try {
      await runAuthorized((token) => deleteProduct(token, productId));
      setMessage('Product deleted.');
      if (selectedId === productId) resetForm();
      if (products.length === 1 && page > 1) {
        setPage((current) => Math.max(1, current - 1));
      } else {
        refetch();
      }
    } catch (removeError) {
      setMessage(removeError instanceof Error ? removeError.message : 'Delete failed');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleImageUpload = async (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageUploadMessage('Please choose an image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageUploadMessage('Image must be smaller than 5MB.');
      return;
    }

    setIsUploadingImage(true);
    setImageUploadMessage(null);

    try {
      const image = await uploadProductImage(file);
      updateField('image', image);
      setImageUploadMessage('Image ready.');
    } catch (uploadError) {
      setImageUploadMessage(uploadError instanceof Error ? uploadError.message : 'Image upload failed');
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-[1180px] px-4 py-7">
      <div className="rounded-md border border-[#DEE2E7] bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0D6EFD]">Admin dashboard</p>
            <h1 className="mt-2 text-2xl font-semibold text-[#1C1C1C]">Catalog management</h1>
            <p className="mt-2 max-w-2xl text-base leading-6 text-[#8B96A5]">
              Add, edit, filter, and paginate products without exposing this area from the storefront UI.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="dark" size="normal" onClick={resetForm}>
              <LuPlus size={18} />
              New product
            </Button>
            <Button variant="dark" size="normal" onClick={logout}>
              <LuLogOut size={18} />
              Sign out
            </Button>
          </div>
        </div>

        {message ? (
          <div className="mt-5 rounded-md border border-[#DEE2E7] bg-[#F7FAFC] px-4 py-3 text-sm text-[#505050]">
            {message}
          </div>
        ) : null}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[390px_1fr]">
        <form onSubmit={submitForm} className="rounded-md border border-[#DEE2E7] bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#E5F1FF] text-[#0D6EFD]">
              <LuPackage size={22} />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-[#1C1C1C]">{selectedId ? 'Edit product' : 'Add product'}</h2>
              <p className="text-sm text-[#8B96A5]">All default values are labeled and clamped.</p>
            </div>
          </div>

          <div className="space-y-4">
            <Field label="Product name">
              <input required value={form.name} onChange={(event) => updateField('name', event.target.value)} className="admin-input" />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              <Field label="Product brand">
                <select required value={form.brand} onChange={(event) => updateField('brand', event.target.value)} className="admin-input">
                  <option value="" disabled>Select brand</option>
                  {brands.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </Field>
              <Field label="Category type">
                <select required value={form.category} onChange={(event) => updateField('category', event.target.value)} className="admin-input">
                  <option value="" disabled>Select category</option>
                  {categories.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </Field>
              <Field label="Condition">
                <select value={form.condition} onChange={(event) => updateField('condition', event.target.value)} className="admin-input">
                  {conditions.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </Field>
              <Field label="Price">
                <input required type="number" min="1" value={form.price} onChange={(event) => updateField('price', clamp(Number(event.target.value), 1))} className="admin-input" />
              </Field>
              <Field label="Stock">
                <input required type="number" min="0" value={form.stock} onChange={(event) => updateField('stock', clamp(Number(event.target.value), 0))} className="admin-input" />
              </Field>
              <Field label="Rating">
                <input type="number" min="0" max="5" step="0.1" value={form.rating ?? 0} onChange={(event) => updateField('rating', clamp(Number(event.target.value), 0, 5))} className="admin-input" />
              </Field>
              <div>
                <span className="mb-1.5 block text-sm font-semibold text-[#505050]">Discount status</span>
                <button
                  type="button"
                  onClick={() => {
                    setDiscountEnabled((current) => !current);
                    if (discountEnabled) updateField('discount', 0);
                  }}
                  className={cn(
                    'flex h-11 w-full cursor-pointer items-center justify-between rounded-md border px-3 text-left text-sm font-medium',
                    discountEnabled ? 'border-[#0D6EFD] bg-[#E5F1FF] text-[#0D6EFD]' : 'border-[#DEE2E7] bg-white text-[#505050]',
                  )}
                >
                  <span>{discountEnabled ? 'Discount enabled' : 'No discount'}</span>
                  <LuBadgePercent size={18} />
                </button>
              </div>
            </div>

            <div>
              <span className="mb-1.5 block text-sm font-semibold text-[#505050]">Product image</span>
              <div className="rounded-md border border-dashed border-[#B7D6FF] bg-[#F7FAFC] p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md border border-[#DEE2E7] bg-white">
                    {form.image ? (
                      <img src={form.image} alt="Product preview" className="h-full w-full rounded-md object-contain p-1" />
                    ) : (
                      <LuImage size={28} className="text-[#8B96A5]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-[#DEE2E7] bg-white px-3 text-sm font-medium text-[#0D6EFD]">
                      <LuCloudUpload size={18} />
                      {isUploadingImage ? 'Uploading...' : 'Upload image'}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploadingImage}
                        onChange={(event) => {
                          void handleImageUpload(event.target.files?.[0]);
                          event.target.value = '';
                        }}
                        className="hidden"
                      />
                    </label>
                    <p className="mt-2 text-xs leading-5 text-[#8B96A5]">
                      Upload an image or paste a Cloudinary/image URL below.
                    </p>
                    {imageUploadMessage ? <p className="mt-1 text-xs text-[#0D6EFD]">{imageUploadMessage}</p> : null}
                  </div>
                </div>
              </div>
            </div>

            <Field label="Image URL">
              <input required type="text" value={form.image} onChange={(event) => updateField('image', event.target.value)} className="admin-input" />
            </Field>

            {discountEnabled ? (
              <Field label="Discount percent">
                <input type="number" min="0" max="100" value={form.discount} onChange={(event) => updateField('discount', clamp(Number(event.target.value), 0, 100))} className="admin-input" />
              </Field>
            ) : null}

            <Field label="Description">
              <textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} rows={4} className="admin-input min-h-28 py-3" />
            </Field>

            <fieldset className="rounded-md border border-[#DEE2E7] p-3">
              <legend className="px-1 text-sm font-semibold text-[#505050]">Feature tags</legend>
              <div className="mt-1 flex flex-wrap gap-2">
                {featureOptions.map((feature) => (
                  <button
                    key={feature}
                    type="button"
                    onClick={() => toggleFeature(feature)}
                    className={cn(
                      'h-9 cursor-pointer rounded-full border px-3 text-sm',
                      form.features.includes(feature)
                        ? 'border-[#0D6EFD] bg-[#E5F1FF] text-[#0D6EFD]'
                        : 'border-[#DEE2E7] bg-white text-[#505050]',
                    )}
                  >
                    {feature}
                  </button>
                ))}
              </div>
            </fieldset>

            <Button type="submit" variant="primary" size="large" className="w-full" disabled={isSaving}>
              {isSaving ? 'Saving...' : selectedId ? 'Update product' : 'Create product'}
            </Button>
          </div>
        </form>

        <section className="rounded-md border border-[#DEE2E7] bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-[#1C1C1C]">Products</h2>
              <p className="mt-1 text-sm text-[#8B96A5]">
                {meta.totalCount.toLocaleString()} matching products in {activeTypeLabel}
              </p>
            </div>
            <button
              type="button"
              onClick={refetch}
              className="flex h-10 cursor-pointer items-center gap-2 rounded-md border border-[#DEE2E7] bg-white px-3 text-sm font-medium text-[#0D6EFD]"
            >
              <LuRefreshCw size={17} />
              Refresh
            </button>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <StatCard label="Matching" value={meta.totalCount.toLocaleString()} />
            <StatCard label="On this page" value={products.length.toString()} />
            <StatCard label="Types" value={categories.length.toString()} />
            <StatCard label="Page size" value={pageSize.toString()} />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategoryFilter('all')}
              className={categoryButtonClass(categoryFilter === 'all')}
            >
              All types
            </button>
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategoryFilter(item)}
                className={categoryButtonClass(categoryFilter === item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <label className="flex h-10 min-w-[260px] flex-1 items-center gap-2 rounded-md border border-[#DEE2E7] bg-white px-3 text-[#8B96A5]">
              <LuSearch size={18} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products"
                className="min-w-0 flex-1 outline-none placeholder:text-[#8B96A5]"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-[#505050]">
              Show
              <select value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))} className="h-10 rounded-md border border-[#DEE2E7] bg-white px-3 outline-none">
                {pageSizes.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </label>
          </div>

          {error ? (
            <div className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <div className="mt-5 overflow-x-auto rounded-md border border-[#DEE2E7]">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-[#F7FAFC] text-[#505050]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Stock</th>
                  <th className="px-4 py-3 font-semibold">Rating</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DEE2E7]">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-[#8B96A5]">Loading products...</td>
                  </tr>
                ) : products.length ? (
                  products.map((product) => (
                    <tr key={product._id} className={selectedId === product._id ? 'bg-[#E5F1FF]/50' : 'bg-white'}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt={product.name} className="h-14 w-14 rounded-md border border-[#DEE2E7] object-contain p-1" />
                          <div className="min-w-0">
                            <p className="font-medium text-[#1C1C1C] line-clamp-1">{product.name}</p>
                            <p className="text-[#8B96A5]">{product.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#505050]">{product.category}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-[#1C1C1C]">{formatPrice(product.price)}</p>
                        {product.discount ? <p className="text-xs text-[#FA3434]">{product.discount}% off</p> : null}
                      </td>
                      <td className="px-4 py-3 text-[#505050]">{product.stock}</td>
                      <td className="px-4 py-3 text-[#505050]">{product.rating ?? 0}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => fillForm(product)}
                            className="flex h-9 cursor-pointer items-center gap-2 rounded-md border border-[#DEE2E7] bg-white px-3 font-medium text-[#0D6EFD]"
                          >
                            <LuPencil size={16} />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(product._id)}
                            disabled={isDeleting === product._id}
                            className="flex h-9 cursor-pointer items-center gap-2 rounded-md border border-[#DEE2E7] bg-white px-3 font-medium text-[#FA3434] disabled:cursor-default disabled:opacity-60"
                          >
                            <LuTrash2 size={16} />
                            {isDeleting === product._id ? 'Deleting' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-[#8B96A5]">
                      No products found for this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[#8B96A5]">
              Page {meta.currentPage || page} of {totalPages}
            </p>
            <div className="flex overflow-hidden rounded-md border border-[#DEE2E7]">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="flex h-10 w-11 cursor-pointer items-center justify-center bg-white text-[#505050] disabled:cursor-default disabled:opacity-40"
              >
                <LuChevronLeft size={20} />
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                className="flex h-10 w-11 cursor-pointer items-center justify-center border-l border-[#DEE2E7] bg-white text-[#505050] disabled:cursor-default disabled:opacity-40"
              >
                <LuChevronRight size={20} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-semibold text-[#505050]">{label}</span>
    {children}
  </label>
);

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-md border border-[#DEE2E7] bg-[#F7FAFC] p-3">
    <p className="text-xs uppercase tracking-[0.16em] text-[#8B96A5]">{label}</p>
    <p className="mt-2 text-xl font-semibold text-[#1C1C1C] line-clamp-1">{value}</p>
  </div>
);

const categoryButtonClass = (active: boolean) =>
  cn(
    'h-9 cursor-pointer rounded-full border px-3 text-sm font-medium',
    active ? 'border-[#0D6EFD] bg-[#E5F1FF] text-[#0D6EFD]' : 'border-[#DEE2E7] bg-white text-[#505050]',
  );

export default AdminPage;
