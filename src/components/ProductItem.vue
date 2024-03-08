<template>
<div class="product__item">
	<li class="catalog__item">
		<router-link
			class="catalog__pic"
			:to="{name: 'product', params: {id: product.id}}"
			>
			<img :src="product.image" :alt="product.title">
		</router-link>
		<h3 class="catalog__title">
			<a href="#">
				{{product.title}}
			</a>
		</h3>
		<span class="catalog__price">
			{{product.price | numberFormat}} ₽
		</span>

		<ProductColor
			:currentColor.sync="color"
			:colors="product.colors"
			class="colors--black"
		/>
	</li>
</div>
</template>

<script>
// import eventBus from '@/eventBus'//Типа Vuex или же Шина событий  //  момент Коментарий мы переходим на helpers(mixin)
import gotoPage from '@/helpers/gotoPage'
import numberFormat from '@/helpers/numberFormat'
import ProductColor from '@/components/ProductColor'


export default {
	name: 'ProductList',
	components: {
		ProductColor
	},
	data(){
		return{
			color: '#7386ea'
		}
	},
	props: {
		product: {//Возвращает массив
			type: [],
			default: () => [],
	},
	},
		methods: {
			// gotoPage(pagName,pagParams){
			// 	eventBus.$emit('gotoPage', pagName, pagParams)
			// }//Поднимаем на eventBus а это у нас имитация vuex
			gotoPage
	},
	filters: {//filters это тоже самое и методы но они работает с незначительными измененями
		numberFormat
	},
}
</script>

<style lang="scss" scoped>

</style>


<!-- @click.prevent="gotoPage('product', {id: product.id})" - мы отправили список товаров и id.product та -->

<!-- product - это котнкретно 1 товар -->