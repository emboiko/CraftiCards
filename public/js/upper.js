pinInput = document.querySelector("#pin");

if (pinInput) {
    pinInput.addEventListener("input", function (e) {
        this.value = this.value.toUpperCase();
    });
}

