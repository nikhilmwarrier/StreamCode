const htmlSection = document.getElementById("preview-html");
const cssSection = document.getElementById("preview-css");
const jsSection = document.getElementById("preview-js");

let currentHTMLcode = htmlSection.textContent;
let currentCSScode = cssSection.textContent;
let currentJScode = jsSection.textContent;

let savedHTMLcode = localStorage.getItem("htmlCode");
let savedCSScode = localStorage.getItem("cssCode");
let savedJScode = localStorage.getItem("jsCode");

function appendStyles() {
	let styles = outputWindow.document.createElement("style");
	outputWindow.document.head.appendChild(styles);
}

function updateCode() {
	htmlSection.textContent = localStorage.getItem("htmlCode");
	cssSection.textContent = localStorage.getItem("cssCode");
	jsSection.textContent = localStorage.getItem("jsCode");
	appendStyles();
	outputWindow.document.body.innerHTML = savedHTMLcode;
	outputWindow.document.head.querySelector("style").innerHTML = savedCSScode;
	outputWindow.window.eval(savedJScode);
	Prism.highlightAll();
}

updateCode();

// setInterval(() => {
// 	if (
// 		currentHTMLcode !== savedHTMLcode ||
// 		currentCSScode !== savedCSScode ||
// 		currentJScode !== savedJScode
// 	) {
// 		updateCode();
// 	} else return;
// }, 100);

const tabs = document.querySelectorAll(".tab");
tabs.forEach(tab => {
	const editors = document.querySelectorAll('pre[class*="language-"]');
	const tabOpensEditor = document.querySelector(tab.getAttribute("data-opens"));
	tab.addEventListener("click", () => {
		tabs.forEach(tab => tab.classList.remove("active"));
		editors.forEach(editor => editor.classList.remove("active"));
		tabOpensEditor.classList.add("active");
		tab.classList.add("active");
	});
});
