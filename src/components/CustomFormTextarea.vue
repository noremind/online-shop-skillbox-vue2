<template lang="html">
	<CustomFormField :title="title" :error="error">
		<textarea v-model="dataValue" class="form__input form__input--area" :placeholder="placeholder"></textarea>
		<!--slot not default-->
	</CustomFormField>
</template>

<script>
import formFieldMixin from '@/mixins/formFieldMixin'

export default {
	mixins: [formFieldMixin]//Миксин
}
</script>

<style lang="scss" scoped>

</style>