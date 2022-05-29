let nome;
// perguntarnome()
function perguntarnome(){
    nome = prompt("qual seu nome?")
    console.log(nome)
    const dados =  {
        name: nome
      }
    const promessa = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants", dados)
    // colocar msg de carregamento
    promessa.then(buscarmensagem)
      promessa.catch(nomeinvalido)
}


buscarmensagem()
function buscarmensagem(){
    // tirar mensagem de carregamento
    setInterval(carregarMSG_servidor, 5000)
    setInterval(manterCONECTADO, 4000)
    setInterval(participante, 6000)
}

function nomeinvalido(){
    perguntarnome()
}


function carregarMSG_servidor(){
    const promessa = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages")
    promessa.then(renderizar)
}

function renderizar(resposta){
    
    const ul = document.querySelector(".lista")
    ul.innerHTML = ""
    for(let i = 0; i <resposta.data.length ; i++){
        
        const novo = resposta.data[i]
        

        if(novo.type === "status"){
        ul.innerHTML += `

        <li class="barrademensagem entrei"> 
            <span>(${novo.time})</span>
            <strong>${novo.from}</strong>
            <span>${novo.text}</span>
        </li>
        `
        }


        else if(novo.type === "message"){   //para todos verem
            ul.innerHTML+= ` 
             <li class="barrademensagem todos"> 
                <span>(${novo.time})</span>
                <strong>${novo.from}</strong>
                <strong>para</strong>
                <strong>${novo.to}</strong>
               
                <span class="mensagemtxt">${novo.text}</span >
             </li>`
        }
        else if(novo.to === nome || novo.from === nome || (novo.type === "private-message" && novo.to === "todos")  ){
            ul.innerHTML+= ` 
            <li class="barrademensagem private-message"> 
               <span>(${novo.time})</span>
               <strong>${novo.from}</strong>
               <span>${novo.to}</span>
               <strong>somente </strong>
               <span class="mensagemtxt">${novo.text}</span >
            </li>`
        }
    }
    rolarchataofinal()
}

function manterCONECTADO(){
     const dados =  {
        name: nome
      }
    const promessa = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/status", dados)
    promessa.then(buscarmensagem)
}

function enviarmensagem(){
    const mensagem = document.querySelector(".digitado")
    input = mensagem.value
    if(mensagem != ""){
        const dados = {
            from: nome,
            to: "todos",
            text: input,
            type: "message" // ou "private_message" para o bônus
        }

        const promessa = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages", dados)
        promessa.then(carregarMSG_servidor);
        promessa.catch(atualizaPg)
        mensagem.value = "";
        
    }
}

function atualizaPg(){
    alert("vc foi desconectado")
    location. reload();
}

function rolarchataofinal(){
    const ultimamsg = document.querySelector(".lista li:last-child")
    ultimamsg.scrollIntoView()
}

function abrirMenuParticipantes(){
    const menu = document.querySelector(".togle")
    const fundo = document.querySelector(".fundo-preto")

    menu.classList.toggle("escondido")
    fundo.classList.toggle("escondido")
}


function participante(){
    const promessa = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants")
    promessa.then(renderizarParticipantes)
}

function renderizarParticipantes(resposta){
    const pessoa = resposta.data

    const ulPessoasON = document.querySelector(".pessoasOnline")

                    // garantir que sempre aparece a opcao "TODAS"
    ulPessoasON.innerHTML = `   <li class="opcoes">  TODOS <span class="check"> v </span> </li>   `

    for(let i = 0; i < pessoa.length; i++){
    const participante = pessoa[i]

    ulPessoasON.innerHTML += `  <li class="opcoes">  ${participante.name}  </li>  `
    }
}    //02:20