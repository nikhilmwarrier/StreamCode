window.runEventBySocket = false;

const predefinedScripts = `
document.querySelectorAll('a[href*="#"]').forEach(link => {
	link.addEventListener('click', e => {
		e.preventDefault()
	})
});
`;

function appendStyles() {
	let styles = outputWindow.document.createElement("style");
	outputWindow.document.head.appendChild(styles);
}

appendStyles();

function run(options) {
	if (lang !== "web") return;
	if (options && options._bySocket) runEventBySocket = true;
	else runEventBySocket = false;
	console.log("Run Started");
	const htmlCode = window.htmlEditor.getValue();
	const cssCode = window.cssEditor.getValue();
	const jsCode = window.jsEditor.getValue();

	appendStyles();

	outputWindow.document.body.innerHTML = htmlCode;
	outputWindow.document.head.querySelector("style").innerHTML = cssCode;
	outputWindow.window.eval(predefinedScripts + jsCode);
	localStorage.setItem("htmlCode", htmlCode);
	localStorage.setItem("cssCode", cssCode);
	localStorage.setItem("jsCode", jsCode);
	const isAdmin = sessionStorage.getItem(`codeShare ${shareCode} admin`);
	if (!isAdmin) return;
	handleRunCode(null);
}
