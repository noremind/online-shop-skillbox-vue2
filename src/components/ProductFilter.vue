<template>
<aside class="filter">
	<h2 class="filter__title">Фильтры</h2>
	<form
		class="filter__form form"
		action="#"
		method="get"
		@submit.prevent="submit"
		>
		<fieldset class="form__block">
			<legend class="form__legend">Цена</legend>
			<label class="form__label form__label--price">
				<input
					class="form__input"
					type="text"
					name="min-price"
					v-model.number="currentPriceFrom">
				<span class="form__value">От</span>
			</label>
			<label class="form__label form__label--price">
				<input
					class="form__input"
					type="text"
					name="max-price"
					v-model.number="currentPriceTo">
				<span class="form__value">До</span>
			</label>
		</fieldset>
		<fieldset class="form__block">
			<legend class="form__legend">Категория</legend>
			<label class="form__label form__label--select">
				<select
					class="form__select"
					type="text"
					name="category"
					v-model.number="currentCategoryId"
					>
					<option value="0">Все категории</option>
					<option
						:value="category.id"
						v-for="category in categories"
						:key="category.id"
						>{{category.title}}</option>
				</select>
			</label>
		</fieldset>
		<fieldset class="form__block">
			<legend class="form__legend">Цвет</legend>

			<ProductColor
				:colors="colors"
				:currentColor.sync="currentColor"
			/>
		</fieldset>
		<fieldset class="form__block">
			<legend class="form__legend">Объемб в ГБ</legend>
			<ul class="check-list">
				<li class="check-list__item">
					<label class="check-list__label">
						<input class="check-list__check sr-only" type="checkbox" name="volume" value="8" checked="">
						<span class="check-list__desc">
							8
							<span>(313)</span>
						</span>
					</label>
				</li>
				<li class="check-list__item">
					<label class="check-list__label">
						<input class="check-list__check sr-only" type="checkbox" name="volume" value="16">
						<span class="check-list__desc">
							16
							<span>(461)</span>
						</span>
					</label>
				</li>
				<li class="check-list__item">
					<label class="check-list__label">
						<input class="check-list__check sr-only" type="checkbox" name="volume" value="32">
						<span class="check-list__desc">
							32
							<span>(313)</span>
						</span>
					</label>
				</li>
				<li class="check-list__item">
					<label class="check-list__label">
						<input class="check-list__check sr-only" type="checkbox" name="volume" value="64">
						<span class="check-list__desc">
							64
							<span>(313)</span>
						</span>
					</label>
				</li>
				<li class="check-list__item">
					<label class="check-list__label">
						<input class="check-list__check sr-only" type="checkbox" name="volume" value="128">
						<span class="check-list__desc">
							128
							<span>(313)</span>
						</span>
					</label>
				</li>
				<li class="check-list__item">
					<label class="check-list__label">
						<input class="check-list__check sr-only" type="checkbox" name="volume" value="264">
						<span class="check-list__desc">
							264
							<span>(313)</span>
						</span>
					</label>
				</li>
			</ul>
		</fieldset>
		<button class="filter__submit button button--primery" type="submit">
			Применить
		</button>
		<button
			class="filter__reset button button--second"
			type="button"
			@click="reset"
			>
			Сбросить
		</button>
	</form>
</aside>
</template>

<script>
// import categories from '../data/categories'//Категорий
import axios from 'axios'
import {API_BASE_URL} from '../config'
import ProductColor from '@/components/ProductColor'

export default {
	name: 'ProductFilter',
	components: {
		ProductColor
	},
	data(){
	return{
		currentPriceFrom: 0,
		currentPriceTo: 0,
		currentCategoryId: 0,

		categoriesDataAxios: null,

		currentColor: null,
		colorsData: null,
	}
	},
	props: ['priceFrom' , 'priceTo' , 'categoryId', 'color'],//Это полный аналог то что написано снизу
	//{
// 	priceFrom: {
// 		type: Number,
// 		default: 0
// 	},
// 	priceTo: {
// 		type: Number,
// 		default: 0
// 	},
// 	categoryId: {
// 		type: Number,
// 		default: 0
// 	}
	// },
	computed: {
// 	categories(){//Возвращаем категорий //Переход на API
// 		return categories
// 	},
	categories(){
		return this.categoriesDataAxios ? this.categoriesDataAxios.items : []
	},
	// currentPriceFrom: {//Если записать не в виде функций а в виде Обьекта то мы можем определять get , set они как бы станет доступными
	// 	get(){//Вызывается для получение значение
	// 		return this.priceFrom
	// 	},
	// 	set(newValue){//Вызывается когда пользователь пытается изменить computed на прямую
	// 		this.$emit('update:priceFrom', newValue)//Сработает когда мы изменяем поле ввода
	// 		// 'update:priceFrom' - это возможности модификаций sync и это означет что при Обновлений поля а именно priceFrom, мы $emit на верх
	// 	}
	// 	// set - принимает 2 параметра это newValue , oldValue
	// },
	colors(){
		return this.colorsData ? this.colorsData.items : []
	},
	},
	watch: { //2 способ
	// Кратко говоря watch у нас срабатывает когда Своисво менять значение и это значение записывается на current своиств
		priceFrom(value){//Следим за props
			this.currentPriceFrom = value //value - это новое значение который изменилась
		},
		priceTo(value){
			this.currentPriceTo = value
		},
		categoryId(value){
			this.currentCategoryId = value
		},
		color(value){
			this.currentColor = value
		}
		// В данном моменте watch работает 2 случаев когда submit и reset - тим
	},
	methods: {
	submit(){//Отправляем для каждого props , о том что значения поменялась
		this.$emit('update:priceFrom', this.currentPriceFrom)
		this.$emit('update:priceTo', this.currentPriceTo)
		this.$emit('update:categoryId', this.currentCategoryId)
		this.$emit('update:color', this.currentColor)
	},
	reset(){//Сбрось настроек
		//Что бы они сбросились мы передаем 0
		this.$emit('update:priceFrom', 0)//Но здесь сбрасывается только то что в App ведб мы $emit это на верх
		this.$emit('update:priceTo', 0)//Это то что в App
		this.$emit('update:categoryId', 0)
		this.$emit('update:color', 0)

		// //Есть 2 способа Решение
		// // 1 способ
		// this.currentPriceFrom = 0//Теперь все цены сбросились
		// this.currentPriceTo = 0//Это то что в ProductFilter
		// this.currentCategoryId = 0

	},
	loadCategories(){
		return axios.get(API_BASE_URL + '/api/productCategories')
			.then(response => this.categoriesDataAxios = response.data)
	},
	loadColors(){
		return axios.get(API_BASE_URL + '/api/colors')
			.then(response => this.colorsData = response.data)
	},
	},
	created(){
	this.loadCategories()
	this.loadColors()
	}
}
</script>

<style lang="scss" scoped>

</style>