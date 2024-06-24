import {useEffect, useState} from 'react';
import {useAnalytics} from '@shopify/hydrogen';
import {useJavaScriptLoad} from '~/components/PixelAnalytics/useJavaScriptLoad';
import {getPPID} from '~/components/PixelAnalytics/pixelUtils';

// const PIXEL_SCRIPT_SRC = 'https://andreyshepelev.github.io/r/2525.js';

const getPixelScriptSrc = (brandId: number) => {
    return `https://andreyshepelev.github.io/r/${brandId}.js`;
};

const getScriptId = (scriptName: string, withIncrementPrefix = true) => {
    return `${scriptName}${withIncrementPrefix ? '_' : ''}${withIncrementPrefix ? Date.now() : ''}`;
};

type PixelAnalyticsIntegrationProps = {
    brandId: number;
};

export const PixelAnalyticsIntegration = (props: PixelAnalyticsIntegrationProps) => {
    const { brandId } = props;
    const { subscribe } = useAnalytics();
    const [src, setSrc] = useState<string | null>(null);
    const [scriptId, setScriptId] = useState<string | null>(null);

    // const {ready} = register('Pixel Analytics Integration');
    // const scriptStatus = useLoadScript('https://andreyshepelev.github.io/r/2525.js');

    const scriptStatus = useJavaScriptLoad(src, {
        shouldPreventLoad: false,
        removeOnUnmount: true,
        id: scriptId,
    });

    useEffect(() => {
        // Standard events
        subscribe('page_viewed', (data) => {
            console.log('PixelAnalyticsIntegration - Page viewed: ', data);
            console.log('scriptStatus === ', scriptStatus);

            window._pp = window._pp || {};
            window._pp.brid = brandId;
            window._pp.referrerUrl = window.location.origin;
            window._pp.pageUrl = data.url;
            window._pp.targetUrl = data.url;
            window._pp.ppid = getPPID();

            console.log('subscribe: page_viewed event: ', new Date());
            console.log('subscribe: page_viewed event: window._pp === ', window._pp);

            const pixelScriptSrc = getPixelScriptSrc(brandId);
            console.log('getPixelScriptSrc(brandId) === ', pixelScriptSrc);

            const pixelScriptId = getScriptId('pp-pixel-script');
            console.log('pixelScriptId === ', pixelScriptId);

            setSrc(pixelScriptSrc);
            setScriptId(pixelScriptId);
        });
    }, []);

    // useEffect(() => {
    //     if (scriptStatus === 'ready') {
    //         ready();
    //         console.log('useEffect([scriptStatus]): after ready() called: scriptStatus === ', scriptStatus);
    //         console.log('useEffect([scriptStatus]): ', new Date());
    //         console.log('useEffect([scriptStatus]): window._pp === ', window._pp);
    //     }
    // }, [scriptStatus]);

    return null;
};
