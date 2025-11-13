'use client'
import { Search, ChevronRight, PanelRightOpen, Store, Plus } from 'lucide-react';
import Dropdown from './dropdown';
import { useRouter } from 'next/navigation';
import { AuthButton } from '../auth-button';

const NavbarMap = () => {
    const router = useRouter();
    const categories = [
        { id: 1, name: 'Semua', active: true },
        { id: 2, name: 'Kuliner', active: false },
        { id: 3, name: 'Fashion', active: false },
        { id: 4, name: 'Jasa', active: false },
    ];
    const dropdownItems = [
        {
        id: "add",
        label: "Usaha Baru",
        icon: <Plus size={20} />,
        onClick: () => router.push('usaha-baru'),
        },
    ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Menu & Location */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <PanelRightOpen size={24} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Carl Usaha</span>
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Braga"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex items-center gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  category.active
                    ? 'bg-yellow-400 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Right Section - Usaha Button & Avatar */}
          <div className="flex items-center gap-3 ml-4">
            <Dropdown
                trigger={
                    <button className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors">
                        <Store size={18} />
                        <span className="font-medium">Usaha</span>
                    </button>
                }
                items={dropdownItems}
                position="bottom-right"
            />
            <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
              <AuthButton/>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarMap;