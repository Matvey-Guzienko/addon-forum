'use strict';
window.addEventListener('load', function () {
    chrome.storage.local.get(['peer_id_addonAaron'], result => {
        $("#peer_id").val(result['peer_id_addonAaron']);
    })
    chrome.storage.local.get(['token_addonAaron'], result => {
        $("#tokenVk").val(result['token_addonAaron']);
    })
    chrome.storage.local.get(['tags_addonAaron'], result => {
        $("#tags").val(result['tags_addonAaron']);
    })
    const forms = document.querySelectorAll('.needs-validation')

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            } else {
                event.preventDefault();
                chrome.storage.local.set({tags_addonAaron: $('#tags').val()})
                chrome.storage.local.set({token_addonAaron: $('#tokenVk').val()})
                chrome.storage.local.set({peer_id_addonAaron: $('#peer_id').val()})
            }

            form.classList.add('was-validated')
        }, false)
    })
})