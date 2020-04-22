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

            if(canRun){
                canRun = false;
                $(`.nav-tabs`).css({transform: ` translate3d(${left + 400}px, 0px, 0px)`});
                setTimeout(function () {
                    canRun = true
                }, 300)
            }
        }
    })


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

    //初始化打开关闭按钮
    checkDisabled()

    //开始测试
    $("#open-test").click(function () {
        let port = $("#port").val();
        let boderate = $("#baudRate").val();
        let dataBit = $("#data-bit").val();
        let stopBit = $("#stop-bit").val();
        let parity = $("#parity").val();
        if (!port) {
            console.log('请选择端口');
            ZENG.msgbox.show('请选择端口', 1, 1000);
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
                ZENG.msgbox.show('打开端口成功', 4, 1000);

            },
            error: function (error) {
                ZENG.msgbox.show(error.responseJSON.message, 5, 1000);
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
                ZENG.msgbox.show('关闭端口成功', 4, 1000);

            },
            error: function (error) {
                ZENG.msgbox.show(error.responseJSON.message, 5, 1000);
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
        let shouldReverseChangeArr = ['#close-test', '#get-test']
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

    $.ajax({
        type: "GET",
        url: `${config.prefix}/serial-port`,
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

        },
        error: function (error) {
            console.log('error', error);
            ZENG.msgbox.show('获取端口失败', 5, 1000);
        }
    });

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
            url: `${config.prefix}/meter-service/flow-data`,
            dataType: "json",
            data: sendData,
            success: function (response) {
                console.log('response:', response);
                ZENG.msgbox.show('获取成功', 4, 1000);
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
                ZENG.msgbox.show(error.responseJSON.message, 5, 2000);
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
            url: `${config.prefix}/meter-service/precise-flow-data`,
            dataType: "json",
            data: sendData,
            success: function (response) {
                console.log('response:', response);
                ZENG.msgbox.show('获取成功', 4, 1000);
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
                ZENG.msgbox.show(error.responseJSON.message, 5, 2000);
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
            url: `${config.prefix}/meter-service/debugging-ui-data`,
            dataType: "json",
            data: sendData,
            success: function (response) {
                console.log('response:', response);
                ZENG.msgbox.show('获取成功', 4, 1000);
                for (let key in response) {
                    if ($(`#get-debugging-${key}` && $(`#get-debugging-${key}`).tagName === 'INPUT')) {
                        $(`#get-debugging-${key}`).val(response[key])
                    }

                }
            },
            error: function (error) {
                console.log('error', error);
                ZENG.msgbox.show(error.responseJSON.message, 5, 2000);
            }
        });
    })

    $('#write-data').click(function () {
        $.ajax({
            type: "POST",
            url: `${config.prefix}/meter-service/current-cumulative-data`,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                sumOfCooling: $('#write-data-sumOfCooling').val() ? Number($('#write-data-sumOfCooling').val()) : "",
                sumOfHeat: $('#write-data-sumOfHeat').val() ? Number($('#write-data-sumOfHeat').val()) : "",
                sumOfFlow: $('#write-data-sumOfFlow').val() ? Number($('#write-data-sumOfFlow').val()) : "",
                unit1: $('#write-data-unit1').val(),
                unit2: $('#write-data-unit2').val(),
                unit3: $('#write-data-unit3').val(),
            }),
            success: function (response) {
                console.log('response:', response);
                ZENG.msgbox.show('写入成功', 4, 1000);
            },
            error: function (error) {
                console.log('error', error);
                ZENG.msgbox.show(error.responseJSON.message, 5, 2500);
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