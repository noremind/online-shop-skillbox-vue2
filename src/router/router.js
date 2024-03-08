import Vue from 'vue'
import VueRouter from 'vue-router'

// Components
import MainPage from '@/pages/MainPage'
import NotFoundPage from '@/pages/NotFoundPage'
import ProductPage from '@/pages/ProductPage'
import CartPage from '@/pages/CartPage'
import OrderPage from '@/pages/OrderPage'
import OrderInfoPage from '@/pages/OrderInfoPage'

Vue.use(VueRouter)

const routes = [//Маршрут имеет Порядок и Ирархию
	{name: 'main', component: MainPage, path: '/'},
	{name: 'product', component: ProductPage, path: '/product/:id'},
	{name: 'notFound', component: NotFoundPage, path: '*'},// * - любая не сущест симболы или саит
	{name: 'cart', component: CartPage, path: '/cart'},
	{name: 'order', component: OrderPage, path: '/order'},
	{name: 'orderInfo', component: OrderInfoPage, path: '/order/:id'},
];

const router = new VueRouter({
	mode: 'history',
	routes
})

export default router

 // path: '/product/:id' - это динамическая путь потому что оно меняются с выбранном товаром

 // :id - это динамический секция и оно отображаеться в devtools и в $route/params/id