<template>
  <main class="content container">
    <div class="content__top content__top--catalog">
      <h1 class="content__title">
        Каталог
      </h1>
      <span class="content__info">
        152 товара
      </span>
    </div>

    <div class="content__catalog">
      <ProductFilter
        :priceFrom.sync="filterPriceFrom"
        :priceTo.sync="filterPriceTo"
        :categoryId.sync="filterCategoryId"
        :color.sync="color"
      />
      <!-- sync - это аналог $emit если кратко sync предоставляем двухсторонную запись -->
  <section class="catalog">

    <div v-if="productsLoading">Загрузка товаров...</div>
    <div v-if="productsLoadingFailed">Произошла ошибка при загрузке <button @click="loadProducts">Попробовать снова</button></div>

    <!-- 1 -->
    <ProductList
      :products="products"
    />
    <!-- 2 -->
    <CustomPagination
      v-model="currentPage"
      :count="countProducts"
      :perPage="productPerPage"
      @nextPage="nextPage"
      @prevPage="prevPage"
    />
    <!-- @paginate="paginate" - это способ с emit -->
    <!-- v-model="currentPage" - этот способ сразу присвайвает значение которую получил на которую отправляеть в компонент -->
    <!-- page($emit) = currentPage -->
      </section>

    </div>
  </main>


</template>

<script>
// import products from '@/data/products'//То что я писал руками
import ProductList from '@/components/ProductList'
import CustomPagination from '@/components/CustomPagination'
import ProductFilter from '@/components/ProductFilter'
// @ - это Абсолютный путь
// @ = src папке
import axios from 'axios'
import {API_BASE_URL} from '../config'


export default {
  name: 'MainPage',
  components: {
    ProductList,
    CustomPagination,
    ProductFilter,
  },
  data(){
    return{
      currentPage: 1,//Текущая страница
      productPerPage: 6,//количество товаров который будет показываться на странице
      // products, Перейдем на computed своиство это нужно для того что бы показать часть товаров который прошел через Пагинацию а не вес товар который есть
      filterPriceTo: 0,//цена До
      filterPriceFrom: 0,//цена От
      filterCategoryId: 0,//id категорий

      productDataAxios: null,//Хранить в себе ответ от сервера
      productsLoading: false,//Загрузка товаров
      productsLoadingFailed: false,//Запрос вернуль ошибку

      productsAllLength: null,
      colorId: 0,
      color: null,
    }
  },
  computed: {
    // products(){//Подготовка к пагинацию //В коменте потому что делаем это на стороне сервера
    //   let from = (this.currentPage - 1) * this.productPerPage//Начальный индекс страницы
    //   let to = from + this.productPerPage//Конечный индекс страницы
    //   return this.filteredProducts.slice(from , to)//slice работает через индекс
    // },
    products(){
      return this.productDataAxios
              ? this.productDataAxios.items.map(product => {
                return {
                  ...product,//Возвращаем то же самое элемент который есть в productDataAxios
                  image: product.image.file.url//Просто возвращаем правильный путь к картинке
                }
              })
              : []
      //Здесь тернарный условия это означает что если productDataAxios: null тогда возвращет пустой массив если productDataAxios что то есть тогда возвращаем его
    },
    countProducts(){
      return this.productDataAxios ? this.productDataAxios.pagination.total : 0
    },
    // countProducts(){//Общая количество товаров // Перешли на API
    //   return this.filteredProducts.length //Общая количество товаров
    // },
    // filteredProducts(){//Фильтрация товаров //Перехрдим на API филтрацию
    //   let filteredProducts = products//Делаем копию и работаем от копий

    //   if(this.filterPriceFrom >= 0){//Фильтрация От
    //     filteredProducts = filteredProducts.filter((product) => product.price > this.filterPriceFrom)
    //   }

    //   if(this.filterPriceTo > 0){//Фильтрация До
    //     filteredProducts = filteredProducts.filter((product) => product.price < this.filterPriceTo)
    //   }

    //   if(this.filterCategoryId){////Фильтрация по категориям || то что выбрано
    //     filteredProducts = filteredProducts.filter((product) => product.categoryId === this.filterCategoryId)
    //   }

    //   return filteredProducts//Возвращаем отфильтрованные товары
    // }
  },
  methods: {
    // paginate(page){//это emit способ а я использовал v-model связывание
    //   this.currentPage = page
    // }
    nextPage(){
      this.currentPage++
    },
    prevPage(){
      this.currentPage--
    },
    loadProducts(){//Делали запрос на API и получили ответ (можно увидет на Networks)
      // Networks - пишется все запрос связанные API
      this.productsLoading = true//Очищаем и уведомление не будет виден
      this.productsLoadingFailed = false//Очищаем и уведомление не будет виден
      clearTimeout(this.loadProductsTimer)
      this.loadProductsTimer = setTimeout(() => {//setTimeout это трюк что бы не вызвалось много запроса а только 1
        return axios.get(API_BASE_URL + '/api/products/',{
          params: {//Что бы не писать длинный код
            page: this.currentPage,
            limit: this.productPerPage,
            categoryId: this.filterCategoryId,
            minPrice: this.filterPriceFrom,
            maxPrice: this.filterPriceTo,
            colorId: this.color,
          }
      })
        .then(response => this.productDataAxios = response.data)//При ушпешнм принятий запроса запишем на Своиство productDataAxios
        .catch(() => this.productsLoadingFailed = true)//Сначала идет проверка на Ошибку
        .then(() => this.productsLoading = false);//Если товаров еще нет то вывожим уведомление
      }, 0)
    },
    //Пояснаю за setTimeOut - есои у нас одновременно вызветься loadProducts из watch то clearTimeout будет збрасыбать и очищат и остаеться только 1 вызов loadProducts
    // Без setTimeout у нас вызываеться сразу 3 запроса а это минус производительность
  },
  created(){//Когда компонент создался
    this.loadProducts()
  },
  watch: {//Наблюдатель следит за currentPage если оно изменится то перезагружем товары соответсвий с page
    currentPage() {//Когда watch сработает то и измениться currentPage  и мы передодим именно тот страницу которую нажали
      this.loadProducts()//Елси currentPage изменилась то выеваем метод
    },
    filterPriceTo(){
      this.loadProducts()
    },
    filterPriceFrom(){
      this.loadProducts()
    },
    filterCategoryId(){
      this.loadProducts()
    },
    color(){
      this.loadProducts()
    }
  },
}
</script>

<style>

</style>












<!-- Важно: мы из API получаем json готовые товары и его порядок другой  -->

<!-- Порядок товаров из API:
{
  "items": [
    {
      "id": 1,
      "title": "Детский трюковой самокат Razor Grom",
      "slug": "detskiy-tryukovoy-samokat-razor-grom",
      "image": {
        "file": {
          "url": "https://vue-study.skillbox.cc/uploads/file/7/8/b/78b533402b96e588503091b414190a7c.jpg",
          "name": "78b533402b96e588503091b414190a7c.jpg",
          "originalName": "90100219670_001.jpg",
          "extension": "jpg",
          "size": "44.2 Кб"
        }
      },
      "price": 4990,
      "colors": [
        {
          "id": 5,
          "title": "Синий",
          "code": "#73b6ea"
        },
        {
          "id": 4,
          "title": "Зелёный",
          "code": "#8be000"
        }
      ]
    },
    {
      "id": 2,
      "title": "Электросамокат Xiaomi MiJia Electric Scooter Pro",
      "slug": "elektrosamokat-xiaomi-mijia-electric-scooter-pro",
      "image": {
        "file": {
          "url": "https://vue-study.skillbox.cc/uploads/file/5/6/5/5654632f35c0dfe4562fdf4aa9577cdf.jpg",
          "name": "5654632f35c0dfe4562fdf4aa9577cdf.jpg",
          "originalName": "a1610ce2134e013e8f5af20bee8ccc45.jpg",
          "extension": "jpg",
          "size": "849 Кб"
        }
      },
      "price": 44999,
      "colors": [
        {
          "id": 6,
          "title": "Серый",
          "code": "#939393"
        },
        {
          "id": 8,
          "title": "Красный",
          "code": "#e60039"
        },
        {
          "id": 3,
          "title": "Чёрный",
          "code": "#000000"
        }
      ]
    },
    {
      "id": 3,
      "title": "Электросамокат NineBot ES1",
      "slug": "elektrosamokat-ninebot-es1",
      "image": {
        "file": {
          "url": "https://vue-study.skillbox.cc/uploads/file/6/f/7/6f7ac3c6f762772c261fe99d34171239.jpg",
          "name": "6f7ac3c6f762772c261fe99d34171239.jpg",
          "originalName": "10018372b.jpg",
          "extension": "jpg",
          "size": "41.4 Кб"
        }
      },
      "price": 27999,
      "colors": [
        {
          "id": 3,
          "title": "Чёрный",
          "code": "#000000"
        },
        {
          "id": 8,
          "title": "Красный",
          "code": "#e60039"
        }
      ]
    },
    {
      "id": 4,
      "title": "Самокат Ridex Marvel 2.0 R",
      "slug": "samokat-ridex-marvel-2-0-r",
      "image": {
        "file": {
          "url": "https://vue-study.skillbox.cc/uploads/file/5/d/b/5db8a8749477ecc757f43a3ad314cfdc.jpg",
          "name": "5db8a8749477ecc757f43a3ad314cfdc.jpg",
          "originalName": "1381785_v01_b.jpg",
          "extension": "jpg",
          "size": "34 Кб"
        }
      },
      "price": 5450,
      "colors": [
        {
          "id": 3,
          "title": "Чёрный",
          "code": "#000000"
        },
        {
          "id": 6,
          "title": "Серый",
          "code": "#939393"
        }
      ]
    },
    {
      "id": 5,
      "title": "Радионяня Motorola MBP160",
      "slug": "radionyanya-motorola-mbp160",
      "image": {
        "file": {
          "url": "https://vue-study.skillbox.cc/uploads/file/9/4/0/94019f8c2ed426a086b2c696cc7d8421.jpg",
          "name": "94019f8c2ed426a086b2c696cc7d8421.jpg",
          "originalName": "80069af1aa1d66929965ef35c0fa2f7b.jpg",
          "extension": "jpg",
          "size": "161.3 Кб"
        }
      },
      "price": 3690,
      "colors": [
        {
          "id": 5,
          "title": "Синий",
          "code": "#73b6ea"
        },
        {
          "id": 9,
          "title": "Белый",
          "code": "#fafafa"
        }
      ]
    },
    {
      "id": 6,
      "title": "Ультразвуковая зубная щётка Playbrush Smart Sonic",
      "slug": "ultrazvukovaya-zubnaya-shchetka-playbrush-smart-sonic",
      "image": {
        "file": {
          "url": "https://vue-study.skillbox.cc/uploads/file/e/a/9/ea90d3095a8d237fec25a369661077c4.jpg",
          "name": "ea90d3095a8d237fec25a369661077c4.jpg",
          "originalName": "d40ee1b6eb244ad5178cc0820993cb4c.jpg",
          "extension": "jpg",
          "size": "55.7 Кб"
        }
      },
      "price": 5660,
      "colors": [
        {
          "id": 5,
          "title": "Синий",
          "code": "#73b6ea"
        },
        {
          "id": 8,
          "title": "Красный",
          "code": "#e60039"
        }
      ]
    }
  ], Наши список товаров
  "pagination": {
    "page": 1,//Текущий страница
    "pages": 4,//Длина нашего всего страниц
    "total": 21//Общий товар
  } Наша пагинация
}
 -->




