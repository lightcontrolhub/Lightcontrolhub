import FilterComponent from './FilterComponent.js';


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