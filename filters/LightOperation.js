import FilterComponent from './FilterComponent.js';


class LightOperation extends FilterComponent {
    constructor(lightService) {
        super();
        this.lightService = lightService;
    }

    async execute(data) {
        const { action, state } = data;
        
        if (action === 'toggle') {
            return await this.lightService.toggleLight();
        }
        
        if (action === 'setState') {
            return await this.lightService.setLightState(state);
        }
        
        if (action === 'getState') {
            return await this.lightService.getCurrentState();
        }
        
        throw new Error(`Ação não suportada: ${action}`);
    }
}

export default LightOperation;