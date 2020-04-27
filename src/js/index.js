let portIsOpened = false
let logOpened = false
let logHeight = 250
$(document).ready(function () {
    let tabWidth = 0;
    let tabContentWidth = $('.nav-content').width()
    console.log('$(\'.nav-tabs li\').length', $('.nav-tabs li').length)
    for (let i = 0; i < $('.nav-tabs li').length; i++) {
        tabWidth += $(`.nav-tabs li`).eq(i).width()
    }

    console.log('tabContentWidth', tabContentWidth)
    console.log('tabWidth', tabWidth)
    $(`.nav-tabs`).width(tabWidth)
    let canRun = true
    $('.tab-arrow-next').click(function () {

        if (tabWidth < tabContentWidth) {
            console.log('显示的内容少')
            return false
        } else {
            const left = $(`.nav-tabs`).position().left - 32;
            console.log('left', left)
            if ((-left + tabContentWidth) >= tabWidth) {
                return false
            }

            if (canRun) {
                canRun = false;
                $(`.nav-tabs`).css({transform: ` translate3d(${left - 400}px, 0px, 0px)`});

                setTimeout(function () {
                    canRun = true
                }, 300)
            }
        }
    })
    $('.tab-arrow-pre').click(function () {
        if (tabWidth < tabContentWidth) {
            console.log('显示的内容少')
            return false
        } else {
            const left = $(`.nav-tabs`).position().left - 32;
            console.log('left', left)
            console.log('left+tabContentWidth', left + tabContentWidth)
            if (left === 0 || left + tabContentWidth >= tabWidth) {
                return false
            }

            if (canRun) {
                canRun = false;
                $(`.nav-tabs`).css({transform: ` translate3d(${left + 400}px, 0px, 0px)`});
                setTimeout(function () {
                    canRun = true
                }, 300)
            }
        }
    })


    var $d7input = $('#demo7 input').focus(function () {
        console.log('focus')
        console.log($d7input.data('value'))
        $('.dropdown-date', '#demo7').remove();
        var $dropdown = $('<div class="dropdown-date"/>')
            .appendTo('#demo7');
        setTimeout(function () {
            $dropdown.datetimepicker({
                date: $d7input.data('value')?new Date($d7input.data('value')): new Date(),
                viewMode: 'YMDHMS',
                onDateChange: function () {
                    $d7input.val(this.getText('YYYY-MM-DD HH:mm:ss'));
                    $d7input.data('value', this.getValue());

                },
                onOk: function () {
                    $dropdown.remove();
                }
            })
        }, 100);

    });
    let $d8input = $('#demo8 input').focus(function () {
        console.log('focus')
        $('.dropdown-date', '#demo7').remove();
        let $dropdown = $('<div class="dropdown-date"/>')
            .appendTo('#demo8');
        setTimeout(function () {
            $dropdown.datetimepicker({
                date: $d8input.data('value')?new Date($d8input.data('value')): new Date(),
                viewMode: 'YMD',
                onDateChange: function () {
                    $d8input.val(this.getText('YYYY-MM-DD'));
                    $d8input.data('value', this.getValue());

                },
                onOk: function () {
                    $dropdown.remove();
                }
            })
        }, 100);

    });


    function clickhide() {
        ZENG.msgbox._hide();
    }

    function clickautohide(i) {
        var tip = "";
        switch (i) {
            case 1:
                tip = "服务器繁忙，请稍后再试。";
                break;
            case 4:
                tip = "设置成功！";
                break;
            case 5:
                tip = "数据拉取失败";
                break;
            case 6:
                tip = "正在加载中，请稍后...";
                break;
        }
        ZENG.msgbox.show(tip, i, 3000);
    }

    for (let i = 0; i < document.querySelectorAll('.Cleave').length; i++) {
        new Cleave(document.querySelectorAll('.Cleave')[i], {
            phone: false,
            blocks: [2, 2, 2, 2, 2, 2, 2]
        });
    }

    new Cleave(document.querySelector('#new_meter_address'), {
        phone: false,
        blocks: [2, 2, 2, 2]
    });
    //初始化打开关闭按钮
    checkDisabled()

    $.ajaxSetup({
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        timeout: 5000,
    })

    $(document).bind("ajaxSend", function () {
        console.log('ajaxStart')
        $('.loader').css("display", "block");
    }).bind("ajaxComplete", function () {
        console.log('ajaxComplete')
        $('.loader').css("display", "none");
    });

    //开始测试
    $("#open-test").click(function () {
        let port = $("#port").val();
        let boderate = $("#baudRate").val();
        let dataBit = $("#data-bit").val();
        let stopBit = $("#stop-bit").val();
        let parity = $("#parity").val();
        if (!port) {
            console.log('请选择端口');
            swal('请选择端口');
            return false
        }
        addValInTextarea(JSON.stringify({
            active: true,
            baudRate: boderate,
            dataBits: dataBit,
            name: port,
            parity: parity,
            stopBits: stopBit
        }))
        $.ajax({
            type: "POST",
            url: `${config.prefix}/serial-port`,
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                active: true,
                baudRate: boderate,
                dataBits: dataBit,
                name: port,
                parity: parity,
                stopBits: stopBit
            }),
            success: function (response) {
                console.log('response:', response);
                portIsOpened = true;
                checkDisabled();
                showSucess('打开端口成功')
                // ZENG.msgbox.show('打开端口成功', 4, 1000);

            },
            error: function (error) {
                showError(error)
                // ZENG.msgbox.show(error.responseJSON.message, 5, 1000);
                console.log('error', error);
            }
        });
    });

    //关闭测试
    $("#close-test").click(function () {
        let port = $("#port").val();
        const that = this
        $.ajax({
            type: "POST",
            url: `${config.prefix}/serial-port`,
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                active: false,
                name: port,
            }),
            success: function (response) {
                console.log('response:', response);
                portIsOpened = false;
                checkDisabled()
                showSucess('关闭端口成功')

            },
            error: function (error) {
                showError(error)
                console.log('error', error);
            }
        });

    });

    //使用广播地址
    $("#use-broadcast").change(function (e) {
        if ($(this).is(':checked')) {
            console.log('check')
            $('#broadcast-address').attr({
                disabled: "disabled"
            })
        } else {
            $('#broadcast-address').removeAttr('disabled')
        }

    });

    //使输入框disabled
    function checkDisabled() {
        let shouldChangeArr = ['#port', '#baudRate', '#data-bit', '#stop-bit', '#parity', '#open-test']
        let shouldReverseChangeArr = ['#close-test', '#get-flow', '#read-StandardTime', '#write-StandardTime1', '#start-testing', '#get-preciseFlow', '#write-data', '#get-debugging', '#get-preciseFlow', '#change-number']
        if (portIsOpened) {
            for (let i = 0; i < shouldChangeArr.length; i++) {
                $(shouldChangeArr[i]).attr({
                    disabled: "disabled"
                })
            }
            for (let i = 0; i < shouldReverseChangeArr.length; i++) {
                $(shouldReverseChangeArr[i]).removeAttr('disabled')
            }
            $(".status-img").addClass("active");
        } else {
            for (let i = 0; i < shouldChangeArr.length; i++) {
                $(shouldChangeArr[i]).removeAttr('disabled')
            }
            for (let i = 0; i < shouldReverseChangeArr.length; i++) {
                $(shouldReverseChangeArr[i]).attr({
                    disabled: "disabled"
                })
            }
            $(".status-img").removeClass("active");
        }

    }
    let ip=localStorage.getItem('ip');
    if(ip){
        config.prefix=ip
    }
    $('#ip-address').val(config.prefix)
    $('#ip-address').change(function () {
        config.prefix=$(this).val();
        localStorage.setItem('ip',$(this).val())
    })
    $('#connect-ip').click(function () {
        $.ajax({
            type: "GET",
            url: `http://${config.prefix}/serial-port`,
            dataType: "json",
            success: function (response) {
                console.log('response:', response);
                for (let i = 0; i < response.length; i++) {
                    $('#port').append(`<option>${response[i].name}</option>`)
                    if (response[i].active) {
                        $("#port").val(response[i].name);
                        $("#baudRate").val(response[i].baudRate);
                        $("#data-bit").val(response[i].dataBits);
                        $("#stop-bit").val(response[i].stopBits);
                        $("#parity").val(response[i].parity);
                        portIsOpened = true;
                        checkDisabled()

                    }
                }
                showSucess('连接IP成功')

            },
            error: function (error) {
                console.log('error', error);
                swal({
                    title: '获取端口失败,请检查网络',
                    icon: "error",
                    closeOnClickOutside: false,
                });
            }
        });
    })


    $('.change-log-active').click(function () {
        logOpened = !logOpened;
        $(".container-tip").toggleClass("log-active");
        changeLoadOpen()
    })
    $('#get-flow').click(function () {
        const sendData = {};
        if (!$('#use-broadcast').is(':checked')) {
            sendData.address = $('#broadcast-address').val().replace(/\s*/g, "")
        }
        $.ajax({
            type: "GET",
            url: `http://${config.prefix}/meter-service/flow-data`,
            dataType: "json",
            data: sendData,
            success: function (response) {
                console.log('response:', response);
                showSucess('获取成功')
                for (let key in response) {
                    if ($(`#get-flow-${key}` && $(`#get-flow-${key}`).tagName === 'INPUT')) {
                        $(`#get-flow-${key}`).val(response[key])
                    }
                    if ($(`#get-flow-${key}` && $(`#get-flow-${key}`).tagName === 'DIV')) {
                        $(`#get-flow-${key}`).text(response[key])
                    }
                }
                const bitField = checkPalindrom(transilateBinary(response.bitField, 8))
                console.log(bitField);
                let status = ''
                switch (bitField.substr(0, 2)) {
                    case '00':
                        status = '开';
                        break;
                    case '01':
                        status = '关';
                        break;
                    case '11':
                        status = '异常';
                        break;
                    default:
                        break

                }
                console.log('status', status);
                $(`#get-flow-status`).val(status);
                for (let i = 2; i < bitField.length; i++) {
                    if (bitField[i] === '1') {
                        $(`#get-flow-b${i}`).prop("checked", true);
                    }
                    if (bitField[i] === '0' && i === 7) {
                        $(`#get-flow-b${i}`).prop("checked", true);
                    }

                }
            },
            error: function (error) {
                console.log('error', error);
                showError(error)
            }
        });
    })

    $('#get-preciseFlow').click(function () {
        const sendData = {};
        if (!$('#use-broadcast').is(':checked')) {
            sendData.address = $('#broadcast-address').val().replace(/\s*/g, "")
        }
        $.ajax({
            type: "GET",
            url: `http://${config.prefix}/meter-service/precise-flow-data`,
            dataType: "json",
            data: sendData,
            success: function (response) {
                console.log('response:', response);
                showSucess('获取成功')
                for (let key in response) {
                    if ($(`#get-preciseFlow-${key}` && $(`#get-preciseFlow-${key}`).tagName === 'INPUT')) {
                        $(`#get-preciseFlow-${key}`).val(response[key])
                    }
                    if ($(`#get-preciseFlow-${key}` && $(`#get-preciseFlow-${key}`).tagName === 'DIV')) {
                        $(`#get-preciseFlow-${key}`).text(response[key])
                    }

                }
            },
            error: function (error) {
                console.log('error', error);
                showError(error)
            }
        });
    })

    $('#get-debugging').click(function () {
        const sendData = {};
        if (!$('#use-broadcast').is(':checked')) {
            sendData.address = $('#broadcast-address').val().replace(/\s*/g, "")
        }
        $.ajax({
            type: "GET",
            url: `http://${config.prefix}/meter-service/debugging-ui-data`,
            dataType: "json",
            data: sendData,
            success: function (response) {
                console.log('response:', response);
                showSucess('获取成功')
                for (let key in response) {
                    if ($(`#get-debugging-${key}` && $(`#get-debugging-${key}`).tagName === 'INPUT')) {
                        $(`#get-debugging-${key}`).val(response[key])
                    }

                }
            },
            error: function (error) {
                console.log('error', error);
                showError(error)
            }
        });
    })

    $('#write-data').click(function () {
        const sendData = {};
        if (!$('#use-broadcast').is(':checked')) {
            sendData.address = $('#broadcast-address').val().replace(/\s*/g, "")
        }
        sendData.sumOfCooling = $('#write-data-sumOfCooling').val() ? Number($('#write-data-sumOfCooling').val()) : "";
        sendData.sumOfHeat = $('#write-data-sumOfHeat').val() ? Number($('#write-data-sumOfHeat').val()) : "";
        sendData.sumOfFlow = $('#write-data-sumOfFlow').val() ? Number($('#write-data-sumOfFlow').val()) : "";
        sendData.unit1 = $('#write-data-unit1').val();
        sendData.unit2 = $('#write-data-unit2').val();
        sendData.unit3 = $('#write-data-unit3').val();
        $.ajax({
            type: "POST",
            url: `http://${config.prefix}/meter-service/current-cumulative-data`,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(sendData),
            success: function (response) {
                console.log('response:', response);
                showSucess('写入成功')
            },
            error: function (error) {
                console.log('error', error);
                showSucess('获取成功')
            }
        });
    })


    $('#start-testing').click(function () {
        const sendData = {};
        if (!$('#use-broadcast').is(':checked')) {
            sendData.address = $('#broadcast-address').val().replace(/\s*/g, "")
        }
        $.ajax({
            type: "POST",
            url: `http://${config.prefix}/meter-service/start-testing`,
            dataType: "json",
            data: JSON.stringify(sendData),
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                console.log('response:', response);
                showSucess('启动测检成功')
            },
            error: function (error) {
                showError(error)

            }
        });
    })

    $('#change-meter-number').click(function () {
        const sendData = {};
        if (!$('#use-broadcast').is(':checked')) {
            sendData.address = $('#broadcast-address').val().replace(/\s*/g, "")
        }
        sendData.newAddress=$('#new_meter_address').val(),
        $.ajax({
            type: "POST",
            url: `http://${config.prefix}/meter-service/meter-num-address`,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(sendData),
            success: function (response) {
                console.log('response:', response);
                showSucess('修改水表地址成功')
            },
            error: function (error) {
                showError(error)

            }
        });
    })
    $('#write-StandardTime').click(function () {
        let standardTime = $('#standardTime').val();
        let sendData = {};
        if (standardTime) {
            sendData.year = (new Date($('#standardTime').val())).getFullYear();
            sendData.month = (new Date($('#standardTime').val())).getMonth() + 1;
            sendData.day = (new Date($('#standardTime').val())).getDate();
            sendData.hour = (new Date($('#standardTime').val())).getHours();
            sendData.minute = (new Date($('#standardTime').val())).getMinutes();
            sendData.second = (new Date($('#standardTime').val())).getSeconds();
        }
        if (!$('#use-broadcast').is(':checked')) {
            sendData.address = $('#broadcast-address').val().replace(/\s*/g, "")
        }
        console.log('sendData', sendData)
        $.ajax({
            type: "POST",
            url: `http://${config.prefix}/meter-service/standard-time`,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(sendData),
            success: function (response) {
                console.log('response:', response);
                showSucess('写入标准时间成功')
                $(`.standardTimeData`).val(response.standardTimeData)
            },
            error: function (error) {
                showError(error)

            }
        });
    })

    $('#read-StandardTime').click(function () {
        const sendData = {};
        if (!$('#use-broadcast').is(':checked')) {
            sendData.address = $('#broadcast-address').val().replace(/\s*/g, "")
        }
        $.ajax({
            type: "GET",
            url: `http://${config.prefix}/meter-service/standard-time`,
            dataType: "json",
            data: sendData,
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                console.log('response:', response);
                showSucess('读取标准时间成功');
                let date = `${response.year}-${fixedZero(response.month)}-${fixedZero(response.day)} ${fixedZero(response.hour)}:${fixedZero(response.minute)}:${fixedZero(response.second)}`
                $('#demo7 input').val(date);
                $('#demo7 input').data('value', date);
            },
            error: function (error) {
                showError(error)

            }
        });
    })


    $('#write-StandardTime2').click(function () {
        let standardTime = $('#standardTime2').val();
        let sendData = {};
        if (standardTime) {
            sendData.year = (new Date($('#standardTime2').val())).getFullYear();
            sendData.month = (new Date($('#standardTime2').val())).getMonth() + 1;
            sendData.day = (new Date($('#standardTime2').val())).getDate();
        }
        if (!$('#use-broadcast').is(':checked')) {
            sendData.address = $('#broadcast-address').val().replace(/\s*/g, "")
        }
        console.log('sendData', sendData)
        $.ajax({
            type: "POST",
            url: `http://${config.prefix}/meter-service/factory-date`,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(sendData),
            success: function (response) {
                console.log('response:', response);
                showSucess('写入出厂日期成功')
                $(`.standardTimeData`).val(response.standardTimeData)
            },
            error: function (error) {
                showError(error)

            }
        });
    })

    $('#read-StandardTime2').click(function () {
        const sendData = {};
        if (!$('#use-broadcast').is(':checked')) {
            sendData.address = $('#broadcast-address').val().replace(/\s*/g, "")
        }
        $.ajax({
            type: "GET",
            url: `http://${config.prefix}/meter-service/factory-date`,
            dataType: "json",
            data: sendData,
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                console.log('response:', response);
                showSucess('读取出厂日期成功');
                let date = `${response.year}-${fixedZero(response.month)}-${fixedZero(response.day)}`
                $('#demo8 input').val(date);
                $('#demo8 input').data('value', date);
            },
            error: function (error) {
                showError(error)

            }
        });
    })

    $('#write-mode').click(function () {
        let mode = $('#mode').val();
        let sendData = {};
        sendData.factoryMode = mode === '1' ? true : false;
        if (!$('#use-broadcast').is(':checked')) {
            sendData.address = $('#broadcast-address').val().replace(/\s*/g, "")
        }
        console.log('sendData', sendData)
        $.ajax({
            type: "POST",
            url: `http://${config.prefix}/meter-service/work-mode`,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(sendData),
            success: function (response) {
                console.log('response:', response);
                showSucess('写入运行模式成功')
            },
            error: function (error) {
                showError(error)

            }
        });
    })

    $('#correction-flow').click(function () {
        let sendData = {};
        sendData.correctionPoint1 = $('#correctionPoint1').val();
        sendData.correctionPoint2 = $('#correctionPoint2').val();
        sendData.correctionPoint3 = $('#correctionPoint3').val();
        sendData.correctionPoint4 = $('#correctionPoint4').val();
        if (!$('#use-broadcast').is(':checked')) {
            sendData.address = $('#broadcast-address').val().replace(/\s*/g, "")
        }
        console.log('sendData', sendData)
        $.ajax({
            type: "POST",
            url: `http://${config.prefix}/meter-service/flow-correction`,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(sendData),
            success: function (response) {
                console.log('response:', response);
                showSucess('流量修正成功')
            },
            error: function (error) {
                showError(error)

            }
        });
    })
    $('#start-usmTest').click(function () {
        const sendData = {};
        if (!$('#use-broadcast').is(':checked')) {
            sendData.address = $('#broadcast-address').val().replace(/\s*/g, "")
        }
        $.ajax({
            type: "POST",
            url: `http://${config.prefix}/meter-service/usm-test`,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(sendData),
            success: function (response) {
                console.log('response:', response);
                showSucess('开始USM测试成功')
            },
            error: function (error) {
                showError(error)
            }
        });
    })
    $('#read-usmTest').click(function () {
        console.log($('#usm-errorCode2'))
        console.log($('#usm-errorCode2')[0].type)
        const sendData = {};
        if (!$('#use-broadcast').is(':checked')) {
            sendData.address = $('#broadcast-address').val().replace(/\s*/g, "")
        }
        $.ajax({
            type: "GET",
            url: `http://${config.prefix}/meter-service/usm-test`,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: sendData,
            success: function (response) {
                console.log('response:', response);
                showSucess('读取USM测试成功')
                for (let key in response) {
                    if ($(`#usm-${key}` && $(`#usm-${key}`).type === 'text')) {
                        $(`#usm-${key}`).val(response[key])
                    }
                    if (response.errorCode1 === '00000001b') {
                        $('#usm-TIMEOUT_UP').prop("checked", true);
                    } else if (response.errorCode1 === '00000010b') {
                        $('#usm-TIMEOUT_DOWN').prop("checked", true);
                    } else if (response.errorCode1 === '00000100b') {
                        $('#usm-PW1ST_UP').prop("checked", true);
                    } else if (response.errorCode1 === '00001000b') {
                        $('#usm-PW1ST_DOWN').prop("checked", true);
                    }
                }
            },
            error: function (error) {
                showError(error)
            }
        });
    })

    $('#read-meter-params').click(function () {
        const sendData = {};
        if (!$('#use-broadcast').is(':checked')) {
            sendData.address = $('#broadcast-address').val().replace(/\s*/g, "")
        }
        $.ajax({
            type: "GET",
            url: `http://${config.prefix}/meter-service/meter-params`,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: sendData,
            success: function (response) {
                console.log('response:', response);
                showSucess('读取水表参数成功')
                for (let key in response) {
                    if ($(`#meter-params-${key}` && $(`#meter-params-${key}`).tagName === 'INPUT')) {
                        $(`#meter-params-${key}`).val(response[key])
                    }
                    if ($(`#meter-params-${key}` && $(`#meter-params-${key}`).tagName === 'DIV')) {
                        $(`#meter-params-${key}`).text(response[key])
                    }
                }
            },
            error: function (error) {
                showError(error)
            }
        });
    })

    $('#set-meter-params').click(function () {
        const sendData = {};
        if (!$('#use-broadcast').is(':checked')) {
            sendData.address = $('#broadcast-address').val().replace(/\s*/g, "")
        }
        sendData.sampleTime = $('#meter-params-sampleTime').val()
        sendData.zeroDrift = $('#meter-params-zeroDrift').val()
        sendData.pw1stThreshold = $('#meter-params-pw1stThreshold').val()
        sendData.tofUpperBound = $('#meter-params-tofUpperBound').val()
        sendData.tofLowerBound = $('#meter-params-tofLowerBound').val()
        sendData.tofMax = $('#meter-params-tofMax').val()
        sendData.initialFlow = $('#meter-params-initialFlow').val()
        sendData.pipeHorizontalLength = $('#meter-params-pipeHorizontalLength').val()
        sendData.pipeVerticalLength = $('#meter-params-pipeVerticalLength').val()
        sendData.pipeRadius = $('#meter-params-pipeRadius').val()
        sendData.unit1 = 'L/h'
        sendData.unit2 = 'L/h'
        $.ajax({
            type: "POST",
            url: `http://${config.prefix}/meter-service/meter-params`,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(sendData),
            success: function (response) {
                console.log('response:', response);
                showSucess('写入水表参数成功')
            },
            error: function (error) {
                showError(error)
            }
        });
    })

    function changeLoadOpen() {
        console.log('changeLoadOpen', logOpened)
        if (logOpened) {
            console.log({maxHeight: "calc(100vh- " + (logHeight + 25 + 42) + "px)"})
            $(".form-horizontal").css({maxHeight: "calc(100vh - " + (logHeight + 25 + 42) + "px)"});
            $(".tab-content").css({maxHeight: "calc(100vh - " + (logHeight + 25 + 42) + "px)"});
        } else {
            $(".tab-content").css({maxHeight: "calc(100vh - 67px)"});
            $(".form-horizontal").css({maxHeight: "calc(100vh - 67px)"});

        }
    }

    function addValInTextarea(value) {
        let preVal = $('#log-content').val();
        $('#log-content').val(preVal + value + '\n');
        $('#log-content').scrollTop($('#log-content').scrollTop() + 999);
    }

});