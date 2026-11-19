var laboratorios = [
    { nome: "Laboratório 01", capacidade: 30, disponivel: true },
    { nome: "Laboratório 02", capacidade: 40, disponivel: false },
    { nome: "Laboratório 03", capacidade: 25, disponivel: true }
];

var reservas = [];

var campoNome = document.getElementById("nome-professor");
var campoMatricula = document.getElementById("matricula-professor");
var campoData = document.getElementById("data-reserva");
var selectLab = document.getElementById("select-laboratorio");
var selectHorario = document.getElementById("horario-reserva");

function obterDataAtual() {
    var hoje = new Date();
    var ano = hoje.getFullYear();
    var mes = hoje.getMonth() + 1;
    var dia = hoje.getDate();

    if (mes < 10) {
        mes = "0" + mes;
    }
    if (dia < 10) {
        dia = "0" + dia;
    }

    return ano + "-" + mes + "-" + dia;
}

campoData.min = obterDataAtual();
campoData.value = obterDataAtual();

campoData.addEventListener("click", function() {
    if (this.showPicker) {
        this.showPicker();
    }
});

campoNome.addEventListener("input", function() {
    this.value = this.value.replace(/[0-9]/g, "");
});

campoMatricula.addEventListener("input", function() {
    this.value = this.value.replace(/[^0-9]/g, "");
    if (this.value.length > 10) {
        this.value = this.value.slice(0, 10);
    }
});

selectLab.addEventListener("change", function() {
    this.blur();
});

selectHorario.addEventListener("change", function() {
    this.blur();
});

function carregarLaboratorios() {
    var containerLabs = document.getElementById("lista-laboratorios");

    containerLabs.innerHTML = "";
    selectLab.innerHTML = '<option value="">Selecione...</option>';

    for (var i = 0; i < laboratorios.length; i++) {
        var lab = laboratorios[i];
        
        var divLab = document.createElement("div");
        divLab.className = "lab-item";

        var textoStatus = "";
        var classeStatus = "";

        if (lab.disponivel === true) {
            textoStatus = "Disponível";
            classeStatus = "status-disponivel";
        } else {
            textoStatus = "Indisponível";
            classeStatus = "status-indisponivel";
        }

        divLab.innerHTML = 
            "<h3>" + lab.nome + "</h3>" +
            "<p>Capacidade: " + lab.capacidade + " alunos</p>" +
            "<span class='" + classeStatus + "'>" + textoStatus + "</span>";

        containerLabs.appendChild(divLab);

        var opcao = document.createElement("option");
        opcao.value = i;
        opcao.textContent = lab.nome + " (" + lab.capacidade + " alunos) - " + textoStatus;
        
        if (lab.disponivel === false) {
            opcao.disabled = true;
        }

        selectLab.appendChild(opcao);
    }
}

function mostrarMensagem(texto, tipo) {
    var caixaMensagem = document.getElementById("mensagem-sistema");
    caixaMensagem.textContent = texto;

    if (tipo === "erro") {
        caixaMensagem.className = "mensagem mensagem-erro";
    } else {
        caixaMensagem.className = "mensagem mensagem-sucesso";
    }
}

function atualizarListaReservas() {
    var containerReservas = document.getElementById("lista-reservas");

    if (reservas.length === 0) {
        containerReservas.innerHTML = '<p class="vazio">Nenhuma reserva feita ainda.</p>';
        return;
    }

    var htmlTabela = 
        "<table>" +
            "<thead>" +
                "<tr>" +
                    "<th>Laboratório</th>" +
                    "<th>Professor</th>" +
                    "<th>Data / Hora</th>" +
                    "<th>Finalidade</th>" +
                "</tr>" +
            "</thead>" +
            "<tbody>";

    for (var i = 0; i < reservas.length; i++) {
        var item = reservas[i];
        htmlTabela += 
            "<tr>" +
                "<td>" + item.laboratorio + "</td>" +
                "<td>" + item.professor + " (" + item.matricula + ")</td>" +
                "<td>" + item.data + "<br>" + item.horario + "</td>" +
                "<td>" + item.tipo + ": " + item.finalidade + "</td>" +
            "</tr>";
    }

    htmlTabela += "</tbody></table>";
    containerReservas.innerHTML = htmlTabela;
}

function processarReserva(evento) {
    evento.preventDefault();

    var nomeProfessor = campoNome.value.trim();
    var matriculaProfessor = campoMatricula.value.trim();
    var indiceLab = selectLab.value;
    var dataReserva = campoData.value;
    var horarioReserva = selectHorario.value;
    var tipoAtividade = document.getElementById("tipo-atividade").value;
    var finalidadeReserva = document.getElementById("finalidade-reserva").value.trim();

    if (nomeProfessor === "" || matriculaProfessor === "" || indiceLab === "" || dataReserva === "" || horarioReserva === "" || finalidadeReserva === "") {
        mostrarMensagem("Preencha todos os campos obrigatórios.", "erro");
        return;
    }

    if (dataReserva < obterDataAtual()) {
        mostrarMensagem("Não é possível reservar uma data que já passou.", "erro");
        return;
    }

    var labSelecionado = laboratorios[indiceLab];

    if (labSelecionado.disponivel === false) {
        mostrarMensagem("Este laboratório está indisponível.", "erro");
        return;
    }

    if (tipoAtividade === "Aula Regular" && labSelecionado.capacidade < 30) {
        mostrarMensagem("Laboratórios com menos de 30 lugares não permitem aula regular.", "erro");
        return;
    }

    var partesData = dataReserva.split("-");
    var dataFormatada = partesData[2] + "/" + partesData[1] + "/" + partesData[0];

    var novaReserva = {
        professor: nomeProfessor,
        matricula: matriculaProfessor,
        laboratorio: labSelecionado.nome,
        data: dataFormatada,
        horario: horarioReserva,
        tipo: tipoAtividade,
        finalidade: finalidadeReserva
    };

    reservas.push(novaReserva);

    mostrarMensagem("Reserva registrada com sucesso!", "sucesso");
    atualizarListaReservas();

    document.getElementById("form-reserva").reset();
    campoData.value = obterDataAtual();
}

carregarLaboratorios();

var formulario = document.getElementById("form-reserva");
formulario.addEventListener("submit", processarReserva);