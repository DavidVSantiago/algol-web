const renderPosts = (container) => {
    container.innerHTML = `
        <algol-grid-layout posh="stretch" id="layout" cols="1fr 1fr 1fr" colsbreak="1fr" gap="1vw" class="algol-bubble-01">
            <algol-grid-item posh="stretch">
                <algol-grid-layout id="layout" cols="1fr" gap="1vw" class="algol-bubble-02">
                    <algol-grid-item posh="stretch" padding="0 2" paddingbreak="0">
                        <algol-textarea name="textarea" id="textarea" label="textarea" maxlength="40" lines="4" placeholder="Digite o seu texto aqui..." fixed ></algol-textarea>
                        <algol-textarea disabled label="textarea" maxlength="40" lines="4" placeholder="Digite o seu texto aqui..." required fixed >Como assim</algol-textarea>
                    </algol-grid-item>
                </algol-grid-layout>
            </algol-grid-item>
            <algol-grid-item posh="end">   
                <algol-input name="input" id="input" label="input" placeholder="Digite aqui..." ></algol-input>
                <algol-input disabled required label="input" placeholder="Digite aqui..." ></algol-input>
            </algol-grid-item>
            <algol-grid-item class="algol-bubble-02" posh="start" posv="start">   
                <algol-input-number name="input-number" id="input-number" label="input-number" placeholder="Digite aqui..." ></algol-input-number>
                <algol-input-number disabled required label="input-number" placeholder="Digite aqui..." ></algol-input-number>
            </algol-grid-item>
        </algol-grid-layout>
    `;
};