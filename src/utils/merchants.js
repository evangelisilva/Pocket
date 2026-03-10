// List of popular merchants and their domains for logo fetching
export const POPULAR_MERCHANTS = [
    { name: 'University at Albany', domain: 'albany.edu' },
    { name: 'Rensselaer Polytechnic Institute', domain: 'rpi.edu' },
    { name: 'Amazon', domain: 'amazon.com' },
    { name: 'Walmart', domain: 'walmart.com' },
    { name: 'Market 32', domain: 'pricechopper.com' },
    { name: 'Weee!', domain: 'sayweee.com' },
    { name: 'Target', domain: 'target.com' },
    { name: 'Costco', domain: 'costco.com' },
    { name: 'Starbucks', domain: 'starbucks.com' },
    { name: 'Uber', domain: 'uber.com' },
    { name: 'Netflix', domain: 'netflix.com' },
    { name: 'Whole Foods Market', domain: 'wholefoodsmarket.com' },
    { name: 'Trader Joe\'s', domain: 'traderjoes.com' },
    { name: 'Shell', domain: 'shell.com' },
    { name: 'McDonald\'s', domain: 'mcdonalds.com' },
    { name: 'Home Depot', domain: 'homedepot.com' },
    { name: 'Walgreens', domain: 'walgreens.com' },
    { name: 'CVS Pharmacy', domain: 'cvs.com' },
    { name: 'Spotify', domain: 'spotify.com' },
    { name: 'Apple', domain: 'apple.com' },
    { name: 'Nike', domain: 'nike.com' },
    { name: 'Chase', domain: 'chase.com' },
    { name: 'American Express', domain: 'americanexpress.com' },
    { name: 'Bank of America', domain: 'bankofamerica.com' },
    { name: 'Capital One', domain: 'www.capitalone.com' },
    { name: 'Robinhood', domain: 'robinhood.com' },
    { name: 'SoFi', domain: 'sofi.com' },
    { name: 'Vanguard', domain: 'vanguard.com' },
    { name: 'Fidelity', domain: 'fidelity.com' },
    { name: 'Charles Schwab', domain: 'schwab.com' },
    { name: 'Hulu', domain: 'hulu.com' }
];

export const getMerchantLogoUrl = (merchantName) => {
    if (!merchantName) return null;
    const match = POPULAR_MERCHANTS.find(m => m.name.toLowerCase() === merchantName.toLowerCase());

    if (match) {
        return `https://www.google.com/s2/favicons?domain=${match.domain}&sz=128`;
    }

    const cleaned = merchantName.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleaned.length > 2) {
        return `https://www.google.com/s2/favicons?domain=${cleaned}.com&sz=128`;
    }

    return null;
};
