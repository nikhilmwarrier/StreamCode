const username = localStorage.getItem("username")
	? localStorage.getItem("username")
	: prompt("Enter username");
if (!username) window.location.href = "/";

const socket = io();
socket.emit("user-joined", { username, room: shareCode });

socket.on("updated-user-data", data => {
	console.log(`data incoming`, data);
	updateUsersListWith(data);
});

socket.emit("request-user-data");

function handleContentChange(editorModelName, e) {
	if (bySocket) return;
	socket.emit("editor-model-content-change", {
		editorModelName,
		changes: e.changes,
	});
}

function changeText(e) {
	editor.getModel().applyEdits(e.changes); //change Content
}

function handleRunCode(data) {
	if (runEventBySocket) return;
	socket.emit("run-code", data);
	console.log("Emit run event");
}

socket.on("remote-run-code", data => {
	console.log("Run received");
	run({ _bySocket: true });
});

socket.on("remote-sync", values => {
	console.log("syncing...");
	if (lang === "web") {
		htmlEditor.setValue(values.html);
		cssEditor.setValue(values.css);
		jsEditor.setValue(values.js);
		run();
	} else if (lang !== "web") {
		editor.getModel().setValue(values.value);
	}
});

//#region Chat
function sendChatMessage(msg) {
	socket.emit("chat-message", { username, msg });
}
socket.on("remote-chat-message", data => {
	insertMessage(data);
});
//#endregion
