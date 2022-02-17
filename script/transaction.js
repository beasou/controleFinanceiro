const Storage = {
    get(){
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },

    set(transactions){
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}

const Transaction = {
    all:Storage.get(),

    add(transaction){
        Transaction.all.push(transaction)
        App.reload()
    },
    remove(index){
        Transaction.all.splice(index,1)
        App.reload()
    },

    incomes(){
        //somar as entradas
        let income = 0
        //pegar tds as transações
        //para cada transação,
        Transaction.all.forEach(transaction => {
            //se for maior que 0 
            if(transaction.amount > 0){
            // somar uma variavel e retornar a variavel
                income += transaction.amount
            }
        })
        return income
    },
    expenses(){
        //somar as saidas
        let expense = 0
        Transaction.all.forEach(transaction => {
            if(transaction.amount < 0){
                expense += transaction.amount
            }
        })
        return expense
    },
    total(){
        //entradas - saidas
        return Transaction.incomes() + Transaction.expenses()
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),//tbody contem o html
     
    //TRANSAÇÕES
    addTransaction(transaction, index){ //recebe a transação q vai add e um index, em que local vai colocar a transação
        const tr = document.createElement('tr') //criando um elemento <tr> através da DOM
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index) //receber o html abaixo
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)//elemento que foi criado tr
    },

    //INSERÇÃO DAS LINHAS DA TABELA HTML
    innerHTMLTransaction(transaction, index){
        const CSSclass = transaction.amount > 0 ? "income" : "expense"
        
        const amount = Utils.formatCurrency(transaction.amount) //pega o valor da formatação da moeda
        
        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td> 
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
            </td>
        `
        return html //vai retornar o html no momento em que  innerHTMLTransaction() for chamado para ser adicionado dentro do <tr> 
    },

    //ATUALIZAÇÃO DOS TOTAIS ENTRADA SAIDA E TOTAL FINAL
    updateBalance(){
        
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())

        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())

        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    //LIMPANDO A TABELA PARA NÃO CARREGAR 2X
    clearTransactions(){
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = { //formatação do valor na tabela
    formatAmount(value){
        //receber o amount e vai fazer o retorno de um valor formatado
        value = Number(value) * 100 // transformando a string em numebro e multiplicando por 100
        return value // retornando o value para o amount
    },

    formatDate(date){
        const splittedDate = date.split("-")//separando a string pelo -  e colocando no array
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}` //organizando a data pelo array pego
        
    },

    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : "" //se o valor for menor que 0 atribui sinal de negativio
        
        value = String(value).replace(/\D/g, "") //vai buscar globalmente e remover caracteres especiais
        
        value = Number(value) / 100
        
        value = value.toLocaleString("pt-BR",{ //tipo de formatação de moeda
            style: "currency",
            currency: "BRL"
        })
        
        return (signal + value) //retorna o resultado para o amount
    }
}

const Form = {//pegando o formulario atraves do id
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues(){ //pegando os valores de formulario e retornando como obj pra depois preenchar a tabela
        return{
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }
    },

    validateFields(){//validando os campos preenchidos
        const{description, amount, date} = Form.getValues()

        if(description.trim() === "" || 
            amount.trim() === "" || 
            date.trim() === "")
            {//trim() faz a limpeza dos campos vazios
            throw new Error("Preencha todos os campos") //SE VAZIO DISPARAR O ERRO
            }
    },

    // FORMATANDO OS VALORES
    formatValues(){
        let {description, amount, date} = Form.getValues()
        amount = Utils.formatAmount(amount) //valor dinheiro digitado
        date = Utils.formatDate(date) // valor data digitado

        return{
            description,
            amount,
            date
        }

    },

    //SALVANDO OS DADOS DO FORMULARIO
    saveTransaction(transaction){
        Transaction.add(transaction) //dava pra colar isso direto em salvar no submit
    },

    //LIMPANDO OS DADOS DO FORMULARIO
    clearFields(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event){
        event.preventDefault()
       
        try {//VOU TENTAR FAZER
            //verificar se todas as informações foram preenchidas
            Form.validateFields()
            
            //formatar os dados para salvar
            const transaction = Form.formatValues()
            
            //salvar
            Form.saveTransaction(transaction)

            //apagar os dados do formulário
            Form.clearFields()

            //modal feche
            Modal.close()

            //atualizar a aplicação 
            // App.reload() //ja tem um App.reload() no  const Transaction {add(transaction)}
            
        } catch (error) { //CAPTURAR O ERRO
            alert(error.message)
        }

        
    }
}

const App = {
    init(){
        Transaction.all.forEach((transaction, index) =>{
            DOM.addTransaction(transaction, index)
        }) //adicionando na dom
        
        DOM.updateBalance() //atualizando o balanço

        Storage.set(Transaction.all) //mandar todas
    },
    reload(){
        DOM.clearTransactions()
        App.init()
    },
}


App.init()
