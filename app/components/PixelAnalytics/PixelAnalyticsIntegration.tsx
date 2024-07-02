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

    useJavaScriptLoad(src, {
        shouldPreventLoad: false,
        removeOnUnmount: true,
        id: scriptId,
    });

    useEffect(() => {
        subscribe('page_viewed', (data) => {
            window._pp = window._pp ?? {};
            window._pp.brid = brandId;
            window._pp.referrerUrl = window.location.origin;
            window._pp.pageUrl = data.url;
            window._pp.targetUrl = data.url;
            // window._pp.ppid = getPPID();

            setSrc(getPixelScriptSrc(brandId));
            setScriptId(getScriptId('pp-pixel-script'));
        });
    }, []);

    return null;
};
