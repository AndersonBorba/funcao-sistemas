
$(document).ready(function () {
    $('#formCadastro').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "CPF": $(this).find("#CPF").val().replace(".", "").replace(".", "").replace('-', ''),
                "Beneficiarios": JSON.stringify(Beneficiarios)
            },
            error:
                function (r) {
                    if (r.status == 400)
                        ModalDialog("Ocorreu um erro", r.responseJSON);
                    else if (r.status == 500)
                        ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                },
            success:
                function (r) {
                    ModalDialog("Sucesso!", r)
                    $("#formCadastro")[0].reset();
                }
        });
    })


    $('#CPF').on("blur", function (e) {

        if (!TestaCPF($('#CPF').val())) {
            alert("CPF inválido");
            $('#CPF').val("");
        }

        $('#CPF').val(cpf($('#CPF').val()));
    });

    $('#CPFBeneficiario').on("blur", function (e) {

        if (!TestaCPF($('#CPFBeneficiario').val())) {
            alert("CPF inválido");
            $('#CPFBeneficiario').val("");
        }

        $('#CPFBeneficiario').val(cpf($('#CPFBeneficiario').val()));
    });


})

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
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

function cpf(v) {
    v = v.replace(/\D/g, "")                    //Remove tudo o que não é dígito
    v = v.replace(/(\d{3})(\d)/, "$1.$2")       //Coloca um ponto entre o terceiro e o quarto dígitos
    v = v.replace(/(\d{3})(\d)/, "$1.$2")       //Coloca um ponto entre o terceiro e o quarto dígitos
    //de novo (para o segundo bloco de números)
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2") //Coloca um hífen entre o terceiro e o quarto dígitos
    return v
}

var Beneficiarios = [];

function AlterarBeneficiario(index) {
    $('#CPFBeneficiario').val(Beneficiarios[index].cpfBeneficiario);
    $('#NomeBeneficiario').val(Beneficiarios[index].nomeBeneficiario);
    Beneficiarios.splice(index, 1);
}
function ExcluirBeneficiario(index) {
    Beneficiarios.splice(index, 1);
    MontaGridBeneficiario(Beneficiarios);
}

function IncluirBeneficiario() {
    if (Beneficiarios.some(x => x.cpfBeneficiario === $('#CPFBeneficiario').val())) {
        alert("CPF do beneficiário já adicionado!")
        return;
    }
    if ($('#NomeBeneficiario').val() == "" || $('#NomeBeneficiario').val() == undefined || $('#NomeBeneficiario').val() == null) {
        alert("Informe o nome do beneficiário!")
        return;
    }
    var cpfBeneficiario = $('#CPFBeneficiario').val();
    var nomeBeneficiario = $('#NomeBeneficiario').val();
    var Beneficiario = { "cpfBeneficiario": cpfBeneficiario, "nomeBeneficiario": nomeBeneficiario };

    Beneficiarios.push(Beneficiario);
    MontaGridBeneficiario(Beneficiarios)

    $('#CPFBeneficiario').val("");
    $('#NomeBeneficiario').val("");
}


function MontaGridBeneficiario(Beneficiarios) {
    $('#GridBenificiario').remove();
    var html = '<div id="GridBenificiario"><div class="row"><div class="col-md-4"><div class="form-group"><label for="CPFBeneficiarioGrid">CPF</label></div></div><div class="col-md-4"><div class="form-group"><label for="NomeBeneficiarioGrid">Nome</label></div></div></div>';
    for (var i = 0; i < Beneficiarios.length; i++) {
        html += '<div class="row">' +
            '<div class="col-md-4" ><div class="form-group"><input value="' + Beneficiarios[i].cpfBeneficiario + '" disabled type="text" class="form-control" id="CPFBeneficiario' + i + '"></div></div>' +
            '<div class="col-md-4"><div class="form-group"><input value="' + Beneficiarios[i].nomeBeneficiario + '" disabled type="text" class="form-control" id="NomeBeneficiario' + i + '"></div></div>' +
            '<div class="col-md-2"><div class="form-group">' +
            '<button type="button" class="btn btn-primary" onclick="AlterarBeneficiario(' + i + ')">Alterar</button></div></div>' +
            '<div class="col-md-2"><div class="form-group">' +
            '<button type="button" class="btn btn-primary" onclick="ExcluirBeneficiario(' + i + ')">Excluir</button></div></div>' +
            '</div>';
    }
    html += '</div>'
    $('#divBeneficiarios').append(html);
}

