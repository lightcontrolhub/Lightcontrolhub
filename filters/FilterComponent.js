// Interface base para componentes filtráveis
class FilterComponent {
    execute(data) {
        throw new Error('execute() deve ser implementado');
    }
}

export default FilterComponent;