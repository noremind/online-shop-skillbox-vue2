<template lang="html">
<div>
	<li class="cart__item product">
		<div class="product__pic">
			<img :src="item.product.image" width="120" height="120" srcset="img/phone-square-3@2x.jpg 2x" :alt="item.product.title">
		</div>
		<h3 class="product__title">
			{{item.product.title}}
		</h3>
		<p class="product__info">
			Объем: <span>128GB</span>
		</p>
		<span class="product__code">
			Артикул: {{item.product.id}}
		</span>
		<div class="product__counter form__counter">
			<button
				type="button"
				aria-label="Убрать один товар"
				@click="decrementCartAmount(item.productId)"
			>
				<svg width="10" height="10" fill="currentColor">
					<use xlink:href="#icon-minus"></use>
				</svg>
			</button>
			<input type="text" v-model.number="productAmount" name="count">
			<button
				type="button"
				aria-label="Добавить один товар"
				@click="incrementCartAmount(item.productId)"
			>
				<svg width="10" height="10" fill="currentColor">
					<use xlink:href="#icon-plus"></use>
				</svg>
			</button>
		</div>
		<b class="product__price">
			{{item.product.price * item.amount | numberFormat}} ₽
		</b>
		<button
			class="product__del button-del"
			type="button"
			aria-label="Удалить товар из корзины"
			@click.prevent="deleteProduct"
		>
			<svg width="20" height="20" fill="currentColor">
				<use xlink:href="#icon-close"></use>
			</svg>
		</button>
	</li>
</div>
</template>

<script>
import numberFormat from '@/helpers/numberFormat'
import {mapActions} from 'vuex'

export default {
	name: 'CartItem',
		props: {
			item: {
				type: Object,
				default: () => {}
			}
		},
	methods: {
		...mapActions([
			'GET_PRODUCT_AMOUNT_FROM_CART_ITEM',
			'DELETE_FROM_CART_PRODUCT',
			'INCREMENT_AMOUNT_FROM_CART',
			'DECREMENT_AMOUNT_FROM_CART',
			'UPDATE_CART_PRODUCT_AMOUNT'
		]),
		deleteProduct(){
			this.DELETE_FROM_CART_PRODUCT(this.item.productId)
		},
		incrementCartAmount(index){
        this.INCREMENT_AMOUNT_FROM_CART(index)
		},
		decrementCartAmount(index){
			this.DECREMENT_AMOUNT_FROM_CART(index)
		}
	},
	computed: {
		productAmount: {//Так как мы не можем на прямую изменить то что в store тогда мы можем попробовать get , set
			get(){//Поля input не изменилась
				return this.item.amount//Просто возвращаем
			},
			set(newValue){
				this.UPDATE_CART_PRODUCT_AMOUNT({productId: this.item.productId , amount: newValue})
			}
			// set(newValue){//Поля input изменилась // Старая запись
			// 	this.GET_PRODUCT_AMOUNT_FROM_CART_ITEM({productId: this.item.productId , amount: newValue})
			// }
		}//computed так можно
	},
	filters: {
		numberFormat
	},
	}
</script>

<style lang="scss" scoped>

</style>