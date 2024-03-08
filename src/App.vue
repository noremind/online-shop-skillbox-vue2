<template>
<div>
    <Header/>

    <router-view></router-view>
    <!-- <component :is="currentPageComponent" :pageParams="currentPageParams"/>//С ручным роутингом -->
    <Footer/>
</div>
</template>

<script>
// import MainPage from '@/pages/MainPage'
// import ProductPage from '@/pages/ProductPage'
// import NotFoundPage from '@/pages/NotFoundPage'
// import eventBus from '@/eventBus'
// import CartIndecator from '@/components/CartIndecator'//Ссылка на Корзину
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {mapActions , mapMutations} from 'vuex'


// const routes = {//router но своими руками
//   main: 'MainPage',
//   product: 'ProductPage',
// }//Уже все я использую саму router

export default {
  name: 'App',
  // data(){ // Это все ручное Router
  //   return{
  //     currentPage: 'main',//Дефольтная страница
  //     currentPageParams: {},//Если мы нажнем на товар то переходим по id именно на тот товар которую мы нажали
  //   }
  // },
  components: {
    // ProductPage,
    // MainPage,
    // NotFoundPage,
    // CartIndecator,
    Header,
    Footer,
  },
  methods: {
    ...mapActions([
      'LOAD_CART'
    ]),
    ...mapMutations([
      'UPDATE_USER_ACCESS_KEY'
    ])
  },
  created(){//При созданий компонента Корзина должен быть уже готовым
    // Это самый первый проверка на то что хранятся ли данные о конзине с уникальным ключом
    const userAccessKey = localStorage.getItem('userAccessKey')//Получили от localStorage уникальную ключь пользователия


    // Если нет то создадим новую в LOAD_CART()
    if(userAccessKey){//Если вдруг localStorage храниться этот ключь то тогда мы вызвем мутацию
      this.UPDATE_USER_ACCESS_KEY(userAccessKey)//И передаем этот ключ
    }//Теперь мы можем видит что в Application значение не меняться и сохраняють значение

    this.LOAD_CART()//Данные о пользователя корзины и его уникальный номера
  },
  // computed: {
  //   // currentPageComponent(){//Показывает текущие страницы
  //   //   return routes[this.currentPage] || 'NotFoundPage'//Это означает что функция возвращает маршутизированный currentPage либо Не Найденную страницу
  //   // }
  // },
  // methods: {
  //   gotoPage(pagName, pagParams){//Переход на страницу которую нажали
  //     this.currentPage = pagName
  //     this.currentPageParams = pagParams || {}
  //   }
  // },
  // created(){//В момент когда данные стали реактивными
  // //Здесь передали аргументов из ProductItem
  //   eventBus.$on('gotoPage' , (pagName, pagParams) => this.gotoPage(pagName,pagParams))
  // }//Подключаем типа vuex и направляем данные и потом выводим конкретную товар на страницу
  // $on - может отловить методы
  // Синтаксис $on:
  // $on('methodName', function)
  // Яснее $on принимает 2 аргумент
  // 1)Имя функций который отлавлывает
// 	2)Это функций который выпольняться при отлавливание


  // (pagName, pagParams) => this.gotoPage(pagName,pagParams) - здесь мы вызвали ананимную функцию и отлавлываем параметры и передаем их на метод gotoPage

  // (pagName, pagParams) - пришли из ProductItem
}
</script>

<style>

</style>





