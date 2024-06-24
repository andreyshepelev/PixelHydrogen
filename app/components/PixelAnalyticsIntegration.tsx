import {useEffect} from 'react';
import {useAnalytics, useLoadScript} from '@shopify/hydrogen';

export const PixelAnalyticsIntegration = () => {
    const { subscribe, register } = useAnalytics();

    const {ready} = register('Pixel Analytics Integration');

    const scriptStatus = useLoadScript('https://andreyshepelev.github.io/r/2525.js');

    useEffect(() => {
        // Standard events
        subscribe('page_viewed', (data) => {
            console.log('PixelAnalyticsIntegration - Page viewed: ', data);
            console.log('scriptStatus === ', scriptStatus);
            console.log('subscribe: page_viewed event: ', new Date());
            console.log('subscribe: page_viewed event: window._pp === ', window._pp);
        });
    }, []);

    useEffect(() => {
        if (scriptStatus === 'done') {
            ready();
            console.log('useEffect([scriptStatus]): after ready() called: scriptStatus === ', scriptStatus);
            console.log('useEffect([scriptStatus]): ', new Date());
            console.log('useEffect([scriptStatus]): window._pp === ', window._pp);
        }
    }, [scriptStatus]);

    return null;
};
