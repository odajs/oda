const snippet = `
# oda
snippet oda
	ODA({ is: 'oda-', imports: '@oda/icon',
		template: ${'`'}
		
		${'`'},
		props: {

		}
	})

# oda-demo
snippet oda-demo
	ODA({ is: 'oda-', imports: '@oda/icon',
		template: ${'`'}
		
		${'`'},
		props: {
			box: {
				type: String,
				default: 'b1',
				list: ['b2', 'i2', 'b3']	
			},
			value: ''
			pos: 0
		},
		ready: {

		},
		attached: {
	
		}
		listeners: {
			resize(e){
				console.log(e);
			},
			'contextmenu': '_onContextMenu';
		},
		observers: [
			'_setPosition(box, pos)',
			function _valueUpdate(value) {
				this._value = value;
			}
		],
		_onContextMenu() {

		},
		_valueUpdate() {

		}
	})

# oda-showDialog
snippet oda-showDialog
	ODA.showDialog('oda-', {}, {});

`;

export default snippet;
