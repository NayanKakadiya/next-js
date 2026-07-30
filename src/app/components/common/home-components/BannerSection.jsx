import React from 'react';
import {getTranslations} from 'next-intl/server';

export default async function BannerSection() {
  const t = await getTranslations('HomePage');
  return (
    <section className="flex flex-col items-center justify-center relative overflow-hidden border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-6 py-16 text-white shadow-none min-h-[calc(100dvh-80px)] rounded-none sm:px-10 lg:px-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.12),_transparent_35%)]" />

      <div className="relative mx-auto flex h-full max-w-6xl flex-col items-center justify-center gap-8 lg:flex-row lg:justify-between">
        <div className="max-w-xl">
          <p className="mb-4 inline-block border border-white/20 bg-white/10 px-4 py-1 text-sm font-medium tracking-wide text-slate-200 rounded-none">
           {t('bannerSection.label')}
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            {t('bannerSection.title')}
          </h1>
          <p className="mt-4 text-lg text-slate-300 sm:text-xl">
            {t('bannerSection.desc')}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#"
              className="rounded-none bg-cyan-500 px-6 py-3 font-semibold text-white transition hover:bg-cyan-400"
            >
              {t('bannerSection.getStartedText')}
            </a>
            <a
              href="#"
              className="rounded-none border border-white/20 px-6 py-3 font-semibold text-slate-100 transition hover:bg-white/10"
            >
              {t('bannerSection.learnMoreText')}
            </a>
          </div>
        </div>

        <div className="w-full max-w-sm border border-white/10 bg-white/10 p-6 backdrop-blur rounded-none">
          <div className="bg-slate-950/60 p-6 rounded-none">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>New project</span>
              <span className="bg-emerald-500/20 px-3 py-1 text-emerald-300 rounded-none">
                Live
              </span>
            </div>
            <div className="mt-6 h-24 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-none" />
            <div className="mt-5 space-y-2">
              <div className="h-2 w-3/4 rounded-none bg-slate-700" />
              <div className="h-2 w-1/2 rounded-none bg-slate-700" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
