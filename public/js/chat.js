const chatForm = document.getElementById("chat-msg-form");

chatForm.addEventListener("submit", e => {
	e.preventDefault();
	const textField = chatForm.querySelector("input");
	const msg = textField.value;
	if (!msg) return;
	insertMessage({ username, msg });
	sendChatMessage(msg);
	textField.value = "";
});

function insertMessage(data) {
	const messagesDiv = document.getElementById("messages");
	const msgDiv = document.createElement("div");
	msgDiv.classList.add("message");
	msgDiv.innerHTML = `
    <span class="user">${data.username}</span>
    <span class="message-text">${data.msg}</span>
    `;
	messagesDiv.appendChild(msgDiv);
	messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

document
	.querySelector('[data-opens-pane=".dynamic.chat"]')
	.addEventListener("click", () => {
		console.log("clicked");
		document.getElementById("chat-msg-form").querySelector("input").focus();
		console.log(
			document.getElementById("chat-msg-form").querySelector("input")
		);
	});

function updateUsersListWith(usersArray) {
	const usersList = usersArray;
	const targetEl = document.querySelector(".dynamic.people");
	targetEl.innerHTML = "";
	usersList.forEach(person => {
		if (!person) return;
		const el = document.createElement("div");

		const user = document.createElement("div");
		el.classList.add("user");
		user.innerText = `${person}`;
		el.appendChild(user);

		// const controls = document.createElement("div");
		// controls.classList.add("controls");
		// controls.innerHTML = `<button class="material-icons"> edit_off </button>`;
		// el.appendChild(controls);

		targetEl.appendChild(el);
	});
}
