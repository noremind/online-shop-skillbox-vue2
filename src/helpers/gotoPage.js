import eventBus from '@/eventBus'//Миксины

export default function(pagName,pagParams){
				eventBus.$emit('gotoPage', pagName, pagParams)
			}