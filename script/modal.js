//  FUNCIONALIDADE DO MODAL ABRIR & FECHAR 

const Modal = {
        open(){
        // Abrir MODAL
        // add a classe active ao modal
            document
                .querySelector('.modal-overlay')
                .classList.add('active')
        },
        close(){
        // fechar o MODAL
        // rm a classe active do modal
        document
                .querySelector('.modal-overlay')
                .classList.remove('active')
        }
}