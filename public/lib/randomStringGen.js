class RandomString {
	constructor(length) {
		this.length = length;
		this.result = [];
		this.chars = "abcdefghijklmnopqrstuvwxyz";
		this.charsLength = this.chars.length;
		this.part1 = this.randomize();
		this.part2 = this.randomize();
		this.part3 = this.randomize();
		this.result = `${this.part1}-${this.part2}-${this.part3}`;
	}
	randomize() {
		const res = [];
		for (let i = 0; i < 3; i++) {
			const randomizedNum = Math.floor(Math.random() * this.charsLength);
			res.push(this.chars.charAt(randomizedNum));
		}
		return res.join("");
	}
}
