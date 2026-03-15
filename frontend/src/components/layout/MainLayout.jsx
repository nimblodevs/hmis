import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import StatusBar from './StatusBar';

const MainLayout = () => {
  const location = useLocation();
  const isTokenPage = location.pathname === '/queues/token';

  return (
    <div className="flex h-screen w-full bg-silver-50 overflow-hidden text-slate-800">
      {!isTokenPage && <Sidebar />}
      
      <div className="flex flex-col flex-1 h-full w-full">
        {!isTokenPage && <TopNav />}
        
        <main className={`flex-1 overflow-x-hidden overflow-y-auto bg-silver-100 ${isTokenPage ? '' : 'p-6'}`}>
          <Outlet />
        </main>
        
        {!isTokenPage && <StatusBar />}
      </div>
    </div>
  );
};

export default MainLayout;
