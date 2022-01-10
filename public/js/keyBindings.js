(function () {
	document.addEventListener("keydown", e => {
		const key = e.key;
		const ctrl = e.ctrlKey;
		switch (key) {
			case "s":
				{
					if (!ctrl) break;
					e.preventDefault();
					run();
				}
				break;

			case "Enter":
				{
					if (!ctrl) break;
					e.preventDefault();
					run();
				}
				break;

			default:
				break;
		}
	});
})();
