document.addEventListener("DOMContentLoaded",()=>{

const btnAbrir = document.getElementById("btnAbrirModal")
const btnPrimera = document.getElementById("btnPrimeraEntrada")
const btnCerrar = document.getElementById("btnCerrarModal")
const btnCancelar = document.getElementById("btnCancelar")
const btnGuardar = document.getElementById("btnGuardar")

const backdrop = document.getElementById("backdrop")

const mood = document.getElementById("mood")
const texto = document.getElementById("textoDia")
const lista = document.getElementById("listaDia")
const positivo = document.getElementById("positivoDia")

const cards = document.getElementById("cards")
const empty = document.getElementById("emptyState")
const list = document.getElementById("listSection")
const count = document.getElementById("entradasCount")

function obtener(){
return JSON.parse(localStorage.getItem("diario") || "[]")
}

function guardar(data){
localStorage.setItem("diario",JSON.stringify(data))
}

function abrir(){
backdrop.classList.add("show")
}

function cerrar(){
backdrop.classList.remove("show")
}

btnAbrir.onclick=abrir
btnPrimera.onclick=abrir
btnCerrar.onclick=cerrar
btnCancelar.onclick=cerrar


btnGuardar.onclick=()=>{

let data=obtener()

data.push({
id:crypto.randomUUID(),
mood:mood.value,
texto:texto.value,
lista:lista.value,
positivo:positivo.value,
fecha:new Date().toLocaleDateString()
})

guardar(data)

cerrar()

render()

}


function eliminar(id){

let data=obtener()

data=data.filter(e=>e.id!==id)

guardar(data)

render()

}


function render(){

let data=obtener()

cards.innerHTML=""

if(data.length===0){

empty.style.display="grid"
list.style.display="none"

}else{

empty.style.display="none"
list.style.display="block"

}

count.textContent=data.length+" entradas registradas"

data.forEach(d=>{

let card=document.createElement("div")

card.className="card"

card.innerHTML=`

<h4>${d.mood} ${d.fecha}</h4>

<p><b>Hoy:</b> ${d.texto}</p>

<p><b>Importante:</b> ${d.lista}</p>

<p><b>Positivo:</b> ${d.positivo}</p>

<div class="actions">

<button class="btn-mini" onclick="eliminar('${d.id}')">
🗑
</button>

</div>

`

cards.appendChild(card)

})

}

window.eliminar=eliminar

render()

})