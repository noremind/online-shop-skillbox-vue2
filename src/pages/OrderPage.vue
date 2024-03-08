<template lang="html">
<main class="content container">
	<div class="content__top">
		<ul class="breadcrumbs">
			<li class="breadcrumbs__item">
				<router-link :to="{name: 'main'}" class="breadcrumbs__link" href="index.html">
					Каталог
				</router-link>
			</li>
			<li class="breadcrumbs__item">
				<router-link :to="{name: 'main'}" class="breadcrumbs__link" href="cart.html">
					Корзина
				</router-link>
			</li>
			<li class="breadcrumbs__item">
				<a class="breadcrumbs__link">
					Оформление заказа
				</a>
			</li>
		</ul>
		<h1 class="content__title">
			Корзина
		</h1>
		<span class="content__info">
			{{CART_DETAIL.length}} товара
		</span>
	</div>
	<section class="cart">
		<form class="cart__form form" action="#" method="POST" @submit.prevent="order">
			<div class="cart__field">
				<div class="cart__data">

					<CustomFormText
						title="ФИО"
						placeholder="Введите ваше полное имя"
						v-model="formData.name"
						:error="formError.name"
					/>
					<CustomFormText
						title="Адрес доставки"
						placeholder="Введите ваш адрес"
						v-model="formData.address"
						:error="formError.address"
					/>
					<CustomFormText
						title="Телефон"
						placeholder="Введите ваш телефон"
						v-model="formData.phone"
						:error="formError.phone"
						type="tel"
					/>
					<CustomFormText
						title="Email"
						placeholder="Введите ваш Email"
						v-model="formData.email"
						:error="formError.email"
						type="email"
					/>
					<CustomFormTextarea
						title="Комментарий к заказу"
						:error="formError.comment"
						v-model="formData.comment"
						placeholder="Ваши пожелания"
					/>
				</div>
				<div class="cart__options">
					<h3 class="cart__title">Доставка</h3>
					<ul class="cart__options options">
						<li class="options__item">
							<label class="options__label">
								<input class="options__radio sr-only" type="radio" name="delivery" value="0" checked="">
								<span class="options__value">
									Самовывоз <b>бесплатно</b>
								</span>
							</label>
						</li>
						<li class="options__item">
							<label class="options__label">
								<input class="options__radio sr-only" type="radio" name="delivery" value="500">
								<span class="options__value">
									Курьером <b>500 ₽</b>
								</span>
							</label>
						</li>
					</ul>
					<h3 class="cart__title">Оплата</h3>
					<ul class="cart__options options">
						<li class="options__item">
							<label class="options__label">
								<input class="options__radio sr-only" type="radio" name="pay" value="card">
								<span class="options__value">
									Картой при получении
								</span>
							</label>
						</li>
						<li class="options__item">
							<label class="options__label">
								<input class="options__radio sr-only" type="radio" name="pay" value="cash">
								<span class="options__value">
									Наличными при получении
								</span>
							</label>
						</li>
					</ul>
				</div>
			</div>
			<div class="cart__block">
				<ul class="cart__orders" v-for="orderProduct in CART_DETAIL" :key="orderProduct.product.id">
					<li class="cart__order">
						<h3>{{orderProduct.product.title}}</h3>
						<b>{{orderProduct.product.price * orderProduct.amount | numberFormat}} ₽</b>
						<span>Артикул: {{orderProduct.product.id}}</span>
					</li>
				</ul>
				<div class="cart__total">
					<p>Доставка: <b>500 ₽</b></p>
					<p>Итого: <b>{{CART_DETAIL.length}}</b> товара на сумму <b>{{CART_TOTAL_PRICE | numberFormat}} ₽</b></p>
				</div>
				<button class="cart__button button button--primery" type="submit">
					Оформить заказ
				</button>
			</div>
			<div class="cart__error form__error-block" v-if="formErrorMessage">
				<h4>Заявка не отправлена!</h4>
				<p>
					{{formErrorMessage}}
				</p>
			</div>
		</form>
	</section>
</main>
</template>

<script>
import {mapGetters , mapMutations} from 'vuex'
import CustomFormText from '@/components/CustomFormText'
import CustomFormTextarea from '@/components/CustomFormTextarea'
import axios from 'axios'
import {API_BASE_URL} from '@/config'
import numberFormat from '@/helpers/numberFormat'

export default {
  name: 'OrderPage',
  components:  {CustomFormText, CustomFormTextarea},
  data() {
	return {
		formData: {},//Здесь будеть храниться значение всех полей в форме. Они передаються как новые совиство из Шаблона
		formError: {},//Храним ошибки то есть для таждого поля есть свои уведомление ошибки

		formErrorMessage: '',//Это срабатывает если в корзине нету товара
	}
  },
  computed: {
	...mapGetters([
		'CART_DETAIL',
		'CART_TOTAL_PRICE'
	]),
  },
  methods: {
	...mapMutations([
		'RESER_CART_FOR_ORDER',
		'UPDATE_ORDER_INFO'
	]),
	order(){
		this.formError = {}
		this.formErrorMessage = ''

		return axios.post(API_BASE_URL + '/api/orders', {
			...this.formData//Когда все поля запаолнены тогда то что внутри formData польностью совпадет API request
		}, {
			params: {
				userAccessKey: this.$store.state.userAccessKey
			}
		})
			.then(response => {
				this.RESER_CART_FOR_ORDER()
				this.UPDATE_ORDER_INFO(response.data)
				this.$router.push({name: 'orderInfo', params:{id: response.data.id}})//То что внутри params это информация о заказе после этого если мы обновим страницу то заказ не слетить а будет сохраняться в ссылке но orderInfo слетить для этого мы в store его запишем в API
			})
			.catch(error => {
				this.formError = error.response.data.error.request || {}//Если поля не запольнены то выводим ошибки или вернем пустой обьект
				this.formErrorMessage = error.response.data.error.message
			})
	}//после этого запроса у нас все order норм отправляються но мы в Network видим ошибку о том что "Корзина не найдена" это глобальная ошибка что бы это исправить нам нужно ощичать cartProducts и cartProductsData мы это деиствие выпольним в resetCart
  },//У нас еще есть 1 глобальный проблема Если в нашем корзине нету товара то мы должны предупредить пользователя
  filters: {
	numberFormat
  }
}
</script>

<style lang="scss" scoped>

</style>