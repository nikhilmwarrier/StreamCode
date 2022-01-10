if (localStorage.getItem("username"))
	window.username = localStorage.getItem("username");
else modalPrompt("#username-modal");

function modalPrompt(sel) {
	const modal = document.querySelector(sel);
	modal.style.display = "flex";
	modal.querySelector("form").querySelector("input[type='text']").focus();
	modal.querySelector("form").addEventListener("submit", e => {
		e.preventDefault();
		modal.style.display = "none";
		const name = modal.querySelector("form").querySelector("input[type='text']")
			.value;
		window.username = name;
	});
}

function startCodeshare() {
	const modal = document.querySelector(".modal-backdrop");
	modal.style.display = "flex";
	window.addEventListener("keydown", e => {
		modal.style.display = e.key === "Escape" ? "none" : "flex";
	});
	const form = modal.querySelector("form");
	form.addEventListener("submit", e => {
		e.preventDefault();
		const lang = form.querySelector("#lang").value;
		const code = `${lang}-${new RandomString(9).result}`;
		localStorage.setItem("username", username);
		sessionStorage.setItem(`codeShare ${code} admin`, true);
		window.location.href = `./join/#/${code}/`;
	});
}

function joinCodeshare() {
	const code = prompt("Enter Codeshare code");
	if (code === null) return;
	console.log(code);
	localStorage.setItem("username", username);
	sessionStorage.setItem(`codeShare ${code} admin`, false);
	window.location.href = `./join/#/${code}/`;
}
