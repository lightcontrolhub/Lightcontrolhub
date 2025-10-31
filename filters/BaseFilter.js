import FilterComponent from './FilterComponent.js';

// Decorator base
class BaseFilter extends FilterComponent {
    constructor(component) {
        super();
        this.component = component;
    }

    execute(data) {
        return this.component.execute(data);
    }
}

export default BaseFilter;