$(function() {

	  var AUTH_TOKEN = $('meta[name=csrf-token]').attr('content');
      var formData = {'_token':AUTH_TOKEN };

    $.ajax({
        url: '/traer_ficheros_estudiante',
        type: 'POST',
        dataType: "json",
        data: formData,
        mimeType: "multipart/form-data",
        success: function(data, textStatus, jqXHR) {
           llenar_documentos(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
           alert(errorThrown);
        }
    });



    var URL = $('#form_inscripcion').data('url');

    $('#form_menu1').on('submit', function(e) {
        $.post(
            URL + '/registro_estudiante',
            $(this).serialize(),
            function(data) {

                if (data.status == 'error') {
                    //console.log(data);
                    validador_errores_form1(data.errors);

                    var menj = ' <strong>Error!</strong> Revisa los campos de color rojo en el formulario.';
                    $('#men_error_fomr1').html(menj);
                    $("#men_error_fomr1").show(0);
                        setTimeout(function() {
                            $("#men_error_fomr1").fadeOut(1500);
                        }, 3000);
                    
                } else {
                	validador_errores_form1(data.errors);
                    var menj = 'Ha registrado el pirmer formulario <strong>Datos del estudiante</strong>, por favor siga con el siguiente formulario.';
                    $('#mensaje').html(menj);
                    $( "input[name='_alumno']" ).val(data.id);
                    $('#incripcion_creada').modal('show');
                }
            },
            'json'
        );
        e.preventDefault();
    });


    var validador_errores_form1 = function(data) {
       // console.log(data);
        $('#form_menu1 .form-group').removeClass('has-error');
        var selector = '';
        for (var error in data) {
            if (typeof data[error] !== 'function') {
                switch (error) {
                    case 'tipoIdent_estudiante':
                    case 'dptExp_estudiante':
                    case 'mpioExp_estudiante':
                    case 'dptNaci_estudiante':
                    case 'mpioNaci_estudiante':
                    case 'dptReci_estudiante':
                    case 'mpioReci_estudiante':
                    case 'mpioNaci_estudiante':
                    case 'nvel_estudiante':
                    case 'nvelEst_estudiante':
                    case 'dcidad_estudiante':
                    case 'situAcad_estudiante':
                    case 'ftorRh_estudiante':
                    case 'repitente':
                    case 'gnro_estudiante':
                    case 'zna_estudiante':
                        selector = 'select';
                        break;


                    case 'numIdent_estudiante':
                    case 'nom1_estudiante':
                    case 'apll1_estudiante':
                    case 'fchaNaci_estudiante':
                    case 'nom_alumno':
                    case 'numIdnt_alumno':
                    case 'dirReci_estudiante':
                    case 'brioReci_estudiante':
                    case 'eps_estudiante':
                    case 'tfono_estudiante':
                        selector = 'input';
                        break;
                }
                $('#form_menu1 ' + selector + '[name="' + error + '"]').closest('.form-group').addClass('has-error');
            }
        }
    }



    $('#form_menu2').on('submit', function(e) {
        $.post(
            URL + '/registro_acudiente',
            $(this).serialize(),
            function(data) {

                if (data.status == 'error') {
                    validador_errores_menu2(data.errors);
                } else {
                    validador_errores_menu2(data.errors);
                    var menj = 'Ha registrado el segundo formulario <strong>Datos del acudiente</strong>, por favor siga con el siguiente formulario.';
                    $('#mensaje').html(menj);
                    $('#incripcion_creada').modal('show');
                }
            },
            'json'
        );
        e.preventDefault();
    });


    var validador_errores_menu2 = function(data) {
        $('#form_menu2 .form-group').removeClass('has-error');
        var selector = '';
        for (var error in data) {
            if (typeof data[error] !== 'function') {
                switch (error) {

                    case 'ptesco_acudi':
                        selector = 'select';
                        break;

                    case 'cedu_acudi':
                    case 'pmerNom_acudi':
                    case 'pmerApell_acudi':
                    case 'tfono_acudi':
                    case 'celu_acudi':
                        selector = 'input';
                        break;

                }
                $('#form_menu2 ' + selector + '[name="' + error + '"]').closest('.form-group').addClass('has-error');
            }
        }
    }




    $('#form_menu3').on('submit', function(e) {

        $.post(
            URL + '/registro_academico',
            $(this).serialize(),
            function(data) {

                //console.log(data);
                var menj = 'Ha registrado el tercer formulario <strong>Datos académico</strong>, por favor siga con el siguiente formulario.';
                $('#mensaje').html(menj);
                $('#incripcion_creada').modal('show');
                $("input[name='_academica']").val(1);
                $("input[name='_modicar_val']").val(data.id);

            },
            'json'
        );
        e.preventDefault();
    });


    $('body').delegate('#sub_registroCT', 'click', function() {
        var num = $(this).data("id");
        var formData = new FormData($("#form_menu4")[0]);

        $.ajax({
            url: URL + '/registro_file',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            dataType: "json",
            success: function(data) {
                if (data.status == 'error') {
                    validador_errores_registroEjecucion(data.errors);
                    $("#espera_eje").html("");
                } else {
                    $('#form_menu4')[0].reset();
                    $('#file' + num).attr('href', data.status); //Conocimiento adquirido attr
                    $('#file' + num).show();
                    $('button[data-id=' + num + ']').attr('data-url', data.status);
                    var menj = 'Ha registrado el archivo numero' + num;
                    $('#mensaje').html(menj);
                    $('#incripcion_creada').modal('show');
                }
            }
        });
        return false;
    });

    $('body').delegate('#baj_registroCT', 'click', function() {
        var num = $(this).data("id");
        var url = $('#file' + num).attr('href');

        var AUTH_TOKEN = $('meta[name=csrf-token]').attr('content');
        var formData = {
        	'num':num,
            'url': url,
            '_token': AUTH_TOKEN
        };

        $.ajax({
            url: URL + '/delete_file',
            type: 'POST',
            data: formData,
            dataType: "json",
            success: function(data) {
                if (data.status == 'error') {
                    validador_errores_registroEjecucion(data.errors);
                    $("#espera_eje").html("");
                } else {
                    $('#form_menu4')[0].reset();
                    $('#file' + num).attr('href', ''); //Conocimiento adquirido attr
                    $('#file' + num).hide();
                    var menj = 'Se ha borrado el archivo ' + num;
                    $('#mensaje').html(menj);
                    $('#incripcion_creada').modal('show');
                }
            }
        });
        return false;
    });

    var validador_errores_registroEjecucion = function(data) {
        $('#form_menu4 .form-group').removeClass('has-error');
        var selector = '';
        for (var error in data) {
            if (typeof data[error] !== 'function') {
                switch (error) {
                    case 'registroCivilT':
                        selector = 'input';
                        break;
                }
                $('#form_menu4 ' + selector + '[name="' + error + '"]').closest('.form-group').addClass('has-error');
            }
        }
    }


    $("#dptExp_estudiante").on('change', function(e) {
        ChangeDept1($("#dptExp_estudiante").val(), $("#dptExp_estudiante").val());
    });

    function ChangeDept1(id_dept, seleccion) {
        html = '';
        html += '<option value="">Seleccionar</option>';
        $.get(URL + '/getMunicipio/' + id_dept, {}, function(data) {
            $.each(data[0].municipios, function(i, e) {

                html += '<option value="' + e.id + '">' + e.municipio + '</option>';
            });
            $("#mpioExp_estudiante").html(html);
        })
    }



    $("#dptNaci_estudiante").on('change', function(e) {
        ChangeDept2($("#dptNaci_estudiante").val(), $("#dptNaci_estudiante").val());
    });

    function ChangeDept2(id_dept, seleccion) {
        html = '';
        html += '<option value="">Seleccionar</option>';
        $.get(URL + '/getMunicipio/' + id_dept, {}, function(data) {
            $.each(data[0].municipios, function(i, e) {

                html += '<option value="' + e.id + '">' + e.municipio + '</option>';
            });
            $("#mpioNaci_estudiante").html(html);
        })
    }


    $("#dptReci_estudiante").on('change', function(e) {
        ChangeDept3($("#dptReci_estudiante").val(), $("#dptReci_estudiante").val());
    });

    function ChangeDept3(id_dept, seleccion) {
        html = '';
        html += '<option value="">Seleccionar</option>';
        $.get(URL + '/getMunicipio/' + id_dept, {}, function(data) {
            $.each(data[0].municipios, function(i, e) {

                html += '<option value="' + e.id + '">' + e.municipio + '</option>';
            });
            $("#mpioReci_estudiante").html(html);
        })
    }


    $("#datepicker").datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'y-mm-dd'
    });




    $('#form_login_pin').on('submit', function(e) {

        $.post(
            URL + '/validacionPin',
            $(this).serialize(),
            function(data) {

                if (data.status == 'error') {
                    validador_errores(data.errors);
                } else {
                    if (data.status == 'invalido') {
                        $("#datosNoValidos").show(0);
                        setTimeout(function() {
                            $("#datosNoValidos").fadeOut(1500);
                        }, 3000);
                    } else {
                        $.get(
                            URL + '/validacionEstudiante/' + data[0].num_identidad_alumno, {},
                            function(data1) {
                                campos_formulario(data1);
                                $('input[name="numIdent_estudiante"]').val(data[0].num_identidad_alumno);
                                location.reload();
                            },
                            'json'
                        );

                    }

                }
            },
            'json'
        );

        e.preventDefault();
    });

    var campos_formulario = function(data) {
        if (data.estudiante.length > 0) {

            $.each(data, function(i, e) {
                $('input[name="_alumno"]').val(e[0].id);

                $('input[name="tipoIdent_estudiante"]').val(e[0].tipo_documento);
                $('input[name="numIdent_estudiante"]').val(e[0].documento);
                $("input[name='dptExp_estudiante'] option[value=" + e[0].dpto_expdicion + "]").attr("selected", true);
                $('input[name="mpioExp_estudiante"]').val(e[0].mpio_expdicion);
                $('input[name="nom1_estudiante"]').val(e[0].pmer_nombre);
                $('input[name="nom2_estudiante"]').val(e[0].sndo_nombres);
                $('input[name="apll1_estudiante"]').val(e[0].pmer_apellido);
                $('input[name="apll2_estudiante"]').val(e[0].sndo_apellido);
                $('input[name="gnro_estudiante"]').val(e[0].genero);
                $('input[name="fchaNaci_estudiante"]').val(e[0].fecha_nacimiento);
                $('input[name="dptNaci_estudiante"]').val(e[0].dpto_nacimiento);
                $('input[name="mpioNaci_estudiante"]').val(e[0].mpio_nacimiento);
                $('input[name="dirReci_estudiante"]').val(e[0].direccion);
                $('input[name="dptReci_estudiante"]').val(e[0].dpto_recidencia);
                $('input[name="mpioReci_estudiante"]').val(e[0].mpio_recidencia);
                $('input[name="brioReci_estudiante"]').val(e[0].brio_recidencia);
                $('input[name="zna_estudiante"]').val(e[0].zona);
                $('input[name="nvel_estudiante"]').val(e[0].nivel_sisben);
                $('input[name="nvelEst_estudiante"]').val(e[0].estrato);
                $('input[name="eps_estudiante"]').val(e[0].eps);
                $('input[name="tfono_estudiante"]').val(e[0].telefono);
                $('input[name="ftorRh_estudiante"]').val(e[0].rh);
                $('input[name="dcidad_estudiante"]').val(e[0].discapacidad);
                $('input[name="situAcad_estudiante"]').val(e[0].situacion_academica);

            });
        }

    }

    var llenar_documentos = function(data) {
        if (data.registroCivilT != '') {
            $('#file1').attr('href', data.registroCivilT);
            $('#file1').show();
        }
        if (data.certificadomedico != '') {
            $('#file2').attr('href', data.certificadomedico);
            $('#file2').show();
        }
        if (data.certificacioneps != '') {
            $('#file3').attr('href', data.certificacioneps);
            $('#file3').show();
        }
        if (data.cedulapadre != '') {
            $('#file4').attr('href', data.cedulapadre);
            $('#file4').show();
        }
        if (data.referencialaboral != '') {
            $('#file5').attr('href', data.referencialaboral);
            $('#file5').show();
        }
        if (data.carnetvacunas != '') {
            $('#file6').attr('href', data.carnetvacunas);
            $('#file6').show();
        }
        if (data.pazysalvo != '') {
            $('#file7').attr('href', data.pazysalvo);
            $('#file7').show();
        }
        if (data.boletinfinal != '') {
            $('#file8').attr('href', data.boletinfinal);
            $('#file8').show();
        }
        if (data.retirosimat != '') {
            $('#file9').attr('href', data.retirosimat);
            $('#file9').show();
        }
    }

    var validador_errores = function(data) {
        $('#form_login_pin .form-group').removeClass('has-error');
        var selector = '';
        for (var error in data) {
            if (typeof data[error] !== 'function') {
                switch (error) {

                    case 'num_identidad':
                    case 'pin':
                        selector = 'input';
                        break;

                }
                $('#form_login_pin ' + selector + '[name="' + error + '"]').closest('.form-group').addClass('has-error');
            }
        }
    }



     $('#crear_matricula').on('submit', function(e) {
                    $( "input[name='matri_num_alumn']" ).val($("input[name='id_alum']").val());
                    $('#modal_crear_matricula').modal('show');
        e.preventDefault();
    });

    $('#matricula_form').on('submit', function(e) {
        $.post(
            URL + '/registro_matricula',
            $(this).serialize(),
            function(data) {

                if (data.status == 'error') {
                    //console.log(data);
                    validador_errores_form_matri(data.errors);

                    var menj = ' <strong>Error!</strong> Revisa los campos de color rojo en el formulario.';
                    $('#men_error_matric').removeClass('alert-success');
                    $('#men_error_matric').addClass('alert-danger');
                    $('#men_error_matric').html(menj);
                    $("#men_error_matric").show(0);
                        setTimeout(function() {
                            $("#men_error_matric").fadeOut(1500);
                        }, 3000);
                    
                } else {
                    validador_errores_form_matri(data.errors);
                    var menj = 'Ha registrado la <strong>matricula</strong>.';
                    $('#men_error_matric').removeClass('alert-danger');
                    $('#men_error_matric').addClass('alert-success');
                    $('#men_error_matric').html(menj);
                    $("#men_error_matric").show(0);

                        console.log(data);
                        if(data!=1){
                            $.get(
                                URL + '/asignar_plan_pagos/' + data.id,
                                $(this).serialize(),
                                function(data) {
                                            setTimeout(function() {
                                                $("#men_error_matric").fadeOut(1500);
                                                $('#modal_crear_matricula').modal('hide');
                                            }, 3000);
                                        },
                                'json'
                            );
                        }else{
                            setTimeout(function() {
                                $("#men_error_matric").fadeOut(1500);
                                $('#modal_crear_matricula').modal('hide');
                            }, 3000);
                        }
                   
                }
            },
            'json'
        );
        e.preventDefault();
    });

    var validador_errores_form_matri = function(data) {

        $('#matricula_form .form-group').removeClass('has-error');
        var selector = '';
        for (var error in data) {
            if (typeof data[error] !== 'function') {
                switch (error) {
                    case 'matri_sede':
                    case 'matri_jornada':
                    case 'matri_tipo_estudiante':
                    case 'matri_grdo':
                    case 'matri_repitente':
                    case 'matri_ano':
                        selector = 'select';
                        break;

                    case 'matri_num_alumn':
                    case 'matri_folio':
                        selector = 'input';
                        break;
                }
                $('#matricula_form ' + selector + '[name="' + error + '"]').closest('.form-group').addClass('has-error');
            }
        }
    }






});
