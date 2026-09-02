export const stripeThemes = {
    bumblebee: {
        '--stripe-primary': '#ffc000',
        '--stripe-secondary': '#fff8e1',
        '--stripe-text': '#b8860b',
        '--stripe-hover': '#ffc000',
        '--stripe-header-bg': '#ffc000',
        '--stripe-header-text': '#000000',
        '--stripe-body-bg': '#fffde7',
        '--stripe-border': '#000000',
        '--stripe-shadow': '8px 8px 0px #000000'
    },
    chipmunk: {
        '--stripe-primary': '#6fc179',
        '--stripe-secondary': '#f0f9f0',
        '--stripe-text': '#2e7d32',
        '--stripe-hover': '#6fc179',
        '--stripe-header-bg': '#6fc179',
        '--stripe-header-text': '#000000',
        '--stripe-body-bg': '#f1f8f1',
        '--stripe-border': '#000000',
        '--stripe-shadow': '8px 8px 0px #000000'
    },
    clownfish: {
        '--stripe-primary': '#11a6ea',
        '--stripe-secondary': '#e6f4fb',
        '--stripe-text': '#0a5989',
        '--stripe-hover': '#11a6ea',
        '--stripe-header-bg': '#11a6ea',
        '--stripe-header-text': '#ffffff',
        '--stripe-body-bg': '#f0f9ff',
        '--stripe-border': '#000000',
        '--stripe-shadow': '8px 8px 0px #000000'
    },
    skunk: {
        '--stripe-primary': '#ffcdce',
        '--stripe-secondary': '#fff5f5',
        '--stripe-text': '#cc0000',
        '--stripe-hover': '#ffcdce',
        '--stripe-header-bg': '#ffcdce',
        '--stripe-header-text': '#000000',
        '--stripe-body-bg': '#fff5f5',
        '--stripe-border': '#000000',
        '--stripe-shadow': '8px 8px 0px #000000'
    },
    wildcat: {
        '--stripe-primary': '#6a0064',
        '--stripe-secondary': '#f5eef5',
        '--stripe-text': '#6a0064',
        '--stripe-hover': '#9a0094',
        '--stripe-header-bg': '#6a0064',
        '--stripe-header-text': '#ffffff',
        '--stripe-body-bg': '#f9f0f9',
        '--stripe-border': '#000000',
        '--stripe-shadow': '8px 8px 0px #000000'
    },
    zebra: {
        '--stripe-primary': '#ee0000',
        '--stripe-secondary': '#fff0f0',
        '--stripe-text': '#cc0000',
        '--stripe-hover': '#ee0000',
        '--stripe-header-bg': '#ee0000',
        '--stripe-header-text': '#ffffff',
        '--stripe-body-bg': '#fff5f5',
        '--stripe-border': '#000000',
        '--stripe-shadow': '8px 8px 0px #000000'
    }
};

export const defaultTheme = {
    '--stripe-primary': '#C77E0A',
    '--stripe-secondary': '#f7ede2',
    '--stripe-text': '#C77E0A',
    '--stripe-hover': '#C77E0A',
    '--stripe-header-bg': '#C77E0A',
    '--stripe-header-text': '#ffffff',
    '--stripe-body-bg': '#F3EDD6',
    '--stripe-border': '#000000',
    '--stripe-shadow': '8px 8px 0px #000000'
};

export function getTheme(stripe) {
    if (!stripe) return defaultTheme;
    return stripeThemes[stripe.toLowerCase()] || defaultTheme;
}
