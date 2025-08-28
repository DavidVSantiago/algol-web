// components.js

// /***********************************************************************************************/
// /** Eventos que trata aspectos da página *******************************************************/
// /***********************************************************************************************/
// document.addEventListener('DOMContentLoaded', () => {
//     /* trata os eventos do input number de inteiros */
//     document.querySelectorAll('.algol_input-container').forEach(container => {
//         const input = container.querySelector('.algol_input');
//         const increment = () => input.value = (input.value < parseInt(input.max)) ? parseInt(input.value) + 1 : parseInt(input.max);
//         const decrement = () => input.value = (input.value > parseInt(input.min)) ? parseInt(input.value) - 1 : parseInt(input.min);
//         container.querySelector('.algol_spinner-up').addEventListener('click', increment);
//         container.querySelector('.algol_spinner-down').addEventListener('click', decrement);
//         // validação de limites do input na mudança via teclado
//         input.addEventListener('change', () => {
//             if (isNaN(parseInt(input.value))) input.value = parseInt(input.min);
//             else if (parseInt(input.value) > parseInt(input.max)) input.value = parseInt(input.max);
//             else if (input.value < parseInt(input.min)) input.value = parseInt(input.min);
//         });
//     });
//     document.getElementById('app-container').style.display = 'block'; // após configurar os componentes, mostra o container
// });

/***********************************************************************************************/
/** Classes que implementam os componentes customizados ****************************************/
/***********************************************************************************************/


// class Input extends HTMLElement {
//     constructor() {
//         super();
//         this.label = this.textContent || 'label';
//         this.value = this.getAttribute('value') || '';
//         this.placeholder = this.getAttribute('placeholder') || '';
//         this.disabled = this.getAttribute('disabled') !== null ? 'disabled' : '';
//         this.position = this.getAttribute('position') || '';
//         if (this.position === 'left') this.classList.add('algol-position-left');
//         else if (this.position === 'center') this.classList.add('algol-position-center');
//         else if (this.position === 'right') this.classList.add('algol-position-right');
//         else if (this.position === 'all') this.classList.add('algol-position-all');
//     }
//     render(type = 'text') {
//         let htmlCode = `<div class="algol_algol_component-group"> <label>${this.label}</label> <input type="${type}" class="algol_input" `;
//         if (this.value !== '') htmlCode += `value="${this.value}" `;
//         if (this.placeholder !== '') htmlCode += `placeholder="${this.placeholder}" `;
//         htmlCode += `${this.disabled}/></div>`;
//         this.innerHTML = htmlCode;
//     }
// }

// class InputText extends Input {
//     constructor() {
//         super();
//         super.render("text");
//     }
// }
// class InputEmail extends Input {
//     constructor() {
//         super();
//         super.render("email");
//     }
// }
// class InputPassword extends Input {
//     constructor() {
//         super();
//         super.render("password");
//     }
// }
// class InputNumber extends Input {
//     constructor() {
//         super();
//         this.min = this.getAttribute('min') || '0';
//         this.max = this.getAttribute('max') || (parseInt(this.min) + 100).toString();
//         this.value = this.getAttribute('value') || ((parseInt(this.min) + parseInt(this.max)) / 2).toString();
//         this.render("number");
//     }
//     render() {
//         let htmlCode = `
//             <div class="algol_algol_component-group">
//                 <label>${this.label}</label>
//                 <div class="algol_input-container">
//                     <input type="number" class="algol_input" min="${this.min}" max="${this.max}" value="${this.value}">
//                     <div class="algol_spinner-buttons">
//                         <div class="algol_spinner-up">▲</div>
//                         <div class="algol_spinner-down">▼</div>
//                     </div>
//                 </div>
//             </div>
//         `;
//         this.innerHTML = htmlCode;
//     }
// }