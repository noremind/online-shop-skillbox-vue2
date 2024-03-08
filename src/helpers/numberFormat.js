export default function numberFormat(value){
	return new Intl.NumberFormat().format(value)//Делает формат числ
}
// value - переданное число
// Intl - это библотека для форматирование цисл