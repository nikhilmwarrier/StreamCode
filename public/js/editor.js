const urlArray = window.location.href.split("/").reverse();
window.shareCode = urlArray[0] ? urlArray[0] : urlArray[1];
document.title += `: ${shareCode}`;
console.log(shareCode);
const isAdmin = sessionStorage.getItem(`codeShare ${shareCode} admin`);
if (isAdmin === "true") {
	alert(
		`To add more people, either share the current URL:\n${window.location.href}\n\nOr ask them to open Streamcode, choose "Join Stream" and enter this code: \n${shareCode}`
	);
}
const lang = shareCode.split("-")[0];
if (lang === "web") {
	document.querySelector("main").classList.add("web");
} else {
	document
		.querySelector('[data-opens-pane=".output-wrapper"]')
		.classList.remove("active");
	document
		.querySelector('[data-opens-pane=".dynamic.chat"]')
		.classList.add("active");
	document.querySelector(".dynamic.chat").style.display = "block";
}

const langData = () => {
	switch (lang) {
		case "web": {
			return;
		}
		case "py": {
			return {
				language: "python",
				langFormatted: "Python",
				defaultCode: "print('Hi')",
			};
		}
		case "cs": {
			return {
				language: "csharp",
				langFormatted: "C#",
				defaultCode: 'console.println("Hi")',
			};
		}
		case "java": {
			return {
				language: "java",
				langFormatted: "Java",
				defaultCode: [
					"public class Foo {",
					"	public static void Main(String, args[]) {",
					"		",
					"	}",
					"}",
				].join("\n"),
			};
		}
		case "md": {
			return {
				language: "markdown",
				langFormatted: "Markdown",
				defaultCode: [
					"---",
					"Feel free to use this as a _collaborative notepad_",
					"_Live_ Markdown parsing coming soon!",
					"Created by [nikhilmwarrier](https://github.com/nikhilmwarrier/)",
					"---",
					"",
					"# This is a Markdown file",
				].join("\n"),
			};
		}
		case "txt": {
			return {
				language: "plaintext",
				langFormatted: "Plain Text",
				defaultCode: [
					"This is a Plain Text file",
					"Feel free to use this as a collaborative notepad",
				].join("\n"),
			};
		}
		default:
			return {
				language: "plaintext",
				langFormatted: "Plain Text",
				defaultCode: [
					"This is a Plain Text file",
					"Feel free to use this as a collaborative notepad",
				].join("\n"),
			};
	}
};
if (lang !== "web") {
	document.querySelector(
		"header .language"
	).textContent = langData().langFormatted;
}

let editorTheme = "vs-dark";
window.bySocket = false;

const editorElement = document.getElementById("editor-html");

// const htmlDefaultCode = localStorage.getItem("htmlCode")
// 	? localStorage.getItem("htmlCode")
// 	: "<h1> Hello World! </h1>";

// const cssDefaultCode = localStorage.getItem("cssCode")
// 	? localStorage.getItem("cssCode")
// 	: ["h1 {", "	font-family: sans-serif;", "}"].join("\n");

// const jsDefaultCode = localStorage.getItem("jsCode")
// 	? localStorage.getItem("jsCode")
// 	: ["function doSomething(){", "	//Do something...", "}"].join("\n");

const htmlDefaultCode = "<h1> Hello World! </h1>";
const cssDefaultCode = ["h1 {", "	font-family: sans-serif;", "}"].join("\n");
const jsDefaultCode = [
	"function doSomething(){",
	"	//Do something...",
	"}",
].join("\n");

require.config({ paths: { vs: "../lib/monaco/min/vs" } });

const editorEl = document.getElementById("editor");

require(["vs/editor/editor.main"], function () {
	window.editor = monaco.editor.create(editorEl, {
		value: "//",
		theme: editorTheme,
		minimap: { enabled: false },
		automaticLayout: "enabled",
		readOnly: true,
	});
	if (lang === "web") {
		window.htmlEditor = monaco.editor.createModel(htmlDefaultCode, "html");
		window.cssEditor = monaco.editor.createModel(cssDefaultCode, "css");
		window.jsEditor = monaco.editor.createModel(jsDefaultCode, "javascript");
		editor.setModel(window.htmlEditor);
		emmetMonaco.emmetHTML(monaco);
		emmetMonaco.emmetCSS(monaco);
		if (!bySocket) {
			htmlEditor.onDidChangeContent(e => {
				handleContentChange("htmlEditor", e);
			});
			cssEditor.onDidChangeContent(e => {
				handleContentChange("cssEditor", e);
			});
			jsEditor.onDidChangeContent(e => {
				handleContentChange("jsEditor", e);
			});
		}
	} else {
		window.currentEditor = monaco.editor.createModel(
			langData().defaultCode,
			langData().language
		);
		editor.setModel(window.currentEditor);
		if (!bySocket) {
			window.editor.getModel().onDidChangeContent(e => {
				console.log("content-change", e);
				handleContentChange("currentEditor", e);
			});
		}
	}
	socket.on("remote-content-change", data => {
		if (lang === "web") window[data.editorModelName].applyEdits(data.changes);
		else window.editor.getModel().applyEdits(data.changes);
		bySocket = true;
	});
	editor.onKeyDown(() => (bySocket = false));

	const isAdmin = sessionStorage.getItem(`codeShare ${shareCode} admin`);
	if (isAdmin === "true") {
		editor.updateOptions({ readOnly: false });
		if (lang === "web") {
			socket.emit("sync-all", {
				html: htmlEditor.getValue(),
				css: cssEditor.getValue(),
				js: jsEditor.getValue(),
			});
		} else {
			console.log("syncing all editors");
			socket.emit("sync-all", {
				value: window.editor.getModel().getValue(),
			});
		}
	}
	socket.on("remote-user-joined", () => {
		if (!isAdmin) return;
		if (lang === "web") {
			socket.emit("sync-all", {
				html: htmlEditor.getValue(),
				css: cssEditor.getValue(),
				js: jsEditor.getValue(),
			});
		} else {
			console.log("syncing all editors");
			socket.emit("sync-all", {
				value: window.currentEditor.getValue(),
			});
		}
	});
	setInterval(() => {
		if (lang === "web") {
			if (window.htmlEditor.getValue() !== localStorage.getItem("htmlCode")) {
				document.querySelector(".html-unsaved").style.display = "block";
			} else {
				document.querySelector(".html-unsaved").style.display = "none";
			}

			if (window.cssEditor.getValue() !== localStorage.getItem("cssCode")) {
				document.querySelector(".css-unsaved").style.display = "block";
			} else {
				document.querySelector(".css-unsaved").style.display = "none";
			}
			if (window.jsEditor.getValue() !== localStorage.getItem("jsCode")) {
				document.querySelector(".js-unsaved").style.display = "block";
			} else {
				document.querySelector(".js-unsaved").style.display = "none";
			}
		}
	}, 1000);
});

document.querySelectorAll(".tab").forEach(tab => {
	tab.addEventListener("click", () => {
		document.querySelectorAll(".tab").forEach(_tab => {
			_tab.classList.remove("active");
		});
		const model = tab.getAttribute("data-opens-editor");
		editor.setModel(window[`${model}Editor`]);
		tab.classList.add("active");
	});
});

document.querySelectorAll(".dtab").forEach(tab => {
	tab.addEventListener("click", () => {
		const panes = document.querySelectorAll(".dynamic-pane .dynamic");
		panes.forEach(pane => (pane.style.display = "none"));
		document.querySelectorAll(".dtab").forEach(_tab => {
			_tab.classList.remove("active");
		});
		const pane = document.querySelector(tab.getAttribute("data-opens-pane"));
		pane.style.display = "block";
		tab.classList.add("active");
	});
});
