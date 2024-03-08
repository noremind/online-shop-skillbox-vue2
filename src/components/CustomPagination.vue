<template>
<div>
	<ul class="catalog__pagination pagination">
		<li class="pagination__item" v-if="pages !== 0">
			<a class="pagination__link pagination__link--arrow"
			:class="{'pagination__link--disabled': page == 1}"
			aria-label="Предыдущая страница"
			@click.prevent="prevPage"
			>
				<svg width="8" height="14" fill="currentColor">
					<use xlink:href="#icon-arrow-left"></use>
				</svg>
			</a>
		</li>
		<li
			class="pagination__item"
			v-for="pageNumber in pages"
			:key="pageNumber"
		>
			<a href="#" class="pagination__link "
				:class="{'pagination__link--current': pageNumber === page}"
				@click.prevent="paginate(pageNumber)"
			>
				{{pageNumber}}
			</a>
		</li>
		<li class="pagination__item" v-if="pages !== 0">
			<a class="pagination__link pagination__link--arrow" href="#" aria-label="Следующая страница"
			:class="{'pagination__link--disabled': page == pages}"
			@click.prevent="nextPage"
			>
				<svg width="8" height="14" fill="currentColor">
					<use xlink:href="#icon-arrow-right"></use>
				</svg>
			</a>
		</li>
	</ul>
</div>
</template>

<script>
export default {
  name: 'CustomPagination',//Кастомный пагинация можем использовать где угодно
  model: {
	prop: 'page',//это то что мы принимаем
	event: 'paginate'//событие
	// Важно имя event и то что в methods должны совпадать ведь они связаны двух сторонна
	// event: 'paginate' === methods:{paginate()}
  },
  props: {
	page: {//Значение текущий страницы
		type: Number,
		default: () => 0
	},
	count: {//Общая количество страниц
		type: Number,
		default: () => 0
	},
	perPage: {//Количество выводимая на одну страницу товаров
		type: Number,
		default: () => 0
	}
  },
  computed: {
	pages(){//Вычесляем количество страниц
		return Math.ceil(this.count / this.perPage)//Делим общию количество товаров на количество товаров на странице
		// ceil - округляет в большую сторону
	}
  },
  methods: {
	paginate(currentPage){//двух сторонная связб через v-model а не через @paginate="paginate"
		this.$emit('paginate', currentPage)
	},
	nextPage(){
		if(this.page !== this.pages) {
			this.$emit('nextPage')
		}
	},
	prevPage(){
		if(this.page !== 1) {
			this.$emit('prevPage')
		}
	}

  }
}
</script>

<style lang="scss" scoped>

</style>