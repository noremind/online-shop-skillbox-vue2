import CustomFormField from '@/components/CustomFormField'


export default {
  name: 'CustomFromText',
  props: ['title', 'error' , 'placeholder' , 'value'],
  components: {CustomFormField},
  computed: {
	dataValue: {//Двухсторонная связь если так пишем то не будет ошибки про изменение props
		get(){
			return this.value
		},
		set(newValue){
			this.$emit('input', newValue)
		}
	}
  }
}