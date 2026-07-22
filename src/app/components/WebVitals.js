// app/components/WebVitals.js
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // 1. Console ma performance data dekhadva mate
    console.log(metric)

    // 2. Tamara custom analytics server ke Google Analytics par data mokalva mate
    // const body = JSON.stringify(metric)
    // navigator.sendBeacon('/api/analytics', body)
  })

  return null
}