import { Outlet } from 'react-router-dom';
import CartFeedback from './CartFeedback';
import Footer from './Footer';
import Header from './Header';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#1C1C1C]">
      <Header />
      <CartFeedback />
      <main>
        <Outlet />
      </main>
      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
