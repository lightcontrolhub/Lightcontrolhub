import BaseFilter from './BaseFilter.js';

// Filtro de cache
class CacheFilter extends BaseFilter {
    constructor(component, ttl = 5000) {
        super(component);
        this.cache = new Map();
        this.ttl = ttl;
    }

    async execute(data) {
        const key = JSON.stringify(data);
        const cached = this.cache.get(key);
        
        if (cached && Date.now() - cached.timestamp < this.ttl) {
            console.log('[CACHE] Hit:', key);
            return cached.result;
        }

        const result = await super.execute(data);
        
        this.cache.set(key, {
            result,
            timestamp: Date.now()
        });
        
        console.log('[CACHE] Miss:', key);
        return result;
    }
}

export default CacheFilter;