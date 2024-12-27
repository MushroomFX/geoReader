function limitFloat(num) {
    if (typeof num !== "number") return NaN;
    const parts = num.toString().split(".");
    if (parts.length === 1) return num;
    return parseFloat(`${parts[0]}.${parts[1].slice(0, 7)}`);
}
  

const categorys = document.querySelectorAll(".category");
categorys.forEach((category) => {
    const h2 = document.createElement("h2");
    h2.textContent = category.getAttribute("name");
    category.insertBefore(h2, category.firstChild);
    
    category.addEventListener("click", (e) => {
        if(e.target.innerHTML == category.getAttribute("name")){
            const isExpanded = category.getAttribute("isExpanded") === "true";
            category.setAttribute("isExpanded", isExpanded ? "false" : "true");
        }
    });
});
