//Dev Notes:
//January 2018
//Hello there and welcome to my app.js file! If you're here you must be curious about how this web app works. 
//Or you are trying to judge my coding abilities for some reason. 
//Well, hopefully I labelled everything clear enough for you (and myself) to understand what's going on.
//I built this app as a learning experience to learn how to use VueJS. I'm sort of a newb at this stuff still.
//I also thought it would be fun to have VR and AR versions of a dogecoin balance checker.
//I'm sure everything can be optimized and made a lot better but the point is that it works!


//localStorage variables
//userBalance = How much doge the user has
//userAddr = The last address the user checked
//exchangeRate = Current price of 1 doge
//currency = the selected currency exchange

Vue.component('modal', {
    template: '#modal-template'
})

var vm = new Vue({

    el: '#app',
    data: {
        balance: '', //balance with no decimals,
        balanceRaw: '', //Balance with decimals intact.
        addr: '', //This is connected to the form input. It is not visible on the page other than in the form.
        visibleAddr: '', //Address preset to show a default value.
        dogeCoinImg: 'images/dogecoin1.png', //Image of coin.
        QR: '', //Doge QR code is generated and URL goes here.
        QRisActive: false, //QR or Dogecoin Image is active.
        isRaw: true, //Click balance to show the decimal places or not.
        VRisOn: false,
        isActive: false,
        hasError: false,
        dogeExchangeRate: '1 Đ',
        dogeTargetCurrency: '',
        country: 'doge',
        dogeConversion: '',
        showModal: false,
        showConversion: false,
        showCurrencies: false,
        intBalance: ''

    },
    created: function () {
        this.dogeDefault(); //Gets the information for my default address to fill in everything.
    },
    methods: {

        dogeBalance: function () { //Checks balance for dogeaddress.
            this.balance = 'loading...';
            dogeAddr = document.getElementById('input').value //converts entered addr to dogeAddr variable.
            var vm = this;
            axios.get('https://dogechain.info/api/v1/address/balance/' + dogeAddr).then(function (response) { //puts dogeAddr variable at the end of the URL to get the balance.
                    var shortBal = parseInt(response.data['balance']); //Short Balance
                    var longBal = parseFloat(response.data['balance']); //Long Balance
                    var a = numeral(shortBal).format('0,0');
                    var b = numeral(longBal).format('0,0.00000000');
                    vm.intBalance = longBal;
                    vm.balance = a + ' Đ';
                    vm.balanceRaw = b + ' Đ';
                    vm.QR = 'https://dogechain.info/api/v1/address/qrcode/' + dogeAddr;
                    vm.visibleAddr = dogeAddr;
                    vm.dogeConversion = b;
                    localStorage.setItem("userBalance", b);
                    vm.convertDoge();
                })
                .catch(function (error) {
                    vm.balance = 'Much error...';
                    alert('Such Invalid Address...');
                    localStorage.setItem("userBalance", null);
                })
        },


        dogeExchange: function () { //Checks exchange rate
            var vm = this;
            if (vm.country != 'doge') { //If country isn't doge don't do this.
                dogeAddr = document.getElementById('input').value //converts entered addr to dogeAddr variable.

                axios.get('https://api.cryptonator.com/api/ticker/doge-' + vm.country).then(function (response) { //Gets current data
                        var dPrice = response.data.ticker['price']; //Doge Price
                        var dCurrency = response.data.ticker['target']; //Doge Target Currency
                        vm.dogeExchangeRate = dPrice;
                        vm.dogeTargetCurrency = dCurrency;
                        localStorage.setItem("exchangeRate", dPrice);
                        localStorage.setItem("currency", dCurrency);
                        vm.convertDoge();
                    })
                    .catch(function (error) {
                        vm.dogeExchangeRate = 'Much Error...';
                    })
            };
        },

        dogeCountry: function () {
            vm.dogeExchangeRate = "1Đ";
            vm.dogeTargetCurrency = ''
            vm.dogeConversion = vm.balance;
        },

        getCurrency: function () {
            vm.country = document.getElementById('currencyInput').value
        },


        dogeQR: function () {
            this.QR = 'loading...';
            this.dogeCoinImg = 'images/dogecoin1.png';
            dogeAddr = document.getElementById('input').value
            var vm = this;
            vm.QR = 'https://dogechain.info/api/v1/address/qrcode/' + dogeAddr; //puts dogeAddr variable at the end of the URL to get the QR image.

        },

        dogeImg: function () {
            dogeAddr = this.visibleAddr;
            var vm = this;
            vm.QR = 'https://dogechain.info/api/v1/address/qrcode/' + dogeAddr;

        },


        dogeDefault: function () { //performs the same functions as above but with default values in place.
            if (localStorage.getItem("userAddr") === null || '') { //hollyy woww. I can't believe I actually got this working! Checks if the user has entered an address before. If they have it reloads from local storage!
                this.balance = 'loading...';
                dogeAddr = 'DCuXRganmJgArhX14CPNVAWPitpBcBHvdu';
                var vm = this;
                axios.get('https://dogechain.info/api/v1/address/balance/' + dogeAddr).then(function (response) {
                        var shortBal = parseInt(response.data['balance']); //Short Balance
                        var longBal = parseFloat(response.data['balance']); //Long Balance
                        var a = numeral(shortBal).format('0,0');
                        var b = numeral(longBal).format('0,0.00000000');
                        vm.intBalance = longBal;
                        vm.balance = a + ' Đ';
                        vm.balanceRaw = b + ' Đ';
                        vm.QR = 'https://dogechain.info/api/v1/address/qrcode/' + dogeAddr;
                        vm.visibleAddr = dogeAddr;
                        vm.dogeExchangeRate = " Đ";
                        vm.dogeTargetCurrency = ''
                        vm.dogeConversion = vm.balance;
                        vm.dogeCountry();

                    })
                    .catch(function (error) {
                        vm.balance = 'Much Error...';
                    })
            } else {
                this.balance = 'loading...';
                var dogeAddr = localStorage.getItem("userAddr");
                var vm = this;
                axios.get('https://dogechain.info/api/v1/address/balance/' + dogeAddr).then(function (response) {
                        var shortBal = parseInt(response.data['balance']); //Short Balance
                        var longBal = parseFloat(response.data['balance']); //Long Balance
                        var a = numeral(shortBal).format('0,0');
                        var b = numeral(longBal).format('0,0.00000000');
                        vm.intBalance = longBal;
                        vm.balance = a + ' Đ';
                        vm.balanceRaw = b + ' Đ';
                        vm.QR = 'https://dogechain.info/api/v1/address/qrcode/' + dogeAddr;
                        vm.visibleAddr = dogeAddr;
                        vm.dogeConversion = b;
                        vm.dogeCountry();


                    })
                    .catch(function (error) {
                        vm.balance = 'Much Error...';
                    })
            }
        },

        dogeVisibleAddr: function () { //Creates the visibleAddr variable to display within the page.
            this.visibleAddr = 'loading...';
            dogeAddr = document.getElementById('input').value
            var vm = this;
            vm.visibleAddr = dogeAddr;
            localStorage.setItem("userAddr", dogeAddr);
        },


        dogeClearAddr: function () { //Clears the form after pressing main button.
            this.addr = '';
        },

        startVR: function () { //Unhides the VR scene and makes it full screen.
            document.querySelector('a-scene').enterVR();
            document.getElementById("VRDoge").style.visibility = "visible";
            document.querySelector('a-scene').addEventListener('exit-vr', function () { //Hides the VR scene and exits full screen.
                document.getElementById("VRDoge").style.visibility = "hidden";
            });

        },
        copyAddr: function () { //Clears the form after pressing main button.
            var copyText = vm.visibleAddr;
            window.clipboardData.setData("Text", input.val());
            alert("Copied the text: " + copyText.value);
        },

        convertDoge: function () {
            var balance = parseFloat(vm.intBalance);
            var balanceConverted = balance * vm.dogeExchangeRate;
            
            if (vm.country === 'usd' || vm.country === 'eur' || vm.country === 'gbp' || vm.country === 'aud'){
                vm.dogeConversion = numeral(balanceConverted).format('0,0.00');
            }else {
                vm.dogeConversion = numeral(balanceConverted).format('0,0.0000000');
            }
        },


    }

});

function confirmAR() {
    var response = confirm("AR mode requires you to be using a mobile browser. Safari for iOS11 and Chrome for Android. You'll also need to download the target image from the info tab. Press OK to continue.");

    if (response == true) {
        window.open('AR.html', 'mywindow');

    } else {}
};

function openQRCamera(node) { //Opens the camera or file explorer to get a picture of a QR code. So you don't have to type it in manually.
    var reader = new FileReader();
    reader.onload = function () {
        node.value = "";
        qrcode.callback = function (res) {
            if (res instanceof Error) {
                alert("Very error. Such QR code not found. So try again.");
            } else {
                node.parentNode.previousElementSibling.value = res;
            }
        };
        qrcode.decode(reader.result);
    };
    reader.readAsDataURL(node.files[0]);
}

function showQRIntro() {
    return confirm("Very Camera. So QR scanner. Now Open."); //Just a notice before it opens the camera. Not sure if it is really needed but it is a nice courtesy. 
};


function updatePrices(){ //This runs the DogeExchange function every 35 seconds to keep the price updated.
    vm.dogeExchange();
}

setInterval(function(){
    updatePrices()}, 35000);