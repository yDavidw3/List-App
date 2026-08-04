let tarefas = JSON.parse(localStorage.getItem('minhas_tarefas')) || [];
let ultimaTarefaExcluida = null;

const btnAbrirModal = document.getElementById('btn_abrir_modal');
const modalTarefa = document.getElementById('modal_tarefa');
const btnCancelar = document.getElementById('btn_cancelar');
const btnSalvar = document.getElementById('btn_salvar');
const inputTarefaNome = document.getElementById('input_tarefa_nome');
const listaTarefasContainer = document.getElementById('lista_tarefas');
const retornoContainer = document.getElementById('retorno_container');

btnAbrirModal.addEventListener('click', () => {
    modalTarefa.style.display = 'flex';
    inputTarefaNome.focus();
});

const fecharModal = () => {
    modalTarefa.style.display = 'none';
    inputTarefaNome.value = '';
};

btnCancelar.addEventListener('click', fecharModal);

btnSalvar.addEventListener('click', () => {
    const nomeTexto = inputTarefaNome.value.trim();
    if (nomeTexto == '') {
        alert('Por favor, digite uma descrição para a tarefa.');
        return;
    }

    const novaTarefa = {
        id: Date.now().toString(),
        nome: nomeTexto
    };

    tarefas.push(novaTarefa);
    salvarNoLocalStorage();
    renderizarTarefas();
    fecharModal();
});

function renderizarTarefas() {
    listaTarefasContainer.innerHTML = '';
    tarefas.forEach(tarefa => {
        const divNotaItem = document.createElement('div');
        divNotaItem.id = `note_item_${tarefa.id}`;
        divNotaItem.className = 'note_item';
        divNotaItem.innerHTML = `
            <input type="radio" id="radio_${tarefa.id}" name="tarefa_${tarefa.id}">
            <label for="radio_${tarefa.id}">${tarefa.nome}</label>
        `;

        const radioButton = divNotaItem.querySelector('input[type="radio"]');
        radioButton.addEventListener('change', () => conclusaoTarefa(tarefa.id));

        listaTarefasContainer.appendChild(divNotaItem);
    });
}

function conclusaoTarefa(id) {
    const elementoTarefa = document.getElementById(`note_item_${id}`);
    if (elementoTarefa) {
        elementoTarefa.style.opacity = '0.5';
        elementoTarefa.style.transition = 'opacity 0.4s ease';
    }

    setTimeout(() => {
        ultimaTarefaExcluida = tarefas.find(t => t.id == id);
        tarefas = tarefas.filter(t => t.id !== id);
        salvarNoLocalStorage();
        renderizarTarefas();
        mostrarToastRetorno();  
    }, 600);
}

function mostrarToastRetorno() {
    const toast = document.createElement('div');
    toast.className = 'alert alert-success alert-dismissible fade show m-2 d-flex justify-content-between align-items-center';
    toast.setAttribute('role', 'alert');

    toast.innerHTML = `
        <span>Tarefa realizada e excluída!</span>
        <button id="btn_refazer" class="btn btn-sm btn-link text-success fw-bold p-0 ms-3" style="text-decoration: none;">Refazer</button>
    `;
    retornoContainer.appendChild(toast);

    toast.querySelector('#btn_refazer').addEventListener('click', () => {
        if (ultimaTarefaExcluida) {
            tarefas.push(ultimaTarefaExcluida);
            salvarNoLocalStorage();
            renderizarTarefas();
            toast.remove();
        }
    });

    setTimeout(() => {
        toast.remove();
    }, 5000);
}

function salvarNoLocalStorage() {
    localStorage.setItem('minhas_tarefas', JSON.stringify(tarefas));
}

renderizarTarefas();
