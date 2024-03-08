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
				Заказ оформлен <span>№ {{this.$route.params.id}}</span>
			</h1>
		</div>
		<section class="cart">
			<form class="cart__form form" action="#" method="POST">
				<div class="cart__field">
					<p class="cart__message">
						Благодарим за&nbsp;выбор нашего магазина. На&nbsp;Вашу почту придет письмо с&nbsp;деталями заказа.
						Наши менеджеры свяжутся с&nbsp;Вами в&nbsp;течение часа для уточнения деталей доставки.
					</p>
					<ul class="dictionary">
						<li class="dictionary__item">
							<span class="dictionary__key">
								Получатель
							</span>
							<span class="dictionary__value">
								{{ORDER_INFO.name}}
							</span>
						</li>
						<li class="dictionary__item">
							<span class="dictionary__key">
								Адрес доставки
							</span>
							<span class="dictionary__value">
								{{ORDER_INFO.address}}
							</span>
						</li>
						<li class="dictionary__item">
							<span class="dictionary__key">
								Телефон
							</span>
							<span class="dictionary__value">
								{{ORDER_INFO.phone}}
							</span>
						</li>
						<li class="dictionary__item">
							<span class="dictionary__key">
								Email
							</span>
							<span class="dictionary__value">
								{{ORDER_INFO.email}}
							</span>
						</li>
						<li class="dictionary__item">
							<span class="dictionary__key">
								Способ оплаты
							</span>
							<span class="dictionary__value">
								картой при получении
							</span>
						</li>
					</ul>
				</div>
				<div class="cart__block">
					<ul class="cart__orders" v-for="orderInfoProduct in ORDER_INFO.basket.items" :key="orderInfoProduct.id">
						<li class="cart__order">
							<h3>{{orderInfoProduct.product.title}}</h3>
							<b>{{orderInfoProduct.price * orderInfoProduct.quantity | numberFormat}} ₽</b>
							<span>Артикул: {{orderInfoProduct.product.id}}</span>
						</li>
					</ul>
					<div class="cart__total">
						<p>Доставка: <b>500 ₽</b></p>
						<p>Итого: <b>{{ORDER_INFO.basket.items.length}}</b> товара на сумму <b>{{ ORDER_INFO.totalPrice | numberFormat}} ₽</b></p>
					</div>
				</div>
			</form>
		</section>
	</main>
</template>

<script>
import {mapGetters , mapActions} from 'vuex'
import numberFormat from '@/helpers/numberFormat'

export default {
  name: 'OrderInfoPage',
  data(){
	return{

	}
  },
  methods: {
	...mapActions([
		'LOAD_ORDER_INFO'
	])
  },
  computed: {
	...mapGetters([
		'ORDER_INFO'
	])
  },
  filters: {
	numberFormat
  },
  created(){
	if(this.$store.state.orderInfo && this.$store.state.orderInfo.id === this.$route.params.id){
		return
	}//Это делаем что бы не было лишнего запроса . Мы проверям то что в stateю.orderInfo есть что то и его id совпадет с то что получили из URL если Условия true то мы остановим след запрос и просто берем данные от state.order

	this.LOAD_ORDER_INFO(this.$route.params.id)
  }
}
</script>

<style lang="scss" scoped>

</style>