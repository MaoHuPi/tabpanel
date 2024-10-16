let root;

class Root {
	constructor() {
		this.child_center = false;
		let root = document.createElement('div'),
			centerBox = document.createElement('div');
		root.className = 'root';
		centerBox.className = 'centerBox';
		root.appendChild(centerBox);
		this.element = root;
		this.element_centerBox = centerBox;
	}
	set center(center) {
		this.child_center = center;
		center.parent = this;
		[...this.element_centerBox.children].forEach(element => {
			element.remove();
		});
		this.element_centerBox.appendChild(center.element);
	}
	remove(remove) {
		if (remove == this.child_center) {
			this.child_center.parent = false;
			this.child_center = false;
		}
	}
	replace(target, replacement) {
		if (target == this.child_center) {
			this.remove(this.child_center);
			this.center = replacement;
		}
	}
}

class VBox {
	constructor() {
		this.parent = false;
		this.child_first = false;
		this.child_second = false;
		let hBox = document.createElement('div'),
			firstBox = document.createElement('div'),
			secondBox = document.createElement('div'),
			resizeBar = document.createElement('div');
		hBox.className = 'vBox';
		firstBox.className = 'firstBox';
		hBox.appendChild(firstBox);
		secondBox.className = 'secondBox';
		hBox.appendChild(secondBox);
		resizeBar.className = 'resizeBar';
		let moveFlag = false;
		let rect = false;
		resizeBar.addEventListener('mousedown', () => {
			moveFlag = true;
			rect = this.element.getBoundingClientRect();
		});
		window.addEventListener('mousemove', event => {
			if (moveFlag) {
				this.element.style.setProperty('--slice', (event.pageY - rect.top) / rect.height);
			}

		});
		window.addEventListener('mouseup', () => {
			moveFlag = false;
		});
		hBox.appendChild(resizeBar);
		this.element = hBox;
		this.element_firstBox = firstBox;
		this.element_secondBox = secondBox;
	}
	set top(first) {
		this.child_first = first;
		first.parent = this;
		[...this.element_firstBox.children].forEach(element => {
			element.remove();
		});
		this.element_firstBox.appendChild(first.element);
	}
	set bottom(second) {
		this.child_second = second;
		second.parent = this;
		[...this.element_secondBox.children].forEach(element => {
			element.remove();
		});
		this.element_secondBox.appendChild(second.element);
	}
	remove(remove) {
		for (let childName of ['child_first', 'child_second']) {
			if (remove == this[childName]) {
				this[childName].parent = false;
				this[childName] = false;
				this.parent.replace(this, { 'child_first': this.child_second, 'child_second': this.child_first }[childName]);
			}
		}
	}
	replace(target, replacement) {
		for (let childName of ['child_first', 'child_second']) {
			if (target == this[childName]) {
				this[childName].parent = false;
				this[childName] = false;
				this[childName] = false;
				this[{ 'child_first': 'top', 'child_second': 'bottom' }[childName]] = replacement;
			}
		}
	}
}

class HBox {
	constructor() {
		this.parent = false;
		this.child_first = false;
		this.child_second = false;
		let hBox = document.createElement('div'),
			firstBox = document.createElement('div'),
			secondBox = document.createElement('div'),
			resizeBar = document.createElement('div');
		hBox.className = 'hBox';
		firstBox.className = 'firstBox';
		hBox.appendChild(firstBox);
		secondBox.className = 'secondBox';
		hBox.appendChild(secondBox);
		resizeBar.className = 'resizeBar';
		let moveFlag = false;
		let rect = false;
		resizeBar.addEventListener('mousedown', () => {
			moveFlag = true;
			rect = this.element.getBoundingClientRect();
		});
		window.addEventListener('mousemove', event => {
			if (moveFlag) {
				this.element.style.setProperty('--slice', (event.pageX - rect.left) / rect.width);
			}

		});
		window.addEventListener('mouseup', () => {
			moveFlag = false;
		});
		hBox.appendChild(resizeBar);
		this.element = hBox;
		this.element_firstBox = firstBox;
		this.element_secondBox = secondBox;
	}
	set left(first) {
		this.child_first = first;
		first.parent = this;
		[...this.element_firstBox.children].forEach(element => {
			element.remove();
		});
		this.element_firstBox.appendChild(first.element);
	}
	set right(second) {
		this.child_second = second;
		second.parent = this;
		[...this.element_secondBox.children].forEach(element => {
			element.remove();
		});
		this.element_secondBox.appendChild(second.element);
	}
	remove(remove) {
		for (let childName of ['child_first', 'child_second']) {
			if (remove == this[childName]) {
				this[childName].parent = false;
				this[childName] = false;
				this.parent.replace(this, { 'child_first': this.child_second, 'child_second': this.child_first }[childName]);
			}
		}
	}
	replace(target, replacement) {
		for (let childName of ['child_first', 'child_second']) {
			if (target == this[childName]) {
				this[childName].parent = false;
				this[childName] = false;
				this[childName] = false;
				this[{ 'child_first': 'left', 'child_second': 'right' }[childName]] = replacement;
			}
		}
	}
}

class Component {
	constructor() {
		this.parent = false;
		let componentBox = document.createElement('div'),
			componentView = document.createElement('canvas'),
			componentButtons = {};
		componentBox.className = 'componentBox';
		componentView.className = 'componentView';
		componentBox.appendChild(componentView);
		['button-editComponent', 'button-swapComponent', 'button-removeComponent', 'button-extendUpFromComponent', 'button-extendDownFromComponent', 'button-extendLeftFromComponent', 'button-extendRightFromComponent'].map(buttonName => {
			let componentButton = document.createElement('button');
			componentButton.className = buttonName;
			componentBox.appendChild(componentButton);
			componentButtons[buttonName] = componentButton;
		});
		componentButtons['button-removeComponent'].onclick = () => {
			if (this.parent) {
				this.parent.remove(this);
			}
		}
		componentButtons['button-extendUpFromComponent'].onclick = () => {
			if (this.parent) {
				let vBox = new VBox();
				this.parent.replace(this, vBox);
				vBox.top = this;
				vBox.bottom = new Component();
			}
		}
		componentButtons['button-extendDownFromComponent'].onclick = () => {
			if (this.parent) {
				let vBox = new VBox();
				this.parent.replace(this, vBox);
				vBox.bottom = this;
				vBox.top = new Component();
			}
		}
		componentButtons['button-extendLeftFromComponent'].onclick = () => {
			if (this.parent) {
				let hBox = new HBox();
				this.parent.replace(this, hBox);
				hBox.right = this;
				hBox.left = new Component();
			}
		}
		componentButtons['button-extendRightFromComponent'].onclick = () => {
			if (this.parent) {
				let hBox = new HBox();
				this.parent.replace(this, hBox);
				hBox.left = this;
				hBox.right = new Component();
			}
		}
		this.element = componentBox;
		this.element_canvas = componentView;
	}
}

function pageInit() {
	let editButton = document.createElement('button');
	editButton.id = 'button-editPage';
	document.body.appendChild(editButton);

	root = new Root();
	document.body.appendChild(root.element);

	let hBox = new HBox();
	root.center = hBox;
	let component1 = new Component();
	hBox.left = component1;
	let component2 = new Component();
	hBox.right = component2;
}

function main() {
	pageInit();
}
main();