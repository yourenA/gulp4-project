var config={
    prefix:'192.168.1.119:7406'
}
var pathMap={
    'serial-port|get':'获取端口',
    'serial-port|post':'打开/关闭端口',
    'flow-data|get':'读流量数据',
    'precise-flow-data|get':'读高精度流量数据',
    'debugging-ui-data|get':'读调试界面数据',
    'current-cumulative-data|post':'写当前数据',
    'start-testing|post':'启动检定',
    'standard-time|get':'读标准时间',
    'standard-time|post':'写标准时间',
    'meter-num-address|get':'读取表号地址',
    'meter-num-address|post':'设置表号地址',
    'factory-date|post':'写出厂日期',
    'factory-date|get':'读出厂日期',
    'work-mode|post':'转换运行模式',
    'flow-correction|post':'流量修正',
    'usm-test|post':'开始USM测试',
    'usm-test|get':'读USM测试结果',
    'valve-ctrl|post':'阀控命令',
    'lora-params|get':'读Lora参数',
    'lora-params|post':'写Lora参数',
    'meter-params|get':'读水表参数',
    'meter-params|post':'写水表参数',
}
function transilateBinary(num, Bits=16) {
    var resArry = [];
    var xresArry = [];
    let i=0;
    for(;num>0;){
        resArry.push(num % 2);
        num=parseInt(num/2);
        i++;
    }
    for(let j=i-1;j>=0;j--)
        xresArry.push(resArry[j]);
    if (Bits < xresArry.length) {
        console.log("位数小于二进制位数")
    }
    if (Bits) {
        for(let r = xresArry.length; r < Bits; r++) {
            xresArry.unshift(0);
        }
    }
    return xresArry.join().replace(/,/g, '')
}

function checkPalindrom(str) {
    return str.split('').reverse().join('');

}
function showSucess(message) {
    swal(message, "", "success");
}
function showError(error) {
    console.log('error', error);
    swal(error.responseJSON?error.responseJSON.message:'出现未知错误，请重试', "", "error");
    // ZENG.msgbox.show(error.responseJSON?error.responseJSON.message:'出现未知错误，请重试', 5, 2500);
}

function fixedZero(val) {
    return val * 1 < 10 ? `0${val}` : val;
}