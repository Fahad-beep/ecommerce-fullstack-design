import { Link } from 'react-router-dom';
import { Button } from '../components/UI/Button';

const NotFoundPage = () => {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2C7CF1]">
          Page missing
        </p>
        <h1 className="mt-4 text-4xl font-bold text-slate-900">We could not find that route.</h1>
        <p className="mt-3 text-sm text-slate-600">
          The page may have moved or never existed. Head back to the storefront and continue browsing.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/">
            <Button variant="primary">Go home</Button>
          </Link>
          <Link to="/products">
            <Button variant="dark">Browse products</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
