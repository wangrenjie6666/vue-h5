import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		tabbarActive: null, //tabbar 的值
		isLoading: false, //loading全局开关
		// bookType: 'card',
		bookType: null,
		userinfo: null,
		uid: null,
		token: null,
		account: '',
		billSelectCard: null,
		codeTime: null,
		send: false,
		timer: null,
	},
	getters: {
		// 获取个人信息
		get_tabbarActive: (state) => () => {
			// 先从state里面获取用户登录信息
			let tabbarActive = state.tabbarActive
			// 如果 state 里面获取不到，那么从localStorage里面获取
			if (!tabbarActive) {
				tabbarActive = JSON.parse(window.localStorage.getItem('tabbarActive') || null)
			}
			return tabbarActive
		},
		// 获取个人信息里的账单类型
		get_bookType: (state) => () => {
			let userinfo = JSON.parse(window.localStorage.getItem('userinfo') || null)
			let bookType = null;
			if (userinfo) {
				bookType = userinfo.bookType
				state.bookType = bookType
			}
			return bookType
		},
		// 获取localstorage里的
		get_bookTypeLS: (state) => () => {
			let bookType = state.bookType
			// 如果 state 里面获取不到，那么从localStorage里面获取
			if (!bookType) {
				bookType = JSON.parse(window.localStorage.getItem('bookType') || null)
			}
			return bookType
		},
		// 获取个人信息
		get_userinfo: (state) => () => {
			// 先从state里面获取用户登录信息
			let userinfo = state.userinfo
			// 如果 state 里面获取不到，那么从localStorage里面获取
			if (!userinfo) {
				userinfo = JSON.parse(window.localStorage.getItem('userinfo') || null)
			}
			return userinfo
		},
		// 获取uid
		get_uid: (state) => () => {
			// 先从state里面获取uid
			let uid = state.uid
			// 如果 state 里面获取不到，那么从localStorage里面获取
			if (!uid) {
				uid = JSON.parse(window.localStorage.getItem('uid') || null)
			}
			return uid
		},
		// 获取token
		get_token: (state) => () => {
			// 先从state里面获取token
			let token = state.token
			// 如果 state 里面获取不到，那么从localStorage里面获取
			if (!token) {
				token = JSON.parse(window.localStorage.getItem('token') || null)
			}
			return token
		},
		// 获取游客生成的uniqueId
		get_uniqueId: (state) => () => {
			// 先从state里面获取token
			let uniqueId = state.uniqueId
			// 如果 state 里面获取不到，那么从localStorage里面获取
			if (!uniqueId) {
				uniqueId = JSON.parse(window.localStorage.getItem('uniqueId') || null)
			}
			return uniqueId
		},
		// 获取登陆时的手机号
		get_account: (state) => () => {
			// 先从state里面获取token
			let account = state.account
			// 如果 state 里面获取不到，那么从localStorage里面获取
			return account
		},
		// 获取信用卡账单页面的信用卡下标
		get_billSelectCard: (state) => () => {
			// 先从state里面获取token
			let billSelectCard = state.billSelectCard
			// 如果 state 里面获取不到，那么从localStorage里面获取
			return billSelectCard
		},
		// 获取 验证码倒计时时间
		get_codeTime: (state) => () => {
			// 先从state里面获取token
			let codeTime = state.codeTime
			// 如果 state 里面获取不到，那么从localStorage里面获取
			return codeTime
		},
		// 获取 验证码是否发送
		get_send: (state) => () => {
			// 先从state里面获取token
			let send = state.send
			// 如果 state 里面获取不到，那么从localStorage里面获取
			return send
		},
	},
	mutations: {
		// 设置载入中
		loading(state, data) {
			state.isLoading = data
		},
		// 保存tabbar
		set_tabbarActive(state, data) {
			state.tabbarActive = data
			localStorage.setItem('tabbarActive', JSON.stringify(data))
		},
		// 设置 账本类型 bookType
		set_bookType(state, data) {
			// console.log('bookType里', data)
			state.bookType = data
			localStorage.setItem('bookType', JSON.stringify(data))
			let userinfo = JSON.parse(window.localStorage.getItem('userinfo') || null)
			if (userinfo) {
				userinfo.bookType = data
				state.userinfo = userinfo
				localStorage.setItem('userinfo', JSON.stringify(userinfo))
			}
		},
		// 保存个人信息
		set_userinfo(state, data) {
			state.userinfo = data
			localStorage.setItem('userinfo', JSON.stringify(data))
		},
		// 保存个人信息里的 uid
		set_uid(state, data) {
			state.uid = data
			localStorage.setItem('uid', JSON.stringify(data))
		},
		// 保存个人信息里的 token
		set_token(state, data) {
			state.token = data
			localStorage.setItem('token', JSON.stringify(data))
		},
		// 保存游客生成的uniqueId
		set_uniqueId(state, data) {
			state.uniqueId = data
			localStorage.setItem('uniqueId', JSON.stringify(data))
		},
		// 保存登陆时的手机号
		set_account(state, data) {
			state.account = data
		},
		// 保存 切换信用卡账单页面的信用卡
		set_billSelectCard(state, data) {
			state.billSelectCard = data
		},
		// 保存 验证码倒计时时间
		set_codeTime(state, data) {
			state.codeTime = data
		},
		send_loginCode(state, data) {
			// console.log(state.codeTime)
			state.codeTime = 60
			state.send = true;
			state.timer = setInterval(() => {
				if (state.codeTime > 0 && state.codeTime <= 60) {
					state.codeTime--;
				} else {
					state.send = false;
					clearInterval(state.timer);
					state.timer = null;
				}
			}, 1000);
		},
	},
	actions: {},
	modules: {}
})
