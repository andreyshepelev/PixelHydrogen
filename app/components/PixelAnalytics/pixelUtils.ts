export const getPPID = () => {
    let ppid = getCookie('ppid');

    if (!ppid) {
        ppid = guid();
        setCookie('ppid', ppid, { domain: '.pebblepost.xyz' });
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
