export const stripeThemes = {
    bumblebee: {
        '--stripe-primary': '#ffc000',
        '--stripe-secondary': '#fff8e1',
        '--stripe-tertiary': '#fffdf5',
        '--stripe-quaternary': '#ffe27a',
        '--stripe-text': '#fffdf5',
        '--stripe-hover': '#ffd44d',
        '--stripe-text-hover': '#8a6800',
        '--stripe-header-bg': '#ffc000',
        '--stripe-header-text': '#000000',
        '--stripe-body-bg': '#fffde7',
        '--stripe-border': '#000000',
        '--stripe-shadow': '8px 8px 0px #000000'
    },

    chipmunk: {
        '--stripe-primary': '#6fc179',
        '--stripe-secondary': '#f0f9f0',
        '--stripe-tertiary': '#f8fcf8',
        '--stripe-quaternary': '#9bdda2',
        '--stripe-text': '#f0f9f0',
        '--stripe-hover': '#8dce95',
        '--stripe-text-hover': '#397442',
        '--stripe-header-bg': '#6fc179',
        '--stripe-header-text': '#000000',
        '--stripe-body-bg': '#f1f8f1',
        '--stripe-border': '#000000',
        '--stripe-shadow': '8px 8px 0px #000000'
    },

    clownfish: {
        '--stripe-primary': '#11a6ea',
        '--stripe-secondary': '#e6f4fb',
        '--stripe-tertiary': '#f5fbff',
        '--stripe-quaternary': '#7dd3f7',
        '--stripe-text': '#e6f4fb',
        '--stripe-hover': '#3bb7ee',
        '--stripe-text-hover': '#086b99',
        '--stripe-header-bg': '#11a6ea',
        '--stripe-header-text': '#ffffff',
        '--stripe-body-bg': '#f0f9ff',
        '--stripe-border': '#000000',
        '--stripe-shadow': '8px 8px 0px #000000'
    },

    skunk: {
        '--stripe-primary': '#ffcdce',
        '--stripe-secondary': '#fff5f5',
        '--stripe-tertiary': '#fffafa',
        '--stripe-quaternary': '#ff9fa3',
        '--stripe-text': '#cc0000',
        '--stripe-hover': '#ffdfe0',
        '--stripe-text-hover': '#990000',
        '--stripe-header-bg': '#ffcdce',
        '--stripe-header-text': '#000000',
        '--stripe-body-bg': '#fff5f5',
        '--stripe-border': '#000000',
        '--stripe-shadow': '8px 8px 0px #000000'
    },

    wildcat: {
        '--stripe-primary': '#6a0064',
        '--stripe-secondary': '#f5eef5',
        '--stripe-tertiary': '#fbf7fb',
        '--stripe-quaternary': 'rgb(184, 77, 178)',
        '--stripe-text': '#f5eef5',
        '--stripe-hover': '#8b3386',
        '--stripe-text-hover': '#3f003b',
        '--stripe-header-bg': '#6a0064',
        '--stripe-header-text': '#ffffff',
        '--stripe-body-bg': '#f9f0f9',
        '--stripe-border': '#000000',
        '--stripe-shadow': '8px 8px 0px #000000'
    },

    zebra: {
        '--stripe-primary': '#ee0000',
        '--stripe-secondary': '#fff0f0',
        '--stripe-tertiary': '#fff8f8',
        '--stripe-quaternary': '#ff7777',
        '--stripe-text': '#fff0f0',
        '--stripe-hover': '#f24444',
        '--stripe-text-hover': '#990000',
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
    '--stripe-tertiary': '#fcf8f3',
    '--stripe-quaternary': '#e5aa55',
    '--stripe-text': '#C77E0A',
    '--stripe-hover': '#d7952e',
    '--stripe-text-hover': '#7a4d06',
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
