import { useState } from 'react'
import './App.css'

function App() {
  // Estado inicial com algumas peças de exemplo
  const [pecas, setPecas] = useState([
    {
      id: 1,
      nome: 'Induzido 110V',
      codigo: 'IND-850',
      modeloMaquina: 'Esmerilhadeira Bosch GWS 850',
      quantidade: 2,
      preco: 45.00
    },
    {
      id: 2,
      nome: 'Carcaça do Motor',
      codigo: 'CAR-012',
      modeloMaquina: 'Furadeira Makita HP1640',
      quantidade: 1,
      preco: 30.00
    }
  ])

  // Estados para pesquisa e formulário
  const [termoPesquisa, setTermoPesquisa] = useState('')
  const [novaPeca, setNovaPeca] = useState({
    nome: '', codigo: '', modeloMaquina: '', quantidade: '', preco: ''
  })

  // Estado para edição
  const [editandoId, setEditandoId] = useState(null)

  // Função para lidar com a pesquisa
  const pecasFiltradas = pecas.filter(peca =>
    peca.nome.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
    peca.codigo.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
    peca.modeloMaquina.toLowerCase().includes(termoPesquisa.toLowerCase())
  )

  // Função para adicionar nova peça
  const adicionarOuEditarPeca = (e) => {
    e.preventDefault()
    if (!novaPeca.nome || !novaPeca.codigo) return // Validação simples

    if (editandoId) {
      // Editar peça existente
      setPecas(pecas.map(peca =>
        peca.id === editandoId
          ? { ...peca, ...novaPeca, quantidade: parseInt(novaPeca.quantidade) || 0, preco: parseFloat(novaPeca.preco) || 0 }
          : peca
      ))
      setEditandoId(null)
    } else {
      // Adicionar nova peça
      const pecaParaAdicionar = {
        ...novaPeca,
        id: Date.now(),
        quantidade: parseInt(novaPeca.quantidade) || 0,
        preco: parseFloat(novaPeca.preco) || 0
      }
      setPecas([...pecas, pecaParaAdicionar])
    }

    // Limpa o formulário
    setNovaPeca({ nome: '', codigo: '', modeloMaquina: '', quantidade: '', preco: '' })
  }

  // Função para iniciar edição
  const editarPeca = (peca) => {
    setNovaPeca({
      nome: peca.nome,
      codigo: peca.codigo,
      modeloMaquina: peca.modeloMaquina,
      quantidade: peca.quantidade,
      preco: peca.preco
    })
    setEditandoId(peca.id)
  }

  // Função para excluir peça
  const excluirPeca = (id) => {
    setPecas(pecas.filter(peca => peca.id !== id))
  }

  return (
    <div className="container">
      <header>
        <h1>Controle de Peças de Reposição</h1>
      </header>

      <main>
        {/* Seção de Adicionar Peça */}
        <section className="painel-cadastro">
          <h2>Cadastrar Nova Peça</h2>
          <form onSubmit={adicionarOuEditarPeca} className="form-grid">
            <input type="text" placeholder="Nome da Peça" value={novaPeca.nome} onChange={e => setNovaPeca({ ...novaPeca, nome: e.target.value })} required />
            <input type="text" placeholder="Código Interno" value={novaPeca.codigo} onChange={e => setNovaPeca({ ...novaPeca, codigo: e.target.value })} required />
            <input type="text" placeholder="Ferramenta/Modelo (Origem)" value={novaPeca.modeloMaquina} onChange={e => setNovaPeca({ ...novaPeca, modeloMaquina: e.target.value })} />
            <input type="number" placeholder="Quantidade" value={novaPeca.quantidade} onChange={e => setNovaPeca({ ...novaPeca, quantidade: e.target.value })} />
            <input type="number" step="0.01" placeholder="Preço (R$)" value={novaPeca.preco} onChange={e => setNovaPeca({ ...novaPeca, preco: e.target.value })} />
            <button type="submit" className="btn-salvar">{editandoId ? 'Salvar Edição' : 'Salvar Peça'}</button>
          </form>
        </section>

        {/* Seção de Pesquisa e Listagem */}
        <section className="painel-estoque">
          <div className="cabecalho-estoque">
            <h2>Estoque Atual</h2>
            <input
              type="search"
              placeholder="Pesquisar por nome, código ou máquina..."
              value={termoPesquisa}
              onChange={e => setTermoPesquisa(e.target.value)}
              className="input-pesquisa"
            />
          </div>

          <div className="tabela-container">
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nome</th>
                  <th>Máquina Origem</th>
                  <th>Qtd</th>
                  <th>Preço</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pecasFiltradas.map(peca => (
                  <tr key={peca.id}>
                    <td><strong>{peca.codigo}</strong></td>
                    <td>{peca.nome}</td>
                    <td>{peca.modeloMaquina}</td>
                    <td>{peca.quantidade}</td>
                    <td>R$ {peca.preco.toFixed(2)}</td>
                    <td>
                      <button className="btn-editar" onClick={() => editarPeca(peca)}>Editar</button>
                      <button className="btn-excluir" onClick={() => excluirPeca(peca.id)}>Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pecasFiltradas.length === 0 && <p className="msg-vazio">Nenhuma peça encontrada.</p>}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App