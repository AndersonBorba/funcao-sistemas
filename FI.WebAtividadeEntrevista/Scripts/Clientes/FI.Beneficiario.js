$(document).ready(function () {

    $('#CPF').on("blur", function (e) {
        if (!TestaCPF($('#CPF').val())) {
            alert("CPF inválido");
            $('#CPF').val("");
        }
    });

    $('#CPFBeneficiario').on("blur", function (e) {
        if (!TestaCPF($('#CPFBeneficiario').val())) {
            alert("CPF inválido");
            $('#CPFBeneficiario').val("");
        }
    });

    $('#CPF').mask("999.999.999-99");
    $('#CPFBeneficiario').mask("999.999.999-99");
})

var Beneficiarios = [];

function AlterarBeneficiario(index) {
    $('#CPFBeneficiario').val(Beneficiarios[index].CPF);
    $('#NomeBeneficiario').val(Beneficiarios[index].Nome);
    if (Beneficiarios[index].Id != undefined)
        $('#IdBeneficiario').val(Beneficiarios[index].Id);

    Beneficiarios.splice(index, 1);
}

function ExcluirBeneficiario(index) {
    Beneficiarios.splice(index, 1);
    MontaGridBeneficiario(Beneficiarios);
}

function IncluirBeneficiario() {
    if (Beneficiarios.some(x => x.CPF === $('#CPFBeneficiario').val())) {
        alert("CPF do beneficiário já adicionado!")
        return;
    }
    if ($('#NomeBeneficiario').val() == "" || $('#NomeBeneficiario').val() == undefined || $('#NomeBeneficiario').val() == null) {
        alert("Informe o nome do beneficiário!")
        return;
    }
    var CPF = $('#CPFBeneficiario').val();
    var Nome = $('#NomeBeneficiario').val();
    var Id = 0;
    if ($('#IdBeneficiario').val() != undefined && $('#IdBeneficiario').val() != null && $('#IdBeneficiario').val() != "") {
        Id = parseInt($('#IdBeneficiario').val())
    }
    var Beneficiario = { "Id": Id,  "CPF": CPF, "Nome": Nome };

    Beneficiarios.push(Beneficiario);
    MontaGridBeneficiario(Beneficiarios)

    $('#CPFBeneficiario').val("");
    $('#NomeBeneficiario').val("");
    $('#IdBeneficiario').val("");
}


function MontaGridBeneficiario(Beneficiarios) {
    $('#GridBenificiario').remove();
    var html = '<div id="GridBenificiario">';
    for (var i = 0; i < Beneficiarios.length; i++) {
        html += '<div class="row">' +
            '<div class="col-md-4" ><div class="form-group"><input value="' + Beneficiarios[i].CPF + '" disabled type="text" class="form-control" id="CPFBeneficiario' + i + '"></div></div>' +
            '<div class="col-md-4"><div class="form-group"><input value="' + Beneficiarios[i].Nome + '" disabled type="text" class="form-control" id="NomeBeneficiario' + i + '"></div></div>' +
            '<div class="col-md-2"><div class="form-group">' +
            '<button type="button" class="btn btn-primary" onclick="AlterarBeneficiario(' + i + ')">Alterar</button></div></div>' +
            '<div class="col-md-2"><div class="form-group">' +
            '<button type="button" class="btn btn-primary" onclick="ExcluirBeneficiario(' + i + ')">Excluir</button></div></div>' +
            '</div>';
    }
    html += '</div>'
    $('#divBeneficiarios').append(html);
}


function TestaCPF(strCPF) {
    strCPF = strCPF.replace(".", "").replace(".", "").replace('-', '');
    var Soma;
    var Resto;
    Soma = 0;
    if (strCPF == "00000000000") return false;

    for (i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(strCPF.substring(9, 10))) return false;

    Soma = 0;
    for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(strCPF.substring(10, 11))) return false;

    return true;
}

