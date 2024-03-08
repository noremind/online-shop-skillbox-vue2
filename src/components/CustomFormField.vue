<template lang="html">
    <label class="form__label">
        <!-- <input class="form__input" type="text" name="name" placeholder="Введите ваше полное имя"> //Так как input может содержать text,number и тд мы вместо Статичного inputa можем сделать Динамичнй slot-->

        <slot></slot>
        <span class="form__value">{{title}}</span>
        <span class="form__error" v-if="error">{{ error }}</span>
    </label>
</template>

<script>
export default {
  name: 'CustomFormField',
  props: ['title', 'error']
}
</script>

<style lang="scss" scoped>

</style>