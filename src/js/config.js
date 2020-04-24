var config={
    prefix:'http://192.168.1.119:7406'
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
    ZENG.msgbox.show(message, 4, 2000);
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