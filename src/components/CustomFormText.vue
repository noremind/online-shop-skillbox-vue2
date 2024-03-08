<template lang="html">
	<CustomFormField :title="title" :error="error">
		<input class="form__input" v-model="dataValue" :type="type" name="name" :placeholder="placeholder">
		<!--slot not default-->
	</CustomFormField>
</template>

<script>
import formFieldMixin from '@/mixins/formFieldMixin'

export default {
	props: {
		type: {
			default: 'text'
		}
	},
	mixins: [formFieldMixin]
}
</script>

<style lang="scss" scoped>

</style>