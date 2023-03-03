var clicouQuadrado = false;
var muroAtual = -1;

var mudarPartida = false;
var ultimaPartida;

var mudarFinal = false;
var ultimoFinal;
var t = 20
//prompt("escolha o tamanho do mapa")

var tamanho = [t, t];
var quadrados = [tamanho[0] * tamanho[1]];
var algo;

var comecar = false

pintar2 = false;

function setup() {

    frameRate(100);
    createCanvas(1000, 800);
    criarMapa(30, 30);


    button = createButton('Iniciar');
    button.position(tamanho[0] * 20 + 20, 50);
    button.mousePressed(comecou)

    select1 = createSelect();
    select1.position(tamanho[0] * 20 + 20, 10);
    select1.option("Busca em Largura");
    select1.option("Busca em Profundidade");
    select1.option("Busca de Custo Uniforme");
    select1.option("Busca Gulosa pela Melhor Escolha");
    select1.option("A*");

    algo = new algoritimos((quadrados));

}

function draw() {
    background(220);
    if (comecar) {
        algo.pintarCaminho()
        if (pintar2) {
            algo.pintarCaminho2()
        }
    }

    desenharMapa();
}

function comecou() {
    filhosQuadrado();
    resetaMapa()
    algo.aux = algo.returnfinal()
    switch (select1.value()) {
        case ("Busca em Largura"):
            algo.printaBusca(algo.buscaLargura());
            break;
        case ("Busca em Profundidade"):
            algo.printaBusca(algo.buscaProfundidade());
            break;
        case ("Busca de Custo Uniforme"):
            algo.printaBusca(algo.buscaCustoUniforme());
            break;
        case ("Busca Gulosa pela Melhor Escolha"):
            algo.buscaGulosaPelaMelhorEscolha();
            break;
        case ("A*"):
            algo.buscaAEstrela();
            break;
        default:
            return

    }

    comecar = true

}
function criarMapa() {
    //coloca o ponto de partida e o ponto final 
    for (var i = 0; i < tamanho[0]; i++) {
        for (var k = 0; k < tamanho[1]; k++) {
            let id = tamanho[0] * i + k;
            if (i == 0 && k == 0) {
                quadrados[id] = new Quadrado(id, k * 20, i * 20, 20, false, true, [], false)
                ultimaPartida = quadrados[id]
            } else if (i == 1 && k == 1) {
                quadrados[id] = new Quadrado(id, k * 20, i * 20, 20, false, false, [], true)
                ultimoFinal = quadrados[id]
            }
            else {
                quadrados[id] = new Quadrado(id, k * 20, i * 20, 20, false, false, [], false)
            }

        }
    }


}

function desenharMapa() {
    for (var i = 0; i < quadrados.length; i++) {
        quadrados[i].draw()
    }
}

function resetaMapa() {
    pintar2 = false
    quadrados.forEach(quadrado => {
        quadrado.reset()
    })
    algo.reset()

}
function verificaSeJaTemConexao(idQuadradoAtual, idQuadradoFilho) {
    const quadradoFilho = quadrados[idQuadradoFilho]
    return quadradoFilho.filhos.findIndex(filho => {
        return filho.id == idQuadradoAtual
    })
    // if(quadradoFilho.filhos.length != 0){
    //     quadradoFilho.filhos.forEach(filho =>{
    //         if(filho.id == quadradoAtual.id){

    //         }
    //     })
    // }
}

function filhosQuadrado() {
    // popula as arestas de cada quadrado
    for (var i = 0; i < tamanho[0]; i++) {
        for (var k = 0; k < tamanho[1]; k++) {
            var quad = [];
            var pesos = [];
            var cont = 0;
            var resultado;
            let idQuadradoAtual = tamanho[0] * i + k
            let idQuadradoPossivelFilho

            function adicionaPesosEFilhos() {
                if (!quadrados[idQuadradoPossivelFilho].muro) {
                    quad[cont] = quadrados[idQuadradoPossivelFilho];
                    resultado = verificaSeJaTemConexao(idQuadradoAtual, idQuadradoPossivelFilho)
                    if (resultado == -1) {
                        pesos[cont] = t * Math.random(0.1, 1)
                    } else {
                        pesos[cont] = quadrados[idQuadradoPossivelFilho].pesos[resultado]
                    }

                    cont++;
                }
            }

            if (k > 0) {
                idQuadradoPossivelFilho = idQuadradoAtual - 1;
                adicionaPesosEFilhos();

            }
            if (i < tamanho[0] - 1) {
                idQuadradoPossivelFilho = idQuadradoAtual + tamanho[1]
                adicionaPesosEFilhos()


            }

            if (k < tamanho[1] - 1) {
                idQuadradoPossivelFilho = idQuadradoAtual + 1
                adicionaPesosEFilhos()

            }

            if (i > 0) {
                idQuadradoPossivelFilho = idQuadradoAtual - tamanho[1]
                adicionaPesosEFilhos()

            }
            quadrados[idQuadradoAtual].filhos = quad;
            quadrados[idQuadradoAtual].pesos = pesos;
        }
    }
}


function mousePressed() {
    for (var i = 0; i < quadrados.length; i++) {
        if (mouseX > quadrados[i].x && mouseX < quadrados[i].x + quadrados[i].l && mouseY < quadrados[i].y + quadrados[i].l && mouseY > quadrados[i].y && !quadrados[i].final && !quadrados[i].partida) {
            quadrados[i].pintarMuro();
        }
    }
}

function mouseDragged() {
    arrastarPartida();
    arrastarFinal();
    colocaMuros();
}

function colocaMuros() {
    for (var i = 0; i < quadrados.length; i++) {
        if (mouseX > quadrados[i].x && mouseX < quadrados[i].x + quadrados[i].l && mouseY < quadrados[i].y + quadrados[i].l && mouseY > quadrados[i].y && !quadrados[i].final && !quadrados[i].partida) {
            quadrados[i].pintarMuro();
            console.log(quadrados[i])
        }
    }
}

//arrasta o triangulo
function arrastarPartida() {
    for (var i = 0; i < quadrados.length; i++) {
        if (mouseX > quadrados[i].x && mouseX < quadrados[i].x + quadrados[i].l && mouseY < quadrados[i].y + quadrados[i].l && mouseY > quadrados[i].y && quadrados[i].partida == true) {
            ultimaPartida = quadrados[i];
            mudarPartida = true
        }
    }
    if (mudarPartida) {
        for (var i = 0; i < quadrados.length; i++) {
            if (mouseX > quadrados[i].x && mouseX < quadrados[i].x + quadrados[i].l && mouseY < quadrados[i].y + quadrados[i].l && mouseY > quadrados[i].y) {
                ultimaPartida.partida = false;
                quadrados[i].partida = true
                ultimaPartida = quadrados[i];
            } '                                                '
        }

    }

}

//arrasta a bolinha da posicao final
function arrastarFinal() {
    for (var i = 0; i < quadrados.length; i++) {
        if (mouseX > quadrados[i].x && mouseX < quadrados[i].x + quadrados[i].l && mouseY < quadrados[i].y + quadrados[i].l && mouseY > quadrados[i].y && quadrados[i].final == true) {
            ultimoFinal = quadrados[i];
            mudarFinal = true

        }
    }
    if (mudarFinal) {
        for (var i = 0; i < quadrados.length; i++) {
            if (mouseX > quadrados[i].x && mouseX < quadrados[i].x + quadrados[i].l && mouseY < quadrados[i].y + quadrados[i].l && mouseY > quadrados[i].y) {
                ultimoFinal.final = false;
                quadrados[i].final = true
                ultimoFinal = quadrados[i];
            } '                                                '
        }
    }
}

function mouseReleased() {
    mudarPartida = false;
    mudarFinal = false;
    quadradoAtual = -1
}



class algoritimos {
    constructor(lista) {
        this.lista = lista;
        this.estrutura = [];
        this.estruturaAux = [];
        this.caminho = [];

        this.aux = this.returnfinal();
    }


    reset() {
        this.estrutura = [];
        this.estruturaAux = [];
        this.caminho = [];
    }

    returnPartida() {
        for (var i = 0; i < this.lista.length; i++) {
            if (this.lista[i].partida == true) {
                return this.lista[i]
            }
        }
    }

    returnfinal() {
        for (var i = 0; i < this.lista.length; i++) {
            if (this.lista[i].final == true) {
                return this.lista[i]
            }
        }
    }
    custoEmLinhaReta(no, final) {
        var xBMinusxA_2 = Math.pow(final.x - no.x, 2);
        var yBMinusyA_2 = Math.pow(final.y - no.y, 2);
        return Math.sqrt(xBMinusxA_2 + yBMinusyA_2)
    }

    custosTodosVertices(final) {
        this.lista.forEach(function (item, indice, array) {
            item.custoEmLinhaReta = dist(item.x, item.y, final.x, final.y);
        })
    }

    buscaGulosaPelaMelhorEscolha() {
        var no = this.returnPartida();
        var final = this.returnfinal();
        this.custosTodosVertices(final);
        this.estrutura.push(no);
        this.estruturaAux.push(no);
        no.expandido = true;

        while (this.estrutura.length != 0) {
            for (var i = 0; i < no.filhos.length; i++) {
                if (no.filhos[i].final || !no.filhos[i].expandido) {
                    no.filhos[i].pai = no;
                    this.estrutura.push(no.filhos[i])
                    if (!no.filhos[i].final) {
                        no.filhos[i].expandido = true;
                    }
                }
            }
            this.estrutura.shift()
            this.estrutura.sort((a, b) => a.custoEmLinhaReta - b.custoEmLinhaReta);
            no = this.estrutura[0];
            this.estruturaAux.push(no);
            if (no.final) {
                break;
            }
        }

    }


    buscaAEstrela() {
        var final = this.returnfinal();
        this.custosTodosVertices(final);

        var no = this.returnPartida();
        no.custoAEstrela = no.custoEmLinhaReta;
        this.estrutura.push(no);
        this.estruturaAux.push(no);
        var cont = 0;
        while (true) {
            console.log(cont);
            cont++;
            this.estrutura.forEach(function (value) { console.log(value) })


            var menorValor = Number.MAX_VALUE;
            var menorIndice = -1;
            for (var i = 0; i < this.estrutura.length; i++) {
                if (this.estrutura[i].custoAEstrela < menorValor) {
                    menorValor = this.estrutura[i].custoAEstrela;
                    menorIndice = i;
                }
            }

            if (menorIndice === -1) {
                break;
            } else {
                console.log(this.estrutura[menorIndice]);
                if (this.estrutura[menorIndice].final) {
                    break;
                }
                this.estrutura[menorIndice].expandido = true;
                no = this.estrutura[menorIndice];
                this.estrutura.splice(menorIndice, 1);

            }
            
            for (var i = 0; i < no.filhos.length; i++) {
                var gScore = no.custo + no.pesos[i];
                if (no.filhos[i].expandido) {
                    continue;
                }
                if (!this.estrutura.includes(no.filhos[i])) {
                    no.filhos[i].pai = no;
                    no.filhos[i].custo = gScore;
                    no.filhos[i].custoAEstrela = no.filhos[i].custo + no.filhos[i].custoEmLinhaReta;
                    this.estrutura.push(no.filhos[i]);
                    this.estruturaAux.push(no.filhos[i]);
                } else if (gScore + no.filhos[i].custoEmLinhaReta < no.filhos[i].custoAEstrela) {
                    no.filhos[i].pai = no;
                    no.filhos[i].custo = gScore;
                    no.filhos[i].custoAEstrela = no.filhos[i].custo + no.filhos[i].custoEmLinhaReta;
                }
                if (no.filhos[i].final) {
                    break;
                }
            }



        }

    }

    buscaProfundidade() {
        let aux;
        let origem = this.returnPartida().id
        let destino = this.returnfinal().id
        let node = new Node(origem);

        node.pai = new Node(-1);

        this.estrutura.push(node)


        while (this.estrutura.length != 0) {
            aux = this.estrutura.pop()


            if (this.lista[aux.id].expandido) {
                continue
            }

            this.estruturaAux.push(this.lista[aux.id])

            if (aux.id == destino) {
                return aux
            }

            this.lista[aux.id].expandido = true
            this.lista[aux.id].filhos.forEach(filho => {
                if (!filho.expandido && filho.id != aux.pai.id && filho.id != origem) {
                    node = new Node(filho.id)
                    node.pai = aux
                    this.estrutura.push(node)
                }
            });

        }
        return aux
    }

    buscaLargura() {
        let aux;
        let origem = this.returnPartida().id
        let destino = this.returnfinal().id
        let node = new Node(origem);
        let t = new Node(destino);

        node.pai = new Node(-1);

        this.estrutura.push(node)


        while (this.estrutura.length != 0) {
            aux = this.estrutura.shift()

            if (this.lista[aux.id].expandido) {
                continue
            }

            this.estruturaAux.push(this.lista[aux.id])

            if (aux.id == t.id) {
                return aux
            }

            this.lista[aux.id].expandido = true
            this.lista[aux.id].filhos.forEach(filho => {
                if (!filho.expandido && filho.id != aux.pai.id && filho.id != origem) {
                    node = new Node(filho.id)
                    node.pai = aux
                    this.estrutura.push(node)
                }
            });

        }
        return aux

    }

    buscaCustoUniforme() {
        let aux;
        let origem = this.returnPartida().id
        let destino = this.returnfinal().id
        let node = new Node(origem);
        let t = new Node(destino);


        node.pai = new Node(-1);
        this.estrutura.push(node)


        while (!(this.estrutura.length == 0)) {
            aux = this.estrutura.shift()

            if (!this.lista[aux.id].expandido) {
                this.estruturaAux.push(this.lista[aux.id])
            }


            if (aux.id == t.id) {
                return aux
            }
            
            this.lista[aux.id].expandido = true
            this.lista[aux.id].filhos.forEach(filho => {
                if (!filho.expandido && filho.id != aux.pai.id && filho.id != origem) {
                    let index = this.lista[aux.id].filhos.indexOf(filho)
                    let peso = this.lista[aux.id].pesos[index] + aux.gn
                    if (this.lista[filho.id].custoUniforme >= peso) {
                        this.lista[filho.id].custoUniforme = peso 
                        node = new Node(filho.id)
                        node.gn = peso;
                        node.pai = aux

                        this.estrutura.push(node)

                        if (this.estrutura.length != 0) {
                            let adicionouNo = false;
                            this.estrutura.forEach(no => {
                                if (node.gn < no.gn && adicionouNo == false) {
                                    this.estrutura.splice(this.estrutura.indexOf(no), 0, node)
                                    adicionouNo = true;
                                }
                            })
                            if (adicionouNo == false) {
                                this.estrutura.push(node)
                            }
                        } else {
                            this.estrutura.push(node)
                        }
                    }

                }
            });

        }
        return aux
    }

    printaBusca(resultado) {

        this.aux = this.lista[resultado.id]
        while (resultado.id != -1) {
            this.lista[resultado.id].pai = this.lista[resultado.pai.id]
            resultado = resultado.pai
        }

    }

    pintarCaminho() {
        if (this.estruturaAux.length > 0 && this.estruturaAux[0].final != true) {
            this.estruturaAux[0].cor = true;
            this.estruturaAux.shift();
        }
        else {
            pintar2 = true
        }

    }

    pintarCaminho2() {
        if (this.aux != null) {
            console.log(this.aux)
            this.aux.cor2 = true;
            this.aux = this.aux.pai
        }
    }
}


class Quadrado {
    constructor(id, x, y, l, cor, partida, filhos, final) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.l = l;
        this.cor = cor;
        this.corMuro = false
        this.cor2 = false;
        this.final = final;
        this.partida = partida;
        this.filhos = filhos;
        this.pesos = null
        this.expandido = false;
        this.pai = null;
        this.muro = false;
        this.custoEmLinhaReta = 0;
        this.custo = 0;
        this.custoAEstrela = 0;
        this.custoUniforme = Number.MAX_VALUE
    }

    reset() {
        this.cor = false;
        this.cor2 = false;
        this.expandido = false;
        this.pai = null;
        this.custoEmLinhaReta = 0;
        this.custo = 0;
        this.custoAEstrela = 0;
        this.custoUniforme = Number.MAX_VALUE
    }

    draw() {

        if (this.cor2 == true) {

            fill(color(255, 0, 0));

        } else if (this.cor == true) {

            fill(color(71, 140, 245));

        } else if (this.corMuro == true) {
            fill(color('MidnightBlue'))
        } else {
            fill(color(255, 255, 255))
        }
        square(this.x, this.y, this.l);

        if (this.partida) {
            triangle(this.x, this.y + this.l, this.x + this.l / 2, this.y, this.x + this.l, this.y + this.l);
        }

        if (this.final) {
            circle(this.x + this.l / 2, this.y + this.l / 2, this.l * 0.8);
        }

    }

    clicado(i) {
        if (mouseX > this.x && mouseX < this.x + this.l && mouseY < this.y + this.l && mouseY > this.y) {
            this.cor = true;
            console.log(i)
        }
    }

    pintarFilhos() {
        if (mouseX > this.x && mouseX < this.x + this.l && mouseY < this.y + this.l && mouseY > this.y) {
            for (var i = 0; i < this.quadrados.length; i++) {
                this.quadrados[i].cor = true;

            }
        }
    }

    pintarMuro() {
        if (this.id != muroAtual) {
            if (this.muro) {
                this.muro = false
                this.corMuro = false
            } else {
                this.muro = true
                this.corMuro = true
            }
            muroAtual = this.id
        }
    }




}

