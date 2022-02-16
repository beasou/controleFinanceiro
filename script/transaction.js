const transactions = [
    {
        id: 1,
        description:'Luz',
        amount: -50000,
        date: '23/01/2021',
    },
    {
        id: 2,
        description:'Website',
        amount: 500000,
        date: '23/01/2021',
    },
    {
        id: 3,
        description:'Aluguel',
        amount: -150000,
        date: '23/01/2021',
    },
]

const Transaction = {
    incomes(){
        //somar as entradas
    },
    expenses(){
        //somar as saidas
    },
    total(){
        //entradas - saidas
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),//tbody contem o html
     
    addTransaction(transaction, index){ //recebe a transação q vai add e um index, em que local vai colocar a transação
        const tr = document.createElement('tr') //criando um elemento <tr> através da DOM
        tr.innerHTML = DOM.innerHTMLTransaction(transaction) //receber o html abaixo
        DOM.transactionsContainer.appendChild(tr)//elemento que foi criado tr
    },

    innerHTMLTransaction(transaction){
        const CSSclass = transaction.amount > 0 ? "income" : "expense"
        
        const amount = Utils.formatCurrency(transaction.amount) //pega o valor da formatação da moeda
        
        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td> 
            <td class="date">${transaction.date}</td>
            <td>
                <img src="./assets/minus.svg" alt="Remover transação">
            </td>
        `
        return html //vai retornar o html no momento em que  innerHTMLTransaction() for chamado para ser adicionado dentro do <tr> 
    }
}

const Utils = { //formatação do valor na tabela
    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : "" //se o valor for menor que 0 atribui sinal de negativio
        
        value = String(value).replace(/\D/g, "") //vai buscar globalmente 
        
        value = Number(value) / 100
        
        value = value.toLocaleString("pt-BR",{ //tipo de formatação de moeda
            style: "currency",
            currency: "BRL"
        })
        
        return (signal + value) //retorna o resultado para o amount
    }
}

transactions.forEach(function(transaction){
    DOM.addTransaction(transaction)
})