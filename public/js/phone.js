telInput = document.querySelector("input[type=tel]");

if (telInput) {
    telInput.addEventListener("input", function (e) { 
        this.value = this.value.replace(/[^\d\b-]/g,"");

        if (this.value.length === 3 && (e.data !== null)) {
            this.value += "-"
        }
        if (this.value.length === 7 && (e.data !== null)) {
            this.value += "-"
        }

    });
}
