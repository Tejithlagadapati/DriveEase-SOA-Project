import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Car, CalendarClock, ArrowLeft, Crown, Gauge } from 'lucide-react';

export const AdminSidebar = () => {
  const navItems = [
    {
      to: '/admin',
      label: 'Executive Overview',
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: '/admin/vehicles',
      label: 'Fleet Inventory',
      icon: Car,
      end: false,
    },
    {
      to: '/admin/bookings',
      label: 'Reservation Pipeline',
      icon: CalendarClock,
      end: false,
    },
  ];

  return (
    <aside className="w-full lg:w-72 bg-cream-50 rounded-3xl border border-cream-300 p-5 shadow-card flex flex-col justify-between shrink-0 h-fit">
      <div>
        <div className="flex items-center gap-3 px-4 py-3.5 mb-6 rounded-2xl bg-cream-150 border border-cream-300 text-stone-900">
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-brand-600 flex items-center justify-center shrink-0 border border-orange-200">
            <Crown className="w-5 h-5 text-brand-500" />
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-stone-900">Operations Control</div>
            <div className="text-[11px] text-brand-600 font-bold flex items-center gap-1">
              <Gauge className="w-2.5 h-2.5" />
              Fleet Command
            </div>
          </div>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition ${
                    isActive
                      ? 'bg-obsidian text-white shadow-sm font-bold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-cream-150'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="pt-6 mt-6 border-t border-cream-200">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-stone-500 hover:text-stone-900 hover:bg-cream-150 transition uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          Client Showroom
        </Link>
      </div>
    </aside>
  );
};
