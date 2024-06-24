import {useEffect} from 'react';
import {useAnalytics, useLoadScript} from '@shopify/hydrogen';

export const PixelAnalyticsIntegration = () => {
    const { subscribe } = useAnalytics();

    const scriptStatus = useLoadScript('https://andreyshepelev.github.io/r/2525.js');

    useEffect(() => {
        // Standard events
        subscribe('page_viewed', (data) => {
            console.log('PixelAnalyticsIntegration - Page viewed:', data);
            console.log('scriptStatus === ', scriptStatus);
        });
    }, []);

    return null;
};
