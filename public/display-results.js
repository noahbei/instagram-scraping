//get display buttons
const allButton = document.querySelector("#all")
const inputButton = document.querySelector("#input")
const outputButton = document.querySelector("#output")
const overlapButton = document.querySelector("#overlap")

//get display elements
const inputContainer = document.querySelector("#input-container")
const outputContainer = document.querySelector("#output-container")
const onlyInFollowersDiv = document.querySelector("#onlyInFollowersDiv")
const onlyInFollowingDiv = document.querySelector("#onlyInFollowingDiv")

allButton.addEventListener("click", () => {
    //rm hidden from 2 onlyIn, input div, output div
    inputContainer.classList.remove("hidden")
    outputContainer.classList.remove("hidden")
    onlyInFollowersDiv.classList.remove("hidden")
    onlyInFollowingDiv.classList.remove("hidden")
})

inputButton.addEventListener("click", () => {
    //rm hidden from 2 onlyIn, input div
    //add hidden to output div
    inputContainer.classList.remove("hidden")
    outputContainer.classList.add("hidden")
    onlyInFollowersDiv.classList.remove("hidden")
    onlyInFollowingDiv.classList.remove("hidden")
})

outputButton.addEventListener("click", () => {
    //rm hidden from 2 onlyIn, output div
    //add hidden to input div
    inputContainer.classList.add("hidden")
    outputContainer.classList.remove("hidden")
    onlyInFollowersDiv.classList.remove("hidden")
    onlyInFollowingDiv.classList.remove("hidden")
})

overlapButton.addEventListener("click", () => {
    //add hidden to 2 onlyIn, input div, output div
    inputContainer.classList.add("hidden")
    outputContainer.classList.remove("hidden")
    onlyInFollowersDiv.classList.add("hidden")
    onlyInFollowingDiv.classList.add("hidden")
})