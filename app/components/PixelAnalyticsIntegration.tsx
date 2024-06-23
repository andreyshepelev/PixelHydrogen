import {useEffect} from 'react';
import {useAnalytics} from '@shopify/hydrogen';

export const PixelAnalyticsIntegration = () => {
    const { subscribe } = useAnalytics();

    useEffect(() => {
        // Standard events
        subscribe('page_viewed', (data) => {
            console.log('PixelAnalyticsIntegration - Page viewed:', data);
        });
    }, []);

    return null;
};
