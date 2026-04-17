'use client';

/**
 * Captures inbound tracked params (gclid, gbraid, wbraid, utm_*) once on
 * mount and persists them to sessionStorage so outbound xhsdata.ai links
 * and email CTAs can carry them across the pimlicosolutions.com →
 * xhsdata.ai boundary.
 *
 * Rendered once in the root layout alongside <ConversionTracker />.
 * Returns null — purely a side-effect component.
 *
 * See src/lib/trialUrl.js for the storage/merge policy.
 */

import { useEffect } from 'react';
import { captureInboundParams } from '@/lib/trialUrl';

export default function InboundParamCapture() {
  useEffect(() => {
    captureInboundParams();
  }, []);
  return null;
}
