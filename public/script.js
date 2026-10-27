document.addEventListener('DOMContentLoaded', () => {

    const botaoAdicionar = document.getElementById('adicionar-produto');
    const botaoSalvar = document.getElementById('salvar-pedidos');
    const listaPedidos = document.getElementById('lista-pedidos');
    const totalElemento = document.getElementById('total');
    const nomeProdutoInput = document.getElementById('nome-produto');
    const precoProdutoInput = document.getElementById('preco-produto');

    let total = 0;
    let pedidosData = [];

    botaoAdicionar.addEventListener('click', function () {

        const nomeProduto = nomeProdutoInput.value.trim();
        const precoProduto = parseFloat(precoProdutoInput.value);

        if (nomeProduto && !isNaN(precoProduto) && precoProduto > 0) {

            const li = document.createElement('li');
            li.innerHTML = `
                ${nomeProduto} - R$ ${precoProduto.toFixed(2).replace('.', ',')}
                <button class="remover">Remover</button>
            `;

            listaPedidos.appendChild(li);

            total += precoProduto;
            totalElemento.textContent = total.toFixed(2).replace('.', ',');

            pedidosData.push({
                nome: nomeProduto,
                preco: precoProduto
            });

            // Limpar os inputs
            nomeProdutoInput.value = '';
            precoProdutoInput.value = '';

            // Remover produto
            li.querySelector('.remover').addEventListener('click', function () {

                total -= precoProduto;
                totalElemento.textContent = total.toFixed(2).replace('.', ',');

                // Remover apenas o item clicado do array
                const index = pedidosData.findIndex(p => p.nome === nomeProduto && p.preco === precoProduto);
                if (index !== -1) {
                    pedidosData.splice(index, 1);
                }

                listaPedidos.removeChild(li);
            });

        } else {
            alert('Por favor, insira um nome e um preço válido');
        }

    });

    botaoSalvar.addEventListener('click', function () {
        if (pedidosData.length === 0) {
            alert('Nenhum produto para salvar.');
            return;
        }

        const dadosParaEnviar = {
            pedidos: pedidosData,
            total: total.toFixed(2)
        };

        fetch('http://localhost:3000/salvar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosParaEnviar)
        })
            .then(response => response.text())
            .then(resposta => {
                alert(resposta);
                
                // Limpar lista do DOM e resetar estado após sucesso
                listaPedidos.innerHTML = '';
                pedidosData = [];
                total = 0;
                totalElemento.textContent = '0,00';
            })
            .catch(error => {
                console.error('Erro ao salvar os dados:', error);
            });
    });

});