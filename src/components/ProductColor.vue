<template lang="html">
	<ul class="colors">
		<li class="colors__item" v-for="color in colors" :key="color.id">
			<label class="colors__label">
				<input
					v-model="selected"
					class="colors__radio sr-only"
					type="radio"
					name="color"
					:value="color.id"
				>
				<span class="colors__value" :style="'background-color: ' + color.code + ';'">
				</span></label>
		</li>
	</ul>
</template>

<script>
export default {
  name: 'ProductColor',
  props: ['colors' , 'currentColor'],
  computed: {
	selected: {
		get(){
			return this.currentColor
		},
		set(newValue){
			this.$emit('update:currentColor', newValue)
		}
	}
  }
}
</script>

<style lang="scss" scoped>

</style>