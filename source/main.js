"use strict";

let forms = [
    `<dl class="formRow formRow--noColon formRow--input">
      <dt><div class="formRow-labelWrapper">
      <label class="formRow-label"><div class="bbWrapper">Выберите нужную форму</div></label>
      <dfn class="formRow-hint">Обязательно</dfn></div>
      </dt>
      <dd>
      <ul class="listColumns inputChoices">
      <li><label class="iconic  iconic--radio" id="nakForm"></label></li>
      </ul>
      <div class="formRow-explain">Укажите нужное вами наказание для игрока</div>
      </dd>
      </dl>
    `,
    `<dl class="formRow formRow--noColon formRow--input">
    <dt><div class="formRow-labelWrapper">
    <label class="formRow-label"><div class="bbWrapper">Никнейм игрока</div></label>
    <dfn class="formRow-hint">Обязательно</dfn></div>
    </dt><dd>
    <input type="text" class="input" id="nicknameForm" maxlength="40">
    <div class="formRow-explain">Укажите никнейм игрока</div>
    </dd></dl>
    `,
    `<dl class="formRow formRow--noColon formRow--input">
    <dt><div class="formRow-labelWrapper">
    <label class="formRow-label"><div class="bbWrapper">Причина наказания</div></label>
    <dfn class="formRow-hint">Обязательно</dfn></div>
    </dt><dd>
    <input type="text" class="input" id="reasonForm" maxlength="40">
    <div class="formRow-explain">Укажите причину наказания игрока</div>
    </dd></dl>
    `,
    `<dl class="formRow formRow--noColon formRow--input" id='tempDeleteForm'>
    <dt><div class="formRow-labelWrapper">
    <label class="formRow-label"><div class="bbWrapper">Время наказания</div></label>
    <dfn class="formRow-hint">Обязательно</dfn></div>
    </dt><dd>
    <input type="text" class="input" id="timeForm" maxlength="40">
    <div class="formRow-explain">Укажите время наказания игрока</div>
    </dd></dl>
    `]

let addFunc = [
    `<div class="formSubmitRow-bar"></div><div class="formSubmitRow-controls"><button id="buttonSendForm" class="button--primary button button--icon button--icon--save"><span class="button-text">Отправить форму</span></button></div>`
    ]

document.addEventListener('DOMContentLoaded', function() {
    $(document.createElement("span")).addClass("button--primary button button--icon button--icon--reply rippleButton").css("margin-right", "10px").prependTo('.formButtonGroup').attr("id", "menuForm").append("Формы")
    $("#menuForm").click(menu);
});

function get_nick() {
    let search = $('body')
    if (search) {
        if (search.html().match(new RegExp('Игровой ник нарушителя:(.*?)<'))) {
            return search.html().match(new RegExp('Игровой ник нарушителя:(.*?)<'))[1]
        } else {
            return ""
        }
    } else {
        return ""
    }
}

function get_id() {
    let search = $('body')
    if (search) {
        return search.html().match(new RegExp('<a href="/threads/(.*?)/"'))[1]
    } else {
        return ""
    }
}

function sendVK(text) {
    console.log(text)
    const url = "https://api.vk.com/method/messages.send";
    chrome.storage.local.get(['token_addonAaron', 'peer_id_addonAaron'], result => {
        console.log(result['token_addonAaron']);
        console.log(toString(result['token_addonAaron']));
        const data = {
            v: "5.154",
            peer_id: result['peer_id_addonAaron'],
            random_id: 0,
            message: text,
            access_token: result['token_addonAaron']
        };
        fetch(url, {
            method: 'POST',
            body: new URLSearchParams(data),
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
    })
}

function menu() {
    var nick = get_nick()
    var id = get_id()
    $('div.overlay-container').remove();
    document.body.className = 'is-modalOpen is-modalOverlayOpen';
    $(`<div class="overlay-container is-active">
      <div class="overlay"><div class="overlay-title">
        <span id="titleOverlay">Добавить форму на игрока</span>
        <a class="overlay-titleCloser"></a>
      </div>
      <div class="overlay-content"></div>
    </div>`).appendTo('body');
    $(".overlay-titleCloser").click(function() {$('div.overlay-container').remove();document.body.className = '';});
    $(".overlay-content").empty();
    $(document.createElement("legend")).css('width','100%').append(forms[0], forms[1], forms[2], forms[3]).appendTo("div.overlay-content");
    $(document.createElement("div")).addClass("formSubmitRow-main").append(addFunc[0]).appendTo(".overlay");
    $(document.createElement("select")).addClass("input").prop("title", "Форма").appendTo("#nakForm");
    $(document.createElement("option")).val(0).text("/jailoff").appendTo("#nakForm select");
    $(document.createElement("option")).val(1).text("/muteoff").appendTo("#nakForm select");
    $(document.createElement("option")).val(2).text("/banoff").appendTo("#nakForm select");
    $(document.createElement("option")).val(3).text("/warnoff").appendTo("#nakForm select");
    $(document.createElement("option")).val(4).text("/gunbanoff").appendTo("#nakForm select");
    $("#nicknameForm").val(nick)
    $("#reasonForm").val("ЖБ#" + id)
    var selectedForm = $("#nakForm select")
    selectedForm.change(function() {
        if (["0", "1", "2", "4"].indexOf(selectedForm.val()) !== -1) {
            var check = $("#timeForm")
            if (check.length == 0) {
                $("legend").append(forms[3])
            }
        } else {
            var check = $("#timeForm")
            if (check.length > 0) {
                $("#tempDeleteForm").remove()
            }
        }
    })

    $("#buttonSendForm").click(function() {
        var nickname = $("#nicknameForm")
        var time = $("#timeForm")
        var reason = $("#reasonForm")
        var selectedForm = $("#nakForm select")
        
        chrome.storage.local.get(['tags_addonAaron'], result => {
            if (nickname.val().length > 0 && reason.val().length > 0) {
                if (selectedForm.val() == "3") {
                    sendVK("!form /warnoff " + nickname.val() + " " + reason.val() + " " + result['tags_addonAaron'], 1, 1)
                    $('div.overlay-container').remove();document.body.className = '';
                }
            } if (nickname.val().length > 0 && time.val().length > 0 && reason.val().length > 0) {
                if (selectedForm.val() == "0") {
                    sendVK("!form /jailoff " + nickname.val() + " " + time.val() + " " + reason.val() + " " + result['tags_addonAaron'], 1, 1)
                    $('div.overlay-container').remove();document.body.className = '';
                } if (selectedForm.val() == "1") {
                    sendVK("!form /muteoff " + nickname.val() + " " + time.val() + " " + reason.val() + " " + result['tags_addonAaron'], 1, 1)
                    $('div.overlay-container').remove();document.body.className = '';
                } if (selectedForm.val() == "2") {
                    sendVK("!form /banoff 0 " + nickname.val() + " " + time.val() + " " + reason.val() + " " + result['tags_addonAaron'], 1, 1)
                    $('div.overlay-container').remove();document.body.className = '';
                } if (selectedForm.val() == "4") {
                    sendVK("!form /gunbanoff " + nickname.val() + " " + time.val() + " " + reason.val() + " " + result['tags_addonAaron'], 1, 1)
                    $('div.overlay-container').remove();document.body.className = '';
                };
            };
        })
    })
}