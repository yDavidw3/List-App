var tarefas = JSON.parse(localStorage.getItem('minhas_tarefas')) || []
var ultimaTarefaExcluida = null

var modalTarefaEl = document.getElementById('modal_tarefa')
var modalTarefa = new bootstrap.Modal(modalTarefaEl)

var btnSalvar = document.getElementById('btn_salvar')
var inputTarefaNome = document.getElementById('input_tarefa_nome')
var selectTarefaEtiqueta = document.getElementById('select_tarefa_etiqueta')
var inputTarefaPrazo = document.getElementById('input_tarefa_prazo')
var listaTarefasContainer = document.getElementById('lista_tarefas')
var retornoContainer = document.getElementById('retorno_container')

var coresEtiqueta = {
    Urgente: 'danger',
    Trabalho: 'primary',
    Pessoal: 'success',
    Estudo: 'warning'
}

btnSalvar.addEventListener('click', function() {
    var nomeTexto = inputTarefaNome.value.trim()
    if (nomeTexto == '') {
        alert('Por favor, digite uma descrição para a tarefa.')
        return
    }

    var novaTarefa = {
        id: Date.now().toString(),
        nome: nomeTexto,
        etiqueta: selectTarefaEtiqueta.value,
        prazo: inputTarefaPrazo.value
    }

    tarefas.push(novaTarefa)
    salvarNoLocalStorage()
    renderizarTarefas()

    inputTarefaNome.value = ''
    selectTarefaEtiqueta.selectedIndex = 0
    inputTarefaPrazo.value = ''
    modalTarefa.hide()
})

function formatarData(dataISO) {
    if (!dataISO) {
        return ''
    }
    var partes = dataISO.split('-')
    var ano = partes[0]
    var mes = partes[1]
    var dia = partes[2]
    return dia + '/' + mes + '/' + ano
}

function renderizarTarefas() {
    listaTarefasContainer.innerHTML = ''

    tarefas.forEach(function(tarefa) {
        var itemLista = document.createElement('li')
        itemLista.id = 'note_item_' + tarefa.id
        itemLista.className = 'list-group-item d-flex align-items-center justify-content-between gap-2'

        var corBadge = coresEtiqueta[tarefa.etiqueta]
        if (corBadge == undefined) {
            corBadge = 'secondary'
        }

        var htmlEtiqueta = ''
        if (tarefa.etiqueta) {
            htmlEtiqueta = '<span class="badge bg-' + corBadge + '">' + tarefa.etiqueta + '</span>'
        }

        var htmlPrazo = ''
        if (tarefa.prazo) {
            htmlPrazo = '<small class="text-muted">' + formatarData(tarefa.prazo) + '</small>'
        }

        itemLista.innerHTML = '<div class="form-check d-flex align-items-center gap-2 flex-grow-1"><input class="form-check-input" type="checkbox" id="check_' + tarefa.id + '"><label class="form-check-label" for="check_' + tarefa.id + '">' + tarefa.nome + '</label></div><div class="d-flex align-items-center gap-2">' + htmlEtiqueta + htmlPrazo + '</div>'

        var checkbox = itemLista.querySelector('input[type="checkbox"]')
        checkbox.addEventListener('change', function() {
            conclusaoTarefa(tarefa.id)
        })

        listaTarefasContainer.appendChild(itemLista)
    })
}

function conclusaoTarefa(id) {
    var elementoTarefa = document.getElementById('note_item_' + id)
    if (elementoTarefa != null) {
        elementoTarefa.style.opacity = '0.5'
        elementoTarefa.style.transition = 'opacity 0.4s ease'
    }

    setTimeout(function() {
        ultimaTarefaExcluida = tarefas.find(function(t) {
            return t.id == id
        })
        tarefas = tarefas.filter(function(t) {
            return t.id != id
        })
        salvarNoLocalStorage()
        renderizarTarefas()
        mostrarToastRetorno()
    }, 600)
}

function mostrarToastRetorno() {
    var toast = document.createElement('div')
    toast.className = 'alert alert-success alert-dismissible fade show m-2 d-flex justify-content-between align-items-center'
    toast.setAttribute('role', 'alert')

    toast.innerHTML = '<span>Tarefa realizada e excluída!</span><button id="btn_refazer" class="btn btn-sm btn-link text-success fw-bold p-0 ms-3" style="text-decoration: none;">Refazer</button>'
    retornoContainer.appendChild(toast)

    toast.querySelector('#btn_refazer').addEventListener('click', function() {
        if (ultimaTarefaExcluida != null) {
            tarefas.push(ultimaTarefaExcluida)
            salvarNoLocalStorage()
            renderizarTarefas()
            toast.remove()
        }
    })

    setTimeout(function() {
        toast.remove()
    }, 5000)
}

function salvarNoLocalStorage() {
    localStorage.setItem('minhas_tarefas', JSON.stringify(tarefas))
}

renderizarTarefas()