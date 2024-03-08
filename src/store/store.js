import Vue from 'vue'
import Vuex from 'vuex'
// import products from '@/data/products'
import axios from 'axios'
import {API_BASE_URL} from '@/config'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		cartProducts: [],

		userAccessKey: null,//уникальный ключь для пользователя
		cartProductsData: [],//То очто в корзине

		orderInfo: null,
	},
	mutations: {
		// ADD_PRODUCT_TO_CART:(state,{productId , amount}) => { //Это больше не нужно для API
		// 	const item = state.cartProducts.find(item => item.productId === productId)//Ищем есть ли Товар с таким Id


		// 		if(item) {//Если есть такой товар то мы плюсуем item.amount с amount котоый получили из ProductPage
		// 			item.amount += amount
		// 		}else{//Если же нет такова товара то мы просто пушим как новый товар
		// 			state.cartProducts.push({
		// 				productId,
		// 				amount
		// 			}) //{productId , amount} - Декструзизация обьекта
		// 		}
		// 	},
		UPDATE_CART_ITEM_AMOUNT(state , {productId , amount}){
			const item = state.cartProducts.find(item => item.productId === productId)//Ищем есть ли Товар с таким Id

			if(item){//Если есть то текущая количество будет равно на newValue из set CartItem
				item.amount = amount
			}
		},
		CART_ITEM_DELETE:(state , productId) =>{//Переходим на API
			state.cartProducts = state.cartProducts.filter(item => item.productId !== productId)//Так как здесь условия то удалить именно тот элемент который мы нажали ведб уних совпадают id
		},
		INCREMENT_AMOUNT_CART(state , index){
			const increment = state.cartProducts.filter((item) => {
				return item.productId === index
			})
			if(increment) {
				increment.forEach(item => item.amount++)
			}
			return increment
		},
		DECREMENT_AMOUNT_CART(state , index){
			const decrement = state.cartProducts.filter((item) => {
				return item.productId === index
			})
			if(decrement) {
				decrement.forEach(item => {
					if(item.amount > 1) {
						item.amount--
					}
				})
			}
			return decrement
		},
		UPDATE_USER_ACCESS_KEY:(state , accessKey) => {//Тo что получили из API
			state.userAccessKey = accessKey
		},
		UPDATE_CART_PRODUCTS_DATA: (state, products) => {//Тo что получили из API
			state.cartProductsData = products
		},
		SYNC_CART_PRODUCTS(state){//Пре образование cartProductsData в cartProducts. Дело в том то что мы добавили сами cartProducts и его своиство не совпадает со своиствами cartProductsData и мы питаемся дать Обьект данных на cartProducts что бы оно отбразил то что лежит в cartProductsData
			state.cartProducts = state.cartProductsData.map(item => {//Переюираем
				return {//Возвращаем обьект где
					productId: item.product.id,
					amount: item.quantity
				}
			})
		},
		RESER_CART_FOR_ORDER(state){
			state.cartProducts = []
			state.cartProductsData = []
		},
		UPDATE_ORDER_INFO(state, orderInfo){
			this.state.orderInfo = orderInfo
		}
	},
	actions: {
		GET_PRODUCT_FROM_PRODUCT_PAGE({commit}, payload){
			commit('ADD_PRODUCT_TO_CART', payload)
		}, //payload = {productId: this.product.id, amount: this.productAmount}
		GET_PRODUCT_AMOUNT_FROM_CART_ITEM({commit}, payload){
			commit('UPDATE_CART_ITEM_AMOUNT', payload)
		},
		DELETE_FROM_CART_PRODUCT({commit} , productId){//Удаление из API
			commit('CART_ITEM_DELETE', productId)

			return axios.delete(API_BASE_URL + '/api/baskets/products' ,{
				data: {
					productId
				},
				params: {
					userAccessKey: this.state.userAccessKey
				}
			})
				.then(response => {
					commit('UPDATE_CART_PRODUCTS_DATA' , response.data.items)
				})
				.catch(() => {
					commit('SYNC_CART_PRODUCTS', this.state.cartProductsData)
				})

			// try{
			// 	const response = axios.delete('https://vue-study.skillbox.cc/api/baskets/products', {
			// 		data: {
			// 			productId
			// 		},
			// 		params: {
			// 			userAccessKey: this.state.userAccessKey
			// 		},
			// 	})

			// 	commit('UPDATE_CART_PRODUCTS_DATA' , response.data.items)
			// }
			// catch(e){
			// 	commit('SYNC_CART_PRODUCTS', this.state.cartProductsData)
			// }
		},
		INCREMENT_AMOUNT_FROM_CART({commit} , index){
			commit('INCREMENT_AMOUNT_CART', index)
		},
		DECREMENT_AMOUNT_FROM_CART({commit} , index){
			commit('DECREMENT_AMOUNT_CART', index)
		},
		LOAD_CART({commit}){//Запрос на Корзину
			return axios.get(API_BASE_URL + '/api/baskets' , {
				params: {//То что пишеться в params будет передаваться через URL
					userAccessKey: this.state.userAccessKey//Это для того что бы запомнить уникальный ключь пользователя и передвать компонентам . но у этого способа есть минусы дело в том что когда пользователь обновить страницу у нас Все слеает и все начнетться с нуля что бы этого сбежать мы используем localStorage
				}
			})
				.then(response => {

					if(!this.state.userAccessKey){//Если пустой то тогад будем записовать А если там есть что есть то никаких действй не будет

						localStorage.setItem('userAccessKey' , response.data.user.accessKey)//Мы запольняем на Хранилище Браузера setItem - это добавить по новой
						commit('UPDATE_USER_ACCESS_KEY', response.data.user.accessKey)
					}


					commit('UPDATE_CART_PRODUCTS_DATA', response.data.items)
					commit('SYNC_CART_PRODUCTS')//В этом моменты мы уверены что данные на Синхронизацию готовы
				})
		},//Сейчас можно проверить записисывется ли на localStorage перейти на Браузере панель Application > LocalStorage
		// Но есть проблема оно записисывется каждый раз новые userAccessKey что бы это исправить перейдем на APP.vue
		ADD_PRODUCT_TO_CART({commit} , {productId , amount}){//Это добавлние товара на API
			return (new Promise(resolve => setTimeout(resolve , 2000)))
			.then(() => {
				return axios.post(API_BASE_URL + '/api/baskets/products', {
					productId: productId,///api/baskets/products - примимает в себе этих 2 своитсво
					quantity: amount
				}, {
					params: {
						userAccessKey: this.state.userAccessKey//Беру из Url
					}
				})
					.then(response => {//При Успеха
						commit('UPDATE_CART_PRODUCTS_DATA', response.data.items)
						commit('SYNC_CART_PRODUCTS')
					})
			})
		},
		UPDATE_CART_PRODUCT_AMOUNT({commit} , {productId , amount}){
			commit('UPDATE_CART_ITEM_AMOUNT', {productId , amount})//Сначала изменится amount а потом запрос на сервер

			if(amount < 1){//Если amount меньше 1 тогда мы прерываем след деиствие
				return
			}

			return axios.put(API_BASE_URL + '/api/baskets/products' , {//put - изменить
				productId,
				quantity: amount
			} , {
				params: {
					userAccessKey: this.state.userAccessKey
				}
			})
				.then(response => {//Изменим товар на новый
					commit('UPDATE_CART_PRODUCTS_DATA' , response.data.items)
				})
				.catch(() => {//Если ошибка то Синхронизуем
					commit('SYNC_CART_PRODUCTS')
				})
		},
		LOAD_ORDER_INFO({commit} , orderId){
			return axios.get(API_BASE_URL + '/api/orders/' + orderId , {
				params: {
					userAccessKey: this.state.userAccessKey
				}
			})
				.then(response => {
					console.log(100)
					commit('UPDATE_ORDER_INFO', response.data)
				})
		}
	},
	getters: {//похож на computed
		// CART_DETAIL(state){//Обновляем товары и переходим на API сделаем так что бы товары взялись из API
		// 	return state.cartProducts.map(item => {//Через map мы просто перебираем и делаем проверку
		// 		return {//Дальше обьект
		// 			...item,//Оператор разделения обьекта на свойства
		// 			product: products.find(p => p.id === item.productId)//Проверка та но что вы видим имеено то что взяли из products через import и берем данные (если кратко то просто найдем нужный товар)
		// 		}//Данные момент если смотрим на devtools мы видим это: productId , product(все инфо из products),amount
		// 	})
		// },
		CART_DETAIL(state){//Уже с API
			return state.cartProducts.map(item => {//Перебираем cartProducts
				const cartProduct = state.cartProductsData.find(p => p.product.id === item.productId).product //Здесь говориться что const product будет содржать в себе
				// товара которую прошел через фильтрацию а именно то что в cartProductsData(p) должен совпадать с id cartProducts(item)
				// const product = state.cartProductsData[id].product - то что в конце product это то что мы хотим получить и по сути const product сейчас равен на state.cartProductsData[id].product
				//Я поменял значение const product на cartProduct
				return {
					...item,//cartProducts декстуризация обьекта
					product: {//что бы корретно отобразилось image
						...cartProduct, //декстуризация обьекта
						image: cartProduct.image.file.url //Ищем путь до картинки
					}
				}
			})
		},// Уже в выхода мы получаем cartProducts = cartProductsData по Своиствам
		CART_TOTAL_PRICE(state, getters){
			return getters.CART_DETAIL.reduce((acc , item) => (item.product.price * item.amount) + acc , 0) //getters - так можно получить получить доступ к getters
		},//Почему мы так сделали почему мы обращаем внимания на getters и почему открыли Глобально в store
		// Ответ: Так почему же мы использовали getters CART_DETAIL все очень просто
		// Мы использовали CART_DETAIL что бы не сделали проверку с начала с map , просто все данные из cartProducts у нас есть и остовалось только их почитать
		// Ответ: да почему же открыли мы глобально то , и звдесь очень все просто мы этот счетчик исползуем и в других компонентах и для того что бы не дублировать код мы открылы глобально
		ORDER_INFO(state){
			return state.orderInfo
		}
	}
});


