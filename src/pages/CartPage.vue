<template lang="html">
<div>
    <main class="content container">
        <div class="content__top">
            <ul class="breadcrumbs">
                <li class="breadcrumbs__item">
                    <router-link
                        class="breadcrumbs__link"
                        href="index.html"
                        :to="{name: 'main'}"
                    >
                        Каталог
                    </router-link>
                </li>
                <li class="breadcrumbs__item">
                    <a class="breadcrumbs__link">
                        Корзина
                    </a>
                </li>
            </ul>
            <h1 class="content__title">
                Корзина
            </h1>
            <span class="content__info">
                {{cartProducts.length}} товара
            </span>
        </div>
        <section class="cart">
            <form class="cart__form form" action="#" method="POST">
                <div class="cart__field">
                    <ul class="cart__list">

                        <CartItem
                            v-for="item in CART_DETAIL"
                            :key="item.productId"
                            :item="item"
                        />

                    </ul>
                </div>
                <div class="cart__block">
                    <p class="cart__desc">
                        Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе
                    </p>
                    <p class="cart__price">
                        Итого: <span>{{CART_TOTAL_PRICE | numberFormat}} ₽</span>
                    </p>
                    <router-link tag="button" :to="{name: 'order'}" class="cart__button button button--primery" type="submit" >
                        Оформить заказ
                    </router-link>
                </div>
            </form>
        </section>
    </main>
</div>
</template>

<script>
import {mapGetters} from 'vuex'
import numberFormat from '@/helpers/numberFormat'
import CartItem from '@/components/CartItem'

export default {
  name: 'CartPage',
  components: {
    CartItem
  },
  computed: {
    ...mapGetters([
        'CART_DETAIL',
        'CART_TOTAL_PRICE',
    ]),
    cartProducts(){//Получаю длину
        return this.$store.state.cartProducts
    }
  },
  filters: {
    numberFormat,
  },
}
</script>

<style lang="scss" scoped>

</style>