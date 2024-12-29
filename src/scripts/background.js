const bgElem = document.querySelector("body")

setInterval(()=>{
    bgElem.style.backgroundPositionY = (window.scrollY - window.innerHeight *.25) + "px" 
})