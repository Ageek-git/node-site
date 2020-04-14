/**
 * author:Ageek
 */
window.onload = ()=>{
	createTurbulence();
	draw();
}
function createTurbulence(){
	let timeline = new TimelineMax({repeat: -1,yoyo: true});
	let feTurb = document.querySelector('#feturbulence');
	timeline.add(
		TweenMax.to(feTurb, 8, {
  			onUpdate: function () {
    				let  bfX = this.progress() * 0.005 + 0.005;//base frequency x
    					 bfY = this.progress() * 0.0005 + 0.003,//base frequency y
    					feTurb.setAttribute('baseFrequency', `${bfX} ${bfY}`);
  					}
		}),
	0);
}



