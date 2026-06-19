'use client';

import { useSettings } from '@/app/context/SettingsContext';

export default function StoreInfo({ variant = 'default' }: { variant?: 'default' | 'compact' }) {
  const { settings } = useSettings();

  if (variant === 'compact') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-muted-foreground shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
          <span className="text-sm text-muted-foreground">{settings.storePhone}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-muted-foreground shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          <span className="text-sm text-muted-foreground">{settings.storeEmail}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" role="list" aria-label="Contact information">
      <div className="flex items-start space-x-4" role="listitem">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
        </div>
        <div>
          <h3 className="font-medium text-foreground">Phone</h3>
          <p className="text-muted-foreground">{settings.storePhone}</p>
        </div>
      </div>
      <div className="flex items-start space-x-4" role="listitem">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        </div>
        <div>
          <h3 className="font-medium text-foreground">Email</h3>
          <p className="text-muted-foreground">{settings.storeEmail}</p>
        </div>
      </div>
      <div className="flex items-start space-x-4" role="listitem">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </div>
        <div>
          <h3 className="font-medium text-foreground">Address</h3>
          <p className="text-muted-foreground">{settings.storeAddress.replace(/\n/g, '<br />')}</p>
        </div>
      </div>
    </div>
  );
}
