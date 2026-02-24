const renderPublications = (container) => {
    container.innerHTML = `
        <algol-grid-layout posh="stretch" id="layout" cols="1fr 1fr 1fr" colsbreak="1fr" gap="1vw" class="algol-bubble-01">
            <algol-grid-item posh="start">   
                <algol-input-date name="input-date" id="input-date" label="input-date" placeholder="Digite aqui..." ></algol-input-date>
                <algol-input-date disabled required label="input-date" placeholder="Digite aqui..." ></algol-input-date>
            </algol-grid-item>
            <algol-grid-item posh="stretch">   
                <algol-input-time name="input-time" id="input-time" label="input-time" placeholder="Digite aqui..." ></algol-input-time>
                <algol-input-time disabled required label="input-time" placeholder="Digite aqui..." ></algol-input-time>
            </algol-grid-item>
            <algol-grid-item posh="end">
                <algol-input-range name="input-range" id="input-range" label="input-range" min=0.5 max="3" step="0.1"></algol-input-range>
                <algol-input-range disabled required label="input-range" ></algol-input-range>
            </algol-grid-item>
            <algol-flex-item distrib="between"> 
                <algol-input-color name="input-color" id="input-color" label="input-color" ></algol-input-color>
                <algol-input-color disabled required label="input-color" ></algol-input-color>
            </algol-flex-item>
        </algol-grid-layout>
    `;
};