import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="flex-1 flex items-center justify-center py-24 px-4 text-center w-full">
      <div className="max-w-md w-full space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-orange-50 border border-orange-200 text-brand-600 flex items-center justify-center mx-auto shadow-sm">
          <Car className="w-8 h-8 stroke-[2.2]" />
        </div>
        <h1 className="text-5xl font-black text-slate-900">404</h1>
        <h2 className="text-xl font-bold text-slate-800">Destination Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested fleet route or page does not exist in the DriveEase network.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-brand transition hover:-translate-y-0.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};
