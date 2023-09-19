const button = document.querySelector("button.btn")
button.addEventListener("click", () => {
    setTimeout(() => {
        document.querySelector("main").classList.remove("d-flex");
        document.querySelector("main").innerHTML =
    "<h1 style='text-align: center'>Do not reload the page, information is being gathered</h1>";
    }, 2000)
})
