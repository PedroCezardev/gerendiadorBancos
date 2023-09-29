// Classes:
// classe conta bancária
class ContaBancaria {
    constructor(agencia, numero, tipo, saldo) {
        this.agencia = agencia;
        this.numero = numero;
        this.tipo = tipo;
        this.saldo = saldo;
        this.transacoes = [];
    }

    getSaldo() {
        return this.saldo;
    }

    setSaldo(valor) {
        this.saldo = valor;
    }

    sacar(valor) {
        if (valor > this.saldo) {
            alert("Saldo insuficiente!");
            return false;
        } else {
            this.saldo -= valor;
            this.realizarTransacao("Saque", valor);
            return true;
        }
    }

    depositar(valor) {
        this.saldo += valor;
        this.realizarTransacao("Depósito", valor);
    }

    realizarTransacao(tipo, valor) {
        this.transacoes.push({ tipo, valor });
    }
}

// classe conta corrente
class ContaCorrente extends ContaBancaria {
    constructor(agencia, numero, saldo, cartaoCredito) {
        super(agencia, numero, "Conta Corrente", saldo);
        this.cartaoCredito = cartaoCredito;
    }

    getCartaoCredito() {
        return this.cartaoCredito;
    }

    setCartaoCredito(valor) {
        this.cartaoCredito = valor;
    }
}

// classe conta poupança
class ContaPoupanca extends ContaBancaria {
    constructor(agencia, numero, saldo) {
        super(agencia, numero, "Conta Poupança", saldo);
    }
}

class ContaUniversitaria extends ContaBancaria {
    constructor(agencia, numero, saldo) {
        super(agencia, numero, "Conta Universitária", saldo);
    }

    sacar(valor) {
        if (valor > 500) {
            alert("Conta Universitária só pode sacar até R$500 por vez.");
            return false;
        } else {
            return super.sacar(valor);
        }
    }
}

// Funções
const contas = [];

// função para inserir dados
function inserirConta() {
    const agencia = document.getElementById("agencia").value;
    const numero = document.getElementById("numero").value;
    const tipo = document.getElementById("tipo").value;
    const saldo = parseFloat(document.getElementById("saldo").value);

    if (agencia === "" || numero === "" || isNaN(saldo) || saldo <= 0) {
        alert("Por favor, insira todas as informações necessárias antes de fazer um depósito.");
        return; // Retorna sem fazer a inserção
    }
    switch (tipo) {
        case "corrente":
            const cartaoCredito = parseFloat(prompt("Informe o limite do cartão de crédito:"));
            contas.push(new ContaCorrente(agencia, numero, saldo, cartaoCredito));
            break;
        case "poupanca":
            contas.push(new ContaPoupanca(agencia, numero, saldo));
            break;
        case "universitaria":
            contas.push(new ContaUniversitaria(agencia, numero, saldo));
            break;
    }

    alert("Conta inserida com sucesso!");
    limparCampos();
}

// função visualizar contas
function visualizarContas() {
    const listaContas = document.getElementById("listaContas");
    listaContas.innerHTML = "";

    contas.forEach(conta => {
        listaContas.innerHTML += `
            <div>
                <strong>Tipo:</strong> ${conta.tipo}<br>
                <strong>Agência:</strong> ${conta.agencia}<br>
                <strong>Número:</strong> ${conta.numero}<br>
                <strong>Saldo:</strong> R$ ${conta.getSaldo().toFixed(2)}
                ${conta instanceof ContaCorrente ? `<br><strong>Limite Cartão Crédito:</strong> R$ ${conta.getCartaoCredito().toFixed(2)}` : ""}
            </div>
        `;
    });
}

// função deletar
function deletarConta() {
    const numeroConta = prompt("Informe o número da conta que deseja deletar:");
    const index = contas.findIndex(conta => conta.numero === numeroConta);

    if (index !== -1) {
        contas.splice(index, 1);
        alert("Conta deletada com sucesso!");
    } else {
        alert("Conta não encontrada.");
    }

    visualizarContas();
}

// função para sacar os valores
function sacarValor() {
    const numeroConta = prompt("Informe o número da conta:");
    const valorSaque = parseFloat(prompt("Informe o valor do saque:"));

    const conta = contas.find(conta => conta.numero === numeroConta);

    if (conta) {
        conta.sacar(valorSaque);
        alert(`Saque de R$ ${valorSaque} realizado com sucesso!`);
        visualizarContas();
    } else {
        alert("Conta não encontrada.");
    }
}

// função para limpar os campos após a entrada
function limparCampos() {
    document.getElementById("agencia").value = "";
    document.getElementById("numero").value = "";
    document.getElementById("tipo").value = "corrente";
    document.getElementById("saldo").value = "";
}

// função exibir extrato
function exibirExtrato() {
    const numeroConta = prompt("Informe o número da conta:");
    const conta = contas.find(conta => conta.numero === numeroConta);

    if (conta) {
        const extrato = obterExtrato(conta);
        alert(extrato);
    } else {
        alert("Conta não encontrada.");
    }
}

// função para obter o extrato
function obterExtrato(conta) {
    let extrato = `Extrato da Conta ${conta.tipo}\n`;
    extrato += `Agência: ${conta.agencia} - Número: ${conta.numero}\n`;
    extrato += `Saldo Atual: R$ ${conta.getSaldo().toFixed(2)}\n\n`;

    if (conta.transacoes.length > 0) {
        extrato += "Transações:\n";
        conta.transacoes.forEach(transacao => {
            extrato += `${transacao.tipo}: R$ ${transacao.valor.toFixed(2)}\n`;
        });
    } else {
        extrato += "Nenhuma transação realizada.\n";
    }
    return extrato;
}