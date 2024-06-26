export const getPPID = () => {
    let ppid = getCookie('ppid');

    if (!ppid) {
        ppid = guid();
        const rootDomain = getRootDomain();
        console.log('rootDomain === ', rootDomain);
        setCookie('ppid', ppid, { domain: `.${rootDomain}` });
    }

    return ppid;
};

const guid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

export const getCookie = (key: string) => {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + key.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
};

export const getExpirationDate = () => {
    const sevenDays = new Date(Date.now() + 604800000);
    const day = sevenDays.toLocaleString('en', { weekday: 'short' });
    const month = sevenDays.toLocaleString('en', { month: 'short' });
    const date = sevenDays.getDate();
    const year = sevenDays.getFullYear();
    const hours = ('0' + sevenDays.getHours()).slice(-2);
    const minutes = ('0' + sevenDays.getMinutes()).slice(-2);
    const seconds = ('0' + sevenDays.getSeconds()).slice(-2);
    return `${day}, ${date} ${month} ${year} ${hours}:${minutes}:${seconds}`;
};

export const setCookie = (key: string, value: string, attributes: any = {}) => {
    attributes = {
        path: '/',
        expires: getExpirationDate(),
        // add other defaults here if necessary
        ...attributes,
    };

    if (attributes.expires instanceof Date) {
        attributes.expires = attributes.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(key) + "=" + encodeURIComponent(value);

    for (let attributeKey in attributes) {
        updatedCookie += "; " + attributeKey;
        let attributeValue = attributes[attributeKey];
        if (attributeValue !== true) {
            updatedCookie += "=" + attributeValue;
        }
    }

    document.cookie = updatedCookie;
};

export const deleteCookie = (key: string, attributes: any = {}) => {
    setCookie(key, '', { ...attributes, 'max-age': -1 });
};

export const getPageHostname = (): string => {
    let hostname = '';
    try {
        hostname = top && top.location && top.location.hostname;
    } catch (e) {
        // Suppress cross-domain exception when JS is loaded in double nested iframe
        // TODO: Consider sending errors caught here to a /cross-domain logging endpoint
    }
    // "document" should never be null in a browser
    return hostname || (document && document.location && document.location.hostname);
};

export const getRootDomain = (): string => {
    const hostname = getPageHostname();
    const domainParts = hostname.split('.');
    if (domainParts.length === 2) {
        return hostname;
    }

    const testCookie = '__ppid_cookie_test__';
    let domainLevel = 2;

    while (domainLevel <= domainParts.length) {
        try {
            const rootDomain = domainParts.slice(-1 * domainLevel).join('.');
            setCookie(testCookie, testCookie, { domain: `.${rootDomain}` });
            if (getCookie(testCookie) === testCookie) {
                deleteCookie(testCookie, { domain: `.${rootDomain}` });
                return rootDomain;
            }
        } catch (e) {
            // Suppress an error occurred
        }

        domainLevel += 1;
    }

    return hostname;
};
