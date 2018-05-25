if (!Object.assign) {
    Object.assign = (target, ...args) => {
        const _target = target
        console.log(args, 111)
        args.forEach(list => {
            for (let item in list) {
                _target[item] = list[item]
            }
        })
        return _target
    }
}
var Base = {
    url: {
        Api: process.env.CINTRACT,  //合同
        api: process.env.CLUE //线索详情
        // api:'http://qywx.uat.shbaoyuantech.com/cc-contract' //线索
    },

    ajax: function (url, option = {}) {
        // console.log(process.env)
        if (!url) return;
        if (!option.hideLoading) {
            Base.showLoading();
        }
        var base = new Base64();

        if (option.noToken == true) {
            var params = {
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                }
            }
        } else {
            var hostNames = [
                '',
                'localhost',
                '127.0.0.1',
                '192.168.1.189'
            ]
            //判断环境
            if (hostNames.indexOf(window.location.hostname) > -1) {
                var token = 'Bearer ' + base.encode('cf0b097e-e842-412d-962c-00b132292646')
            } else {
                var token = 'Bearer ' + base.encode(JSON.parse(eval('(' + this.getItem('COOKIE_TOKEN_KEY') + ')')).accessToken)
            }
            var params = {
                headers: {
                    "Authorization": token,
                    "Content-Type": "application/json; charset=UTF-8",
                }
            }
        }

        let method = option.method || 'get';
        let data = option.data || {};
        if (method == 'get') {
            url = url + (data ? '?' + Base.formDataCode(data) : '')
        } else {
            params.method = method
            if (option.formData) {
                params.headers['Content-Type'] = "application/x-www-form-urlencoded"
                params.body = Base.formDataCode(data)
            }
            else
                params.body = JSON.stringify(data)
        }
        // alert("undefined" != typeof fetch)
        return fetch(url, params).then(Base.callback).catch(Base.errHandle)
    },

    formDataCode: function (data) {
        let str = '';
        for (let i in data) {
            if (data.hasOwnProperty(i)) {
                str = str + i + "=" + data[i] + '&';
            }
        }
        return (str ? str.substring(0, str.length - 1) : '');
    },
    callback: function (res) {
        // 刷新token
        if (res.status == 401) {
            Base.removeItem('COOKIE_TOKEN_KEY');
            var params = {
                noToken: true,
                method: "POST",
                formData: true,
                data: {
                    originUrl: window.location.href
                }
            }
            Base.ajax(`${Base.url.Api}/get-wechat-auth-link`, params).then(res => {
                if (res.code == 0) {
                    window.location.href = res.data.wechatAuthUrl;
                }
            })
        }

        Base.hideLoading();
        return res.json().then(response => {
            if (response.code != 0) {
                Base.alert(response.message || '请求失败')
                // alert(response.message || '请求失败')
            } else {
                return response
            }
        })

    },
    errHandle: function (res) {
        Base.hideLoading()

        // console.error(res)
        // if(res.errcode == -1) {
        // alert(res.errmsg)
        // }
    },
    getItem: function (name) {
        var v = localStorage.getItem(name);
        return (v == undefined ? null : v);
    },
    removeItem: function (name) {
        localStorage.removeItem(name);
    },
    getCookie: function (url) {
        if (this.getItem('COOKIE_TOKEN_KEY') == null) {
            if (this.readCookie('COOKIE_TOKEN_KEY') == null) {

                var href = window.location.href;

                var params = {
                    noToken: true,
                    method: "POST",
                    formData: true,
                    data: {
                        originUrl: url
                    }
                };
                this.ajax(`${this.url.Api}/get-wechat-auth-link`, params).then(res => {
                    if (res.code == 0) {
                        window.location.href = res.data.wechatAuthUrl;
                    }
                })
            } else {
                var token = this.readCookie('COOKIE_TOKEN_KEY');
                this.addItem('COOKIE_TOKEN_KEY', token);
                return true
            }
        } else {
            return true
        }

    },
    isPC: function () {
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        console.log(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)
        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
            return false
        } else {
            return true
        }
    },
    legInputName: function (v) {

        return v.replace(/[^\dA-z\u4e00-\u9fa5\' ]+/g, '')

    },
    getItem: function (name) {
        var v = localStorage.getItem(name);
        return (v == undefined ? null : v);
    },
    addItem: function (name, value) {
        localStorage.setItem(name, value);
    },
    readCookie: function (name) {
        var arr = document.cookie.split('; ');
        for (var i = 0; i < arr.length; i++) {
            var arr2 = arr[i].split('=');
            if (arr2[0] == name) {
                return unescape(arr2[1]);
            }
        }
        return null
    },
    getCookienew : function(name){
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
        else
        return null;
    },

    getDateDiff: function (time) {
        if (!time) return { default: '', hasMills: '' }

        var today = new Date().getTime()
        var dayCount = Math.ceil((today - time) / 1000 / 60 / 60 / 24) + (new Date().Format('hh:mm') >= new Date(time).Format('hh:mm') ? -1 : 0)
        var millMS = new Date(time).Format('hh:mm')
        var dateTime3 = new Date(time).Format('yyyy-MM-dd')
        var toDay = new Date().Format('yyyy-MM-dd') === new Date(time).Format('yyyy-MM-dd')

        var result = '', resultHasMills = ''

        if (dayCount === 0 || toDay) {
            resultHasMills = result = '今天 ' + millMS
        } else if (dayCount === 1) {
            resultHasMills = result = '昨天 ' + millMS
        } else {
            result = dateTime3
            resultHasMills = dateTime3 + " " + millMS
        }

        return {
            default: result,
            hasMills: resultHasMills
        }
    },
    mobile: function (mobile) {
        if (!mobile) return;

        if (mobile.length === 11)
            mobile = mobile.replace(/(^\d{3}|\d{4}\B)/g, "$1-")

        return mobile
    },
    formatWeek: function (num) {
        var res = '';
        switch (num) {
            case 1:
                res = '周一';
                return res;
            case 2:
                res = '周二';
                return res;
            case 3:
                res = '周三';
                return res;
            case 4:
                res = '周四';
                return res;
            case 5:
                res = '周五';
                return res;
            case 6:
                res = '周六';
                return res;
            case 0:
                res = '周日';
                return res;
        }
    },
    showLoading: function () {
        var showTemp = document.createElement('div');
        showTemp.className = 'loading-wrap am-activity-indicator am-activity-indicator-sm am-activity-indicator-toast';
        showTemp.innerHTML = '<div class="am-activity-indicator-content"><span class="am-activity-indicator-spinner am-activity-indicator-spinner-lg" aria-hidden="true"></span><span class="am-activity-indicator-toast">正在加载</span></div>'
        document.body.appendChild(showTemp)
    },
    hideLoading: function () {
        var showTemp = document.getElementsByClassName("loading-wrap")[0];
        if (showTemp)
            document.body.removeChild(showTemp)
    },
    alert: function () {
        if (document.getElementById('custom-alert-wrap')) {
            document.body.removeChild(document.getElementById('custom-alert-wrap'))
        }

        var arguLen = arguments.length
        var arg0 = arguments[0], arg1 = arguments[1], arg2 = arguments[2] || [{text: '确定', onPress: function () {}}]

        var title = function (msg) {
            return '<div class="am-modal-header"><div class="am-modal-title" id="rcDialogTitle-n">' + msg + '</div></div>'
        }
        var body = function (msg) {
            return '<div class="am-modal-body"><div style="zoom:1;overflow:hidden"><span>' + msg + '</span></div></div>'
        }
        var footer = function (btns) {
            var btnL = btns.length === 1 ? 'v' : 'h'
            var element = '<div class="am-modal-footer"><div id="custom-alert" class="am-modal-button-group-' + btnL + ' am-modal-button-group-normal" role="group">'
            btns.forEach(function (list) {
                element += '<a class="am-modal-button" role="button">' + list.text + '</a>'
            })
            element += '</div></div>'
            return element
        }

        var titleEle = '', bodyEle = '', footerEle = ''
        if (arguLen === 3 || (arguLen === 2 && typeof arg1 !== 'object')) {
            titleEle = title(arg0)
            bodyEle = body(arg1)
            footerEle = footer(arg2)
        } else if (arguLen === 2) {
            titleEle = title(arg0)
            footerEle = footer(arg1)
        } else if (arguLen === 1) {
            titleEle = title('提示')
            bodyEle = body(arg0)
            footerEle = footer(arg2)
        }


        var node = document.createElement('div')
        var ele = '' +
            '<div class="am-modal-mask"></div>' +
            '<div tabindex="-1" class="am-modal-wrap " role="dialog" aria-labelledby="rcDialogTitle0">' +
            '<div role="document" class="am-modal am-modal-transparent" style="width: 5.4rem; height: auto;">' +
            '<div class="am-modal-content">' +
            titleEle + bodyEle + footerEle
        '</div>' +
        '<div tabindex="0" style="width: 0px; height: 0px; overflow: hidden;">sentinel</div>' +
        '</div>' +
        '</div>'

        node.setAttribute('id', 'custom-alert-wrap')
        node.innerHTML = ele
        document.body.appendChild(node)
        var okBtn = document.getElementById('custom-alert').children

        Array.from(okBtn).forEach(function (list, index) {
            list.addEventListener('click', function () {
                arg2[index] && arg2[index].onPress()
                Base.alertHide()
            })
        })
    },
    alertHide: function () {
        var alertWrap = document.querySelector('#custom-alert-wrap')
        document.body.removeChild(alertWrap)
    },
    resolveKeepOut: function () {
        var wHeight = window.innerHeight;

        var lHeight = document.body.scrollHeight + 1;
        // if(/Android [4-6]/.test(navigator.appVersion)) {
        window.addEventListener('click', function () {
            if (document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA") {
                window.setTimeout(function () {
                    var hh = window.innerHeight;
                    document.addEventListener('touchmove', function () {
                        if (!document.getElementById('soft-mask')) return;

                        document.getElementById('soft-mask').style.display = 'none'
                    })

                    if (wHeight > hh) {
                        // alert('键盘占位')
                        // document.body.style.height=lHeight+'px';
                        // document.body.scrollTop=document.activeElement.offsetTop-120;
                    } else if (wHeight <= hh) {
                        var nodeOffset = document.activeElement.parentNode.parentNode.offsetTop
                        // if(document.activeElement.parentNode.parentNode)
                        if (!document.getElementById('soft-mask')) return;
                        if (document.activeElement.parentNode.parentNode.className.match('ipt-top')) {
                            document.getElementById('soft-mask').style.display = 'block'
                            document.getElementsByClassName('detail-scroll-box')[0].scrollTop = document.getElementsByClassName('detail-scroll-box')[0].scrollTop + 400;
                            console.log(document.getElementsByClassName('detail-scroll-box')[0].scrollTop)
                        } else {
                            document.getElementById('soft-mask').style.display = 'none'
                            document.getElementsByClassName('detail-scroll-box')[0].scrollTop = document.getElementsByClassName('detail-scroll-box')[0].scrollTop + 40
                        }

                    }
                }, 1000)
            }
        })
        // }
    },
    decode: function (input) {
        var base64 = new Base64()
        return base64.decode(input)
    },
    encode: function (input) {
        var base64 = new Base64()
        return base64.encode(input)
    },
    keyCodeBack: function (removePopState) {

        var STATE = 'x-back'

        if (window.history.state !== STATE && !removePopState) {
            Base.popRecord(STATE)
        }

        if (removePopState) {
            window.removeEventListener('popstate', Base.onPopState)
            return;
        }

        window.addEventListener('popstate', Base.onPopState)


    },
    onPopState: function () {
        var STATE = 'x-back'
        // Base.alert(`提示`, `确定离开此页面？<br />您所有的修改将不会被保留！`, [
        //     { text: '取消', onPress: () => { Base.popRecord(STATE) } },
        //     { text: '确定', onPress: () => { Base.popSuccessBack()   } }
        // ])
    },
    popSuccessBack: function () {
        window.removeEventListener('popstate', Base.onPopState)
        window.history.back()
    },
    popRecord: function (state) {
        window.history.pushState(state, null, window.location.href)
    }
}

Number.prototype.formatMoney = function (places, symbol, thousand, decimal) {
    places = !isNaN(places = Math.abs(places)) ? places : 2;
    symbol = symbol !== undefined ? symbol : "$";
    thousand = thousand || ",";
    decimal = decimal || ".";
    var number = this,
        negative = number < 0 ? "-" : "",
        i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
};

function Base64() {
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    this.encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }
    this.decode = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
        return output;
    }

    function _utf8_encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    }

    function _utf8_decode(utftext) {
        var string = "";
        var c2, c1;
        var i = 0;
        var c = c1 = c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }

}

module.exports = Base;
