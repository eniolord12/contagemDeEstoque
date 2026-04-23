import { useState } from 'react'
import './App.css'

function App() {
  // Estado inicial com algumas peças de exemplo
  const [pecas, setPecas] = useState([
    {
      id: 1,
      nome: 'Induzido 110V',
      codigo: 'IND-850',
      marca: 'Bosch',
      quantidade: 2,
      preco: 45.00
    },
    {
      id: 2,
      nome: 'Carcaça do Motor',
      codigo: 'CAR-012',
      marca: 'Makita',
      quantidade: 1,
      preco: 30.00
    }
  ])

  // Estados para pesquisa e formulário
  const [termoPesquisa, setTermoPesquisa] = useState('')
  const [novaPeca, setNovaPeca] = useState({
    id: '',
    nome: '',
    codigo: '',
    quantidade: '',
    preco: '',
    marca: ''
  })

  // Estado para edição
  const [editandoId, setEditandoId] = useState(null)

  // Função para lidar com a pesquisa
  const pecasFiltradas = pecas.filter(peca => {
    const termo = termoPesquisa.toLowerCase();
    return (
      String(peca.id).toLowerCase().includes(termo) ||
      peca.nome.toLowerCase().includes(termo) ||
      peca.codigo.toLowerCase().includes(termo) ||
      (peca.marca && peca.marca.toLowerCase().includes(termo))
    );
  });

  // Função para adicionar nova peça
  const adicionarOuEditarPeca = (e) => {
    e.preventDefault()
    if (!novaPeca.nome || !novaPeca.codigo) return // Validação simples

    if (editandoId) {
      setPecas(pecas.map(peca =>
        peca.id === editandoId
          ? { ...peca, ...novaPeca, id: editandoId, quantidade: parseInt(novaPeca.quantidade) || 0, preco: parseFloat(novaPeca.preco) || 0 }
          : peca
      ))
      setEditandoId(null)
    } else {
      const pecaParaAdicionar = {
        ...novaPeca,
        id: Date.now(),
        quantidade: parseInt(novaPeca.quantidade) || 0,
        preco: parseFloat(novaPeca.preco) || 0
      }
      setPecas([...pecas, pecaParaAdicionar])
    }

    setNovaPeca({ id: '', nome: '', codigo: '', quantidade: '', preco: '', marca: '' })
  }

  // Função para iniciar edição
  const editarPeca = (peca) => {
    setNovaPeca({
      id: peca.id,
      nome: peca.nome,
      codigo: peca.codigo,
      quantidade: peca.quantidade,
      preco: peca.preco,
      marca: peca.marca || ''
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
            <input type="text" placeholder="ID" value={novaPeca.id} onChange={e => setNovaPeca({ ...novaPeca, id: e.target.value })} disabled={!!editandoId} />
            <input type="text" placeholder="Nome" value={novaPeca.nome} onChange={e => setNovaPeca({ ...novaPeca, nome: e.target.value })} required />
            <input type="text" placeholder="Código" value={novaPeca.codigo} onChange={e => setNovaPeca({ ...novaPeca, codigo: e.target.value })} required />
            <input type="number" placeholder="Qtd" value={novaPeca.quantidade} onChange={e => setNovaPeca({ ...novaPeca, quantidade: e.target.value })} />
            <input type="number" step="0.01" placeholder="Preço (R$)" value={novaPeca.preco} onChange={e => setNovaPeca({ ...novaPeca, preco: e.target.value })} />
            <input type="text" placeholder="Marca" value={novaPeca.marca} onChange={e => setNovaPeca({ ...novaPeca, marca: e.target.value })} />
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
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Código</th>
                  <th>Qtd</th>
                  <th>Preço</th>
                  <th>Marca</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pecasFiltradas.map(peca => (
                  <tr key={peca.id}>
                    <td><strong>{peca.id}</strong></td>
                    <td>{peca.nome}</td>
                    <td>{peca.codigo}</td>
                    <td>{peca.quantidade}</td>
                    <td>R$ {peca.preco.toFixed(2)}</td>
                    <td>{peca.marca}</td>
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